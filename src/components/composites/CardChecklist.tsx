import { useId, type ReactNode } from 'react'
import { Play, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'

export interface CardChecklistDado {
  /** Legenda ("Última inspeção"). */
  rotulo: string
  /** Valor: texto ou um elemento (um selo de nota, por exemplo). */
  valor: ReactNode
}

export interface CardChecklistAcao {
  /** Texto do botão ("Iniciar inspeção"). */
  rotulo: string
  icone?: LucideIcon
  /** Com `href` o botão vira `<a>` (recarrega a página). Em app com router use `acaoPersonalizada`. */
  href?: string
  onClick?: () => void
  /** Desliga o botão. Mostre o motivo em `motivoDesabilitada`. */
  desabilitada?: boolean
  /** Frase sob o botão desligado ("Seu perfil não inicia inspeções."). Vira `aria-describedby`. */
  motivoDesabilitada?: string
  /** Nome acessível, quando o rótulo sozinho é ambíguo numa lista ("Iniciar inspeção: Vistoria de AMV"). */
  nomeAcessivel?: string
}

export interface CardChecklistProps {
  titulo: string
  /** Código impresso do documento, em fonte mono. */
  codigo?: string
  /** Revisão do documento ("03"). Aparece como "revisão 03". */
  revisao?: string
  /** Selo ao lado do título (o tipo do checklist). Normalmente um `Badge`. */
  selo?: ReactNode
  /** Quantos itens o checklist tem ("12 itens"). */
  totalItens?: number
  /** Pares legenda/valor em duas colunas: última vez, média, responsável… */
  dados?: CardChecklistDado[]
  /** Ação principal do cartão. */
  acao?: CardChecklistAcao
  /** Substitui o botão de `acao` (um `Button asChild` com o `Link` do router, por exemplo). */
  acaoPersonalizada?: ReactNode
  /** Elemento raiz. `li` quando os cartões estão numa `ul`. Padrão `div`. */
  como?: 'div' | 'li' | 'article'
  /** Nível do título: 2, 3 ou 4. Padrão 3. */
  nivelTitulo?: 2 | 3 | 4
  className?: string
}

/**
 * Cartão de um checklist/formulário-modelo para iniciar uma execução: título, código, revisão,
 * selo do tipo, número de itens, dois dados do histórico (última vez, média) e a ação
 * principal presa ao pé do cartão (cartões de alturas diferentes numa grade alinham os botões).
 *
 * Monta sobre `Card` + `CardContent` (raio 16, padding 24/20 do conteúdo, como o cartão da Manutenção).
 * Não conhece inspeção: o que cada dado significa e para onde a ação leva é de quem usa.
 */
export function CardChecklist({
  titulo,
  codigo,
  revisao,
  selo,
  totalItens,
  dados,
  acao,
  acaoPersonalizada,
  como: Raiz = 'div',
  nivelTitulo = 3,
  className,
}: CardChecklistProps) {
  const idMotivo = useId()
  const Titulo = `h${nivelTitulo}` as 'h2' | 'h3' | 'h4'
  const meta = [
    codigo ? (
      <span key="c" className="font-mono">
        {codigo}
      </span>
    ) : null,
    revisao ? <span key="r">revisão {revisao}</span> : null,
    totalItens !== undefined ? (
      <span key="i">
        {totalItens} {totalItens === 1 ? 'item' : 'itens'}
      </span>
    ) : null,
  ].filter(Boolean)
  const Icone = acao?.icone ?? Play
  const botao = acao ? (
    acao.href && !acao.desabilitada ? (
      <Button variant="primary" size="md" asChild>
        <a href={acao.href} aria-label={acao.nomeAcessivel}>
          <Icone aria-hidden />
          {acao.rotulo}
        </a>
      </Button>
    ) : (
      <Button
        type="button"
        variant="primary"
        size="md"
        onClick={acao.onClick}
        disabled={acao.desabilitada}
        aria-label={acao.nomeAcessivel}
        aria-describedby={acao.desabilitada && acao.motivoDesabilitada ? idMotivo : undefined}
      >
        <Icone aria-hidden />
        {acao.rotulo}
      </Button>
    )
  ) : null

  return (
    <Card como={Raiz} className={cn('flex flex-col', className)}>
      <CardContent className="flex flex-1 flex-col gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Titulo className="font-heading min-w-0 text-sm leading-snug font-bold text-[var(--color-fg)]">{titulo}</Titulo>
            {selo}
          </div>
          {meta.length ? (
            <p className="mt-0.5 flex flex-wrap gap-x-1.5 text-xs text-[var(--color-fg-muted)]">
              {meta.map((m, i) => (
                <span key={i} className="inline-flex gap-1.5">
                  {i > 0 ? <span aria-hidden>·</span> : null}
                  {m}
                </span>
              ))}
            </p>
          ) : null}
        </div>

        {dados?.length ? (
          <dl className="grid grid-cols-2 gap-3 text-xs">
            {dados.map((d) => (
              <div key={d.rotulo}>
                <dt className="text-[var(--color-fg-muted)]">{d.rotulo}</dt>
                <dd className="mt-0.5 font-semibold text-[var(--color-fg)]">{d.valor}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {acaoPersonalizada || botao ? (
          <div className="mt-auto">
            {acaoPersonalizada ?? botao}
            {!acaoPersonalizada && acao?.desabilitada && acao.motivoDesabilitada ? (
              <p id={idMotivo} className="mt-1.5 text-xs text-[var(--color-fg-muted)]">
                {acao.motivoDesabilitada}
              </p>
            ) : null}
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
