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
 */
export function acaoDoTeclado(tecla: string, indiceAtual: number, total: number): AcaoDoTecladoRadial {
  if (tecla === 'Escape' || tecla === 'Tab') return { tipo: 'fechar' }
  if (total <= 0) return { tipo: 'ignorar' }
  switch (tecla) {
    case 'ArrowRight':
    case 'ArrowDown':
      return { tipo: 'mover', indice: (indiceAtual + 1) % total }
    case 'ArrowLeft':
    case 'ArrowUp':
      return { tipo: 'mover', indice: (indiceAtual - 1 + total) % total }
    case 'Home':
      return { tipo: 'mover', indice: 0 }
    case 'End':
      return { tipo: 'mover', indice: total - 1 }
    case 'Enter':
    case ' ':
      return { tipo: 'ativar' }
    default:
      return { tipo: 'ignorar' }
  }
}

/** Texto para leitor de tela quando o realce muda e o foco fica no gatilho (menu dentro de modal). */
export function textoDoRealce(rotulo: string, indice: number, total: number): string {
  return `${rotulo}, ${indice + 1} de ${total}`
}
