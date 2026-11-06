import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Card, CardContent } from '../ui/card'
import { tagTitulo, tomIcone, type NivelTituloHome } from './home-padrao-variants'

export interface PassoGrade {
  /** Único na grade. */
  id: string
  icone: LucideIcon
  titulo: string
  texto: ReactNode
  /** Linha pequena no pé do cartão (ex.: "Sem smartphone? Formulário físico"). */
  dica?: ReactNode
  /** Número do passo ("01"). Sem ele, a posição com dois dígitos. */
  numero?: string
}

export interface PassosGradeProps {
  passos: PassoGrade[]
  /** Palavra antes do número ("PASSO 01"). Padrão: "Passo". */
  rotulo?: string
  /** Envolve a grade num cartão (como na Home). Padrão: sim. `false` entrega só a grade. */
  moldura?: boolean
  /** Nome da lista para leitor de tela. */
  label?: string
  nivelTitulo?: NivelTituloHome
  className?: string
}

/** Grade de passos numerados ("PASSO 01" a "PASSO 06"): ícone, título, texto e dica. Duas colunas a partir de 768px, três a partir de 1280px. */
export function PassosGrade({
  passos,
  rotulo = 'Passo',
  moldura = true,
  label,
  nivelTitulo = 3,
  className,
}: PassosGradeProps) {
  const Titulo = tagTitulo(nivelTitulo)
  const lista = (
    <ol
      aria-label={label}
      className={cn('grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3', !moldura && className)}
    >
      {passos.map((p, i) => {
        const Icone = p.icone
        return (
          <li
            key={p.id}
            className="flex flex-col gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4"
          >
            <div className="flex items-center gap-3">
              <span aria-hidden className={tomIcone({})}>
                <Icone className="h-5 w-5" />
              </span>
              <div className="flex min-w-0 flex-col">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
                  {rotulo} {p.numero ?? String(i + 1).padStart(2, '0')}
                </span>
                <Titulo className="font-heading text-base font-semibold tracking-tight text-[var(--color-fg)]">
                  {p.titulo}
                </Titulo>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-[var(--color-fg)]">{p.texto}</p>
            {/* O cinza de apoio mede 4,29:1 sobre o fundo suave do passo no claro: a dica leva o texto cheio. */}
            {p.dica ? <p className="mt-auto text-xs text-[var(--color-fg)]">{p.dica}</p> : null}
          </li>
        )
      })}
    </ol>
  )
  if (!moldura) return lista
  return (
    <Card className={className}>
      <CardContent>{lista}</CardContent>
    </Card>
  )
}
