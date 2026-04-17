import Image from 'next/image'
import Link from 'next/link'
import { ProductSnapshot } from '@/types/chat'

interface Props {
  snapshot: ProductSnapshot
}

export function ProductCardMini({ snapshot }: Props) {
  return (
    <Link
      href={`/san-pham/${snapshot.slug}`}
      className="mt-2 flex items-center gap-2 rounded-card border border-surface-border bg-surface p-2 hover:border-primary transition-colors"
    >
      {snapshot.primaryMediaUrl ? (
        <Image
          src={snapshot.primaryMediaUrl}
          alt={snapshot.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-btn object-cover"
        />
      ) : (
        <div className="h-12 w-12 rounded-btn bg-surface-muted" />
      )}
      <div className="min-w-0">
        <p className="truncate text-xs font-medium text-text-primary">{snapshot.name}</p>
        <p className="text-xs text-text-muted">Xem sản phẩm →</p>
      </div>
    </Link>
  )
}