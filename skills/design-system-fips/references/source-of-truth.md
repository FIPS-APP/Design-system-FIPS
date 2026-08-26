# Source Of Truth

## Ordem de prioridade

1. `docs/Brandbook PPT.pdf`
2. `public/guias/guia-design-system-fips.md`
3. Tokens e CSS globais do projeto
4. Componentes reutilizáveis de `src/components/ui/`
5. Padrões documentados em `src/docs/pages/`

Se houver conflito:

- Identidade de marca: o Brandbook vence.
- Implementação de produto: o código reutilizável do repositório vence.
- Material promocional/documental: usar o guia e as páginas de documentação como referência visual complementar.

## Mapa do repositório

### Marca e identidade

- `docs/Brandbook PPT.pdf`
- `public/brand/`
- `src/components/brand/FipsLogo.tsx` — chip branco p/ fundo claro; **não** é a marca da sidebar
- `public/appfips-logo.png` (menu aberto) · `public/appfips-mark-collapsed.png` (colapsado) — marca da sidebar
- `public/appfips-logo-full.png` — logo colorida completa ("App" cinza + ícone/"FIPS" azul), usada na marca mobile do trilho do header (`DocHeaderPageTrail`) — **diferente** dos 2 assets brancos da sidebar acima
- `src/components/layout/DocsNeuSidebar.tsx` (~l.595–649) — header real do menu (marca + nome). Ver `components.md` → "FipsLogo e marca do menu"

### Tokens e CSS globais

- `src/styles/globals.css`
- `src/tokens/colors.ts`
- `src/tokens/spacing.ts`
- `src/tokens/typography.ts`

### Componentes reutilizáveis

- `src/index.ts` — **entrada pública da library** (tokens, `cn`, primitives, composites)
- `src/components/ui/index.ts` — barrel dos primitives governados
- `src/components/ui/button.tsx` + `button-variants.ts`
- `src/components/ui/badge.tsx` + `badge-variants.ts`
- `src/components/ui/card.tsx`
- `src/components/ui/field.tsx` + `field-trigger.tsx`
- `src/components/ui/input.tsx` + `input-group.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/switch.tsx` — exportado, **sem página de doc** (removida na v0.11.20)
- `src/components/ui/table.tsx` + `admin-listing.tsx` (`AdminTableColumnMenu`/`Pagination`/`SortHeader`)
- `src/components/ui/dialog.tsx` + `Modal.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/progress.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/tooltip.tsx`

### Header e navegação

- `src/app/DocLayout.tsx` — shell real (monta header + sidebar + tema/busca/notificações)
- `src/components/layout/DocHeaderStandard.tsx` — header canônico (`DocHeaderHeroBackground`, `DocHeaderDarkBackground`, `DocHeaderStandardPreview`)
- `src/components/layout/DocHeaderPageTrail.tsx` — trilho grupo/página (breadcrumb desktop → marca FIPS no mobile)
- `src/components/layout/DocHeaderNeuIconButton.tsx` — azulejo neumorphic 36×36 (recolher-sidebar, Notificações, Tutorial, tema)
- `src/components/layout/DocHeaderSectionNav.tsx` — faixa de tabs de seção (desktop, `lg+`)
- `src/components/layout/UserChip.tsx` + `UserAccountMenu.tsx` — chip de usuário do header + menu "Minha Conta"
- `src/lib/docHeaderChrome.ts` — tokens de cromia do header (idle/hover/shimmer, claro/escuro)
- `src/docs/data/users.ts` — usuários demo, `FIPS_ROLE_COLOR`/`FIPS_ROLE_LABEL`/`FIPS_ROLE_BADGE_VARIANT`

### Composites e padrões

- `src/composites/PageHero.tsx`
- `src/docs/pages/patterns/ApplicationShellDemo.tsx`
- `src/docs/pages/patterns/DashboardDemo.tsx`
- `src/docs/pages/patterns/DataListingDemo.tsx` — toolbar + **drawer de filtros** + **chips de filtro ativo** + tabela + paginação (referência viva do padrão)
- `src/components/composites/ExportButtons.tsx`
- `src/components/composites/ExportPreviewModal.tsx`
- `src/components/composites/ListingKpiRow.tsx` · `StatsCard.tsx` · `HowItWorksCard.tsx` · `RuleTile.tsx`
- `src/components/composites/ActiveFilterChips.tsx` — chip por VALOR filtrado (não badge de contagem), usado no header da Table do Data Listing
- `src/components/composites/CircularCommandMenu.tsx`
- `src/components/composites/RowActionsMenu.tsx`
- `src/components/brand/BrandLoader.tsx` — categoria **Motion**, marca 3D animada (WebM alfa + APNG fallback)
- `src/components/icons/FileIcons.tsx`
- `src/docs/pages/patterns/FormWorkspaceDemo.tsx`
- `src/docs/pages/patterns/ModalWorkflowDemo.tsx`
- `src/docs/pages/patterns/HeroHeaderDoc.tsx` (página **Hero** em `/docs/patterns/hero`)
- `src/docs/pages/GovernancePage.tsx`

### Versão e changelog

- `src/docs/data/changelog.ts` — **fonte única** do histórico (`CHANGELOG: ChangelogVersion[]`), consumida pela timeline `/docs/changelog` e pelo `ChangelogModal`. Nunca duplicar em array local.
- `src/components/layout/ChangelogModal.tsx` — modal "Novidades do Sistema".
- Toda alteração faz bump de `package.json#version` + `DOC_VERSION` (`src/app/DocLayout.tsx`) + entrada no `CHANGELOG` + README. SemVer.
- **Ao mexer em token/componente/padrão, atualize também estas referências portáteis** — `npm run build:downloads` empacota `skills/design-system-fips` em `public/downloads/*.zip`.

### Navegação do site de docs

- `src/routes/nav.ts` (sidebar) + `src/App.tsx` (rotas `lazy`) — toda página nova entra nos dois.
- Páginas removidas (rota cai no catch-all → Home): `/docs/components/switch` (v0.11.20), Modal Radix (v0.11.12), Relatórios operacionais e Export modal (v0.11.6).
- `/docs/components/circular-command-menu` aparece no menu como **"Ações"** (v0.11.31).

### Espelho em produto (Tecnopano 3.0)

- `client/tecnopano/ApplicationShellDemo.tsx` — demo lazy, fora de `AppLayout`
- `client/src/components/layout/Header.tsx` — header da aplicação (hero + faixa + neu + abas lg+)
- `client/src/components/layout/DocHeaderStandard.tsx`, `DocHeaderNeuIconButton.tsx`, `client/src/lib/docHeaderChrome.ts`

## Regras portáteis

- Nome oficial: `Design System FIPS`. Evite abreviar isso em documentação externa.
- Se existir componente no design system, use o componente. Não replique a UI com CSS local.
- Se faltar uma variante, evolua o design system primeiro.
- `PageHero` é o header padrão de módulo.
- Formulários seguem `Field` mais controle (`Input`, `Select`, `Textarea`).
- Botões, badges, cards e tabelas herdam tokens globais. Não troque a paleta por conveniência.

## Buscas rápidas

- `rg -n "azulProfundo|amareloOuro|verdeFloresta" src public`
- `rg -n "Field density|density =" src/components/ui`
- `rg -n "Padrão:" src/docs/pages/patterns`
- `rg -n "Governança|regra de ouro|Não" src/docs/pages/GovernancePage.tsx`
