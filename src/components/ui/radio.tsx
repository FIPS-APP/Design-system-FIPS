import * as React from 'react'
import { cn } from '../../lib/cn'
import { Field, FieldHint, FieldMessage } from './field'
import { CHOICE_TEXT_OFFSET_CLASS, choiceBoxClass } from './choice-styles'

export type RadioGroupVariant = 'default' | 'pill'
export type RadioGroupOrientation = 'vertical' | 'horizontal'

type RadioGroupContextValue = {
  name: string
  value: string | undefined
  setValue: (value: string) => void
  disabled: boolean
  invalid: boolean
  variant: RadioGroupVariant
  describedBy: string | undefined
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

export interface RadioGroupProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Nome do grupo no formulário (padrão: gerado). */
  name?: string
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Rótulo visível do grupo (a pergunta). Sem ele, passe `aria-label`. */
  label?: React.ReactNode
  description?: React.ReactNode
  /** Mensagem de erro. Liga `aria-invalid` no grupo e `aria-describedby` nas opções. */
  error?: React.ReactNode
  required?: boolean
  disabled?: boolean
  /** `pill` mostra cada opção como pílula; o teclado e a semântica são os mesmos. */
  variant?: RadioGroupVariant
  /** Padrão: vertical na lista, horizontal (com quebra) na pílula. */
  orientation?: RadioGroupOrientation
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      className,
      name,
      value,
      defaultValue,
      onValueChange,
      label,
      description,
      error,
      required = false,
      disabled = false,
      variant = 'default',
      orientation,
      children,
      'aria-describedby': describedByProp,
      ...props
    },
    ref,
  ) => {
    const autoId = React.useId()
    const labelId = label ? `${autoId}-label` : undefined
    const descId = description ? `${autoId}-desc` : undefined
    const errId = error ? `${autoId}-err` : undefined
    const [interno, setInterno] = React.useState(defaultValue)
    const controlado = value !== undefined
    const atual = controlado ? value : interno
    const describedBy = [describedByProp, descId, errId].filter(Boolean).join(' ') || undefined
    const layout = orientation ?? (variant === 'pill' ? 'horizontal' : 'vertical')

    const ctx = React.useMemo<RadioGroupContextValue>(
      () => ({
        name: name ?? autoId,
        value: atual,
        setValue: (v) => {
          if (!controlado) setInterno(v)
          onValueChange?.(v)
        },
        disabled,
        invalid: Boolean(error),
        variant,
        describedBy,
      }),
      [name, autoId, atual, controlado, onValueChange, disabled, error, variant, describedBy],
    )

    return (
      <Field inset="none" className={className}>
        {label ? (
          <span id={labelId} className="text-sm font-semibold leading-5 text-[var(--color-fg)]">
            {label}
            {required ? (
              <>
                <span aria-hidden className="ml-1 text-[var(--color-danger)]">*</span>
                <span className="sr-only">obrigatório</span>
              </>
            ) : null}
          </span>
        ) : null}
        {description ? <FieldHint id={descId}>{description}</FieldHint> : null}
        <RadioGroupContext.Provider value={ctx}>
          <div
            ref={ref}
            role="radiogroup"
            aria-labelledby={labelId}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            aria-required={required || undefined}
            aria-disabled={disabled || undefined}
            data-orientation={layout}
            className={cn(
              'flex',
              layout === 'horizontal' ? 'flex-row flex-wrap gap-2' : 'flex-col gap-1',
            )}
            {...props}
          >
            {children}
          </div>
        </RadioGroupContext.Provider>
        {error ? <FieldMessage id={errId}>{error}</FieldMessage> : null}
      </Field>
    )
  },
)
RadioGroup.displayName = 'RadioGroup'

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value' | 'name' | 'checked' | 'defaultChecked' | 'onChange'> {
  /** Valor desta opção dentro do grupo. */
  value: string
  label: React.ReactNode
  description?: React.ReactNode
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, value, label, description, id, disabled, ...props }, ref) => {
    const ctx = React.useContext(RadioGroupContext)
    if (!ctx) throw new Error('Radio precisa estar dentro de um RadioGroup')
    const autoId = React.useId()
    const inputId = id ?? autoId
    const descId = description ? `${inputId}-desc` : undefined
    const off = disabled || ctx.disabled
    const checked = ctx.value === value
    const describedBy = [ctx.describedBy, descId].filter(Boolean).join(' ') || undefined

    const input = (
      <input
        ref={ref}
        id={inputId}
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={off}
        aria-describedby={describedBy}
        onChange={() => ctx.setValue(value)}
        data-invalid={ctx.invalid ? 'true' : undefined}
        {...props}
      />
    )

    if (ctx.variant === 'pill') {
      return (
        <label
          htmlFor={inputId}
          className={cn(
            'relative inline-flex min-h-9 cursor-pointer select-none items-center justify-center rounded-full border-2 border-[var(--color-border-control)] bg-[var(--color-surface)] px-4 py-1 text-sm font-semibold leading-5 text-[var(--color-fg)] transition-colors',
            'hover:border-[var(--color-fg-muted)]',
            'has-[:checked]:border-[var(--color-switch-on)] has-[:checked]:bg-[var(--color-primary)] has-[:checked]:text-white',
            'has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--color-ring)] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--color-surface)]',
            'has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50',
            ctx.invalid && 'has-[:not(:checked)]:border-[var(--color-danger)]',
            className,
          )}
        >
          {React.cloneElement(input, { className: 'peer sr-only' })}
          {label}
          {description ? <span id={descId} className="sr-only">{description}</span> : null}
        </label>
      )
    }

    return (
      <div className={cn('flex flex-col', className)}>
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-start gap-2 py-1 text-sm leading-5 text-[var(--color-fg)]',
            off ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
          )}
        >
          <span className="relative mt-px inline-flex h-5 w-5 shrink-0">
            {React.cloneElement(input, {
              className: cn(
                choiceBoxClass,
                'rounded-full',
                'data-[invalid=true]:border-[var(--color-danger)] data-[invalid=true]:checked:border-[var(--color-danger)] data-[invalid=true]:checked:bg-[var(--color-danger)]',
              ),
            })}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white peer-checked:block"
            />
          </span>
          <span className="min-w-0 font-medium">{label}</span>
        </label>
        {description ? (
          <FieldHint id={descId} className={CHOICE_TEXT_OFFSET_CLASS}>
            {description}
          </FieldHint>
        ) : null}
      </div>
    )
  },
)
Radio.displayName = 'Radio'

export { Radio, RadioGroup }
