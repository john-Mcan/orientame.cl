import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

const site = process.env.PUBLIC_SITE_URL ?? 'https://orientame.cl';

// lightningcss codifica cada versión como `major << 16 | minor << 8 | patch`.
const version = (major, minor = 0) => (major << 16) | (minor << 8);

// Sin `targets` declarados, lightningcss asume navegadores muy recientes: borraba
// `-webkit-backdrop-filter` y reescribía `@supports not ((backdrop-filter: …) or
// (-webkit-backdrop-filter: …))` dejando sólo la forma sin prefijo. En iOS 17 y anteriores
// —que soportan el prefijo pero no el estándar, que llegó en Safari 18— eso activaba el
// respaldo opaco y el encabezado perdía el vidrio y la elevación al bajar. El piso es Safari
// 15.4 (marzo 2022), la primera versión con `:has()` y `dvh`, que el sitio ya usa.
const navegadoresSoportados = {
  safari: version(15, 4),
  ios_saf: version(15, 4),
  chrome: version(105),
  firefox: version(121),
  edge: version(105),
};

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
  vite: {
    css: {
      transformer: 'lightningcss',
      lightningcss: { targets: navegadoresSoportados },
    },
    build: {
      cssMinify: 'lightningcss',
      // `build.cssTarget` hereda de `build.target` —un baseline moderno— y tiene precedencia
      // sobre `css.lightningcss.targets` en el paso de minificación. Sin repetir el piso acá,
      // la minificación deshacía el prefijo que el paso anterior sí conservaba.
      cssTarget: ['safari15.4', 'ios15.4', 'chrome105', 'firefox121', 'edge105'],
    },
  },
});
