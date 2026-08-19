import * as React from 'react'
import { Info } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip'

export type FieldDensity = 'default' | 'compact' | 'dense'
export type FieldInset = 'none' | 'control' | 'icon'

type FieldContextValue = {
  density: FieldDensity
  inset: FieldInset
}

const FieldContext = React.createContext<FieldContextValue>({
  density: 'default',
  inset: 'control',
})

const fieldGapClasses: Record<FieldDensity, string> = {
  default: 'gap-1.5',
  compact: 'gap-1',
  dense: 'gap-1',
}

const fieldTextOffsetClasses: Record<FieldDensity, Record<FieldInset, string>> = {
  default: {
    none: '',
    control: 'ml-4',
    icon: 'ml-11',
  },
  compact: {
    none: '',
    control: 'ml-3',
    icon: 'ml-9',
  },
  dense: {
    none: '',
    control: 'ml-3',
    icon: 'ml-9',
  },
}

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  density?: FieldDensity
  inset?: FieldInset
}

const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  ({ className, density = 'default', inset = 'control', ...props }, ref) => (
    <FieldContext.Provider value={{ density, inset }}>
      <div ref={ref} className={cn('flex min-w-0 flex-col', fieldGapClasses[density], className)} {...props} />
    </FieldContext.Provider>
  ),
)
Field.displayName = 'Field'

export interface FieldLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
  /**
   * Ajuda curta em balão, num ícone ⓘ ao lado do texto — não a linha de
   * legenda de `FieldHint` (que continua existindo para texto mais longo,
   * sempre visível). O ícone precisa ficar na MESMA linha do rótulo, e por
   * isso vive aqui, não em `FieldHint`: `FieldHint` é hoje um `<p>` irmão,
   * tipicamente posicionado DEPOIS do campo — subir isso até a linha do
   * rótulo exigiria posicionamento absoluto. Onde o rótulo já está, o ícone
   * cai no lugar certo de graça.
   */
  hint?: React.ReactNode
  /**
   * Escape hatch raro: className extra no balão do `hint` (`TooltipContent`).
   * O balão sai com `z-50`, suficiente para o `Dialog` Radix do próprio DS —
   * mas uma tela que empilhe um modal FORA do Radix, com `z-index` inline
   * maior (ex.: o Modal hand-rolled de `DialogDoc.tsx`, `zIndex:1000`), tampa
   * o balão. Nesse caso, passe algo como `hintClassName="z-[1100]"`.
   */
  hintClassName?: string
}

const FieldLabel = React.forwardRef<HTMLLabelElement, FieldLabelProps>(
  ({ className, children, required = false, hint, hintClassName, ...props }, ref) => {
    const { density, inset } = React.useContext(FieldContext)

    return (
      <label
        ref={ref}
        className={cn(
          // `flex` no lugar de `block`: o rótulo continua ocupando a linha
          // inteira (block-level para os vizinhos em `Field`), mas por dentro
          // alinha texto + asterisco + ícone numa linha só.
          'flex items-center font-semibold',
          density !== 'default'
            ? 'text-xs leading-4 text-[var(--color-fg)]'
            : 'text-[0.95rem] leading-5 uppercase tracking-[0.02em] text-[var(--color-fg-muted)]',
          fieldTextOffsetClasses[density][inset],
          className,
        )}
        {...props}
      >
        {children}
        {required ? (
          <>
            <span aria-hidden className="ml-1 text-[var(--color-danger)]">*</span>
            <span className="sr-only">obrigatório</span>
          </>
        ) : null}
        {hint ? (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  // Dentro de <label>, qualquer clique foca o controle associado —
                  // sem isto, tocar no ⓘ no celular abria o teclado do campo
                  // junto com o balão.
                  onClick={(e) => e.preventDefault()}
                  aria-label="Mais informações"
                  className="ml-1 inline-flex shrink-0 text-[var(--color-fg-muted)] transition-colors hover:text-[var(--color-primary)]"
                >
                  <Info className="h-3 w-3" aria-hidden />
                </button>
              </TooltipTrigger>
              <TooltipContent className={cn('max-w-xs', hintClassName)}>{hint}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}
      </label>
    )
  },
)
FieldLabel.displayName = 'FieldLabel'

export type FieldHintProps = React.HTMLAttributes<HTMLParagraphElement>

const FieldHint = React.forwardRef<HTMLParagraphElement, FieldHintProps>(({ className, ...props }, ref) => {
  const { density, inset } = React.useContext(FieldContext)

  return (
    <p
      ref={ref}
      className={cn(
        'text-xs leading-4.5 text-[var(--color-fg-muted)]',
        fieldTextOffsetClasses[density][inset],
        className,
      )}
      {...props}
    />
  )
})
FieldHint.displayName = 'FieldHint'

export interface FieldMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: 'default' | 'danger' | 'success'
}

const fieldMessageToneClasses: Record<NonNullable<FieldMessageProps['tone']>, string> = {
  default: 'text-[var(--color-fg-muted)]',
  danger: 'text-[var(--color-danger)]',
  success: 'text-[var(--color-success-strong)]',
}

const FieldMessage = React.forwardRef<HTMLParagraphElement, FieldMessageProps>(
  ({ className, tone = 'danger', ...props }, ref) => {
    const { density, inset } = React.useContext(FieldContext)

    return (
      <p
        ref={ref}
        className={cn(
          'text-xs font-medium leading-4.5',
          fieldTextOffsetClasses[density][inset],
          fieldMessageToneClasses[tone],
          className,
        )}
        {...props}
      />
    )
  },
)
FieldMessage.displayName = 'FieldMessage'

export { Field, FieldHint, FieldLabel, FieldMessage }
