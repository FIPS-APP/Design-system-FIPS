/**
 * Moeda em reais como texto decimal ("1234.56"), sem float: o valor que o campo entrega e recebe.
 * Vírgula é sempre decimal. Ponto é decimal só quando é o único separador, aparece uma vez e tem 1 ou 2 dígitos depois
 * ("1234.56"); em qualquer outro caso é milhar ("1.234", "1.234.567,89").
 */

const MAX_INTEIROS = 12

/** Tira tudo que não é dígito, vírgula, ponto ou (se permitido) o sinal de menos no início. */
export function sanitizeCurrencyDraft(texto: string, allowNegative = false): string {
  const negativo = allowNegative && /^\s*-/.test(texto)
  const limpo = texto.replace(/[^\d,.]/g, '')
  return negativo ? `-${limpo}` : limpo
}

/** Texto digitado ou colado vira decimal normalizado ("1.234,56" e "1234.56" viram "1234.56"). Vazio vira "". */
export function parseCurrency(texto: string, allowNegative = false): string {
  const negativo = allowNegative && /^\s*-/.test(texto)
  const s = texto.replace(/[^\d,.]/g, '')
  if (!s) return ''

  const virgula = s.lastIndexOf(',')
  const pontos = (s.match(/\./g) ?? []).length
  const ultimoPonto = s.lastIndexOf('.')
  let inteiro = s
  let decimal = ''

  if (virgula >= 0) {
    inteiro = s.slice(0, virgula)
    decimal = s.slice(virgula + 1)
  } else if (pontos === 1 && s.length - ultimoPonto - 1 <= 2) {
    inteiro = s.slice(0, ultimoPonto)
    decimal = s.slice(ultimoPonto + 1)
  }

  inteiro = inteiro.replace(/\D/g, '').replace(/^0+(?=\d)/, '').slice(0, MAX_INTEIROS)
  decimal = decimal.replace(/\D/g, '').slice(0, 2)
  if (!inteiro && !decimal) return ''

  const corpo = `${inteiro || '0'}${decimal ? `.${decimal.padEnd(2, '0')}` : ''}`
  return negativo && /[1-9]/.test(corpo) ? `-${corpo}` : corpo
}

/** Decimal normalizado vira "1.234,56" (sem o R$). Vazio ou inválido vira "". */
export function formatCurrency(valor: string): string {
  const m = /^(-?)(\d+)(?:\.(\d{1,2}))?$/.exec(valor.trim())
  if (!m) return ''
  const milhar = m[2].replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  return `${m[1]}${milhar},${(m[3] ?? '').padEnd(2, '0')}`
}
