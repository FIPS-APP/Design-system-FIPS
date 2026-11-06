import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// O CSS do pacote sai em SUBCAMADAS (`utilities.ds-fips` e `components.ds-fips`). Dentro de uma camada,
// regra fora de subcamada vence regra de subcamada, então a utilidade que o app escreve vence a mesma
// utilidade que o pacote traz, em qualquer ordem de import. Sem isso as duas ficavam na mesma camada
// e valia a ordem do arquivo. (Não cite nome de classe Tailwind aqui: o scanner gera CSS dela.)
// `theme` e `base` ficam como estão: as variáveis do tema (--font-sans, --radius-*) do pacote continuam valendo
// sobre as do Tailwind padrão do app, como antes.
const CAMADAS_DO_PACOTE = ['components', 'utilities']
function cssEmSubcamadas(): Plugin {
  return {
    name: 'fips-css-em-subcamadas',
    generateBundle: {
      order: 'post',
      handler(_opcoes, bundle) {
        let achou = false
        for (const arquivo of Object.values(bundle)) {
          if (arquivo.type !== 'asset' || !arquivo.fileName.endsWith('.css')) continue
          let css = String(arquivo.source)
          for (const camada of CAMADAS_DO_PACOTE) {
            const de = `@layer ${camada}{`
            if (css.split(de).length !== 2) throw new Error(`styles.css: esperava um '${de}' no nível raiz`)
            css = css.replace(de, `@layer ${camada}.ds-fips{`)
          }
          arquivo.source = css
          achou = true
        }
        if (!achou) throw new Error('styles.css não encontrado no bundle da library')
      },
    },
  }
}

// Build da BIBLIOTECA npm (@fips-app/ds-fips).
// Usado por `npm run build` (publicacao). Para o site de docs, ver vite.config.ts.
export default defineConfig({
  plugins: [react(), tailwindcss(), cssEmSubcamadas()],
  publicDir: false,
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (fmt) => (fmt === 'es' ? 'index.js' : 'index.cjs'),
      cssFileName: 'styles',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime', 'framer-motion'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'framer-motion': 'Motion',
        },
      },
    },
    sourcemap: true,
  },
})
