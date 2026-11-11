import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { AppHeader, type AppHeaderProps } from './AppHeader'
import { AppSidebar, type AppSidebarProps } from './AppSidebar'
import {
  carregarPreferencias,
  guardarPreferencias,
  prepararImpressaoClara,
  type PreferenciasDoMenu,
} from './app-shell-logica'
import type { RenderizarLinkDaCasca } from './app-shell-tipos'

/** Quem trocou o menu: o botão do cabeçalho (escolha do usuário), o recolher sozinho ou o ponteiro entrando. */
export type OrigemDoRecolhido = 'botao' | 'auto' | 'ponteiro'

export interface AppShellProps {
  /**
   * Chave do `localStorage` onde ficam as preferências do menu ("Modo do menu"). Uma por app, por
   * exemplo `sst:sidebar-prefs:v1`: sem chave própria dois apps na mesma origem pisam um no outro.
   */
  chavePreferencias: string
  /** Padrão de quem nunca mexeu: recolher sozinho, em 3 s. */
  preferenciasPadrao?: PreferenciasDoMenu
  /** Menu lateral. O shell controla `recolhido`, `gavetaAberta`, `modoDoMenu` e os eventos do ponteiro. */
  menu: Omit<
    AppSidebarProps,
    'recolhido' | 'gavetaAberta' | 'modoDoMenu' | 'aoEntrarPonteiro' | 'aoSairPonteiro' | 'aoNavegar'
  >
  /** Cabeçalho. O shell controla `menuRecolhido`, `gavetaAberta`, `aoAlternarMenu` e `aoAlternarGaveta`. */
  cabecalho: Omit<AppHeaderProps, 'menuRecolhido' | 'gavetaAberta' | 'aoAlternarMenu' | 'aoAlternarGaveta'>
  /** Um só `renderLink` para menu e cabeçalho (cada um pode sobrescrever o seu). */
  renderLink?: RenderizarLinkDaCasca
  /** Menu já nasce recolhido (e, com "Automático", abre quando o ponteiro entra). Padrão: aberto. */
  recolhidoInicial?: boolean
  /**
   * Chamada a cada troca do menu entre aberto e recolhido, com o novo valor e a origem: `'botao'` (clique no
   * cabeçalho), `'auto'` (recolher sozinho) ou `'ponteiro'` (ponteiro entrando no menu). Não é chamada na
   * montagem. Para lembrar a escolha do usuário, o app grava só quando a origem é `'botao'` e passa o valor
   * lido em `recolhidoInicial`; `'auto'` e `'ponteiro'` seguem o mouse e o tempo, não uma escolha. Opcional:
   * quem não passa não muda.
   */
  aoMudarRecolhido?: (recolhido: boolean, origem: OrigemDoRecolhido) => void
  /** Conteúdo da tela. */
  children: ReactNode
  className?: string
  /** Classe do contêiner do conteúdo (`@container`, `flex-1`). */
  classeDoConteudo?: string
}

/**
 * Casca padrão dos apps FIPS: menu lateral + cabeçalho + conteúdo. O conteúdo fica num contêiner
 * `@container`, então a quebra do layout segue a área útil, com o menu aberto ou recolhido. O
 * contêiner envolve só o conteúdo (não o cabeçalho): `container-type` prende ao contêiner qualquer
 * elemento `fixed` dentro dele.
 *
 * Comportamento: recolhe sozinho após N segundos sem o ponteiro no menu (preferência do usuário,
 * guardada em `chavePreferencias`); abre ao passar o ponteiro; gaveta abaixo de 1024px, que fecha no
 * Esc, no fundo e ao navegar, e trava a rolagem da página enquanto aberta. Na gaveta o foco entra no primeiro
 * item do menu, o resto da página fica `inert` (Tab não sai do menu) e, ao fechar, o foco volta ao botão
 * "Abrir menu".
 *
 * O app dono do roteador passa `renderLink`, o item ativo (`ativo` nos itens) e a aba ativa.
 */
