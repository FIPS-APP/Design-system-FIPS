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
    version: '0.11.12',
    date: '2026-07-28',
    title: 'Removida a página Modal Radix',
    entries: [
      { type: 'improvement', description: 'Removida `/docs/components/modal-radix` do menu Componentes: arquivo `ModalRadixDoc.tsx`, lazy import/rota em `App.tsx`, entrada em `routes/nav.ts` e a referência na skill `components.md`. Rota antiga cai no catch-all e redireciona pra `/docs/home`.' },
      { type: 'improvement', description: 'A página demonstrava 3 coisas: `ExportPreviewModal` (também documentado em `/docs/patterns/data-listing` e no botão "Exportação" de `/docs/components/dialog` — não ficou órfão), o composite `Modal`/`ModalFooter` (`src/components/ui/Modal.tsx`, que só era usado ali — fica sem doc dedicada, mas o arquivo não foi apagado) e uma lista de tokens/anatomia do Dialog (só texto, sem consumidor de código).' },
    ],
  },
  {
    version: '0.11.11',
    date: '2026-07-28',
    title: 'Sidebar: "Modal (legado)" renomeado para "Modal"',
    entries: [
      { type: 'fix', description: 'Item do menu Componentes renomeado de "Modal (legado)" para "Modal" (`routes/nav.ts`) — já batia com o `<h1>` da própria página, só o rótulo do sidebar/breadcrumb estava desatualizado.' },
    ],
  },
  {
    version: '0.11.10',
    date: '2026-07-28',
    title: 'Modal (legado): removida a Seção 11 "Exportar Código"',
    entries: [
      { type: 'improvement', description: 'Removida a Seção 11 de `/docs/components/dialog` — três cards (Modal, TutorialModal, PopupModal) com botões "Ver código" (expandia um `<pre>` com o fonte completo) e "Copiar código". Junto saíram o helper local `CodeExport` e as 3 constantes de código copy-paste (`MODAL_CODE`, `TUTORIAL_MODAL_CODE`, `POPUP_MODAL_CODE`), que só essa seção consumia: 500 linhas removidas do arquivo.' },
      { type: 'improvement', description: 'A constante `EXPORT_MODAL_CODE` foi mantida — é usada pelo `Copyable` do botão "Exportação" (Seção 01), que segue alimentando o playground "Teste ao Vivo" no fim da página.' },
    ],
  },
  {
    version: '0.11.9',
    date: '2026-07-28',
    title: 'Button: removida a função de copiar da Seção 01 (Variantes do sistema)',
    entries: [
      { type: 'improvement', description: 'Os 10 botões de exemplo (Primário, Secundário, Contorno, Inverso, Fantasma, Destaque, Realce, Salvar, Perigo, Link) em `/docs/components/button` estavam envolvidos em `Copyable` — clique copiava um snippet standalone (`variantCode`) pro clipboard/playground da página. Removido: os botões agora são só preview visual, sem clique/cursor pointer. Texto da seção ajustado (não menciona mais "clique para copiar").' },
      { type: 'fix', description: 'Função `variantCode` (gerava o snippet copy-paste, ~50 linhas, sem outros usos) removida junto — ficaria morta no arquivo.' },
    ],
  },
  {
    version: '0.11.8',
    date: '2026-07-28',
    title: 'Cores: removida a função de copiar dos cards da Paleta principal',
    entries: [
      { type: 'improvement', description: 'Os cards da seção "Paleta principal" (`/docs/foundations/colors`) tinham dois mecanismos de cópia sobrepostos: o wrapper `Copyable` (card inteiro clicável, alimentava o playground no fim da página) e o botão de ícone `CopyHex` no rodapé do card. Ambos removidos — o card agora é só visual (amostra + nome + hex). As seções 02 (Tokens semânticos) e 03 (Paleta Dark Mode) mantêm o `CopyHex`.' },
      { type: 'fix', description: 'Efeito colateral positivo da remoção: os cards passam a preencher a largura da célula do grid. O `Copyable` usa `display: inline-flex` sem `width` (a não ser com a prop `fullWidth`), então cada card encolhia até o tamanho do próprio texto — larguras irregulares de 135–189px dentro de células de 329px, deixando buracos visíveis entre as colunas.' },
    ],
  },
  {
    version: '0.11.7',
    date: '2026-07-28',
    title: 'Configurações: removido badge "Preferências" do hero',
    entries: [
      { type: 'fix', description: 'Removidas as props `badgePill`/`badge="Preferências"` do `PatternPanelHero` em `ConfiguracoesDemo.tsx` (`/docs/patterns/configuracoes`) — o hero fica só com ícone, título e subtítulo.' },
    ],
  },
  {
    version: '0.11.6',
    date: '2026-07-28',
    title: 'Removidas páginas de padrão: Relatórios operacionais e Export modal',
    entries: [
      { type: 'improvement', description: 'Removidas as páginas `/docs/patterns/relatorios-operacionais` e `/docs/patterns/export-modal` do menu Padrões: arquivos `RelatoriosOperacionaisDemo.tsx`/`ExportModalDemo.tsx`, entradas em `routes/nav.ts`, lazy imports/rotas em `App.tsx` e o mapeamento em `TutorialContextual.tsx`. Rotas antigas caem no catch-all e redirecionam pra `/docs/home`, sem erro.' },
      { type: 'fix', description: 'O parágrafo "também em Padrões → Export modal" em `/docs/components/modal-radix` linkava pra a página removida — removido junto (o link ficaria quebrado). O comentário de referência no code sample de Exportação de `DialogDoc.tsx` e a lista de demos do `ExportPreviewModal` na skill `components.md` também atualizados.' },
      { type: 'improvement', description: 'Os composites reais `ExportModal` e `ExportPreviewModal` não foram tocados — seguem em uso normal em `/docs/patterns/data-listing`, `/docs/components/modal-radix` e no botão "Exportação" do playground de `/docs/components/dialog`. Só as páginas de demonstração dedicadas saíram do ar.' },
    ],
  },
  {
    version: '0.11.5',
    date: '2026-07-28',
    title: 'ExportPreviewModal: pill group Tudo/Tabela/Expandida menor',
    entries: [
      { type: 'fix', description: 'Pill group Tudo/Tabela/Expandida reduzido de 264×41 para 216×31: botões `px-3 py-1.5 text-[11px]`→`px-2 py-1 text-[10px]`, ícone `size={12}`→`size={11}`, container `p-1`→`p-0.5`, raios proporcionalmente menores (9/9/9/16 e 7/7/7/12).' },
    ],
  },
  {
    version: '0.11.4',
    date: '2026-07-28',
    title: 'ExportPreviewModal: fileira Tudo/Tabela/Expandida mais compacta',
    entries: [
      { type: 'fix', description: 'Seção do segmented control (Tudo/Tabela/Expandida + "Colunas visíveis na listagem") ocupava 70px de altura — reduzida para 58px: wrapper `px-6 py-3`→`px-6 py-2`, botões do segmented `px-4 py-2`→`px-3 py-1.5`, ícone `size={13}`→`size={12}`.' },
    ],
  },
  {
    version: '0.11.3',
    date: '2026-07-28',
    title: 'ExportPreviewModal: PDF vermelho, Excel verde escuro',
    entries: [
      { type: 'fix', description: 'Botão "PDF" do rodapé trocado de `variant="primary"` (azul) para `variant="danger"` (vermelho, `--color-danger`).' },
      { type: 'feature', description: 'Nova variante `successStrong` no `buttonVariants` governado (`button-variants.ts`) — sólido `--color-success-strong` (verde escuro) com hover pro `--color-success` (verde médio), inverso da variante `success` existente. Botão "Excel" passa a usar essa variante em vez de `success`.' },
    ],
  },
  {
    version: '0.11.2',
    date: '2026-07-28',
    title: 'Fix real: header do ExportPreviewModal cortado pelo overflow-hidden do painel',
    entries: [
      { type: 'fix', description: 'A v0.11.0 usava `-mx-6 -mt-6` no header pra cancelar o `p-6` default do `DialogContent` e fazer a faixa gov-gradient sangrar até a borda do painel. Só que o `<DialogContent>` do `ExportPreviewModal` já recebe `className="flex flex-col gap-0 overflow-hidden p-0 sm:p-0"` — zerando o padding via `cn()`/`twMerge` — então não havia `p-6` nenhum a cancelar. A margem negativa empurrava o header ~24px além do painel de verdade, e essa fatia inteira (ícone-tile, eyebrow, parte do título) sumia cortada pelo `overflow-hidden` do `DialogPrimitive.Content`. O fix da v0.11.1 (mover o botão fechar) tratou só um sintoma lateral do mesmo bug. Removida a margem negativa — o header já nasce encostado nos cantos do painel (padding real = 0), sem precisar de bleed.' },
    ],
  },
  {
    version: '0.11.1',
    date: '2026-07-28',
    title: 'Fix: botão de fechar do ExportPreviewModal cortado pelo canto do painel',
    entries: [
      { type: 'fix', description: 'O header gov-gradient novo (v0.11.0) posicionava o botão de fechar em `top-3.5 right-3.5` — o mesmo offset do `ChangelogModal`, copiado por analogia. Mas o `DialogContent` usa `rounded-2xl sm:rounded-[20px]`, um raio bem maior que o `rounded-[12px_12px_12px_24px]` do painel hand-rolled do `ChangelogModal`. Nesse offset o botão caía dentro da curva do canto e ficava cortado pelo `overflow-hidden` do painel — só um fragmento arredondado aparecia, sem o ícone X visível. Ajustado para `top-5 right-6`, testado em compacto, tela cheia e dark mode.' },
    ],
  },
  {
    version: '0.11.0',
    date: '2026-07-28',
    title: 'ExportPreviewModal: header canônico DS-FIPS + PDF/Excel juntos no rodapé',
    entries: [
      { type: 'fix', description: 'Header do `ExportPreviewModal` usava o header neutro genérico do `DialogContent` (ícone-tile cinza, sem eyebrow, sem gov-gradient) — divergindo do padrão canônico DS-FIPS já usado no `ChangelogModal` ("Novidades do Sistema", modal real de produto): faixa `var(--fips-banner-content-bg)`, ícone-tile 44×44 âmbar, eyebrow "EXPORTAÇÃO", JunctionLines decorativo, título 17px branco, botões Fechar/Tela cheia translúcido-branco. Header reescrito pra bater com essa anatomia — full-bleed via `-mx-6 -mt-6` (cancela o padding do `DialogContent`, clipado pelos cantos arredondados do painel via overflow-hidden do ancestral) + `DialogPrimitive.Title`/`Description` crus no lugar dos wrappers governados (que têm cor fixa incompatível com fundo escuro), mesma técnica do `ChangelogModal`. `DialogContent` ganhou `showCloseButton={false}` — o close agora é próprio, estilizado pro header escuro.' },
      { type: 'fix', description: 'Rodapé só mostrava Imprimir+Excel(antigo "Planilha") OU PDF, nunca os dois juntos — gate por `intent` (`isExcelIntent && onPrint`, `!isExcelIntent && onExportPdf` etc.), então quem passasse `intent="excel"` nunca via o botão PDF, mesmo passando a callback `onExportPdf`. Gate trocado por presença da própria callback (`onPrint && ...`, `onExportPdf && ...`, `onExportExcel && ...`) — `intent` agora só define o título/ícone default do header. Backward-compatible: quem já passava só 1-2 callbacks continua vendo só esses botões; quem passar as 3 (como o playground de `DialogDoc.tsx`) vê os 4 botões juntos.' },
      { type: 'fix', description: 'Botão de exportar Excel chamava "Planilha" e usava `variant="primary"` (azul, mesma cor do PDF) — renomeado para "Excel" e trocado para `variant="success"` (verde), diferenciando visualmente das outras ações.' },
      { type: 'improvement', description: 'Skill `design-system-fips` (`components.md`, repo + `~/.claude/skills/`) atualizada com a nova anatomia do header e a regra de rodapé por callback. Zip de download regenerado.' },
    ],
  },
  {
    version: '0.10.1',
    date: '2026-07-28',
    title: 'Modal (legado): ícones lucide-react + largura pra caber os 9 botões numa linha',
    entries: [
      { type: 'fix', description: 'Os 9 botões do playground de `Modal (legado)` (`/docs/components/dialog`, Seção 01) usavam emoji/símbolo Unicode como ícone (✓ ✕ ⚠ ℹ 📝 📋 🖥 ❓ 📤) — trocados por `lucide-react` (Check/X/AlertTriangle/Info/ClipboardEdit/ClipboardList/Maximize2/HelpCircle/Download), todos no mesmo peso visual do ✓ original de Confirmação. `Btn` (helper local da doc) ganhou prop opcional `icon`. Mesma troca replicada nos 2 gatilhos duplicados "Abrir tutorial" e "Abrir popup" das seções de aprofundamento.' },
      { type: 'fix', description: 'A fileira de 9 botões (~1105px) não cabia dentro da largura de conteúdo padrão (1100px) — "Exportação" quebrava pra uma 2ª linha sozinho. Aumentada para 1280px, só nesta página. De quebra, a página nunca tinha `margin:"0 auto"` no wrapper (única entre as páginas de doc) — conteúdo ficava encostado à esquerda em telas largas; adicionado. Cabe numa linha em 1920px+; em viewports menores (ex. 1440px) ainda quebra normalmente — menos largura de conteúdo disponível, comportamento responsivo esperado.' },
    ],
  },
  {
    version: '0.10.0',
    date: '2026-07-28',
    title: 'Modal (legado): 9ª variante "Exportação" no playground (ExportPreviewModal)',
    entries: [
      { type: 'feature', description: 'O playground de `Modal (legado)` (`/docs/components/dialog`, Seção 01) ganha um 9º botão, "Exportação", ao lado de Confirmação/Destrutivo/Alerta/Informativo/Formulário/Lista/Popup/Tutorial. Abre o composite real `ExportPreviewModal` (`src/components/composites/ExportPreviewModal.tsx`, paridade Tecnopano — Dialog Radix, faixa azul institucional, Tudo/Tabela/Expandida, chips com drag, preview e footer Cancelar/Imprimir/Planilha) — o mesmo já usado em `/docs/patterns/export-modal` e nos botões Excel/PDF de `/docs/patterns/data-listing`. Dados mock temáticos ao restante da página (REQ-4000+, "Requisição de compra N"). Não usa o `ExportModal` legado/portal.' },
    ],
  },
  {
    version: '0.9.2',
    date: '2026-07-27',
    title: 'Dialog FIPS + ExportPreviewModal polish',
    entries: [
      { type: 'fix', description: 'Faixa do Dialog em azul institucional (#004B9B→#93BDE4); hover do X em primary — sem vermelho Tecnopano.' },
      { type: 'fix', description: 'CTA Planilha usa Button variant primary (light/dark); Imprimir/Cancelar nas variants padrão.' },
      { type: 'fix', description: 'Tela cheia = 96dvh (vence sm:max-h do Dialog); Compacto = 85vh; só o preview rola na vertical.' },
      { type: 'improvement', description: 'ExportPreviewModal documentado em /docs/components/modal-radix (família Modal) além do pattern export-modal.' },
    ],
  },
  {
    version: '0.9.1',
    date: '2026-07-27',
    title: 'ExportPreviewModal (paridade Tecnopano)',
    entries: [
      { type: 'feature', description: 'ExportPreviewModal: Tudo/Tabela/Expandida, chips drag, preview, Tela cheia, Cancelar/Imprimir/Planilha|PDF — réplica de client/.../ExportPreviewModal.tsx.' },
      { type: 'improvement', description: 'DialogIconTile + close no Dialog; Data Listing e /docs/patterns/export-modal abrem o modal pelos botões Excel/PDF.' },
    ],
  },
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
