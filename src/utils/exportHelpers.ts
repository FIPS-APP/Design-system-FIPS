/**
 * Helpers compartilhados para exports (PDF/CSV) das listagens.
 *
 * - `buildExportCols`: dado o estado de `visibleColIds` (vindo do callback do
 *   DataListingTable) e um catálogo `id → {key, label}`, devolve só as colunas
 *   visíveis na tabela. Se `visibleColIds` for null (callback ainda não disparou),
 *   exporta o catálogo inteiro como fallback seguro.
 *
 * - `buildFiltrosLabel`: monta a string de filtros aplicados (search, status,
 *   filtros adicionais, período). Aceita pares chave-valor ou string. Retorna
 *   "" se nenhum filtro está ativo.
 */

export interface ExportCol {
  /** id da coluna na tabela (mesmo `id` do DataListingTable). */
  id: string;
  /** Nome do campo no objeto de dados. */
  key: string;
  /** Rótulo do cabeçalho do export. */
  label: string;
  /** Agrupamento visual no modal: "main" = tabela visível, "expanded" = seção colapsável. */
  section?: "main" | "expanded";
}

export type ExportCatalog = readonly ExportCol[];

export function buildExportCols(
  visibleColIds: string[] | null | undefined,
  catalog: ExportCatalog,
): { key: string; label: string }[] {
  if (!visibleColIds || visibleColIds.length === 0) {
    return catalog
      .filter((c) => c.id !== "select" && c.id !== "actions")
      .map((c) => ({ key: c.key, label: c.label }));
  }
  const map = new Map(catalog.map((c) => [c.id, c]));
  return visibleColIds
    .map((id) => map.get(id))
    .filter((c): c is ExportCol => !!c && c.id !== "select" && c.id !== "actions")
    .map((c) => ({ key: c.key, label: c.label }));
}

type FiltroEntry = string | [string, string | number | null | undefined];

export function buildFiltrosLabel(...entries: (FiltroEntry | null | undefined)[]): string {
  const parts: string[] = [];
  for (const e of entries) {
    if (!e) continue;
    if (typeof e === "string") {
      const v = e.trim();
      if (v) parts.push(v);
    } else {
      const [label, val] = e;
      if (val == null) continue;
      const s = String(val).trim();
      if (s && s !== "—" && s !== "Todos") parts.push(`${label}: ${s}`);
    }
  }
  return parts.join(" · ");
}
