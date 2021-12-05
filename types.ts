export type Anon = {
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

export type TraitRarity = { count: number; totalPercent: number; score: number }
export type CategoryRarity = { [trait: string]: TraitRarity }
export type AnonRarity = { score: number; rank: number }
export type AnonsRarity = {
  anons: { [id: number]: AnonRarity }
  categories: { [category: string]: CategoryRarity }
  traitsAmountRarity: { [traitsCount: string]: { count: number; percent: number } }
}

export type AnonTraitInfo = TraitRarity & { name: string }
export type AnonWithRarity = Anon & {
  rarity: AnonRarity & {
    traits: {
      background: AnonTraitInfo
      glow: AnonTraitInfo
      special: AnonTraitInfo
      ears: AnonTraitInfo
      base: AnonTraitInfo
      torso: AnonTraitInfo
      eyes: AnonTraitInfo
      mouth: AnonTraitInfo
      mouth_acc: AnonTraitInfo
      ear_acc: AnonTraitInfo
      hat: AnonTraitInfo
      bar: AnonTraitInfo
    }
  }
}
