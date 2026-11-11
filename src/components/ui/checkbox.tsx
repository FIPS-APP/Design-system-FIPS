import * as React from 'react'
import { cn } from '../../lib/cn'
import { Field, FieldHint, FieldMessage } from './field'
import { CHOICE_TEXT_OFFSET_CLASS, choiceBoxClass } from './choice-styles'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  /** Texto do rótulo; clicar nele marca a caixa. */
  label: React.ReactNode
  /** Texto de apoio abaixo do rótulo, ligado por `aria-describedby`. */
  description?: React.ReactNode
  /** Mensagem de erro. Liga `aria-invalid` e `aria-describedby` e pinta a caixa de vermelho. */
  error?: React.ReactNode
  /** Mostra o asterisco e marca o campo como obrigatório. */
  required?: boolean
  /** Estado misto (marcação parcial de um grupo). Só visual: o valor continua sendo `checked`. */
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, description, error, required = false, indeterminate = false, id, disabled, 'aria-describedby': describedBy, ...props },
    ref,
  ) => {
    const autoId = React.useId()
    const inputId = id ?? autoId
    const descId = description ? `${inputId}-desc` : undefined
    const errId = error ? `${inputId}-err` : undefined
    const innerRef = React.useRef<HTMLInputElement | null>(null)

    React.useEffect(() => {
      if (innerRef.current) innerRef.current.indeterminate = indeterminate
    }, [indeterminate])

    const setRefs = (node: HTMLInputElement | null) => {
      innerRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    return (
      <Field inset="none" className={className}>
        <label
          htmlFor={inputId}
          className={cn(
            'flex items-start gap-2 py-1 text-sm leading-5 text-[var(--color-fg)]',
            disabled ? 'cursor-not-allowed opacity-70' : 'cursor-pointer',
          )}
        >
          <span className="relative mt-px inline-flex h-5 w-5 shrink-0">
            <input
              ref={setRefs}
              id={inputId}
              type="checkbox"
              disabled={disabled}
              required={required}
              aria-invalid={error ? true : undefined}
              aria-describedby={[describedBy, descId, errId].filter(Boolean).join(' ') || undefined}
              data-indeterminate={indeterminate ? 'true' : undefined}
              className={cn(choiceBoxClass, 'rounded-[5px] data-[indeterminate=true]:border-[var(--color-switch-on)] data-[indeterminate=true]:bg-[var(--color-switch-on)]')}
              {...props}
            />
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute inset-0 hidden h-5 w-5 text-white peer-checked:block peer-data-[indeterminate=true]:hidden"
            >
              <path d="M5.5 10.5l3 3 6-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 20 20"
              fill="none"
              className="pointer-events-none absolute inset-0 hidden h-5 w-5 text-white peer-data-[indeterminate=true]:block"
            >
              <path d="M5.5 10h9" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </span>
          <span className="min-w-0 font-medium">
            {label}
            {required ? (
              <>
                <span aria-hidden className="ml-1 text-[var(--color-danger)]">*</span>
                <span className="sr-only">obrigatório</span>
              </>
            ) : null}
          </span>
        </label>
        {description ? (
          <FieldHint id={descId} className={CHOICE_TEXT_OFFSET_CLASS}>
            {description}
          </FieldHint>
        ) : null}
        {error ? (
          <FieldMessage id={errId} className={CHOICE_TEXT_OFFSET_CLASS}>
            {error}
          </FieldMessage>
        ) : null}
      </Field>
    )
  },
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
