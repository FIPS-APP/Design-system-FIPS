import * as React from 'react'
import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import type { FieldDensity } from './field'

export type SelectOption = {
  value: string
  label: string
}

export interface SelectProps {
  options?: SelectOption[]
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  placeholder?: string
  leftIcon?: React.ReactNode
  density?: FieldDensity
  disabled?: boolean
  className?: string
  'aria-label'?: string
  'aria-invalid'?: boolean | 'true' | 'false'
  children?: React.ReactNode
}

/**
 * Select com dropdown customizado — padrão DS-FIPS.
 * Aceita `options` prop OU `<option>` children para retrocompatibilidade.
 */
const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options: optionsProp,
      value: controlledValue,
      defaultValue,
      onChange,
      placeholder = 'Selecione',
      leftIcon,
      density = 'default',
      disabled,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    // Parse options from children (<option>) if not provided via prop
    const options = React.useMemo<SelectOption[]>(() => {
      if (optionsProp) return optionsProp
      const parsed: SelectOption[] = []
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child) && child.type === 'option') {
          const p = child.props as { value?: string; children?: React.ReactNode }
          parsed.push({
            value: String(p.value ?? ''),
            label: String(p.children ?? p.value ?? ''),
          })
        }
      })
      return parsed
    }, [optionsProp, children])

    const [open, setOpen] = useState(false)
    const [internal, setInternal] = useState(defaultValue ?? '')
    const val = controlledValue !== undefined ? controlledValue : internal
    const wrapRef = useRef<HTMLDivElement>(null)
    const [hi, setHi] = useState(-1)

    const isCompact = density === 'compact'
    const isInvalid = props['aria-invalid'] === true || props['aria-invalid'] === 'true'

    // Close on outside click
    useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

    const selectedLabel = options.find((o) => o.value === val)?.label

    const select = (v: string) => {
      setInternal(v)
      onChange?.(v)
      setOpen(false)
    }

    return (
      <div
        ref={(node) => {
          ;(wrapRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={cn('relative w-full', open && 'z-30', className)}
      >
        {/* Trigger */}
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-label={props['aria-label']}
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
          className={cn(
            'flex w-full items-center gap-2 rounded-xl border border-[var(--color-border)]/60 bg-[var(--color-surface)] text-left text-[var(--color-fg)] transition-all duration-200 hover:border-[var(--color-border)]/80 focus-visible:border-[var(--color-primary)] focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-[var(--color-surface-muted)] disabled:text-[var(--color-fg-muted)] disabled:opacity-70 dark:border-[#3a3a3a] dark:bg-[#252525] dark:hover:border-[#4a4a4a] dark:focus-visible:border-[#93BDE4] dark:focus-visible:ring-[#93BDE4]/20',
            isCompact ? 'h-9 px-3 text-sm shadow-sm' : 'h-12 px-4 text-[1.08rem] shadow-sm',
            leftIcon && (isCompact ? 'pl-9' : 'pl-11'),
            open && cn('border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20 rounded-b-none', 'dark:border-[#93BDE4] dark:ring-[#93BDE4]/20'),
            isInvalid && 'border-[var(--color-danger)]/70 focus-visible:border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]/20',
          )}
        >
          {leftIcon ? (
            <span
              className={cn(
                'pointer-events-none absolute top-1/2 -translate-y-1/2 text-[var(--color-fg-muted)]',
                isCompact ? 'left-3 [&_svg]:h-3.5 [&_svg]:w-3.5' : 'left-4 [&_svg]:h-4 [&_svg]:w-4',
              )}
            >
              {leftIcon}
            </span>
          ) : null}
          <span className={cn('flex-1 truncate', !selectedLabel && 'text-[var(--color-fg-muted)]')}>
            {selectedLabel || placeholder}
          </span>
          <ChevronDown
            className={cn(
              'shrink-0 text-[var(--color-fg-muted)] transition-transform duration-200',
              isCompact ? 'h-3.5 w-3.5' : 'h-4 w-4',
              open && 'rotate-180',
            )}
            aria-hidden
          />
        </button>

        {/* Dropdown */}
        {open && !disabled ? (
          <div
            role="listbox"
            className={cn(
              'absolute left-0 right-0 top-full z-20 max-h-[200px] overflow-y-auto rounded-b-xl border border-t-0 border-[var(--color-primary)] bg-[var(--color-surface)] shadow-[0_6px_20px_rgba(0,75,155,0.12)] dark:border-[#93BDE4] dark:bg-[#252525] dark:shadow-[0_6px_20px_rgba(0,0,0,0.3)]',
            )}
          >
            {options.map((o, i) => {
              const sel = o.value === val
              return (
                <div
                  key={o.value}
                  role="option"
                  aria-selected={sel}
                  onClick={() => select(o.value)}
                  onMouseEnter={() => setHi(i)}
                  onMouseLeave={() => setHi(-1)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 transition-colors duration-100',
                    isCompact ? 'px-3 py-1.5 text-sm' : 'px-4 py-2.5 text-[0.95rem]',
                    sel
                      ? 'bg-[var(--color-primary)]/8 font-semibold text-[var(--color-primary)] dark:bg-[rgba(147,189,228,0.14)] dark:text-[#93BDE4]'
                      : i === hi
                        ? 'bg-[var(--color-surface-muted)] text-[var(--color-fg)] dark:bg-[#2a2a2a]'
                        : 'text-[var(--color-fg)]',
                  )}
                >
                  {sel ? (
                    <Check className={cn('shrink-0 text-[var(--color-primary)] dark:text-[#93BDE4]', isCompact ? 'h-3 w-3' : 'h-3.5 w-3.5')} aria-hidden />
                  ) : (
                    <span className={isCompact ? 'w-3' : 'w-3.5'} />
                  )}
                  {o.label}
                </div>
              )
            })}
          </div>
        ) : null}
      </div>
    )
  },
)
Select.displayName = 'Select'

export { Select }
