import { argv, fs } from 'zx'
import type { Anon, AnonWithRarity, AnonsRarity, CategoryRarity, TraitRarity } from './types'

const getTraits = async (category: string): Promise<string[]> => fs.readJson(`_input_traits_${category}.json`)

const getAnons = async (): Promise<Anon[]> => fs.readJson('_input_anons.json')

const pad = (n, l = 3) => (n + '').padStart(l, ' ')
const percent = (a, b) => (a / b) * 100
const percentStr = (r, p = 5) => `${pad(r.toFixed(2), p)} %`

const [background, glow, special, ears, base, torso, eyes, mouth, mouth_acc, ear_acc, hat, bar] = await Promise.all([
  getTraits('background'),
  getTraits('glow'),
  getTraits('special'),
  getTraits('ears'),
  getTraits('base'),
  getTraits('torso'),
  getTraits('eyes'),
  getTraits('mouth'),
  getTraits('mouth_acc'),
  getTraits('ear_acc'),
  getTraits('hat'),
  getTraits('bar')
])
const traits = { background, glow, special, ears, base, torso, eyes, mouth, mouth_acc, ear_acc, hat, bar }
const traitsCategories = Object.keys(traits)

const anons = await getAnons()
// console.log(anons)

// Replace anons null traits with "None"
anons.forEach(anon =>
  traitsCategories.forEach(category => {
    if (anon[category] === null) anon[category] = 'none'
  })
)
// Add "None" traits to categories
traitsCategories.forEach(category => traits[category].push('none'))

const rarity: AnonsRarity = {} as any

// Traits rarity
rarity.categories = Object.entries(traits).reduce<Record<string, CategoryRarity>>((acc, [category, traits]) => {
  const traitsCounts = traits.reduce<Record<string, number>>((tacc, trait) => {
    tacc[trait] = anons.filter(anon => anon[category] === trait).length
    return tacc
  }, {})

  acc[category] = Object.entries(traitsCounts).reduce<Record<string, TraitRarity>>((tacc, [trait, traitCount]) => {
    tacc[trait] = {
      count: traitCount,
      totalPercent: percent(traitCount, anons.length),
      score: 1 / (traitCount / anons.length)
    }
    return tacc
  }, {})
  return acc
}, {})

// Anons rarity
// Compute scores https://raritytools.medium.com/ranking-rarity-understanding-rarity-calculation-methods-86ceaeb9b98c
const scores = anons.reduce<Record<string, number>>((acc, anon) => {
  acc[anon.id] = traitsCategories.reduce<number>((acc, category) => {
    if (!!anon[category]) return acc + rarity.categories[category][anon[category]].score
    else return acc
  }, 0)
  return acc
}, {})
// Compute rank
rarity.anons = Object.fromEntries(
  Object.entries(scores)
    .sort(([, ascore], [, bscore]) => bscore - ascore)
    .map(([id, score], i) => [id, { score, rank: i + 1 }])
)
// console.log(scores)
// console.log(rarity.anons)

// Traits count rarity (bonus, not counted in scores)
const countTraits = (anon: Anon) => {
  return traitsCategories.reduce((acc, category) => (!!anon[category] && anon[category] !== 'none' ? ++acc : acc), 0)
}
rarity.traitsAmountRarity = anons.reduce((acc, anon) => {
  const count = countTraits(anon)
  if (count in acc) acc[count].count++
  else acc[count] = { count: 1 }
  return acc
}, {})
Object.entries(rarity.traitsAmountRarity).forEach(
  ([amount, { count }]) => (rarity.traitsAmountRarity[amount].percent = percent(count, anons.length))
)
// console.dir(rarity, { depth: null })

// Merge
const anonsWithRarity: AnonWithRarity[] = anons.map(anon => {
  const res: AnonWithRarity = { ...anon } as any
  res.rarity = {
    ...rarity.anons[anon.id],
    traits: {
      background: { ...rarity.categories.background[anon.background], name: anon.background },
      glow: { ...rarity.categories.glow[anon.glow], name: anon.glow },
      special: { ...rarity.categories.special[anon.special], name: anon.special },
      ears: { ...rarity.categories.ears[anon.ears], name: anon.ears },
      base: { ...rarity.categories.base[anon.base], name: anon.base },
      torso: { ...rarity.categories.torso[anon.torso], name: anon.torso },
      eyes: { ...rarity.categories.eyes[anon.eyes], name: anon.eyes },
      mouth: { ...rarity.categories.mouth[anon.mouth], name: anon.mouth },
      mouth_acc: { ...rarity.categories.mouth_acc[anon.mouth_acc], name: anon.mouth_acc },
      ear_acc: { ...rarity.categories.ear_acc[anon.ear_acc], name: anon.ear_acc },
      hat: { ...rarity.categories.hat[anon.hat], name: anon.hat },
      bar: { ...rarity.categories.bar[anon.bar], name: anon.bar }
    }
  }
  return res
})

// Save as files
if (argv.out) {
  await fs.writeJSON('_output_anonsNullTraitsAsNone.json', anons, { spaces: 2 })
  await fs.writeJSON('_output_rarity.json', rarity, { spaces: 2 })
  await fs.writeJSON('_output_anonsWithRarity.json', anonsWithRarity, { spaces: 2 })
}

// Log JSON
if (argv.json) {
  console.log(JSON.stringify(anonsWithRarity, null, 2))
  process.exit(0)
}

console.log(`Total Minted Anons: ${anons.length}`)
console.log()

console.log('Traits rarity:\n')
Object.entries(rarity.categories).forEach(([categoryName, categoryRarity]) => {
  console.log(`${categoryName}`)

  Object.entries(categoryRarity).forEach(([trait, { count, totalPercent }]) =>
    console.log(`  ${pad(count)} of ${anons.length} - ${percentStr(totalPercent)} - ${trait}`)
  )
  console.log()
})

console.log()
console.log('Traits Amount Rarity:')
// console.log(rarity.traitsAmountRarity)
Object.entries(rarity.traitsAmountRarity).forEach(([amount, { count, percent }]) =>
  console.log(`  ${amount} traits: ${pad(count)} of ${anons.length} - ${percentStr(percent)}`)
)

console.log()
console.log()
const logAnon = (id, score, rank) =>
  console.log(
    `  ${pad(id, 3)}: Ranked ${pad(rank, 3)} of ${anons.length} - ` +
      `score ${pad(score.toFixed(8), 12)} - https://www.anons.army/anon/${id}`
  )
console.log('Anons Rarity Score:')
Object.entries(rarity.anons).forEach(([id, { score, rank }]) => logAnon(id, score, rank))

console.log()
console.log()
console.log('Anons Rarity Score (sorted):')
Object.entries(rarity.anons)
  .sort((a, b) => b[1].score - a[1].score)
  .forEach(([id, { score, rank }]) => logAnon(id, score, rank))
