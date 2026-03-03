import { cn } from '@/lib/utils'
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  HelpCircle,
  Circle,
  Loader2,
  type LucideIcon
} from 'lucide-react'

type StatusType =
  | 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled'
  | 'success' | 'error' | 'warning' | 'info' | 'neutral'
  | 'processing' | 'draft' | 'archived'

interface StatusBadgeProps {
  status: StatusType | string
  label?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showIcon?: boolean
}

const statusConfig: Record<StatusType, {
  label: string
  icon: LucideIcon
  variant: 'success' | 'error' | 'warning' | 'info' | 'neutral'
}> = {
  active: { label: 'Aktif', icon: CheckCircle2, variant: 'success' },
  inactive: { label: 'Pasif', icon: Circle, variant: 'neutral' },
  pending: { label: 'Beklemede', icon: Clock, variant: 'warning' },
  completed: { label: 'Tamamlandı', icon: CheckCircle2, variant: 'success' },
  cancelled: { label: 'İptal Edildi', icon: XCircle, variant: 'error' },
  success: { label: 'Başarılı', icon: CheckCircle2, variant: 'success' },
  error: { label: 'Hata', icon: XCircle, variant: 'error' },
  warning: { label: 'Uyarı', icon: AlertTriangle, variant: 'warning' },
  info: { label: 'Bilgi', icon: HelpCircle, variant: 'info' },
  neutral: { label: 'Nötr', icon: Circle, variant: 'neutral' },
  processing: { label: 'İşleniyor', icon: Loader2, variant: 'info' },
  draft: { label: 'Taslak', icon: Clock, variant: 'neutral' },
  archived: { label: 'Arşivlendi', icon: Clock, variant: 'neutral' },
}

const variantStyles = {
  success: 'bg-success/10 text-success border-success/20',
  error: 'bg-destructive/10 text-destructive border-destructive/20',
  warning: 'bg-warning/10 text-warning-foreground border-warning/20',
  info: 'bg-info/10 text-info border-info/20',
  neutral: 'bg-muted text-muted-foreground border-border',
}

export function StatusBadge({
  status,
  label,
  size = 'md',
  className,
  showIcon = true
}: StatusBadgeProps) {
  const config = statusConfig[status as StatusType] || {
    label: status,
    icon: HelpCircle,
    variant: 'neutral',
  }

  const Icon = config.icon
  const displayLabel = label || config.label
  const variant = config.variant

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1.5',
    lg: 'px-3 py-1 text-sm gap-2',
  }

  const iconSizes = {
    sm: 'h-2.5 w-2.5',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors',
        sizeClasses[size],
        variantStyles[variant],
        className
      )}
    >
      {showIcon && (
        <Icon className={cn(iconSizes[size], status === 'processing' && 'animate-spin')} />
      )}
      <span className="capitalize">{displayLabel}</span>
    </span>
  )
}

// Dot variant for minimal display
interface StatusDotProps {
  status: StatusType | string
  size?: 'sm' | 'md' | 'lg'
  className?: string
  pulse?: boolean
}

export function StatusDot({ status, size = 'md', className, pulse = false }: StatusDotProps) {
  const config = statusConfig[status as StatusType] || {
    variant: 'neutral',
  }

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5',
  }

  const dotColors = {
    success: 'bg-success',
    error: 'bg-destructive',
    warning: 'bg-warning-foreground',
    info: 'bg-info',
    neutral: 'bg-muted-foreground',
  }

  return (
    <span
      className={cn(
        'inline-block rounded-full',
        sizeClasses[size],
        dotColors[config.variant],
        pulse && 'animate-pulse',
        className
      )}
    />
  )
}

// Combined badge with dot
interface StatusBadgeWithDotProps extends StatusBadgeProps {
  dotPosition?: 'left' | 'right'
  pulse?: boolean
}

export function StatusBadgeWithDot({
  status,
  label,
  size = 'md',
  className,
  dotPosition = 'left',
  pulse = false,
}: StatusBadgeWithDotProps) {
  const config = statusConfig[status as StatusType] || {
    label: status,
    icon: HelpCircle,
    variant: 'neutral',
  }

  const displayLabel = label || config.label

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1.5',
    md: 'px-2.5 py-0.5 text-xs gap-2',
    lg: 'px-3 py-1 text-sm gap-2.5',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium transition-colors',
        sizeClasses[size],
        variantStyles[config.variant],
        className
      )}
    >
      {dotPosition === 'left' && (
        <StatusDot status={status} size={size === 'sm' ? 'sm' : 'md'} pulse={pulse} />
      )}
      <span className="capitalize">{displayLabel}</span>
      {dotPosition === 'right' && (
        <StatusDot status={status} size={size === 'sm' ? 'sm' : 'md'} pulse={pulse} />
      )}
    </span>
  )
}
