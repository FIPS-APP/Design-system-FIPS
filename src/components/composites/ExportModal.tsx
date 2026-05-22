import { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  FileSpreadsheet,
  FileText,
  Printer,
  Maximize2,
  Minimize2,
  GripVertical,
  Table2,
  Layers,
  LayoutGrid,
} from "lucide-react";
import { cn } from "../../lib/cn";
import { useDsTheme } from "../../hooks/useDsTheme";
import { exportXLSX, exportPDF, exportPrint } from "../../utils/exportData";
import type { ExportCatalog } from "../../utils/exportHelpers";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface ColItem {
  id: string;
  key: string;
  label: string;
  section?: "main" | "expanded";
  checked: boolean;
}

export interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  catalog: ExportCatalog;
  rows: any[];
  filterPills?: string[];
  filename?: string;
}

type ModalSize = "normal" | "grande" | "tela-cheia";
type SectionFilter = "all" | "main" | "expanded";

const MODAL_SIZES: Record<ModalSize, { maxW: string; maxH: string; label: string }> = {
  normal:       { maxW: "max-w-2xl",  maxH: "max-h-[82vh]", label: "Normal" },
  grande:       { maxW: "max-w-4xl",  maxH: "max-h-[90vh]", label: "Grande" },
  "tela-cheia": { maxW: "max-w-6xl",  maxH: "max-h-[95vh]", label: "Tela cheia" },
};
const SIZE_ORDER: ModalSize[] = ["normal", "grande", "tela-cheia"];
const PREVIEW_LIMIT = 10;

// ─── Componente Principal ────────────────────────────────────────────────────

