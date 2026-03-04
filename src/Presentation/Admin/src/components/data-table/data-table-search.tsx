import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useState, useEffect, useCallback, useRef } from 'react'

interface DataTableSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  debounceMs?: number
}

export function DataTableSearch({
  value,
  onChange,
  placeholder = 'Ara...',
  className,
  debounceMs = 300,
}: DataTableSearchProps) {
  const [inputValue, setInputValue] = useState(value)
  const onChangeRef = useRef(onChange)

  // Keep the callback ref up to date without triggering re-renders
  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    setInputValue(value)
  }, [value])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputValue !== value) {
        onChangeRef.current(inputValue)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [inputValue, debounceMs, value])

  const handleClear = useCallback(() => {
    setInputValue('')
    onChange('')
  }, [onChange])

  return (
    <div className={cn('relative max-w-sm', className)}>
      <Search className='absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
      <Input
        type='text'
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className='h-9 w-full rounded-md border border-input bg-transparent py-1 pl-9 pr-8 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50'
      />
      {inputValue && (
        <Button
          variant='ghost'
          size='sm'
          className='absolute right-0 top-0 h-full px-2 py-0 hover:bg-transparent'
          onClick={handleClear}
        >
          <X className='h-4 w-4 text-muted-foreground hover:text-foreground' />
          <span className='sr-only'>Aramayı temizle</span>
        </Button>
      )}
    </div>
  )
}
