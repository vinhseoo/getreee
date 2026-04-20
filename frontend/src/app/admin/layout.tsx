'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { AdminNotificationListener } from '@/components/layout/AdminNotificationListener'
import { Spinner } from '@/components/ui/Spinner'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, initialized } = useAuthStore()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!initialized) return
    if (!user || user.role !== 'ADMIN') {
      router.replace('/dang-nhap')
    }
  }, [initialized, user, router])

  if (!initialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    )
  }

  if (!user || user.role !== 'ADMIN') return null

  return (
    <div className="flex min-h-screen">
      <AdminNotificationListener />
      <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile top bar with hamburger */}
        <div className="flex h-14 shrink-0 items-center gap-3 border-b border-surface-border bg-surface px-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-btn p-1.5 text-text-secondary hover:bg-surface-muted"
            aria-label="Mở menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-base font-bold text-primary">Gà Tre — Quản trị</span>
        </div>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}