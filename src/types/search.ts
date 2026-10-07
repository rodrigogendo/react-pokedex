import type { FormEvent } from 'react'

import type { PokemonDetail, PokemonSummary } from './pokemon'

export type SearchStatus = 'idle' | 'loading' | 'error' | 'success'

export type NameSearchFormProps = {
  query: string
  status: SearchStatus
  error: string
  result: PokemonDetail | null
  onQueryChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export type TypeSearchFormProps = {
  query: string
  status: SearchStatus
  error: string
  results: PokemonSummary[]
  onQueryChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}
