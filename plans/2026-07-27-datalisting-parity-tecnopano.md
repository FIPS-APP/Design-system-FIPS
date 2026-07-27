# Blueprint — Data Listing parity Tecnopano → Design-system-FIPS

> Gerado por `/blueprint` em 2026-07-27.  
> Objetivo: replicar no DS-FIPS o trio visual/comportamental da listagem Tecnopano (Expedição › Pedidos): **Export Excel/PDF 32.5px**, **Indicadores Rápidos** no `panelHeader` da toolbar, **menu radial de ações da linha** (`CircularCommandMenu` / `RowActionsMenu`).

## Meta

Qualquer app FIPS (e o site de docs) deve poder copiar o padrão de listagem Tecnopano sem abrir o monorepo Tecnopano: componentes exportáveis + demo viva em `/docs/patterns/data-listing` + skill `design-system-fips` atualizada.

## Repos e paths

| Papel | Path |
|---|---|
| **Alvo (editar)** | `/dados/Projetos/Design-system-FIPS` (branch `main`, remotes `origin`=FIPS-APP, `nookweb`=Nookweb-SDE) |
| **Fonte (só leitura)** | `/dados/Projetos/tecnopano/teconopano3.0` (ou `~/Área de trabalho/tecnopano/teconopano3.0`) |
| Equivalente Contabo | `/dados/Projetos/...` |

## Fonte canônica (Tecnopano) — não inventar

| Peça | Arquivos fonte |
|---|---|
| Export 32.5px | `client/src/components/domain/DataListingToolbar.tsx` (`ExportButton`, ~L167–203) |
| Indicadores Rápidos | `client/src/components/domain/ListingKpiRow.tsx` + `StatsCard.tsx` (`onClick`/`selected`) + slot `panelHeader` em `DataListingToolbar.tsx` (~L294–298) · exemplo `ExpedicaoKpiRow.tsx` |
| Menu radial | `client/src/components/ui/circular-command-menu.tsx` + `domain/RowActionsMenu.tsx` + CSS `.cmd-glass*` / `.fips-row-action` em `client/src/styles/globals.css` (~L561–590) |

## Estado atual no DS-FIPS (gap)

| Peça | Hoje no DS | Gap |
|---|---|---|
| Excel/PDF | Inline em `DataListingDemo.tsx` (32.5px) · skill cita `src/components/ExportButtons.tsx` **inexistente** · docs misturam 34×34 vs 32.5 | Extrair composite real; alinhar skill a 32.5; exportar na lib |
| KPIs | `StatsCard` (v0.8.0) **sem** `onClick`/`selected` · `DataListingKPIs` sparkline separado · KPIs **fora** do card da toolbar | Paridade Tecnopano: clicável + `ListingKpiRow` + `panelHeader` |
| Row actions | Coluna de ações genérica / sem radial · `framer-motion` só em **devDependencies** | Portar menu + CSS; **peerDep** `framer-motion` + external Vite (decidido) |

## Modo de execução

**Git + GitHub CLI disponíveis** (conta ativa típica: `Nookweb-SDE`). Cada step = branch `feat/ds-datalisting-<slug>` → PR → CI local:

```bash
npm run lint
npm run build:site   # = tsc -b && vite build (site docs) — SoT: package.json
npm run build        # = vite lib + d.ts (só nos steps que exportam lib)
```

**Não** confiar no `CLAUDE.md` antigo que diz `build = tsc -b && vite build` — isso é `build:site`. Sem `npm test` neste repo.

**Fora de escopo:** sincronizar de volta Tecnopano (consumidor já tem o código). Este plano só enriquece o DS.

**Invariantes (todo step):**

1. Não copiar CSS `--fips-*` do Tecnopano crua — mapear para tokens DS (`--color-surface`, `--color-fg`, `--color-border`, `--color-fips-*`, `--shadow-*`).
2. Não importar `teconopano3.0` como dependência; só portar código.
3. Skill `skills/design-system-fips/references/{components,patterns,source-of-truth}.md` atualiza no mesmo PR do componente (ou no step final de release se o step for só código).
4. Hex de Excel `#1D6F42` e PDF danger são **convenção de extensão** (já documentada) — exceção explícita à regra “sem hex em features”.
5. `governance/no-visual-overrides`: não passar `bg-`/`text-`/`h-` etc. via `className` em `Button`/`Input`/…; ExportButtons deve ser composite próprio (não forçar tint no `Button` sem variant).

## Grafo de dependências

```
[1 ExportButtons] ────────┐
[2 StatsCard+ListingKpi] ─┼──► [3 DataListingDemo panelHeader] ──┐
[4 CircularCommandMenu] ──┴──► [5 Row actions na demo] ──────────┼──► [6 Release skill+changelog]
```

