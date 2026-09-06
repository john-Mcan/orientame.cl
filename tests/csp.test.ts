import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { hashesDeHtml, hashesDelSitio } from '../scripts/csp-hashes.mjs';

const distDir = path.resolve(process.cwd(), 'dist');
const rutaHeaders = path.join(distDir, '_headers');

const scriptSrcDe = (headers: string): string => headers.match(/script-src[^;]*/)?.[0] ?? '';

// La CSP bloquea todo script inline salvo los que declara por hash. Cuando faltaba uno, el sitio
// llegaba a producción sin el `IntersectionObserver` del encabezado, sin hidratar ningún island
// —buscador, filtros de `/donde`, cuestionarios— y sin el botón de `GuionCopiable`. Nada de eso
// se nota en desarrollo, porque `public/_headers` sólo lo aplica Cloudflare: el build pasaba, el
// sitio se veía bien local y el JavaScript estaba muerto al desplegarse. Por eso se verifica
// contra el HTML realmente generado y no contra la configuración.
describe('CSP y scripts inline', () => {
  it('dist/_headers existe', () => {
    assert.strictEqual(fs.existsSync(rutaHeaders), true);
  });

  it('cada script inline del sitio está declarado en `script-src`', async () => {
    const scriptSrc = scriptSrcDe(fs.readFileSync(rutaHeaders, 'utf8'));
    assert.ok(scriptSrc, 'La CSP debe declarar `script-src`');

    const { hashes, paginas } = await hashesDelSitio();

    assert.ok(paginas > 0, 'No se encontró HTML generado: corre `npm run build` antes');
    assert.ok(hashes.length > 0, 'No se encontró ningún script inline: revisa el build');

    const faltantes = hashes.filter((hash) => !scriptSrc.includes(hash));

    assert.deepEqual(
      faltantes,
      [],
      `Hay ${faltantes.length} script(s) inline sin hash en la CSP. Se bloquearán en producción ` +
        'aunque el sitio funcione en desarrollo. Corre `npm run build`, que ejecuta ' +
        '`scripts/csp-hashes.mjs`.',
    );
  });

  // `'unsafe-inline'` haría pasar el test anterior sin declarar nada y desactivaría la protección
  // para la que existe la directiva.
  it('no se habilita `unsafe-inline` en `script-src`', () => {
    const scriptSrc = scriptSrcDe(fs.readFileSync(rutaHeaders, 'utf8'));
    assert.strictEqual(scriptSrc.includes("'unsafe-inline'"), false);
  });

  it('el hash cubre el texto exacto entre etiquetas, sin recortar', () => {
    const cuerpo = '\n  var a = 1;\n';
    const esperado = `'sha256-${createHash('sha256').update(cuerpo, 'utf8').digest('base64')}'`;

    assert.deepEqual(hashesDeHtml(`<script type="module">${cuerpo}</script>`), [esperado]);
  });

  // Un hash sin comillas simples no es una fuente válida: el navegador lo descarta y el script
  // queda bloqueado igual que si nunca se hubiera declarado, pero el test de cobertura pasaría.
  it('los hashes se declaran entre comillas simples', () => {
    const scriptSrc = scriptSrcDe(fs.readFileSync(rutaHeaders, 'utf8'));
    const sinComillas = scriptSrc.match(/(^|\s)sha256-/g) ?? [];

    assert.deepEqual(sinComillas, [], "Todo hash en `script-src` debe ir como `'sha256-…'`");
  });

  it('los scripts con `src` no necesitan hash: los cubre `self`', () => {
    assert.deepEqual(hashesDeHtml('<script type="module" src="/_astro/x.js"></script>'), []);
  });
});
