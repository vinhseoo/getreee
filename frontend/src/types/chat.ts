export interface ProductSnapshot {
  id: number
  productCode: string | null
  name: string
  slug: string
  primaryMediaUrl: string | null
}

export interface ChatMessage {
  id: number
  conversationId: number
  senderId: number
  senderName: string
  senderAvatarUrl: string | null
  content: string
  read: boolean
  productSnapshot: ProductSnapshot | null
  createdAt: string
}

export interface Conversation {
  id: number
  userId: number
  userName: string
  userAvatarUrl: string | null
  lastMessageAt: string | null
  unreadCount: number
}