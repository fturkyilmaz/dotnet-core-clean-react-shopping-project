import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useCreateProduct, useUpdateProduct } from '@/hooks/useProducts'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import type { ProductDto } from '@/lib/api/types'

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    price: z.coerce.number().min(0, 'Price must be positive'),
    description: z.string().optional(),
    category: z.string().optional(),
    image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type FormData = z.infer<typeof formSchema>

interface ProductDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    product: ProductDto | null
}

export function ProductDialog({
    open,
    onOpenChange,
    product,
}: ProductDialogProps) {
    const createProduct = useCreateProduct()
    const updateProduct = useUpdateProduct()

    const isEditing = !!product
    const isPending = createProduct.isPending || updateProduct.isPending

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            price: 0,
            description: '',
            category: '',
            image: '',
        },
    })

    useEffect(() => {
        if (product) {
            form.reset({
                title: product.title || '',
                price: product.price || 0,
                description: product.description || '',
                category: product.category || '',
                image: product.image || '',
            })
        } else {
            form.reset({
                title: '',
                price: 0,
                description: '',
                category: '',
                image: '',
            })
        }
    }, [product, form])

    async function onSubmit(data: FormData) {
        try {
            if (isEditing && product?.id) {
                await updateProduct.mutateAsync({
                    id: product.id,
                    command: {
                        id: product.id,
                        ...data,
                    },
                })
            } else {
                await createProduct.mutateAsync(data)
            }
            onOpenChange(false)
            form.reset()
        } catch {
            // Error is handled in the hook
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className='sm:max-w-[500px]'>
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Product' : 'Create Product'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Make changes to the product here.'
                            : 'Fill in the details to create a new product.'}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Product title' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='price'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type='number'
                                            step='0.01'
                                            placeholder='0.00'
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='category'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <FormControl>
                                        <Input placeholder='Category' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='image'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder='https://...' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name='description'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder='Product description...'
                                            className='resize-none'
                                            rows={3}
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type='button'
                                variant='outline'
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                            <Button type='submit' disabled={isPending}>
                                {isPending && <Loader2 className='animate-spin' />}
                                {isEditing ? 'Save Changes' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
