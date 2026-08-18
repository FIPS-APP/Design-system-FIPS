# Patterns

## Application Shell

Fontes:

- `src/docs/pages/patterns/ApplicationShellDemo.tsx`
- Header canónico do shell de documentação: `src/components/layout/DocHeaderStandard.tsx` (`DocHeaderHeroBackground`, `DocHeaderStandardPreview`), `DocHeaderNeuIconButton.tsx`, `src/lib/docHeaderChrome.ts`; `src/app/DocLayout.tsx` consome estes módulos.
- **Tecnopano 3.0** (raiz Vite `client/`): demo isolada `tecnopano/ApplicationShellDemo.tsx` (rota `/shell-demo`), app real `src/components/layout/Header.tsx` — mesma pilha de classes e componentes espelhados.
- `public/guias/guia-design-system-fips.md`

Regras:

- Sidebar institucional escura
- Hierarquia clara entre menu, hero e conteúdo
- Tabs horizontais no desktop
- Menu sobreposto no mobile
- Conteúdo principal em superfície clara com scroll interno

Não faça:

- lateral neutra ou preta sem relação com o azul FIPS
- tabs genéricas destacadas por cor aleatória
- headers sem contraste ou sem separação visual entre navegação e conteúdo

### Header

Fontes: `src/components/layout/DocHeaderStandard.tsx` (`DocHeaderStandardPreview`), `DocHeaderPageTrail.tsx`, `DocHeaderNeuIconButton.tsx`, `UserChip.tsx`, `UserAccountMenu.tsx`, `src/lib/docHeaderChrome.ts`. Header real: `src/app/DocLayout.tsx` (monta os mesmos módulos + tema/notificações). A doc do componente (`HeaderDoc.tsx`) e a do padrão (`HeroHeaderDoc.tsx`) renderizam `DocHeaderStandardPreview` diretamente — não há cópia manual para manter em sincronia.

Duas faixas empilhadas num único `<header overflow-hidden>` (o `overflow-hidden` clipa o art decorativo de fundo — mesmo motivo pelo qual o painel do `UserAccountMenu` precisa de portal, ver abaixo):

1. **Faixa superior** (`docHeaderBarTop`, sempre visível) — `flex items-center gap-3 py-3 pr-3 pl-4 sm:pr-5 sm:pl-6` (padding direito um degrau menor que o esquerdo, decisão intencional). Da esquerda pra direita: botão hambúrguer (`lg:hidden`, abre a sidebar mobile) → `DocHeaderNeuIconButton` recolher/expandir sidebar (`hidden sm:inline-flex`) → `DocHeaderPageTrail` (`flex-1`) → cluster de ações (ícones + divisor `h-6 w-px` `hidden sm:block` + `UserChip variant="docHeader"`). **Sem campo de busca** — o `SearchPill` foi removido do header na v0.13.0 (componente deletado, sem consumidor); a navegação é pelo menu lateral.
2. **Faixa de tabs** (`docHeaderBarTabs`, `hidden lg:block`) — `DocHeaderSectionNav`; some completamente abaixo de `lg` (navegação mobile vive só na sidebar).

Não faça:

- padding simétrico nas duas margens do header — a direita é intencionalmente menor que a esquerda
- esconder Notificações/Tutorial no mobile — os dois ícones aparecem ao lado do avatar em qualquer breakpoint (já regrediu uma vez)

#### `DocHeaderNeuIconButton` — azulejo 36×36

Mesmo sistema neumorphic dos itens de sidebar/menu: `36×36`, `border-radius 10`, gradiente idle claro/escuro, hover amarelo FIPS + shimmer diagonal (`docsSidebarNeuShimmer 0.5s`) + `translateY(-1px)`. Tokens em `docHeaderChrome.ts`:

| Estado | Borda | Fundo | Ícone |
|---|---|---|---|
| Idle claro | `rgba(0,0,0,.10)` | `linear-gradient(145deg,#fff 0%,#ebebeb 55%,#e0e0e0 100%)` | `rgba(55,55,55,.82)` |
| Idle escuro | `#3f3f46` | `linear-gradient(160deg,#303036 0%,#222226 55%,#1c1c20 100%)` | `#a1a1aa` |
| Hover (claro **e** escuro) | `rgba(246,146,30,.55)` | `linear-gradient(135deg,#FFD37B,#f7ad45 34%,#F6921E 64%,#cf730d 100%)` | `#002A68` (`docHeaderNeuAccentIcon`, fixo) |

Usado por: recolher-sidebar, Notificações (`Bell`), Tutorial (`GraduationCap`), tema (`SunMoon`, só no `DocLayout` real) e como base do hover do `UserChip`.

Não faça:

- colorir ícone/texto em hover dourado com um token que muda no dark mode (ex. `var(--color-gov-azul-escuro)`, que vira `#658EC9` no escuro e some contra o fundo claro do hover) — usar sempre `docHeaderNeuAccentIcon`, fixo nos dois temas

#### `DocHeaderPageTrail` — trilho responsivo

- **`sm+`**: breadcrumb `Grupo / Página` (Open Sans 11–12px muted + `/` + título `font-heading` semibold); se `groupLabel === pageTitle`, mostra só o título.
- **`<sm` (mobile)**: o breadcrumb some por completo; no lugar aparece a marca colorida `App FIPS` (`/appfips-logo-full.png` — "App" cinza + ícone/"FIPS" azul; **não** é o mesmo asset branco da sidebar), `h-8 w-auto object-contain`, direto sobre o header — **sem chip, sem fundo, sem borda** (decisão explícita após iteração).

Não faça:

- usar `/appfips-logo.png` (branco, feito pro azul-escuro da sidebar) ou `/appfips-mark-collapsed.png` no trilho mobile — ver os 3 assets em `source-of-truth.md`
- adicionar fundo/chip atrás da marca mobile

#### `UserChip` (`variant="docHeader"`) + `UserAccountMenu`

- **Hover do chip** reaproveita o mesmo sistema do `DocHeaderNeuIconButton` (idle/hover/shimmer de `docHeaderChrome.ts`) — um único caminho (`docHeader`) serve claro e escuro; nome, cargo e chevron ficam `docHeaderNeuAccentIcon` no hover, igual aos ícones vizinhos. Cores de avatar/cargo por perfil vêm de `FIPS_ROLE_COLOR`/`FIPS_ROLE_LABEL` (`src/docs/data/users.ts`).
- **Responsivo**:

  | | `sm+` (desktop) | `<sm` (mobile) |
  |---|---|---|
  | conteúdo | avatar 28px + nome + cargo + chevron | só avatar, **32px** |
  | fundo/borda/sombra/shimmer | sim (neumorphic completo) | não |
  | clicável, abre `UserAccountMenu` | sim | sim |

