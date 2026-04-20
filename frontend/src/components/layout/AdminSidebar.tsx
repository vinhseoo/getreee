'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useNotificationStore } from '@/store/useNotificationStore'

const navItems = [
  { href: '/admin/tong-quan', label: 'Tổng quan' },
  { href: '/admin/san-pham', label: 'Sản phẩm' },
  { href: '/admin/danh-muc', label: 'Danh mục' },
  { href: '/admin/chat', label: 'Trò chuyện', badge: true },
  { href: '/admin/nguoi-dung', label: 'Người dùng' },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const inboxUnread = useNotificationStore((s) => s.inboxUnread)

  const navContent = (
    <div className="px-4 py-6">
      <Link href="/" onClick={onClose} className="mb-6 block text-lg font-bold text-primary">
        Gà Tre
      </Link>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
        Quản trị
      </p>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={cn(
              'flex items-center justify-between rounded-btn px-3 py-2 text-sm transition-colors',
              pathname.startsWith(item.href)
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
            )}
          >
            <span>{item.label}</span>
            {item.badge && inboxUnread > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-xs font-bold text-white">
                {inboxUnread > 99 ? '99+' : inboxUnread}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  )

  return (
    <>
      {/* Desktop: always-visible sidebar */}
      <aside className="hidden md:block w-56 shrink-0 border-r border-surface-border bg-surface">
        {navContent}
      </aside>

      {/* Mobile: slide-in drawer with backdrop */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-56 border-r border-surface-border bg-surface shadow-card-hover">
            {navContent}
          </aside>
        </div>
      )}
    </>
  )
}
