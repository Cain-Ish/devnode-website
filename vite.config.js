import { defineConfig } from 'vite';

// The page has no modulepreload links, so the polyfill would only add bytes.
export default defineConfig({
  build: { modulePreload: { polyfill: false } },
});
