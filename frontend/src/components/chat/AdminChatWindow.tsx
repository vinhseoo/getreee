'use client'

import { useEffect, useRef, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth, ApiError } from '@/lib/apiClient'
import { toast } from '@/store/useToastStore'
import { ChatMessage } from '@/types/chat'
import { PageResponse } from '@/types/api'
import { MessageBubble } from './MessageBubble'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:8080/ws'

const QUICK_REPLIES = [
  'Cảm ơn bạn đã quan tâm! Vui lòng cho biết thêm yêu cầu.',
  'Sản phẩm hiện còn hàng, mời bạn thương lượng giá trực tiếp.',
  'Xin lỗi, sản phẩm này đã được bán. Mời bạn xem sản phẩm khác.',
  'Vui lòng để lại số điện thoại để admin liên hệ lại.',
]

interface Props {
  conversationId: number
  conversationUserId: number
}

export function AdminChatWindow({ conversationId, conversationUserId }: Props) {
  const { user, accessToken } = useAuthStore()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const clientRef = useRef<Client | null>(null)

  // Load history and mark as read
  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    Promise.all([
      apiFetchAuth<PageResponse<ChatMessage>>(
        `/api/admin/chat/conversations/${conversationId}/messages?size=50`,
        accessToken
      ),
      apiFetchAuth<void>(
        `/api/admin/chat/conversations/${conversationId}/read`,
        accessToken,
        { method: 'PATCH' }
      ),
    ])
      .then(([data]) => setMessages(data.content))
      .catch(() => toast.error('Không thể tải tin nhắn. Vui lòng thử lại.'))
      .finally(() => setLoading(false))
  }, [conversationId, accessToken])

  // WebSocket connection
  useEffect(() => {
    if (!accessToken) return

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000,
      onConnect: () => {
        setConnected(true)
        // Admin listens on the shared inbox topic
        client.subscribe('/topic/admin/inbox', (frame) => {
          const msg: ChatMessage = JSON.parse(frame.body)
          if (msg.conversationId === conversationId) {
            setMessages((prev) =>
              prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]
            )
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
  }, [accessToken, conversationId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || sending || !accessToken) return

    setSending(true)
    try {
      const saved = await apiFetchAuth<ChatMessage>(
        `/api/admin/chat/conversations/${conversationId}/messages`,
        accessToken,
        {
          method: 'POST',
          body: JSON.stringify({ content: text, productId: null }),
        }
      )
      setMessages((prev) =>
        prev.some((m) => m.id === saved.id) ? prev : [...prev, saved]
      )
      setInput('')
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Không thể gửi tin nhắn. Vui lòng thử lại.')
    } finally {
      setSending(false)
    }
  }

  if (!user) return null

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
        <h2 className="text-sm font-semibold text-text-primary">Cuộc trò chuyện</h2>
        <span
          className={`h-2 w-2 rounded-full ${connected ? 'bg-success' : 'bg-text-muted'}`}
          title={connected ? 'Đã kết nối' : 'Đang kết nối...'}
        />
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner className="h-5 w-5 text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-center text-sm text-text-muted">Chưa có tin nhắn nào.</p>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} currentUserId={user.id} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-surface-border p-3 space-y-2">
        {/* B3: Quick reply templates */}
        <div className="flex flex-wrap gap-1.5">
          {QUICK_REPLIES.map((reply) => (
            <button
              key={reply}
              onClick={() => setInput(reply)}
              className="rounded-full border border-surface-border bg-surface-muted px-3 py-1 text-xs text-text-secondary transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              {reply.length > 30 ? reply.slice(0, 30) + '…' : reply}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder="Trả lời khách hàng..."
            className="flex-1 rounded-btn border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-primary"
            disabled={sending}
          />
          <Button size="sm" onClick={sendMessage} disabled={!input.trim() || sending} loading={sending}>
            Gửi
          </Button>
        </div>
      </div>
    </div>
  )
}