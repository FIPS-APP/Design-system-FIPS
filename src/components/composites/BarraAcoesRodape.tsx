import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import { textoEstadoSalvamento, type EstadoSalvamentoValor } from './estado-salvamento'

export type { EstadoSalvamentoValor }

export interface EstadoSalvamentoProps {
  estado: EstadoSalvamentoValor
  /** Quando o último salvamento terminou. Com `estado="limpo"` vira "Salvo às hh:mm". */
  salvoEm?: Date | null
  /** Mensagem do erro. Sem ela: "Não foi possível salvar.". */
  erro?: string | null
}

/**
 * Texto de estado do salvamento ("Salvo às 14:32", "Salvando…", erro). Região `status`
 * educada: o leitor de tela anuncia a mudança sem interromper. Feito para ficar dentro da
 * `BarraAcoesRodape` (a cor acompanha a faixa azul no claro e a superfície no escuro: 5,8:1 no claro).
 */
export function EstadoSalvamento({ estado, salvoEm, erro }: EstadoSalvamentoProps) {
  return (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        'text-xs leading-relaxed',
        estado === 'erro'
          ? 'font-semibold text-[var(--color-fips-red-300)]'
          : 'text-white/60 dark:text-[var(--color-fg-muted)]',
      )}
    >
      {textoEstadoSalvamento(estado, salvoEm, erro)}
    </p>
  )
}

export type BarraAcoesRodapeVariante = 'rodape' | 'cartao' | 'montagem'

export interface BarraAcoesRodapeProps {
  /**
   * `rodape` (padrão desde a 0.21.0): faixa de largura inteira colada no pé da área de conteúdo, reta, com
   * linha no topo e sombra para cima, como o rodapé do formulário da Manutenção. Estado à esquerda e ações à
   * direita, na mesma linha, quebrando quando falta espaço. Use botões `size="sm"` (30px).
   * `montagem`: o rodapé do montador de checklist da Manutenção: faixa em degradê azul (os dois tokens
   * `--color-gov-gradient-*` e um fecho mais escuro que o segundo, cinza no escuro), título + descrição à esquerda
   * (`titulo` e `descricao`), ações à direita. Botões `size="sm"`: `inverseOutline` no secundário e
   * `success` (verde) no principal.
   * `cartao`: a barra de antes, um cartão arredondado e flutuante com os botões `lg` (42px); no celular
   * o estado vai em cima e as ações ocupam a linha.
   */
  variante?: BarraAcoesRodapeVariante
  /** Nome da região para leitor de tela. */
  label?: string
  /** À esquerda no desktop, em cima no celular: normalmente um `EstadoSalvamento`. */
  estado?: ReactNode
  /** Só na variante `montagem`: título da faixa (14px, negrito, fonte de título). Aceita um ícone no começo. */
  titulo?: ReactNode
  /** Só na variante `montagem`: linha de apoio sob o título (12px, branco a 60%). */
  descricao?: ReactNode
  /** Ao lado do estado (por exemplo um botão "3 pendências para finalizar"). */
  aviso?: ReactNode
  /** As ações. Botões do DS: `inverseOutline` nas secundárias e `ouro` na principal. */
  children?: ReactNode
  /**
   * Classes do contêiner (margem, largura). A distância da borda inferior vem de
   * `--barra-acoes-base` (padrão 0): quem tem barra de navegação fixa embaixo publica a altura
   * dela ali, por exemplo `--barra-acoes-base: calc(var(--barra-inferior-altura) + 8px)`.
   */
  className?: string
}

/**
 * Barra de ações presa ao rodapé do formulário (`position: sticky`, fica no fluxo e gruda
 * quando o fim da página ainda não chegou). Faixa azul-escura no tema claro, superfície com
 * borda no escuro. Dentro dela os botões `inverseOutline` (secundários) e `ouro` (principal)
 * têm contraste nos dois temas. Duas variantes: `rodape` (padrão, faixa reta de largura inteira,
 * botões `sm`) e `cartao` (cartão flutuante, botões `lg`; a partir de 48rem de contêiner o
 * estado e as ações ficam lado a lado).
 *
 * Mantenha uma ação principal só: `ouro`. Na variante `cartao` as ações dividem a linha no
 * celular e quebram para a linha de baixo se não couberem; para caber numa linha esconda o
 * texto longo com `@max-3xl:sr-only`.
 */
export function BarraAcoesRodape({
  variante = 'rodape',
  label = 'Ações do formulário',
  estado,
  aviso,
  titulo,
  descricao,
  children,
  className,
}: BarraAcoesRodapeProps) {
  if (variante === 'montagem') {
    return (
      <div
        role="region"
        aria-label={label}
        className={cn(
          '@container sticky bottom-[var(--barra-acoes-base,0px)] z-30 mt-auto shrink-0 overflow-hidden border-t border-white/10 py-3 text-white shadow-[0_-8px_28px_color-mix(in_srgb,var(--color-fips-blue-950)_22%,transparent)]',
          className,
        )}
        style={{
          background:
            'linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, color-mix(in srgb, var(--color-gov-gradient-to) 71%, black) 100%)',
        }}
      >
        <div className="box-border flex w-full min-w-0 flex-col gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <div className="min-w-0">
            {titulo ? <p className="font-heading flex items-center gap-1.5 text-sm font-semibold">{titulo}</p> : null}
            {descricao ? <p className="text-xs leading-relaxed text-white/60">{descricao}</p> : null}
            {estado || aviso ? (
              <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
                {estado}
                {aviso}
              </div>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center justify-end gap-3">{children}</div>
        </div>
      </div>
    )
  }
  if (variante === 'rodape') {
    return (
      <div
        role="region"
        aria-label={label}
        className={cn(
          '@container sticky bottom-[var(--barra-acoes-base,0px)] z-10 mt-auto border-t border-[var(--color-border)] bg-[var(--color-primary-hover)] py-3 shadow-[0_-8px_24px_color-mix(in_srgb,var(--color-fips-blue-950)_18%,transparent)] dark:bg-[var(--color-surface)] dark:shadow-[0_-8px_24px_color-mix(in_srgb,black_42%,transparent)]',
          className,
        )}
      >
        <div className="box-border flex w-full min-w-0 flex-wrap items-center justify-end gap-3 px-4 sm:px-6 lg:px-8">
          {estado || aviso ? (
            <div className="mr-auto flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              {estado}
              {aviso}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    )
  }
  return (
    <div
      role="region"
      aria-label={label}
      className={cn(
        '@container sticky bottom-[var(--barra-acoes-base,0px)] z-10 rounded-xl border border-transparent bg-[var(--color-primary-hover)] shadow-[0_-8px_24px_color-mix(in_srgb,var(--color-fips-blue-950)_30%,transparent)] dark:border-[var(--color-border-strong)] dark:bg-[var(--color-surface)]',
        className,
      )}
    >
      <div className="flex gap-2 px-3 py-2.5 @max-3xl:flex-col @3xl:items-center @3xl:justify-between @3xl:gap-4 @3xl:px-4 @3xl:py-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {estado}
            {aviso}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 @max-3xl:[&>*]:flex-1">{children}</div>
      </div>
    </div>
  )
}
