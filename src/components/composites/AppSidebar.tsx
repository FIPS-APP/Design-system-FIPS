import { useEffect, useRef, useState, type PointerEventHandler } from 'react'
import { MousePointer2, Sparkles, Timer, Zap } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  ATALHOS_DE_SEGUNDOS,
  SEGUNDOS_MAX,
  SEGUNDOS_MIN,
  numeroDaVersao,
  seloVisivel,
  textoDoContador,
} from './app-shell-logica'
import { MARCA_PADRAO, type GrupoDoMenu, type MarcaDoApp, type RenderizarLinkDaCasca } from './app-shell-tipos'

export interface AppSidebarProps {
  /** Nome do app, ao lado da marca (menu aberto). */
  nome: string
  /** Linha pequena sob o nome ("Segurança · Meio Ambiente"). */
  subtitulo?: string
  /** Imagens da marca App FIPS. */
  marca?: MarcaDoApp
  grupos: GrupoDoMenu[]
  /** Menu recolhido (68px): só os azulejos. Na gaveta do celular vale sempre aberto. */
  recolhido?: boolean
  /** Gaveta aberta no celular. */
  gavetaAberta?: boolean
  /**
   * "Modo do menu" (rodapé, obrigatório): Manual ou Automático, e o tempo para recolher. Quem guarda
   * a preferência é o app (o `AppShell` guarda em `localStorage`).
   */
  modoDoMenu: {
    recolherAuto: boolean
    segundos: number
    aoMudarRecolherAuto: (valor: boolean) => void
    aoMudarSegundos: (segundos: number) => void
  }
  /** "Versão" (rodapé, obrigatório): número e o que fazer ao clicar (abrir as novidades). */
  versao: {
    /** Número da versão, com ou sem o "v" ("0.2" ou "v0.2"): a tela mostra um "v" só. */
    numero: string
    aoAbrir: () => void
    /** Rótulo do botão. Padrão "Versão". */
    rotulo?: string
    /** Dica do botão. Padrão "Ver novidades". */
    dica?: string
  }
  /** Desenha os links dos itens. Sem ele, `<a href>`. */
  renderLink?: RenderizarLinkDaCasca
  /** Chamado ao clicar num item (a gaveta do celular fecha por aqui). */
  aoNavegar?: () => void
  aoEntrarPonteiro?: PointerEventHandler<HTMLElement>
  aoSairPonteiro?: PointerEventHandler<HTMLElement>
  className?: string
}

/**
 * Menu lateral padrão dos apps FIPS (réplica do Gestão OPA). Fixo à esquerda: 230px aberto, 68px
 * recolhido, gaveta de 256px abaixo de 1024px. Marca App FIPS com nome e subtítulo do app, grupos com
 * título, azulejos azuis com ícone claro, item ativo âmbar, selo/contador, e o rodapé obrigatório
 * "Modo do menu" e "Versão". O menu não rola com até ~10 itens em 625px de janela; abaixo disso rola.
 *
 * Gancho para o tutorial: `data-tutorial="menu"`. O `AppShell` junta tudo; use este direto só em casca
 * própria.
 */
