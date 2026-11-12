---
name: design-system-fips
description: Use antes de criar, editar ou revisar tela, componente ou CSS de app FIPS. Regras do @fips-app/ds-fips 0.25.0, geradas do pacote; o pacote instalado no app vence este texto.
---

<!-- gerado por scripts/gerar-ai.mjs (dist + ai/padroes.json); não edite à mão -->

# Design System FIPS 0.25.0 (2026-11-12)

Gerado do pacote: 419 exports (187 componente, 19 funcao, 19 valor, 194 tipo), 101 tipos `*Props`, 279 variáveis CSS em `:root`/`.dark`. Lista completa em `ai/manifest.json` (`@fips-app/ds-fips/ai/manifest.json`).

## 1. Passo 0
1. No app: `npx fips-ds passo0`. Mostra versão instalada e do registro, regime, padrões da tela e exports.
2. Nome, prop, variante ou token: só o que está em `node_modules/@fips-app/ds-fips/ai/manifest.json`, no `dist/index.d.ts` ou no `dist/styles.css` instalados. Se este texto divergir do pacote instalado, vale o pacote.

## 2. Padrão de cada tela
| Tela | Referência viva | Do pacote | Nesta versão |
| --- | --- | --- | --- |
| Entrada / login | Gestão OPA (OPA-GESTAO, master): src/pages/LoginPage.tsx | `LoginDsShell`. Antes da 0.23.0: não inventar nem copiar; parar e avisar | tem |
| Casca (sidebar, header, rodapé Modo do menu + Versão) | Gestão OPA (OPA-GESTAO, master) | `AppShell`, `AppFipsHeaderLogo`, `UserAccountMenu`, `NotificacoesMenu`, `TutorialOverlay` | tem |
| Home | Gestão OPA (OPA-GESTAO, master) | `HomeHero`. Destaque amarelo só aqui | tem |
| Banner das telas internas | Gestão OPA (PatternPanelHero, que usa PageHeader) | `PageHeader`. Selo só para estado da tela, nunca o nome do sistema. Nunca PageHero com conteúdo próprio | tem |
| Formulário, execução, editor | Manutenção leva-1 | `SecaoNumerada`, `SegmentoAvaliacao`, `AssinaturaCanvas`, `BarraAcoesRodape`, `CardChecklist` | tem |
| Lista que colapsa no celular | Tecnopano | `ListingFilterToolbar`, `CartaoListagem`, `TabelaExpansivel` | tem |

Brandbook = marca (cor, logo). Layout e componente = a tabela de padrões.

## 3. Proibido
- Nome, prop, variante ou token que o pacote instalado não tem. `ConfirmDialog` não existe. Button sem `variant="default"`/`"destructive"`.
- Cópia local de casca, entrada ou banner; CSS do GMAP; hex literal; `var()` de token inexistente.
- `className` visual em primitivo do pacote (cor, borda, raio, padding, altura, fonte), inclusive com prefixo `sm:`, `hover:`, `dark:`, `data-[...]:`.
- Dependência `file:` ou tgz do pacote: só vale o tgz gerado por `npx fips-ds vendor <versão publicada>` (com `.integrity`); tgz de branch é proibido.
- Faltou no pacote algo que a referência tem: PR no `Design-system-FIPS`, nunca cópia no app.

## 4. O que `npx fips-ds check` confere (sai com 1 se achar)
- `import-inexistente`: nome importado de `@fips-app/ds-fips` que o `.d.ts` instalado não exporta.
- `var-sem-declaracao`: `var(--x)` sem `--x:` no `styles.css` instalado nem no CSS do app.
- `hex-literal`: cor hex literal em `.tsx`, `.jsx` ou `.css` do app.
- `dependencia-local`: `@fips-app/ds-fips` por `file:`, `link:`, URL ou `.tgz` no `package.json`; só vale `file:vendor/fips-app-ds-fips-X.tgz` gerado por `npx fips-ds vendor X` (sha512 igual ao `.integrity` tirado do registro, versão X dentro do tgz, lock no mesmo arquivo).
- `casca-local`: casca, entrada ou banner feitos no app: `login-v1-container`, `liquid-card`, `casca-hero-*`, `PaginaCabecalho`, `PageHero` com filhos.
- `classname-visual`: classe visual (cor, borda, raio, sombra, altura, padding, fonte, anel, opacidade, size, outline) em `className` de `Button`, `Input`, `Select`, `Textarea`, `TabsList`, `TabsTrigger` do pacote, também com prefixo (`sm:`, `hover:`, `dark:`, `data-[...]:`).

Lint das mesmas regras de primitivo e casca: `import governance from '@fips-app/ds-fips/eslint'` (ESLint 9, flat config).

## 5. Antes de dizer "pronto"
1. `npx fips-ds check` com 0 problemas.
2. Typecheck, testes e build num `&&` só.
3. Contraste de toda variante de Button/Badge trocada (número, dois temas); Select dentro de Modal aberto e inteiro; teste novo provado por mutação.
4. Print lado a lado com a referência viva a 1440 e 375 px, claro e escuro.

## 6. Regimes que mudam a regra
- OPA-MOBILE: produção. Nunca concluir registro, nunca `?demo` online; `src/ds/` travado por sha256.
- UI própria (OPA-GESTAO, CIPA-FIPS, fips-suprimentos, Governanca_BI, opa2.0) e `ui-sup` (fips-obrigacoes, fips-governanca, fips-qlp): respeitar a API local até a migração daquele app para o pacote.
