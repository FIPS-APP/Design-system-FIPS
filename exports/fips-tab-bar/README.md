# FipsTabBar

Barra de abas segmentadas (pílulas em card) — padrão de **Configurações** no FIPS Suprimentos.

## Uso

1. Copie `FipsTabBar.tsx` para seu projeto.
2. Ajuste o import de `cn` (clsx + tailwind-merge).
3. Garanta tokens em `:root`: `--color-surface`, `--color-border`, `--color-primary`, `--color-fg-muted`, `--shadow-card`.

## Props

- `tabs`: `{ id, label, icon?, title?, disabled? }[]`
- `activeId` / `onChange`
