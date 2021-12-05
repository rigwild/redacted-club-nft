import { fs } from 'zx'

// A small script just to extract all traits for each categories

const elements = await fs.readJSON('_input_anons.json')

// console.log(elements)

const traitsCategories = {
  background: new Set(),
  glow: new Set(),
  special: new Set(),
  ears: new Set(),
  base: new Set(),
  torso: new Set(),
  eyes: new Set(),
  mouth: new Set(),
  mouth_acc: new Set(),
  ear_acc: new Set(),
  hat: new Set(),
  bar: new Set()
}

for (const [category, set] of Object.entries(traitsCategories)) {
  elements.forEach(element => {
    // ignore `null`
    if (element[category]) set.add(element[category])
  })

  // Export to input files
  const data = [...set].sort()
  await fs.writeJSON(`_input_traits_${category}.json`, data, { spaces: 2 })
  console.log(data)
}
