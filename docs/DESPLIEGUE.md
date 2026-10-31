# Despliegue

orientame.cl se genera como archivos estáticos. No necesita un runtime, una base de datos ni secretos.

## Variables de build

| Variable          | Valor        | Efecto                                                                                     |
| ----------------- | ------------ | ------------------------------------------------------------------------------------------ |
| `PUBLIC_SITE_ENV` | `preview`    | Valor seguro por defecto: añade `noindex` y genera un `robots.txt` que bloquea el rastreo. |
| `PUBLIC_SITE_ENV` | `production` | Permite indexar el dominio público. Usar sólo en el proyecto definitivo.                   |
| `PUBLIC_SITE_URL` | URL absoluta | Define canonical y sitemap. Si falta, se usa `https://orientame.cl`.                       |

No se deben agregar claves privadas al prefijo `PUBLIC_`: Astro incorpora estas variables en el build.

## Verificación local

```sh
npm ci
npm run check
npm run preview
```

Revisar manualmente `/`, `/sobre`, `/metodologia`, `/legal/privacidad`, `/legal/alcance`,
`/legal/terminos` y `/urgencia`. Comprobar teclado, foco visible, reflow a 320 px y zoom al 200%.

## Cloudflare

El sitio se publica como un Worker con
[Static Assets](https://developers.cloudflare.com/workers/static-assets/): `wrangler.jsonc` sirve
`dist/` y declara `orientame.cl` como dominio propio. `wrangler` es una dependencia de desarrollo,
así que la versión con que se publica queda fijada en `package-lock.json`.

```sh
npx wrangler login   # una vez por equipo
npm run deploy
```

`npm run deploy` ejecuta [`scripts/desplegar.mjs`](../scripts/desplegar.mjs): corre
`npm run check`, reconstruye con `PUBLIC_SITE_ENV=production` y `PUBLIC_SITE_URL=https://orientame.cl`
y publica `dist/` con `wrangler deploy`. Correr `wrangler deploy` a mano después de `npm run build`
publicaría un build de preview, con `noindex` en todas las páginas.

`public/_headers` establece los encabezados de seguridad. El build lo copia a `dist/` y
[`scripts/csp-hashes.mjs`](../scripts/csp-hashes.mjs) agrega a `script-src` el hash de cada script
inline generado.

En Cloudflare Pages también puede configurarse sin adaptador:

```text
Build command: npm run build
Build output:  dist
```

Para previews, mantener `PUBLIC_SITE_ENV=preview`. En producción, definir
`PUBLIC_SITE_ENV=production` y `PUBLIC_SITE_URL=https://orientame.cl`.

Ningún protocolo de urgencia puede activarse sin revisión clínica; hoy el borrador está inactivo. La
revisión jurídica indicada en el plan sigue pendiente y no bloquea la publicación de la v1 (decisión
del 31 de octubre de 2026; ver [`pendientes.md`](pendientes.md) §4).
