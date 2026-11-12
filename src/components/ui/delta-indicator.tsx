import * as React from 'react'
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface DeltaIndicatorProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** Variação. Positivo sobe, negativo desce, zero fica estável. */
  value: number
  /** Sufixo do número: `%` (padrão), `pp` ou vazio. */
  unit?: string
  /** Casas decimais do número. Padrão 1. */
  decimals?: number
  /** Qual sentido é bom. `down` para indicadores em que cair é melhorar (defeitos, atraso). Padrão `up`. */
  goodWhen?: 'up' | 'down'
  /** Texto para leitor de tela depois do valor, por exemplo "em relação ao mês anterior". */
  description?: string
}

const FORMATO = new Map<string, Intl.NumberFormat>()
function formatar(n: number, decimals: number) {
  let f = FORMATO.get(String(decimals))
  if (!f) {
    f = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    FORMATO.set(String(decimals), f)
  }
  return f.format(n)
}

/**
 * Variação com seta, número e cor. O sentido vai em três canais: ícone, sinal no texto e
 * palavra para leitor de tela; a cor só reforça. Verde quando o sentido é o bom, vermelho
 * quando é o ruim, neutro quando a variação arredondada é zero.
 */
const DeltaIndicator = React.forwardRef<HTMLSpanElement, DeltaIndicatorProps>(
  ({ className, value, unit = '%', decimals = 1, goodWhen = 'up', description, ...props }, ref) => {
    const texto = formatar(Math.abs(value), decimals)
    const zero = !Number.isFinite(value) || Math.abs(value) < 0.5 * 10 ** -decimals
    const sobe = value > 0
    const bom = zero ? null : sobe === (goodWhen === 'up')
    const Icone = zero ? Minus : sobe ? ArrowUp : ArrowDown
    const sinal = zero ? '' : sobe ? '+' : '−'
    const palavra = zero ? 'sem variação' : sobe ? 'aumento de' : 'queda de'

    return (
      <span
        ref={ref}
        data-tendencia={zero ? 'estavel' : sobe ? 'alta' : 'queda'}
        data-resultado={bom === null ? 'neutro' : bom ? 'bom' : 'ruim'}
        className={cn(
          'inline-flex items-center gap-1 text-sm font-semibold tabular-nums',
          bom === null && 'text-[var(--color-fg-muted)]',
          bom === true && 'text-[var(--color-success-text)]',
          bom === false && 'text-[var(--color-danger-text)]',
          className,
        )}
        {...props}
      >
        <Icone className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span aria-hidden="true">{zero ? '0' : sinal}{zero ? '' : texto}{unit}</span>
        <span className="sr-only">
          {palavra}
          {zero ? '' : ` ${texto}${unit}`}
          {description ? ` ${description}` : ''}
        </span>
      </span>
    )
  },
)
DeltaIndicator.displayName = 'DeltaIndicator'

export { DeltaIndicator }
