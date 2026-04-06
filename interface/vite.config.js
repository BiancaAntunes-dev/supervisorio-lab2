import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- 1. Importe o plugin

// [https://vitejs.dev/config/](https://vitejs.dev/config/)
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- 2. Adicione aqui dentro da lista de plugins
  ],
})
