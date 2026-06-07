import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../auth/AuthProvider";
import { apiRequest, ApiError } from "../lib/http";
import { t } from "../i18n/t";

type Stats = {
  users: number;
  admins: number;
  posts: number;
  comments: number;
  communities: number;
  media: number;
  likes: number;
};

type AdminUser = {
  id: string;
  email: string;
  username: string;
  isAdmin: boolean;
  avatar: string | null;
  bio: string | null;
  createdAt: string;
  postsCount: number;
  commentsCount: number;
  communitiesCount: number;
};

type AdminPost = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string; email: string; isAdmin: boolean };
  community: { id: string; name: string; slug: string } | null;
  commentsCount: number;
  likesCount: number;
};

type AdminComment = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string; email: string; isAdmin: boolean };
  post: { id: string; content: string };
  repliesCount: number;
};

type Section = "users" | "posts" | "comments";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export function AdminPage() {
  const auth = useAuth();
  const token = auth.token;

  const [section, setSection] = useState<Section>("users");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [comments, setComments] = useState<AdminComment[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function loadData() {
    if (!token || !auth.user?.isAdmin) return;
    setLoading(true);
    setError(null);
    try {
      const statsRes = await apiRequest<Stats>("/api/admin/stats", { token });
      setStats(statsRes);

      if (section === "users") {
        const listRes = await apiRequest<{ users: AdminUser[] }>(
          "/api/admin/users",
          {
            token,
            query: { page: 1, limit: 50, search: query || undefined },
          },
        );
        setUsers(listRes.users ?? []);
        setPosts([]);
        setComments([]);
      } else if (section === "posts") {
        const listRes = await apiRequest<{ posts: AdminPost[] }>(
          "/api/admin/posts",
          {
            token,
            query: { page: 1, limit: 50, search: query || undefined },
          },
        );
        setPosts(listRes.posts ?? []);
        setUsers([]);
        setComments([]);
      } else {
        const listRes = await apiRequest<{ comments: AdminComment[] }>(
          "/api/admin/comments",
          {
            token,
            query: { page: 1, limit: 50, search: query || undefined },
          },
        );
        setComments(listRes.comments ?? []);
        setUsers([]);
        setPosts([]);
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t.common.errorGeneric);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section, query, token, auth.user?.isAdmin]);

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setQuery(search.trim());
  }

  async function deleteUser(userId: string) {
    if (!confirm(t.admin.deleteUser)) return;
    await apiRequest(`/api/admin/users/${userId}`, { method: "DELETE", token });
    setNotice(t.admin.userDeleted);
    await loadData();
  }

  async function resetPassword(userId: string) {
    const temporaryPassword = window.prompt(t.admin.promptPassword) ?? "";
    const res = await apiRequest<{
      message: string;
      temporaryPassword: string;
    }>(`/api/admin/users/${userId}/reset-password`, {
      method: "POST",
      token,
      body: temporaryPassword ? { newPassword: temporaryPassword } : {},
    });
    setNotice(`${t.admin.passwordResetDone}: ${res.temporaryPassword}`);
  }

  async function deletePost(postId: string) {
    if (!confirm(t.admin.deletePost)) return;
    await apiRequest(`/api/admin/posts/${postId}`, { method: "DELETE", token });
    setNotice(t.admin.postDeleted);
    await loadData();
  }

  async function deleteComment(commentId: string) {
    if (!confirm(t.admin.deleteComment)) return;
    await apiRequest(`/api/admin/comments/${commentId}`, {
      method: "DELETE",
      token,
    });
    setNotice(t.admin.commentDeleted);
    await loadData();
  }

  if (!auth.user) {
    if (auth.isLoading) {
      return (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {t.common.loading}
        </div>
      );
    }
    return (
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        {t.admin.noAccess}
      </div>
    );
  }

  if (!auth.user.isAdmin) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-white p-4 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        {t.admin.noAccess}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-2xl font-semibold">{t.admin.title}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          {t.admin.subtitle}
        </p>
      </div>

      {stats ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[
            [t.admin.totalUsers, stats.users],
            [t.admin.totalAdmins, stats.admins],
            [t.admin.totalPosts, stats.posts],
            [t.admin.totalComments, stats.comments],
            [t.admin.totalCommunities, stats.communities],
            [t.admin.totalMedia, stats.media],
            [t.admin.totalLikes, stats.likes],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="text-xs uppercase tracking-[0.18em] text-zinc-500 dark:text-zinc-400">
                {label}
              </div>
              <div className="mt-2 text-2xl font-semibold">{value}</div>
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
        {(["users", "posts", "comments"] as Section[]).map((item) => (
          <button
            key={item}
            onClick={() => setSection(item)}
            className={`rounded-full px-3 py-2 text-sm font-medium transition ${
              section === item
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            }`}
          >
            {item === "users"
              ? t.admin.users
              : item === "posts"
                ? t.admin.posts
                : t.admin.comments}
          </button>
        ))}

        <form
          onSubmit={handleSearch}
          className="ml-auto flex w-full gap-2 sm:w-auto"
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.admin.searchPlaceholder}
            className="min-w-0 flex-1 rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950 sm:w-80"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
          >
            {t.admin.search}
          </button>
          <button
            type="button"
            onClick={() => void loadData()}
            className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium dark:border-zinc-800"
          >
            {t.admin.refresh}
          </button>
        </form>
      </div>

      {notice ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-200">
          {notice}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="text-sm text-zinc-600 dark:text-zinc-400">
          {t.common.loading}
        </div>
      ) : section === "users" ? (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="font-semibold">@{user.username}</div>
                    <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">
                      {user.isAdmin ? t.admin.roleAdmin : t.admin.roleUser}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    {user.email}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(user.createdAt)} · {user.postsCount} /{" "}
                    {user.commentsCount} / {user.communitiesCount}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => void resetPassword(user.id)}
                    className="rounded-md border border-zinc-200 px-3 py-2 text-sm font-medium dark:border-zinc-800"
                  >
                    {t.admin.resetPassword}
                  </button>
                  <button
                    onClick={() => void deleteUser(user.id)}
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white"
                  >
                    {t.admin.deleteUser}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : section === "posts" ? (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    @{post.author.username}{" "}
                    {post.author.isAdmin ? `· ${t.admin.roleAdmin}` : ""}
                  </div>
                  <div className="mt-1 line-clamp-3 text-sm">
                    {post.content}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(post.createdAt)} · {post.likesCount} /{" "}
                    {post.commentsCount}
                  </div>
                </div>
                <button
                  onClick={() => void deletePost(post.id)}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white"
                >
                  {t.admin.deletePost}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">
                    @{comment.author.username}{" "}
                    {comment.author.isAdmin ? `· ${t.admin.roleAdmin}` : ""}
                  </div>
                  <div className="mt-1 line-clamp-2 text-sm">
                    {comment.content}
                  </div>
                  <div className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    {formatDate(comment.createdAt)} · replies{" "}
                    {comment.repliesCount}
                  </div>
                </div>
                <button
                  onClick={() => void deleteComment(comment.id)}
                  className="rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white"
                >
                  {t.admin.deleteComment}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
