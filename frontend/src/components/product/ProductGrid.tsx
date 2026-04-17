import { PublicProduct } from '@/types/product'
import { ProductCard } from './ProductCard'

export function ProductGrid({ products }: { products: PublicProduct[] }) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center text-text-muted">
        Không tìm thấy sản phẩm nào.
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map(p => <ProductCard key={p.id} product={p} />)}
    </div>
  )
}