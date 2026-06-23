# Patterns

## Application Shell

Fontes:

- `src/docs/pages/patterns/ApplicationShellDemo.tsx`
- Header canónico do shell de documentação: `src/components/layout/DocHeaderStandard.tsx` (`DocHeaderHeroBackground`, `DocHeaderStandardPreview`), `DocHeaderNeuIconButton.tsx`, `src/lib/docHeaderChrome.ts`; `src/app/DocLayout.tsx` consome estes módulos.
- **Tecnopano 3.0** (raiz Vite `client/`): demo isolada `tecnopano/ApplicationShellDemo.tsx` (rota `/shell-demo`), app real `src/components/layout/Header.tsx` — mesma pilha de classes e componentes espelhados.
- `public/guias/guia-design-system-fips.md`

Regras:

- Sidebar institucional escura
- Hierarquia clara entre menu, hero e conteúdo
- Tabs horizontais no desktop
- Menu sobreposto no mobile
- Conteúdo principal em superfície clara com scroll interno

Não faça:

- lateral neutra ou preta sem relação com o azul FIPS
- tabs genéricas destacadas por cor aleatória
- headers sem contraste ou sem separação visual entre navegação e conteúdo

## Dashboard

Fonte: `src/docs/pages/patterns/DashboardDemo.tsx`

Regras:

- cards KPI com borda lateral ou acento cromático controlado
- títulos fortes e métricas legíveis
- hero com contexto do módulo
- ações primárias agrupadas no topo

## Data Listing

Fonte: `src/docs/pages/patterns/DataListingDemo.tsx`
Implementação de referência (port fiel): `src/pages/CatalogPage.tsx` + `src/components/ExportButtons.tsx` (Governança BI).

Regras:

- barra de busca e filtros acima da tabela
- KPIs resumidos antes da listagem
- tabela dentro de card
- detalhes da linha em painel lateral ou modal, não em navegação improvisada

### Toolbar canônica

Uma única faixa-card (`rounded-[10px_10px_10px_18px] border border-border bg-card shadow-[var(--shadow-card)]`, padding `p-3 sm:p-4`), em coluna no mobile e linha no `sm+`. Três zonas, nesta ordem:

1. **Filtros** (esquerda, `shrink-0`) — `Button variant="outline" size="sm"` que abre um popover `absolute` com os `Select density="compact"`. Com filtro ativo, o botão ganha `border-primary text-primary` + badge-contador (`rounded-full bg-primary text-primary-foreground`). Fecha em clique-fora.
2. **Busca** (centro, `flex-1`) — `Input density="compact"` com `leftIcon={<Search />}`.
3. **Exportar** (direita, `shrink-0`) — `ExportButtons` (par Excel + PDF). O `Limpar` (`Button variant="ghost" size="sm"` com `<X />`) entra à esquerda do par só quando há filtro/busca ativos.

Snippet:

```tsx
<div className="flex flex-col gap-3 rounded-[10px_10px_10px_18px] border border-border bg-card p-3 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:p-4">
  <FiltersPopover /> {/* Button outline + popover absolute com Selects compact */}
  <div className="flex-1">
    <Input density="compact" leftIcon={<Search />} placeholder="Buscar…" />
  </div>
  {hasFilters && (
    <Button variant="ghost" size="sm" onClick={clear}><X />Limpar</Button>
  )}
  <ExportButtons onExcel={exportXlsx} onPdf={exportPdf} />
</div>
```

### Cuidado — clipping do dropdown do Select

O `Select` do DS abre a lista como `absolute top-full` (**sem portal**). Qualquer ancestral com `overflow-hidden`/`overflow-auto` (popover de filtros, `PageHero`/`PageHeader`, card de cantos arredondados) **corta a lista "pra dentro"** — bug já visto em 3 telas (Minha Área, Catálogo, Conformidade).

- não envolva um `Select` em container `overflow-hidden`
- o popover de filtros usa `z-50` e **não** `overflow-hidden` (os cantos arredondados sobrevivem: nenhum filho preenche o canto)
- se o `Select` precisa morar dentro do `PageHero`/`PageHeader` (que é `overflow-hidden` pelo gradiente), mova-o para uma toolbar-card abaixo do hero
- nunca corrija no `Select` do DS (é sincronizado) — corrija no consumidor

Não faça:

- filtros como tabs planas coloridas soltas
- export como botão genérico de texto em vez do par de ícones Excel/PDF
- faixa-stripe lateral colorida em cards (padrão proibido)

## Form Workspace

Fonte: `src/docs/pages/patterns/FormWorkspaceDemo.tsx`

Regras:

- duas colunas no desktop quando o volume de dados justificar
- ações de salvar e cancelar agrupadas com clareza
- áreas de apoio, checklist ou anexo em cards laterais ou blocos inferiores
- campos obrigatórios sempre visíveis

## Modal Workflow

Fonte: `src/docs/pages/patterns/ModalWorkflowDemo.tsx`

Regras:

- usar `compact` em filtros e formulários densos
- títulos claros, resumo curto e CTA inequívoco
- overlays com `--shadow-elevated`
- não transformar fluxo longo em modal único se a tarefa exigir navegação complexa

## Hero

Fontes:

- `src/docs/pages/patterns/HeroHeaderDoc.tsx` (página **Hero** na doc; rota `/docs/patterns/hero`)
- `src/composites/PageHero.tsx`

Regras:

- módulos de produto usam `PageHero`
- home pode usar hero mais editorial
- manter trilhos/trem como textura secundária, nunca como ruído dominante

## Governança

Fonte: `src/docs/pages/GovernancePage.tsx`

Regra de ouro:

- se a tela e o design system divergem, evolua o design system primeiro

Checklist rápido:

- nenhuma tela muda borda, raio, sombra ou cor via CSS local
- nenhum componente novo nasce fora do design system
- formulários usam composição oficial
- cores e fontes vêm dos tokens oficiais
- espaçamento segue a escala de 4px
