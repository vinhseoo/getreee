'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { PublicCategory } from '@/types/product'

export function ProductFilters({ categories }: { categories: PublicCategory[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }, [router, searchParams])

  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={searchParams.get('categoryId') ?? ''}
        onChange={e => update('categoryId', e.target.value)}
        className="rounded-btn border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">Tất cả danh mục</option>
        {categories.map(c => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Lọc theo màu lông..."
        defaultValue={searchParams.get('featherColor') ?? ''}
        onBlur={e => update('featherColor', e.target.value)}
        onKeyDown={e => e.key === 'Enter' && update('featherColor', (e.target as HTMLInputElement).value)}
        className="rounded-btn border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  )
}