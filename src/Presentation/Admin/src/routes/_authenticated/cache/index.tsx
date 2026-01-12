import { createFileRoute } from '@tanstack/react-router'
import { CacheManagement } from '@/features/cache'

export const Route = createFileRoute('/_authenticated/cache/')({
    component: CacheManagement,
})