- **`UserAccountMenu`** é painel ancorado abaixo do chip (`align="end"`), **não** modal centralizado — replica o dropdown do Governança BI. Vai para `createPortal(document.body)`: os headers do DS (`DocLayout`, `DocHeaderStandard`) têm `overflow-hidden` (clip do art de fundo) que cortaria um painel `absolute` in-place. Posição recalculada por `getBoundingClientRect` do trigger em `resize`/`scroll`. Fecha em clique-fora ou `Esc`.
- **Hover dos itens do menu**: `bg-[var(--color-accent)]/20` (claro) / `/12` (escuro) + ícone da linha para `--color-accent-strong` — não usar `surface-muted` (contraste baixo demais, hover fica imperceptível).

Não faça:

- separar a lógica de hover clara/escura no `UserChip` (branch `if (dark)` isolado com hover próprio) — já causou o chip ficar sem o efeito dourado no tema escuro enquanto os ícones vizinhos tinham
- renderizar o painel do `UserAccountMenu` `absolute` in-place dentro de um header — o `overflow-hidden` do header corta o painel

### Sidebar — categorias colapsáveis

Fonte: `src/components/layout/DocsNeuSidebar.tsx` (`DocNavItem`). Playground espelhado: `src/docs/pages/components/SidebarDoc.tsx` (`SidebarItem`) — os dois devem renderizar a categoria igual.

Grupo de nível 0 com filhos (`hasChildren && depth === 0`) é **cabeçalho de categoria colapsável**, nunca um item de navegação. Padrão unificado FIPS: tipografia do Governança BI + mecânica de colapso do Suprimentos.

- **Separador** acima do cabeçalho (`borderTop 1px` na cor de borda da sidebar; margin `0 14px 2px`).
- **Cabeçalho** (`<button aria-expanded>`): ícone 14px (`strokeWidth 2`) + label + chevron. Label em Open Sans `10.5px / 600 / letter-spacing 0.08em / uppercase`, cor `rgba(255,255,255,0.45)` (idle) → `0.58` (hover) → `0.62` (ativo). Hover do botão: `background rgba(255,255,255,0.04)`, `border-radius 8px`.
- **Chevron** `ChevronDown`/`ChevronRight` 14px, rotaciona 180° ao abrir (`transition: transform 0.2s`).
- **Colapso**: wrapper dos filhos com `max-height: open ? 2000 : 0`, `opacity`, `overflow:hidden`, `transition: max-height 0.22s ease, opacity 0.18s ease`.
- **Auto-abre pela rota**: a categoria que contém o item ativo já inicia aberta.
- **Modo rail** (sidebar recolhida): o cabeçalho some; os filhos viram ícones soltos sob um separador (`margin 8px 14px 4px`).
- **Itens-filho** mantêm o tile neu 36px (`SidebarNeuIcon36`) + label 13px / `letter-spacing 0.01em`.

Registro da estrutura: marque o grupo com `collapsible?: boolean` no tipo de `src/routes/nav.ts`.

Não faça:

- renderizar a categoria com o mesmo tile 36px do item (confunde categoria com item — era o estado antigo, removido)
- combinar sentence case com `letter-spacing 0.08em` (o tracking foi desenhado para caixa-alta; o section-label do sidebar é **uppercase**)

### Sidebar — rodapé completo (Modo menu + utilitários)

Fonte: `src/components/layout/DocsNeuSidebar.tsx` (rodapé). Bloco fixo no fim da sidebar com 4 itens, **nesta ordem**: **Modo menu** → **Primeiro acesso** → **Repositório** → **Versão**.

Vive no rodapé fixo (`flex-shrink:0`, `borderTop 1px` na cor de borda, `padding 8px 0 10px`), **fora** do `<nav>` (que tem `flex-1`), como sibling.

#### Linha-base compartilhada (vale para os 4 itens)

`flex items-center gap-2 rounded-md text-[11px] transition`, label em Open Sans (`F.body`) `font-medium truncate`, ícone 14px (`h-3.5 w-3.5 shrink-0`). Geometria reativa ao colapso:

| | Expandido | Rail (colapsado) |
| --- | --- | --- |
| `justifyContent` | `flex-start` | `center` |
| `padding` | `6px 8px` | `6px 0` |
| `width` | `calc(100% - 16px)` | `52` |
| `margin` | `1px 8px` | `1px auto` |

- **Cor idle** `rgba(255,255,255,0.55)` (`theme.chevron`). **Hover** (todos menos Versão): `background rgba(255,255,255,0.04)` + `color rgba(255,255,255,0.8)`.
- **No rail**: só o ícone centralizado; o label some (`{!collapsed ? … : null}`).

#### 1. Modo menu (pílula + popover de auto-colapso)

Controla se a sidebar recolhe sozinha. É o único item interativo com popover.

- **Pílula** (`<button aria-haspopup="dialog" aria-expanded>`): ícone `Timer` + label "Modo menu" + badge de estado em fonte mono 10px (`rgba(255,255,255,0.4)`) — `Auto · {n}s` ou `Manual`. Aberta: `background rgba(255,255,255,0.06)` + `color rgba(255,255,255,0.85)`. Tem `data-tour-step="menu-auto"`.
- **Popover** (`role="dialog"`): `absolute bottom-full left-2 right-2 z-40 mb-2 rounded-lg border p-3`, ancorado **sobre** a pílula. Fundo `#002A68`, borda `rgba(255,255,255,0.10)`, shadow `0 8px 24px rgba(0,0,0,0.35)`. Fecha em clique-fora (ref no container `menuModePopoverRef`).
- **Segmented** Manual (`MousePointer2`) / Automático (`Zap`): trilho `rgba(255,255,255,0.05)`; item ativo `rgba(255,255,255,0.10)` + texto `#fff`.
- **Automático**: label "Recolher após {n}s" + **slider laranja** (`#F6921E` preenchido, `min 1 / max 30`) + **quick-picks** `[3, 5, 10, 15]s` (`MENU_MODE_QUICK_PICKS`; ativo `rgba(246,146,30,0.20)` + texto `#F6921E`).
- **Manual**: texto auxiliar curto ("Use o botão do cabeçalho para recolher e expandir o menu."), sem slider.
- **No rail**: apenas o ícone `Timer`; o popover não abre.
- **Timer (mecânica)**: entrar na sidebar **expande na hora** e cancela o timer; sair **agenda** `setTimeout(n * 1000)` para recolher; trocar `{n}` enquanto o ponteiro está fora **reagenda**. Ligar o Automático com o mouse já dentro mantém expandido — recolhe só ao sair. Sair do Automático pelo botão do header limpa o timer.
- **Persistência** (opcional, recomendada): o estado (modo + segundos) persiste entre sessões via `localStorage` — chaves `<app>:menuAuto` (`1`/`0`) e `<app>:menuSeconds` (valida `1–30` na leitura; fallback `3`). Lazy-init no mount; `localStorage` envolto em `try/catch` (modo privado cai só em memória). Com Automático persistido, a barra **inicia recolhida** (ponteiro fora no load). Implementação de referência: Governança BI (`src/components/AppShell.tsx`). O `DocsNeuSidebar` do DS **não** persiste por padrão.

#### 2. Primeiro acesso (refaz o tour)

`<button onClick={onReplayTour}>`, ícone `Compass`, `title="Refazer o tour de boas-vindas"`. Replay do overlay de boas-vindas. Sem badge.

