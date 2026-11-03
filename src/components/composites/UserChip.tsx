import { forwardRef, useState, type ButtonHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/cn'
import { iniciaisDoNome, primeiroEUltimo } from './app-shell-logica'

export interface UserChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Nome completo. O chip mostra primeiro e último nome; o `aria-label` leva o nome inteiro. */
  nome: string
  /** Foto. Se falhar ao carregar, entram as iniciais. */
  fotoUrl?: string | null
  /** Iniciais do disco sem foto. Padrão: primeira e última letra do nome. */
  iniciais?: string
  /** Cor do disco das iniciais (qualquer cor CSS, por exemplo `var(--color-primary)`). Padrão: azul FIPS. */
  corDoAvatar?: string
  /** Menu da conta aberto: gira a seta e liga `aria-expanded`. */
  aberto?: boolean
}

/**
 * Chip da conta no cabeçalho: pílula de 35px (foto ou iniciais, nome, seta) com hover âmbar. No celular
 * sobra só o avatar de 32px, sem fundo, e ele continua sendo o botão da conta. Vai de gatilho do
 * `UserAccountMenu`.
 */
export const UserChip = forwardRef<HTMLButtonElement, UserChipProps>(function UserChip(
  { nome, fotoUrl, iniciais, corDoAvatar = 'var(--color-primary)', aberto = false, className, type = 'button', ...resto },
  ref,
) {
  // Foto que falhou fica marcada pela URL: trocando de pessoa, a nova tenta de novo.
  const [fotoFalhou, setFotoFalhou] = useState<string | null>(null)
  const fotoOk = Boolean(fotoUrl) && fotoFalhou !== fotoUrl

  return (
    <button
      ref={ref}
      type={type}
      aria-label={`Conta: ${nome}`}
      aria-haspopup="menu"
      aria-expanded={aberto}
      data-tutorial="conta"
      className={cn('fips-user-chip', className)}
      {...resto}
    >
      <span className="fips-user-chip__brilho" aria-hidden />
      <span className="fips-user-chip__gloss" aria-hidden />
      {fotoOk ? (
        <img
          src={fotoUrl ?? undefined}
          alt=""
          className="relative z-[1] h-8 w-8 shrink-0 rounded-full object-cover sm:h-7 sm:w-7"
          onError={() => setFotoFalhou(fotoUrl ?? null)}
        />
      ) : (
        <span
          className="relative z-[1] flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white sm:h-7 sm:w-7 sm:text-[12px]"
          style={{ background: corDoAvatar }}
          aria-hidden
        >
          {iniciais ?? iniciaisDoNome(nome)}
        </span>
      )}
      <span className="fips-user-chip__nome relative z-[1] min-w-0 flex-1 text-left">
        <span className="block truncate font-sans text-[12px] leading-none font-semibold">{primeiroEUltimo(nome)}</span>
      </span>
      <ChevronDown
        className={cn('fips-user-chip__seta relative z-[1] h-3.5 w-3.5 shrink-0 transition-transform duration-200', aberto && 'rotate-180')}
        strokeWidth={1.5}
        aria-hidden
      />
    </button>
  )
})
