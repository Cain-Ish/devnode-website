import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',
  plugins: [tailwindcss()],
  build: {
    outDir: 'dist',
    // Single small entry module; keep asset names hashed for immutable caching.
    assetsInlineLimit: 2048,
  },
});
