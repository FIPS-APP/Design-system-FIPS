import type { OpcaoAvaliacao } from '../../components/composites/SegmentoAvaliacao'

/** Respostas de exemplo das páginas de doc (o app define as suas). */
export const OPCOES_INSPECAO: OpcaoAvaliacao[] = [
  { valor: 'AT', rotulo: 'AT', nome: 'Atende', tom: 'sucesso' },
  { valor: 'ATP', rotulo: 'ATP', nome: 'Atende parcialmente', tom: 'atencao' },
  { valor: 'NAT', rotulo: 'NAT', nome: 'Não atende', tom: 'aviso' },
  { valor: 'NA', rotulo: 'NA', nome: 'Não se aplica', tom: 'neutro' },
  { valor: 'INT', rotulo: 'INT', nome: 'Interdição', tom: 'critico' },
]
