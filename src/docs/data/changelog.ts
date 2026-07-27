/**
 * Fonte única do changelog do Design System FIPS.
 * Consumida por:
 *  - `src/docs/pages/ChangelogPage.tsx` (timeline em /docs/changelog)
 *  - `src/components/layout/ChangelogModal.tsx` (modal "Novidades", botão Versão do rodapé)
 *
 * Ao lançar uma versão, adicione a entrada no topo e atualize `package.json`,
 * `DOC_VERSION` (DocLayout) e o README.
 */

export type ChangelogType = 'feature' | 'fix' | 'improvement' | 'breaking'

export interface ChangelogEntry {
  type: ChangelogType
  description: string
}

export interface ChangelogVersion {
  version: string
  /** ISO yyyy-mm-dd */
  date: string
  title: string
  entries: ChangelogEntry[]
}

export const CHANGELOG: ChangelogVersion[] = [
  {
    version: '0.9.0',
    date: '2026-07-27',
    title: 'Data Listing parity Tecnopano (export, KPIs, menu radial)',
    entries: [
      { type: 'feature', description: 'ExportButtons + ExcelIcon/PdfIcon: par 32.5×32.5 Excel/PDF com hover tintado (convenção de extensão).' },
      { type: 'feature', description: 'StatsCard clicável (onClick/selected) + ListingKpiRow — Indicadores rápidos no panelHeader da toolbar.' },
      { type: 'feature', description: 'CircularCommandMenu + RowActionsMenu — menu radial de ações da linha (peer framer-motion).' },
      { type: 'improvement', description: 'Data Listing demo: KPIs no card da toolbar, ExportButtons e radial na coluna Ações.' },
    ],
  },
  {
    version: '0.8.0',
    date: '2026-07-27',
    title: 'StatsCard e HowItWorksCard (Home Suprimentos)',
    entries: [
      { type: 'feature', description: 'StatsCard + StatsCardGrid: KPI compacto Tecnopano/Home (texto à esquerda → ícone circular, borda accent, grade até 7 cols no xl).' },
      { type: 'feature', description: 'HowItWorksCard + HowItWorksGrid: réplica da seção Como Funciona da Home Suprimentos (badge numerada, ícone em caixa, grade 1/2/3/7 no lg+).' },
      { type: 'improvement', description: 'Documentação em /docs/components/card — seções 03b (Stats) e 03c (Como Funciona).' },
    ],
  },
  {
    version: '0.7.0',
    date: '2026-07-06',
    title: 'Novo padrão: Filtros avançados (drawer + barra de chips)',
    entries: [
      { type: 'feature', description: 'Barra de Filtros do padrão Dashboard (`/docs/patterns/dashboard`) trocada de um grid de 6 `DSSelect` (boxes rotulados, label acima, 30px) para uma linha de chips (`ChipSelect`, 32.5px, "Label: Valor" inline + dropdown com radio) — mesmo padrão do `FilterBar` real do Governança BI (`KpiDashboardPage.tsx`). Ocupa uma linha só em vez de duas, e os chips com valor ativo ganham destaque de cor (borda/fundo azul).' },
      { type: 'feature', description: 'Drawer "Filtros avançados" (`/docs/components/drawer`) reescrito seguindo o padrão já especificado em `patterns.md` ("Filtros avançados — barra de chips + drawer", referência real: `Governanca_BI/src/pages/KpiDashboardPage.tsx`), que ainda não tinha implementação viva no DS-FIPS. Header gov-gradient com tile âmbar + eyebrow + subtítulo com contador dinâmico de filtros ativos ("N filtros ativos") + botão fechar próprio.' },
      { type: 'feature', description: 'Novo componente local `PillFilterGroup`: filtro segmentado single-select para campos de poucas opções (Status, Prioridade). Ativo com cor = fundo cheio da cor semântica + texto branco; inativo com cor = dot colorido; sem cor = azul primário — exatamente como especificado no spec da skill.' },
      { type: 'fix', description: '`FSelect` local do `DrawerDoc.tsx` (Tipo, UF etc. nos outros 5 drawers de exemplo) delega agora para o `Select` governado, mesma correção já aplicada no `DialogDoc.tsx`.' },
      { type: 'fix', description: 'No drawer "Filtros avançados", Departamento/Segmento (via `Select` governado, 36px) ficavam maiores que os campos de data (30px) — descoberto ao medir ao vivo. Como o `Select` governado não tem variante de 32.5px (e a regra `no-visual-overrides` proíbe forçar `h-` nele), criado o componente local `ChipSelect`: dropdown custom com radio, mesmo padrão dos chips de filtro da toolbar (`ChipSelect` real do Governança BI) — 32.5px, igual às datas (`FInput` ganhou prop `height` pra isso). Único caso de um campo de seleção *não* usar o `Select` governado — aqui é o padrão de filtro, não o de formulário.' },
      { type: 'fix', description: 'Drawer de Filtros a 360px de largura tinha overflow horizontal de ~6px (barra de rolagem) — os dois campos de data lado a lado (`1fr 1fr`) precisavam de ~166px cada e não cabiam. Largura aumentada para 400px (a mesma do drawer real do Governança BI, `max-w-[400px]`): a barra some e, de bônus, os 4 pills de Status passam a caber em uma linha.' },
      { type: 'improvement', description: 'Os outros 4 drawers de exemplo (Detalhe, Ação rápida, Editar fornecedor, Ocorrência) ganharam o mesmo header hero institucional do Filtros — gov-gradient 3-stops + tile âmbar com ícone + eyebrow dourado + título/subtítulo branco + X próprio — cumprindo a regra canônica "todo modal/drawer com título usa header hero" (antes usavam o header branco simples). Marcação extraída num helper local `HeroHeader` (com `radius` opcional pros cantos arredondados do bottom drawer).' },
      { type: 'fix', description: 'Sidebar real (`#docs-app-sidebar`, `DocLayout.tsx`) tinha `shadow-[4px_0_32px_rgba(0,26,64,0.36)]` — um box-shadow com offset positivo em X que vazava visivelmente pra direita, sobre o conteúdo. O dark mode já cancelava com `shadow-none`; o light mode não. Sombra removida dos dois temas (nenhuma outra tela duplicava essa classe pra sincronizar).' },
    ],
  },
  {
    version: '0.6.3',
    date: '2026-07-03',
    title: 'Fix: previews dos padrões Login, Application Shell e Data Listing',
    entries: [
      { type: 'fix', description: 'Campos de seleção (Tipo, Prioridade etc.) nos previews de modal da doc de Dialog (`/docs/components/dialog`) usavam um `FSelect` local — um `<select>` nativo com chevron estático, fora do padrão. Agora o `FSelect` delega para o `Select` governado (dropdown customizado com chevron que rotaciona, check no item selecionado, tokens e dark mode), sem mexer nas chamadas.' },
      { type: 'fix', description: 'Campo "Prazo" dos mesmos previews era um texto comum com placeholder estático "dd/mm/aaaa" — sem seletor de data de verdade. `FInput` ganhou suporte a `type` (default `"text"`) e "Prazo" agora usa `type="date"`, mesmo padrão nativo já usado em `DataListingDemo.tsx`/`ModalFormDemo.tsx` — abre o calendário do navegador.' },
      { type: 'fix', description: 'A doc do padrão Login (`/docs/login`) nunca importava `login-ds.css` — sem ele, `.login-v1-container` renderizava como `display:block` em vez de `flex`, colapsando a coluna direita (card de vidro sem padding/tamanho, empurrado para o rodapé do preview). Import adicionado em `LoginPage.tsx`.' },
      { type: 'fix', description: 'Textos em pt-BR do padrão Login estavam sem acentuação ("Eficiencia", "Colaboracao", "Rota dos principios" etc.) em `LoginDsShell.tsx` e nos exemplos de código copiáveis da doc — corrigido para "Eficiência", "Colaboração", "Rota dos princípios".' },
      { type: 'fix', description: 'Preview do playground ficava esticado a `100svh` (herdado do `.login-v1-container` real, pensado pra tela cheia do app consumidor) — dentro do card da doc isso significava ~1000px de altura. Adicionado override escopado (`.login-doc-preview .login-v1-container`) fixando 720px só no preview, sem alterar o componente real.' },
      { type: 'fix', description: 'Mockup do padrão Application Shell (`/docs/patterns/application-shell`) estava com o overlay do hero errado (degradê diagonal pesado). Agora replica o hero real da HomePage: imagem full-bleed (`object-center`) + overlay azul vertical `#002A68/60→45→60` + vinheta preta.' },
      { type: 'fix', description: 'Header do mesmo mockup usava botões de ícone chapados e uma busca com "Q" solto no lugar do ícone. Trocado pelos botões neumorphic canônicos (`DocHeaderNeuIconButton`, hover dourado + shimmer). Campo de busca removido e o chip "AF Usuário" (estático, sem menu) trocado pelo `UserChip` canônico (`variant="docHeader"`) — menu de conta completo, com portal, igual ao header real.' },
      { type: 'improvement', description: 'Botões "Ação Primária"/"Ação Secundária" do hero do mockup Application Shell reduzidos de `lg` para `sm`, igual ao hero real da Home.' },
      { type: 'improvement', description: 'Cards de indicador do hero (`HeroMetricCard`) mais compactos: label truncado em uma linha (estava quebrando em duas dentro da coluna estreita ao lado do ícone), padding `p-6`→`p-3.5`, ícone `44px`→`32px`, valor `text-3xl`→`text-2xl`. Altura do card caiu de 118px para 96px.' },
      { type: 'improvement', description: 'Área de conteúdo do mockup: os blocos "Bloco visual 1/2/3" eram caixas cinza chapadas só com o rótulo — agora são tiles com ícone colorido + rótulo + legenda descrevendo o slot; linhas do "Complemento" ganharam dot âmbar e as "Notas visuais" um check verde em círculo, deixando a área menos placeholder e mais intencional.' },
      { type: 'fix', description: 'Os 3 blocos visuais em grid de 3 colunas ficavam espremidos na coluna estreita da "Área principal" (~90-110px cada), com rótulo e legenda quebrando em várias linhas. Trocados por uma pilha de linhas horizontais (ícone à esquerda + rótulo + legenda ao lado), cada uma na largura toda da coluna — some com o aperto em qualquer largura.' },
      { type: 'improvement', description: 'Card "Notas visuais" reformulado: eram 3 caixas cinza pesadas e repetitivas num card que esticava a 642px (alinhado ao card vizinho) com metade vazia embaixo. Agora é `self-start` (altura natural, sem espaço morto) com header de ícone + checklist limpa (checks verdes, divisórias hairline, texto com mais contraste).' },
      { type: 'fix', description: 'Sidebar do mockup (`ShellSidebar`) divergia do sidebar real em dois pontos, encontrados ao comparar com `DocsNeuSidebar.tsx`: gap entre logo e "Design System" era 14px (real: 2px) e o logo tinha `maxWidth:148/minWidth:72` (real: `100/60`) — corrigido para bater exato. Botão "Modo menu" do rodapé era só decorativo (hover, sem estado); adicionado o indicador de estado à direita ("Manual"), igual ao real — sem replicar o popover inteiro de configuração, que é chrome específico do site DS-FIPS.' },
      { type: 'fix', description: 'Header mobile do mockup não seguia o padrão mobile real (que depende de breakpoints CSS `sm:` — inertes dentro do frame "mobile" simulado, já que o navegador de teste continua largo): breadcrumb "Padrões / Home" agora vira a logo colorida `appfips-logo-full.png` (como `DocHeaderPageTrail` faz de verdade), `UserChip` completo (nome + cargo) vira avatar isolado (mesma regra do `UserChip` real), e os 3 ícones do header (Notificações/Tutorial/Tema) voltam a aparecer — o mockup ainda escondia Tutorial/Tema no mobile, um padrão antigo já corrigido no header real nesta mesma sessão.' },
      { type: 'fix', description: 'Toolbar do padrão Data Listing (`/docs/patterns/data-listing`) tinha 3 campos fora do padrão de altura desktop (32.5px, referência: botão "Período"): a Busca tinha `height:35` e os botões Excel/PDF tinham `34×34` — ambos corrigidos para `32.5px`, alinhando toda a linha (Filtros/Busca/Período/Excel/PDF) na mesma altura.' },
      { type: 'improvement', description: 'Página Stacks (`/docs/stacks`): card de gráficos trocado de Recharts para Apache ECharts (descrição, destaques e link oficial), refletindo a decisão de migrar a lib de data viz dos dashboards FIPS.' },
      { type: 'improvement', description: 'Migração de código: o mini-donut de progresso do padrão Dashboard (`DashboardDemo.tsx`, cards "Status das solicitações") trocou de Recharts para Apache ECharts (init manual via `echarts/core` + `echarts/charts` + `CanvasRenderer`, sem `echarts-for-react`). Dependência `recharts` removida do `package.json` (devDependency, só usada pelo site de docs — sem impacto em quem consome a library); `echarts` adicionado no lugar. Comportamento visual idêntico (anel estático, sem animação, cor cheia + trilho translúcido).' },
      { type: 'fix', description: 'Na variante tablet do mockup Application Shell, os cards de indicador ficavam colados nos botões do hero (gap real ~2px). Causa: o frame de 620px era curto demais e o flex comprimia o wrapper `overflow-hidden` do hero, clipando-o na altura dos botões. Frame do tablet aumentado para 720px (hero cabe inteiro, sem clip) — o straddle `-mt-6` volta a funcionar e sobra ~32px entre botão e card.' },
    ],
  },
  {
    version: '0.6.2',
    date: '2026-07-02',
    title: 'Header mobile refinado + skill sincronizada',
    entries: [
      { type: 'improvement', description: 'Chip de usuário no mobile mostra só o avatar (32px, clicável, sem fundo/borda/chevron); ícones de Notificações e Tutorial voltam a aparecer nesse breakpoint; marca do trilho mobile passa a usar o logo colorido oficial (`appfips-logo-full.png` — "App" cinza + "FIPS" azul), sem chip/fundo/borda.' },
      { type: 'improvement', description: 'Padding direito do header reduzido um degrau (`pr-3`/`sm:pr-5`, antes simétrico com o esquerdo).' },
      { type: 'improvement', description: 'Skill `design-system-fips` (`patterns.md`, `source-of-truth.md`) passa a documentar a anatomia completa do Header — ícone neumorphic 36px, trilho responsivo, `UserChip`/`UserAccountMenu` e os tokens de hover fixos que evitam o bug de contraste no dark mode.' },
    ],
  },
  {
    version: '0.6.1',
    date: '2026-07-02',
    title: 'Trilho do header vira logo no mobile',
    entries: [
      { type: 'improvement', description: 'No mobile (abaixo de `sm`), o trilho "grupo / página" do header (`DocHeaderPageTrail`) some e dá lugar à marca FIPS (mesmo ícone do sidebar colapsado), num chip azul com contraste garantido no claro e no escuro. A partir de `sm`, o breadcrumb em texto volta normalmente.' },
    ],
  },
  {
    version: '0.6.0',
    date: '2026-07-02',
    title: 'Minha Conta: chip do header vira interativo',
    entries: [
      { type: 'feature', description: 'Novo menu "Minha Conta" (`UserAccountMenu`): painel ancorado embaixo do chip do header (não é modal), com perfil ativo, badge de perfil e ações Meu perfil / Preferências / Sair.' },
      { type: 'feature', description: 'Seletor "Trocar de perfil (demo)" com 4 perfis (Colaborador, Gestor, Diretoria, Administrador), cargo e cor por perfil no avatar e no rótulo.' },
      { type: 'improvement', description: 'Chip de usuário do header (`UserChip`, variante `docHeader`) passa a ser clicável, com nome + cargo em duas linhas coloridas por perfil, no claro e no escuro.' },
    ],
  },
  {
    version: '0.5.5',
    date: '2026-06-25',
    title: 'Modais e campos padronizados',
    entries: [
      { type: 'feature', description: 'Header de modal padronizado: eyebrow + título 21px (Saira) + ícone-tile com acento (fundo gov → âmbar, fundo semântico → branco).' },
      { type: 'improvement', description: 'Exemplo de modal informativo trocado para «Movimentação de Pátio».' },
      { type: 'improvement', description: 'Campos de formulário em modais no padrão compact (altura 36px, radius 12px, texto 14px).' },
      { type: 'fix', description: 'Correção do rodapé do sidebar que descia com o scroll (sticky quebrado por overflow-hidden em ancestral).' },
      { type: 'improvement', description: 'Skill bundle design-system-fips atualizado (Badge, rodapé do sidebar e governança de novo projeto).' },
    ],
  },
  {
    version: '0.5.4',
    date: '2026-06-23',
    title: 'Sidebar colapsável e histórico em timeline',
    entries: [
      { type: 'improvement', description: 'Sidebar: categorias colapsáveis com cabeçalho tipográfico (uppercase, tracking 0.08em) e colapso animado — navegação unificada entre DS-FIPS, Suprimentos e Governança BI.' },
      { type: 'improvement', description: 'Página «Histórico de versões» (antiga «Changelog») reescrita como timeline, com o tipo de versão derivado automaticamente.' },
      { type: 'improvement', description: 'Rodapé do sidebar: ação «Menu automático» renomeada para «Modo menu».' },
    ],
  },
  {
    version: '0.5.3',
    date: '2026-06-22',
    title: 'Remoção do «Ver código»',
    entries: [
      { type: 'improvement', description: 'Remoção completa da função «Ver código» (CodeExportSection) das páginas de documentação.' },
      { type: 'fix', description: 'Correção do build quebrado por imports órfãos.' },
    ],
  },
  {
    version: '0.5.2',
    date: '2026-05-22',
    title: 'Modal em modo escuro',
    entries: [
      { type: 'fix', description: 'DialogTitle e Modal: título em branco no modo escuro (dark:text-white), alinhado ao ChangelogModal do Suprimentos.' },
    ],
  },
  {
    version: '0.5.1',
    date: '2026-05-22',
    title: 'Composite Modal Radix',
    entries: [
      { type: 'feature', description: 'Composite Modal + ModalFooter (Radix Dialog): padrão ChangelogModal do Suprimentos — X top-5/right-5, rodapé surface-muted, botão «Entendi, continuar».' },
      { type: 'feature', description: 'Nova página /docs/components/modal-radix com demo interativa e anatomia do padrão.' },
      { type: 'improvement', description: 'Tutorial contextual: faixa superior azul, dots de progresso laranja, overlay azul e hover do fechar em azul.' },
    ],
  },
  {
    version: '0.5.0',
    date: '2026-05-22',
    title: 'Sync visual FIPS Suprimentos',
    entries: [
      { type: 'feature', description: 'Sync visual FIPS Suprimentos: FipsTabBar (abas segmentadas), Switch, SettingsPreferenceRow e PatternPanelHero.' },
      { type: 'feature', description: 'Novos padrões documentados: Configurações, Relatórios operacionais e Export modal.' },
      { type: 'feature', description: 'Página Switch + seção 05 Segmented na documentação de Tabs; tokens semânticos e banners em globals.css.' },
      { type: 'feature', description: 'Pacote exports: fips-tab-bar, switch, settings-preference-row, pattern-panel-hero.' },
    ],
  },
  {
    version: '0.4.0',
    date: '2026-04-07',
    title: 'Catálogo expandido e distribuição para IA',
    entries: [
      { type: 'improvement', description: 'Versão oficial do produto alinhada para 0.4.0 no app, package metadata, guia público e páginas standalone.' },
      { type: 'feature', description: 'Catálogo expandido com reescrita das páginas de Button, Input, Select, Textarea, Progress, Badge, Field, Card, Tabs, Table, Dialog, Drawer, Toast e Tooltip.' },
      { type: 'feature', description: 'Padrão Dashboard concluído com visualização rica, exportação em PDF e alinhamento das foundations.' },
      { type: 'feature', description: 'Nova camada de distribuição para IA com documentação consolidada para download e skill portátil.' },
    ],
  },
  {
    version: '0.3.0',
    date: '2026-04-01',
    title: 'Shell da documentação e governança',
    entries: [
      { type: 'feature', description: 'Shell principal da documentação consolidado com navegação lateral, changelog, governança e divisão por foundations/components/patterns.' },
      { type: 'feature', description: 'Introdução de PageHero, FipsLogo, composição de Field e InputGroup, e primeiras regras formais de governança.' },
      { type: 'improvement', description: 'Fluxos de modal e form workspace reposicionados para o padrão visual (densidade e hierarquia consistentes).' },
    ],
  },
  {
    version: '0.2.0',
    date: '2026-03-31',
    title: 'Rotas lazy e base visual',
    entries: [
      { type: 'improvement', description: 'Documentação reorganizada por rotas lazy-loaded, com redução do peso inicial.' },
      { type: 'improvement', description: 'Base visual refinada com tokens mais estáveis, sidebar institucional, superfícies e shadows do Brandbook FIPS.' },
      { type: 'feature', description: 'Primeira rodada de vitrines editoriais para consolidar a linguagem visual.' },
    ],
  },
  {
    version: '0.1.0',
    date: '2026-03-24',
    title: 'MVP da documentação',
    entries: [
      { type: 'feature', description: 'MVP da documentação navegável com menu lateral responsivo.' },
      { type: 'feature', description: 'Tokens de cor e tipografia alinhados ao Brandbook FIPS.' },
      { type: 'feature', description: 'Biblioteca inicial: Button, Input, Select, Textarea, Badge, Card, Tabs, Table, Dialog, Drawer, Tooltip e Toast.' },
      { type: 'feature', description: 'Padrões de referência: dashboard, tabela de certificados e modal de formulário.' },
    ],
  },
]

export const CURRENT_VERSION = CHANGELOG[0].version