export function AppShell({
  chavePreferencias,
  preferenciasPadrao: padrao,
  menu,
  cabecalho,
  renderLink,
  recolhidoInicial = false,
  aoMudarRecolhido,
  children,
  className,
  classeDoConteudo,
}: AppShellProps) {
  const [prefs, setPrefs] = useState<PreferenciasDoMenu>(() => carregarPreferencias(chavePreferencias, padrao))
  const [recolhido, setRecolhido] = useState(recolhidoInicial)
  const origemRef = useRef<OrigemDoRecolhido>('botao')
  const [gavetaAberta, setGavetaAberta] = useState(false)
  const timerRef = useRef<number | null>(null)
  const ponteiroNoMenuRef = useRef(false)
  const raizRef = useRef<HTMLDivElement | null>(null)

  // Avisa o app a cada troca do recolhido (não na montagem: o valor inicial veio dele).
  const recolhidoAnteriorRef = useRef(recolhido)
  const aoMudarRecolhidoRef = useRef(aoMudarRecolhido)
  aoMudarRecolhidoRef.current = aoMudarRecolhido
  useEffect(() => {
    if (recolhidoAnteriorRef.current === recolhido) return
    recolhidoAnteriorRef.current = recolhido
    aoMudarRecolhidoRef.current?.(recolhido, origemRef.current)
  }, [recolhido])

  useEffect(() => {
    guardarPreferencias(chavePreferencias, prefs)
  }, [chavePreferencias, prefs])

  const limparTimer = useCallback(() => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const agendarRecolher = useCallback(() => {
    limparTimer()
    if (!prefs.recolherAuto) return
    timerRef.current = window.setTimeout(() => {
      origemRef.current = 'auto'
      setRecolhido(true)
    }, prefs.segundos * 1000)
  }, [limparTimer, prefs.recolherAuto, prefs.segundos])

  const aoEntrarPonteiro = useCallback(() => {
    ponteiroNoMenuRef.current = true
    limparTimer()
    if (prefs.recolherAuto) {
      origemRef.current = 'ponteiro'
      setRecolhido(false)
    }
  }, [limparTimer, prefs.recolherAuto])

  const aoSairPonteiro = useCallback(() => {
    ponteiroNoMenuRef.current = false
    agendarRecolher()
  }, [agendarRecolher])

  useEffect(() => {
    if (!prefs.recolherAuto) {
      limparTimer()
      return
    }
    if (!ponteiroNoMenuRef.current) agendarRecolher()
  }, [prefs.recolherAuto, prefs.segundos, limparTimer, agendarRecolher])

  useEffect(() => limparTimer, [limparTimer])

  const alternarMenu = useCallback(() => {
    limparTimer()
    origemRef.current = 'botao'
    setRecolhido((v) => !v)
  }, [limparTimer])
  const alternarGaveta = useCallback(() => setGavetaAberta((v) => !v), [])
  const fecharGaveta = useCallback(() => setGavetaAberta(false), [])

  // Ctrl+P: o papel é claro e sem a casca. O CSS esconde menu e cabeçalho (`data-casca`); aqui o tema escuro
  // sai do <html> durante a impressão e volta depois.
  useEffect(() => {
    let restaurar: (() => void) | null = null
    const antes = () => {
      restaurar ??= prepararImpressaoClara(document.documentElement)
    }
    const depois = () => {
      restaurar?.()
      restaurar = null
    }
    window.addEventListener('beforeprint', antes)
    window.addEventListener('afterprint', depois)
    return () => {
      window.removeEventListener('beforeprint', antes)
      window.removeEventListener('afterprint', depois)
      depois()
    }
  }, [])

  // Gaveta aberta: trava a rolagem da página e fecha no Esc.
  useEffect(() => {
    if (!gavetaAberta) return
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setGavetaAberta(false)
    }
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.body.style.overflow = original
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [gavetaAberta])

  // Foco da gaveta: ao abrir vai para o primeiro item do menu e o corpo da página fica `inert` (nem Tab nem
  // leitor de tela chegam nele); ao fechar o foco volta ao botão "Abrir menu". Passou de 1024px com a gaveta
  // aberta: o menu vira fixo, então a gaveta fecha.
  useEffect(() => {
    if (!gavetaAberta) return
    const raiz = raizRef.current
    const corpo = raiz?.querySelector<HTMLElement>('[data-casca="corpo"]')
    if (!raiz || !corpo) return
    corpo.setAttribute('inert', '')
    raiz.querySelector<HTMLElement>('[data-casca="menu"] nav a[href], [data-casca="menu"] nav button')?.focus({ preventScroll: true })
    const mq = window.matchMedia('(min-width: 1024px)')
    const aoMudar = () => {
      if (mq.matches) setGavetaAberta(false)
    }
    aoMudar()
    mq.addEventListener('change', aoMudar)
    return () => {
      mq.removeEventListener('change', aoMudar)
      corpo.removeAttribute('inert')
      raiz.querySelector<HTMLElement>('[data-casca="corpo"] button[aria-label="Abrir menu"]')?.focus({ preventScroll: true })
    }
  }, [gavetaAberta])

  return (
    <div ref={raizRef} className={cn('min-h-svh', className)}>
      <AppSidebar
        {...menu}
        renderLink={menu.renderLink ?? renderLink}
        recolhido={recolhido}
        gavetaAberta={gavetaAberta}
        modoDoMenu={{
          recolherAuto: prefs.recolherAuto,
          segundos: prefs.segundos,
          aoMudarRecolherAuto: (valor) => setPrefs((p) => ({ ...p, recolherAuto: valor })),
          aoMudarSegundos: (segundos) => setPrefs((p) => ({ ...p, segundos })),
        }}
        aoEntrarPonteiro={aoEntrarPonteiro}
        aoSairPonteiro={aoSairPonteiro}
        aoNavegar={fecharGaveta}
      />
      {gavetaAberta ? (
        <button
          type="button"
          onClick={fecharGaveta}
          aria-label="Fechar menu"
          tabIndex={-1}
          data-casca="fundo-da-gaveta"
          className="fixed inset-0 z-20 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      ) : null}
      <div
        data-casca="corpo"
        className={cn(
          'flex min-h-svh flex-col transition-[padding] duration-200',
          // Acompanha a largura do menu, senão sobra ou falta faixa.
          recolhido ? 'lg:pl-[68px]' : 'lg:pl-[230px]',
        )}
      >
        <AppHeader
          {...cabecalho}
          renderLink={cabecalho.renderLink ?? renderLink}
          menuRecolhido={recolhido}
          gavetaAberta={gavetaAberta}
          aoAlternarMenu={alternarMenu}
          aoAlternarGaveta={alternarGaveta}
        />
        <div className={cn('@container flex min-w-0 flex-1 flex-col', classeDoConteudo)}>{children}</div>
      </div>
    </div>
  )
}
