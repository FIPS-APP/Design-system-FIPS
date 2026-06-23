#!/usr/bin/env node
// Lê src/tokens/{colors,typography,spacing}.ts e gera docs/tokens.md
// com swatches de cor, escala tipográfica e spacing.
// Uso: node scripts/gen-tokens-md.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TOK = path.join(ROOT, "src", "tokens");

// Extrai um objeto `as const` de um source TS por nome, retornando { key: stringValue }.
function parseConst(source, exportName) {
  const re = new RegExp(`export const ${exportName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as const`, "m");
  const m = source.match(re);
  if (!m) return null;
  const out = {};
  const lines = m[1].split("\n");
  for (const ln of lines) {
    const t = ln.trim();
    if (!t || t.startsWith("//") || t.startsWith("/*") || t.startsWith("*")) continue;
    const kv = t.match(/^['"]?([\w-]+)['"]?\s*:\s*['"]([^'"]+)['"]/);
    if (kv) out[kv[1]] = kv[2];
  }
  return out;
}

// Extrai array `as const` de números/strings: export const X = [1, 2, 3] as const
function parseArray(source, exportName) {
  const re = new RegExp(`export const ${exportName}\\s*=\\s*\\[([^\\]]+)\\]\\s*as const`, "m");
  const m = source.match(re);
  if (!m) return null;
  return m[1].split(",").map(s => s.trim().replace(/^['"]|['"]$/g, "")).filter(Boolean);
}

function swatch(hex) {
  // Inline HTML render ok em GitHub Markdown e em renderers do storybook
  const isLight = hexLuminance(hex) > 0.5;
  const txt = isLight ? "#000" : "#fff";
  return `<span style="display:inline-block;width:80px;height:36px;background:${hex};border:1px solid #ccc;border-radius:6px;text-align:center;line-height:36px;font-family:ui-monospace,monospace;font-size:11px;color:${txt}">${hex}</span>`;
}

function hexLuminance(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return 0.5;
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const adj = c => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  return 0.2126 * adj(r) + 0.7152 * adj(g) + 0.0722 * adj(b);
}

function colorTable(rows) {
  const out = ["| Token | Swatch | Hex |", "|---|---|---|"];
  for (const [name, hex] of Object.entries(rows)) {
    if (!hex || !hex.startsWith("#")) {
      out.push(`| \`${name}\` | — | \`${hex}\` |`);
    } else {
      out.push(`| \`${name}\` | ${swatch(hex)} | \`${hex}\` |`);
    }
  }
  return out.join("\n");
}

const colorsSrc = fs.readFileSync(path.join(TOK, "colors.ts"), "utf8");
const typoSrc = fs.readFileSync(path.join(TOK, "typography.ts"), "utf8");
const spacingSrc = fs.readFileSync(path.join(TOK, "spacing.ts"), "utf8");

const fipsPalette = parseConst(colorsSrc, "fipsPalette") || {};
const semantic = parseConst(colorsSrc, "semanticColors") || {};
const darkSemantic = parseConst(colorsSrc, "darkSemanticColors") || {};
const fontFamilies = parseConst(typoSrc, "fontFamilies") || {};
const typeScale = parseConst(typoSrc, "typeScale") || {};
const spacingScale = parseArray(spacingSrc, "spacingScale") || [];

// Resolve tokens semânticos que apontam pra fipsPalette (regex pega só strings literais
// — referências como `fipsPalette.azulProfundo` viram null. Re-parse com regex extra.
function resolveSemanticRefs(source, exportName, palette) {
  const re = new RegExp(`export const ${exportName}\\s*=\\s*\\{([\\s\\S]*?)\\}\\s*as const`, "m");
  const m = source.match(re);
  if (!m) return null;
  const out = {};
  for (const ln of m[1].split("\n")) {
    const t = ln.trim();
    const kvLit = t.match(/^['"]?([\w-]+)['"]?\s*:\s*['"]([^'"]+)['"]/);
    if (kvLit) { out[kvLit[1]] = kvLit[2]; continue; }
    const kvRef = t.match(/^['"]?([\w-]+)['"]?\s*:\s*fipsPalette\.(\w+)/);
    if (kvRef) { out[kvRef[1]] = palette[kvRef[2]] || `fipsPalette.${kvRef[2]}`; }
  }
  return out;
}
const semanticResolved = resolveSemanticRefs(colorsSrc, "semanticColors", fipsPalette) || semantic;

const today = new Date().toISOString().slice(0, 10);

const md = `# Tokens — Design System FIPS

> Gerado automaticamente a partir de \`src/tokens/\` em ${today}. Não edite à mão — rode \`npm run tokens:gen\` para regenerar.

## Paleta oficial (Brandbook)

${colorTable(fipsPalette)}

## Tokens semânticos — Light

${colorTable(semanticResolved)}

## Tokens semânticos — Dark

${colorTable(darkSemantic)}

## Tipografia

### Famílias

${Object.entries(fontFamilies).map(([k, v]) => `- **${k}**: \`${v}\``).join("\n")}

### Escala (classes Tailwind)

| Token | Classes |
|---|---|
${Object.entries(typeScale).map(([k, v]) => `| \`${k}\` | \`${v}\` |`).join("\n")}

## Spacing

Escala em múltiplos de 4px (passos disponíveis):

${spacingScale.map(s => `- \`${s}\` → ${parseInt(s, 10) * 4}px`).join("\n")}

---

## Manutenção

- **Fonte da verdade**: \`src/tokens/colors.ts\`, \`typography.ts\`, \`spacing.ts\`.
- **Espelho CSS**: \`src/styles/globals.css\` no bloco \`@theme\` (Tailwind v4) — atualize em paralelo a este doc.
- **Skill bundle**: \`skills/design-system-fips/references/foundations.md\` — atualize quando paleta/tipografia mudar.

`;

fs.mkdirSync(path.join(ROOT, "docs"), { recursive: true });
fs.writeFileSync(path.join(ROOT, "docs", "tokens.md"), md);
console.log(`docs/tokens.md gerado (${md.length} chars)`);
