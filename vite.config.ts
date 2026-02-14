import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // For Websupport: use /react_web/ - can override via VITE_BASE_URL
    const base = process.env.VITE_BASE_URL || '/react_web/';
    return {
      base: base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        minify: 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor': ['react', 'react-dom'],
              'icons': ['lucide-react'],
            },
          },
        },
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
