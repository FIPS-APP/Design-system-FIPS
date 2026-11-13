import { cva } from 'class-variance-authority'

/**
 * Tons da Home padrão. Todos leem tokens: nenhum hex aqui. O texto pequeno usa `--color-accent-text` e
 * `--color-success-text` (4,5:1 ou mais sobre o fundo do próprio tom, claro e escuro); o laranja e o
 * verde "de marca" (`--color-accent-strong`, `--color-success`) ficam só em borda, faixa e fundo.
 */
export type TomHome = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'

/** Nível do título do cartão. O nível da seção (`h2`) é o da `SecaoHome`. */
export type NivelTituloHome = 2 | 3 | 4

export function tagTitulo(nivel: NivelTituloHome): 'h2' | 'h3' | 'h4' {
  return nivel === 2 ? 'h2' : nivel === 4 ? 'h4' : 'h3'
}

/** Quadradinho com o ícone (fundo suave do tom + ícone na cor do tom). */
export const tomIcone = cva('grid shrink-0 place-items-center', {
  variants: {
    tom: {
      primary: 'bg-[var(--color-primary)]/10 text-[var(--color-primary-text)] dark:bg-[var(--color-fips-blue-400)]/15',
      secondary:
        'bg-[var(--color-fips-blue-200)] text-[var(--color-fips-blue-950)] dark:bg-[var(--color-fips-blue-400)]/15 dark:text-[var(--color-primary-text)]',
      success: 'bg-[var(--color-success)]/14 text-[var(--color-success-text)]',
      warning: 'bg-[var(--color-badge-warning-bg)] text-[var(--color-accent-text)]',
      danger: 'bg-[var(--color-badge-danger-bg)] text-[var(--color-danger-text)]',
      neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-fg)]',
    },
    tamanho: {
      sm: 'h-9 w-9 rounded-lg',
      md: 'h-10 w-10 rounded-xl',
      lg: 'h-11 w-11 rounded-xl',
    },
  },
  defaultVariants: { tom: 'primary', tamanho: 'md' },
})

/** Selo em caixa alta (papel, categoria). */
export const tomSelo = cva(
  'inline-flex w-fit items-center rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.14em]',
  {
    variants: {
      tom: {
        primary:
          'bg-[var(--color-primary)]/10 text-[var(--color-primary-text)] dark:bg-[var(--color-fips-blue-400)]/18',
        secondary:
          'bg-[var(--color-fips-blue-200)] text-[var(--color-fips-blue-950)] dark:bg-[var(--color-fips-blue-400)]/18 dark:text-[var(--color-primary-text)]',
        success: 'bg-[var(--color-success)]/14 text-[var(--color-success-text)]',
        warning: 'bg-[var(--color-badge-warning-bg)] text-[var(--color-accent-text)]',
        danger: 'bg-[var(--color-badge-danger-bg)] text-[var(--color-danger-text)]',
        neutral: 'bg-[var(--color-surface-muted)] text-[var(--color-fg)]',
      },
    },
    defaultVariants: { tom: 'primary' },
  },
)

/** Borda esquerda grossa do cartão de responsabilidade e das notas. */
export const tomBordaEsquerda = cva('border-l-4', {
  variants: {
    tom: {
      primary: 'border-l-[var(--color-primary-text)]',
      secondary: 'border-l-[var(--color-secondary)]',
      success: 'border-l-[var(--color-success)]',
      warning: 'border-l-[var(--color-accent-strong)]',
      danger: 'border-l-[var(--color-danger)]',
      neutral: 'border-l-[var(--color-border-strong)]',
    },
  },
  defaultVariants: { tom: 'primary' },
})
