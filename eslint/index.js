/**
 * Regras de lint de governança do @fips-app/ds-fips, exportadas em `@fips-app/ds-fips/eslint`.
 * Origem: eslint-plugin-ds-governance 0.2.1.
 *
 * ESLint plugin that enforces Design System FIPS governance rules and
 * blocks invented props, variants and local copies on governed primitives and composites:
 *
 * 1. `governance/no-visual-overrides`:
 *    Bans className tokens that override the visual layer (background, text,
 *    border, rounded, shadow, height, padding, font, leading, tracking, ring,
 *    opacity) on governed DS-FIPS primitives (`Button`, `Input`, `Select`,
 *    `Textarea`, `TabsList`, `TabsTrigger`).
 *
 * 2. `governance/no-invalid-ds-props`:
 *    Bans invented props and playground/shadcn variants on DS-FIPS
 *    components:
 *    - `<Modal onClose / subtitle / width / tone>` or `className="max-w-*"`
 *    - `<Badge variant="sucesso|atencao|critico|ouro">`
 *    - `<Button variant="default|destructive">`
 *
 * 3. `governance/no-invented-header-chrome`:
 *    Bans bare `header-tile` in JSX `className` (a local 44px tile is invented
 *    instead of `fips-header-tile` 36px from `@fips-app/ds-fips` >=0.21.0).
 *
 * 4. `governance/no-invented-casca-shell`:
 *    Bans local definitions and non-package imports of shell composites
 *    (`AppShell`, `AppSidebar`, `AppHeader`, `HeaderTile`, `UserChip`, `HomeHero`).
 *    Only `@fips-app/ds-fips` (or subpaths) may supply those names.
 */

export const GOVERNED_COMPONENTS = new Set([
  'Button',
  'Input',
  'Select',
  'Textarea',
  'TabsList',
  'TabsTrigger',
])

export const CASCAS_SHELL_COMPONENTS = new Set([
  'AppShell',
  'AppSidebar',
  'AppHeader',
  'HeaderTile',
  'UserChip',
  'HomeHero',
])

export const VISUAL_OVERRIDE_PATTERN =
  /^(?:bg-|text-|border(?:$|-)|rounded(?:$|-)|shadow(?:$|-)|h(?:$|-)|min-h(?:$|-)|max-h(?:$|-)|p(?:$|-|x-|y-|t-|r-|b-|l-)|font(?:$|-)|leading(?:$|-)|tracking(?:$|-)|ring(?:$|-)|opacity(?:$|-))/

const INVALID_MODAL_PROPS = new Map([
  ['onClose', 'Prop `onClose` não existe em `Modal` do DS-FIPS (vem de exemplo legado). Use `onOpenChange={(open) => ...}`.'],
  ['subtitle', 'Prop `subtitle` não existe em `Modal` do DS-FIPS. Use `description`.'],
  ['width', 'Prop `width` não existe em `Modal` do DS-FIPS. Use `size="sm|md|lg|xl|2xl|3xl|full|workflow"`.'],
  ['tone', 'Prop `tone` não existe em `Modal` do DS-FIPS. Use `hero` para o cabeçalho institucional.'],
  ['headerBg', 'Prop `headerBg` é exclusiva do playground local `DialogDoc.tsx`. No `Modal` real use `hero`.'],
])

const INVALID_BADGE_VARIANTS = new Map([
  ['sucesso', 'success'],
  ['atencao', 'warning'],
  ['atenção', 'warning'],
  ['critico', 'danger'],
  ['crítico', 'danger'],
  ['ouro', 'warning (ou evolua badge-variants.ts — `ouro` existe apenas no playground BadgeDoc)'],
  ['destructive', 'danger'],
])

const INVALID_BUTTON_VARIANTS = new Map([
  ['default', 'primary'],
  ['destructive', 'danger'],
])

