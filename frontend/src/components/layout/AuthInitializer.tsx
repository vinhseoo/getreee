'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAuthStore } from '@/store/useAuthStore'

/**
 * Rendered in the root layout. Attempts a silent token refresh on every page
 * load via the HttpOnly refresh cookie, then schedules the next refresh 60 s
 * before expiry so the session stays alive as long as the tab is open.
 */
export function AuthInitializer() {
  const { refresh } = useAuth()
  const setInitialized = useAuthStore(s => s.setInitialized)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    async function doRefresh() {
      const result = await refresh()
      if (result) {
        const delayMs = Math.max((result.expiresIn - 60) * 1000, 30_000)
        timer = setTimeout(doRefresh, delayMs)
      }
    }

    doRefresh().finally(setInitialized)
    return () => clearTimeout(timer)
  }, [])

  return null
}