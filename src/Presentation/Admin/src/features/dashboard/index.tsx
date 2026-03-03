import { DollarSign, Users, ShoppingCart, Package, TrendingUp, TrendingDown, Download, Plus, RefreshCw } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SkeletonStats } from '@/components/ui/skeleton'
import { EmptyState, ErrorState } from '@/components/empty-state'
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

const topNav = [
  { title: 'Overview', href: '/', isActive: true },
  { title: 'Customers', href: '/users', isActive: false },
  { title: 'Products', href: '/products', isActive: false },
  { title: 'Settings', href: '/settings', isActive: false },
]

export function Dashboard() {
  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats()
  const { data: recentSales, isLoading: salesLoading, error: salesError, refetch: refetchSales } = useRecentSales(5)

  const isError = statsError || salesError

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <TopNav links={topNav} />
        <div className='ms-auto flex items-center gap-2 sm:gap-4'>
          <Search />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main className='animate-fade-in'>
        <div className='mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight'>Dashboard</h1>
            <p className='text-sm text-muted-foreground'>
              İşletmenizin performansına genel bakış
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' size='sm' onClick={() => { refetchStats(); refetchSales(); }}>
              <RefreshCw className='mr-2 h-4 w-4' />
              Yenile
            </Button>
            <Button size='sm'>
              <Download className='mr-2 h-4 w-4' />
              Rapor İndir
            </Button>
          </div>
        </div>

        {isError ? (
          <ErrorState
            title="Dashboard verileri yüklenemedi"
            description="İstatistikler alınırken bir hata oluştu. Lütfen tekrar deneyin."
            onRetry={() => { refetchStats(); refetchSales(); }}
          />
        ) : (
          <Tabs
            orientation='vertical'
            defaultValue='overview'
            className='space-y-6'
          >
            <div className='w-full overflow-x-auto pb-1'>
              <TabsList className='w-full sm:w-auto'>
                <TabsTrigger value='overview'>Genel Bakış</TabsTrigger>
                <TabsTrigger value='analytics'>Analitik</TabsTrigger>
                <TabsTrigger value='reports' disabled>
                  Raporlar
                </TabsTrigger>
                <TabsTrigger value='notifications' disabled>
                  Bildirimler
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='overview' className='space-y-6'>
              {/* Statistics Cards */}
              {statsLoading ? (
                <SkeletonStats count={4} />
              ) : (
                <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                  <StatisticCard
                    title='Toplam Ürün'
                    value={stats?.totalProducts?.toLocaleString('tr-TR') ?? '—'}
                    icon={Package}
                    trend={stats?.productsChange !== undefined ? {
                      value: Math.abs(stats.productsChange),
                      isPositive: stats.productsChange >= 0,
                      label: 'geçen aya göre'
                    } : undefined}
                    variant='default'
                  />
                  <StatisticCard
                    title='Toplam Sepet'
                    value={stats?.totalCarts?.toLocaleString('tr-TR') ?? '—'}
                    icon={ShoppingCart}
                    trend={stats?.cartsChange !== undefined ? {
                      value: Math.abs(stats.cartsChange),
                      isPositive: stats.cartsChange >= 0,
                      label: 'geçen aya göre'
                    } : undefined}
                    variant='info'
                  />
                  <StatisticCard
                    title='Aktif Kullanıcılar'
                    value={stats?.totalUsers?.toLocaleString('tr-TR') ?? '—'}
                    icon={Users}
                    trend={stats?.usersChange !== undefined ? {
                      value: Math.abs(stats.usersChange),
                      isPositive: stats.usersChange >= 0,
                      label: 'geçen aya göre'
                    } : undefined}
                    variant='success'
                  />
                  <StatisticCard
                    title='Son Satışlar'
                    value={stats?.recentSales?.toLocaleString('tr-TR') ?? '—'}
                    icon={DollarSign}
                    trend={stats?.salesChange !== undefined ? {
                      value: Math.abs(stats.salesChange),
                      isPositive: stats.salesChange >= 0,
                      label: 'geçen aya göre'
                    } : undefined}
                    variant={stats?.salesChange && stats.salesChange >= 0 ? 'success' : 'error'}
                  />
                </div>
              )}

              {/* Main Content Grid */}
              <div className='grid gap-6 lg:grid-cols-7'>
                {/* Analytics Chart */}
                <Card className='lg:col-span-4'>
                  <CardHeader>
                    <CardTitle>Gelir Grafiği</CardTitle>
                    <CardDescription>
                      Son 30 günlük gelir performansı
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='pl-2'>
                    <Analytics />
                  </CardContent>
                </Card>

                {/* Recent Sales */}
                <Card className='lg:col-span-3'>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-4'>
                    <div>
                      <CardTitle>Son Satışlar</CardTitle>
                      <CardDescription>
                        Son {recentSales?.length || 0} satış işlemi
                      </CardDescription>
                    </div>
                    <Button variant='ghost' size='sm' className='gap-1'>
                      Tümünü Gör
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {salesLoading ? (
                      <div className='space-y-4'>
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className='flex items-center gap-4'>
                            <div className='h-9 w-9 rounded-full bg-muted' />
                            <div className='flex-1 space-y-1'>
                              <div className='h-4 w-24 bg-muted rounded' />
                              <div className='h-3 w-32 bg-muted rounded' />
                            </div>
                            <div className='h-4 w-16 bg-muted rounded' />
                          </div>
                        ))}
                      </div>
                    ) : salesError ? (
                      <EmptyState
                        icon={TrendingDown}
                        title="Veri yüklenemedi"
                        description="Satış verileri alınırken bir hata oluştu."
                        action={{
                          label: 'Tekrar Dene',
                          onClick: refetchSales
                        }}
                        size='sm'
                      />
                    ) : (
                      <RecentSales sales={recentSales || []} />
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Overview Section */}
              <Card>
                <CardHeader>
                  <CardTitle>Genel Performans</CardTitle>
                  <CardDescription>
                    Tüm metriklerin detaylı analizi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Overview />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Hızlı İşlemler</CardTitle>
                  <CardDescription>
                    Sık kullanılan işlemler için kısayollar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
                    <Button variant='outline' className='h-auto flex-col items-start gap-2 p-4 text-left hover:bg-muted/50'>
                      <Plus className='h-5 w-5 text-primary' />
                      <div>
                        <div className='font-medium'>Yeni Ürün</div>
                        <div className='text-xs text-muted-foreground'>Ürün kataloğuna ekle</div>
                      </div>
                    </Button>
                    <Button variant='outline' className='h-auto flex-col items-start gap-2 p-4 text-left hover:bg-muted/50'>
                      <Users className='h-5 w-5 text-success' />
                      <div>
                        <div className='font-medium'>Kullanıcı Davet</div>
                        <div className='text-xs text-muted-foreground'>Yeni kullanıcı ekle</div>
                      </div>
                    </Button>
                    <Button variant='outline' className='h-auto flex-col items-start gap-2 p-4 text-left hover:bg-muted/50'>
                      <ShoppingCart className='h-5 w-5 text-info' />
                      <div>
                        <div className='font-medium'>Sipariş Yönetimi</div>
                        <div className='text-xs text-muted-foreground'>Bekleyen siparişler</div>
                      </div>
                    </Button>
                    <Button variant='outline' className='h-auto flex-col items-start gap-2 p-4 text-left hover:bg-muted/50'>
                      <TrendingUp className='h-5 w-5 text-warning-foreground' />
                      <div>
                        <div className='font-medium'>Rapor Oluştur</div>
                        <div className='text-xs text-muted-foreground'>Özel rapor hazırla</div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value='analytics' className='space-y-6'>
              <Card>
                <CardHeader>
                  <CardTitle>Detaylı Analitik</CardTitle>
                  <CardDescription>
                    Tüm metriklerin detaylı analizi burada gösterilecek
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmptyState
                    icon={TrendingUp}
                    title="Analitik modülü geliştirme aşamasında"
                    description="Bu özellik yakında kullanıma sunulacak."
                    size='md'
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </Main>
    </>
  )
}
