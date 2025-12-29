import { useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'
import { useCreateCart, useUpdateCart } from '@/hooks/useCarts'
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
import { Button } from '@/components/ui/button'
import type { CartDto } from '@/lib/api/types'

const formSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    price: z.coerce.number().min(0, 'Price must be positive'),
    quantity: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
    image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
})

type FormData = z.infer<typeof formSchema>

interface CartDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    cart: CartDto | null
}

export function CartDialog({
    open,
    onOpenChange,
    cart,
}: CartDialogProps) {
    const createCart = useCreateCart()
    const updateCart = useUpdateCart()

    const isEditing = !!cart
    const isPending = createCart.isPending || updateCart.isPending

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            price: 0,
            quantity: 1,
            image: '',
        },
    })

    useEffect(() => {
        if (cart) {
            form.reset({
                title: cart.title || '',
                price: cart.price || 0,
                quantity: cart.quantity || 1,
                image: cart.image || '',
            })
        } else {
            form.reset({
                title: '',
                price: 0,
                quantity: 1,
                image: '',
            })
        }
    }, [cart, form])

    async function onSubmit(data: FormData) {
        try {
            if (isEditing && cart?.id) {
                await updateCart.mutateAsync({
                    id: cart.id,
                    command: {
                        id: cart.id,
                        ...data,
                    },
                })
            } else {
                await createCart.mutateAsync(data)
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
                    <DialogTitle>{isEditing ? 'Edit Cart' : 'Create Cart'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Make changes to the cart item here.'
                            : 'Fill in the details to create a new cart item.'}
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
                                        <Input placeholder='Item title' {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className='grid grid-cols-2 gap-4'>
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
                                name='quantity'
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Quantity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type='number'
                                                min='1'
                                                placeholder='1'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

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
