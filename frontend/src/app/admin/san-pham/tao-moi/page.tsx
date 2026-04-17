'use client'

import { useRouter } from 'next/navigation'
import { useAdminCategories } from '@/hooks/useAdminProducts'
import { ProductForm } from '@/components/product/ProductForm'
import { Button } from '@/components/ui/Button'

export default function CreateProductPage() {
  const router = useRouter()
  const { categories } = useAdminCategories()

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/san-pham')}>
          ← Quay lại
        </Button>
        <h1 className="text-xl font-semibold text-text-primary">Thêm sản phẩm mới</h1>
      </div>

      <div className="rounded-card border border-surface-border bg-surface p-6 shadow-card">
        <ProductForm categories={categories} />
      </div>
    </div>
  )
}
