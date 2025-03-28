import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist' // Ensure the correct output directory
  },
  base: '/', // Ensures correct routing in production
  esbuild: {
    jsxInject: `import React from 'react'`
  }
});
