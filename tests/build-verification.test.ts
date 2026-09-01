import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { nodosConRutaPropia, rutaDe, todosLosPasos, hrefDeDestino } from '../src/lib/orientador.ts';

const distDir = path.resolve(process.cwd(), 'dist');

const leer = (ruta: string): string => fs.readFileSync(path.join(distDir, ruta), 'utf8');

/** `/empezar/x/y` -> `empezar/x/y/index.html` */
const archivoDe = (ruta: string): string => `${ruta.replace(/^\//, '')}/index.html`;

describe('Build output verification', () => {
  it('dist directory exists', () => {
    assert.strictEqual(fs.existsSync(distDir), true);
  });

  const requiredRoutes = [
    'index.html',
    'sobre/index.html',
    'metodologia/index.html',
    'urgencia/index.html',
    'empezar/index.html',
    'legal/index.html',
    'legal/privacidad/index.html',
    'legal/alcance/index.html',
    'legal/terminos/index.html',
    '404.html',
    'robots.txt',
    'sitemap-index.xml',
  ];

  for (const route of requiredRoutes) {
    it(`generates required static route: ${route}`, () => {
      const filePath = path.join(distDir, route);
      assert.strictEqual(fs.existsSync(filePath), true, `Missing route: ${route}`);
    });
  }

  it('urgencia page contains official crisis emergency phone links', () => {
    const urgenciaHtml = leer('urgencia/index.html');
    assert.ok(urgenciaHtml.includes('tel:131'), 'Missing SAMU 131 link');
    assert.ok(urgenciaHtml.includes('tel:*4141'), 'Missing Línea *4141 link');
    assert.ok(urgenciaHtml.includes('tel:+566003607777'), 'Missing Salud Responde link');
  });

  it('no drafts from content collections are rendered into production dist', () => {
    // Draft collections should not have static routes in dist
    const forbiddenDraftPaths = ['sintomas', 'temas', 'instrumentos', 'guias', 'acompanamiento'];

    for (const draftPath of forbiddenDraftPaths) {
      const fullPath = path.join(distDir, draftPath);
      assert.strictEqual(
        fs.existsSync(fullPath),
        false,
        `Draft path ${draftPath} was unexpectedly rendered to dist`,
      );
    }
  });

  it('robots.txt disallows crawling by default in preview environment', () => {
    const robotsTxt = leer('robots.txt');
    assert.ok(robotsTxt.includes('Disallow: /'), 'Preview robots.txt must disallow crawling');
  });
});

describe('El orientador se genera completo como HTML estático', () => {
  it('cada nodo del árbol tiene su propia página en dist', () => {
    for (const nodo of nodosConRutaPropia()) {
      const archivo = archivoDe(rutaDe(nodo.id));
      assert.strictEqual(
        fs.existsSync(path.join(distDir, archivo)),
        true,
        `Falta la página del nodo "${nodo.id}": ${archivo}`,
      );
    }
  });

  it('cada opción de cada paso queda como enlace navegable en el HTML', () => {
    for (const paso of todosLosPasos()) {
      const html = leer(archivoDe(rutaDe(paso.id)));

      for (const opcion of paso.opciones) {
        const href = hrefDeDestino(opcion.destino);
        assert.ok(
          html.includes(`href="${href}"`),
          `El paso "${paso.id}" no enlaza a "${href}" en el HTML generado`,
        );
      }
    }
  });

  it('ninguna página del orientador depende de un island de framework', () => {
    // El recorrido debe funcionar con JavaScript deshabilitado: sin hidratación
    // ni estado en cliente, cada decisión es una navegación normal.
    for (const nodo of nodosConRutaPropia()) {
      const html = leer(archivoDe(rutaDe(nodo.id)));
      assert.ok(
        !html.includes('astro-island'),
        `La página de "${nodo.id}" contiene un island hidratado`,
      );
    }

    const empezarHtml = leer('empezar/index.html');
    assert.ok(!empezarHtml.includes('astro-island'), '/empezar contiene un island hidratado');
  });

  it('los guiones copiables dejan el texto visible aunque el botón no se active', () => {
    const html = leer(archivoDe('/empezar/me-cuesta-dar-el-paso/no-se-que-decir'));

    assert.ok(
      html.includes('Es la primera vez que busco atención.'),
      'El texto del guion debe estar en el HTML, no sólo dentro del script',
    );
    assert.ok(
      html.includes('hidden'),
      'El botón de copiar debe partir oculto y activarse sólo con JavaScript',
    );
  });
});

describe('HTML válido en las páginas generadas', () => {
  /** Un `<p>` dentro de otro `<p>` hace que el navegador cierre el primero y rompe el layout. */
  const tieneParrafosAnidados = (html: string): boolean => {
    let abierto = false;

    for (const [, cierre] of html.matchAll(/<(\/?)p\b[^>]*>/g)) {
      if (cierre) {
        abierto = false;
      } else {
        if (abierto) return true;
        abierto = true;
      }
    }

    return false;
  };

  const paginas = [
    'index.html',
    'empezar/index.html',
    'urgencia/index.html',
    'sobre/index.html',
    'metodologia/index.html',
    ...nodosConRutaPropia().map((nodo) => archivoDe(rutaDe(nodo.id))),
  ];

  for (const pagina of paginas) {
    it(`no anida párrafos: ${pagina}`, () => {
      assert.ok(!tieneParrafosAnidados(leer(pagina)), `${pagina} contiene un <p> dentro de otro`);
    });
  }
});

describe('La portada abre el recorrido sin controles engañosos', () => {
  it('enlaza directamente a cada puerta de entrada, no todas al mismo destino', () => {
    const html = leer('index.html');
    const inicio = todosLosPasos().find((paso) => paso.id === 'inicio');
    assert.ok(inicio, 'Debe existir el paso inicial');

    const destinos = new Set(inicio.opciones.map((opcion) => hrefDeDestino(opcion.destino)));
    assert.ok(
      destinos.size > 1,
      'Las opciones de la portada no pueden apuntar todas al mismo sitio',
    );

    for (const destino of destinos) {
      assert.ok(html.includes(`href="${destino}"`), `La portada no enlaza a "${destino}"`);
    }
  });

  it('mantiene visible el acceso a urgencia', () => {
    assert.ok(leer('index.html').includes('/urgencia'), 'La portada debe enlazar a /urgencia');
  });

  it('no presenta un campo de búsqueda que no exista todavía', () => {
    // Un control con forma de buscador que en realidad es un enlace confunde a quien
    // intenta escribir y se anuncia mal en lectores de pantalla.
    const html = leer('index.html');
    assert.ok(!html.includes('type="search"'), 'No debe haber un campo de búsqueda sin buscador');
    assert.ok(
      !/placeholder="[^"]*[Bb]uscar/.test(html),
      'No debe haber un placeholder de búsqueda sin buscador',
    );
  });

  it('no afirma que ningún dato sale del dispositivo', () => {
    // §2.5: la promesa correcta es que orientame.cl no almacena las respuestas,
    // no que la navegación no genere solicitudes técnicas.
    const html = leer('index.html');
    assert.ok(
      !/nada se (guarda|env[ií]a)|ning[uú]n dato sale/i.test(html),
      'La portada usa una promesa de privacidad técnicamente incorrecta',
    );
  });
});
