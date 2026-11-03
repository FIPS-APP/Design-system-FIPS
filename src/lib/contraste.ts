/** Contraste WCAG 2.x (relação de luminância relativa). Sem DOM, testado em `scripts/rodada3.test.mjs`. */

export interface RGB {
  r: number
  g: number
  b: number
}

/** `#rgb` ou `#rrggbb`. Qualquer outra coisa (`var(--x)`, `rgb()`, nome) devolve `null`. */
export function lerHex(valor: string): RGB | null {
  const m = valor.trim().match(/^#([\da-f]{3}|[\da-f]{6})$/i)
  if (!m) return null
  const h = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1]
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}

export function luminancia({ r, g, b }: RGB): number {
  const lin = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

export function razaoDeContraste(a: RGB, b: RGB): number {
  const [claro, escuro] = [luminancia(a), luminancia(b)].sort((x, y) => y - x)
  return (claro + 0.05) / (escuro + 0.05)
}

const BRANCO: RGB = { r: 255, g: 255, b: 255 }
const AZUL_NOITE: RGB = { r: 0x0b, g: 0x1b, b: 0x33 }

/**
 * Cor do texto sobre um fundo `#hex`: branco se der 4,5:1 ou mais; senão o azul-noite (`#0b1b33`) se
 * ele contrasta mais que o branco. Fundo que não é hex (token, `rgb()`): `null`, e quem chama mantém o branco.
 */
export function corDoTextoSobre(fundo: string): '#ffffff' | '#0b1b33' | null {
  const rgb = lerHex(fundo)
  if (!rgb) return null
  if (razaoDeContraste(BRANCO, rgb) >= 4.5) return '#ffffff'
  return razaoDeContraste(AZUL_NOITE, rgb) > razaoDeContraste(BRANCO, rgb) ? '#0b1b33' : '#ffffff'
}
