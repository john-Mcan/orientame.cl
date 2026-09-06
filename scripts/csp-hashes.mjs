// Calcula el hash de cada script inline del sitio construido y lo agrega a `script-src` en
// `dist/_headers`.
//
// Por qué existe: la CSP declara `script-src 'self' 'wasm-unsafe-eval'`, que bloquea todo script
// inline, y Astro emite inline tanto el cargador de islands como los scripts de componente. En
// producción eso dejaba sin ejecutar el `IntersectionObserver` del encabezado, la hidratación de
// todos los islands (buscador, filtros de `/donde`, cuestionarios) y el botón de `GuionCopiable`.
// No se veía en desarrollo porque `public/_headers` sólo lo aplica Cloudflare, así que el sitio
// funcionaba local y llegaba roto al desplegarse.
//
// La alternativa era agregar `'unsafe-inline'`, que desactiva la protección para la que la
// directiva existe. Con un sitio estático los hashes son estables y se recalculan en cada build,
// así que la CSP sigue siendo estricta.

import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dist = new URL('../dist/', import.meta.url);

// Scripts sin `src`: son los que la CSP evalúa por hash. El look-ahead descarta los externos,
// que ya cubre `'self'`.
const SCRIPT_INLINE = /<script(?![^>]*\ssrc=)[^>]*>([\s\S]*?)<\/script>/gi;

export function hashesDeHtml(html) {
  const hashes = [];
  for (const [, cuerpo] of html.matchAll(SCRIPT_INLINE)) {
    if (!cuerpo.trim()) continue;
    // El hash cubre exactamente el texto entre las etiquetas, sin recortar: cualquier
    // normalización daría un valor que el navegador no reproduce. Las comillas simples son
    // parte de la sintaxis: un hash sin comillas no es una fuente válida y el navegador lo
    // descarta en silencio, dejando el script bloqueado igual que si no estuviera declarado.
    hashes.push(`'sha256-${createHash('sha256').update(cuerpo, 'utf8').digest('base64')}'`);
  }
  return hashes;
}

export function conHashes(headers, hashes) {
  const directiva = /(script-src[^;]*)/;
  if (!directiva.test(headers)) {
    throw new Error('No se encontró la directiva `script-src` en dist/_headers');
  }

  return headers.replace(directiva, (encontrada) => {
    const nuevos = hashes.filter((hash) => !encontrada.includes(hash));
    return nuevos.length ? `${encontrada.trimEnd()} ${nuevos.join(' ')}` : encontrada;
  });
}

/** Todos los `.html` generados. Recorrido propio: `fs.glob` sigue siendo experimental. */
async function paginasHtml(directorio) {
  const encontradas = [];
  for (const entrada of await readdir(directorio, { withFileTypes: true })) {
    const completo = path.join(directorio, entrada.name);
    if (entrada.isDirectory()) encontradas.push(...(await paginasHtml(completo)));
    else if (entrada.name.endsWith('.html')) encontradas.push(completo);
  }
  return encontradas;
}

/** Recorre el sitio construido y devuelve el conjunto de hashes, ordenado. */
export async function hashesDelSitio(directorio = fileURLToPath(dist)) {
  const hashes = new Set();
  const archivos = await paginasHtml(directorio);

  for (const archivo of archivos) {
    for (const hash of hashesDeHtml(await readFile(archivo, 'utf8'))) hashes.add(hash);
  }

  return { hashes: [...hashes].sort(), paginas: archivos.length };
}

async function principal() {
  const { hashes, paginas } = await hashesDelSitio();

  if (paginas === 0) {
    throw new Error('No se encontró ningún HTML en dist/: ¿corrió el build antes?');
  }

  // Un sitio sin scripts inline sería un cambio de fondo en cómo Astro emite el JavaScript, no un
  // resultado normal. Vale la pena que falle y no que publique una CSP silenciosamente distinta.
  if (hashes.length === 0) {
    throw new Error(`No se encontró ningún script inline en ${paginas} páginas: revisa el build`);
  }

  const rutaHeaders = new URL('_headers', dist);
  const original = await readFile(rutaHeaders, 'utf8');

  await writeFile(rutaHeaders, conHashes(original, hashes), 'utf8');

  console.log(`CSP: ${hashes.length} hash(es) de script inline agregados (${paginas} páginas)`);
}

// Sólo corre al invocarse directamente: el test importa las funciones sin reescribir `_headers`.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await principal();
}
