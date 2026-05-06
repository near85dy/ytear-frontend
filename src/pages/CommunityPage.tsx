import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Clock3, Heart, MessageCircle } from 'lucide-react'
import { useAuth } from '../auth/AuthProvider'
import { ApiError, apiRequest } from '../lib/http'
import { normalizePage } from '../lib/pagination'
import { Avatar } from '../components/Avatar'
import { PostComposer } from '../components/PostComposer'
import { CommentsModal } from '../components/CommentsModal'
import { t } from '../i18n/t'
import type { MediaItem } from '../lib/media'
import { MediaGrid } from '../components/MediaGrid'
import { RichContent } from '../components/RichContent'

type Community = {
  id: string
  name: string
  slug: string
  description?: string | null
  type?: string
  allowAllToPost?: boolean
  isMember?: boolean
  isOwner?: boolean
  membership?: { role?: string }
  memberCount?: number
}

type Post = {
  id: string
  content: string
  createdAt: string
  author: { id: string; username: string; avatar?: string | null }
  likesCount?: number
  commentsCount?: number
  isLiked?: boolean
  media?: MediaItem[]
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString()
}

export function CommunityPage() {
  const { slug } = useParams()
  const auth = useAuth()
  const token = auth.token

  const [community, setCommunity] = useState<Community | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const [isJoining, setIsJoining] = useState(false)
  const [joinError, setJoinError] = useState<string | null>(null)
  const [inviteUsername, setInviteUsername] = useState<string>('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null)
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null)
  const [showMembers, setShowMembers] = useState(false)
  const [members, setMembers] = useState<Array<any>>([])
  const [membersPage, setMembersPage] = useState(1)
  const [membersTotalPages, setMembersTotalPages] = useState(1)
  const [membersLoading, setMembersLoading] = useState(false)
  const [memberFilter, setMemberFilter] = useState('')
  const [removing, setRemoving] = useState<Record<string, boolean>>({})
  const [membersError, setMembersError] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  const fetchPostsPage = useCallback(async (nextPage: number, append: boolean) => {
    if (!slug) return
    const raw = await apiRequest<any>('/api/posts', {
      token,
      query: { page: nextPage, limit: 20, community: slug },
    })
    const normalized = normalizePage<Post>(raw)
    setPage(normalized.page)
    setTotalPages(normalized.totalPages)
    setPosts((prev) => (append ? [...prev, ...normalized.items] : normalized.items))
  }, [slug, token])

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    ;(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const c = await apiRequest<Community>(`/api/communities/${slug}`, { token })
        await fetchPostsPage(1, false)
        if (!cancelled) {
          setCommunity(c)
        }
      } catch {
        if (!cancelled) setError(t.communities.failedLoadOne)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [slug, token, fetchPostsPage])

  const hasMore = useMemo(() => page < totalPages, [page, totalPages])

  useEffect(() => {
    const node = sentinelRef.current
    if (!node || !slug) return
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0]
        if (!first.isIntersecting || isLoading || isLoadingMore || !hasMore) return
        ;(async () => {
          setIsLoadingMore(true)
          try {
            await fetchPostsPage(page + 1, true)
          } finally {
            setIsLoadingMore(false)
          }
        })()
      },
      { rootMargin: '300px 0px 300px 0px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [fetchPostsPage, hasMore, isLoading, isLoadingMore, page, slug])

  async function joinOrLeave(mode: 'join' | 'leave') {
    if (!slug) return
    if (!auth.user) {
      setJoinError(t.posts.needAuth)
      return
    }
    setIsJoining(true)
    setJoinError(null)
    try {
      await apiRequest(`/api/communities/${slug}/${mode}`, { method: 'POST', token })
      const c = await apiRequest<Community>(`/api/communities/${slug}`, { token })
      setCommunity(c)
    } catch (e) {
      if (e instanceof ApiError) setJoinError(e.message)
      else setJoinError(t.common.errorGeneric)
    } finally {
      setIsJoining(false)
    }
  }

  async function fetchMembers(nextPage: number = 1, append = false) {
    if (!slug) return
    setMembersLoading(true)
    setMembersError(null)
    try {
      const raw = await apiRequest<any>(`/api/communities/${slug}/members`, {
        token,
        query: { page: nextPage, limit: 100 },
      })
      const page = raw.meta?.page ?? 1
      const totalPages = raw.meta?.totalPages ?? 1
      setMembersPage(page)
      setMembersTotalPages(totalPages)
      setMembers((prev) => (append ? [...prev, ...raw.members] : raw.members))
    } catch (e) {
      setMembersError(t.common.errorGeneric)
    } finally {
      setMembersLoading(false)
    }
  }

  async function removeMember(memberId: string) {
    if (!slug || !auth.user) return
    setRemoving((s) => ({ ...s, [memberId]: true }))
    try {
      await apiRequest(`/api/communities/${slug}/members/${memberId}`, {
        method: 'DELETE',
        token,
      })
      // refresh members
      await fetchMembers(1, false)
      // refresh community counts
      const c = await apiRequest<Community>(`/api/communities/${slug}`, { token })
      setCommunity(c)
    } catch (e) {
      // ignore - backend will return proper error handled elsewhere
    } finally {
      setRemoving((s) => ({ ...s, [memberId]: false }))
    }
  }

  async function toggleLike(postId: string) {
    if (!auth.user) return
    const prev = posts
    setPosts((curr) =>
      curr.map((p) =>
        p.id === postId
          ? { ...p, isLiked: !p.isLiked, likesCount: (p.likesCount ?? 0) + (p.isLiked ? -1 : 1) }
          : p,
      ),
    )
    try {
      await apiRequest(`/api/likes/post/${postId}/toggle`, { method: 'POST', token })
    } catch {
      setPosts(prev)
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
  if (!community) return null

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">c/{community.slug}</div>
            <h1 className="mt-1 text-2xl font-semibold">{community.name}</h1>
            {community.description ? (
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{community.description}</p>
            ) : null}
            <div className="mt-3 text-xs text-zinc-600 dark:text-zinc-400">
              {(community.memberCount ?? 0) ? t.communities.memberCount(community.memberCount ?? 0) : ''}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {community.isMember ? (
              <div className="flex items-center gap-2">
                <button
                  disabled={isJoining}
                  onClick={() => joinOrLeave('leave')}
                  className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-950"
                >
                  {isJoining ? '…' : t.communities.leave}
                </button>

                <div className="flex items-center gap-2">
                  <input
                    value={inviteUsername}
                    onChange={(e) => setInviteUsername(e.target.value)}
                    placeholder={t.communities.invitePlaceholder}
                    className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                  />
                  <button
                    disabled={inviteLoading || !inviteUsername}
                    onClick={async () => {
                      if (!slug) return
                      setInviteLoading(true)
                      setInviteError(null)
                      setInviteSuccess(null)
                      try {
                        await apiRequest(`/api/communities/${slug}/invite`, {
                          method: 'POST',
                          token,
                          body: { username: inviteUsername },
                        })
                        setInviteSuccess(t.communities.inviteSent)
                        setInviteUsername('')
                      } catch (e) {
                        if (e instanceof ApiError) setInviteError(e.message)
                        else setInviteError(t.common.errorGeneric)
                      } finally {
                        setInviteLoading(false)
                      }
                    }}
                    className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                  >
                    {inviteLoading ? '…' : t.communities.invite}
                  </button>
                </div>
              </div>
            ) : (
              <button
                disabled={isJoining}
                onClick={() => joinOrLeave('join')}
                className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {isJoining ? '…' : t.communities.join}
              </button>
            )}
          </div>
        </div>
        {joinError ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {joinError}
          </div>
        ) : null}
      </div>

      <div>
        <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">{t.communities.membersTitle}</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={async () => {
                const next = !showMembers
                setShowMembers(next)
                if (next && members.length === 0) await fetchMembers(1, false)
              }}
              className="rounded-md border border-zinc-200 bg-white px-3 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            >
              {showMembers ? t.communities.hide : `${t.communities.show} (${community.memberCount ?? 0})`}
            </button>
          </div>
        </div>

        {showMembers ? (
          <div className="mt-3 rounded-md border border-zinc-200 bg-white p-3 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-3 flex items-center gap-2">
              <input
                value={memberFilter}
                onChange={(e) => setMemberFilter(e.target.value)}
                placeholder={t.communities.search}
                className="flex-1 rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
              />
              <button
                onClick={() => fetchMembers(membersPage, false)}
                className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
              >
                {t.common.refresh}
              </button>
            </div>

            {membersError ? (
              <div className="mb-2 text-red-600">{membersError}</div>
            ) : null}

            {membersLoading ? (
              <div className="text-zinc-600">{t.common.loading}</div>
            ) : (
              <div className="space-y-2">
                {(members.filter((m) => m.username.toLowerCase().includes(memberFilter.toLowerCase()))).map((m) => {
                  const canManage = !!auth.user && (community.isOwner || community.membership?.role === 'ADMIN' || community.membership?.role === 'MODERATOR')
                  const isOwner = !!m.isOwner
                  return (
                    <div key={m.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar src={m.avatar ?? null} alt={m.username} size={36} />
                        <div>
                          <Link to={`/u/${m.username}`} className="font-medium">@{m.username}</Link>
                          <div className="text-xs text-zinc-500">{m.role}{isOwner ? t.communities.ownerLabel : ''}</div>
                        </div>
                      </div>
                      <div>
                        <button
                          disabled={!canManage || isOwner || removing[m.id]}
                          onClick={() => removeMember(m.id)}
                          className="rounded-md border border-red-200 bg-white px-3 py-1 text-sm text-red-600 disabled:opacity-50 dark:border-red-900/50 dark:bg-red-950/40"
                        >
                          {removing[m.id] ? '…' : t.communities.remove}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {membersPage < membersTotalPages ? (
              <div className="mt-3 text-center">
                <button
                  onClick={() => fetchMembers(membersPage + 1, true)}
                  className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                >
                  {t.common.loadMore}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <PostComposer
        communitySlug={community.slug}
        onPosted={async () => {
          await fetchPostsPage(1, false)
        }}
      />

      <div className="space-y-3">
        {posts.map((p) => (
          <article
            key={p.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex gap-3">
              <Avatar src={p.author.avatar ?? null} alt={p.author.username} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                  <Link
                    to={`/u/${p.author.username}`}
                    className="font-medium text-zinc-900 dark:text-zinc-100"
                  >
                    @{p.author.username}
                  </Link>
                  <span className="text-zinc-300 dark:text-zinc-700">·</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 className="h-4 w-4" />
                    {formatDate(p.createdAt)}
                  </span>
                </div>
                <RichContent content={p.content} />
                <MediaGrid media={p.media} />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-zinc-600 dark:text-zinc-400">
                    <button
                      onClick={() => toggleLike(p.id)}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <Heart
                        className={[
                          'h-4 w-4',
                          p.isLiked ? 'fill-red-500 text-red-500' : 'text-zinc-500',
                        ].join(' ')}
                      />
                      {p.likesCount ?? 0}
                    </button>
                    <button
                      onClick={() => setActiveCommentsPostId(p.id)}
                      className="inline-flex items-center gap-1 rounded-full px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      <MessageCircle className="h-4 w-4 text-zinc-500" />
                      {p.commentsCount ?? 0}
                    </button>
                  </div>
                  <Link
                    to={`/posts/${p.id}`}
                    className="rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-950"
                  >
                    {t.common.open}
                  </Link>
                </div>
              </div>
            </div>
          </article>
        ))}
        {!isLoading && posts.length === 0 ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">{t.posts.noPosts}</div>
        ) : null}
      </div>

      {!isLoading && (
        <div ref={sentinelRef} className="py-2 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {isLoadingMore ? t.common.loading : hasMore ? 'Ritini, lai ielādētu vēl…' : 'Vairs nav ierakstu'}
        </div>
      )}

      <CommentsModal
        postId={activeCommentsPostId}
        token={token}
        canComment={!!auth.user}
        isOpen={!!activeCommentsPostId}
        onClose={() => setActiveCommentsPostId(null)}
        onCommentAdded={() =>
          setPosts((curr) =>
            curr.map((p) =>
              p.id === activeCommentsPostId ? { ...p, commentsCount: (p.commentsCount ?? 0) + 1 } : p,
            ),
          )
        }
      />
    </div>
  )
}