#### 3. Repositório (link externo)

`<a href target="_blank" rel="noopener noreferrer">` para o GitHub do DS (`no-underline [color:inherit]`), ícone `LogOut`. Sem badge.

#### 4. Versão (abre o modal "Novidades do Sistema")

`<button onClick={onOpenChangelog}>`, mesma geometria/hover dos outros 3 itens do rodapé (era um `<div>` estático até v0.5.5 — **revertido**: agora é clicável), ícone `Sparkles`, `title="Ver novidades desta versão"` + badge mono 10px (`rgba(255,255,255,0.4)`) com `docVersion` (ex.: `v0.5.5`). Espelha a constante `DOC_VERSION`. Ao clicar, abre o modal de changelog — anatomia completa em `components.md` → **Dialog/Modal → Modal "Novidades do Sistema" (Changelog)**.

Fonte de referência: `src/components/layout/DocsNeuSidebar.tsx` (prop `onOpenChangelog`) + `src/components/layout/ChangelogModal.tsx` + `src/app/DocLayout.tsx` (state `changelogOpen`, monta `<ChangelogModal>` junto do `<TutorialOverlay>`).

Não faça:

- usar `Dialog` central do Radix para o Modo menu (é popover ancorado na pílula, padrão vindo do Suprimentos)
- esconder o estado atual (a pílula sempre exibe `Auto · {n}s` ou `Manual`)
- reordenar os 4 itens ou trocar o ícone de cada um (`Timer` / `Compass` / `LogOut` / `Sparkles`)

#### Governança — ao criar um novo projeto FIPS

Todo shell novo (Governança BI, Suprimentos, Tecnopano, etc.) **deve** incluir no rodapé da sidebar, no mínimo, estes 2 itens — eles convergem os projetos:

- **Modo menu** — obrigatório. É o controle de auto-colapso (pílula `Timer` + popover). Sem ele a sidebar não tem como recolher/expandir de forma padronizada.
- **Versão** — obrigatório. Botão com `Sparkles` + badge mono espelhando a constante de versão do projeto (`DOC_VERSION` / `APP_VERSION`). É a assinatura institucional de rastreabilidade; recomendado (não obrigatório) ligar a um modal "Novidades do Sistema" como no DS-FIPS — ver `components.md`.

Os outros 2 são **contextuais** (inclua só quando fizer sentido): **Primeiro acesso** apenas se o projeto tem tour de boas-vindas; **Repositório** apenas se há repo público a linkar.

Ao adicionar os itens obrigatórios, mantenha a **linha-base compartilhada** (geometria expandido/rail, cor idle `rgba(255,255,255,0.55)`, ícone 14px) e a ordem relativa (**Modo menu** primeiro, **Versão** por último).

## Dashboard

Fonte: `src/docs/pages/patterns/DashboardDemo.tsx`

Regras:

- cards KPI com borda lateral ou acento cromático controlado
- títulos fortes e métricas legíveis
- hero com contexto do módulo
- ações primárias agrupadas no topo
- **a barra de filtros do dashboard usa a mesma toolbar canônica do Data Listing** (v0.12.4): faixa única `padding 14px 18px` / `gap 10` / `flexWrap:wrap`, zonas na ordem **Filtros** (outline azul + badge de contagem, abre o Drawer) → **Busca** (`flex:1`, `minWidth 180`) → chips → contador `N de M` → `ExportButtons` (par Excel/PDF 32.5×32.5). Não usar rótulo "Filtros" como texto solto nem botão de export com label ("Relatório") — é o par de ícones.
- com mais de ~4 filtros, os chips **recolhem progressivamente** e os campos escondidos vivem no **Drawer**, que tem sempre o conjunto completo. O Drawer é obrigatório nesse caso: recolher chip sem destino deixa o filtro inalcançável. Anatomia do Drawer = a mesma do Data Listing (ver abaixo).
- medição que motiva o recolhimento: a coluna de conteúdo trava em `maxWidth:1200` (≈1084px úteis dentro da faixa). 6 chips + Filtros + Busca + ações não cabem em uma linha em nenhuma largura de tela.

## Data Listing

Fonte: `src/docs/pages/patterns/DataListingDemo.tsx`
Implementação de referência: `src/components/composites/ExportButtons.tsx` + `RowActionsMenu` + `ExportPreviewModal` + `ActiveFilterChips`.
Fonte real de produto para toolbar e filtros: `client/src/components/composites/ListingToolbar.tsx` (**QLP**) e `KpiDashboardPage.tsx` (**Governança BI**) — as duas com a mesma anatomia.

Regras:

- barra de busca e filtros acima da tabela, em card próprio
- **Filtros abrem em Drawer pela esquerda**, não em popover ancorado (mudou na v0.11.26)
- **Chips de filtro ativo** (`ActiveFilterChips`) colados no título do header da Table — um chip por VALOR filtrado, nunca um badge de contagem; ver `components.md`
- KPIs sparkline fora do card = variante documentada; `ListingKpiRow` (Indicadores rápidos clicáveis) é opcional e mora no `panelHeader` do card da toolbar quando usado — ver `components.md`
- tabela dentro de card
- coluna Ações usa `RowActionsMenu` (menu radial), não kebab genérico
- detalhes da linha em painel lateral ou modal, não em navegação improvisada

### Toolbar canônica

Uma única faixa-card (`rounded-[10px_10px_10px_18px]`, borda 1px, `box-shadow: 0 1px 3px rgba(0,75,155,.04)`), miolo `padding 14px 18px`, `display:flex`, `gap:10`, `flexWrap:wrap`. Zonas, nesta ordem: **Filtros** · **Busca** (`flex:1`) · **Período** · **Excel/PDF**.

**Não colocar spacer (`<div style={{flex:1}}/>`) entre o Período e o par de export** (corrigido na v0.12.4): dois irmãos com `flex:1` dividem o espaço sobrando ao meio, então metade virava vão vazio depois do Período em vez da Busca crescer. Só a Busca é `flex:1`; o resto tem largura de conteúdo e fica colado à direita.

| Controle | Especificação exata (fonte: `ListingToolbar` do QLP) |
| --- | --- |
| **Filtros** | `Button variant="outline" size="sm"`: **sempre azul** (`border 1.5px` + texto `--color-primary`), **não** condicional a ter filtro ativo. `height 30`, `padding 0 14px`, `radius 6`, `gap 7`, `fontSize 12`, `fontWeight 600`. Ícone `Filter` do lucide (14px). Badge de contagem = pill `16×16` `radius 999`, só quando `totalFilters > 0`. Par dark obrigatório: `#93BDE4`. |
| **Busca** | `height 34`, `padding 0 12px`, `radius 8`, `flex:1` **sem `maxWidth`** mas com **`minWidth:180`** (v0.12.4 — sem o piso, os irmãos de largura fixa espremiam a busca até cortar o placeholder; abaixo de 180px ela quebra pra própria linha), borda **estática** `--color-border` (sem realce de foco, sem anel), fonte 14px. Ícones `Search`/`X` do lucide 14px. |
| **Período** | chip `padding 7px 12px`, `radius 8`, 11px/600, rótulo mudo + valor bold (`Período: Últimos 30 dias`). Dropdown com radio: 6 presets + divisor + **Personalizado** (sub-form com 2 inputs `date` + Cancelar/Aplicar). |
| **Exportar** | `ExportButtons` — par Excel + PDF **32.5×32.5** só-ícone, sempre à direita. |

