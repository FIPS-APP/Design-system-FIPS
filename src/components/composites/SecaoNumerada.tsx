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
  /** Cor do cabeçalho (chip, título e ícone). Sem `tom` é o visual de sempre. `primario` pinta o título de azul; `sucesso` usa os tokens de sucesso no chip, no título e no ícone. */
  tom?: 'primario' | 'sucesso'
  /** Dá relevo 3D ao ícone (sombras em camadas no matiz do tom). Desligado por padrão. */
  iconeEmRelevo?: boolean
  children?: ReactNode
}

const CHIP_PRIMARIO =
  'bg-[linear-gradient(135deg,var(--color-primary),color-mix(in_srgb,var(--color-primary)_75%,var(--color-fips-blue-950)))]'

const TONS = {
  padrao: {
    chip: CHIP_PRIMARIO,
    titulo: 'text-[var(--color-fg)]',
    icone: 'text-[var(--color-primary-text)]',
    matiz: 'var(--color-primary-text)',
  },
  primario: {
    chip: CHIP_PRIMARIO,
    titulo: 'text-[var(--color-primary-text)]',
    icone: 'text-[var(--color-primary-text)]',
    matiz: 'var(--color-primary-text)',
  },
  sucesso: {
    chip: 'bg-[linear-gradient(135deg,color-mix(in_srgb,var(--color-success-fill)_88%,black),color-mix(in_srgb,var(--color-success-fill)_65%,black))]',
    titulo: 'text-[var(--color-success-text)]',
    icone: 'text-[var(--color-success-text)]',
    matiz: 'var(--color-success-text)',
  },
} as const

/** Sombras em camadas no matiz do tom: dá volume ao ícone. */
const relevo = (matiz: string) =>
  [
    `drop-shadow(0 -1px 0 color-mix(in srgb, ${matiz} 35%, white))`,
    `drop-shadow(0 1px 0 color-mix(in srgb, ${matiz} 70%, black))`,
    `drop-shadow(0 2px 0 color-mix(in srgb, ${matiz} 55%, black))`,
    `drop-shadow(0 4px 5px color-mix(in srgb, ${matiz} 40%, transparent))`,
  ].join(' ')

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
  tom,
  iconeEmRelevo = false,
  children,
}: SecaoNumeradaProps) {
  const t = TONS[tom ?? 'padrao'] ?? TONS.padrao
  const Titulo = nivelTitulo === 3 ? 'h3' : 'h2'
  const temCorpo = children !== undefined && children !== null && children !== false
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titulo`}
      data-tom={tom}
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
          className={cn('font-heading flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white', t.chip)}
        >
          {String(numero).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <Titulo
            id={`${id}-titulo`}
            className={cn('font-heading text-base font-semibold tracking-tight', t.titulo)}
          >
            <span className="sr-only">{numero}.</span> {titulo}
          </Titulo>
          {dica ? <p className="mt-0.5 text-xs leading-snug text-[var(--color-fg-muted)]">{dica}</p> : null}
        </div>
        {acao ? (
          <div className="ml-auto shrink-0">{acao}</div>
        ) : Icone ? (
          <Icone
            className={cn('ml-auto hidden h-5 w-5 shrink-0 @md:block', t.icone)}
            style={iconeEmRelevo ? { filter: relevo(t.matiz) } : undefined}
            data-relevo={iconeEmRelevo ? 'true' : undefined}
            aria-hidden
          />
        ) : null}
      </div>
      {temCorpo ? <div className={cn('p-4 @2xl:p-5', corpoClassName)}>{children}</div> : null}
    </section>
  )
}
