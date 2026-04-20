'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth, ApiError } from '@/lib/apiClient'
import { toast } from '@/store/useToastStore'
import { UserProfile } from '@/types/user'
import { Header } from '@/components/layout/Header'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Modal } from '@/components/ui/Modal'

export default function ProfilePage() {
  const { user, accessToken, setAuth } = useAuthStore()

  const [editOpen, setEditOpen] = useState(false)
  const [pwOpen, setPwOpen] = useState(false)

  const [editForm, setEditForm] = useState({ name: '', avatarUrl: '' })
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

  const [saving, setSaving] = useState(false)

  if (!user || !accessToken) return null

  const isLocal = user.provider === 'LOCAL'

  function openEdit() {
    setEditForm({ name: user!.name, avatarUrl: user!.avatarUrl ?? '' })
    setEditOpen(true)
  }

  function openChangePassword() {
    setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setPwOpen(true)
  }

  async function handleSaveProfile() {
    if (!editForm.name.trim()) {
      toast.error('Tên không được để trống.')
      return
    }
    setSaving(true)
    try {
      const updated = await apiFetchAuth<UserProfile>('/api/user/me', accessToken!, {
        method: 'PUT',
        body: JSON.stringify({
          name: editForm.name.trim(),
          avatarUrl: editForm.avatarUrl.trim() || null,
        }),
      })
      setAuth(accessToken!, updated)
      toast.success('Cập nhật hồ sơ thành công.')
      setEditOpen(false)
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Cập nhật thất bại.')
    } finally {
      setSaving(false)
    }
  }

  async function handleChangePassword() {
    if (pwForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự.')
      return
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('Xác nhận mật khẩu không khớp.')
      return
    }
    setSaving(true)
    try {
      await apiFetchAuth('/api/user/me/password', accessToken!, {
        method: 'POST',
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      })
      toast.success('Đổi mật khẩu thành công.')
      setPwOpen(false)
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Đổi mật khẩu thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="mb-6 text-xl font-bold text-text-primary">Hồ sơ cá nhân</h1>

        <div className="rounded-card border border-surface-border bg-surface p-6 shadow-card">
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
              <dd className="font-medium text-text-primary">
                {isLocal ? 'Email + mật khẩu' : 'Google'}
              </dd>
            </div>
          </dl>

          <hr className="my-6 border-surface-border" />

          <div className="flex flex-wrap gap-3">
            <Button onClick={openEdit}>Chỉnh sửa hồ sơ</Button>
            {isLocal && (
              <Button variant="ghost" onClick={openChangePassword}>
                Đổi mật khẩu
              </Button>
            )}
            <Link href="/dashboard/chat">
              <Button variant="ghost">Đến trang nhắn tin</Button>
            </Link>
            <Link href="/">
              <Button variant="ghost">Xem catalog</Button>
            </Link>
          </div>

          {!isLocal && (
            <p className="mt-4 text-xs text-text-muted">
              Tài khoản liên kết với Google — email không thể thay đổi tại đây.
            </p>
          )}
        </div>
      </main>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Chỉnh sửa hồ sơ">
        <div className="space-y-4">
          <Input
            label="Họ và tên *"
            value={editForm.name}
            onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Đường dẫn ảnh đại diện"
            placeholder="https://..."
            value={editForm.avatarUrl}
            onChange={(e) => setEditForm((f) => ({ ...f, avatarUrl: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setEditOpen(false)}>
              Huỷ
            </Button>
            <Button loading={saving} onClick={handleSaveProfile}>
              Lưu thay đổi
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={pwOpen} onClose={() => setPwOpen(false)} title="Đổi mật khẩu">
        <div className="space-y-4">
          <Input
            label="Mật khẩu hiện tại *"
            type="password"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
          />
          <Input
            label="Mật khẩu mới *"
            type="password"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
          />
          <Input
            label="Xác nhận mật khẩu mới *"
            type="password"
            value={pwForm.confirmPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setPwOpen(false)}>
              Huỷ
            </Button>
            <Button loading={saving} onClick={handleChangePassword}>
              Đổi mật khẩu
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
