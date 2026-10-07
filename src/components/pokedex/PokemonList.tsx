import type { PokemonDetail, PokemonFormSummary, PokemonSummary } from '../../types/pokemon'
import { PokemonDetailCard } from './PokemonDetailCard'
import { PokemonListItem } from './PokemonListItem'

type PokemonListStatus = 'loading' | 'ready' | 'error'

type PokemonListProps = {
  pokemon: PokemonSummary[]
  selectedId: number | null
  selectedPokemon: PokemonDetail | null
  status: PokemonListStatus
  errorMessage: string
  onSelect: (id: number) => void
  onFormSelect?: (form: PokemonFormSummary) => void
}

export function PokemonList({
  pokemon,
  selectedId,
  selectedPokemon,
  status,
  errorMessage,
  onSelect,
  onFormSelect,
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
    <div className="page-shell flex flex-col gap-3">
      {Array.from({ length: Math.ceil(pokemon.length / 2) }, (_, rowIndex) => {
        const rowPokemon = pokemon.slice(rowIndex * 2, rowIndex * 2 + 2)
        const selectedIndex = rowPokemon.findIndex((entry) => entry.id === selectedId)
        const expandedPokemon = rowPokemon.find(
          (entry) => entry.id === selectedId && selectedPokemon?.dexNumber === entry.dexNumber,
        )

        return (
          <div key={rowPokemon[0].id} className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {rowPokemon.map((entry, index) => (
              <div
                key={entry.id}
                className={`w-full ${
                  selectedIndex === 0 && index === 1 ? 'order-3 md:order-none' : ''
                }`}
              >
                <PokemonListItem
                  pokemon={entry}
                  isSelected={entry.id === selectedId}
                  onSelect={onSelect}
                />
              </div>
            ))}

            {expandedPokemon && selectedPokemon && (
              <div
                className={`w-full animate-[pageFadeIn_220ms_ease-out] md:col-span-2 ${
                  selectedIndex === 0 ? 'order-2 md:order-none' : ''
                }`}
              >
                <PokemonDetailCard
                  key={selectedPokemon.id}
                  pokemon={selectedPokemon}
                  baseForm={{
                    id: expandedPokemon.id,
                    name: expandedPokemon.name,
                    imageUrl: expandedPokemon.imageUrl,
                  }}
                  alternateForms={expandedPokemon.alternateForms}
                  onFormSelect={onFormSelect}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
