import { cn } from '../../lib/cn'

export type TamanhoDoModal = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'workflow'

export const tamanhosDoModal: Record<TamanhoDoModal, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  full: 'max-w-4xl',
  workflow: 'max-w-[900px]',
}

/** Tela cheia: 96% da janela nos dois eixos. Vem DEPOIS do `className` do consumidor para valer sobre o `max-w-*` dele. */
const TELA_CHEIA =
  'h-[96dvh] max-h-[96dvh] w-[96vw] max-w-[96vw] sm:h-[96dvh] sm:max-h-[96dvh] sm:w-[96vw] sm:max-w-[96vw]'

/**
 * Classes do cartão do Modal. O `className` do consumidor vence no tamanho normal; em tela cheia o
 * tamanho do DS vence, senão `max-w-[1200px]` do app deixava a "Tela cheia" só 54 px mais alta.
 */
export function classesDoModal({
  size = 'md',
  telaCheia = false,
  className,
}: {
  size?: TamanhoDoModal
  telaCheia?: boolean
  className?: string
}): string {
  return cn(
    'flex flex-col gap-0 overflow-hidden p-0 sm:p-0',
    !telaCheia && cn('max-h-[90vh] sm:max-h-[90vh]', tamanhosDoModal[size]),
    className,
    telaCheia && TELA_CHEIA,
  )
}
