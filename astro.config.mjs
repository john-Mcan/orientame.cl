import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.PUBLIC_SITE_URL ?? 'https://orientame.cl';

export default defineConfig({
  site,
  output: 'static',
  // El valor por defecto de `compressHTML` es `'jsx'`, que comprime en la plantilla y
  // descarta los nodos de espacio entre elementos en línea en vez de colapsarlos. Cuando
  // lo único que separa un texto de un `<a>` es el salto de línea que deja Prettier al
  // repartir la etiqueta, la palabra sale pegada al enlace: "Puedes revisarlo que estás
  // sintiendo", "ver directamentedónde consultar en Chile". Pasaba en trece frases de
  // cinco páginas. `true` usa el compresor de HTML, que conserva esa separación, y cuesta
  // 5 KB gzip en todo el sitio. Arreglar frase por frase no sirve: el formateo automático
  // vuelve a partir esas líneas y el problema reaparece en cada página nueva.
  compressHTML: true,
  integrations: [preact(), sitemap()],
  prefetch: false,
  trailingSlash: 'never',
});
