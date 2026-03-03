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
import { Pencil, Trash2, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProductDto, PaginatedList } from '@/lib/api/types'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

interface ProductsTableProps {
    products: ProductDto[]
    isLoading: boolean
    onEdit: (product: ProductDto) => void
    onDelete: (product: ProductDto) => void
    pagination?: PaginatedList<ProductDto>
    onPageChange?: (page: number) => void
    onPageSizeChange?: (size: number) => void
    pageSizeOptions?: readonly number[]
}

export function ProductsTable({
    products,
    isLoading,
    onEdit,
    onDelete,
    pagination,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 30, 50],
}: ProductsTableProps) {
    const currentPage = pagination?.pageNumber || 1
    const totalPages = pagination?.totalPages || 1
    const totalCount = pagination?.totalCount || 0
    const hasPreviousPage = pagination?.hasPreviousPage || false
    const hasNextPage = pagination?.hasNextPage || false

    const startItem = (currentPage - 1) * (pagination?.totalCount ? Math.ceil(totalCount / (pagination?.totalPages || 1)) : 0) + 1
    const endItem = Math.min(currentPage * (pagination?.totalCount ? Math.ceil(totalCount / (pagination?.totalPages || 1)) : 0), totalCount)
    if (isLoading) {
        return (
            <div className='rounded-md border'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='w-16'>ID</TableHead>
                            <TableHead className='w-20'>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead className='text-right'>Price</TableHead>
                            <TableHead className='w-24'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[...Array(5)].map((_, i) => (
                            <TableRow key={`skeleton-${i}`}>
                                <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                                <TableCell><Skeleton className='h-12 w-12 rounded' /></TableCell>
                                <TableCell><Skeleton className='h-4 w-48' /></TableCell>
                                <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                                <TableCell><Skeleton className='h-4 w-16 ml-auto' /></TableCell>
                                <TableCell><Skeleton className='h-8 w-20' /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className='rounded-md border p-8 text-center'>
                <p className='text-muted-foreground'>No products found.</p>
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
                            <TableHead>Category</TableHead>
                            <TableHead className='text-right'>Price</TableHead>
                            <TableHead className='w-24'>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className='font-medium'>{product.id}</TableCell>
                                <TableCell>
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.title || ''}
                                            className='h-12 w-12 rounded object-cover'
                                        />
                                    ) : (
                                        <div className='h-12 w-12 rounded bg-muted' />
                                    )}
                                </TableCell>
                                <TableCell className='max-w-xs truncate'>
                                    {product.title}
                                </TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell className='text-right'>
                                    ${product.price?.toFixed(2)}
                                </TableCell>
                                <TableCell>
                                    <div className='flex gap-1'>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() => onEdit(product)}
                                        >
                                            <Pencil className='h-4 w-4' />
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() => onDelete(product)}
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
            {pagination && onPageChange && (
                <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='flex items-center gap-2 text-sm text-muted-foreground'>
                        <span>
                            Showing {startItem} to {endItem} of {totalCount} results
                        </span>
                    </div>

                    <div className='flex items-center gap-4'>
                        {/* Page Size Selector */}
                        {onPageSizeChange && (
                            <div className='flex items-center gap-2'>
                                <span className='text-sm text-muted-foreground'>Rows per page:</span>
                                <Select
                                    value={pagination?.totalCount ? Math.ceil(totalCount / (pagination?.totalPages || 1)).toString() : pageSizeOptions[0].toString()}
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

                        {/* Page Navigation */}
                        <div className='flex items-center gap-1'>
                            <span className='text-sm text-muted-foreground'>
                                Page {currentPage} of {totalPages}
                            </span>
                        </div>

                        <div className='flex items-center gap-1'>
                            <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8'
                                onClick={() => onPageChange(1)}
                                disabled={!hasPreviousPage}
                            >
                                <ChevronsLeft className='h-4 w-4' />
                            </Button>
                            <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8'
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={!hasPreviousPage}
                            >
                                <ChevronLeft className='h-4 w-4' />
                            </Button>
                            <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8'
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={!hasNextPage}
                            >
                                <ChevronRight className='h-4 w-4' />
                            </Button>
                            <Button
                                variant='outline'
                                size='icon'
                                className='h-8 w-8'
                                onClick={() => onPageChange(totalPages)}
                                disabled={!hasNextPage}
                            >
                                <ChevronsRight className='h-4 w-4' />
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
