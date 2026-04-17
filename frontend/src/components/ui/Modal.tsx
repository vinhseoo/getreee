'use client'

import { cn } from '@/lib/utils'
import { ReactNode, useEffect, useRef } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onClose, title, children, className }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open) el.showModal()
    else el.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn('rounded-card shadow-card-hover p-0 w-full max-w-lg backdrop:bg-black/50', className)}
    >
      <div className="flex items-center justify-between border-b border-surface-border px-6 py-4">
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
        <button
          onClick={onClose}
          className="text-text-muted hover:text-text-primary transition-colors"
          aria-label="Đóng"
        >
          ✕
        </button>
      </div>
      <div className="px-6 py-4">{children}</div>
    </dialog>
  )
}