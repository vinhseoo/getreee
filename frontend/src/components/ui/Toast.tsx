'use client'

import { useToastStore, ToastType } from '@/store/useToastStore'
import { cn } from '@/lib/utils'

const typeStyles: Record<ToastType, string> = {
  success: 'bg-success text-white',
  error:   'bg-danger text-white',
  warning: 'bg-warning text-text-primary',
  info:    'bg-info text-white',
}

const typeIcons: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

export function ToastContainer() {
  const { toasts, remove } = useToastStore()

  if (toasts.length === 0) return null

  return (
    <div
      role="region"
      aria-label="Thông báo"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map(t => (
        <div
          key={t.id}
          className={cn(
            'flex min-w-[240px] max-w-sm items-start gap-3 rounded-card px-4 py-3 shadow-card-hover text-sm',
            typeStyles[t.type]
          )}
        >
          <span className="shrink-0 font-bold">{typeIcons[t.type]}</span>
          <span className="flex-1">{t.message}</span>
          <button
            onClick={() => remove(t.id)}
            className="shrink-0 opacity-70 hover:opacity-100 leading-none"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
