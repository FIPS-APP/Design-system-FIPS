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

#### 4. Versão (estático)

`<div>` **não clicável** (sem hover, sem `cursor-pointer`), ícone `Sparkles`, `title="Versão da documentação"` + badge mono 10px (`rgba(255,255,255,0.4)`) com `docVersion` (ex.: `v0.5.4`). Espelha a constante `DOC_VERSION`.

Não faça:

- usar `Dialog` central do Radix para o Modo menu (é popover ancorado na pílula, padrão vindo do Suprimentos)
- esconder o estado atual (a pílula sempre exibe `Auto · {n}s` ou `Manual`)
- dar hover/clique ao item **Versão** (é rótulo informativo, não ação)
- reordenar os 4 itens ou trocar o ícone de cada um (`Timer` / `Compass` / `LogOut` / `Sparkles`)

#### Governança — ao criar um novo projeto FIPS

Todo shell novo (Governança BI, Suprimentos, Tecnopano, etc.) **deve** incluir no rodapé da sidebar, no mínimo, estes 2 itens — eles convergem os projetos:

- **Modo menu** — obrigatório. É o controle de auto-colapso (pílula `Timer` + popover). Sem ele a sidebar não tem como recolher/expandir de forma padronizada.
- **Versão** — obrigatório. `<div>` estático com `Sparkles` + badge mono espelhando a constante de versão do projeto (`DOC_VERSION` / `APP_VERSION`). É a assinatura institucional de rastreabilidade.

Os outros 2 são **contextuais** (inclua só quando fizer sentido): **Primeiro acesso** apenas se o projeto tem tour de boas-vindas; **Repositório** apenas se há repo público a linkar.

Ao adicionar os itens obrigatórios, mantenha a **linha-base compartilhada** (geometria expandido/rail, cor idle `rgba(255,255,255,0.55)`, ícone 14px) e a ordem relativa (**Modo menu** primeiro, **Versão** por último).

## Dashboard

Fonte: `src/docs/pages/patterns/DashboardDemo.tsx`

Regras:

- cards KPI com borda lateral ou acento cromático controlado
- títulos fortes e métricas legíveis
- hero com contexto do módulo
- ações primárias agrupadas no topo

## Data Listing

Fonte: `src/docs/pages/patterns/DataListingDemo.tsx`
Implementação de referência (port fiel): `src/pages/CatalogPage.tsx` + `src/components/ExportButtons.tsx` (Governança BI).

Regras:

- barra de busca e filtros acima da tabela
- KPIs resumidos antes da listagem
- tabela dentro de card
- detalhes da linha em painel lateral ou modal, não em navegação improvisada

### Toolbar canônica

Uma única faixa-card (`rounded-[10px_10px_10px_18px] border border-border bg-card shadow-[var(--shadow-card)]`, padding `p-3 sm:p-4`), em coluna no mobile e linha no `sm+`. Três zonas, nesta ordem:

1. **Filtros** (esquerda, `shrink-0`) — `Button variant="outline" size="sm"` que abre um popover `absolute` com os `Select density="compact"`. Com filtro ativo, o botão ganha `border-primary text-primary` + badge-contador (`rounded-full bg-primary text-primary-foreground`). Fecha em clique-fora.
2. **Busca** (centro, `flex-1`) — `Input density="compact"` com `leftIcon={<Search />}`.
3. **Exportar** (direita, `shrink-0`) — `ExportButtons` (par Excel + PDF). O `Limpar` (`Button variant="ghost" size="sm"` com `<X />`) entra à esquerda do par só quando há filtro/busca ativos.

Snippet:

```tsx
<div className="flex flex-col gap-3 rounded-[10px_10px_10px_18px] border border-border bg-card p-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:p-4">
  <FiltersPopover /> {/* Button outline + popover absolute com Selects compact */}
  <div className="flex-1">
    <Input density="compact" leftIcon={<Search />} placeholder="Buscar…" />
  </div>
  {hasFilters && (
    <Button variant="ghost" size="sm" onClick={clear}><X />Limpar</Button>
  )}
  <ExportButtons onExcel={exportXlsx} onPdf={exportPdf} />
</div>
```

### Cuidado — clipping do dropdown do Select

O `Select` do DS abre a lista como `absolute top-full` (**sem portal**). Qualquer ancestral com `overflow-hidden`/`overflow-auto` (popover de filtros, `PageHero`/`PageHeader`, card de cantos arredondados) **corta a lista "pra dentro"** — bug já visto em 3 telas (Minha Área, Catálogo, Conformidade).

- não envolva um `Select` em container `overflow-hidden`
- o popover de filtros usa `z-50` e **não** `overflow-hidden` (os cantos arredondados sobrevivem: nenhum filho preenche o canto)
- se o `Select` precisa morar dentro do `PageHero`/`PageHeader` (que é `overflow-hidden` pelo gradiente), mova-o para uma toolbar-card abaixo do hero
- nunca corrija no `Select` do DS (é sincronizado) — corrija no consumidor

Não faça:

- filtros como tabs planas coloridas soltas
- export como botão genérico de texto em vez do par de ícones Excel/PDF
- faixa-stripe lateral colorida em cards (padrão proibido)

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

- usar `compact` em filtros e formulários densos
- títulos claros, resumo curto e CTA inequívoco
- overlays com `--shadow-elevated`
- não transformar fluxo longo em modal único se a tarefa exigir navegação complexa

## Hero

Fontes:

- `src/docs/pages/patterns/HeroHeaderDoc.tsx` (página **Hero** na doc; rota `/docs/patterns/hero`)
- `src/composites/PageHero.tsx`

Regras:

- módulos de produto usam `PageHero`
- home pode usar hero mais editorial
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
