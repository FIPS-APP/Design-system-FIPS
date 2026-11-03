import { useState } from 'react'
import { Users } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { TabelaDeProps, BlocoDeCodigo, NotaDeDoc } from '../../components/DocApoio'
import { CartaoListagem } from '../../../components/composites/CartaoListagem'
import { AlternadorDeVisao } from '../../../components/composites/AlternadorDeVisao'
import { AvisoSomenteLeitura } from '../../../components/composites/AvisoSomenteLeitura'
import { TabelaClassificacao } from '../../../components/composites/TabelaClassificacao'
import { Badge } from '../../../components/ui/badge'

const CRITICIDADES = [
  { id: 'c', rotulo: 'Crítico', tom: 'critico' as const, prazo: 'Ação imediata', descricao: 'Risco grave e iminente de acidentes ou fatalidade.', detalhe: 'Conforme plano de ação.' },
  { id: 'm', rotulo: 'Moderado', tom: 'aviso' as const, prazo: 'Ação em 15 dias', descricao: 'Risco significativo, mas não imediatamente grave ou fatal.', detalhe: 'Conforme plano de ação.' },
  { id: 't', rotulo: 'Tolerável', tom: 'primario' as const, prazo: 'Ação em 45 dias', descricao: 'Risco baixo, com possibilidade mínima de acidente ou lesão.', detalhe: 'Conforme plano de ação.' },
]

export default function ListagemApoioDoc() {
  const [visao, setVisao] = useState<'tabela' | 'cartoes'>('tabela')
  return (
    <DocPage
      title="Listagem e classificação"
      description="Cartão de listagem com contagem e ações, alternador tabela/cartões, aviso de somente leitura e tabela de classificação por tom e prazo."
    >
      <DemoSection title="CartaoListagem + AlternadorDeVisao">
        <div className="space-y-4">
          <CartaoListagem
            icone={Users}
            titulo="Usuários"
            quantidade={visao === 'tabela' ? 38 : 38}
            filtrada={visao === 'cartoes'}
            chips={visao === 'cartoes' ? <Badge variant="info">Perfil: Auditor</Badge> : undefined}
            acoes={<AlternadorDeVisao valor={visao} onChange={setVisao} />}
            rodape={<div className="border-t border-[var(--color-border)] px-5 py-3 text-xs text-[var(--color-fg-muted)]">Rodapé: a paginação entra aqui.</div>}
          >
            <p className="px-5 py-6 text-sm text-[var(--color-fg)]">Visão ativa: {visao === 'tabela' ? 'tabela' : 'cartões'}. O corpo é livre.</p>
          </CartaoListagem>
          <NotaDeDoc>
            O cabeçalho quebra: o título tem 150px de largura mínima, então as ações descem para a própria linha no celular em vez de
            vazar. O alternador mostra só o ícone abaixo de <code>md</code> (o rótulo segue como nome acessível) e cresce até o alvo de
            toque do modo.
          </NotaDeDoc>
          <TabelaDeProps
            linhas={[
              ['icone / titulo', 'LucideIcon / string', 'Azulejo à esquerda e heading (nivelTitulo 2 ou 3).'],
              ['quantidade / sufixoDaContagem / filtrada', 'number / string / boolean', '"N registros no total"; filtrada troca por "filtrados" e mostra o selo.'],
              ['chips / acoes / rodape', 'ReactNode', 'Chips de filtro após o título, canto direito e rodapé.'],
              ['semMoldura / corpoClassName', 'boolean / string', 'Sem borda e sombra no modo cartões.'],
              ['AlternadorDeVisao: valor, onChange, opcoes?, rotulo?', 'V / fn / OpcaoDeVisao[] / string', 'Padrão tabela e cartões; aceita outras opções { valor, rotulo, icone }.'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="AvisoSomenteLeitura">
        <div className="space-y-4">
          <AvisoSomenteLeitura>O seu perfil consulta esta tela, mas não altera cadastros.</AvisoSomenteLeitura>
          <NotaDeDoc>
            Props: <code>children</code> (o motivo, numa frase), <code>titulo</code> (padrão "Somente leitura.") e <code>className</code>.
            Tem <code>role="status"</code>.
          </NotaDeDoc>
        </div>
      </DemoSection>

      <DemoSection title="TabelaClassificacao">
        <div className="space-y-4">
          <TabelaClassificacao
            titulo="Classificação de criticidade"
            cabecalhos={{ rotulo: 'Risco', prazo: 'Ver e agir', detalhe: 'Solução', descricao: 'Definição' }}
            linhas={CRITICIDADES}
          />
          <NotaDeDoc>
            Uma classe por linha: ponto e pílula no tom, fundo a 8% do tom, texto em <code>--color-fg</code>. No telefone cada linha vira
            um bloco, como na <code>TabelaReferencia</code>. A coluna de detalhe só existe se alguma linha tiver <code>detalhe</code>.
          </NotaDeDoc>
          <TabelaDeProps
            linhas={[
              ['linhas', 'LinhaClassificacao[]', '{ id, rotulo, descricao, tom, prazo, detalhe? }. `tom` é um tom de gráfico.'],
              ['titulo', 'string', 'Nome da tabela para leitor de tela.'],
              ['cabecalhos', '{ rotulo?, prazo?, detalhe?, descricao? }', 'Textos do cabeçalho (padrão Risco, Prazo, Detalhe, Definição).'],
            ]}
          />
          <BlocoDeCodigo>{`<TabelaClassificacao linhas={[{ id: 'c', rotulo: 'Crítico', tom: 'critico', prazo: 'Ação imediata', descricao: '…' }]} />`}</BlocoDeCodigo>
        </div>
      </DemoSection>
    </DocPage>
  )
}
