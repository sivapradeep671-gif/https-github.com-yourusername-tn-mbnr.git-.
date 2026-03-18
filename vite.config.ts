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
  base: process.env.RENDER || process.env.NODE_ENV === 'production' ? '/' : './',
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './src/setupTests.ts',
  },
}))
