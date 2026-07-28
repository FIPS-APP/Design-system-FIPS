# Design System FIPS (`@fips-app/ds-fips`)

Biblioteca oficial de componentes, tokens e estilos para construir interfaces
do sistema FIPS (Ferrovia Interna do Porto de Santos), publicada no GitHub
Packages.

## Versão atual: `v0.11.17`

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
| 0.11.17 | 2026-07-28 | Removida a função de copiar da Seção 01 (Tipos de seleção) de `/docs/components/select` — os 13 exemplos viram preview puro. Junto saíram os 9 helpers geradores de snippet (`selectCode`, `autocompleteCode`, `multiSelectCode`, `checkboxCode`, `radioCode`, `toggleCode`, `chipSelectCode`, `chipFiltroCode`, `segmentedCode`), que só eles usavam: 339 linhas a menos. `selectExportCode` foi mantido (alimenta a seção "Exportar código") |
| 0.11.16 | 2026-07-28 | Nova página `/docs/components/select` ganha o tipo "Chip Filtro": botão fechado "Rótulo: Valor" que abre dropdown com radio, mesmo padrão do `ChipSelect` da toolbar/Filtros avançados (`DrawerDoc.tsx`) — uso exclusivo em barras de filtro, formulário continua usando `Select`. Adicionado componente `DSChipFiltro`, exemplo "Departamento" na vitrine, card na Guia de uso e entrada no resumo "Quando usar" (9 tipos de seleção, antes 8) |
| 0.11.15 | 2026-07-28 | Correção real dos campos compactos (a v0.11.14 tinha acertado radius/borda mas errado a altura): `Input`/`Select`/`Textarea`/`FieldTrigger`/`InputGroup` alinhados à referência de produto real — `Field`/`Select` de `ColaboradorForm.tsx` no projeto QLP — 32px (`h-8`, não 35px), borda 1px sólida, hover `--color-border-strong`, sem sombra, anel de foco 25%. Restaurado o par `dark:#93BDE4` nos estados de foco/ativo (não é resíduo — `--color-primary` não muda no dark mode neste projeto, então é o substituto funcional de contraste) |
| 0.11.14 | 2026-07-28 | `Input`/`Select`/`Textarea` governados alinhados à referência visual de `/docs/components/input`: radius `rounded-xl` (12px) → `rounded-lg` (8px), borda `1px`+alpha `/60` → `1.5px` sólida, compact `h-9`/`text-sm` → `h-[35px]`/`text-[13px]`. Fecha a divergência entre os primitivos e a própria página que os documenta |
| 0.11.13 | 2026-07-28 | Removida a função de copiar de `/docs/patterns/form-workspace` (3 wrappers `Copyable`: Hero, Seções do Formulário, Footer) + helpers `wsCode`/`wsPreview` que só ela usava, e o texto "Clique em qualquer seção para copiar o código" do hero |
| 0.11.12 | 2026-07-28 | Removida a página "Modal Radix" (`/docs/components/modal-radix`): arquivo, rota, nav e referência na skill. O composite `Modal`/`ModalFooter` (`src/components/ui/Modal.tsx`) só era demoed ali e fica sem doc dedicada — arquivo não foi apagado |
| 0.11.11 | 2026-07-28 | Item do sidebar renomeado de "Modal (legado)" para "Modal" (`routes/nav.ts`) |
| 0.11.10 | 2026-07-28 | Removida a Seção 11 "Exportar Código" de `/docs/components/dialog` (cards Modal/TutorialModal/PopupModal com Ver código + Copiar código), junto com o helper `CodeExport` e as 3 constantes de código copy-paste que só ela usava — 500 linhas a menos |
| 0.11.9 | 2026-07-28 | Removida a função de copiar da Seção 01 (Variantes do sistema) de `/docs/components/button` — os 10 botões (Primário…Link) viram preview puro. Removida a função `variantCode` (geradora do código copiado, sem outros usos) e o texto "Clique em qualquer botão para copiar o código" |
| 0.11.8 | 2026-07-28 | Removida a função de copiar dos cards da Paleta principal (`/docs/foundations/colors`): wrapper `Copyable` e botão `CopyHex`. Como efeito colateral positivo, os cards passam a preencher a célula do grid (antes encolhiam pro tamanho do texto, com larguras irregulares de 135–189px em células de 329px) |
| 0.11.7 | 2026-07-28 | Removido o badge "Preferências" do hero de `/docs/patterns/configuracoes` (`PatternPanelHero`, props `badgePill`/`badge`) |
| 0.11.6 | 2026-07-28 | Removidas as páginas de padrão "Relatórios operacionais" e "Export modal" (rotas, nav, lazy imports, mapeamento do tutorial contextual) e o link cruzado quebrado que sobrava em Modal Radix. Não afeta os composites `ExportModal`/`ExportPreviewModal`, que seguem em uso normal (Data Listing, Modal Radix, botão "Exportação" do Modal legado) |
| 0.11.5 | 2026-07-28 | Pill group Tudo/Tabela/Expandida do `ExportPreviewModal` reduzido: 264×41 → 216×31 (botões `px-3 py-1.5 text-[11px]`→`px-2 py-1 text-[10px]`, ícone 12→11px, container `p-1`→`p-0.5`) |
| 0.11.4 | 2026-07-28 | Fileira Tudo/Tabela/Expandida do `ExportPreviewModal` mais compacta: seção 70px → 58px (padding `py-3`→`py-2`, botões `px-4 py-2`→`px-3 py-1.5`, ícone 13→12px) |
| 0.11.3 | 2026-07-28 | Botões PDF/Excel do `ExportPreviewModal`: PDF de azul para `variant="danger"` (vermelho); Excel de verde médio para nova variante `successStrong` (verde escuro, `--color-success-strong`) — adicionada ao `buttonVariants` governado |
| 0.11.2 | 2026-07-28 | Fix real do corte no header do `ExportPreviewModal`: o `-mx-6 -mt-6` (v0.11.0) assumia `p-6` no `DialogContent`, mas este componente já zera o padding via `className="...p-0 sm:p-0"` — a margem negativa empurrava o header ~24px pra fora do painel de verdade, cortando o topo inteiro pelo `overflow-hidden`. Removida a margem negativa (não havia padding a cancelar) |
| 0.11.1 | 2026-07-28 | Fix: botão de fechar do header do `ExportPreviewModal` (novo header gov-gradient, v0.11.0) ficava cortado pelo canto arredondado do painel — copiei o offset `top-3.5 right-3.5` do `ChangelogModal`, mas o `DialogContent` usa raio 20px (bem maior que os 12px do painel do ChangelogModal). Ajustado para `top-5 right-6` |
| 0.11.0 | 2026-07-28 | `ExportPreviewModal` realinhado ao header canônico DS-FIPS (gov-gradient, âmbar, eyebrow, JunctionLines — igual ao `ChangelogModal`), no lugar do header neutro genérico do `DialogContent`. Rodapé: botões passam a aparecer conforme a callback recebida (não mais travado por `intent`) — PDF e Excel (ex-"Planilha", agora verde) ficam disponíveis juntos quando o consumidor passa as 3 callbacks. Afeta todos os usos: Data Listing, Export Modal pattern, Modal Radix doc e o botão "Exportação" do Modal (legado) |
| 0.10.1 | 2026-07-28 | Playground de `Modal (legado)`: os 9 botões usavam emoji como ícone — trocados por `lucide-react` (Check/X/AlertTriangle/Info/ClipboardEdit/ClipboardList/Maximize2/HelpCircle/Download), mesma troca nos gatilhos "Abrir tutorial"/"Abrir popup". Largura de conteúdo da página 1100→1280px (só aqui) + `margin:auto` (faltava, página não centralizava) — os 9 cabem numa linha em telas de 1920px+ |
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
