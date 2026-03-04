import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Inbox,
  Search,
  Package,
  ShoppingCart,
  Users,
  FileX,
  AlertCircle,
  ClipboardList,
  type LucideIcon
} from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    icon?: LucideIcon
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
  size = 'md',
}: EmptyStateProps) {
  const sizeClasses = {
    sm: {
      container: 'py-8',
      iconWrapper: 'w-12 h-12',
      icon: 'w-6 h-6',
      title: 'text-sm',
      description: 'text-xs',
    },
    md: {
      container: 'py-12',
      iconWrapper: 'w-16 h-16',
      icon: 'w-8 h-8',
      title: 'text-base',
      description: 'text-sm',
    },
    lg: {
      container: 'py-16',
      iconWrapper: 'w-20 h-20',
      icon: 'w-10 h-10',
      title: 'text-lg',
      description: 'text-base',
    },
  }

  const classes = sizeClasses[size]

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        classes.container,
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-muted mb-4',
            classes.iconWrapper
          )}
        >
          <Icon className={cn('text-muted-foreground', classes.icon)} />
        </div>
      )}
      <h3
        className={cn(
          'font-semibold text-foreground mb-2',
          classes.title
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            'text-muted-foreground max-w-sm mb-6',
            classes.description
          )}
        >
          {description}
        </p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button onClick={action.onClick} size={size === 'sm' ? 'sm' : 'default'}>
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button
              variant="outline"
              onClick={secondaryAction.onClick}
              size={size === 'sm' ? 'sm' : 'default'}
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

// Predefined empty states for common scenarios
export function EmptySearchResults({
  searchTerm,
  onClear,
  className
}: {
  searchTerm: string
  onClear: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={Search}
      title="Sonuç bulunamadı"
      description={`"${searchTerm}" için herhangi bir sonuç bulunamadı. Farklı anahtar kelimeler deneyin veya filtreleri temizleyin.`}
      action={{
        label: 'Filtreleri Temizle',
        onClick: onClear,
      }}
      className={className}
    />
  )
}

export function EmptyCart({
  onAddItem,
  className
}: {
  onAddItem: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={ShoppingCart}
      title="Sepetiniz boş"
      description="Sepetinizde henüz ürün bulunmuyor. Alışverişe başlamak için ürünleri keşfedin."
      action={{
        label: 'Ürün Ekle',
        onClick: onAddItem,
      }}
      className={className}
    />
  )
}

export function EmptyProducts({
  onAddProduct,
  className
}: {
  onAddProduct: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={Package}
      title="Ürün bulunamadı"
      description="Henüz hiç ürün eklenmemiş. İlk ürünü ekleyerek kataloğunuzu oluşturun."
      action={{
        label: 'Ürün Ekle',
        onClick: onAddProduct,
      }}
      className={className}
    />
  )
}

export function EmptyUsers({
  onInvite,
  className
}: {
  onInvite: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={Users}
      title="Kullanıcı bulunamadı"
      description="Sistemde henüz kayıtlı kullanıcı yok. Yeni kullanıcılar ekleyin."
      action={{
        label: 'Kullanıcı Davet Et',
        onClick: onInvite,
      }}
      className={className}
    />
  )
}

export function EmptyTasks({
  onCreate,
  className
}: {
  onCreate: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={ClipboardList}
      title="Görev bulunamadı"
      description="Henüz hiç görev oluşturulmamış. Yeni görev ekleyerek işlerinizi takip edin."
      action={{
        label: 'Görev Oluştur',
        onClick: onCreate,
      }}
      className={className}
    />
  )
}

export function EmptyInbox({
  className
}: {
  className?: string
}) {
  return (
    <EmptyState
      icon={Inbox}
      title="Gelen kutusu boş"
      description="Tüm mesajlarınızı okudunuz. Yeni bir mesaj geldiğinde burada görünecek."
      className={className}
    />
  )
}

export function ErrorState({
  title = 'Bir hata oluştu',
  description = 'Veriler yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.',
  onRetry,
  className
}: {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}) {
  return (
    <EmptyState
      icon={AlertCircle}
      title={title}
      description={description}
      action={onRetry ? {
        label: 'Tekrar Dene',
        onClick: onRetry,
      } : undefined}
      className={className}
    />
  )
}

export function NoPermissions({
  className
}: {
  className?: string
}) {
  return (
    <EmptyState
      icon={FileX}
      title="Erişim reddedildi"
      description="Bu içeriği görüntüleme yetkiniz bulunmuyor."
      className={className}
    />
  )
}
