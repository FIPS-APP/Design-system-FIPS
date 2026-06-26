import { useState, useEffect, useCallback, useRef, createContext, useContext, type ReactNode } from 'react'

/* ═══════════════════════════════════════════
   CodePlayground — Clique em qualquer elemento → copia código → preview ao lado
   Padrão DS-FIPS para todas as DocPages
   ═══════════════════════════════════════════ */

/* ── Context para conectar elementos clicáveis ao playground ── */

interface PlaygroundState {
  code: string
  preview: ReactNode | null
  copiedLabel: string | null
}

interface PlaygroundCtx extends PlaygroundState {
  send: (label: string, code: string, preview: ReactNode) => void
}

const Ctx = createContext<PlaygroundCtx>({
  code: '',
  preview: null,
  copiedLabel: null,
  send: () => {},
})

export function usePlayground() {
  return useContext(Ctx)
}

/* ── Provider: envolve a página inteira ── */

export function PlaygroundProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlaygroundState>({ code: '', preview: null, copiedLabel: null })

  const send = useCallback((label: string, code: string, preview: ReactNode) => {
    navigator.clipboard.writeText(code).catch(() => {})
    setState({ code, preview, copiedLabel: label })
    setTimeout(() => setState((s) => (s.copiedLabel === label ? { ...s, copiedLabel: null } : s)), 2000)
  }, [])

  return <Ctx.Provider value={{ ...state, send }}>{children}</Ctx.Provider>
}

/* ── Wrapper clicável para qualquer elemento demo ── */

