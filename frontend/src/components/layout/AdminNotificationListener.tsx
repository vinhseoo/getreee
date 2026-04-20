'use client'

import { useEffect, useRef } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuthStore } from '@/store/useAuthStore'
import { useNotificationStore } from '@/store/useNotificationStore'
import { ChatMessage } from '@/types/chat'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'http://localhost:8080/ws'

export function AdminNotificationListener() {
  const { accessToken, user } = useAuthStore()
  const increment = useNotificationStore((s) => s.increment)
  const clientRef = useRef<Client | null>(null)

  useEffect(() => {
    if (!accessToken || user?.role !== 'ADMIN') return

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_URL),
      connectHeaders: { Authorization: `Bearer ${accessToken}` },
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/admin/inbox', (frame) => {
          const msg: ChatMessage = JSON.parse(frame.body)
          // Only count messages from users, not admin's own sends
          if (msg.senderId !== user.id) {
            increment()
          }
        })
      },
    })

    client.activate()
    clientRef.current = client

    return () => {
      client.deactivate()
    }
  }, [accessToken, user, increment])

  return null
}
