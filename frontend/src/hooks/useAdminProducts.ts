'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { AdminProduct, AdminCategory } from '@/types/product'
import { PageResponse } from '@/types/api'

export function useAdminProducts(page = 0, size = 20) {
  const { accessToken } = useAuthStore()
  const [data, setData] = useState<PageResponse<AdminProduct> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    try {
      const res = await apiFetchAuth<PageResponse<AdminProduct>>(
        `/api/admin/products?page=${page}&size=${size}&sort=createdAt,desc`,
        accessToken
      )
      setData(res)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [accessToken, page, size])

  useEffect(() => { load() }, [load])

  async function deleteProduct(id: number) {
    if (!accessToken) return
    await apiFetchAuth(`/api/admin/products/${id}`, accessToken, { method: 'DELETE' })
    await load()
  }

  async function updateStatus(id: number, status: string) {
    if (!accessToken) return
    await apiFetchAuth(
      `/api/admin/products/${id}/status?status=${status}`,
      accessToken,
      { method: 'PATCH' }
    )
    await load()
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
      .catch(() => {})
  }, [accessToken])

  return { categories }
}