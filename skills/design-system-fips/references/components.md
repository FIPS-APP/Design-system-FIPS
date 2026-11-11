# Components

> Cobertura desta referência: **v0.11.33** (2026-08-11). Histórico completo em `src/docs/data/changelog.ts`.

## Barrel de exportação

Duas camadas. **Sempre importe pela raiz** (`src/index.ts`) num app consumidor.

### `src/index.ts` — entrada pública da library

Reexporta `./tokens`, `cn`, `useFipsTheme` (+ `UseFipsThemeResult`; ver `foundations.md`, Dark mode), **tudo** de `components/ui` (abaixo), mais:

- `FipsLogo` · `PageHero`, `PAGE_HERO_DEFAULT_DECORATION`
- `HeroAtalho`, `HeroAtalhos`, `HeroFileira`
- `AbasDeSecao`
- `AppShell`, `AppHeader`, `AppSidebar`, `HeaderTile`, `HeaderTrilha`, `UserChip`, `UserAccountMenu`, `NotificacoesMenu`, `TutorialOverlay` (casca padrão do app; ver a seção "Casca do app" abaixo)
- `SecaoNumerada`, `BarraAcoesRodape`, `EstadoSalvamento`, `SegmentoAvaliacao`, `AssinaturaCanvas`, `CardChecklist` (formulário de execução; ver a seção abaixo)
- `TabelaExpansivel` (+ `TabelaExpansivelProps`, `TabelaExpansivelColuna`, `TabelaExpansivelOrdenacao`)
- `PageHeader` (+ `PageHeaderProps`, `PageHeaderStat`, `PageHeaderActionsProps`) · `PatternPanelHero` (apelido do PageHeader) · `BannerJunctionLines`, `BannerIconBox`, `FIPS_BANNER_*`
- `StatsCard`, `StatsCardGrid` · `HowItWorksCard`, `HowItWorksGrid` · `RuleTile`, `RuleTileGrid`
- `ExportButtons` · `ExportPreviewModal`, `resolveExportKeys` · `ListingKpiRow`
- `FilterBlock`, `FilterBlockProps` (Filtros + busca + exportar; ver Padrões → Bloco enxuto)
- `CircularCommandMenu` · `RowActionsMenu`
- `ExcelIcon`, `PdfIcon`

### `src/components/ui/index.ts` — primitives governados

