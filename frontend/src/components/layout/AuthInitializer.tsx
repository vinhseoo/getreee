'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Rendered in the root layout. On every page load it attempts a silent token
 * refresh via the HttpOnly refresh cookie. If the cookie is missing or expired
 * the call fails silently and the store remains empty (user is logged out).
 * Sets `initialized: true` when done so auth-guarded layouts know it's safe to check.
 */
export function AuthInitializer() {
  const { refresh } = useAuth()
  const setInitialized = useAuthStore(s => s.setInitialized)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { refresh().finally(setInitialized) }, [])
  return null
}