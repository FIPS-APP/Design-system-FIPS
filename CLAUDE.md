# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Design System FIPS — biblioteca oficial de componentes para o sistema FIPS (Ferrovia Interna do Porto de Santos). O repo é simultaneamente:

1. **Library** — pacote interno consumido por outros apps FIPS. Os exports públicos vivem em `src/index.ts` (tokens, `cn`, primitives de `components/ui`, `FipsLogo`, `PageHero`).
2. **Documentation site** — app Vite/React em `src/docs/**` com playgrounds, foundations, components e patterns. É o "Storybook" do projeto e roda em produção atrás de Traefik (`design-system.fips.app.br`).

Stack: React 19 + TypeScript + Vite 8 + Tailwind v4 (config-less, via `@tailwindcss/vite` e `@theme` em `src/styles/tokens.generated.css`) + Radix primitives + framer-motion + react-router v7. Idioma do produto e da maioria dos textos: **pt-BR**.

## Commands

```bash
npm run dev               # Vite dev server
npm run build             # build da LIBRARY (vite lib + declarations)
npm run build:site        # build do SITE de documentação (tsc -b && vite build)
npm run lint              # ESLint flat config
npm run preview           # Preview do build
npm run build:downloads   # Empacota skills/ds-fips em public/downloads/ds-fips-skill.zip
npm run tokens:build      # Regenera src/styles/tokens.generated.css a partir de src/tokens/theme.ts
npm run tokens:check      # Falha se o CSS gerado estiver defasado (roda antes dos dois builds e no CI)
npm run lint:colors       # Gate de cor crua: erro na library, relatório de dívida no resto
```

Não há suíte de testes neste repo. Validação = `npm run build` (TS) + `npm run lint`.

Deploy: `Dockerfile` faz build estático e serve via nginx (`nginx/default.conf`); `docker-compose.yml` é a stack Swarm com labels Traefik.

## Architecture

### Camadas (de "fonte da verdade" para "consumidor")

- `src/tokens/theme.ts` — **fonte da verdade de todo token**: primitivas do `@theme` (`--color-fips-*`, `--radius-*`, `--shadow-*`), semânticos light/dark (`--color-surface`, `--color-fg`, `--color-gov-*`, `--shadow-dialog`…) e os tokens de banner (`--fips-banner-*`). É o único arquivo do repo onde hex literal é permitido. Um valor pode referenciar outro com `'{--color-fips-blue-900}'`, que vira `var(--color-fips-blue-900)` no CSS e o hex resolvido no TS.
- `src/styles/tokens.generated.css` — **gerado** por `npm run tokens:build` (`scripts/build-tokens.mjs`). Não editar à mão: `npm run tokens:check` roda antes de `build`/`build:site` e no CI.
- `src/tokens/colors.ts` — vista com os nomes do Brandbook (`fipsPalette`, `semanticColors`, `darkSemanticColors`) **derivada** de `theme.ts`. Mudar cor aqui não muda nada: mude no `theme.ts`.
- `src/styles/globals.css` — stylesheet global do que **não** é token: importa o CSS gerado, fontes Google, `@custom-variant dark (&:where(.dark, .dark *))`, utilities, reset e as classes de banner. Dark mode é toggle de classe `.dark` no `<html>` (ver `src/hooks/useFipsTheme.ts`, persistido em `localStorage` chave `fips-theme`).
- `src/components/ui/` — primitives governados (Button, Field, Input, Select, Textarea, Tabs, Table, Badge, Card, Dialog, Drawer, Tooltip, Progress, admin-listing). Variantes via `class-variance-authority` em arquivos `*-variants.ts` separados (ex.: `button-variants.ts`). Usam Radix quando aplicável.
- `src/components/brand|domain|layout/` — composições específicas do app de docs (sidebar, headers, tutorial overlay, search pill). **Não exportadas pela library**.
- `src/composites/` — composições reutilizáveis exportadas (atualmente `PageHero`).
- `src/docs/` — **app de documentação**, não faz parte do bundle de library. `pages/` por rota, `components/` (DocPage, CodePlayground, etc.) compartilhados entre páginas.
- `src/app/DocLayout.tsx` + `src/routes/nav.ts` — shell e navegação do site de docs. Toda nova página de doc é registrada em `src/App.tsx` (rotas com `lazy`) **e** em `src/routes/nav.ts` (sidebar).

### Fluxo para criar/editar componentes da library

