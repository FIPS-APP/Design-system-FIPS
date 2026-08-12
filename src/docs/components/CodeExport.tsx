import type { ReactNode } from 'react'

/* ──────────────────────────────────────────────────────────────
   Função "Ver código" (CodeExportSection) DESATIVADA a pedido.
   Mantemos esta casca inerte para preservar a compatibilidade de
   tipos dos consumidores (a prop `items` segue tipada) sem renderizar
   a seção de exportação de código no fim das páginas.
   ────────────────────────────────────────────────────────────── */

export interface CodeExportItem {
  label: string
  description: string
  code: string
  preview?: ReactNode
}

/** "Ver código" removido — a seção não renderiza mais nada.
 *  `items` é recebido apenas para compat de tipos dos consumidores. */
export function CodeExportSection({ items }: { items: CodeExportItem[] }) {
  void items
  return null
}

