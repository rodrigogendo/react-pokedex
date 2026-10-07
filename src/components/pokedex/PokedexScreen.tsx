import { useEffect, useState } from 'react'

import { fetchPokemonByName, fetchPokemonPage } from '../../api/pokemonApi'
import type { PokemonDetail, PokemonFormSummary, PokemonSummary } from '../../types/pokemon'
import { PokemonList } from './PokemonList'
import { PokemonPagination } from './PokemonPagination'

const PAGE_SIZE = 100

export function PokedexScreen() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetail | null>(null)
  const [selectedFormName, setSelectedFormName] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

  const handleSelect = (id: number) => {
    setSelectedFormName(null)
    setSelectedId((currentSelectedId) => (currentSelectedId === id ? null : id))
  }

  const handlePageChange = (nextPage: number) => {
    setSelectedId(null)
    setSelectedPokemon(null)
    setSelectedFormName(null)
    setPage(nextPage)
  }

  const handleFormSelect = (form: PokemonFormSummary) => {
    setSelectedFormName(form.name)
  }

  useEffect(() => {
    let isMounted = true

    const loadPokemon = async () => {
      try {
        setStatus('loading')

        const { items, totalCount: rosterCount } = await fetchPokemonPage(PAGE_SIZE, page * PAGE_SIZE)

        if (!isMounted) {
          return
        }

        setPokemon(items)
        setTotalCount(rosterCount)

        setSelectedId((currentSelectedId) => {
          if (currentSelectedId !== null && !items.some(({ id }) => id === currentSelectedId)) {
            setSelectedPokemon(null)
            setSelectedFormName(null)
            return null
          }

          return currentSelectedId
        })
        setStatus('ready')
      } catch (error) {
        if (!isMounted) {
          return
        }

        setStatus('error')
        setErrorMessage(
          error instanceof Error
            ? error.message
            : 'The Pokédex could not be loaded right now. Please try again.',
        )
      }
    }

    void loadPokemon()

    return () => {
      isMounted = false
    }
  }, [page])

  useEffect(() => {
    let isMounted = true

    const selectedSummary = pokemon.find(({ id }) => id === selectedId) ?? null

    if (!selectedSummary) {
      return
    }

    const loadSelectedPokemon = async () => {
      try {
        const detail = await fetchPokemonByName(selectedFormName ?? selectedSummary.name)

        if (!isMounted) {
          return
        }

        setSelectedPokemon(detail)
      } catch {
        if (!isMounted) {
          return
        }

        setSelectedPokemon(null)
      }
    }

    void loadSelectedPokemon()

    return () => {
      isMounted = false
    }
  }, [pokemon, selectedId, selectedFormName])

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <section className="page-shell mx-auto w-full max-w-5xl rounded-2xl border-4 border-pokedex-red bg-white px-4 py-6 shadow-[8px_8px_0_var(--color-pokedex-red-dark)] sm:px-8 sm:py-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-pixel text-xs uppercase tracking-[0.18em] text-pokedex-red-dark">
            Pokédex
          </p>
          <h2 className="mt-3 text-2xl font-bold text-pokedex-ink sm:text-3xl">Pokémon roster</h2>
        </div>

        <p className="text-xs font-bold uppercase tracking-[0.12em] text-pokedex-red-dark sm:text-sm">
          Species {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, totalCount)} / {totalCount}
        </p>
      </div>

      <PokemonPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <PokemonList
        pokemon={pokemon}
        selectedId={selectedId}
        selectedPokemon={selectedPokemon}
        status={status}
        errorMessage={errorMessage}
        onSelect={handleSelect}
        onFormSelect={handleFormSelect}
      />

      <div className="mt-6">
        <PokemonPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  )
}
