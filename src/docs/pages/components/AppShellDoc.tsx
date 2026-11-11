import { useState, type ReactNode } from 'react'
import { BookOpen } from 'lucide-react'
import { HeaderTile } from '../../../components/composites/HeaderTile'
import { Modal } from '../../../components/ui/Modal'
import { Button } from '../../../components/ui/button'
import { cn } from '../../../lib/cn'

/* Casca do app: página de documentação. O shell montado roda em /demo/casca, dentro de um iframe, porque
   as media queries (menu fixo a partir de 1024px, gaveta abaixo) respondem à largura da janela. */

type Opcao<T extends string> = { valor: T; rotulo: string }

function Seletor<T extends string>({
  rotulo,
  valor,
  opcoes,
  aoMudar,
}: {
  rotulo: string
  valor: T
  opcoes: Opcao<T>[]
  aoMudar: (v: T) => void
}) {
  return (
    <div role="group" aria-label={rotulo} className="flex items-center gap-2">
      <span className="text-xs font-semibold text-[var(--color-fg-muted)]">{rotulo}</span>
      <div className="inline-flex rounded-lg border border-[var(--color-border-control)] p-0.5">
        {opcoes.map((o) => (
          <button
            key={o.valor}
            type="button"
            aria-pressed={valor === o.valor}
            onClick={() => aoMudar(o.valor)}
            className={cn(
              'rounded-md px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] focus-visible:outline-none',
              valor === o.valor
                ? 'bg-[var(--color-primary)] text-white'
                : 'text-[var(--color-fg)] hover:bg-[var(--color-surface-muted)]',
            )}
          >
            {o.rotulo}
          </button>
        ))}
      </div>
    </div>
  )
}

const CODIGO_MONTAGEM = `import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  AppShell, NotificacoesMenu, TutorialOverlay, UserAccountMenu, UserChip,
  type RenderizarLinkDaCasca,
} from '@fips-app/ds-fips'

// 1. As imagens da marca ficam na pasta pública do app (o pacote não empacota imagem):
//    /appfips-logo.png, /appfips-logo-full.png, /appfips-mark-collapsed.png
//    Em outra pasta: marca={{ logo: '/brand/appfips-logo.png', ... }}.

// 2. O roteador é do app. A casca só entrega className, style e children:
const renderLink: RenderizarLinkDaCasca = (p) => (
  <Link to={p.href} className={p.className} style={p.style} title={p.title}
        aria-label={p['aria-label']} aria-current={p['aria-current']} onClick={p.onClick}>
    {p.children}
  </Link>
)

export function Casca({ children }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [conta, setConta] = useState(false)

  return (
    <AppShell
      chavePreferencias="meuapp:sidebar-prefs:v1"   // uma por app
      renderLink={renderLink}
      menu={{
        nome: 'Inspeção SST e MA',
        subtitulo: 'Segurança · Meio Ambiente',
        grupos: [
          { id: 'principal', itens: [{ id: 'home', rotulo: 'Home', href: '/', icone: Home, ativo: pathname === '/' }] },
          { id: 'admin', titulo: 'Administração', itens: [/* … */] },
        ],
        versao: { numero: '1.4.0', aoAbrir: () => setNovidades(true) },   // obrigatório
      }}
      cabecalho={{
        trilha: [{ label: 'Home', href: '/' }, { label: 'Inspeção' }],
        abas, abaAtiva: 'inspecao', chaveDeMedicao: pathname,
        sino: <NotificacoesMenu secoes={secoes} />,
        procedimento: { rotulo: 'Procedimento de inspeção', aoClicar: abrirProcedimento },
        tutorial: { rotulo: 'Tutorial desta tela', aoClicar: abrirTutorial },
        tema: { atual: tema, aoAlternar: alternarTema },
        usuario: (
          <UserAccountMenu
            aberto={conta} aoMudarAberto={setConta}
            gatilho={<UserChip nome={usuario.nome} fotoUrl={usuario.foto} aberto={conta} onClick={() => setConta((v) => !v)} />}
            usuario={usuario}
            selos={[{ rotulo: 'Administrador', variante: 'info' }]}
            itens={[{ id: 'acoes', rotulo: 'Plano de Ações', icone: ListChecks, aoClicar: () => navigate('/acoes') }]}
          />
        ),
      }}
    >
      {children}
    </AppShell>
  )
}

// O tutorial mora fora do cabeçalho (fica acima do menu):
<TutorialOverlay aberto={tutorial} aoFechar={fechar} passos={PASSOS_DA_TELA} />`

