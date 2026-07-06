import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Build do SITE de documentacao (app navegavel servido pelo nginx).
// Usado por `npm run dev`, `npm run build:site` e `npm run preview`.
// Para a biblioteca npm publicavel, ver vite.config.lib.ts.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Porta dedicada do DS-FIPS (ver data/dev-ports.json do Nook). Sem porta fixa
    // o site de docs subia na 5173 default e roubava a porta do Governanca_BI,
    // que usa strictPort e morria no boot.
    port: Number(process.env.NOOK_DEV_PORT || process.env.PORT) || 5174,
    strictPort: true,
  },
})
