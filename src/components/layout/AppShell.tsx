import { HomeScreen } from '../home/HomeScreen'
import { TopNav } from './TopNav'

export function AppShell() {
  return (
    <main className="min-h-screen px-4 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <TopNav />
        <HomeScreen />
      </div>
    </main>
  )
}