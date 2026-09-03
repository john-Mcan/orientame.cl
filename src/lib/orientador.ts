// Orientador de primer paso.
//
// El recorrido completo se genera como rutas estáticas (`/empezar/...`) y funciona sin
// JavaScript: cada opción es un enlace y cada estado tiene su propia URL. El botón "atrás"
// del navegador retrocede un paso de forma nativa.
//
// Reglas que este archivo debe respetar:
//
//  - trabaja sobre barreras, nunca sobre scoring ni diagnóstico (§2.2, §6);
//  - toda afirmación sobre el sistema de salud referencia `fuenteIds` de `src/data/fuentes.ts`;
//  - no formula preguntas que evalúen riesgo: el acceso a `/urgencia` es una opción que la
//    persona elige, no una conclusión del sistema (§2.6, §31);
//  - cada resultado entrega algo utilizable ahora y sólo enlaza a rutas que existen.

export const RUTA_BASE = '/empezar';
export const RUTA_URGENCIA = '/urgencia';

/** Acción concreta que la persona puede realizar de inmediato. */
export type Accion =
  | {
      readonly tipo: 'llamada';
      readonly titulo: string;
      readonly numero: string;
      /** Valor del enlace `tel:`. */
      readonly marcar: string;
      readonly descripcion: string;
      readonly fuenteIds: readonly string[];
    }
  | {
      readonly tipo: 'guion';
      readonly titulo: string;
      readonly texto: string;
      /** Dónde se ocupa el mensaje. Un guion sin destino deja a la persona con el texto y sin ruta. */
      readonly destino?: {
        readonly texto: string;
        readonly etiqueta: string;
        readonly href: string;
      };
    }
  | {
      readonly tipo: 'dato';
      readonly titulo: string;
      readonly descripcion: string;
      readonly fuenteIds: readonly string[];
    }
  | {
      readonly tipo: 'enlace';
      readonly titulo: string;
      readonly descripcion: string;
      readonly href: string;
      readonly etiquetaEnlace: string;
      readonly fuenteIds: readonly string[];
    };

/** Alternativa de menor compromiso. El texto siempre existe; el enlace es opcional. */
export interface MenorCompromiso {
  readonly texto: string;
  readonly enlace?: { readonly etiqueta: string; readonly destino: string };
}

export interface Opcion {
  readonly etiqueta: string;
  readonly detalle?: string;
  /** Id de otro nodo, o una ruta absoluta del sitio. */
  readonly destino: string;
}

export interface Paso {
  readonly tipo: 'paso';
  readonly id: string;
  readonly segmento: string;
  readonly padre?: string;
  /** Etiqueta breve para breadcrumbs y `<title>`. */
  readonly etiqueta: string;
  readonly pregunta: string;
  readonly ayuda?: string;
  readonly opciones: readonly Opcion[];
}

export interface Resultado {
  readonly tipo: 'resultado';
  readonly id: string;
  readonly segmento: string;
  readonly padre: string;
  /** Etiqueta breve para breadcrumbs y `<title>`. */
  readonly etiqueta: string;
  readonly titulo: string;
  readonly cuerpo: readonly string[];
  readonly acciones: readonly Accion[];
  readonly menorCompromiso: MenorCompromiso;
  /** Acceso destacado a urgencia, cuando la persona misma puede necesitarlo ahora. */
  readonly avisoUrgencia?: string;
}

export type Nodo = Paso | Resultado;

// ---------------------------------------------------------------------------
// Acciones reutilizables
// ---------------------------------------------------------------------------

const SALUD_RESPONDE: Accion = {
  tipo: 'llamada',
  titulo: 'Salud Responde · 600 360 7777',
  numero: '600 360 7777',
  marcar: '+566003607777',
  descripcion:
    'Línea del Ministerio de Salud disponible las 24 horas, todos los días del año. Orienta sobre lugares y horarios de atención y resuelve consultas de salud. La llamada tiene el costo de una llamada local.',
  fuenteIds: ['chileatiende-salud-responde'],
};

