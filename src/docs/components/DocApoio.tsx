import type { ReactNode } from 'react'

/** Tabela de props das páginas de documentação: prop, tipo e o que faz. */
export function TabelaDeProps({ linhas }: { linhas: [string, string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
      <table className="w-full min-w-[34rem] text-left text-xs">
        <thead className="bg-[var(--color-surface-muted)] text-[var(--color-fg)]">
          <tr>
            <th className="px-3 py-2 font-semibold">Prop</th>
            <th className="px-3 py-2 font-semibold">Tipo</th>
            <th className="px-3 py-2 font-semibold">O que faz</th>
          </tr>
        </thead>
        <tbody className="text-[var(--color-fg-muted)]">
          {linhas.map(([p, t, d]) => (
            <tr key={p} className="border-t border-[var(--color-border)] align-top">
              <td className="px-3 py-2 font-mono text-[var(--color-fg)]">{p}</td>
              <td className="px-3 py-2 font-mono">{t}</td>
              <td className="px-3 py-2">{d}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function BlocoDeCodigo({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 text-xs leading-relaxed text-[var(--color-fg)]">
      {children}
    </pre>
  )
}

export function NotaDeDoc({ children }: { children: ReactNode }) {
  return <p className="max-w-3xl text-sm leading-relaxed text-[var(--color-fg-muted)]">{children}</p>
}
