# Charts (gráficos) — padrão DS-FIPS

Regra de ouro (não-negociável):

1. **Todo gráfico usa `recharts`.** Não desenhar SVG à mão (`<rect>`/`<circle>`/`<polyline>`), não usar outra lib de chart. Exceção: listas/rankings horizontais simples podem ser HTML+CSS (barra com `width: %`) — mas seguem as mesmas regras de cross-filter e tooltip.
2. **Todo gráfico é cross-filter.** Clicar num elemento (fatia, barra, linha do ranking) **alterna** um filtro; os **demais** charts e cards re-escopam. Clicar de novo desliga. _Exceção:_ charts de **relatório estático / impressão** (ex.: PDF pra diretoria) pulam o cross-filter, mas mantêm recharts + tooltip de dados + ℹ explicativo.
3. **Cores só por token** `var(--color-*)`. Nunca `hsl(var(--chart-*))` nem hex solto. Cards de chart com raio assimétrico `rounded-[10px_10px_10px_18px]`, títulos `font-heading` (Saira Expanded).
4. **Todo gráfico tem tooltip de breakdown.** No hover, o `TooltipBox` mostra o total + a quebra detalhada (top ~6, mini-barras, sem bolinha; **"+ N outros"** agrega o resto pra a soma fechar). Nada de tooltip com só um número. **As linhas sempre somam o total do header.**
   - **Charts de uso** (acessos): quebram por **BI/usuário, ponderado pelo nº de acessos** (header = total de acessos).
   - **Charts de inventário** (composição/contagem): quebram nos **BIs do grupo, cada BI contando 1** (header = nº de BIs; linhas somam o total), em ordem **alfabética**. ⚠️ **Inventário conta BIs, não acessos** — não ordenar/valorar por acesso aqui.
5. **Todo gráfico tem um ℹ explicativo no título.** Um botão `ℹ` (lucide `Info`, `h-3.5 w-3.5`) ao lado do título abre, no hover, um tooltip de **uma frase** dizendo *o que o gráfico analisa* — pro diretor bater o olho e entender sem interpretar o eixo. Use `Tooltip`/`TooltipTrigger`/`TooltipContent` de `@/components/ui/tooltip` (Radix; exige um `TooltipProvider` ancestral). É **diferente** do tooltip de dados (regra 4): o ℹ é didático e fica no **título**; o de dados é sobre os **valores**, no hover do elemento. Implementação de referência: prop `info` em `ChartCard` (em `CompliancePage.tsx` e `KpiDashboardPage.tsx`).

Implementação de referência (port fiel, copiar daqui): `Governanca_BI/src/pages/KpiDashboardPage.tsx` — componentes `VBars` (BarChart), `DistDonut` (PieChart), `BarList`, `Ranking`, `TooltipBox`/`ChartTooltip`/`RechartsTip`, e o helper `withBiRows` (anexa o breakdown a cada `Dim`).

## Setup

`npm i recharts` (compatível com React 18). Importar componentes individualmente:

```ts
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis, LabelList } from "recharts";
```

> Ao adicionar `recharts` num projeto Vite já rodando, o 1º load re-otimiza a dependência e o console pode cuspir erros transitórios do chart — somem após o reload. É esperado, não é bug.

## Mapa: tipo de gráfico → componente recharts

| Visual | recharts | Notas DS-FIPS |
|---|---|---|
| Barras verticais (séries no tempo) | `BarChart` + `Bar` + `Cell` | gridlines `CartesianGrid vertical={false}`; `YAxis hide`; média via `ReferenceLine`; rótulos via `LabelList`; cor por `Cell fill` (token) com opacidade proporcional ao valor |
| Linha / sparkline | `AreaChart` + `Area` | gradiente via `<defs><linearGradient>`; `dot={false}`, `activeDot`; `isAnimationActive={false}` |
| Donut / pizza | `PieChart` + `Pie` + `Cell` | `innerRadius`/`outerRadius` (anel ~14px); `startAngle={90} endAngle={-270}`; rótulo central = **overlay HTML absoluto** (não `<Label>`); legenda HTML clicável abaixo |
| Ranking / distribuição (barras horizontais) | HTML+CSS (`width: %`) **ou** `BarChart layout="vertical"` | mais leves em HTML; manter cross-filter + tooltip |

`ResponsiveContainer` envolve o chart com `width:100%` e altura fixa no wrapper (`<div style={{ width:"100%", height }}>`).

## Cross-filter (faceta) — o coração do padrão

