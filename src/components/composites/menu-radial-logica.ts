/**
 * Teclado do menu radial (`CircularCommandMenu`): para onde vai o realce a cada tecla.
 * Lógica pura, sem DOM, testada em `scripts/rodada3.test.mjs`.
 */

export type AcaoDoTecladoRadial =
  | { tipo: 'mover'; indice: number }
  | { tipo: 'ativar' }
  | { tipo: 'fechar' }
  | { tipo: 'ignorar' }

/**
 * Setas giram (com volta), Home e End vão às pontas, Enter e Espaço ativam, Esc e Tab fecham (o foco volta ao gatilho;
 * no Tab o evento segue e o foco avança a partir do gatilho). Sem itens, só Esc e Tab agem.
 * Sem realce (`indiceAtual` < 0, menu aberto pelo mouse): seta para a frente vai ao primeiro, para trás ao último, e
 * Enter e Espaço não ativam nada.
 */
export function acaoDoTeclado(tecla: string, indiceAtual: number, total: number): AcaoDoTecladoRadial {
  if (tecla === 'Escape' || tecla === 'Tab') return { tipo: 'fechar' }
  if (total <= 0) return { tipo: 'ignorar' }
  const semRealce = indiceAtual < 0
  switch (tecla) {
    case 'ArrowRight':
    case 'ArrowDown':
      return { tipo: 'mover', indice: semRealce ? 0 : (indiceAtual + 1) % total }
    case 'ArrowLeft':
    case 'ArrowUp':
      return { tipo: 'mover', indice: semRealce ? total - 1 : (indiceAtual - 1 + total) % total }
    case 'Home':
      return { tipo: 'mover', indice: 0 }
    case 'End':
      return { tipo: 'mover', indice: total - 1 }
    case 'Enter':
    case ' ':
      return semRealce ? { tipo: 'ignorar' } : { tipo: 'ativar' }
    default:
      return { tipo: 'ignorar' }
  }
}

/** Texto para leitor de tela quando o realce muda e o foco fica no gatilho (menu dentro de modal). */
export function textoDoRealce(rotulo: string, indice: number, total: number): string {
  return `${rotulo}, ${indice + 1} de ${total}`
}

/**
 * Cor de cada ação do menu, igual no repouso, no realce (mouse ou teclado) e no clique:
 * - `neutro`: texto padrão (`--color-fg`);
 * - `primario`: azul (`--color-primary-text`), para ver e abrir;
 * - `pdf`: vermelho escuro (`--color-danger-text`), o mesmo do botão de PDF da barra;
 * - `perigo`: vermelho de excluir (`--color-btn-danger-hover` no claro, `--color-red-400` no escuro).
 */
export type TomDaAcao = 'neutro' | 'primario' | 'pdf' | 'perigo'

/** Tom final da ação: o `tom` declarado; sem ele, `danger` vira `perigo` (compatível com quem já usa) e o resto, `neutro`. */
export function tomDaAcao(item: { tom?: TomDaAcao; danger?: boolean }): TomDaAcao {
  return item.tom ?? (item.danger ? 'perigo' : 'neutro')
}

/** Realce ao abrir: pelo teclado começa no primeiro item; pelo mouse ou toque, sem realce (todas iguais). */
export function realceAoAbrir(porTeclado: boolean): number {
  return porTeclado ? 0 : -1
}
