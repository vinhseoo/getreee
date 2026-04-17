import Link from 'next/link'
import Image from 'next/image'
import { PublicProduct } from '@/types/product'
import { ProductStatusBadge } from './ProductStatusBadge'

export function ProductCard({ product }: { product: PublicProduct }) {
  return (
    <Link href={`/san-pham/${product.slug}`} className="group block">
      <div className="card overflow-hidden transition-shadow hover:shadow-card-hover">
        {/* Image */}
        <div className="relative -mx-4 -mt-4 mb-4 aspect-square overflow-hidden rounded-t-card bg-surface-muted">
          {product.primaryMediaUrl ? (
            <Image
              src={product.primaryMediaUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-text-muted">
              Chưa có ảnh
            </div>
          )}
          <div className="absolute right-2 top-2">
            <ProductStatusBadge status={product.status} />
          </div>
        </div>

        {/* Name */}
        <h3 className="line-clamp-2 font-semibold text-text-primary transition-colors group-hover:text-primary">
          {product.name}
        </h3>

        {/* Attributes */}
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-text-secondary">
          {product.featherColor && <span>Lông: {product.featherColor}</span>}
          {product.weightGrams  && <span>{product.weightGrams}g</span>}
          {product.ageMonths    && <span>{product.ageMonths} tháng</span>}
        </div>

        {/* CTA — no price ever rendered here */}
        <p className="mt-3 text-sm font-medium text-primary">Liên hệ thương lượng giá →</p>
      </div>
    </Link>
  )
}