const INSCRIPCION_APS: Accion = {
  tipo: 'dato',
  titulo: 'La entrada a la red pública es el consultorio donde estás inscrito',
  descripcion:
    'Para atenderte en la red pública tienes que inscribirte en el centro de Atención Primaria de Salud (APS) más cercano a tu domicilio o a tu lugar de trabajo. Puedes hacerlo en el mismo consultorio o al afiliarte a Fonasa.',
  fuenteIds: ['chileatiende-atencion-fonasa'],
};

const COBERTURA_PSICOLOGIA: Accion = {
  tipo: 'dato',
  titulo: 'En atención primaria, la consulta con psicólogo no tiene copago',
  descripcion:
    'La consulta o control con psicólogo clínico en el nivel primario tiene 100% de cobertura para todos los tramos de Fonasa. No es un beneficio que debas solicitar aparte: depende de estar inscrito en tu consultorio.',
  fuenteIds: ['chileatiende-atencion-fonasa'],
};

const GARANTIAS_GES: Accion = {
  tipo: 'dato',
  titulo: 'El plan AUGE-GES incluye problemas de salud mental',
  descripcion:
    'AUGE-GES cubre 90 problemas de salud, entre ellos de salud mental, con garantías de acceso, calidad, oportunidad y protección financiera. Se activa cuando un médico confirma el diagnóstico en el establecimiento donde estás inscrito.',
  fuenteIds: ['chileatiende-auge-ges'],
};

// ---------------------------------------------------------------------------
// Pasos
// ---------------------------------------------------------------------------