Não faça:

- pintar o botão Filtros condicionalmente (outline no FIPS é intrinsecamente azul — a cor não muda com o estado; só o badge aparece/some)
- dar realce de foco ou teto de largura ao campo de busca — ele preenche o vão
- trocar os ícones lucide por glifos SVG custom

### Drawer de Filtros (padrão QLP)

O botão **Filtros** abre um **Drawer pela esquerda** que cobre a sidebar — `position fixed`, `left 0`, `width 400` (`maxWidth 90vw`), `height 100vh`, `box-shadow 4px 0 24px rgba(0,0,0,.12)`, animação `dlSlideLeft .3s cubic-bezier(.4,0,.2,1)` sobre overlay `rgba(0,42,104,.35)` (`dlFade .2s`). Três zonas:

1. **Hero institucional** (`flexShrink:0`, `padding 20px 56px 20px 24px`) — gradiente gov 3-stops + `JunctionLines` (`opacity .06` claro / `.04` escuro), tile âmbar `44×44` `radius 11` (`{amareloOuro}1A` + borda `{amareloOuro}30`), eyebrow uppercase 11px/700 `letter-spacing 1.5px`, título 21px/700 Saira Expanded, descrição 12px `rgba(255,255,255,.65)` que alterna entre `N filtro(s) ativo(s)` e `Refine a listagem pelos campos abaixo`. X próprio `32×32` em `rgba(255,255,255,.08)`.
2. **Miolo rolável** (`flex:1`, `overflowY:auto`, `padding 20px 24px`, `gap 16`) — **`PillFilter`** para campos de classificação com poucas opções (Status, Prioridade), **divisor**, **`ChipSelect`** (dropdown fechado `Rótulo: Valor` com radio) para campos de muitas opções (Departamento).
3. **Rodapé fixo** (`padding 16px 24px`, `borderTop`, fundo `surface-muted`) — `Limpar tudo` (desabilitado sem filtro) + `Ver N resultado(s)` refletindo a contagem real.

Fecha por overlay, X ou `Escape` — **não** por click-outside. `role="dialog"` + `aria-modal` + `aria-label`.

**Seleção é single-select** (`"" = Todos`), não multi-select por checkbox: `{status: string, dept: string, priority: string}`. É a convenção das duas referências de produção.

**Cores dos pills são hex fixo, não token** — o pill ativo é fundo cheio + texto branco, e tokens semânticos (`--color-gov-azul-profundo` etc.) **clareiam no dark**, o que poria texto branco sobre fundo claro. Usar hex saturado nos dois temas: `STATUS_PILL_COLOR` (`#00A83E`/`#F6921E`/`#002A68`/`#DC3545`), `PRIO_PILL_COLOR` (`#DC3545`/`#F6921E`/`#0090D0`/`#6B7784`) e `PILL_PRIMARY` `#0057B8` (pill "Todos" **e** botão `Ver N resultado(s)`).

### Footer de paginação

Alinhado ao footer do `<Table>` (v0.11.22): faixa com fundo `--color-surface-muted`, `padding 10px 16px`, `gap 12`, tipografia base 11px `--color-fg-muted`.

- Esquerda: `Mostrando X–Y de Z` + seletor **`Linhas:` (10/25/50)**.
- Direita: botões de página `24×24` `radius 5` — inativo = fundo transparente, texto `fg-muted`, peso 400; ativo = fundo `--color-primary`, peso 700, **sem borda**. Setas são `‹`/`›` no formato `pgBtn` (`padding 4px 10px`, borda `#93BDE4`, texto azul), desabilitadas nos extremos.

### Cuidado — clipping do dropdown do Select

O `Select` do DS abre a lista como `absolute top-full` (**sem portal**). Qualquer ancestral com `overflow-hidden`/`overflow-auto` (popover de filtros, `PageHero`/`PageHeader`, card de cantos arredondados) **corta a lista "pra dentro"** — bug já visto em 3 telas (Minha Área, Catálogo, Conformidade).

- não envolva um `Select` em container `overflow-hidden`
- dropdowns ancorados da toolbar (Período, `ChipSelect`) usam `z-50` e **não** `overflow-hidden` — os cantos arredondados sobrevivem, nenhum filho preenche o canto. O card da toolbar do Data Listing é `overflow: visible` justamente por isso.
- se o `Select` precisa morar dentro do `PageHero`/`PageHeader` (que é `overflow-hidden` pelo gradiente), mova-o para uma toolbar-card abaixo do hero
- nunca corrija no `Select` do DS (é sincronizado) — corrija no consumidor

### Tabela canônica

Fontes: `src/components/ui/table.tsx` + `src/components/ui/admin-listing.tsx` (este repo). Implementação de referência: `src/pages/InventoryPage.tsx` **no repositório Governança BI** — caminho relativo àquele repo, não a este.

#### Componente `<Table>`

Três densidades (`compact | normal | comfortable`, default `comfortable`) + quatro toggles de aparência, todos passados como props e propagados via context para `TableHead`, `TableCell`, `TableRow`:

| prop | default | efeito |
|---|---|---|
| `density` | `comfortable` | tamanho de fonte e padding das células |
| `zebra` | `true` | linha par = `var(--color-table-zebra)` |
| `verticalBorders` | `false` | `border-r` entre colunas |
| `stickyHeader` | `false` | header `sticky top-0 z-10` |
| `wrapText` | `false` | células `whitespace-nowrap` vs `whitespace-normal` |

**`TableHeader`** — `bg-[var(--color-surface-muted)] border-b-2 border-[var(--color-border)]`.

**`TableHead`** — `px-4 text-center text-[var(--color-fg-muted)]`. O **centralizado é o default do primitive**, não algo que a tela liga: `TableHead` está na lista de `governance/no-visual-overrides` (`eslint.config.js`), então passar `className="text-left"` nele é erro de lint. Por densidade:
- `compact` e `normal` → `text-[9px] font-bold uppercase tracking-[1px] font-[family-name:var(--font-heading)]`; py-2 (compact) / py-2.5 (normal)
- `comfortable` → `text-sm font-semibold`; `h-14`

**`TableCell`** — `px-4 text-[var(--color-fg)]`; por densidade:
- `compact` → `py-1.5 text-[11px]`
- `normal` → `py-3 text-[12px]`
- `comfortable` → `py-5 text-[15px]`

**`TableRow`** — `hover:bg-[var(--color-surface-soft)]`; com `zebra=true` → `even:bg-[var(--color-table-zebra)]` (hover sobrescreve).

