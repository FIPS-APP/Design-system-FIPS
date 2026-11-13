import { useMemo, useState, type ReactNode } from 'react'
import { Eye, FileDown, Pencil } from 'lucide-react'
import { DocPage, DemoSection } from '../../components/DocPage'
import { Badge } from '../../../components/ui/badge'
import { AdminTablePagination } from '../../../components/ui/admin-listing'
import {
  TabelaExpansivel,
  type TabelaExpansivelColuna,
  type TabelaExpansivelOrdenacao,
} from '../../../components/composites/TabelaExpansivel'
import type { RowMenuAction } from '../../../components/composites/RowActionsMenu'

type Inspecao = {
  id: string
  numero: string
  data: string
  modelo: string
  auditor: string
  local: string
  status: 'Finalizada' | 'Rascunho'
  anomalias: { item: string; avaliacao: 'NAT' | 'ATP' | 'Interdição'; observacao: string }[]
}

const LOCAIS = ['Pátio Valongo', 'Terminal Saboó', 'Oficina Alemoa', 'Pátio Paquetá']
const AUDITORES = ['Marina Duarte', 'Paulo Reis', 'Helena Cruz', 'Caio Barros']
const MODELOS = ['Inspeção de AMV', 'Inspeção de via', 'Inspeção de oficina']

const INSPECOES: Inspecao[] = Array.from({ length: 27 }, (_, i) => {
  const n = i + 1
  const qtd = n % 4 === 0 ? 0 : (n % 3) + 1
  return {
    id: `insp-${n}`,
    numero: `INS-${String(2400 + n)}`,
    data: `${String(1 + (n % 28)).padStart(2, '0')}/10/2026`,
    modelo: MODELOS[n % MODELOS.length],
    auditor: AUDITORES[n % AUDITORES.length],
    local: LOCAIS[n % LOCAIS.length],
    status: n % 5 === 0 ? 'Rascunho' : 'Finalizada',
    anomalias: Array.from({ length: qtd }, (_, k) => ({
      item: `Item ${n + k}: ${['Fixação do trilho', 'Sinalização de pátio', 'Drenagem da via', 'Extintor da oficina'][k % 4]}`,
      avaliacao: (['NAT', 'ATP', 'Interdição'] as const)[(n + k) % 3],
      observacao: 'Observação registrada pelo auditor durante a inspeção.',
    })),
  }
})

