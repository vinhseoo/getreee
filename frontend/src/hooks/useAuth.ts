'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetch, apiFetchAuth } from '@/lib/apiClient'
import { UserProfile } from '@/types/user'

export function useAuth() {
  const { accessToken, user, setAuth, clearAuth } = useAuthStore()
  const router = useRouter()

  /** Called by AuthInitializer on every page load — re-issues access token via cookie. */
  async function refresh(): Promise<string | null> {
    try {
      const data = await apiFetch<{ accessToken: string; expiresIn: number }>(
        '/api/auth/refresh',
        { method: 'POST' }
      )
      const profile = await apiFetchAuth<UserProfile>('/api/auth/me', data.accessToken)
      setAuth(data.accessToken, profile)
      return data.accessToken
    } catch {
      clearAuth()
      return null
    }
  }

  async function logout() {
    try { await apiFetch('/api/auth/logout', { method: 'POST' }) } catch { /* silent */ }
    clearAuth()
    router.push('/dang-nhap')
  }

  return { accessToken, user, refresh, logout }
}