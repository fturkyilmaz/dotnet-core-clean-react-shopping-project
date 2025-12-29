import { Loader2 } from 'lucide-react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { CartDto } from '@/lib/api/types'

interface CartDeleteDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    cart: CartDto | null
    onConfirm: () => void
    isDeleting: boolean
}

export function CartDeleteDialog({
    open,
    onOpenChange,
    cart,
    onConfirm,
    isDeleting,
}: CartDeleteDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the
                        cart item <strong>"{cart?.title}"</strong>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    >
                        {isDeleting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
