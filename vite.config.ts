import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Proxy R2 CDN requests through Vite to bypass CORS in dev mode.
    // We also inject CORS headers so that crossOrigin='anonymous' works
    // (Three.js VideoTexture requires it for WebGL texture sampling).
    proxy: {
      '/r2-cdn': {
        target: 'https://pub-340c09903d0b49fea4aec85224bcb1bb.r2.dev',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/r2-cdn/, ''),
        configure: (proxy) => {
          proxy.on('proxyRes', (proxyRes) => {
            // Inject CORS headers so browser allows canvas/WebGL access
            proxyRes.headers['access-control-allow-origin'] = '*';
            proxyRes.headers['access-control-allow-methods'] = 'GET, HEAD, OPTIONS';
            proxyRes.headers['access-control-allow-headers'] = 'Range';
          });
        },
      },
    },
  },
})
