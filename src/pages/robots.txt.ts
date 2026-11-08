import type { APIRoute } from 'astro';

// Закрыто по умолчанию; открывается тем же переключателем, что и meta robots (S-016, S-018).
export const GET: APIRoute = ({ site }) => {
  const allow = import.meta.env.PUBLIC_ALLOW_INDEXING === 'true';
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const body = allow
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL(`${base}/sitemap-index.xml`, site).href}\n`
    : 'User-agent: *\nDisallow: /\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