- **Paralelo seguro:** Step 1 ∥ Step 2 ∥ Step 4 (arquivos distintos; Step 4 **não** edita `DataListingDemo.tsx`).
- **Serial:** Step 3 depois de 1+2; Step 5 depois de 3+4 (mesmo arquivo demo); Step 6 por último.
- **Model tier:** Steps 2 e 4 = **strongest** (API/a11y/motion/peerDep). Steps 1, 3, 5, 6 = default.

## Protocolo de mutação do plano

Se um step precisar split/skip/reorder: anotar em seção **Audit trail** no fim deste arquivo com data + motivo; não apagar steps — marcar `status: abandoned|split|done`.

---

## Step 1 — `ExportButtons` composite (32.5px)

**status:** pending  
**branch:** `feat/ds-export-buttons`  
**depends_on:** []  
**parallel_ok_with:** [2, 4]  
**model:** default  
**rollback:** reverter PR; demo volta aos botões inline.

### Context brief (cold-start)

O skill e `patterns.md` já descrevem `ExportButtons`, mas o arquivo **não existe**. A demo `src/docs/pages/patterns/DataListingDemo.tsx` (~L535–538) tem o visual correto (32.5×32.5, hover tint Excel/PDF). Tecnopano `ExportButton` em `DataListingToolbar.tsx` é a referência de dark-mode + `aria-label`. Extrair para composite exportável e consumir na demo.

### Tasks

1. Criar `src/components/icons/FileIcons.tsx` com `ExcelIcon` e `PdfIcon` (SVG já inline na demo — extrair, props `size`/`color`).
2. Criar `src/components/composites/ExportButtons.tsx`:
   - props: `onExcel?: () => void`, `onPdf?: () => void`, `className?` (só layout)
   - botões **nativos** (não `Button` do DS + tint via `className` — viola `governance/no-visual-overrides`)
   - tamanho **32.5×32.5**, `border-radius: 8`, hover `background: ${c}08` / `borderColor: ${c}40`
   - Excel `#1D6F42`, PDF danger (`--color-danger` / `#DC3545`)
   - dark mode via **CSS** (`dark:` / tokens), **não** sniffer JS `document.documentElement.classList` (padrão Tecnopano é legado; DS usa `useFipsTheme` / classe `.dark`)
   - `aria-label` obrigatório; tooltip opcional via `Tooltip` Radix já no repo — se usar, envolver só o par (não exigir Provider global novo se o DocLayout já tiver)
3. Exportar em `src/components/composites/index.ts` e `src/index.ts`.
4. Substituir botões inline em `DataListingDemo.tsx` por `<ExportButtons />` (único toque na demo neste step — Steps 3/5 farão o resto).
5. Corrigir skill: `components.md` e `patterns.md` — tamanho **32.5** (não 34); path real do arquivo.

### Verification

```bash
cd /dados/Projetos/Design-system-FIPS
npm run lint
npm run build:site
npm run build
# visual: npm run dev → /docs/patterns/data-listing — hover Excel verde / PDF vermelho + dark mode
```

### Exit criteria

- [ ] `ExportButtons` importável de `@fips-app/ds-fips` / `src/index.ts`
- [ ] Demo não duplica SVG/botões
- [ ] Skill sem referência a arquivo fantasma; tamanho = 32.5
- [ ] Dark mode legível sem JS theme sniff
- [ ] PR aberto contra `main`

---

## Step 2 — `StatsCard` clicável + `ListingKpiRow`

**status:** pending  
**branch:** `feat/ds-listing-kpi-row`  
**depends_on:** []  
**parallel_ok_with:** [1, 4]  
**model:** strongest  
**rollback:** reverter PR; StatsCard volta só-display.

### Context brief (cold-start)

DS `src/components/composites/StatsCard.tsx` (v0.8.0) é display-only. Tecnopano `client/src/components/domain/StatsCard.tsx` tem `onClick` / `disabled` / `selected` (+ dark color map). `ListingKpiRow` renderiza título **Indicadores rápidos** + hint + grade de `StatsCard` com toggle de foco. Portar API sem copiar tokens `--fips-*` — usar `--color-*` do DS.

### Tasks

