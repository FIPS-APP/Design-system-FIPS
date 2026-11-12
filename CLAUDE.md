# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Design System FIPS — biblioteca oficial de componentes para o sistema FIPS (Ferrovia Interna do Porto de Santos). O repo é **só a library**, publicada no npm como `@fips-app/ds-fips`. Os exports públicos vivem em `src/index.ts`. O antigo site de documentação (`src/docs`, Dockerfile, nginx, Traefik) saiu deste repo na 0.25.0; o histórico do git o preserva.

Stack: React 19 + TypeScript + Vite 8 (modo lib) + Tailwind v4 (config-less, via `@tailwindcss/vite` e `@theme` em `src/styles/globals.css`) + Radix primitives + framer-motion. Idioma do produto e da maioria dos textos: **pt-BR**.

## Commands

```bash
npm run build             # vite build (lib ESM+CJS) + tsc (.d.ts) + gerar-ai (ai/manifest.json)
npm run lint              # ESLint flat config
npm test                  # suíte node:test em scripts/*.test.mjs
```

Validação = `npm test` (node:test: contraste, hooks, governança, CLI) + `npm run build` (TS) + `npm run lint`.

Publicação: tag `v*` dispara `.github/workflows/publish.yml` (npm, com provenance).

## Favicon e ícones de app

Regra canônica: **`docs/favicon.md`**. Os ícones de app vêm do **OPA-MOBILE** e cada app consumidor os hospeda; este repo não publica ícones.

## Architecture

### Camadas (de "fonte da verdade" para "consumidor")

- `src/tokens/` — paleta FIPS (`fipsPalette`), tokens semânticos light/dark (`semanticColors`, `darkSemanticColors`), tipografia, spacing. Alterações de marca devem refletir aqui **e** no `@theme` de `src/styles/globals.css` (CSS custom properties como `--color-fips-blue-900`, `--shadow-card`, etc.).
- `src/styles/globals.css` — único stylesheet global. Define fontes Google, variáveis Tailwind v4 via `@theme`, dark variant via `@custom-variant dark (&:where(.dark, .dark *))`, utilities customizadas. Dark mode é toggle de classe `.dark` no `<html>` (ver `src/hooks/useFipsTheme.ts`, persistido em `localStorage` chave `fips-theme`).
- `src/components/ui/` — primitives governados (Button, Field, Input, Select, Textarea, Tabs, Table, Badge, Card, Dialog, Drawer, Tooltip, Progress, admin-listing). Variantes via `class-variance-authority` em arquivos `*-variants.ts` separados (ex.: `button-variants.ts`). Usam Radix quando aplicável.
- `src/composites/` — composições reutilizáveis exportadas (atualmente `PageHero`).

### Fluxo para criar/editar componentes da library

1. Token novo? → `src/tokens/colors.ts` (ou typography/spacing) **e** variável CSS em `src/styles/globals.css` `@theme`.
2. Variante de primitive? → editar `*-variants.ts` (CVA) — não adicionar classes ad-hoc no JSX do componente.
3. Exportar pela library? → adicionar em `src/components/ui/index.ts` e, se for top-level, em `src/index.ts`.
4. Bump de versão (ver Versionamento abaixo).

## Governance — regras críticas

### ESLint custom rule: `governance/no-visual-overrides`

Definida em `eslint.config.js`. Em qualquer arquivo de `src/**` (inclusive `src/components/ui/**`, desde a 0.21.14), proíbe passar classes Tailwind **visuais** via `className` em primitives governados:

`Button`, `Input`, `Select`, `Textarea`, `TabsList`, `TabsTrigger`.

Tokens visuais bloqueados (regex em `eslint.config.js:9-10`): `bg-`, `text-`, `border`, `rounded`, `shadow`, `h-`/`min-h-`/`max-h-`, `p-`/`px-`/`py-`/etc., `font-`, `leading-`, `tracking-`, `ring-`, `opacity-`.

`className` nesses primitives serve **apenas para layout externo** (margins, grid placement, flex alignment). Para mudar aparência, criar/usar uma **variant** em `*-variants.ts`. Se o caso de uso não couber em variant, evoluir o DS antes de consumir.

### ESLint custom rule: `governance/no-literal-colors`

Definida em `eslint.config.js`. Acusa cor literal (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb(`, `rgba(`, `hsl(`, `hsla(`) em texto de código dos `.ts` e `.tsx` de `src/components/ui/` (inclusive os `*-variants.ts`) e de `src/components/brand/`. `rgb(var(--x) / 0.5)` passa, por ser token. A exceção vale por arquivo e cor, não por ocorrência. Limitação: `#abc` que não é cor (âncora em `href="#add"`) é acusado. As outras pastas de `src/components/` ficam fora até a fatia delas (`composites/` e `icons/` na FIPS-1303; `layout/`, `domain/` e `patterns/` na FIPS-1305). Cor que ainda não tem token entra em `COLOR_EXCEPTIONS`, no próprio `eslint.config.js`, por arquivo e com o motivo. Cor nova em `ui/` não entra ali sem motivo: use `var(--color-*)`. `npm run test:lint-governanca` cobre os casos.

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

Atualizar também o histórico (tabela de versões) em `README.md`: `scripts/gerar-ai.mjs` lê a data da versão dali e o build falha sem a linha. Mensagem de commit: `chore: bump version to X.Y.Z`.
