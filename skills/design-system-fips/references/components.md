# Components

## Barrel de exportação

Fonte: `src/components/ui/index.ts`

O pacote expõe:

- `Button`
- `Badge`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Field`, `FieldLabel`, `FieldHint`, `FieldMessage`
- `Input`
- `InputGroup`
- `Select`
- `Textarea`
- `Progress`
- `Table`
- `Tabs`
- `Dialog`
- `Drawer`
- `Tooltip`

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
| `success` | `#ECFDF5` | `#00904C` | `rgba(0,168,62,.15)` | `#4ADE80` |
| `warning` | `#FFF7ED` | `#C2410C` | `rgba(251,191,36,.15)` | `#FBBF24` |
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

- `Input`/`Select` default: `h-12`
- `Input`/`Select` compact: `h-9`
- `Textarea` default: `min-h-[132px]`
- `Textarea` compact: `min-h-[92px]`

Composição recomendada:

```tsx
<Field density="compact" inset="icon">
  <FieldLabel required>Razao social</FieldLabel>
  <Input density="compact" placeholder="Nome da empresa" />
  <FieldMessage tone="danger">Campo obrigatorio</FieldMessage>
</Field>
```

Cuidado — o dropdown do `Select` é `absolute` (sem portal). Ancestral com `overflow-hidden` corta a lista "pra dentro". Ver **Data Listing → Cuidado (clipping)** em `patterns.md`. Nunca corrija no `Select` do DS (é sincronizado); corrija no consumidor.

## Tabs, Table, Dialog, Drawer, Tooltip, Progress

Fontes:

- `src/components/ui/tabs.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/tooltip.tsx`
- `src/components/ui/progress.tsx`

Direção de uso:

- `Tabs`: navegação secundária e troca de contexto dentro da tela
- `Table`: listagem operacional densa, com wrapper card e hover de linha. Sistema de densidade (`compact|normal|comfortable`) + toggles de aparência (`zebra`, `verticalBorders`, `stickyHeader`, `wrapText`) e `framed`, todos via props propagadas por context. Hook `useTableDensity()` deixa descendentes (Badge) auto-ajustarem. API completa, métricas por densidade, `AdminTableColumnMenu`/`Pagination`/`SortHeader` e persistência em `localStorage`: ver **Data Listing → Tabela canônica** em `patterns.md`
- `Dialog`: ações focadas, filtros avançados em desktop, confirmação
- `Drawer`: detalhes e fluxos laterais, principalmente em tablet/mobile
- `Tooltip`: dica curta; requer `TooltipProvider`
- `Progress`: status numérico e andamento visual

## ExportButtons (par de exportação)

Fonte: `src/docs/pages/patterns/DataListingDemo.tsx` (canônico) · port: `src/components/ExportButtons.tsx`

Par de ações no fim da toolbar de listagem: dois botões **34×34 só-ícone** (`Button variant="secondary" size="icon"`), cada um tintado pela cor da extensão (hover na mesma cor, suave):

- **Excel** — ícone verde Office `#1D6F42`; `aria-label="Exportar para Excel"`
- **PDF** — ícone vermelho (`text-destructive`); `aria-label="Exportar para PDF"`

API:

```tsx
<ExportButtons onExcel={() => exportXlsx(rows)} onPdf={() => exportPdf(rows)} />
```

Regras:

- sempre o par, sempre à direita da toolbar
- só-ícone com `title` + `aria-label` (sem rótulo de texto)
- não trocar as cores: verde = Excel, vermelho = PDF — é convenção de extensão, não decoração
- ícones de arquivo vêm de `src/components/icons/FileIcons.tsx` (`ExcelIcon`, `PdfIcon`), não do `lucide-react`

## PageHero

Fonte: `src/composites/PageHero.tsx`

Header oficial para páginas de módulo:

```ts
export const PAGE_HERO_DEFAULT_DECORATION = '/backgrounds/app-shell-home-trains.png'
```

Uso:

```tsx
import { PageHero } from 'ds-fips'

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

## FipsLogo e marca do menu (sidebar header)

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
