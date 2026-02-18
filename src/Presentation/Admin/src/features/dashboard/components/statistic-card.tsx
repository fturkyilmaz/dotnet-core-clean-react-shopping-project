import type { LucideIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface StatisticCardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: LucideIcon
  iconColor?: string
  description?: string
}

export function StatisticCard({
  title,
  value,
  change,
  changeLabel = 'from last month',
  icon: Icon,
  iconColor = 'text-muted-foreground',
  description,
}: StatisticCardProps) {
  const isPositive = change && change > 0
  const isNegative = change && change < 0

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>{value}</div>
        {change !== undefined && (
          <p className='text-xs text-muted-foreground'>
            <span
              className={`inline-flex items-center ${
                isPositive
                  ? 'text-green-500'
                  : isNegative
                    ? 'text-red-500'
                    : ''
              }`}
            >
              {isPositive && '+'}
              {change}%
            </span>{' '}
            {changeLabel}
          </p>
        )}
        {description && (
          <CardDescription className='mt-1'>{description}</CardDescription>
        )}
      </CardContent>
    </Card>
  )
}