1. Estender `StatsCardProps` com `onClick?`, `disabled?`, `selected?` (e opcional `darkColor` se dark map for necessário; preferir tokens semânticos já resolvidos pelo tema).
2. Quando `onClick`: renderizar `<button type="button">` (a11y: foco, Enter/Space nativos); `selected` → ring primary; hover borda/sombra leves (paridade Tecnopano).
3. Criar `src/components/composites/ListingKpiRow.tsx` espelhando API Tecnopano:
   - `cards: { id, label, value, subtitle, icon, color, className? }[]`
   - `focusId`, `onSelect`, `onClear`, `loading?`, `hint?`, `gridClassName?`
   - heading “Indicadores rápidos” + botão “Limpar filtro” quando `focusId`
4. Exportar tipos + componentes em `composites/index.ts` e `src/index.ts`.
5. Doc: seção em `CardDoc.tsx` (Stats clicável) **ou** bloco no `DataListingDemo` (preferir demo no Step 3; aqui pelo menos playground mínimo / CodePlayground se o padrão do repo exigir).
6. Semântica: `StatsCard` sem `onClick` continua `<div>` (não quebrar Home Suprimentos).

### Verification

```bash
npm run lint && npm run build:site && npm run build
# Manual: CardDoc ou playground — clique seleciona, segundo clique / Limpar limpa
```

### Exit criteria

- [ ] Paridade visual/API com Tecnopano ListingKpiRow (tokens DS)
- [ ] Sem regressão em usos atuais de StatsCard (CardDoc / StatsCardGrid)
- [ ] Tipos exportados
- [ ] PR aberto

---

## Step 3 — Data Listing: `panelHeader` + Indicadores na demo

**status:** pending  
**branch:** `feat/ds-datalisting-panel-header`  
**depends_on:** [1, 2]  
**parallel_ok_with:** []  
**conflicts_with_files:** `src/docs/pages/patterns/DataListingDemo.tsx` (Step 5)  
**model:** default  
**rollback:** reverter PR; demo volta layout anterior.

### Context brief (cold-start)

Em Tecnopano a toolbar é **um** card: faixa superior = `panelHeader` (KPIs) com `border-b`, faixa inferior = filtros/busca/export. DS hoje coloca KPIs sparkline **fora** desse card. Replicar anatomia: card `rounded-[10px_10px_10px_18px]` → header Indicadores → toolbar com `ExportButtons`.

### Tasks

1. Em `DataListingDemo.tsx`, reestruturar o card da toolbar:
   - topo: `<ListingKpiRow …>` com 3–4 KPIs mock clicáveis que filtram a tabela demo
   - baixo: filtros + busca + `<ExportButtons />` (Step 1)
2. Documentar em `skills/.../patterns.md` seção **panelHeader / Indicadores rápidos** (anatomia + snippet).
3. Remover ou rebaixar o bloco KPI sparkline antigo para “variante alternativa” (não apagar sem nota — evita perder o pattern sparkline).
4. Atualizar copy-paste helpers `dlCode('kpi')` se ainda existirem e estiverem desatualizados.

### Verification

```bash
npm run lint && npm run build:site
npm run dev  # /docs/patterns/data-listing
# Clique KPI → filtra; Limpar → restaura; Excel/PDF presentes à direita
```

### Exit criteria

- [ ] Anatomia visual = Tecnopano (KPIs dentro do mesmo card da toolbar)
- [ ] KPI clique filtra dados mock da demo
- [ ] patterns.md atualizado
- [ ] PR aberto

---

## Step 4 — `CircularCommandMenu` + `RowActionsMenu`

**status:** pending  
**branch:** `feat/ds-circular-command-menu`  
**depends_on:** []  
**parallel_ok_with:** [1, 2]  
**do_not_edit:** `DataListingDemo.tsx` (fica no Step 5)  
**model:** strongest  
**rollback:** reverter PR; remover peerDep se adicionado.

### Context brief (cold-start)

Menu radial Multitags→Tecnopano: portal + overlay + itens em círculo + tooltip label + teclado (setas/Enter/Esc). Fonte: `client/src/components/ui/circular-command-menu.tsx`, wrapper `domain/RowActionsMenu.tsx`, CSS glass em `globals.css`. DS usa `framer-motion` só em **devDependencies**. Para exportar na **library**: peerDep `>=11` + **obrigatório** incluir `'framer-motion'` em `vite.config.lib.ts` → `build.rollupOptions.external` (hoje só react/react-dom/jsx-runtime). Default = lib + peerDep (não docs-only).

### Tasks

