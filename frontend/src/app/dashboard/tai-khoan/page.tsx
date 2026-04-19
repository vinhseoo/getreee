'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export default function ProfilePage() {
  const { user } = useAuthStore()

  if (!user) return null

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="mb-6 text-xl font-bold text-text-primary">Hồ sơ cá nhân</h1>

        <div className="rounded-card border border-surface-border bg-surface p-6 shadow-card">
          {/* Avatar + name */}
          <div className="flex items-center gap-5">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={80}
                height={80}
                className="rounded-full object-cover ring-2 ring-primary/20"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-text-primary">{user.name}</p>
              <p className="text-sm text-text-muted">{user.email}</p>
              <Badge
                variant={user.role === 'ADMIN' ? 'primary' : 'muted'}
                className="mt-2"
              >
                {user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}
              </Badge>
            </div>
          </div>

          <hr className="my-6 border-surface-border" />

          {/* Info table */}
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-muted">Họ và tên</dt>
              <dd className="font-medium text-text-primary">{user.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Email</dt>
              <dd className="font-medium text-text-primary">{user.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-muted">Đăng nhập qua</dt>
              <dd className="font-medium text-text-primary">Google</dd>
            </div>
          </dl>

          <hr className="my-6 border-surface-border" />

          <p className="mb-4 text-sm text-text-muted">
            Thông tin tài khoản được lấy từ Google và không thể chỉnh sửa trực tiếp.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link href="/dashboard/chat">
              <Button>Đến trang nhắn tin</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost">Xem catalog</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
