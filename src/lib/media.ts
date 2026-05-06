export type MediaItem = {
  id: string
  url: string
  filename?: string
  mimetype?: string
  type?: 'IMAGE' | 'VIDEO'
}

export async function uploadMediaFiles(token: string | null, files: File[]) {
  if (!token) throw new Error('No auth token')
  if (files.length === 0) return [] as MediaItem[]

  const fd = new FormData()
  for (const file of files) fd.append('files', file)

  const res = await fetch('/api/media/upload/multiple', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: fd,
  })

  const payload = await res.json().catch(() => null)
  if (!res.ok) {
    const msg =
      payload && typeof payload === 'object' && 'message' in payload
        ? String((payload as any).message)
        : `HTTP ${res.status}`
    throw new Error(msg)
  }

  return payload as MediaItem[]
}

