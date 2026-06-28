---
name: design-system-fips
description: Use when building, reviewing, documenting, or briefing another AI about interfaces that must match the Design System FIPS, including exact tokens, components, patterns, governance rules, and code-backed references.
---

# Design System FIPS

Use this skill whenever the task involves FIPS interfaces or when another AI needs a portable package of the design rules.

## Workflow

1. Read `references/source-of-truth.md`.
2. Load only the reference file needed for the task:
   - `references/foundations.md` for colors, typography, spacing, radii, shadows, and global CSS tokens.
   - `references/components.md` for component APIs, variants, imports, and reusable snippets.
   - `references/patterns.md` for screen composition, application shell, hero/header, data listing, modal workflow, and governance.
   - `references/charts.md` for the chart system: **recharts for every chart + cross-filter (faceta) on every chart**, plus the shared DS-FIPS tooltip. Load whenever the task involves any graph, dashboard, or KPI visualization.
3. Reuse existing tokens and components before creating anything new.
4. If the requested UI diverges from the system, evolve the design system first and only then consume the new variant.

## Non-negotiables

- Brand identity source of truth is `docs/Brandbook PPT.pdf`. If the PDF is unavailable, follow the exact token tables and snippets in the reference files.
- Headings use `Saira Expanded`. Body copy uses `Open Sans`.
- Product UI stays inside the FIPS palette: deep institutional blue for structure, gold/orange for accents, restrained neutrals for surfaces and borders.
- Use `PageHero` for module headers and `Field` plus `Input`/`Select`/`Textarea` for forms.
- **Every chart uses `recharts`, is cross-filter, has a data tooltip, AND carries an explanatory ℹ** — four requirements, no exceptions: (1) recharts, no hand-rolled SVG; (2) clicking an element toggles a filter (each chart facets out its own dimension) — exception: static print/report charts (e.g. a board PDF) skip cross-filter but keep the other three; (3) hovering a bar/slice shows the DS-FIPS `TooltipBox` with a breakdown whose lines sum to the total ("+ N outros" when truncated) — inventory charts break down by BI name (count, 1 each), usage charts by accesses; (4) an `ℹ` (lucide `Info`) next to the chart title opens a one-sentence tooltip stating WHAT THE CHART ANALYZES, so an executive grasps it at a glance. Chart colors via `var(--color-*)`, never `hsl(var(--chart-*))`. See `references/charts.md`.
- Do not create one-off local overrides for radius, shadow, border, spacing, or color just to satisfy one screen.

## Fast repo lookups

Use these searches when the repository is available:

- `rg -n "PAGE_HERO_DEFAULT_DECORATION|PageHero" src`
- `rg -n "buttonVariants|badgeVariants" src/components/ui`
- `rg -n -- "--color-primary|--color-accent|--shadow-card|--font-heading" src/styles/globals.css`
- `rg -n "DocPage|PatternGuidelines" src/docs`
- `rg -n "ExportButtons|ExcelIcon|PdfIcon" src` (toolbar de listagem: par Excel/PDF)

If the repository is not available, treat the portable references bundled with this skill as the source of truth until the codebase is synced.
