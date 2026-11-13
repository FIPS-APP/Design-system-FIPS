import type { ReactNode } from 'react'
import {
  AlertOctagon,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  ClipboardPen,
  Eye,
  FileBarChart2,
  FilePlus2,
  Gauge,
  HardHat,
  Layers,
  ListChecks,
  Megaphone,
  PenLine,
  ScrollText,
  Search,
  Send,
  ShieldCheck,
  Target,
  TriangleAlert,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import {
  CartoesConceito,
  CartoesInformativos,
  CartoesResponsabilidade,
  ChamadaFinal,
  CicloDeVida,
  FaixaPilares,
  HomeHero,
  IndicadoresNumerados,
  NotasOperacionais,
  PassosGrade,
  SecaoHome,
  TabelaReferencia,
} from '../../../components/composites'
import { DocPage, DemoSection } from '../../components/DocPage'

/* O texto da Home de exemplo é fictício: uma rotina de inspeção qualquer. Quem usa o padrão troca tudo por props. */

const ATALHOS = [
  { id: 'painel', icon: Gauge, label: 'Painel', href: '#exemplo', variante: 'ouro' as const },
  { id: 'avaliacao', icon: ClipboardList, label: 'Avaliação', href: '#exemplo' },
  { id: 'registro', icon: FilePlus2, label: 'Registrar', href: '#exemplo' },
  { id: 'equipes', icon: Users, label: 'Equipes', href: '#exemplo' },
  { id: 'procedimento', icon: ScrollText, label: 'Procedimento', href: '#exemplo' },
]

const PILARES = [
  { id: 'p', marca: 'P', titulo: 'Planejar', icone: Search, texto: 'Definir o roteiro, os itens a conferir e quem acompanha a rotina no turno.' },
  { id: 'e', marca: 'E', titulo: 'Executar', icone: ClipboardPen, texto: 'Percorrer o roteiro, responder cada item e anexar a evidência quando houver desvio.' },
  { id: 'r', marca: 'R', titulo: 'Registrar', icone: Send, texto: 'Concluir o formulário e encaminhar ao responsável pela análise e pelo plano de ação.' },
]

const ETAPAS = [
  { id: '1', icone: Search, titulo: 'Planejar', tom: 'success' as const, texto: 'Equipe monta o roteiro da rotina com os itens do turno.', papel: { rotulo: 'Equipe', tom: 'success' as const } },
  { id: '2', icone: ClipboardPen, titulo: 'Executar', tom: 'warning' as const, texto: 'Percorre o roteiro. Em desvio crítico, avisa o superior na hora.', papel: { rotulo: 'Equipe', tom: 'success' as const } },
  { id: '3', icone: FilePlus2, titulo: 'Registrar', tom: 'warning' as const, texto: 'Preenche o formulário com responsável, local e ação imediata.', papel: { rotulo: 'Equipe', tom: 'success' as const } },
  { id: '4', icone: ShieldCheck, titulo: 'Avaliar', tom: 'secondary' as const, texto: 'Qualidade classifica o registro e define a criticidade.', papel: { rotulo: 'Qualidade', tom: 'warning' as const } },
  { id: '5', icone: ListChecks, titulo: 'Plano de ação', tom: 'secondary' as const, texto: 'Gestor define a tratativa conforme a criticidade e o prazo.', papel: { rotulo: 'Gestor', tom: 'primary' as const } },
  { id: '6', icone: CheckCircle2, titulo: 'Encerrar', tom: 'success' as const, texto: 'Gestor encerra e o resultado entra na base de indicadores.', papel: { rotulo: 'Gestor', tom: 'primary' as const } },
]

const SOBRE = [
  {
    id: 'objetivo',
    icone: Target,
    titulo: 'Objetivo',
    texto: 'Padronizar o registro das rotinas de inspeção, considerando a criticidade de cada desvio e encaminhando ações imediatas ou orientações para correção.',
  },
  {
    id: 'aplicacao',
    icone: ScrollText,
    titulo: 'Aplicação',
    texto: (
      <>
        Aplica-se a <strong>todas as operações</strong> e a colaboradores próprios e terceiros que prestam serviços, em todas as áreas sob a jurisdição da empresa.
      </>
    ),
    marcas: ['Operações', 'Próprios', 'Terceiros'],
  },
]

const CONCEITOS = [
  {
    id: 'conforme',
    icone: ShieldCheck,
    titulo: 'Conformidade',
    tom: 'primary' as const,
    texto: (
      <>
        Resultado da conferência de um item. <strong className="text-[var(--color-success-text)]">Conforme</strong>: atende ao roteiro.{' '}
        <strong className="text-[var(--color-danger-text)]">Não conforme</strong>: foge do roteiro e gera registro.
      </>
    ),
  },
  { id: 'condicao', icone: TriangleAlert, titulo: 'Condição irregular', tom: 'warning' as const, texto: 'Situação do local, do equipamento ou da ferramenta que pode causar dano. Não depende da ação das pessoas.' },
  { id: 'quase', icone: AlertOctagon, titulo: 'Quase ocorrência', tom: 'danger' as const, texto: 'Fato que poderia ter causado dano e não causou por pouco. Exige aviso imediato ao superior.' },
]

const RESPONSABILIDADES = [
  { id: 'direcao', icone: UserCog, titulo: 'Alta direção', texto: 'Promover a cultura da rotina e apoiar a prevenção de ocorrências.' },
  { id: 'gestores', icone: Users, titulo: 'Gestores de pessoas', texto: 'Estimular as equipes e validar os registros da sua área.' },
  { id: 'colaboradores', icone: HardHat, titulo: 'Colaboradores próprios e terceiros', texto: 'Registrar qualquer desvio observado durante a atividade.' },
]

const PASSOS = [
  { id: '1', icone: Send, titulo: 'Acessar', texto: 'Abra o aplicativo da rotina no celular ou no computador.', dica: 'Sem smartphone? Formulário em papel.' },
  { id: '2', icone: Layers, titulo: 'Selecionar a categoria', texto: 'Conformidade, condição irregular ou quase ocorrência.', dica: 'Item 5.1.1 do procedimento.' },
  { id: '3', icone: Eye, titulo: 'Dados do responsável', texto: 'Data e hora, matrícula, nome, empresa, coordenador e gerente.', dica: 'Comum às três categorias.' },
  { id: '4', icone: Users, titulo: 'Dados do envolvido', texto: 'Local, função, turno, coordenador, empresa e atividade.', dica: 'Comum às três categorias.' },
  { id: '5', icone: ListChecks, titulo: 'Bloco específico', texto: 'Checklist de conformidade, categorias e criticidade conforme o tipo.', dica: 'Varia por categoria.' },
  { id: '6', icone: Megaphone, titulo: 'Ação imediata e envio', texto: 'Registre a orientação dada e envie. O registro entra na fila de avaliação.', dica: 'Crítico? Comunique o superior.' },
]

const COLUNAS = [
  { id: 'conformidade', rotulo: 'Conformidade' },
  { id: 'condicao', rotulo: 'Condição irregular' },
  { id: 'quase', rotulo: 'Quase ocorrência' },
]

const LINHAS = [
  { id: 'resp', rotulo: 'Dados do responsável (1–6)', valores: { conformidade: true, condicao: true, quase: true } },
  { id: 'env', rotulo: 'Dados do envolvido (7–12)', valores: { conformidade: true, condicao: true, quase: true } },
  { id: 'check', rotulo: 'Checklist de 10 itens', referencia: '§5.1.1', valores: { conformidade: true, condicao: false, quase: false } },
  { id: 'cat', rotulo: '16 categorias de condição', referencia: '§5.1.2', valores: { conformidade: false, condicao: true, quase: false } },
  { id: 'crit', rotulo: 'Classificação de criticidade', referencia: 'Crítico · Moderado · Tolerável', valores: { conformidade: false, condicao: true, quase: false } },
  { id: 'tipo', rotulo: 'Tipo Pessoal ou Ferroviário', referencia: '§5.1', valores: { conformidade: false, condicao: false, quase: true } },
  { id: 'acao', rotulo: 'Ação imediata ou orientação dada', valores: { conformidade: true, condicao: true, quase: true } },
]

const NOTAS = [
  'Sem desvio? Aborde o envolvido e elogie o comportamento correto (Nota 2).',
  'Identificou condição crítica? Comunique imediatamente o superior (Nota 3).',
  'Quase ocorrência exige aviso imediato ao superior e à qualidade (Nota 4).',
  'Sem smartphone corporativo? O gestor digita os formulários em papel uma vez por semana.',
]

const INDICADORES = [
  { id: 'incidencia', titulo: 'Incidência', texto: 'Tipo de registro com maior volume no ciclo.' },
  { id: 'criticidade', titulo: 'Criticidade', texto: 'Distribuição entre crítico, moderado e tolerável. Atenção aos itens recorrentes.' },
  { id: 'resolvidos', titulo: 'Resolvidos', texto: 'Relação de fechamento dentro do prazo, sobre o total registrado.' },
  { id: 'abertos', titulo: 'Não resolvidos', texto: 'Sobre o total registrado. Base para escalonar com a qualidade.' },
  { id: 'improcedentes', titulo: 'Improcedentes', texto: 'Retificados ou excluídos após análise da classificação e da descrição.' },
]

const PERFIS = [
  {
    id: 'leitor',
    icone: Eye,
    titulo: 'Leitor',
    subtitulo: 'Só leitura',
    tom: 'primary' as const,
    detalhes: [
      { rotulo: 'Vê', texto: 'Painel · Avaliação · Equipes · Registro' },
      { rotulo: 'Edita', texto: 'Nada, só leitura' },
    ],
  },
  {
    id: 'gestor',
    icone: UserCog,
    titulo: 'Gestor',
    subtitulo: 'Edita na própria área',
    tom: 'success' as const,
    texto: 'Quem é atribuído responsável por uma ação vira gestor.',
    detalhes: [
      { rotulo: 'Vê', texto: 'Painel · Avaliação · Equipes · Registro' },
      { rotulo: 'Edita', texto: 'Avaliação · Registro' },
    ],
  },
  {
    id: 'admin',
    icone: Wrench,
    titulo: 'Administrador',
    subtitulo: 'Tudo, menos a configuração',
    tom: 'warning' as const,
    detalhes: [
      { rotulo: 'Vê', texto: 'Tudo' },
      { rotulo: 'Edita', texto: 'Painel · Avaliação · Equipes · Registro · Usuários' },
    ],
  },
]

/** A Home completa. Cada bloco é um componente do DS; o texto e a ordem são do app. */
function HomeExemplo() {
  return (
    <main id="exemplo" className="bg-[var(--color-surface-muted)] pb-12">
      <HomeHero
        sobretitulo="Procedimento operacional"
        destaque="Rotina"
        separador=" - "
        titulo="Planejar e Registrar"
        subtitulo="Plataforma de gestão das rotinas de inspeção. Valida a criticidade, acompanha o plano de ação por prazo e atua sobre os vencidos."
        atalhos={ATALHOS}
        atalhosLabel="Seções do app"
      />
      <FaixaPilares pilares={PILARES} />

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-10 sm:px-6">
        <CicloDeVida
          sobretitulo="Ciclo de vida"
          titulo="Fluxo da rotina"
          subtitulo="Do planejamento ao encerramento na base de indicadores."
          acao={<Badge variant="info">6 etapas</Badge>}
          etapas={ETAPAS}
        />

        <SecaoHome numero={1} titulo="Sobre o procedimento">
          <CartoesInformativos cartoes={SOBRE} />
        </SecaoHome>

        <SecaoHome numero={2} titulo="Termos e definições" acao={<Badge variant="secondary">3 conceitos</Badge>}>
          <CartoesConceito conceitos={CONCEITOS} />
        </SecaoHome>

        <SecaoHome numero={3} titulo="Responsabilidades" subtitulo="Diretrizes do procedimento: quem registra, estimula e valida.">
          <CartoesResponsabilidade cartoes={RESPONSABILIDADES} />
        </SecaoHome>

        <SecaoHome
          numero={4}
          titulo="Como a rotina é registrada"
          subtitulo="Procedimento operacional em seis passos, comum às três categorias."
          acao={
            <Button variant="link" size="sm">
              Registrar
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          }
        >
          <PassosGrade passos={PASSOS} label="Passos do registro" />
          <TabelaReferencia
            sobretitulo="Referência operacional"
            titulo="Campos por categoria"
            subtitulo="O que cada categoria exige além dos campos comuns."
            selo={<Badge variant="secondary">Procedimento §5.1</Badge>}
            colunas={COLUNAS}
            linhas={LINHAS}
          />
          <NotasOperacionais icone={BookOpenCheck} titulo="Notas operacionais (§5.1)" itens={NOTAS} />
        </SecaoHome>

        <SecaoHome
          numero={5}
          titulo="Melhoria contínua"
          subtitulo="Os resultados são compartilhados na reunião mensal."
          acao={
            <Button variant="link" size="sm">
              Ver no painel
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          }
        >
          <IndicadoresNumerados indicadores={INDICADORES} label="Indicadores" />
        </SecaoHome>

        <SecaoHome numero={6} titulo="Perfis de acesso" subtitulo="O que cada perfil enxerga e edita neste app.">
          <CartoesResponsabilidade cartoes={PERFIS} />
        </SecaoHome>

        <ChamadaFinal
          sobretitulo="Próximo passo"
          titulo="Continue no"
          destaque="Painel"
          texto="O ciclo garante tratativa rastreada e indicadores consolidados para a reunião mensal."
          passos={[
            { id: 'avaliar', icone: ShieldCheck, rotulo: 'Avaliar', dica: '§4.1 / §5.2', tom: 'primary' },
            { id: 'tratar', icone: ListChecks, rotulo: 'Tratar', dica: 'Plano de ação', tom: 'warning' },
            { id: 'encerrar', icone: CheckCircle2, rotulo: 'Encerrar', dica: 'Indicadores', tom: 'success' },
          ]}
          acoes={
            <>
              <Button variant="primary" size="md" className="w-full lg:w-auto">
                <FileBarChart2 className="h-4 w-4" aria-hidden />
                Abrir painel
              </Button>
              <Button variant="secondary" size="md" className="w-full lg:w-auto">
                <PenLine className="h-4 w-4" aria-hidden />
                Registrar
              </Button>
            </>
          }
        />
      </div>
    </main>
  )
}

const CODIGO = `import {
  HomeHero, FaixaPilares, CicloDeVida, SecaoHome,
  CartoesInformativos, CartoesConceito, CartoesResponsabilidade,
  PassosGrade, TabelaReferencia, NotasOperacionais,
  IndicadoresNumerados, ChamadaFinal,
} from '@fips-app/ds-fips'

<main className="pb-12">
  <HomeHero
    sobretitulo="Procedimento operacional"
    destaque="Rotina" separador=" - " titulo="Planejar e Registrar"
    subtitulo="…" atalhos={atalhos}      // HeroFileira
    sobreposicao="leve"                  // 'media' | 'forte' se a foto for clara demais
  />
  <FaixaPilares pilares={[{ id: 'p', marca: 'P', titulo: 'Planejar', icone: Search, texto: '…' }]} />
  <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 pt-10 sm:px-6">
    <CicloDeVida titulo="Fluxo da rotina" sobretitulo="Ciclo de vida" etapas={etapas} acao={<Badge variant="info">6 etapas</Badge>} />
    <SecaoHome numero={1} titulo="Sobre o procedimento">
      <CartoesInformativos cartoes={…} />
    </SecaoHome>
    {/* 2 CartoesConceito · 3 CartoesResponsabilidade · 4 PassosGrade + TabelaReferencia + NotasOperacionais … */}
    <ChamadaFinal titulo="Continue no" destaque="Painel" acoes={<Button …/>} />
  </div>
</main>`

function Tabela({ linhas }: { linhas: [string, string][] }) {
  return (
    <dl className="divide-y divide-[var(--color-border)] text-sm">
      {linhas.map(([nome, desc]) => (
        <div key={nome} className="grid gap-1 py-2.5 sm:grid-cols-[220px_1fr] sm:gap-4">
          <dt className="font-mono text-[12px] font-semibold text-[var(--color-fg)]">{nome}</dt>
          <dd className="leading-relaxed text-[var(--color-fg-muted)]">{desc}</dd>
        </div>
      ))}
    </dl>
  )
}

function Bloco({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <div className="space-y-1">
      <h3 className="font-heading text-sm font-semibold text-[var(--color-fg)]">{titulo}</h3>
      {children}
    </div>
  )
}

export default function HomePadraoDemo() {
  return (
    <DocPage
      title="Home padrão"
      description="A Home dos produtos FIPS montada só com componentes do DS: hero com foto clara e título em duas cores, faixa de pilares sobreposta, ciclo de vida, seções numeradas (cartões de objetivo, conceito, responsabilidade, grade de passos, tabela de referência) e a chamada final. O texto, os ícones, as rotas e as permissões são do app, por props."
    >
      <DemoSection title="1. Home completa (exemplo)" className="-mx-4 overflow-hidden rounded-none p-0 sm:mx-0 sm:rounded-2xl">
        <HomeExemplo />
      </DemoSection>

      <DemoSection title="2. Como montar">
        <pre className="overflow-x-auto rounded-xl bg-[var(--color-surface-muted)] p-4 text-[12px] leading-relaxed text-[var(--color-fg)]">
          <code>{CODIGO}</code>
        </pre>
      </DemoSection>

      <DemoSection title="3. Componentes e props">
        <div className="space-y-6">
          <Bloco titulo="HomeHero">
            <Tabela
              linhas={[
                ['titulo', 'Resto do título, em branco. Texto do h1.'],
                ['destaque / separador', 'Palavra-chave em laranja antes do título e o texto entre os dois (padrão: um espaço).'],
                ['sobretitulo / subtitulo', 'Linha pequena em caixa alta acima do título e parágrafo abaixo.'],
                ['imagem', 'Foto de fundo (padrão: o trem do DS em /backgrounds). null liga só o azul.'],
                ['sobreposicao', "'leve' (padrão, a foto aparece), 'media' ou 'forte' para fotos claras demais."],
                ['atalhos / atalhosLabel', 'HeroFileira sob o subtítulo. children entra abaixo dela.'],
              ]}
            />
          </Bloco>
          <Bloco titulo="FaixaPilares">
            <Tabela linhas={[['pilares', '{ id, marca, titulo, texto, icone }. A marca vira "PILAR P".'], ['rotulo / sobreposta / nivelTitulo', 'Palavra antes da marca, sobe sobre o pé do hero (padrão sim) e nível do título (padrão h2).']]} />
          </Bloco>
          <Bloco titulo="SecaoHome">
            <Tabela linhas={[['numero | sobretitulo', 'Número em laranja ("1" vira "01") ou linha cinza em caixa alta.'], ['titulo / subtitulo / acao', 'Título (h2), apoio e pílula ou botão à direita.'], ['tamanho / nivelTitulo / id', "'lg' (padrão) ou 'md'; h2 ou h3; âncora."]]} />
          </Bloco>
          <Bloco titulo="CicloDeVida">
            <Tabela linhas={[['etapas', '{ id, icone, titulo, texto, numero?, tom?, papel?: { rotulo, tom? } }. O papel é o selo no pé do cartão.'], ['titulo / sobretitulo / subtitulo / acao', 'Cabeçalho (SecaoHome). Sem titulo, só a grade.'], ['conectores', 'Seta entre as etapas a partir de 1280px (padrão sim, até 6 etapas).']]} />
          </Bloco>
          <Bloco titulo="CartoesInformativos · CartoesConceito · CartoesResponsabilidade">
            <Tabela
              linhas={[
                ['CartoesInformativos.cartoes', '{ id, icone, titulo, texto, marcas?: string[] }. Marcas viram pílulas.'],
                ['CartoesConceito.conceitos', '{ id, icone, titulo, texto, tom? }. Ícone ao lado do título, texto embaixo, alinhado à esquerda. O tom pinta a borda esquerda e o ícone.'],
                ['CartoesResponsabilidade.cartoes', '{ id, icone, titulo, subtitulo?, texto?, detalhes?: { rotulo, texto }[], tom? }. Com detalhes vira cartão de perfil.'],
                ['colunas / nivelTitulo', '2, 3 ou 4 colunas a partir de 768px; título h3 por padrão.'],
              ]}
            />
          </Bloco>
          <Bloco titulo="PassosGrade · TabelaReferencia · NotasOperacionais · IndicadoresNumerados · ChamadaFinal">
            <Tabela
              linhas={[
                ['PassosGrade.passos', '{ id, icone, titulo, texto, dica?, numero? }. rotulo (padrão "Passo") e moldura (padrão cartão em volta).'],
                ['TabelaReferencia', 'colunas { id, rotulo } e linhas { id, rotulo, referencia?, valores }. true marca, false traço, outro valor vira texto. No telefone cada linha vira bloco.'],
                ['NotasOperacionais', 'icone, titulo, itens e tom (padrão warning).'],
                ['IndicadoresNumerados.indicadores', '{ id, titulo, texto }, numerados "01", "02"…'],
                ['ChamadaFinal', 'sobretitulo, titulo + destaque, texto, passos { id, icone, rotulo, dica?, tom? } e acoes (botões do app).'],
                ['tom (todos)', "'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'. Texto pequeno usa --color-accent-text e --color-success-text."],
              ]}
            />
          </Bloco>
        </div>
      </DemoSection>
    </DocPage>
  )
}