function getJsxName(node) {
  if (node.type === 'JSXIdentifier') return node.name
  if (node.type === 'JSXMemberExpression') return node.property.name
  return null
}

function getAttribute(node, attrName) {
  return node.attributes.find(
    (attribute) => attribute.type === 'JSXAttribute' && attribute.name && attribute.name.name === attrName,
  )
}

function getClassAttribute(node) {
  return getAttribute(node, 'className')
}

function getAttributeSourceText(attribute, sourceCode) {
  if (!attribute || !attribute.value) return ''
  if (attribute.value.type === 'Literal' && typeof attribute.value.value === 'string') {
    return attribute.value.value
  }
  if (attribute.value.type === 'JSXExpressionContainer') {
    if (attribute.value.expression.type === 'Literal' && typeof attribute.value.expression.value === 'string') {
      return attribute.value.expression.value
    }
    return sourceCode.getText(attribute.value.expression)
  }
  return sourceCode.getText(attribute.value)
}

function getPotentialClassTokens(classText) {
  return (classText.match(/[!:[\]()/.%#,\w-]+/g) ?? []).map(
    (token) => token.split(':').at(-1)?.replace(/^!/, '') ?? token,
  )
}

const INVENTED_HEADER_TILE_PATTERN = /(?:^|[\s"'`])header-tile(?:$|[\s"'`])/

const INVENTED_HEADER_TILE_MESSAGE =
  'Use fips-header-tile (36px) do @fips-app/ds-fips >=0.21.0. header-tile local e casca cortada.'

function collectClassNameTexts(attribute, sourceCode) {
  if (!attribute || !attribute.value) return []

  if (attribute.value.type === 'Literal' && typeof attribute.value.value === 'string') {
    return [attribute.value.value]
  }

  if (attribute.value.type !== 'JSXExpressionContainer') return []

  const expr = attribute.value.expression
  if (expr.type === 'Literal' && typeof expr.value === 'string') {
    return [expr.value]
  }

  if (expr.type === 'TemplateLiteral') {
    return expr.quasis.map((quasi) => quasi.value.cooked ?? quasi.value.raw)
  }

  return [sourceCode.getText(expr)]
}

function classNameHasInventedHeaderTile(text) {
  if (!text || text.includes('fips-header-tile')) return false
  return INVENTED_HEADER_TILE_PATTERN.test(text)
}

function isDsSource(source) {
  if (typeof source !== 'string') return false
  return source === '@fips-app/ds-fips' || source.startsWith('@fips-app/ds-fips/')
}

function isUiSupSource(source) {
  if (typeof source !== 'string') return false
  return /(?:^|[\\/])ui-sup(?:\/|$)/.test(source) || /(?:^|[\\/])components\/ui-sup/.test(source)
}

function setupDsTracker(context) {
  const dsBindings = new Map()
  const dsNamespaces = new Map()

  function registerImport(node) {
    const source = node.source?.value
    const isDs = isDsSource(source)
    const isUiSup = isUiSupSource(source)
    if (!isDs && !isUiSup) return

    for (const spec of node.specifiers) {
      if (spec.type === 'ImportSpecifier') {
        dsBindings.set(spec.local.name, {
          canonicalName: spec.imported.name,
          isUiSup,
        })
      } else if (spec.type === 'ImportDefaultSpecifier') {
        dsBindings.set(spec.local.name, {
          canonicalName: spec.local.name,
          isUiSup,
        })
      } else if (spec.type === 'ImportNamespaceSpecifier') {
        dsNamespaces.set(spec.local.name, { isUiSup })
      }
    }
  }

  function resolveElement(nameNode) {
    if (!nameNode) return null

    if (nameNode.type === 'JSXIdentifier') {
      const binding = dsBindings.get(nameNode.name)
      if (binding) return binding

      // Se for um snippet bare passado via validate_jsx (sem imports no arquivo)
      const filename = context.filename || ''
      if (
        (filename.endsWith('snippet.tsx') || filename === '<text>') &&
        dsBindings.size === 0 &&
        dsNamespaces.size === 0
      ) {
        return { canonicalName: nameNode.name, isUiSup: false }
      }
      return null
    }

    if (nameNode.type === 'JSXMemberExpression') {
      if (nameNode.object.type === 'JSXIdentifier') {
        const ns = dsNamespaces.get(nameNode.object.name)
        if (ns && nameNode.property.type === 'JSXIdentifier') {
          return { canonicalName: nameNode.property.name, isUiSup: ns.isUiSup }
        }
      }
    }

    return null
  }

  return { registerImport, resolveElement }
}

const UI_SUP_UNSUPPORTED_MODAL_PROPS = new Map([
  ['hero', 'Prop `hero` não existe no `Modal` do ui-sup (cópia v0.6.2). Só existe a partir da v0.12.3 do `@fips-app/ds-fips`.'],
  ['eyebrow', 'Prop `eyebrow` não existe no `Modal` do ui-sup (cópia v0.6.2). Só existe a partir da v0.12.3 do `@fips-app/ds-fips`.'],
  ['noPadBody', 'Prop `noPadBody` não existe no `Modal` do ui-sup (cópia v0.6.2). Só existe a partir da v0.12.3 do `@fips-app/ds-fips`.'],
])

const noVisualOverridesRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow visual className overrides on governed DS-FIPS primitives.',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode
    const tracker = setupDsTracker(context)

    return {
      ImportDeclaration: tracker.registerImport,
      JSXOpeningElement(node) {
        const resolved = tracker.resolveElement(node.name)
        if (!resolved) return

        const componentName = resolved.canonicalName
        if (!GOVERNED_COMPONENTS.has(componentName)) return

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
}

const noInvalidDsPropsRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow invented props and playground/shadcn variants on DS-FIPS components.',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode
    const tracker = setupDsTracker(context)

    return {
      ImportDeclaration: tracker.registerImport,
      JSXOpeningElement(node) {
        const resolved = tracker.resolveElement(node.name)
        if (!resolved) return

        const componentName = resolved.canonicalName
        const isUiSup = resolved.isUiSup

        if (componentName === 'Modal') {
          for (const attr of node.attributes) {
            if (attr.type !== 'JSXAttribute' || !attr.name) continue
            const propName = String(attr.name.name)

            // Checagem de props proibidas no DS-FIPS
            const msg = INVALID_MODAL_PROPS.get(propName)
            if (msg) {
              context.report({ node: attr, message: msg })
              continue
            }

            // Checagem específica para ui-sup (cópia v0.6.2)
            if (isUiSup) {
              const uiSupMsg = UI_SUP_UNSUPPORTED_MODAL_PROPS.get(propName)
              if (uiSupMsg) {
                context.report({ node: attr, message: uiSupMsg })
              }
            }
          }

          const classAttribute = getClassAttribute(node)
          const classText = getAttributeSourceText(classAttribute, sourceCode)
          if (classText) {
            const maxW = getPotentialClassTokens(classText).find((t) => /^max-w-/.test(t))
            if (maxW) {
              context.report({
                node: classAttribute,
                message: `Não passe \`${maxW}\` via className em \`Modal\`. Controle a largura pela prop \`size\` ('sm'|'md'|'lg'|'xl'|'2xl'|'3xl'|'full'|'workflow').`,
              })
            }
          }
        }

        if (componentName === 'Badge') {
          const variantAttr = getAttribute(node, 'variant')
          const val = getAttributeSourceText(variantAttr, sourceCode).trim()
          const fix = INVALID_BADGE_VARIANTS.get(val)
          if (variantAttr && fix) {
            context.report({
              node: variantAttr,
              message: `Variante \`"${val}"\` não existe no \`Badge\` governado do DS-FIPS. Use \`variant="${fix}"\`.`,
            })
          }
        }

        if (componentName === 'Button') {
          const variantAttr = getAttribute(node, 'variant')
          const val = getAttributeSourceText(variantAttr, sourceCode).trim()
          const fix = INVALID_BUTTON_VARIANTS.get(val)
          if (variantAttr && fix) {
            context.report({
              node: variantAttr,
              message: `Variante \`"${val}"\` (padrão shadcn) não existe no \`Button\` do DS-FIPS. Use \`variant="${fix}"\`.`,
            })
          }
        }
      },
    }
  },
}

const CASCAS_SHELL_MESSAGE =
  'da casca deve vir de @fips-app/ds-fips >=0.21.0. Não defina nem importe cópias locais.'

function cascaShellMessage(componentName) {
  return `\`${componentName}\` ${CASCAS_SHELL_MESSAGE}`
}

function getCascaImportName(spec) {
  if (spec.type === 'ImportSpecifier' && spec.imported.type === 'Identifier') {
    return spec.imported.name
  }
  if (spec.type === 'ImportDefaultSpecifier' && spec.local.type === 'Identifier') {
    return spec.local.name
  }
  return null
}

const noInventedCascaShellRule = {
  meta: {
    type: 'problem',
    docs: {
      description:
        'Ban local shell composites (AppShell, HomeHero, etc.); use @fips-app/ds-fips only',
    },
    schema: [],
  },
  create(context) {
    const tracker = setupDsTracker(context)
    const badImportLocals = new Set()

    function reportCasca(node, componentName) {
      context.report({
        node,
        message: cascaShellMessage(componentName),
      })
    }

    return {
      ImportDeclaration(node) {
        tracker.registerImport(node)
        const source = node.source?.value
        if (isDsSource(source)) return

        for (const spec of node.specifiers) {
          const canonical = getCascaImportName(spec)
          if (!canonical || !CASCAS_SHELL_COMPONENTS.has(canonical)) continue
          if (spec.local?.type === 'Identifier') {
            badImportLocals.add(spec.local.name)
          }
          reportCasca(spec, canonical)
        }
      },
      FunctionDeclaration(node) {
        const name = node.id?.name
        if (name && CASCAS_SHELL_COMPONENTS.has(name)) {
          reportCasca(node.id, name)
        }
      },
      VariableDeclarator(node) {
        if (node.id?.type !== 'Identifier') return
        const name = node.id.name
        if (CASCAS_SHELL_COMPONENTS.has(name)) {
          reportCasca(node.id, name)
        }
      },
      JSXOpeningElement(node) {
        const resolved = tracker.resolveElement(node.name)
        if (resolved && CASCAS_SHELL_COMPONENTS.has(resolved.canonicalName)) return

        const jsxName = getJsxName(node.name)
        if (!jsxName || !CASCAS_SHELL_COMPONENTS.has(jsxName)) return
        if (badImportLocals.has(jsxName)) return

        reportCasca(node.name, jsxName)
      },
    }
  },
}

const noInventedHeaderChromeRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ban bare header-tile in JSX className; use fips-header-tile from DS-FIPS',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode

    return {
      JSXOpeningElement(node) {
        const classAttribute = getClassAttribute(node)
        if (!classAttribute) return

        for (const text of collectClassNameTexts(classAttribute, sourceCode)) {
          if (classNameHasInventedHeaderTile(text)) {
            context.report({
              node: classAttribute,
              message: INVENTED_HEADER_TILE_MESSAGE,
            })
            return
          }
        }
      },
    }
  },
}

const plugin = {
  meta: {
    name: '@fips-app/eslint-plugin-ds-governance',
    version: '0.2.1',
  },
  rules: {
    'no-visual-overrides': noVisualOverridesRule,
    'no-invalid-ds-props': noInvalidDsPropsRule,
    'no-invented-header-chrome': noInventedHeaderChromeRule,
    'no-invented-casca-shell': noInventedCascaShellRule,
  },
}

export default plugin
export { plugin }
