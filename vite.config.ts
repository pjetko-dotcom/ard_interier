import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // For dev: use / (root), for production: use / (root)
    const base = '/';
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
        emptyOutDir: false,
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
