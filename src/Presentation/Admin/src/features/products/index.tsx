import { useState } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { useProducts, useDeleteProduct } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProductsTable } from './components/products-table'
import { ProductDialog } from './components/product-dialog'
import { ProductDeleteDialog } from './components/product-delete-dialog'
import type { ProductDto } from '@/lib/api/types'

export function Products() {
    const { data: products, isLoading, refetch, isRefetching } = useProducts()
    const deleteProduct = useDeleteProduct()

    const [dialogOpen, setDialogOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<ProductDto | null>(null)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [productToDelete, setProductToDelete] = useState<ProductDto | null>(null)

    const handleCreate = () => {
        setEditingProduct(null)
        setDialogOpen(true)
    }

    const handleEdit = (product: ProductDto) => {
        setEditingProduct(product)
        setDialogOpen(true)
    }

    const handleDelete = (product: ProductDto) => {
        setProductToDelete(product)
        setDeleteDialogOpen(true)
    }

    const confirmDelete = async () => {
        if (productToDelete?.id) {
            await deleteProduct.mutateAsync(productToDelete.id)
            setDeleteDialogOpen(false)
            setProductToDelete(null)
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
                        <h2 className='text-2xl font-bold tracking-tight'>Products</h2>
                        <p className='text-muted-foreground'>
                            Manage your products here. You can add, edit, and delete products.
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
                        <Button size='sm' onClick={handleCreate}>
                            <Plus />
                            Add Product
                        </Button>
                    </div>
                </div>

                <ProductsTable
                    products={products || []}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </Main>

            <ProductDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={editingProduct}
            />

            <ProductDeleteDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                product={productToDelete}
                onConfirm={confirmDelete}
                isDeleting={deleteProduct.isPending}
            />
        </>
    )
}
