export type Element = {
  id: number
  specialNote?: string
  imageUrl: string
  revealed: boolean

  background: string
  glow: string
  special: string
  ears: string
  base: string
  torso: string
  eyes: string
  mouth: string
  mouth_acc: string
  ear_acc: string
  hat: string
  bar: string
}

export const categories = [
  'background',
  'glow',
  'special',
  'ears',
  'base',
  'torso',
  'eyes',
  'mouth',
  'mouth_acc',
  'ear_acc',
  'hat',
  'bar'
] as const

export type TraitRarity = { count: number; totalPercent: number; score: number }
export type CategoryRarity = { [trait: string]: TraitRarity }
export type ElementRarity = { score: number; rank: number }
export type ElementsRarity = {
  elements: { [id: number]: ElementRarity }
  categories: { [category: string]: CategoryRarity }
  traitsAmountRarity: { [traitsCount: string]: { count: number; percent: number } }
}

export type ElementTraitInfo = TraitRarity & { name: string }
export type ElementWithRarity = Element & {
  rarity: ElementRarity & {
    traits: {
      background: ElementTraitInfo
      glow: ElementTraitInfo
      special: ElementTraitInfo
      ears: ElementTraitInfo
      base: ElementTraitInfo
      torso: ElementTraitInfo
      eyes: ElementTraitInfo
      mouth: ElementTraitInfo
      mouth_acc: ElementTraitInfo
      ear_acc: ElementTraitInfo
      hat: ElementTraitInfo
      bar: ElementTraitInfo
    }
  }
}
