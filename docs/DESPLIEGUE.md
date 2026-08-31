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
npm install
npm run check
npm run preview
```

Revisar manualmente `/`, `/sobre`, `/metodologia`, `/legal/privacidad`, `/legal/alcance`,
`/legal/terminos` y `/urgencia`. Comprobar teclado, foco visible, reflow a 320 px y zoom al 200%.

## Cloudflare

El archivo `wrangler.jsonc` apunta a `dist/` mediante Static Assets. En Cloudflare Pages también puede
configurarse sin adaptador:

```text
Build command: npm run build
Build output:  dist
```

Para previews, mantener `PUBLIC_SITE_ENV=preview`. En producción, definir
`PUBLIC_SITE_ENV=production` y `PUBLIC_SITE_URL=https://orientame.cl`. `public/_headers` establece los
encabezados de seguridad en Cloudflare.

Antes del lanzamiento público se debe completar la revisión clínica de cualquier protocolo de
urgencia y la revisión jurídica indicada en el plan.
