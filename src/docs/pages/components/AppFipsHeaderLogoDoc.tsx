import { DocPage, DemoSection } from '../../components/DocPage'
import { AppFipsHeaderLogo } from '../../../components/composites/AppFipsHeaderLogo'
import { useFipsTheme } from '../../../hooks/useFipsTheme'

export default function AppFipsHeaderLogoDoc() {
  const { dark } = useFipsTheme()

  return (
    <DocPage
      title="Marca App FIPS (header)"
      description="PNG light/dark no header só abaixo de lg; em desktop a marca fica na sidebar. Paridade Gestão OPA."
    >
      <DemoSection title="Uso no header">
        <p className="text-sm text-[var(--color-fg-muted)]">
          Import: <code>AppFipsHeaderLogo</code>. Passe <code>theme=&quot;light&quot; | &quot;dark&quot;</code> conforme o
          tema do app. Renderize com <code className="font-mono text-xs">lg:hidden</code> no shell, entre hambúrguer e trilho (Gestão OPA).
          Altura típica <code>h-7</code>. Claro: <code>/appfips-logo-full.png</code>; escuro: <code>/appfips-logo.png</code> (lockup branco).
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 rounded-[12px_12px_12px_24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 shadow-[0_1px_3px_rgba(0,75,155,.04)]">
          <AppFipsHeaderLogo theme={dark ? 'dark' : 'light'} />
          <span className="truncate text-sm font-semibold text-[var(--color-fg)]">Home</span>
        </div>
        <p className="mt-3 text-xs text-[var(--color-fg-muted)]">
          Padrão completo:{' '}
          <a href="/docs/components/header#header-app-fips-logo" className="font-semibold text-[var(--color-primary)]">
            Header → anatomia (marca &lt; lg)
          </a>
          .
          O site de documentação usa o mesmo composite em <code>DocLayout</code>.
        </p>
      </DemoSection>
    </DocPage>
  )
}
