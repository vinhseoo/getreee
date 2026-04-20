'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useAdminUsers } from '@/hooks/useAdminUsers'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { toast } from '@/store/useToastStore'

export default function AdminUserPage() {
  const [page, setPage] = useState(0)
  const { data, loading, error, toggleActive } = useAdminUsers(page)

  async function handleToggle(id: number, currentlyActive: boolean) {
    try {
      await toggleActive(id)
      toast.success(currentlyActive ? 'Đã khoá tài khoản.' : 'Đã mở khóa tài khoản.')
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Không thể thay đổi trạng thái.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Người dùng</h1>
        {data && (
          <span className="text-sm text-text-muted">{data.totalElements} tài khoản</span>
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
                      <div className="flex justify-end">
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
    </div>
  )
}
