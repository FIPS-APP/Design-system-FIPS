# SPEC — Modal "Buscar responsável" (paridade OPA-Gestão)

Fonte de verdade: `OPA-GESTAO/src/composites/Modal.tsx` (tone `gov`) + screenshot do app em produção.
Objetivo: o `BuscarPessoaModal` do catálogo renderiza **byte-a-byte** como o modal do OPA.
Regra: só a **lista de pessoas** é mock fictício (CS real = dado sensível). Todo o resto = igual ao OPA.

## Por que estava errado (catálogo shadcn ≠ FIPS)
O `ui/Modal` (hero) delega ao `ui/dialog.tsx` `DialogContent`, que é shadcn/Tecnopano:
- card `rounded-2xl / sm:rounded-[20px]` + `bg-gradient-to-br from-#fafafa via-#f0f0f2 to-#e8e8ec` + grain + faixa de topo;
- ícone do header hardcodado `text-white` (o OPA usa **âmbar**);
- corpo `px-6 py-5` (o OPA usa `p-6`).
→ Solução: modal **auto-contido** (Radix cru + classes do OPA), sem passar pelo `DialogContent`.

## Anatomia exata (do Modal.tsx do OPA, tone gov)

### Overlay
`fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-sm` + fade (`data-[state=closed]:opacity-0`).

### Card (Dialog.Content)
- posição: `fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50`
- largura: `w-[calc(100%-2rem)] max-w-md`
- **raio: `rounded-[12px_12px_12px_24px]`** (assinatura FIPS — inferior-esq. 24)
- fundo: **`bg-[var(--color-surface)]`** (plano, SEM gradiente)
- sombra: **`shadow-[var(--shadow-elevated)]`** (`0 22px 64px rgb(0 75 155 / .18)`)
- layout: `flex max-h-[85vh] flex-col overflow-hidden`
- anim: `transition-all duration-200 data-[state=closed]:scale-95 data-[state=closed]:opacity-0`

### Header (faixa gov) — `shrink-0`
- container: `relative flex items-center gap-4 overflow-hidden px-6 py-5 pr-14`
- fundo: **`var(--fips-banner-content-bg)`** (gradiente institucional — mesmo token no catálogo)
- **tile do ícone (44×44):** `relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border`
  - `background: color-mix(in srgb, var(--color-accent) 10%, transparent)`
  - `borderColor: color-mix(in srgb, var(--color-accent) 19%, transparent)`
  - **`color: var(--color-accent)`** ← ÍCONE ÂMBAR (não branco!)
  - `boxShadow: 0 1px 2px rgba(0,42,104,.3), inset 0 1px 0 rgba(255,255,255,.08)`
  - ícone lucide `Users` `h-5 w-5`
- título: `font-heading text-[21px] font-bold leading-[1.2] tracking-[-0.2px] text-white` → "Buscar responsável"
- subtítulo: `text-xs leading-snug text-white/65` → "Busque pelo nome, cargo ou matrícula. Sem busca, a lista traz quem tem equipe."
- (sem eyebrow neste modal)
- botão X: `absolute right-[14px] top-[14px] h-8 w-8 rounded-lg bg-white/[0.08] text-white/90 hover:bg-white/[0.18] hover:text-white`, ícone `X h-4 w-4`

### Corpo — campo FIXO + lista rolável (não é 1 scroll só)
O campo NÃO rola com a lista. Estrutura:
1. **Campo de busca — FIXO:** wrapper `shrink-0 px-6 pt-5 pb-3`. Input full-width com lupa (`Search` à esquerda), placeholder "Digite o nome, cargo ou matrícula…", `autoFocus`. h≈38, radius 8, `border 1.5px var(--color-border)`, `bg var(--color-surface)`.
2. **Lista — ROLÁVEL:** `fips-scroll flex-1 space-y-0.5 overflow-y-auto px-6 pb-6`.
   - **`pb-6` (24px) DENTRO da rolagem** → é isto que dá o padding inferior: ao rolar até o fim, o último item respira 24px antes do clip. (o `p-6` do corpo genérico do OPA não bastava porque a lista aninhada colava no próprio clip.)
   - **`fips-scroll`** (utilitário em globals.css): barra **fina, sem botões de seta**, thumb cinza translúcido flutuante — corrige o scrollbar grosso do Windows (com ▲▼) que não batia com o OPA.
   Cada linha (button):
   - `flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left`
   - **hover:** amarelo padrão FIPS suave — `hover:bg-[color-mix(in_srgb,var(--color-accent)_16%,transparent)]`
   - `PessoaAvatar` (foto → iniciais)
   - nome: `text-sm font-semibold text-[var(--color-fg)]` (truncate)
   - 2ª linha: `text-xs text-[var(--color-fg-muted)]` = `cargo · área`
   - matrícula à direita: `font-mono text-xs text-[var(--color-fg-muted)]`
   - vazio: "Ninguém encontrado."

### Comportamento
- sem busca → só `qtd_lideranca > 0`, ordenado desc por liderança ("quem tem equipe")
- com busca → filtra por nome, matrícula ou cargo (case-insensitive)
- fecha por: seleção, X, Esc, clique no overlay

## Checklist de revisão (verificar no browser)
- [ ] card raio `12px 12px 12px 24px`, fundo plano `surface`, sombra elevated
- [ ] header gradiente gov; **ícone âmbar** (`rgb(253,194,78)` ≈ yellow-400), não branco
- [ ] título branco 21px; subtítulo branco/65 com a 2ª frase "quem tem equipe"
- [ ] X glass branco no canto
- [ ] corpo com **24px de padding** (inclusive embaixo)
- [ ] lista rola com scrollbar **inset** (24px da borda); ordem por liderança
- [ ] hover surface-muted nas linhas
- [ ] dados 100% fictícios
