# Switch

Toggle Radix 42×24px. Requer `@radix-ui/react-switch`.

## Tokens

O `Switch.tsx` lê quatro tokens e não traz valor de reserva em `var()`. Sem eles o trilho some. Defina os quatro, com estes valores:

| Token | Claro | Escuro |
|---|---|---|
| `--color-switch-on` (trilho ligado) | `#004B9B` | `#658ec9` |
| `--color-switch-off` (trilho desligado) | `#6b7784` | `#7a7a82` |
| `--color-surface` (recuo do anel, obrigatório) | `#ffffff` | `#1a1a1a` |
| `--color-ring` (anel de foco, obrigatório) | `#0090d0` | `#f6921e` |

Os valores são os de `src/styles/globals.css` e de `skills/design-system-fips/references/foundations.md` (`:92-94` no claro, `:107` e `:123-125` no escuro). Escreva o hex, não o nome de outro token: quem copia pode não ter `--color-primary` nem `--color-fg-muted`.
