import type { ReactNode } from 'react'
import { CircularCommandMenu, type CommandItem, type TomDaAcao } from './CircularCommandMenu'

export type RowMenuAction = {
  key: string
  label: string
  icon: ReactNode
  /** Atalho para `tom: 'perigo'`. Vale só quando `tom` não vem. */
  danger?: boolean
  /**
   * Cor da ação, igual no repouso, no realce e no clique: `primario` (ver, abrir), `pdf` (vermelho escuro),
   * `perigo` (excluir) ou `neutro` (padrão).
   */
  tom?: TomDaAcao
  disabled?: boolean
  onClick: () => void
}

/** Menu radial de ações por linha — padrão Multitags / Tecnopano. */
export function RowActionsMenu({
  rowId,
  actions,
  radius = 56,
  onOpenChange,
}: {
  rowId: string
  actions: RowMenuAction[]
  radius?: number
  /** Avisa quando o menu da linha abre e fecha (a `TabelaExpansivel` usa para destacar a linha). */
  onOpenChange?: (aberto: boolean) => void
}) {
  const items: CommandItem[] = actions.map((action) => ({
    id: `${rowId}-${action.key}`,
    icon: action.icon,
    label: action.label,
    danger: action.danger,
    tom: action.tom,
    disabled: action.disabled,
    onClick: () => {
      action.onClick()
    },
  }))

  if (items.length === 0) return null

  return (
    <CircularCommandMenu
      items={items}
      radius={radius}
      onOpenChange={onOpenChange}
      triggerClassName="fips-row-action inline-flex size-7 items-center justify-center rounded-md"
    />
  )
}
