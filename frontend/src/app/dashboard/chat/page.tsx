'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useChatStore } from '@/store/useChatStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { Conversation } from '@/types/chat'
import { ChatWindow } from '@/components/chat/ChatWindow'
import { Header } from '@/components/layout/Header'
import { Spinner } from '@/components/ui/Spinner'

export default function UserChatPage() {
  const { accessToken } = useAuthStore()
  const { setConversation, conversation } = useChatStore()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken || conversation) return
    apiFetchAuth<Conversation>('/api/user/chat/conversation', accessToken)
      .then(setConversation)
      .catch(() => setError('Không thể tải cuộc trò chuyện. Vui lòng thử lại.'))
  }, [accessToken, conversation, setConversation])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col p-4">
        <h1 className="mb-4 text-xl font-bold text-text-primary">Nhắn tin thương lượng</h1>

        {error && (
          <div className="rounded-btn bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
        )}

        {!conversation ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="h-6 w-6 text-primary" />
          </div>
        ) : (
          <div className="flex-1 overflow-hidden rounded-card border border-surface-border bg-surface shadow-card"
               style={{ height: 'calc(100vh - 200px)' }}>
            <ChatWindow conversationId={conversation.id} />
          </div>
        )}
      </main>
    </div>
  )
}