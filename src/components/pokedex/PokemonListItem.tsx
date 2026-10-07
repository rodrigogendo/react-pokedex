import type { PokemonSummary } from '../../types/pokemon'

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
      className={`flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-150 hover:-translate-y-0.5 ${
        isSelected
          ? 'border-pokedex-red bg-pokedex-red text-white shadow-[4px_4px_0_var(--color-pokedex-red-dark)]'
          : 'border-pokedex-red bg-pokedex-paper text-pokedex-ink'
      }`}
    >
      <div className="flex items-center gap-3">
        {pokemon.imageUrl ? (
          <img
            src={pokemon.imageUrl}
            alt={pokemon.name}
            className="h-12 w-12 rounded-lg bg-white object-contain p-1"
          />
        ) : (
          <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-xs font-bold uppercase text-pokedex-red-dark">
            #{String(pokemon.id).padStart(3, '0')}
          </span>
        )}

        <div>
          <span
            className={`block text-xs font-bold uppercase tracking-[0.14em] ${
              isSelected ? 'text-white/90' : 'text-pokedex-red-dark'
            }`}
          >
            #{String(pokemon.id).padStart(3, '0')}
          </span>
          <span className="block text-lg font-bold capitalize">{pokemon.name}</span>
        </div>
      </div>

      <span className={`text-xs font-bold uppercase tracking-[0.12em] ${isSelected ? 'text-white' : 'text-pokedex-red-dark'}`}>
        {isSelected ? 'Selected' : 'View'}
      </span>
    </button>
  )
}
