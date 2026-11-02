import { defineConfig } from '@playwright/test';

// channel: 'chrome' uses the installed browser, here and on GitHub's runners,
// so nothing has to download one. Tests run against the built dist/.
export default defineConfig({
  testDir: 'tests',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    channel: 'chrome',
  },
  webServer: {
    command: 'node node_modules/vite/bin/vite.js preview --port 4173 --strictPort --host 127.0.0.1',
    url: 'http://127.0.0.1:4173',
  },
});
