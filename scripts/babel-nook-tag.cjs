// Babel plugin: adiciona data-nook-src="<relpath>:<line>" em cada JSXOpeningElement.
// Usado pelo Nook Studio (modo Código) pra rastrear o arquivo de origem do
// elemento clicado no picker (🎯) e oferecer "Copiar pra outro projeto".
// Só roda em dev; ignora node_modules.
const path = require("node:path");

module.exports = function nookTagBabel({ types: t }) {
  return {
    name: "nook-tag",
    visitor: {
      JSXOpeningElement(nodePath, state) {
        const filename = state.file && state.file.opts && state.file.opts.filename;
        if (!filename) return;
        if (filename.includes("node_modules")) return;
        const rootDir = (state.opts && state.opts.rootDir) || process.cwd();
        const rel = path.relative(rootDir, filename);
        if (rel.startsWith("..")) return;
        // Skip se já tem
        const already = nodePath.node.attributes.some(
          (a) => a.type === "JSXAttribute" && a.name && a.name.name === "data-nook-src"
        );
        if (already) return;
        const line = (nodePath.node.loc && nodePath.node.loc.start && nodePath.node.loc.start.line) || 0;
        nodePath.node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier("data-nook-src"),
            t.stringLiteral(rel + ":" + line)
          )
        );
      },
    },
  };
};
