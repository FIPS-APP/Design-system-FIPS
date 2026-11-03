import { Children, forwardRef, isValidElement, useCallback, useState, type KeyboardEvent, type ReactNode } from 'react'
import { Maximize2, Minimize2, X, type LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './dialog'
import { classesDoModal, type TamanhoDoModal } from './modal-variants'

export interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
  size?: TamanhoDoModal
  showCloseButton?: boolean
  layer?: number
  headerIcon?: LucideIcon
  /**
   * Faixa em degradê (ícone glass, texto branco, eyebrow). Fica desligada.
   * O modal curto — aviso, passo a passo, um botão — usa o cabeçalho plano,
   * no tema claro e no escuro. Ligar isto num aviso curto é o cartão com selo
   * e disco de ícone. Exemplo escuro: botão "Simples (escuro)" em
   * `/docs/components/dialog`.
   */
  hero?: boolean
  /** Rótulo dourado uppercase acima do título. Só tem efeito com `hero`. Não use no modal curto. */
  eyebrow?: ReactNode
  /** Remove o padding do corpo (`px-6 py-5`); o conteúdo controla o próprio espaçamento. */
  noPadBody?: boolean
  /**
   * Mostra o botão "Tela cheia" / "Restaurar" ao lado do X de fechar. Sem esta prop
   * nada muda. Regra do DS: modal curto não rola; conteúdo grande (formulário longo,
   * tabela, pré-visualização) liga isto e o corpo rola dentro da tela cheia.
   */
  permiteTelaCheia?: boolean
  /** Estado controlado da tela cheia. Sem ele o Modal guarda o estado e volta ao tamanho normal ao fechar. */
  telaCheia?: boolean
  /** Estado inicial quando `telaCheia` não é passado. */
  telaCheiaInicial?: boolean
  /** Chamado quando o botão (ou o atalho) alterna a tela cheia. */
  aoMudarTelaCheia?: (telaCheia: boolean) => void
  /** Liga o atalho Alt+Enter (só com o foco dentro do modal) para alternar a tela cheia. Só tem efeito com `permiteTelaCheia`. */
  atalhoTelaCheia?: boolean
}

