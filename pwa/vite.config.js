import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'icons/*.png'],
      manifest: {
        name: 'TourMate',
        short_name: 'TourMate',
        description: 'Find travel companions, share rides & unlock group activity discounts worldwide',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait-primary',
        theme_color: '#0066FF',
        background_color: '#FFFFFF',
        categories: ['travel', 'social'],
        lang: 'en',
        icons: [
          { src: '/icons/icon-72.png',   sizes: '72x72',   type: 'image/png' },
          { src: '/icons/icon-96.png',   sizes: '96x96',   type: 'image/png' },
          { src: '/icons/icon-128.png',  sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144.png',  sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-152.png',  sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-192.png',  sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-384.png',  sizes: '384x384', type: 'image/png' },
          { src: '/icons/icon-512.png',  sizes: '512x512', type: 'image/png' },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Discover Nearby',
            short_name: 'Discover',
            url: '/discover',
            icons: [{ src: '/icons/shortcut-discover.png', sizes: '96x96' }],
          },
          {
            name: 'Find Transport',
            short_name: 'Transport',
            url: '/transport',
            icons: [{ src: '/icons/shortcut-transport.png', sizes: '96x96' }],
          },
        ],
        screenshots: [
          {
            src: '/screenshots/discover.png',
            sizes: '390x844',
            type: 'image/png',
            form_factor: 'narrow',
            label: 'Discover nearby travelers',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/activities'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'activities-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 300 },
              networkTimeoutSeconds: 10,
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/api/discover'),
            handler: 'NetworkOnly',
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/maps\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-maps-cache',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/tests/setup.js'],
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
