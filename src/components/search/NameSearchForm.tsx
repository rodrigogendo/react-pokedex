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
        className="rounded-xl border-2 border-pokedex-red bg-pokedex-paper p-4"
      >
        <label
          htmlFor="pokemon-name-search"
          className="mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-pokedex-red-dark"
        >
          Search by name
        </label>
        <input
          id="pokemon-name-search"
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="e.g. pikachu"
          className="w-full rounded-lg border-2 border-transparent bg-white px-3 py-2 text-base text-pokedex-ink outline-none transition focus:border-pokedex-red"
        />
        <button
          type="submit"
          className="mt-3 rounded-full border-2 border-pokedex-red bg-pokedex-red px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pokedex-red-dark"
        >
          Search Pokémon
        </button>

        {status === 'loading' && (
          <p className="mt-3 text-sm text-pokedex-red-dark">Looking for that Pokémon...</p>
        )}

        {status === 'error' && error && (
          <p className="mt-3 text-sm font-bold text-pokedex-red-dark">{error}</p>
        )}
      </form>

      {result && <PokemonDetailCard pokemon={result} />}
    </div>
  )
}