Cada dimensão filtrável tem um predicado; o conjunto é filtrado por **todos** os filtros ativos, **exceto** (opcionalmente) o do próprio chart — assim cada chart continua navegável e reflete a seleção dos **outros**.

```ts
// 1 predicado por dimensão
const MATCHERS = { criticality: (b,v)=>b.criticality===v, areaId:(b,v)=>b.areaIds.includes(v), /* … */ };
const KEYS = Object.keys(EMPTY_FILTERS);
// casa com todos os filtros ativos, menos `except` (faceta do chart)
const matchesExcept = (item, filters, except) =>
  KEYS.every((k) => k === except || !filters[k] || MATCHERS[k](item, filters[k]));

// no chart de Criticidade: dados = computeInventory(items.filter(b => matchesExcept(b, filters, "criticality")))
// passa activeKey={filters.criticality} e onPick={(v) => toggle("criticality", v)}
```

Regras:

- **Toggle**: `setFilters(f => ({ ...f, [k]: f[k] === v ? "" : v }))`. Clicar no item ativo limpa.
- **Destaque**: item selecionado realçado (cor/opacidade 1); os demais esmaecidos (`opacity .2–.4`).
- **Dois níveis** (quando há acessos/eventos além de atributos):
  - filtros de **atributo** (criticidade, nível, área, status…) escopam **tudo** (composição + uso);
  - filtros de **evento** (dia, dia-da-semana, BI clicado num ranking de acessos) escopam **só a seção de uso** (cards + charts de acesso). Hierarquia mão-única: atributo → uso.
- **recharts: use `onClick` no elemento, não no chart.** `<Bar onClick={(d)=>onPick(d.key)}>`, `<Pie onClick={(_,i)=>onPick(seg[i].key)}>`. O `onClick` no nível do `BarChart` depende do `activePayload` do hover e falha em clique direto.
- Contador de filtros ativos no botão "Filtros" + "Limpar tudo" zera todos (atributo + evento).

## Tooltip DS-FIPS (um visual só)

Caixa única `TooltipBox` (header colorido pelo accent + total + breakdown opcional com mini-barras), reusada por:

- **`ChartTooltip`** — wrapper `position: fixed` que segue o mouse (charts em HTML: ranking, distribuição, cards).
- **`RechartsTip`** — `content` do `<Tooltip>` do recharts (charts SVG); o recharts posiciona.

```tsx
<Tooltip content={<RechartsTip unit="acessos" color="var(--color-primary)" />} cursor={{ fill: "var(--color-surface-muted)", opacity:.45 }} />
```

Caixa: `rounded-[8px_8px_8px_14px] border-border bg-card`, header `background: <accent>` com texto branco, linhas com label + mini-barra + valor mono (sem bolinha). **Breakdown é padrão** (regra 4): cada item carrega `rows` e o `TooltipBox` as renderiza; use `rollup(rows, cap)` p/ truncar com "+ N outros" (as linhas sempre fecham o total). No **inventário**, `withBiRows(segments, dim)` lista os BIs do grupo com **valor 1** (contagem, alfabético — nunca por acessos); em charts de **uso**, agregue os eventos por BI/usuário/dia (ponderado por acessos).

## Gotchas recharts

- **Donut**: `preserveAspectRatio` não se aplica (o recharts gerencia o viewBox); o rótulo central multi-linha é um `<div absolute inset-0>` por cima do `<PieChart>`.
- **Linha/área sem caixa de tooltip**: para mostrar só o `activeDot` no hover (sem balão), use `<Tooltip content={() => null} cursor={false} />`.
- **`LabelList` formatter** tipado: `formatter={(v: number | string) => Number(v) > 0 ? nf.format(Number(v)) : ""}`.
- **Bundle**: recharts (+ d3 interno) adiciona ~100KB gzip. É o trade-off aceito para padronizar e ganhar cross-filter/tooltip consistentes.

## Checklist ao criar/revisar um chart

- [ ] É recharts (ou HTML+CSS para ranking simples) — sem SVG à mão.
- [ ] Tem cross-filter: `activeKey`/`onPick`, toggle, faceta (ignora o próprio filtro).
- [ ] Item ativo destacado, demais esmaecidos.
- [ ] Tooltip = `TooltipBox` (ChartTooltip ou RechartsTip), header no accent.
- [ ] Tooltip tem **breakdown** "BIs do grupo por nome" (rows, top ~6 por acessos) — não só um número.
- [ ] Cores `var(--color-*)`, card `rounded-[10px_10px_10px_18px]`, título `font-heading`.
- [ ] `onClick` no elemento (Bar/Pie/linha), não no chart.
