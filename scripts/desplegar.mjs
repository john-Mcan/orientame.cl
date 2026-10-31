// Verifica el sitio, lo construye para el dominio público y lo publica en Cloudflare.
//
// Por qué existe: sin `PUBLIC_SITE_ENV`, el build es de preview —lo correcto para la
// integración continua y para revisar en local— y ese build publicado en orientame.cl deja
// todas las páginas en `noindex`, con un robots.txt que bloquea el rastreo. Fijar acá la
// variable evita subir un preview por descuido. Las pruebas corren antes sobre el build de
// preview, que es el que esperan; después se reconstruye para producción y se publica eso.

import { spawnSync } from 'node:child_process';

function correr(comando, env = process.env) {
  const { status } = spawnSync(comando, { stdio: 'inherit', shell: true, env });
  if (status !== 0) process.exit(status ?? 1);
}

correr('npm run check');
correr('npm run build', {
  ...process.env,
  PUBLIC_SITE_ENV: 'production',
  PUBLIC_SITE_URL: 'https://orientame.cl',
});
correr('npx wrangler deploy');
