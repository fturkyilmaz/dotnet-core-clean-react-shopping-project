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
import type { CartDto } from '@/lib/api/types'

interface CartsTableProps {
    carts: CartDto[]
    isLoading: boolean
    onEdit: (cart: CartDto) => void
    onDelete: (cart: CartDto) => void
}

export function CartsTable({
    carts,
    isLoading,
    onEdit,
    onDelete,
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
                            <TableRow key={i}>
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
    )
}
