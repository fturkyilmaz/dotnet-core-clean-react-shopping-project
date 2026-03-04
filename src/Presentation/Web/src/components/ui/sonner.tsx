import { Toaster as Sonner, ToasterProps } from 'sonner'
import { useTheme } from '@/context/theme-provider'

export function Toaster({ ...props }: ToasterProps) {
  const { theme = 'system' } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group [&_div[data-content]]:w-full'
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
          '--success-bg': 'var(--primary)',
          '--success-text': 'var(--primary-foreground)',
          '--success-border': 'var(--primary)',
          '--error-bg': 'var(--destructive)',
          '--error-text': 'var(--destructive-foreground)',
          '--error-border': 'var(--destructive)',
          '--warning-bg': 'hsl(38, 92%, 50%)',
          '--warning-text': 'hsl(0, 0%, 100%)',
          '--warning-border': 'hsl(38, 92%, 50%)',
          '--info-bg': 'hsl(221, 83%, 53%)',
          '--info-text': 'hsl(0, 0%, 100%)',
          '--info-border': 'hsl(221, 83%, 53%)',
        } as React.CSSProperties
      }
      {...props}
    />
  )
}