**Token zebra** — `--color-table-zebra`: light = `#D3E3F440` (blue-200 @ 25%); dark = `rgba(255,255,255,0.03)`. Declarar em `src/tokens/theme.ts` (`lightTokens`/`darkTokens`) e rodar `npm run tokens:build` — o CSS é gerado, não editado. **Zebra fraca demais é bug conhecido**: `#93BDE4` a 5% fica quase invisível e a tabela parece não-zebrada — o valor certo é o `#D3E3F4` a 25%.

#### Cadência de linha — o alvo visual (`DENSITY`)

O `<Table>` governado expressa densidade como **padding vertical**. A referência visual do sistema (Data Listing e a tabela da doc `/docs/components/table`, alinhadas na v0.11.32) expressa como **altura de linha fixa** — é essa a cadência que uma tela FIPS deve ter:

| densidade | `rowH` | `fs` | `padX` |
| --- | --- | --- | --- |
| `compact` | 30px | 11px | 12px |
| `normal` | 42px | 12px | 16px |
| `comfortable` | 56px | 13px | 20px |

- Célula: `padding: 0 padX` (a altura vem da linha). **Exceção:** com "quebra de linha" ligada, volta a padding vertical — é o único caso em que a linha precisa crescer.
- **`th`**: `padding 8px padX`, `fontSize 9`, `fontWeight 700`, `uppercase`, `letter-spacing 1px`, Saira Expanded, `borderBottom 2px`, **sempre centralizado** — o `th` **não** segue `col.align`, ao contrário da célula (`td`), que continua respeitando (`left` por padrão, `right` em valor monetário). Vale para **toda** superfície com `<th>`, não só a tabela da listagem: preview do `ExportPreviewModal`, HTML de impressão e de PDF (`src/utils/exportData.ts`), tabelas de referência das doc pages. A coluna de checkbox também é `th` centralizado.
- O alinhamento já foi revertido duas vezes (v0.11.32 centro → esquerda; v0.12.3 de volta ao centro). Na v0.14.1 virou **default do primitive + regra de lint** justamente para parar o vai-e-vem: se você está prestes a escrever `text-left` num cabeçalho, é a regra que está sendo quebrada, não uma exceção da tela.
- Skeleton de carregamento usa a mesma `rowH`, senão as linhas "pulam" de altura ao sair do loading.
- Card da tabela leva `box-shadow: var(--shadow-card-flat)` (`0 1px 3px rgba(0,75,155,.04)`).

#### Anatomia obrigatória — a ordem não muda

Uma tabela FIPS completa é sempre este empilhamento. Implementar parcialmente é o erro mais comum:

```
┌─ CARD (rounded-[10px_10px_10px_18px], border 1px, shadow 0 1px 3px rgba(0,75,155,.04))
│  ① HEADER            ícone 48 + título + subtítulo  ·  [chips de filtro ativo]   →  [Tabela|Cards] [Configurar]
│  ─────────────────────────────────────────────────────────────────── borderBottom 1px
│  ② THEAD             checkbox? + th centralizado + ícone de sort
│  ③ TBODY             linhas com rowH fixo, zebra, hover, seleção
│  ─────────────────────────────────────────────────────────────────── borderTop 1px
│  ④ FOOTER            [conteúdo custom / totais]      →  Linhas: [10▾]  ‹ 1 2 3 ›
└─
```

**① Header do card** — `padding 18px 20px 14px`, `gap 14`, **`borderBottom` de 1px** separando header e tabela. Título 16px `lineHeight 1.2`; subtítulo 11px, `margin-top 3px`, `lineHeight 1.4`. Tile do ícone `48×48` com **aro**: fundo a 4% da cor do ícone, borda a 8% (`color-mix(in srgb, {cor} 8%, transparent)`).

- **Esquerda:** ícone → título → subtítulo. Colados no título (separados por `·`), os **chips de filtro ativo** (`ActiveFilterChips`) — um chip por VALOR filtrado, nunca um badge "Filtrado" nem contagem "3 filtros".
- **Direita, nesta ordem:** segmented **Tabela | Cards** → botão **Configurar**. Nada mais.
- **Não** repetir "Mostrando X–Y de Z" aqui — esse texto é do footer (④). Ter nos dois lugares é duplicação (corrigido na v0.12.3).

#### Vista Cards (`viewToggle`)

O segmented Tabela/Cards alterna a mesma listagem entre grade e tabela. Segmented: container `gap 3`, `padding 3`, `radius 8`, borda 1px; pill ativa em `--color-surface` com `box-shadow 0 1px 2px rgba(0,42,104,.08)`; ícones `list`/`grid` 12px.

Grade de cards: `padding 16`, `grid`, `repeat(auto-fill,minmax(280px,1fr))`, `gap 12`. Card: `padding 14`, `radius 8px 8px 8px 14px`, borda 1px; selecionado = borda `--color-primary` + fundo `azulCeu20`.

Conteúdo do card **derivado das colunas visíveis** (não hardcode): a 1ª coluna vira o título (mono, 12px/700, com `borderBottom` separando), as demais viram pares `label → valor` alinhados nas pontas. Sempre respeitar `col.render`. O valor precisa de `flex:1` — renders com barra interna (progress) colapsam a 0 num span encolhido.

A vista Cards tem os mesmos estados da tabela: skeleton no loading e empty state ocupando a grade inteira (`gridColumn: 1 / -1`).

**`useTableDensity`** — hook exportado; retorna `TableDensity | null` (`null` = fora de `<Table>`). O `<Badge>` **consome** desde a v0.15.0 e ajusta o próprio size: `compact|normal → sm`, `comfortable → md`, fora de tabela → `sm` (prop `size` explícita vence). Qualquer outro descendente que precise reagir à densidade usa o mesmo hook.

**Telas de inventário nascem compactas** — passar `density="compact"` como default; usuário pode mudar via `AdminTableColumnMenu`.

#### `AdminTableColumnMenu` — popover "Configurar"

Botão `<Settings2>` `variant="secondary"` (ativo: `variant="primary"`), abre popover `absolute top-full right-0 z-30 w-[300px] rounded-2xl border shadow-float` em `surface`.

**Quatro abas** (`Colunas / Densidade / Ordenação / Aparência`), tabs só aparecem se as props respectivas forem passadas. Com 4 abas o popover precisa de **340px** (não 300px): em 300px o rótulo "Aparência" é cortado, porque o container é `overflow:hidden` pelo radius. Botões de aba: `flex:1`, `padding 9px 4px`, `fontSize 10`, `whiteSpace:nowrap`.

1. **Colunas** — lista `grip + checkbox + label`; coluna fixa tem badge `fixa` mono 9px e drag desabilitado; colunas ocultas por padrão vêm com `visibleColumns[id] = false`; draggable (HTML5 DnD) reordena via `onReorderColumn(sourceId, targetId)`.
2. **Densidade** — 3 radio-cards (`compact / normal / comfortable`); cada um com indicador de barrinhas à direita (alturas proporcionais).
3. **Ordenação** (v0.12.3) — duas partes:
   - toggle **Ordenar por coluna** (Sim/Não). Desligado, o ícone de sort some do `th` **e** o clique para de reordenar — é o caso de lista já pré-ordenada pelo backend. A prop `sortable` do componente é só o **valor inicial**; aqui o usuário troca ao vivo.
   - **Coluna padrão** — lista rádio com "Nenhuma (ordem original)" + uma linha por coluna visível e ordenável. A coluna ativa ganha um botão inline **Crescente/Decrescente** que alterna a direção. Define o `sortCol`/`sortDir` iniciais, os mesmos estados que o clique no `th` usa.
