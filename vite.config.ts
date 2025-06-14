import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`
  },
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src'
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
