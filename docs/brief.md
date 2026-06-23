Brief gerado em `docs/brief.md`.

Usei o formato que você pediu (Visão, Problema, Usuários, Escopo MVP, Fora de escopo, Riscos, Próximos passos) e ancorei o conteúdo no que o `CLAUDE.md` já documenta: dupla natureza library + site de docs, governança via ESLint `no-visual-overrides`, sincronia tokens ↔ `@theme` ↔ skill bundle, SemVer com bump triplo, deploy estático em Traefik.

**Sinalizações que valem virar ADR/snippet no hub:**
- ADR — Sincronia obrigatória entre `src/tokens/` ↔ `@theme` em `globals.css` ↔ `references/*.md` do skill bundle.
- ADR — Primitives governados não aceitam overrides visuais via `className`; só via variant CVA.
- Snippet — Checklist do bump de versão (3 arquivos + commit `chore: bump version to X.Y.Z`).

Padrão consistente com `brief-gestao_opa` no hub — mesmo tom curto e direto, sem template genérico.