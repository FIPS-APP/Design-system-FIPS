import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  BookOpen,
  ClipboardCheck,
  FileText,
  Home,
  ListChecks,
  ScrollText,
  Settings2,
  ShieldAlert,
  Users,
} from 'lucide-react'
import { AppShell } from '../../../components/composites/AppShell'
import { NotificacoesMenu, type SecaoDeNotificacoes } from '../../../components/composites/NotificacoesMenu'
import { TutorialOverlay } from '../../../components/composites/TutorialOverlay'
import { UserAccountMenu } from '../../../components/composites/UserAccountMenu'
import { UserChip } from '../../../components/composites/UserChip'
import { PageHeader } from '../../../components/composites/PageHeader'
import { Modal, ModalFooter } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import type { AbaDeSecao } from '../../../components/composites/AbasDeSecao'
import type {
  GrupoDoMenu,
  PassoDoTutorial,
  PassoDaTrilha,
  RenderizarLinkDaCasca,
} from '../../../components/composites/app-shell-tipos'

/**
 * Casca montada com dados fictícios, em tela cheia. É o que a página "Casca do app (AppShell)" mostra
 * dentro de um iframe, para a largura da janela (1440 ou 375) valer de verdade nas media queries.
 *
 * Endereço: /demo/casca/:tela?tema=claro|escuro&recolhido=1&auto=0|1
 */

interface Tela {
  id: string
  rotulo: string
  icone: typeof Home
  grupo: 'principal' | 'cadastro' | 'admin'
  selo?: number
  resumo: string
}

const TELAS: Tela[] = [
  { id: 'home', rotulo: 'Home', icone: Home, grupo: 'principal', resumo: 'Visão geral do sistema.' },
  { id: 'inspecao', rotulo: 'Inspeção', icone: ClipboardCheck, grupo: 'principal', resumo: 'Inspeções em andamento e concluídas.' },
  { id: 'relatorios', rotulo: 'Relatórios', icone: FileText, grupo: 'principal', resumo: 'Relatórios por período e área.' },
  { id: 'acoes', rotulo: 'Plano de Ações', icone: ListChecks, grupo: 'principal', selo: 3, resumo: 'Ações corretivas com prazo.' },
  { id: 'dashboard', rotulo: 'Dashboard', icone: BarChart3, grupo: 'principal', resumo: 'Indicadores consolidados.' },
  { id: 'cadastro', rotulo: 'Cadastro de Inspeção', icone: Settings2, grupo: 'cadastro', resumo: 'Modelos de checklist.' },
  { id: 'usuarios', rotulo: 'Usuários e Perfis', icone: Users, grupo: 'admin', resumo: 'Pessoas e permissões.' },
  { id: 'notificacoes', rotulo: 'Notificações', icone: Bell, grupo: 'admin', resumo: 'Regras de aviso.' },
  { id: 'auditoria', rotulo: 'Log de Auditoria', icone: ScrollText, grupo: 'admin', resumo: 'Quem fez o quê, e quando.' },
]

const TITULO_DO_GRUPO: Record<Tela['grupo'], string | undefined> = {
  principal: undefined,
  cadastro: 'Cadastro',
  admin: 'Administração',
}

const PERFIS = [
  { id: 'superadmin', rotulo: 'Super Admin' },
  { id: 'admin', rotulo: 'Administrador' },
  { id: 'colaborador', rotulo: 'Colaborador' },
]

const NOTIFICACOES: SecaoDeNotificacoes[] = [
  {
    itens: [
      {
        id: 'a1',
        titulo: 'Ação 0042',
        texto: 'Substituir o sinalizador da linha 3 no pátio de manobras.',
        quando: '2 dias',
        icone: ShieldAlert,
        tom: 'atencao',
        destaque: true,
        aoClicar: () => undefined,
      },
      {
        id: 'a2',
        titulo: 'Ação 0038',
        texto: 'Treinamento de brigada vencido desde a semana passada.',
        quando: 'vencida há 3 dias',
        icone: ShieldAlert,
        tom: 'critico',
        destaque: true,
        aoClicar: () => undefined,
      },
    ],
  },
  {
    titulo: 'Últimas notificações',
    itens: [
      {
        id: 'n1',
        titulo: 'Ação atribuída',
        texto: 'A ação 0041 foi atribuída a você.',
        quando: 'há 3 h',
        dica: '02/11/2026 09:12',
        tom: 'info',
        aoClicar: () => undefined,
      },
      { id: 'n2', titulo: 'Interdição registrada', texto: 'Área 2 interditada para vistoria.', quando: 'ontem', tom: 'critico' },
    ],
  },
]

