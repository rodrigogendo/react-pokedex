import { useState, type ReactNode } from 'react'

import { HomeScreen } from '../home/HomeScreen'
import { PokedexScreen } from '../pokedex/PokedexScreen'
import { SearchScreen } from '../search/SearchScreen'
import type { NavItem, ScreenName } from '../../types/navigation'
import { TopNav } from './TopNav'

const navItems: NavItem[] = [
  { label: 'Home', value: 'home' },
  { label: 'Pokédex', value: 'pokedex' },
  { label: 'Search', value: 'search' },
]

const screenMap: Record<ScreenName, ReactNode> = {
  home: <HomeScreen />,
  pokedex: <PokedexScreen />,
  search: <SearchScreen />,
}

export function AppShell() {
  const [activeScreen, setActiveScreen] = useState<ScreenName>('home')

  return (
    <main className="page-shell min-h-screen px-3 py-6 sm:px-6 sm:py-10 lg:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <TopNav items={navItems} activeScreen={activeScreen} onNavigate={setActiveScreen} />
        {screenMap[activeScreen]}
      </div>
    </main>
  )
}