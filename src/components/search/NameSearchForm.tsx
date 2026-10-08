import type { NameSearchFormProps } from '../../types/search'
import { PokemonDetailCard } from '../pokedex/PokemonDetailCard'

export function NameSearchForm({
  query,
  status,
  error,
  result,
  onQueryChange,
  onSubmit,
}: NameSearchFormProps) {
  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border-2 border-pokedex-red bg-pokedex-paper p-4 shadow-[4px_4px_0_var(--color-pokedex-red-dark)] sm:p-5"
      >
        <label
          htmlFor="pokemon-name-search"
          className="mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-pokedex-red-dark"
        >
          Search by name
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="pokemon-name-search"
            type="text"
            maxLength={99}
            value={query}
            onChange={(event) => onQueryChange(event.target.value.slice(0, 99))}
            placeholder="e.g. pikachu"
            className="min-w-0 w-full rounded-lg border-2 border-transparent bg-white px-3 py-2 text-base text-pokedex-ink outline-none transition focus:border-pokedex-red"
          />
          <button
            type="submit"
            className="rounded-full border-2 border-pokedex-red bg-pokedex-red px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pokedex-red-dark sm:text-sm"
          >
            Search Pokémon
          </button>
        </div>

        {status === 'loading' && (
          <p className="mt-3 text-sm text-pokedex-red-dark">Looking for that Pokémon...</p>
        )}

        {status === 'error' && error && (
          <p className="mt-3 break-all text-sm font-bold text-pokedex-red-dark">{error}</p>
        )}

        {status === 'success' && !result && (
          <p className="mt-3 text-sm font-bold text-pokedex-red-dark">
            No Pokémon matched that search. Please try another name.
          </p>
        )}
      </form>

      {result && <PokemonDetailCard pokemon={result} />}
    </div>
  )
}
