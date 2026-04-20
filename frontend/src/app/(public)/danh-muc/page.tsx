import type { Metadata } from 'next'
import Link from 'next/link'
import { PublicCategory } from '@/types/product'

export const metadata: Metadata = {
  title: 'Danh mục',
  description: 'Khám phá các dòng gà tre theo danh mục — liên hệ thương lượng giá trực tiếp.',
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080'

async function fetchCategories(): Promise<PublicCategory[]> {
  try {
    const res = await fetch(`${API_BASE}/api/public/categories`, { cache: 'no-store' })
    const body = await res.json()
    return body.success ? (body.data as PublicCategory[]) : []
  } catch {
    return []
  }
}

export default async function CategoryListPage() {
  const categories = await fetchCategories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Danh mục</h1>
        <p className="mt-1 text-sm text-text-muted">
          Chọn danh mục để xem các giống gà tre tương ứng.
        </p>
      </div>

      {categories.length === 0 ? (
        <p className="text-sm text-text-muted">Chưa có danh mục nào.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?categoryId=${cat.id}`}
              className="group rounded-card border border-surface-border bg-surface p-5 shadow-card transition-shadow hover:shadow-card-hover"
            >
              <h2 className="font-semibold text-text-primary transition-colors group-hover:text-primary">
                {cat.name}
              </h2>
              {cat.description && (
                <p className="mt-2 line-clamp-2 text-sm text-text-muted">{cat.description}</p>
              )}
              <p className="mt-3 text-xs font-medium text-primary">
                Xem sản phẩm →
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
