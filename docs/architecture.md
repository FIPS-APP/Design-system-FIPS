# Arquitetura — Design System FIPS

> Winston · BMAD Phase: Architect · 2026-06-15  
> Baseado em: `docs/brief.md` · `CLAUDE.md` · inspeção direta de `src/` (v0.4.3)

---

## Stack atual

| Camada | Tecnologia | Versão |
|---|---|---|
| Runtime UI | React + React DOM | 19.2.4 |
| Build | Vite + @vitejs/plugin-react | 8.0.1 / 6.0.1 |
| Estilo | Tailwind CSS v4 (config-less, via `@theme`) | 4.2.2 |
| Tipagem | TypeScript | 5.9.3 |
| Roteamento (docs) | React Router DOM | 7.13.2 |
| Primitives headless | Radix UI (dialog, slot, tabs, tooltip) | * |
| Variantes | class-variance-authority | 0.7.1 |
| Merge de classes | clsx + tailwind-merge → `cn()` | * |
| Animações | Framer Motion | 12.38.0 |
| Ícones | Lucide React + React Icons | 1.6.0 / 5.6.0 |
| Charts (docs only) | Recharts | 3.8.1 |
| Toast | Sonner (sem wrapper DS, instanciado diretamente) | 2.0.7 |
| Deploy | Docker (nginx) + Traefik Swarm | — |
| Integração IDE | babel-nook-tag.cjs (dev-only) → `data-nook-src` | scripts/ |

### Camadas internas (fonte de verdade → consumidor)

```
src/tokens/              ← paleta fipsPalette + semântica light/dark (TS)
    │  (espelho manual obrigatório)
    ▼
src/styles/globals.css   ← @theme CSS custom properties, @custom-variant dark, utilities
    │
    ▼
src/components/ui/       ← primitives governados (exportados pela library)
    └─ variantes em *-variants.ts (CVA)
    └─ Radix como camada de acessibilidade onde aplicável
    │
    ▼
src/composites/          ← composições reutilizáveis exportadas (PageHero)
    │
    ▼
src/docs/                ← site de documentação (NÃO exportado pela library)
    ├─ pages/components/ ← playground por primitive
    ├─ pages/foundations/← tokens (cores, tipo, espaçamento, raio, sombra, ícones)
    └─ pages/patterns/   ← layouts completos (Login, Dashboard, Data Listing…)
    │  (espelho manual)
    ▼
skills/design-system-fips/references/  ← skill bundle portátil para IAs
```

### Exports públicos (`src/index.ts`)

```ts
export * from './tokens'           // fipsPalette, semanticColors, fontFamilies, typeScale, spacingScale
export { cn } from './lib/cn'
export * from './components/ui'    // todos os primitives + AdminListing
export { FipsLogo } from './components/brand/FipsLogo'
export { PageHero, PAGE_HERO_DEFAULT_DECORATION } from './composites'
```

### Inventário de primitives em `src/components/ui/`

| Arquivo | Exportado | Doc page | Status |
|---|---|---|---|
| button.tsx | ✓ | ButtonDoc.tsx | ✓ Completo |
| badge.tsx | ✓ | BadgeDoc.tsx | ✓ Completo |
| card.tsx | ✓ | CardDoc.tsx | ✓ Completo |
| input.tsx | ✓ | InputDoc.tsx | ✓ Completo |
| input-group.tsx | ✓ | — | Sem doc page |
| field.tsx | ✓ | FieldDoc.tsx | ✓ Completo |
| field-trigger.tsx | ✓ | — | Sem doc page |
| select.tsx | ✓ | SelectDoc.tsx | ✓ Completo |
| textarea.tsx | ✓ | TextareaDoc.tsx | ✓ Completo |
| tabs.tsx | ✓ | TabsDoc.tsx | ✓ Completo |
| table.tsx | ✓ | TableDoc.tsx | ✓ Completo |
| dialog.tsx | ✓ | DialogDoc.tsx | ✓ Completo |
| drawer.tsx | ✓ | DrawerDoc.tsx | ✓ Completo |
| progress.tsx | ✓ | ProgressDoc.tsx | ✓ Completo |
| tooltip.tsx | ✓ | TooltipDoc.tsx | ✓ Completo |
| admin-listing.tsx | ✓ | — | ⚠ Domain-specific no barrel público |
| **toast.tsx** | **✗** | ToastDoc.tsx | **⚠ Doc existe, componente ausente** |
| **checkbox.tsx** | **✗** | **✗** | **✗ Não existe** |
| **switch.tsx** | **✗** | **✗** | **✗ Não existe** |
| **radio-group.tsx** | **✗** | **✗** | **✗ Não existe** |

