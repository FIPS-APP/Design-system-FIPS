import * as React from 'react'
import { Input, type InputProps } from './input'
import { formatCurrency, parseCurrency, sanitizeCurrencyDraft } from './currency'

export interface CurrencyInputProps
  extends Omit<InputProps, 'type' | 'value' | 'defaultValue' | 'onChange' | 'inputMode' | 'leftIcon'> {
  /** Decimal em texto, sem float: "1234.56". Vazio = "". */
  value: string
  /** Chamado a cada tecla e na colagem com o decimal normalizado ("1234.56") ou "". */
  onValueChange: (value: string) => void
  /** Aceita sinal de menos no início. Padrão: só valor positivo. */
  allowNegative?: boolean
  /** Mostra "R$" à esquerda. Padrão: sim. */
  showSymbol?: boolean
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onValueChange, allowNegative = false, showSymbol = true, onFocus, onBlur, ...props }, ref) => {
    const [rascunho, setRascunho] = React.useState<string | null>(null)
    const exibido = rascunho ?? formatCurrency(value)

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode={allowNegative ? 'text' : 'decimal'}
        autoComplete="off"
        leftIcon={showSymbol ? <span aria-hidden="true" className="text-sm font-medium">R$</span> : undefined}
        value={exibido}
        onFocus={(e) => {
          setRascunho(formatCurrency(value))
          onFocus?.(e)
        }}
        onChange={(e) => {
          const texto = sanitizeCurrencyDraft(e.target.value, allowNegative)
          setRascunho(texto)
          onValueChange(parseCurrency(texto, allowNegative))
        }}
        onBlur={(e) => {
          setRascunho(null)
          onBlur?.(e)
        }}
      />
    )
  },
)
CurrencyInput.displayName = 'CurrencyInput'

export { CurrencyInput }
