import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RefreshCw, Search, Trash2, Plus, Loader2 } from 'lucide-react'
import { useCacheValue, useSetCache, useDeleteCache } from '@/hooks/useCache'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
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

const searchSchema = z.object({
    key: z.string().min(1, 'Key is required'),
})

const setSchema = z.object({
    key: z.string().min(1, 'Key is required'),
    value: z.string().min(1, 'Value is required'),
})

export function CacheManagement() {
    const [searchKey, setSearchKey] = useState('')
    const { data: cacheValue, isLoading: isSearching, refetch } = useCacheValue(searchKey, !!searchKey)
    const setCache = useSetCache()
    const deleteCache = useDeleteCache()

    const searchForm = useForm<z.infer<typeof searchSchema>>({
        resolver: zodResolver(searchSchema),
        defaultValues: { key: '' },
    })

    const setForm = useForm<z.infer<typeof setSchema>>({
        resolver: zodResolver(setSchema),
        defaultValues: { key: '', value: '' },
    })

    const handleSearch = (data: z.infer<typeof searchSchema>) => {
        setSearchKey(data.key)
    }

    const handleSet = async (data: z.infer<typeof setSchema>) => {
        await setCache.mutateAsync(data)
        setForm.reset()
    }

    const handleDelete = async () => {
        if (searchKey) {
            await deleteCache.mutateAsync(searchKey)
            setSearchKey('')
            searchForm.reset()
        }
    }

    return (
        <>
            <Header>
                <div className='ml-auto flex items-center gap-4'>
                    <ThemeSwitch />
                    <ProfileDropdown />
                </div>
            </Header>

            <Main>
                <div className='mb-6'>
                    <h2 className='text-2xl font-bold tracking-tight'>Cache Management</h2>
                    <p className='text-muted-foreground'>
                        Manage Redis cache entries. Admin access required.
                    </p>
                </div>

                <div className='grid gap-6 md:grid-cols-2'>
                    {/* Search Cache */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Search className='h-5 w-5' />
                                Get Cache Value
                            </CardTitle>
                            <CardDescription>
                                Search for a cache entry by key
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...searchForm}>
                                <form onSubmit={searchForm.handleSubmit(handleSearch)} className='space-y-4'>
                                    <FormField
                                        control={searchForm.control}
                                        name='key'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cache Key</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='Enter cache key' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className='flex gap-2'>
                                        <Button type='submit' disabled={isSearching}>
                                            {isSearching ? <Loader2 className='animate-spin' /> : <Search />}
                                            Search
                                        </Button>
                                        {searchKey && (
                                            <>
                                                <Button
                                                    type='button'
                                                    variant='outline'
                                                    onClick={() => refetch()}
                                                >
                                                    <RefreshCw />
                                                </Button>
                                                <Button
                                                    type='button'
                                                    variant='destructive'
                                                    onClick={handleDelete}
                                                    disabled={deleteCache.isPending}
                                                >
                                                    {deleteCache.isPending ? (
                                                        <Loader2 className='animate-spin' />
                                                    ) : (
                                                        <Trash2 />
                                                    )}
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </form>
                            </Form>

                            {searchKey && (
                                <div className='mt-4 p-4 rounded-md bg-muted'>
                                    <p className='text-sm font-medium mb-2'>Value:</p>
                                    <pre className='text-sm overflow-auto max-h-40'>
                                        {cacheValue || 'Not found'}
                                    </pre>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Set Cache */}
                    <Card>
                        <CardHeader>
                            <CardTitle className='flex items-center gap-2'>
                                <Plus className='h-5 w-5' />
                                Set Cache Value
                            </CardTitle>
                            <CardDescription>
                                Create or update a cache entry
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Form {...setForm}>
                                <form onSubmit={setForm.handleSubmit(handleSet)} className='space-y-4'>
                                    <FormField
                                        control={setForm.control}
                                        name='key'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cache Key</FormLabel>
                                                <FormControl>
                                                    <Input placeholder='Enter cache key' {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={setForm.control}
                                        name='value'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cache Value</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder='Enter cache value'
                                                        className='resize-none'
                                                        rows={4}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type='submit' disabled={setCache.isPending}>
                                        {setCache.isPending && <Loader2 className='animate-spin' />}
                                        Set Value
                                    </Button>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </Main>
        </>
    )
}
