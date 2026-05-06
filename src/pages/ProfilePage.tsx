import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { apiRequest } from '../lib/http'
import { toUploadUrl } from '../lib/uploads'
import { normalizePage } from '../lib/pagination'
import type { MediaItem } from '../lib/media'
import { MediaGrid } from '../components/MediaGrid'
import { t } from '../i18n/t'
import { RichContent } from '../components/RichContent'

type User = {
  id: string
  username: string
  email?: string
  avatar?: string | null
  bio?: string | null
  createdAt?: string
}

type Post = {
  id: string
  content: string
  createdAt: string
  author: { id: string; username: string }
  community?: { slug: string; name: string } | null
  media?: MediaItem[]
}

type PageResult<T> = {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

export function ProfilePage() {
  const { username } = useParams()
  const auth = useAuth()
  const token = auth.token

  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<PageResult<Post> | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!username) return
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const u = await apiRequest<User>(`/api/users/${username}`)
        const raw = await apiRequest<any>(`/api/users/${username}/posts`, {
          query: { page: 1, limit: 20 },
        })
        if (!cancelled) {
          setUser(u)
          setPosts(normalizePage<Post>(raw))
        }
      } catch {
        if (!cancelled) setError(t.profile.failedLoad)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [username, token])

  if (isLoading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.common.loading}</div>
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
        {error}
      </div>
    )
  }
  if (!user) return null

  const avatarUrl = toUploadUrl(user.avatar ?? null)

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800">
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">@{user.username}</h1>
            {user.bio ? (
              <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{user.bio}</p>
            ) : (
              <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.profile.noBio}</p>
            )}
          </div>
          {auth.user?.username === user.username ? (
            <Link
              to="/settings"
              className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              {t.profile.settings}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="space-y-3">
        {(posts?.items ?? []).map((p) => (
          <article
            key={p.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <span>{formatDate(p.createdAt)}</span>
              {p.community?.slug ? (
                <>
                  <span>·</span>
                  <Link to={`/c/${p.community.slug}`} className="underline">
                    c/{p.community.slug}
                  </Link>
                </>
              ) : null}
            </div>
            <RichContent content={p.content} />
            <MediaGrid media={p.media} />
            <div className="mt-3 flex items-center justify-end">
              <Link
                to={`/posts/${p.id}`}
                className="rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-950"
              >
                {t.common.open}
              </Link>
            </div>
          </article>
        ))}
        {posts && posts.items.length === 0 ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.posts.noPosts}</div>
        ) : null}
      </div>
    </div>
  )
}

