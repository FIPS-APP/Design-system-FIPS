import { cva, type VariantProps } from 'class-variance-authority'

/**
 * Tons do `SegmentoAvaliacao`. O texto marcado é uma mistura do `fg` semântico com `--color-fg`
 * (escurece no claro, clareia no escuro): o `fg` semântico sozinho passa no escuro mas não
 * no claro (o verde `sucesso` fica em 3,97:1 sobre o fundo dele).
 * `atencao` é o amarelo da marca e `aviso` é o laranja (tokens `--color-semantic-atencao-*`):
 * o DS não tem token semântico amarelo, então o fundo é o amarelo diluído na superfície.
 */
export const segmentoMarcado = cva('border-2', {
  variants: {
    tom: {
      sucesso:
        'border-[var(--color-semantic-sucesso-border)] bg-[var(--color-semantic-sucesso-bg)] text-[color-mix(in_srgb,var(--color-semantic-sucesso-fg)_60%,var(--color-fg))]',
      atencao:
        'border-[color-mix(in_srgb,var(--color-fips-yellow-400)_55%,var(--color-surface))] bg-[color-mix(in_srgb,var(--color-fips-yellow-400)_20%,var(--color-surface))] text-[color-mix(in_srgb,var(--color-fips-yellow-600)_35%,var(--color-fg))]',
      aviso:
        'border-[var(--color-semantic-atencao-border)] bg-[var(--color-semantic-atencao-bg)] text-[color-mix(in_srgb,var(--color-semantic-atencao-fg)_60%,var(--color-fg))]',
      neutro:
        'border-[var(--color-border-strong)] bg-[var(--color-surface-muted)] text-[color-mix(in_srgb,var(--color-fg-muted)_50%,var(--color-fg))]',
      critico:
        'border-[var(--color-semantic-critico-border)] bg-[var(--color-semantic-critico-bg)] text-[color-mix(in_srgb,var(--color-semantic-critico-fg)_60%,var(--color-fg))]',
    },
  },
  defaultVariants: { tom: 'neutro' },
})

/** Ponto colorido do botão desmarcado: repete o tom, quem não distingue cor lê o texto. */
export const segmentoPonto = cva('h-1.5 w-1.5 shrink-0 rounded-full', {
  variants: {
    tom: {
      sucesso: 'bg-[var(--color-success)]',
      atencao: 'bg-[var(--color-fips-yellow-400)]',
      aviso: 'bg-[var(--color-fips-yellow-600)]',
      neutro: 'bg-[var(--color-fg-muted)]',
      critico: 'bg-[var(--color-danger)]',
    },
  },
  defaultVariants: { tom: 'neutro' },
})

export type TomAvaliacao = NonNullable<VariantProps<typeof segmentoMarcado>['tom']>