function isModalFooterChild(child: ReactNode): child is React.ReactElement<ModalFooterProps> {
  return isValidElement(child) && (child.type as { displayName?: string })?.displayName === 'ModalFooter'
}

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      open,
      onOpenChange,
      title,
      description,
      children,
      className,
      size = 'md',
      headerIcon: HeaderIcon,
      hero = false,
      eyebrow,
      noPadBody = false,
      permiteTelaCheia = false,
      telaCheia: telaCheiaControlada,
      telaCheiaInicial = false,
      aoMudarTelaCheia,
      atalhoTelaCheia = false,
    },
    ref,
  ) => {
    const [telaCheiaInterna, setTelaCheiaInterna] = useState(telaCheiaInicial)
    const [abertoAntes, setAbertoAntes] = useState(open)
    if (abertoAntes !== open) {
      setAbertoAntes(open)
      // Ao fechar, o modal não controlado volta ao tamanho normal.
      if (!open) setTelaCheiaInterna(telaCheiaInicial)
    }
    const controlado = telaCheiaControlada !== undefined
    const telaCheia = permiteTelaCheia && (controlado ? telaCheiaControlada : telaCheiaInterna)
    const alternarTelaCheia = () => {
      const proximo = !telaCheia
      if (!controlado) setTelaCheiaInterna(proximo)
      aoMudarTelaCheia?.(proximo)
    }
    const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
      if (!permiteTelaCheia || !atalhoTelaCheia) return
      if (evento.altKey && evento.key === 'Enter' && !evento.ctrlKey && !evento.metaKey) {
        evento.preventDefault()
        alternarTelaCheia()
      }
    }
    // Com a tela cheia ligada, o corpo traz para a vista a lista de um Select recém-aberta: o Select do
    // DS abre `absolute` dentro do corpo rolável e, perto da borda de baixo, a lista ficaria cortada.
    const observarListas = useCallback((corpo: HTMLDivElement | null) => {
      if (!corpo || !permiteTelaCheia) return
      const observador = new MutationObserver((registros) => {
        for (const registro of registros) {
          const gatilho = registro.target as HTMLElement
          if (gatilho.getAttribute('aria-expanded') !== 'true') continue
          const lista = gatilho.parentElement?.querySelector('[role="listbox"]')
          lista?.scrollIntoView({ block: 'nearest' })
        }
      })
      observador.observe(corpo, { subtree: true, attributes: true, attributeFilter: ['aria-expanded'] })
      return () => observador.disconnect()
    }, [permiteTelaCheia])
    const rotuloTelaCheia = telaCheia ? 'Restaurar' : 'Tela cheia'
    const IconeTelaCheia = telaCheia ? Minimize2 : Maximize2
    const childList = Children.toArray(children)
    const footers = childList.filter(isModalFooterChild)
    const body = childList.filter((child) => !isModalFooterChild(child))

    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          ref={ref}
          showCloseButton={!hero}
          onKeyDown={permiteTelaCheia && atalhoTelaCheia ? aoTeclar : undefined}
          data-tela-cheia={telaCheia ? 'true' : undefined}
          className={classesDoModal({ size, telaCheia, className })}
        >
          {permiteTelaCheia ? (
            <button
              type="button"
              onClick={alternarTelaCheia}
              aria-label={rotuloTelaCheia}
              aria-pressed={telaCheia}
              aria-keyshortcuts={atalhoTelaCheia ? 'Alt+Enter' : undefined}
              title={rotuloTelaCheia}
              className={cn(
                'absolute z-[30] flex items-center justify-center transition-all focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:outline-none',
                hero
                  ? 'top-3.5 right-[3.25rem] h-8 w-8 rounded-lg bg-white/[0.08] text-white/75 hover:bg-white/[0.18] hover:text-white'
                  : cn(
                      'top-4 right-14 h-7 w-7 rounded-lg border border-black/[0.08] bg-black/[0.04] text-zinc-500',
                      'hover:border-[color-mix(in_srgb,var(--color-primary)_35%,transparent)] hover:bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] hover:text-[var(--color-primary)]',
                      'dark:border-white/[0.08] dark:bg-white/[0.04] dark:text-zinc-400 dark:hover:text-[var(--color-fips-blue-200)]',
                    ),
              )}
            >
              <IconeTelaCheia className="h-3.5 w-3.5" aria-hidden strokeWidth={2} />
            </button>
          ) : null}
          {(title || description) && (hero ? (
            <div
              className={cn('relative flex shrink-0 items-center gap-3.5 overflow-hidden px-6 py-5 pr-14', permiteTelaCheia && 'pr-24')}
              style={{ background: 'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, #001A4A 100%)' }}
            >
              {HeaderIcon ? (
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-white/[0.16] text-white"
                  style={{
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.06) 56%, rgba(0,24,58,0.22) 100%)',
                    boxShadow: '0 1px 2px rgba(0,42,104,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
                  }}
                >
                  <HeaderIcon className="h-5 w-5" aria-hidden />
                </div>
              ) : null}
              <div className="min-w-0 flex-1">
                {eyebrow ? (
                  <span className="block font-heading text-[11px] font-semibold uppercase leading-tight tracking-[0.14em] text-[var(--color-accent-strong)]">{eyebrow}</span>
                ) : null}
                {title ? (
                  <DialogTitle className="font-heading text-[21px] font-bold leading-tight tracking-[-0.2px] text-white">{title}</DialogTitle>
                ) : null}
                {description ? <DialogDescription className="mt-0.5 text-xs leading-snug text-white/65">{description}</DialogDescription> : null}
              </div>
              <DialogClose
                className="absolute right-3.5 top-3.5 flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.08] text-white/75 transition-colors hover:bg-white/[0.18] hover:text-white focus:outline-none"
                aria-label="Fechar"
              >
                <X className="h-4 w-4" aria-hidden />
              </DialogClose>
            </div>
          ) : (
            <DialogHeader
              className={cn(
                'flex-row items-start gap-3 border-b border-[var(--color-border)] px-6 py-4 pr-14 text-left',
                HeaderIcon && 'gap-4',
                permiteTelaCheia && 'pr-[5.5rem]!',
              )}
            >
              {HeaderIcon ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-fips-blue-200)]/60 text-[var(--color-primary)]">
                  <HeaderIcon className="h-5 w-5" aria-hidden />
                </div>
              ) : null}
              <div className="min-w-0 flex-1 space-y-1">
                {title ? (
                  <DialogTitle className="text-lg text-[var(--color-fg)] dark:text-white">{title}</DialogTitle>
                ) : null}
                {description ? <DialogDescription>{description}</DialogDescription> : null}
              </div>
            </DialogHeader>
          ))}
          {body.length > 0 ? (
            <div ref={observarListas} className={cn('flex-1 overflow-y-auto', noPadBody ? 'p-0' : 'px-6 py-5')}>{body}</div>
          ) : null}
          {footers}
        </DialogContent>
      </Dialog>
    )
  },
)

Modal.displayName = 'Modal'

export interface ModalFooterProps {
  children: ReactNode
  className?: string
  hint?: ReactNode
}

const ModalFooter = ({ children, className, hint }: ModalFooterProps) => {
  return (
    <div
      className={cn(
        'flex flex-col gap-3 border-t border-[var(--color-border)] bg-[var(--color-surface-muted)]/70 px-6 py-4 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
    >
      {hint ? (
        <p className="text-xs text-[var(--color-fg-muted)] sm:mr-auto">{hint}</p>
      ) : (
        <span className="hidden sm:block sm:flex-1" />
      )}
      <div className="flex flex-wrap items-center justify-end gap-3">{children}</div>
    </div>
  )
}

ModalFooter.displayName = 'ModalFooter'

export { Modal, ModalFooter }
