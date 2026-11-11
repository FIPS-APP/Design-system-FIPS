import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '../../lib/cn'
import { Badge } from '../ui/badge'

export interface CartaoListagemProps {
  /** Ícone no azulejo à esquerda do cabeçalho. */
  icone: LucideIcon
  titulo: string
  /** Quantidade de registros, escrita no subtítulo. */
  quantidade: number
  /** Sufixo do subtítulo quando não há filtro. Padrão "no total". */
  sufixoDaContagem?: string
  /** Listagem filtrada: o subtítulo diz "filtrados" e o selo "Filtrado" aparece. */
  filtrada?: boolean
  /** Chips de filtro ativo, logo depois do título. */
  chips?: ReactNode
  /** Canto direito do cabeçalho: alternador de visão, "Configurar", botão de criar. */
  acoes?: ReactNode
  /** Rodapé do cartão (paginação). */
  rodape?: ReactNode
  /** Classes do corpo. */
  corpoClassName?: string
  /** Sem a moldura de cartão: no modo cartões os itens já são cartões e o painel em volta é redundante. */
  semMoldura?: boolean
  /** Nível do título. Padrão 3. */
  nivelTitulo?: 2 | 3
  children: ReactNode
  className?: string
}

/**
 * Cartão de listagem: ícone em azulejo, título, "N registros" e, à direita, as ações; corpo (tabela ou
 * cartões) e rodapé de paginação. Raio assimétrico `12/12/12/24`. O cabeçalho quebra: abaixo de 150px de
 * título as ações descem para a própria linha em vez de vazar a 375px.
 */
export function CartaoListagem({
  icone: Icone,
  titulo,
  quantidade,
  sufixoDaContagem = 'no total',
  filtrada = false,
  chips,
  acoes,
  rodape,
  corpoClassName,
  semMoldura = false,
  nivelTitulo = 3,
  children,
  className,
}: CartaoListagemProps) {
  const Titulo = `h${nivelTitulo}` as 'h2' | 'h3'
  return (
    <div
      className={cn(
        !semMoldura && 'rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-3.5 border-b border-[var(--color-border)] px-5 pb-3.5 pt-[18px]">
        <div
          aria-hidden
          className="flex size-12 shrink-0 items-center justify-center rounded-[14px] border border-[color-mix(in_srgb,var(--color-primary-text)_8%,transparent)] bg-[color-mix(in_srgb,var(--color-primary-text)_4%,transparent)] text-[var(--color-primary-text)]"
        >
          <Icone className="size-[22px]" />
        </div>
        <div className="min-w-[150px] flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <Titulo className="font-heading text-base font-bold leading-tight tracking-tight text-[var(--color-fg)]">{titulo}</Titulo>
            {chips ? (
              <>
                <span aria-hidden className="text-sm text-[var(--color-fg-muted)]">·</span>
                {chips}
              </>
            ) : null}
          </div>
          <p className="mt-0.5 text-[11px] leading-snug text-[var(--color-fg-muted)]">
            {quantidade} {quantidade === 1 ? 'registro' : 'registros'} {filtrada ? 'filtrados' : sufixoDaContagem}
          </p>
        </div>
        <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-2">
          {filtrada ? <Badge variant="info">Filtrado</Badge> : null}
          {acoes}
        </div>
      </div>
      <div className={corpoClassName}>{children}</div>
      {rodape}
    </div>
  )
}
