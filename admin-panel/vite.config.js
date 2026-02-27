import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
 plugins: [react()],
  server: {
    hmr: false,          // 🔥 Disable Hot Reload (huge speed boost)
    watch: null
  },
  build: {
    sourcemap: false,    // 🔥 Faster production build
  }
})
