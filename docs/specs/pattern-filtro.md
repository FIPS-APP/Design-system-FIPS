# Spec — Padrão Filtro (DS-FIPS)

Referência de produto: pipeline de `HistoricoDashboard.tsx` + composites `ListingFilterToolbar`, `FilterDrawer`, `ActiveFilterChips`.

## 1. Três ordens (não misturar)

| Conceito | Ordem | Onde documentar |
|----------|--------|-----------------|
| **A. Slots da toolbar (UI)** | Filtros → Alçada → Busca → Período → Export | Filtro §02 |
| **B. Pipeline de recorte (código)** | Período → Busca → Alçada → Drawer | Filtro §08 |
| **C. Layout do painel (página)** | Header → KPIs → Toolbar → Table (± gráficos) | Data Listing §06 |

Erro comum (feedback Diogo): colocar **KPIs / Gráficos / Tabela** dentro do pipeline **B** — eles **não** filtram em série; consomem o mesmo dataset já recortado.

## 2. Pipeline B — detalhe (obrigatório)

1. **Período** — define a base (`useOpaDashboard(periodDays)` ou equivalente). Não é dimensão do drawer.
2. **Busca textual** — restringe campos indexados sobre a base do período (`rowsComBusca`).
3. **Alçada** — recorte de universo (Minha Área vs Toda jurisdição) sobre `rowsComBusca`; **não** entra no drawer.
4. **Drawer** — dimensões pill/chip (`applyFilters` / `useOpaFilters`) sobre o resultado da alçada → **`filtered`**.

### Contadores da alçada

Calcular sobre **período + busca + drawer**, **sem** aplicar o recorte minha/todos. Cada segmento mostra quantos registros existiriam ao escolhê-lo (`contagens` no Histórico).

### Gráficos (dashboard)

- KPIs e tabela: dataset **`filtered`** (todos os filtros ativos).
- Gráficos: **`facet(dim)`** — mesma base da alçada + drawer, mas exclui a dimensão do próprio gráfico para cross-filter. Camada **opcional**, documentada no padrão Dashboard — **não** é passo 5 do pipeline B.

## 3. Toolbar (A)

- Card próprio: `padding 14×18`, `gap 10`, `borderRadius 10px 10px 10px 18px`.
- Export só ícones 34×34 à direita; desabilitar se `resultCount === 0`.
- Período: listbox na toolbar, nunca no drawer.

## 4. Drawer

- `side="left"`, 400px, hero + miolo rolável + rodapé.
- Single-select por dimensão na listagem padrão.
- `emptyDescription` padrão quando zero filtros ativos.

## 5. Chips ativos

- Um chip por **valor** no header da tabela; `MAX_FILTER_CHIPS` + «+N» + «Limpar».

## 6. Doc site (`FiltroDemo.tsx`)

- Hero navy + JunctionLines (igual Login / Data Listing).
- Corpo `maxWidth: 1200`, seções 01–10.
- §08: **dois** blocos visuais — pipeline B + consumidores paralelos + nota toolbar A.

## 7. Entregas relacionadas (feed do dia)

| Item | Status esperado |
|------|-----------------|
| Anexo 1 LocationPinButtons | Select `#location-pin-buttons` + Form Workspace |
| Anexo 2 PhotoEvidenceDropzone | Input `#photo-evidence-dropzone` + Form Workspace |
| Nav `/docs/patterns/filtro` | nav.ts + lazy route |
| Composites exportados | `index.ts` |
| Visual doc Filtro = Data Listing/Hero | PatternSection, SpecCard, header full-width |
| §08 fluxo | Pipeline B corrigido (esta spec) |
| Tutorial contextual `filtro` | pageTutorials alinhado às seções |
