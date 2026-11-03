import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'

export interface SecaoNumeradaProps {
  /** Único na página. Vira a âncora da seção e a base do `id` do título. */
  id: string
  /** Posição da seção no formulário. Aparece no chip com dois dígitos ("01") e, só para leitor de tela, antes do título. */
  numero: number
  titulo: string
  /** Uma linha de apoio sob o título. */
  dica?: string
  /** Ícone de enfeite no canto direito. Some em contêiner estreito. */
  icone?: LucideIcon
  /** Ação alinhada à direita do cabeçalho (por exemplo "Editar dados"). Aparece no lugar do ícone. */
  acao?: ReactNode
  /** Nível do título: `2` quando o `h1` da página é o único acima; `3` dentro de outra seção. */
  nivelTitulo?: 2 | 3
  /** Classes do cartão (margem, posição na grade). */
  className?: string
  /** Classes do corpo (espaço entre os blocos da seção). */
  corpoClassName?: string
  children?: ReactNode
}

/**
 * Cartão numerado de seção de formulário: chip com o número ("01", "02"…), título, dica e um
 * ícone no canto. O título é o heading da seção (o número é lido só como "1." por leitor de
 * tela, o chip é `aria-hidden`); o ícone é enfeite.
 *
 * Não é uma extensão de `FormSectionCard` + `FormSectionHeader`: aquele par é o cabeçalho
 * compacto do formulário de registro (chip com o ícone, rótulo em caixa alta, sem heading,
 * espaço interno fixado em `style`). Este é o cabeçalho de formulário longo: chip com o
 * número, heading de verdade, divisor entre o cabeçalho e o corpo. Os dois partilham o canto
 * assimétrico do cartão FIPS (`12px 12px 12px 24px`).
 *
 * O cartão é um contêiner (`@container`): o respiro e o ícone respondem à largura do cartão,
 * não à da janela. Sem corpo, o divisor some.
 */
export function SecaoNumerada({
  id,
  numero,
  titulo,
  dica,
  icone: Icone,
  acao,
  nivelTitulo = 2,
  className,
  corpoClassName,
  children,
}: SecaoNumeradaProps) {
  const Titulo = nivelTitulo === 3 ? 'h3' : 'h2'
  const temCorpo = children !== undefined && children !== null && children !== false
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      className={cn(
        '@container scroll-mt-20 rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div
        className={cn(
          'flex items-center gap-3 px-5 py-4 @2xl:px-6',
          temCorpo && 'border-b border-[var(--color-border)]',
        )}
      >
        <span
          aria-hidden
          className="font-heading flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(135deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_75%,var(--color-fips-blue-950)))] text-sm font-bold text-white"
        >
          {String(numero).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <Titulo
            id={`${id}-titulo`}
            className="font-heading text-base font-semibold tracking-tight text-[var(--color-fg)]"
          >
            <span className="sr-only">{numero}.</span> {titulo}
          </Titulo>
          {dica ? <p className="mt-0.5 text-xs leading-snug text-[var(--color-fg-muted)]">{dica}</p> : null}
        </div>
        {acao ? (
          <div className="ml-auto shrink-0">{acao}</div>
        ) : Icone ? (
          <Icone className="ml-auto hidden h-5 w-5 shrink-0 text-[var(--color-primary-text)] @md:block" aria-hidden />
        ) : null}
      </div>
      {temCorpo ? <div className={cn('p-4 @2xl:p-5', corpoClassName)}>{children}</div> : null}
    </section>
  )
}
