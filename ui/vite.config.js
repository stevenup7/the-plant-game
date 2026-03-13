import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  publicDir: 'public',
  build: {
    outDir: '../server/dist',
    emptyOutDir: false,
    rollupOptions: {
      input: resolve(__dirname, 'src/app.js'),
      output: {
        format: 'es',
        entryFileNames: 'js/app.js',
        inlineDynamicImports: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js',
    },
  },
  server: {
    port: 8000,
    open: '/',
  },
});
