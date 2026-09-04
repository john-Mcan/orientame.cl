import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fuentes, getFuente } from '../src/data/fuentes.ts';

/**
 * Archivos de interfaz que pueden citar una fuente del registro. Se excluye el propio
 * registro: si no, encontrar el id dentro de su declaración haría pasar la prueba siempre.
 */
function archivosDeInterfaz(dir = path.join(process.cwd(), 'src')): string[] {
  const registro = path.join(process.cwd(), 'src', 'data', 'fuentes.ts');
  const encontrados: string[] = [];
  for (const entrada of fs.readdirSync(dir, { withFileTypes: true })) {
    const completo = path.join(dir, entrada.name);
    if (entrada.isDirectory()) encontrados.push(...archivosDeInterfaz(completo));
    else if (/\.(astro|ts|tsx)$/.test(entrada.name) && completo !== registro)
      encontrados.push(completo);
  }
  return encontrados;
}
import {
  descripcionDe,
  destinosInternos,
  esRutaAbsoluta,
  getNodo,
  hrefDeDestino,
  linaje,
  migasDe,
  nodosConRutaPropia,
  rutaDe,
  todosLosNodos,
  todosLosPasos,
  todosLosResultados,
  RUTA_BASE,
  RUTA_URGENCIA,
} from '../src/lib/orientador.ts';

// Rutas que el sitio genera hoy. Cualquier destino del orientador debe estar aquí:
// enviar a una persona a un 404 es el peor resultado posible de este recorrido.
//
// Al agregar una ruta nueva (`/donde/`, `/siento/`, `/primera-vez/`, `/acompanar/`), revisar la
// tabla de puntos de enriquecimiento de `docs/plan/fase-2-decisiones.md` D9: indica qué resultado
// del orientador debería enlazarla y con qué nivel de verificación.
const RUTAS_ESTATICAS = new Set([
  '/',
  '/empezar',
  '/urgencia',
  '/sobre',
  '/metodologia',
  '/metodologia/protocolo-crisis',
  '/legal',
  '/legal/privacidad',
  '/legal/alcance',
  '/legal/terminos',
  '/siento',
  '/temas',
  '/primera-vez',
  '/primera-vez/que-pasa-en-sesion',
  '/primera-vez/que-decir',
  '/primera-vez/cuanto-cuesta',
  '/primera-vez/como-elegir',
  '/donde',
  '/donde/clinicas-universitarias',
  '/donde/metropolitana/santiago',
  '/donde/metropolitana/providencia',
  '/donde/metropolitana/puente-alto',
  '/buscar',
  '/autoevaluacion',
  '/autoevaluacion/oms-5',
  '/autoevaluacion/gad-7',
  '/acompanar',
  '/acompanar/preguntar-y-escuchar',
  '/acompanar/ofrecer-ayuda-sin-presionar',
  '/acompanar/acompanar-primer-contacto',
]);

const rutasDelOrientador = new Set(nodosConRutaPropia().map((nodo) => rutaDe(nodo.id)));
const rutasValidas = new Set([...RUTAS_ESTATICAS, ...rutasDelOrientador]);

