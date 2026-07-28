import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    port: 5173,
    strictPort: true,   // fails if port busy, instead of picking another
    host: true,          // allows access from outside localhost (needed in Docker dev mode)
  }
})
