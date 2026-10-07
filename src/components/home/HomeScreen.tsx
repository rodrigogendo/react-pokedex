export function HomeScreen() {
  return (
    <section className="mx-auto mt-8 w-full max-w-5xl rounded-lg border-4 border-pokedex-red bg-white px-6 py-12 shadow-[8px_8px_0_var(--color-pokedex-red-dark)] sm:px-12">
      <div className="max-w-xl text-center md:mx-auto">
        <p className="font-pixel text-xs uppercase tracking-[0.18em] text-pokedex-red-dark">
          Field guide
        </p>
        <h1 className="mt-5 text-3xl font-bold sm:text-5xl">Welcome to the Pokédex App</h1>
        <p className="mt-4 text-base leading-7 text-pokedex-muted sm:text-lg">
          Explore the world of Pokémon with a comprehensive Pokédex.
        </p>
      </div>
    </section>
  )
}
