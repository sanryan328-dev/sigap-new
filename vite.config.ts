import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) return 'vendor';
          if (id.includes('node_modules/framer-motion')) return 'vendor';
          if (id.includes('node_modules/lucide-react')) return 'vendor';
          if (id.includes('node_modules/recharts')) return 'recharts';
          if (id.includes('node_modules/html2canvas')) return 'html2canvas';
          if (id.includes('node_modules/dexie')) return 'dexie';
        },
      },
    },
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      includeAssets: [
        'icons/icon-192.png',
        'icons/icon-512.png',
      ],
      manifest: {
        id: '/',
        name: 'SIGAP SPENSAWA',
        short_name: 'SIGAP',
        description: 'Sistem Informasi Penilaian & Agenda Guru SPENSAWA',
        start_url: '.',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        background_color: '#f1f6fc',
        theme_color: '#367cce',
        orientation: 'portrait',
        lang: 'id-ID',
        dir: 'ltr',
        prefer_related_applications: false,
        categories: ['education', 'productivity'],
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,jpg,jpeg,woff2,woff,ico,webp}'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        navigationPreload: true,
        runtimeCaching: [
          {
            urlPattern: /\.(?:woff2|woff)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
    }),
  ],
})
