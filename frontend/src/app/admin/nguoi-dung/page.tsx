'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { toast } from '@/store/useToastStore'
import { AdminUser, Role } from '@/types/user'

type Mode = 'create' | 'edit' | 'reset-pw' | null

export default function AdminUserPage() {
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    data, loading, error,
    toggleActive, createUser, updateUser, resetPassword,
  } = useAdminUsers(page, keyword)

  const [mode, setMode] = useState<Mode>(null)
  const [target, setTarget] = useState<AdminUser | null>(null)
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'USER' as Role,
  })
  const [newPw, setNewPw] = useState('')
  const [saving, setSaving] = useState(false)

  function handleSearch() {
    setPage(0)
    setKeyword(inputRef.current?.value.trim() ?? '')
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = ''
    setPage(0)
    setKeyword('')
  }

  async function handleToggle(id: number, currentlyActive: boolean) {
    try {
      await toggleActive(id)
      toast.success(currentlyActive ? 'Đã khoá tài khoản.' : 'Đã mở khóa tài khoản.')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Không thể thay đổi trạng thái.')
    }
  }

  function openCreate() {
    setTarget(null)
    setForm({ name: '', email: '', password: '', role: 'USER' })
    setMode('create')
  }

  function openEdit(u: AdminUser) {
    setTarget(u)
    setForm({ name: u.name, email: u.email, password: '', role: u.role })
    setMode('edit')
  }

  function openResetPw(u: AdminUser) {
    setTarget(u)
    setNewPw('')
    setMode('reset-pw')
  }

  function closeModal() {
    setMode(null)
    setTarget(null)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (mode === 'create') {
        if (!form.name.trim() || !form.email.trim() || form.password.length < 6) {
          toast.error('Vui lòng điền đầy đủ và mật khẩu tối thiểu 6 ký tự.')
          return
        }
        await createUser({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
        })
        toast.success('Đã tạo tài khoản.')
      } else if (mode === 'edit' && target) {
        await updateUser(target.id, { name: form.name.trim(), role: form.role })
        toast.success('Đã cập nhật tài khoản.')
      } else if (mode === 'reset-pw' && target) {
        if (newPw.length < 6) {
          toast.error('Mật khẩu mới tối thiểu 6 ký tự.')
          return
        }
        await resetPassword(target.id, newPw)
        toast.success('Đã đặt lại mật khẩu.')
      }
      closeModal()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Thao tác thất bại.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Người dùng</h1>
        <div className="flex items-center gap-3">
          {data && <span className="text-sm text-text-muted">{data.totalElements} tài khoản</span>}
          <Button onClick={openCreate}>+ Thêm tài khoản</Button>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          defaultValue={keyword}
          placeholder="Tìm theo tên hoặc email..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-72 rounded-btn border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-primary"
        />
        <Button size="sm" onClick={handleSearch}>Tìm</Button>
        {keyword && (
          <Button variant="ghost" size="sm" onClick={handleClear}>Xoá</Button>
        )}
      </div>

      {error && (
        <div className="rounded-btn bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-card border border-surface-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-border bg-surface-muted">
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Người dùng</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Vai trò</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Đăng ký qua</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Trạng thái</th>
                  <th className="px-4 py-3 text-right font-medium text-text-secondary">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {(data?.content ?? []).map(user => (
                  <tr
                    key={user.id}
                    className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatarUrl ? (
                          <Image
                            src={user.avatarUrl}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-surface-border flex items-center justify-center text-xs text-text-muted">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-medium text-text-primary">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{user.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={user.role === 'ADMIN' ? 'primary' : 'muted'}>
                        {user.role === 'ADMIN' ? 'Admin' : 'Người dùng'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-text-muted capitalize">
                      {user.provider.toLowerCase()}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={user.active ? 'success' : 'danger'}>
                        {user.active ? 'Hoạt động' : 'Đã khoá'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(user)}>
                          Sửa
                        </Button>
                        {user.provider === 'LOCAL' && (
                          <Button variant="ghost" size="sm" onClick={() => openResetPw(user)}>
                            Đổi MK
                          </Button>
                        )}
                        <Button
                          variant={user.active ? 'danger' : 'ghost'}
                          size="sm"
                          disabled={user.role === 'ADMIN'}
                          title={user.role === 'ADMIN' ? 'Không thể khoá tài khoản admin' : undefined}
                          onClick={() => handleToggle(user.id, user.active)}
                        >
                          {user.active ? 'Khoá' : 'Mở khóa'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data?.content.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-text-muted">
                      Chưa có người dùng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>
                {data.totalElements} tài khoản — trang {data.page + 1} / {data.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="ghost" size="sm"
                  disabled={data.page === 0}
                  onClick={() => setPage(p => p - 1)}
                >
                  ← Trước
                </Button>
                <Button
                  variant="ghost" size="sm"
                  disabled={data.page + 1 >= data.totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Tiếp →
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        open={mode === 'create' || mode === 'edit'}
        onClose={closeModal}
        title={mode === 'create' ? 'Tạo tài khoản mới' : 'Chỉnh sửa tài khoản'}
      >
        <div className="space-y-4">
          <Input
            label="Họ và tên *"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Email *"
            type="email"
            value={form.email}
            disabled={mode === 'edit'}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          {mode === 'create' && (
            <Input
              label="Mật khẩu * (≥ 6 ký tự)"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            />
          )}
          <Select
            label="Vai trò *"
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
            options={[
              { value: 'USER', label: 'Người dùng' },
              { value: 'ADMIN', label: 'Admin' },
            ]}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={closeModal}>Huỷ</Button>
            <Button loading={saving} onClick={handleSave}>
              {mode === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={mode === 'reset-pw'}
        onClose={closeModal}
        title={target ? `Đặt lại mật khẩu — ${target.name}` : 'Đặt lại mật khẩu'}
      >
        <div className="space-y-4">
          <Input
            label="Mật khẩu mới * (≥ 6 ký tự)"
            type="password"
            value={newPw}
            onChange={(e) => setNewPw(e.target.value)}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={closeModal}>Huỷ</Button>
            <Button loading={saving} onClick={handleSave}>Đặt lại</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
