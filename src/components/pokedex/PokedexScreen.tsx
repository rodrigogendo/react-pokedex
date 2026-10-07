import { useEffect, useState } from 'react'

import { fetchPokemonPage } from '../../api/pokemonApi'
import type { PokemonSummary } from '../../types/pokemon'
import { PokemonDetailCard } from './PokemonDetailCard'
import { PokemonList } from './PokemonList'
import { PokemonPagination } from './PokemonPagination'

const PAGE_SIZE = 100

export function PokedexScreen() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)

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
          if (items.some(({ id }) => id === currentSelectedId)) {
            return currentSelectedId
          }

          return items[0]?.id ?? null
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

  const selectedPokemon = pokemon.find(({ id }) => id === selectedId) ?? null
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-lg border-4 border-pokedex-red bg-white px-6 py-8 shadow-[8px_8px_0_var(--color-pokedex-red-dark)] sm:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-pixel text-xs uppercase tracking-[0.18em] text-pokedex-red-dark">
            Pokédex
          </p>
          <h2 className="mt-3 text-3xl font-bold text-pokedex-ink">Pokémon roster</h2>
        </div>

        <p className="text-sm font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">
          Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, totalCount)} / {totalCount}
        </p>
      </div>

      <PokemonPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <PokemonList
        pokemon={pokemon}
        selectedId={selectedId}
        status={status}
        errorMessage={errorMessage}
        onSelect={setSelectedId}
      />

      <div className="mt-6">
        <PokemonPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {selectedPokemon && status === 'ready' && (
        <div className="mt-6">
          <p className="font-pixel text-[10px] uppercase tracking-[0.18em] text-pokedex-red-dark">
            Selected Pokémon
          </p>
          <PokemonDetailCard
            pokemon={{
              ...selectedPokemon,
              baseExperience: null,
              height: 0,
              weight: 0,
              stats: {
                hp: 0,
                attack: 0,
                defense: 0,
                specialAttack: 0,
                specialDefense: 0,
                speed: 0,
              },
            }}
          />
        </div>
      )}
    </section>
  )
}
