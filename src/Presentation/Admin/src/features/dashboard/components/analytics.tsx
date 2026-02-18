import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AnalyticsChart } from './analytics-chart'
import { MousePointerClick, Users, TrendingUp, Clock } from 'lucide-react'

interface AnalyticsProps {
  totalClicks?: number
  uniqueVisitors?: number
  bounceRate?: number
  avgSession?: number
  clicksChange?: number
  visitorsChange?: number
  bounceRateChange?: number
  sessionChange?: number
}

export function Analytics({
  totalClicks = 1248,
  uniqueVisitors = 832,
  bounceRate = 42,
  avgSession = 4,
  clicksChange = 12.4,
  visitorsChange = 5.8,
  bounceRateChange = -3.2,
  sessionChange = 8.2,
}: AnalyticsProps) {
  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle>Traffic Overview</CardTitle>
          <CardDescription>Weekly clicks and unique visitors</CardDescription>
        </CardHeader>
        <CardContent className='px-6'>
          <AnalyticsChart />
        </CardContent>
      </Card>
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Clicks</CardTitle>
            <MousePointerClick className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{totalClicks.toLocaleString()}</div>
            <p className={`text-xs ${clicksChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {clicksChange >= 0 ? '+' : ''}{clicksChange}% vs last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Unique Visitors
            </CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{uniqueVisitors.toLocaleString()}</div>
            <p className={`text-xs ${visitorsChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {visitorsChange >= 0 ? '+' : ''}{visitorsChange}% vs last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Bounce Rate</CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{bounceRate}%</div>
            <p className={`text-xs ${bounceRateChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {bounceRateChange >= 0 ? '+' : ''}{bounceRateChange}% vs last week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Avg. Session</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{avgSession}m</div>
            <p className={`text-xs ${sessionChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {sessionChange >= 0 ? '+' : ''}{sessionChange}% vs last week
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
