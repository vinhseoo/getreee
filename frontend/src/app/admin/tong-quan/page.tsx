'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { toast } from '@/store/useToastStore'
import { Conversation } from '@/types/chat'
import { PageResponse } from '@/types/api'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'

interface DashboardStats {
  totalProducts: number
  availableProducts: number
  totalConversations: number
  unreadMessages: number
  totalUsers: number
}

export default function AdminDashboardPage() {
  const { accessToken } = useAuthStore()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) return
    Promise.all([
      apiFetchAuth<DashboardStats>('/api/admin/dashboard/stats', accessToken),
      apiFetchAuth<PageResponse<Conversation>>('/api/admin/chat/conversations?size=10', accessToken),
    ])
      .then(([s, convPage]) => {
        setStats(s)
        setConversations(convPage.content)
      })
      .catch(() => toast.error('Không thể tải dữ liệu tổng quan.'))
      .finally(() => setLoading(false))
  }, [accessToken])

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner className="h-6 w-6 text-primary" /></div>
  }
  if (!stats) return null

  const unreadConvs = conversations.filter(c => c.unreadCount > 0)

  const statCards = [
    {
      label: 'Sản phẩm đang bán',
      value: stats.availableProducts,
      sub: `${stats.totalProducts} tổng cộng`,
      href: '/admin/san-pham',
      color: 'text-primary',
      bar: 'bg-primary/20',
    },
    {
      label: 'Tin nhắn chưa đọc',
      value: stats.unreadMessages,
      sub: `${stats.totalConversations} cuộc trò chuyện`,
      href: '/admin/chat',
      color: stats.unreadMessages > 0 ? 'text-danger' : 'text-text-muted',
      bar: stats.unreadMessages > 0 ? 'bg-danger/20' : 'bg-surface-border',
    },
    {
      label: 'Người dùng',
      value: stats.totalUsers,
      href: '/admin/nguoi-dung',
      color: 'text-success',
      bar: 'bg-success/20',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Tổng quan</h1>
      </div>

      {/* C2: Quick actions */}
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/san-pham/tao-moi">
          <Button size="sm">+ Thêm sản phẩm</Button>
        </Link>
        <Link href="/admin/chat">
          <Button size="sm" variant={stats.unreadMessages > 0 ? 'danger' : 'ghost'}>
            {stats.unreadMessages > 0
              ? `Trả lời ${stats.unreadMessages} tin nhắn chưa đọc`
              : 'Xem hộp thư'}
          </Button>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}>
            <div className="rounded-card border border-surface-border bg-surface p-5 shadow-card transition-shadow hover:shadow-card-hover">
              <p className="text-sm text-text-muted">{card.label}</p>
              <p className={`mt-2 text-3xl font-bold ${card.color}`}>{card.value}</p>
              {card.sub && <p className="mt-1 text-xs text-text-muted">{card.sub}</p>}
              <div className={`mt-4 h-1 w-12 rounded-full ${card.bar}`} />
            </div>
          </Link>
        ))}
      </div>

      {/* C1: Feed "Cần xử lý ngay" */}
      {unreadConvs.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-text-primary">
              Cần xử lý ngay
              <span className="ml-2 rounded-full bg-danger/10 px-2 py-0.5 text-xs font-bold text-danger">
                {unreadConvs.length}
              </span>
            </h2>
            <Link href="/admin/chat" className="text-xs text-primary hover:underline">
              Xem tất cả →
            </Link>
          </div>

          <ul className="divide-y divide-surface-border rounded-card border border-surface-border bg-surface shadow-card">
            {unreadConvs.slice(0, 5).map((conv) => (
              <li key={conv.id}>
                <Link
                  href={`/admin/chat/${conv.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-muted"
                >
                  {conv.userAvatarUrl ? (
                    <Image src={conv.userAvatarUrl} alt={conv.userName}
                      width={36} height={36} className="shrink-0 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {conv.userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text-primary">{conv.userName}</p>
                    {conv.lastMessage && (
                      <p className="truncate text-xs text-text-muted">{conv.lastMessage}</p>
                    )}
                  </div>
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-danger px-1 text-xs font-bold text-white">
                    {conv.unreadCount}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {unreadConvs.length === 0 && (
        <div className="rounded-card border border-surface-border bg-surface-muted px-5 py-4 text-sm text-text-muted">
          Không có tin nhắn chưa đọc. Mọi thứ đã được xử lý.
        </div>
      )}
    </div>
  )
}
