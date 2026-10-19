// DS-FIPS — Table with sorting & pagination — Copy-paste ready
import { useState, useMemo } from "react";

const C = {
  azulProfundo: "var(--color-gov-azul-profundo)",
  azulEscuro: "var(--color-gov-azul-escuro)",
  cinzaChumbo: "var(--color-fg-muted)",
  cinzaEscuro: "var(--color-fg)",
  cinzaClaro: "#C0CCD2",
  azulCeu: "#93BDE4",
  azulCeuClaro: "#D3E3F4",
  amareloOuro: "#FDC24E",
  verdeFloresta: "#00C64C",
  branco: "#FFFFFF",
  bg: "var(--color-surface-muted)",
  cardBg: "var(--color-surface)",
  cardBorder: "var(--color-border)",
  textLight: "var(--color-fg-muted)",
};

const Fn = {
  title: "'Saira Expanded', sans-serif",
  body: "'Open Sans', sans-serif",
  mono: "'Fira Code', monospace",
};

interface Column {
  key: string;
  label: string;
  width?: number | string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: any) => React.ReactNode;
}

export function DSTable({
  columns = [], data = [], striped = true, compact = false,
  sortable = true, paginate = 0, footer,
}: {
  columns: Column[]; data: any[]; striped?: boolean; compact?: boolean;
  sortable?: boolean; paginate?: number; footer?: React.ReactNode;
}) {
  const [sortCol, setSortCol] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [hoverRow, setHoverRow] = useState(-1);
  const py = compact ? 6 : 10;
  const fs = compact ? 11 : 12;

  const toggleSort = (key: string) => {
    if (!sortable) return;
    if (sortCol === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortCol(key); setSortDir("asc"); }
  };

  const sorted = useMemo(() => {
    if (!sortCol) return data;
    return [...data].sort((a, b) => {
      const av = a[sortCol], bv = b[sortCol];
      if (typeof av === "number" && typeof bv === "number") return sortDir === "asc" ? av - bv : bv - av;
      return sortDir === "asc" ? String(av || "").localeCompare(String(bv || "")) : String(bv || "").localeCompare(String(av || ""));
    });
  }, [data, sortCol, sortDir]);

  const totalPages = paginate ? Math.ceil(sorted.length / paginate) : 1;
  const paged = paginate ? sorted.slice((page - 1) * paginate, page * paginate) : sorted;

  const SortIcon = ({ col }: { col: string }) => {
    if (sortCol !== col) return <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M5 6l3-3 3 3M5 10l3 3 3-3" stroke={C.cinzaClaro} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    return sortDir === "asc"
      ? <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M5 6l3-3 3 3" stroke={C.azulProfundo} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
      : <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M8 13V3M5 10l3 3 3-3" stroke={C.azulProfundo} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  };

  return (
    <div style={{ border: `1px solid ${C.cardBorder}`, borderRadius: "12px 12px 12px 24px", overflow: "hidden", background: C.cardBg }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: Fn.body }}>
          <thead>
            <tr style={{ background: C.bg, borderBottom: `2px solid ${C.cardBorder}` }}>
              {columns.map((col) => (
                <th key={col.key} onClick={() => sortable && toggleSort(col.key)}
                  style={{ padding: `${py}px 16px`, fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".5px", color: C.cinzaEscuro, fontFamily: Fn.title, textAlign: col.align || "left", cursor: sortable ? "pointer" : "default", whiteSpace: "nowrap", width: col.width, userSelect: "none" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {col.label}{sortable && <SortIcon col={col.key} />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((row, ri) => (
              <tr key={ri}
                onMouseEnter={() => setHoverRow(ri)} onMouseLeave={() => setHoverRow(-1)}
                style={{ borderBottom: `1px solid ${C.cardBorder}`, background: hoverRow === ri ? `${C.amareloOuro}18` : striped && ri % 2 === 1 ? `${C.azulCeu}0D` : "transparent", transition: "background .12s" }}>
                {columns.map((col) => (
                  <td key={col.key} style={{ padding: `${py}px 16px`, fontSize: fs, color: C.cinzaEscuro, textAlign: col.align || "left" }}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {(paginate > 0 || footer) && (
        <div style={{ padding: "10px 16px", background: C.bg, borderTop: `1px solid ${C.cardBorder}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          {footer || <span />}
          {paginate > 0 && totalPages > 1 && (
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ padding: "4px 10px", fontSize: 11, fontWeight: 600, fontFamily: Fn.body, background: page <= 1 ? "transparent" : C.cardBg, color: page <= 1 ? C.textLight : C.azulProfundo, border: `1px solid ${page <= 1 ? C.cardBorder : C.azulCeu}`, borderRadius: 5, cursor: page <= 1 ? "default" : "pointer" }}>Anterior</button>
              <span style={{ fontSize: 11, color: C.cinzaChumbo, fontFamily: Fn.mono, padding: "0 8px" }}>{page}/{totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} style={{ padding: "4px 10px", fontSize: 11, fontWeight: 600, fontFamily: Fn.body, background: page >= totalPages ? "transparent" : C.cardBg, color: page >= totalPages ? C.textLight : C.azulProfundo, border: `1px solid ${page >= totalPages ? C.cardBorder : C.azulCeu}`, borderRadius: 5, cursor: page >= totalPages ? "default" : "pointer" }}>Próxima</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Usage:
// <DSTable
//   columns={[
//     { key: "id", label: "Codigo", width: 80 },
//     { key: "nome", label: "Nome" },
//     { key: "status", label: "Status", render: (v) => <span style={{color: v==="Ativo"?"green":"red"}}>{v}</span> },
//   ]}
//   data={[{ id: 1, nome: "FIPS", status: "Ativo" }, { id: 2, nome: "MRS", status: "Inativo" }]}
//   paginate={10}
//   footer={<span>Total: 2 registros</span>}
// />
