import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { puntuarInstrumento, type InstrumentoId } from '../src/lib/scoring.ts';

// Por qué existe este archivo: la razón de publicar el PHQ-8 y no el PHQ-9 es que el noveno
// ítem del PHQ-9 pregunta por ideación suicida, y este sitio no formula preguntas que evalúen
// riesgo mientras no exista un protocolo de crisis aprobado (D25, D26). Esa decisión vivía
// sólo en la documentación: nada impedía que un instrumento nuevo entrara con esa pregunta.
//
// Lo otro que se cubre acá es la correspondencia entre las preguntas y su tabla de rangos. Si
// no calzan, quien responde no ve un error de programación: ve «No pudimos interpretar el
// puntaje» después de haber contestado el cuestionario completo.

const DIRECTORIO = path.join(process.cwd(), 'src', 'content', 'instrumentos');

/** Preguntas de evaluación de riesgo. La misma lista que ya vigila el orientador. */
const PREGUNTA_DE_RIESGO =
  /\bpeligro\b|\briesgo\b|suicid|autoles|hacerte daño|lastimar|mejor muerto/i;

interface Instrumento {
  archivo: string;
  id: InstrumentoId;
  publicable: boolean;
  declaraAdaptacion: boolean;
  preguntas: string[];
  valores: number[];
  rangos: { desde: number; hasta: number }[];
  pasos: string[];
}

/** Devuelve las líneas de un bloque de primer nivel del frontmatter, sin su clave. */
function bloque(texto: string, clave: string): string[] {
  const lineas = texto.split('\n');
  const inicio = lineas.findIndex((linea) => linea.startsWith(`${clave}:`));
  if (inicio === -1) return [];

  const resto = lineas.slice(inicio + 1);
  const fin = resto.findIndex((linea) => /^[a-zA-Z-]+:/.test(linea) || linea === '---');
  return fin === -1 ? resto : resto.slice(0, fin);
}

function leerInstrumentos(): Instrumento[] {
  return fs
    .readdirSync(DIRECTORIO)
    .filter((nombre) => nombre.endsWith('.md'))
    .map((nombre) => {
      const archivo = path.join(DIRECTORIO, nombre);
      const texto = fs.readFileSync(archivo, 'utf8');
      const rangos = bloque(texto, 'rangos');

      return {
        archivo: nombre,
        id: /^instrumentoId:\s*(\S+)/m.exec(texto)?.[1] as InstrumentoId,
        publicable:
          texto.includes('estadoEditorial: verificado-con-fuentes') ||
          texto.includes('estadoEditorial: revisado-clinicamente'),
        declaraAdaptacion: /^adaptacion:\s*'/m.test(texto),
        preguntas: bloque(texto, 'preguntas').flatMap(
          (linea) => /^\s+texto:\s*'(.+?)'\s*$/.exec(linea)?.slice(1) ?? [],
        ),
        valores: bloque(texto, 'opciones').flatMap(
          (linea) => /^\s*-?\s*valor:\s*(\d+)/.exec(linea)?.slice(1).map(Number) ?? [],
        ),
        pasos: rangos.flatMap((linea) => /^\s+href:\s*'(.+?)'/.exec(linea)?.slice(1) ?? []),
        rangos: rangos.flatMap((linea, indice) => {
          const desde = /^\s+-?\s*desde:\s*(\d+)/.exec(linea)?.[1];
          const hasta = /^\s+hasta:\s*(\d+)/.exec(rangos[indice + 1] ?? '')?.[1];
          return desde !== undefined && hasta !== undefined
            ? [{ desde: Number(desde), hasta: Number(hasta) }]
            : [];
        }),
      };
    });
}

const instrumentos = leerInstrumentos();
const publicables = instrumentos.filter((instrumento) => instrumento.publicable);

describe('Instrumentos publicados', () => {
  it('hay instrumentos que revisar', () => {
    assert.ok(publicables.length > 0, 'No se leyó ningún instrumento publicable');
  });

  for (const instrumento of publicables) {
    describe(instrumento.archivo, () => {
      it('no formula preguntas que evalúen riesgo', () => {
        for (const pregunta of instrumento.preguntas) {
          assert.ok(
            !PREGUNTA_DE_RIESGO.test(pregunta),
            `Pregunta de evaluación de riesgo en ${instrumento.archivo}: "${pregunta}".\n` +
              'Un instrumento con esa pregunta está bloqueado hasta que exista un protocolo ' +
              'de crisis aprobado clínicamente (D25, D26).',
          );
        }
      });

      it('declara de dónde viene la redacción de sus ítems', () => {
        assert.ok(
          instrumento.declaraAdaptacion,
          `${instrumento.archivo} no declara \`adaptacion\`. Un instrumento publicado tiene que ` +
            'decir si reproduce una versión oficial o si su redacción es propia.',
        );
      });

      it('sus rangos cubren todos los puntajes alcanzables, sin huecos', () => {
        const maximo = Math.max(...instrumento.valores) * instrumento.preguntas.length;
        const ordenados = [...instrumento.rangos].sort((a, b) => a.desde - b.desde);

        assert.equal(ordenados[0]?.desde, 0, 'El primer rango debe empezar en 0');
        assert.equal(
          ordenados.at(-1)?.hasta,
          maximo,
          `El último rango debe llegar a ${maximo}, el puntaje máximo alcanzable`,
        );

        for (let i = 1; i < ordenados.length; i++) {
          assert.equal(
            ordenados[i].desde,
            ordenados[i - 1].hasta + 1,
            `Hueco o solapamiento entre ${ordenados[i - 1].hasta} y ${ordenados[i].desde}`,
          );
        }
      });

      it('cada rango ofrece pasos y ninguno termina en 404', () => {
        // El resultado ya no es sólo una etiqueta: cada rango continúa en alguna parte del
        // sitio. Un paso que apunta a una ruta inexistente es el peor final posible para un
        // recorrido, y acá pasaría justo después de responder el cuestionario completo.
        assert.ok(
          instrumento.pasos.length >= instrumento.rangos.length,
          `${instrumento.archivo}: hay rangos sin pasos a dónde seguir`,
        );

        for (const href of instrumento.pasos) {
          const archivo = path.join(process.cwd(), 'dist', href.replace(/^\//, ''), 'index.html');
          assert.ok(
            fs.existsSync(archivo),
            `${instrumento.archivo}: el paso "${href}" no existe en dist`,
          );
        }
      });

      it('el scoring acepta exactamente sus preguntas y llega a su puntaje máximo', () => {
        const mayor = Math.max(...instrumento.valores);
        const todasAlMaximo = Array<number>(instrumento.preguntas.length).fill(mayor);

        assert.equal(
          puntuarInstrumento(instrumento.id, todasAlMaximo).puntaje,
          mayor * instrumento.preguntas.length,
        );
        assert.throws(
          () => puntuarInstrumento(instrumento.id, todasAlMaximo.slice(1)),
          `${instrumento.id} aceptó menos respuestas que preguntas tiene`,
        );
      });
    });
  }
});
