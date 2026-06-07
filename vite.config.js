import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Vercel serves at the domain root, so no `base` is needed.
// (If you ever deploy to GitHub Pages at /repo-name/, set `base: '/friendly/'`.)
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['money/*.svg', 'icon.svg'],
      manifest: {
        name: 'School Store',
        short_name: 'Store',
        description: 'School store point-of-sale',
        display: 'fullscreen',
        orientation: 'landscape',
        background_color: '#ffffff',
        theme_color: '#2e7d32',
        icons: [
          { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
  test: {
    environment: 'node',
  },
});