- `Button` + `buttonVariants` · `Badge` + `badgeVariants`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Field`, `FieldLabel`, `FieldHint`, `FieldMessage` · `FieldTrigger`
- `Input` · `InputGroup`, `InputGroupAddon`, `InputGroupButton`, `InputGroupText`, `InputGroupInput`, `InputGroupTextarea`
- `Select` · `Textarea` · `Switch` · `Progress`
- `Table`, `TableHeader`, `TableHead`, `TableBody`, `TableRow`, `TableCell`, `TableEmpty`
- `AdminTableColumnMenu`, `AdminTablePagination`, `AdminTableSortHeader`, `AdminTableCompanyCell`, `AdminTableStatusDots`
- `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
- `Dialog` (+ `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `DialogClose`, `DialogIconTile`, `DIALOG_CONTENT_SCROLL_WRAPPER_CLASS`) · `Modal`, `ModalFooter`
- `Drawer` (+ `DrawerContent`, `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerClose`)
- `Tooltip`, `TooltipProvider`, `TooltipTrigger`, `TooltipContent`

**Exportado sem página de doc:** `Switch` (Radix, `src/components/ui/switch.tsx`; trilho em `--color-switch-on`/`--color-switch-off`, anel `--color-ring` cheio com recuo `--color-surface`). A página `/docs/components/switch` foi removida na v0.11.20 — o primitive e o composite `SettingsPreferenceRow` continuam funcionando em qualquer app consumidor, só ficaram sem doc dedicada.

## Button

Fonte: `src/components/ui/button.tsx` e `src/components/ui/button-variants.ts`

Variantes exatas:

- `primary`
- `secondary`
- `outline`
- `ghost`
- `accent`
- `inverseOutline`
- `success`
- `successStrong` (verde escuro — `--color-btn-success-hover` em repouso e `--color-btn-success` no hover, inverso da variante `success`; no escuro `--color-success-strong` é cor de texto e não serve de fundo)
- `ouro`
- `danger`
- `link`

Tamanhos exatos:

- `sm`
- `md`
- `lg`
- `icon`
- `iconSm`

Referência de variante:

```ts
buttonVariants({
  variant: 'primary',
  size: 'md',
})
```

Botão com loading:

```tsx
<Button loading>Salvar</Button>
```

## Badge

Fontes:

- `src/components/ui/badge-variants.ts` + `badge.tsx` — componente **governado** da library (o que se importa em produção).
- `src/docs/pages/components/BadgeDoc.tsx` — catálogo visual completo (playground da doc, o "Storybook" do Badge).

> **Divergência conhecida:** library e playground usam APIs e paletas distintas. Em produção, importe o componente governado. O catálogo de semântica, composições e cenários abaixo vem do `BadgeDoc` (referência visual do design). Diferenças principais: o governado pinta com token translúcido (`bg-primary/10`, `bg-success/14`…) e é sempre pill; o catálogo da doc usa fundos pastel sólidos, radius `4px` (ou `999px` com `pill`) e inclui a variante `ouro`/Destaque, que **não** existe no governado.

### API governada (library)

```tsx
import { Badge } from '@/components/ui/badge'

<Badge variant="success" dot>Ativo</Badge>
```

Base (cva): `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold`.

Props: `variant` + `dot?: boolean` (bolinha `bg-current` antes do texto). Variantes exatas: `default`, `secondary`, `success`, `warning`, `danger`, `outline`, `info`.

### Catálogo de variantes (semântica + rótulo pt-BR)

| variant (library) | rótulo na doc | significado | quando usar |
| --- | --- | --- | --- |
| `default` | Padrão | azul institucional | identificador genérico, versão, categoria padrão |
| `secondary` | Secundário | cinza neutro | metadados, contadores discretos, info de suporte |
| `success` | Sucesso | verde positivo | ativo, aprovado, concluído, online (sempre com `dot`) |
| `warning` | Atenção | laranja, alerta moderado | pendente, aguardando, prazo próximo, em revisão |
| `danger` | Crítico | vermelho negativo | inativo, rejeitado, vencido, erro, offline |
| `outline` | Contorno | só borda, mínimo impacto | tag de baixa prioridade, filtro, categoria discreta |
| `info` | Informativo | azul claro neutro | "novo", "em análise", nota, tipo |
| `ouro` *(só doc)* | Destaque | dourado | Fipcoins, conquistas, gamificação, item premium |

No playground os nomes pt-BR são internos (`sucesso`/`atencao`/`critico`/`ouro`); ao consumir a library use os nomes técnicos (`success`/`warning`/`danger`).

### Composições (Badge do playground)

Props extras do Badge da doc: `dot`, `icon`, `count`, `onRemove`, `pill`, `size` (`sm`/`md`/`lg`).

Regras:

- **dot** — exclusivo para status que mudam dinamicamente; não usar em categoria fixa.
- **icon** — máx. 1 por badge; não combinar `dot` + `icon` no mesmo badge.
- **count** — fica à esquerda do texto, cor invertida (fundo = cor do texto); acima de 99 vira `99+`.
- **onRemove** — X à direita com hover opacity; combina com `pill` para visual de tag/filtro.
- **size dentro de tabela** — Badge em célula **acompanha a densidade** da `<Table>` via `useTableDensity()`: `comfortable → md`, `compact|normal → sm`, fora de tabela → `sm`. Não fixar `size` hardcoded em badge de célula; deixar o hook decidir. Ver wrapper `useBadgeSize()` em `src/components/BiBadges.tsx` (Governança BI) e **Data Listing → Tabela canônica** em `patterns.md`.

### Tokens (catálogo da doc)

Tamanhos: `sm` 10px · `md` 11px ★ (default) · `lg` 12px. Padding: `sm` 1×6 · `md` 2×8 · `lg` 3×10. Radius: `4px` padrão ou `999px` com `pill`. Texto Open Sans 600; contador Fira Code 700; line-height 1.3; `nowrap`. Dot: 5/6/7px (sm/md/lg).

Cores por variante (claro → escuro):

| variant | bg claro | text claro | bg escuro | text escuro |
| --- | --- | --- | --- | --- |
| `default` | `#004B9B` | `#FFFFFF` | `#1A6FC4` | `#FFFFFF` |
| `secondary` | `#F2F4F8` | fg | — | — |
| `success` | `#ECFDF5` | `#006D35` | `rgba(0,168,62,.15)` | `#8BE5AD` |
| `warning` | `#FFF0D6` | `#C2410C` | `rgba(246,146,30,.14)` | `#FDC24E` |
| `danger` | `#FEF2F2` | `#B91C1C` | `rgba(248,113,113,.15)` | `#F87171` |
| `outline` | transparent | fg | — | — |
| `info` | `#D3E3F4` | `#002A68` | `rgba(147,189,228,.15)` | `#93BDE4` |
| `ouro` | `#FEF9E7` | `#92400E` | `rgba(253,194,78,.15)` | `#FDC24E` |

## Card

Fonte: `src/components/ui/card.tsx`

Base visual real do produto:

```tsx
<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]" />
```

Uso:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Titulo</CardTitle>
    <CardDescription>Resumo curto</CardDescription>
  </CardHeader>
  <CardContent>Conteudo</CardContent>
</Card>
```

## Field e controles de formulário

Fontes:

- `src/components/ui/field.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/textarea.tsx`

Regras:

- `FieldDensity`: `default` ou `compact`
- `FieldInset`: `none`, `control`, `icon`
- Label padrão em modo normal é uppercase e mais discreta.
- `compact` é a densidade preferida em filtros, modal denso e painéis operacionais.

Heights reais:

- `Input`/`Select`/`FieldTrigger` default: `h-12`
- `Input`/`Select`/`FieldTrigger` compact: `h-8` (32px — `Select` `dense` é o mesmo valor, mantido por compat)
- `Textarea` default: `min-h-[132px]`
- `Textarea` compact: `min-h-[92px]`

Caixa do campo (`Input`, `Select`, `Textarea`, `FieldTrigger`, `InputGroup` — todos compartilham):

- **Radius**: `rounded-lg` (8px) — não `rounded-xl`.
- **Borda**: `border border-[var(--color-border-control)]` (1px, sólida, sem alpha). No claro é `#808d9a` (3,39:1 sobre branco); no escuro é `#727272` (3,62:1 sobre o cartão, 3,19:1 sobre a página). `--color-border` segue só como divisor. Hover: `--color-fg-muted` nos dois temas.
- **Fonte**: compact `text-[13px]`, default `text-[1.08rem]` (`Textarea` default `text-[1.02rem]`).
- **Sombra em repouso**: nenhuma (`boxShadow: none`). Só o anel de foco (`focus-visible:ring-2 ring-[var(--color-primary)]/25`).
- **Pendente (`Input pending`)**: obrigatório ainda vazio. Fio de 2px em `--color-semantic-atencao-fg` (também no hover) e fundo em `--color-semantic-atencao-bg`; o `<input>` ganha `data-pending="true"`. Contraste do fio contra a célula: 5,18:1 no claro e 10,78:1 no escuro (WCAG 1.4.11 pede 3:1). O foco troca o fio pelo azul de foco. O erro vence: com `aria-invalid`, `disabled` ou `readOnly` o pendente não pinta. A cor não carrega sozinha: mantenha ao lado um `Badge variant="warning"` "Em branco" (ou texto), e passe `pending={!valor}` para o fio e o selo saírem juntos ao preencher. Pendências conhecidas: o texto do `Badge warning` mede 2,07:1 no claro até o #106 levá-lo para `--color-semantic-atencao-fg`, e o placeholder (`--color-fg-muted`) mede 4,30:1 sobre o fundo de atenção no claro até o #143. A guarda só lê o `disabled` do próprio campo: dentro de `<fieldset disabled>`, o fio laranja continua, então passe `pending={false}` nesse caso. Por ora só no `Input`.
- **Dark mode do foco/borda ativa**: `--color-primary` **não muda** entre light/dark neste projeto (fica `#004B9B` fixo — só `--color-border`/`--color-surface`/`--color-fg` etc. redefinem por tema). Por isso todo estado que usa `--color-primary` como acento (borda em foco, anel de foco, borda do Select aberto, borda do dropdown, opção selecionada) precisa do par manual `dark:border-[#93BDE4] dark:ring-[#93BDE4]/25` — sem isso o acento fica com baixo contraste no escuro. Não remover esses `dark:` — não são resíduo, são o substituto funcional da falta de um `--color-primary` dark.

Fonte de verdade: `Field`/`FieldInput`/`Select` de `client/src/components/ui-sup/` no projeto QLP (`~/dev/projetos/QLP`), usados de verdade em `ColaboradorForm.tsx` (tela Edição Colaborador) — comentário do próprio `select.tsx` de lá documenta a cadeia Governança BI (canônico) → QLP (adaptado). Alinhados na v0.11.15 — a v0.11.14 tinha corrigido radius/borda mas errado a altura (35px, tirado do `DSInput` local de `/docs/components/input`, que diverge do padrão real de produto).

Composição recomendada:

```tsx
<Field density="compact" inset="icon">
  <FieldLabel required>Razao social</FieldLabel>
  <Input density="compact" placeholder="Nome da empresa" />
  <FieldMessage tone="danger">Campo obrigatorio</FieldMessage>
</Field>
```

Teclado e formulário (`Select` e `ChipSelect`): no gatilho, ArrowDown/ArrowUp abrem e movem o realce, Home/End vão ao primeiro/último, Enter ou Espaço selecionam, Escape fecha sem mudar o valor (e não fecha o Dialog/Drawer em volta), Tab fecha. O realce é anunciado por `aria-activedescendant`, com `aria-controls` no listbox. `Select` aceita `name` e entra no `FormData` do submit nativo por um input oculto. No `ChipSelect` com busca, as mesmas teclas funcionam no campo, e o foco automático no campo só acontece com ponteiro fino (no toque não abre o teclado virtual; o gatilho vira o combobox e anuncia o realce). A opção realçada pelo teclado ganha barra lateral de 3px (contraste de pelo menos 3:1 contra a lista nos dois temas) e só o teclado rola a lista: abrir com clique e passar o mouse não rolam nada. O input oculto do `Select` leva o valor atual, mas não volta ao `defaultValue` num `form.reset()` e não aceita `required`. Em formulário com reset ou validação nativa, controle `value` e valide no submit.

Dropdown do `Select`: **a partir da v0.21.2 a lista abre num portal para o `body`**, com `position: fixed` na coordenada do gatilho (`z-[70]`, acima de Modal e Drawer em `z-50` e do tour em `z-[60]`). Corpo rolável de Modal, Drawer e card com `overflow-hidden` não a cortam; ela sobe quando embaixo não cabe (o gatilho troca `rounded-b-none` por `rounded-t-none`), encolhe e rola por dentro quando falta espaço dos dois lados, acompanha a rolagem, o redimensionamento e o gatilho que muda de lugar sem rolar, e fecha quando o gatilho sai da área visível. Teste de app com Testing Library acha as opções por `screen`, não por `within(container)`, porque elas estão no `body`. Leva `data-lista-flutuante` (mesmo marcador do `SelectBusca` dos apps): componente do app que fecha por clique fora com `contains` deve ignorar alvos dentro de `[data-lista-flutuante]`. **Em versões anteriores à v0.21.2 (medido nas tags v0.5.0 a v0.20.26 e nos tarballs 0.12.3, 0.12.5 e 0.20.4) o dropdown é `absolute` (sem portal)**: ancestral com `overflow-hidden` ou `overflow-y-auto` corta a lista "pra dentro", e dentro de `Modal` o corte é certo. Ver **Data Listing → Cuidado (clipping)** em `patterns.md`. O `ChipSelect` continua `absolute` em toda versão.

### Tipos de seleção (catálogo — qual usar quando)

Fonte: `src/docs/pages/components/SelectDoc.tsx` (Seção 01, **9 tipos**). Só `Select` é primitive governado; os outros são padrões demonstrados na doc (implementados localmente na página) que os apps replicam.

| Cenário | Tipo |
| --- | --- |
| 3–15 opções | `Select` |
| 15+ opções ou precisa buscar | `Autocomplete` |
| N opções simultâneas | `Multi-select` |
| Lista sempre visível, múltipla | `Checkbox` |
| Lista sempre visível, exclusiva | `Radio` |
| Sim/Não binário | `Toggle` (5 estilos) |
| Poucas opções visuais, todas à vista | `Chip Select` (pílulas, sem dropdown) |
| **Barra de filtros / toolbar** | **`Chip Filtro`** |
| 2–4 modos de visualização | `Segmented` |

**`Chip Filtro`** (novo na v0.11.16, busca na v0.11.19) — botão fechado `Rótulo: Valor` que abre dropdown com radio. Visualmente é chip (padding `7px 12px`, `32.5px` de altura, borda 1px, `radius 8`, fonte 11px/600); comportamento é de `Select`. Aberto: borda `--color-primary` + `box-shadow 0 0 0 2px {primary}1F`. Dropdown tem **campo de busca fixo no topo** (autofoco ao abrir, filtro case-insensitive por substring, estado vazio `Nenhum resultado para "X"`) e lista com `maxHeight: 220 / overflowY: auto`. Uso exclusivo em filtro/toolbar — em formulário use `Select`; se as opções devem ficar todas visíveis ao mesmo tempo, use `Chip Select`.

> Divergência proposital: o `ChipSelect` real do Governança BI (e o de `DrawerDoc.tsx`) **não** tem busca, só radio. A busca é uma evolução isolada do `Chip Filtro` do DS-FIPS.

## Tabs, Table, Dialog, Drawer, Tooltip, Progress

Movimento: nenhum componente de `ui` e `composites` usa `transition-all` (transição só de cor, opacidade, sombra, transform e filter). Com `prefers-reduced-motion: reduce`, um bloco global em `globals.css` zera duração de animação e transição (spinner parado, sem shimmer, Dialog sem escala, Drawer sem deslizar); o `CircularCommandMenu` usa `MotionConfig reducedMotion="user"` e abre sem animar nem a opacidade dos itens. `Progress` anima por `transform` (com `background-size` na mesma duração e curva) e o toggle do menu de colunas por `translateX`. Anel de foco dos botões de fechar (Drawer, Modal hero), do `TabsContent` e do gatilho do menu radial só aparece com `focus-visible` (teclado).

Fontes:

- `src/components/ui/tabs.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/tooltip.tsx`
- `src/components/ui/progress.tsx`

Direção de uso:

- `Tabs`: navegação secundária e troca de contexto dentro da tela. O texto da aba ativa lê `--color-primary-text` sobre `--color-surface` (`#004b9b` no claro, 8,47:1; `#93bde4` no escuro, 8,82:1); a inativa herda `--color-fg-muted` da lista. Não pinte a ativa com `--color-primary`: ele não muda no escuro e mede 2,06:1 ali
- `Table`: listagem operacional densa, com wrapper card e hover de linha. Sistema de densidade (`compact|normal|comfortable`) + toggles de aparência (`zebra`, `verticalBorders`, `stickyHeader`, `wrapText`) e `framed`, todos via props propagadas por context. Hook `useTableDensity()` deixa descendentes (Badge) auto-ajustarem. API completa, métricas por densidade, `AdminTableColumnMenu`/`Pagination`/`SortHeader` e persistência em `localStorage`: ver **Data Listing → Tabela canônica** em `patterns.md`
- `Dialog`: ações focadas, filtros avançados em desktop, confirmação
- `Drawer`: detalhes e fluxos laterais, principalmente em tablet/mobile
- `Tooltip`: dica curta; requer `TooltipProvider`
- `Progress`: status numérico e andamento visual

**0.21.0, rodada 3 (QA visual, acessibilidade e funcional):**

- `Dialog`, `Modal` e `Drawer` devolvem o foco a quem os abriu ao fechar, também quando abrem por estado (`open={aberto}`) e não por `DialogTrigger` (antes o foco ia para o `body`).
- `Drawer`: `DrawerContent` rola (`overflow-y-auto`). Novos `DrawerBody` (`min-h-0 flex-1 overflow-y-auto`, rola sozinho) e `DrawerFooter` (`sticky bottom-0`, rodapé sempre à vista, inclusive em 1280x720 e no celular). Use `DrawerHero` + `DrawerBody` + `DrawerFooter` em painel com formulário.
- `Modal` "Tela cheia" ocupa 96% da janela nos dois eixos mesmo que o app passe `className` com `max-w-*`: em tela cheia o tamanho do DS vem depois do `className` (`classesDoModal`, `modal-variants.ts`).
- `Select`, `ChipSelect` e o seletor de período do `ListingFilterToolbar`: a lista suspensa fica inteira na tela e na área rolável que a recorta (corpo de Modal ou Drawer). Vira para cima, encurta (`max-height`) ou desloca na horizontal; sem portal, então foco e Esc seguem do painel (`useListaNaTela`, `lista-na-tela.ts`).
- `FilterDrawer`: `emptyDescription` padrão é "Refine os resultados pelos campos abaixo" (antes "Refine os OPAs…"); o app passa o texto do seu produto.
- `Field`: o asterisco de obrigatório usa `--color-danger-text` (6,47:1 sobre branco; era `--color-danger`, 3,76:1). `PillFilter` ativo com cor em hex leva texto escuro quando o branco não passa de 4,5:1 (`corDoTextoSobre`).

### Dialog/Modal — componente governado

**Fonte real: `src/components/ui/Modal.tsx`** — exporta `Modal` + `ModalFooter`, ambos reexportados pela library (`@fips-app/ds-fips`). É construído sobre `Dialog`/`DialogContent`/`DialogHeader`/`DialogTitle`/`DialogDescription`/`DialogClose` de `src/components/ui/dialog.tsx` (não confundir com o painel utilitário neumórfico do `ExportModal` legado, que é outra família visual, `eslint-disable` no topo).

**`Modal` — props (todas de `ModalProps`, sem `className` visual em consumidor — `governance/no-visual-overrides` cobre `Button`/`Input`/etc., não `Modal`, mas o espírito é o mesmo: aparência vem das props, não de classes soltas):**

| Prop | Tipo | Default | Efeito |
|---|---|---|---|
| `open` | `boolean` | — | obrigatório |
| `onOpenChange` | `(open: boolean) => void` | — | obrigatório — **não** `onClose` |
| `title` | `ReactNode` | — | vira `DialogTitle` |
| `description` | `ReactNode` | — | vira `DialogDescription`, abaixo do título |
| `children` | `ReactNode` | — | corpo; um `<ModalFooter>` entre os filhos é extraído e renderizado fixo embaixo (não precisa ser o último) |
| `size` | `'sm'\|'md'\|'lg'\|'xl'\|'2xl'\|'3xl'\|'full'\|'workflow'` | `'md'` | `max-w-{sm..3xl}` / `max-w-4xl` (`full`) / `max-w-[900px]` (`workflow`) — nunca `className="max-w-*"` |
| `headerIcon` | `LucideIcon` | — | opcional. O modal curto padrão não tem ícone. Com ícone, o círculo é `40×40` `bg-[var(--color-fips-blue-200)]/60` |
| `hero` | `boolean` | `false` | header institucional (gradiente gov 135°, texto branco, close translúcido) em vez do header branco simples com borda |
| `eyebrow` | `ReactNode` | — | rótulo dourado uppercase acima do título — **só tem efeito com `hero`** |
| `noPadBody` | `boolean` | `false` | remove `px-6 py-5` do corpo; o conteúdo controla o próprio espaçamento (usado por conteúdo full-bleed, ex. tabela dentro do modal) |
| `permiteTelaCheia` | `boolean` | `false` | mostra o botão `Maximize2` / `Minimize2` ("Tela cheia" / "Restaurar", `aria-label` e `aria-pressed`) à esquerda do X. Em tela cheia o modal ocupa `96vw × 96dvh` e só o corpo rola; cabeçalho e `ModalFooter` ficam fixos. Sem a prop nada muda. Com a prop, uma lista de `Select` recém-aberta é trazida para a vista dentro do corpo |
| `telaCheia` | `boolean` | — | estado controlado da tela cheia. Sem ele o `Modal` guarda o estado e volta ao tamanho normal ao fechar |
| `telaCheiaInicial` | `boolean` | `false` | estado inicial no modo não controlado |
| `aoMudarTelaCheia` | `(telaCheia: boolean) => void` | — | chamado quando o botão ou o atalho alterna |
| `atalhoTelaCheia` | `boolean` | `false` | liga `Alt+Enter` (foco dentro do modal) para alternar; só com `permiteTelaCheia` |
| `showCloseButton` | — | — | existe no tipo mas **não é lido** pelo componente — o X é decidido internamente por `!hero` (hero sempre tem X próprio; não-hero delega ao X default do `DialogContent`) |
| `layer` | `number` | — | existe no tipo, **não usado** no corpo do componente hoje |

**`ModalFooter` — props:** `children` (botões), `className`, `hint` (texto de apoio à esquerda — se ausente, um spacer ocupa o lugar pra empurrar os botões à direita). Border-top + fundo `--color-surface-muted`/70, `px-6 py-4`.

**Anatomia do header `hero`** (gradiente `linear-gradient(135deg, var(--color-gov-gradient-from) 0%, var(--color-gov-gradient-to) 60%, #001A4A 100%)`): tile de ícone `44×44px rounded-[10px]` com gradiente glass translúcido (branco 14%→6%→azul 22%) + borda `white/16`, eyebrow `11px/600/tracking-[0.14em] uppercase` cor `--color-accent-strong`, título branco `21px/700` Saira Expanded, descrição `white/65` `12px`, close `32×32 rounded-lg` `top-3.5 right-3.5` `bg-white/8` → hover `white/18`. Radius do modal inteiro: assimétrico `12px 12px 12px 24px` (assinatura FIPS) via `DialogContent`, não `rounded-2xl` uniforme.

**Anatomia do header não-`hero` (este é o padrão do modal curto):** `DialogHeader` com borda inferior, título `text-lg` (`dark:text-white`), descrição do `DialogDescription` (`dark:text-zinc-400`). Sem ícone. Se houver `headerIcon`, o círculo é `40×40` `bg-[var(--color-fips-blue-200)]/60` `text-[var(--color-primary)]`.

**Modal curto no tema escuro:** o mesmo componente, `hero` desligado. O cartão é o `DialogContent` na variante `dark` (degradê `#272727` → `#1d1d1d`, faixa azul de 3px no topo). Corpo em `--color-fg`. Passos em `<ol className="list-decimal space-y-2 pl-5 text-[13px] leading-snug">`, nunca disco azul. Uma ação: `Button variant="primary"` dentro de `ModalFooter`. No site, desde a 0.20.41, o botão "Simples (escuro)" em `/docs/components/dialog` abre esse cartão com `className="dark"` (o portal não herda o tema da página). No app, o tema vem do `html.dark`. Contraste medido neste cabeçalho, Facilities 0.15.1, tema escuro: título 15,33:1, descrição 5,84:1, lista 12,51:1, `primary` 8,47:1.

**Não use no modal curto:** `hero`, `eyebrow` (selo "Aplicativo"), tile glass, cópia local com `tone` (Facilities `app/src/components/Modal.tsx` e o QLP), que pinta o degradê sempre.

**Modal não rola.** Modal curto cabe na janela e não rola. Conteúdo grande (formulário com vários blocos, tabela, pré-visualização) liga `permiteTelaCheia` (opcional `atalhoTelaCheia`; `telaCheia` + `aoMudarTelaCheia` quando o conteúdo muda de colunas com o tamanho): o botão fica ao lado do X, como no Tecnopano. Sem `permiteTelaCheia` o corpo ainda rola quando passa de 90% da altura, e `Select` perto da borda de baixo continua cortado. Exemplos na página `/docs/components/dialog` (seção 11): "Simples (escuro)", "Longo (tela cheia)" e "Longo (escuro)". Medido em 1440x900 e 375x812: botão e X sem sobreposição, lista de 4 opções do último campo inteira no corpo.

**Regra:** `eyebrow` nunca repete palavra do título. `eyebrow` só entra com `hero`, e `hero` só no modal institucional longo.

```tsx
import { Modal, ModalFooter, Button } from '@fips-app/ds-fips'

<Modal open={open} onOpenChange={setOpen}
  title="Instale o Facilities no aparelho"
  description="Fica como ícone na tela inicial e abre em tela cheia, sem a barra do navegador."
  size="lg">
  <ol className="list-decimal space-y-2 pl-5 text-[13px] leading-snug text-[var(--color-fg)]">
    <li>Abra o menu do navegador no canto superior</li>
    <li>Escolha Instalar aplicativo ou Adicionar à tela inicial</li>
    <li>Confirme em Instalar</li>
  </ol>
  <ModalFooter>
    <Button variant="primary" onClick={() => setOpen(false)}>Entendi</Button>
  </ModalFooter>
</Modal>
```

O `hero` abaixo é o modal institucional longo, não o aviso curto:

```tsx
import { Modal, ModalFooter, Field, FieldLabel, Input, Button } from '@fips-app/ds-fips'
import { UserRound } from 'lucide-react'

<Modal open={open} onOpenChange={setOpen} hero headerIcon={UserRound}
  eyebrow="Requisição" title="Atribuir responsável"
  description="Selecione o colaborador e tipo de atribuição." size="lg">
  <Field density="compact">
    <FieldLabel required>Responsável</FieldLabel>
    <Input density="compact" placeholder="Nome do colaborador" />
  </Field>
  <ModalFooter hint="Você poderá editar depois.">
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
    <Button variant="success">Salvar atribuição</Button>
  </ModalFooter>
</Modal>
```

**Gaps conhecidos do componente real (não invente prop pra cobrir — são lacunas, não documentação incompleta):**

- **Não existe `tone`/variante de cor sólida.** `hero` é binário: gradiente institucional ou header branco simples. Não há prop pronta pra faixa sólida verde (confirmação) / vermelha (destrutivo) / laranja (alerta) — hoje quem precisa disso reimplementa o header na mão (ver "Não faça" abaixo). Se for construir esse caso, evolua `Modal.tsx` primeiro (prop nova, ex. `tone?: 'success'|'danger'|'warning'`) em vez de remontar a casca no consumidor.
- **Sem JunctionLines no header `hero`.** O preset `ModalHeroJunctionLines` (`src/components/icons/JunctionLines.tsx`) existe especificamente pra isso — o comentário no próprio arquivo diz "compartilhada com o `<Modal hero>`" — mas `Modal.tsx` não o importa nem renderiza. A decoração de trilhos só aparece em componentes que remontam o header na mão (`ChangelogModal`, `ExportPreviewModal`).

**Não faça — reimplementações locais que existem hoje (dívida, não padrão a copiar):** `src/docs/pages/components/DialogDoc.tsx` tem uma função local `Modal` (props `onClose`/`headerBg`/`width`/`icon`, API diferente da real) usada em 6 das variantes do playground (Confirmação, Destrutivo, Alerta, Informativo, Formulário, Lista); `ChangelogModal.tsx`, `ExportPreviewModal.tsx`, `BuscarPessoaModal.tsx` e `BuscarUsuarioModal.tsx` também remontam `Dialog`/`DialogPrimitive` na mão em vez de compor `<Modal>`/`<ModalFooter>`. Nenhum desses é referência de como consumir o componente — são candidatos a migração, não exemplo.

> **Por que os `Buscar*Modal` remontam à mão (contexto, não desculpa):** o `<Modal>`/`DialogContent` do catálogo hoje é shadcn/Tecnopano — card `rounded-2xl` + `bg-gradient-to-br #fafafa→#e8e8ec` + ícone do header **branco**. O padrão FIPS aprovado (NDM/OPA/QLP) é card **`rounded-[12px_12px_12px_24px]` + surface plano** + faixa gov com **ícone âmbar** (`var(--color-accent)`). Como o `<Modal>` não produz esse visual, os modais de busca remontam Radix cru pra bater com o FIPS. **Correção canônica:** alinhar o `DialogContent` (`src/components/ui/dialog.tsx`) ao card FIPS (raio assimétrico + surface, ícone âmbar no `hero`) e então fazer os `Buscar*Modal` **comporem `<Modal hero>`** em vez de remontar.

### Modal "Novidades do Sistema" (Changelog)

Modal real de produto (não é exemplo de playground) — acionado pelo item **Versão** do rodapé do sidebar (ver `patterns.md` → Application Shell → Sidebar → rodapé, item 4).

Fontes: `src/components/layout/ChangelogModal.tsx` (componente) + `src/docs/data/changelog.ts` (fonte única de dados, tipo `ChangelogVersion[]` com `entries: {type, description}[]`) + `src/docs/pages/ChangelogPage.tsx` (timeline em `/docs/changelog`, consome a **mesma** fonte).

Anatomia:

- **Header**: canônico (acima) — eyebrow `"Versão {CURRENT_VERSION}"`, título fixo "Novidades do Sistema", ícone `Sparkles` âmbar sobre `GOV_GRAD`.
- **Corpo** (rolável, `max-h-[85vh]` no modal): por versão, título + `v{versão} • {data pt-BR}`; lista de mudanças em cards `p-2.5`, `rounded-lg`, cor por `type`:

  | `type` | Ícone | Rótulo | Cor (tokens semânticos, `/10` bg + `/25` border) |
  |---|---|---|---|
  | `feature` | `Sparkles` | Novidade | `--color-success` |
  | `improvement` | `Wrench` | Melhoria | `--color-secondary` / `--color-primary` |
  | `fix` | `Bug` | Correção | `--color-danger` |
  | `breaking` | `Rocket` | Importante | `--color-accent-strong` |

- Só a versão mais recente aparece por padrão; botão texto "Ver versões anteriores" expande o histórico completo.
- **API real: só `{ open, onOpenChange }`.** Não existem props `changelog`/`currentVersion` — as versões vêm sempre de `CHANGELOG` (`src/docs/data/changelog.ts`), não são configuráveis.
- **Footer**: `Button variant="primary" size="lg" className="w-full"` — "Entendi, vamos lá!" (fecha o modal).
- **Largura**: `max-w-xl` (576px) — mais larga que o modal padrão (`max-w-lg`/512px) por ter listas de texto mais longas.

Não faça:

- duplicar os dados do changelog — sempre importar de `src/docs/data/changelog.ts`, nunca criar array local (aconteceu em `ChangelogPage.tsx` antes de v0.5.5, ficou defasado)
- usar cores Tailwind cruas nos cards por tipo (`bg-green-100`, `text-red-700` etc. — isso vem do modelo de referência do Governança TI/Suprimentos, mas no DS-FIPS é sempre token semântico + variante `dark:`)
- auto-abrir por `localStorage` a cada versão nova — neste DS o gatilho é **só** o clique no botão Versão, sem popup intrusivo automático

## ExportPreviewModal

Fonte: `src/components/composites/ExportPreviewModal.tsx` · canônico Tecnopano `ExportPreviewModal.tsx`

Modal grande de exportação: **header hero gov-gradient** (mesma anatomia canônica do `ChangelogModal`/`Modal` — âmbar, eyebrow "EXPORTAÇÃO", JunctionLines, título dinâmico, close/Tela cheia translúcido-branco) · segmented **Tudo / Tabela / Expandida** · chips de colunas (toggle + drag) · preview · footer Cancelar / Imprimir / PDF / Excel.

Header renderizado com `showCloseButton={false}` no `DialogContent` (que mantém a faixa azul 3px + grain próprios) e uma faixa gov-gradient full-bleed por cima (`-mx-6 -mt-6` cancelando o padding do `DialogContent`, clipada pelos cantos arredondados do painel via `overflow-hidden` do ancestral — **não precisa de radius próprio**). Usa `DialogPrimitive.Title`/`DialogPrimitive.Description` crus (não os wrappers `DialogTitle`/`DialogDescription` governados, que têm cor fixa incompatível com fundo escuro) — mesma técnica do `ChangelogModal`.

**Rodapé — cada botão aparece se a callback correspondente for passada** (não depende mais de `intent`, que agora só define o título/ícone default do header): `onPrint` → Imprimir (outline); `onExportPdf` → PDF (**danger/vermelho**); `onExportExcel` → Excel (**successStrong/verde escuro**, rótulo "Excel" — não "Planilha"). Um consumidor pode passar as 3 para mostrar tudo (ex.: playground `DialogDoc.tsx`) ou só 1-2 pra manter um fluxo focado.

**Família Modal** — demos em:
- botões Excel/PDF em `/docs/patterns/data-listing`
- botão "Exportação" do playground de `/docs/components/dialog`

```tsx
<ExportPreviewModal
  open={open}
  onOpenChange={setOpen}
  columns={cols}
  tableColumnKeys={[...]}
  expandedColumnKeys={[...]}
  data={rows}
  onPrint={(keys, layout) => {}}
  onExportPdf={(keys, layout) => {}}
  onExportExcel={(keys, layout) => {}}
/>
```

## ExportButtons (par de exportação)

Fonte: `src/components/composites/ExportButtons.tsx` · ícones `src/components/icons/FileIcons.tsx` · demo: `src/docs/pages/patterns/DataListingDemo.tsx`

Par de ações no fim da toolbar de listagem: dois botões **32.5×32.5 só-ícone**, cada um tintado pela cor da extensão (hover na mesma cor, suave):

- **Excel** — ícone verde Office `#1D6F42`; `aria-label="Exportar para Excel (.xlsx)"`
- **PDF** — ícone vermelho (`--color-danger`); `aria-label="Exportar para PDF (.pdf)"`

API:

```tsx
import { ExportButtons } from '@fips-app/ds-fips'

<ExportButtons onExcel={() => exportXlsx(rows)} onPdf={() => exportPdf(rows)} />
```

Regras:

- sempre o par, sempre à direita da toolbar
- só-ícone com `title` + `aria-label` (sem rótulo de texto)
- não trocar as cores: verde = Excel, vermelho = PDF — é convenção de extensão, não decoração
- botões nativos no composite (não `Button` + tint via `className` — governance)

## ListingKpiRow + StatsCard clicável

**0.21.0, rodada 3:** `ListingKpiCard.filtravel?: boolean` (padrão `true`). `false` desenha o cartão como `div`, sem foco, hover nem clique (indicador só informativo, como "Média de nota"); só os que filtram são botões. `ScopeSegment` e o trilho do escopo usam `--color-primary-text` no texto e `--color-fips-blue-100` com par escuro (`#172b47`). Os ícones Excel e PDF do `ListingFilterToolbar` são os do pacote (`ExcelIcon` em `--color-excel`, `PdfIcon` em `--color-danger-text`) e o Período fica à direita da linha também no celular.

Fonte: `src/components/composites/ListingKpiRow.tsx` · `StatsCard` com `onClick` / `selected` / `disabled`

Bloco **Indicadores rápidos**: faixa de `StatsCard` clicáveis no `panelHeader` do card da toolbar (borda inferior, acima de filtros/busca/export). Clique no card filtra a tabela; “Limpar filtro” limpa o foco. **0.21.0:** `titulo` e `hint` são opcionais e sem padrão: a grade aparece sozinha, como no Gestão OPA (antes o título "Indicadores rápidos" e a frase de apoio eram fixos; para tê-los, `titulo="Indicadores rápidos"` e `hint`). Nenhum consumidor medido (OPA-GESTAO, Facilities) usava o título do pacote.

> **v0.11.24 — saiu da demo, continua na library.** O bloco foi removido da toolbar de `/docs/patterns/data-listing` (a toolbar de lá agora demonstra só filtros/busca/período + Excel/PDF). `ListingKpiRow` e `StatsCard` seguem exportados e são o padrão recomendado quando a listagem precisa de KPIs clicáveis — só não há mais demo viva deles nessa página. O bloco de KPI cards com sparkline (acima da toolbar) é outro componente e continua na página.

## Busca de pessoa/usuário — BuscarPessoaModal / BuscarUsuarioModal

Modal de escolher pessoa/usuário. Fontes: `src/components/composites/BuscarPessoaModal.tsx` (responsável no Data Listing) e `BuscarUsuarioModal.tsx` ("Entrar como usuário…" do menu Minha Conta). Anatomia portada verbatim do OPA-Gestão (`composites/Modal.tsx`, tone gov), que herdou do NDM/QLP. Spec: `plans/spec-buscar-responsavel-modal.md`.

Anatomia (comum aos dois):

- **Card FIPS**: `rounded-[12px_12px_12px_24px]` (canto inferior-esquerdo 24) + `bg-[var(--color-surface)]` plano + `shadow-[var(--shadow-elevated)]`, `max-w-md`, `max-h-[85vh] flex flex-col overflow-hidden`. (Remonta Radix cru — ver dívida na seção Dialog/Modal acima.)
- **Header gov**: faixa `var(--fips-banner-content-bg)` (`px-6 py-5 pr-14`), tile do ícone 44×44 (`rounded-[10px]`, bg accent 10% / borda accent 19%) com ícone **âmbar** `var(--color-accent)` (NÃO branco); título branco 21px (Saira); **subtítulo visível** `text-white/65` (`Dialog.Description`, não sr-only); X glass branco.
- **Campo de busca FIXO** (`shrink-0 px-6 pt-5 pb-3`): input com lupa à esquerda, `autoFocus`, `h≈38 radius 8 border 1.5px`.
- **Lista ROLÁVEL** (`fips-scroll flex-1 space-y-0.5 overflow-y-auto px-6 pb-6`): o `pb-6` dá o padding inferior **dentro** da rolagem (último item respira ao rolar). Linha = `button flex items-center gap-3 rounded-xl px-2 py-2` com `PessoaAvatar`/`<img>` (foto → iniciais). Vazio: "Ninguém encontrado.".

Diferenças:

| | `BuscarPessoaModal` | `BuscarUsuarioModal` |
|---|---|---|
| busca | nome / cargo / matrícula | nome / e-mail (sem acento, `normalize NFD`) |
| sem busca | **só quem tem equipe** (`qtd_lideranca > 0`, ordenado por liderança) | todos |
| 2ª linha da row | `cargo · área` + matrícula à direita | e-mail + **papel colorido** à direita |
| hover da row | `bg-[var(--color-surface-muted)]` | `bg-[color-mix(in_srgb,var(--color-primary)_10%,transparent)]` |

**Dados são MOCK fictício de propósito** — no OPA/QLP a lista vem da API com CS/matrícula reais, que é dado sensível e não pode ir pro catálogo público.

## Scrollbar fina — `.fips-scroll`

Utility em `src/styles/globals.css` para listas roláveis em **superfícies claras** (modais, popovers). Barra **fina, sem botões de seta** (`::-webkit-scrollbar-button{display:none}`), thumb cinza translúcido flutuante (`color-mix(var(--color-fg-muted) …%, transparent)`, `border: 3px solid transparent; background-clip: padding-box`), `scrollbar-width: thin`. Não confundir com `.sidebar-scroll` (thumb **branco**, só pra sidebar escura) nem `.no-scrollbar` (esconde).

## CircularCommandMenu / RowActionsMenu

**0.21.0, rodada 3 (teclado):** com o menu aberto o foco real vai para o item realçado (padrão de menu: `role="menu"`, `aria-controls`, um item por vez com `tabIndex 0`). Setas giram, Home e End vão às pontas, Enter e Espaço ativam, Esc fecha e devolve o foco ao gatilho, Tab fecha e segue a partir do gatilho. Dentro de Dialog/Drawer o foco fica no gatilho (o focus trap do painel o devolveria) e o realce é anunciado por uma região `status`. Lógica em `menu-radial-logica.ts`.

Fonte: `src/components/composites/CircularCommandMenu.tsx` · `RowActionsMenu.tsx` · CSS `.cmd-glass*` / `.fips-row-action` em `globals.css`

Menu radial (portal + órbita + teclado). **Peer dependency:** `framer-motion` (>=11). Doc: `/docs/components/circular-command-menu` — item do sidebar chamado **"Ações"** (renomeado de "Circular Menu" na v0.11.31).

Um único componente, dois presets:

- **`RowActionsMenu`** — não é componente separado: é o `CircularCommandMenu` com trigger de **28px** pra caber numa célula de tabela (coluna Ações da listagem).
- **FAB** — o mesmo componente com o trigger padrão de **56px**, para ação isolada de página.

`ariaLabel` (v0.11.31) tem default `"Ações da linha"`, correto pro uso em tabela. **Fora de linha de tabela (FAB), passe `ariaLabel` próprio** — ex.: `ariaLabel="Ações rápidas"`.

O centro da órbita segue o gatilho (o × central abre sobre ele); só é preso à janela quando a órbita (`radius + 18`, meia bolinha de 36 px) não caberia, com margem `radius + 22` (v0.20.40).

```tsx
<RowActionsMenu
  rowId={row.id}
  radius={56}
  actions={[
    { key: 'edit', label: 'Editar pedido', icon: <Pencil />, onClick: () => {} },
    { key: 'delete', label: 'Excluir', icon: <Trash2 />, danger: true, onClick: () => {} },
  ]}
/>
```

## PageHero

Fonte: `src/composites/PageHero.tsx`

Header oficial para páginas de módulo:

```ts
export const PAGE_HERO_DEFAULT_DECORATION = '/backgrounds/app-shell-home-trains.png'
```

Uso:

```tsx
import { PageHero } from '@fips-app/ds-fips'

<PageHero>
  <div className="px-8 py-10">
    <h1>Governanca</h1>
  </div>
</PageHero>
```

Comportamento:

- gradiente azul institucional
- foto/trilho sutil à direita por padrão
- fallback opcional para `showTrainSilhouette`

## HeroAtalho e HeroFileira

Fonte: `src/components/composites/HeroAtalho.tsx` e `HeroFileira.tsx`

Atalhos do hero da Home. `HeroAtalho` parado mostra só o ícone (30px); no hover ou no foco abre e mostra o nome dentro do botão. Cor, sombra e shimmer vêm de `docHeaderChrome`: nenhuma cor nova.

Para vários atalhos, use `HeroFileira`: um aberto por vez, o primeiro é o principal e fica aberto no repouso, apontar outro fecha o principal, sair da fileira volta a ele.

```tsx
import { HeroFileira } from '@fips-app/ds-fips'

<HeroFileira
  label="Atalhos da Home"
  atalhos={[
    { id: 'painel', icon: ClipboardList, label: 'Painel de Ações', href: '/painel' },
    { id: 'config', icon: Settings, label: 'Configurações', href: '/configuracoes' },
  ]}
/>
```

`data-*` e `aria-*` de `HeroAtalho` e de cada item da `HeroFileira` chegam ao `<a>`/`<button>` (ex. `'data-tutorial': 'novo'` como alvo de tutorial). `aria-label` e `data-state` são do componente. `pressionado` (boolean) vira `aria-pressed` no `<button>`, para o atalho que liga e desliga um filtro; sem `href`, sem mudar o visual. `target` e `rel` chegam ao `<a>` (só com `href`; com `target="_blank"` e sem `rel`, sai `rel="noopener noreferrer"`; `rel` informado vale como veio; no `<button>` são ignorados). `id` e `className` ainda não passam.

Armadilha: o estado e o "saiu" moram na fileira, nunca em cada atalho. Com o `onMouseLeave` em cada um, o vão de 8px entre os botões zera o estado por um quadro e o principal reabre no meio do caminho. Pelo teclado, o blur testa o `relatedTarget`. No Safari esse alvo vem nulo no Tab entre irmãos e ao clicar (o Safari não foca botão no clique), e a fileira espera um instante; com o ponteiro dentro, o blur não mexe no atalho apontado. Sair com o mouse não derruba um atalho que ainda tem foco de teclado, mas foco vindo de clique do mouse não segura nada (só `:focus-visible` conta).

## AbasDeSecao

Fonte: `src/components/composites/AbasDeSecao.tsx`

Sem `href` é `tablist`/`tab` (`aria-selected`, setas, Home, End; `idBase` + `propsDoPainel` ligam o `tabpanel`); com `href` é `nav` com `aria-current="page"`. Faixa de abas de seção, no topo (`posicao="topo"`, padrão) ou fixa acima da barra de navegação inferior (`posicao="rodape"`), para o celular: no topo ela sai da tela assim que a página rola.

```tsx
import { useState } from 'react'
import { AbasDeSecao } from '@fips-app/ds-fips'

const [aba, setAba] = useState('modo')

<>
  <main className="abas-secao-reserva">…</main>
  <AbasDeSecao
    posicao="rodape"
    label="Configurações"
    abas={[{ id: 'modo', label: 'Modo' }, { id: 'tema', label: 'Tema' }]}
    ativa={aba}
    onSelecionar={setAba}
  />
</>
```

Props: `abas` (`{ id, label, icon?, href? }`), `ativa` (id), `onSelecionar?`, `posicao?`, `label?`, `className?`. Aba com `href` vira `<a>` e recarrega a página sem router; sem `href` é `<button>`.

**Sem `--barra-inferior-altura` a faixa some.** O app publica a altura da própria barra. Sem ela a faixa fica em `bottom: 0`, por baixo da barra. Faixa fixa no mesmo vão (por exemplo "registro na fila"): publicar a altura em `--abas-secao-empilha`. A altura da faixa é `--abas-secao-altura`, que vale `max(39px, var(--alvo-toque))` (39px no escritório, 44px ou 48px no celular), e a página reserva o espaço com `abas-secao-reserva`, que substitui a reserva da barra e não soma: tire a reserva do app do MESMO elemento, porque uma regra sem camada do app vence a do pacote. Ancestral com `transform` vira o bloco de contenção do `fixed`. Se o app já reserva a altura da faixa de estado no corpo, não some a reserva duas vezes.

Armadilhas: o traço da aba ativa e a separação ficam dentro da caixa da faixa (o `overflow-x` recortaria o que saísse) e trocam de lado juntos com a posição; a altura nunca vai escrita à mão em dois lugares.

## TabelaExpansivel

**0.21.0, rodada 3:** `aoClicarLinha?: (linha) => void` torna a linha inteira clicável (`tabIndex 0`, Enter e Espaço com o foco na linha, cursor de mão), na tabela e no cartão do celular. Não dispara dentro de botão, link, campo ou menu da linha (chevron, número, ações) nem em evento que sobe por portal (menu radial). Exceção manual: `data-linha-ignorar` no elemento. Sem a prop a linha não é clicável.

Fonte: `src/components/composites/TabelaExpansivel.tsx` · doc: `/docs/components/tabela-expansivel`

Tabela com linha expansível: botão chevron (`aria-expanded`, `aria-controls`) abre sob a linha um painel de detalhe. Contêiner abaixo de `quebraEm` px (padrão 768) vira lista de cartões com o mesmo botão e painel. Feita sobre `Table`; `RowActionsMenu` para as ações da linha; rodapé aceita `AdminTablePagination`.

```tsx
import { TabelaExpansivel } from '@fips-app/ds-fips'

<TabelaExpansivel
  rotulo="Inspeções realizadas"
  colunas={[
    { id: 'numero', titulo: 'Nº', principal: true, ordenavel: true, celula: (l) => l.numero },
    { id: 'auditor', titulo: 'Auditor', celula: (l) => l.auditor },
  ]}
  linhas={naPagina}
  chave={(l) => l.id}
  renderDetalhe={(l) => <PainelAnomalias inspecao={l} />}
  rotuloDetalhe={(l, aberta) => `${aberta ? 'Recolher' : 'Ver'} anomalias de ${l.numero}`}
  acoesDaLinha={(l) => [{ key: 'abrir', label: 'Abrir', icon: <Eye />, onClick: () => abrir(l) }]}
/>
```

Props: `colunas` (`{ id, titulo, celula(linha, indice), ordenavel?, alinhamento?, className?, ocultaNoCartao?, principal? }`), `linhas`, `chave`, `renderDetalhe`, `expandidas?` (controlado) / `expandidasIniciais?`, `aoAlternar?(chave, aberta)`, `unica?` (só não controlado), `temDetalhe?`, `rotuloDetalhe?`, `acoesDaLinha?`, `ordenacao?` + `aoOrdenar?`, `renderCartao?`, `quebraEm?`, `rotulo` (obrigatório), `vazio?`, `densidade?`, `zebra?` (padrão `false`), `stickyHeader?`, `rodape?`, `className?`. Filtro, ordenação e paginação são de quem usa. A quebra mede o contêiner (ResizeObserver), não a janela; sem medida vale "tabela".

## AdminTablePagination: linhas por página

`itemsPerPageOptions` (2 ou mais) + `onItemsPerPageChange` mostram o seletor em botões `aria-pressed` ao lado da contagem (sem `Select`, serve em modal); `itemsPerPageLabel` troca o rótulo. Sem as duas props nada muda. Quem chama volta à página 1 ao trocar o tamanho.

## ListingFilterToolbar: texto próprio

Props opcionais, padrão = painel de OPAs: `searchPlaceholder`, `searchLabel`, `scopeLabels` (`{ minha, todos, grupo }`), `countUnit` (padrão "OPAs"), `showExport` (padrão `true`; `false` tira Excel e PDF), `escopos` (`['minha', 'todos']` por padrão; `['minha']` esconde "Toda jurisdição" para o perfil que só vê o próprio), `mostrarEscopo` (padrão `true`; `false` esconde o segmento da alçada). Abaixo de `md` o botão Filtros mostra só o ícone (o nome acessível continua "Filtros"), como no Gestão OPA.

## PageHeader

Fonte: `src/components/composites/PageHeader.tsx` (+ `banner-shared.tsx`; estilos em `.fips-page-header` de `src/styles/globals.css`)

Banner de página (Banner de Conteúdo): um por tela, com o h1. Não confundir com `PageHero`, que é a faixa de módulo e de Home.

```tsx
import { PageHeader, Button } from '@fips-app/ds-fips'

<PageHeader
  icon={<FileDown />}
  title="Sistema de Requisições"
  description="Gestão de compras e requisições do módulo Suprimentos"
  actions={<Button variant="accent" size="sm">Nova solicitação</Button>}
  actionsProps={{ 'data-tour-step': 'banner-acoes' }}
  data-tour-step="banner"
/>
```

Props: `title` (vira o h1), `description`, `icon`, `eyebrow` (rótulo de seção em texto, sem pílula), `info` (ao lado do título), `actions` (botões como filhos diretos, sem div em volta; com mais de dois a linha quebra), `actionsProps` (só `data-*`, vai para o slot de ações), `stats` (`{ label, value, dotColor? }[]`), `headingLevel` (1 a 6, padrão 1), `edge` (`card` ou `bleed`), `compact` (força a medida estreita; só para o apelido). `data-*`, `aria-*`, `className`, `style`, `id` e `ref` vão para a raiz.

Valores fixos (todos por token, nenhum token novo):

- fundo `var(--fips-banner-content-bg)`; sombra e borda dos tokens `--fips-banner-content-*`; trilhos de 4 caminhos na opacidade `--fips-banner-junction-opacity` (0,12 no claro, 0,04 no escuro)
- a medida segue a largura do próprio cartão (container query de 560px, sem JavaScript): 560px ou mais, raio 12/12/12/24, padding 22/26, tile 44 (raio 11), título 21px, descrição 12px; abaixo, raio 10/10/10/18, padding 12, tile 34 (raio 9), título 18px, descrição 11,5px e as ações vão para a última linha, lado a lado, com a mesma largura
- tile com fundo e borda a 10% e 19% de `--color-accent`; título em `font-heading`, 700, branco; descrição a 67% de branco, teto de 840px
- `edge="bleed"` tira o raio abaixo de 560px; a margem lateral é do pai

Regras: a página tem um h1 só (nos outros banners, `headingLevel={2}`); não sobrescreva cor, raio ou medida por classe do app; o componente ocupa a largura do pai (não o ponha em flex em linha). `PatternPanelHero` continua exportado como apelido, com as props de antes (`subtitle`, `badge`, `badgePill`, `action`, `stats`, `compact`, `dataTutorial`). Cópia para app sem o pacote: `exports/pattern-panel-hero` (leva `page-header.css`). Conferência: `node scripts/medir-banner.mjs <url>`.

## Modos de uso (`data-modo`)

Fonte: `src/styles/globals.css`.

App de campo tem dois modos: `data-modo="normal"` (escritório) e `data-modo="facil"` (pátio, com luva). O atributo vai no `<html>` ou em qualquer contêiner. Sem ele vale o normal, e nenhum token resolve vazio.

Tokens `--modo-*` (mesmos nomes e valores do app de campo): `--modo-alvo-min` (35px e 48px), `--modo-texto-campo` (13px e 14px), `--modo-texto-base`, `--modo-texto-rotulo`, `--modo-texto-titulo`, `--modo-espaco`, `--modo-borda-largura` (1px e 2px), `--modo-borda-cartao`, `--modo-sombra-cartao`, `--modo-raio-controle`, `--modo-raio-cartao`, `--modo-peso` (600 e 700).

`--alvo-toque` é o alvo de toque do aparelho: o token do modo acima de 767px e `max(44px, --modo-alvo-min)` até 767px (44px normal, 48px fácil). Use `min-height: var(--alvo-toque)` em controle de toque.

**Armadilha:** propriedade que lê outra (`--alvo-toque` lê `--modo-alvo-min`) resolve no elemento onde foi declarada. `--alvo-toque` e `--abas-secao-altura` ficam declaradas junto de cada `[data-modo]`; declarar só em `:root` faz um contêiner interno em modo fácil herdar o 35px da raiz.

## FipsLogo e marca do menu (sidebar header)

**0.21.0:** `FipsLogo` ganhou `variante?: 'selo' | 'branca'`. `selo` (padrão) é o quadrado branco de 32px com a logo colorida (`/fips-logo.png` do `public/` do app). `branca` é a marca branca sem fundo, 42px de altura, embutida no pacote (AVIF em data URI, nada para copiar): é a que vai no `marca` do `CabecalhoDocumento`, sobre a faixa verde (a logo colorida no lugar dela cai no arquivo de reserva e some no verde).

> **Atenção — são duas coisas diferentes com o mesmo "logo".** O componente `FipsLogo` e a marca que aparece no cabeçalho da sidebar **não são o mesmo elemento**. A sidebar real usa um `<img>` inline, **não** o componente `FipsLogo`. Confundir os dois põe um chip branco numa superfície azul-escura — fora do padrão. (Foi a causa de uma rodada longa de retrabalho no Governança BI.)

### Marca do menu — padrão canônico (use ESTE na sidebar)

Fonte real: `src/components/layout/DocsNeuSidebar.tsx` (cabeçalho, ~l.595–649). A marca é um `<img>` inline **branco, transparente, direto sobre o azul-escuro da sidebar (`#002a68`) — sem tile/chip branco, sem fundo, sem sombra.** Dois assets, trocados por estado:

| Estado | Asset | Geometria |
| --- | --- | --- |
| Aberto (expandido) | `/appfips-logo.png` — lockup "App ◫ FIPS", **quadrado 1024×1024 com respiro interno** | `height:52`, `width:auto`, `maxWidth:100`, `minWidth:60`, `objectFit:contain`, `objectPosition:left center` |
| Colapsado (rail) | `/appfips-mark-collapsed.png` — só o símbolo caixa | `36×36`, `objectFit:contain` |

`alt="App FIPS"` nos dois; `backgroundColor:transparent` / `background:none` sempre.

Ao lado da marca (só no aberto) vem o **nome do módulo** — não faz parte do lockup, é um `<span>` irmão:

- wrapper: `flex items-center`, `gap: 2` (aberto) / `0` (colapsado), `width:100%` (aberto) / `auto`, `justifyContent: flex-start` (aberto) / `center`.
- texto: `fontFamily: F.title` (**Saira Expanded** / `var(--font-heading)`), `fontWeight:700`, `fontSize:16`, `lineHeight:1.2`, `letterSpacing:0.03em`, cor `theme.textActive`, `whiteSpace:nowrap` + `ellipsis`.

```tsx
<div className="flex items-center" style={{ gap: collapsed ? 0 : 2, width: collapsed ? 'auto' : '100%', justifyContent: collapsed ? 'center' : 'flex-start' }}>
  <img
    src={collapsed ? '/appfips-mark-collapsed.png' : '/appfips-logo.png'}
    alt="App FIPS"
    style={collapsed
      ? { width: 36, height: 36, objectFit: 'contain', flexShrink: 0, background: 'none' }
      : { height: 52, width: 'auto', maxWidth: 100, minWidth: 60, objectFit: 'contain', objectPosition: 'left center', flexShrink: 0, background: 'none' }}
  />
  {!collapsed && (
    <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 16, lineHeight: 1.2, letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
      {nomeDoModulo}
    </span>
  )}
</div>
```

> Cada app troca só `nomeDoModulo` (DS-FIPS = "Design System"; Governança BI = "Governança BI"). Marca, assets e geometria ficam idênticos.

### Componente `FipsLogo` — divergência conhecida (NÃO usar na sidebar)

`src/components/brand/FipsLogo.tsx` é um **chip branco**: `flex h-8 w-8 rounded-lg bg-white p-0.5` com `/fips-logo.png` (lockup **horizontal**). É a versão para **fundo claro** (cabeçalho institucional sobre superfície branca). **Não usar no cabeçalho da sidebar escura** — o chip branco + lockup horizontal espremido fogem do padrão. Para sidebar, use o `<img>` inline acima.

### Gotchas (erros reais já cometidos)

- **Não espremer lockup horizontal em slot quadrado.** `/fips-logo.png` é ~1.93:1; num chip 36×36 vira borrão ilegível. O asset de menu aberto é o `/appfips-logo.png` **quadrado** (1024×1024) com respiro interno — é o respiro do próprio PNG que dá o espaçamento ao nome. Cortar o lockup "tight" mata esse respiro e ele cola no texto.
- **Sidebar escura = marca branca transparente, nunca chip branco.** As sidebars FIPS são `#002a68`; `bg-white`/tile ali quebra o padrão.
- **Aberto = lockup + nome; colapsado = só símbolo.** Não trocar por símbolo no aberto, nem deixar "FIPS" duplicado.
- Não aplicar distorção, sombra, recoloração ou transparência arbitrária fora das versões aprovadas.

> Marca no **trilho mobile do header** (não a sidebar) é um terceiro asset e comportamento — ver `patterns.md` → Application Shell → Header → `DocHeaderPageTrail`.

## Formulário de execução (SecaoNumerada, SegmentoAvaliacao, AssinaturaCanvas, BarraAcoesRodape, CardChecklist)

Fonte: `src/components/composites/{SecaoNumerada,SegmentoAvaliacao,AssinaturaCanvas,BarraAcoesRodape,CardChecklist}.tsx` (+ `segmento-avaliacao-variants.ts`, `estado-salvamento.ts`). Doc: `/docs/components/formulario-execucao`; montagem: `/docs/patterns/execucao-inspecao`. Genéricos: nenhuma regra de negócio, as respostas e os textos vêm por prop.

```tsx
import { SecaoNumerada, SegmentoAvaliacao, AssinaturaCanvas, BarraAcoesRodape, EstadoSalvamento, CardChecklist } from '@fips-app/ds-fips'

<SecaoNumerada id="itens" numero={2} titulo="Itens" dica="Responda todos" icone={ClipboardCheck}>
  <SegmentoAvaliacao
    rotulo="Avaliação do item 2.1"
    opcoes={[{ valor: 'AT', rotulo: 'AT', nome: 'Atende', tom: 'sucesso' }, { valor: 'NAT', rotulo: 'NAT', nome: 'Não atende', tom: 'aviso' }]}
    valor={resposta}
    onChange={setResposta}  // recebe null ao clicar na marcada
  />
</SecaoNumerada>
<AssinaturaCanvas rotulo="Inspetor" obrigatoria valor={dataUrl} onChange={setDataUrl} erro={tentou ? 'Falta a assinatura.' : undefined} />
<BarraAcoesRodape label="Ações da inspeção" estado={<EstadoSalvamento estado="limpo" salvoEm={salvoEm} />}>
  <Button variant="inverseOutline" size="lg">Salvar rascunho</Button>
  <Button variant="ouro" size="lg">Finalizar</Button>
</BarraAcoesRodape>
<CardChecklist como="li" titulo="Vistoria" codigo="FT-014" revisao="03" totalItens={18} selo={<Badge variant="info">Semanal</Badge>}
  dados={[{ rotulo: 'Última inspeção', valor: '28/10/2026' }]} acao={{ rotulo: 'Iniciar inspeção', onClick: iniciar }} />
```

- `SecaoNumerada`: `id`, `numero` (chip "01"), `titulo` (heading, `nivelTitulo` 2 ou 3), `dica?`, `icone?`, `acao?` (no lugar do ícone), `className?`, `corpoClassName?`. **Não estende** `FormSectionCard`/`FormSectionHeader` (cabeçalho compacto do registro, chip com ícone, sem heading); partilham o canto `12px 12px 12px 24px`. O cartão é `@container`.
- `SegmentoAvaliacao`: `opcoes` (`{ valor, rotulo, nome?, tom? }`, tons `sucesso` | `atencao` (amarelo) | `aviso` (laranja) | `neutro` | `critico`), `valor`, `onChange(v | null)`, `rotulo`, `grande?`, `permitirLimpar?`, `desabilitado?`. `button` com `aria-pressed`, alvo de 44px, setas/Home/End movem o foco. Contraste do texto marcado e não marcado medido nos dois temas (mínimo 5,81:1 marcado, 6,71:1 não marcado e hover), em `scripts/formulario-execucao.test.mjs`.
- `AssinaturaCanvas`: `rotulo`, `valor?`, `onChange(dataUrl | null)`, `obrigatoria?`, `erro?`, `desabilitado?`, `largura?`/`altura?` (PNG 520x160; quadro de até 32rem, borda sólida de 1px, como na Manutenção), `dicaVazio?`, `dicaRegistrada?`. Papel branco nos dois temas; precisa de ponteiro, o app oferece outro caminho a quem não desenha.
- `BarraAcoesRodape`: `variante?` (`rodape` padrão desde a 0.21.0: faixa reta de largura inteira, linha no topo, sombra para cima, estado à esquerda e ações à direita, botões `size="sm"` de 30px como o rodapé da Manutenção | `cartao`: cartão flutuante de antes, botões `lg` de 42px), `label?`, `estado?`, `aviso?`, `children` (ações), `className?`; `position: sticky`; faixa azul no claro, superfície com borda no escuro; `--barra-acoes-base` desloca a barra acima de uma navegação fixa. `EstadoSalvamento`: `estado` (`limpo` | `sujo` | `salvando` | `erro`), `salvoEm?`, `erro?`, região `status` ("Salvo às hh:mm"). Ações em `inverseOutline` e a principal em `ouro`.
- `CardChecklist`: `titulo`, `codigo?`, `revisao?`, `selo?`, `totalItens?`, `dados?` (`{ rotulo, valor }[]`), `acao?` (`{ rotulo, icone?, href?, onClick?, desabilitada?, motivoDesabilitada?, nomeAcessivel? }`), `acaoPersonalizada?` (o `Link` do router), `como?` (`div` | `li` | `article`), `nivelTitulo?`.

## Home padrão (blocos da Home)

Página: `/docs/patterns/home-padrao`. Todos pelo `@fips-app/ds-fips` (desde a versão que trouxer estes exports; confira a matriz). Tons (`tom`): `primary` | `secondary` | `success` | `warning` | `danger` | `neutral`. Listas em `ul`/`ol` com `id` único por item; `nivelTitulo` (2, 3 ou 4) onde há título de cartão.

- `HomeHero`: `titulo`, `destaque?` (palavra em laranja antes do título) + `separador?` (padrão um espaço), `sobretitulo?`, `subtitulo?`, `imagem?` (padrão `/backgrounds/app-shell-home-trains.png`; `null` desliga a foto), `sobreposicao?` (`leve` padrão | `media` | `forte`: quanto o azul cobre a foto), `atalhos?` (`HeroFileiraAtalho[]`) + `atalhosLabel?`, `children?` (abaixo da fileira). Não substitui o `PageHero`. Sem fundo próprio enquanto a foto carrega (como no Gestão OPA); o azul `blue-950` entra sem `imagem` ou se a foto falhar, para o texto branco manter o contraste.
- `FaixaPilares`: `pilares` (`{ id, marca, titulo, texto, icone }`; a marca vira "PILAR P"), `rotulo?`, `label?`, `sobreposta?` (sobe sobre o pé do hero, padrão sim), `nivelTitulo?` (padrão 2).
- `SecaoHome`: `numero?` (número vira "01") ou `sobretitulo?`, `titulo`, `subtitulo?`, `acao?` (pílula ou botão à direita), `tamanho?` (`lg` | `md`), `nivelTitulo?` (2 | 3), `id?`. Sem `acao` o cabeçalho é só a pilha de texto (`gap-2`, 8px); com `acao`, `justify-between` com `gap-3` (12px), como no Gestão OPA.
- `CicloDeVida`: `etapas` (`{ id, icone, titulo, texto, numero?, tom?, papel?: { rotulo, tom? } }`; `papel` é o selo no pé), `titulo?`/`sobretitulo?`/`subtitulo?`/`acao?` (cabeçalho via `SecaoHome`; sem `titulo`, só a grade), `conectores?`, `label?`. Seis colunas a partir de 1280px.
- `CartoesInformativos` (`{ id, icone, titulo, texto, marcas? }`), `CartoesConceito` (`{ id, icone, titulo, texto, tom? }`, filete colorido no topo, centrado) e `CartoesResponsabilidade` (`{ id, icone, titulo, subtitulo?, texto?, detalhes?: { rotulo, texto }[], tom? }`, borda esquerda; com `detalhes` vira cartão de perfil). Todos com `colunas?` (2 | 3 | 4) e `nivelTitulo?`.
- `PassosGrade`: `passos` (`{ id, icone, titulo, texto, dica?, numero? }`), `rotulo?` (padrão "Passo"), `moldura?` (cartão em volta, padrão sim), `label?`.
- `TabelaReferencia`: `titulo`, `sobretitulo?`, `subtitulo?`, `selo?`, `rotuloLinha?`, `colunas` (`{ id, rotulo }`), `linhas` (`{ id, rotulo, referencia?, valores: Record<colunaId, boolean | ReactNode> }`), `textoSim?`/`textoNao?` (leitor de tela). Abaixo de 640px cada linha vira um bloco.
- `NotasOperacionais`: `icone`, `titulo`, `itens`, `tom?` (padrão `warning`). `IndicadoresNumerados`: `indicadores` (`{ id, titulo, texto }`), `label?`. `ChamadaFinal`: `titulo`, `destaque?`, `sobretitulo?`, `texto?`, `passos?` (`{ id, icone, rotulo, dica?, tom? }`), `acoes?` (botões do app).
- Tokens novos desta família: `--color-accent-text`, `--color-success-text`, `--color-fg-muted-strong` (ver `foundations.md`). Texto pequeno laranja ou verde usa esses, nunca `--color-accent-strong` (2,32:1 sobre branco) nem `--color-success-strong` no claro. Cartão com fundo `--color-surface-muted` leva texto `--color-fg` (o `--color-fg-muted` mede 4,29:1 ali).

## BrandLoader (Motion) — v0.12.0

Loader institucional da marca. A logo FIPS extrudada em 3D nasce **branca** com o contorno já nas cores da marca (símbolo `#7A818B`, wordmark `#004B9B`) e recebe a cor **da esquerda para a direita** conforme a tela carrega.

- Import: `import { BrandLoader } from '@fips-app/ds-fips'`
- Props: `size` ('sm' 96px | 'md' 180px | 'lg' 280px | 'splash' 420px) · `label` (aria) · `caption` (legenda visível) · `basePath` (default `/motion`)
- Assets servidos de `/motion`: `fips-brandloader.webm` (VP9 com alfa, 56 KB), `fips-brandloader.apng` (fallback Safari, 165 KB), `fips-brandloader-static.png` (quadro final).
- Duração 4 s a 24 fps; cor entra em 10% e fecha em 80% do ciclo.
- `role="status"` + `aria-live="polite"`; sob `prefers-reduced-motion` mostra o quadro final estático.
- **Não é SVG**: a fidelidade tipográfica do wordmark exige a arte oficial. Renderizado a partir de `Logo FIPS png.png`.
- Usar em abertura do app, login, ação longa e explícita. **Não** usar em tabela carregando (ali vai skeleton), nem abaixo de 96 px, nem mais de um por tela.
- **Padrão de uso** (abertura pós-login que pré-carrega os dados + loader em tabela pesada): ver `patterns.md` → "Loading — Abertura da marca (BrandLoader)".
- Doc: `/docs/motion/brand-loader`

## Casca do app (AppShell, AppHeader, AppSidebar, UserChip, UserAccountMenu, NotificacoesMenu, TutorialOverlay, HeaderTile)

**0.21.0, rodada 3:** (1) O cabeçalho não gera rolagem horizontal em 320 px nem entre 640 e 1000 px com trilha longa: o grupo de ações não encolhe (`shrink-0`), a trilha trunca, o respiro cai abaixo de `sm` (0.22.5: recuo 16, espaço 12 entre menu e logo e 6 entre os botões da direita, medido a 375 px contra a Gestão OPA) e o lockup some abaixo de 340 px. (2) `AppSidebar` `versao.numero` aceita com ou sem "v" ("0.2" ou "v0.2"): a tela mostra um "v" só e o leitor de tela lê o número puro. (3) Ctrl+P: menu, cabeçalho e fundo da gaveta somem (`data-casca`), o recuo do menu zera e o tema escuro sai do `<html>` durante a impressão (`beforeprint`/`afterprint`). (4) `TutorialOverlay`: o foco entra no cartão e fica preso nele (Tab e Shift+Tab dão a volta), volta a quem abriu ao fechar, Enter num botão não avança junto; em janela estreita o cartão encosta no pé ou no alto no lado que cobre menos do destaque e a página rola para liberar o alvo.

Fonte: `src/components/composites/{AppShell,AppHeader,AppSidebar,HeaderTile,HeaderTrilha,UserChip,UserAccountMenu,NotificacoesMenu,TutorialOverlay}.tsx` (+ `app-shell-tipos.ts`, `app-shell-logica.ts`, `use-painel-ancorado.ts`; estilos `.fips-header-tile`, `.fips-neu-tile`, `.fips-sidebar`, `.fips-user-chip`, `.fips-faixa-de-abas`, `.fips-tutorial-*` na camada `components` de `src/styles/globals.css`). Doc: `/docs/components/casca-do-app`; a casca montada roda em `/demo/casca`. Teste da lógica: `npm run test:casca`.

O cabeçalho e o menu lateral padrão dos apps FIPS, iguais aos do Gestão OPA (master 308789c). **Entram na library**: app novo usa estes, não copia a casca de outro app. Genéricos: textos, itens, rotas e perfis entram por props.

```tsx
<AppShell
  chavePreferencias="meuapp:sidebar-prefs:v1"          // uma por app
  renderLink={(p) => <Link to={p.href} className={p.className} style={p.style} title={p.title} aria-label={p['aria-label']} aria-current={p['aria-current']} onClick={p.onClick}>{p.children}</Link>}
  menu={{ nome: 'Inspeção SST e MA', subtitulo: 'Segurança · Meio Ambiente', grupos, versao: { numero: '1.4.0', aoAbrir: abrirNovidades } }}
  cabecalho={{ trilha, abas, abaAtiva, chaveDeMedicao: pathname, sino: <NotificacoesMenu secoes={secoes} />,
    procedimento: { rotulo: 'Procedimento', aoClicar }, tutorial: { rotulo: 'Tutorial desta tela', aoClicar },
    tema: { atual: 'claro', aoAlternar }, usuario: <UserAccountMenu aberto={a} aoMudarAberto={setA} gatilho={<UserChip nome={nome} aberto={a} onClick={...} />} usuario={{ nome, email }} /> }}
>
  {children}
</AppShell>
<TutorialOverlay aberto={t} aoFechar={fechar} passos={PASSOS} />   // fora do cabeçalho: fica acima do menu
```

- **`AppShell`**: `chavePreferencias` (obrigatória, `localStorage`), `menu` (`AppSidebarProps` sem o que o shell controla), `cabecalho` (`AppHeaderProps` sem o que o shell controla), `renderLink?`, `preferenciasPadrao?` (`{ recolherAuto, segundos }`; padrão automático em 3 s), `recolhidoInicial?`, `classeDoConteudo?`. Recolhe sozinho após N s sem o ponteiro no menu, abre com o ponteiro; gaveta abaixo de 1024px (fecha no Esc, no fundo e ao navegar; trava a rolagem da página). O conteúdo fica num contêiner `@container`.
- **`AppSidebar`**: `nome`, `subtitulo?`, `marca?` (`{ logo, logoNoClaro, simbolo, alt }`, padrão `/appfips-logo.png`, `/appfips-logo-full.png`, `/appfips-mark-collapsed.png`: **o pacote não empacota imagem**, o app serve os três na pasta pública), `grupos` (`{ id, titulo?, itens: { id, rotulo, href, icone, ativo?, selo? } }`), `modoDoMenu` e `versao` (**obrigatórios**: rodapé "Modo do menu" e "Versão"), `renderLink?`. 230px aberto, 68px recolhido, gaveta de 256px.
- **`AppHeader`**: `trilha?`, `abas?` + `abaAtiva?` (`AbaDeSecao`; sublinhado âmbar que desliza, só a partir de 1024px), `sino?`, `procedimento?`/`tutorial?` (`{ rotulo, aoClicar, icone?, ativo? }`; livro e capelo), `tema?` (`{ atual, aoAlternar }`), `acoesExtras?`, `usuario?`, `marca?`, `chaveDeMedicao?`. Ganchos `data-tutorial`: `menu`, `recolher-menu`, `abas`, `sino`, `procedimento`, `tutorial`, `tema`, `conta`.
- **`HeaderTile`**: botão de ícone de 36px (`icone?`, `ativo?`, `exibicao?: sempre | desktop | celular`). Precisa de `aria-label`.
- **`UserChip`** (`nome`, `fotoUrl?`, `iniciais?`, `corDoAvatar?`, `aberto?`) e **`UserAccountMenu`** (`aberto`, `aoMudarAberto`, `gatilho`, `usuario`, `selos?`, `perfisDev?` opcional, `itens?`): painel em portal.
- **`NotificacoesMenu`** (`secoes`, `contagem?`, `rotuloDoSino?`, `titulo?`, `vazio?`, `aoEscolher?`) e **`TutorialOverlay`** (`aberto`, `aoFechar`, `passos: { titulo, descricao, alvo? }[]`, lista estável).
- **Modal do procedimento** não é componente: é `Modal size="full" noPadBody permiteTelaCheia` com `Tabs` dentro (exemplo na página de doc).
- **Armadilha resolvida no pacote:** o `display` do azulejo, da faixa de abas e do botão de recolher mora na camada `components` e responde por media query própria. O app **não** escreve `hidden lg:grid`, `max-lg:hidden` nem `.header-tile` no CSS dele; o CSS do pacote entra depois dos utilitários do app, e um `.hidden` ou `.grid` do pacote anulava o `lg:grid` do consumidor.
- Contraste medido (1440, claro/escuro): texto do menu sobre o azul 5,09:1 a 13,14:1 / 6,01:1 a 16,67:1; trilha 5,5:1 / 7,53:1; abas 4,57:1 / 6,86:1; painéis do sino e da conta 4,57:1 mínimo; botão "Entendi!" do tutorial 5,4:1 (verde escurecido).

## Gráficos (CartaoGrafico, GraficoBarras, GraficoRosca, GraficoLinha, GraficoFunil, MapaDeCalor, ProgressoPorFaixa)

**0.21.0, rodada 3:** o balão "Sobre este gráfico" (`info` do `CartaoGrafico`) abre também por toque: o toque mostra a explicação numa nota sob o título (`role="note"`), um segundo toque a fecha; mouse e teclado seguem com o balão. No `GraficoBarras` com `onSelecionarBarra`, o alvo de clique ampliado de uma barra empilhada cresce só nas pontas da pilha (base do primeiro, topo do último segmento) e o de barras lado a lado só na vertical: um segmento fino não é mais coberto pelo vizinho (`expansaoDoSegmento`).

Fonte: `src/components/composites/{CartaoGrafico,GraficoBarras,GraficoRosca,GraficoLinha,GraficoFunil,MapaDeCalor,ProgressoPorFaixa}.tsx` + `grafico-logica.ts` (lógica pura). Doc: `/docs/components/graficos`. HTML e SVG com tokens, **sem biblioteca de gráfico**: app novo não instala ECharts nem Recharts para dashboard. Valor sempre escrito (rótulo, legenda ou célula); a cor distingue, nunca informa sozinha. Cada gráfico leva `rotulo` (texto alternativo com o resumo dos números).

```tsx
import { CartaoGrafico, GraficoBarras, GraficoRosca, GraficoLinha, GraficoFunil, MapaDeCalor, ProgressoPorFaixa } from '@fips-app/ds-fips'

<CartaoGrafico titulo="Inspeções por local" info="Total no período." lateral="122">
  <GraficoBarras rotulo="Inspeções por local" dados={[{ rotulo: 'Pátio Norte', valor: 46, tom: 'primario' }]}
    selecionado={filtro} onSelecionar={(r) => setFiltro(r === filtro ? null : r)} />
</CartaoGrafico>
```

- **Tons** (`TomGrafico`): `primario`, `secundario`, `sucesso`, `atencao`, `aviso`, `critico`, `neutro`, `violeta` = `--grafico-<tom>`, 3:1 ou mais sobre cartão e página nos dois temas (claro 3,87 a 8,47; escuro 5,40 a 10,78). Sem `tom` a categoria recebe a cor da sequência pela posição. `cor` (CSS) vence `tom`. Texto de gráfico usa `--color-fg` e `--color-fg-muted`, nunca o tom.
- **`CartaoGrafico`**: `titulo`, `info?` (balão no ícone), `lateral?`, `nivelTitulo?`, `vazio?`/`mensagemVazio?`/`alturaVazio?`. Contêiner `@container`: os gráficos de dentro mudam de disposição pela largura do cartão.
- **`GraficoBarras`**: `dados` `{ rotulo, valor? | valores?, tom?, cor? }`, `series?` `{ nome, tom? }`, `modo` (`agrupado` | `empilhado`), `orientacao` (`horizontal` ranking | `vertical` no tempo), `mostrarValores`, `formatarValor`, `selecionado`/`onSelecionar` (cada categoria vira botão `aria-pressed`, as outras esmaecem), `alturaColunas`, `larguraRotulo`.
- **`GraficoRosca`**: `dados` `{ rotulo, valor, tom? }`, `totalNoFuro?`, `legendaDoFuro?`, `selecionado`/`onSelecionar`, `minimoGraus` (5), `tamanho`. Legenda com nome, valor e participação (abaixo de 1% uma casa, abaixo de 0,1% "<0,1%"); legenda ao lado do anel a partir de 28rem de cartão.
- **`GraficoLinha`**: `categorias`, `series` `{ nome, valores: (number | null)[], tom?, tracejada?, area? }`, `altura`, `rotulosDeValor` (`pontas` | `todos` | `nenhum`). Sem curva suave; `null` interrompe a linha; acompanha a largura do contêiner.
- **`GraficoFunil`**: `etapas` `{ rotulo, valor, tom? }`, `mostrarConversao` (participação sobre a etapa anterior).
- **`MapaDeCalor`**: `linhas`, `colunas`, `valores[linha][coluna]` (`null` = sem dado), `tom` (`critico` | `aviso` | `primario` | `violeta`: só os que sustentam texto 4,5:1 nos cinco níveis), `maximo`, `onSelecionarCelula`. É uma `<table>` com cabeçalhos; rola na horizontal com a primeira coluna fixa.
- **`ProgressoPorFaixa`**: `Progress` com cor pela faixa (100% verde, 90 a 99% azul-céu, 60 a 89% âmbar, 30 a 59% laranja, 1 a 29% vermelho, 0% só o trilho); `valor`, `maximo`, `rotulo`. Escreva o número ao lado.

## Documento de impressão (Folha, CabecalhoDocumento, faixas, TabelaDocumento)

Fonte: `src/components/composites/Documento.tsx` (+ `documento-variants.ts`). Doc: `/docs/components/documento`. O formulário de papel como **uma folha com grade**, não pilha de cartões: a moldura mora na `Folha` (borda 1px, sem raio) e os filhos entram rentes.

- **`Folha`**: `children`. **`CabecalhoDocumento`**: `titulo`, `metadados` `{ rotulo, valor, quandoVazio? }[]`, `marca?` (o pacote não empacota imagem: o app passa a logo em branco), `nivel?` (1 | 2). Faixa verde no título, barra grafite sobre cada valor.
- **`BlocoDeCamposDocumento`**: `titulo`, `campos` `{ rotulo, valor | null }` (`null` sai "a preencher"), `valores?` (`curtos` | `longos`), `textoVazio?`; colunas por contêiner.
- **`FaixaSecaoDocumento`**: `nome`, `paginas?` ("páginas 1 e 2 do impresso"), `acoes?`, `progresso?` `{ feitos, total }`, `tom?` (`normal` | `indisponivel`). **`FaixaCategoriaDocumento`**: `nome`, `contagem?`, `progresso?` (usa `ProgressoPorFaixa`), `tom?`. Escada de cor: secão azul-noite, categoria azul, indisponível cinza; texto branco com 4,5:1 ou mais.
- **`TabelaDocumento`** (props da `Table` menos `framed`, `zebra`, `verticalBorders`), `CabecalhoTabelaDocumento`, `CelulaCabecalhoDocumento`, `CorpoTabelaDocumento`, `LinhaTabelaDocumento`, `CelulaDocumento` (42px, fio embaixo e à direita).

## Listagem e classificação (CartaoListagem, AlternadorDeVisao, AvisoSomenteLeitura, TabelaClassificacao)

Fonte: `src/components/composites/{CartaoListagem,AlternadorDeVisao,AvisoSomenteLeitura,TabelaClassificacao}.tsx`. Doc: `/docs/components/listagem-apoio`.

- **`CartaoListagem`**: `icone`, `titulo`, `quantidade`, `sufixoDaContagem?`, `filtrada?` (selo "Filtrado"), `chips?`, `acoes?`, `rodape?`, `semMoldura?`, `nivelTitulo?`. Raio `12/12/12/24`; o cabeçalho quebra e as ações descem no celular.
- **`AlternadorDeVisao`**: `valor`, `onChange`, `opcoes?` (padrão tabela e cartões), `rotulo?`. Só o ícone abaixo de `md`; alvo de toque pelo modo.
- **`AvisoSomenteLeitura`**: `children` (o motivo), `titulo?`. `role="status"`.
- **`TabelaClassificacao`**: `linhas` `{ id, rotulo, descricao, tom, prazo, detalhe? }`, `titulo?`, `cabecalhos?`. Ponto e pílula no tom, fundo a 8% do tom, texto em `--color-fg` (e `--color-fg-muted-strong` no detalhe); no telefone cada linha vira bloco.
