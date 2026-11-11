import { useState } from 'react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { TabelaDeProps, BlocoDeCodigo, NotaDeDoc } from '../../components/DocApoio'
import { CartaoGrafico } from '../../../components/composites/CartaoGrafico'
import { GraficoBarras, type SelecaoDeBarra } from '../../../components/composites/GraficoBarras'
import { GraficoRosca } from '../../../components/composites/GraficoRosca'
import { GraficoLinha } from '../../../components/composites/GraficoLinha'
import { GraficoFunil } from '../../../components/composites/GraficoFunil'
import { MapaDeCalor } from '../../../components/composites/MapaDeCalor'
import { ProgressoPorFaixa } from '../../../components/composites/ProgressoPorFaixa'
import { TONS_GRAFICO, type TomGrafico } from '../../../components/composites/grafico-logica'

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez']
const POR_MES = [14, 22, 19, 31, 27, 35, 29, 41, 38, 44, 36, 12]
const SEGURANCA = [8, 12, 10, 18, 15, 20, 16, 24, 21, 26, 19, 7]
const AMBIENTE = POR_MES.map((v, i) => v - SEGURANCA[i])
const RANKING = [
  { rotulo: 'Pátio Norte', valor: 46, tom: 'primario' as const },
  { rotulo: 'Oficina de Via', valor: 38, tom: 'primario' as const },
  { rotulo: 'Terminal Sul', valor: 27, tom: 'primario' as const },
  { rotulo: 'Subestação com nome bem comprido que não cabe', valor: 11, tom: 'primario' as const },
  { rotulo: 'Almoxarifado', valor: 0, tom: 'primario' as const },
]
const CONCEITOS = [
  { rotulo: 'AT', valor: 412, tom: 'sucesso' as const },
  { rotulo: 'ATP', valor: 96, tom: 'atencao' as const },
  { rotulo: 'NAT', valor: 31, tom: 'aviso' as const },
  { rotulo: 'INT', valor: 3, tom: 'critico' as const },
  { rotulo: 'NA', valor: 58, tom: 'neutro' as const },
]
const LOCAIS = ['Pátio Norte', 'Oficina de Via', 'Terminal Sul', 'Subestação']
const MATRIZ: (number | null)[][] = [
  [0, 2, 5, 9, 4, 1],
  [1, 0, 3, 2, 7, 12],
  [4, 4, 0, null, 1, 0],
  [0, 0, 1, 1, 0, 3],
]

function DemoBarras() {
  const [sel, setSel] = useState<string | null>(null)
  const [barra, setBarra] = useState<SelecaoDeBarra | null>(null)
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CartaoGrafico titulo="Inspeções por local" info="Total de inspeções finalizadas no período, por local." lateral="122 inspeções">
        <GraficoBarras
          rotulo="Inspeções por local"
          dados={RANKING}
          selecionado={sel}
          onSelecionar={(r) => setSel((s) => (s === r ? null : r))}
        />
      </CartaoGrafico>
      <CartaoGrafico titulo="Inspeções por mês" info="Segurança e meio ambiente somadas na mesma coluna." lateral="2025">
        <GraficoBarras
          orientacao="vertical"
          modo="empilhado"
          rotulo="Inspeções por mês, segurança e meio ambiente"
          dados={MESES.map((m, i) => ({ rotulo: m, valores: [SEGURANCA[i], AMBIENTE[i]] }))}
          series={[
            { nome: 'Segurança', tom: 'primario' },
            { nome: 'Meio ambiente', tom: 'sucesso' },
          ]}
        />
      </CartaoGrafico>
      <CartaoGrafico
        titulo="Abertas e encerradas"
        className="lg:col-span-2"
        info="Duas séries lado a lado, cada barra com o seu valor. Clique numa barra: o retorno traz a categoria e a série."
        lateral={barra ? `${barra.categoria} · ${barra.serie}: ${barra.valor}` : 'clique numa barra'}
      >
        <GraficoBarras
          rotulo="Interdições abertas e encerradas por trimestre"
          selecionado={barra?.categoria ?? null}
          serieSelecionada={barra?.serie ?? null}
          onSelecionarBarra={setBarra}
          orientacao="vertical"
          alturaColunas={150}
          dados={[
            { rotulo: '1º tri', valores: [5, 4] },
            { rotulo: '2º tri', valores: [9, 6] },
            { rotulo: '3º tri', valores: [3, 8] },
            { rotulo: '4º tri', valores: [6, 6] },
          ]}
          series={[
            { nome: 'Abertas', tom: 'critico' },
            { nome: 'Encerradas', tom: 'sucesso' },
          ]}
        />
      </CartaoGrafico>
    </div>
  )
}

