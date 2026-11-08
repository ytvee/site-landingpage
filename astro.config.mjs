// @ts-check
import { defineConfig } from 'astro/config';

// Адрес и базовый путь задаются окружением сборки.
// Локально: http://localhost:4321/
// До подключения домена на GitHub Pages: SITE_URL=https://ytvee.github.io SITE_BASE=/site-landingpage
// С собственным доменом: SITE_URL=https://<домен>, SITE_BASE не задаём.
export default defineConfig({
  site: process.env.SITE_URL ?? 'http://localhost:4321',
  base: process.env.SITE_BASE ?? '/',
  trailingSlash: 'ignore',
  build: {
    inlineStylesheets: 'auto',
  },
});
