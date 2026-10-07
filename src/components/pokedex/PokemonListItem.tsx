import type { PokemonSummary } from '../../types/pokemon'
import { formatPokemonName } from '../../utils/pokemon'

type PokemonListItemProps = {
  pokemon: PokemonSummary
  isSelected: boolean
  onSelect: (id: number) => void
}

export function PokemonListItem({ pokemon, isSelected, onSelect }: PokemonListItemProps) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(pokemon.id)}
      className={`flex h-20 w-full items-center justify-between gap-3 overflow-hidden rounded-xl border-2 px-4 py-3 text-left transition-all duration-150 hover:-translate-y-0.5 ${
        isSelected
          ? 'border-pokedex-red bg-pokedex-red text-white shadow-[4px_4px_0_var(--color-pokedex-red-dark)]'
          : 'border-pokedex-red bg-pokedex-paper text-pokedex-ink'
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {pokemon.imageUrl ? (
          <img
            src={pokemon.imageUrl}
            alt={formatPokemonName(pokemon.name)}
            className="h-12 w-12 shrink-0 rounded-lg bg-white object-contain p-1"
          />
        ) : (
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white text-xs font-bold uppercase text-pokedex-red-dark">
            #{String(pokemon.dexNumber).padStart(3, '0')}
          </span>
        )}

        <div className="min-w-0 flex-1">
          <span
            className={`block text-xs font-bold uppercase tracking-[0.14em] ${
              isSelected ? 'text-white/90' : 'text-pokedex-red-dark'
            }`}
          >
            #{String(pokemon.dexNumber).padStart(3, '0')}
          </span>
          <span className="block truncate text-lg font-bold capitalize" title={formatPokemonName(pokemon.name)}>
            {formatPokemonName(pokemon.name)}
          </span>
        </div>
      </div>

      <span
        aria-label={isSelected ? 'Collapse details' : 'Expand details'}
        className={`inline-flex shrink-0 items-center justify-center text-2xl leading-none transition-transform duration-200 ${
          isSelected ? 'rotate-180 text-white' : 'text-pokedex-red-dark'
        }`}
      >
        ▾
      </span>
    </button>
  )
}
