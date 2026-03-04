import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from 'lucide-react'

interface Trend {
  value: number
  isPositive: boolean
  label?: string
}

interface StatisticCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: Trend
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
}

export function StatisticCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  variant = 'default',
}: StatisticCardProps) {
  const variantStyles = {
    default: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    success: {
      iconBg: 'bg-success/10',
      iconColor: 'text-success',
    },
    warning: {
      iconBg: 'bg-warning/10',
      iconColor: 'text-warning-foreground',
    },
    error: {
      iconBg: 'bg-destructive/10',
      iconColor: 'text-destructive',
    },
    info: {
      iconBg: 'bg-info/10',
      iconColor: 'text-info',
    },
  }

  const styles = variantStyles[variant]

  const TrendIcon = trend?.isPositive ? ArrowUpRight : ArrowDownRight

  return (
    <Card className={cn('card-hover overflow-hidden', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {Icon && (
          <div
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-lg',
              styles.iconBg
            )}
          >
            <Icon className={cn('h-5 w-5', styles.iconColor)} />
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium',
                trend?.isPositive
                  ? 'bg-success/10 text-success'
                  : 'bg-destructive/10 text-destructive'
              )}
            >
              <TrendIcon className="h-3 w-3" />
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        {(description || trend?.label) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
            {trend?.label && (
              <span className="ml-1">{trend.label}</span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// Specialized stat cards for common use cases
interface QuickStatProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  className?: string
}

export function QuickStat({
  label,
  value,
  change,
  changeLabel = 'vs geçen ay',
  className,
}: QuickStatProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0
  const isNeutral = change === 0

  return (
    <div className={cn('space-y-1', className)}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {change !== undefined && (
          <span
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              isPositive && 'text-success',
              isNegative && 'text-destructive',
              isNeutral && 'text-muted-foreground'
            )}
          >
            {isPositive && <ArrowUpRight className="h-3 w-3" />}
            {isNegative && <ArrowDownRight className="h-3 w-3" />}
            {isNeutral && <Minus className="h-3 w-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      {change !== undefined && (
        <p className="text-xs text-muted-foreground">{changeLabel}</p>
      )}
    </div>
  )
}

// Mini stat card for compact layouts
interface MiniStatProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: number
  className?: string
}

export function MiniStat({
  label,
  value,
  icon: Icon,
  trend,
  className,
}: MiniStatProps) {
  const isPositive = trend && trend > 0
  const isNegative = trend && trend < 0

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-lg border border-border bg-card p-3',
        className
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-base font-semibold">{value}</span>
          {trend !== undefined && (
            <span
              className={cn(
                'flex items-center text-xs',
                isPositive && 'text-success',
                isNegative && 'text-destructive',
                !isPositive && !isNegative && 'text-muted-foreground'
              )}
            >
              {isPositive && <ArrowUpRight className="h-3 w-3" />}
              {isNegative && <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

// Comparison stat with progress bar
interface ComparisonStatProps {
  label: string
  current: number
  total: number
  unit?: string
  className?: string
}

export function ComparisonStat({
  label,
  current,
  total,
  unit = '',
  className,
}: ComparisonStatProps) {
  const percentage = Math.min((current / total) * 100, 100)

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {current}
          {unit} / {total}
          {unit}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            percentage >= 80
              ? 'bg-success'
              : percentage >= 50
              ? 'bg-primary'
              : 'bg-warning'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
