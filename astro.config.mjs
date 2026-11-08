// @ts-check
import { defineConfig, fontProviders } from 'astro/config';

// unicode-range подмножеств из CSS Fontsource (cyrillic и latin).
const UNICODE_RANGES = {
  cyrillic: ['U+0301', 'U+0400-045F', 'U+0490-0491', 'U+04B0-04B1', 'U+2116'],
  latin: [
    'U+0000-00FF', 'U+0131', 'U+0152-0153', 'U+02BB-02BC', 'U+02C6', 'U+02DA', 'U+02DC',
    'U+0304', 'U+0308', 'U+0329', 'U+2000-206F', 'U+20AC', 'U+2122', 'U+2191', 'U+2193',
    'U+2212', 'U+2215', 'U+FEFF', 'U+FFFD',
  ],
};

/** @param {string} pkg @param {string} base @param {number[]} weights */
function fontsourceVariants(pkg, base, weights) {
  return weights.flatMap((weight) =>
    Object.entries(UNICODE_RANGES).map(([subset, unicodeRange]) => ({
      src: [`${pkg}/files/${base}-${subset}-${weight}-normal.woff2`],
      weight,
      style: 'normal',
      display: 'swap',
      unicodeRange,
    })),
  );
}

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
  // Шрифты: локальный провайдер, файлы из пакетов Fontsource (без сети при сборке).
  // Провайдер npm в Astro 7.4.7 пытается скачивать локальные file:// адреса и падает,
  // поэтому подмножества (cyrillic, latin) и unicode-range заданы явно.
  fonts: [
    {
      name: 'Source Serif 4',
      cssVariable: '--font-source-serif',
      provider: fontProviders.local(),
      fallbacks: ['Georgia', 'serif'],
      options: { variants: fontsourceVariants('@fontsource/source-serif-4', 'source-serif-4', [400]) },
    },
    {
      name: 'Nunito Sans',
      cssVariable: '--font-nunito',
      provider: fontProviders.local(),
      fallbacks: ['sans-serif'],
      options: { variants: fontsourceVariants('@fontsource/nunito-sans', 'nunito-sans', [400, 700]) },
    },
  ],
});
