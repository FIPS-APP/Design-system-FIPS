import { forwardRef, type ElementType, type HTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { BannerIconBox, BannerJunctionLines, FIPS_BANNER_CONTENT_CLASS } from './banner-shared'

export type PageHeaderStat = {
  label: string
  value: string | number
  dotColor?: string
}

/** Só data-*: o slot de ações serve de âncora de tutorial, não de lugar para estilo. */
export type PageHeaderActionsProps = { [K in `data-${string}`]?: string | number | boolean | undefined }

export type PageHeaderProps = Omit<HTMLAttributes<HTMLDivElement>, 'title' | 'children'> & {
  /** Título da página. Vira o h1 (ver `headingLevel`). Aceita JSX, por exemplo uma palavra em `--color-accent`. */
  title: ReactNode
  /** Resumo de uma ou duas frases abaixo do título. */
  description?: ReactNode
  /** Ícone do tile (lucide). Sem ele o título começa na borda do banner. */
  icon?: ReactNode
  /** Rótulo de seção em texto, acima do título. Sem pílula. */
  eyebrow?: ReactNode
  /** Elemento ao lado do título, por exemplo o ícone de ajuda "como funciona". */
  info?: ReactNode
  /**
   * Botões da página, como filhos diretos (um fragmento, sem div em volta). Ficam à direita e, abaixo
   * de 560px de cartão, na última linha em largura total, lado a lado e com a mesma largura. Com mais
   * de dois botões a linha quebra. Um div em volta ocupa a linha e os botões ficam do tamanho do texto.
   */
  actions?: ReactNode
  /** Atributos data-* do slot de ações (âncora do tutorial guiado). */
  actionsProps?: PageHeaderActionsProps
  /** Chips de contagem abaixo do resumo. */
  stats?: PageHeaderStat[]
  /** Nível do título. A página deve ter um h1 só: nas demais, use 2. */
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
  /**
   * `card` (padrão) é o cartão com raio. `bleed` tira o raio quando o cartão tem menos de 560px,
   * para o banner encostar nas bordas da tela. A margem lateral é do pai: não ponha recuo em volta.
   */
  edge?: 'card' | 'bleed'
  /**
   * Força a medida estreita em qualquer largura. Existe para o apelido PatternPanelHero.
   * Fora dele, deixe a largura do cartão decidir.
   */
  compact?: boolean
}

/**
 * Banner de página do DS-FIPS (Banner de Conteúdo). Um só desenho para todos os apps.
 *
 * A medida segue a largura do próprio cartão (container query de 560px), não a da janela, e não
 * usa JavaScript. Por isso o componente ocupa a largura do pai (`width: 100%`): não o ponha dentro
 * de um flex em linha nem de um bloco que encolhe ao conteúdo.
 *
 * A raiz é o contêiner da medida. O banner em si é o primeiro filho e leva a classe
 * `.fips-banner-shell--content`, com os trilhos como svg filho direto (a impressão dos apps
 * depende dessa forma). `data-*`, `aria-*`, `className`, `style`, `id` e `ref` vão para a raiz.
 *
 * Os estilos estão em `src/styles/globals.css` (`.fips-page-header`). Quem copia o arquivo para
 * um app precisa copiar essas regras junto (ver `exports/pattern-panel-hero`).
 */
export const PageHeader = forwardRef<HTMLDivElement, PageHeaderProps>(function PageHeader(
  {
    title,
    description,
    icon,
    eyebrow,
    info,
    actions,
    actionsProps,
    stats,
    headingLevel = 1,
    edge = 'card',
    compact = false,
    className,
    ...rest
  },
  ref,
) {
  const Heading = `h${headingLevel}` as ElementType
  const Description = typeof description === 'string' ? 'p' : 'div'
  const hasStats = Boolean(stats?.length)

  return (
    <div
      ref={ref}
      {...rest}
      className={cn(
        'fips-page-header',
        edge === 'bleed' && 'fips-page-header--bleed',
        compact && 'fips-page-header--compact',
        hasStats && 'fips-page-header--stats',
        !icon && 'fips-page-header--sem-icone',
        className,
      )}
    >
      <div className={cn(FIPS_BANNER_CONTENT_CLASS, 'fips-page-header__banner')}>
        <BannerJunctionLines className="fips-page-header__trilhos" />
        <div className="fips-page-header__corpo">
          {icon ? <BannerIconBox>{icon}</BannerIconBox> : null}
          <div className="fips-page-header__texto">
            <div className="fips-page-header__cabeca">
              {eyebrow ? <div className="fips-page-header__eyebrow">{eyebrow}</div> : null}
              <div className="fips-page-header__linha-titulo">
                <Heading className="fips-page-header__titulo">{title}</Heading>
                {info}
              </div>
            </div>
            {description ? <Description className="fips-page-header__descricao">{description}</Description> : null}
            {hasStats ? (
              <div className="fips-page-header__stats">
                {stats!.map((s) => (
                  <span
                    key={s.label}
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.06] px-2.5 py-1 font-sans text-[11px] font-semibold text-white/75"
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ background: s.dotColor ?? 'var(--color-accent-strong)' }}
                      aria-hidden
                    />
                    {s.label} <strong className="font-bold text-white">{s.value}</strong>
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {actions ? (
            <div {...actionsProps} className="fips-page-header__acoes">
              {actions}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
})
