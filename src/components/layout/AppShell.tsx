export function AppShell() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-8 sm:py-16">
      <section className="mx-auto flex min-h-[min(70vh,40rem)] max-w-5xl items-center justify-center rounded-lg border-4 border-pokedex-red bg-white px-6 py-12 shadow-[8px_8px_0_var(--color-pokedex-red-dark)] sm:px-12">
        <div className="max-w-xl text-center">
          <p className="font-pixel text-xs uppercase tracking-[0.18em] text-pokedex-red-dark">
            Field guide
          </p>
          <h1 className="mt-5 text-3xl font-bold sm:text-5xl">Pokédex</h1>
          <p className="mt-4 text-base leading-7 text-pokedex-muted sm:text-lg">
            Your field guide to the world of Pokémon.
          </p>
        </div>
      </section>
    </main>
  )
}