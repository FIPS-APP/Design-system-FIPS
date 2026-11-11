import { useCallback, useEffect, useLayoutEffect, useRef, type ReactNode } from 'react'
import { BookOpen, GraduationCap, Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun, X, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { docHeaderTabsUnderlineMd } from '../../lib/docHeaderChrome'
import type { AbaDeSecao } from './AbasDeSecao'
import { HeaderTile } from './HeaderTile'
import { HeaderTrilha } from './HeaderTrilha'
import { MARCA_PADRAO, type MarcaDoApp, type PassoDaTrilha, type RenderizarLinkDaCasca } from './app-shell-tipos'

/**
 * Medidas da faixa de abas do cabeçalho. Diverge do `docHeaderTabsUnderlineMd` só no respiro lateral
 * (14, não 24), como o Gestão OPA: a faixa só aparece a partir de 1024px, com o menu aberto sobra pouco
 * espaço, e com muitas abas ela rola (sem barra) até a aba acesa.
 */
const ABAS = { ...docHeaderTabsUnderlineMd, paddingXPx: 14 }

function useSublinhadoDaAba(indiceAtivo: number, chaveDeMedicao?: unknown) {
  const navRef = useRef<HTMLElement>(null)
  const abasRef = useRef<(HTMLDivElement | null)[]>([])
  const tracoRef = useRef<HTMLSpanElement>(null)

  // O traço é posicionado direto no DOM (sem estado): remedir não refaz a render da faixa.
  const medir = useCallback(() => {
    const nav = navRef.current
    const traco = tracoRef.current
    if (!traco) return
    const aba = abasRef.current[indiceAtivo]
    if (indiceAtivo < 0 || !nav || !aba) {
      traco.style.left = '0px'
      traco.style.width = '0px'
      return
    }
    const n = nav.getBoundingClientRect()
    const a = aba.getBoundingClientRect()
    traco.style.left = `${a.left - n.left + nav.scrollLeft}px`
    traco.style.width = `${a.width}px`
  }, [indiceAtivo])

  useLayoutEffect(() => {
    medir()
  }, [medir, chaveDeMedicao])

  useEffect(() => {
    window.addEventListener('resize', medir)
    return () => window.removeEventListener('resize', medir)
  }, [medir])

  // A faixa pode não caber: leva a aba acesa para dentro da vista (rola só a faixa, nunca a página).
  useEffect(() => {
    const nav = navRef.current
    const aba = abasRef.current[indiceAtivo]
    if (!nav || !aba) return
    const inicio = aba.offsetLeft
    const fim = inicio + aba.offsetWidth
    if (inicio < nav.scrollLeft) nav.scrollLeft = inicio
    else if (fim > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = fim - nav.clientWidth
  }, [indiceAtivo, chaveDeMedicao])

  return { navRef, abasRef, tracoRef }
}

export interface AcaoDoCabecalho {
  /** Vira o `aria-label` e o `title` do azulejo. */
  rotulo: string
  aoClicar: () => void
  /** Padrão: livro no procedimento, capelo no tutorial. */
  icone?: LucideIcon
  ativo?: boolean
}

export interface AppHeaderProps {
  /** Trilha de localização ("Home › Inspeção"). O último passo é a tela atual. */
  trilha?: PassoDaTrilha[]
  /** Menu lateral recolhido: o botão do desktop troca o ícone. */
  menuRecolhido?: boolean
  /** Gaveta do menu aberta no celular: o botão troca o ícone. */
  gavetaAberta?: boolean
  /** Botão de recolher/expandir o menu (a partir de 1024px). */
  aoAlternarMenu?: () => void
  /** Botão da gaveta (abaixo de 1024px). */
  aoAlternarGaveta?: () => void
  /** Imagens da marca. Abaixo de 1024px o lockup aparece no cabeçalho (azul no claro, branco no escuro). */
  marca?: MarcaDoApp
  /** Destino do lockup do cabeçalho. Padrão `/`. */
  hrefDaMarca?: string
  /** Abas de seção (as mesmas telas do menu). Aparecem a partir de 1024px, com sublinhado que desliza. */
  abas?: AbaDeSecao[]
  /** `id` da aba da tela atual. */
  abaAtiva?: string
  /** Aba sem `href` vira botão e chama isto. */
  aoSelecionarAba?: (id: string) => void
  /** Desenha links (aba, marca, trilha). Sem ele, `<a href>`. */
  renderLink?: RenderizarLinkDaCasca
  /** Muda quando a faixa de abas precisa remedir o sublinhado fora da troca de aba (ex.: a rota). */
  chaveDeMedicao?: unknown
  /** Sino de avisos, normalmente o `NotificacoesMenu`. */
  sino?: ReactNode
  /** Azulejo do procedimento (livro). Omitido, o azulejo não aparece. */
  procedimento?: AcaoDoCabecalho
  /** Azulejo do tutorial (capelo). Omitido, o azulejo não aparece. */
  tutorial?: AcaoDoCabecalho
  /** Troca de tema: o ícone mostra o tema para onde vai (sol no escuro, lua no claro). */
  tema?: { atual: 'claro' | 'escuro'; aoAlternar: () => void }
  /** Mais azulejos, antes do sino. */
  acoesExtras?: ReactNode
  /** Chip da conta, normalmente `UserAccountMenu` com `UserChip`. */
  usuario?: ReactNode
  className?: string
}

/**
 * Cabeçalho padrão dos apps FIPS (réplica do Gestão OPA): barra de 56px em cinza com botão de
 * recolher o menu, trilha e azulejos de ação à direita; abaixo, a faixa de abas de seção com
 * sublinhado âmbar que desliza (só a partir de 1024px). Abaixo de 1024px o botão vira a gaveta e entra
 * o lockup da marca. Genérico: trilha, abas e ações vêm por props. Gruda no topo (`sticky`, z-20).
 *
 * Ganchos para o tutorial (`data-tutorial`): `recolher-menu`, `abas`, `sino`, `tema`, `conta`.
 */
export function AppHeader({
  trilha = [],
  menuRecolhido = false,
  gavetaAberta = false,
  aoAlternarMenu,
  aoAlternarGaveta,
  marca,
  hrefDaMarca = '/',
  abas = [],
  abaAtiva,
  aoSelecionarAba,
  renderLink,
  chaveDeMedicao,
  sino,
  procedimento,
  tutorial,
  tema,
  acoesExtras,
  usuario,
  className,
}: AppHeaderProps) {
  const imagens = { ...MARCA_PADRAO, ...marca }
  const indiceAtivo = abaAtiva ? abas.findIndex((a) => a.id === abaAtiva) : -1
  const { navRef, abasRef, tracoRef } = useSublinhadoDaAba(indiceAtivo, chaveDeMedicao)
  const IconeMenu = menuRecolhido ? PanelLeftOpen : PanelLeftClose
  const IconeGaveta = gavetaAberta ? X : Menu
  const IconeTema = tema?.atual === 'escuro' ? Sun : Moon
  const rotuloTema = tema?.atual === 'escuro' ? 'Mudar para tema claro' : 'Mudar para tema escuro'

  const marcaLink = renderLink ? (
    renderLink({
      href: hrefDaMarca,
      className: 'shrink-0 lg:hidden max-[339px]:hidden',
      children: <MarcaDoCabecalho imagens={imagens} />,
      'aria-label': `${imagens.alt}, ir para o início`,
    })
  ) : (
    <a href={hrefDaMarca} aria-label={`${imagens.alt}, ir para o início`} className="shrink-0 lg:hidden max-[339px]:hidden">
      <MarcaDoCabecalho imagens={imagens} />
    </a>
  )

  return (
    <header data-casca="cabecalho" className={cn('sticky top-0 z-20', className)}>
      <div className="flex h-14 items-center gap-3 border-b border-[var(--color-border)] bg-[var(--color-surface-muted)] px-4 sm:gap-3 sm:px-6">
        {aoAlternarGaveta ? (
          <HeaderTile
            exibicao="celular"
            icone={IconeGaveta}
            onClick={aoAlternarGaveta}
            title={gavetaAberta ? 'Fechar menu' : 'Abrir menu'}
            aria-label={gavetaAberta ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={gavetaAberta}
          />
        ) : null}

        {marcaLink}

        {aoAlternarMenu ? (
          <HeaderTile
            exibicao="desktop"
            icone={IconeMenu}
            onClick={aoAlternarMenu}
            title={menuRecolhido ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            aria-label={menuRecolhido ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            aria-expanded={!menuRecolhido}
            data-tutorial="recolher-menu"
          />
        ) : null}

        {trilha.length > 0 ? <HeaderTrilha passos={trilha} renderLink={renderLink} /> : null}

        <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {acoesExtras}
          {sino}
          {procedimento ? (
            <HeaderTile
              icone={procedimento.icone ?? BookOpen}
              ativo={procedimento.ativo}
              aria-label={procedimento.rotulo}
              title={procedimento.rotulo}
              data-tutorial="procedimento"
              onClick={procedimento.aoClicar}
            />
          ) : null}
          {tutorial ? (
            <HeaderTile
              icone={tutorial.icone ?? GraduationCap}
              ativo={tutorial.ativo}
              aria-label={tutorial.rotulo}
              title={tutorial.rotulo}
              data-tutorial="tutorial"
              onClick={tutorial.aoClicar}
            />
          ) : null}
          {tema ? (
            <HeaderTile
              icone={IconeTema}
              aria-label={rotuloTema}
              title={rotuloTema}
              data-tutorial="tema"
              onClick={tema.aoAlternar}
            />
          ) : null}

          {usuario ? (
            <>
              <div className="mx-1 hidden h-6 w-px shrink-0 bg-[var(--color-border)] sm:block" aria-hidden />
              {usuario}
            </>
          ) : null}
        </div>
      </div>

      {abas.length > 0 ? (
        <nav
          ref={navRef}
          aria-label="Seções principais"
          data-tutorial="abas"
          className="fips-faixa-de-abas no-scrollbar relative w-full min-w-0 items-center gap-0 overflow-x-auto border-b-2 border-[var(--color-border)] bg-[var(--color-surface)]"
          style={{ height: ABAS.navHeightPx }}
        >
          {abas.map((aba, i) => {
            const ativa = aba.id === abaAtiva
            const Icone = aba.icon
            const conteudo = (
              <>
                {Icone ? (
                  <Icone
                    className={cn(
                      'shrink-0 transition-colors duration-200',
                      ativa ? 'text-[var(--color-accent-strong)]' : 'text-[var(--color-fg-muted)]',
                    )}
                    style={{ width: ABAS.iconSizePx, height: ABAS.iconSizePx }}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ) : null}
                {aba.label}
              </>
            )
            const classe = cn(
              'inline-flex shrink-0 cursor-pointer items-center whitespace-nowrap font-sans transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--color-accent-strong)_45%,transparent)] focus-visible:outline-none focus-visible:ring-inset',
              ativa
                ? 'font-semibold text-[var(--color-fg)]'
                : 'font-normal text-[var(--color-fg-muted)] hover:bg-[var(--color-primary)]/[0.04] hover:text-[var(--color-fg)]',
            )
            const estilo = {
              fontSize: ABAS.fontSizePx,
              padding: `${ABAS.paddingYPx}px ${ABAS.paddingXPx}px`,
              gap: ABAS.iconGapPx,
              height: '100%',
            } as const
            return (
              <div
                key={aba.id}
                ref={(el) => {
                  abasRef.current[i] = el
                }}
                className="inline-flex shrink-0"
              >
                {aba.href ? (
                  renderLink ? (
                    renderLink({
                      href: aba.href,
                      className: classe,
                      style: estilo,
                      'aria-current': ativa ? 'page' : undefined,
                      children: conteudo,
                    })
                  ) : (
                    <a href={aba.href} aria-current={ativa ? 'page' : undefined} className={classe} style={estilo}>
                      {conteudo}
                    </a>
                  )
                ) : (
                  <button
                    type="button"
                    aria-current={ativa ? 'true' : undefined}
                    onClick={() => aoSelecionarAba?.(aba.id)}
                    className={classe}
                    style={estilo}
                  >
                    {conteudo}
                  </button>
                )}
              </div>
            )
          })}
          <span
            ref={tracoRef}
            aria-hidden
            className={cn(
              'pointer-events-none absolute -bottom-0.5 h-[3px] rounded-t-[3px] bg-[var(--color-accent-strong)]',
              indiceAtivo < 0 && 'opacity-0',
            )}
            style={{ left: 0, width: 0, transition: ABAS.indicatorTransition }}
          />
        </nav>
      ) : null}
    </header>
  )
}

function MarcaDoCabecalho({ imagens }: { imagens: Required<MarcaDoApp> }) {
  return (
    <>
      {/* Dois arquivos, e não um com filtro: o azul vale sobre o cabeçalho claro, o branco sobre o escuro. */}
      <img src={imagens.logoNoClaro} alt="" aria-hidden className="block h-7 w-auto object-contain dark:hidden" />
      <img src={imagens.logo} alt="" aria-hidden className="hidden h-7 w-auto object-contain dark:block" />
    </>
  )
}
