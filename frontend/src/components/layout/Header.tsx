'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { useChatStore } from '@/store/useChatStore'
import { useAuth } from '@/hooks/useAuth'
import { apiFetchAuth } from '@/lib/apiClient'
import { Conversation } from '@/types/chat'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { user, accessToken } = useAuthStore()
  const { conversation, setConversation } = useChatStore()
  const { logout } = useAuth()

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fetch conversation once to get unread count
  useEffect(() => {
    if (!accessToken || !user || conversation) return
    apiFetchAuth<Conversation>('/api/user/chat/conversation', accessToken)
      .then(setConversation)
      .catch(() => {})
  }, [accessToken, user, conversation, setConversation])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = conversation?.unreadCount ?? 0

  return (
    <header className="sticky top-0 z-40 border-b border-surface-border bg-surface shadow-card">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Gà Tre</span>
          <span className="hidden text-sm text-text-muted sm:block">Catalog</span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/danh-muc"
            className="hidden text-sm text-text-secondary hover:text-primary transition-colors sm:block"
          >
            Danh mục
          </Link>

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
              {/* Chat link with unread badge */}
              <Link
                href="/dashboard/chat"
                className="relative text-sm text-text-secondary hover:text-primary transition-colors"
              >
                Nhắn tin
                {unreadCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>

              {/* Avatar dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setDropdownOpen(v => !v)}
                  className="flex items-center gap-2 rounded-btn px-2 py-1 transition-colors hover:bg-surface-muted"
                >
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden text-sm text-text-primary sm:block">{user.name}</span>
                  <svg
                    className={`h-4 w-4 text-text-muted transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-48 rounded-card border border-surface-border bg-surface shadow-card-hover">
                    <div className="border-b border-surface-border px-4 py-3">
                      <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
                      <p className="text-xs text-text-muted truncate">{user.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        href="/dashboard/tai-khoan"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                      >
                        Hồ sơ cá nhân
                      </Link>
                      <Link
                        href="/dashboard/chat"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                      >
                        <span>Nhắn tin</span>
                        {unreadCount > 0 && (
                          <span className="rounded-full bg-danger px-1.5 py-0.5 text-[10px] font-bold text-white">
                            {unreadCount}
                          </span>
                        )}
                      </Link>
                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setDropdownOpen(false)}
                          className="block px-4 py-2 text-sm text-text-secondary hover:bg-surface-muted hover:text-text-primary"
                        >
                          Trang quản trị
                        </Link>
                      )}
                      <div className="border-t border-surface-border pt-1">
                        <button
                          onClick={() => { setDropdownOpen(false); logout() }}
                          className="block w-full px-4 py-2 text-left text-sm text-danger hover:bg-danger/5"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
