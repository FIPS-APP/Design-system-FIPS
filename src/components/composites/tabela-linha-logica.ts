/**
 * Linha clicável da `TabelaExpansivel` (`aoClicarLinha`): quando o clique ou a tecla vale para a linha e
 * quando pertence a um controle de dentro dela (botão, link, menu). Lógica pura, testada em
 * `scripts/rodada3.test.mjs`.
 */

/** Controles que têm ação própria: o clique neles nunca abre a linha. */
export const SELETOR_DE_CONTROLE =
  'button, a[href], input, select, textarea, label, summary, [role="button"], [role="menu"], [role="menuitem"], [role="checkbox"], [role="switch"], [role="link"], [data-linha-ignorar]'

export interface AlvoDoEvento {
  closest: (seletor: string) => unknown
}

export interface ContemNo {
  contains: (no: any) => boolean // eslint-disable-line @typescript-eslint/no-explicit-any
}

/**
 * O clique abre a linha? Não, se vem de fora dela no DOM (o evento do React sobe por portais, como o
 * do menu radial) ou de um controle dentro dela.
 */
export function cliqueAbreALinha(alvo: AlvoDoEvento | null | undefined, linha: ContemNo & object): boolean {
  if (!alvo) return false
  if (!linha.contains(alvo)) return false
  const controle = alvo.closest(SELETOR_DE_CONTROLE)
  if (controle && controle !== linha && linha.contains(controle)) return false
  return true
}

/** Enter e Espaço abrem a linha só quando o foco está na própria linha (não num controle dentro dela). */
export function teclaAbreALinha(tecla: string, alvo: unknown, linha: unknown): boolean {
  return (tecla === 'Enter' || tecla === ' ') && alvo === linha
}

/**
 * Setas com uma linha em destaque (menu fechado): ↓ desce, ↑ sobe, sem dar a volta. Devolve o índice da
 * nova linha, ou `null` quando a tecla não move o destaque (outra tecla, nenhuma linha em destaque, tabela vazia).
 */
export function linhaVizinha(tecla: string, atual: number, total: number): number | null {
  if (atual < 0 || total <= 0) return null
  if (tecla === 'ArrowDown') return Math.min(atual + 1, total - 1)
  if (tecla === 'ArrowUp') return Math.max(atual - 1, 0)
  return null
}

/** Onde fica o holofote: deslocamento vertical (dentro da borda da moldura) e altura da linha em destaque. */
export function posicaoDoHolofote(
  linha: { top: number; height: number },
  moldura: { top: number },
  bordaTopo = 0,
): { y: number; altura: number } {
  return { y: Math.round(linha.top - moldura.top - bordaTopo), altura: Math.round(linha.height) }
}
