import type { LucideIcon } from 'lucide-react'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface OpcaoDeVisao<V extends string = string> {
  valor: V
  rotulo: string
  icone: LucideIcon
}

export interface AlternadorDeVisaoProps<V extends string = string> {
  /** Visão ativa. */
  valor: V
  onChange: (valor: V) => void
  /** Opções. Padrão: `tabela` e `cartoes`. */
  opcoes?: OpcaoDeVisao<V>[]
  /** Nome do grupo para leitor de tela. Padrão "Modo de visualização". */
  rotulo?: string
  className?: string
}

const OPCOES_TABELA_CARTOES: OpcaoDeVisao<'tabela' | 'cartoes'>[] = [
  { valor: 'tabela', rotulo: 'Tabela', icone: List },
  { valor: 'cartoes', rotulo: 'Cartões', icone: LayoutGrid },
]

/**
 * Controle segmentado Tabela / Cartões: pílula de fundo neutro; a opção ativa ganha a superfície e uma
 * sombra. Vai no canto de ações do `CartaoListagem`. Abaixo de `md` só o ícone fica à vista e o rótulo segue
 * como nome acessível. Cada botão é `aria-pressed`.
 */
export function AlternadorDeVisao<V extends string = 'tabela' | 'cartoes'>({
  valor,
  onChange,
  opcoes = OPCOES_TABELA_CARTOES as unknown as OpcaoDeVisao<V>[],
  rotulo = 'Modo de visualização',
  className,
}: AlternadorDeVisaoProps<V>) {
  return (
    <div
      role="group"
      aria-label={rotulo}
      className={cn('inline-flex items-center gap-0.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-0.5', className)}
    >
      {opcoes.map((o) => {
        const Icone = o.icone
        const ativo = valor === o.valor
        return (
          <button
            key={o.valor}
            type="button"
            aria-pressed={ativo}
            title={o.rotulo}
            onClick={() => onChange(o.valor)}
            className={cn(
              'inline-flex min-h-[max(1.75rem,var(--alvo-toque,0px))] min-w-[max(1.75rem,var(--alvo-toque,0px))] items-center justify-center gap-1.5 rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors',
              'focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--color-primary-text)]',
              ativo
                ? 'bg-[var(--color-surface)] text-[var(--color-primary-text)] shadow-sm'
                : 'text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]',
            )}
          >
            <Icone className="size-3.5" aria-hidden />
            <span className="max-md:sr-only">{o.rotulo}</span>
          </button>
        )
      })}
    </div>
  )
}
