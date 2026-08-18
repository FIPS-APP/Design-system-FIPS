---
name: ds-fips
description: DS-FIPS — use when building, reviewing, documenting, or briefing another AI about interfaces that must match the Design System FIPS, including exact tokens, components, patterns, governance rules, and code-backed references.
---

# DS-FIPS — Design System FIPS

Use this skill whenever the task involves FIPS interfaces or when another AI needs a portable package of the design rules.

Referências sincronizadas com a **v0.15.0** (2026-08-18) do repositório DS-FIPS.

## Workflow

1. Read `references/source-of-truth.md`.
2. Load only the reference file needed for the task:
   - `references/foundations.md` for colors, typography, spacing, radii, shadows, and global CSS tokens.
   - `references/components.md` for component APIs, variants, imports, and reusable snippets.
   - `references/patterns.md` for screen composition, application shell, hero/header, data listing, modal workflow, and governance.
3. Reuse existing tokens and components before creating anything new.
4. If the requested UI diverges from the system, evolve the design system first and only then consume the new variant.

## Non-negotiables

- Brand identity source of truth is `docs/Brandbook PPT.pdf`. If the PDF is unavailable, follow the exact token tables and snippets in the reference files.
- Headings use `Saira Expanded`. Body copy uses `Open Sans`.
- Product UI stays inside the FIPS palette: deep institutional blue for structure, gold/orange for accents, restrained neutrals for surfaces and borders.
- Use `PageHero` for module headers and `Field` plus `Input`/`Select`/`Textarea` for forms.
- **Modal é componente, não montagem.** Use `<Modal>`/`<ModalFooter>` da library (`@fips-app/ds-fips`) com `headerIcon` — nunca remonte a casca com `Dialog*` cru, e nunca entregue um modal sem ícone. Campo dentro de modal é sempre `Field` + primitive, nunca `<label>` + `<input>`. Checklist abaixo.
- Do not create one-off local overrides for radius, shadow, border, spacing, or color just to satisfy one screen.
- **`className` on governed primitives is for external layout only.** The ESLint rule `governance/no-visual-overrides` (`eslint.config.js`) blocks visual Tailwind classes (`bg-`, `text-`, `border`, `rounded`, `shadow`, `h-`/`min-h-`, `p-`/`px-`, `font-`, `leading-`, `tracking-`, `ring-`, `opacity-`) passed to `Button`, `Input`, `Select`, `Textarea`, `TabsList`, `TabsTrigger` anywhere outside `src/components/ui/**`. To change appearance, add a variant in the matching `*-variants.ts` (CVA) — never ad-hoc classes in JSX.
- `--color-primary` and the other accent tokens are **identical in light and dark**. Any accent usage needs the manual dark pair, written **with a token**: `dark:border-[var(--color-fips-blue-400)]`, never `dark:border-[#93BDE4]` — hex cru é erro de lint (`governance/no-raw-color`). Ver `references/foundations.md`.

## Building a modal? Use this checklist

Depois da tabela, o modal é o que mais sai fora do padrão — e sempre pelos mesmos
dois motivos: **sem ícone no header** e **campo montado na mão**. A página
`/docs/components/dialog` documenta a *aparência*; os exemplos dela são mockups
locais (inline style, `<label>`+`<input>`) feitos para o playground — **não copie
a marcação dela**. O que se copia é a API abaixo. Spec completa em
`references/components.md` → **Dialog/Modal**.

```tsx
import { Modal, ModalFooter, Field, FieldLabel, FieldMessage, Input, Button } from '@fips-app/ds-fips'
import { ClipboardEdit } from 'lucide-react'

<Modal
  open={open}
  onOpenChange={setOpen}
  hero                          // faixa institucional (gov gradient + eyebrow âmbar)
  headerIcon={ClipboardEdit}    // OBRIGATÓRIO na prática — ver checklist
  eyebrow="Requisição"          // opcional; não repete palavra do título
  title="Nova requisição"
  description="Preencha os dados para abrir a solicitação."
  size="lg"
>
  <Field density="compact">
    <FieldLabel required>Solicitante</FieldLabel>
    <Input density="compact" placeholder="Nome completo" />
    <FieldMessage tone="danger">Campo obrigatório</FieldMessage>
  </Field>

  <ModalFooter hint="Você poderá editar depois.">
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
    <Button variant="primary">Salvar</Button>
  </ModalFooter>
</Modal>
```

