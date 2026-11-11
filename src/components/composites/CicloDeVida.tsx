import type { ReactNode } from 'react'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { SecaoHome } from './SecaoHome'
import { tagTitulo, tomIcone, tomSelo, type TomHome } from './home-padrao-variants'

export interface EtapaCiclo {
  /** Único no ciclo. */
  id: string
  icone: LucideIcon
  /** Número da etapa ("01"). Sem ele, a etapa mostra a posição com dois dígitos. */
  numero?: string
  titulo: string
  texto: ReactNode
  /** Cor do quadradinho do ícone. Padrão: `primary`. */
  tom?: TomHome
  /** Selo de quem cuida da etapa (ex.: "Colaborador", "Gestor"), no pé do cartão. */
  papel?: { rotulo: string; tom?: TomHome }
}

export interface CicloDeVidaProps {
  etapas: EtapaCiclo[]
  /** Cabeçalho (usa `SecaoHome`). Sem `titulo`, só a grade de etapas. */
  titulo?: string
  sobretitulo?: string
  subtitulo?: ReactNode
  /** Pílula à direita do cabeçalho (ex.: `<Badge variant="info">6 etapas</Badge>`). */
  acao?: ReactNode
  /** Seta entre as etapas na tela larga (a partir de 1280px, só com 6 etapas ou menos). Padrão: sim. */
  conectores?: boolean
  /** Nome da lista para leitor de tela quando não há `titulo`. */
  label?: string
  className?: string
}

const COLUNAS_XL: Record<number, string> = {
  1: 'xl:grid-cols-1',
  2: 'xl:grid-cols-2',
  3: 'xl:grid-cols-3',
  4: 'xl:grid-cols-4',
  5: 'xl:grid-cols-5',
  6: 'xl:grid-cols-6',
}

/**
 * Ciclo de vida em cartões de etapa: ícone, número, título, texto e, no pé, o selo do papel
 * (quem cuida da etapa). Seis etapas cabem numa linha a partir de 1280px, com seta entre elas.
 */
export function CicloDeVida({
  etapas,
  titulo,
  sobretitulo,
  subtitulo,
  acao,
  conectores = true,
  label,
  className,
}: CicloDeVidaProps) {
  if (etapas.length === 0) return null
  const n = etapas.length
  const comSeta = conectores && n <= 6
  const Titulo = tagTitulo(3)
  const lista = (
    <ol
      aria-label={titulo ? undefined : label}
      className={cn(
        'grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3',
        titulo && 'pb-6 pt-1',
        n <= 6 ? COLUNAS_XL[n] : 'xl:grid-cols-4',
        !titulo && className,
      )}
    >
      {etapas.map((e, i) => {
        const Icone = e.icone
        return (
          <li
            key={e.id}
            className="relative flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          >
            <div className="flex items-start gap-3">
              <span aria-hidden className={tomIcone({ tom: e.tom, tamanho: 'sm' })}>
                <Icone className="h-[18px] w-[18px]" />
              </span>
              <div className="flex min-w-0 flex-col leading-tight">
                <span
                  aria-hidden
                  className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-fg-muted)]"
                >
                  {e.numero ?? String(i + 1).padStart(2, '0')}
                </span>
                <Titulo className="font-heading text-sm font-semibold tracking-tight text-[var(--color-fg)]">
                  {e.titulo}
                </Titulo>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-[var(--color-fg-muted)]">{e.texto}</p>
            {e.papel ? <span className={cn(tomSelo({ tom: e.papel.tom }), 'mt-auto')}>{e.papel.rotulo}</span> : null}
            {comSeta && i < n - 1 ? (
              <ArrowRight
                aria-hidden
                className="absolute -right-3 top-1/2 hidden h-4 w-4 -translate-y-1/2 text-[var(--color-border-strong)] xl:block"
              />
            ) : null}
          </li>
        )
      })}
    </ol>
  )
  if (!titulo) return lista
  return (
    <SecaoHome
      tamanho="md"
      sobretitulo={sobretitulo}
      titulo={titulo}
      subtitulo={subtitulo}
      acao={acao}
      className={className}
    >
      {lista}
    </SecaoHome>
  )
}
