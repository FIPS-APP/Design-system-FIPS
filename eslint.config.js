import { readFileSync } from 'node:fs'
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

// `TableHead` entra na lista porque o alinhamento do cabeçalho já foi revertido duas
// vezes (v0.11.32 → v0.12.3). Centralizado é regra do DS, não preferência de tela:
// `th` nunca segue o `align` da coluna, só o `td` segue.
const GOVERNED_COMPONENTS = new Set([
  'Button',
  'Input',
  'Select',
  'Textarea',
  'TabsList',
  'TabsTrigger',
  'TableHead',
])
const VISUAL_OVERRIDE_PATTERN =
  /^(?:bg-|text-|border(?:$|-)|rounded(?:$|-)|shadow(?:$|-)|h(?:$|-)|min-h(?:$|-)|max-h(?:$|-)|p(?:$|-|x-|y-|t-|r-|b-|l-)|font(?:$|-)|leading(?:$|-)|tracking(?:$|-)|ring(?:$|-)|opacity(?:$|-))/

function getJsxName(node) {
  if (node.type === 'JSXIdentifier') return node.name
  if (node.type === 'JSXMemberExpression') return node.property.name
  return null
}

function getClassAttribute(node) {
  return node.attributes.find(
    (attribute) => attribute.type === 'JSXAttribute' && attribute.name.name === 'className',
  )
}

function getAttributeSourceText(attribute, sourceCode) {
  if (!attribute || !attribute.value) return ''
  if (attribute.value.type === 'Literal' && typeof attribute.value.value === 'string') {
    return attribute.value.value
  }
  if (attribute.value.type === 'JSXExpressionContainer') {
    return sourceCode.getText(attribute.value.expression)
  }
  return sourceCode.getText(attribute.value)
}

function getPotentialClassTokens(classText) {
  return (classText.match(/[!:[\]()/.%#,\w-]+/g) ?? [])
    .map((token) => token.split(':').at(-1)?.replace(/^!/, '') ?? token)
}


/**
 * Mapa hex → token, lido do CSS gerado por `npm run tokens:build`. Serve só para a
 * mensagem do erro apontar o token certo em vez de mandar o dev procurar.
 */
function readTokenMap() {
  const map = new Map()
  let css = ''
  try {
    css = readFileSync(new URL('./src/styles/tokens.generated.css', import.meta.url), 'utf8')
  } catch {
    return map
  }
  for (const [, name, hex] of css.matchAll(/(--[a-z0-9-]+):\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    const key = hex.toLowerCase()
    if (!map.has(key)) map.set(key, name)
  }
  return map
}

const TOKEN_BY_HEX = readTokenMap()

// #rgb, #rgba, #rrggbb, #rrggbbaa e as funções de cor do CSS.
// `\b` não serve para as funções: em `shadow-[0_2px_8px_rgba(...)]` o caractere
// anterior é `_`, que é word char — a borda não existe e o rgba passava batido.
const RAW_COLOR_PATTERN =
  /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})(?![0-9a-z])|(?<![a-z0-9-])(?:rgba?|hsla?)\(/i

/** Caminho de import/export não é cor, mesmo contendo `#`. */
function isModuleSource(node) {
  const parent = node.parent
  return (
    parent &&
    (parent.type === 'ImportDeclaration' ||
      parent.type === 'ExportNamedDeclaration' ||
      parent.type === 'ExportAllDeclaration' ||
      (parent.type === 'ImportExpression' && parent.source === node))
  )
}

const rawColorRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow raw color literals outside the token layer.',
    },
    schema: [
      {
        type: 'object',
        properties: {
          allow: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const allow = new Set((context.options[0]?.allow ?? []).map((value) => value.toLowerCase()))

    function check(node, text) {
      if (!text) return
      const match = RAW_COLOR_PATTERN.exec(text)
      if (!match) return

      const found = match[0]
      if (allow.has(found.toLowerCase())) return

      const token = TOKEN_BY_HEX.get(found.toLowerCase())
      const fix = token
        ? `Use \`var(${token})\`.`
        : 'Promova a cor para um token em `src/tokens/theme.ts` (e rode `npm run tokens:build`) ou use um token semântico existente (`--color-fg`, `--color-surface`, `--color-border`…).'

      context.report({
        node,
        message: `Cor crua \`${found}\` fora da camada de tokens. ${fix}`,
      })
    }

    return {
      Literal(node) {
        if (typeof node.value !== 'string') return
        if (isModuleSource(node)) return
        check(node, node.value)
      },
      TemplateElement(node) {
        check(node, node.value.raw)
      },
    }
  },
}

const dsGovernancePlugin = {
  rules: {
    'no-raw-color': rawColorRule,
    'no-visual-overrides': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow visual className overrides on governed DS primitives.',
        },
        schema: [],
      },
      create(context) {
        const sourceCode = context.sourceCode

        return {
          JSXOpeningElement(node) {
            const componentName = getJsxName(node.name)

            if (!componentName || !GOVERNED_COMPONENTS.has(componentName)) return

            const classAttribute = getClassAttribute(node)
            const classText = getAttributeSourceText(classAttribute, sourceCode)

            if (!classText) return

            const offendingToken = getPotentialClassTokens(classText).find((token) =>
              VISUAL_OVERRIDE_PATTERN.test(token),
            )

            if (!offendingToken) return

            context.report({
              node: classAttribute,
              message:
                `Evite override visual direto em \`${componentName}\` com \`${offendingToken}\`. ` +
                'Promova a necessidade para uma variante ou composição oficial do DS-FIPS e deixe className apenas para layout externo.',
            })
          },
        }
      },
    },
  },
}

export default defineConfig([
  // `exports/` são snippets copy-paste (fora do tsconfig.app, nunca compilados) — regras
  // de app como react-refresh/only-export-components não dizem nada sobre um arquivo que
  // o usuário cola em OUTRO projeto.
  // `src/__canvas_*` são gerados pelo Nook Studio Canvas, dev-only e já gitignored.
  globalIgnores(['dist', 'exports', 'src/__canvas_mount.tsx', 'src/__canvas_providers.tsx']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/components/ui/**/*'],
    plugins: {
      governance: dsGovernancePlugin,
    },
    rules: {
      'governance/no-visual-overrides': 'error',
    },
  },
  // Cor crua é dívida em qualquer lugar de `src/` — menos em `src/tokens/`, que é
  // justamente onde o valor deve morar. Fora da biblioteca fica em `warn`: as doc
  // pages carregam paletas locais e snippets copy-paste, e isso some por página.
  {
    files: ['src/**/*.{ts,tsx}'],
    ignores: ['src/tokens/**/*'],
    plugins: {
      governance: dsGovernancePlugin,
    },
    rules: {
      'governance/no-raw-color': 'warn',
    },
  },
  // Na biblioteca publicada, é erro — e está zerado. Quem precisar de uma cor nova
  // promove o token em `src/tokens/theme.ts` e roda `npm run tokens:build`.
  {
    files: [
      'src/components/ui/**/*.{ts,tsx}',
      'src/components/composites/**/*.{ts,tsx}',
      'src/components/brand/**/*.{ts,tsx}',
      'src/components/icons/**/*.{ts,tsx}',
      'src/composites/**/*.{ts,tsx}',
    ],
    plugins: {
      governance: dsGovernancePlugin,
    },
    rules: {
      'governance/no-raw-color': 'error',
    },
  },
])
