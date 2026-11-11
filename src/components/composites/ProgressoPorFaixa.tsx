import type { CSSProperties } from 'react'
import { cn } from '../../lib/cn'
import { Progress } from '../ui/progress'
import { faixaDeProgresso, porcentagem, type FaixaProgresso, type TomGrafico } from './grafico-logica'

/** Tom de cada faixa: concluído verde, quase lá azul-céu, na metade âmbar, começando laranja, mal começou vermelho. */
const TOM_DA_FAIXA: Record<Exclude<FaixaProgresso, 'vazio'>, TomGrafico> = {
  concluido: 'sucesso',
  alto: 'secundario',
  medio: 'atencao',
  baixo: 'aviso',
  minimo: 'critico',
}

export interface ProgressoPorFaixaProps {
  valor: number
  /** Valor que fecha a barra. Padrão 100. */
  maximo?: number
  /** Nome acessível da barra ("Preenchimento da seção Cotas"). A barra do DS não emite nome sozinha. */
  rotulo: string
  className?: string
}

/**
 * `Progress` do DS com a cor decidida pela faixa de porcentagem: 100% verde, 90% a 99% azul-céu,
 * 60% a 89% âmbar, 30% a 59% laranja, 1% a 29% vermelho, 0% só o trilho. A cor entra por variável
 * (`--progresso-cor`), sempre um tom de gráfico (3:1 ou mais sobre o trilho); quem lê o número precisa
 * de texto ao lado, a barra não carrega o valor sozinha.
 */
export function ProgressoPorFaixa({ valor, maximo = 100, rotulo, className }: ProgressoPorFaixaProps) {
  const pct = porcentagem(valor, maximo)
  const faixa = faixaDeProgresso(pct)
  const cor = faixa === 'vazio' ? 'transparent' : `var(--grafico-${TOM_DA_FAIXA[faixa]})`
  return (
    <Progress
      value={valor}
      max={maximo}
      aria-label={rotulo}
      data-faixa-progresso={faixa}
      className={cn('h-2 [&>div]:bg-[var(--progresso-cor)] [&>div]:bg-none', className)}
      style={{ '--progresso-cor': cor } as CSSProperties}
    />
  )
}
