import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import type { CartDto } from '@/lib/api/types'

interface CartsTableProps {
    carts: CartDto[]
    isLoading: boolean
    onEdit: (cart: CartDto) => void
    onDelete: (cart: CartDto) => void
    // Pagination props
    pageNumber?: number
    totalPages?: number
    totalCount?: number
    pageSize?: number
    hasPreviousPage?: boolean
    hasNextPage?: boolean
    onPageChange?: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
    pageSizeOptions?: readonly number[]
}

export function CartsTable({
    carts,
    isLoading,
    onEdit,
    onDelete,
    pageNumber = 1,
    totalPages = 1,
    totalCount = 0,
    pageSize = 10,
    hasPreviousPage = false,
    hasNextPage = false,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 30, 50],
}: CartsTableProps) {
    if (isLoading) {
        return (
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-16'>ID</TableHead>
                            <TableHead className='w-20'>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className='text-right'>Price</TableHead>
                            <TableHead className='text-right'>Quantity</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead className='w-24'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                                <TableCell><Skeleton className='h-12 w-12 rounded' /></TableCell>
                                <TableCell><Skeleton className='h-4 w-48' /></TableCell>
                                <TableCell><Skeleton className='h-4 w-16 ml-auto' /></TableCell>
                                <TableCell><Skeleton className='h-4 w-8 ml-auto' /></TableCell>
                                <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                                <TableCell><Skeleton className='h-8 w-20' /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (carts.length === 0) {
        return (
            <div className='rounded-md border p-8 text-center'>
                <p className='text-muted-foreground'>No carts found.</p>
            </div>
        )
    }

    return (
        <div className='space-y-4'>
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-16'>ID</TableHead>
                            <TableHead className='w-20'>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className='text-right'>Price</TableHead>
                            <TableHead className='text-right'>Quantity</TableHead>
                            <TableHead>Owner</TableHead>
                            <TableHead className='w-24'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {carts.map((cart) => (
                            <TableRow key={cart.id}>
                                <TableCell className='font-medium'>{cart.id}</TableCell>
                                <TableCell>
                                    {cart.image ? (
                                        <img
                                            src={cart.image}
                                            alt={cart.title || ''}
                                            className='h-12 w-12 rounded object-cover'
                                        />
                                    ) : (
                                        <div className='h-12 w-12 rounded bg-muted' />
                                    )}
                                </TableCell>
                                <TableCell className='max-w-xs truncate'>
                                    {cart.title}
                                </TableCell>
                                <TableCell className='text-right'>
                                    ${cart.price?.toFixed(2)}
                                </TableCell>
                                <TableCell className='text-right'>
                                    {cart.quantity}
                                </TableCell>
                                <TableCell className='text-muted-foreground'>
                                    {cart.ownerId}
                                </TableCell>
                                <TableCell>
                                    <div className='flex gap-1'>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() => onEdit(cart)}
                                        >
                                            <Pencil className='h-4 w-4' />
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() => onDelete(cart)}
                                        >
                                            <Trash2 className='h-4 w-4' />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {(totalPages > 1 || onPageSizeChange) && (
                <div className='flex items-center justify-between px-2'>
                    <div className='flex items-center gap-4'>
                        {/* Page Size Selector */}
                        {onPageSizeChange && (
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-muted-foreground'>Rows per page:</span>
                                <Select
                                    value={pageSize.toString()}
                                    onValueChange={(value) => onPageSizeChange(Number(value))}
                                >
                                    <SelectTrigger className='h-8 w-[70px]'>
                                        <SelectValue placeholder={pageSizeOptions[0]} />
                                    </SelectTrigger>
                                    <SelectContent side='top'>
                                        {pageSizeOptions.map((size) => (
                                            <SelectItem key={size} value={size.toString()}>
                                                {size}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className='text-muted-foreground text-sm'>
                            Page {pageNumber} of {totalPages} ({totalCount} total)
                        </div>
                    </div>
                    <div className='flex gap-2'>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onPageChange?.(pageNumber - 1)}
                            disabled={!hasPreviousPage}
                        >
                            <ChevronLeft className='h-4 w-4' />
                            Previous
                        </Button>
                        <Button
                            variant='outline'
                            size='sm'
                            onClick={() => onPageChange?.(pageNumber + 1)}
                            disabled={!hasNextPage}
                        >
                            Next
                            <ChevronRight className='h-4 w-4' />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
