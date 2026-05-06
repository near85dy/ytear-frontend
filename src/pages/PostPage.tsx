import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Clock3, Heart, MessageCircle } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { ApiError, apiRequest } from '../lib/http'
import { normalizePage } from '../lib/pagination'
import { Avatar } from '../components/Avatar'
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

type Comment = {
  id: string
  content: string
  createdAt: string
  author: { id: string; username: string; avatar?: string | null }
  parentId?: string | null
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

export function PostPage() {
  const { id } = useParams()
  const auth = useAuth()
  const token = auth.token

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<PageResult<Comment> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [isLiking, setIsLiking] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const p = await apiRequest<Post>(`/api/posts/${id}`, { token })
        const raw = await apiRequest<any>(`/api/comments/post/${id}`, {
          token,
          query: { page: 1, limit: 50 },
        })
        if (!cancelled) {
          setPost(p)
          setComments(normalizePage<Comment>(raw))
        }
      } catch {
        if (!cancelled) setError(t.common.errorGeneric)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [id, token])

  async function toggleLike() {
    if (!id) return
    if (!auth.user) {
      setSubmitError(t.posts.needAuth)
      return
    }
    if (!post) return
    setIsLiking(true)
    try {
      await apiRequest(`/api/likes/post/${id}/toggle`, { method: 'POST', token })
      const p = await apiRequest<Post>(`/api/posts/${id}`, { token })
      setPost(p)
    } catch (e) {
      if (e instanceof ApiError) setSubmitError(e.message)
      else setSubmitError(t.common.errorGeneric)
    } finally {
      setIsLiking(false)
    }
  }

  async function submitComment(e: FormEvent) {
    e.preventDefault()
    if (!id) return
    if (!auth.user) {
      setSubmitError(t.posts.needAuth)
      return
    }
    setIsSubmitting(true)
    setSubmitError(null)
    try {
      await apiRequest<Comment>('/api/comments', {
        method: 'POST',
        token,
        body: { content: comment, postId: id },
      })
      setComment('')
      const raw = await apiRequest<any>(`/api/comments/post/${id}`, {
        token,
        query: { page: 1, limit: 50 },
      })
      setComments(normalizePage<Comment>(raw))
      const p = await apiRequest<Post>(`/api/posts/${id}`, { token })
      setPost(p)
    } catch (e) {
      if (e instanceof ApiError) setSubmitError(e.message)
      else setSubmitError(t.common.errorGeneric)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.common.loading}</div>
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
        {error}
      </div>
    )
  }
  if (!post) return null

  return (
    <div className="space-y-4">
      <article className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex gap-3">
          <Avatar src={post.author.avatar ?? null} alt={post.author.username} size={44} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <Link
                to={`/u/${post.author.username}`}
                className="font-medium text-zinc-900 dark:text-zinc-100"
              >
                @{post.author.username}
              </Link>
              {post.community?.slug ? (
                <>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <Link to={`/c/${post.community.slug}`} className="underline">
                    c/{post.community.slug}
                  </Link>
                </>
              ) : null}
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-4 w-4" />
                {formatDate(post.createdAt)}
              </span>
            </div>
            <RichContent content={post.content} />
            <MediaGrid media={post.media} />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1">
                  <Heart className={post.isLiked ? 'h-4 w-4 fill-current text-red-500' : 'h-4 w-4'} />
                  {post.likesCount ?? 0}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MessageCircle className="h-4 w-4" />
                  {post.commentsCount ?? 0}
                </span>
              </div>
              <button
                disabled={isLiking}
                onClick={toggleLike}
                className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
              >
                {post.isLiked ? 'Unlike' : 'Like'}
              </button>
            </div>
          </div>
        </div>
        {submitError ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {submitError}
          </div>
        ) : null}
      </article>

      <section className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-sm font-medium">{t.posts.comments}</div>

        <form onSubmit={submitComment} className="mt-3 space-y-2">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder={auth.user ? 'Написать комментарий…' : 'Войдите, чтобы комментировать'}
            disabled={!auth.user || isSubmitting}
            className="w-full resize-y rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
          />
          <div className="flex items-center justify-end">
            <button
              disabled={!auth.user || isSubmitting || comment.trim().length === 0}
              className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
            >
              {isSubmitting ? t.posts.sending : t.posts.send}
            </button>
          </div>
        </form>

        <div className="mt-4 space-y-3">
          {(comments?.items ?? []).map((c) => (
            <div key={c.id} className="rounded-lg border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
              <div className="flex gap-3">
                <Avatar src={c.author.avatar ?? null} alt={c.author.username} size={32} />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <Link
                      to={`/u/${c.author.username}`}
                      className="font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      @{c.author.username}
                    </Link>
                    <span className="text-zinc-300 dark:text-zinc-700">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-4 w-4" />
                      {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <RichContent content={c.content} />
                  <MediaGrid media={c.media} />
                </div>
              </div>
            </div>
          ))}
          {comments && comments.items.length === 0 ? (
            <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.posts.noComments}</div>
          ) : null}
        </div>
      </section>
    </div>
  )
}

