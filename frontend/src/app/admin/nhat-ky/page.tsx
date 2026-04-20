'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { PageResponse } from '@/types/api'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { Select } from '@/components/ui/Select'
import { toast } from '@/store/useToastStore'

interface AuditLogEntry {
  id: number
  actorId: number | null
  actorName: string | null
  actorEmail: string | null
  action: string
  entityType: string
  entityId: number | null
  summary: string | null
  createdAt: string
}

const ENTITY_FILTERS = [
  { value: '', label: 'Tất cả' },
  { value: 'PRODUCT', label: 'Sản phẩm' },
  { value: 'CATEGORY', label: 'Danh mục' },
  { value: 'USER', label: 'Người dùng' },
]

function actionBadgeVariant(action: string): 'success' | 'primary' | 'danger' | 'muted' {
  if (action.endsWith('_CREATE')) return 'success'
  if (action.endsWith('_DELETE')) return 'danger'
  if (action.endsWith('_UPDATE') || action.endsWith('_STATUS_CHANGE')) return 'primary'
  return 'muted'
}

export default function AdminAuditLogPage() {
  const { accessToken } = useAuthStore()
  const [data, setData] = useState<PageResponse<AuditLogEntry> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [entityType, setEntityType] = useState('')

  useEffect(() => {
    if (!accessToken) return
    const params = new URLSearchParams({ page: String(page), size: '30' })
    if (entityType) params.set('entityType', entityType)

    setLoading(true)
    apiFetchAuth<PageResponse<AuditLogEntry>>(`/api/admin/audit-logs?${params}`, accessToken)
      .then(setData)
      .catch(() => toast.error('Không thể tải nhật ký.'))
      .finally(() => setLoading(false))
  }, [accessToken, page, entityType])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Nhật ký hoạt động</h1>
        {data && <span className="text-sm text-text-muted">{data.totalElements} bản ghi</span>}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-text-muted">Lọc theo đối tượng</span>
        <div className="w-48">
          <Select
            value={entityType}
            options={ENTITY_FILTERS}
            onChange={(e) => {
              setPage(0)
              setEntityType(e.target.value)
            }}
          />
        </div>
      </div>

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
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Thời gian</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Người thực hiện</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Hành động</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Đối tượng</th>
                  <th className="px-4 py-3 text-left font-medium text-text-secondary">Mô tả</th>
                </tr>
              </thead>
              <tbody>
                {(data?.content ?? []).map((log) => (
                  <tr key={log.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
                    <td className="px-4 py-3 whitespace-nowrap text-text-muted">
                      {new Date(log.createdAt).toLocaleString('vi-VN')}
                    </td>
                    <td className="px-4 py-3 text-text-primary">
                      {log.actorName
                        ? <><span className="font-medium">{log.actorName}</span>
                            <span className="ml-2 text-xs text-text-muted">{log.actorEmail}</span></>
                        : <span className="text-text-muted italic">Hệ thống</span>}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={actionBadgeVariant(log.action)}>{log.action}</Badge>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {log.entityType}
                      {log.entityId != null && <span className="ml-1 text-text-muted">#{log.entityId}</span>}
                    </td>
                    <td className="px-4 py-3 text-text-primary">{log.summary ?? '—'}</td>
                  </tr>
                ))}
                {data?.content.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                      Chưa có nhật ký phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>Trang {data.page + 1} / {data.totalPages}</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" disabled={data.page === 0} onClick={() => setPage((p) => p - 1)}>
                  ← Trước
                </Button>
                <Button variant="ghost" size="sm" disabled={data.page + 1 >= data.totalPages} onClick={() => setPage((p) => p + 1)}>
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
