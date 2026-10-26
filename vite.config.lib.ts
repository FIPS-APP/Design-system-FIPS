import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Build da BIBLIOTECA npm (@fips-app/ds-fips).
// Usado por `npm run build` (publicacao). Para o site de docs, ver vite.config.ts.

// Tudo que esta em dependencies/peerDependencies fica FORA do bundle: o app
// consumidor resolve uma copia so de cada pacote. Embutir Radix aqui duplicava
// os contexts (TooltipProvider, Dialog) e o codigo de lucide/cva no app.
const pkg = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'))
const externos = [...Object.keys(pkg.dependencies ?? {}), ...Object.keys(pkg.peerDependencies ?? {})]
// Casa o pacote e qualquer subpath (react/jsx-runtime, lucide-react/dynamic...).
const ehExterno = (id: string) => externos.some((nome) => id === nome || id.startsWith(`${nome}/`))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (fmt) => (fmt === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ehExterno,
    },
    sourcemap: true,
  },
})
