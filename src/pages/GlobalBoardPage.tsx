import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock3, Heart, MessageCircle } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { apiRequest } from '../lib/http'
import { normalizePage } from '../lib/pagination'
import { Avatar } from '../components/Avatar'
import { CommentsModal } from '../components/CommentsModal'
import { t } from '../i18n/t'
import type { MediaItem } from '../lib/media'
import { MediaGrid } from '../components/MediaGrid'
import { RichContent } from '../components/RichContent'

type Post = {
  id: string
  content: string
  createdAt: string
  author: { id: string; username: string; avatar?: string | null }
  community?: { slug: string; name: string } | null
  likesCount?: number
  commentsCount?: number
  isLiked?: boolean
  media?: MediaItem[]
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString()
}

export function GlobalBoardPage() {
  const auth = useAuth()
  const [items, setItems] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null)

  const token = auth.token
  const canCreate = !!auth.user
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const fetchPage = useCallback(async (nextPage: number, append: boolean) => {
    const raw = await apiRequest<any>('/api/posts/global', {
      token,
      query: { page: nextPage, limit: 20 },
    })
    const normalized = normalizePage<Post>(raw)
    setPage(normalized.page)
    setTotalPages(normalized.totalPages)
    setItems((prev) => (append ? [...prev, ...normalized.items] : normalized.items))
  }, [token])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        await fetchPage(1, false)
      } catch (e) {
        if (!cancelled) setError(t.posts.failedLoadPosts)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [fetchPage])

  const hasMore = useMemo(() => page < totalPages, [page, totalPages])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (!first.isIntersecting || isLoading || isLoadingMore || !hasMore) return
        ;(async () => {
          setIsLoadingMore(true)
          try {
            await fetchPage(page + 1, true)
          } finally {
            setIsLoadingMore(false)
          }
        })()
      },
      { rootMargin: '300px 0px 300px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [fetchPage, hasMore, isLoading, isLoadingMore, page])

  async function toggleLike(postId: string) {
    if (!auth.user) return
    const prev = items
    setItems((curr) =>
      curr.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likesCount: (p.likesCount ?? 0) + (p.isLiked ? -1 : 1) }
          : p,
      ),
    )
    try {
      await apiRequest(`/api/likes/post/${postId}/toggle`, { method: 'POST', token })
    } catch {
      setItems(prev)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold sm:text-2xl">{t.global.title}</h1>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.global.subtitle}</p>
        </div>
        {canCreate ? (
          <Link
            to="/feed"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            {t.global.goToFeed}
          </Link>
        ) : (
          <Link
            to="/login"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            {t.global.loginToPost}
          </Link>
        )}
      </div>

      {error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : null}

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.common.loading}</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.posts.noPosts}</div>
        ) : (
          items.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex gap-2 sm:gap-3">
                <Avatar src={p.author.avatar ?? null} alt={p.author.username} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                    <Link
                      to={`/u/${p.author.username}`}
                      className="font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      @{p.author.username}
                    </Link>
                    {p.community?.slug ? (
                      <>
                        <span className="text-zinc-300 dark:text-zinc-700">·</span>
                        <Link to={`/c/${p.community.slug}`} className="underline">
                          c/{p.community.slug}
                        </Link>
                      </>
                    ) : null}
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-4 w-4" />
                      {formatDate(p.createdAt)}
                    </span>
                  </div>
                  <RichContent content={p.content} />
                  <MediaGrid media={p.media} />
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                      <button
                        onClick={() => toggleLike(p.id)}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <Heart
                          className={[
                            'h-4 w-4',
                            p.isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-500',
                          ].join(' ')}
                        />
                        {p.likesCount ?? 0}
                      </button>
                      <button
                        onClick={() => setActiveCommentsPostId(p.id)}
                        className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        <MessageCircle className="h-4 w-4 text-zinc-500" />
                        {p.commentsCount ?? 0}
                      </button>
                    </div>
                    <Link
                      to={`/posts/${p.id}`}
                      className="rounded-md px-2 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 sm:px-3 sm:py-2 dark:text-zinc-300 dark:hover:bg-zinc-950"
                    >
                      {t.common.open}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))
        )}
      </div>

      {!isLoading && (
        <div ref={sentinelRef} className="py-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {isLoadingMore ? t.common.loading : hasMore ? 'Ritini, lai ielādētu vēl…' : 'Vairs nav ierakstu'}
        </div>
      )}

      <CommentsModal
        postId={activeCommentsPostId}
        token={token}
        canComment={!!auth.user}
        isOpen={!!activeCommentsPostId}
        onClose={() => setActiveCommentsPostId(null)}
        onCommentAdded={() =>
          setItems((curr) =>
            curr.map((p) =>
              p.id === activeCommentsPostId ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 } : p,
            ),
          )
        }
      />
    </div>
  )
}

