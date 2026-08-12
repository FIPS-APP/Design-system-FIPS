import * as React from 'react'
import { cn } from '../../lib/cn'

export type BrandLoaderSize = 'sm' | 'md' | 'lg' | 'splash'

export interface BrandLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** sm 96px · md 180px · lg 280px · splash 420px de largura */
  size?: BrandLoaderSize
  /** Texto anunciado por leitor de tela. */
  label?: string
  /** Legenda visível abaixo da marca (ex.: "Sincronizando QLP"). */
  caption?: string
  /** Caminho base dos arquivos de motion, se servidos fora de /motion. */
  basePath?: string
}

const SIZE_CLASS: Record<BrandLoaderSize, string> = {
  sm: 'w-24',
  md: 'w-[180px]',
  lg: 'w-[280px]',
  splash: 'w-[420px]',
}

/**
 * BrandLoader — a marca FIPS extrudada em 3D que nasce branca, com contorno nas
 * cores da marca, e recebe a cor da esquerda para a direita conforme carrega.
 *
 * A animação é uma peça de motion da marca (WebM com canal alfa + APNG de
 * fallback), renderizada a partir da arte oficial. Não é SVG: a fidelidade
 * tipográfica do wordmark exige o arquivo original.
 *
 * Acessibilidade: `role="status"` com `aria-live="polite"`. Sob
 * `prefers-reduced-motion` exibe o quadro final estático, já colorido.
 */
export const BrandLoader = React.forwardRef<HTMLDivElement, BrandLoaderProps>(
  ({ size = 'md', label = 'Carregando', caption, basePath = '/motion', className, ...props }, ref) => {
    const [reduced, setReduced] = React.useState(false)

    React.useEffect(() => {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReduced(mq.matches)
      const onChange = (e: MediaQueryListEvent) => setReduced(e.matches)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    }, [])

    return (
      <div
        ref={ref}
        role="status"
        aria-live="polite"
        aria-label={label}
        className={cn('inline-flex flex-col items-center gap-3', className)}
        {...props}
      >
        {reduced ? (
          <img
            src={`${basePath}/fips-brandloader-static.png`}
            alt=""
            aria-hidden="true"
            className={cn(SIZE_CLASS[size], 'h-auto')}
          />
        ) : (
          <video
            className={cn(SIZE_CLASS[size], 'h-auto')}
            autoPlay
            loop
            muted
            playsInline
            aria-hidden="true"
            poster={`${basePath}/fips-brandloader-static.png`}
          >
            <source src={`${basePath}/fips-brandloader.webm`} type="video/webm" />
            {/* Safari não toca WebM com alfa: cai no APNG */}
            <img src={`${basePath}/fips-brandloader.apng`} alt="" />
          </video>
        )}

        {caption ? (
          <p className="font-heading text-xs uppercase tracking-[0.14em] text-[var(--color-fg-muted)]">
            {caption}
          </p>
        ) : null}
      </div>
    )
  },
)
BrandLoader.displayName = 'BrandLoader'
