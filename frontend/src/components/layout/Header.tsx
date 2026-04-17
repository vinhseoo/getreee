'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/store/useAuthStore'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { user } = useAuthStore()
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-surface shadow-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Gà Tre</span>
          <span className="hidden text-sm text-text-muted sm:block">Catalog</span>
        </Link>

        <nav className="flex items-center gap-4">
          {user?.role === 'ADMIN' && (
            <Link
              href="/admin"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              Quản trị
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/chat"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                Nhắn tin
              </Link>
              {user.avatarUrl && (
                <Image
                  src={user.avatarUrl}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              )}
              <span className="hidden text-sm text-text-primary sm:block">{user.name}</span>
              <Button variant="ghost" size="sm" onClick={logout}>Đăng xuất</Button>
            </div>
          ) : (
            <Link href="/dang-nhap">
              <Button size="sm">Đăng nhập</Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}