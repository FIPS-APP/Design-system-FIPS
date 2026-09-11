---
name: design-system-fips
description: Use when building, reviewing, documenting, or briefing another AI about interfaces that must match the Design System FIPS, including exact tokens, components, patterns, governance rules, and code-backed references.
---

# Design System FIPS

Use this skill whenever the task involves FIPS interfaces or when another AI needs a portable package of the design rules.

Referências sincronizadas com a **v0.11.33** (2026-08-11) do repositório DS-FIPS.

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
- Do not create one-off local overrides for radius, shadow, border, spacing, or color just to satisfy one screen.
- **Modal é componente, não montagem.** Use `<Modal>`/`<ModalFooter>` de `src/components/ui/Modal.tsx` (`@fips-app/ds-fips`) — nunca remonte a casca (`Dialog`/`DialogContent`/header/close/radius) na mão. Ver checklist abaixo. Hoje a própria doc do DS (`DialogDoc.tsx`) e alguns componentes reais (`ChangelogModal`, `ExportPreviewModal`, `BuscarPessoaModal`) não seguem essa regra — são dívida conhecida, não exemplo a copiar.
- **`className` on governed primitives is for external layout only.** The ESLint rule `governance/no-visual-overrides` (`eslint.config.js`) blocks visual Tailwind classes (`bg-`, `text-`, `border`, `rounded`, `shadow`, `h-`/`min-h-`, `p-`/`px-`, `font-`, `leading-`, `tracking-`, `ring-`, `opacity-`) passed to `Button`, `Input`, `Select`, `Textarea`, `TabsList`, `TabsTrigger` anywhere outside `src/components/ui/**`. To change appearance, add a variant in the matching `*-variants.ts` (CVA) — never ad-hoc classes in JSX.
- `--color-primary` and the other accent tokens are **identical in light and dark**. Any accent usage needs the manual `dark:…-[#93BDE4]` pair — see `references/foundations.md`.

## Building a modal? Use this checklist

Spec completa (props, anatomia hero vs. não-hero, gaps conhecidos) em `references/components.md` → **Dialog/Modal — componente governado**.

```tsx
import { Modal, ModalFooter, Field, FieldLabel, Input, Button } from '@fips-app/ds-fips'
import { UserRound } from 'lucide-react'

<Modal open={open} onOpenChange={setOpen} hero headerIcon={UserRound}
  eyebrow="Requisição" title="Atribuir responsável"
  description="Selecione o colaborador e tipo de atribuição." size="lg">
  <Field density="compact">
    <FieldLabel required>Responsável</FieldLabel>
    <Input density="compact" placeholder="Nome do colaborador" />
  </Field>
  <ModalFooter hint="Você poderá editar depois.">
    <Button variant="secondary" onClick={() => setOpen(false)}>Cancelar</Button>
    <Button variant="success">Salvar atribuição</Button>
  </ModalFooter>
</Modal>
```

- [ ] `<Modal>`/`<ModalFooter>` da library — nunca `Dialog`/`DialogContent`/header/close/radius remontados na mão
- [ ] `onOpenChange`, não `onClose` — a prop real é essa, apesar de exemplos antigos (e da própria `DialogDoc.tsx`) usarem `onClose`
- [ ] `headerIcon={Componente}` (referência ao componente lucide, não `<Componente/>` nem string)
- [ ] `hero` para modal institucional/de fluxo (faixa gov + eyebrow); sem `hero` só para diálogo simples com header branco
- [ ] `eyebrow` só faz efeito com `hero`, e nunca repete palavra do título
- [ ] Tamanho pela prop `size` (`sm md lg xl 2xl 3xl full workflow`) — nunca `className="max-w-*"`
- [ ] Campo dentro de modal = `Field density="compact"` + `Input`/`Select`/`Textarea` `density="compact"` — as duas props existem e as duas precisam ser passadas
- [ ] Rodapé = `<ModalFooter>` como filho de `<Modal>` (pode estar em qualquer posição entre os filhos — é extraído automaticamente), texto de apoio no `hint`, nunca parágrafo solto
- [ ] **Não invente `tone`/faixa sólida colorida** — essa prop não existe hoje no componente real; se o caso de uso precisar, evolua `Modal.tsx` primeiro (não remonte a casca no consumidor pra simular)
- [ ] Fecha com `Esc`, clique no overlay e botão X — vem de graça do `Dialog` primitive por baixo

## Fast repo lookups

Use these searches when the repository is available:

- `rg -n "PAGE_HERO_DEFAULT_DECORATION|PageHero" src`
- `rg -n "buttonVariants|badgeVariants" src/components/ui`
- `rg -n -- "--color-primary|--color-accent|--shadow-card|--font-heading" src/styles/globals.css`
- `rg -n "DocPage|PatternGuidelines" src/docs`
- `rg -n "ExportButtons|ExcelIcon|PdfIcon" src` (toolbar de listagem: par Excel/PDF)
- `rg -n "DENSITY|rowH" src/docs/pages/patterns/DataListingDemo.tsx` (cadência canônica de linha da tabela)
- `rg -n "version: '" src/docs/data/changelog.ts | head` (versão atual + histórico; o topo do array é a mais recente)
- `rg -n "no-visual-overrides" -A 12 eslint.config.js` (regra de governança que roda no lint)
- `cat src/components/ui/Modal.tsx` (componente real do Modal — props exatas, não a reimplementação local de `DialogDoc.tsx`)

If the repository is not available, treat the portable references bundled with this skill as the source of truth until the codebase is synced.
