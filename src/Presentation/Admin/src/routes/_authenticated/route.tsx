import { createFileRoute, redirect } from '@tanstack/react-router'
import { AuthenticatedLayout } from '@/components/layout/authenticated-layout'
import { getAuthToken } from '@/lib/httpClient'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const token = getAuthToken()
    if (!token) {
      throw redirect({
        to: '/sign-in',
        search: {
          redirect: location.href,
        },
      })
    }
  },
  component: AuthenticatedLayout,
})
