import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/http'

export type AuthUser = {
  id: string
  email: string
  username: string
  avatar: string | null
  bio: string | null
  createdAt: string
}

type AuthState = {
  user: AuthUser | null
  token: string | null
  isLoading: boolean
  login: (p: { emailOrUsername: string; password: string }) => Promise<void>
  register: (p: { email: string; username: string; password: string }) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthCtx = createContext<AuthState | null>(null)

const LS_TOKEN_KEY = 'ytear.token'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(LS_TOKEN_KEY))
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function refreshMe() {
    if (!token) {
      setUser(null)
      return
    }
    const me = await apiRequest<AuthUser>('/api/auth/me', { token })
    setUser(me)
  }

  async function login(p: { emailOrUsername: string; password: string }) {
    const res = await apiRequest<{ user: AuthUser; accessToken: string }>('/api/auth/login', {
      method: 'POST',
      body: p,
    })
    localStorage.setItem(LS_TOKEN_KEY, res.accessToken)
    setToken(res.accessToken)
    setUser(res.user)
  }

  async function register(p: { email: string; username: string; password: string }) {
    const res = await apiRequest<{ user: AuthUser; accessToken: string }>('/api/auth/register', {
      method: 'POST',
      body: p,
    })
    localStorage.setItem(LS_TOKEN_KEY, res.accessToken)
    setToken(res.accessToken)
    setUser(res.user)
  }

  function logout() {
    localStorage.removeItem(LS_TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        if (token) await refreshMe()
      } catch {
        if (!cancelled) logout()
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      isLoading,
      login,
      register,
      logout,
      refreshMe,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, token, isLoading],
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

