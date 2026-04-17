'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { Conversation } from '@/types/chat'
import { PageResponse } from '@/types/api'
import { Spinner } from '@/components/ui/Spinner'

export default function AdminChatInboxPage() {
  const { accessToken } = useAuthStore()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!accessToken) return
    apiFetchAuth<PageResponse<Conversation>>(
      '/api/admin/chat/conversations?size=50',
      accessToken
    )
      .then((data) => setConversations(data.content))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [accessToken])

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

      {conversations.length === 0 ? (
        <p className="text-sm text-text-muted">Chưa có khách hàng nào nhắn tin.</p>
      ) : (
        <ul className="divide-y divide-surface-border rounded-card border border-surface-border bg-surface shadow-card">
          {conversations.map((conv) => (
            <li key={conv.id}>
              <Link
                href={`/admin/chat/${conv.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted transition-colors"
              >
                {conv.userAvatarUrl ? (
                  <Image
                    src={conv.userAvatarUrl}
                    alt={conv.userName}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-surface-border" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {conv.userName}
                  </p>
                  {conv.lastMessageAt && (
                    <p className="text-xs text-text-muted">
                      {new Date(conv.lastMessageAt).toLocaleString('vi-VN')}
                    </p>
                  )}
                </div>
                {conv.unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-white">
                    {conv.unreadCount}
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