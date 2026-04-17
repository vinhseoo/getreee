import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PublicProduct } from '@/types/product'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

async function fetchProduct(slug: string): Promise<PublicProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/api/public/products/${slug}`, { cache: 'no-store' })
    if (res.status === 404) return null
    const body = await res.json()
    return body.success ? (body.data as PublicProduct) : null
  } catch {
    return null
  }
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await fetchProduct(params.slug)
  if (!product) return { title: 'Không tìm thấy sản phẩm' }
  return {
    title: product.name,
    description: product.description ?? `Gà tre ${product.name} — liên hệ thương lượng giá.`,
    openGraph: {
      title: product.name,
      images: product.primaryMediaUrl ? [product.primaryMediaUrl] : [],
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await fetchProduct(params.slug)
  if (!product) notFound()

  const images = (product.media ?? []).filter(m => m.mediaType === 'IMAGE')
  const videos = (product.media ?? []).filter(m => m.mediaType === 'VIDEO')

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-text-muted">
        <Link href="/" className="hover:text-primary">Trang chủ</Link>
        <span>›</span>
        <span className="text-text-secondary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Media */}
        <div className="space-y-3">
          {product.primaryMediaUrl ? (
            <div className="overflow-hidden rounded-card">
              <Image
                src={product.primaryMediaUrl}
                alt={product.name}
                width={600}
                height={600}
                className="aspect-square w-full object-cover"
                priority
              />
            </div>
          ) : (
            <div className="flex aspect-square items-center justify-center rounded-card bg-surface-muted text-text-muted">
              Chưa có ảnh
            </div>
          )}

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map(m => (
                <Image
                  key={m.id}
                  src={m.mediaUrl}
                  alt=""
                  width={80}
                  height={80}
                  className="h-20 w-20 shrink-0 rounded object-cover"
                />
              ))}
            </div>
          )}

          {/* Videos */}
          {videos.map(m => (
            <video key={m.id} src={m.mediaUrl} controls
              className="w-full rounded-card" />
          ))}
        </div>

        {/* Info */}
        <div className="space-y-5">
          {product.category && (
            <p className="text-sm font-medium text-primary">{product.category.name}</p>
          )}

          <h1 className="text-2xl font-bold text-text-primary">{product.name}</h1>

          {/* Attributes */}
          <dl className="divide-y divide-surface-border rounded-card border border-surface-border text-sm">
            {product.featherColor && (
              <div className="flex justify-between px-4 py-2">
                <dt className="text-text-muted">Màu lông</dt>
                <dd className="font-medium text-text-primary">{product.featherColor}</dd>
              </div>
            )}
            {product.weightGrams && (
              <div className="flex justify-between px-4 py-2">
                <dt className="text-text-muted">Cân nặng</dt>
                <dd className="font-medium text-text-primary">{product.weightGrams}g</dd>
              </div>
            )}
            {product.ageMonths && (
              <div className="flex justify-between px-4 py-2">
                <dt className="text-text-muted">Tuổi</dt>
                <dd className="font-medium text-text-primary">{product.ageMonths} tháng</dd>
              </div>
            )}
          </dl>

          {product.description && (
            <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-line">
              {product.description}
            </p>
          )}

          {/* Price intentionally hidden — negotiation via chat (Phase 4) */}
          <div className="rounded-card border border-primary/30 bg-primary/5 px-5 py-4">
            <p className="text-sm font-medium text-primary">Giá thương lượng</p>
            <p className="mt-1 text-xs text-text-muted">
              Giá không được hiển thị công khai. Vui lòng liên hệ để thương lượng trực tiếp.
            </p>
            {/* Chat button will be wired up in Phase 4 */}
            <button
              disabled
              className="btn-primary mt-3 w-full opacity-60 cursor-not-allowed"
              title="Tính năng nhắn tin sẽ ra mắt sớm"
            >
              Liên hệ thương lượng giá →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
