import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { ApiError, apiRequest } from '../lib/http'
import { normalizePage } from '../lib/pagination'
import { t } from '../i18n/t'

type Community = {
  id: string
  name: string
  slug: string
  description?: string | null
  type?: string
  memberCount?: number
  postCount?: number
  isMember?: boolean
}

type PageResult<T> = {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export function CommunitiesPage() {
  const auth = useAuth()
  const token = auth.token

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [data, setData] = useState<PageResult<Community> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [createName, setCreateName] = useState('')
  const [createSlug, setCreateSlug] = useState('')
  const [createDesc, setCreateDesc] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const raw = await apiRequest<any>('/api/communities', {
          query: { page, limit: 20, search: search || undefined },
        })
        if (!cancelled) setData(normalizePage<Community>(raw))
      } catch {
        if (!cancelled) setError(t.communities.failedLoad)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [page, search])

  const items = useMemo(() => data?.items ?? [], [data])

  async function onCreate(e: FormEvent) {
    e.preventDefault()
    if (!auth.user) {
      setCreateError(t.posts.needAuth)
      return
    }
    setIsCreating(true)
    setCreateError(null)
    try {
      const created = await apiRequest<Community>('/api/communities', {
        method: 'POST',
        token,
        body: {
          name: createName,
          slug: createSlug,
          description: createDesc || undefined,
        },
      })
      setCreateName('')
      setCreateSlug('')
      setCreateDesc('')
      window.location.assign(`/c/${created.slug}`)
    } catch (e) {
      if (e instanceof ApiError) setCreateError(e.message)
      else setCreateError(t.common.errorGeneric)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">{t.communities.title}</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.communities.subtitle}</p>
        </div>
        <input
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
          placeholder={t.communities.search}
          className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-900 sm:w-72 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:ring-zinc-100"
        />
      </div>

      <form
        onSubmit={onCreate}
        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="text-sm font-medium">{t.communities.createTitle}</div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          <label className="block">
            <div className="mb-1 text-sm">{t.communities.name}</div>
            <input
              value={createName}
              onChange={(e) => setCreateName(e.target.value)}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              disabled={!auth.user || isCreating}
            />
          </label>
          <label className="block">
            <div className="mb-1 text-sm">{t.communities.slug}</div>
            <input
              value={createSlug}
              onChange={(e) => setCreateSlug(e.target.value)}
              placeholder={t.communities.slugPlaceholder}
              className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              disabled={!auth.user || isCreating}
            />
          </label>
        </div>
        <label className="mt-3 block">
          <div className="mb-1 text-sm">{t.communities.description}</div>
          <input
            value={createDesc}
            onChange={(e) => setCreateDesc(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            disabled={!auth.user || isCreating}
          />
        </label>
        {createError ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {createError}
          </div>
        ) : null}
        <div className="mt-3 flex items-center justify-end">
          <button
            disabled={!auth.user || isCreating}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {isCreating ? t.communities.creating : t.communities.create}
          </button>
        </div>
      </form>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {isLoading ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.common.loading}</div>
        ) : (
          items.map((c) => (
            <Link
              key={c.slug}
              to={`/c/${c.slug}`}
              className="rounded-xl border border-zinc-200 bg-white p-4 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-900/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold">c/{c.slug}</div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">{c.name}</div>
                </div>
                <div className="text-xs text-zinc-600 dark:text-zinc-400">{c.type ?? ''}</div>
              </div>
              {c.description ? (
                <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{c.description}</p>
              ) : null}
              <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
                {(c.memberCount ?? 0) ? `${c.memberCount} members` : ''}{' '}
                {(c.postCount ?? 0) ? `· ${c.postCount} posts` : ''}
              </div>
            </Link>
          ))
        )}
      </div>

      {data ? (
        <div className="flex items-center justify-between gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm disabled:opacity-50 sm:px-3 sm:py-2 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {t.common.back}
          </button>
          <div className="text-center text-xs text-zinc-600 sm:text-sm dark:text-zinc-400">
            Lapa {data.page} no {data.totalPages}
          </div>
          <button
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-md border border-zinc-200 bg-white px-2 py-1.5 text-sm disabled:opacity-50 sm:px-3 sm:py-2 dark:border-zinc-800 dark:bg-zinc-900"
          >
            {t.common.next}
          </button>
        </div>
      ) : null}
    </div>
  )
}

