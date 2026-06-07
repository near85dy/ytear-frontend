import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { apiRequest } from "../lib/http";
import { toUploadUrl } from "../lib/uploads";
import { normalizePage } from "../lib/pagination";
import type { MediaItem } from "../lib/media";
import { MediaGrid } from "../components/MediaGrid";
import { t } from "../i18n/t";
import { RichContent } from "../components/RichContent";

type User = {
  id: string;
  username: string;
  email?: string;
  avatar?: string | null;
  bio?: string | null;
  createdAt?: string;
};

type Post = {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; username: string };
  community?: { slug: string; name: string } | null;
  media?: MediaItem[];
};

type PageResult<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

export function ProfilePage() {
  const { username } = useParams();
  const auth = useAuth();
  const token = auth.token;
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<PageResult<Post> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const isOwnProfile = auth.user?.username === user?.username;

  useEffect(() => {
    if (!username) return;
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const u = await apiRequest<User>(`/api/users/${username}`);
        const raw = await apiRequest<any>(`/api/users/${username}/posts`, {
          query: { page: 1, limit: 20 },
        });
        if (!cancelled) {
          setUser(u);
          setPosts(normalizePage<Post>(raw));
        }
      } catch {
        if (!cancelled) setError(t.profile.failedLoad);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [username, token]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  function openAvatarPicker() {
    avatarInputRef.current?.click();
  }

  function resetAvatarSelection() {
    setAvatarFile(null);
    setAvatarPreviewUrl(null);
    setAvatarError(null);
    if (avatarInputRef.current) {
      avatarInputRef.current.value = "";
    }
  }

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const nextFile = e.target.files?.[0] ?? null;
    setAvatarError(null);

    if (!nextFile) {
      resetAvatarSelection();
      return;
    }

    if (!nextFile.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
      resetAvatarSelection();
      setAvatarError(t.profile.avatarInvalid);
      return;
    }

    setAvatarFile(nextFile);
    setAvatarPreviewUrl(URL.createObjectURL(nextFile));
  }

  async function uploadAvatar(e: FormEvent) {
    e.preventDefault();

    if (!auth.user) {
      return;
    }

    if (!avatarFile) {
      setAvatarError(t.profile.avatarSelectFile);
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarError(null);

    try {
      const fd = new FormData();
      fd.append("avatar", avatarFile);

      const res = await fetch("/api/users/me/avatar", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.message ?? t.profile.avatarUploadFailed);
      }

      const updatedUser = (await res.json()) as User;
      setUser(updatedUser);
      await auth.refreshMe();
      resetAvatarSelection();
    } catch (err) {
      setAvatarError(
        err instanceof Error ? err.message : t.profile.avatarUploadFailed,
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  if (isLoading)
    return (
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        {t.common.loading}
      </div>
    );
  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
        {error}
      </div>
    );
  }
  if (!user) return null;

  const avatarUrl = avatarPreviewUrl ?? toUploadUrl(user.avatar ?? null);
  const avatarFallback = user.username.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-4 md:grid-cols-[auto,1fr] md:items-start">
          <div className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={isOwnProfile ? openAvatarPicker : undefined}
              className={`group relative h-28 w-28 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 shadow-sm transition ${
                isOwnProfile
                  ? "cursor-pointer ring-0 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
                  : "cursor-default dark:border-zinc-800 dark:bg-zinc-800"
              }`}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-gradient-to-br from-zinc-200 via-zinc-100 to-zinc-300 text-3xl font-semibold text-zinc-600 dark:from-zinc-800 dark:via-zinc-700 dark:to-zinc-900 dark:text-zinc-300">
                  {avatarFallback}
                </span>
              )}
              {isOwnProfile ? (
                <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-xs font-semibold uppercase tracking-[0.24em] text-white opacity-0 transition group-hover:bg-black/45 group-hover:opacity-100">
                  {t.profile.avatarEdit}
                </span>
              ) : null}
            </button>
            {isOwnProfile ? (
              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
                {t.profile.avatarHint}
              </p>
            ) : null}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold">@{user.username}</h1>
                {user.bio ? (
                  <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
                    {user.bio}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    {t.profile.noBio}
                  </p>
                )}
              </div>
              {isOwnProfile ? (
                <Link
                  to="/settings"
                  className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
                >
                  {t.profile.settings}
                </Link>
              ) : null}
            </div>

            {isOwnProfile ? (
              <form
                onSubmit={uploadAvatar}
                className="mt-4 rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-950/40"
              >
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-sm font-medium">
                      {avatarFile ? avatarFile.name : t.profile.avatarTitle}
                    </div>
                    <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                      {t.profile.avatarDescription}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={openAvatarPicker}
                      className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      {t.profile.avatarChoose}
                    </button>
                    <button
                      type="button"
                      onClick={resetAvatarSelection}
                      disabled={!avatarFile && !avatarPreviewUrl}
                      className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-zinc-900"
                    >
                      {t.profile.avatarClear}
                    </button>
                    <button
                      type="submit"
                      disabled={!avatarFile || isUploadingAvatar}
                      className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
                    >
                      {isUploadingAvatar
                        ? t.profile.avatarUploading
                        : t.profile.avatarSave}
                    </button>
                  </div>
                </div>

                {avatarError ? (
                  <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
                    {avatarError}
                  </div>
                ) : null}
              </form>
            ) : null}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {(posts?.items ?? []).map((p) => (
          <article
            key={p.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-600 dark:text-zinc-400">
              <span>{formatDate(p.createdAt)}</span>
              {p.community?.slug ? (
                <>
                  <span>·</span>
                  <Link to={`/c/${p.community.slug}`} className="underline">
                    c/{p.community.slug}
                  </Link>
                </>
              ) : null}
            </div>
            <RichContent content={p.content} />
            <MediaGrid media={p.media} />
            <div className="mt-3 flex items-center justify-end">
              <Link
                to={`/posts/${p.id}`}
                className="rounded-md px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-950"
              >
                {t.common.open}
              </Link>
            </div>
          </article>
        ))}
        {posts && posts.items.length === 0 ? (
          <div className="text-sm text-zinc-600 dark:text-zinc-400">
            {t.posts.noPosts}
          </div>
        ) : null}
      </div>
    </div>
  );
}