function PainelDemo({ linha }: { linha: Inspecao }) {
  return (
    <div className="space-y-3 px-4 py-4 sm:px-6">
      <p className="text-xs text-[var(--color-fg)]">
        Resumo da inspeção <strong className="text-[var(--color-fg)]">{linha.numero}</strong>:{' '}
        {linha.anomalias.length} {linha.anomalias.length === 1 ? 'anomalia' : 'anomalias'}.
      </p>
      {linha.anomalias.length === 0 ? (
        <p className="rounded-lg border border-dashed border-[var(--color-border-strong)] px-3 py-3 text-sm text-[var(--color-fg-muted)]">
          Sem anomalias: todos os itens atendem.
        </p>
      ) : (
        <ul className="space-y-2" aria-label="Anomalias da inspeção">
          {linha.anomalias.map((a) => (
            <li
              key={a.item}
              className="space-y-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-medium">{a.item}</span>
                <Badge variant={a.avaliacao === 'Interdição' ? 'danger' : 'warning'} size="sm">
                  {a.avaliacao}
                </Badge>
              </div>
              <p className="text-xs text-[var(--color-fg-muted)]">{a.observacao}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

const COLUNAS: TabelaExpansivelColuna<Inspecao>[] = [
  {
    id: 'numero',
    titulo: 'Nº',
    ordenavel: true,
    principal: true,
    celula: (l) => <span className="font-semibold tabular-nums">{l.numero}</span>,
  },
  { id: 'data', titulo: 'Data', ordenavel: true, celula: (l) => <span className="tabular-nums">{l.data}</span> },
  { id: 'modelo', titulo: 'Inspeção', celula: (l) => l.modelo },
  { id: 'auditor', titulo: 'Auditor', ordenavel: true, celula: (l) => l.auditor },
  { id: 'local', titulo: 'Local', celula: (l) => l.local },
  {
    id: 'status',
    titulo: 'Status',
    celula: (l) => (
      <Badge variant={l.status === 'Finalizada' ? 'success' : 'secondary'} size="sm">
        {l.status}
      </Badge>
    ),
  },
]

function ordenar(linhas: Inspecao[], o: TabelaExpansivelOrdenacao): Inspecao[] {
  const chave = o.coluna as 'numero' | 'data' | 'auditor'
  const fator = o.direcao === 'asc' ? 1 : -1
  return [...linhas].sort((a, b) => a[chave].localeCompare(b[chave], 'pt-BR') * fator)
}

function Completa() {
  const [ord, setOrd] = useState<TabelaExpansivelOrdenacao>({ coluna: 'numero', direcao: 'asc' })
  const [pagina, setPagina] = useState(1)
  const [porPagina, setPorPagina] = useState(5)
  const [aviso, setAviso] = useState('')

  const ordenadas = useMemo(() => ordenar(INSPECOES, ord), [ord])
  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / porPagina))
  const paginaAtual = Math.min(pagina, totalPaginas)
  const naPagina = ordenadas.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina)

  const acoes = (l: Inspecao): RowMenuAction[] => [
    { key: 'ver', label: 'Abrir', icon: <Eye className="h-4 w-4" />, tom: 'primario', onClick: () => setAviso(`Abrir ${l.numero}`) },
    { key: 'editar', label: 'Editar', icon: <Pencil className="h-4 w-4" />, tom: 'primario', onClick: () => setAviso(`Editar ${l.numero}`) },
    { key: 'pdf', label: 'Baixar PDF', icon: <FileDown className="h-4 w-4" />, tom: 'pdf', onClick: () => setAviso(`PDF de ${l.numero}`) },
  ]

  return (
    <div className="space-y-2">
      <TabelaExpansivel
        rotulo="Inspeções realizadas"
        colunas={COLUNAS}
        linhas={naPagina}
        chave={(l) => l.id}
        renderDetalhe={(l) => <PainelDemo linha={l} />}
        rotuloDetalhe={(l, aberta) => `${aberta ? 'Recolher' : 'Ver'} anomalias da inspeção ${l.numero}`}
        acoesDaLinha={acoes}
        aoClicarLinha={(l) => setAviso(`Linha ${l.numero} aberta pela linha inteira`)}
        ordenacao={ord}
        aoOrdenar={(coluna) =>
          setOrd((o) => (o.coluna === coluna ? { coluna, direcao: o.direcao === 'asc' ? 'desc' : 'asc' } : { coluna, direcao: 'asc' }))
        }
        expandidasIniciais={[naPagina[0].id]}
        rodape={
          <AdminTablePagination
            page={paginaAtual}
            pageCount={totalPaginas}
            itemsPerPage={porPagina}
            totalItems={ordenadas.length}
            itemsPerPageOptions={[5, 10, 25]}
            onItemsPerPageChange={(n) => {
              setPorPagina(n)
              setPagina(1)
            }}
            onPageChange={setPagina}
          />
        }
      />
      <p role="status" aria-live="polite" className="min-h-4 text-xs text-[var(--color-fg-muted)]">
        {aviso}
      </p>
    </div>
  )
}

function Celular() {
  return (
    <div data-demo="celular" style={{ width: 375, maxWidth: '100%' }}>
      <TabelaExpansivel
        rotulo="Inspeções no celular"
        colunas={COLUNAS}
        linhas={INSPECOES.slice(0, 3)}
        chave={(l) => l.id}
        renderDetalhe={(l) => <PainelDemo linha={l} />}
        acoesDaLinha={(l) => [
          { key: 'ver', label: 'Abrir', icon: <Eye className="h-4 w-4" />, onClick: () => void l },
        ]}
        expandidasIniciais={['insp-1']}
        unica
      />
    </div>
  )
}

const PROPS: [string, string, string][] = [
  ['colunas', 'TabelaExpansivelColuna<T>[]', 'id, titulo, celula(linha, indice), ordenavel, alinhamento, className, ocultaNoCartao, principal.'],
  ['linhas', 'T[]', 'Linhas já filtradas, ordenadas e paginadas por quem usa.'],
  ['chave', '(linha) => string', 'Chave única e estável da linha.'],
  ['renderDetalhe', '(linha) => ReactNode', 'Conteúdo do painel sob a linha (e sob o cartão).'],
  ['expandidas', 'Iterable<string>', 'Linhas abertas, modo controlado. Sem a prop o componente guarda o estado.'],
  ['expandidasIniciais', 'Iterable<string>', 'Estado inicial do modo não controlado.'],
  ['aoAlternar', '(chave, aberta) => void', 'Chamado a cada abrir ou fechar.'],
  ['unica', 'boolean', 'Só uma linha aberta por vez. Vale no modo não controlado. Padrão false.'],
  ['temDetalhe', '(linha) => boolean', 'Linha sem painel não mostra o botão.'],
  ['rotuloDetalhe', '(linha, aberta) => string', 'aria-label do botão. Padrão: "Ver detalhe" / "Recolher detalhe". Diga qual linha.'],
  ['aoClicarLinha', '(linha) => void', 'Linha inteira clicável, com foco por teclado (Enter e Espaço na linha). Não dispara em botão, link, campo ou menu de dentro da linha. Sem a prop a linha não é clicável.'],
  ['acoesDaLinha', '(linha) => RowMenuAction[]', 'Menu radial por linha (RowActionsMenu), na tabela e no cartão. Cada ação pode ter tom: primario, pdf, perigo ou neutro.'],
  ['destaqueDaLinha', 'boolean', 'Holofote na linha ativa: com o menu da linha aberto (ou a linha escolhida com clique), ela fica no tom primário com anel e leve elevação, e as demais recuam sob um véu cinza claro. ↑ e ↓ movem o destaque; Esc, X, clique fora ou a ação escolhida devolvem a tabela. No celular vale para o cartão. O app não faz nada. Padrão true.'],
  ['ordenacao / aoOrdenar', '{ coluna, direcao } / (colunaId) => void', 'Cabeçalhos ordenáveis com aria-sort. A ordenação é de quem usa.'],
  ['renderCartao', '(linha) => ReactNode', 'Cartão próprio no celular. Botão e painel continuam do componente.'],
  ['quebraEm', 'number', 'Largura do contêiner (px) abaixo da qual vira cartões. Padrão 768.'],
  ['rotulo', 'string', 'aria-label da tabela e da lista de cartões. Obrigatório.'],
  ['vazio', '{ titulo?, descricao? }', 'Texto do estado vazio.'],
  ['densidade / zebra / stickyHeader', 'TableDensity / boolean / boolean', 'Repassados ao Table. Zebra começa desligada (a linha do painel quebraria a alternância).'],
  ['rodape', 'ReactNode', 'Dentro da moldura, abaixo da tabela. Use AdminTablePagination.'],
]

const CODIGO = `import { TabelaExpansivel, AdminTablePagination } from '@fips-app/ds-fips'

<TabelaExpansivel
  rotulo="Inspeções realizadas"
  colunas={[
    { id: 'numero', titulo: 'Nº', principal: true, ordenavel: true, celula: (l) => l.numero },
    { id: 'data', titulo: 'Data', celula: (l) => l.data },
    { id: 'auditor', titulo: 'Auditor', celula: (l) => l.auditor },
  ]}
  linhas={naPagina}
  chave={(l) => l.id}
  renderDetalhe={(l) => <PainelAnomalias inspecao={l} />}
  rotuloDetalhe={(l, aberta) => \`\${aberta ? 'Recolher' : 'Ver'} anomalias de \${l.numero}\`}
  acoesDaLinha={(l) => [{ key: 'abrir', label: 'Abrir', icon: <Eye />, onClick: () => abrir(l) }]}
  ordenacao={ord}
  aoOrdenar={alternarOrdem}
  rodape={
    <AdminTablePagination
      page={pagina}
      pageCount={totalPaginas}
      itemsPerPage={porPagina}
      totalItems={total}
      itemsPerPageOptions={[10, 25, 50]}
      onItemsPerPageChange={(n) => { setPorPagina(n); setPagina(1) }}
      onPageChange={setPagina}
    />
  }
/>`

function Bloco({ children }: { children: ReactNode }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-xs leading-relaxed text-[var(--color-fg)]">
      <code>{children}</code>
    </pre>
  )
}

export default function TabelaExpansivelDoc() {
  return (
    <DocPage
      title="TabelaExpansivel"
      description="Tabela com linha expansível: um botão chevron abre, sob a linha, um painel de detalhe (resumo, anomalias, histórico). Em contêiner estreito vira lista de cartões com o mesmo botão e o mesmo painel."
    >
      <DemoSection title="Tabela com ordenação, ações, paginação e seletor de linhas">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          A primeira linha começa aberta. O seletor &quot;Linhas por página&quot; é o novo{' '}
          <code>itemsPerPageOptions</code> do <code>AdminTablePagination</code>.
        </p>
        <Completa />
      </DemoSection>

      <DemoSection title="Contêiner de 375px: cartões">
        <p className="mb-4 text-sm text-[var(--color-fg-muted)]">
          A quebra segue a largura do contêiner, não da janela: com o menu lateral aberto a tabela já pode virar
          cartões. A coluna <code>principal</code> (ou a primeira) vira o título; as outras viram pares rótulo e
          valor.
        </p>
        <Celular />
      </DemoSection>

      <DemoSection title="Props">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-xs uppercase tracking-wide text-[var(--color-fg-muted)]">
                <th scope="col" className="py-2 pr-4 font-semibold">Prop</th>
                <th scope="col" className="py-2 pr-4 font-semibold">Tipo</th>
                <th scope="col" className="py-2 font-semibold">Descrição</th>
              </tr>
            </thead>
            <tbody>
              {PROPS.map(([nome, tipo, desc]) => (
                <tr key={nome} className="border-b border-[var(--color-border)] align-top">
                  <td className="py-2 pr-4"><code className="font-mono text-xs">{nome}</code></td>
                  <td className="py-2 pr-4"><code className="font-mono text-xs">{tipo}</code></td>
                  <td className="py-2 text-[var(--color-fg-muted)]">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DemoSection>

      <DemoSection title="Paginação: AdminTablePagination com linhas por página">
        <p className="mb-3 text-sm text-[var(--color-fg-muted)]">
          Com <code>itemsPerPageOptions</code> (2 ou mais valores) e <code>onItemsPerPageChange</code> aparece o
          seletor em botões, ao lado da contagem; sem as duas props o componente fica como era. Não usa{' '}
          <code>Select</code>, então funciona dentro de modal. Se <code>itemsPerPage</code> não estiver na lista, ele
          entra na lista. Ao trocar o tamanho, volte para a página 1 no seu handler. <code>itemsPerPageLabel</code>{' '}
          troca o rótulo (padrão &quot;Linhas por página&quot;).
        </p>
        <Bloco>{`<AdminTablePagination
  page={pagina}
  pageCount={totalPaginas}
  itemsPerPage={porPagina}
  totalItems={total}
  itemsPerPageOptions={[10, 25, 50]}
  onItemsPerPageChange={(n) => { setPorPagina(n); setPagina(1) }}
  onPageChange={setPagina}
/>`}</Bloco>
      </DemoSection>

      <DemoSection title="Acessibilidade">
        <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--color-fg)]">
          <li>O chevron é um <code>button</code> com <code>aria-expanded</code> e <code>aria-controls</code> apontando para o painel (<code>role=&quot;region&quot;</code>).</li>
          <li>Cabeçalho ordenável usa <code>aria-sort</code>; a tabela e a lista de cartões levam o <code>rotulo</code> como <code>aria-label</code>.</li>
          <li>Foco visível em todos os botões; Enter e Espaço abrem e fecham.</li>
          <li>Linha ativa: texto 9,82:1 (claro) e 12,01:1 (escuro) sobre o fundo azulado; linhas recuadas acima de 3:1 sob o véu. O holofote desliza por <code>transform</code> e, com movimento reduzido no sistema, aparece no lugar.</li>
          <li>O painel fica sobre <code>--color-surface-muted</code>, onde <code>--color-fg-muted</code> mede 4,29:1 no tema claro (abaixo de 4,5:1): texto direto no painel use <code>--color-fg</code>; texto secundário só dentro de um cartão <code>--color-surface</code>.</li>
          <li>Passe <code>rotuloDetalhe</code> dizendo de qual linha é o painel: &quot;Ver detalhe&quot; repetido não diz nada ao leitor de tela.</li>
        </ul>
      </DemoSection>

      <DemoSection title="Uso">
        <Bloco>{CODIGO}</Bloco>
      </DemoSection>
    </DocPage>
  )
}
