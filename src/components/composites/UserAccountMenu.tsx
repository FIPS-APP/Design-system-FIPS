import { useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'framer-motion'
import { Check, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Badge, type BadgeProps } from '../ui/badge'
import { iniciaisDoNome } from './app-shell-logica'
import { usePainelAncorado } from './use-painel-ancorado'

export interface UsuarioDaConta {
  nome: string
  email?: string
  cargo?: string
  fotoUrl?: string | null
  /** Padrão: primeira e última letra do nome. */
  iniciais?: string
  /** Cor do disco sem foto. Padrão: azul FIPS. */
  corDoAvatar?: string
}

export interface SeloDaConta {
  rotulo: string
  /** Variante do `Badge`. Padrão `secondary`. */
  variante?: BadgeProps['variant']
  /** Só layout/cor de texto extra, se o perfil pedir. */
  className?: string
}

export interface OpcaoDePerfil {
  id: string
  rotulo: string
  /** Classe de cor do rótulo (por exemplo um token de texto por perfil). */
  className?: string
}

export interface ItemDaConta {
  id: string
  rotulo: string
  icone?: LucideIcon
  aoClicar: () => void
}

export interface UserAccountMenuProps {
  aberto: boolean
  aoMudarAberto: (aberto: boolean) => void
  /** O `UserChip`. O painel ancora embaixo dele. */
  gatilho: ReactNode
  usuario: UsuarioDaConta
  /** Selos sob o nome: perfil em uso, área, ambiente. */
  selos?: SeloDaConta[]
  /**
   * Seção "Perfil (Modo Dev)": troca de perfil para teste (`menuitemradio`). Omita em produção, a
   * seção não aparece.
   */
  perfisDev?: {
    titulo?: string
    opcoes: OpcaoDePerfil[]
    ativo: string
    aoEscolher: (id: string) => void
  }
  /** Ações da conta (telas, preferências, sair). Fecham o menu ao clicar. */
  itens?: ItemDaConta[]
  /** Nome do painel para leitor de tela. Padrão "Minha conta". */
  rotulo?: string
}

const ITEM =
  'group flex w-full items-center gap-2 px-3.5 py-1 text-left text-[12px] text-[var(--color-fg)] transition-colors hover:bg-[var(--color-accent)]/20 focus-visible:bg-[var(--color-accent)]/20 focus-visible:outline-none dark:text-white/85 dark:hover:bg-[var(--color-accent)]/12'

function AvatarDaConta({ usuario, tamanho }: { usuario: UsuarioDaConta; tamanho: number }) {
  const [falhou, setFalhou] = useState<string | null>(null)
  if (usuario.fotoUrl && falhou !== usuario.fotoUrl) {
    return (
      <img
        src={usuario.fotoUrl}
        alt=""
        className="shrink-0 rounded-full object-cover"
        style={{ width: tamanho, height: tamanho }}
        onError={() => setFalhou(usuario.fotoUrl ?? null)}
      />
    )
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        width: tamanho,
        height: tamanho,
        fontSize: Math.round(tamanho * 0.34),
        background: usuario.corDoAvatar ?? 'var(--color-primary)',
      }}
      aria-hidden
    >
      {usuario.iniciais ?? iniciaisDoNome(usuario.nome)}
    </span>
  )
}

/**
 * Menu "Minha conta": painel de 280px ancorado embaixo do chip, em portal (o cabeçalho corta
 * `overflow`). Mostra avatar, nome, e-mail, cargo, selos, a seção opcional de perfil de teste e as
 * ações. Fecha no Esc, no clique fora e ao escolher uma ação. Genérico: nada de perfil ou rota do app.
 */