---

## Gaps identificados

| Gap | Evidência concreta | Impacto |
|---|---|---|
| **Version drift** | `package.json` = `0.4.3`; `DOC_VERSION` em `DocLayout.tsx` = `"v0.4.2"` | Versão exibida no site é mentira |
| **Toast sem implementação** | `ToastDoc.tsx` + rota `/docs/components/toast` existem em `nav.ts`; nenhum `toast.tsx` em `ui/` | Link no nav quebrado; lib não exporta Toast |
| **Form primitives ausentes** | Checkbox, Switch, RadioGroup — zero arquivos | Apps FIPS precisam reimplementar |
| **Skill bundle sem gate** | `npm run build:downloads` é manual; nenhum CI impede deploy com `references/*.md` stale | IAs consumidoras recebem docs desatualizados |
| **Bump de versão manual** | 3 arquivos, sem script; drift já ocorreu | Erros silenciosos em releases |
| **Admin listing no barrel público** | `admin-listing.tsx` tem `AdminTableCompanyCell`, `AdminTableStatusDots` — lógica de domínio | Consumidores externos recebem deps não genéricos |

---

## Mudanças propostas

### Componente 1: Toast Primitive

- **Responsabilidade:** encapsular Sonner com tokens FIPS; promover Toast a primitive governado exportável.
- **Arquivos a criar:**
  ```
  src/components/ui/toast.tsx          ← re-export Toaster (Sonner) + helper toast() pré-configurado
  ```
- **Arquivos a modificar:**
  ```
  src/components/ui/index.ts           ← exportar toast, Toaster
  src/docs/pages/components/ToastDoc.tsx ← completar implementação (esqueleto existe)
  src/app/DocLayout.tsx                ← trocar <Toaster> bare pelo wrapper DS
  ```
- **Dependências:** Sonner já instalado — nenhuma nova dep.
- **Nota:** ToastDoc.tsx já está registrado em `nav.ts` e em `App.tsx`. Não mexer no roteamento.

### Componente 2: Form Primitives Fase 2 (Checkbox, Switch, RadioGroup)

- **Responsabilidade:** completar cobertura de formulários. Hoje `Field + Input + Textarea + Select` existem; escolha binária e exclusiva estão ausentes.
- **Arquivos a criar:**
  ```
  src/components/ui/checkbox.tsx
  src/components/ui/checkbox-variants.ts
  src/components/ui/switch.tsx
  src/components/ui/switch-variants.ts
  src/components/ui/radio-group.tsx
  src/components/ui/radio-group-variants.ts
  src/docs/pages/components/CheckboxDoc.tsx
  src/docs/pages/components/SwitchDoc.tsx
  src/docs/pages/components/RadioGroupDoc.tsx
  ```
- **Arquivos a modificar:**
  ```
  src/components/ui/index.ts           ← exportar novos primitives
  src/routes/nav.ts                    ← adicionar 3 entradas ao grupo "components"
  src/App.tsx                          ← registrar 3 rotas lazy
  ```
- **Dependências novas:**
  ```bash
  npm install @radix-ui/react-checkbox @radix-ui/react-switch @radix-ui/react-radio-group
  ```

### Componente 3: Script de Bump de Versão (`scripts/bump-version.mjs`)

- **Responsabilidade:** garantir bump atômico dos 3 arquivos obrigatórios; eliminar o drift existente.
- **Arquivos a criar:**
  ```
  scripts/bump-version.mjs   ← arg: patch|minor|major
                               atualiza: package.json#version
                                        README.md (linha de histórico)
                                        src/app/DocLayout.tsx (DOC_VERSION)
  ```
