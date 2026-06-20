import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Build do SITE de documentacao (app navegavel servido pelo nginx).
// Usado por `npm run dev`, `npm run build:site` e `npm run preview`.
// Para a biblioteca npm publicavel, ver vite.config.lib.ts.
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
