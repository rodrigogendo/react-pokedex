const samplePokemon = [
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
  { id: 7, name: 'Squirtle' },
  { id: 25, name: 'Pikachu' },
]

export function PokedexScreen() {
  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-lg border-4 border-pokedex-red bg-white px-6 py-8 shadow-[8px_8px_0_var(--color-pokedex-red-dark)] sm:px-8">
      <div className="mb-6">
        <p className="font-pixel text-xs uppercase tracking-[0.18em] text-pokedex-red-dark">
          Pokédex
        </p>
        <h2 className="mt-3 text-3xl font-bold text-pokedex-ink">Pokémon roster</h2>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {samplePokemon.map(({ id, name }) => (
          <button
            key={id}
            type="button"
            className="flex items-center justify-between rounded-xl border-2 border-pokedex-red bg-pokedex-paper px-4 py-3 text-left transition-transform hover:-translate-y-0.5"
          >
            <span className="text-sm font-bold uppercase tracking-[0.14em] text-pokedex-red-dark">
              #{String(id).padStart(3, '0')}
            </span>
            <span className="text-lg font-bold text-pokedex-ink">{name}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
