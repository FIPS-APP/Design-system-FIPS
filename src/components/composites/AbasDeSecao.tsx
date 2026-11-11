import { useCallback, useEffect, useId, useRef, type KeyboardEvent } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { idDaAba, idPainelDeAba, indiceDaTecla } from './abasDeSecaoUtil'
import { docHeaderTabsUnderlineMd as U } from '../../lib/docHeaderChrome'

export interface AbaDeSecao {
  /** Único na faixa. */
  id: string
  label: string
  icon?: LucideIcon
  /** Com `href` vira `<a>` (recarrega a página sem router). Sem ele é `<button type="button">`. */
  href?: string
}

export interface AbasDeSecaoProps {
  abas: AbaDeSecao[]
  /** `id` da aba ativa. */
  ativa: string
  onSelecionar?: (id: string) => void
  /** `topo`: logo abaixo do cabeçalho. `rodape`: fixa acima da barra de navegação inferior. */
  posicao?: 'topo' | 'rodape'
  /** Nome da faixa para leitor de tela. */
  label?: string
  /**
   * Base dos ids. Quando passada, a aba ativa declara `aria-controls` apontando para o painel
   * `idPainelDeAba(idBase, id)` (só o painel ativo existe no DOM; aria-controls de id ausente não vale); o painel leva `propsDoPainel(idBase, id)`. Sem ela a aba
   * não declara `aria-controls`, porque o painel fica fora do componente.
   */
  idBase?: string
  className?: string
}

/**
 * Faixa de abas de seção. Sem `href` nas abas é o padrão de abas do WAI-ARIA: `tablist`
 * com `tab` (`aria-selected`, `tabindex` móvel, setas, Home e End; a seta já ativa a
 * aba). Com `href` em alguma aba é navegação entre páginas: `nav` com links e
 * `aria-current="page"`. Quando as abas não cabem a faixa rola, e a borda com mais abas
 * ganha um fade (`data-rolagem-esq` / `data-rolagem-dir`).
 *
 * No topo fica abaixo do cabeçalho; no rodapé fica
 * FIXA logo acima da barra de navegação do app, porque no celular a faixa do
 * topo sai da tela assim que a página rola e o polegar já está embaixo.
 *
 * Três armadilhas do rodapé, já resolvidas aqui:
 * 1. Outro elemento fixo (a faixa de estado do app) pode morar no mesmo vão.
 *    Quem o tem publica a altura em `--abas-secao-empilha`, e a faixa sobe.
 * 2. O traço da aba ativa pousa sobre a separação. A separação troca de lado
 *    com a posição e o traço troca junto. Os dois ficam DENTRO da caixa do
 *    `nav`: o `overflow-x: auto` dele recortaria qualquer coisa fora, e a
 *    separação é um `box-shadow` inset, não uma borda.
 * 3. A altura é a variável `--abas-secao-altura`: `max(39px, --alvo-toque)`, ou
 *    seja 39px no escritório e o alvo de toque do modo no celular (44px normal,
 *    48px fácil). A página reserva o espaço com `abas-secao-reserva`, que
 *    deriva dela.
 *
 * O app define `--barra-inferior-altura` com a altura da própria barra. Sem
 * ela a faixa fica em `bottom: 0`, por baixo da barra, e some.
 *
 * `abas-secao-reserva` substitui a reserva do app, não soma: tire a reserva
 * do app do MESMO elemento, porque uma regra sem camada do app vence a do
 * pacote. Ancestral com `transform` vira o bloco de contenção do `fixed`: a
 * faixa passa a se posicionar por ele, não pela tela.
 */
