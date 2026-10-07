export function HomeScreen() {
  return (
    <section className="page-shell mx-auto w-full max-w-5xl rounded-2xl border-4 border-pokedex-red bg-white px-5 py-8 shadow-[8px_8px_0_var(--color-pokedex-red-dark)] sm:px-8 sm:py-10 lg:px-12">
      <div className="mx-auto max-w-2xl text-center">
        <p className="font-pixel text-[10px] uppercase tracking-[0.24em] text-pokedex-red-dark sm:text-xs">
          Field guide
        </p>
        <h1 className="mt-5 text-3xl font-bold leading-tight text-pokedex-ink sm:text-5xl">
          Welcome to the Pokédex App
        </h1>
        <p className="mt-4 text-base leading-7 text-pokedex-muted sm:text-lg">
          Explore the world of Pokémon with a comprehensive Pokédex.
        </p>
      </div>

      <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
        {[
          { label: 'Pokémon', value: '1,025+' },
          { label: 'Regions', value: '9' },
          { label: 'Tracker', value: 'Live' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border-2 border-pokedex-red bg-pokedex-paper px-4 py-3 shadow-[2px_2px_0_var(--color-pokedex-red-dark)]"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-pokedex-red-dark">
              {label}
            </p>
            <p className="mt-2 text-xl font-bold text-pokedex-ink">{value}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
