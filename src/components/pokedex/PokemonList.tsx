import type { PokemonSummary } from '../../types/pokemon'
import { PokemonListItem } from './PokemonListItem'

type PokemonListStatus = 'loading' | 'ready' | 'error'

type PokemonListProps = {
  pokemon: PokemonSummary[]
  selectedId: number | null
  status: PokemonListStatus
  errorMessage: string
  onSelect: (id: number) => void
}

export function PokemonList({
  pokemon,
  selectedId,
  status,
  errorMessage,
  onSelect,
}: PokemonListProps) {
  if (status === 'loading') {
    return (
      <div className="rounded-xl border-2 border-dashed border-pokedex-red bg-pokedex-paper px-4 py-6 text-center text-base font-bold text-pokedex-red-dark">
        Loading Pokémon roster...
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="rounded-xl border-2 border-pokedex-red bg-pokedex-paper px-4 py-6 text-center text-base font-bold text-pokedex-red-dark">
        {errorMessage || 'Unable to load the Pokédex right now.'}
      </div>
    )
  }

  if (!pokemon.length) {
    return (
      <div className="rounded-xl border-2 border-pokedex-red bg-pokedex-paper px-4 py-6 text-center text-base font-bold text-pokedex-red-dark">
        No Pokémon were found in this roster.
      </div>
    )
  }

  return (
    <div className="page-shell grid gap-3 md:grid-cols-2">
      {pokemon.map((entry) => (
        <PokemonListItem
          key={entry.id}
          pokemon={entry}
          isSelected={selectedId === entry.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
