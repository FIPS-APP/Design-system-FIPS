/** Estado do salvamento de um formulário com rascunho. */
export type EstadoSalvamentoValor = 'limpo' | 'sujo' | 'salvando' | 'erro'

/** "14:32" no fuso do aparelho, sempre com dois dígitos na hora. */
export function horaMinuto(data: Date): string {
  return data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Texto da barra de ações para cada estado.
 * `limpo` com hora de gravação vira "Salvo às hh:mm"; sem hora, "Nada alterado ainda.".
 */
export function textoEstadoSalvamento(
  estado: EstadoSalvamentoValor,
  salvoEm?: Date | null,
  erro?: string | null,
): string {
  if (estado === 'salvando') return 'Salvando…'
  if (estado === 'sujo') return 'Alterações ainda não salvas.'
  if (estado === 'erro') return erro || 'Não foi possível salvar.'
  return salvoEm ? `Salvo às ${horaMinuto(salvoEm)}` : 'Nada alterado ainda.'
}
