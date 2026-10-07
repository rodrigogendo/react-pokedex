import { useState, type FormEvent } from 'react'

import { fetchPokemonByName, fetchPokemonByType } from '../../api/pokemonApi'
import type { PokemonDetail, PokemonSummary } from '../../types/pokemon'
import type { SearchStatus } from '../../types/search'
import { NameSearchForm } from './NameSearchForm'
import { TypeSearchForm } from './TypeSearchForm'

export function SearchScreen() {
  const [nameQuery, setNameQuery] = useState('')
  const [typeQuery, setTypeQuery] = useState('')
  const [nameResult, setNameResult] = useState<PokemonDetail | null>(null)
  const [typeResults, setTypeResults] = useState<PokemonSummary[]>([])
  const [nameStatus, setNameStatus] = useState<SearchStatus>('idle')
  const [typeStatus, setTypeStatus] = useState<SearchStatus>('idle')
  const [nameError, setNameError] = useState('')
  const [typeError, setTypeError] = useState('')

  const handleNameSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedQuery = nameQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      setNameStatus('error')
      setNameError('Please enter a Pokémon name to search.')
      setNameResult(null)
      return
    }

    setNameStatus('loading')
    setNameError('')

    try {
      const result = await fetchPokemonByName(normalizedQuery)
      setNameResult(result)
      setNameStatus('success')
    } catch (error) {
      setNameResult(null)
      setNameStatus('error')
      setNameError(error instanceof Error ? error.message : 'No Pokémon found for that search.')
    }
  }

  const handleTypeSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedQuery = typeQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      setTypeStatus('error')
      setTypeError('Please enter a Pokémon type to search.')
      setTypeResults([])
      return
    }

    setTypeStatus('loading')
    setTypeError('')

    try {
      const results = await fetchPokemonByType(normalizedQuery)
      setTypeResults(results)
      setTypeStatus(results.length ? 'success' : 'error')

      if (!results.length) {
        setTypeError('No Pokémon were found for that type.')
      }
    } catch (error) {
      setTypeResults([])
      setTypeStatus('error')
      setTypeError(error instanceof Error ? error.message : 'No Pokémon were found for that type.')
    }
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-lg border-4 border-pokedex-red bg-white px-6 py-8 shadow-[8px_8px_0_var(--color-pokedex-red-dark)] sm:px-8">
      <div className="mb-6">
        <p className="font-pixel text-xs uppercase tracking-[0.18em] text-pokedex-red-dark">Search</p>
        <h2 className="mt-3 text-3xl font-bold text-pokedex-ink">Find Pokémon</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <NameSearchForm
          query={nameQuery}
          status={nameStatus}
          error={nameError}
          result={nameResult}
          onQueryChange={setNameQuery}
          onSubmit={handleNameSearch}
        />

        <TypeSearchForm
          query={typeQuery}
          status={typeStatus}
          error={typeError}
          results={typeResults}
          onQueryChange={setTypeQuery}
          onSubmit={handleTypeSearch}
        />
      </div>
    </section>
  )
}
