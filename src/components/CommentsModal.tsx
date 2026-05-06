import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { X, Clock3, SendHorizonal, Image as ImageIcon, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { apiRequest, ApiError } from '../lib/http'
import { normalizePage } from '../lib/pagination'
import { Avatar } from './Avatar'
import { t } from '../i18n/t'
import { uploadMediaFiles } from '../lib/media'
import type { MediaItem } from '../lib/media'
import { MediaGrid } from './MediaGrid'
import { RichContent } from './RichContent'

type Comment = {
  id: string
  content: string
  createdAt: string
  author: { id: string; username: string; avatar?: string | null }
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

export function CommentsModal({
  postId,
  token,
  canComment,
  isOpen,
  onClose,
  onCommentAdded,
}: {
  postId: string | null
  token: string | null
  canComment: boolean
  isOpen: boolean
  onClose: () => void
  onCommentAdded?: () => void
}) {
  const [comments, setComments] = useState<PageResult<Comment> | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isUploadingMedia, setIsUploadingMedia] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !postId) return
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const raw = await apiRequest<any>(`/api/comments/post/${postId}`, {
          token,
          query: { page: 1, limit: 50 },
        })
        if (!cancelled) setComments(normalizePage<Comment>(raw))
      } catch {
        if (!cancelled) setError(t.common.errorGeneric)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isOpen, postId, token])

  if (!isOpen || !postId) return null

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!canComment) {
      setSendError(t.posts.needAuth)
      return
    }
    if (!text.trim()) return

    setIsSending(true)
    setSendError(null)
    try {
      await apiRequest('/api/comments', {
        method: 'POST',
        token,
        body: { content: text, postId, mediaIds: media.map((m) => m.id) },
      })
      setText('')
      setMedia([])
      const raw = await apiRequest<any>(`/api/comments/post/${postId}`, {
        token,
        query: { page: 1, limit: 50 },
      })
      setComments(normalizePage<Comment>(raw))
      onCommentAdded?.()
    } catch (e) {
      if (e instanceof ApiError) setSendError(e.message)
      else setSendError(t.common.errorGeneric)
    } finally {
      setIsSending(false)
    }
  }

  async function onPickFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (!canComment) {
      setSendError(t.posts.needAuth)
      return
    }
    setIsUploadingMedia(true)
    setSendError(null)
    try {
      const uploaded = await uploadMediaFiles(token, Array.from(files))
      setMedia((prev) => [...prev, ...uploaded])
    } catch (e) {
      setSendError(e instanceof Error ? e.message : t.common.errorGeneric)
    } finally {
      setIsUploadingMedia(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-3 sm:items-center">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
          <h3 className="text-sm font-semibold">{t.posts.comments}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[calc(85vh-64px)] overflow-y-auto p-4">
          <form onSubmit={submit} className="mb-4 rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder={canComment ? t.posts.composerPlaceholderAuthed : t.posts.composerPlaceholderGuest}
              disabled={!canComment || isSending}
              className="w-full resize-none bg-transparent text-sm outline-none"
            />
            <MediaGrid media={media} />
            {sendError ? (
              <div className="mt-2 text-xs text-red-600 dark:text-red-300">{sendError}</div>
            ) : null}
            <div className="mt-2 flex items-center justify-between gap-2">
              <label className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                {isUploadingMedia ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                media
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
                  onChange={(e) => onPickFiles(e.target.files)}
                  disabled={!canComment || isUploadingMedia || isSending}
                />
              </label>
              <button
                disabled={!canComment || isSending || isUploadingMedia || text.trim().length === 0}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                <SendHorizonal className="h-4 w-4" />
                {isSending ? t.posts.sending : t.posts.send}
              </button>
            </div>
          </form>

          {isLoading ? <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.common.loading}</div> : null}
          {error ? <div className="text-sm text-red-600 dark:text-red-300">{error}</div> : null}

          <div className="space-y-3">
            {(comments?.items ?? []).map((c) => (
              <div key={c.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex gap-3">
                  <Avatar src={c.author.avatar ?? null} alt={c.author.username} size={32} />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
                      <Link to={`/u/${c.author.username}`} className="font-medium text-zinc-900 dark:text-zinc-100">
                        @{c.author.username}
                      </Link>
                      <span className="inline-flex items-center gap-1">
                        <Clock3 className="h-3.5 w-3.5" />
                        {formatDate(c.createdAt)}
                      </span>
                    </div>
                    <RichContent content={c.content} textClassName="mt-1 whitespace-pre-wrap text-sm" />
                    <MediaGrid media={c.media} />
                  </div>
                </div>
              </div>
            ))}
            {!isLoading && comments && comments.items.length === 0 ? (
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.posts.noComments}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