- **Arquivos a modificar:**
  ```
  package.json               ← adicionar scripts:
                               "version:patch": "node scripts/bump-version.mjs patch"
                               "version:minor": "node scripts/bump-version.mjs minor"
                               "version:major": "node scripts/bump-version.mjs major"
  ```
- **Dependências:** Node puro (`fs`, `path`) — nenhuma lib externa.

### Componente 4: Skill Bundle Validation (`scripts/validate-skill-sync.mjs`)

- **Responsabilidade:** gate de CI — impedir deploy se `skills/design-system-fips/references/*.md` estiver desatualizado em relação a `src/tokens/` e `src/components/ui/`.
- **Arquivos a criar:**
  ```
  scripts/validate-skill-sync.mjs   ← verifica presença de tokens-chave no references/foundations.md
                                       e de exports do ui/index.ts no references/components.md
  ```
- **Arquivos a modificar:**
  ```
  package.json    ← "lint:skill": "node scripts/validate-skill-sync.mjs"
  Dockerfile      ← RUN npm run lint:skill (antes do vite build)
  ```
- **Dependências:** Node puro.

### Componente 5: Página Dark Mode Foundations

- **Responsabilidade:** documentar tokens semânticos dark (já existem em `tokens/colors.ts` e no `@theme`); complementar as 6 páginas de foundations com toggle live.
- **Arquivos a criar:**
  ```
  src/docs/pages/foundations/DarkModePage.tsx
  ```
- **Arquivos a modificar:**
  ```
  src/routes/nav.ts    ← adicionar item ao grupo "foundations"
  src/App.tsx          ← registrar rota lazy
  ```
- **Dependências:** `useFipsTheme` (já existe em `src/hooks/useFipsTheme.ts`).

---

## Fluxo de dados

### Library (consumidor externo)

```
app FIPS
  import { Button, toast, Toaster, Checkbox, ... } from 'ds-fips'
       ↓
  src/index.ts
    → src/components/ui/index.ts  → button.tsx / toast.tsx / checkbox.tsx / ...
    → src/composites/index.ts     → PageHero.tsx
    → src/tokens/index.ts         → fipsPalette, semanticColors, ...

  // estilos: consumidor importa src/styles/globals.css
```

### Site de docs

```
Vite serve/build
  src/main.tsx
    → App.tsx (React Router, rotas lazy)
      → DocLayout.tsx (shell: DocsNeuSidebar + DocHeader + <Toaster>)
        → <Outlet>
          → ButtonDoc / ToastDoc / CheckboxDoc / DashboardDemo / ...
            → primitives de src/components/ui/ (governados)
            → CodePlayground / DocPage (infra de docs)
```

### Bump de versão (após mudanças)

```
npm run version:patch
  → scripts/bump-version.mjs
      ├─ package.json#version   X.Y.Z → X.Y.(Z+1)
      ├─ README.md              insere linha no histórico
      └─ DocLayout.tsx          DOC_VERSION = 'vX.Y.(Z+1)'
  → git add -p && git commit -m "chore: bump version to X.Y.(Z+1)"
```

---

## ADRs (Architecture Decision Records)

### ADR-1: Sincronia tokens ↔ @theme ↔ skill bundle é obrigação de processo

- **Contexto:** `src/tokens/` é fonte de verdade TS. `globals.css @theme` e `skills/references/foundations.md` são espelhos. Hoje ambos são manuais; não há gate que impeça divergência.
- **Decisão:** Componente 4 (`validate-skill-sync.mjs`) adiciona gate no Dockerfile. `npm run tokens:gen` continua sendo o ponto de re-geração; o script de validação não substitui, apenas bloqueia deploy se stale.
- **Consequências:** `+` skill bundle sempre coerente no que é deployado. `-` Build falha se dev esquece de rodar `tokens:gen` após mudança de token.

### ADR-2: Primitives governados — overrides visuais somente via CVA variant

- **Contexto:** ESLint rule `governance/no-visual-overrides` já existe. A decisão é mantê-la e aplicá-la também a Toast, Checkbox, Switch, RadioGroup.
- **Decisão:** Todo novo primitive cria `*-variants.ts` antes de `*.tsx`. Sem classes de aparência inline.
- **Consequências:** `+` Consistência visual garantida em compile-time. `-` Toda nova variante passa por PR (custo intencional — é a governança).

