# Design System FIPS

Pacote de documentação exportável para uso offline por times, parceiros e outras IAs.

## O que baixar

- `design-system-fips-complete-docs.md`: documentação consolidada com tokens, padrões e mapa de código
- `design-system-fips-skill.zip`: skill portátil para Codex/OpenAI com instruções exatas e referências carregáveis sob demanda

## Fonte de verdade

Ordem de prioridade:

1. `docs/Brandbook PPT.pdf`
2. `public/guias/guia-design-system-fips.md`
3. `src/styles/globals.css`
4. `src/tokens/*.ts`
5. `src/components/ui/*`
6. `src/composites/PageHero.tsx`
7. `src/docs/pages/*`

Se houver conflito:

- Marca e logotipo: o Brandbook vence.
- Implementação técnica: o código reutilizável do design system vence.
- Showcase editorial: o guia e as páginas da documentação refinam o uso visual.

## Identidade

- Nome oficial: `Design System FIPS`
- Marca institucional: `FIPS — Ferrovia Interna do Porto de Santos`
- Headings: `Saira Expanded`
- Corpo e UI: `Open Sans`
- Logo e material de marca final sempre devem ser conferidos no PDF do Brandbook

## Paleta oficial

### Primárias

| Nome | Hex | Uso |
| --- | --- | --- |
| Azul Profundo | `#004B9B` | primária digital, destaque estrutural |
| Azul Profundo escuro | `#002A68` | hover, profundidade, sidebar |
| Cinza chumbo | `#333B41` | texto principal |
| Cinza metal | `#C0CCD2` | bordas e divisórias |
| Azul intermediário | `#658EC9` | apoio visual |

### Secundárias

| Nome | Hex |
| --- | --- |
| Azul céu claro | `#D3E3F4` |
| Amarelo pastel | `#FFE4B8` |
| Azul céu | `#93BDE4` |
| Azul céu profundo | `#0090D0` |
| Amarelo ouro | `#FDC24E` |
| Amarelo ouro escuro | `#F6921E` |
| Verde claro | `#8BE5AD` |
| Verde floresta | `#00C64C` |
| Verde floresta escuro | `#00904C` |
| Branco | `#FFFFFF` |
| Neutro claro | `#E8EBFF` |

### Tokens semânticos

```css
:root {
  --color-primary: #004B9B;
  --color-primary-hover: #002A68;
  --color-secondary: #0090D0;
  --color-accent: #FDC24E;
  --color-accent-strong: #F6921E;
  --color-success: #00C64C;
  --color-success-strong: #00904C;
  --color-surface: #FFFFFF;
  --color-surface-soft: #FBFDFF;
  --color-surface-muted: #F5F8FC;
  --color-border: #D7E0EA;
  --color-fg: #333B41;
  --color-fg-muted: #6B7784;
  --color-ring: #0090D0;
  --color-sidebar: #002A68;
}
```

## Tipografia

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Saira+Expanded:wght@500;600;700&display=swap');
```

Famílias:

- Heading: `"Saira Expanded", "Open Sans", system-ui, sans-serif`
- Body: `"Open Sans", system-ui, sans-serif`
- Mono: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

Escala:

```ts
display: text-4xl md:text-5xl
h1: text-3xl md:text-4xl
h2: text-2xl
h3: text-xl
lead: text-lg
body: text-base
small: text-sm
caption: text-xs
```

## Espaçamento, raios e sombras

- Base de spacing: `4px`
- Escala prática: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px`
- Raios globais:
  - `sm`: `4px`
  - `md`: `6px`
  - `lg`: `8px`
  - `xl`: `12px`
  - `2xl`: `16px`
- Sombras principais:
  - `--shadow-card`
  - `--shadow-card-hover`
  - `--shadow-elevated`

## Elemento visual recorrente

O projeto usa dois comportamentos de raio:

1. Componentes de produto reutilizáveis usam raios simétricos dos tokens globais.
2. Páginas editoriais e showcases usam o motivo "Elemento Caixa", por exemplo:

```css
border-radius: 12px 12px 12px 24px;
```

Regra:

- Produto operacional: seguir os componentes reutilizáveis.
- Hero/showcase/documentação: pode usar o motivo assimétrico quando fizer sentido visual.

