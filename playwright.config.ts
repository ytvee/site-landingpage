import { defineConfig } from '@playwright/test';

// Локально (песочница): PW_CHROME=/usr/bin/google-chrome. В CI браузер ставит `playwright install chromium`.
const executablePath = process.env.PW_CHROME || undefined;
const launchOptions = { executablePath, args: ['--no-sandbox'] };

export default defineConfig({
  testDir: 'tests',
  outputDir: 'test-results',
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4321', launchOptions },
  webServer: {
    command: 'pnpm exec astro preview --host 127.0.0.1 --port 4321',
    url: 'http://127.0.0.1:4321',
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: 'mobile-390', use: { viewport: { width: 390, height: 800 } } },
    { name: 'tablet-768', use: { viewport: { width: 768, height: 1024 } } },
    { name: 'desktop-1440', use: { viewport: { width: 1440, height: 900 } } },
  ],
});
