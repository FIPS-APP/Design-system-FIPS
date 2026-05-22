import * as React from 'react'
import { cn } from '../../lib/cn'

export type FieldDensity = 'default' | 'compact'
export type FieldInset = 'none' | 'control' | 'icon'

type FieldContextValue = {
  density: FieldDensity
  inset: FieldInset
}

const FieldContext = React.createContext<FieldContextValue>({
  density: 'default',
  inset: 'control',
})

const fieldGapClasses: Record<FieldDensity, string> = {
  default: 'gap-1.5',
  compact: 'gap-1',
}

const fieldTextOffsetClasses: Record<FieldDensity, Record<FieldInset, string>> = {
  default: {
    none: '',
    control: 'ml-4',
    icon: 'ml-11',
  },
  compact: {
    none: '',
    control: 'ml-3',
    icon: 'ml-9',
  },
}

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: FieldDensity
  inset?: FieldInset
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, density = 'default', inset = 'control', ...props }, ref) => (
    <FieldContext.Provider value={{ density, inset }}>
      <div ref={ref} className={cn('flex min-w-0 flex-col', fieldGapClasses[density], className)} {...props} />
    </FieldContext.Provider>
  ),
)
Field.displayName = 'Field'

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(({ className, children, required = false, ...props }, ref) => {
  const { density, inset } = React.useContext(FieldContext)

  return (
    <label
      ref={ref}
      className={cn(
        'block font-semibold',
        density === 'compact'
          ? 'text-xs leading-4 text-[var(--color-fg)]'
          : 'text-[0.95rem] leading-5 uppercase tracking-[0.02em] text-[var(--color-fg-muted)]',
        fieldTextOffsetClasses[density][inset],
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <>
          <span aria-hidden className="ml-1 text-[var(--color-danger)]">*</span>
          <span className="sr-only">obrigatório</span>
        </>
      ) : null}
    </label>
  )
})
FieldLabel.displayName = 'FieldLabel'

export type FieldHintProps = React.HTMLAttributes<HTMLParagraphElement>

const FieldHint = React.forwardRef<HTMLParagraphElement, FieldHintProps>(({ className, ...props }, ref) => {
  const { density, inset } = React.useContext(FieldContext)

  return (
    <p
      ref={ref}
      className={cn(
        'text-xs leading-4.5 text-[var(--color-fg-muted)]',
        fieldTextOffsetClasses[density][inset],
        className,
      )}
      {...props}
    />
  )
})
FieldHint.displayName = 'FieldHint'

export interface FieldMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: 'default' | 'danger' | 'success'
}

const fieldMessageToneClasses: Record<NonNullable<FieldMessageProps['tone']>, string> = {
  default: 'text-[var(--color-fg-muted)]',
  danger: 'text-[var(--color-danger)]',
  success: 'text-[var(--color-success-strong)]',
}

const FieldMessage = React.forwardRef<HTMLParagraphElement, FieldMessageProps>(
  ({ className, tone = 'danger', ...props }, ref) => {
    const { density, inset } = React.useContext(FieldContext)

    return (
      <p
        ref={ref}
        className={cn(
          'text-xs font-medium leading-4.5',
          fieldTextOffsetClasses[density][inset],
          fieldMessageToneClasses[tone],
          className,
        )}
        {...props}
      />
    )
  },
)
FieldMessage.displayName = 'FieldMessage'

export { Field, FieldHint, FieldLabel, FieldMessage }
