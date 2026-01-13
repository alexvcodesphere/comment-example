import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'CodesphereTools',
      fileName: () => 'codesphere-tools.js',
      formats: ['iife']
    },
    rollupOptions: {
      // Don't externalize React - bundle it into the IIFE
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  server: {
    port: 3002,
    cors: true
  },
  preview: {
    port: 3002,
    cors: true
  }
})
