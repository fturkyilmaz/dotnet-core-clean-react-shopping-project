import { DollarSign, Users, ShoppingCart, Package } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { TopNav } from '@/components/layout/top-nav'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { StatisticCard } from './components/statistic-card'
import { Analytics } from './components/analytics'
import { Overview } from './components/overview'
import { RecentSales } from './components/recent-sales'
import { useDashboardStats, useRecentSales } from './hooks/useDashboard'

export function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError } = useDashboardStats()
  const { data: recentSales, isLoading: salesLoading, error: salesError } = useRecentSales(5)

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
          <div className='flex items-center space-x-2'>
            <Button>Download</Button>
          </div>
        </div>
        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Overview</TabsTrigger>
              <TabsTrigger value='analytics'>Analytics</TabsTrigger>
              <TabsTrigger value='reports' disabled>
                Reports
              </TabsTrigger>
              <TabsTrigger value='notifications' disabled>
                Notifications
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value='overview' className='space-y-4'>
            {/* Statistics Cards */}
            <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
              {statsLoading ? (
                <>
                  <Skeleton className='h-32' />
                  <Skeleton className='h-32' />
                  <Skeleton className='h-32' />
                  <Skeleton className='h-32' />
                </>
              ) : statsError ? (
                <Card className='col-span-4'>
                  <CardContent className='pt-6'>
                    <p className='text-sm text-red-500'>
                      Failed to load statistics: {(statsError as Error).message}
                    </p>
                  </CardContent>
                </Card>
              ) : stats ? (
                <>
                  <StatisticCard
                    title='Total Products'
                    value={stats.totalProducts}
                    change={stats.productsChange}
                    icon={Package}
                    iconColor='text-blue-500'
                  />
                  <StatisticCard
                    title='Total Carts'
                    value={stats.totalCarts}
                    change={stats.cartsChange}
                    icon={ShoppingCart}
                    iconColor='text-green-500'
                  />
                  <StatisticCard
                    title='Total Users'
                    value={stats.totalUsers}
                    change={stats.usersChange}
                    icon={Users}
                    iconColor='text-purple-500'
                  />
                  <StatisticCard
                    title='Recent Sales'
                    value={stats.recentSales}
                    change={stats.salesChange}
                    icon={DollarSign}
                    iconColor='text-orange-500'
                  />
                </>
              ) : (
                <Skeleton className='h-32 col-span-4' />
              )}
            </div>

            {/* Overview and Recent Sales */}
            <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
              <Card className='col-span-1 lg:col-span-4'>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className='ps-2'>
                  <Overview />
                </CardContent>
              </Card>
              <Card className='col-span-1 lg:col-span-3'>
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    {recentSales
                      ? `You made ${recentSales.length} sales this month.`
                      : 'Loading sales data...'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {salesLoading ? (
                    <div className='space-y-2'>
                      <Skeleton className='h-12' />
                      <Skeleton className='h-12' />
                      <Skeleton className='h-12' />
                    </div>
                  ) : salesError ? (
                    <p className='text-sm text-red-500'>
                      Failed to load recent sales: {(salesError as Error).message}
                    </p>
                  ) : (
                    <RecentSales sales={recentSales || []} />
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value='analytics' className='space-y-4'>
            <Analytics />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}

const topNav = [
  {
    title: 'Overview',
    href: 'dashboard/overview',
    isActive: true,
    disabled: false,
  },
  {
    title: 'Customers',
    href: 'dashboard/customers',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Products',
    href: 'dashboard/products',
    isActive: false,
    disabled: true,
  },
  {
    title: 'Settings',
    href: 'dashboard/settings',
    isActive: false,
    disabled: true,
  },
]
