# Foundations

## Cores oficiais

Fonte: `src/tokens/colors.ts`

### Primárias

| Token | Hex | Uso |
| --- | --- | --- |
| `azulProfundo` | `#004B9B` | cor primária institucional |
| `azulProfundoDark` | `#002A68` | hover, profundidade, sidebar |
| `cinzaChumbo` | `#333B41` | texto principal |
| `cinzaMetal` | `#C0CCD2` | bordas e divisórias |
| `azulIntermediario` | `#658EC9` | apoio visual |

### Secundárias

| Token | Hex |
| --- | --- |
| `azulCeuClaro` | `#D3E3F4` |
| `amareloPastel` | `#FFE4B8` |
| `azulCeu` | `#93BDE4` |
| `azulCeuProfundo` | `#0090D0` |
| `amareloOuro` | `#FDC24E` |
| `amareloOuroEscuro` | `#F6921E` |
| `verdeClaro` | `#8BE5AD` |
| `verdeFloresta` | `#00C64C` |
| `verdeFlorestaEscuro` | `#00904C` |
| `branco` | `#FFFFFF` |
| `neutroClaro` | `#E8EBFF` |

### Mapa semântico

Fonte: `src/tokens/colors.ts` e `src/styles/globals.css`

```ts
export const semanticColors = {
  primary: '#004B9B',
  primaryHover: '#002A68',
  secondary: '#0090D0',
  accent: '#FDC24E',
  accentStrong: '#F6921E',
  success: '#00C64C',
  successStrong: '#00904C',
  surface: '#FFFFFF',
  surfaceMuted: '#E8EBFF',
  border: '#C0CCD2',
  foreground: '#333B41',
  sidebar: '#004B9B',
  sidebarMuted: '#002A68',
}
```

## CSS globals

Fonte: `src/styles/globals.css`

```css
:root {
  --color-primary: var(--color-fips-blue-900);
  --color-primary-hover: var(--color-fips-blue-950);
  --color-secondary: var(--color-fips-sky-600);
  --color-accent: var(--color-fips-yellow-400);
  --color-accent-strong: var(--color-fips-yellow-600);
  --color-success: var(--color-fips-green-500);
  --color-success-strong: var(--color-fips-green-700);
  --color-surface: #ffffff;
  --color-surface-soft: var(--color-fips-neutral-25);
  --color-surface-muted: var(--color-fips-neutral-50);
  --color-border: #d7e0ea;
  --color-fg: var(--color-fips-gray-900);
  --color-fg-muted: #6b7784;
  --color-ring: var(--color-fips-sky-600);
  --color-sidebar: var(--color-fips-blue-950);
}
```

## Tipografia

Fonte: `src/tokens/typography.ts` e `src/styles/globals.css`

- Heading: `"Saira Expanded", "Open Sans", system-ui, sans-serif`
- Body: `"Open Sans", system-ui, sans-serif`
- Mono: `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

```ts
export const typeScale = {
  display: 'text-4xl font-semibold tracking-tight md:text-5xl',
  h1: 'text-3xl font-semibold tracking-tight md:text-4xl',
  h2: 'text-2xl font-semibold tracking-tight',
  h3: 'text-xl font-semibold',
  lead: 'text-lg text-[var(--color-fg-muted)]',
  body: 'text-base leading-[1.5]',
  small: 'text-sm text-[var(--color-fg-muted)]',
  caption: 'text-xs text-[var(--color-fg-muted)]',
}
```

Import de referência usado no projeto:

```css
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Saira+Expanded:wght@500;600;700&display=swap');
```

## Espaçamento

Fonte: `src/tokens/spacing.ts` e `public/guias/guia-design-system-fips.md`

- Base: `4px`
- Escala exportada: `[0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24]`
- Interpretação prática: `0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px`

## Raios e sombras

Fonte: `src/styles/globals.css`

```css
--radius-sm: 0.25rem;
--radius-md: 0.375rem;
--radius-lg: 0.5rem;
--radius-xl: 0.75rem;
--radius-2xl: 1rem;

--shadow-field: 0 1px 2px rgb(15 23 42 / 0.04), inset 0 1px 2px rgb(15 23 42 / 0.03);
--shadow-card: 0 2px 8px rgb(15 23 42 / 0.04), 0 10px 24px rgb(15 23 42 / 0.06);
--shadow-card-hover: 0 8px 22px rgb(15 23 42 / 0.08), 0 18px 38px rgb(0 75 155 / 0.08);
--shadow-elevated: 0 22px 64px rgb(0 75 155 / 0.18);
--shadow-float: 0 12px 36px rgb(15 23 42 / 0.12);
```

Uso prático:

- Campos e controles (`Input`/`Select`/`Textarea`/`FieldTrigger`): `rounded-lg`, borda 1px sólida, **sem sombra em repouso** — só anel de foco. `--shadow-field` fica pra outros usos (ex.: `TabsList`).
- Cards e tabelas: `rounded-2xl` com `--shadow-card`
- Overlays, modais, drawers: `--shadow-elevated`

## Motivo visual "Elemento Caixa"

As páginas de documentação e branding usam um canto inferior esquerdo mais aberto como motivo visual. Exemplo recorrente:

```css
border-radius: 12px 12px 12px 24px;
```

Importante:

- Esse motivo aparece em cards de showcase e blocos editoriais.
- Os componentes reutilizáveis de produto no código usam raios simétricos dos tokens globais.
- Para telas de produto, siga os componentes reutilizáveis primeiro. Use o motivo assimétrico apenas quando o layout estiver no território editorial/hero/showcase.

## Responsividade mínima

Fonte: `public/guias/guia-design-system-fips.md`

- Testar em `360px`
- Testar em `768px`
- Testar em `1280px`
- Texto sobre azul institucional e dourado precisa manter contraste mínimo AA
