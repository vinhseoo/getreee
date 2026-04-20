'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth, ApiError } from '@/lib/apiClient'
import { toast } from '@/store/useToastStore'
import { AdminProduct, AdminCategory } from '@/types/product'
import { PageResponse } from '@/types/api'

export function useAdminProducts(page = 0, size = 20, keyword = '') {
  const { accessToken } = useAuthStore()
  const [data, setData] = useState<PageResponse<AdminProduct> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
      sort: 'createdAt,desc',
    })
    if (keyword.trim()) params.set('keyword', keyword.trim())
    try {
      const res = await apiFetchAuth<PageResponse<AdminProduct>>(
        `/api/admin/products?${params}`,
        accessToken
      )
      setData(res)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [accessToken, page, size, keyword])

  useEffect(() => { load() }, [load])

  async function deleteProduct(id: number) {
    if (!accessToken) return
    try {
      await apiFetchAuth(`/api/admin/products/${id}`, accessToken, { method: 'DELETE' })
      toast.success('Đã xoá sản phẩm.')
      await load()
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Không thể xoá sản phẩm.')
    }
  }

  async function updateStatus(id: number, status: string) {
    if (!accessToken) return
    try {
      await apiFetchAuth(
        `/api/admin/products/${id}/status?status=${status}`,
        accessToken,
        { method: 'PATCH' }
      )
      toast.success('Đã cập nhật trạng thái.')
      await load()
    } catch (e) {
      toast.error(e instanceof ApiError ? e.message : 'Không thể cập nhật trạng thái.')
    }
  }

  return { data, loading, error, refresh: load, deleteProduct, updateStatus }
}

export function useAdminCategories() {
  const { accessToken } = useAuthStore()
  const [categories, setCategories] = useState<AdminCategory[]>([])

  useEffect(() => {
    if (!accessToken) return
    apiFetchAuth<AdminCategory[]>('/api/admin/categories', accessToken)
      .then(setCategories)
      .catch(() => toast.error('Không thể tải danh mục.'))
  }, [accessToken])

  return { categories }
}