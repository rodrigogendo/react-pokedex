type NavItem = {
  label: string
  isActive?: boolean
}

const navItems: NavItem[] = [
  { label: 'Home', isActive: true },
  { label: 'Pokédex' },
  { label: 'Search' },
]

export function TopNav() {
  return (
    <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 rounded-lg border-2 border-pokedex-red bg-white px-3 py-3 shadow-[4px_4px_0_var(--color-pokedex-red-dark)] sm:px-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-3 w-3 rounded-full bg-pokedex-red" aria-hidden="true" />
        <span className="font-pixel text-[10px] uppercase tracking-[0.2em] text-pokedex-red-dark">
          Pokédex
        </span>
      </div>

      <ul className="flex flex-wrap items-center justify-end gap-2 text-sm font-bold text-pokedex-ink sm:gap-3">
        {navItems.map(({ label, isActive }) => (
          <li key={label}>
            <button
              type="button"
              className={`rounded-full border-2 px-3 py-1.5 transition-colors ${
                isActive
                  ? 'border-pokedex-red bg-pokedex-red text-white'
                  : 'border-transparent bg-pokedex-paper text-pokedex-ink hover:border-pokedex-red hover:text-pokedex-red-dark'
              }`}
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
