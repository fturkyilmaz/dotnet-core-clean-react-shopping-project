import { useState } from 'react'
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuditLogs } from '@/hooks/useAuditLogs'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

export function AuditLogs() {
    const [pageNumber, setPageNumber] = useState(1)
    const pageSize = 10

    const { data, isLoading, refetch, isRefetching } = useAuditLogs(pageNumber, pageSize)

    return (
        <>
            <Header>
                <Search />
                <div className='ml-auto flex items-center gap-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className='mb-2 flex flex-wrap items-center justify-between gap-x-4 space-y-2'>
                    <div>
                        <h2 className='text-2xl font-bold tracking-tight'>Audit Logs</h2>
                        <p className='text-muted-foreground'>
                            View system audit logs. Admin access required.
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
                    </div>
                </div>

                <div className='rounded-md border'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className='w-16'>ID</TableHead>
                                <TableHead>User ID</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>Entity</TableHead>
                                <TableHead>Entity ID</TableHead>
                                <TableHead>Timestamp</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                [...Array(5)].map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                                        <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                                        <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                                        <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                                        <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                                        <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                                    </TableRow>
                                ))
                            ) : data?.items?.length ? (
                                data.items.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className='font-medium'>{log.id}</TableCell>
                                        <TableCell className='text-muted-foreground'>
                                            {log.userId}
                                        </TableCell>
                                        <TableCell>{log.action}</TableCell>
                                        <TableCell>{log.entity}</TableCell>
                                        <TableCell>{log.entityId}</TableCell>
                                        <TableCell className='text-muted-foreground'>
                                            {log.timestamp
                                                ? new Date(log.timestamp).toLocaleString()
                                                : '-'}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className='text-center py-8'>
                                        <p className='text-muted-foreground'>No audit logs found.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                {data && (
                    <div className='flex items-center justify-between mt-4'>
                        <p className='text-sm text-muted-foreground'>
                            Page {data.pageNumber} of {data.totalPages} ({data.totalCount} total)
                        </p>
                        <div className='flex gap-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
                                disabled={!data.hasPreviousPage}
                            >
                                <ChevronLeft />
                                Previous
                            </Button>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => setPageNumber((p) => p + 1)}
                                disabled={!data.hasNextPage}
                            >
                                Next
                                <ChevronRight />
                            </Button>
                        </div>
                    </div>
                )}
            </Main>
        </>
    )
}
