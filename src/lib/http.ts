import { localizeServerError } from './serverErrors'

export class ApiError extends Error {
  status: number
  payload: unknown

  constructor(message: string, status: number, payload: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE'

export type RequestOptions = {
  method?: HttpMethod
  token?: string | null
  query?: Record<string, string | number | boolean | undefined | null>
  body?: unknown
  headers?: Record<string, string>
}

function buildQuery(q?: RequestOptions['query']) {
  if (!q) return ''
  const sp = new URLSearchParams()
  for (const [k, v] of Object.entries(q)) {
    if (v === undefined || v === null) continue
    sp.set(k, String(v))
  }
  const s = sp.toString()
  return s ? `?${s}` : ''
}

export async function apiRequest<T>(path: string, opts: RequestOptions = {}) {
  const method = opts.method ?? 'GET'
  const query = buildQuery(opts.query)
  const url = `${path}${query}`

  const headers: Record<string, string> = {
    ...(opts.headers ?? {}),
  }

  if (opts.token) {
    headers.Authorization = `Bearer ${opts.token}`
  }

  let body: BodyInit | undefined
  if (opts.body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] ?? 'application/json'
    body = JSON.stringify(opts.body)
  }

  const res = await fetch(url, {
    method,
    headers,
    body,
  })

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null)

  if (!res.ok) {
    throw new ApiError(localizeServerError(payload, res.status), res.status, payload)
  }

  return payload as T
}

