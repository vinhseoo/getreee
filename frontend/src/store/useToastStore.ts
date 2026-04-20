import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  type: ToastType
  message: string
}

interface ToastState {
  toasts: ToastItem[]
  push: (type: ToastType, message: string) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  push(type, message) {
    const id = Math.random().toString(36).slice(2)
    set(s => ({ toasts: [...s.toasts, { id, type, message }] }))
    setTimeout(
      () => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })),
      4000
    )
  },
  remove(id) {
    set(s => ({ toasts: s.toasts.filter(t => t.id !== id) }))
  },
}))

/** Convenience helpers — safe to call from anywhere (stores are module-level singletons). */
export const toast = {
  success: (msg: string) => useToastStore.getState().push('success', msg),
  error:   (msg: string) => useToastStore.getState().push('error', msg),
  warning: (msg: string) => useToastStore.getState().push('warning', msg),
  info:    (msg: string) => useToastStore.getState().push('info', msg),
}
