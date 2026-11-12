import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'
import { cn } from '../../lib/cn'

export interface SliderProps
  extends Omit<
    React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>,
    'value' | 'defaultValue' | 'onValueChange' | 'onValueCommit'
  > {
  /** Valor atual (controlado). Sem ele, o campo guarda o próprio valor a partir de `defaultValue`. */
  value?: number
  defaultValue?: number
  onValueChange?: (valor: number) => void
  /** Chamado ao soltar o polegar ou ao terminar uma tecla (um por gesto, bom para salvar). */
  onValueCommit?: (valor: number) => void
  /** Texto lido por leitor de tela no lugar do número cru (ex.: "30 segundos"). */
  getValueText?: (valor: number) => string
  /** Nome do campo para leitor de tela. Obrigatório quando não há rótulo visível ligado por `aria-labelledby`. */
  'aria-label'?: string
  'aria-labelledby'?: string
}

/**
 * Slider de valor único. Trilho e polegar usam os tokens do Switch (3:1 ou mais sobre o cartão nos dois temas).
 * O polegar tem 24 px. Teclado do Radix: setas (passo), PageUp/PageDown (10 passos), Home/End (mínimo e máximo).
 */
const Slider = React.forwardRef<React.ComponentRef<typeof SliderPrimitive.Root>, SliderProps>(
  (
    {
      className,
      value,
      defaultValue,
      onValueChange,
      onValueCommit,
      getValueText,
      min = 0,
      max = 100,
      step = 1,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...props
    },
    ref,
  ) => {
    const controlado = value !== undefined
    const [interno, setInterno] = React.useState(defaultValue ?? min)
    const atual = controlado ? value : interno
    return (
      <SliderPrimitive.Root
        ref={ref}
        min={min}
        max={max}
        step={step}
        value={[atual]}
        onValueChange={(prox) => {
          const v = prox[0] ?? min
          if (!controlado) setInterno(v)
          onValueChange?.(v)
        }}
        onValueCommit={(prox) => onValueCommit?.(prox[0] ?? min)}
        className={cn(
          'relative flex h-6 w-full touch-none select-none items-center data-[disabled]:opacity-50',
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-[var(--color-switch-off)]">
          <SliderPrimitive.Range className="absolute h-full bg-[var(--color-switch-on)]" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledBy}
          aria-valuetext={getValueText ? getValueText(atual) : undefined}
          className={cn(
            'block h-6 w-6 rounded-full border-2 border-[var(--color-switch-on)] bg-white shadow-sm transition-colors',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]',
            'data-[disabled]:cursor-not-allowed',
          )}
        />
      </SliderPrimitive.Root>
    )
  },
)
Slider.displayName = 'Slider'

export { Slider }
