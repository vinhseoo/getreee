'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useAdminProducts } from '@/hooks/useAdminProducts'
import { AdminProductTable } from '@/components/product/AdminProductTable'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'

export default function AdminProductListPage() {
  const [page, setPage] = useState(0)
  const [keyword, setKeyword] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const { data, loading, error, deleteProduct, updateStatus } = useAdminProducts(page, 20, keyword)

  function handleSearch() {
    setPage(0)
    setKeyword(inputRef.current?.value.trim() ?? '')
  }

  function handleClear() {
    if (inputRef.current) inputRef.current.value = ''
    setPage(0)
    setKeyword('')
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-text-primary">Sản phẩm</h1>
        <Link href="/admin/san-pham/tao-moi">
          <Button>+ Thêm sản phẩm</Button>
        </Link>
      </div>

      {/* Search bar */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          defaultValue={keyword}
          placeholder="Tìm theo tên sản phẩm..."
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          className="w-64 rounded-btn border border-surface-border bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-muted outline-none focus:border-primary"
        />
        <Button size="sm" onClick={handleSearch}>Tìm</Button>
        {keyword && (
          <Button variant="ghost" size="sm" onClick={handleClear}>Xoá</Button>
        )}
      </div>

      {error && (
        <div className="rounded-btn bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner className="h-6 w-6 text-primary" />
        </div>
      ) : (
        <>
          <AdminProductTable
            products={data?.content ?? []}
            onDelete={deleteProduct}
            onStatusChange={updateStatus}
          />

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-text-muted">
              <span>
                {data.totalElements} sản phẩm — trang {data.page + 1} / {data.totalPages}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" disabled={data.page === 0}
                  onClick={() => setPage(p => p - 1)}>
                  ← Trước
                </Button>
                <Button variant="ghost" size="sm" disabled={data.page + 1 >= data.totalPages}
                  onClick={() => setPage(p => p + 1)}>
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
