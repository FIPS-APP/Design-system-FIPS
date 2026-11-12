import * as React from 'react'
import { Badge, type BadgeProps } from './badge'
import { statusBadge } from './status-badge'

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'children'> {
  /** Status como o app guarda (`em_andamento`, `Fora do Prazo`, `CONCLUIDA`). */
  status: string | null | undefined
  /** Texto exibido. Sem ele, mostra o próprio status. */
  children?: React.ReactNode
}

function StatusBadge({ status, children, ...props }: StatusBadgeProps) {
  const { variant } = statusBadge(status)
  return (
    <Badge variant={variant} {...props}>
      {children ?? status}
    </Badge>
  )
}

export { StatusBadge }
