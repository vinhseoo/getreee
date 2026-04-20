import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PublicProduct } from '@/types/product'
import { ProductImageGallery } from '@/components/product/ProductImageGallery'
import { ProductCTA } from '@/components/product/ProductCTA'

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
        {product.category && (
          <>
            <Link href={`/?categoryId=${product.category.id}`} className="hover:text-primary">
              {product.category.name}
            </Link>
            <span>›</span>
          </>
        )}
        <span className="text-text-secondary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Interactive media gallery */}
        <ProductImageGallery
          primaryUrl={product.primaryMediaUrl}
          images={images}
          videos={videos}
          productName={product.name}
        />

        {/* Info */}
        <div className="space-y-5">
          {product.category && (
            <p className="text-sm font-medium text-primary">{product.category.name}</p>
          )}

          <div className="flex items-start justify-between gap-2">
            <h1 className="text-2xl font-bold text-text-primary">{product.name}</h1>
            <span className="shrink-0 text-xs text-text-muted mt-1">{product.viewCount.toLocaleString('vi-VN')} lượt xem</span>
          </div>

          {/* Identification */}
          {product.productCode && (
            <p className="text-xs font-mono text-text-muted">
              Mã sản phẩm: <span className="font-semibold text-text-primary">{product.productCode}</span>
            </p>
          )}

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
            {product.vaccinationStatus && (
              <div className="flex justify-between px-4 py-2">
                <dt className="text-text-muted">Tiêm phòng</dt>
                <dd className="font-medium text-text-primary">{product.vaccinationStatus}</dd>
              </div>
            )}
            {product.characterTraits && (
              <div className="flex justify-between px-4 py-2">
                <dt className="text-text-muted">Tính cách</dt>
                <dd className="font-medium text-text-primary">{product.characterTraits}</dd>
              </div>
            )}
          </dl>

          {product.description && (
            <p className="text-sm leading-relaxed text-text-secondary whitespace-pre-line">
              {product.description}
            </p>
          )}

          {/* Chat CTA — passes productCode so chat can auto-fill the inquiry template */}
          <ProductCTA
            productId={product.id}
            productCode={product.productCode}
            productName={product.name}
            slug={product.slug}
          />
        </div>
      </div>
    </div>
  )
}