- [ ] `<Modal>` da library — **não** remontar a casca com `Dialog`/`DialogContent`/`DialogHeader` na mão (esses são low-level, para quem está construindo um composite novo)
- [ ] **`headerIcon` sempre.** A prop é opcional no tipo, mas modal sem ícone está fora do padrão. Se você não sabe qual ícone usar, o título está vago demais — resolva o título primeiro. Ícone vem do `lucide-react`, passado como componente (`headerIcon={Truck}`), não como JSX
- [ ] `hero` para modal institucional/de fluxo (faixa gov + eyebrow); header simples só para confirmação curta
- [ ] `eyebrow` **não repete palavra do título** ("Atribuição" + "Atribuir responsável" = redundante; remova o eyebrow)
- [ ] Campo = `Field` + `FieldLabel` + `Input`/`Select`/`Textarea` + `FieldMessage`. **Nunca** `<label>` + `<input>` cru, nunca `<div>` com borda simulando campo
- [ ] Dentro de modal a densidade é **`compact`** — no `Field` *e* no controle (`<Field density="compact">` + `<Input density="compact">`); as duas props existem e as duas precisam ser passadas
- [ ] Rodapé = `<ModalFooter>` (ele já traz borda, fundo e alinhamento). Ordem: `Cancelar` (`variant="secondary"`) à esquerda do CTA; CTA é `primary`, ou `danger` quando a ação destrói dado
- [ ] Tamanho pela prop `size` (`sm` `md` `lg` `xl` `2xl` `3xl` `full` `workflow`) — nunca `className="max-w-…"` por fora
- [ ] Texto de apoio no rodapé vai em `hint` do `ModalFooter`, não como parágrafo solto acima dos botões
- [ ] Fecha com `Esc`, clique no overlay e botão X — o `<Modal>` já entrega os três; não reimplemente

## Building a table? Use this checklist

A tabela é o padrão que mais sai errado ao ser portado, porque quase sempre é
implementada **pela metade**. Antes de dar por pronta, confira item a item —
a spec completa está em `references/patterns.md` → **Tabela canônica**.

- [ ] Card com header: ícone 48 + título + subtítulo, `borderBottom` 1px
- [ ] Header à direita, nesta ordem: segmented **Tabela | Cards** → **Configurar**
- [ ] Chips de filtro ativo colados no título (um por VALOR, não contagem)
- [ ] `th` **centralizado** (não segue `col.align`); `td` respeita `align` — é o default de `TableHead` e é barrado no lint se a tela tentar `text-left`
- [ ] Densidade como **altura de linha fixa** (`rowH` 30/42/56), não padding vertical
- [ ] Zebra com `#D3E3F4` a 25% (a 5% fica invisível e parece não-zebrada)
- [ ] Coluna **Ações** = `RowActionsMenu` (menu radial), nunca par olho/lápis
- [ ] Configurar com **4 abas**: Colunas · Densidade · Ordenação · Aparência (popover 340px)
- [ ] Os **4 estados**: loading (skeleton na mesma `rowH`), vazio, erro (com "Tentar novamente"), selecionado
- [ ] Footer: totais à esquerda · `Linhas:` + `‹ 1 2 3 ›` à direita
- [ ] "Mostrando X–Y de Z" **só** no footer — nunca duplicado no header

## Fast repo lookups

Use these searches when the repository is available:

- `rg -n "PAGE_HERO_DEFAULT_DECORATION|PageHero" src`
- `rg -n "buttonVariants|badgeVariants" src/components/ui`
- `rg -n -- "--color-primary|--color-accent|--shadow-card|--font-heading" src/tokens/theme.ts` (fonte da verdade; o CSS é gerado dela)
- `rg -n "DocPage|PatternGuidelines" src/docs`
- `rg -n "ExportButtons|ExcelIcon|PdfIcon" src` (toolbar de listagem: par Excel/PDF)
- `rg -n "DENSITY|rowH" src/docs/pages/patterns/DataListingDemo.tsx` (cadência canônica de linha da tabela)
- `rg -n "function DSTable" -A 40 src/docs/pages/components/TableDoc.tsx` (implementação completa da tabela: props, estados, Configurar, vista Cards)
- `rg -n "configTab===" src/docs/pages/components/TableDoc.tsx` (as 4 abas do Configurar, incluindo Ordenação)
- `rg -n "RowActionsMenu" src/docs/pages` (coluna Ações — os 2 únicos usos corretos)
- `rg -n "version: '" src/docs/data/changelog.ts | head` (versão atual + histórico; o topo do array é a mais recente)
- `rg -n "no-visual-overrides" -A 12 eslint.config.js` (regra de governança que roda no lint)
- `rg -n "no-raw-color" -A 12 eslint.config.js` (segunda regra: cor crua é **erro** em `src/components/{ui,composites,brand,icons}` e `src/composites`, warn no resto)

If the repository is not available, treat the portable references bundled with this skill as the source of truth until the codebase is synced.
