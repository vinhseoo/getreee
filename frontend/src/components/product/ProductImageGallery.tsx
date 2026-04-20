'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductMedia } from '@/types/product'
import { cn } from '@/lib/utils'

interface Props {
  primaryUrl: string | null
  images: ProductMedia[]
  videos: ProductMedia[]
  productName: string
}

export function ProductImageGallery({ primaryUrl, images, videos, productName }: Props) {
  const [activeUrl, setActiveUrl] = useState(primaryUrl)

  return (
    <div className="space-y-3">
      {activeUrl ? (
        <div className="overflow-hidden rounded-card">
          <Image
            src={activeUrl}
            alt={productName}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
            priority
          />
        </div>
      ) : (
        <div className="flex aspect-square items-center justify-center rounded-card bg-surface-muted text-sm text-text-muted">
          Chưa có ảnh
        </div>
      )}

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveUrl(m.mediaUrl)}
              className={cn(
                'h-20 w-20 shrink-0 overflow-hidden rounded transition-all',
                activeUrl === m.mediaUrl
                  ? 'ring-2 ring-primary opacity-100'
                  : 'opacity-55 hover:opacity-90'
              )}
            >
              <Image
                src={m.mediaUrl}
                alt=""
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {videos.map(m => (
        <video key={m.id} src={m.mediaUrl} controls className="w-full rounded-card" />
      ))}
    </div>
  )
}
