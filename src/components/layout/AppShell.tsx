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
    <main className="min-h-screen px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <TopNav items={navItems} activeScreen={activeScreen} onNavigate={setActiveScreen} />
        {screenMap[activeScreen]}
      </div>
    </main>
  )
}