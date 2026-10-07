import { useEffect, useState, type FormEvent } from 'react'

import { fetchPokemonByName, fetchPokemonByType } from '../../api/pokemonApi'
import type { PokemonDetail, PokemonSummary } from '../../types/pokemon'
import type { SearchStatus } from '../../types/search'
import { NameSearchForm } from './NameSearchForm'
import { TypeFilter } from './TypeFilter'

export function SearchScreen() {
  const [nameQuery, setNameQuery] = useState('')
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [nameResult, setNameResult] = useState<PokemonDetail | null>(null)
  const [typeResults, setTypeResults] = useState<PokemonSummary[]>([])
  const [selectedTypePokemonId, setSelectedTypePokemonId] = useState<number | null>(null)
  const [selectedTypePokemon, setSelectedTypePokemon] = useState<PokemonDetail | null>(null)
  const [nameStatus, setNameStatus] = useState<SearchStatus>('idle')
  const [typeStatus, setTypeStatus] = useState<SearchStatus>('idle')
  const [nameError, setNameError] = useState('')
  const [typeError, setTypeError] = useState('')

  const selectedTypeSummary = typeResults.find(({ id }) => id === selectedTypePokemonId) ?? null

  useEffect(() => {
    if (!selectedTypeSummary) {
      return
    }

    let isCurrent = true

    const loadSelectedPokemon = async () => {
      try {
        const detail = await fetchPokemonByName(selectedTypeSummary.name)

        if (isCurrent) {
          setSelectedTypePokemon(detail)
        }
      } catch {
        if (isCurrent) {
          setSelectedTypePokemon(null)
        }
      }
    }

    void loadSelectedPokemon()

    return () => {
      isCurrent = false
    }
  }, [selectedTypeSummary])

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

  const handleTypeSearch = async (typeName: string) => {
    const normalizedQuery = typeName.trim().toLowerCase()
    setSelectedType(normalizedQuery)
    setSelectedTypePokemonId(null)
    setTypeStatus('loading')
    setTypeError('')
    setTypeResults([])

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

  const handleTypePokemonSelect = (id: number) => {
    setSelectedTypePokemonId((currentId) => (currentId === id ? null : id))
  }

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-lg border-4 border-pokedex-red bg-white px-6 py-8 shadow-[8px_8px_0_var(--color-pokedex-red-dark)] sm:px-8">
      <div className="mb-6">
        <p className="font-pixel text-xs uppercase tracking-[0.18em] text-pokedex-red-dark">Search</p>
        <h2 className="mt-3 text-3xl font-bold text-pokedex-ink">Find Pokémon</h2>
      </div>

      <NameSearchForm
        query={nameQuery}
        status={nameStatus}
        error={nameError}
        result={nameResult}
        onQueryChange={setNameQuery}
        onSubmit={handleNameSearch}
      />

      <TypeFilter
        selectedType={selectedType}
        status={typeStatus}
        error={typeError}
        results={typeResults}
        selectedPokemonId={selectedTypePokemonId}
        selectedPokemon={selectedTypePokemon}
        onTypeSelect={handleTypeSearch}
        onPokemonSelect={handleTypePokemonSelect}
      />
    </section>
  )
}
