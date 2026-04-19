'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { Button } from '@/components/ui/Button'

interface Props {
  productId: number
  productName: string
  slug: string
}

export function ProductCTA({ productId, productName, slug }: Props) {
  const router = useRouter()
  const { user } = useAuthStore()

  function handleClick() {
    if (user) {
      router.push(`/dashboard/chat?productId=${productId}&productName=${encodeURIComponent(productName)}`)
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
      <Button onClick={handleClick} className="mt-3 w-full">
        Liên hệ thương lượng giá →
      </Button>
    </div>
  )
}
