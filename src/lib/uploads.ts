export function toUploadUrl(pathOrUrl: string | null | undefined) {
  if (!pathOrUrl) return null
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl
  if (pathOrUrl.startsWith('/uploads/')) return pathOrUrl
  if (pathOrUrl.startsWith('uploads/')) return `/${pathOrUrl}`
  return pathOrUrl
}

