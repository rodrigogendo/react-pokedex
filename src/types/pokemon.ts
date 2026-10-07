export type PokemonType = {
  id: number
  name: string
}

export type PokemonFormSummary = {
  id: number
  name: string
  imageUrl: string | null
}

export type PokemonSummary = {
  id: number
  dexNumber: number
  name: string
  imageUrl: string | null
  types: PokemonType[]
  alternateForms?: PokemonFormSummary[]
}

export type PokemonStats = {
  hp: number
  attack: number
  defense: number
  specialAttack: number
  specialDefense: number
  speed: number
}

export type PokemonDetail = Omit<PokemonSummary, 'alternateForms'> & {
  baseExperience: number | null
  height: number
  weight: number
  stats: PokemonStats
}

export type NamedApiResource = {
  name: string
  url: string
}

export type PokemonListItem = NamedApiResource

export type PokemonListResponse = {
  count: number
  next: string | null
  previous: string | null
  results: PokemonListItem[]
}

export type PokemonListPage = {
  items: PokemonSummary[]
  totalCount: number
}

export type PokemonTypeApiEntry = {
  slot: number
  type: NamedApiResource
}

export type PokemonStatApiEntry = {
  base_stat: number
  effort: number
  stat: NamedApiResource
}

export type PokemonApiDetail = {
  id: number
  name: string
  species: NamedApiResource
  base_experience: number | null
  height: number
  weight: number
  types: PokemonTypeApiEntry[]
  stats: PokemonStatApiEntry[]
  sprites: {
    front_default: string | null
    other: {
      home: {
        front_default: string | null
      }
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
}

export type PokemonTypeDetailResponse = {
  id: number
  name: string
  pokemon: Array<{
    slot: number
    pokemon: NamedApiResource
  }>
}

export type PokemonTypeListResponse = {
  results: PokemonListItem[]
}

export type PokemonSpeciesDetailResponse = {
  id: number
  name: string
  varieties: Array<{
    is_default: boolean
    pokemon: NamedApiResource
  }>
}

export const pokemonStatLabels: Record<keyof PokemonStats, string> = {
  hp: 'HP',
  attack: 'Attack',
  defense: 'Defense',
  specialAttack: 'Special Attack',
  specialDefense: 'Special Defense',
  speed: 'Speed',
}