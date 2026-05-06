import { toUploadUrl } from '../lib/uploads'

const IMAGE_MARKDOWN_RE = /!\[[^\]]*]\((https?:\/\/[^\s)]+)\)/g

export function RichContent({
  content,
  textClassName = 'mt-2 whitespace-pre-wrap text-sm leading-6',
}: {
  content: string
  textClassName?: string
}) {
  const imageUrls: string[] = []
  const text = content.replace(IMAGE_MARKDOWN_RE, (_, url: string) => {
    imageUrls.push(url)
    return ''
  }).trim()

  return (
    <div className="mt-2 space-y-2">
      {text ? <p className={textClassName}>{text}</p> : null}
      {imageUrls.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {imageUrls.map((url, idx) => {
            const safeUrl = toUploadUrl(url)
            if (!safeUrl) return null
            return (
              <a
                key={`${safeUrl}-${idx}`}
                href={safeUrl}
                target="_blank"
                rel="noreferrer"
                className="overflow-hidden rounded-xl border border-zinc-200 dark:border-zinc-800"
              >
                <img src={safeUrl} alt="" className="h-auto w-full object-cover" loading="lazy" />
              </a>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

