import type { ReactNode } from 'react'
import { CircularCommandMenu, type CommandItem } from './CircularCommandMenu'

export type RowMenuAction = {
  key: string
  label: string
  icon: ReactNode
  danger?: boolean
  disabled?: boolean
  onClick: () => void
}

/** Menu radial de ações por linha — padrão Multitags / Tecnopano. */
export function RowActionsMenu({
  rowId,
  actions,
  radius = 56,
  ariaLabel,
}: {
  rowId: string
  actions: RowMenuAction[]
  radius?: number
  /** Sobrescreve o `aria-label` do gatilho. Default do menu: "Ações da linha". */
  ariaLabel?: string
}) {
  const items: CommandItem[] = actions.map((action) => ({
    id: `${rowId}-${action.key}`,
    icon: action.icon,
    label: action.label,
    danger: action.danger,
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
      ariaLabel={ariaLabel}
      triggerClassName="fips-row-action inline-flex size-7 items-center justify-center rounded-md"
    />
  )
}
