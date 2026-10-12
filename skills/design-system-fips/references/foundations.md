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
  dangerStrong: '#B91C1C',
  borderControl: '#C0CCD2',
  primaryText: '#004B9B',
  dangerText: '#B91C1C',
  successFill: '#00904C',
  neutralFill: '#6B7784',
  surface: '#FFFFFF',
  surfaceMuted: '#E8EBFF',
  border: '#C0CCD2',
  foreground: '#333B41',
  sidebar: '#004B9B',
  sidebarMuted: '#002A68',
}
```

## CSS globals

Fonte: `src/styles/globals.css` (`@layer base`)

```css
:root {
  --color-primary: var(--color-fips-blue-900);
  --color-primary-hover: var(--color-fips-blue-950);
  --color-secondary: var(--color-fips-sky-600);
  --color-secondary-hover: #007ab1;
  --color-accent: var(--color-fips-yellow-400);
  --color-accent-strong: var(--color-fips-yellow-600);
  --color-success: var(--color-fips-green-500);
  --color-success-strong: var(--color-fips-green-700);
  --color-warning: var(--color-fips-yellow-600);
  --color-danger: var(--color-fips-red-600);
  --color-danger-strong: var(--color-fips-red-700);
  --color-surface: #ffffff;
  --color-surface-soft: var(--color-fips-neutral-25);
  --color-surface-muted: var(--color-fips-neutral-50);
  --color-table-zebra: color-mix(in srgb, var(--color-fips-blue-200) 25%, transparent);
  --color-border: #d7e0ea;
  --color-border-strong: var(--color-fips-gray-400);
  --color-fg: var(--color-fips-gray-900);
  --color-fg-muted: #6b7784;
  --color-border-control: var(--color-border);
  --color-primary-text: var(--color-primary);
  --color-danger-text: #b91c1c;
  --color-success-fill: var(--color-fips-green-700);
  --color-neutral-fill: var(--color-fg-muted);
  --color-ring: var(--color-fips-sky-600);
  --color-sidebar: var(--color-fips-blue-950);
  --color-gov-gradient-from: #004B9B;
  --color-gov-gradient-to: #002A68;
}
```

### Dark mode — o que muda e o que **não** muda

Dark é toggle da classe `.dark` no `<html>` (`useFipsTheme()`, persistido em `localStorage` chave `fips-theme`). Os neutros seguem o Gestão OPA: cartão `#1a1a1a` sobre página `#252525`. O bloco `.dark` redefine a camada de superfície, a borda de campo e os papéis de texto e de fundo cheio:

| Token | Light | Dark |
| --- | --- | --- |
| `--color-surface` (cartão) | `#ffffff` | `#1a1a1a` |
| `--color-surface-soft` | neutral-25 | `#1f1f1f` |
| `--color-surface-muted` (página) | neutral-50 | `#252525` |
| `--color-border` (divisor) | `#d7e0ea` | `#2e2e2e` |
| `--color-border-strong` | gray-400 | `#3a3a3a` |
| `--color-border-control` (campo) | igual a `--color-border` | `#666666` (3,03:1 sobre o cartão) |
| `--color-fg` | gray-900 | `#e8e8e8` |
| `--color-fg-muted` | `#6b7784` | `#9ca3af` |
| `--color-primary-text` (texto e contorno de ação) | `--color-primary` | `#93bde4` |
| `--color-danger-text` (vermelho de texto pequeno) | `#b91c1c` | `#fca5a5` |
| `--color-success-strong` (**cor de texto**) | green-700 | `#8be5ad` |
| `--color-success-fill` (fundo cheio com texto branco) | green-700 | `#008842` (4,56:1) |
| `--color-neutral-fill` (cinza cheio com texto branco) | `--color-fg-muted` | `#5b6470` |
| `--color-table-zebra` | blue-200 @25% | `rgba(255,255,255,.03)` |
| `--color-danger-strong` (vermelho de texto pequeno) | red-700 `#b91c1c` | red-300 `#fca5a5` |
| `--color-ring` | sky-600 | yellow-600 |

Botões sólidos leem seis tokens próprios, com texto acima de 4,5:1 no escuro. No claro repetem os valores de antes:

| Token | Light | Dark |
| --- | --- | --- |
| `--color-btn-success` | `--color-success` | `--color-success-fill` (`#008842`) |
| `--color-btn-success-hover` | `--color-success-strong` | `#006d35` |
| `--color-btn-danger` | `--color-danger` | `#dc2626` |
| `--color-btn-danger-hover` | `#c82333` | `#b91c1c` |
| `--color-btn-accent-fg` | `#ffffff` | `--color-primary-hover` (`#002a68`) |
| `--color-btn-accent-hover` | `--color-warning` | `--color-accent` (`#fdc24e`) |

`outline` e `link` usam `--color-primary-text`. Não sobrescreva os tokens do botão fora do pacote.

**Regra crítica:** no escuro `--color-success-strong` é cor de **texto**. Fundo verde com texto branco usa `--color-success-fill`; `success-strong` como fundo dá 1,51:1 com branco.

`--color-primary`, `--color-accent`, `--color-success`, `--color-warning`, `--color-danger` e `--color-sidebar` continuam **idênticos** nos dois temas. Para **texto e contorno** de ação use `--color-primary-text`. Para **acento** de foco (borda em foco, anel, borda do dropdown aberto, opção selecionada) o par manual `dark:…-[#93BDE4]` continua necessário: `--color-primary` não muda no escuro, e sem o par o acento fica com contraste baixo. Esses `dark:` não são resíduo.

Já os tokens `--color-gov-*` (usados em páginas de doc/governança) **invertem** no dark — `--color-gov-azul-profundo` vira `#93BDE4`. Não usá-los como fundo cheio com texto branco por cima: no escuro o fundo clareia e o texto some (foi a causa dos pills do drawer de filtros usarem hex fixo).

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

As faces vêm no bundle (`src/styles/fontes-fips.css` + `src/fonts/*.woff2`), não da CDN. "Saira Expanded" não existe no catálogo do Google — é o Saira no eixo `wdth=125`, declarado localmente com o nome que `--font-heading` já usa. Regenerar: `python scripts/atualizar-fontes.py`.

Não usar `@import url('https://fonts.googleapis.com/css2?family=Saira+Expanded...')`: o Google responde 400 e, se o `@import` cair no meio do CSS compilado, o browser descarta em silêncio.

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

**Atenção — `--shadow-card` é sobrescrito depois.** O bloco `@layer base :root` redefine, mais abaixo no mesmo arquivo, o valor que de fato vale em runtime:

```css
--shadow-card: 0 1px 3px rgba(0, 75, 155, 0.04), 0 4px 14px rgba(0, 75, 155, 0.03);
```

É essa sombra azulada e discreta (não a cinza do `@theme`) que aparece nos cards, na toolbar e no card da tabela. Ao replicar um card FIPS fora do repo, use este valor.

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