1. `peerDependencies["framer-motion"] = ">=11"`; manter em `devDependencies`.
2. Em `vite.config.lib.ts`, adicionar `'framer-motion'` ao array `external`.
3. Portar para `src/components/composites/CircularCommandMenu.tsx` (não `ui/` — não é CVA primitive).
4. Portar `RowActionsMenu.tsx` thin wrapper no mesmo diretório.
5. CSS em `src/styles/globals.css`: `.cmd-glass`, `.cmd-glass-center`, `.fips-row-action` com tokens DS. Grep pós-port: zero `--fips-` nos arquivos novos.
6. Exportar tipos `CommandItem`, `RowMenuAction` + componentes em `composites/index.ts` + `src/index.ts`.
7. Doc page `CircularCommandMenuDoc.tsx` + lazy route em `App.tsx` + item em `nav.ts`.
8. A11y: `aria-expanded`, `aria-haspopup="menu"`, `role="menu"|"menuitem"`, Esc/overlay, clamp viewport.
9. README: consumidor precisa instalar `framer-motion`.

### Verification

```bash
npm run lint && npm run build:site && npm run build
# Doc page: órbita + tooltip; Esc; setas; dark glass
# framer-motion NÃO bundled: rg framer-motion dist/index.js
```

### Exit criteria

- [ ] Paridade visual com screenshot Tecnopano (centro X, órbita, tooltip)
- [ ] peerDep + external Vite + nota README
- [ ] CSS tokens DS (sem `--fips-*`)
- [ ] Doc page na sidebar
- [ ] PR aberto

---

## Step 5 — Row actions na tabela da Data Listing demo

**status:** pending  
**branch:** `feat/ds-datalisting-row-actions` (ou amendar PR do Step 3 se ainda aberto)  
**depends_on:** [3, 4]  
**conflicts_with_files:** `DataListingDemo.tsx`  
**model:** default  

### Tasks

1. Coluna Ações: `<RowActionsMenu rowId=… actions={[Editar, Ban/proibido, Excluir danger]} />` — lucide `Pencil`, `Ban`, `Trash2` (screenshot do dono).
2. `radius={56}`.
3. Portal em `document.body` — não “corrigir” com overflow hacks na tabela.

### Exit criteria

- [ ] Demo interativa com radial na linha
- [ ] Paridade com imagem anexada

---

## Step 6 — Release: changelog, versão, skill zip

**status:** pending  
**branch:** `chore/ds-v0.9.0-datalisting-parity`  
**depends_on:** [1, 2, 3, 4, 5]  
**model:** default  

### Tasks

1. Bump SemVer **minor** `0.8.0` → `0.9.0` (consolidar; evitar cascade de patches).
2. Entrada no topo de `src/docs/data/changelog.ts`.
3. `DOC_VERSION = 'v0.9.0'` em `src/app/DocLayout.tsx` + README.
4. Fechar gaps em `skills/design-system-fips/references/{components,patterns,source-of-truth}.md`.
5. `npm run build:downloads`.
6. `npm run lint && npm run build:site && npm run build` verdes.

### Verification

```bash
npm run lint && npm run build:site && npm run build && npm run build:downloads
```

### Exit criteria

- [ ] Versão coerente package / changelog / DOC_VERSION / README
- [ ] Skill zip regenerado
- [ ] PR de release mergeável

---

## Riscos e anti-padrões

| Risco | Mitigação |
|---|---|
| Copiar `--fips-*` do Tecnopano | Mapear; `rg '--fips-'` nos arquivos novos |
| `ExportButtons` via `Button` + className visual | Botões nativos — ESLint governance |
| framer-motion no bundle lib | peerDep + **external** em `vite.config.lib.ts` |
| Dois padrões KPI sem doc | Step 3 marca sparkline como variante |
| Skill paths fantasmas | Steps 1 + 6 |
| Merge em `DataListingDemo.tsx` | Steps 3 e 5 serial; Step 4 não toca a demo |
| CLAUDE.md scripts desatualizados | SoT = `package.json` |
| Sync Tecnopano | Fora de escopo |

## Parallelism summary

| Wave | Steps | Agents |
|---|---|---|
| A | 1, 2, 4 | 3 em paralelo |
| B | 3 | após A(1+2) |
| C | 5 | após B + A(4) |
| D | 6 | após C |

**Total:** 6 steps · até 3 PRs paralelos na wave A · ~5 PRs (ou 4 se 3+5 juntos).

## Review gate

**Verdict:** APPROVE_WITH_FIXES (aplicados neste arquivo).  
Subagente Opus indisponível (rate limit); review adversarial no agente principal contra `package.json`, `vite.config.lib.ts`, `StatsCard.tsx`, gaps confirmados.

## Audit trail

| Data | Evento |
|---|---|
| 2026-07-27 | Plano criado (Research→Design→Draft). |
| 2026-07-27 | Review: scripts SoT, renumerado 3b→5 / release→6, external framer-motion, dark CSS ExportButtons, anti-sync Tecnopano, conflito DataListingDemo. |
