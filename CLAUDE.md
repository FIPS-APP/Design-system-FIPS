# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Design System FIPS — biblioteca oficial de componentes para o sistema FIPS (Ferrovia Interna do Porto de Santos). O repo é simultaneamente:

1. **Library** — pacote interno consumido por outros apps FIPS. Os exports públicos vivem em `src/index.ts` (tokens, `cn`, primitives de `components/ui`, `FipsLogo`, `PageHero`).
2. **Documentation site** — app Vite/React em `src/docs/**` com playgrounds, foundations, components e patterns. É o "Storybook" do projeto e roda em produção atrás de Traefik (`design-system.fips.app.br`).

Stack: React 19 + TypeScript + Vite 8 + Tailwind v4 (config-less, via `@tailwindcss/vite` e `@theme` em `src/styles/globals.css`) + Radix primitives + framer-motion + react-router v7. Idioma do produto e da maioria dos textos: **pt-BR**.

## Commands

```bash
npm run dev               # Vite dev server
npm run build             # tsc -b && vite build (typecheck antes de buildar)
npm run lint              # ESLint flat config
npm run preview           # Preview do build
npm run build:downloads   # Empacota skills/design-system-fips em public/downloads/*.zip
```

Não há suíte de testes neste repo. Validação = `npm run build` (TS) + `npm run lint`.

Deploy: `Dockerfile` faz build estático e serve via nginx (`nginx/default.conf`); `docker-compose.yml` é a stack Swarm com labels Traefik.

## Architecture

### Camadas (de "fonte da verdade" para "consumidor")

- `src/tokens/` — paleta FIPS (`fipsPalette`), tokens semânticos light/dark (`semanticColors`, `darkSemanticColors`), tipografia, spacing. Alterações de marca devem refletir aqui **e** no `@theme` de `src/styles/globals.css` (CSS custom properties como `--color-fips-blue-900`, `--shadow-card`, etc.).
- `src/styles/globals.css` — único stylesheet global. Define fontes Google, variáveis Tailwind v4 via `@theme`, dark variant via `@custom-variant dark (&:where(.dark, .dark *))`, utilities customizadas. Dark mode é toggle de classe `.dark` no `<html>` (ver `src/hooks/useFipsTheme.ts`, persistido em `localStorage` chave `fips-theme`).
- `src/components/ui/` — primitives governados (Button, Field, Input, Select, Textarea, Tabs, Table, Badge, Card, Dialog, Drawer, Tooltip, Progress, admin-listing). Variantes via `class-variance-authority` em arquivos `*-variants.ts` separados (ex.: `button-variants.ts`). Usam Radix quando aplicável.
- `src/components/brand|domain|layout/` — composições específicas do app de docs (sidebar, headers, tutorial overlay, search pill). **Não exportadas pela library**.
- `src/composites/` — composições reutilizáveis exportadas (atualmente `PageHero`).
- `src/docs/` — **app de documentação**, não faz parte do bundle de library. `pages/` por rota, `components/` (DocPage, CodePlayground, etc.) compartilhados entre páginas.
- `src/app/DocLayout.tsx` + `src/routes/nav.ts` — shell e navegação do site de docs. Toda nova página de doc é registrada em `src/App.tsx` (rotas com `lazy`) **e** em `src/routes/nav.ts` (sidebar).

### Fluxo para criar/editar componentes da library

1. Token novo? → `src/tokens/colors.ts` (ou typography/spacing) **e** variável CSS em `src/styles/globals.css` `@theme`.
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

### Convenções de tema

- Não usar cores hex literais em features. Sempre via `--color-fips-*`, `--color-surface*`, `--color-fg*`, `--color-border`, `--shadow-*` ou tokens semânticos.
- Dark mode: usar a variant `dark:` do Tailwind. Seletor é `.dark` em ancestral, ativado pelo hook `useFipsTheme()`.
- Tipografia: `font-heading` (Saira Expanded) para títulos, default sans (Open Sans) para corpo. Nunca importar outras fontes.
- `cn()` (em `src/lib/cn.ts`) é `twMerge(clsx(...))` — usar para todo merge de classes para que overrides do consumidor vençam.

### Skill bundle

`skills/design-system-fips/` é a versão "portátil" do DS (lida por outras IAs). Quando alterar tokens/componentes/patterns na library, atualizar também `references/foundations.md`, `references/components.md`, `references/patterns.md`, `references/source-of-truth.md` para que o skill empacotado por `npm run build:downloads` continue coerente.

## Versionamento

SemVer. **Toda alteração** atualiza `package.json#version` antes do commit:

- patch (`+0.0.1`) — bugfix, ajuste visual, refactor.
- minor (`+0.1.0`) — nova feature/tela.
- major (`+1.0.0`) — breaking change.

Atualizar também o histórico em `README.md` e a constante `DOC_VERSION` em `src/app/DocLayout.tsx`. Mensagem de commit: `chore: bump version to X.Y.Z`.
