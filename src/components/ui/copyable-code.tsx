import * as React from 'react'
import { Check, Copy, MessageCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Button } from './button'

/**
 * Copia texto para a área de transferência. Tenta `navigator.clipboard` e, se ele não existir
 * (página sem HTTPS) ou recusar, cai no `execCommand('copy')` com um textarea fora da tela.
 * Devolve `true` quando copiou e `false` quando nenhuma das duas vias funcionou.
 */
export async function copiarTexto(texto: string): Promise<boolean> {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(texto)
      return true
    }
  } catch {
    /* cai para o plano B */
  }
  if (typeof document === 'undefined') return false
  const area = document.createElement('textarea')
  area.value = texto
  area.setAttribute('readonly', '')
  area.setAttribute('aria-hidden', 'true')
  area.style.cssText = 'position:fixed;top:0;left:-9999px;opacity:0'
  document.body.appendChild(area)
  try {
    area.select()
    return document.execCommand('copy')
  } catch {
    return false
  } finally {
    document.body.removeChild(area)
  }
}

/**
 * Link `https://wa.me/<número>` para um telefone. Só dígitos entram. Número brasileiro de 10 ou 11
 * dígitos (DDD + telefone) ganha o 55; com 12 ou mais dígitos assume-se que o código do país já veio.
 * Devolve `null` quando não há dígitos suficientes para um telefone.
 */
export function linkWhatsApp(numero: string): string | null {
  const digitos = numero.replace(/\D/g, '')
  if (digitos.length < 10) return null
  const completo = digitos.length <= 11 ? `55${digitos}` : digitos
  return `https://wa.me/${completo}`
}

export type CopyableCodeProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Texto que vai para a área de transferência (e que aparece, se `children` não vier). */
  value: string
  /** Conteúdo exibido no lugar de `value` (ex.: número formatado). A cópia continua sendo `value`. */
  children?: React.ReactNode
  /** Rótulo do botão no estado normal. Também é o nome acessível. */
  copyLabel?: string
  /** Rótulo do botão depois de copiar, e texto anunciado ao leitor de tela. */
  copiedLabel?: string
  /** Texto anunciado quando a cópia falha. */
  errorLabel?: string
  /** Tempo, em ms, até o botão voltar ao rótulo normal. */
  resetMs?: number
  /** Trata `value` como telefone e mostra o link para conversar no WhatsApp. */
  whatsapp?: boolean
  /** Rótulo do link do WhatsApp. */
  whatsappLabel?: string
  /** Chamado depois de uma cópia bem-sucedida. */
  onCopied?: (value: string) => void
}

type Estado = 'parado' | 'copiado' | 'erro'

/**
 * Texto ou código com botão de copiar. O botão tem rótulo visível ("Copiar"), o retorno ("Copiado")
 * é anunciado por uma região `role="status"` e, sem área de transferência, cai para `execCommand`.
 * Com `whatsapp`, o valor é tratado como telefone e ganha um link `wa.me`.
 */
const CopyableCode = React.forwardRef<HTMLDivElement, CopyableCodeProps>(
  (
    {
      value,
      children,
      copyLabel = 'Copiar',
      copiedLabel = 'Copiado',
      errorLabel = 'Não foi possível copiar. Selecione o texto e copie à mão.',
      resetMs = 2000,
      whatsapp = false,
      whatsappLabel = 'Abrir no WhatsApp',
      onCopied,
      className,
      ...props
    },
    ref,
  ) => {
    const [estado, setEstado] = React.useState<Estado>('parado')
    const timer = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const codigo = React.useRef<HTMLElement>(null)
    React.useEffect(() => () => clearTimeout(timer.current), [])

    const copiar = async () => {
      clearTimeout(timer.current)
      const ok = await copiarTexto(value)
      if (ok) {
        setEstado('copiado')
        onCopied?.(value)
      } else {
        setEstado('erro')
        const el = codigo.current
        if (el) {
          const faixa = document.createRange()
          faixa.selectNodeContents(el)
          const sel = window.getSelection()
          sel?.removeAllRanges()
          sel?.addRange(faixa)
        }
      }
      timer.current = setTimeout(() => setEstado('parado'), ok ? resetMs : Math.max(resetMs, 4000))
    }

    const wa = whatsapp ? linkWhatsApp(value) : null
    const copiado = estado === 'copiado'

    return (
      <div
        ref={ref}
        data-slot="copyable-code"
        className={cn(
          'inline-flex max-w-full items-center gap-2 rounded-md border border-[var(--color-border-control)] bg-[var(--color-surface-soft)] py-1 pl-3 pr-1 text-[var(--color-fg)]',
          className,
        )}
        {...props}
      >
        <code ref={codigo} className="min-w-0 break-all font-mono text-[13px] [overflow-wrap:anywhere]">
          {children ?? value}
        </code>
        <Button type="button" variant="secondary" size="xs" onClick={copiar} className="shrink-0">
          {copiado ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copiado ? copiedLabel : copyLabel}
        </Button>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-6 shrink-0 items-center gap-1 rounded-md px-2 text-[11px] font-semibold text-[var(--color-primary-text)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary-text)]"
          >
            <MessageCircle aria-hidden="true" className="size-3" />
            {whatsappLabel}
          </a>
        )}
        <span role="status" aria-live="polite" className="sr-only">
          {estado === 'copiado' ? copiedLabel : estado === 'erro' ? errorLabel : ''}
        </span>
      </div>
    )
  },
)

CopyableCode.displayName = 'CopyableCode'

export { CopyableCode }
