import type { FormEvent } from 'react'

import type { PokemonDetail, PokemonFormSummary, PokemonSummary } from './pokemon'

export type SearchStatus = 'idle' | 'loading' | 'error' | 'success'

export const pokemonTypes = [
  'normal',
  'fire',
  'water',
  'electric',
  'grass',
  'ice',
  'fighting',
  'poison',
  'ground',
  'flying',
  'psychic',
  'bug',
  'rock',
  'ghost',
  'dragon',
  'dark',
  'steel',
  'fairy',
] as const

export type NameSearchFormProps = {
  query: string
  status: SearchStatus
  error: string
  result: PokemonDetail | null
  onQueryChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export type TypeFilterProps = {
  selectedType: string | null
  status: SearchStatus
  error: string
  results: PokemonSummary[]
  selectedPokemonId: number | null
  selectedPokemon: PokemonDetail | null
  onFormSelect: (form: PokemonFormSummary) => void
  onTypeSelect: (typeName: string) => void
  onPokemonSelect: (id: number) => void
}