export function ExportModal({
  open,
  onClose,
  title,
  subtitle,
  catalog,
  rows,
  filterPills = [],
  filename,
}: ExportModalProps) {
  const { dark } = useDsTheme();
  const [cols, setCols] = useState<ColItem[]>([]);
  const [size, setSize] = useState<ModalSize>("grande");
  const [sectionFilter, setSectionFilter] = useState<SectionFilter>("all");
  const [dragSrc, setDragSrc] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const dragNode = useRef<HTMLElement | null>(null);

  const previewRows = useMemo(() => rows.slice(0, PREVIEW_LIMIT), [rows]);

  const hasMain = useMemo(() => catalog.some((c) => c.section === "main"), [catalog]);
  const hasExpanded = useMemo(() => catalog.some((c) => c.section === "expanded"), [catalog]);
  const hasSections = hasMain && hasExpanded;

  useEffect(() => {
    if (open) {
      setCols(
        catalog
          .filter((c) => c.id !== "select" && c.id !== "actions")
          .map((c) => ({ ...c, checked: true })),
      );
      setSize("grande");
      setSectionFilter("all");
    }
  }, [open, catalog]);

  // ─── Shell — dark/light (mesmo padrão do AssistenteIA) ───────────────────
  const shell = dark
    ? {
        panelBg: "linear-gradient(165deg,#232328 0%,#1a1a1e 50%,#151518 100%)",
        panelBorder: "1px solid rgba(255,255,255,0.08)",
        panelShadow: "0 30px 60px -15px rgba(0,0,0,0.6),0 0 0 1px rgba(255,255,255,0.04) inset,0 1px 0 rgba(255,255,255,0.06) inset",
        title: "#fafafa",
        subtitle: "#71717a",
        iconTileBg: "linear-gradient(160deg,#303036 0%,#222226 55%,#1c1c20 100%)",
        iconTileBorder: "1px solid #3f3f46",
        iconTileShadow: "0 3px 10px rgba(0,0,0,0.55),0 1px 0 rgba(255,255,255,0.08) inset,0 -1px 0 rgba(0,0,0,0.45) inset",
        iconColor: "#a1a1aa",
        headerBorder: "rgba(255,255,255,0.06)",
        closeBg: "rgba(255,255,255,0.04)",
        closeBorder: "rgba(255,255,255,0.08)",
        closeColor: "#71717a",
        tabActiveBg: "rgba(255,255,255,0.10)",
        tabActiveBorder: "rgba(255,255,255,0.16)",
        tabActiveColor: "#fafafa",
        tabInactiveBg: "rgba(255,255,255,0.04)",
        tabInactiveBorder: "rgba(255,255,255,0.07)",
        tabInactiveColor: "#71717a",
        filterPillBg: "rgba(255,255,255,0.06)",
        filterPillBorder: "rgba(255,255,255,0.10)",
        filterPillColor: "#d1d5db",
        colLabelColor: "#52525b",
        toggleBtnBg: "rgba(255,255,255,0.04)",
        toggleBtnBorder: "rgba(255,255,255,0.10)",
        toggleBtnColor: "#71717a",
        toggleBtnHoverBg: "rgba(255,255,255,0.08)",
        toggleBtnHoverColor: "#a1a1aa",
        chipUncheckedBorder: "rgba(255,255,255,0.10)",
        chipUncheckedColor: "#71717a",
        emptyColor: "#71717a",
        tableBorder: "rgba(255,255,255,0.08)",
        theadBg: "rgba(255,255,255,0.04)",
        theadBorder: "rgba(255,255,255,0.08)",
        theadColor: "#71717a",
        tbodyOddBg: "rgba(255,255,255,0.025)",
        cellBorder: "rgba(255,255,255,0.05)",
        cellColor: "#e5e7eb",
        cellEmptyColor: "#52525b",
        paginationBorder: "rgba(255,255,255,0.06)",
        paginationBg: "rgba(255,255,255,0.02)",
        paginationColor: "#52525b",
        footerBorder: "rgba(255,255,255,0.06)",
        footerBg: "rgba(0,0,0,0.25)",
        footerInfoColor: "#71717a",
        cancelBg: "rgba(255,255,255,0.05)",
        cancelBorder: "rgba(255,255,255,0.10)",
        cancelColor: "#a1a1aa",
        cancelHoverBg: "rgba(255,255,255,0.09)",
        cancelHoverColor: "#fafafa",
      }
    : {
        panelBg: "linear-gradient(165deg,#fafafa 0%,#f0f0f2 50%,#e8e8ec 100%)",
        panelBorder: "1px solid rgba(0,0,0,0.1)",
        panelShadow: "0 24px 48px -12px rgba(0,0,0,0.18),0 0 0 1px rgba(255,255,255,0.8) inset,0 1px 0 rgba(255,255,255,0.9) inset",
        title: "#18181b",
        subtitle: "#71717a",
        iconTileBg: "linear-gradient(145deg,#ffffff 0%,#ebebeb 55%,#e0e0e0 100%)",
        iconTileBorder: "1px solid rgba(0,0,0,0.10)",
        iconTileShadow: "0 1px 2px rgba(0,0,0,0.06),inset 0 1px 0 rgba(255,255,255,0.85)",
        iconColor: "rgba(55,55,55,0.82)",
        headerBorder: "rgba(0,0,0,0.08)",
        closeBg: "rgba(0,0,0,0.04)",
        closeBorder: "rgba(0,0,0,0.08)",
        closeColor: "#71717a",
        tabActiveBg: "rgba(0,0,0,0.08)",
        tabActiveBorder: "rgba(0,0,0,0.14)",
        tabActiveColor: "#18181b",
        tabInactiveBg: "rgba(0,0,0,0.03)",
        tabInactiveBorder: "rgba(0,0,0,0.06)",
        tabInactiveColor: "#71717a",
        filterPillBg: "rgba(0,0,0,0.05)",
        filterPillBorder: "rgba(0,0,0,0.10)",
        filterPillColor: "#374151",
        colLabelColor: "#9ca3af",
        toggleBtnBg: "rgba(0,0,0,0.04)",
        toggleBtnBorder: "rgba(0,0,0,0.10)",
        toggleBtnColor: "#6b7280",
        toggleBtnHoverBg: "rgba(0,0,0,0.08)",
        toggleBtnHoverColor: "#374151",
        chipUncheckedBorder: "rgba(0,0,0,0.12)",
        chipUncheckedColor: "#6b7280",
        emptyColor: "#9ca3af",
        tableBorder: "rgba(0,0,0,0.10)",
        theadBg: "rgba(0,0,0,0.04)",
        theadBorder: "rgba(0,0,0,0.08)",
        theadColor: "#6b7280",
        tbodyOddBg: "rgba(0,0,0,0.025)",
        cellBorder: "rgba(0,0,0,0.06)",
        cellColor: "#27272a",
        cellEmptyColor: "#9ca3af",
        paginationBorder: "rgba(0,0,0,0.08)",
        paginationBg: "rgba(0,0,0,0.03)",
        paginationColor: "#9ca3af",
        footerBorder: "rgba(0,0,0,0.08)",
        footerBg: "rgba(0,0,0,0.04)",
        footerInfoColor: "#6b7280",
        cancelBg: "rgba(0,0,0,0.04)",
        cancelBorder: "rgba(0,0,0,0.10)",
        cancelColor: "#374151",
        cancelHoverBg: "rgba(0,0,0,0.08)",
        cancelHoverColor: "#18181b",
      };

  if (!open) return null;

  const sz = MODAL_SIZES[size];
  const sizeIdx = SIZE_ORDER.indexOf(size);
  const nextSize = SIZE_ORDER[(sizeIdx + 1) % SIZE_ORDER.length];
  const isMax = size === "tela-cheia";

  const visibleCols = cols.filter((c) => {
    if (sectionFilter === "all") return true;
    if (sectionFilter === "main") return c.section !== "expanded";
    return c.section === "expanded";
  });

  const checkedCols = cols.filter((c) => c.checked);
  const visibleChecked = visibleCols.filter((c) => c.checked);
  const allVisibleChecked = visibleCols.length > 0 && visibleCols.every((c) => c.checked);
  const someChecked = cols.some((c) => c.checked);

  const toggleAll = () => {
    const visibleIds = new Set(visibleCols.map((c) => c.id));
    setCols((cs) =>
      cs.map((c) => (visibleIds.has(c.id) ? { ...c, checked: !allVisibleChecked } : c)),
    );
  };
  const toggleOne = (id: string) =>
    setCols((cs) => cs.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c)));

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDragSrc(id);
    dragNode.current = e.currentTarget as HTMLElement;
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (id !== dragSrc) setDragOver(id);
  };
  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!dragSrc || dragSrc === targetId) { setDragSrc(null); setDragOver(null); return; }
    setCols((cs) => {
      const arr = [...cs];
      const from = arr.findIndex((c) => c.id === dragSrc);
      const to = arr.findIndex((c) => c.id === targetId);
      if (from === -1 || to === -1) return cs;
      arr.splice(to, 0, arr.splice(from, 1)[0]);
      return arr;
    });
    setDragSrc(null);
    setDragOver(null);
  };
  const handleDragEnd = () => { setDragSrc(null); setDragOver(null); };

  const exportCols = checkedCols.map((c) => ({ key: c.key, label: c.label }));
  const filterLabel = filterPills.join(" · ");
  const baseFilename = filename ?? title.toLowerCase().replace(/\s+/g, "_");

  const doExcel = () => { exportXLSX(rows, exportCols, baseFilename, filterLabel || undefined); onClose(); };
  const doPDF = () => { exportPDF(rows, exportCols, title + (subtitle ? ` — ${subtitle}` : ""), filterLabel || undefined); onClose(); };
  const doPrint = () => { exportPrint(rows, exportCols, title + (subtitle ? ` — ${subtitle}` : ""), filterLabel || undefined); onClose(); };

  return createPortal(
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-[6px]" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={cn(
            "pointer-events-auto w-full flex flex-col overflow-hidden rounded-2xl",
            "transition-all duration-200",
            sz.maxW,
            sz.maxH,
          )}
          style={{
            background: shell.panelBg,
            border: shell.panelBorder,
            boxShadow: shell.panelShadow,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Linha vermelha no topo */}
          <div style={{ height: 3, background: "linear-gradient(90deg,var(--color-primary),var(--color-primary-hover) 50%,transparent)", borderRadius: "20px 20px 0 0", flexShrink: 0 }} />

          {/* ── Header ────────────────────────────────────────── */}
          <div className="flex-shrink-0 px-5 pt-4 pb-4" style={{ borderBottom: `1px solid ${shell.headerBorder}` }}>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex flex-shrink-0 items-center justify-center"
                  style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: shell.iconTileBg,
                    border: shell.iconTileBorder,
                    boxShadow: shell.iconTileShadow,
                    color: shell.iconColor,
                  }}
                >
                  <FileSpreadsheet className="h-4 w-4" />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: shell.title, letterSpacing: "-0.02em", lineHeight: 1.2 }}>
                    Preview de Exportação
                  </div>
                  <div style={{ fontSize: 11, color: shell.subtitle, marginTop: 2 }}>
                    {rows.length} registros · {checkedCols.length}/{cols.length} colunas selecionadas
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-0.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setSize(nextSize)}
                  title={`${sz.label} → ${MODAL_SIZES[nextSize].label}`}
                  style={{ width: 28, height: 28, borderRadius: 8, background: shell.closeBg, border: `1px solid ${shell.closeBorder}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: shell.closeColor, transition: "all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"; e.currentTarget.style.color = shell.title; }}
                  onMouseLeave={e => { e.currentTarget.style.background = shell.closeBg; e.currentTarget.style.color = shell.closeColor; }}
                >
                  {isMax ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  style={{ width: 28, height: 28, borderRadius: 8, background: shell.closeBg, border: `1px solid ${shell.closeBorder}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: shell.closeColor, transition: "all .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 15%, transparent)"; e.currentTarget.style.borderColor = "color-mix(in srgb, var(--color-primary) 30%, transparent)"; e.currentTarget.style.color = "var(--color-primary)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = shell.closeBg; e.currentTarget.style.borderColor = shell.closeBorder; e.currentTarget.style.color = shell.closeColor; }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Section tabs */}
            {hasSections && (
              <div className="mt-3.5 flex gap-1.5">
                {(
                  [
                    { key: "all",      icon: LayoutGrid, label: "Tudo"      },
                    { key: "main",     icon: Table2,     label: "Tabela"    },
                    { key: "expanded", icon: Layers,     label: "Expandida" },
                  ] as const
                ).map(({ key, icon: Icon, label }) => {
                  const active = sectionFilter === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSectionFilter(key)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all"
                      style={{
                        background: active ? shell.tabActiveBg : shell.tabInactiveBg,
                        border: `1px solid ${active ? shell.tabActiveBorder : shell.tabInactiveBorder}`,
                        color: active ? shell.tabActiveColor : shell.tabInactiveColor,
                      }}
                    >
                      <Icon className="h-3 w-3" />
                      {label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Body ──────────────────────────────────────────── */}
          <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 flex flex-col gap-4">

            {/* Filtros aplicados */}
            {filterPills.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {filterPills.map((pill, i) => (
                  <span
                    key={i}
                    className="rounded-full px-2.5 py-[3px] text-[10px] font-medium"
                    style={{ background: shell.filterPillBg, border: `1px solid ${shell.filterPillBorder}`, color: shell.filterPillColor }}
                  >
                    {pill}
                  </span>
                ))}
              </div>
            )}

            {/* Chips de coluna com drag-to-reorder */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: shell.colLabelColor }}>
                  Colunas — clique para selecionar/desmarcar · arraste para reordenar
                </span>
                <button
                  type="button"
                  onClick={toggleAll}
                  className="flex-shrink-0 rounded-full px-2.5 py-[3px] text-[10px] transition-colors"
                  style={{ border: `1px solid ${shell.toggleBtnBorder}`, color: shell.toggleBtnColor, background: shell.toggleBtnBg }}
                  onMouseEnter={e => { e.currentTarget.style.background = shell.toggleBtnHoverBg; e.currentTarget.style.color = shell.toggleBtnHoverColor; }}
                  onMouseLeave={e => { e.currentTarget.style.background = shell.toggleBtnBg; e.currentTarget.style.color = shell.toggleBtnColor; }}
                >
                  {allVisibleChecked ? "Desmarcar todos" : "Selecionar todos"}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {visibleCols.map((col) => {
                  const isOver = dragOver === col.id;
                  const isDragging = dragSrc === col.id;
                  return (
                    <div
                      key={col.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, col.id)}
                      onDragOver={(e) => handleDragOver(e, col.id)}
                      onDrop={(e) => handleDrop(e, col.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => toggleOne(col.id)}
                      title={col.checked ? `Remover "${col.label}"` : `Adicionar "${col.label}"`}
                      className={cn(
                        "flex cursor-grab select-none items-center gap-1 rounded-full px-2.5 py-[4px] text-[10px] font-semibold transition-all active:cursor-grabbing",
                        isDragging && "opacity-30 scale-95",
                        isOver && "ring-2 ring-[var(--color-primary)]/40 ring-offset-1",
                      )}
                      style={{
                        background: col.checked ? "color-mix(in srgb, var(--color-primary) 10%, transparent)" : "rgba(120,120,130,0.07)",
                        border: `1px solid ${col.checked ? "color-mix(in srgb, var(--color-primary) 30%, transparent)" : shell.chipUncheckedBorder}`,
                        color: col.checked ? "var(--color-primary)" : shell.chipUncheckedColor,
                      }}
                    >
                      <GripVertical className="h-2.5 w-2.5 opacity-40" />
                      {col.label}
                      {col.checked && (
                        <X
                          className="h-2.5 w-2.5 opacity-50"
                          onClick={(e) => { e.stopPropagation(); toggleOne(col.id); }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {visibleChecked.length === 0 && (
                <p className="mt-2 text-[11px]" style={{ color: shell.emptyColor }}>
                  Selecione ao menos uma coluna para ver o preview e exportar.
                </p>
              )}
            </div>

            {/* Preview table */}
            <div
              className="flex-1 overflow-auto rounded-xl"
              style={{ minHeight: "160px", border: `1px solid ${shell.tableBorder}` }}
            >
              {checkedCols.length === 0 ? (
                <div className="py-12 text-center text-[12px]" style={{ color: shell.emptyColor }}>
                  Selecione colunas acima para visualizar o preview
                </div>
              ) : (
                <table
                  className="w-full border-collapse"
                  style={{ minWidth: `${Math.max(checkedCols.length * 130, 400)}px` }}
                >
                  <thead>
                    <tr>
                      {checkedCols.map((col) => (
                        <th
                          key={col.key}
                          className="sticky top-0 px-3 py-2 text-left whitespace-nowrap"
                          style={{
                            background: shell.theadBg,
                            borderBottom: `1px solid ${shell.theadBorder}`,
                            fontSize: "10px",
                            fontWeight: 700,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: shell.theadColor,
                          }}
                        >
                          {col.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {previewRows.map((row, i) => (
                      <tr
                        key={i}
                        style={{ background: i % 2 === 0 ? "transparent" : shell.tbodyOddBg }}
                      >
                        {checkedCols.map((col) => {
                          const raw = row[col.key];
                          const val = raw == null || raw === "" ? "" : String(raw);
                          return (
                            <td
                              key={col.key}
                              title={val || undefined}
                              className="px-3 py-2"
                              style={{
                                borderBottom: `1px solid ${shell.cellBorder}`,
                                fontSize: "13px",
                                fontWeight: val ? 400 : 300,
                                color: val ? shell.cellColor : shell.cellEmptyColor,
                                maxWidth: "260px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {val || "—"}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {rows.length > PREVIEW_LIMIT && (
                <div
                  className="px-4 py-2 text-center text-[10px]"
                  style={{ borderTop: `1px solid ${shell.paginationBorder}`, background: shell.paginationBg, color: shell.paginationColor }}
                >
                  Mostrando {Math.min(PREVIEW_LIMIT, rows.length)} de {rows.length} registros
                </div>
              )}
            </div>
          </div>

          {/* ── Footer ────────────────────────────────────────── */}
          <div
            className="flex-shrink-0 flex items-center justify-between gap-3 px-5 py-3.5"
            style={{ borderTop: `1px solid ${shell.footerBorder}`, background: shell.footerBg }}
          >
            <span className="text-[11px] font-medium" style={{ color: shell.footerInfoColor }}>
              {checkedCols.length} col{checkedCols.length !== 1 ? "s" : ""} ·{" "}
              {rows.length} linha{rows.length !== 1 ? "s" : ""}
            </span>

            <div className="flex items-center gap-2">
              {/* Cancelar */}
              <button
                type="button"
                onClick={onClose}
                className="flex items-center gap-1.5 rounded-lg px-3.5 py-[7px] text-[12px] font-medium transition-colors"
                style={{ border: `1px solid ${shell.cancelBorder}`, background: shell.cancelBg, color: shell.cancelColor }}
                onMouseEnter={e => { e.currentTarget.style.background = shell.cancelHoverBg; e.currentTarget.style.color = shell.cancelHoverColor; }}
                onMouseLeave={e => { e.currentTarget.style.background = shell.cancelBg; e.currentTarget.style.color = shell.cancelColor; }}
              >
                <X className="h-3.5 w-3.5" />
                Cancelar
              </button>

              {/* Imprimir — outline DS-FIPS primary (azul) */}
              <button
                type="button"
                onClick={doPrint}
                disabled={!someChecked}
                title="Abre janela de impressão do browser"
                className="flex items-center gap-1.5 rounded-lg border px-3.5 py-[7px] text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                style={{ borderColor: "color-mix(in srgb, var(--color-primary) 35%, transparent)", background: "color-mix(in srgb, var(--color-primary) 7%, transparent)", color: "var(--color-primary)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 12%, transparent)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-primary) 7%, transparent)"; }}
              >
                <Printer className="h-3.5 w-3.5" />
                Imprimir
              </button>

              {/* PDF — outline DS-FIPS danger */}
              <button
                type="button"
                onClick={doPDF}
                disabled={!someChecked}
                title="Salvar como PDF (imprimir → Salvar como PDF)"
                className="flex items-center gap-1.5 rounded-lg border px-3.5 py-[7px] text-[12px] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                style={{ borderColor: "color-mix(in srgb, var(--color-danger) 35%, transparent)", background: "color-mix(in srgb, var(--color-danger) 7%, transparent)", color: "var(--color-danger)" }}
                onMouseEnter={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-danger) 12%, transparent)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "color-mix(in srgb, var(--color-danger) 7%, transparent)"; }}
              >
                <FileText className="h-3.5 w-3.5" />
                PDF
              </button>

              {/* Planilha Excel XLSX — DS-FIPS success */}
              <button
                type="button"
                onClick={doExcel}
                disabled={!someChecked}
                title="Baixar planilha Excel (.xlsx) com colunas ajustadas"
                className="flex items-center gap-1.5 rounded-lg px-3.5 py-[7px] text-[12px] font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: someChecked ? "var(--color-success-strong)" : "color-mix(in srgb, var(--color-success-strong) 50%, transparent)" }}
                onMouseEnter={e => { if (someChecked) e.currentTarget.style.background = "var(--color-success)"; }}
                onMouseLeave={e => { if (someChecked) e.currentTarget.style.background = "var(--color-success-strong)"; }}
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                Planilha
              </button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body,
  );
}
