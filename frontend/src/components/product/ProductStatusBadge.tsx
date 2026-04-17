import { Badge } from '@/components/ui/Badge'
import { ProductStatus } from '@/types/product'

const config: Record<ProductStatus, { label: string; variant: 'success' | 'danger' | 'muted' }> = {
  AVAILABLE: { label: 'Còn hàng', variant: 'success' },
  SOLD:      { label: 'Đã bán',   variant: 'danger' },
  HIDDEN:    { label: 'Ẩn',       variant: 'muted' },
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  const { label, variant } = config[status]
  return <Badge variant={variant}>{label}</Badge>
}