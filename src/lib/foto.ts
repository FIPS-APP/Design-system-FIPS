/**
 * Regras da foto do colaborador — vindas do `fips-qlp`, que é onde o
 * `PessoaAvatar` nasceu. Ficam separadas porque client e server precisam
 * decidir igual sobre o que é foto de verdade.
 */

/**
 * A "foto" é o avatar de INICIAIS gerado pelo Bubble?
 *
 * O Bubble grava, pra quem não enviou foto, uma imagem 64×64 com as iniciais
 * desenhadas, cuja URL termina em `/api` (115 dos 572 registros hoje). Não é
 * foto de ninguém: exibir isso colocava as iniciais do Bubble ao lado das
 * nossas, com desenhos diferentes; e empurrar de volta só reescreve lixo.
 * Foto de verdade tem nome de arquivo (`…/image.jpg`, `…/295771.jpg`).
 */
export function isFotoPlaceholder(url?: string | null): boolean {
  return /\/api$/.test((url || '').trim())
}

/** Só é foto pra valer se existe e não é o placeholder do Bubble. */
export function isFotoReal(url?: string | null): boolean {
  const v = (url || '').trim()
  return v !== '' && !isFotoPlaceholder(v)
}

/**
 * URL de foto do Bubble pra usar num <img>. Faz duas coisas:
 *
 * 1. A URL vem protocol-relative ("//cdn…") e não carrega sem esquema.
 * 2. Devolve '' quando não é foto de verdade (vazia ou o avatar de iniciais
 *    gerado pelo Bubble). Assim o fallback do Avatar assume e as iniciais
 *    ficam iguais em todo lugar.
 */
export function photoUrl(url?: string | null): string {
  if (!isFotoReal(url)) return ''
  const v = (url as string).trim()
  return v.startsWith('//') ? `https:${v}` : v
}

/** Iniciais de um nome, para o fallback do avatar. '?' quando não há nome. */
export function getInitials(name?: string | null): string {
  const parts = (name || '').trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
