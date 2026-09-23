import { DocPage, DemoSection } from '../../components/DocPage'
import { AppFipsHeaderLogo } from '../../../components/composites/AppFipsHeaderLogo'
import { useFipsTheme } from '../../../hooks/useFipsTheme'

export default function AppFipsHeaderLogoDoc() {
  const { dark } = useFipsTheme()

  return (
    <DocPage
      title="Marca App FIPS (header)"
      description="PNG light/dark no topo do shell de produto, entre o toggle do menu e o trilho da página. Paridade Gestão OPA."
    >
      <DemoSection title="Uso no header">
        <p className="text-sm text-[var(--color-fg-muted)]">
          Import: <code>AppFipsHeaderLogo</code>. Passe <code>theme=&quot;light&quot; | &quot;dark&quot;</code> conforme o
          tema do app. Altura fixa <code>h-10</code>. Assets em <code>/brand/appfips-logo-light.png</code> e{' '}
          <code>appfips-logo-dark.png</code>.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[0_1px_3px_rgba(0,75,155,.04)]">
          <AppFipsHeaderLogo theme={dark ? 'dark' : 'light'} />
          <span className="truncate text-sm font-semibold text-[var(--color-fg)]">Home</span>
        </div>
        <p className="mt-3 text-xs text-[var(--color-fg-muted)]">
          Padrão completo do shell: <a href="/docs/components/header" className="font-semibold text-[var(--color-primary)]">Header</a>.
          O site de documentação usa o mesmo composite em <code>DocLayout</code>.
        </p>
      </DemoSection>
    </DocPage>
  )
}