## Componentes oficiais

Mapa de exportação: `src/components/ui/index.ts`

### Button

Arquivos:

- `src/components/ui/button.tsx`
- `src/components/ui/button-variants.ts`

Variantes:

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

Tamanhos:

- `sm`
- `md`
- `lg`
- `icon`
- `iconSm`

### Badge

Arquivos:

- `src/components/ui/badge.tsx`
- `src/components/ui/badge-variants.ts`

Variantes:

- `default`
- `secondary`
- `success`
- `warning`
- `danger`
- `outline`
- `info`

### Card

Arquivo: `src/components/ui/card.tsx`

Base real:

```tsx
<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]" />
```

### Formulários

Arquivos:

- `src/components/ui/field.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/textarea.tsx`

Regras:

- `FieldDensity`: `default` ou `compact`
- `FieldInset`: `none`, `control`, `icon`
- `compact` é preferido para filtros densos e modais operacionais
- alturas:
  - `Input` e `Select` default: `h-12`
  - `Input` e `Select` compact: `h-9`
  - `Textarea` default: `min-h-[132px]`
  - `Textarea` compact: `min-h-[92px]`

### Overlay e feedback

Arquivos:

- `src/components/ui/dialog.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/tooltip.tsx`
- `src/components/ui/progress.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/table.tsx`

## Composite oficial de header

Arquivo: `src/composites/PageHero.tsx`

Só o gradiente institucional (sem arte de trem desde a 0.16.0). Props: `children` e `className`.

Uso:

```tsx
<PageHero>
  <div className="px-8 py-10">
    <h1>Producao</h1>
  </div>
</PageHero>
```

## Padrões de tela

### Application Shell

Fonte: `src/docs/pages/patterns/ApplicationShellDemo.tsx`. Header padrão do shell: `src/components/layout/DocHeaderStandard.tsx` + `DocHeaderNeuIconButton.tsx` + `src/lib/docHeaderChrome.ts` (`DocLayout.tsx`). No **Tecnopano 3.0** (`client/`): `tecnopano/ApplicationShellDemo.tsx` (`/shell-demo`) e `src/components/layout/Header.tsx`.

- sidebar institucional escura
- topbar clara
- tabs secundárias no desktop
- menu sobreposto no mobile
- conteúdo principal em superfície clara

### Dashboard

Fonte: `src/docs/pages/patterns/DashboardDemo.tsx`

- hero de módulo
- KPIs com acento cromático controlado
- ações principais visíveis no topo

### Data Listing

Fonte: `src/docs/pages/patterns/DataListingDemo.tsx`

- KPIs resumidos
- busca e filtros antes da tabela
- tabela dentro de card
- filtros avançados em `Dialog` ou `Drawer`

### Form Workspace

Fonte: `src/docs/pages/patterns/FormWorkspaceDemo.tsx`

- duas colunas no desktop quando a complexidade exigir
- hierarquia clara de ações
- painéis auxiliares em cards

### Modal Workflow

Fonte: `src/docs/pages/patterns/ModalWorkflowDemo.tsx`

- densidade compacta
- CTA inequívoco
- sombra elevada

### Hero Header

Fonte: `src/docs/pages/patterns/HeroHeaderDoc.tsx`

- módulos usam `PageHero`
- home pode ser mais editorial
- trilhos/trem entram como textura, não como ruído dominante

## Governança

Fonte: `src/docs/pages/GovernancePage.tsx`

Regra de ouro:

- se a tela e o design system divergem, ajuste o design system primeiro

Checklist:

- nenhum CSS local muda borda, raio, sombra ou cor de componente
- nenhum componente visual nasce fora do design system
- formulários usam a composição oficial
- cores e fontes vêm dos tokens
- espaçamento segue a escala de 4px

## Skill portátil

Conteúdo do pacote `design-system-fips-skill.zip`:

- `SKILL.md`
- `agents/openai.yaml`
- `references/source-of-truth.md`
- `references/foundations.md`
- `references/components.md`
- `references/patterns.md`

Use a skill quando outra IA precisar de:

- instruções exatas de implementação
- regras de governança
- snippets essenciais
- mapa de código do repositório
