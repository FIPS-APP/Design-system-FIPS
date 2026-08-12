import * as XLSX from "xlsx";

// \u2500\u2500\u2500 Tradu\u00E7\u00E3o de valores enum do banco \u2192 PT-BR leg\u00EDvel \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

const LABEL_MAP: Record<string, string> = {
  // Etapas
  expedicao: "Expedi\u00E7\u00E3o",
  coleta: "Coleta",
  triagem: "Triagem",
  producao: "Produ\u00E7\u00E3o",
  costura: "Costura",
  costureira: "Costureira",
  estoque: "Estoque",
  repanol: "Repanho",
  galpao: "Galp\u00E3o",
  // Status gen\u00E9rico
  pendente: "Pendente",
  aprovado: "Aprovado",
  concluido: "Conclu\u00EDdo",
  cancelado: "Cancelado",
  em_andamento: "Em andamento",
  ativo: "Ativo",
  inativo: "Inativo",
  // Status entrega
  pendente_aprovacao: "Pendente aprova\u00E7\u00E3o",
  em_rota: "Em rota",
  entregue: "Entregue",
  pronto_entrega: "Pronto para entrega",
  // Status financeiro
  pago: "Pago",
  faturado: "Faturado",
  // Status nota
  pendente_emissao: "Pendente emiss\u00E3o",
  emitida: "Emitida",
  cancelada: "Cancelada",
  // Empresas
  tecnopano: "Tecnopano",
  brazil: "Brazil",
  ambas: "Ambas",
};

/** Traduz um valor de enum do banco para PT-BR. Retorna o valor original se n\u00E3o houver mapeamento. */
export function translateExportValue(v: unknown): string {
  if (v == null) return "";
  const str = String(v).trim();
  return LABEL_MAP[str] ?? str;
}

/** Formata uma string ISO de data ("2026-05-11T...") para dd/mm/yyyy. */
export function formatDateBR(d: string | null | undefined): string {
  if (!d) return "";
  const iso = String(d).slice(0, 10);
  const [y, m, day] = iso.split("-");
  if (!y || !m || !day) return String(d);
  return `${day}/${m}/${y}`;
}

/**
 * Exporta dados como planilha XLSX real (Excel nativo) com colunas auto-ajustadas.
 * Usa SheetJS (xlsx) \u2014 mais leg\u00EDvel que CSV e sem problema de separador.
 */
