'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/store/useAuthStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { toast } from '@/store/useToastStore'
import { Conversation } from '@/types/chat'
import { PageResponse } from '@/types/api'
import { Spinner } from '@/components/ui/Spinner'

type Filter = 'all' | 'unread'

export default function AdminChatInboxPage() {
  const { accessToken } = useAuthStore()
  const reset = useNotificationStore((s) => s.reset)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('all')

  useEffect(() => { reset() }, [reset])

  useEffect(() => {
    if (!accessToken) return
    apiFetchAuth<PageResponse<Conversation>>(
      '/api/admin/chat/conversations?size=50',
      accessToken
    )
      .then((data) => setConversations(data.content))
      .catch(() => toast.error('Không thể tải danh sách hội thoại. Vui lòng thử lại.'))
      .finally(() => setLoading(false))
  }, [accessToken])

  const unreadCount = conversations.filter(c => c.unreadCount > 0).length
  const displayed = filter === 'unread'
    ? conversations.filter(c => c.unreadCount > 0)
    : conversations

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-text-primary">Hộp thư trò chuyện</h1>

      {/* B2: Filter tabs */}
      <div className="flex gap-1 rounded-btn border border-surface-border bg-surface-muted p-1 w-fit">
        {([['all', 'Tất cả', conversations.length], ['unread', 'Chưa đọc', unreadCount]] as const).map(
          ([value, label, count]) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`rounded px-3 py-1 text-sm font-medium transition-colors ${
                filter === value
                  ? 'bg-surface text-text-primary shadow-sm'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              {label}
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                filter === value ? 'bg-primary/10 text-primary' : 'bg-surface-border text-text-muted'
              }`}>
                {count}
              </span>
            </button>
          )
        )}
      </div>

      {displayed.length === 0 ? (
        <p className="text-sm text-text-muted">
          {filter === 'unread' ? 'Không có tin nhắn chưa đọc.' : 'Chưa có khách hàng nào nhắn tin.'}
        </p>
      ) : (
        <ul className="divide-y divide-surface-border rounded-card border border-surface-border bg-surface shadow-card">
          {displayed.map((conv) => (
            <li key={conv.id}>
              <Link
                href={`/admin/chat/${conv.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted transition-colors"
              >
                {/* Avatar */}
                {conv.userAvatarUrl ? (
                  <Image
                    src={conv.userAvatarUrl}
                    alt={conv.userName}
                    width={40}
                    height={40}
                    className="shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {conv.userName.charAt(0).toUpperCase()}
                  </div>
                )}

                {/* B1: Name + last message preview */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`truncate text-sm ${conv.unreadCount > 0 ? 'font-semibold text-text-primary' : 'font-medium text-text-primary'}`}>
                      {conv.userName}
                    </p>
                    {conv.lastMessageAt && (
                      <span className="shrink-0 text-xs text-text-muted">
                        {new Date(conv.lastMessageAt).toLocaleString('vi-VN', {
                          day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                  {conv.lastMessage && (
                    <p className={`truncate text-xs mt-0.5 ${conv.unreadCount > 0 ? 'text-text-secondary' : 'text-text-muted'}`}>
                      {conv.lastMessage}
                    </p>
                  )}
                </div>

                {/* Unread badge */}
                {conv.unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-danger px-1 text-xs font-bold text-white">
                    {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
