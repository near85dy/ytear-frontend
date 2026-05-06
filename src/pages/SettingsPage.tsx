import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { ApiError, apiRequest } from '../lib/http'
import { localizeServerError } from '../lib/serverErrors'
import { t } from '../i18n/t'

export function SettingsPage() {
  const auth = useAuth()
  const nav = useNavigate()
  const token = auth.token

  const [username, setUsername] = useState(auth.user?.username ?? '')
  const [bio, setBio] = useState(auth.user?.bio ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  useEffect(() => {
    setUsername(auth.user?.username ?? '')
    setBio(auth.user?.bio ?? '')
  }, [auth.user])

  async function saveProfile(e: FormEvent) {
    e.preventDefault()
    if (!auth.user) {
      nav('/login')
      return
    }
    setIsSaving(true)
    setError(null)
    try {
      await apiRequest('/api/users/me', {
        method: 'PATCH',
        token,
        body: { username: username || undefined, bio: bio || undefined },
      })
      await auth.refreshMe()
    } catch (e) {
      if (e instanceof ApiError) setError(e.message)
      else setError(t.settings.failedSave)
    } finally {
      setIsSaving(false)
    }
  }

  async function uploadAvatar(e: FormEvent) {
    e.preventDefault()
    if (!auth.user) {
      nav('/login')
      return
    }
    if (!avatarFile) {
      setUploadError(t.settings.chooseFile)
      return
    }
    setIsUploading(true)
    setUploadError(null)
    try {
      const fd = new FormData()
      fd.append('avatar', avatarFile)
      const res = await fetch('/api/users/me/avatar', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: fd,
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        throw new ApiError(localizeServerError(payload, res.status), res.status, payload)
      }
      await auth.refreshMe()
      setAvatarFile(null)
    } catch (e) {
      if (e instanceof ApiError) setUploadError(e.message)
      else setUploadError(t.settings.failedUpload)
    } finally {
      setIsUploading(false)
    }
  }

  if (!auth.user) {
    return (
      <div className="rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
        {t.settings.needAuth}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold">{t.settings.title}</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{t.settings.subtitle}</p>
      </div>

      <form
        onSubmit={saveProfile}
        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="text-sm font-medium">{t.settings.profile}</div>

        <label className="mt-3 block">
          <div className="mb-1 text-sm">Username</div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            disabled={isSaving}
          />
        </label>

        <label className="mt-3 block">
          <div className="mb-1 text-sm">{t.settings.bio}</div>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="w-full resize-y rounded-md border border-zinc-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-950"
            disabled={isSaving}
          />
        </label>

        {error ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {error}
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-end">
          <button
            disabled={isSaving}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {isSaving ? t.settings.saving : t.common.save}
          </button>
        </div>
      </form>

      <form
        onSubmit={uploadAvatar}
        className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
      >
        <div className="text-sm font-medium">{t.settings.avatar}</div>
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
          className="mt-3 block w-full text-sm"
          disabled={isUploading}
        />
        {uploadError ? (
          <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-200">
            {uploadError}
          </div>
        ) : null}
        <div className="mt-3 flex items-center justify-end">
          <button
            disabled={isUploading}
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
          >
            {isUploading ? t.settings.uploading : t.settings.upload}
          </button>
        </div>
      </form>
    </div>
  )
}