export function AbasDeSecao({
  abas,
  ativa,
  onSelecionar,
  posicao = 'topo',
  label = 'Seções',
  idBase,
  className,
}: AbasDeSecaoProps) {
  const rodape = posicao === 'rodape'
  const navegacao = abas.some((a) => a.href)
  const navRef = useRef<HTMLElement>(null)
  const autoId = useId()
  const base = idBase ?? autoId

  const medirRolagem = useCallback(() => {
    const nav = navRef.current
    if (!nav) return
    const resto = nav.scrollWidth - nav.clientWidth
    nav.toggleAttribute('data-rolagem-esq', nav.scrollLeft > 1)
    nav.toggleAttribute('data-rolagem-dir', resto > 1 && nav.scrollLeft < resto - 1)
  }, [])

  // Com mais abas do que cabem, a ativa pode ficar fora da faixa. Rola só a
  // faixa na horizontal, nunca a página.
  useEffect(() => {
    const nav = navRef.current
    const ativaEl = nav?.querySelector<HTMLElement>('[data-state="active"]')
    if (!nav || !ativaEl) return
    const n = nav.getBoundingClientRect()
    const a = ativaEl.getBoundingClientRect()
    if (a.left < n.left) nav.scrollLeft += a.left - n.left
    else if (a.right > n.right) nav.scrollLeft += a.right - n.right
    medirRolagem()
  }, [ativa, medirRolagem])

  useEffect(() => {
    const nav = navRef.current
    if (!nav) return
    medirRolagem()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(medirRolagem)
    ro.observe(nav)
    return () => ro.disconnect()
  }, [medirRolagem, abas.length])

  function aoTeclar(e: KeyboardEvent<HTMLElement>) {
    if (navegacao) return
    const alvos = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="tab"]'))
    const atual = alvos.indexOf(document.activeElement as HTMLElement)
    if (atual < 0) return
    const prox = indiceDaTecla(e.key, atual, alvos.length)
    if (prox < 0) return
    e.preventDefault()
    alvos[prox].focus()
    onSelecionar?.(abas[prox].id)
  }

  // Abas: `div` (o landmark é só da navegação entre páginas); o tablist vai dentro.
  const Raiz = navegacao ? 'nav' : 'div'
  return (
    <Raiz
      ref={navRef as React.RefObject<HTMLDivElement>}
      aria-label={navegacao ? label : undefined}
      data-posicao={posicao}
      onScroll={medirRolagem}
      onKeyDown={aoTeclar}
      style={{ height: 'var(--abas-secao-altura, 39px)' }}
      className={cn(
        'abas-secao-faixa no-scrollbar relative flex w-full min-w-0 items-center overflow-x-auto bg-[var(--color-surface)]',
        rodape
          ? 'fixed inset-x-0 z-[39] bottom-[calc(var(--barra-inferior-altura,0px)+var(--abas-secao-empilha,0px)+env(safe-area-inset-bottom,0px))] shadow-[inset_0_2px_0_var(--color-border)]'
          : 'shadow-[inset_0_-2px_0_var(--color-border)]',
        className,
      )}
    >
      <div
        role={navegacao ? undefined : 'tablist'}
        aria-label={navegacao ? undefined : label}
        aria-orientation={navegacao ? undefined : 'horizontal'}
        className="flex h-full w-max min-w-full items-center"
      >
        {abas.map((aba) => {
          const ativo = aba.id === ativa
          const Icone = aba.icon
          const papel = navegacao
            ? { 'aria-current': ativo ? (aba.href ? ('page' as const) : ('true' as const)) : undefined }
            : {
                role: 'tab' as const,
                id: idDaAba(base, aba.id),
                'aria-selected': ativo,
                'aria-controls': idBase && ativo ? idPainelDeAba(idBase, aba.id) : undefined,
                tabIndex: ativo ? 0 : -1,
              }
          const comum = {
            ...papel,
            'data-state': ativo ? 'active' : 'inactive',
            onClick: onSelecionar ? () => onSelecionar(aba.id) : undefined,
            className: cn(
              'relative inline-flex h-full cursor-pointer items-center gap-[7px] whitespace-nowrap py-2 text-[13px] transition-colors duration-200',
              rodape ? 'flex-1 justify-center px-2.5' : 'shrink-0 px-6',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-ring)]',
              ativo
                ? 'font-semibold text-[var(--color-fg)]'
                : 'font-normal text-[var(--color-fg-muted)] hover:bg-[color-mix(in_srgb,var(--color-fg)_6%,transparent)] hover:text-[var(--color-fg)]',
            ),
            children: (
              <>
                {Icone ? (
                  <Icone
                    className={cn('shrink-0', ativo ? 'text-[var(--color-fips-yellow-600)]' : 'text-[var(--color-fg-muted)]')}
                    style={{ width: U.iconSizePx, height: U.iconSizePx }}
                    strokeWidth={1.5}
                    aria-hidden
                  />
                ) : null}
                {aba.label}
                {ativo ? (
                  <span
                    aria-hidden
                    data-traco
                    className={cn(
                      'pointer-events-none absolute inset-x-0 h-[3px] bg-[var(--color-fips-yellow-600)]',
                      rodape ? 'top-0 rounded-b-[3px]' : 'bottom-0 rounded-t-[3px]',
                    )}
                  />
                ) : null}
              </>
            ),
          }
          return aba.href ? (
            <a key={aba.id} href={aba.href} {...comum} />
          ) : (
            <button key={aba.id} type="button" {...comum} />
          )
        })}
      </div>
    </Raiz>
  )
}