const PASSOS: PassoDoTutorial[] = [
  {
    titulo: 'Bem-vindo',
    descricao: 'Este é o tour da casca padrão. Use as setas ← → para navegar e Esc para sair.',
  },
  {
    titulo: 'Menu lateral',
    descricao: 'Todas as telas que o seu perfil abre. O rodapé muda o modo do menu e mostra a versão.',
    alvo: '[data-tutorial="menu"]',
  },
  {
    titulo: 'Recolher o menu',
    descricao: 'Recolhe e expande o menu quando você precisa de mais espaço.',
    alvo: '[data-tutorial="recolher-menu"]',
  },
  {
    titulo: 'Abas de seção',
    descricao: 'As mesmas telas do menu, em abas. A aba acesa é a tela atual.',
    alvo: '[data-tutorial="abas"]',
  },
  { titulo: 'Avisos', descricao: 'O número no sino conta o que ainda não foi visto.', alvo: '[data-tutorial="sino"]' },
  { titulo: 'Sua conta', descricao: 'Perfil, atalhos e saída.', alvo: '[data-tutorial="conta"]' },
]

function Cartao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <article className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]">
      <h3 className="font-heading text-sm font-bold text-[var(--color-fg)]">{titulo}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-[var(--color-fg-muted)]">{children}</p>
    </article>
  )
}

function Procedimento({ aberto, aoMudar }: { aberto: boolean; aoMudar: (v: boolean) => void }) {
  return (
    <Modal
      open={aberto}
      onOpenChange={aoMudar}
      size="full"
      headerIcon={BookOpen}
      title="Procedimento de inspeção"
      description="O texto do procedimento e o documento oficial."
      noPadBody
      permiteTelaCheia
      atalhoTelaCheia
      className="h-[min(92svh,820px)] w-[calc(100vw-1.5rem)] max-w-[1200px] sm:max-w-[1200px]"
    >
      <Tabs defaultValue="objetivo" className="flex h-full min-h-0 flex-col">
        <div className="no-scrollbar shrink-0 overflow-x-auto px-4 pt-3 sm:px-6">
          <TabsList className="justify-start">
            <TabsTrigger value="objetivo">Objetivo</TabsTrigger>
            <TabsTrigger value="fluxo">Fluxo</TabsTrigger>
            <TabsTrigger value="anexo">Anexo (PDF)</TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="objetivo" className="mt-0 min-h-0 flex-1 overflow-auto border-0 px-4 py-4 shadow-none sm:px-6">
          <div className="grid gap-3 sm:grid-cols-2">
            <Cartao titulo="Objetivo">Padronizar a inspeção de segurança e meio ambiente nas áreas operacionais.</Cartao>
            <Cartao titulo="Escopo">Todas as áreas do porto, equipes próprias e terceiros.</Cartao>
          </div>
        </TabsContent>
        <TabsContent value="fluxo" className="mt-0 min-h-0 flex-1 overflow-auto border-0 px-4 py-4 shadow-none sm:px-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <Cartao titulo="1. Planejar">Escolha o modelo e a área.</Cartao>
            <Cartao titulo="2. Executar">Responda o checklist em campo.</Cartao>
            <Cartao titulo="3. Tratar">Abra as ações corretivas com prazo.</Cartao>
          </div>
        </TabsContent>
        <TabsContent value="anexo" className="mt-0 min-h-0 flex-1 overflow-auto border-0 px-4 py-4 shadow-none sm:px-6">
          <p className="text-sm text-[var(--color-fg-muted)]">Nenhum PDF anexado ao procedimento.</p>
        </TabsContent>
      </Tabs>
    </Modal>
  )
}

