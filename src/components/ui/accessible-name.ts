/**
 * Nome acessível obrigatório: controle sem texto visível precisa de `aria-label` ou de
 * `aria-labelledby` apontando para um texto da tela.
 */
export type AccessibleName =
  | { 'aria-label': string; 'aria-labelledby'?: string }
  | { 'aria-labelledby': string; 'aria-label'?: string }
