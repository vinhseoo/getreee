'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'
import { FavoriteButton } from './FavoriteButton'

interface Props {
  productId: number
  productCode: string | null
  productName: string
  slug: string
}

export function ProductCTA({ productId, productCode, productName, slug }: Props) {
  const router = useRouter()
  const { user } = useAuthStore()

  function handleClick() {
    if (user) {
      const params = new URLSearchParams({
        productId: String(productId),
        productName: productName,
        ...(productCode ? { productCode } : {}),
      })
      router.push(`/dashboard/chat?${params.toString()}`)
    } else {
      router.push(`/dang-nhap?redirect=/san-pham/${slug}`)
    }
  }

  return (
    <div className="rounded-card border border-primary/30 bg-primary/5 px-5 py-4">
      <p className="text-sm font-medium text-primary">Giá thương lượng</p>
      <p className="mt-1 text-xs text-text-muted">
        Giá không được hiển thị công khai. Vui lòng liên hệ để thương lượng trực tiếp.
      </p>
      <div className="mt-3 flex items-stretch gap-2">
        <Button onClick={handleClick} className="flex-1">
          Liên hệ thương lượng giá →
        </Button>
        <FavoriteButton productId={productId} productSlug={slug} />
      </div>
    </div>
  )
}
