'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { Conversation } from '@/types/chat'
import { AdminChatWindow } from '@/components/chat/AdminChatWindow'
import { Spinner } from '@/components/ui/Spinner'

interface Props {
  params: { id: string }
}

export default function AdminConversationPage({ params }: Props) {
  const { accessToken } = useAuthStore()
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [loading, setLoading] = useState(true)

  const conversationId = Number(params.id)

  useEffect(() => {
    if (!accessToken) return
    apiFetchAuth<{ content: Conversation[] }>(
      `/api/admin/chat/conversations?size=100`,
      accessToken
    )
      .then((data) => {
        const found = data.content.find((c) => c.id === conversationId)
        setConversation(found ?? null)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [accessToken, conversationId])

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )
  }

  if (!conversation) {
    return <p className="text-sm text-text-muted">Không tìm thấy cuộc trò chuyện.</p>
  }

  return (
    <div className="flex h-full flex-col space-y-3">
      <div className="flex items-center gap-3">
        <Link href="/admin/chat" className="text-sm text-text-secondary hover:text-primary">
          ← Hộp thư
        </Link>
        <span className="text-sm text-text-muted">/</span>
        <span className="text-sm font-medium text-text-primary">{conversation.userName}</span>
      </div>

      <div
        className="overflow-hidden rounded-card border border-surface-border bg-surface shadow-card"
        style={{ height: 'calc(100vh - 180px)' }}
      >
        <AdminChatWindow
          conversationId={conversation.id}
          conversationUserId={conversation.userId}
        />
      </div>
    </div>
  )
}