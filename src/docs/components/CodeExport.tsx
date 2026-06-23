import { useState, type ReactNode } from 'react'

/* ──────────────────────────────────────────────────────────────
   Função "Ver código" (CodeExportSection) DESATIVADA a pedido.
   Mantemos esta casca inerte para preservar a compatibilidade de
   tipos dos consumidores (a prop `items` segue tipada) sem renderizar
   a seção de exportação de código no fim das páginas.

   `InlineCodeCopy` (botão de copiar inline, usado em TabsDoc) é
   uma função de cópia distinta e segue ativa.
   ────────────────────────────────────────────────────────────── */

export interface CodeExportItem {
  label: string
  description: string
  code: string
  preview?: ReactNode
}

/** "Ver código" removido — a seção não renderiza mais nada.
 *  `items` é recebido apenas para compat de tipos dos consumidores. */
export function CodeExportSection({ items }: { items: CodeExportItem[] }) {
  void items
  return null
}

function ExportBtn({
  label,
  color,
  onClick,
}: {
  label: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        padding: '8px 20px',
        fontSize: 12,
        fontWeight: 600,
        background: color,
        color: '#fff',
        border: 'none',
        borderRadius: 8,
        cursor: 'pointer',
        fontFamily: "'Open Sans', sans-serif",
        transition: 'all .15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '.85'
        e.currentTarget.style.boxShadow = `0 2px 8px ${color}40`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {label}
    </button>
  )
}

export function InlineCodeCopy({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const doCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <ExportBtn
          label={expanded ? '{ } Ocultar' : `{ } ${label}`}
          color="#546E7A"
          onClick={() => setExpanded((e) => !e)}
        />
        <ExportBtn
          label={copied ? '✓ Copiado!' : '📋 Copiar'}
          color={copied ? '#00C64C' : '#004B9B'}
          onClick={doCopy}
        />
      </div>
      {expanded && (
        <pre
          style={{
            margin: '10px 0 0',
            padding: '14px 16px',
            background: '#0F172A',
            color: '#E2E8F0',
            fontFamily: "'Fira Code', monospace",
            fontSize: 11,
            lineHeight: 1.6,
            overflowX: 'auto',
            maxHeight: 350,
            overflowY: 'auto',
            whiteSpace: 'pre',
            tabSize: 2,
            borderRadius: '8px 8px 8px 14px',
            border: '1px solid rgba(147,189,228,0.15)',
          }}
        >
          <code>{code}</code>
        </pre>
      )}
    </div>
  )
}
