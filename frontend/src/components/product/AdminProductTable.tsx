'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AdminProduct } from '@/types/product'
import { Button } from '@/components/ui/Button'

const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Còn hàng' },
  { value: 'SOLD',      label: 'Đã bán' },
  { value: 'HIDDEN',    label: 'Ẩn' },
]

const STATUS_STYLE: Record<string, string> = {
  AVAILABLE: 'border-success/40 bg-success/10 text-success',
  SOLD:      'border-surface-border bg-surface-muted text-text-muted',
  HIDDEN:    'border-warning/40 bg-warning/10 text-warning',
}

interface Props {
  products: AdminProduct[]
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: string) => void
}

export function AdminProductTable({ products, onDelete, onStatusChange }: Props) {
  const [pendingDelete, setPendingDelete] = useState<AdminProduct | null>(null)

  function confirmDelete() {
    if (!pendingDelete) return
    onDelete(pendingDelete.id)
    setPendingDelete(null)
  }

  return (
    <>
      <div className="overflow-x-auto rounded-card border border-surface-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-border bg-surface-muted">
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Sản phẩm</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Danh mục</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Giá tham khảo</th>
              <th className="px-4 py-3 text-left font-medium text-text-secondary">Trạng thái</th>
              <th className="px-4 py-3 text-right font-medium text-text-secondary">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-text-muted">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
            {products.map(p => (
              <tr key={p.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">

                {/* A3: Tên + mã sản phẩm */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.primaryMediaUrl && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.primaryMediaUrl} alt={p.name}
                        className="h-10 w-10 shrink-0 rounded object-cover" />
                    )}
                    <div>
                      <p className="font-medium text-text-primary">{p.name}</p>
                      <p className="font-mono text-xs text-text-muted">
                        {p.productCode ?? p.slug}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-3 text-text-secondary">{p.category?.name ?? '—'}</td>

                <td className="px-4 py-3 text-text-primary">
                  {p.priceFrom
                    ? `${p.priceFrom.toLocaleString('vi-VN')}đ – ${p.priceTo?.toLocaleString('vi-VN')}đ`
                    : <span className="italic text-text-muted">Chưa đặt</span>
                  }
                </td>

                {/* A1: Inline status select */}
                <td className="px-4 py-3">
                  <select
                    value={p.status}
                    onChange={(e) => onStatusChange(p.id, e.target.value)}
                    className={`cursor-pointer rounded-btn border px-2 py-1 text-xs font-medium outline-none ${STATUS_STYLE[p.status] ?? ''}`}
                  >
                    {STATUS_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Link href={`/admin/san-pham/${p.id}/chinh-sua`}>
                      <Button variant="ghost" size="sm">Sửa</Button>
                    </Link>
                    {/* A2: Trigger modal thay vì window.confirm */}
                    <Button
                      variant="danger" size="sm"
                      onClick={() => setPendingDelete(p)}
                    >
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* A2: Delete confirmation modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-card border border-surface-border bg-surface p-6 shadow-card-hover">
            <h3 className="text-base font-semibold text-text-primary">Xác nhận xóa sản phẩm</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Bạn có chắc muốn xóa{' '}
              <span className="font-medium text-text-primary">"{pendingDelete.name}"</span>?
              {pendingDelete.productCode && (
                <span className="ml-1 font-mono text-xs text-text-muted">({pendingDelete.productCode})</span>
              )}
            </p>
            <p className="mt-1 text-xs text-danger">Hành động này không thể hoàn tác. Ảnh/video đính kèm cũng sẽ bị xóa.</p>
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="ghost" size="sm" onClick={() => setPendingDelete(null)}>
                Huỷ
              </Button>
              <Button variant="danger" size="sm" onClick={confirmDelete}>
                Xóa vĩnh viễn
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
