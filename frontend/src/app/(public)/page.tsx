import type { Metadata } from 'next'
import { Suspense } from 'react'
import { ProductGrid } from '@/components/product/ProductGrid'
import { ProductFilters } from '@/components/product/ProductFilters'
import { PublicProduct, PublicCategory } from '@/types/product'
import { PageResponse } from '@/types/api'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Trang chủ' }

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

async function fetchCategories(): Promise<PublicCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/api/public/categories`, { cache: 'no-store' })
    const body = await res.json()
    return body.success ? (body.data as PublicCategory[]) : []
  } catch {
    return []
  }
}

async function fetchProducts(searchParams: Record<string, string>): Promise<PageResponse<PublicProduct>> {
  const params = new URLSearchParams()
  if (searchParams.categoryId)   params.set('categoryId', searchParams.categoryId)
  if (searchParams.featherColor) params.set('featherColor', searchParams.featherColor)
  if (searchParams.keyword)      params.set('keyword', searchParams.keyword)
  params.set('page', searchParams.page ?? '0')
  params.set('size', '12')
  params.set('sort', 'createdAt,desc')

  try {
    const res = await fetch(`${API_BASE}/api/public/products?${params}`, { cache: 'no-store' })
    const body = await res.json()
    if (body.success) return body.data as PageResponse<PublicProduct>
  } catch { /* fall through */ }

  return { content: [], page: 0, size: 12, totalElements: 0, totalPages: 0 }
}

interface Props {
  searchParams: Record<string, string>
}

export default async function CatalogPage({ searchParams }: Props) {
  const [categories, pageData] = await Promise.all([
    fetchCategories(),
    fetchProducts(searchParams),
  ])

  const currentPage = pageData.page
  const buildPageHref = (p: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(p))
    return `/?${params.toString()}`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-text-primary">Gà Tre Catalog</h1>
        <p className="text-sm text-text-muted">{pageData.totalElements} sản phẩm</p>
      </div>

      <Suspense fallback={null}>
        <ProductFilters categories={categories} />
      </Suspense>

      <ProductGrid products={pageData.content} />

      {pageData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 0 && (
            <Link href={buildPageHref(currentPage - 1)}
              className="rounded-btn border border-surface-border bg-surface px-4 py-2 text-sm text-text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              ← Trước
            </Link>
          )}

          <span className="text-sm text-text-muted">
            {currentPage + 1} / {pageData.totalPages}
          </span>

          {currentPage + 1 < pageData.totalPages && (
            <Link href={buildPageHref(currentPage + 1)}
              className="rounded-btn border border-surface-border bg-surface px-4 py-2 text-sm text-text-secondary transition-colors hover:border-primary hover:text-primary"
            >
              Tiếp →
            </Link>
          )}
        </div>
      )}
    </div>
  )
}