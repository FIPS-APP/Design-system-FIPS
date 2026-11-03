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
 * Esc, no fundo e ao navegar, e trava a rolagem da página enquanto aberta.
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
  children,
  className,
  classeDoConteudo,
}: AppShellProps) {
  const [prefs, setPrefs] = useState<PreferenciasDoMenu>(() => carregarPreferencias(chavePreferencias, padrao))
  const [recolhido, setRecolhido] = useState(recolhidoInicial)
  const [gavetaAberta, setGavetaAberta] = useState(false)
  const timerRef = useRef<number | null>(null)
  const ponteiroNoMenuRef = useRef(false)

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
    timerRef.current = window.setTimeout(() => setRecolhido(true), prefs.segundos * 1000)
  }, [limparTimer, prefs.recolherAuto, prefs.segundos])

  const aoEntrarPonteiro = useCallback(() => {
    ponteiroNoMenuRef.current = true
    limparTimer()
    if (prefs.recolherAuto) setRecolhido(false)
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

  return (
    <div className={cn('min-h-svh', className)}>
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
