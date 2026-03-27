/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/cities-game/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/@ant-design/icons')) {
            return 'ant-icons';
          }

          if (id.includes('node_modules/rc-') || id.includes('node_modules/@rc-component')) {
            return 'ant-rc';
          }

          if (id.includes('node_modules/antd') || id.includes('node_modules/@ant-design')) {
            return 'antd';
          }

          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'react';
          }

          return undefined;
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
  resolve: {
    alias: {
      src: '/src',
    },
  },
})
