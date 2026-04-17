'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { Spinner } from '@/components/ui/Spinner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!initialized) return
    if (!user) router.replace('/dang-nhap')
  }, [initialized, user, router])

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}