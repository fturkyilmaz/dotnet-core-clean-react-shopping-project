import { useState } from 'react'
import { Plus, RefreshCw, Trash2 } from 'lucide-react'
import { useCarts, useDeleteCart, useDeleteAllCarts } from '@/hooks/useCarts'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CartsTable } from './components/carts-table'
import { CartDialog } from './components/cart-dialog'
import { CartDeleteDialog } from './components/cart-delete-dialog'
import type { CartDto } from '@/lib/api/types'

export function Carts() {
    const { data: carts, isLoading, refetch, isRefetching } = useCarts()
    const deleteCart = useDeleteCart()
    const deleteAllCarts = useDeleteAllCarts()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingCart, setEditingCart] = useState<CartDto | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [cartToDelete, setCartToDelete] = useState<CartDto | null>(null)

    const handleCreate = () => {
        setEditingCart(null)
        setDialogOpen(true)
    }

    const handleEdit = (cart: CartDto) => {
        setEditingCart(cart)
        setDialogOpen(true)
    }

    const handleDelete = (cart: CartDto) => {
        setCartToDelete(cart)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (cartToDelete?.id) {
            await deleteCart.mutateAsync(cartToDelete.id)
            setDeleteDialogOpen(false)
            setCartToDelete(null)
        }
    }

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
                        <h2 className='text-2xl font-bold tracking-tight'>Carts</h2>
                        <p className='text-muted-foreground'>
                            Manage shopping carts here. You can view, edit, and delete carts.
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
                        <Button
                            variant='destructive'
                            size='sm'
                            onClick={() => deleteAllCarts.mutate()}
                            disabled={deleteAllCarts.isPending || !carts?.length}
                        >
                            <Trash2 />
                            Delete All
                        </Button>
                        <Button size='sm' onClick={handleCreate}>
                            <Plus />
                            Add Cart
                        </Button>
                    </div>
                </div>

                <CartsTable
                    carts={carts || []}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Main>

            <CartDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                cart={editingCart}
            />

            <CartDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                cart={cartToDelete}
                onConfirm={confirmDelete}
                isDeleting={deleteCart.isPending}
            />
        </>
    )
}
