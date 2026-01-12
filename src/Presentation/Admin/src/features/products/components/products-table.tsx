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
import { Pencil, Trash2 } from 'lucide-react'
import type { ProductDto } from '@/lib/api/types'

interface ProductsTableProps {
    products: ProductDto[]
    isLoading: boolean
    onEdit: (product: ProductDto) => void
    onDelete: (product: ProductDto) => void
}

export function ProductsTable({
    products,
    isLoading,
    onEdit,
    onDelete,
}: ProductsTableProps) {
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
                            <TableRow key={i}>
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
    )
}