export function exportXLSX(
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[],
  filename: string,
  subtitle?: string,
) {
  const headerRow = columns.map((c) => c.label);
  const dataRows = data.map((row) =>
    columns.map((c) => {
      const v = row[c.key];
      return v == null ? "" : String(v);
    }),
  );

  const aoa = [headerRow, ...dataRows];
  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // Auto-fit: largura = max(header, max conte\u00FAdo) capped em 60 chars
  ws["!cols"] = columns.map((col) => {
    const headerLen = col.label.length;
    const maxData = data.reduce((mx, row) => {
      const v = row[col.key];
      return Math.max(mx, v == null ? 0 : String(v).length);
    }, 0);
    return { wch: Math.min(Math.max(headerLen, maxData) + 2, 60) };
  });

  // Freeze header row
  ws["!freeze"] = { xSplit: 0, ySplit: 1 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Dados");

  // Metadata
  if (subtitle) {
    const metaWs = XLSX.utils.aoa_to_sheet([
      ["Exportado em", new Date().toLocaleString("pt-BR")],
      ["Filtros", subtitle],
      ["Total de registros", data.length],
    ]);
    XLSX.utils.book_append_sheet(wb, metaWs, "Info");
  }

  const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Export data as CSV file download.
 *
 * @param subtitle Filtros aplicados (ex: "search='ATM' \u00B7 Status: pendente"). Quando passado,
 *                 sai como linha "# Filtros: ..." no topo do arquivo (ignorada por leitores
 *                 de CSV padr\u00E3o mas leg\u00EDvel em texto e no Excel se aberto como texto).
 */
export function exportCSV(
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[],
  filename: string,
  subtitle?: string,
) {
  const SEP = ";"; // ponto-e-v\u00EDrgula = padr\u00E3o CSV para Excel brasileiro
  const esc = (v: unknown) => {
    if (v == null) return "";
    const str = String(v).replace(/"/g, '""');
    return str.includes(SEP) || str.includes('"') || str.includes("\n") ? `"${str}"` : str;
  };

  const header = columns.map(c => esc(c.label)).join(SEP);
  const rows = data.map(row => columns.map(c => esc(row[c.key])).join(SEP));

  const lines: string[] = [];
  // "sep=" hint \u2014 instrui Excel qual separador usar ao abrir .csv
  lines.push(`sep=${SEP}`);
  if (subtitle && subtitle.trim()) {
    lines.push(`# Filtros: ${subtitle.replace(/[\r\n]+/g, " ")}`);
    lines.push(`# Exportado em ${new Date().toLocaleString("pt-BR")} \u2014 ${data.length} registros`);
  }
  lines.push(header);
  lines.push(...rows);

  const csv = lines.join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Abre uma nova janela com tabela otimizada para impressão — tema dark matching o sistema.
 * Preview escuro; @media print reverte para branco/papel.
 */
export function exportPrint(
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[],
  title: string,
  subtitle?: string,
) {
  const w = window.open("about:blank", "_blank", "width=1200,height=820");
  if (!w) return;

  const escape = (v: unknown) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

  const tableRows = data
    .map(
      (row) =>
        `<tr>${columns.map((c) => `<td>${row[c.key] == null ? "" : escape(row[c.key])}</td>`).join("")}</tr>`,
    )
    .join("");

  const filtrosLine =
    subtitle && subtitle.trim()
      ? `<div class="filtros"><span class="filtros-icon">⊘</span> Filtros: ${escape(subtitle)}</div>`
      : "";

  const printerSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`;
  const closeSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`;

  w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escape(title)}</title>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:Arial,Helvetica,sans-serif;background:#0f0f0f;color:#fafafa;min-height:100vh;padding:20px 16px 40px}
  .wrap{background:#1a1a1a;border:1px solid rgba(255,255,255,0.08);border-top:2px solid #FF073A;border-radius:12px;max-width:1160px;margin:0 auto;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.6)}
  .hdr{background:#111;padding:14px 18px;display:flex;align-items:center;gap:12px;border-bottom:1px solid rgba(255,255,255,0.06)}
  .hdr-icon{width:36px;height:36px;background:#222;border-radius:10px;box-shadow:4px 4px 8px #0a0a0a,-4px -4px 8px #2a2a2a;border:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#fff}
  .hdr-text{flex:1;min-width:0}
  .hdr-title{font-size:14px;font-weight:700;color:#fafafa;line-height:1.2}
  .hdr-sub{font-size:11px;color:rgba(255,255,255,0.4);margin-top:2px}
  .hdr-close{width:26px;height:26px;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:7px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.5);flex-shrink:0}
  .hdr-close:hover{background:rgba(237,27,36,0.25);border-color:rgba(237,27,36,0.4);color:#fff}
  .body{padding:18px}
  .filtros{font-size:11px;color:#fca5a5;background:rgba(178,0,40,0.15);border-left:3px solid #B20028;border-radius:4px;padding:7px 12px;margin-bottom:14px;display:flex;align-items:flex-start;gap:6px;line-height:1.4}
  .filtros-icon{opacity:.7;flex-shrink:0}
  .tbl-wrap{overflow-x:auto;border-radius:8px;border:1px solid rgba(255,255,255,0.07)}
  table{border-collapse:collapse;width:100%;font-size:11px}
  thead th{background:#1e1e1e;color:rgba(255,255,255,0.7);padding:8px 10px;text-align:left;font-size:9.5px;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap;position:sticky;top:0;border-bottom:1px solid rgba(255,255,255,0.1)}
  tbody td{padding:6px 10px;border-bottom:1px solid rgba(255,255,255,0.04);color:#d1d5db;vertical-align:top}
  tbody tr:nth-child(even) td{background:rgba(255,255,255,0.02)}
  tbody tr:hover td{background:rgba(255,255,255,0.04)}
  .ftr{padding:12px 18px;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
  .ftr-count{font-size:11px;color:rgba(255,255,255,0.3)}
  .ftr-btns{display:flex;gap:8px}
  .btn-print{background:linear-gradient(135deg,#FF073A,#B20028);color:#fff;border:none;padding:8px 20px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;display:flex;align-items:center;gap:6px;letter-spacing:.02em}
  .btn-print:hover{opacity:.88}
  .btn-close-ftr{background:rgba(255,255,255,0.06);color:#d1d5db;border:1px solid rgba(255,255,255,0.1);padding:8px 14px;border-radius:7px;font-size:12px;cursor:pointer}
  .btn-close-ftr:hover{background:rgba(255,255,255,0.1)}
  /* ── IMPRESSÃO: totalmente clean — sem tinta escura ── */
  @media print{
    body{background:#fff!important;color:#111!important;padding:0}
    .wrap{background:#fff!important;border:none!important;box-shadow:none!important;border-radius:0!important;max-width:100%!important}
    .hdr{background:#fff!important;border-bottom:1px solid #e2e8f0!important;padding:10px 14px!important}
    .hdr-icon{background:#f1f5f9!important;box-shadow:none!important;border-color:#e2e8f0!important;color:#001443!important}
    .hdr-title{color:#001443!important;font-size:13px!important}
    .hdr-sub{color:#64748b!important}
    .hdr-close{display:none!important}
    .ftr{display:none!important}
    thead th{background:#f8fafc!important;color:#334155!important;border-bottom:1.5px solid #cbd5e1!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    thead{display:table-header-group}
    tbody td{color:#111!important;border-bottom-color:#f1f5f9!important}
    tbody tr:nth-child(even) td{background:#f8fafc!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    tbody tr:hover td{background:transparent!important}
    .tbl-wrap{border:1px solid #e2e8f0!important;border-radius:0!important}
    .filtros{color:#B20028!important;background:#fef2f2!important;border-left-color:#B20028!important;-webkit-print-color-adjust:exact;print-color-adjust:exact}
  }
</style></head><body>
<div class="wrap">
  <div class="hdr">
    <div class="hdr-icon">${printerSvg}</div>
    <div class="hdr-text">
      <div class="hdr-title">${escape(title)}</div>
      <div class="hdr-sub">${new Date().toLocaleDateString("pt-BR")} &middot; ${data.length} registros &middot; ${columns.length} colunas</div>
    </div>
    <div class="hdr-close" onclick="window.close()" title="Fechar">${closeSvg}</div>
  </div>
  <div class="body">
    ${filtrosLine}
    <div class="tbl-wrap">
      <table>
        <thead><tr>${columns.map((c) => `<th>${escape(c.label)}</th>`).join("")}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>
  </div>
  <div class="ftr">
    <span class="ftr-count">${data.length} registros &middot; ${columns.length} colunas</span>
    <div class="ftr-btns">
      <button class="btn-close-ftr" onclick="window.close()">Fechar</button>
      <button class="btn-print" onclick="window.print()">${printerSvg} Imprimir</button>
    </div>
  </div>
</div>
</body></html>`);
  w.document.close();
}

/**
 * Export data as PDF (simple HTML print)
 *
 * @param subtitle Filtros aplicados na lista (ex.: "Rota: H · Status: pronto_entrega").
 *                 Renderizado como segunda linha no PDF pra deixar explícito que a
 *                 impressão respeita o filtro ativo no momento.
 */
export function exportPDF(
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[],
  title: string,
  subtitle?: string,
) {
  const w = window.open("", "_blank");
  if (!w) return;

  const escape = (v: unknown) =>
    String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));

  const tableRows = data.map(row =>
    `<tr>${columns.map(c => `<td style="padding:6px 10px;border:1px solid #ddd;font-size:11px">${row[c.key] == null ? "—" : escape(row[c.key])}</td>`).join("")}</tr>`
  ).join("");

  const filtrosLine = subtitle && subtitle.trim()
    ? `<div class="filtros">Filtros: ${escape(subtitle)}</div>`
    : "";

  w.document.write(`<!DOCTYPE html><html><head><title>${escape(title)}</title>
    <style>
      body { font-family: Arial, sans-serif; padding: 20px; }
      h1 { font-size: 18px; margin-bottom: 4px; }
      .sub { font-size: 12px; color: #666; margin-bottom: 4px; }
      .filtros { font-size: 11px; color: #B20028; font-weight: 600; margin-bottom: 16px; padding: 6px 10px; background: #fef2f2; border-left: 3px solid #B20028; border-radius: 4px; }
      table { border-collapse: collapse; width: 100%; }
      th { background: #004B9B; color: white; padding: 8px 10px; font-size: 10px; text-transform: uppercase; text-align: left; }
      tr:nth-child(even) { background: #f8f9fa; }
      @media print { body { padding: 0; } }
    </style>
  </head><body>
    <h1>${escape(title)}</h1>
    <div class="sub">Exportado em ${new Date().toLocaleDateString("pt-BR")} — ${data.length} registros</div>
    ${filtrosLine}
    <table><thead><tr>${columns.map(c => `<th>${escape(c.label)}</th>`).join("")}</tr></thead><tbody>${tableRows}</tbody></table>
    <script>window.onload = function(){ window.focus(); window.print(); };</script>
  </body></html>`);
  w.document.close();
}
