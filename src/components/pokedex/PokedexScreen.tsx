import { useEffect, useState } from 'react'

import { fetchPokemonList } from '../../api/pokemonApi'
import type { PokemonSummary } from '../../types/pokemon'
import { PokemonDetailCard } from './PokemonDetailCard'
import { PokemonList } from './PokemonList'

export function PokedexScreen() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadPokemon = async () => {
      try {
        const roster = await fetchPokemonList(151)

        if (!isMounted) {
          return
        }

        setPokemon(roster)
        setSelectedId((currentSelectedId) => currentSelectedId ?? roster[0]?.id ?? null)
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
  }, [])

  const selectedPokemon = pokemon.find(({ id }) => id === selectedId) ?? null

  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-lg border-4 border-pokedex-red bg-white px-6 py-8 shadow-[8px_8px_0_var(--color-pokedex-red-dark)] sm:px-8">
      <div className="mb-6">
        <p className="font-pixel text-xs uppercase tracking-[0.18em] text-pokedex-red-dark">
          Pokédex
        </p>
        <h2 className="mt-3 text-3xl font-bold text-pokedex-ink">Pokémon roster</h2>
      </div>

      <PokemonList
        pokemon={pokemon}
        selectedId={selectedId}
        status={status}
        errorMessage={errorMessage}
        onSelect={setSelectedId}
      />

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
