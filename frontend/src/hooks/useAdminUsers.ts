'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth } from '@/lib/apiClient'
import { AdminUser } from '@/types/user'
import { PageResponse } from '@/types/api'

export function useAdminUsers(page = 0, keyword = '') {
  const { accessToken } = useAuthStore()
  const [data, setData] = useState<PageResponse<AdminUser> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    if (!accessToken) return
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: String(page),
        size: '20',
        sort: 'createdAt,desc',
      })
      if (keyword.trim()) params.set('keyword', keyword.trim())
      const res = await apiFetchAuth<PageResponse<AdminUser>>(
        `/api/admin/users?${params.toString()}`,
        accessToken
      )
      setData(res)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Đã xảy ra lỗi.')
    } finally {
      setLoading(false)
    }
  }, [accessToken, page, keyword])

  useEffect(() => { load() }, [load])

  async function toggleActive(id: number) {
    if (!accessToken) return
    await apiFetchAuth(`/api/admin/users/${id}/toggle-active`, accessToken, { method: 'PATCH' })
    await load()
  }

  async function createUser(body: {
    name: string
    email: string
    password: string
    role: 'USER' | 'ADMIN'
  }) {
    if (!accessToken) return
    await apiFetchAuth('/api/admin/users', accessToken, {
      method: 'POST', body: JSON.stringify(body),
    })
    await load()
  }

  async function updateUser(id: number, body: {
    name?: string
    role?: 'USER' | 'ADMIN'
    active?: boolean
  }) {
    if (!accessToken) return
    await apiFetchAuth(`/api/admin/users/${id}`, accessToken, {
      method: 'PUT', body: JSON.stringify(body),
    })
    await load()
  }

  async function resetPassword(id: number, newPassword: string) {
    if (!accessToken) return
    await apiFetchAuth(`/api/admin/users/${id}/reset-password`, accessToken, {
      method: 'POST', body: JSON.stringify({ newPassword }),
    })
  }

  return { data, loading, error, toggleActive, createUser, updateUser, resetPassword, refresh: load }
}