export function UserAccountMenu({
  aberto,
  aoMudarAberto,
  gatilho,
  usuario,
  selos = [],
  perfisDev,
  itens = [],
  rotulo = 'Minha conta',
}: UserAccountMenuProps) {
  const { ancoraRef, painelRef, posicao } = usePainelAncorado(aberto, () => aoMudarAberto(false), { largura: 280 })

  return (
    <div ref={ancoraRef} className="inline-flex">
      {gatilho}
      {aberto && posicao
        ? createPortal(
            <motion.div
              ref={painelRef}
              role="menu"
              aria-label={rotulo}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              className="fixed z-50 flex flex-col overflow-hidden rounded-[10px_10px_10px_16px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)]"
              style={{ top: posicao.top, left: posicao.left, width: posicao.largura, transformOrigin: 'top right' }}
            >
              <div className="flex items-start gap-2.5 px-3.5 pt-3.5 pb-2.5">
                <AvatarDaConta usuario={usuario} tamanho={36} />
                <div className="min-w-0 flex-1 pt-0.5 leading-tight">
                  <p className="truncate text-[13px] font-semibold text-[var(--color-fg)] dark:text-white">{usuario.nome}</p>
                  {usuario.email ? (
                    <p className="truncate text-[11px] text-[var(--color-fg-muted)]">{usuario.email}</p>
                  ) : null}
                  {usuario.cargo ? (
                    <p className="truncate text-[11px] font-medium text-[var(--color-fg-muted)]">{usuario.cargo}</p>
                  ) : null}
                </div>
              </div>

              {selos.length > 0 ? (
                <div className="flex flex-wrap items-center gap-1 px-3.5 pb-2.5">
                  {selos.map((selo) => (
                    <Badge key={selo.rotulo} size="sm" variant={selo.variante ?? 'secondary'} className={selo.className}>
                      {selo.rotulo}
                    </Badge>
                  ))}
                </div>
              ) : null}

              {perfisDev ? (
                <>
                  <div className="h-px bg-[var(--color-border)]" />
                  <div className="px-3.5 pt-2 pb-0.5 text-[9px] font-semibold tracking-[0.08em] text-[var(--color-fg-muted)] uppercase">
                    {perfisDev.titulo ?? 'Perfil (Modo Dev)'}
                  </div>
                  <div className="pb-1">
                    {perfisDev.opcoes.map((opcao) => {
                      const ativo = opcao.id === perfisDev.ativo
                      return (
                        <button
                          key={opcao.id}
                          type="button"
                          role="menuitemradio"
                          aria-checked={ativo}
                          onClick={() => perfisDev.aoEscolher(opcao.id)}
                          className={cn(
                            'flex w-full items-center gap-2 px-3.5 py-1 text-left text-[12px] transition-colors focus-visible:outline-none',
                            ativo
                              ? 'bg-[var(--color-primary)]/8'
                              : 'hover:bg-[var(--color-accent)]/20 focus-visible:bg-[var(--color-accent)]/20 dark:hover:bg-[var(--color-accent)]/12',
                          )}
                        >
                          <span className={cn('min-w-0 flex-1 truncate font-medium text-[var(--color-fg)]', opcao.className)}>
                            {opcao.rotulo}
                          </span>
                          {ativo ? (
                            <Check className="h-3.5 w-3.5 shrink-0 text-[var(--color-success-strong)]" aria-hidden />
                          ) : null}
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : null}

              {itens.length > 0 ? (
                <>
                  <div className="h-px bg-[var(--color-border)]" />
                  <div className="py-1">
                    {itens.map((item) => {
                      const Icone = item.icone
                      return (
                        <button
                          key={item.id}
                          type="button"
                          role="menuitem"
                          onClick={() => {
                            aoMudarAberto(false)
                            item.aoClicar()
                          }}
                          className={ITEM}
                        >
                          {Icone ? (
                            <Icone
                              className="h-3.5 w-3.5 text-[var(--color-fg-muted)] transition-colors group-hover:text-[var(--color-accent-strong)]"
                              aria-hidden
                            />
                          ) : null}
                          {item.rotulo}
                        </button>
                      )
                    })}
                  </div>
                </>
              ) : null}
            </motion.div>,
            document.body,
          )
        : null}
    </div>
  )
}
