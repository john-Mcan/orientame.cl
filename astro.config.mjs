import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.PUBLIC_SITE_URL ?? 'https://orientame.cl';

export default defineConfig({
  site,
  output: 'static',
  integrations: [sitemap()],
  prefetch: false,
  trailingSlash: 'never',
});
