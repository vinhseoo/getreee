'use client'

import { useState, useRef } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { apiFetchAuth, apiFetchAuthMultipart } from '@/lib/apiClient'
import { AdminProduct, AdminProductMedia } from '@/types/product'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { cn } from '@/lib/utils'

interface Props {
  productId: number
  initialMedia: AdminProductMedia[]
}

export function MediaUploader({ productId, initialMedia }: Props) {
  const { accessToken } = useAuthStore()
  const [media, setMedia] = useState(initialMedia)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function refreshMedia() {
    if (!accessToken) return
    const p = await apiFetchAuth<AdminProduct>(`/api/admin/products/${productId}`, accessToken)
    setMedia(p.media ?? [])
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !accessToken) return
    setUploading(true)
    setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await apiFetchAuthMultipart(`/api/admin/products/${productId}/media`, accessToken, fd)
      await refreshMedia()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  async function handleSetPrimary(mediaId: number) {
    if (!accessToken) return
    await apiFetchAuth(
      `/api/admin/products/${productId}/media/${mediaId}/primary`,
      accessToken,
      { method: 'PATCH' }
    )
    await refreshMedia()
  }

  async function handleDelete(mediaId: number) {
    if (!accessToken || !window.confirm('Xóa ảnh/video này?')) return
    await apiFetchAuth(
      `/api/admin/products/${productId}/media/${mediaId}`,
      accessToken,
      { method: 'DELETE' }
    )
    await refreshMedia()
  }

  return (
    <div className="space-y-3">
      {error && <p className="text-sm text-danger">{error}</p>}

      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
        {media
          .sort((a, b) => a.displayOrder - b.displayOrder)
          .map(m => (
            <div
              key={m.id}
              className={cn(
                'group relative overflow-hidden rounded-card border-2 transition-colors',
                m.primary ? 'border-primary' : 'border-transparent hover:border-surface-border'
              )}
            >
              {m.mediaType === 'IMAGE' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={m.mediaUrl} alt="" className="aspect-square w-full object-cover" />
              ) : (
                <video src={m.mediaUrl} className="aspect-square w-full object-cover" muted />
              )}

              {m.primary && (
                <Badge variant="primary" className="absolute left-1 top-1 text-[10px]">Chính</Badge>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                {!m.primary && (
                  <Button size="sm" variant="ghost"
                    className="border-white text-white text-[11px] hover:bg-white/20"
                    onClick={() => handleSetPrimary(m.id)}
                  >
                    Đặt chính
                  </Button>
                )}
                <Button size="sm" variant="danger" className="text-[11px]"
                  onClick={() => handleDelete(m.id)}
                >
                  Xóa
                </Button>
              </div>
            </div>
          ))}

        {/* Upload slot */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square items-center justify-center rounded-card border-2 border-dashed border-surface-border text-text-muted transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {uploading ? <Spinner className="h-5 w-5" /> : <span className="text-2xl leading-none">+</span>}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={handleUpload}
      />
    </div>
  )
}