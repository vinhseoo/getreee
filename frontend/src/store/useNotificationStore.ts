import { create } from 'zustand'

interface NotificationState {
  inboxUnread: number
  increment: () => void
  reset: () => void
}

export const useNotificationStore = create<NotificationState>((set) => ({
  inboxUnread: 0,
  increment: () => set((s) => ({ inboxUnread: s.inboxUnread + 1 })),
  reset: () => set({ inboxUnread: 0 }),
}))
