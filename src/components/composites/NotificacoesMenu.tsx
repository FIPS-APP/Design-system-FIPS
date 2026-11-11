import { useState } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Bell, ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { textoDoContador } from './app-shell-logica'
import { usePainelAncorado } from './use-painel-ancorado'

export type TomDaNotificacao = 'neutro' | 'info' | 'atencao' | 'critico'

export interface ItemDeNotificacao {
  id: string
  titulo: string
  /** Texto de apoio (até 2 linhas). */
  texto?: string
  /** Quando aconteceu ("há 3 h") ou o prazo ("2 dias"). Fonte mono à direita do título. */
  quando?: string
  /** Texto completo do `title` do item (por exemplo a data e a hora inteiras). */
  dica?: string
  icone?: LucideIcon
  /** Cor do ícone e do marcador. Padrão `neutro`. */
  tom?: TomDaNotificacao
  /** Ainda não visto: fundo azul-claro e ponto à direita. */
  destaque?: boolean
  /** Com ele o item vira botão e mostra a seta no hover. Sem ele é só texto. */
  aoClicar?: () => void
}

export interface SecaoDeNotificacoes {
  /** Rótulo da seção. Sem ele a seção não tem título. */
  titulo?: string
  itens: ItemDeNotificacao[]
}

export interface NotificacoesMenuProps {
  secoes: SecaoDeNotificacoes[]
  /** Número do selo do sino. Padrão: itens com `destaque`. */
  contagem?: number
  /** Nome do sino para leitor de tela. Padrão: "Avisos", com a contagem quando houver. */
  rotuloDoSino?: string
  /** Título do painel. Padrão "Notificações". */
  titulo?: string
  /** Texto do painel vazio. Padrão "Nenhum aviso por aqui.". */
  vazio?: string
  /** Chamado ao clicar num item com `aoClicar`, depois de fechar o painel. */
  aoEscolher?: (item: ItemDeNotificacao) => void
}

const COR_DO_TOM: Record<TomDaNotificacao, string> = {
  neutro: 'var(--color-primary-text)',
  info: 'var(--color-primary-text)',
  atencao: 'var(--color-accent-strong)',
  critico: 'var(--color-danger-text)',
}
const COR_DO_MARCADOR: Record<TomDaNotificacao, string> = {
  neutro: 'var(--color-fg-muted)',
  info: 'var(--color-fg-muted)',
  // O laranja puro mede 3,96:1 sobre o fundo azul-claro do destaque; misturado ao texto passa de 4,5:1 nos dois temas.
  atencao: 'color-mix(in srgb, var(--color-semantic-atencao-fg) 70%, var(--color-fg))',
  critico: 'var(--color-danger-text)',
}

const LINHA =
  'group flex w-full items-start gap-2.5 border-b border-[var(--color-border)] px-3.5 py-2.5 text-left transition-colors'

/**
 * Sino do cabeçalho: azulejo com o selo da contagem e painel de 340px em portal (reposiciona ao
 * rolar e ao redimensionar, nunca passa das bordas da tela, fecha no Esc e no clique fora). As linhas
 * vêm por props, em seções; nada de rota ou regra do app aqui.
 */