function DemoRosca() {
  const [sel, setSel] = useState<string | null>(null)
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CartaoGrafico titulo="Conceito das respostas" info="Distribuição das respostas por conceito. Clique para destacar.">
        <GraficoRosca rotulo="Respostas por conceito" dados={CONCEITOS} selecionado={sel} onSelecionar={(r) => setSel((s) => (s === r ? null : r))} />
      </CartaoGrafico>
      <CartaoGrafico titulo="Sem dados" vazio />
    </div>
  )
}

function DemoLinha() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <CartaoGrafico titulo="Nota média por mês" info="Média das notas das inspeções finalizadas no mês." lateral="meta 85">
        <GraficoLinha
          rotulo="Nota média por mês"
          categorias={MESES}
          series={[
            { nome: 'Nota média', valores: [72, 75, 74, 79, 81, 80, 84, 83, 86, 88, 87, null], area: true, tom: 'primario' },
            { nome: 'Meta', valores: MESES.map(() => 85), tracejada: true, tom: 'neutro' },
          ]}
        />
      </CartaoGrafico>
      <CartaoGrafico titulo="Registradas e resolvidas" info="Ações corretivas por mês.">
        <GraficoLinha
          rotulo="Ações registradas e resolvidas por semana"
          categorias={['S1', 'S2', 'S3', 'S4', 'S5', 'S6']}
          rotulosDeValor="todos"
          series={[
            { nome: 'Registradas', valores: [6, 9, 7, 12, 10, 8], tom: 'aviso' },
            { nome: 'Resolvidas', valores: [3, 5, 6, 8, 9, 9], tom: 'sucesso' },
          ]}
        />
      </CartaoGrafico>
    </div>
  )
}