export function Copyable({
  label,
  code,
  preview,
  children,
  fullWidth = false,
}: {
  label: string
  code: string
  preview: ReactNode
  children: ReactNode
  fullWidth?: boolean
}) {
  const { send, copiedLabel } = usePlayground()
  const isCopied = copiedLabel === label

  return (
    <div
      onClick={(e) => {
        e.stopPropagation()
        send(label, code, preview)
      }}
      title={`Clique para copiar código: ${label}`}
      style={{
        position: 'relative',
        display: fullWidth ? 'block' : 'inline-flex',
        width: fullWidth ? '100%' : undefined,
        cursor: 'pointer',
        transition: 'all .15s',
        borderRadius: 8,
        outline: isCopied ? '2px solid #00C64C' : '2px solid transparent',
        outlineOffset: 3,
      }}
    >
      {children}
      {isCopied && (
        <div
          style={{
            position: 'absolute',
            top: -28,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#00C64C',
            color: '#fff',
            fontSize: 10,
            fontWeight: 700,
            padding: '3px 10px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            fontFamily: "'Open Sans', sans-serif",
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          Copiado!
        </div>
      )}
    </div>
  )
}

/* ── Playground: código + preview side-by-side ── */

export function CodePlayground() {
  const { code, preview } = usePlayground()
  const [running, setRunning] = useState(false)
  const prevCodeRef = useRef(code)

  // Auto-run quando um novo elemento é clicado
  useEffect(() => {
    if (code && code !== prevCodeRef.current) {
      prevCodeRef.current = code
      setRunning(true)
    }
  }, [code])

  const displayCode = code
  const displayPreview = running ? preview : null

  const handleRun = () => {
    setRunning(true)
  }

  const handleClear = () => {
    setRunning(false)
  }

  if (!code) {
    return (
      <section style={{ marginBottom: 44, marginTop: 32 }}>
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--color-gov-azul-claro)',
            fontFamily: "'Saira Expanded', sans-serif",
            marginBottom: 6,
          }}
        >
          PLAYGROUND
        </div>
        <h2
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--color-fg)',
            margin: '0 0 4px',
            fontFamily: "'Saira Expanded', sans-serif",
            letterSpacing: '0.5px',
          }}
        >
          Teste ao Vivo
        </h2>
        <p
          style={{
            fontSize: 14,
            color: 'var(--color-fg-muted)',
            margin: '0 0 20px',
            lineHeight: 1.55,
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          Clique em qualquer elemento acima para copiar o código e visualizar aqui.
        </p>
        <div
          style={{
            border: '2px dashed var(--color-border)',
            borderRadius: '12px 12px 12px 20px',
            padding: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-fg-muted)',
            fontSize: 13,
            fontFamily: "'Open Sans', sans-serif",
          }}
        >
          Nenhum elemento selecionado. Clique em qualquer componente acima.
        </div>
      </section>
    )
  }

  return (
    <section style={{ marginBottom: 44, marginTop: 32 }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '2px',
          textTransform: 'uppercase',
          color: 'var(--color-gov-azul-claro)',
          fontFamily: "'Saira Expanded', sans-serif",
          marginBottom: 6,
        }}
      >
        PLAYGROUND
      </div>
      <h2
        style={{
          fontSize: 20,
          fontWeight: 700,
          color: 'var(--color-fg)',
          margin: '0 0 4px',
          fontFamily: "'Saira Expanded', sans-serif",
          letterSpacing: '0.5px',
        }}
      >
        Teste ao Vivo
      </h2>
      <p
        style={{
          fontSize: 14,
          color: 'var(--color-fg-muted)',
          margin: '0 0 20px',
          lineHeight: 1.55,
          fontFamily: "'Open Sans', sans-serif",
        }}
      >
        Código copiado automaticamente. Cole, edite ou clique em Rodar para visualizar.
      </p>

      <div
        style={{
          borderRadius: '12px 12px 12px 20px',
          border: '1px solid var(--color-border)',
          overflow: 'hidden',
          background: 'var(--color-surface)',
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 20px',
            background: 'var(--color-surface-muted)',
            borderBottom: '1px solid var(--color-border)',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: 'var(--color-fg-muted)',
              fontFamily: "'Saira Expanded', sans-serif",
            }}
          >
            {displayCode.split('\n').length} linhas · TSX · Código copiado
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {running ? (
              <PlayBtn label="✕ Limpar" color="#546E7A" onClick={handleClear} />
            ) : (
              <PlayBtn label="▶ Rodar" color="#00904C" onClick={handleRun} />
            )}
          </div>
        </div>

        {/* Code + Preview side by side */}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Code panel */}
          <pre
            style={{
              margin: 0,
              padding: '18px 20px',
              background: '#0F172A',
              color: '#E2E8F0',
              fontFamily: "'Fira Code', monospace",
              fontSize: 11.5,
              lineHeight: 1.7,
              overflowX: 'auto',
              maxHeight: 400,
              overflowY: 'auto',
              whiteSpace: 'pre',
              tabSize: 2,
              flex: '1 1 400px',
              minWidth: 0,
            }}
          >
            <code>{displayCode}</code>
          </pre>

          {/* Preview panel */}
          <div
            style={{
              flex: '1 1 350px',
              minWidth: 0,
              maxHeight: 400,
              overflowY: 'auto',
              borderLeft: '1px solid var(--color-border)',
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--color-surface-muted)',
            }}
          >
            {!running ? (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 14,
                  padding: 24,
                  margin: 16,
                  borderRadius: 10,
                  border: '2px dashed var(--color-border)',
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    color: 'var(--color-fg-muted)',
                    fontFamily: "'Open Sans', sans-serif",
                    textAlign: 'center',
                  }}
                >
                  Clique em ▶ Rodar para visualizar o resultado
                </span>
              </div>
            ) : (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: '1px',
                      textTransform: 'uppercase',
                      color: 'var(--color-fg-muted)',
                      fontFamily: "'Saira Expanded', sans-serif",
                    }}
                  >
                    Preview
                  </span>
                </div>
                <div
                  style={{
                    padding: 20,
                    flex: 1,
                    overflow: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {displayPreview}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── CopyableInline — wrapper sem botão de código ── */

export function CopyableInline({
  children,
}: {
  label?: string
  code?: string
  preview?: ReactNode
  children: ReactNode
}) {
  return <>{children}</>
}

/* ── Botão auxiliar ── */

function PlayBtn({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
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
