import { cn } from '../../lib/cn'
import { MARCA_BRANCA_FIPS } from './marca-branca-data'

export interface FipsLogoProps {
  className?: string
  /**
   * `selo` (padrão): quadrado branco de 32px com a logo colorida (`/fips-logo.png`, do `public/` do app).
   * `branca`: a marca em branco, 42px de altura, sem fundo, embutida no pacote (nada para copiar). Para
   * a faixa colorida do `CabecalhoDocumento`; só tem contraste sobre fundo escuro ou saturado.
   */
  variante?: 'selo' | 'branca'
}

export function FipsLogo({ className, variante = 'selo' }: FipsLogoProps) {
  if (variante === 'branca') {
    return <img src={MARCA_BRANCA_FIPS} alt="FIPS" className={cn('block h-[42px] w-auto', className)} />
  }
  return (
    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white p-0.5', className)}>
      <img src="/fips-logo.png" alt="FIPS" className="h-full w-full object-contain" />
    </div>
  )
}
