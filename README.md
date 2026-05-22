# Design System FIPS (`@fips-app/ds-fips`)

Biblioteca oficial de componentes, tokens e estilos para construir interfaces
do sistema FIPS (Ferrovia Interna do Porto de Santos), publicada no GitHub
Packages.

## Versão atual: `v0.5.0`

## Consumindo a biblioteca

### 1. Autenticação no GitHub Packages

Crie um `.npmrc` no projeto consumidor (commitar é seguro — o token vem do
ambiente):

```
@fips-app:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
```

Exporte um Personal Access Token com escopo `read:packages` na sua shell ou
no CI:

```bash
export GITHUB_TOKEN=ghp_xxx
```

### 2. Instalação

```bash
npm install @fips-app/ds-fips
```

### 3. Uso

Importe o CSS uma vez no entry da aplicação consumidora:

```tsx
// Next.js: app/layout.tsx
// Vite:    src/main.tsx
import '@fips-app/ds-fips/styles.css'
```

E os componentes/utilitários onde precisar:

```tsx
import { Button, FipsLogo, cn } from '@fips-app/ds-fips'
```

> Requer `react`, `react-dom` e `tailwindcss` v4 instalados no projeto
> consumidor (declarados como `peerDependencies`).

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
4. Após merge na `main`, crie e empurre a tag para disparar a publicação:
   ```bash
   git tag vX.Y.Z
   git push --tags
   ```

## Histórico de versões

| Versão | Data | Descrição |
|---|---|---|
| 0.5.0 | 2026-05-01 | Empacotamento como biblioteca npm publicável (`@fips-app/ds-fips`) com ESM/CJS/types/styles.css e workflow automático no GitHub Packages |
| 0.4.3 | 2026-04-28 | Ajustes de iconografia, playground interativo e padronização visual dos headers/previews |
| 0.4.2 | 2026-04-28 | Ampliação da documentação (componentes/patterns), playground de código e ajustes no login Tecnopano |
| 0.4.1 | 2026-04-27 | Documentação de versionamento e changelog |
| 0.4.0 | 2026-04-23 | Stacks, tutorial contextual, modal colorido, exports |

## Desenvolvimento desta lib

```bash
npm install
npm run dev      # playground / docs internos
npm run build    # gera dist/ (lib em ESM + CJS + .d.ts + styles.css)
```

### Publicação

A publicação é automática via GitHub Actions ao empurrar uma tag `v*`. O
workflow em `.github/workflows/publish.yml` autentica com `GITHUB_TOKEN`,
roda `npm run build` e publica em `npm.pkg.github.com` com escopo
`@fips-app`.

## Stack

- React + TypeScript
- Vite (lib mode)
- Tailwind CSS v4
- Radix UI primitives
