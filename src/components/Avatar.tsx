import { toUploadUrl } from '../lib/uploads'

export function Avatar({
  src,
  alt,
  size = 36,
}: {
  src?: string | null
  alt?: string
  size?: number
}) {
  const url = toUploadUrl(src ?? null)

  return (
    <div
      className="shrink-0 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-800"
      style={{ width: size, height: size }}
      aria-label={alt}
    >
      {url ? <img src={url} alt={alt ?? ''} className="h-full w-full object-cover" /> : null}
    </div>
  )
}

