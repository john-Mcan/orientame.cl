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
  opcionesDe,
  rutaDe,
  todasLasGuias,
  todosLosNodos,
  todosLosPasos,
  RUTA_BASE,
  RUTA_URGENCIA,
} from '../src/lib/orientador.ts';

// Rutas que el sitio genera hoy. Cualquier destino del orientador debe estar aquí:
// enviar a una persona a un 404 es el peor resultado posible de este recorrido.
//
// Al agregar una ruta nueva (`/donde/`, `/siento/`, `/primera-vez/`, `/acompanar/`), revisar la
// tabla de puntos de enriquecimiento de `docs/plan/fase-2-decisiones.md` D9: indica qué guía
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

/** Todo el texto de lectura de una guía, en el orden en que se muestra. */
function textoDe(guia: ReturnType<typeof todasLasGuias>[number]): string {
  return [
    guia.titulo,
    ...guia.reconocimiento,
    ...guia.secciones.flatMap((seccion) => [seccion.titulo, ...seccion.parrafos]),
    guia.menorCompromiso.texto,
  ].join(' ');
}

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
    // Recorre tanto las opciones de un paso como las salidas de una guía: desde D38 una
    // guía también puede llevar a otro nodo del orientador.
    const alcanzables = new Set<string>(['inicio']);
    const pendientes = ['inicio'];

    while (pendientes.length > 0) {
      const actual = getNodo(pendientes.pop()!);
      if (!actual) continue;

      for (const opcion of opcionesDe(actual)) {
        if (esRutaAbsoluta(opcion.destino) || alcanzables.has(opcion.destino)) continue;
        alcanzables.add(opcion.destino);
        pendientes.push(opcion.destino);
      }
    }

    for (const nodo of todosLosNodos()) {
      assert.ok(alcanzables.has(nodo.id), `El nodo "${nodo.id}" no es alcanzable desde el inicio`);
    }
  });

  it('ningún recorrido supera cuatro decisiones antes de una guía', () => {
    for (const guia of todasLasGuias()) {
      const decisiones = linaje(guia.id).length - 1;
      assert.ok(
        decisiones >= 1 && decisiones <= 4,
        `La guía "${guia.id}" requiere ${decisiones} decisiones (máximo 4)`,
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

  it('cada barrera del documento base tiene una puerta de entrada', () => {
    // §4 declara siete barreras. Faltaban tres —resolverlo por mi cuenta (§4.2), nunca he
    // ido (§4.6) y todavía no estoy preparado (§4.7)— y quien entraba con una de esas
    // caía en una rama cuya única salida era pedir hora. Ver D38.
    const alcanzables = new Set(todosLosNodos().map((nodo) => nodo.id));

    for (const id of [
      'no-se-si-necesito-ayuda',
      'nunca-he-consultado',
      'me-cuesta-dar-el-paso',
      'no-se-que-decir',
      'prefiero-por-mi-cuenta',
      'entenderlo-primero',
      'todavia-no',
      'no-se-donde-buscar',
      'me-preocupa-el-costo',
      'me-preocupa-alguien',
    ]) {
      assert.ok(alcanzables.has(id), `Falta el nodo "${id}", que cubre una barrera de §4`);
    }
  });

  it('un paso intermedio reconoce la barrera antes de volver a preguntar', () => {
    // `inicio` es la excepción: no viene de ninguna elección previa que reconocer.
    for (const paso of todosLosPasos()) {
      if (paso.id === 'inicio') continue;

      assert.ok(
        paso.entrada && paso.entrada.length > 0,
        `El paso "${paso.id}" pregunta de nuevo sin acusar recibo de lo que la persona eligió`,
      );
      assert.ok(paso.titulo, `El paso "${paso.id}" necesita título propio para su encabezado`);
    }
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

  it('cada opción y cada salida resuelve a una ruta válida', () => {
    for (const nodo of todosLosNodos()) {
      for (const opcion of opcionesDe(nodo)) {
        const href = hrefDeDestino(opcion.destino);
        assert.ok(
          rutasValidas.has(href),
          `La opción "${opcion.etiqueta}" de "${nodo.id}" apunta a "${href}", que no existe`,
        );
      }
    }
  });

  it('las alternativas de menor compromiso resuelven a una ruta válida', () => {
    for (const guia of todasLasGuias()) {
      const enlace = guia.menorCompromiso.enlace;
      if (!enlace) continue;

      const href = hrefDeDestino(enlace.destino);
      assert.ok(
        rutasValidas.has(href),
        `La alternativa de "${guia.id}" apunta a "${href}", que no existe`,
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

describe('Cada guía reconoce, explica y ofrece algo utilizable', () => {
  it('toda guía nombra la situación antes de explicar o proponer', () => {
    for (const guia of todasLasGuias()) {
      assert.ok(guia.titulo.length > 0, `"${guia.id}" necesita título`);
      assert.ok(
        guia.reconocimiento.length > 0,
        `"${guia.id}" no reconoce lo que la persona eligió: es lo primero que debe leerse`,
      );
    }
  });

  it('toda guía tiene lectura con subtítulos, no sólo un par de párrafos', () => {
    // Lo que se corrigió en D38: los nueve nodos terminales tenían exactamente dos
    // párrafos porque el modelo de datos no permitía más. La ruta central del producto
    // era la parte menos escrita del sitio.
    for (const guia of todasLasGuias()) {
      assert.ok(
        guia.secciones.length >= 2,
        `"${guia.id}" necesita al menos dos secciones de lectura`,
      );

      for (const seccion of guia.secciones) {
        assert.ok(seccion.titulo.length > 0, `Una sección de "${guia.id}" no tiene subtítulo`);
        assert.ok(
          seccion.parrafos.length > 0,
          `La sección "${seccion.titulo}" de "${guia.id}" no tiene texto`,
        );
      }
    }
  });

  it('toda guía ofrece al menos una acción concreta', () => {
    for (const guia of todasLasGuias()) {
      assert.ok(guia.acciones.length > 0, `"${guia.id}" necesita al menos una acción`);
    }
  });

  it('toda guía devuelve la decisión de hacia dónde seguir', () => {
    // Una guía sin salidas termina el recorrido por nosotros. Sólo se acepta que falten
    // cuando el enlace de menor compromiso ya ofrece un camino.
    for (const guia of todasLasGuias()) {
      const tieneSalidas = (guia.salidas?.opciones.length ?? 0) > 0;
      assert.ok(
        tieneSalidas || guia.menorCompromiso.enlace,
        `"${guia.id}" no ofrece ninguna continuación`,
      );

      if (guia.salidas) {
        assert.match(
          guia.salidas.pregunta,
          /\?$/,
          `Las salidas de "${guia.id}" deben plantearse como pregunta`,
        );
      }
    }
  });

  it('toda guía ofrece una alternativa de menor compromiso', () => {
    for (const guia of todasLasGuias()) {
      assert.ok(
        guia.menorCompromiso.texto.trim().length > 0,
        `"${guia.id}" debe ofrecer una salida de menor compromiso`,
      );
    }
  });

  it('urgencia nunca se presenta como alternativa de menor compromiso', () => {
    for (const guia of todasLasGuias()) {
      const enlace = guia.menorCompromiso.enlace;
      if (!enlace) continue;

      assert.notEqual(
        hrefDeDestino(enlace.destino),
        RUTA_URGENCIA,
        `"${guia.id}" presenta urgencia como paso de menor compromiso`,
      );
    }
  });

  it('urgencia tampoco aparece entre las salidas de una guía', () => {
    for (const guia of todasLasGuias()) {
      for (const opcion of guia.salidas?.opciones ?? []) {
        assert.notEqual(
          hrefDeDestino(opcion.destino),
          RUTA_URGENCIA,
          `"${guia.id}" ofrece urgencia como una salida más; es una opción declarada, no un destino sugerido`,
        );
      }
    }
  });

  it('los guiones copiables son mensajes redactados, no plantillas con espacios en blanco', () => {
    for (const guia of todasLasGuias()) {
      for (const accion of guia.acciones) {
        if (accion.tipo !== 'guion') continue;

        assert.ok(accion.texto.length > 30, `Guion demasiado corto en "${guia.id}"`);
        assert.ok(
          !/_{2,}|\[.+\]|\{.+\}/.test(accion.texto),
          `El guion "${accion.titulo}" contiene marcadores sin completar`,
        );
      }
    }
  });

  it('los números para marcar sólo contienen caracteres válidos de un tel:', () => {
    for (const guia of todasLasGuias()) {
      for (const accion of guia.acciones) {
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
    const conFuente: { donde: string; ids: readonly string[] }[] = [];

    for (const guia of todasLasGuias()) {
      for (const dato of guia.datos ?? []) {
        conFuente.push({ donde: `dato "${dato.titulo}" de "${guia.id}"`, ids: dato.fuenteIds });
      }
      for (const accion of guia.acciones) {
        if (accion.tipo !== 'llamada') continue;
        conFuente.push({
          donde: `línea "${accion.titulo}" de "${guia.id}"`,
          ids: accion.fuenteIds,
        });
      }
      for (const seccion of guia.secciones) {
        if (!seccion.fuenteIds) continue;
        conFuente.push({
          donde: `sección "${seccion.titulo}" de "${guia.id}"`,
          ids: seccion.fuenteIds,
        });
      }
    }

    for (const { donde, ids } of conFuente) {
      assert.ok(ids.length > 0, `El ${donde} no cita ninguna fuente`);
      for (const id of ids) {
        assert.ok(getFuente(id), `El ${donde} cita la fuente inexistente "${id}"`);
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
    for (const guia of todasLasGuias()) {
      for (const dato of guia.datos ?? []) for (const id of dato.fuenteIds) usadas.add(id);
      for (const seccion of guia.secciones)
        for (const id of seccion.fuenteIds ?? []) usadas.add(id);
      for (const accion of guia.acciones) {
        if (accion.tipo !== 'llamada') continue;
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

  it('no cuantifica frecuencias sin una fuente que las respalde', () => {
    // "Es frecuente", "la mayoría", "mucha gente" son afirmaciones epidemiológicas y
    // pasaban sin fuente porque suenan a consuelo. Cuando queremos decir que algo es
    // entendible, se dice como juicio editorial; cuando queremos citar una frecuencia,
    // se cita la fuente en la sección que la contiene.
    const cuantificador =
      /\bes (muy )?(frecuente|común|habitual)\b|\bla mayor(ía|ia|_)? (de|parte)\b|\bmucha gente\b|\bmuchas personas\b|\bm[aá]s comunes\b|\ba todo el mundo le pasa\b/i;

    for (const guia of todasLasGuias()) {
      const sinFuente = [
        guia.titulo,
        ...guia.reconocimiento,
        guia.menorCompromiso.texto,
        ...guia.secciones
          .filter((seccion) => !seccion.fuenteIds?.length)
          .flatMap((seccion) => [seccion.titulo, ...seccion.parrafos]),
      ].join(' ');

      const hallado = cuantificador.exec(sinFuente);
      assert.equal(
        hallado,
        null,
        `"${guia.id}" cuantifica una frecuencia sin fuente: "${hallado?.[0]}"`,
      );
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

    for (const guia of todasLasGuias()) {
      const pregunta = guia.salidas?.pregunta ?? '';
      assert.ok(
        !/\bpeligro\b|\briesgo\b|suicid|hacerte daño|lastimar/i.test(pregunta),
        `Las salidas de "${guia.id}" formulan una pregunta de evaluación de riesgo`,
      );
    }
  });

  it('no usa lenguaje de diagnóstico ni de puntuación clínica', () => {
    const prohibido =
      /diagn[oó]stic|punt(aje|uaci[oó]n)|tienes (depresi|ansied)|padeces|trastorno/i;

    /**
     * Quita las menciones negadas antes de buscar lenguaje clínico. Advertir "no dan un
     * diagnóstico" es justo la calibración que exige §2.2; lo que se bloquea es afirmarlo.
     */
    const sinDesmentidos = (texto: string): string =>
      texto
        .replace(/\bno\s+(?:\S+\s+){0,3}?diagn[oó]stic\w*/gi, ' ')
        .replace(/\bsin\s+diagn[oó]stic\w*/gi, ' ')
        .replace(/\bno\s+(?:\S+\s+){0,3}?trastorno\w*/gi, ' ');

    for (const nodo of todosLosNodos()) {
      for (const opcion of opcionesDe(nodo)) {
        assert.ok(
          !prohibido.test(sinDesmentidos(`${opcion.etiqueta} ${opcion.detalle ?? ''}`)),
          `La opción "${opcion.etiqueta}" usa lenguaje clínico`,
        );
      }
    }

    for (const guia of todasLasGuias()) {
      assert.ok(
        !/\btienes (depresi|ansied)|\bpadeces\b|te diagnosticamos/i.test(textoDe(guia)),
        `La guía "${guia.id}" contiene lenguaje diagnóstico`,
      );
    }
  });

  it('no usa persuasión por miedo ni obligación', () => {
    const prohibido =
      /si no (buscas|pides) ayuda.*(empeor|grave)|necesitas ir al|tienes que ir al|va a empeorar/i;

    for (const guia of todasLasGuias()) {
      assert.ok(!prohibido.test(textoDe(guia)), `La guía "${guia.id}" usa persuasión por miedo`);
    }
  });

  it('no promete resultados ni comportamientos de terceros', () => {
    const prohibido =
      /no van a juzgarte|nadie te va a juzgar|te vas a sentir mejor|garantiza|siempre funciona|te van a entender/i;

    for (const guia of todasLasGuias()) {
      assert.ok(!prohibido.test(textoDe(guia)), `La guía "${guia.id}" hace una promesa indebida`);
    }
  });

  it('no le asume género a quien lee, tampoco en los guiones copiables', () => {
    // El orientador habla en segunda persona y sus guiones se copian en primera, así que
    // un adjetivo concordado excluye a la mitad de las personas que lo van a ocupar.
    // Ya pasaba: "Estoy inscrito aquí", "estar dispuesto", "no seguir solo".
    // La barra ("inscrito/a") tampoco sirve: se copia dentro del mensaje que se envía.
    // "listo/lista" queda fuera a propósito: casi siempre concuerda con un objeto y no con
    // la persona ("el mensaje listo", "dejarlo listo"), así que como regla automática da
    // más falsos positivos que hallazgos. Ese caso queda en revisión editorial.
    const concordado =
      /\b(inscrit[oa]|dispuest[oa]|preparad[oa]|cansad[oa]|agotad[oa]|segur[oa] de|sol[oa])\b/i;

    // "una sola persona" y "un solo día" no hablan de quien lee.
    const sinNumerales = (texto: string): string =>
      texto.replace(/\bun[a]? sol[oa]\b/gi, ' ').replace(/\bde una sol[ao]\b/gi, ' ');

    for (const guia of todasLasGuias()) {
      const guiones = guia.acciones
        .filter((accion) => accion.tipo === 'guion')
        .map((accion) => (accion.tipo === 'guion' ? accion.texto : ''))
        .join(' ');

      const datos = (guia.datos ?? []).flatMap((dato) => [dato.titulo, dato.descripcion]).join(' ');

      const hallado = concordado.exec(sinNumerales(`${textoDe(guia)} ${guiones} ${datos}`));
      assert.equal(hallado, null, `"${guia.id}" asume el género de quien lee: "${hallado?.[0]}"`);
    }

    for (const paso of todosLosPasos()) {
      const texto = [paso.titulo ?? '', ...(paso.entrada ?? []), paso.ayuda ?? '']
        .concat(paso.opciones.flatMap((opcion) => [opcion.etiqueta, opcion.detalle ?? '']))
        .join(' ');

      const hallado = concordado.exec(sinNumerales(texto));
      assert.equal(
        hallado,
        null,
        `El paso "${paso.id}" asume el género de quien lee: "${hallado?.[0]}"`,
      );
    }
  });
});
