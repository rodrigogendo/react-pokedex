export type PokemonSummary = {
  id: number
  name: string
}

export type PokemonType = {
  id: number
  name: string
}

export type PokemonStats = {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

export type PokemonDetail = PokemonSummary & {
  imageUrl: string | null
  types: PokemonType[]
  baseExperience: number | null
  height: number
  weight: number
  stats: PokemonStats
}