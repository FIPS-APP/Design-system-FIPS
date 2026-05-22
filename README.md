# Design System FIPS

Biblioteca oficial de componentes para construir interfaces do sistema FIPS (Ferrovia Interna do Porto de Santos).

## Versão atual: `v0.4.3`

## Versionamento

O projeto segue **Semantic Versioning (SemVer)**. Toda alteração deve atualizar a versão em `package.json` antes do commit.

| Tipo de alteração | Incremento | Exemplo |
|---|---|---|
| **Correção / patch** (bugfix, ajuste visual, refactor) | `+0.0.1` | 0.4.0 → 0.4.1 |
| **Nova feature / tela** | `+0.1.0` | 0.4.0 → 0.5.0 |
| **Breaking change** (mudança incompatível) | `+1.0.0` | 0.4.0 → 1.0.0 |

### Como atualizar a versão

1. Edite o campo `"version"` no `package.json`
2. Atualize a seção "Versão atual" neste README
3. Commit com mensagem no padrão: `chore: bump version to X.Y.Z`

## Histórico de versões

| Versão | Data | Descrição |
|---|---|---|
| 0.4.3 | 2026-04-28 | Ajustes de iconografia, playground interativo e padronização visual dos headers/previews |
| 0.4.2 | 2026-04-28 | Ampliação da documentação (componentes/patterns), playground de código e ajustes no login Tecnopano |
| 0.4.1 | 2026-04-27 | Documentação de versionamento e changelog |
| 0.4.0 | 2026-04-23 | Stacks, tutorial contextual, modal colorido, exports |

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