### ADR-3: Bump de versão = operação atômica nos 3 arquivos

- **Contexto:** Drift já confirmado: `package.json` = `0.4.3`, `DocLayout.tsx` = `"v0.4.2"`. Bump manual é propenso a erro.
- **Decisão:** `scripts/bump-version.mjs` encapsula os 3 writes. Após o script, `git diff` mostra exatamente os 3 arquivos — nada mais, nada menos.
- **Consequências:** `+` Zero drift após adoção. `-` Script novo para manter (risco baixo, sem deps externas).

### ADR-4: Toast via Sonner wrapper — não reinventar

- **Contexto:** Sonner (2.0.7) já está instalado e instanciado no DocLayout. Implementar Toast puro custaria acessibilidade (aria-live, role, etc.) sem benefício proporcional.
- **Decisão:** `toast.tsx` é um wrapper leve sobre Sonner — exporta `toast()` helper pré-configurado com tokens FIPS (cor, tipografia, sombra) via CSS custom properties. Sem reimplementar a fila de toasts.
- **Consequências:** `+` Zero dep nova. `+` Acessibilidade Sonner grátis. `-` DS não controla 100% do markup interno do toast (aceitável para v0.x).

### ADR-5: Admin listing permanece em ui/ para compatibilidade, com flag de deprecação

- **Contexto:** `admin-listing.tsx` contém lógica de domínio (`CompanyCell`, `StatusDots`) exportada pelo barrel público da library. Não é genérico.
- **Decisão:** Manter por compatibilidade até próximo major. Adicionar comentário `// @deprecated — mover para src/components/domain/ no v1.0.0`. Não registrar em `docs/pages/` como componente documentado.
- **Consequências:** `+` Sem breaking change imediato. `-` Consumidores externos continuam recebendo componentes de domínio. Revisitar em v1.0.0.

### ADR-6: Form primitives Fase 2 usam Radix como base de acessibilidade

- **Contexto:** Checkbox, Switch, RadioGroup precisam de comportamento ARIA correto (roving tabindex, checked state, etc.). Radix já é dependência do projeto.
- **Decisão:** `@radix-ui/react-checkbox`, `@radix-ui/react-switch`, `@radix-ui/react-radio-group` — mesmo padrão de Dialog e Tooltip.
- **Consequências:** `+` Acessibilidade correta sem implementação manual. `+` Consistência com primitives existentes. `-` Adiciona 3 pacotes Radix novos (tree-shakeable, impacto mínimo no bundle).

---

## Riscos

| Risco | Severidade | Mitigação |
|---|---|---|
| Version drift já existe (`0.4.3` vs `v0.4.2`) | **Alta** — corrigir imediatamente | ADR-3 + Componente 3 (bump script) |
| Toast link no nav quebrado | **Alta** — nav.ts aponta para rota sem componente | Componente 1 (prioridade) |
| Skill bundle stale em produção | **Média** | ADR-1 + Componente 4 (validate gate) |
| Form primitives ausentes forçam reimplementação nos apps | **Média** | Componente 2 (Fase 2) |
| `admin-listing.tsx` no barrel público vaza domínio | **Baixa** (compatibilidade) | ADR-5 — deprecar, mover em v1.0.0 |
| Recharts + Framer Motion encham node_modules do consumidor | **Baixa** (só docs, não exportado) | Reavaliar ao publicar no npm registry |

---

## Sequência de implementação recomendada

| # | Entregável | Versão alvo | Justificativa |
|---|---|---|---|
| 1 | Corrigir drift + criar `bump-version.mjs` | v0.4.3 → patch | Risco ativo, zero impacto em consumidores |
| 2 | `toast.tsx` wrapper + completar ToastDoc | v0.5.0 | Link do nav quebrado; minor pois expande API pública |
| 3 | Checkbox, Switch, RadioGroup + docs | v0.6.0 | Cobertura de forms; minor por novos exports |
| 4 | `validate-skill-sync.mjs` + gate Dockerfile | v0.6.1 | Infra; patch |
| 5 | DarkModePage foundations | v0.6.2 | Documentação; patch |
| 6 | Deprecar `admin-listing` do barrel | v1.0.0 | Breaking change — major |