export function AppSidebar({
  nome,
  subtitulo,
  marca,
  grupos,
  recolhido = false,
  gavetaAberta = false,
  modoDoMenu,
  versao,
  renderLink,
  aoNavegar,
  aoEntrarPonteiro,
  aoSairPonteiro,
  className,
}: AppSidebarProps) {
  const imagens = { ...MARCA_PADRAO, ...marca }
  // Na gaveta do celular o menu é sempre expandido (ignora o recolhido do desktop).
  const compacto = gavetaAberta ? false : recolhido
  const [modoAberto, setModoAberto] = useState(false)
  const popoverRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!modoAberto) return
    const aoClicar = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setModoAberto(false)
    }
    const aoTeclar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModoAberto(false)
    }
    document.addEventListener('mousedown', aoClicar)
    document.addEventListener('keydown', aoTeclar)
    return () => {
      document.removeEventListener('mousedown', aoClicar)
      document.removeEventListener('keydown', aoTeclar)
    }
  }, [modoAberto])

  // Recolhido não tem lugar para o popover: fecha ao recolher.
  const [compactoAntes, setCompactoAntes] = useState(compacto)
  if (compactoAntes !== compacto) {
    setCompactoAntes(compacto)
    if (compacto) setModoAberto(false)
  }

  const { recolherAuto, segundos, aoMudarRecolherAuto, aoMudarSegundos } = modoDoMenu
  const pct = ((segundos - SEGUNDOS_MIN) / (SEGUNDOS_MAX - SEGUNDOS_MIN)) * 100
  const rotuloVersao = versao.rotulo ?? 'Versão'

  return (
    <aside
      data-tutorial="menu"
      data-casca="menu"
      data-collapsed={recolhido ? 'true' : undefined}
      onPointerEnter={aoEntrarPonteiro}
      onPointerLeave={aoSairPonteiro}
      className={cn(
        'fips-sidebar fixed inset-y-0 left-0 z-30 flex flex-col border-r border-white/[0.06] text-white transition-[width,transform] duration-200',
        // Celular: gaveta que desliza. Desktop: sempre visível, largura responsiva.
        gavetaAberta ? 'w-[256px] translate-x-0' : 'w-[256px] -translate-x-full',
        'lg:translate-x-0',
        // 68px recolhido é a medida do Governança BI e do QLP.
        recolhido ? 'lg:w-[68px]' : 'lg:w-[230px]',
        className,
      )}
    >
      {/* Marca */}
      <div
        className={cn(
          'flex items-center overflow-hidden border-b border-white/[0.06]',
          compacto ? 'h-[56px] justify-center px-3' : 'h-[59px] px-4',
        )}
      >
        <div className={cn('flex min-w-0 items-center', compacto ? 'justify-center gap-0' : 'w-full justify-start gap-2')}>
          <img
            src={compacto ? imagens.simbolo : imagens.logo}
            alt={imagens.alt}
            className={cn('block shrink-0 object-contain', compacto ? 'h-9 w-9' : 'h-[44px] w-auto max-w-[64px] object-left')}
          />
          {compacto ? null : (
            <div className="flex min-w-0 flex-col leading-[1.2]">
              <span className="truncate font-heading text-[13px] font-bold tracking-[0.03em] text-[var(--color-fips-prata-25)]">
                {nome}
              </span>
              {subtitulo ? (
                <span className="truncate text-[9px] font-semibold tracking-[0.02em] text-white/55 uppercase">{subtitulo}</span>
              ) : null}
            </div>
          )}
        </div>
      </div>

      {/* Grupos */}
      <nav aria-label="Menu principal" className="sidebar-scroll flex-1 overflow-y-auto px-2 py-2">
        {grupos
          .filter((g) => g.itens.length > 0)
          .map((grupo, gi) => (
            <div key={grupo.id} className={gi === 0 ? undefined : 'mt-2'}>
              {grupo.titulo ? (
                compacto ? (
                  <div className="mx-3 mb-2 border-t border-white/[0.06]" aria-hidden />
                ) : (
                  <p className="px-3 pt-2 pb-1 text-[10px] font-bold tracking-[0.14em] text-white/55 uppercase">{grupo.titulo}</p>
                )
              ) : gi > 0 && compacto ? (
                <div className="mx-3 mb-2 border-t border-white/[0.06]" aria-hidden />
              ) : null}
              <ul className="space-y-1">
                {grupo.itens.map((item) => {
                  const Icone = item.icone
                  const classe = cn(
                    'fips-sb-row relative flex w-full items-center rounded-lg py-1 transition-all duration-200',
                    compacto ? 'justify-center' : 'px-3',
                    item.ativo ? 'text-[var(--color-fips-prata-25)]' : 'text-white/[0.75] hover:text-white/[0.92]',
                  )
                  const comSelo = seloVisivel(item.selo)
                  const rotuloComSelo = comSelo ? `${item.rotulo}, ${item.selo}` : item.rotulo
                  const conteudo = (
                    <>
                      <span
                        aria-hidden
                        data-ativo={item.ativo ? 'true' : undefined}
                        className="fips-neu-tile relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px]"
                      >
                        <Icone className="h-[17px] w-[17px] transition-colors" strokeWidth={1.9} />
                        {comSelo && compacto ? (
                          <span className="absolute top-0.5 right-0.5 z-[2] h-2 w-2 rounded-full bg-[var(--color-accent)] ring-2 ring-[var(--color-fips-azulejo-600)]" />
                        ) : null}
                      </span>
                      {compacto ? (
                        <span className="sr-only">{rotuloComSelo}</span>
                      ) : (
                        <>
                          <span className="flex-1 truncate text-[13.5px] font-medium">{item.rotulo}</span>
                          {comSelo ? (
                            <span
                              data-testid="selo-do-menu"
                              className="ml-auto shrink-0 rounded-full bg-[var(--color-accent)] px-1.5 text-[10px] leading-4 font-bold text-[var(--color-fips-blue-950)] tabular-nums"
                            >
                              {typeof item.selo === 'number' ? textoDoContador(item.selo) : item.selo}
                            </span>
                          ) : null}
                        </>
                      )}
                    </>
                  )
                  const estilo = { gap: compacto ? 0 : 12 }
                  return (
                    <li key={item.id}>
                      {renderLink ? (
                        renderLink({
                          href: item.href,
                          className: classe,
                          style: estilo,
                          title: compacto ? item.rotulo : undefined,
                          'aria-current': item.ativo ? 'page' : undefined,
                          onClick: () => aoNavegar?.(),
                          children: conteudo,
                        })
                      ) : (
                        <a
                          href={item.href}
                          title={compacto ? item.rotulo : undefined}
                          aria-current={item.ativo ? 'page' : undefined}
                          onClick={() => aoNavegar?.()}
                          className={classe}
                          style={estilo}
                        >
                          {conteudo}
                        </a>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
      </nav>

      {/* Rodapé obrigatório: Modo do menu e Versão */}
      <div className={cn('border-t border-white/[0.06] py-2', compacto ? 'px-2 text-center' : 'px-3')}>
        {compacto ? null : (
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setModoAberto((v) => !v)}
              aria-expanded={modoAberto}
              aria-haspopup="dialog"
              className={cn(
                'flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] transition focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none',
                modoAberto ? 'bg-white/[0.06] text-white/85' : 'text-white/55 hover:bg-white/[0.04] hover:text-white/80',
              )}
            >
              <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span className="flex-1 truncate text-left font-medium">Modo do menu</span>
              <span className="font-mono text-[10px] text-white/55">
                {recolherAuto ? `Auto · ${segundos}s` : 'Manual'}
              </span>
            </button>
            {modoAberto ? (
              <div
                role="dialog"
                aria-label="Configurar modo do menu"
                className="fips-sidebar__popover absolute right-0 bottom-full left-0 z-40 mb-2 rounded-lg border border-white/10 p-3 shadow-[0_8px_24px_rgb(0_0_0/0.35)]"
              >
                <div className="mb-2.5 flex rounded-md bg-white/[0.05] p-0.5">
                  <button
                    type="button"
                    onClick={() => aoMudarRecolherAuto(false)}
                    aria-pressed={!recolherAuto}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition',
                      !recolherAuto ? 'bg-white/[0.10] text-white shadow-sm' : 'text-white/55 hover:text-white/80',
                    )}
                  >
                    <MousePointer2 className="h-3 w-3" strokeWidth={2} aria-hidden />
                    Manual
                  </button>
                  <button
                    type="button"
                    onClick={() => aoMudarRecolherAuto(true)}
                    aria-pressed={recolherAuto}
                    className={cn(
                      'flex flex-1 items-center justify-center gap-1 rounded px-2 py-1 text-[11px] font-medium transition',
                      recolherAuto ? 'bg-white/[0.10] text-white shadow-sm' : 'text-white/55 hover:text-white/80',
                    )}
                  >
                    <Zap className="h-3 w-3" strokeWidth={2} aria-hidden />
                    Automático
                  </button>
                </div>

                {recolherAuto ? (
                  <>
                    <div className="mb-1.5 flex items-center gap-1.5 text-[10px] tracking-wide text-white/55 uppercase">
                      <Timer className="h-3 w-3" strokeWidth={2} aria-hidden />
                      <span>Recolher após</span>
                      <span className="ml-auto font-mono text-[11px] tracking-normal text-white/85 normal-case">{segundos}s</span>
                    </div>
                    <input
                      type="range"
                      min={SEGUNDOS_MIN}
                      max={SEGUNDOS_MAX}
                      step={1}
                      value={segundos}
                      onChange={(e) => aoMudarSegundos(Number(e.target.value))}
                      aria-label="Tempo para recolher (segundos)"
                      className="fips-sb-range h-1.5 w-full cursor-pointer appearance-none rounded-full"
                      style={{
                        background: `linear-gradient(to right, var(--color-accent-strong) 0%, var(--color-accent-strong) ${pct}%, rgb(255 255 255 / 0.10) ${pct}%, rgb(255 255 255 / 0.10) 100%)`,
                      }}
                    />
                    <div className="mt-2 flex gap-1">
                      {ATALHOS_DE_SEGUNDOS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => aoMudarSegundos(s)}
                          className={cn(
                            'flex-1 rounded px-1 py-0.5 font-mono text-[10px] transition',
                            segundos === s
                              ? 'bg-[var(--color-accent-strong)]/20 text-[var(--color-accent-strong)]'
                              : 'bg-white/[0.04] text-white/55 hover:bg-white/[0.08] hover:text-white/85',
                          )}
                        >
                          {s}s
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-[10px] leading-snug text-white/55">
                    Use o botão do cabeçalho para recolher e expandir o menu.
                  </p>
                )}
              </div>
            ) : null}
          </div>
        )}
        <button
          type="button"
          onClick={versao.aoAbrir}
          title={versao.dica ?? 'Ver novidades'}
          className={cn(
            'mt-0.5 flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-[11px] text-white/55 transition hover:bg-white/[0.04] hover:text-white/80 focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:outline-none',
            compacto ? 'justify-center' : 'justify-start',
          )}
        >
          <Sparkles className="h-3.5 w-3.5 shrink-0" aria-hidden />
          {compacto ? (
            <span className="sr-only">
              {rotuloVersao} {numeroDaVersao(versao.numero)}
            </span>
          ) : (
            <>
              <span className="flex-1 truncate text-left font-medium">{rotuloVersao}</span>
              <span className="font-mono text-[10px] text-white/55">v{numeroDaVersao(versao.numero)}</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
