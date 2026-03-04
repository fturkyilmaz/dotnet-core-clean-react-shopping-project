import { useState, useMemo } from 'react'
import { Plus, RefreshCw } from 'lucide-react'
import { useProductsPaged, useDeleteProduct } from '@/hooks/useProducts'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { ProductsTable } from './components/products-table'
import { ProductDialog } from './components/product-dialog'
import { ProductDeleteDialog } from './components/product-delete-dialog'
import type { ProductDto, PaginatedList } from '@/lib/api/types'

const DEFAULT_PAGE_SIZE = 10
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50] as const

export function Products() {
    const [pagination, setPagination] = useState({
        pageNumber: 1,
        pageSize: DEFAULT_PAGE_SIZE
    })

    const { pageNumber, pageSize } = pagination

    const { data: paginatedData, isLoading, refetch, isRefetching } = useProductsPaged(pageNumber, pageSize)
    const deleteProduct = useDeleteProduct()

    // Extract pagination info from response
    const paginationData = useMemo<PaginatedList<ProductDto>>(() => {
        if (!paginatedData) {
            return {
                items: [],
                pageNumber: 1,
                totalPages: 1,
                totalCount: 0,
                hasPreviousPage: false,
                hasNextPage: false,
            }
        }
        return {
            items: paginatedData.items || [],
            pageNumber: paginatedData.pageNumber || 1,
            totalPages: paginatedData.totalPages || 1,
            totalCount: paginatedData.totalCount || 0,
            hasPreviousPage: paginatedData.hasPreviousPage || false,
            hasNextPage: paginatedData.hasNextPage || false,
        }
    }, [paginatedData])

    const products = paginationData.items || []

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

    const handlePageChange = (newPage: number) => {
        setPagination(prev => ({ ...prev, pageNumber: newPage }))
    }

    const handlePageSizeChange = (newSize: number) => {
        setPagination({ pageNumber: 1, pageSize: newSize })
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
                    products={products}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={PAGE_SIZE_OPTIONS}
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
