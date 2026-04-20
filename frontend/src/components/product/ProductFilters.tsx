'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useRef } from 'react'
import { PublicCategory } from '@/types/product'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export function ProductFilters({ categories }: { categories: PublicCategory[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const keywordRef = useRef<HTMLInputElement>(null)
  const featherRef = useRef<HTMLInputElement>(null)

  const update = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }, [router, searchParams])

  function handleSearch() {
    const params = new URLSearchParams(searchParams.toString())
    const keyword = keywordRef.current?.value.trim() ?? ''
    const feather = featherRef.current?.value.trim() ?? ''
    if (keyword) params.set('keyword', keyword)
    else params.delete('keyword')
    if (feather) params.set('featherColor', feather)
    else params.delete('featherColor')
    params.delete('page')
    router.push(`/?${params.toString()}`)
  }

  function handleClear() {
    if (keywordRef.current) keywordRef.current.value = ''
    if (featherRef.current) featherRef.current.value = ''
    router.push('/')
  }

  const hasFilters = !!(
    searchParams.get('keyword') ||
    searchParams.get('featherColor') ||
    searchParams.get('categoryId')
  )

  const categoryOptions = categories.map(c => ({ value: String(c.id), label: c.name }))

  return (
    <div className="flex flex-wrap items-end gap-3">
      <Select
        options={categoryOptions}
        placeholder="Tất cả danh mục"
        value={searchParams.get('categoryId') ?? ''}
        onChange={e => update('categoryId', e.target.value)}
      />

      <Input
        ref={keywordRef}
        placeholder="Tìm theo tên..."
        defaultValue={searchParams.get('keyword') ?? ''}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        className="w-44"
      />

      <Input
        ref={featherRef}
        placeholder="Màu lông..."
        defaultValue={searchParams.get('featherColor') ?? ''}
        onKeyDown={e => e.key === 'Enter' && handleSearch()}
        className="w-36"
      />

      <Button size="sm" onClick={handleSearch}>Tìm kiếm</Button>

      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Xoá bộ lọc
        </Button>
      )}
    </div>
  )
}
