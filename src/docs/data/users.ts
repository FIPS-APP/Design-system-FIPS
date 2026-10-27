/**
 * Fonte única de usuários do padrão "Minha Conta" (chip do header + UserMenuModal).
 * Inclui o usuário ativo por padrão e os perfis de demonstração usados no seletor
 * "Trocar de perfil (demo)".
 */

export {
  FIPS_ROLE_COLOR,
  FIPS_ROLE_LABEL,
  fipsUserInitials,
  type FipsUser,
  type FipsUserRole,
} from '../../lib/fipsUser'
import type { FipsUser, FipsUserRole } from '../../lib/fipsUser'

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