export default function GraficosDoc() {
  return (
    <DocPage
      title="Gráficos"
      description="Cartão de gráfico, barras, rosca, linha, funil e mapa de calor para dashboards, mais a barra de progresso por faixa. Tudo em HTML e SVG com tokens, sem biblioteca de gráfico: o bundle do app não carrega nada a mais."
    >
      <DemoSection title="Princípios">
        <NotaDeDoc>
          O valor é sempre escrito (rótulo, legenda ou célula): a cor distingue, nunca informa sozinha. As marcas usam os tons{' '}
          <code>--grafico-*</code>, com 3:1 ou mais sobre o cartão nos dois temas, e todo texto usa <code>--color-fg</code> ou{' '}
          <code>--color-fg-muted</code>. Com <code>onSelecionar</code> as categorias viram botões e as outras esmaecem, para o
          gráfico filtrar a tela. Cada gráfico leva um <code>rotulo</code> que vira o texto alternativo. Os gráficos se
          organizam pela largura do cartão (<code>@container</code>), não pela da janela.
        </NotaDeDoc>
        <div className="mt-4 flex flex-wrap gap-3">
          {TONS_GRAFICO.map((t: TomGrafico) => (
            <span key={t} className="inline-flex items-center gap-1.5 text-xs text-[var(--color-fg)]">
              <span aria-hidden className="size-3.5 rounded-[4px]" style={{ background: `var(--grafico-${t})` }} />
              <code>{t}</code>
            </span>
          ))}
        </div>
      </DemoSection>

      <DemoSection title="CartaoGrafico">
        <div className="space-y-4">
          <CartaoGrafico titulo="Inspeções por local" info="Experimente o botão de baixar imagem." lateral="122 inspeções" permiteBaixarImagem>
            <GraficoBarras rotulo="Inspeções por local" dados={RANKING.slice(0, 3)} />
          </CartaoGrafico>
          <NotaDeDoc>
            Moldura do gráfico: título (heading), explicação sob demanda no ícone de informação, canto direito e estado vazio. Raio
            assimétrico <code>10/10/10/18</code>.
          </NotaDeDoc>
          <TabelaDeProps
            linhas={[
              ['titulo', 'string', 'Heading do cartão.'],
              ['info', 'string?', 'Frase que explica o que o gráfico mede; abre em balão no foco ou no ponteiro.'],
              ['lateral', 'ReactNode?', 'Canto direito: total, legenda curta, ação.'],
              ['nivelTitulo', '2 | 3 | 4', 'Padrão 3.'],
              ['vazio / mensagemVazio / alturaVazio', 'boolean / ReactNode / number', 'Troca o gráfico por uma mensagem, mantendo a altura mínima.'],
              ['permiteBaixarImagem / nomeArquivoImagem', 'boolean / string', 'Botão "Baixar imagem" no cabeçalho: salva o cartão (sem o botão) como PNG, desenhado pelo navegador a partir do HTML e do SVG da tela, sem dependência. Nome padrão: o título sem acento, com hífens.'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="GraficoBarras">
        <div className="space-y-4">
          <DemoBarras />
          <NotaDeDoc>
            Com várias séries lado a lado (<code>agrupado</code>) cada barra leva o seu valor escrito, em cima (vertical) ou ao lado
            (horizontal); a soma "5 / 4" numa linha só não existe mais. No modo empilhado o número é a soma da coluna.
          </NotaDeDoc>
          <TabelaDeProps
            linhas={[
              ['dados', 'DadoBarra[]', '{ rotulo, valor? | valores?, tom?, cor? }. Valor positivo nunca some (piso de 1,5%).'],
              ['series', 'SerieBarra[]?', '{ nome, tom?, cor? }. Com várias séries, `valores` tem um número por série e a legenda aparece.'],
              ['modo', "'agrupado' | 'empilhado'", 'Padrão agrupado.'],
              ['orientacao', "'horizontal' | 'vertical'", 'Ranking ou série no tempo. Padrão horizontal.'],
              ['rotulo', 'string', 'Texto alternativo do gráfico.'],
              ['mostrarValores / formatarValor', 'boolean / (n) => string', 'Número ao lado de cada barra (padrão ligado).'],
              ['selecionado / onSelecionar', 'string | null / (rotulo) => void', 'Cada categoria vira botão `aria-pressed`; as outras esmaecem.'],
              ['onSelecionarBarra / serieSelecionada', '({ categoria, serie?, indiceSerie, valor }) => void / string | null', 'Drill-down por série: cada barra vira botão (alvo de 24px). Com ele a categoria deixa de ser um botão só; `onSelecionar`, se vier, é chamado junto com a categoria.'],
              ['maximo', 'number?', 'Escala fixa: valor que enche a barra (100 para uma nota de 0 a 100). Sem ele, o maior valor do gráfico.'],
              ['alturaColunas / larguraRotulo', 'number / string', 'Dimensões da vertical (192) e da coluna de nomes da horizontal (8rem).'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="GraficoRosca">
        <div className="space-y-4">
          <DemoRosca />
          <NotaDeDoc>
            A legenda é o rótulo: nome, valor e participação. Abaixo de 1% a participação ganha uma casa (0,4%) e abaixo de 0,1% sai
            "&lt;0,1%". Toda fatia ocupa ao menos 5 graus (<code>minimoGraus</code>) e há 2px de superfície entre elas. O furo leva o total.
          </NotaDeDoc>
          <TabelaDeProps
            linhas={[
              ['dados', 'FatiaRosca[]', '{ rotulo, valor, tom?, cor? }. Valor zero não ganha fatia, mas continua na legenda.'],
              ['rotulo', 'string', 'Texto alternativo; o resumo com os números sai dele.'],
              ['totalNoFuro / legendaDoFuro', 'number | string / string', 'Número no furo (padrão: soma) e a palavra sob ele (padrão "Total").'],
              ['selecionado / onSelecionar', 'string | null / (rotulo) => void', 'Legenda e fatias clicáveis.'],
              ['minimoGraus / tamanho / formatarValor', 'number / number / fn', 'Menor fatia (5), diâmetro do anel (168px) e formatação do número.'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="GraficoLinha">
        <div className="space-y-4">
          <DemoLinha />
          <NotaDeDoc>
            Sem curva suave (um valor por período). Só as pontas levam o número por padrão; <code>rotulosDeValor="todos"</code> escreve
            todos. Os rótulos do eixo rareiam quando não cabem (o último sempre aparece), e <code>null</code> interrompe a linha. O desenho acompanha a largura do
            contêiner.
          </NotaDeDoc>
          <TabelaDeProps
            linhas={[
              ['categorias', 'string[]', 'Rótulos do eixo horizontal.'],
              ['series', 'SerieLinha[]', '{ nome, valores: (number | null)[], tom?, cor?, tracejada?, area? }.'],
              ['rotulo', 'string', 'Texto alternativo; resume cada série (início, fim, pico).'],
              ['altura / rotulosDeValor / formatarValor', 'number / pontas | todos | nenhum / fn', 'Padrões 220, pontas e pt-BR.'],
              ['onSelecionarPonto / pontoSelecionado', '({ categoria, serie, indiceSerie, indice, valor }) => void / { serie, categoria } | null', 'Cada ponto vira botão (`aria-pressed`, Enter e espaço; alvo de 24px). O selecionado ganha um anel.'],
              ['maximo', 'number?', 'Escala fixa: topo do eixo (100 para nota de 0 a 100). Sem ele, o topo acompanha o maior valor.'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="GraficoFunil">
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <CartaoGrafico titulo="Funil de ações" info="Da abertura à verificação de eficácia.">
              <GraficoFunil
                rotulo="Funil de ações corretivas"
                etapas={[
                  { rotulo: 'Abertas', valor: 120, tom: 'primario' },
                  { rotulo: 'Em andamento', valor: 84, tom: 'secundario' },
                  { rotulo: 'Concluídas', valor: 51, tom: 'sucesso' },
                  { rotulo: 'Eficácia verificada', valor: 29, tom: 'violeta' },
                ]}
              />
            </CartaoGrafico>
          </div>
          <TabelaDeProps
            linhas={[
              ['etapas', 'EtapaFunil[]', '{ rotulo, valor, tom?, cor? } na ordem do processo.'],
              ['rotulo', 'string', 'Texto alternativo.'],
              ['mostrarConversao / formatarValor', 'boolean / fn', 'Participação sobre a etapa anterior (padrão ligado).'],
              ['onSelecionarEtapa / selecionada', '({ rotulo, indice, valor }) => void / string | null', 'Cada etapa vira botão (`aria-pressed`); as outras esmaecem.'],
              ['maximo', 'number?', 'Escala fixa: valor que ocupa a largura inteira. Sem ele, a etapa de maior valor.'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="MapaDeCalor">
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <CartaoGrafico titulo="Não conformidades por local e mês" info="Quanto mais escura a célula, mais ocorrências.">
              <MapaDeCalor
                rotulo="Não conformidades por local e mês"
                rotuloDasLinhas="Local"
                linhas={LOCAIS}
                colunas={['mai', 'jun', 'jul', 'ago', 'set', 'out']}
                valores={MATRIZ}
              />
            </CartaoGrafico>
            <CartaoGrafico titulo="Mesma matriz, tom primário" info="Tons que sustentam texto nos cinco níveis: primário, aviso, crítico e violeta.">
              <MapaDeCalor rotulo="Mesma matriz em azul" tom="primario" linhas={LOCAIS} colunas={['mai', 'jun', 'jul', 'ago', 'set', 'out']} valores={MATRIZ} />
            </CartaoGrafico>
          </div>
          <TabelaDeProps
            linhas={[
              ['linhas / colunas / valores', 'string[] / string[] / (number | null)[][]', '`valores[linha][coluna]`; null é "sem dado" (traço).'],
              ['rotulo / rotuloDasLinhas', 'string', 'Texto alternativo (vira a legenda da tabela) e o canto superior esquerdo.'],
              ['tom', "'critico' | 'aviso' | 'primario' | 'violeta'", 'Só os tons em que o texto passa de 4,5:1 nos cinco níveis. Padrão crítico.'],
              ['maximo / mostrarLegenda', 'number / boolean', 'Valor do nível mais escuro e legenda "Menos / Mais".'],
              ['onSelecionarCelula', '(linha, coluna, valor) => void', 'Célula vira botão (drill-down).'],
            ]}
          />
        </div>
      </DemoSection>

      <DemoSection title="ProgressoPorFaixa">
        <div className="space-y-4">
          <div className="grid max-w-xl gap-3">
            {[100, 94, 72, 41, 12, 0].map((v) => (
              <div key={v} className="flex items-center gap-3">
                <ProgressoPorFaixa valor={v} rotulo={`Preenchimento ${v}%`} className="flex-1" />
                <span className="w-10 text-right font-mono text-xs text-[var(--color-fg)]">{v}%</span>
              </div>
            ))}
          </div>
          <NotaDeDoc>
            O <code>Progress</code> do DS com cor pela faixa: 100% verde, 90 a 99% azul-céu, 60 a 89% âmbar, 30 a 59% laranja, 1 a 29%
            vermelho, 0% só o trilho. A barra não carrega o número: escreva-o ao lado. Props: <code>valor</code>, <code>maximo</code>{' '}
            (100), <code>rotulo</code> (nome acessível), <code>className</code>.
          </NotaDeDoc>
        </div>
      </DemoSection>

      <DemoSection title="Uso">
        <BlocoDeCodigo>{`import { CartaoGrafico, GraficoBarras } from '@fips-app/ds-fips'

<CartaoGrafico titulo="Inspeções por local" info="Total no período." lateral="122">
  <GraficoBarras
    rotulo="Inspeções por local"
    dados={[{ rotulo: 'Pátio Norte', valor: 46, tom: 'primario' }]}
    selecionado={filtro}
    onSelecionar={(r) => setFiltro(r === filtro ? null : r)}
  />
</CartaoGrafico>`}</BlocoDeCodigo>
      </DemoSection>
    </DocPage>
  )
}