describe('Estructura del árbol del orientador', () => {
  it('existe el paso inicial y tiene opciones', () => {
    const inicio = getNodo('inicio');
    assert.ok(inicio, 'Debe existir el nodo "inicio"');
    assert.equal(inicio.tipo, 'paso');
    assert.ok(inicio.tipo === 'paso' && inicio.opciones.length > 0);
  });

  it('ningún id está duplicado', () => {
    const vistos = new Set<string>();
    for (const nodo of todosLosNodos()) {
      assert.ok(!vistos.has(nodo.id), `Id duplicado: "${nodo.id}"`);
      vistos.add(nodo.id);
    }
  });

  it('cada nodo salvo el inicial tiene padre y todo padre existe', () => {
    for (const nodo of todosLosNodos()) {
      if (nodo.id === 'inicio') {
        assert.equal(nodo.padre, undefined, 'El nodo inicial no debe tener padre');
        continue;
      }

      assert.ok(nodo.padre, `El nodo "${nodo.id}" debe declarar un padre`);
      assert.ok(getNodo(nodo.padre!), `El padre "${nodo.padre}" de "${nodo.id}" no existe`);
    }
  });

  it('el linaje de todo nodo llega hasta el inicio sin ciclos', () => {
    for (const nodo of todosLosNodos()) {
      const cadena = linaje(nodo.id);
      assert.equal(cadena[0]?.id, 'inicio', `El linaje de "${nodo.id}" debe partir en "inicio"`);
      assert.equal(cadena.at(-1)?.id, nodo.id);
      assert.equal(new Set(cadena.map((n) => n.id)).size, cadena.length, 'Hay un ciclo');
    }
  });

  it('todo nodo es alcanzable desde el paso inicial', () => {
    const alcanzables = new Set<string>(['inicio']);
    const pendientes = ['inicio'];

    while (pendientes.length > 0) {
      const actual = getNodo(pendientes.pop()!);
      if (actual?.tipo !== 'paso') continue;

      for (const opcion of actual.opciones) {
        if (esRutaAbsoluta(opcion.destino) || alcanzables.has(opcion.destino)) continue;
        alcanzables.add(opcion.destino);
        pendientes.push(opcion.destino);
      }
    }

    for (const nodo of todosLosNodos()) {
      assert.ok(alcanzables.has(nodo.id), `El nodo "${nodo.id}" no es alcanzable desde el inicio`);
    }
  });

  it('ningún recorrido supera cuatro decisiones antes de un resultado', () => {
    for (const resultado of todosLosResultados()) {
      const decisiones = linaje(resultado.id).length - 1;
      assert.ok(
        decisiones >= 1 && decisiones <= 4,
        `El resultado "${resultado.id}" requiere ${decisiones} decisiones (máximo 4)`,
      );
    }
  });

  it('las rutas generadas son únicas y cuelgan de /empezar', () => {
    const rutas = nodosConRutaPropia().map((nodo) => rutaDe(nodo.id));
    assert.equal(new Set(rutas).size, rutas.length, 'Hay rutas duplicadas');

    for (const ruta of rutas) {
      assert.ok(ruta.startsWith(`${RUTA_BASE}/`), `La ruta "${ruta}" debe colgar de ${RUTA_BASE}`);
      assert.ok(!ruta.endsWith('/'), `La ruta "${ruta}" no debe terminar en barra`);
      assert.match(ruta, /^[a-z0-9/-]+$/, `La ruta "${ruta}" debe usar sólo minúsculas y guiones`);
    }
  });

  it('el paso inicial se sirve en /empezar', () => {
    assert.equal(rutaDe('inicio'), RUTA_BASE);
  });
});

describe('Destinos: nada del orientador puede terminar en 404', () => {
  it('todos los destinos internos apuntan a una ruta que el sitio genera', () => {
    for (const destino of destinosInternos()) {
      assert.ok(
        rutasValidas.has(destino),
        `El orientador enlaza a "${destino}", que no existe en el sitio`,
      );
    }
  });

  it('cada opción de cada paso resuelve a una ruta válida', () => {
    for (const paso of todosLosPasos()) {
      for (const opcion of paso.opciones) {
        const href = hrefDeDestino(opcion.destino);
        assert.ok(
          rutasValidas.has(href),
          `La opción "${opcion.etiqueta}" del paso "${paso.id}" apunta a "${href}", que no existe`,
        );
      }
    }
  });

  it('las alternativas de menor compromiso resuelven a una ruta válida', () => {
    for (const resultado of todosLosResultados()) {
      const enlace = resultado.menorCompromiso.enlace;
      if (!enlace) continue;

      const href = hrefDeDestino(enlace.destino);
      assert.ok(
        rutasValidas.has(href),
        `La alternativa de "${resultado.id}" apunta a "${href}", que no existe`,
      );
    }
  });

  it('las migas de pan enlazan sólo a rutas existentes', () => {
    for (const nodo of todosLosNodos()) {
      for (const miga of migasDe(nodo.id)) {
        if (!miga.href) continue;
        assert.ok(
          rutasValidas.has(miga.href),
          `Las migas de "${nodo.id}" enlazan a "${miga.href}", que no existe`,
        );
      }
    }
  });
});