4. **Aparência** — 4 toggles (`ConfigToggle`): zebra / bordas verticais / cabeçalho fixo / quebra de linha. Toggle pill 30×18px, ativo = `primary`, inativo = `border-strong`.

Footer: `Restaurar padrão` (texto 10px fg-muted, hover=fg) + `Aplicar` (`variant="primary" size="sm"`). **`Restaurar padrão` reseta só a aba aberta** — cada aba tem seu branch (visualização → tabela; colunas → ordem/visibilidade originais; densidade → normal; ordenação → prop inicial + coluna nenhuma; aparência → os 4 defaults). Compartilhar um reset único entre abas é bug.

**Persistência em `localStorage`** — chave `<app>-inventory-prefs`; salva `colOrder`, `hiddenCols`, `density`, `appearance`. Lazy-init no `useState`, `useEffect` grava em cada mudança. `try/catch` (modo privado não quebra). `Restaurar padrão` limpa a chave e reseta os estados.

#### `AdminTablePagination`

Footer da listagem (fora do `<Table>`, abaixo do card):

- Esquerda: `"Mostrando X–Y de Z registros"` — 11px fg-muted, range em `<strong>` fg semibold. Sem `totalItems` → `"Página N de T"`.
- Direita: botões `‹ 1 2 3 ›` (`size="iconSm"`); ativo = `variant="primary"`, resto = `variant="secondary"`. Com >7 páginas: ellipsis `…` mono fg-muted entre páginas vizinhas e extremos.

#### `AdminTableSortHeader`

`<button>` inline-flex com ícone de caret: ativo = `ArrowUp / ArrowDown` 12px `secondary`; inativo = `ArrowUpDown` 12px `border-strong`.

#### Coluna Ações — sempre `RowActionsMenu`

A última coluna (`key:"_actions"`, `label:"Ações"`, `width 80`, `align:"center"`, `sortable:false`) renderiza **um** gatilho: o menu radial `RowActionsMenu` (`rowId`, `radius={56}`, `actions[]`). Ver `components.md` → CircularCommandMenu / RowActionsMenu.

- **Nunca** um par de ícones soltos (olho/lápis) na célula — foi o padrão antigo, removido na v0.13.0.
- A `<td>` precisa de `onClick={e => e.stopPropagation()}`, senão o clique no menu dispara também o `onClick` da linha (seleção/detalhe).
- Ações `danger: true` (Excluir, Cancelar) saem em vermelho no menu.

#### Seleção em massa (`selectable`)

Checkbox no `th` (select-all da página corrente, `width 36`) + checkbox por linha. Linha selecionada pinta com `azulCeu20` — precedência: **selecionado > hover > zebra**. O estado é índice/id das linhas visíveis, não do dataset inteiro. Na vista Cards o checkbox vai no topo do card, com `stopPropagation` pra não conflitar com o clique do card.

#### Estados obrigatórios — os quatro

Uma tabela sem estes quatro está incompleta:

| estado | como | detalhe |
|---|---|---|
| **loading** | `loading` → 5 linhas de skeleton com shimmer | usar a **mesma `rowH`** da densidade, senão a linha "pula" ao sair do loading |
| **vazio** | `emptyText` centralizado, `--color-fg-muted` | título 15px/700 + linha de apoio ("Tente ajustar os filtros…") |
| **erro** | ícone + "Erro ao carregar dados" + descrição + botão **Tentar novamente** (outline azul) | não silenciar falha de fetch |
| **selecionado** | fundo `azulCeu20` na linha | ver seleção em massa acima |

#### Footer da tabela

Faixa `--color-surface-muted`, `padding 10px 16px`, `gap 12`, base 11px `--color-fg-muted`, `borderTop` 1px.

- **Esquerda:** conteúdo custom (`footer` — totais, contadores tipo "12 requisições · 4 pendentes · Total: R$ 75.930") e/ou `Mostrando X–Y de Z`.
- **Direita:** seletor **`Linhas:`** (`perPageOptions`, ex. `[5,10,25]`) + navegação `‹ 1 2 3 ›`. Botões de página `24×24` `radius 5` — inativo = transparente/`fg-muted`/400; ativo = fundo `--color-primary`, 700, **sem borda**. Setas `‹`/`›` no formato `pgBtn` (`padding 4px 10px`, borda `#93BDE4`, texto azul), desabilitadas nos extremos.

#### Props do padrão de referência (`DSTable`)

| prop | tipo | default | efeito |
|---|---|---|---|
| `columns` | `Column[]` | — | `key`, `label`, `align`, `width`, `sortable`, `render(value, row)` |
| `data` | `Object[]` | `[]` | chaves batem com `column.key` |
| `title` / `subtitle` / `icon` | `string` / `ReactNode` | — | header do card; `iconBg`/`iconBorder` fazem o aro |
| `striped` | `boolean` | `true` | desligar só em tabela curta (< 5 linhas) |
| `compact` | `boolean` | `false` | densidade inicial |
| `bordered` | `boolean` | `false` | bordas verticais — dados financeiros/planilha |
| `selectable` | `boolean` | `false` | checkbox por linha + select-all |
| `sortable` | `boolean` | `true` | **valor inicial**; com `configurable`, muda na aba Ordenação. `sortable:false` por coluna funciona mesmo com o geral ligado |
| `paginate` | `number` | `0` | linhas por página; `0` = sem paginação |
| `perPageOptions` | `number[]` | — | ex. `[5,10,25]` → dropdown "Linhas:" no footer |
| `loading` | `boolean` | `false` | skeleton shimmer |
| `emptyText` | `string` | `"Nenhum registro"` | estado vazio |
| `footer` | `ReactNode` | — | conteúdo à esquerda do footer |
| `configurable` | `boolean` | `false` | botão Configurar (4 abas). Usar só com 5+ colunas |
| `viewToggle` | `boolean` | `false` | segmented Tabela/Cards. Requer `title` |

#### Row clicável → Dialog de detalhe

Ao converter tela sem coluna de ações: `<TableRow onClick={() => setSelected(row)} className="cursor-pointer">`. Células que ainda têm ação própria (ex.: dropdown) usam `e.stopPropagation()` no onClick para não abrir o dialog junto.

Não faça:

- **tabela "pelada"**: sem header de card, sem footer de paginação ou sem os 4 estados — é o erro mais comum ao portar o padrão
- par de ícones (olho/lápis) na coluna Ações em vez do `RowActionsMenu`
- `th` alinhado à esquerda ou seguindo `col.align` — o cabeçalho é **sempre centralizado**; só o `td` respeita `align`
- repetir "Mostrando X–Y de Z" no header do card (é do footer)
- densidade como padding vertical em vez de `rowH` fixo
- popover Configurar com 300px tendo 4 abas (corta "Aparência")
- filtros como tabs planas coloridas soltas
- export como botão genérico de texto em vez do par de ícones Excel/PDF
- faixa-stripe lateral colorida em cards (padrão proibido)