1. Token novo? → `src/tokens/theme.ts` (bloco certo: `themeTokens` para primitiva, `lightTokens`/`darkTokens` para semântico, `bannerLightTokens`/`bannerDarkTokens` para banner) + `npm run tokens:build`. **Um lugar só** — o CSS sai dele.
2. Variante de primitive? → editar `*-variants.ts` (CVA) — não adicionar classes ad-hoc no JSX do componente.
3. Exportar pela library? → adicionar em `src/components/ui/index.ts` e, se for top-level, em `src/index.ts`.
4. Documentar? → criar `src/docs/pages/components/<Nome>Doc.tsx`, registrar rota em `src/App.tsx`, adicionar entrada em `src/routes/nav.ts`.
5. Bump de versão (ver Versionamento abaixo).

## Governance — regras críticas

### ESLint custom rule: `governance/no-visual-overrides`

Definida em `eslint.config.js`. Em qualquer arquivo de `src/**` (exceto `src/components/ui/**`), proíbe passar classes Tailwind **visuais** via `className` em primitives governados:

`Button`, `Input`, `Select`, `Textarea`, `TabsList`, `TabsTrigger`.

Tokens visuais bloqueados (regex em `eslint.config.js:9-10`): `bg-`, `text-`, `border`, `rounded`, `shadow`, `h-`/`min-h-`/`max-h-`, `p-`/`px-`/`py-`/etc., `font-`, `leading-`, `tracking-`, `ring-`, `opacity-`.

`className` nesses primitives serve **apenas para layout externo** (margins, grid placement, flex alignment). Para mudar aparência, criar/usar uma **variant** em `*-variants.ts`. Se o caso de uso não couber em variant, evoluir o DS antes de consumir.

### ESLint custom rule: `governance/no-raw-color`

Cor crua (hex, `rgb()/rgba()`, `hsl()/hsla()`) em qualquer string de `src/**`:

- **erro** em `src/components/{ui,composites,brand,icons}/**` e `src/composites/**` — a biblioteca publicada. Hoje está em **zero**; `npm run lint:colors` é o gate e roda no CI.
- **warn** no resto (doc pages, chrome do site de docs). É dívida conhecida e some por página; `npm run lint:colors` imprime o ranking.
- **ignorada** em `src/tokens/**`, que é onde o valor deve morar.

A mensagem já aponta o token certo quando o hex bate com algum (`#004B9B` → "use `var(--color-fips-blue-900)`"). Se não existir token, promova em `src/tokens/theme.ts` e rode `npm run tokens:build` — não invente hex no componente.

Exceção viva: `src/components/composites/ExportModal.tsx` tem `eslint-disable` no topo (tema próprio em JS, legado, substituído por `ExportPreviewModal`).

### Convenções de tema

- Não usar cores hex literais em features. Sempre via `--color-fips-*`, `--color-surface*`, `--color-fg*`, `--color-border`, `--shadow-*` ou tokens semânticos. Inclusive nos pares de dark: `dark:border-[var(--color-fips-blue-400)]`, nunca `dark:border-[#93BDE4]`.
- Dark mode: usar a variant `dark:` do Tailwind. Seletor é `.dark` em ancestral, ativado pelo hook `useFipsTheme()`.
- Tipografia: `font-heading` (Saira Expanded) para títulos, default sans (Open Sans) para corpo. Nunca importar outras fontes.
- `cn()` (em `src/lib/cn.ts`) é `twMerge(clsx(...))` — usar para todo merge de classes para que overrides do consumidor vençam.

### Skill bundle

`skills/ds-fips/` é a versão "portátil" do DS (lida por outras IAs). Quando alterar tokens/componentes/patterns na library, atualizar também `references/foundations.md`, `references/components.md`, `references/patterns.md`, `references/source-of-truth.md` **e rodar `npm run build:downloads`** — o CI compara o conteúdo do zip com a pasta e falha se divergirem.

## Versionamento

SemVer. **Toda alteração** atualiza `package.json#version` antes do commit:

- patch (`+0.0.1`) — bugfix, ajuste visual, refactor.
- minor (`+0.1.0`) — nova feature/tela.
- major (`+1.0.0`) — breaking change.

Atualizar também o histórico em `README.md` e a constante `DOC_VERSION` em `src/app/DocLayout.tsx`. Mensagem de commit: `chore: bump version to X.Y.Z`.