describe('Cada resultado entrega algo utilizable ahora', () => {
  it('todo resultado tiene título, cuerpo y al menos una acción', () => {
    for (const resultado of todosLosResultados()) {
      assert.ok(resultado.titulo.length > 0, `"${resultado.id}" necesita título`);
      assert.ok(resultado.cuerpo.length > 0, `"${resultado.id}" necesita cuerpo`);
      assert.ok(resultado.acciones.length > 0, `"${resultado.id}" necesita al menos una acción`);
    }
  });

  it('todo resultado ofrece una alternativa de menor compromiso', () => {
    for (const resultado of todosLosResultados()) {
      assert.ok(
        resultado.menorCompromiso.texto.trim().length > 0,
        `"${resultado.id}" debe ofrecer una salida de menor compromiso`,
      );
    }
  });

  it('urgencia nunca se presenta como alternativa de menor compromiso', () => {
    for (const resultado of todosLosResultados()) {
      const enlace = resultado.menorCompromiso.enlace;
      if (!enlace) continue;

      assert.notEqual(
        hrefDeDestino(enlace.destino),
        RUTA_URGENCIA,
        `"${resultado.id}" presenta urgencia como paso de menor compromiso`,
      );
    }
  });

  it('los guiones copiables son mensajes redactados, no plantillas con espacios en blanco', () => {
    for (const resultado of todosLosResultados()) {
      for (const accion of resultado.acciones) {
        if (accion.tipo !== 'guion') continue;

        assert.ok(accion.texto.length > 30, `Guion demasiado corto en "${resultado.id}"`);
        assert.ok(
          !/_{2,}|\[.+\]|\{.+\}/.test(accion.texto),
          `El guion "${accion.titulo}" contiene marcadores sin completar`,
        );
      }
    }
  });

  it('los números para marcar sólo contienen caracteres válidos de un tel:', () => {
    for (const resultado of todosLosResultados()) {
      for (const accion of resultado.acciones) {
        if (accion.tipo !== 'llamada') continue;

        assert.match(
          accion.marcar,
          /^[+*#0-9]+$/,
          `El número "${accion.marcar}" no es marcable desde un enlace tel:`,
        );
      }
    }
  });

  it('toda descripción para metadatos tiene largo utilizable', () => {
    for (const nodo of todosLosNodos()) {
      const descripcion = descripcionDe(nodo);
      assert.ok(
        descripcion.length >= 20 && descripcion.length <= 320,
        `La descripción de "${nodo.id}" mide ${descripcion.length} caracteres`,
      );
    }
  });
});

describe('Trazabilidad de afirmaciones', () => {
  it('toda afirmación sobre el sistema de salud referencia una fuente existente', () => {
    for (const resultado of todosLosResultados()) {
      for (const accion of resultado.acciones) {
        if (accion.tipo === 'guion') continue;
        if (accion.tipo === 'enlace' && accion.fuenteIds.length === 0) continue;

        assert.ok(
          accion.fuenteIds.length > 0,
          `La acción "${accion.titulo}" de "${resultado.id}" no cita ninguna fuente`,
        );

        for (const id of accion.fuenteIds) {
          assert.ok(
            getFuente(id),
            `La acción "${accion.titulo}" cita la fuente inexistente "${id}"`,
          );
        }
      }
    }
  });

  it('cada fuente registrada tiene URL https y fecha de consulta', () => {
    for (const fuente of fuentes) {
      assert.ok(
        fuente.url.startsWith('https://'),
        `La fuente "${fuente.id}" debe usar una URL https`,
      );
      assert.match(
        fuente.consultadoEl,
        /^\d{4}-\d{2}-\d{2}$/,
        `La fuente "${fuente.id}" necesita una fecha de consulta ISO`,
      );
      assert.ok(fuente.organizacion.length > 0, `La fuente "${fuente.id}" necesita organización`);
    }
  });

  it('no hay fuentes declaradas sin uso', () => {
    // El registro también lo consumen páginas y layouts, no sólo el orientador: una fuente
    // citada desde `/primera-vez/como-elegir` no está sin uso.
    const usadas = new Set<string>();
    for (const resultado of todosLosResultados()) {
      for (const accion of resultado.acciones) {
        if (accion.tipo === 'guion') continue;
        for (const id of accion.fuenteIds) usadas.add(id);
      }
    }

    const codigoDelSitio = archivosDeInterfaz()
      .map((archivo) => fs.readFileSync(archivo, 'utf8'))
      .join('\n');

    for (const fuente of fuentes) {
      const citada = usadas.has(fuente.id) || codigoDelSitio.includes(`'${fuente.id}'`);
      assert.ok(citada, `La fuente "${fuente.id}" está declarada pero no se usa`);
    }
  });
});

describe('Límites clínicos del orientador', () => {
  it('no formula preguntas que evalúen riesgo: urgencia siempre es una opción declarada', () => {
    // El sistema no puede concluir que alguien está en crisis (§2.6, §31). El acceso a
    // urgencia se ofrece como opción visible, nunca como resultado de una evaluación.
    for (const paso of todosLosPasos()) {
      assert.ok(
        !/\bpeligro\b|\briesgo\b|suicid|hacerte daño|lastimar/i.test(paso.pregunta),
        `El paso "${paso.id}" formula una pregunta de evaluación de riesgo: "${paso.pregunta}"`,
      );
    }
  });

  it('no usa lenguaje de diagnóstico ni de puntuación clínica', () => {
    const prohibido =
      /diagn[oó]stic|punt(aje|uaci[oó]n)|tienes (depresi|ansied)|padeces|trastorno/i;

    for (const paso of todosLosPasos()) {
      for (const opcion of paso.opciones) {
        assert.ok(
          !prohibido.test(`${opcion.etiqueta} ${opcion.detalle ?? ''}`),
          `La opción "${opcion.etiqueta}" usa lenguaje clínico`,
        );
      }
    }

    for (const resultado of todosLosResultados()) {
      const texto = `${resultado.titulo} ${resultado.cuerpo.join(' ')}`;
      assert.ok(
        !/\btienes (depresi|ansied)|\bpadeces\b|te diagnosticamos/i.test(texto),
        `El resultado "${resultado.id}" contiene lenguaje diagnóstico`,
      );
    }
  });

  it('no usa persuasión por miedo ni obligación', () => {
    const prohibido =
      /si no (buscas|pides) ayuda.*(empeor|grave)|necesitas ir al|tienes que ir al/i;

    for (const resultado of todosLosResultados()) {
      const texto = `${resultado.titulo} ${resultado.cuerpo.join(' ')}`;
      assert.ok(!prohibido.test(texto), `El resultado "${resultado.id}" usa persuasión por miedo`);
    }
  });

  it('no promete resultados ni comportamientos de terceros', () => {
    const prohibido = /no van a juzgarte|te vas a sentir mejor|garantiza|siempre funciona/i;

    for (const resultado of todosLosResultados()) {
      const texto = `${resultado.titulo} ${resultado.cuerpo.join(' ')}`;
      assert.ok(!prohibido.test(texto), `El resultado "${resultado.id}" hace una promesa indebida`);
    }
  });
});
