'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { useAdminCategories } from '@/hooks/useAdminProducts'
import { ProductForm } from '@/components/product/ProductForm'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { AdminProduct } from '@/types/product'

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const { categories } = useAdminCategories()
  const [product, setProduct] = useState<AdminProduct | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!accessToken) return
    apiFetchAuth<AdminProduct>(`/api/admin/products/${params.id}`, accessToken)
      .then(setProduct)
      .catch(e => setError(e.message))
  }, [accessToken, params.id])

  if (error) {
    return (
      <div className="rounded-btn bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
    )
  }

  if (!product) {
    return (
      <div className="flex justify-center py-16">
        <Spinner className="h-6 w-6 text-primary" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.push('/admin/san-pham')}>
          ← Quay lại
        </Button>
        <h1 className="text-xl font-semibold text-text-primary">Chỉnh sửa: {product.name}</h1>
      </div>

      <div className="rounded-card border border-surface-border bg-surface p-6 shadow-card">
        <ProductForm product={product} categories={categories} />
      </div>
    </div>
  )
}
