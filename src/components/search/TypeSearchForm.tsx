import type { TypeSearchFormProps } from '../../types/search'

export function TypeSearchForm({
  query,
  status,
  error,
  results,
  onQueryChange,
  onSubmit,
}: TypeSearchFormProps) {
  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="rounded-xl border-2 border-pokedex-red bg-pokedex-paper p-4"
      >
        <label
          htmlFor="pokemon-type-search"
          className="mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-pokedex-red-dark"
        >
          Search for Types
        </label>
        <input
          id="pokemon-type-search"
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="e.g. fire"
          className="w-full rounded-lg border-2 border-transparent bg-white px-3 py-2 text-base text-pokedex-ink outline-none transition focus:border-pokedex-red"
        />
        <button
          type="submit"
          className="mt-3 rounded-full border-2 border-pokedex-red bg-pokedex-red px-4 py-2 text-sm font-bold uppercase tracking-[0.12em] text-white transition hover:bg-pokedex-red-dark"
        >
          Search type
        </button>

        {status === 'loading' && (
          <p className="mt-3 text-sm text-pokedex-red-dark">Checking that type...</p>
        )}

        {status === 'error' && error && (
          <p className="mt-3 text-sm font-bold text-pokedex-red-dark">{error}</p>
        )}
      </form>

      {results.length > 0 && (
        <div className="mt-6 rounded-xl border-2 border-pokedex-red bg-pokedex-paper p-4">
          <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-pokedex-red-dark">
            Type results
          </h3>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map(({ id, name, imageUrl }) => (
              <li key={id} className="rounded-xl border-2 border-pokedex-red bg-white p-3">
                {imageUrl ? (
                  <img src={imageUrl} alt={name} className="mx-auto h-16 w-16 object-contain" />
                ) : null}
                <p className="mt-2 text-center text-lg font-bold capitalize text-pokedex-ink">
                  {name}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
