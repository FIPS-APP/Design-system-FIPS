import { useId, type ReactNode } from 'react'
import { cn } from '../../lib/cn'

export interface SecaoHomeProps {
  /** Número da seção. Número vira dois dígitos ("1" → "01"); texto vale como veio. Aparece em laranja, acima do título. */
  numero?: number | string
  /** Linha cinza em caixa alta acima do título, no lugar do número (ex.: "Ciclo de vida"). */
  sobretitulo?: string
  titulo: string
  /** Uma ou duas linhas de apoio sob o título. */
  subtitulo?: ReactNode
  /** À direita do cabeçalho: pílula de contagem (`Badge`), botão fantasma, link. */
  acao?: ReactNode
  /** `lg` (padrão): título de seção numerada. `md`: título menor, para seções sem número. */
  tamanho?: 'md' | 'lg'
  /** Nível do título: `2` (padrão) com o `h1` do hero acima; `3` dentro de outra seção. */
  nivelTitulo?: 2 | 3
  /** Âncora da seção (`id`). Sem ele, a seção não tem âncora. */
  id?: string
  className?: string
  children?: ReactNode
}

/**
 * Seção da Home padrão: cabeçalho com número ("01") ou sobretítulo, título, subtítulo e ação à direita,
 * e o corpo logo abaixo. O título é o heading da seção (`aria-labelledby`).
 */
export function SecaoHome({
  numero,
  sobretitulo,
  titulo,
  subtitulo,
  acao,
  tamanho = 'lg',
  nivelTitulo = 2,
  id,
  className,
  children,
}: SecaoHomeProps) {
  const tituloId = useId()
  const Titulo = nivelTitulo === 3 ? 'h3' : 'h2'
  const marca = typeof numero === 'number' ? String(numero).padStart(2, '0') : numero
  const textos = (
    <>
      {marca ? (
        <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-accent-text)]">
          {marca}
        </span>
      ) : sobretitulo ? (
        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-fg-muted-strong)]">
          {sobretitulo}
        </span>
      ) : null}
      <Titulo
        id={tituloId}
        className={cn(
          'font-heading font-semibold tracking-tight text-[var(--color-fg)]',
          tamanho === 'lg' ? 'text-2xl' : 'text-xl',
        )}
      >
        {titulo}
      </Titulo>
      {subtitulo ? <p className="text-sm text-[var(--color-fg-muted-strong)]">{subtitulo}</p> : null}
    </>
  )
  return (
    <section id={id} aria-labelledby={tituloId} className={cn('flex scroll-mt-20 flex-col gap-4', className)}>
      {/* Sem `acao` o cabeçalho é só a pilha de texto (8px entre as linhas); com `acao`, texto à esquerda e ação à direita (12px). */}
      {acao ? (
        <header className="flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-col gap-2">{textos}</div>
          <div className="shrink-0">{acao}</div>
        </header>
      ) : (
        <header className="flex min-w-0 flex-col gap-2">{textos}</header>
      )}
      {children}
    </section>
  )
}
