'use client'

import Link from 'next/link'
import { AdminProduct } from '@/types/product'
import { ProductStatusBadge } from './ProductStatusBadge'
import { Button } from '@/components/ui/Button'

interface Props {
  products: AdminProduct[]
  onDelete: (id: number) => void
  onStatusChange: (id: number, status: string) => void
}

export function AdminProductTable({ products, onDelete, onStatusChange }: Props) {
  return (
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
          {products.map(p => (
            <tr key={p.id} className="border-b border-surface-border last:border-0 hover:bg-surface-muted/50">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {p.primaryMediaUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.primaryMediaUrl} alt={p.name}
                      className="h-10 w-10 shrink-0 rounded object-cover" />
                  )}
                  <div>
                    <p className="font-medium text-text-primary">{p.name}</p>
                    <p className="text-xs text-text-muted">{p.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">{p.category?.name ?? '—'}</td>
              <td className="px-4 py-3 text-text-primary">
                {p.priceFrom
                  ? `${p.priceFrom.toLocaleString('vi-VN')}đ – ${p.priceTo?.toLocaleString('vi-VN')}đ`
                  : <span className="text-text-muted italic">Chưa đặt</span>
                }
              </td>
              <td className="px-4 py-3"><ProductStatusBadge status={p.status} /></td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/san-pham/${p.id}/chinh-sua`}>
                    <Button variant="ghost" size="sm">Sửa</Button>
                  </Link>
                  <Button
                    variant="danger" size="sm"
                    onClick={() => window.confirm('Xóa sản phẩm này?') && onDelete(p.id)}
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
  )
}