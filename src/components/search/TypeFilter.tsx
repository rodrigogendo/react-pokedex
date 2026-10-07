import type { TypeFilterProps } from '../../types/search'
import { pokemonTypes } from '../../types/search'
import { PokemonList } from '../pokedex/PokemonList'

export function TypeFilter({
  selectedType,
  status,
  error,
  results,
  selectedPokemonId,
  selectedPokemon,
  onFormSelect,
  onTypeSelect,
  onPokemonSelect,
}: TypeFilterProps) {
  return (
    <section className="mt-6">
      <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">
        Filter by Type
      </h3>
      <div role="group" aria-label="Filter by Type" className="mt-3 flex flex-wrap gap-2">
        {pokemonTypes.map((typeName) => {
          const isSelected = selectedType === typeName

          return (
            <button
              key={typeName}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onTypeSelect(typeName)}
              className={`rounded-md border-2 px-3 py-1.5 text-xs font-bold capitalize transition ${
                isSelected
                  ? 'border-pokedex-red bg-pokedex-red text-white'
                  : 'border-pokedex-red bg-pokedex-paper text-pokedex-red-dark hover:bg-white'
              }`}
            >
              {typeName}
            </button>
          )
        })}
      </div>

      {status === 'loading' && (
        <p className="mt-3 text-sm text-pokedex-red-dark">Checking that type...</p>
      )}

      {status === 'error' && error && (
        <p className="mt-3 text-sm font-bold text-pokedex-red-dark">{error}</p>
      )}

      {status === 'success' && results.length === 0 && (
        <p className="mt-3 text-sm font-bold text-pokedex-red-dark">
          No Pokémon matched that type. Try a different filter.
        </p>
      )}

      {status === 'success' && results.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-pokedex-red-dark">
            Type results
          </h4>
          <PokemonList
            pokemon={results}
            selectedId={selectedPokemonId}
            selectedPokemon={selectedPokemon}
            status="ready"
            errorMessage=""
            onSelect={onPokemonSelect}
            onFormSelect={onFormSelect}
          />
        </div>
      )}
    </section>
  )
}