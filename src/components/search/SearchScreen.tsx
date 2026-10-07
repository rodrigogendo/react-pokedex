export function SearchScreen() {
  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-lg border-4 border-pokedex-red bg-white px-6 py-8 shadow-[8px_8px_0_var(--color-pokedex-red-dark)] sm:px-8">
      <div className="mb-6">
        <p className="font-pixel text-xs uppercase tracking-[0.18em] text-pokedex-red-dark">
          Search
        </p>
        <h2 className="mt-3 text-3xl font-bold text-pokedex-ink">Find Pokémon</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block rounded-xl border-2 border-pokedex-red bg-pokedex-paper p-4">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">
            Search by name
          </span>
          <input
            type="text"
            placeholder="e.g. pikachu"
            className="w-full rounded-lg border-2 border-transparent bg-white px-3 py-2 text-base text-pokedex-ink outline-none transition focus:border-pokedex-red"
          />
        </label>

        <label className="block rounded-xl border-2 border-pokedex-red bg-pokedex-paper p-4">
          <span className="mb-2 block text-sm font-bold uppercase tracking-[0.12em] text-pokedex-red-dark">
            Search for Types
          </span>
          <input
            type="text"
            placeholder="e.g. fire"
            className="w-full rounded-lg border-2 border-transparent bg-white px-3 py-2 text-base text-pokedex-ink outline-none transition focus:border-pokedex-red"
          />
        </label>
      </div>
    </section>
  )
}
