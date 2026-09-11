/**
 * Fonte única de usuários do padrão "Minha Conta" (chip do header + UserMenuModal).
 * Inclui o usuário ativo por padrão e os perfis de demonstração usados no seletor
 * "Trocar de perfil (demo)".
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

export const FIPS_ROLE_BADGE_VARIANT: Record<FipsUserRole, 'secondary' | 'default' | 'success' | 'warning'> = {
  colaborador: 'secondary',
  gestor: 'default',
  diretoria: 'success',
  administrador: 'warning',
}

/** Papéis na ordem de exibição do seletor "Perfil (Modo Dev)". */
export const FIPS_ROLES: FipsUserRole[] = ['colaborador', 'gestor', 'diretoria', 'administrador']

export const DEFAULT_FIPS_USER_ID = 'fipinho-santista'

export const FIPS_USERS: FipsUser[] = [
  {
    id: 'fipinho-santista',
    name: 'Fipinho Santista',
    fullName: 'Fipinho Baixada Santista',
    cargo: 'Aprendiz',
    role: 'colaborador',
    email: 'fipinho.santista@fips.app.br',
    area: 'Serviços · Tecnologia da Informação',
    avatarUrl: '/avatars/fipinho.png',
  },
  {
    id: 'amanda-sinhorini',
    name: 'Amanda Sinhorini',
    fullName: 'Amanda Sinhorini',
    cargo: 'Coordenadora',
    role: 'gestor',
    email: 'amanda.sinhorini@fips.app.br',
    area: 'Operações Pátio · Pátio Sul',
  },
  {
    id: 'rarafel-hipolito',
    name: 'Rarafel Hipólito',
    fullName: 'Rarafel Hipólito',
    cargo: 'Diretor',
    role: 'diretoria',
    email: 'rarafel.hipolito@fips.app.br',
    area: 'Diretoria · Operações',
  },
  {
    id: 'diogo-brito',
    name: 'Diogo Brito',
    fullName: 'Diogo Brito',
    cargo: 'Analista',
    role: 'administrador',
    email: 'diogo.brito@fips.app.br',
    area: 'Tecnologia · Governança BI',
  },
]

export function fipsUserById(id: string): FipsUser {
  return FIPS_USERS.find((u) => u.id === id) ?? FIPS_USERS[0]
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
