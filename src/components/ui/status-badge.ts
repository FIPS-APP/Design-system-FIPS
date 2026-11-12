import type { BadgeVariantProps } from './badge-variants'

/** Grupos oficiais de status. Cada grupo tem uma variante do Badge e só uma. */
export type StatusBadgeGrupo =
  | 'pendente'
  | 'andamento'
  | 'concluido'
  | 'atrasado'
  | 'cancelado'
  | 'rascunho'
  | 'critico'

type Variante = NonNullable<BadgeVariantProps['variant']>

export const STATUS_BADGE_GRUPOS: Record<StatusBadgeGrupo, { variant: Variante; label: string }> = {
  pendente: { variant: 'warning', label: 'Pendente' },
  andamento: { variant: 'info', label: 'Em andamento' },
  concluido: { variant: 'success', label: 'Concluído' },
  atrasado: { variant: 'danger', label: 'Atrasado' },
  cancelado: { variant: 'outline', label: 'Cancelado' },
  rascunho: { variant: 'secondary', label: 'Rascunho' },
  critico: { variant: 'danger', label: 'Crítico' },
}

/**
 * Sinônimos que os apps usam hoje, já normalizados (minúsculo, sem acento, `_` no lugar de
 * espaço e pontuação). A chave é o texto do status; o valor é o grupo.
 */
export const STATUS_BADGE_SINONIMOS: Record<string, StatusBadgeGrupo> = {
  // pendente
  pendente: 'pendente',
  aberto: 'pendente',
  solicitacao: 'pendente',
  aguardando: 'pendente',
  aguardando_complemento: 'pendente',
  aguardando_correcoes: 'pendente',
  aguardando_rc: 'pendente',
  aguardando_aprovacao: 'pendente',
  aguardando_aprovacao_area: 'pendente',
  aguardando_aprovacao_superior: 'pendente',
  aguardando_aprovacao_gerencial: 'pendente',
  aguardando_aprovacao_suprimentos: 'pendente',
  aprovacao_gerencial: 'pendente',
  // em andamento
  em_andamento: 'andamento',
  andamento: 'andamento',
  no_prazo: 'andamento',
  pre_cadastro: 'andamento',
  triagem: 'andamento',
  em_triagem: 'andamento',
  avaliacao_priorizacao: 'andamento',
  avaliacao_comite: 'andamento',
  prd: 'andamento',
  desenvolvimento: 'andamento',
  em_elaboracao: 'andamento',
  em_revisao: 'andamento',
  em_teste: 'andamento',
  teste_piloto: 'andamento',
  em_votacao: 'andamento',
  em_deploy: 'andamento',
  deploy: 'andamento',
  enviado: 'andamento',
  informativo: 'andamento',
  // concluído
  concluido: 'concluido',
  concluida: 'concluido',
  finalizado: 'concluido',
  finalizada: 'concluido',
  sincronizada: 'concluido',
  resolvido: 'concluido',
  aprovado: 'concluido',
  ativo: 'concluido',
  completo: 'concluido',
  sucesso: 'concluido',
  eficaz: 'concluido',
  abaixo: 'concluido',
  entregue_no_prazo: 'concluido',
  entregue_fora_do_prazo: 'concluido',
  // atrasado e vencido
  atrasado: 'atrasado',
  atrasada: 'atrasado',
  vencido: 'atrasado',
  vencida: 'atrasado',
  fora_do_prazo: 'atrasado',
  acima: 'atrasado',
  // cancelado
  cancelado: 'cancelado',
  cancelada: 'cancelado',
  improcedente: 'cancelado',
  inativo: 'cancelado',
  pausado: 'cancelado',
  // rascunho
  rascunho: 'rascunho',
  backlog_tecnico: 'rascunho',
  neutro: 'rascunho',
  // crítico
  critico: 'critico',
  critica: 'critico',
  erro: 'critico',
  com_erro: 'critico',
  falha: 'critico',
  recusado: 'critico',
  rejeitado: 'critico',
  reprovado: 'critico',
}

/** Minúsculo, sem acento, e tudo que não é letra ou número vira `_`. */
export function normalizarStatus(status: string): string {
  return status
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
}

export interface StatusBadgeInfo {
  grupo: StatusBadgeGrupo | undefined
  variant: Variante
  /** Rótulo padrão do grupo. Os apps costumam mostrar o próprio texto. */
  label: string | undefined
}

/** Resolve um status de app para o grupo e a variante do Badge. Status desconhecido vira `secondary`. */
export function statusBadge(status: string | null | undefined): StatusBadgeInfo {
  const grupo = status ? STATUS_BADGE_SINONIMOS[normalizarStatus(status)] : undefined
  if (!grupo) return { grupo: undefined, variant: 'secondary', label: undefined }
  return { grupo, ...STATUS_BADGE_GRUPOS[grupo] }
}
