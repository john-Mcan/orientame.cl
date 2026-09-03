import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fuentes } from '../src/data/fuentes.ts';

// Por qué existe este archivo: en la fase 3 se publicaron 16 citas apoyadas en dos URLs de
// MINSAL inventadas, presentadas como once documentos distintos. El schema no lo detectó
// porque cada cita era válida por separado. Una misma URL citada como documentos distintos es
// la señal barata y determinista de que la referencia no se abrió nunca.

const RAIZ_CONTENIDO = path.join(process.cwd(), 'src', 'content');

interface Cita {
  archivo: string;
  titulo: string;
  url: string;
}

function archivosDeContenido(): string[] {
  const encontrados: string[] = [];
  const recorrer = (dir: string) => {
    for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
      const completo = path.join(dir, entrada.name);
      if (entrada.isDirectory()) recorrer(completo);
      else if (entrada.name.endsWith('.md') || entrada.name.endsWith('.mdx'))
        encontrados.push(completo);
    }
  };
  if (fs.existsSync(RAIZ_CONTENIDO)) recorrer(RAIZ_CONTENIDO);
  return encontrados;
}

/** Una pieza es publicable cuando `esPublicable` puede dejarla entrar a producción. */
function esPublicable(archivo: string): boolean {
  const texto = fs.readFileSync(archivo, 'utf8');
  return (
    texto.includes('estadoEditorial: verificado-con-fuentes') ||
    texto.includes('estadoEditorial: revisado-clinicamente')
  );
}

/** Lee los pares `titulo`/`url` de cada entrada del bloque `fuentes:` del frontmatter. */
function citasDe(archivo: string): Cita[] {
  const texto = fs.readFileSync(archivo, 'utf8');
  const citas: Cita[] = [];
  let titulo: string | undefined;

  for (const linea of texto.split('\n')) {
    const conTitulo = /^\s+titulo:\s*'(.+?)'\s*$/.exec(linea);
    if (conTitulo) titulo = conTitulo[1];

    const conUrl = /^\s+url:\s*'(.+?)'/.exec(linea);
    if (conUrl && titulo) {
      citas.push({ archivo: path.relative(process.cwd(), archivo), titulo, url: conUrl[1] });
      titulo = undefined;
    }
  }

  return citas;
}

const citasDeInterfaz = fuentes.map((f) => ({
  archivo: 'src/data/fuentes.ts',
  titulo: f.titulo,
  url: f.url,
}));

// La regla se aplica a lo que puede llegar a producción. Una pieza retenida en verificación
// puede tener sus citas rotas: eso es justamente lo que hay que arreglar antes de publicarla,
// y lo bloquea la prueba del marcador. Si se aplicara a todo, el arreglo fácil sería
// renombrar títulos hasta que la prueba calle, que es lo contrario de lo que se busca.
const citasPublicables = archivosDeContenido().filter(esPublicable).flatMap(citasDe);
const todasLasCitas = [...citasPublicables, ...citasDeInterfaz];
const todasLasCitasDelRepo = [...archivosDeContenido().flatMap(citasDe), ...citasDeInterfaz];

describe('Trazabilidad de las fuentes citadas', () => {
  it('una misma URL no respalda documentos con títulos distintos', () => {
    const titulosPorUrl = new Map<string, Map<string, string>>();

    for (const cita of todasLasCitas) {
      const titulos = titulosPorUrl.get(cita.url) ?? new Map<string, string>();
      titulos.set(cita.titulo, cita.archivo);
      titulosPorUrl.set(cita.url, titulos);
    }

    for (const [url, titulos] of titulosPorUrl) {
      assert.equal(
        titulos.size,
        1,
        `La URL ${url} se cita como ${titulos.size} documentos distintos:\n` +
          [...titulos].map(([t, a]) => `  · "${t}" en ${a}`).join('\n'),
      );
    }
  });

  it('toda cita usa https', () => {
    for (const cita of todasLasCitasDelRepo) {
      assert.ok(
        cita.url.startsWith('https://'),
        `${cita.archivo} cita una URL que no es https: ${cita.url}`,
      );
    }
  });

  it('ninguna fuente publicada quedó marcada como no verificable', () => {
    // El marcador lo pone la auditoría cuando la URL responde 404. Una pieza con ese marcador
    // puede seguir en el repositorio, pero no puede estar en estado publicable.
    for (const archivo of archivosDeContenido()) {
      const texto = fs.readFileSync(archivo, 'utf8');
      if (!texto.includes('FUENTE NO VERIFICABLE')) continue;

      assert.ok(
        !texto.includes('estadoEditorial: verificado-con-fuentes') &&
          !texto.includes('estadoEditorial: revisado-clinicamente'),
        `${path.relative(process.cwd(), archivo)} tiene fuentes marcadas como no verificables ` +
          'y aun así está en un estado publicable',
      );
    }
  });

  it('los ids del registro de interfaz son únicos', () => {
    const vistos = new Set<string>();
    for (const f of fuentes) {
      assert.ok(!vistos.has(f.id), `Id de fuente duplicado: ${f.id}`);
      vistos.add(f.id);
    }
  });
});
