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

// Cor literal: `#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa`, `rgb(`, `rgba(`, `hsl(`, `hsla(` dentro de texto
// de código (className, style, template). Cor vem de token (`var(--color-*)`); o que não tem token
// ainda entra na lista de exceções do bloco `no-literal-colors` mais abaixo, com o motivo.
// Limitação conhecida: `#abc` que não é cor (âncora em `href="#add"`) é acusado como cor. Hex depois de
// `_`, o formato de sombra arbitrária do Tailwind (`shadow-[0_0_0_3px_#93BDE4]`), é acusado.
const LITERAL_COLOR_PATTERN = /(?<![A-Za-z0-9&])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{4}|[0-9a-fA-F]{3})(?![\w-])|(?<![A-Za-z])(?:rgba?|hsla?)\([^)]*\)/g
const normalizeColor = (color) => color.replace(/\s+/g, '').toLowerCase()

const dsGovernancePlugin = {
  rules: {
    'no-literal-colors': {
      meta: {
        type: 'problem',
        docs: {
          description: 'Disallow literal colors (hex, rgb, hsl) in component code; use a token or list an exception.',
        },
        schema: [
          {
            type: 'object',
            properties: { exceptions: { type: 'object', additionalProperties: { type: 'array', items: { type: 'string' } } } },
            additionalProperties: false,
          },
        ],
      },
      create(context) {
        const filename = context.filename.replaceAll('\\', '/')
        const exceptions = context.options[0]?.exceptions ?? {}
        const entry = Object.entries(exceptions).find(([file]) => filename.endsWith(file))
        const allowed = new Set((entry?.[1] ?? []).map(normalizeColor))

        function check(node, text) {
          for (const match of text.matchAll(LITERAL_COLOR_PATTERN)) {
            // `rgb(var(--x) / 0.5)` é token com alfa, não cor literal
            if (match[0].includes('var(')) continue
            if (allowed.has(normalizeColor(match[0]))) continue
            context.report({
              node,
              message:
                `Cor literal \`${match[0]}\`. Use um token (\`var(--color-*)\`) ou registre a exceção, com o motivo, ` +
                'em `COLOR_EXCEPTIONS` no eslint.config.js.',
            })
          }
        }

        return {
          Literal(node) {
            if (typeof node.value === 'string') check(node, node.value)
          },
          TemplateElement(node) {
            check(node, node.value.raw)
          },
        }
      },
    },
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

// Exceções da regra `governance/no-literal-colors`: arquivo -> cores que ainda não têm token, cada
// grupo com o motivo. Cor nova em `src/components/ui/` não entra aqui sem motivo: use token.
const COLOR_EXCEPTIONS = {
  // faixa hero e tile do ícone do Modal: azul escuro do fim do gradiente (#001A4A) e vidro branco sobre o azul; sem token, igual nos dois temas.
  'src/components/ui/Modal.tsx': [
    '#001A4A',
    'rgba(255,255,255,0.14)',
    'rgba(255,255,255,0.06)',
    'rgba(0,24,58,0.22)',
    'rgba(0,42,104,0.3)',
    'rgba(255,255,255,0.08)',
  ],
  // sombra do popover do chip, em azul institucional translúcido; sem token de sombra com essa cor.
  'src/components/ui/chip-select.tsx': [
    'rgba(0,42,104,0.18)',
    'rgba(0,42,104,0.06)',
  ],
  // Dialog legado: gradientes e sombras neutras, cada cor com o par claro e escuro na mesma classe (dark:); sem tokens para esses cinzas.
  'src/components/ui/dialog.tsx': [
    '#fafafa',
    '#f0f0f2',
    '#e8e8ec',
    'rgba(0,0,0,0.18)',
    'rgba(255,255,255,0.8)',
    'rgba(255,255,255,0.9)',
    '#2e2e2e',
    '#272727',
    '#222222',
    '#1d1d1d',
    'rgba(0,0,0,0.6)',
    'rgba(255,255,255,0.04)',
    'rgba(255,255,255,0.06)',
    '#004B9B',
    '#93BDE4',
    '#ebebeb',
    '#e0e0e0',
    'rgba(55,55,55,0.82)',
    'rgba(0,0,0,0.06)',
    'rgba(255,255,255,0.85)',
    '#3a3a3a',
    '#2c2c2c',
    '#262626',
    '#1f1f1f',
    '#a1a1aa',
    'rgba(0,0,0,0.55)',
    'rgba(255,255,255,0.08)',
    'rgba(0,0,0,0.45)',
    '#18181b',
  ],
  // faixa hero do DrawerHero: mesmo fim de gradiente (#001A4A) do Modal; sem token.
  'src/components/ui/drawer.tsx': [
    '#001A4A',
  ],
  // foco do campo no escuro, azul claro (#93BDE4) no par dark:; vira token de texto/borda de foco quando o escuro for revisado.
  'src/components/ui/field-trigger.tsx': [
    '#93BDE4',
  ],
  // foco do grupo no escuro, azul claro (#93BDE4) no par dark:.
  'src/components/ui/input-group.tsx': [
    '#93BDE4',
  ],
  // foco do campo no escuro, azul claro (#93BDE4) no par dark:.
  'src/components/ui/input.tsx': [
    '#93BDE4',
  ],
  // sombra interna da trilha, cinza azulado a 6%; sem token de sombra.
  'src/components/ui/progress.tsx': [
    'rgba(15,23,42,0.06)',
  ],
  // lista aberta e opção ativa no escuro: azul claro (#93BDE4), seu fundo a 14% e o cinza #2a2a2a do par dark:.
  'src/components/ui/select.tsx': [
    '#93BDE4',
    'rgba(147,189,228,0.14)',
    '#2a2a2a',
  ],
  // variantes do Badge: no escuro, azul claro (#93BDE4) com seu fundo a 14% e o amarelo #FDC24E do texto de aviso, no par dark:; sem token.
  'src/components/ui/badge-variants.ts': [
    '#93BDE4',
    'rgba(147,189,228,0.14)',
    '#FDC24E',
  ],
  // variantes do Button: sombras de 8px na cor do próprio fundo (azul institucional, laranja, verdes e vermelho) a 12, 18 e 20%; sem token de sombra com essas cores.
  'src/components/ui/button-variants.ts': [
    'rgba(0,75,155,0.12)',
    'rgba(0,75,155,0.18)',
    'rgba(246,146,30,0.2)',
    'rgba(0,198,76,0.2)',
    'rgba(0,144,76,0.2)',
    'rgba(220,53,69,0.2)',
  ],
  // sombra do polegar do Switch; sem token.
  'src/components/ui/switch.tsx': [
    'rgba(0,0,0,0.2)',
  ],
  // foco do campo no escuro, azul claro (#93BDE4) no par dark:.
  'src/components/ui/textarea.tsx': [
    '#93BDE4',
  ],
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
    plugins: {
      governance: dsGovernancePlugin,
    },
    rules: {
      'governance/no-visual-overrides': 'error',
    },
  },
  {
    // Cor literal em componente. Cobre hoje `src/components/ui/`. As outras pastas de
    // `src/components/` ainda não passaram pela troca por token e saem da regra até a fatia
    // delas: `composites/` e `icons/` na FIPS-1303, `layout/`, `domain/` e `patterns/` (código
    // só do site, que o pacote não exporta) na FIPS-1305. Quando a fatia entrar, a pasta sai
    // desta lista de `ignores`.
    files: ['src/components/**/*.{ts,tsx}'],
    ignores: [
      'src/components/composites/**',
      'src/components/icons/**',
      'src/components/layout/**',
      'src/components/domain/**',
      'src/components/patterns/**',
    ],
    plugins: {
      governance: dsGovernancePlugin,
    },
    rules: {
      'governance/no-literal-colors': ['error', { exceptions: COLOR_EXCEPTIONS }],
    },
  },
])
