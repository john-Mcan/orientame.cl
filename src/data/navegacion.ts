// Modelo de navegación del sitio.
//
// Es la única lista de secciones: la consumen el encabezado (mega-menú y cajón móvil), la
// grilla de secciones de la portada y el pie. Antes cada uno mantenía su propia lista y por
// eso el encabezado seguía sin `/autoevaluacion` cuando la fase 4 ya la había publicado.
//
// Sólo se declaran destinos que existen como ruta estática; ninguno puede terminar en 404.
// Las comunas se derivan de `COMUNAS_PILOTO` para que agregar una comuna no exija tocar
// también el menú.

import { COMUNAS_PILOTO } from '@/lib/resources';
import type { IconName } from '@/lib/iconos';

export interface EnlaceNavegacion {
  readonly href: string;
  readonly etiqueta: string;
  /** Qué encuentra la persona ahí. Se muestra en el panel del mega-menú. */
  readonly detalle?: string;
}

export interface SeccionNavegacion {
  readonly id: string;
  /** Etiqueta del nivel superior del menú. */
  readonly etiqueta: string;
  /** Destino del nivel superior: el menú siempre es un enlace real, no sólo un desplegable. */
  readonly href: string;
  /**
   * Cómo se nombra ese destino dentro del panel. El menú no puede dar por supuesto que la
   * persona entienda que la etiqueta del grupo es además un enlace: al abrirlo tiene que
   * encontrar el destino escrito, con su nombre y su flecha, como cualquier otro enlace.
   */
  readonly etiquetaDestino: string;
  readonly icono: IconName;
  /** Bajada de la sección, reutilizada en la portada. */
  readonly descripcion: string;
  /** Versión breve para pantallas angostas. */
  readonly descripcionMovil: string;
  /** El resto de la sección. No repite `href`: ese destino ya lo nombra `etiquetaDestino`. */
  readonly enlaces: readonly EnlaceNavegacion[];
}

const enlacesComunas: readonly EnlaceNavegacion[] = COMUNAS_PILOTO.map((comuna) => ({
  href: `/donde/${comuna.regionSlug}/${comuna.slug}`,
  etiqueta: comuna.nombre,
  detalle: `Región ${comuna.region}`,
}));

