import { useRef, type KeyboardEvent } from 'react'
import { Check } from 'lucide-react'
import { cn } from '../../lib/cn'
import { segmentoMarcado, segmentoPonto, type TomAvaliacao } from './segmento-avaliacao-variants'

export type { TomAvaliacao }

export interface OpcaoAvaliacao<V extends string = string> {
  /** Identificador estável devolvido em `onChange`. */
  valor: V
  /** Texto curto do botão ("AT", "NAT", "Sim"). */
  rotulo: string
  /** Nome inteiro: vai no `title` e no nome acessível ("Atende parcialmente"). Sem ele vale o `rotulo`. */
  nome?: string
  /** `sucesso` verde, `atencao` amarelo, `aviso` laranja, `neutro` cinza, `critico` vermelho. */
  tom?: TomAvaliacao
}

export interface SegmentoAvaliacaoProps<V extends string = string> {
  /** 2 a 6 respostas, na ordem de leitura. */
  opcoes: OpcaoAvaliacao<V>[]
  /** Resposta marcada, ou `null`/`undefined` quando ainda não respondeu. */
  valor: V | null | undefined
  /** Recebe a resposta clicada; recebe `null` ao clicar na já marcada (limpar), salvo `permitirLimpar={false}`. */
  onChange: (valor: V | null) => void
  /** Nome do grupo para leitor de tela ("Avaliação do item 3.2"). O texto do item fica fora do controle. */
  rotulo: string
  desabilitado?: boolean
  /** Celular: os botões dividem a largura em colunas iguais em vez de caber no conteúdo. */
  grande?: boolean
  /** `false`: clicar na resposta marcada não faz nada. Padrão `true`. */
  permitirLimpar?: boolean
  className?: string
}

/**
 * Botões de resposta colados numa pílula (controle segmentado), alvo de 44 px. A resposta
 * marcada ganha o fundo, a borda e o texto do tom mais um "ok"; as outras ficam vazadas com
 * um ponto do tom. Cada botão é um `button` com `aria-pressed`; Tab entra em cada um, e as
 * setas, Home e End movem o foco sem marcar (marcar é Espaço ou Enter).
 *
 * Genérico: as respostas e os tons vêm de `opcoes`. Quem usa decide o significado
 * (AT/ATP/NAT/NA/Interdição, Sim/Não/NA, Conforme…).
 */
export function SegmentoAvaliacao<V extends string = string>({
  opcoes,
  valor,
  onChange,
  rotulo,
  desabilitado = false,
  grande = false,
  permitirLimpar = true,
  className,
}: SegmentoAvaliacaoProps<V>) {
  const grupo = useRef<HTMLDivElement>(null)

  function aoTeclar(e: KeyboardEvent<HTMLDivElement>) {
    const passo = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    const extremo = e.key === 'Home' ? 0 : e.key === 'End' ? -1 : null
    if (!passo && extremo === null) return
    const botoes = Array.from(grupo.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? [])
    if (!botoes.length) return
    e.preventDefault()
    const atual = botoes.findIndex((b) => b === document.activeElement)
    const destino =
      extremo !== null
        ? extremo < 0
          ? botoes.length - 1
          : 0
        : (Math.max(atual, 0) + passo + botoes.length) % botoes.length
    botoes[destino]?.focus()
  }

  return (
    <div
      ref={grupo}
      role="group"
      aria-label={rotulo}
      onKeyDown={aoTeclar}
      className={cn(
        'max-w-full gap-px rounded-lg border border-[var(--color-border-control)] bg-[var(--color-surface-muted)] p-px',
        grande ? 'grid' : 'inline-flex flex-nowrap',
        className,
      )}
      style={grande ? { gridTemplateColumns: `repeat(${opcoes.length}, minmax(0, 1fr))` } : undefined}
    >
      {opcoes.map((opcao) => {
        const marcado = valor === opcao.valor
        const tom = opcao.tom ?? 'neutro'
        const nome = opcao.nome ?? opcao.rotulo
        // O nome acessível começa pelo texto visível (WCAG 2.5.3, rótulo no nome).
        const nomeAcessivel = nome === opcao.rotulo ? nome : `${opcao.rotulo}, ${nome}`
        return (
          <button
            key={opcao.valor}
            type="button"
            data-avaliacao={opcao.valor}
            aria-pressed={marcado}
            aria-label={nomeAcessivel}
            title={nome}
            disabled={desabilitado}
            onClick={() => {
              if (marcado && !permitirLimpar) return
              onChange(marcado ? null : opcao.valor)
            }}
            className={cn(
              'inline-flex min-h-11 items-center justify-center gap-1 rounded-md px-1.5 text-[12px] leading-4 font-bold transition-colors',
              'focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--color-surface)] focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-60',
              grande ? 'min-w-0' : 'min-w-10 flex-1',
              marcado
                ? segmentoMarcado({ tom })
                : 'border-2 border-transparent bg-[var(--color-surface)] text-[color-mix(in_srgb,var(--color-fg-muted)_50%,var(--color-fg))] hover:bg-[var(--color-surface-muted)]',
            )}
          >
            {marcado ? (
              <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={3} aria-hidden />
            ) : (
              <span aria-hidden className={segmentoPonto({ tom })} />
            )}
            {opcao.rotulo}
          </button>
        )
      })}
    </div>
  )
}
