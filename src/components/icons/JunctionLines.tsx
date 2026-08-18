import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'

/**
 * Trilhos de junção — a decoração ferroviária das faixas FIPS.
 *
 * As 4 curvas viviam copiadas em três lugares (`banner-shared`, `ChangelogModal`,
 * `ExportPreviewModal`) e faltavam no `<Modal hero>`, que por isso saía sem a
 * decoração que a anatomia canônica exige. Definição única aqui; quem desenha a
 * faixa só escolhe posição e opacidade.
 *
 * O `stroke` vem de `--color-junction-stroke` (branco no claro, ouro no escuro).
 */
const JUNCTION_PATHS = [
  'M0 60H100C120 60 120 60 140 40L200 40H320',
  'M0 60H100C120 60 120 60 140 80L200 80H320',
  'M0 120H60C80 120 80 120 100 100L160 100H320',
  'M0 120H60C80 120 80 120 100 140L160 140H320',
]

export function JunctionLines({
  className,
  style,
}: {
  className?: string
  style?: CSSProperties
}) {
  return (
    <svg viewBox="0 0 320 200" fill="none" className={className} style={style} aria-hidden>
      {JUNCTION_PATHS.map((d) => (
        <path
          key={d}
          d={d}
          stroke="var(--color-junction-stroke)"
          strokeWidth="6"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

/**
 * Preset para header hero de modal — a geometria que o `ChangelogModal` e o
 * `ExportPreviewModal` já usavam, agora compartilhada com o `<Modal hero>`.
 * Opacidade vem do token da faixa de conteúdo (0.06): na faixa baixa do modal,
 * o 0.12 da faixa de página vira ruído atrás do título.
 */
export function ModalHeroJunctionLines({ className }: { className?: string }) {
  return (
    <JunctionLines
      className={cn(
        'pointer-events-none absolute -top-2.5 -right-5 h-[200px] w-[360px]',
        className,
      )}
      style={{ opacity: 'var(--fips-banner-junction-content-opacity)' }}
    />
  )
}
