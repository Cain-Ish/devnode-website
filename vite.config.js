import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    // Single small entry module; keep asset names hashed for immutable caching.
    assetsInlineLimit: 2048,
  },
});
