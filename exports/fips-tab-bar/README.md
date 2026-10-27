# FipsTabBar

Barra de abas segmentadas (pílulas em card) — padrão de **Configurações** no FIPS Suprimentos.

## Uso

Desde a 0.21.13 o componente sai pelo pacote: `import { FipsTabBar } from '@fips-app/ds-fips'`. Não copie o arquivo.

Só para app que ainda não está no pacote:

1. Copie `FipsTabBar.tsx` para seu projeto.
2. Ajuste o import de `cn` (clsx + tailwind-merge).
3. Garanta tokens em `:root`: `--color-surface`, `--color-border`, `--color-primary`, `--color-fg-muted`, `--shadow-card`.

## Props

- `tabs`: `{ id, label, icon?, title?, disabled? }[]`
- `activeId` / `onChange`
