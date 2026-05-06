import { useEffect, useMemo, useRef, useState } from 'react'
import { Image as ImageIcon, SendHorizonal, X, Loader2 } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { ApiError, apiRequest } from '../lib/http'
import { Avatar } from './Avatar'
import { t } from '../i18n/t'
import { uploadMediaFiles } from '../lib/media'
import type { MediaItem } from '../lib/media'
import { MediaGrid } from './MediaGrid'

export function PostComposer({
  communitySlug,
  onPosted,
}: {
  communitySlug?: string
  onPosted?: () => void
}) {
  const auth = useAuth()
  const token = auth.token

  const [text, setText] = useState('')
  const [media, setMedia] = useState<MediaItem[]>([])
  const [isUploadingMedia, setIsUploadingMedia] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPosting, setIsPosting] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const maxLen = 10000
  const remaining = maxLen - text.length

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = '0px'
    el.style.height = `${Math.min(el.scrollHeight, 280)}px`
  }, [text])

  const canPost = !!auth.user && text.trim().length > 0 && remaining >= 0 && !isPosting && !isUploadingMedia

  const metaText = useMemo(() => {
    if (communitySlug) return t.posts.willPostToCommunity(communitySlug)
    return t.posts.willPostGlobal
  }, [communitySlug])

  async function submit() {
    setError(null)
    if (!auth.user) {
      setError(t.posts.needAuth)
      return
    }
    setIsPosting(true)
    try {
      await apiRequest('/api/posts', {
        method: 'POST',
        token,
        body: { content: text, communitySlug: communitySlug || undefined, mediaIds: media.map((m) => m.id) },
      })
      setText('')
      setMedia([])
      onPosted?.()
    } catch (e) {
      if (e instanceof ApiError) setError(e.message)
      else setError(t.common.errorGeneric)
    } finally {
      setIsPosting(false)
    }
  }

  async function onPickFiles(files: FileList | null) {
    if (!files || files.length === 0) return
    if (!auth.user) {
      setError(t.posts.needAuth)
      return
    }
    setIsUploadingMedia(true)
    setError(null)
    try {
      const uploaded = await uploadMediaFiles(token, Array.from(files))
      setMedia((prev) => [...prev, ...uploaded])
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.errorGeneric)
    } finally {
      setIsUploadingMedia(false)
    }
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex gap-3">
        <Avatar src={auth.user?.avatar ?? null} alt={auth.user?.username} size={44} />

        <div className="min-w-0 flex-1">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={auth.user ? t.posts.composerPlaceholderAuthed : t.posts.composerPlaceholderGuest}
            disabled={!auth.user || isPosting}
            className="w-full resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-zinc-500 disabled:opacity-60"
            rows={3}
          />

          <MediaGrid media={media} />

          <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400">
              <label className="inline-flex cursor-pointer items-center gap-1 rounded-full px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                {isUploadingMedia ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                media
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,video/webm,video/quicktime"
                  onChange={(e) => onPickFiles(e.target.files)}
                  disabled={!auth.user || isUploadingMedia || isPosting}
                />
              </label>
              {media.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setMedia([])}
                  className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <X className="h-4 w-4" />
                  clear media
                </button>
              ) : null}
              <span className="text-zinc-300 dark:text-zinc-700">·</span>
              <span>{metaText}</span>
            </div>

            <div className="flex items-center gap-2">
              <div
                className={[
                  'rounded-full px-2 py-1 text-xs',
                  remaining < 0
                    ? 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-200'
                    : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200',
                ].join(' ')}
              >
                {remaining}
              </div>

              {text.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setText('')}
                  className="rounded-full p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
                  aria-label="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={submit}
                disabled={!canPost}
                className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                <SendHorizonal className="h-4 w-4" />
                {isPosting ? t.posts.publishing : t.posts.publish}
              </button>
            </div>
          </div>

          {error ? (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

