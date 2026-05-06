import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Globe2, Users, Rss, Settings as SettingsIcon, LogIn, UserPlus, LogOut, Sun, Moon } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { t } from '../i18n/t'
import { useTheme } from '../theme/ThemeProvider'
import { setLanguage, getLanguage } from '../i18n/t'

function Item({
  to,
  icon,
  children,
}: {
  to: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }: { isActive: boolean }) =>
        [
          'inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition',
          isActive
            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
            : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900',
        ].join(' ')
      }
    >
      {icon ? <span className="grid place-items-center">{icon}</span> : null}
      {children}
    </NavLink>
  )
}

export function TopNav() {
  const auth = useAuth()
  const nav = useNavigate()
  const { theme, toggleTheme } = useTheme()

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="mx-auto flex w-full max-w-5xl items-center gap-2 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3">
          <Link to="/global" className="font-semibold tracking-tight">
            ytear
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <Item to="/global" icon={<Globe2 className="h-4 w-4" />}>
              {t.nav.global}
            </Item>
            <Item to="/communities" icon={<Users className="h-4 w-4" />}>
              {t.nav.communities}
            </Item>
            <Item to="/feed" icon={<Rss className="h-4 w-4" />}>
              {t.nav.feed}
            </Item>
          </nav>

          <div className="flex-1" />
          <div className="hidden sm:flex items-center gap-2">
            <select
              value={getLanguage()}
              onChange={(e) => setLanguage(e.target.value as 'lv' | 'en')}
              className="rounded-md border border-zinc-200 bg-white px-2 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              aria-label="Language"
            >
              <option value="lv">LV</option>
              <option value="en">EN</option>
            </select>
          </div>

          <button
            onClick={toggleTheme}
            className="rounded-md p-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 sm:px-3 sm:py-2"
            title={theme === 'dark' ? t.common.light : t.common.dark}
          >
            <span className="inline-flex items-center gap-2">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="hidden sm:inline">{theme === 'dark' ? t.common.light : t.common.dark}</span>
            </span>
          </button>

          {auth.user ? (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to={`/u/${auth.user.username}`}
                className="hidden rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 sm:block"
              >
                @{auth.user.username}
              </Link>
              <Link
                to="/settings"
                className="rounded-md p-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 sm:px-3 sm:py-2"
              >
                <span className="inline-flex items-center gap-2">
                  <SettingsIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.nav.settings}</span>
                </span>
              </Link>
              <button
                onClick={() => {
                  auth.logout()
                  nav('/global')
                }}
                className="rounded-md p-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 sm:bg-zinc-900 sm:px-3 sm:py-2 sm:text-white sm:hover:bg-zinc-800 sm:dark:bg-zinc-100 sm:dark:text-zinc-900 sm:dark:hover:bg-zinc-200"
              >
                <span className="inline-flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.nav.logout}</span>
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2">
              <Link
                to="/login"
                className="rounded-md p-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 sm:px-3 sm:py-2"
              >
                <span className="inline-flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.nav.login}</span>
                </span>
              </Link>
              <Link
                to="/register"
                className="rounded-md p-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 sm:bg-zinc-900 sm:px-3 sm:py-2 sm:text-white sm:hover:bg-zinc-800 sm:dark:bg-zinc-100 sm:dark:text-zinc-900 sm:dark:hover:bg-zinc-200"
              >
                <span className="inline-flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.nav.register}</span>
                </span>
              </Link>
            </div>
          )}
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-200 bg-white/95 px-2 py-1 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:hidden">
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-1">
          <Item to="/global" icon={<Globe2 className="h-4 w-4" />}>
            <span className="text-xs">{t.nav.global}</span>
          </Item>
          <Item to="/communities" icon={<Users className="h-4 w-4" />}>
            <span className="text-xs">{t.nav.communities}</span>
          </Item>
          <Item to="/feed" icon={<Rss className="h-4 w-4" />}>
            <span className="text-xs">{t.nav.feed}</span>
          </Item>
        </div>
      </nav>
    </>
  )
}