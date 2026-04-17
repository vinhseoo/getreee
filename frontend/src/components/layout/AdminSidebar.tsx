'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin/san-pham', label: 'Sản phẩm' },
  { href: '/admin/danh-muc', label: 'Danh mục' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 border-r border-surface-border bg-surface">
      <div className="px-4 py-6">
        <Link href="/" className="mb-6 block text-lg font-bold text-primary">
          Gà Tre
        </Link>
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-text-muted">
          Quản trị
        </p>
        <nav className="flex flex-col gap-1">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-btn px-3 py-2 text-sm transition-colors',
                pathname.startsWith(item.href)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-text-secondary hover:bg-surface-muted hover:text-text-primary'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  )
}