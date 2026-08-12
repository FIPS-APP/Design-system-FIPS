import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

const GOVERNED_COMPONENTS = new Set(['Button', 'Input', 'Select', 'Textarea', 'TabsList', 'TabsTrigger'])
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

const dsGovernancePlugin = {
  rules: {
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
])
