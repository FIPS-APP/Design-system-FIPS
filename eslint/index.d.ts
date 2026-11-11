import type { ESLint, Linter, Rule } from 'eslint'

export declare const GOVERNED_COMPONENTS: Set<string>
export declare const CASCAS_SHELL_COMPONENTS: Set<string>
export declare const VISUAL_OVERRIDE_PATTERN: RegExp

declare const plugin: ESLint.Plugin & {
  meta: { name: string; version: string }
  rules: {
    'no-visual-overrides': Rule.RuleModule | Linter.RuleEntry
    'no-invalid-ds-props': Rule.RuleModule | Linter.RuleEntry
    'no-invented-header-chrome': Rule.RuleModule | Linter.RuleEntry
    'no-invented-casca-shell': Rule.RuleModule | Linter.RuleEntry
  }
}

export default plugin
export { plugin }
