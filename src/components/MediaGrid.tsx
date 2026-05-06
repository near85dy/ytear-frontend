import { toUploadUrl } from '../lib/uploads'
import type { MediaItem } from '../lib/media'

export function MediaGrid({ media }: { media?: MediaItem[] | null }) {
  if (!media || media.length === 0) return null

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
      {media.map((m) => {
        const src = toUploadUrl(m.url)
        const isVideo = (m.type === 'VIDEO') || (m.mimetype?.startsWith('video/') ?? false)
        if (!src) return null
        return (
          <div key={m.id} className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800">
            {isVideo ? (
              <video src={src} controls className="h-auto w-full bg-black" />
            ) : (
              <img src={src} alt={m.filename ?? ''} className="h-auto w-full object-cover" />
            )}
          </div>
        )
      })}
    </div>
  )
}