export default function CascaDemo() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [escuro, setEscuro] = useState(params.get('tema') === 'escuro')
  const [contaAberta, setContaAberta] = useState(false)
  const [tutorialAberto, setTutorialAberto] = useState(false)
  const [procedimentoAberto, setProcedimentoAberto] = useState(false)
  const [versaoAberta, setVersaoAberta] = useState(false)
  const [perfil, setPerfil] = useState('admin')

  // O tema deste documento é local à demonstração: não grava nada no armazenamento do site.
  useEffect(() => {
    const raiz = document.documentElement
    const antes = raiz.classList.contains('dark')
    raiz.classList.toggle('dark', escuro)
    return () => {
      raiz.classList.toggle('dark', antes)
    }
  }, [escuro])

  const base = '/demo/casca'
  const telaId = pathname.replace(base, '').split('/').filter(Boolean)[0] ?? 'home'
  const tela = TELAS.find((t) => t.id === telaId) ?? TELAS[0]

  const grupos: GrupoDoMenu[] = useMemo(
    () =>
      (['principal', 'cadastro', 'admin'] as const).map((g) => ({
        id: g,
        titulo: TITULO_DO_GRUPO[g],
        itens: TELAS.filter((t) => t.grupo === g).map((t) => ({
          id: t.id,
          rotulo: t.rotulo,
          href: t.id === 'home' ? base : `${base}/${t.id}`,
          icone: t.icone,
          ativo: t.id === tela.id,
          selo: t.selo,
        })),
      })),
    [tela.id],
  )

  const abas: AbaDeSecao[] = TELAS.map((t) => ({
    id: t.id,
    label: t.rotulo,
    icon: t.icone,
    href: t.id === 'home' ? base : `${base}/${t.id}`,
  }))

  const trilha: PassoDaTrilha[] = [{ label: 'Home', href: base }, ...(tela.id === 'home' ? [] : [{ label: tela.rotulo }])]

  const renderLink: RenderizarLinkDaCasca = (p) => (
    <Link
      to={p.href}
      className={p.className}
      style={p.style}
      title={p.title}
      aria-label={p['aria-label']}
      aria-current={p['aria-current']}
      onClick={p.onClick}
    >
      {p.children}
    </Link>
  )

  const padrao = { recolherAuto: params.get('auto') === '1', segundos: 3 }

  return (
    <>
      <AppShell
        chavePreferencias="ds-docs:casca-demo:v1"
        preferenciasPadrao={padrao}
        recolhidoInicial={params.get('recolhido') === '1'}
        renderLink={renderLink}
        menu={{
          nome: 'Inspeção SST e MA',
          subtitulo: 'Segurança · Meio Ambiente',
          grupos,
          versao: { numero: '0.1.0', aoAbrir: () => setVersaoAberta(true) },
        }}
        cabecalho={{
          trilha,
          abas,
          abaAtiva: tela.id,
          chaveDeMedicao: pathname,
          sino: <NotificacoesMenu secoes={NOTIFICACOES} aoEscolher={() => navigate(`${base}/acoes`)} />,
          procedimento: { rotulo: 'Procedimento de inspeção', aoClicar: () => setProcedimentoAberto(true) },
          tutorial: { rotulo: 'Tutorial desta tela', aoClicar: () => setTutorialAberto(true) },
          tema: { atual: escuro ? 'escuro' : 'claro', aoAlternar: () => setEscuro((v) => !v) },
          usuario: (
            <UserAccountMenu
              aberto={contaAberta}
              aoMudarAberto={setContaAberta}
              gatilho={<UserChip nome="Fipinho Baixada Santista" aberto={contaAberta} onClick={() => setContaAberta((v) => !v)} />}
              usuario={{ nome: 'Fipinho Baixada Santista', email: 'fipinho@fips.app.br', cargo: 'Analista de Segurança' }}
              selos={[
                { rotulo: PERFIS.find((p) => p.id === perfil)?.rotulo ?? '', variante: 'info' },
                { rotulo: 'Segurança', variante: 'secondary' },
                { rotulo: 'Sessão fictícia', variante: 'outline' },
              ]}
              perfisDev={{ opcoes: PERFIS, ativo: perfil, aoEscolher: setPerfil }}
              itens={[
                { id: 'acoes', rotulo: 'Plano de Ações', icone: ListChecks, aoClicar: () => navigate(`${base}/acoes`) },
                { id: 'avisos', rotulo: 'Notificações', icone: Bell, aoClicar: () => navigate(`${base}/notificacoes`) },
              ]}
            />
          ),
        }}
      >
        <main className="flex-1 space-y-4 p-4 sm:p-6" data-tutorial="conteudo">
          <PageHeader
            title={tela.id === 'home' ? 'Inspeção QSSMA' : tela.rotulo}
            description={tela.resumo}
            icon={<tela.icone className="h-5 w-5" aria-hidden />}
          />
          <div className="grid gap-3 @lg:grid-cols-2 @3xl:grid-cols-3">
            <Cartao titulo="Contêiner @container">O conteúdo quebra pela largura da área útil, com o menu aberto ou recolhido.</Cartao>
            <Cartao titulo="Recolher sozinho">Em “Modo do menu” escolha Automático e o tempo. Passe o ponteiro no menu para abrir.</Cartao>
            <Cartao titulo="Celular">Abaixo de 1024px o menu vira gaveta e o botão do cabeçalho abre e fecha.</Cartao>
          </div>
          <div className="flex gap-2">
            <Button variant="primary" size="md" onClick={() => setProcedimentoAberto(true)}>
              Abrir o procedimento
            </Button>
          </div>
        </main>
      </AppShell>

      <TutorialOverlay aberto={tutorialAberto} aoFechar={() => setTutorialAberto(false)} passos={PASSOS} />
      <Procedimento aberto={procedimentoAberto} aoMudar={setProcedimentoAberto} />
      <Modal
        open={versaoAberta}
        onOpenChange={setVersaoAberta}
        title="Novidades"
        description="Versão 0.1.0 da demonstração."
        size="md"
      >
        <ul className="list-disc space-y-1.5 pl-5 text-[13px] text-[var(--color-fg)]">
          <li>Casca padrão do DS: cabeçalho e menu lateral.</li>
        </ul>
        <ModalFooter>
          <Button variant="primary" onClick={() => setVersaoAberta(false)}>
            Fechar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  )
}