const pasos: readonly Paso[] = [
  {
    tipo: 'paso',
    id: 'inicio',
    segmento: '',
    etiqueta: 'Empezar',
    pregunta: '¿Qué es lo que más te pesa en este momento?',
    ayuda:
      'No necesitas tener certeza ni saber cómo se llama lo que te pasa. Elige lo que más se acerque; puedes cambiar de camino cuando quieras.',
    opciones: [
      {
        etiqueta: 'No sé si lo que siento necesita ayuda',
        detalle: 'Algo no anda bien, pero no tengo claro si amerita consultar.',
        destino: 'no-se-si-necesito-ayuda',
      },
      {
        etiqueta: 'Quiero pedir ayuda, pero me cuesta dar el paso',
        detalle: 'Sé que quiero hacerlo y algo me frena.',
        destino: 'me-cuesta-dar-el-paso',
      },
      {
        etiqueta: 'No sé dónde buscar ayuda en Chile',
        detalle: 'Necesito entender por dónde se entra al sistema.',
        destino: 'no-se-donde-buscar',
      },
      {
        etiqueta: 'Me preocupa cuánto puede costar',
        detalle: 'No sé si puedo pagar una atención.',
        destino: 'me-preocupa-el-costo',
      },
      {
        etiqueta: 'Me preocupa alguien cercano',
        detalle: 'No sé cómo acompañar a esa persona.',
        destino: 'me-preocupa-alguien',
      },
      {
        etiqueta: 'Necesito ayuda ahora',
        detalle: 'Hay peligro en este momento, para mí o para otra persona.',
        destino: RUTA_URGENCIA,
      },
    ],
  },
  {
    tipo: 'paso',
    id: 'no-se-si-necesito-ayuda',
    segmento: 'no-se-si-necesito-ayuda',
    padre: 'inicio',
    etiqueta: 'No sé si necesito ayuda',
    pregunta: '¿Hace cuánto te sientes así?',
    ayuda: 'Un cálculo aproximado basta. No es una evaluación y no lleva a un diagnóstico.',
    opciones: [
      { etiqueta: 'Hace unos días', destino: 'hace-unos-dias' },
      { etiqueta: 'Varias semanas o más', destino: 'varias-semanas-o-mas' },
      { etiqueta: 'No sabría decir', destino: 'no-sabria-decir' },
    ],
  },
  {
    tipo: 'paso',
    id: 'me-cuesta-dar-el-paso',
    segmento: 'me-cuesta-dar-el-paso',
    padre: 'inicio',
    etiqueta: 'Me cuesta dar el paso',
    pregunta: '¿Qué es lo que más te frena?',
    opciones: [
      { etiqueta: 'No sé qué decir ni cómo empezar', destino: 'no-se-que-decir' },
      { etiqueta: 'Me da vergüenza tener que explicar por qué', destino: 'me-da-verguenza' },
      { etiqueta: 'No quiero preocupar a nadie', destino: 'no-quiero-preocupar-a-nadie' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Resultados
// ---------------------------------------------------------------------------

const resultados: readonly Resultado[] = [
  {
    tipo: 'resultado',
    id: 'hace-unos-dias',
    segmento: 'hace-unos-dias',
    padre: 'no-se-si-necesito-ayuda',
    etiqueta: 'Hace unos días',
    titulo: 'No hace falta esperar a que empeore para informarte',
    cuerpo: [
      'Lo que describes puede aparecer por razones muy distintas: una semana difícil, un cambio reciente, dormir mal o algo que todavía no tiene nombre. No existe una regla que diga a partir de qué día corresponde consultar.',
      'Sí puede ser útil prestarle atención si con las semanas se mantiene, se intensifica o empieza a afectar tu sueño, tu trabajo, tus relaciones o tus ganas de hacer cosas.',
    ],
    acciones: [
      {
        tipo: 'enlace',
        titulo: 'Explorar vivencias cotidianas y señales de alerta',
        descripcion:
          'Encuentra información sin diagnósticos sobre lo que estás sintiendo y cuándo conviene prestarle atención.',
        href: '/siento',
        etiquetaEnlace: 'Explorar vivencias cotidianas',
        fuenteIds: [],
      },
      {
        tipo: 'guion',
        titulo: 'Contárselo a alguien de confianza',
        texto:
          'Quería contarte algo que me ha costado decir. Últimamente no me he sentido bien y creo que me haría bien hablarlo con alguien.',
      },
      SALUD_RESPONDE,
    ],
    menorCompromiso: {
      texto:
        'Quedarte sólo con esta información también es una opción válida. Puedes volver cuando quieras.',
    },
  },
  {
    tipo: 'resultado',
    id: 'varias-semanas-o-mas',
    segmento: 'varias-semanas-o-mas',
    padre: 'no-se-si-necesito-ayuda',
    etiqueta: 'Varias semanas o más',
    titulo: 'Después de varias semanas, consultar deja de ser prematuro',
    cuerpo: [
      'Que algo lleve semanas no permite saber qué es ni si corresponde un diagnóstico. Eso sólo puede evaluarlo un profesional, y no es necesario que llegues sabiéndolo.',
      'Lo que sí cambia con el tiempo es que una primera consulta pasa a ser una opción razonable. No compromete a un tratamiento: es una conversación para entender qué está pasando.',
    ],
    acciones: [
      INSCRIPCION_APS,
      COBERTURA_PSICOLOGIA,
      {
        tipo: 'enlace',
        titulo: 'Qué ocurre en una primera consulta psicológica',
        descripcion:
          'Saber cómo funciona la sesión, cuánto dura y qué se conversa ayuda a dar el paso con tranquilidad.',
        href: '/primera-vez/que-pasa-en-sesion',
        etiquetaEnlace: 'Ver cómo es la primera sesión',
        fuenteIds: [],
      },
      {
        tipo: 'guion',
        titulo: 'Pedir una hora en tu consultorio',
        texto:
          'Hola. Estoy inscrito aquí y quisiera saber cómo puedo solicitar una hora de salud mental. Es la primera vez que consulto.',
        destino: {
          texto: '¿Dónde ocuparlo?',
          etiqueta: 'Ver centros y líneas en Chile',
          href: '/donde',
        },
      },
      SALUD_RESPONDE,
    ],
    menorCompromiso: {
      texto: 'Si pedir una hora todavía se siente demasiado, hay pasos más pequeños antes de ese.',
      enlace: {
        etiqueta: 'Ver qué hacer cuando cuesta dar el paso',
        destino: `${RUTA_BASE}/me-cuesta-dar-el-paso`,
      },
    },
  },
  {
    tipo: 'resultado',
    id: 'no-sabria-decir',
    segmento: 'no-sabria-decir',
    padre: 'no-se-si-necesito-ayuda',
    etiqueta: 'No sabría decir',
    titulo: 'No necesitas poder explicarlo para preguntar qué opciones tienes',
    cuerpo: [
      'Mucha gente llega sin poder ponerle nombre a lo que siente, y eso no hace que la consulta sea menos válida. No se requiere un diagnóstico previo ni una crisis para pedir orientación.',
      '"No sé bien qué me pasa, pero algo me está afectando" es una razón suficiente para partir.',
    ],
    acciones: [
      INSCRIPCION_APS,
      {
        tipo: 'enlace',
        titulo: 'Poner en palabras lo que sientes',
        descripcion:
          'Revisa nuestras páginas de experiencias cotidianas (insomnio, cansancio, desgano, sobrecarga) escritas en lenguaje simple.',
        href: '/siento',
        etiquetaEnlace: 'Ver el catálogo de vivencias',
        fuenteIds: [],
      },
      {
        tipo: 'guion',
        titulo: 'Pedir una hora sin saber todavía qué decir',
        texto:
          'Hola. Quisiera pedir una hora de salud mental. No sé bien cómo explicar lo que me pasa, pero me gustaría conversarlo con alguien.',
        destino: {
          texto: '¿Dónde ocuparlo?',
          etiqueta: 'Ver centros y líneas en Chile',
          href: '/donde',
        },
      },
      SALUD_RESPONDE,
    ],
    menorCompromiso: {
      texto: 'También puedes partir por lo que te frena, en vez de por lo que sientes.',
      enlace: {
        etiqueta: 'Ver qué hacer cuando cuesta dar el paso',
        destino: `${RUTA_BASE}/me-cuesta-dar-el-paso`,
      },
    },
  },
  {
    tipo: 'resultado',
    id: 'no-se-que-decir',
    segmento: 'no-se-que-decir',
    padre: 'me-cuesta-dar-el-paso',
    etiqueta: 'No sé qué decir',
    titulo: 'No necesitas tener las palabras exactas',
    cuerpo: [
      'Quien te atiende está ahí para conducir la conversación, no para tomarte una prueba. Puedes decir exactamente que no sabes cómo explicarlo.',
      'Estos mensajes son un punto de partida. Cámbialos por lo que te resulte natural: no hay una forma correcta de pedir una hora.',
    ],
    acciones: [
      {
        tipo: 'enlace',
        titulo: 'Biblioteca completa de guiones copiables',
        descripcion:
          'Mensajes listos para copiar y adaptar para consultar en el CESFAM, preguntar por aranceles o hablar con alguien cercano.',
        href: '/primera-vez/que-decir',
        etiquetaEnlace: 'Ver todos los guiones',
        fuenteIds: [],
      },
      {
        tipo: 'guion',
        titulo: 'Pedir una primera hora',
        texto:
          'Hola. Quisiera saber cómo puedo solicitar una hora con psicología. Es la primera vez que busco atención.',
        destino: {
          texto: '¿Dónde ocuparlo?',
          etiqueta: 'Ver centros y líneas en Chile',
          href: '/donde',
        },
      },
      {
        tipo: 'guion',
        titulo: 'Si te preguntan el motivo',
        texto:
          'Últimamente no me he sentido bien y prefiero explicar el motivo con más detalle durante la consulta.',
      },
      {
        tipo: 'guion',
        titulo: 'Si llamas a tu consultorio',
        texto:
          'Hola. Estoy inscrito aquí y quisiera saber cómo puedo solicitar una evaluación de salud mental.',
      },
    ],
    menorCompromiso: {
      texto:
        'Copiar un mensaje y no enviarlo todavía también sirve. Tenerlo escrito quita una parte del esfuerzo para después.',
    },
  },
  {
    tipo: 'resultado',
    id: 'me-da-verguenza',
    segmento: 'me-da-verguenza',
    padre: 'me-cuesta-dar-el-paso',
    etiqueta: 'Me da vergüenza',
    titulo: 'Se puede pedir una hora con la vergüenza puesta',
    cuerpo: [
      'Sentir vergüenza al consultar por salud mental es frecuente. No hace falta que se te pase primero, ni convencerte de que no corresponde sentirla, para dar el paso.',
      'Lo concreto es que no tienes que justificar tu motivo para conseguir una hora ni contarlo todo en el primer contacto: basta con decir que quieres una consulta de salud mental. Lo demás puede quedar para la sesión, cuando y si quieres.',
    ],
    acciones: [
      {
        tipo: 'enlace',
        titulo: 'Qué considerar al elegir con quién consultar',
        descripcion:
          'Las diferencias entre psicología y psiquiatría, y qué puedes preguntar antes de decidir.',
        href: '/primera-vez/como-elegir',
        etiquetaEnlace: 'Ver cómo elegir profesional',
        fuenteIds: [],
      },
      {
        tipo: 'guion',
        titulo: 'Pedir una hora sin dar detalles',
        texto:
          'Hola. Quisiera solicitar una hora de salud mental. Prefiero conversar el motivo directamente en la consulta.',
        destino: {
          texto: '¿Dónde ocuparlo?',
          etiqueta: 'Ver centros y líneas en Chile',
          href: '/donde',
        },
      },
      {
        tipo: 'guion',
        titulo: 'Si insisten en preguntar el motivo',
        texto:
          'Prefiero no entrar en detalles por teléfono. Es un tema personal y quisiera hablarlo en la consulta.',
      },
    ],
    menorCompromiso: {
      texto: 'Si lo que más pesa es no saber cómo empezar la frase, hay más ejemplos aquí.',
      enlace: {
        etiqueta: 'Ver qué puedes decir',
        destino: `${RUTA_BASE}/me-cuesta-dar-el-paso/no-se-que-decir`,
      },
    },
  },
  {
    tipo: 'resultado',
    id: 'no-quiero-preocupar-a-nadie',
    segmento: 'no-quiero-preocupar-a-nadie',
    padre: 'me-cuesta-dar-el-paso',
    etiqueta: 'No quiero preocupar a nadie',
    titulo: 'No querer ser una carga es una de las razones más comunes para no consultar',
    cuerpo: [
      'A veces no es miedo ni vergüenza: es no querer instalar una preocupación en gente que ya tiene lo suyo, o pensar que lo que te pasa no da para molestar a nadie. Es algo que se siente seguido y no tiene nada de raro.',
      'Vale la pena separar dos cosas que suelen ir juntas. Contarle a alguien cercano es una decisión tuya: puedes postergarla, hacerla a medias o no tomarla nunca. Pedir una hora es otra cosa distinta: es usar un servicio que existe para esto, y no tienes que demostrar que tu caso es lo bastante grave para ocuparlo.',
    ],
    acciones: [
      {
        tipo: 'guion',
        titulo: 'Pedir una hora sin involucrar a nadie',
        texto:
          'Hola. Quisiera solicitar una hora de salud mental para mí. Es la primera vez que consulto.',
        destino: {
          texto: '¿Dónde ocuparlo?',
          etiqueta: 'Ver centros y líneas en Chile',
          href: '/donde',
        },
      },
      {
        tipo: 'guion',
        titulo: 'Contarle a alguien sin dejarle una preocupación encima',
        texto:
          'Quiero contarte algo y me gustaría pedirte que no te preocupes ni hagas nada. Prefiero que lo sepas: estoy viendo cómo pedir una hora para conversar con un psicólogo.',
      },
      INSCRIPCION_APS,
      {
        tipo: 'enlace',
        titulo: 'Qué esperar de una primera consulta',
        descripcion:
          'Cómo funciona la sesión, qué se conversa y qué sigue decidiendo cada persona.',
        href: '/primera-vez',
        etiquetaEnlace: 'Ver la guía de primera vez',
        fuenteIds: [],
      },
    ],
    menorCompromiso: {
      texto:
        'Si prefieres no involucrar todavía a nadie, ni siquiera para preguntar cómo funciona, Salud Responde orienta por teléfono sin que tengas que decidir nada en la llamada.',
    },
  },
  {
    tipo: 'resultado',
    id: 'no-se-donde-buscar',
    segmento: 'no-se-donde-buscar',
    padre: 'inicio',
    etiqueta: 'No sé dónde buscar',
    titulo: 'La puerta de entrada al sistema público es tu consultorio',
    cuerpo: [
      'En Chile, la red pública se organiza a partir de la Atención Primaria de Salud. Ahí se atiende salud mental, además de medicina general, y desde ahí se deriva cuando hace falta otro nivel de atención.',
      'Si no sabes cuál consultorio te corresponde o si estás inscrito, esa es exactamente la pregunta que puedes hacer por teléfono.',
    ],
    acciones: [
      INSCRIPCION_APS,
      {
        tipo: 'enlace',
        titulo: 'Directorio piloto de centros en Chile',
        descripcion:
          'Consulta los CESFAM de tu comuna según el registro oficial DEIS, clínicas universitarias a bajo costo y líneas telefónicas.',
        href: '/donde',
        etiquetaEnlace: 'Explorar centros y líneas',
        fuenteIds: ['deis-registro-establecimientos'],
      },
      {
        tipo: 'guion',
        titulo: 'Preguntar si estás inscrito y cómo pedir hora',
        texto:
          'Hola. Quisiera saber si estoy inscrito en este consultorio y cómo puedo solicitar una hora de salud mental.',
      },
      SALUD_RESPONDE,
    ],
    menorCompromiso: {
      texto: 'Si lo que más te preocupa es el costo antes que el lugar, empieza por ahí.',
      enlace: {
        etiqueta: 'Ver qué cubre la atención pública',
        destino: `${RUTA_BASE}/me-preocupa-el-costo`,
      },
    },
  },
  {
    tipo: 'resultado',
    id: 'me-preocupa-el-costo',
    segmento: 'me-preocupa-el-costo',
    padre: 'inicio',
    etiqueta: 'Me preocupa el costo',
    titulo: 'Existe una ruta que no depende de tu capacidad de pago',
    cuerpo: [
      'El costo es una barrera real y conviene resolverla con datos concretos antes de descartar la idea de consultar.',
      'La ruta pública no es una versión reducida de la privada: es la vía principal de acceso en Chile y no depende de tu capacidad de pago.',
    ],
    acciones: [
      COBERTURA_PSICOLOGIA,
      INSCRIPCION_APS,
      GARANTIAS_GES,
      {
        tipo: 'enlace',
        titulo: 'Qué cuesta cada vía de atención en Chile',
        descripcion:
          'Un desglose de la vía pública, las clínicas universitarias con arancel diferenciado y la atención privada.',
        href: '/primera-vez/cuanto-cuesta',
        etiquetaEnlace: 'Leer la guía de costos',
        fuenteIds: [],
      },
      SALUD_RESPONDE,
    ],
    menorCompromiso: {
      texto: 'Si todavía no sabes a qué consultorio acudir, ese es el paso anterior.',
      enlace: {
        etiqueta: 'Ver cómo se entra al sistema público',
        destino: `${RUTA_BASE}/no-se-donde-buscar`,
      },
    },
  },
  {
    tipo: 'resultado',
    id: 'me-preocupa-alguien',
    segmento: 'me-preocupa-alguien',
    padre: 'inicio',
    etiqueta: 'Me preocupa alguien',
    titulo: 'Acompañar no es diagnosticar ni convencer',
    cuerpo: [
      'Puedes preguntarle cómo está y escuchar sin apurar una solución. No necesitas identificar qué le ocurre ni lograr que pida ayuda hoy: presionar suele alejar.',
      'Si te lo permite, ofrecerle compañía para el primer contacto —buscar el consultorio, acompañarle a llamar— suele ser más útil que insistir en que vaya.',
    ],
    avisoUrgencia:
      'Si crees que esa persona puede estar en peligro en este momento, no esperes a terminar de leer.',
    acciones: [
      {
        tipo: 'guion',
        titulo: 'Abrir la conversación sin presionar',
        texto:
          'He notado que últimamente no te ves bien y me importa cómo estés. No tienes que contarme nada si no quieres, pero quiero que sepas que estoy aquí.',
      },
      {
        tipo: 'guion',
        titulo: 'Ofrecer compañía concreta',
        texto:
          '¿Te sirve que averigüemos juntos dónde pedir una hora? Puedo acompañarte a llamar o ir contigo si quieres.',
        destino: {
          texto: '¿Dónde buscar juntos?',
          etiqueta: 'Ver centros y líneas en Chile',
          href: '/donde',
        },
      },
      {
        tipo: 'llamada',
        titulo: 'Fono Drogas y Alcohol 1412 · SENDA',
        numero: '1412',
        marcar: '1412',
        descripcion:
          'Servicio gratuito y confidencial de SENDA para orientar a familiares y personas cercanas preocupadas por consumo de sustancias.',
        fuenteIds: ['senda-fono-1412'],
      },
      {
        tipo: 'llamada',
        titulo: 'Línea *4141',
        numero: '*4141',
        marcar: '*4141',
        descripcion:
          'Atención gratuita y confidencial con profesionales de psicología, disponible las 24 horas todos los días, desde celulares de cualquier compañía. También atiende a quien llama por otra persona.',
        fuenteIds: ['minsal-linea-4141'],
      },
      INSCRIPCION_APS,
      SALUD_RESPONDE,
    ],
    menorCompromiso: {
      texto:
        'Si esa persona todavía no quiere hablarlo, seguir disponible sin insistir también es acompañar. No es una oportunidad perdida.',
    },
  },
];

// ---------------------------------------------------------------------------
// Índice y navegación
// ---------------------------------------------------------------------------

const nodos: readonly Nodo[] = [...pasos, ...resultados];
const nodoPorId = new Map(nodos.map((n) => [n.id, n]));

export function getNodo(id: string): Nodo | undefined {
  return nodoPorId.get(id);
}

export function esRutaAbsoluta(destino: string): boolean {
  return destino.startsWith('/');
}

/** Cadena de nodos desde `inicio` hasta el nodo indicado, ambos incluidos. */
export function linaje(id: string): Nodo[] {
  const cadena: Nodo[] = [];
  let actual = nodoPorId.get(id);

  while (actual) {
    cadena.unshift(actual);
    actual = actual.padre ? nodoPorId.get(actual.padre) : undefined;
  }

  return cadena;
}

/** Ruta pública del nodo, por ejemplo `/empezar/me-cuesta-dar-el-paso/no-se-que-decir`. */
export function rutaDe(id: string): string {
  const segmentos = linaje(id)
    .map((n) => n.segmento)
    .filter(Boolean);

  return segmentos.length > 0 ? `${RUTA_BASE}/${segmentos.join('/')}` : RUTA_BASE;
}

/** Resuelve el destino de una opción o enlace a una URL navegable. */
export function hrefDeDestino(destino: string): string {
  return esRutaAbsoluta(destino) ? destino : rutaDe(destino);
}

/** Migas de pan del nodo. El último elemento no lleva enlace. */
export function migasDe(id: string): { label: string; href?: string }[] {
  const cadena = linaje(id);

  return [
    { label: 'Inicio', href: '/' },
    ...cadena.map((nodo, indice) => ({
      label: nodo.etiqueta,
      href: indice < cadena.length - 1 ? rutaDe(nodo.id) : undefined,
    })),
  ];
}

/** Descripción para `<meta name="description">`, derivada del propio contenido. */
export function descripcionDe(nodo: Nodo): string {
  if (nodo.tipo === 'paso') {
    return (
      nodo.ayuda ??
      `${nodo.pregunta} Elige la opción que más se acerque y verás un siguiente paso posible.`
    );
  }

  return nodo.cuerpo[0];
}

/** Nodos que necesitan una ruta propia, sin incluir `/empezar`. */
export function nodosConRutaPropia(): Nodo[] {
  return nodos.filter((n) => n.id !== 'inicio');
}

export function todosLosNodos(): readonly Nodo[] {
  return nodos;
}

export function todosLosPasos(): readonly Paso[] {
  return pasos;
}

export function todosLosResultados(): readonly Resultado[] {
  return resultados;
}

/** Rutas internas a las que apunta el orientador, para verificarlas contra el build. */
export function destinosInternos(): string[] {
  const destinos = new Set<string>();

  for (const paso of pasos) {
    for (const opcion of paso.opciones) {
      destinos.add(hrefDeDestino(opcion.destino));
    }
  }

  for (const resultado of resultados) {
    const enlace = resultado.menorCompromiso.enlace;
    if (enlace) destinos.add(hrefDeDestino(enlace.destino));
    if (resultado.avisoUrgencia) destinos.add(RUTA_URGENCIA);
    for (const accion of resultado.acciones) {
      if (accion.tipo === 'enlace') destinos.add(accion.href);
      if (accion.tipo === 'guion' && accion.destino) destinos.add(accion.destino.href);
    }
  }

  return [...destinos];
}