export const SECCIONES: readonly SeccionNavegacion[] = [
  {
    id: 'empezar',
    etiqueta: 'Empezar',
    href: '/empezar',
    etiquetaDestino: 'Ir al orientador de primer paso',
    icono: 'brujula',
    descripcion:
      'Un recorrido corto de preguntas, o la vivencia que reconoces, para llegar a algo que puedas hacer hoy.',
    descripcionMovil: 'Preguntas breves para llegar a un primer paso.',
    enlaces: [
      {
        href: '/siento',
        etiqueta: 'Lo que estás sintiendo',
        detalle: 'Vivencias cotidianas explicadas sin términos clínicos.',
      },
      {
        href: '/temas',
        etiqueta: 'Temas de salud mental',
        detalle: 'Qué significa cada cuadro y de dónde sale cada dato.',
      },
      {
        href: '/autoevaluacion',
        etiqueta: 'Autoevaluaciones',
        detalle: 'Instrumentos breves que se puntúan en tu dispositivo.',
      },
    ],
  },
  {
    id: 'donde',
    etiqueta: 'Dónde consultar',
    href: '/donde',
    etiquetaDestino: 'Ir al directorio y las líneas oficiales',
    icono: 'mapa',
    descripcion:
      'Líneas oficiales de orientación, atención pública por comuna y clínicas universitarias, con la fuente de cada dato.',
    descripcionMovil: 'Líneas oficiales y atención pública por comuna.',
    enlaces: [
      ...enlacesComunas,
      {
        href: '/donde/clinicas-universitarias',
        etiqueta: 'Clínicas universitarias',
        detalle: 'Centros docentes con atención supervisada a bajo costo.',
      },
    ],
  },
  {
    id: 'primera-vez',
    etiqueta: 'Primera vez',
    href: '/primera-vez',
    etiquetaDestino: 'Ir a la guía de primera vez',
    icono: 'calendario',
    descripcion:
      'Qué ocurre en una primera consulta, qué decir para pedir hora, cuánto cuesta y cómo elegir profesional.',
    descripcionMovil: 'Qué pasa, qué decir, cuánto cuesta y cómo elegir.',
    enlaces: [
      {
        href: '/primera-vez/que-pasa-en-sesion',
        etiqueta: 'Qué pasa en una sesión',
        detalle: 'Duración, preguntas habituales y secreto profesional.',
      },
      {
        href: '/primera-vez/que-decir',
        etiqueta: 'Qué decir para pedir hora',
        detalle: 'Guiones listos para copiar y adaptar.',
      },
      {
        href: '/primera-vez/cuanto-cuesta',
        etiqueta: 'Cuánto cuesta en Chile',
        detalle: 'Vía pública, universitaria y privada, con qué preguntar.',
      },
      {
        href: '/primera-vez/como-elegir',
        etiqueta: 'Cómo elegir profesional',
        detalle: 'Psicología y psiquiatría, y cómo verificar el registro oficial.',
      },
    ],
  },
  {
    id: 'acompanar',
    etiqueta: 'Acompañar',
    href: '/acompanar',
    etiquetaDestino: 'Ir a las guías de acompañamiento',
    icono: 'personas',
    descripcion:
      'Formas concretas de escuchar y ofrecer ayuda a una persona adulta sin presionarla ni decidir por ella.',
    descripcionMovil: 'Cómo escuchar y ayudar sin presionar.',
    enlaces: [
      {
        href: '/acompanar/preguntar-y-escuchar',
        etiqueta: 'Cómo preguntar y escuchar',
        detalle: 'Una forma directa de abrir la conversación.',
      },
      {
        href: '/acompanar/ofrecer-ayuda-sin-presionar',
        etiqueta: 'Ofrecer ayuda sin presionar',
        detalle: 'Respetar lo que decide y lo que tú puedes ofrecer.',
      },
      {
        href: '/acompanar/acompanar-primer-contacto',
        etiqueta: 'Acompañar un primer contacto',
        detalle: 'Ayudar con una llamada sin hablar por la otra persona.',
      },
    ],
  },
  {
    id: 'proyecto',
    etiqueta: 'El proyecto',
    href: '/sobre',
    etiquetaDestino: 'Ir a la página del proyecto',
    icono: 'libro',
    descripcion:
      'Quiénes somos, cómo verificamos cada afirmación y qué puedes esperar de este sitio.',
    descripcionMovil: 'Quiénes somos y cómo verificamos.',
    enlaces: [
      {
        href: '/metodologia',
        etiqueta: 'Cómo verificamos',
        detalle: 'Las dos vías de verificación y el uso de IA.',
      },
      {
        href: '/legal',
        etiqueta: 'Información legal',
        detalle: 'Privacidad, alcance y términos de uso.',
      },
    ],
  },
];

/** El sitio se sirve sin barra final, pero comparar rutas normalizadas evita depender de eso. */
const sinBarraFinal = (ruta: string): string => (ruta.length > 1 ? ruta.replace(/\/+$/, '') : ruta);

/** `/empezar/algo` sigue marcando `/empezar` como sección actual. */
export function esRutaActual(href: string, ruta: string): boolean {
  const destino = sinBarraFinal(href);
  const actual = sinBarraFinal(ruta);
  if (destino === '/') return actual === '/';
  return actual === destino || actual.startsWith(`${destino}/`);
}

/** Coincidencia exacta: es la única que puede anunciarse como `aria-current="page"`. */
export function esPaginaActual(href: string, ruta: string): boolean {
  return sinBarraFinal(href) === sinBarraFinal(ruta);
}