## Filtros avançados (barra de chips + drawer)

Padrão canônico para telas com muitos filtros (dashboards, analytics). Implementação de referência: `Governanca_BI/src/pages/KpiDashboardPage.tsx` (`FilterBar`, `ChipSelect`, `PeriodField`, `PillFilter`, `SearchField`). Evolui a "Toolbar canônica" (Data Listing) quando os filtros passam de ~4.

Demo viva (só o drawer, sem a barra de chips) em `src/docs/pages/components/DrawerDoc.tsx` — variante "Filtros avançados" (`side="left"`). `PillFilter` lá é `PillFilterGroup`; cores semânticas de Status/Prioridade reusam os mesmos tokens hex de `DataListingDemo.tsx` (`PRIO_COLOR`).

Desde a v0.11.26 o **Data Listing usa o mesmo drawer** (sem barra de chips: os filtros vivem só no drawer, com Período mantido na toolbar) — anatomia detalhada em **Data Listing → Drawer de Filtros**. Os dois convergem: hero institucional + miolo `PillFilter`/`ChipSelect` + rodapé `Limpar tudo` / `Ver N …`.

**Divergência conhecida (Departamento/Segmento):** a implementação real (Governança BI) usa `Select` governado (`density="compact"`, 36px) para os campos "de muitas opções" dentro do drawer. Na demo do DS-FIPS, `Select` governado não tem variante de 32.5px e a regra `no-visual-overrides` proíbe forçar `h-` nele — então Departamento/Segmento usam um `ChipSelect` local (mesmo padrão do chip da toolbar: dropdown com radio) só para bater a altura com os campos de data (`FInput`, 32.5px) do mesmo drawer. Ao portar este padrão para uma app real (não a doc), prefira `Select` governado nesses campos, como no Governança BI — o `ChipSelect` aqui é uma acomodação específica do demo, não uma mudança na recomendação.

### Barra de chips

Faixa-card (`flex flex-wrap items-center gap-2.5 rounded-[10px_10px_10px_18px] border border-border bg-card p-3 shadow-[var(--shadow-card)] sm:px-4`). Zonas, nesta ordem: **Filtros** (abre o drawer) → **Busca** (`flex-1`, ocupa o vão) → **chips** (Área · Abrangência · Período) → contador `N de M` → **PDF** (`ml-auto`). Todo controle tem **32.5px** de altura (`h-[32.5px]`).

**Chip** (`ChipSelect`/`PeriodField`/botão Filtros — mesmo tamanho): `inline-flex items-center gap-1.5 rounded-lg border bg-[var(--color-surface)] px-3 py-[7px] text-[11px] font-semibold shadow-sm`; aberto = `border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20`. Mostra rótulo mudo prefixado + valor bold (`Área: Todos`, `Período: Últimos 30 dias`). Dropdown ancorado `rounded-[8px_8px_8px_14px]` com itens **radio** (aro 14px, ponto 6px azul); item ativo `bg-[var(--color-primary)]/8 font-bold text-[var(--color-primary)]`.

**Busca** (`SearchField`): `flex h-[32.5px] flex-1 items-center gap-2 rounded-lg border bg-[var(--color-surface)] px-3` + lupa à esquerda + `X` pra limpar quando há texto. `flex-1` mata o espaço vazio da barra.

**Recolhimento progressivo** — os chips somem um a um da direita conforme a tela estreita, e reaparecem no drawer no mesmo breakpoint: Período `hidden xl:block`, Abrangência `hidden lg:block`, Área `hidden md:block`. Abaixo de `md` a barra fica só **Filtros + Busca + PDF**.

### Drawer de Filtros

`Filtros` abre um `Drawer side="left"` (cobre a sidebar, ganha largura). `DrawerContent` **precisa** de `className="… p-0 sm:p-0"` — só `p-0` deixa o `sm:p-7` (28px) do base como moldura fantasma (ver gotcha em Modal Workflow). Header hero = mesmo do `WorkspaceFormDialog` (tile âmbar, eyebrow, título, subtítulo, X próprio; `showCloseButton={false}`). Miolo `space-y-4 px-6 py-5 overflow-y-auto` (1 coluna): campos recolhidos da barra no topo → `PillFilter` (Status/Criticidade/Risco/Nível/Método) → `Select` para os de muitas opções (Tipo/Frequência/Workspace/Fonte/Responsável). Rodapé fixo `bg-[var(--color-surface-muted)]/70 px-6 py-4`: `Limpar tudo` + `Ver N BIs`.

**`PillFilter`** — filtro segmentado single-select para campos de poucas opções semânticas: pills `rounded-full border px-2.5 py-1 text-[11px] font-semibold`. Ativo com cor = fundo cheio da cor semântica + texto branco; inativo com cor = dot colorido (escaneável de relance); "Todos" e campos sem cor = azul primário. Cor reusa o mapa dos badges/charts (`success`/`danger`/`accent-strong`). Preferir pill a dropdown quando há ≤6 opções curtas; dropdown (`Select`) só para muitas opções ou labels longos.

Não faça:

- chips da barra em tamanhos diferentes — todos 32.5px, mude no único `chipTriggerCls`
- recolher todos os chips no mesmo breakpoint — é um a um (md/lg/xl)
- `Select` de formulário (h-12) na barra — usar o chip (`ChipSelect`)
- esquecer `sm:p-0` no `DrawerContent`/`DialogContent` (moldura de 28–32px em desktop)

## Form Workspace

Fonte: `src/docs/pages/patterns/FormWorkspaceDemo.tsx`

Regras:

- duas colunas no desktop quando o volume de dados justificar
- ações de salvar e cancelar agrupadas com clareza
- áreas de apoio, checklist ou anexo em cards laterais ou blocos inferiores
- campos obrigatórios sempre visíveis

## Modal Workflow

Fonte: `src/docs/pages/patterns/ModalWorkflowDemo.tsx`

Regras:

- montar com `<Modal>`/`<ModalFooter>` da library — `Dialog*` cru só para construir composite novo
- `headerIcon` sempre; campo sempre `Field` + `Input`/`Select`/`Textarea` (nunca `<label>`+`<input>`)
- usar `compact` em filtros e formulários densos — no `Field` **e** no controle
- títulos claros, resumo curto e CTA inequívoco
- overlays com `--shadow-elevated`
- não transformar fluxo longo em modal único se a tarefa exigir navegação complexa

### Header hero + form dialog (padrão canônico)

Todo modal/drawer com título usa **header hero**, não o header branco simples.

**Caminho 1 — dentro do DS-FIPS (é este que você usa):** `<Modal hero headerIcon={Icone} eyebrow="…" title="…">`.
O componente já entrega faixa, tile, eyebrow, título, X e footer. A API completa,
com checklist e a lista de "não faça", está em `components.md` → **Modal — a API**.
Não remonte a casca à mão só para ter header hero.

