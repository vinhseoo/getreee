'use client'

import { useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { UserProfile } from '@/types/user'
import { Spinner } from '@/components/ui/Spinner'

/**
 * Reads ?token from the OAuth2 redirect URL, fetches the user profile,
 * stores it in Zustand, then navigates to the appropriate home page.
 */
export function AuthCallbackHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setAuth, setInitialized } = useAuthStore()
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true

    const token = searchParams.get('token')
    if (!token) {
      router.replace('/dang-nhap')
      return
    }

    apiFetchAuth<UserProfile>('/api/auth/me', token)
      .then(user => {
        setAuth(token, user)
        setInitialized()
        router.replace(user.role === 'ADMIN' ? '/admin/san-pham' : '/')
      })
      .catch(() => {
        setInitialized()
        router.replace('/dang-nhap')
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Spinner className="h-8 w-8 text-primary" />
    </div>
  )
}