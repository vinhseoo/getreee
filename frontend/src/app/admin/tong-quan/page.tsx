'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { toast } from '@/store/useToastStore'
import { Spinner } from '@/components/ui/Spinner'

interface DashboardStats {
  totalProducts: number
  availableProducts: number
  totalConversations: number
  unreadMessages: number
  totalUsers: number
}

interface StatCard {
  label: string
  value: number | string
  sub?: string
  href?: string
  accent: string
}

export default function AdminDashboardPage() {
  const { accessToken } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) return
    apiFetchAuth<DashboardStats>('/api/admin/dashboard/stats', accessToken)
      .then(setStats)
      .catch(() => toast.error('Không thể tải thống kê. Vui lòng thử lại.'))
      .finally(() => setLoading(false))
  }, [accessToken])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )
  }

  if (!stats) return null

  const cards: StatCard[] = [
    {
      label: 'Sản phẩm đang bán',
      value: stats.availableProducts,
      sub: `${stats.totalProducts} tổng cộng`,
      href: '/admin/san-pham',
      accent: 'bg-primary/10 text-primary',
    },
    {
      label: 'Tin nhắn chưa đọc',
      value: stats.unreadMessages,
      sub: `${stats.totalConversations} cuộc trò chuyện`,
      href: '/admin/chat',
      accent: stats.unreadMessages > 0 ? 'bg-danger/10 text-danger' : 'bg-surface-muted text-text-muted',
    },
    {
      label: 'Người dùng',
      value: stats.totalUsers,
      href: '/admin/nguoi-dung',
      accent: 'bg-success/10 text-success',
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-text-primary">Tổng quan</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card) => {
          const inner = (
            <div className="rounded-card border border-surface-border bg-surface p-5 shadow-card transition-shadow hover:shadow-md">
              <p className="text-sm text-text-muted">{card.label}</p>
              <p className={`mt-2 text-3xl font-bold ${card.accent.split(' ')[1]}`}>
                {card.value}
              </p>
              {card.sub && (
                <p className="mt-1 text-xs text-text-muted">{card.sub}</p>
              )}
              <div className={`mt-4 h-1 w-12 rounded-full ${card.accent.split(' ')[0]}`} />
            </div>
          )
          return card.href ? (
            <Link key={card.label} href={card.href}>
              {inner}
            </Link>
          ) : (
            <div key={card.label}>{inner}</div>
          )
        })}
      </div>
    </div>
  )
}