export function NotificacoesMenu({
  secoes,
  contagem,
  rotuloDoSino,
  titulo = 'Notificações',
  vazio = 'Nenhum aviso por aqui.',
  aoEscolher,
}: NotificacoesMenuProps) {
  const [aberto, setAberto] = useState(false)
  const { ancoraRef, painelRef, posicao } = usePainelAncorado(aberto, () => setAberto(false), { largura: 340 })

  const total = secoes.reduce((n, s) => n + s.itens.length, 0)
  const numero = contagem ?? secoes.reduce((n, s) => n + s.itens.filter((i) => i.destaque).length, 0)
  const nome = rotuloDoSino ?? (numero > 0 ? `Avisos, ${numero} ${numero === 1 ? 'novo' : 'novos'}` : 'Avisos')

  return (
    <div ref={ancoraRef} className="inline-flex">
      <button
        type="button"
        aria-label={nome}
        title={nome}
        aria-expanded={aberto}
        aria-haspopup="dialog"
        data-tutorial="sino"
        onClick={() => setAberto((v) => !v)}
        className="fips-header-tile"
      >
        <Bell className="h-[17px] w-[17px]" strokeWidth={1.9} aria-hidden />
        {numero > 0 ? (
          <span
            data-testid="sino-contador"
            aria-hidden
            className="absolute top-0.5 right-0.5 z-[2] flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[10px] leading-none font-bold text-white tabular-nums ring-2 ring-[var(--color-surface-muted)] dark:bg-[var(--color-fips-blue-400)] dark:text-[var(--color-fips-blue-950)]"
          >
            {textoDoContador(numero)}
          </span>
        ) : null}
      </button>

      {aberto && posicao
        ? createPortal(
            <motion.div
              ref={painelRef}
              role="dialog"
              aria-label="Avisos"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed z-50 flex flex-col overflow-hidden rounded-[10px_10px_10px_16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)]"
              style={{ top: posicao.top, left: posicao.left, width: posicao.largura, transformOrigin: 'top right' }}
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border)] px-3.5 py-2.5">
                <span className="text-[13px] font-semibold text-[var(--color-fg)]">
                  {titulo}
                  {numero > 0 ? (
                    <span className="ml-1.5 font-mono text-[11px] font-bold text-[var(--color-primary-text)]">{numero}</span>
                  ) : null}
                </span>
              </div>

              <div className="max-h-[min(340px,calc(100svh-120px))] overflow-y-auto">
                {total === 0 ? (
                  <p className="px-3.5 py-6 text-center text-[12px] text-[var(--color-fg-muted)]">{vazio}</p>
                ) : (
                  secoes
                    .filter((s) => s.itens.length > 0)
                    .map((secao, i, comItens) => (
                      <div key={secao.titulo ?? i} className={i === comItens.length - 1 ? '[&>*:last-child]:border-0' : undefined}>
                        {secao.titulo ? (
                          <p className="px-3.5 pt-2.5 pb-1 font-mono text-[9px] font-bold tracking-[0.5px] text-[var(--color-fg-muted)] uppercase">
                            {secao.titulo}
                          </p>
                        ) : null}
                        {secao.itens.map((item) => {
                          const Icone = item.icone ?? Bell
                          const tom = item.tom ?? 'neutro'
                          const conteudo = (
                            <>
                              <Icone
                                className="mt-0.5 h-4 w-4 shrink-0"
                                style={{ color: COR_DO_TOM[tom] }}
                                strokeWidth={2}
                                aria-hidden
                              />
                              <span className="min-w-0 flex-1">
                                <span className="flex items-baseline gap-2">
                                  <span className="flex-1 truncate text-[12.5px] font-semibold text-[var(--color-fg)]">
                                    {item.titulo}
                                  </span>
                                  {item.quando ? (
                                    <span
                                      className={cn('shrink-0 font-mono text-[10px]', item.destaque && 'font-bold')}
                                      style={{ color: COR_DO_MARCADOR[tom] }}
                                    >
                                      {item.quando}
                                    </span>
                                  ) : null}
                                </span>
                                {item.texto ? (
                                  <span
                                    className={cn(
                                      'mt-0.5 line-clamp-2 block text-[11.5px] leading-snug',
                                      // No fundo azul-claro do destaque o cinza do texto cai a 3,5:1 no tema claro.
                                      item.destaque ? 'text-[var(--color-fg)]' : 'text-[var(--color-fg-muted)]',
                                    )}
                                  >
                                    {item.texto}
                                  </span>
                                ) : null}
                              </span>
                              {item.destaque ? (
                                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-primary)]" />
                              ) : null}
                              {item.aoClicar ? (
                                <ChevronRight
                                  className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--color-fg-muted)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                                  aria-hidden
                                />
                              ) : null}
                            </>
                          )
                          const estilo = item.destaque ? { background: 'var(--color-semantic-info-bg)' } : undefined
                          return item.aoClicar ? (
                            <button
                              key={item.id}
                              type="button"
                              title={item.dica}
                              style={estilo}
                              onClick={() => {
                                setAberto(false)
                                item.aoClicar?.()
                                aoEscolher?.(item)
                              }}
                              className={cn(
                                LINHA,
                                'hover:bg-[var(--color-accent)]/20 focus-visible:bg-[var(--color-accent)]/20 focus-visible:outline-none dark:hover:bg-[var(--color-accent)]/12',
                              )}
                            >
                              {conteudo}
                            </button>
                          ) : (
                            <div
                              key={item.id}
                              title={item.dica}
                              style={estilo}
                              className="flex w-full items-start gap-2.5 border-b border-[var(--color-border)] px-3.5 py-2.5"
                            >
                              {conteudo}
                            </div>
                          )
                        })}
                      </div>
                    ))
                )}
              </div>
            </motion.div>,
            document.body,
          )
        : null}
    </div>
  )
}
