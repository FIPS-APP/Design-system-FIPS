# Design System FIPS (`@fips-app/ds-fips`)

Biblioteca oficial de componentes, tokens e estilos para construir interfaces
do sistema FIPS (Ferrovia Interna do Porto de Santos), publicada no GitHub
Packages.

## Versão atual: `v0.10.0`

## Consumindo a biblioteca

### 1. Autenticação no GitHub Packages

Crie um `.npmrc` no projeto consumidor (commitar é seguro — o token vem do
ambiente):

```
@fips-app:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Exporte um Personal Access Token com escopo `read:packages` na sua shell ou
no CI:

```bash
export GITHUB_TOKEN=ghp_xxx
```

### 2. Instalação

```bash
npm install @fips-app/ds-fips
```

### 3. Uso

Importe o CSS uma vez no entry da aplicação consumidora:

```tsx
// Next.js: app/layout.tsx
// Vite:    src/main.tsx
import '@fips-app/ds-fips/styles.css'
```

E os componentes/utilitários onde precisar:

```tsx
import { Button, FipsLogo, cn } from '@fips-app/ds-fips'
```

> Requer `react`, `react-dom`, `tailwindcss` v4 e `framer-motion` (>=11, para
> `CircularCommandMenu` / `RowActionsMenu`) instalados no projeto consumidor
> (declarados como `peerDependencies`).

## Versionamento

O projeto segue **Semantic Versioning (SemVer)**. Toda alteração deve atualizar a versão em `package.json` antes do commit.

| Tipo de alteração | Incremento | Exemplo |
|---|---|---|
| **Correção / patch** (bugfix, ajuste visual, refactor) | `+0.0.1` | 0.4.0 → 0.4.1 |
| **Nova feature / tela** | `+0.1.0` | 0.4.0 → 0.5.0 |
| **Breaking change** (mudança incompatível) | `+1.0.0` | 0.4.0 → 1.0.0 |

### Como atualizar a versão

1. Edite o campo `"version"` no `package.json`
2. Atualize a seção "Versão atual" neste README
3. Commit com mensagem no padrão: `chore: bump version to X.Y.Z`
4. Após merge na `main`, crie e empurre a tag para disparar a publicação:
   ```bash
   git tag vX.Y.Z
   git push --tags
   ```

## Histórico de versões

| Versão | Data | Descrição |
|---|---|---|
| 0.10.0 | 2026-07-28 | `Modal (legado)` (`/docs/components/dialog`) ganha 9ª variante no playground: botão "Exportação" abre o `ExportPreviewModal` (canônico Tecnopano, não o `ExportModal` legado) — mesmo padrão já em `/docs/patterns/export-modal` e `/docs/patterns/data-listing`, agora também no menu/galeria de modais |
| 0.9.2 | 2026-07-27 | Dialog FIPS (faixa azul), ExportPreviewModal polish + doc em Modal Radix |
| 0.9.1 | 2026-07-27 | ExportPreviewModal (paridade Tecnopano: Tudo/Tabela/Expandida + chips + preview) |
| 0.9.0 | 2026-07-27 | Data Listing parity: ExportButtons, ListingKpiRow, CircularCommandMenu/RowActionsMenu |
| 0.8.0 | 2026-07-27 | StatsCard/StatsCardGrid (KPI Home) e HowItWorksCard/HowItWorksGrid (Como Funciona) |
| 0.7.0 | 2026-07-06 | Barra de Filtros do padrão Dashboard trocada de um grid de 6 selects rotulados (30px, 2 linhas) para uma linha de chips `ChipSelect` (32.5px, "Label: Valor" + dropdown com radio) — mesmo padrão do `FilterBar` real do Governança BI. Novo padrão: Drawer "Filtros avançados" (`/docs/components/drawer`) ganha implementação viva seguindo o spec já documentado em `patterns.md` (referência real `Governanca_BI/src/pages/KpiDashboardPage.tsx`) — header gov-gradient com contador dinâmico de filtros ativos, novo componente `PillFilterGroup` (pill 1-clique com cor semântica: ativo = fundo cheio + texto branco, inativo com cor = dot). `FSelect` do `DrawerDoc.tsx` (5 dos 6 drawers de exemplo) passa a delegar pro `Select` governado; campos de período viram `type="date"`. No próprio drawer de Filtros, Departamento/Segmento usam o novo `ChipSelect` (32.5px, dropdown com radio) em vez do `Select` governado (36px, sem variante compacta) — assim ficam do mesmo tamanho que os campos de data. Fix: sidebar real tinha `shadow-[4px_0_32px_...]` vazando pra direita sobre o conteúdo (dark já cancelava, light não) — removida dos dois temas |
| 0.6.3 | 2026-07-03 | Fix no padrão Login: `login-ds.css` nunca era importado na doc (`/docs/login`), então `.login-v1-container` renderizava `display:block` em vez de `flex` e o card de vidro colapsava sem padding/tamanho no rodapé do preview; import corrigido em `LoginPage.tsx`. Também corrigida a falta de acentuação pt-BR em `LoginDsShell.tsx` e nos exemplos de código copiáveis ("Eficiencia" → "Eficiência", "Rota dos principios" → "Rota dos princípios" etc.) e a altura do preview (herdava `100svh` do componente real de tela cheia, ~1000px dentro do card; override escopado fixa 720px só na doc). Fix no mockup do Application Shell (`/docs/patterns/application-shell`): hero passou a replicar o hero real da HomePage (imagem full-bleed + overlay azul vertical `#002A68/60→45→60` + vinheta) e o header trocou botões chapados + busca "Q" pelos botões neumorphic (`DocHeaderNeuIconButton`), removeu o campo de busca e trocou o chip estático "AF Usuário" pelo `UserChip` canônico (menu de conta completo); botões do hero reduzidos de `lg` para `sm`; cards de indicador mais compactos (label em uma linha, ícone 32px, altura 118px→96px); blocos de conteúdo viraram linhas horizontais (sem aperto), "Notas visuais" virou checklist compacta, sidebar do mockup alinhada ao real (logo, "Modo menu") e header mobile agora segue o padrão real (logo, avatar isolado, 3 ícones). Fix no padrão Data Listing: toolbar tinha 3 campos fora do padrão de altura desktop (32.5px) — Busca (`35px`) e botões Excel/PDF (`34px`) corrigidos. Migração de gráficos Recharts → Apache ECharts: card da página Stacks atualizado e o mini-donut do padrão Dashboard migrado de verdade (init manual via `echarts/core`, dependência `recharts` removida) |
| 0.6.2 | 2026-07-02 | Header mobile: `UserChip` mostra só o avatar (32px, sem fundo/borda/chevron), ícones de Notificações/Tutorial voltam a aparecer, marca do trilho passa a usar o logo colorido oficial (`appfips-logo-full.png`, sem chip/fundo/borda) e o padding direito do header foi reduzido um degrau; skill `design-system-fips` (`patterns.md`, `source-of-truth.md`) passa a documentar a anatomia completa do Header |
| 0.6.1 | 2026-07-02 | No mobile (abaixo de `sm`), o trilho "grupo / página" do header (`DocHeaderPageTrail`) dá lugar à marca FIPS (ícone do sidebar colapsado) num chip azul, em vez do breadcrumb em texto |
| 0.6.0 | 2026-07-02 | Chip de usuário do header (`UserChip`, variante `docHeader`) vira clicável: avatar+nome+cargo coloridos por perfil, abre o novo menu "Minha Conta" (`UserAccountMenu`) — painel ancorado embaixo do chip, não modal — com perfil ativo, badge de perfil, seletor "Trocar de perfil (demo)" (Colaborador/Gestor/Diretoria/Administrador) e ações Meu perfil/Preferências/Sair |
| 0.5.5 | 2026-06-25 | Modal: header padronizado (eyebrow + título 21px + ícone-tile, acento gov→âmbar / semântico→branco) e exemplo "Informativo" trocado para "Movimentação de Pátio"; campos de modal no padrão compact (h-9 / radius 12 / text-sm); correção do sticky do rodapé do sidebar (`lg:overflow-visible`); skill bundle atualizado (Badge, rodapé do sidebar, governança de novo projeto) |
| 0.5.4 | 2026-06-23 | Sidebar com categorias colapsáveis (cabeçalho tipográfico + colapso animado, padrão unificado DS-FIPS / Suprimentos / Governança BI); página "Histórico de versões" (ex-"Changelog") reescrita como timeline; rodapé "Menu automático" → "Modo menu" |
| 0.5.3 | 2026-06-22 | Remoção completa da função "Ver código" (`CodeExportSection`) das páginas de documentação; correção do build quebrado por imports órfãos |
| 0.5.0 | 2026-05-01 | Empacotamento como biblioteca npm publicável (`@fips-app/ds-fips`) com ESM/CJS/types/styles.css e workflow automático no GitHub Packages |
| 0.4.3 | 2026-04-28 | Ajustes de iconografia, playground interativo e padronização visual dos headers/previews |
| 0.4.2 | 2026-04-28 | Ampliação da documentação (componentes/patterns), playground de código e ajustes no login Tecnopano |
| 0.4.1 | 2026-04-27 | Documentação de versionamento e changelog |
| 0.4.0 | 2026-04-23 | Stacks, tutorial contextual, modal colorido, exports |

## Desenvolvimento desta lib

```bash
npm install
npm run dev      # playground / docs internos
npm run build    # gera dist/ (lib em ESM + CJS + .d.ts + styles.css)
```

### Publicação

A publicação é automática via GitHub Actions ao empurrar uma tag `v*`. O
workflow em `.github/workflows/publish.yml` autentica com `GITHUB_TOKEN`,
roda `npm run build` e publica em `npm.pkg.github.com` com escopo
`@fips-app`.

## Stack

- React + TypeScript
- Vite (lib mode)
- Tailwind CSS v4
- Radix UI primitives
