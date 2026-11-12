/**
 * Tipo de usuário e as funções puras que o `BuscarUsuarioModal` usa. Ficam fora de
 * `src/docs/` para o componente não depender de dado do site.
 */

export type FipsUserRole = 'colaborador' | 'gestor' | 'diretoria' | 'administrador'

export type FipsUser = {
  id: string
  /** Nome curto exibido no chip do header e na lista de troca de perfil. */
  name: string
  /** Nome completo exibido no título do modal. */
  fullName: string
  cargo: string
  role: FipsUserRole
  email: string
  /** Área/subprocesso já formatado "{processo} · {subprocesso}" — badge de área do menu. */
  area?: string
  avatarUrl?: string
}

export const FIPS_ROLE_LABEL: Record<FipsUserRole, string> = {
  colaborador: 'Colaborador',
  gestor: 'Gestor',
  diretoria: 'Diretoria',
  administrador: 'Administrador',
}

export const FIPS_ROLE_COLOR: Record<FipsUserRole, string> = {
  colaborador: 'var(--color-fg-muted)',
  gestor: 'var(--color-primary)',
  diretoria: 'var(--color-success-strong)',
  administrador: 'var(--color-accent-strong)',
}

export function fipsUserInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}
