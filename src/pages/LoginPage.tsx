import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ApiError } from '../lib/http'
import { useAuth } from '../auth/AuthProvider'
import { t } from '../i18n/t'

export function LoginPage() {
  const auth = useAuth()
  const nav = useNavigate()

  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await auth.login({ emailOrUsername, password })
      nav('/feed')
    } catch (e) {
      if (e instanceof ApiError) setError(e.message)
      else setError(t.common.errorGeneric)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h1 className="text-2xl font-semibold">{t.auth.loginTitle}</h1>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.auth.loginSubtitle}</p>

      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <label className="block">
          <div className="mb-1 text-sm font-medium">{t.auth.emailOrUsername}</div>
          <input
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-100"
            autoComplete="username"
          />
        </label>

        <label className="block">
          <div className="mb-1 text-sm font-medium">{t.auth.password}</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:focus:ring-zinc-100"
            autoComplete="current-password"
          />
        </label>

        {error ? (
          <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <button
          disabled={isSubmitting}
          className="w-full rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
        >
          {isSubmitting ? t.auth.loggingIn : t.auth.login}
        </button>

        <div className="text-center text-sm text-zinc-600 dark:text-zinc-400">
          {t.auth.noAccount}{' '}
          <Link to="/register" className="text-zinc-900 underline dark:text-zinc-100">
            {t.auth.register}
          </Link>
        </div>
      </form>
    </div>
  )
}