```tsx
<Modal open={open} onOpenChange={setOpen} hero headerIcon={ClipboardEdit}
       eyebrow="Requisição" title="Nova requisição" size="lg">
  <Field density="compact">
    <FieldLabel required>Solicitante</FieldLabel>
    <Input density="compact" />
  </Field>
  <ModalFooter>
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
    <Button variant="primary">Salvar</Button>
  </ModalFooter>
</Modal>
```

**Caminho 2 — fora do DS-FIPS, sem acesso ao `<Modal>`** (ex.: um app que ainda não
consome a library): aí sim monte na mão, copiando a implementação de referência real
`Governanca_BI/src/components/WorkspaceFormDialog.tsx`, sem improvisar. Estrutura:
`Dialog`+`DialogContent` direto, `className="max-w-* gap-0 overflow-hidden rounded-[12px_12px_12px_24px] p-0 sm:p-0 [&>button]:hidden"`.
Header inline: faixa gradiente gov (`linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, var(--color-fips-blue-1000) 100%)` — é o token `--fips-modal-hero-bg`), **tile âmbar** `h-11 w-11 rounded-[11px]` (`bg color-mix(in srgb, var(--color-accent) 10%, transparent)`, borda `accent 19%`, ícone `accent` — NÃO glass branco) + eyebrow dourado uppercase (`accent-strong`) + título branco 21px (Saira Expanded) + subtítulo `white/65`, X próprio `right-4 top-5` (`bg-white/8`). Body `space-y-4 px-6 py-5`, campos `Field density="compact"` + `Input/Textarea density="compact"` com `leftIcon`. Footer `bg-[var(--color-surface-muted)]/70 px-6 py-4`.

O ícone não é enfeite em nenhum dos dois caminhos: modal sem tile de ícone está fora
do padrão.

**Gotcha do padding-fantasma (só no caminho 2):** `DialogContent` tem `sm:p-8` e `DrawerContent` tem `sm:p-7` no base. Passar só `p-0` **não** remove (variante responsive; twMerge não funde com `p-0`) → moldura de 28–32px em volta em desktop. **Sempre `p-0 sm:p-0`.** Sintoma: header hero com margem branca em vez de ir borda-a-borda. Usando `<Modal>` isso já vem resolvido.

## Hero

Fontes:

- `src/docs/pages/patterns/HeroHeaderDoc.tsx` (página **Hero** na doc; rota `/docs/patterns/hero`)
- `src/docs/pages/HomePage.tsx` — hero real da Home (implementação de referência)
- `src/docs/pages/patterns/ApplicationShellDemo.tsx` — mesmo hero dentro do shell, com indicadores em straddle
- `src/composites/PageHero.tsx`

### Hero da Home — três camadas (copiar verbatim)

Container `relative isolate overflow-hidden text-white`, e dentro dele, nesta ordem:

1. **Arte** — `<img src="/backgrounds/app-shell-home-trains.png" className="absolute inset-0 h-full w-full object-cover object-center">` (`aria-hidden`, `decoding="async"`).
2. **Overlay azul** — `bg-gradient-to-b from-[#002A68]/60 via-[#002A68]/45 to-[#002A68]/60`.
3. **Vinheta** — `bg-gradient-to-t from-black/35 via-transparent to-black/15`. Não é enfeite: é ela que segura o contraste onde a foto clareia. As três camadas andam juntas — degradê puro (sem foto) ou foto sem overlay estão fora do padrão.
4. **Conteúdo** — `relative z-10 mx-auto max-w-6xl px-4 py-12 text-center sm:px-6 sm:py-16`: badge pill laranja (`bg-[rgba(246,146,30,0.95)]` + `shadow-[0_12px_28px_rgba(246,146,30,0.28)]`), título `font-heading text-3xl sm:text-5xl font-bold` branco com um termo em `text-[var(--color-accent)]`, subtítulo `text-white/80 max-w-2xl leading-7`, e par de botões `size="sm"`: `variant="ouro"` (ou `accent`) + `variant="inverseOutline"`.

Indicadores/KPIs, quando houver, montam sobre a borda do hero com straddle `-mt-7` (desktop) / `-mt-6` (tablet) / `-mt-3` (mobile).

### O header acima do hero NÃO é glass

O header é o padrão sólido (`DocHeaderStandard`: toolbar `--color-surface-soft` + arte lavada + faixa de abas), sticky e opaco em **todas** as rotas, inclusive a Home. O antigo padrão *glass-to-white* (header transparente com `backdrop-filter` no topo, virando branco após `scrollTop > 60`) foi **aposentado na v0.6.3** — nenhum app FIPS usa listener de scroll no header. Código com `scrollTop > 60` trocando o fundo do header é resíduo.

### Faixa de módulo ≠ hero da Home

Módulo, listagem e formulário **não** abrem com o hero com foto. A faixa dessas telas é o **Banner de Conteúdo** (doc: página **Banner**, `HeroBannerDoc.tsx` § 03): faixa-card `rounded-[12px_12px_12px_24px]`, `padding 22px 26px`, gradiente `linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, #001A4A 100%)`, `JunctionLines` à direita (`opacity .06` claro / `.04` escuro), tile âmbar `44×44` `radius 11`, eyebrow uppercase `--color-accent-strong`, título Saira 21px, descrição 12px `white/67`, ações `Button variant="accent"` + `inverseOutline`, sombra `0 4px 20px rgba(0,42,104,.12)`. Implementação de referência real: `Governanca_BI/src/components/PageHeader.tsx` (usado nas 14 páginas do módulo).

Desde a **v0.13.0** isso é um composite governado: `import { PageHeader } from 'ds-fips'` — promovido a partir do `PageHeader` do Governança BI. API e anatomia em `components.md` § PageHeader. Não recriar a faixa por tela nem copiar markup; `PatternPanelHero` virou adaptador `@deprecated` do mesmo componente.

`PageHero` (`src/composites/PageHero.tsx`) é outra coisa: faixa **full-bleed** `min-h-[200px]` com a arte em `mix-blend-soft-light` à direita, para visão geral/edição. Na v0.13.0 foi alinhado com a versão que o fips-suprimentos já rodava — fundo `--fips-banner-page-bg`, trilhos de junção, prop `compact` — e **passou a embutir o padding** (filho com `px/py` próprio dobra o respiro).

Regras:

- o hero com foto é exclusivo da Home; módulo usa Banner de Conteúdo; `PageHero` só para faixa alta de visão geral/edição
- manter trilhos/trem como textura secundária, nunca como ruído dominante

## Governança

Fonte: `src/docs/pages/GovernancePage.tsx`

Regra de ouro:

- se a tela e o design system divergem, evolua o design system primeiro

Checklist rápido:

- nenhuma tela muda borda, raio, sombra ou cor via CSS local
- nenhum componente novo nasce fora do design system
- formulários usam composição oficial
- cores e fontes vêm dos tokens oficiais
- espaçamento segue a escala de 4px
