import type { ReactNode } from 'react'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Card, CardContent } from '../ui/card'
import { tomBordaEsquerda, tomIcone, type TomHome } from './home-padrao-variants'

export interface PassoChamada {
  id: string
  icone: LucideIcon
  rotulo: string
  /** Linha pequena sob o rótulo. */
  dica?: string
  tom?: TomHome
}

export interface ChamadaFinalProps {
  /** Linha em caixa alta acima do título, com um filete (ex.: "Próximo passo"). */
  sobretitulo?: string
  /** Início do título, na cor do texto. */
  titulo: string
  /** Fim do título, em azul (ex.: o nome da tela de destino). */
  destaque?: string
  texto?: ReactNode
  /** Mini ciclo de passos sob o texto. */
  passos?: PassoChamada[]
  /** Botões à direita (no estreito, embaixo). Use `Button` do DS. */
  acoes?: ReactNode
  className?: string
}

/**
 * Chamada de fecho da Home: cartão com degradê azul suave, sobretítulo, título com palavra de destaque,
 * texto, mini ciclo de passos e os botões de ação à direita. Os botões são do app (rota e permissão).
 */
export function ChamadaFinal({ sobretitulo, titulo, destaque, texto, passos, acoes, className }: ChamadaFinalProps) {
  return (
    <section>
      <Card
        className={cn(
          'relative overflow-hidden border-[var(--color-primary)]/20 bg-[linear-gradient(135deg,var(--color-semantic-info-bg)_0%,var(--color-surface)_55%,var(--color-surface)_100%)]',
          className,
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--color-primary)]/10 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-[var(--color-accent-strong)]/10 blur-3xl"
        />
        <CardContent>
          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div className="flex flex-col gap-4">
              {sobretitulo ? (
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                    {sobretitulo}
                  </span>
                  <span aria-hidden className="h-px max-w-[80px] flex-1 bg-[var(--color-accent-strong)]/40" />
                </div>
              ) : null}
              <h2 className="font-heading text-2xl font-semibold tracking-tight text-[var(--color-fg)] sm:text-[28px]">
                {titulo}
                {destaque ? (
                  <>
                    {' '}
                    <span className="text-[var(--color-primary-text)]">{destaque}</span>
                  </>
                ) : null}
              </h2>
              {texto ? (
                <p className="max-w-2xl text-sm leading-relaxed text-[var(--color-fg-muted-strong)]">{texto}</p>
              ) : null}
              {passos && passos.length > 0 ? (
                <ol className="flex flex-col gap-2 pt-1 sm:flex-row sm:gap-3 lg:max-w-2xl">
                  {passos.map((p, i) => {
                    const Icone = p.icone
                    return (
                      <li
                        key={p.id}
                        className={cn(
                          'relative flex flex-1 items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-3 shadow-[var(--shadow-card)] backdrop-blur-sm',
                          tomBordaEsquerda({ tom: p.tom }),
                        )}
                      >
                        <span aria-hidden className={tomIcone({ tom: p.tom, tamanho: 'sm' })}>
                          <Icone className="h-4 w-4" strokeWidth={1.9} />
                        </span>
                        <div className="flex min-w-0 flex-col">
                          <span className="font-mono text-[10px] font-bold tracking-[0.14em] text-[var(--color-fg-muted-strong)]">
                            Passo {String(i + 1).padStart(2, '0')}
                          </span>
                          <span className="font-heading text-sm font-bold tracking-tight text-[var(--color-fg)]">
                            {p.rotulo}
                          </span>
                          {p.dica ? <span className="text-[11px] text-[var(--color-fg-muted-strong)]">{p.dica}</span> : null}
                        </div>
                        {i < passos.length - 1 ? (
                          <ArrowRight
                            aria-hidden
                            className="absolute -right-2.5 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-[var(--color-border-strong)] sm:block"
                            strokeWidth={2}
                          />
                        ) : null}
                      </li>
                    )
                  })}
                </ol>
              ) : null}
            </div>
            {acoes ? <div className="flex flex-col gap-2 lg:items-end">{acoes}</div> : null}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
