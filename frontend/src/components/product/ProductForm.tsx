'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { MediaUploader } from './MediaUploader'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { AdminProduct, AdminCategory } from '@/types/product'

const STATUS_OPTIONS = [
  { value: 'AVAILABLE', label: 'Còn hàng' },
  { value: 'SOLD',      label: 'Đã bán' },
  { value: 'HIDDEN',    label: 'Ẩn' },
]

interface Props {
  product?: AdminProduct    // undefined → create mode
  categories: AdminCategory[]
}

export function ProductForm({ product, categories }: Props) {
  const router = useRouter()
  const { accessToken } = useAuthStore()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [form, setForm] = useState({
    name:         product?.name ?? '',
    slug:         product?.slug ?? '',
    description:  product?.description ?? '',
    categoryId:   product?.category?.id?.toString() ?? '',
    priceFrom:    product?.priceFrom?.toString() ?? '',
    priceTo:      product?.priceTo?.toString() ?? '',
    featherColor: product?.featherColor ?? '',
    weightGrams:  product?.weightGrams?.toString() ?? '',
    ageMonths:    product?.ageMonths?.toString() ?? '',
    status:       product?.status ?? 'AVAILABLE',
  })

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [key]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!accessToken) return
    setSaving(true)
    setError(null)
    try {
      const body = {
        name:         form.name,
        slug:         form.slug || undefined,
        description:  form.description || null,
        categoryId:   Number(form.categoryId),
        priceFrom:    form.priceFrom ? Number(form.priceFrom) : null,
        priceTo:      form.priceTo   ? Number(form.priceTo)   : null,
        featherColor: form.featherColor || null,
        weightGrams:  form.weightGrams  ? Number(form.weightGrams)  : null,
        ageMonths:    form.ageMonths    ? Number(form.ageMonths)    : null,
        status:       form.status,
      }

      if (product) {
        await apiFetchAuth(`/api/admin/products/${product.id}`, accessToken, {
          method: 'PUT', body: JSON.stringify(body),
        })
      } else {
        await apiFetchAuth('/api/admin/products', accessToken, {
          method: 'POST', body: JSON.stringify(body),
        })
      }
      router.push('/admin/san-pham')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const categoryOptions = categories.map(c => ({ value: c.id.toString(), label: c.name }))

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-btn bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input label="Tên sản phẩm *" required value={form.name} onChange={set('name')} />
        <Input label="Đường dẫn (slug)" value={form.slug}
          placeholder="Tự động tạo từ tên nếu để trống" onChange={set('slug')} />
      </div>

      <Textarea label="Mô tả" value={form.description} onChange={set('description')} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Select label="Danh mục *" required options={categoryOptions}
          placeholder="Chọn danh mục" value={form.categoryId} onChange={set('categoryId')} />
        <Select label="Trạng thái" options={STATUS_OPTIONS}
          value={form.status} onChange={set('status')} />
      </div>

      {/* Price block — visible only in admin form */}
      <div className="rounded-card border border-surface-border p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-text-muted">
          Giá tham khảo (chỉ admin thấy — không hiển thị công khai)
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Input label="Giá từ (VNĐ)" type="number" min={0} value={form.priceFrom} onChange={set('priceFrom')} />
          <Input label="Giá đến (VNĐ)" type="number" min={0} value={form.priceTo}   onChange={set('priceTo')} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Input label="Màu lông"        value={form.featherColor} onChange={set('featherColor')} />
        <Input label="Nặng (gram)"     type="number" min={0} value={form.weightGrams} onChange={set('weightGrams')} />
        <Input label="Tuổi (tháng)"    type="number" min={0} value={form.ageMonths}   onChange={set('ageMonths')} />
      </div>

      {product ? (
        <div>
          <p className="mb-3 text-sm font-medium text-text-primary">Hình ảnh / Video</p>
          <MediaUploader productId={product.id} initialMedia={product.media ?? []} />
        </div>
      ) : (
        <p className="rounded-btn bg-surface-muted px-4 py-3 text-sm text-text-muted">
          Tạo sản phẩm trước, sau đó tải ảnh/video lên từ trang chỉnh sửa.
        </p>
      )}

      <div className="flex justify-end gap-3 border-t border-surface-border pt-4">
        <Button variant="ghost" type="button" onClick={() => router.push('/admin/san-pham')}>
          Huỷ
        </Button>
        <Button type="submit" loading={saving}>
          {product ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'}
        </Button>
      </div>
    </form>
  )
}