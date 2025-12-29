import { createFileRoute } from '@tanstack/react-router'
import { Carts } from '@/features/carts'

export const Route = createFileRoute('/_authenticated/carts/')({
    component: Carts,
})
