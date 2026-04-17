'use client'

import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuthStore } from '@/store/useAuthStore'
import { useChatStore } from '@/store/useChatStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { ChatMessage } from '@/types/chat'
import { PageResponse } from '@/types/api'
import { MessageBubble } from './MessageBubble'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:8080/ws'
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

interface Props {
  conversationId: number
}

export function ChatWindow({ conversationId }: Props) {
  const { user, accessToken } = useAuthStore()
  const { messages, connected, setMessages, appendMessage, setConnected } = useChatStore()

  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const clientRef = useRef<Client | null>(null)

  // Load message history
  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    apiFetchAuth<PageResponse<ChatMessage>>(
      `/api/user/chat/conversation/${conversationId}/messages?size=50`,
      accessToken
    )
      .then((data) => setMessages(data.content))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [conversationId, accessToken, setMessages])

  // Connect WebSocket
  useEffect(() => {
    if (!accessToken) return

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)
        client.subscribe(`/user/queue/messages`, (frame) => {
          const msg: ChatMessage = JSON.parse(frame.body)
          if (msg.conversationId === conversationId) {
            appendMessage(msg)
          }
        })
      },
      onDisconnect: () => setConnected(false),
      onStompError: () => setConnected(false),
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
      setConnected(false)
    }
  }, [accessToken, conversationId, appendMessage, setConnected])

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    const text = input.trim()
    if (!text || !clientRef.current?.connected) return

    setSending(true)
    clientRef.current.publish({
      destination: '/app/chat.send',
      body: JSON.stringify({ conversationId, content: text, productId: null }),
    })
    setInput('')
    setSending(false)
  }

  if (!user) return null

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <h2 className="text-sm font-semibold text-text-primary">Trò chuyện với Admin</h2>
        <span
          className={`h-2 w-2 rounded-full ${connected ? 'bg-success' : 'bg-text-muted'}`}
          title={connected ? 'Đã kết nối' : 'Đang kết nối...'}
        />
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-5 w-5 text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-text-muted">
            Gửi tin nhắn để bắt đầu thương lượng.
          </p>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentUserId={user.id} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-surface-border p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 rounded-btn border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-primary"
            disabled={!connected}
          />
          <Button
            size="sm"
            onClick={sendMessage}
            disabled={!input.trim() || !connected}
            loading={sending}
          >
            Gửi
          </Button>
        </div>
        {!connected && (
          <p className="mt-1 text-xs text-text-muted">Đang kết nối...</p>
        )}
      </div>
    </div>
  )
}