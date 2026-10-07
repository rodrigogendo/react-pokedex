import { useState } from 'react'

import { fetchPokemonByName, fetchPokemonByType } from '../../api/pokemonApi'
import type { PokemonDetail, PokemonSummary } from '../../types/pokemon'
import { PokemonDetailCard } from '../pokedex/PokemonDetailCard'

type SearchStatus = 'idle' | 'loading' | 'error' | 'success'

export function SearchScreen() {
  const [nameQuery, setNameQuery] = useState('')
  const [typeQuery, setTypeQuery] = useState('')
  const [nameResult, setNameResult] = useState<PokemonDetail | null>(null)
  const [typeResults, setTypeResults] = useState<PokemonSummary[]>([])
  const [nameStatus, setNameStatus] = useState<SearchStatus>('idle')
  const [typeStatus, setTypeStatus] = useState<SearchStatus>('idle')
  const [nameError, setNameError] = useState('')
  const [typeError, setTypeError] = useState('')

  const handleNameSearch = async (event: React.FormEvent<HTMLFormElement>) => {
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

  const handleTypeSearch = async (event: React.FormEvent<HTMLFormElement>) => {
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
        <form onSubmit={handleNameSearch} className="rounded-xl border-2 border-pokedex-red bg-pokedex-paper p-4">
          <label htmlFor="pokemon-name-search" className="mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">
            Search by name
          </label>
          <input
            id="pokemon-name-search"
            type="text"
            value={nameQuery}
            onChange={(event) => setNameQuery(event.target.value)}
            placeholder="e.g. pikachu"
            className="w-full rounded-lg border-2 border-transparent bg-white px-3 py-2 text-base text-pokedex-ink outline-none transition focus:border-pokedex-red"
          />
          <button
            type="submit"
            className="mt-3 rounded-full border-2 border-pokedex-red bg-pokedex-red px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pokedex-red-dark"
          >
            Search Pokémon
          </button>
          {nameStatus === 'loading' && (
            <p className="mt-3 text-sm text-pokedex-red-dark">Looking for that Pokémon...</p>
          )}
          {nameStatus === 'error' && nameError && (
            <p className="mt-3 text-sm font-bold text-pokedex-red-dark">{nameError}</p>
          )}
        </form>

        <form onSubmit={handleTypeSearch} className="rounded-xl border-2 border-pokedex-red bg-pokedex-paper p-4">
          <label htmlFor="pokemon-type-search" className="mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">
            Search for Types
          </label>
          <input
            id="pokemon-type-search"
            type="text"
            value={typeQuery}
            onChange={(event) => setTypeQuery(event.target.value)}
            placeholder="e.g. fire"
            className="w-full rounded-lg border-2 border-transparent bg-white px-3 py-2 text-base text-pokedex-ink outline-none transition focus:border-pokedex-red"
          />
          <button
            type="submit"
            className="mt-3 rounded-full border-2 border-pokedex-red bg-pokedex-red px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pokedex-red-dark"
          >
            Search type
          </button>
          {typeStatus === 'loading' && (
            <p className="mt-3 text-sm text-pokedex-red-dark">Checking that type...</p>
          )}
          {typeStatus === 'error' && typeError && (
            <p className="mt-3 text-sm font-bold text-pokedex-red-dark">{typeError}</p>
          )}
        </form>
      </div>

      {nameResult && <PokemonDetailCard pokemon={nameResult} />}

      {typeResults.length > 0 && (
        <div className="mt-6 rounded-xl border-2 border-pokedex-red bg-pokedex-paper p-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-pokedex-red-dark">
            Type results
          </h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {typeResults.map(({ id, name, imageUrl }) => (
              <li key={id} className="rounded-xl border-2 border-pokedex-red bg-white p-3">
                {imageUrl ? <img src={imageUrl} alt={name} className="mx-auto h-16 w-16 object-contain" /> : null}
                <p className="mt-2 text-center text-lg font-bold capitalize text-pokedex-ink">{name}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
