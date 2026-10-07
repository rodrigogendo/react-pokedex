import type { NavItem, ScreenName } from '../../types/navigation'

type TopNavProps = {
  items: NavItem[]
  activeScreen: ScreenName
  onNavigate: (screen: ScreenName) => void
}

export function TopNav({ items, activeScreen, onNavigate }: TopNavProps) {
  return (
    <nav
      aria-label="Main navigation"
      className="mx-auto flex w-full max-w-5xl flex-col gap-3 rounded-xl border-2 border-pokedex-red bg-white px-3 py-3 shadow-[4px_4px_0_var(--color-pokedex-red-dark)] sm:flex-row sm:items-center sm:justify-between sm:px-5"
    >
      <div className="flex items-center justify-center gap-2 sm:justify-start">
        <span className="inline-flex h-3 w-3 rounded-full bg-pokedex-red" aria-hidden="true" />
        <span className="font-pixel text-[10px] uppercase tracking-[0.2em] text-pokedex-red-dark">
          Pokédex
        </span>
      </div>

      <ul className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-pokedex-ink sm:justify-end sm:text-sm sm:gap-3">
        {items.map(({ label, value }) => {
          const isActive = activeScreen === value

          return (
            <li key={value}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onNavigate(value)}
                className={`rounded-full border-2 px-3 py-1.5 transition-colors sm:px-4 ${
                  isActive
                    ? 'border-pokedex-red bg-pokedex-red text-white'
                    : 'border-transparent bg-pokedex-paper text-pokedex-ink hover:border-pokedex-red hover:text-pokedex-red-dark'
                }`}
              >
                {label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
