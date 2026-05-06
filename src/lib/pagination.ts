export type Meta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export type PageResult<T> = {
  items: T[]
  page: number
  limit: number
  total: number
  totalPages: number
}

type BackendPaged<T> =
  | { items: T[]; page: number; limit: number; total: number; totalPages: number }
  | { posts: T[]; meta: Meta }
  | { communities: T[]; meta: Meta }
  | { comments: T[]; meta: Meta }

export function normalizePage<T>(res: BackendPaged<T>): PageResult<T> {
  if ('items' in res) {
    return {
      items: res.items,
      page: res.page,
      limit: res.limit,
      total: res.total,
      totalPages: res.totalPages,
    }
  }

  const meta = res.meta
  const items =
    'posts' in res
      ? res.posts
      : 'communities' in res
        ? res.communities
        : 'comments' in res
          ? res.comments
          : []

  return {
    items,
    page: meta.page,
    limit: meta.limit,
    total: meta.total,
    totalPages: meta.totalPages,
  }
}

