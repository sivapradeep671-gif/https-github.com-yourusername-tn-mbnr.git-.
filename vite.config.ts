import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'logo.png', 'vite.svg'],
      manifest: {
        short_name: 'TrustRegTN',
        name: 'TN-MBNR TrustReg TN Pilot',
        theme_color: '#0f172a',
        background_color: '#0f172a',
        display: 'standalone',
        icons: [
          {
            src: 'logo.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'logo.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'
    }
  },
  base: process.env.VITE_BASE_PATH || (process.env.GITHUB_PAGES ? '/TN-MBNR/' : '/'),
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './src/setupTests.ts',
  },
}))
