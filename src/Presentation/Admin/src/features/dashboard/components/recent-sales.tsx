import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import type { RecentSale } from '@/lib/api/types'

interface RecentSalesProps {
  sales: RecentSale[]
}

export function RecentSales({ sales }: RecentSalesProps) {
  if (!sales || sales.length === 0) {
    return (
      <div className='flex h-32 items-center justify-center text-sm text-muted-foreground'>
        No recent sales found.
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {sales.map((sale) => (
        <div key={sale.id} className='flex items-center gap-4'>
          <Avatar className='h-9 w-9'>
            <AvatarImage src={sale.avatar} alt={sale.name} />
            <AvatarFallback>
              {sale.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className='flex flex-1 flex-wrap items-center justify-between'>
            <div className='space-y-1'>
              <p className='text-sm leading-none font-medium'>{sale.name}</p>
              <p className='text-sm text-muted-foreground'>{sale.email}</p>
            </div>
            <div className='font-medium'>{sale.amount}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
