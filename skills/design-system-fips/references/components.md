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

Fonte: `src/components/ui/badge-variants.ts`

Variantes exatas:

- `default`
- `secondary`
- `success`
- `warning`
- `danger`
- `outline`
- `info`

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
- `Table`: listagem operacional densa, com wrapper card e hover de linha
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

## FipsLogo

Fonte: `src/components/brand/FipsLogo.tsx`

Use em sidebar, shell de aplicação e cabeçalhos institucionais. Não aplique distorção, sombra, transparência arbitrária ou recoloração fora das versões aprovadas.
