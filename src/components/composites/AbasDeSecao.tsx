import { useEffect, useRef } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
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
  className?: string
}

/**
 * Faixa de abas de seção. No topo fica abaixo do cabeçalho; no rodapé fica
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
 * 3. A altura do rodapé (44px, o alvo de toque mínimo) é a variável
 *    `--abas-secao-altura`. A página reserva o espaço com `abas-secao-reserva`,
 *    que deriva dela. No topo a altura é a da faixa do cabeçalho (39px) e não
 *    usa a variável.
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
  className,
}: AbasDeSecaoProps) {
  const rodape = posicao === 'rodape'
  const navRef = useRef<HTMLElement>(null)

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
  }, [ativa])

  return (
    <nav
      ref={navRef}
      aria-label={label}
      data-posicao={posicao}
      style={{ height: rodape ? 'var(--abas-secao-altura, 44px)' : U.navHeightPx }}
      className={cn(
        'no-scrollbar relative flex w-full min-w-0 items-center overflow-x-auto bg-[var(--color-surface)]',
        rodape
          ? 'fixed inset-x-0 z-[39] bottom-[calc(var(--barra-inferior-altura,0px)+var(--abas-secao-empilha,0px)+env(safe-area-inset-bottom,0px))] shadow-[inset_0_2px_0_var(--color-border)]'
          : 'shadow-[inset_0_-2px_0_var(--color-border)]',
        className,
      )}
    >
      {abas.map((aba) => {
        const ativo = aba.id === ativa
        const Icone = aba.icon
        const comum = {
          'aria-current': ativo ? (aba.href ? ('page' as const) : ('true' as const)) : undefined,
          'data-state': ativo ? 'active' : 'inactive',
          onClick: onSelecionar ? () => onSelecionar(aba.id) : undefined,
          className: cn(
            'relative inline-flex h-full cursor-pointer items-center gap-[7px] whitespace-nowrap py-2 text-[13px] transition-colors duration-200',
            rodape ? 'flex-1 justify-center px-2.5' : 'shrink-0 px-6',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color-mix(in_srgb,var(--color-fips-yellow-600)_40%,transparent)]',
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
    </nav>
  )
}
