import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

const variants = {
  success:   'bg-success/10 text-success',
  warning:   'bg-warning/20 text-text-primary',
  danger:    'bg-danger/10 text-danger',
  info:      'bg-info/10 text-info',
  muted:     'bg-surface-muted text-text-muted border border-surface-border',
  primary:   'bg-primary/10 text-primary',
}

interface BadgeProps {
  variant?: keyof typeof variants
  children: ReactNode
  className?: string
}

export function Badge({ variant = 'muted', children, className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  )
}