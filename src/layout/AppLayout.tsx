import { Outlet } from 'react-router-dom'
import { TopNav } from './TopNav'

export function AppLayout() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <TopNav />
      <main className="mx-auto w-full max-w-5xl px-3 py-4 pb-20 sm:px-4 sm:py-6 sm:pb-6">
        <Outlet />
      </main>
    </div>
  )
}

