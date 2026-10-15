import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import {
  AlertCircle,
  CheckCircle2,
  Info,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '../../lib/cn'

const alertVariants = cva(
  'flex items-start rounded-md border font-medium leading-snug',
  {
    variants: {
      tone: {
        info:
          'bg-[var(--color-fips-blue-200)] border-[var(--color-fips-blue-400)] text-[var(--color-fips-blue-950)] dark:border-[var(--color-fips-blue-700)] dark:text-[var(--color-fips-blue-400)]',
        success:
          'bg-[rgba(34,197,94,0.10)] border-[rgba(34,197,94,0.40)] text-[var(--color-success-strong)]',
        warning:
          'bg-[var(--color-badge-warning-bg)] border-[var(--color-accent-strong)] text-[var(--color-accent-strong)]',
        danger:
          'bg-[var(--color-badge-danger-bg)] border-[var(--color-danger)] text-[var(--color-danger)]',
      },
      size: {
        xs: 'gap-1.5 px-2 py-1 text-[10.5px]',
        sm: 'gap-2 px-2.5 py-1.5 text-[11px]',
        md: 'gap-2 px-3 py-2 text-[12px]',
      },
    },
    defaultVariants: {
      tone: 'info',
      size: 'md',
    },
  },
)

const ICON_SIZE: Record<NonNullable<AlertVariantProps['size']>, string> = {
  xs: 'h-3 w-3',
  sm: 'h-3.5 w-3.5',
  md: 'h-3.5 w-3.5',
}

const TONE_ICONS: Record<NonNullable<AlertVariantProps['tone']>, LucideIcon> = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
}

export type AlertVariantProps = VariantProps<typeof alertVariants>

export interface AlertProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'>,
    AlertVariantProps {
  icon?: LucideIcon | false
  title?: React.ReactNode
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, tone, size, icon, title, children, ...props }, ref) => {
    const DefaultIcon = TONE_ICONS[tone ?? 'info']
    const IconComp = icon === false ? null : icon ?? DefaultIcon
    return (
      <div
        ref={ref}
        role="status"
        className={cn(alertVariants({ tone, size }), className)}
        {...props}
      >
        {IconComp ? (
          <IconComp className={cn('mt-[1px] shrink-0', ICON_SIZE[size ?? 'md'])} aria-hidden />
        ) : null}
        <div className="min-w-0 flex-1">
          {title ? (
            <div className="font-heading text-[12px] font-bold leading-tight">
              {title}
            </div>
          ) : null}
          <div className={cn(title ? 'mt-0.5' : '')}>{children}</div>
        </div>
      </div>
    )
  },
)
Alert.displayName = 'Alert'

export { Alert }
