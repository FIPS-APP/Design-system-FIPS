// DS-FIPS — Card — Copy-paste ready
import React from "react";

const C = {
  azulProfundo: "var(--color-gov-azul-profundo)",
  azulEscuro: "var(--color-gov-azul-escuro)",
  azulClaro: "var(--color-gov-azul-claro)",
  fg: "var(--color-fg)",
  fgMuted: "var(--color-fg-muted)",
  surface: "var(--color-surface)",
  surfaceMuted: "var(--color-surface-muted)",
  border: "var(--color-border)",
  branco: "#FFFFFF",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

interface CardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Card({ children, style }: CardProps) {
  return (
    <div style={{
      background: C.surface,
      borderRadius: "12px 12px 12px 24px",
      border: `1px solid ${C.border}`,
      padding: 28,
      boxShadow: "0 1px 3px rgba(0,75,155,.04), 0 4px 14px rgba(0,75,155,.03)",
      ...style,
    }}>
      {children}
    </div>
  );
}

interface CardResumoProps {
  title: string;
  desc?: string;
  children?: React.ReactNode;
  badges?: React.ReactNode;
  footer?: React.ReactNode;
}

export function CardResumo({ title, desc, children, badges, footer }: CardResumoProps) {
  return (
    <div style={{
      background: C.surface,
      borderRadius: "12px 12px 12px 24px",
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 3px rgba(0,75,155,.04)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 24px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.fg, margin: "0 0 4px", fontFamily: Fn.title }}>{title}</h3>
        {desc && <p style={{ fontSize: 13, color: C.fgMuted, margin: "0 0 12px", lineHeight: 1.5, fontFamily: Fn.body }}>{desc}</p>}
        {children}
        {badges && <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>{badges}</div>}
      </div>
      {footer && (
        <div style={{
          padding: "12px 24px",
          background: C.surfaceMuted,
          borderTop: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>{footer}</div>
      )}
    </div>
  );
}

interface CardAcaoProps {
  title: string;
  desc?: string;
  primary?: string;
  secondary?: string;
  children?: React.ReactNode;
}

export function CardAcao({ title, desc, primary, secondary, children }: CardAcaoProps) {
  return (
    <div style={{
      background: C.surface,
      borderRadius: "12px 12px 12px 24px",
      border: `1px solid ${C.border}`,
      boxShadow: "0 1px 3px rgba(0,75,155,.04)",
      overflow: "hidden",
    }}>
      <div style={{ padding: "20px 24px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.fg, margin: "0 0 8px", fontFamily: Fn.title }}>{title}</h3>
        {desc && <p style={{ fontSize: 13, color: C.fgMuted, margin: "0 0 12px", lineHeight: 1.5, fontFamily: Fn.body }}>{desc}</p>}
        {children}
      </div>
      {(primary || secondary) && (
        <div style={{
          padding: "12px 24px",
          background: C.surfaceMuted,
          borderTop: `1px solid ${C.border}`,
          display: "flex", gap: 10, justifyContent: "flex-end",
        }}>
          {secondary && <button style={{ padding: "6px 16px", fontSize: 12, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 6, color: C.fgMuted, cursor: "pointer", fontFamily: Fn.body }}>{secondary}</button>}
          {primary && <button style={{ padding: "6px 16px", fontSize: 12, background: C.azulProfundo, border: "none", borderRadius: 6, color: C.branco, cursor: "pointer", fontFamily: Fn.body, fontWeight: 600 }}>{primary}</button>}
        </div>
      )}
    </div>
  );
}

// Usage:
// <Card><p>Conteudo do card</p></Card>
// <CardResumo title="Resumo" desc="Descricao" footer={<span>Ver detalhes</span>} />
// <CardAcao title="Proxima acao" desc="Descricao" primary="Confirmar" secondary="Cancelar" />
