import type { NavItem, ScreenName } from '../../types/navigation'

type TopNavProps = {
  items: NavItem[]
  activeScreen: ScreenName
  onNavigate: (screen: ScreenName) => void
}

export function TopNav({ items, activeScreen, onNavigate }: TopNavProps) {
  return (
    <nav className="mx-auto flex w-full max-w-5xl items-center justify-between gap-2 rounded-lg border-2 border-pokedex-red bg-white px-3 py-3 shadow-[4px_4px_0_var(--color-pokedex-red-dark)] sm:px-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-3 w-3 rounded-full bg-pokedex-red" aria-hidden="true" />
        <span className="font-pixel text-[10px] uppercase tracking-[0.2em] text-pokedex-red-dark">
          Pokédex
        </span>
      </div>

      <ul className="flex flex-wrap items-center justify-end gap-2 text-sm font-bold text-pokedex-ink sm:gap-3">
        {items.map(({ label, value }) => {
          const isActive = activeScreen === value

          return (
            <li key={value}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => onNavigate(value)}
                className={`rounded-full border-2 px-3 py-1.5 transition-colors ${
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
