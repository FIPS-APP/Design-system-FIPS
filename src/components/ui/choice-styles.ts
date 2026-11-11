import { cn } from '../../lib/cn'

/** Caixa de 20px; o texto da descrição e do erro recua 28px (caixa + vão) para alinhar com o rótulo. */
export const CHOICE_TEXT_OFFSET_CLASS = 'pl-7'

/** Classes da caixa nativa (appearance-none): borda de controle, preenchida quando marcada. */
export const choiceBoxClass = cn(
  'peer m-0 h-5 w-5 shrink-0 cursor-pointer appearance-none border-2 border-[var(--color-border-control)] bg-[var(--color-surface)] transition-colors',
  'hover:border-[var(--color-fg-muted)]',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-surface)]',
  'checked:border-[var(--color-switch-on)] checked:bg-[var(--color-switch-on)]',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-[invalid=true]:border-[var(--color-danger)] aria-[invalid=true]:checked:bg-[var(--color-danger)]',
)
