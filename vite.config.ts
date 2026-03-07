import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  base: './',
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './src/setupTests.ts',
  },
}))
