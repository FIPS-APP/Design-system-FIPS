import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Card, CardContent } from '../ui/card'
import { tomBordaEsquerda, tomIcone, type NivelTituloHome, type TomHome } from './home-padrao-variants'

export interface NotasOperacionaisProps {
  icone: LucideIcon
  titulo: string
  /** Um item por linha, em lista com marcador. */
  itens: ReactNode[]
  /** Cor da borda esquerda e do ícone. Padrão: `warning`. */
  tom?: TomHome
  nivelTitulo?: NivelTituloHome
  className?: string
}

/** Cartão de notas: borda esquerda grossa, ícone, título e lista de itens. Para "Notas operacionais" e avisos longos. */
export function NotasOperacionais({
  icone: Icone,
  titulo,
  itens,
  tom = 'warning',
  nivelTitulo = 3,
  className,
}: NotasOperacionaisProps) {
  const Titulo = nivelTitulo === 2 ? 'h2' : nivelTitulo === 4 ? 'h4' : 'h3'
  return (
    <Card className={cn(tomBordaEsquerda({ tom }), className)}>
      <CardContent>
        <div className="flex items-start gap-3">
          <span aria-hidden className={tomIcone({ tom, tamanho: 'sm' })}>
            <Icone className="h-4 w-4" />
          </span>
          <div className="flex min-w-0 flex-col gap-1">
            <Titulo className="font-heading text-sm font-semibold tracking-tight text-[var(--color-fg)]">
              {titulo}
            </Titulo>
            <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-[var(--color-fg-muted)]">
              {itens.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
