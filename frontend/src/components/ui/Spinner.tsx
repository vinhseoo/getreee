import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'h-6 w-6 animate-spin rounded-full border-2 border-surface-border border-t-primary',
        className
      )}
      role="status"
      aria-label="Đang tải..."
    />
  )
}