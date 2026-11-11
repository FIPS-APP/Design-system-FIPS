/** Id da aba `id` numa faixa com `idBase`. */
export const idDaAba = (idBase: string, id: string) => `${idBase}-aba-${id}`
/** Id do painel da aba `id` numa faixa com `idBase`. */
export const idPainelDeAba = (idBase: string, id: string) => `${idBase}-painel-${id}`
/** Atributos do painel que a aba controla: `<div {...propsDoPainel(idBase, ativa)}>`. */
export const propsDoPainel = (idBase: string, id: string) => ({
  role: 'tabpanel' as const,
  id: idPainelDeAba(idBase, id),
  'aria-labelledby': idDaAba(idBase, id),
  tabIndex: 0,
})

/** Índice da aba que a tecla leva, ou -1 se a tecla não move. Com a volta nas pontas. */
export function indiceDaTecla(tecla: string, atual: number, total: number): number {
  if (total <= 0) return -1
  if (tecla === 'ArrowRight' || tecla === 'ArrowDown') return (atual + 1) % total
  if (tecla === 'ArrowLeft' || tecla === 'ArrowUp') return (atual - 1 + total) % total
  if (tecla === 'Home') return 0
  if (tecla === 'End') return total - 1
  return -1
}
