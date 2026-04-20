'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useFavoritesStore } from '@/store/useFavoritesStore'
import { apiFetchAuth, ApiError } from '@/lib/apiClient'
import { toast } from '@/store/useToastStore'
import { cn } from '@/lib/utils'

interface Props {
  productId: number
  productSlug?: string
  className?: string
  size?: 'sm' | 'md'
}

export function FavoriteButton({ productId, productSlug, className, size = 'md' }: Props) {
  const router = useRouter()
  const { user, accessToken } = useAuthStore()
  const favorited = useFavoritesStore((s) => s.ids.has(productId))
  const add = useFavoritesStore((s) => s.add)
  const remove = useFavoritesStore((s) => s.remove)
  const [busy, setBusy] = useState(false)

  // Hydrate favorited status for this specific product on mount / auth change.
  useEffect(() => {
    if (!accessToken) return
    let cancelled = false
    apiFetchAuth<number[]>(
      `/api/user/favorites/ids?productIds=${productId}`,
      accessToken,
    )
      .then((ids) => {
        if (cancelled) return
        if (ids.includes(productId)) add(productId)
        else remove(productId)
      })
      .catch(() => { /* silent — button just shows default state */ })
    return () => { cancelled = true }
  }, [accessToken, productId, add, remove])

  async function handleClick() {
    if (!user || !accessToken) {
      const redirect = productSlug ? `/san-pham/${productSlug}` : '/'
      router.push(`/dang-nhap?redirect=${encodeURIComponent(redirect)}`)
      return
    }
    if (busy) return
    setBusy(true)

    const wasFavorited = favorited
    // optimistic
    wasFavorited ? remove(productId) : add(productId)

    try {
      await apiFetchAuth(`/api/user/favorites/${productId}`, accessToken, {
        method: wasFavorited ? 'DELETE' : 'POST',
      })
      toast.success(wasFavorited ? 'Đã xoá khỏi yêu thích.' : 'Đã lưu vào yêu thích.')
    } catch (e) {
      // rollback
      wasFavorited ? add(productId) : remove(productId)
      toast.error(e instanceof ApiError ? e.message : 'Thao tác thất bại.')
    } finally {
      setBusy(false)
    }
  }

  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'
  const padding = size === 'sm' ? 'p-1.5' : 'p-2'

  return (
    <button
      type="button"
      aria-label={favorited ? 'Bỏ yêu thích' : 'Thêm vào yêu thích'}
      onClick={handleClick}
      disabled={busy}
      className={cn(
        'inline-flex items-center justify-center rounded-full border border-surface-border bg-surface transition-colors',
        'hover:border-danger/50 hover:text-danger disabled:opacity-50',
        favorited ? 'text-danger' : 'text-text-muted',
        padding,
        className
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={favorited ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconSize}
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  )
}
