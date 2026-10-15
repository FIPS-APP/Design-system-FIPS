# Linear — Design System FIPS (24/09/2026)

**Título sugerido:** DS-FIPS v0.14.0 — Padrão Filtro + anexos Registro + paridade OPA

**Projeto:** Design System FIPS (`FIPS-APP/Design-system-FIPS`)

## Resumo

Entrega do dia: documentação e composites de **filtro de listagem** (toolbar + drawer + chips), **anexos 1 e 2** do formulário de registro (pin de cidade + upload de fotos) com paridade visual/markup ao produto, correção do **fluxo de dados** na doc após review (Diogo), e release **v0.14.0**.

## Entregas

### Padrão Filtro (`/docs/patterns/filtro`)

- Nav sidebar + rota lazy `FiltroDemo`
- Composites: `ListingFilterToolbar`, `FilterDrawer`, `PillFilter`, `PillGroup`
- Doc: 10 seções, hero navy, tokens, anti-patterns
- Spec: `docs/specs/pattern-filtro.md`
- **Fix fluxo §08:** pipeline Período → Busca → Alçada → Drawer; KPIs/tabela/gráficos consomem `filtered` em paralelo (não são passos 5–6 do pipeline)

### Anexos Registro (sem mencionar OPA na copy pública)

| Anexo | Componente | Doc |
|-------|------------|-----|
| 1 | `LocationPinButtons` | Select `#location-pin-buttons`, Form Workspace |
| 2 | `PhotoEvidenceDropzone` | Input `#photo-evidence-dropzone` §10, Form Workspace card 4 |

### Paridade OPA (fotos)

- `PhotoEvidenceDropzone`: markup alinhado a `RegistroPage`
- `Alert` + `Lightbox` no pacote; lightbox padrão na doc
- `FormSectionCard` / `FormSectionHeader` = SectionCard OPA

### Outros

- Data Listing: regra toolbar com Alçada
- `pageTutorials.filtro` atualizado
- Versão doc `v0.14.0`, changelog

## Verificação

- `npm run build` (lib)
- Smoke: `/docs/patterns/filtro`, `/docs/components/input#photo-evidence-dropzone`

## Commit

Branch `main` — push pós-commit desta entrega.