const CODIGO_PROCEDIMENTO = `// O modal do procedimento é composição do Modal: sem componente próprio.
// "Não pode ter scroll" no corpo curto; conteúdo longo liga a tela cheia ao lado do X.
<Modal
  open={aberto}
  onOpenChange={setAberto}
  size="full"
  headerIcon={BookOpen}
  title="Procedimento de inspeção"
  description="O texto do procedimento e o documento oficial em PDF."
  noPadBody
  permiteTelaCheia          // botão "Tela cheia" ao lado do X (Alt+Enter com atalhoTelaCheia)
  className="h-[min(92svh,820px)] w-[calc(100vw-1.5rem)] max-w-[1200px] sm:max-w-[1200px]"
>
  <Tabs defaultValue="texto" className="flex h-full min-h-0 flex-col">
    <div className="no-scrollbar shrink-0 overflow-x-auto px-4 pt-3 sm:px-6">
      <TabsList className="justify-start">…abas…</TabsList>
    </div>
    <TabsContent value="texto" className="mt-0 min-h-0 flex-1 overflow-auto border-0 px-4 py-4 shadow-none">…</TabsContent>
  </Tabs>
</Modal>`

type Linha = [prop: string, tipo: string, descricao: string]

function Tabela({ titulo, linhas }: { titulo: string; linhas: Linha[] }) {
  return (
    <section className="mt-8">
      <h3 className="mb-2 font-heading text-base font-bold text-[var(--color-fg)]">
        <code>{titulo}</code>
      </h3>
      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full min-w-[640px] text-left text-xs">
          <thead className="bg-[var(--color-surface-muted)] text-[var(--color-fg)]">
            <tr>
              <th className="px-3 py-2 font-semibold">Prop</th>
              <th className="px-3 py-2 font-semibold">Tipo</th>
              <th className="px-3 py-2 font-semibold">O que faz</th>
            </tr>
          </thead>
          <tbody>
            {linhas.map(([prop, tipo, desc]) => (
              <tr key={prop} className="border-t border-[var(--color-border)] align-top">
                <td className="px-3 py-2 font-mono font-semibold whitespace-nowrap text-[var(--color-fg)]">{prop}</td>
                <td className="px-3 py-2 font-mono text-[var(--color-fg-muted)]">{tipo}</td>
                <td className="px-3 py-2 text-[var(--color-fg)]">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Secao({ id, titulo, children }: { id?: string; titulo: string; children: ReactNode }) {
  return (
    <section id={id} className="mt-10">
      <h2 className="mb-3 font-heading text-xl font-bold text-[var(--color-fg)]">{titulo}</h2>
      {children}
    </section>
  )
}

function Codigo({ children }: { children: string }) {
  return (
    <pre className="max-w-4xl overflow-x-auto rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 text-xs leading-relaxed text-[var(--color-fg)]">
      {children}
    </pre>
  )
}

export default function AppShellDoc() {
  const [tema, setTema] = useState<'claro' | 'escuro'>(() =>
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark') ? 'escuro' : 'claro',
  )
  const [aparelho, setAparelho] = useState<'desktop' | 'celular'>('desktop')
  const [menu, setMenu] = useState<'aberto' | 'recolhido'>('aberto')
  const [modo, setModo] = useState<'manual' | 'auto'>('manual')
  const [modalAberto, setModalAberto] = useState(false)
  const celular = aparelho === 'celular'
  const src = `/demo/casca?tema=${tema === 'escuro' ? 'escuro' : 'claro'}&recolhido=${menu === 'recolhido' ? 1 : 0}&auto=${modo === 'auto' ? 1 : 0}`

  return (
    <div className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="font-heading text-3xl font-bold text-[var(--color-fg)]">Casca do app (AppShell)</h1>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
        Cabeçalho e menu lateral padrão dos apps FIPS, iguais aos do Gestão OPA. Vêm do pacote para nenhum app errar
        de novo: azulejos neumórficos, trilha, faixa de abas com sublinhado âmbar, sino, procedimento, tutorial,
        tema, chip da conta e o menu azul com “Modo do menu” e “Versão” no rodapé. Tudo é genérico: textos, itens,
        rotas e perfis entram por props.
      </p>

      <div className="mt-4 max-w-3xl rounded-2xl border border-[var(--color-semantic-info-border)] bg-[var(--color-semantic-info-bg)] p-4 text-sm leading-relaxed text-[var(--color-semantic-info-fg)]">
        <strong>Sem gambiarra de CSS no app.</strong> O que decide <code>display</code> (azulejo, faixa de abas,
        menu) mora na camada <code>components</code> do pacote e responde por media query própria. O app não
        precisa de <code>max-lg:hidden</code> nem de <code>.header-tile</code> no CSS dele. As imagens da marca
        (<code>/appfips-logo.png</code>, <code>/appfips-logo-full.png</code>, <code>/appfips-mark-collapsed.png</code>)
        ficam na pasta pública do app.
      </div>

      <Secao titulo="Montada">
        <p className="mb-3 max-w-3xl text-sm text-[var(--color-fg-muted)]">
          A casca abaixo roda de verdade (tela cheia, dentro de um quadro): passe o ponteiro no menu, recolha, troque
          o tema, abra o sino, a conta, o procedimento e o tutorial. No celular, o botão da esquerda abre a gaveta: o foco vai para o primeiro item, Tab fica no menu e Esc devolve o foco ao botão.
        </p>
        <div className="mb-3 flex flex-wrap items-center gap-x-6 gap-y-2">
          <Seletor
            rotulo="Tema"
            valor={tema}
            opcoes={[
              { valor: 'claro', rotulo: 'Claro' },
              { valor: 'escuro', rotulo: 'Escuro' },
            ]}
            aoMudar={setTema}
          />
          <Seletor
            rotulo="Aparelho"
            valor={aparelho}
            opcoes={[
              { valor: 'desktop', rotulo: 'Desktop' },
              { valor: 'celular', rotulo: 'Celular (375)' },
            ]}
            aoMudar={setAparelho}
          />
          <Seletor
            rotulo="Menu"
            valor={menu}
            opcoes={[
              { valor: 'aberto', rotulo: 'Aberto' },
              { valor: 'recolhido', rotulo: 'Recolhido' },
            ]}
            aoMudar={setMenu}
          />
          <Seletor
            rotulo="Modo do menu"
            valor={modo}
            opcoes={[
              { valor: 'manual', rotulo: 'Manual' },
              { valor: 'auto', rotulo: 'Automático (3 s)' },
            ]}
            aoMudar={setModo}
          />
        </div>
        <div className="flex justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-3">
          <iframe
            key={src}
            title="Casca do app montada"
            src={src}
            data-demo="casca"
            className={cn(
              'h-[720px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)]',
              celular ? 'w-[375px] max-w-full' : 'w-full',
            )}
          />
        </div>
      </Secao>

      <Secao titulo="Como montar">
        <Codigo>{CODIGO_MONTAGEM}</Codigo>
      </Secao>

      <Secao titulo="Azulejo avulso: HeaderTile">
        <p className="mb-3 max-w-3xl text-sm text-[var(--color-fg-muted)]">
          O botão de ícone de 36px do cabeçalho. Use para uma ação a mais em <code>acoesExtras</code>; sempre com{' '}
          <code>aria-label</code>.
        </p>
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4">
          <HeaderTile icone={BookOpen} aria-label="Repouso" />
          <HeaderTile icone={BookOpen} ativo aria-label="Ativo" />
          <span className="text-xs text-[var(--color-fg-muted)]">repouso e ativo (o hover acende igual)</span>
        </div>
      </Secao>

      <Secao titulo="Modal do procedimento">
        <p className="mb-3 max-w-3xl text-sm text-[var(--color-fg-muted)]">
          Não é componente: é composição do <code>Modal</code> com <code>permiteTelaCheia</code>. O corpo curto não
          rola; o conteúdo longo vira abas e o botão “Tela cheia” fica ao lado do X.
        </p>
        <Button variant="outline" size="md" onClick={() => setModalAberto(true)}>
          <BookOpen className="h-4 w-4" aria-hidden />
          Abrir o exemplo
        </Button>
        <Modal
          open={modalAberto}
          onOpenChange={setModalAberto}
          size="full"
          headerIcon={BookOpen}
          title="Procedimento de inspeção"
          description="O texto do procedimento e o documento oficial em PDF."
          noPadBody
          permiteTelaCheia
          atalhoTelaCheia
          className="h-[min(92svh,820px)] w-[calc(100vw-1.5rem)] max-w-[1200px] sm:max-w-[1200px]"
        >
          <div className="p-6 text-sm text-[var(--color-fg)]">
            Abas, texto e o PDF entram aqui. Use o botão ao lado do X para a tela cheia.
          </div>
        </Modal>
        <div className="mt-4">
          <Codigo>{CODIGO_PROCEDIMENTO}</Codigo>
        </div>
      </Secao>

      <Secao titulo="Props">
        <Tabela
          titulo="AppShell"
          linhas={[
            ['chavePreferencias', 'string (obrigatória)', 'Chave do localStorage das preferências do menu. Uma por app.'],
            ['menu', 'Omit<AppSidebarProps, …>', 'nome, subtitulo, marca, grupos, versao (obrigatória), renderLink. O shell controla recolhido, gaveta e modo do menu.'],
            ['cabecalho', 'Omit<AppHeaderProps, …>', 'trilha, abas, abaAtiva, sino, procedimento, tutorial, tema, usuario…'],
            ['renderLink', 'RenderizarLinkDaCasca', 'Liga os links ao roteador do app. Sem ele, <a href> (recarrega a página).'],
            ['preferenciasPadrao', '{ recolherAuto; segundos }', 'Padrão de quem nunca mexeu. Padrão do DS: automático, 3 s.'],
            ['recolhidoInicial', 'boolean', 'O menu já nasce recolhido.'],
            ['classeDoConteudo', 'string', 'Classe do contêiner @container do conteúdo.'],
          ]}
        />
        <Tabela
          titulo="AppSidebar"
          linhas={[
            ['nome / subtitulo', 'string', 'Nome do app e a linha pequena sob ele.'],
            ['marca', 'MarcaDoApp', 'logo, logoNoClaro, simbolo, alt. Padrão: /appfips-*.png.'],
            ['grupos', 'GrupoDoMenu[]', 'id, titulo?, itens: { id, rotulo, href, icone, ativo?, selo? }. Selo 0 ou vazio não aparece; recolhido vira ponto.'],
            ['modoDoMenu', '{ recolherAuto; segundos; aoMudarRecolherAuto; aoMudarSegundos }', 'Rodapé “Modo do menu” (obrigatório).'],
            ['versao', '{ numero; aoAbrir; rotulo?; dica? }', 'Rodapé “Versão” (obrigatório).'],
            ['recolhido / gavetaAberta', 'boolean', '68px ou 230px; gaveta de 256px no celular (sempre expandida).'],
            ['renderLink / aoNavegar', 'função', 'Link do roteador; aoNavegar fecha a gaveta.'],
          ]}
        />
        <Tabela
          titulo="AppHeader"
          linhas={[
            ['trilha', 'PassoDaTrilha[]', '“Home › Inspeção”. Some abaixo de 640px.'],
            ['abas / abaAtiva', 'AbaDeSecao[] / string', 'Faixa de abas com sublinhado que desliza (≥ 1024px). Sem href vira botão (aoSelecionarAba).'],
            ['sino', 'ReactNode', 'Normalmente <NotificacoesMenu />.'],
            ['procedimento / tutorial', 'AcaoDoCabecalho', '{ rotulo, aoClicar, icone?, ativo? }. Livro e capelo por padrão. Omitidos, não aparecem.'],
            ['tema', '{ atual: claro|escuro; aoAlternar }', 'Sol no escuro, lua no claro.'],
            ['usuario', 'ReactNode', 'UserAccountMenu com UserChip como gatilho.'],
            ['acoesExtras', 'ReactNode', 'Mais azulejos (HeaderTile) antes do sino.'],
            ['marca / hrefDaMarca', 'MarcaDoApp / string', 'Lockup do cabeçalho abaixo de 1024px (azul no claro, branco no escuro).'],
            ['chaveDeMedicao', 'unknown', 'Mude (ex.: a rota) para remedir o sublinhado.'],
          ]}
        />
        <Tabela
          titulo="UserChip"
          linhas={[
            ['nome', 'string (obrigatória)', 'Mostra primeiro e último nome; aria-label leva o nome inteiro.'],
            ['fotoUrl / iniciais / corDoAvatar', 'string', 'Foto (se falhar, iniciais), iniciais e cor do disco.'],
            ['aberto', 'boolean', 'Gira a seta e liga aria-expanded.'],
          ]}
        />
        <Tabela
          titulo="UserAccountMenu"
          linhas={[
            ['aberto / aoMudarAberto / gatilho', 'boolean / função / ReactNode', 'Estado controlado; o painel ancora no gatilho, em portal.'],
            ['usuario', 'UsuarioDaConta', 'nome, email?, cargo?, fotoUrl?, iniciais?, corDoAvatar?.'],
            ['selos', 'SeloDaConta[]', 'Selos do Badge sob o nome (perfil, área, ambiente).'],
            ['perfisDev', '{ titulo?; opcoes; ativo; aoEscolher }', 'Seção opcional “Perfil (Modo Dev)” (menuitemradio). Omita em produção.'],
            ['itens', 'ItemDaConta[]', 'Ações da conta. Fecham o menu ao clicar.'],
          ]}
        />
        <Tabela
          titulo="NotificacoesMenu"
          linhas={[
            ['secoes', 'SecaoDeNotificacoes[]', '{ titulo?, itens }. Item: { id, titulo, texto?, quando?, dica?, icone?, tom?, destaque?, aoClicar? }.'],
            ['contagem', 'number', 'Número do selo. Padrão: itens com destaque.'],
            ['rotuloDoSino / titulo / vazio', 'string', 'Textos.'],
            ['aoEscolher', '(item) => void', 'Depois de fechar o painel.'],
          ]}
        />
        <Tabela
          titulo="TutorialOverlay"
          linhas={[
            ['aberto / aoFechar', 'boolean / função', 'Estado controlado. Esc fecha; ← → e Enter navegam.'],
            ['passos', 'PassoDoTutorial[]', '{ titulo, descricao, alvo? }. Alvo é um seletor CSS (os ganchos do cabeçalho são data-tutorial). Passo cujo alvo não está na janela sai da lista. Passe lista estável.'],
          ]}
        />
      </Secao>

      <Secao titulo="Ganchos do tutorial">
        <p className="max-w-3xl text-sm leading-relaxed text-[var(--color-fg-muted)]">
          A casca marca os próprios elementos com <code>data-tutorial</code>:{' '}
          <code>menu</code>, <code>recolher-menu</code>, <code>abas</code>, <code>sino</code>,{' '}
          <code>procedimento</code>, <code>tutorial</code>, <code>tema</code> e <code>conta</code>. O app põe os
          dele (<code>cabecalho</code>, <code>conteudo</code>…) no conteúdo.
        </p>
      </Secao>
    </div>
  )
}
