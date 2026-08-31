import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const isProduction = import.meta.env.PUBLIC_SITE_ENV === 'production';
  const body = isProduction
    ? `User-agent: *\nAllow: /\nSitemap: ${new URL('sitemap-index.xml', import.meta.env.SITE).href}\n`
    : 'User-agent: *\nDisallow: /\n';

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
