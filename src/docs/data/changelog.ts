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
    version: '0.6.3',
    date: '2026-07-03',
    title: 'Fix: previews dos padrões Login e Application Shell',
    entries: [
      { type: 'fix', description: 'A doc do padrão Login (`/docs/login`) nunca importava `login-ds.css` — sem ele, `.login-v1-container` renderizava como `display:block` em vez de `flex`, colapsando a coluna direita (card de vidro sem padding/tamanho, empurrado para o rodapé do preview). Import adicionado em `LoginPage.tsx`.' },
      { type: 'fix', description: 'Textos em pt-BR do padrão Login estavam sem acentuação ("Eficiencia", "Colaboracao", "Rota dos principios" etc.) em `LoginDsShell.tsx` e nos exemplos de código copiáveis da doc — corrigido para "Eficiência", "Colaboração", "Rota dos princípios".' },
      { type: 'fix', description: 'Preview do playground ficava esticado a `100svh` (herdado do `.login-v1-container` real, pensado pra tela cheia do app consumidor) — dentro do card da doc isso significava ~1000px de altura. Adicionado override escopado (`.login-doc-preview .login-v1-container`) fixando 720px só no preview, sem alterar o componente real.' },
      { type: 'fix', description: 'Mockup do padrão Application Shell (`/docs/patterns/application-shell`) estava com a imagem de fundo do hero em full-bleed com degradê pesado por cima — divergia do hero canônico `PageHero`. Agora usa o mesmo tratamento: degradê azul institucional como base + foto do trem sutil à direita (`opacity 0.24`, `mix-blend-soft-light`).' },
      { type: 'fix', description: 'Header do mesmo mockup usava botões de ícone chapados e uma busca com "Q" solto no lugar do ícone. Trocado pelos botões neumorphic canônicos (`DocHeaderNeuIconButton`, hover dourado + shimmer) e busca com ícone `Search` real.' },
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
