import { create } from 'zustand'
import { ChatMessage, Conversation } from '@/types/chat'

interface ChatState {
  conversation: Conversation | null
  messages: ChatMessage[]
  connected: boolean
  setConversation: (c: Conversation) => void
  clearUnread: () => void
  setMessages: (msgs: ChatMessage[]) => void
  appendMessage: (msg: ChatMessage) => void
  setConnected: (v: boolean) => void
  reset: () => void
}

export const useChatStore = create<ChatState>((set) => ({
  conversation: null,
  messages: [],
  connected: false,
  setConversation: (conversation) => set({ conversation }),
  clearUnread: () =>
    set((s) =>
      s.conversation ? { conversation: { ...s.conversation, unreadCount: 0 } } : {}
    ),
  setMessages: (messages) => set({ messages }),
  appendMessage: (msg) =>
    set((s) => ({
      messages: s.messages.some((m) => m.id === msg.id)
        ? s.messages
        : [...s.messages, msg],
    })),
  setConnected: (connected) => set({ connected }),
  reset: () => set({ conversation: null, messages: [], connected: false }),
}))