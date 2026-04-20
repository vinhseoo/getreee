'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '@/store/useAuthStore'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { PublicProduct } from '@/types/product'
import { PageResponse } from '@/types/api'
import { Header } from '@/components/layout/Header'
import { ProductGrid } from '@/components/product/ProductGrid'
import { Spinner } from '@/components/ui/Spinner'
import { Button } from '@/components/ui/Button'
import { toast } from '@/store/useToastStore'

export default function FavoritesPage() {
  const { user, accessToken, initialized } = useAuthStore()
  const setIds = useFavoritesStore((s) => s.setIds)

  const [data, setData] = useState<PageResponse<PublicProduct> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (!accessToken) return
    setLoading(true)
    apiFetchAuth<PageResponse<PublicProduct>>(
      `/api/user/favorites?page=${page}&size=12&sort=createdAt,desc`,
      accessToken,
    )
      .then((res) => {
        setData(res)
        setIds(res.content.map((p) => p.id))
      })
      .catch(() => toast.error('Không thể tải danh sách yêu thích.'))
      .finally(() => setLoading(false))
  }, [accessToken, page, setIds])

  if (initialized && !user) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 text-center">
          <p className="text-text-muted">Vui lòng đăng nhập để xem danh sách yêu thích.</p>
          <Link href="/dang-nhap?redirect=/dashboard/yeu-thich" className="mt-4 inline-block">
            <Button>Đăng nhập</Button>
          </Link>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Sản phẩm yêu thích</h1>
            {data && (
              <p className="mt-1 text-sm text-text-muted">{data.totalElements} sản phẩm</p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="h-6 w-6 text-primary" />
          </div>
        ) : data && data.totalElements === 0 ? (
          <div className="rounded-card border border-surface-border bg-surface-muted px-6 py-12 text-center">
            <p className="text-text-secondary">Bạn chưa lưu sản phẩm nào.</p>
            <Link href="/" className="mt-4 inline-block">
              <Button variant="ghost">Xem catalog</Button>
            </Link>
          </div>
        ) : data ? (
          <>
            <ProductGrid products={data.content} />

            {data.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2 text-sm">
                <Button
                  variant="ghost" size="sm"
                  disabled={data.page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Trước
                </Button>
                <span className="text-text-muted">
                  {data.page + 1} / {data.totalPages}
                </span>
                <Button
                  variant="ghost" size="sm"
                  disabled={data.page + 1 >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Tiếp →
                </Button>
              </div>
            )}
          </>
        ) : null}
      </main>
    </div>
  )
}
