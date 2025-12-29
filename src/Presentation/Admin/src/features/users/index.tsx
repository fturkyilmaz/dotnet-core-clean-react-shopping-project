import { getRouteApi } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { useUsers } from '@/hooks/useUsers'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { UsersDialogs } from './components/users-dialogs'
import { UsersPrimaryButtons } from './components/users-primary-buttons'
import { UsersProvider } from './components/users-provider'
import { UsersTable } from './components/users-table'
import type { User } from './data/schema'

const route = getRouteApi('/_authenticated/users/')

export function Users() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  const { data: apiUsers, isLoading, refetch, isRefetching } = useUsers()

  // Transform API response to User type
  const users: User[] = (apiUsers || []).map((user) => ({
    id: user.id || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    userName: user.userName || '',
    email: user.email || '',
    gender: user.gender || '',
    roles: user.roles || [],
    status: 'active' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }))

  return (
    <UsersProvider>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <div className='flex gap-2'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              <RefreshCw className={isRefetching ? 'animate-spin' : ''} />
              Refresh
            </Button>
            <UsersPrimaryButtons />
          </div>
        </div>
        <UsersTable data={users} search={search} navigate={navigate} isLoading={isLoading} />
      </Main>

      <UsersDialogs />
    </UsersProvider>
  )
}
