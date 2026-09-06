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
//  - cada guía entrega algo utilizable ahora y sólo enlaza a rutas que existen.
//
// Cadencia de una guía, en este orden y no en otro (D38): primero se nombra lo que la
// persona dijo, después se explica, después se muestra cómo funciona el sistema con su
// fuente, después lo que puede hacer hoy, y al final se le devuelve la decisión de hacia
// dónde seguir. Saltar al trámite convierte lo que dijo en un obstáculo administrativo.
//
// No se usan cuantificadores de frecuencia sin fuente ("es frecuente", "la mayoría",
// "mucha gente"). Cuando queremos decir que algo es entendible, lo decimos como juicio
// editorial y no como estadística. Hay un test que lo bloquea.

export const RUTA_BASE = '/empezar';
export const RUTA_URGENCIA = '/urgencia';

/** Acción que la persona puede realizar sin salir de la página. */
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
    };

/**
 * Hecho verificado sobre el sistema de salud. Vive separado de las acciones porque no es
 * algo que la persona "haga": es lo que necesita saber para decidir. Mezclarlo con las
 * acciones fue lo que hacía que los recorridos partieran por el trámite.
 */
export interface Dato {
  readonly titulo: string;
  readonly descripcion: string;
  readonly fuenteIds: readonly string[];
}

/** Sección de lectura con subtítulo propio. */
export interface Seccion {
  readonly titulo: string;
  readonly parrafos: readonly string[];
  /** Obligatorio si la sección afirma algo sobre el sistema de salud o cita una frecuencia. */
  readonly fuenteIds?: readonly string[];
}

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

/** Pregunta de cierre de una guía: la persona elige hacia dónde seguir. */
export interface Salidas {
  readonly pregunta: string;
  readonly opciones: readonly Opcion[];
}

export interface Paso {
  readonly tipo: 'paso';
  readonly id: string;
  readonly segmento: string;
  readonly padre?: string;
  /** Etiqueta breve para breadcrumbs y `<title>`. */
  readonly etiqueta: string;
  /**
   * Encabezado del paso intermedio. Cuando existe, es el `h1` y la pregunta baja a `h2`:
   * la página primero nombra lo que la persona eligió y sólo después vuelve a preguntar.
   * `inicio` no lo declara, porque ahí la pregunta sí es el encabezado de la página.
   */
  readonly titulo?: string;
  /**
   * Párrafos que reconocen la barrera antes de volver a preguntar. Un paso intermedio sin
   * esto es un formulario: pregunta de nuevo sin haber acusado recibo de lo ya dicho.
   */
  readonly entrada?: readonly string[];
  readonly pregunta: string;
  readonly ayuda?: string;
  readonly opciones: readonly Opcion[];
}

export interface Guia {
  readonly tipo: 'guia';
  readonly id: string;
  readonly segmento: string;
  readonly padre: string;
  /** Etiqueta breve para breadcrumbs y `<title>`. */
  readonly etiqueta: string;
  readonly titulo: string;
  /** Nombra la situación de la persona. Va antes de cualquier explicación o acción. */
  readonly reconocimiento: readonly string[];
  readonly secciones: readonly Seccion[];
  readonly datos?: readonly Dato[];
  readonly acciones: readonly Accion[];
  readonly salidas?: Salidas;
  readonly menorCompromiso: MenorCompromiso;
  /** Acceso destacado a urgencia, cuando la persona misma puede necesitarlo ahora. */
  readonly avisoUrgencia?: string;
}

export type Nodo = Paso | Guia;

// ---------------------------------------------------------------------------
// Acciones y datos reutilizables
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

const INSCRIPCION_APS: Dato = {
  titulo: 'La entrada a la red pública es el consultorio donde tienes tu inscripción',
  descripcion:
    'Para atenderte en la red pública tienes que inscribirte en el centro de Atención Primaria de Salud (APS) más cercano a tu domicilio o a tu lugar de trabajo. Puedes hacerlo en el mismo consultorio o al afiliarte a Fonasa.',
  fuenteIds: ['chileatiende-atencion-fonasa'],
};

const COBERTURA_PSICOLOGIA: Dato = {
  titulo: 'En atención primaria, la consulta con psicólogo no tiene copago',
  descripcion:
    'La consulta o control con psicólogo clínico en el nivel primario tiene 100% de cobertura para todos los tramos de Fonasa. No es un beneficio que debas solicitar aparte: depende de tener tu inscripción en el consultorio.',
  fuenteIds: ['chileatiende-atencion-fonasa'],
};

const GARANTIAS_GES: Dato = {
  titulo: 'El plan AUGE-GES incluye problemas de salud mental',
  descripcion:
    'AUGE-GES cubre 90 problemas de salud, entre ellos de salud mental, con garantías de acceso, calidad, oportunidad y protección financiera. Se activa cuando un médico confirma el diagnóstico en el establecimiento donde tienes tu inscripción.',
  fuenteIds: ['chileatiende-auge-ges'],
};

// Salidas que se repiten entre guías. Se declaran una vez para que la etiqueta con que
// nombramos cada sección del sitio no cambie de un recorrido a otro.
const SALIDA_SIENTO: Opcion = {
  etiqueta: 'Poner en palabras lo que estoy sintiendo',
  detalle: 'Descripciones cotidianas: no poder dormir, no dar más, angustia, desgano.',
  destino: '/siento',
};

const SALIDA_PRIMERA_SESION: Opcion = {
  etiqueta: 'Saber cómo es una primera consulta',
  detalle: 'Cuánto dura, qué preguntan y qué sigue decidiendo cada persona.',
  destino: '/primera-vez/que-pasa-en-sesion',
};

const SALIDA_DONDE: Opcion = {
  etiqueta: 'Ver dónde se pide una hora',
  detalle: 'Establecimientos vigentes por comuna, clínicas universitarias y líneas nacionales.',
  destino: '/donde',
};

const SALIDA_GUIONES: Opcion = {
  etiqueta: 'Ver todos los guiones',
  detalle: 'Mensajes armados para pedir hora, preguntar por aranceles o contarle a alguien.',
  destino: '/primera-vez/que-decir',
};

const SALIDA_AUTOEVALUACION: Opcion = {
  etiqueta: 'Responder un cuestionario breve',
  detalle: 'OMS-5 y GAD-7. No dan un diagnóstico y se responden en tu propio dispositivo.',
  destino: '/autoevaluacion',
};

const SALIDA_COSTOS: Opcion = {
  etiqueta: 'Ver cuánto cuesta cada vía',
  detalle: 'Red pública, AUGE-GES, clínicas universitarias, libre elección e isapres.',
  destino: '/primera-vez/cuanto-cuesta',
};

// ---------------------------------------------------------------------------
// Pasos
//
// Las siete puertas de entrada corresponden a las barreras de §4 del documento base.
// Antes faltaban tres: "quiero resolverlo por mi cuenta" (§4.2), "nunca he ido y no sé
// cómo funciona" (§4.6) y "todavía no estoy preparado" (§4.7). Quien entraba con una de
// esas terminaba en una rama que lo empujaba al consultorio, porque era la única salida
// que esa rama tenía.
// ---------------------------------------------------------------------------

const pasos: readonly Paso[] = [
  {
    tipo: 'paso',
    id: 'inicio',
    segmento: '',
    etiqueta: 'Empezar',
    pregunta: '¿Qué es lo que más te pesa ahora?',
    ayuda:
      'No tienes que saber cómo se llama lo que te pasa ni tener certeza de nada. Elige lo que más se parezca a tu situación; si no era, vuelves atrás y listo.',
    opciones: [
      {
        etiqueta: 'No sé si lo que siento necesita ayuda',
        detalle: 'Algo no anda bien y no tengo claro si esto da para consultar.',
        destino: 'no-se-si-necesito-ayuda',
      },
      {
        etiqueta: 'Nunca he consultado y no sé cómo es',
        detalle: 'Tengo la disposición, pero no tengo idea de cómo funciona esto.',
        destino: 'nunca-he-consultado',
      },
      {
        etiqueta: 'Quiero pedir ayuda, pero me cuesta dar el paso',
        detalle: 'Sé que quiero hacerlo y algo me frena.',
        destino: 'me-cuesta-dar-el-paso',
      },
      {
        etiqueta: 'Prefiero manejarlo por mi cuenta, al menos por ahora',
        detalle: 'No quiero llevarlo a un profesional todavía.',
        destino: 'prefiero-por-mi-cuenta',
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
    titulo: 'No saber si lo que sientes necesita ayuda',
    entrada: [
      'Esa duda es difícil de resolver por cuenta propia, porque no existe una línea clara que diga cuándo algo se convierte en un tema de salud mental. Por eso es fácil quedarse esperando a estar peor para tomárselo en serio.',
      'Acá no vamos a decirte qué tienes. Lo que sí podemos hacer es ayudarte a mirar lo que te está pasando con un poco más de orden, y que decidas tú qué hacer con eso.',
    ],
    pregunta: '¿Hace cuánto te sientes así?',
    ayuda:
      'Un cálculo al ojo basta. No es un test, no se guarda y no lleva a ningún diagnóstico: sólo cambia lo que tiene sentido hacer ahora.',
    opciones: [
      { etiqueta: 'Hace unos días', detalle: 'Es algo reciente.', destino: 'hace-unos-dias' },
      {
        etiqueta: 'Varias semanas o más',
        detalle: 'Lleva un buen rato así.',
        destino: 'varias-semanas-o-mas',
      },
      {
        etiqueta: 'No sabría decir',
        detalle: 'Me cuesta ubicar cuándo empezó.',
        destino: 'no-sabria-decir',
      },
    ],
  },
  {
    tipo: 'paso',
    id: 'me-cuesta-dar-el-paso',
    segmento: 'me-cuesta-dar-el-paso',
    padre: 'inicio',
    etiqueta: 'Me cuesta dar el paso',
    titulo: 'Cuando quieres pedir ayuda y algo te frena',
    entrada: [
      'Querer y no poder no es una contradicción, y no es falta de ganas. Entre decidir que quieres ayuda y efectivamente pedirla hay un tramo corto en distancia y largo en todo lo demás.',
      'Lo que te frena importa, porque cada freno se suelta distinto.',
    ],
    pregunta: '¿Qué es lo que más te frena?',
    ayuda: 'Si son varias cosas a la vez, elige la que se te aparece primero cuando lo piensas.',
    opciones: [
      {
        etiqueta: 'No sé qué decir ni cómo empezar',
        detalle: 'Me trabo cuando pienso en el momento de hablar.',
        destino: 'no-se-que-decir',
      },
      {
        etiqueta: 'Me da vergüenza tener que explicar por qué',
        detalle: 'Me incomoda que alguien me pregunte el motivo.',
        destino: 'me-da-verguenza',
      },
      {
        etiqueta: 'No quiero preocupar a nadie',
        detalle: 'Siento que sería cargarle algo a otra persona.',
        destino: 'no-quiero-preocupar-a-nadie',
      },
    ],
  },
  {
    tipo: 'paso',
    id: 'prefiero-por-mi-cuenta',
    segmento: 'prefiero-por-mi-cuenta',
    padre: 'inicio',
    etiqueta: 'Prefiero por mi cuenta',
    titulo: 'Cuando prefieres manejarlo por tu cuenta',
    entrada: [
      'Querer resolverlo tú no es un problema que haya que corregir. Es una forma legítima de enfrentar las cosas y, de hecho, es la que te trajo hasta acá.',
      'Acá no vamos a tratar de convencerte. Consultar no te quita la capacidad de manejar tus asuntos, y no consultar todavía tampoco te deja sin opciones.',
    ],
    pregunta: '¿Qué se parece más a lo que estás pensando?',
    opciones: [
      {
        etiqueta: 'Quiero entender esto por mi cuenta antes de contárselo a alguien',
        detalle: 'Lo que necesito ahora es claridad, no una consulta.',
        destino: 'entenderlo-primero',
      },
      {
        etiqueta: 'Sé que en algún momento voy a pedir ayuda, pero no ahora',
        detalle: 'No es que no quiera. Es que «no todavía».',
        destino: 'todavia-no',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Guías
// ---------------------------------------------------------------------------

const guias: readonly Guia[] = [
  {
    tipo: 'guia',
    id: 'hace-unos-dias',
    segmento: 'hace-unos-dias',
    padre: 'no-se-si-necesito-ayuda',
    etiqueta: 'Hace unos días',
    titulo: 'Cuando lleva pocos días',
    reconocimiento: [
      'Llevar unos días sintiéndote mal ya es razón suficiente para querer entender qué está pasando. No hace falta esperar a que empeore para informarte.',
      'Lo que describes puede venir de partes muy distintas: una semana pesada, un cambio reciente, dormir mal, algo que todavía no tiene nombre. No existe una regla que diga a partir de qué día corresponde consultar.',
    ],
    secciones: [
      {
        titulo: 'En qué conviene fijarse estos días',
        parrafos: [
          'Más que el día exacto en que empezó, lo que suele importar es cómo se mueve: si se mantiene igual, si va subiendo de intensidad, o si empieza a meterse en cosas concretas. El sueño. El trabajo o el estudio. La paciencia con la gente que quieres. Las ganas de hacer lo que antes te gustaba.',
          'Si en un par de semanas sigue ahí, esa información te va a servir mucho más que cualquier conclusión que puedas sacar hoy.',
        ],
      },
      {
        titulo: 'Mientras tanto hay algo que hacer, y no es esperar',
        parrafos: [
          'Ponerle palabras. Leer sobre lo que estás sintiendo no es autodiagnosticarse: es dejar de andar con una sensación difusa y empezar a tener algo que puedas contar.',
          'Decírselo a alguien, aunque sea una frase. No para que resuelva nada, sino para no ser la única persona que lo sabe.',
        ],
      },
    ],
    acciones: [
      {
        tipo: 'guion',
        titulo: 'Contárselo a alguien de confianza',
        texto:
          'Quería contarte algo que me ha costado decir. Últimamente no me he sentido bien y creo que me haría bien hablarlo con alguien.',
      },
      SALUD_RESPONDE,
    ],
    salidas: {
      pregunta: '¿Qué te ayudaría más ahora?',
      opciones: [
        SALIDA_SIENTO,
        SALIDA_AUTOEVALUACION,
        {
          etiqueta: 'Saber cómo funciona una consulta, por si la necesito más adelante',
          detalle:
            'Cómo es la sesión, qué decir y cuánto cuesta. Leerlo ahora no implica pedir hora.',
          destino: '/primera-vez',
        },
      ],
    },
    menorCompromiso: {
      texto:
        'Quedarte sólo con lo que leíste hoy también es una opción. Esta página va a seguir acá si la necesitas.',
    },
  },
  {
    tipo: 'guia',
    id: 'varias-semanas-o-mas',
    segmento: 'varias-semanas-o-mas',
    padre: 'no-se-si-necesito-ayuda',
    etiqueta: 'Varias semanas o más',
    titulo: 'Cuando ya lleva varias semanas',
    reconocimiento: [
      'Varias semanas es harto tiempo para andar cargando algo así, sobre todo si por fuera has seguido funcionando como si nada.',
      'Que lleve semanas no dice qué es. Eso no lo puedes saber tú y tampoco lo sabemos nosotros, y no necesitas averiguarlo antes de pedir ayuda: es justamente una de las cosas que se van viendo en una consulta.',
    ],
    secciones: [
      {
        titulo: 'Qué cambia cuando pasa el tiempo',
        parrafos: [
          'Lo que cambia no es el diagnóstico: es la conversación. Cuando algo lleva días, tiene todo el sentido esperar y mirar. Cuando lleva semanas, esperar deja de darte información nueva, porque ya sabes que el tiempo por sí mismo no lo está resolviendo.',
          'Una primera consulta no te compromete a un tratamiento ni te deja con una etiqueta encima. Es una conversación para entender qué está pasando, y de ahí sale lo que sigue, incluida la posibilidad de que no haga falta nada más.',
        ],
      },
      {
        titulo: 'No tienes que llegar con una explicación armada',
        parrafos: [
          'Si te estás preguntando qué vas a decir cuando pidas la hora, la respuesta corta es: lo que tengas. «Llevo varias semanas sintiéndome mal y quiero conversarlo con alguien» es un motivo completo.',
          'No hace falta llegar con la historia ordenada. Esa parte es trabajo de la consulta, no un requisito para llegar a una.',
        ],
      },
    ],
    datos: [COBERTURA_PSICOLOGIA, INSCRIPCION_APS],
    acciones: [
      {
        tipo: 'guion',
        titulo: 'Pedir una hora en tu consultorio',
        texto:
          'Hola. Me atiendo en este consultorio y quisiera saber cómo puedo solicitar una hora de salud mental. Es la primera vez que consulto.',
        destino: {
          texto: '¿Dónde ocuparlo?',
          etiqueta: 'Ver centros y líneas en Chile',
          href: '/donde',
        },
      },
      SALUD_RESPONDE,
    ],
    salidas: {
      pregunta: '¿Qué te ayudaría más ahora?',
      opciones: [
        SALIDA_PRIMERA_SESION,
        SALIDA_DONDE,
        SALIDA_SIENTO,
        {
          etiqueta: 'Preparar qué decir al pedir la hora',
          detalle: 'Si lo que cuesta es la frase y no la decisión.',
          destino: 'no-se-que-decir',
        },
      ],
    },
    menorCompromiso: {
      texto: 'Si pedir una hora todavía se siente demasiado, hay pasos más chicos antes de ese.',
      enlace: {
        etiqueta: 'Ver qué hacer cuando cuesta dar el paso',
        destino: `${RUTA_BASE}/me-cuesta-dar-el-paso`,
      },
    },
  },
  {
    tipo: 'guia',
    id: 'no-sabria-decir',
    segmento: 'no-sabria-decir',
    padre: 'no-se-si-necesito-ayuda',
    etiqueta: 'No sabría decir',
    titulo: 'Cuando no sabes desde cuándo, ni bien qué es',
    reconocimiento: [
      'Que no puedas ubicar cuándo empezó no significa que no sea nada. Hay cosas que no llegan de golpe: se instalan tan de a poco que uno se acostumbra, y recién cuando alguien pregunta te das cuenta de que hace rato que no andas bien.',
      'No hace falta que puedas explicarlo para preguntar qué opciones tienes. «No sé bien qué me pasa, pero algo me está afectando» es un punto de partida completo.',
    ],
    secciones: [
      {
        titulo: 'Ponerle nombre es parte del trabajo, no el requisito para empezar',
        parrafos: [
          'Ordenar lo que sientes es parte de lo que se hace en una consulta, no algo que tengas que traer resuelto de la casa.',
          'Si igual quieres llegar con algo más concreto, ayuda partir por lo cotidiano: cómo has dormido, si te ha costado concentrarte, si dejaste de hacer cosas que antes hacías, si andas con la mecha corta. Eso es información útil y no necesita ningún vocabulario técnico.',
        ],
      },
      {
        titulo: 'Dos formas de aterrizarlo',
        parrafos: [
          'Leer descripciones en lenguaje simple suele ser más fácil que producir la explicación desde cero: uno reconoce antes de saber nombrar.',
          'También hay cuestionarios breves que ordenan un poco el panorama. No dan un diagnóstico y no reemplazan a nadie, pero te dejan con algo escrito que puedes mirar y, si quieres, llevar.',
        ],
      },
    ],
    datos: [INSCRIPCION_APS],
    acciones: [
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
    salidas: {
      pregunta: '¿Qué te ayudaría más ahora?',
      opciones: [SALIDA_SIENTO, SALIDA_AUTOEVALUACION, SALIDA_PRIMERA_SESION],
    },
    menorCompromiso: {
      texto: 'También puedes partir por lo que te frena, en vez de por lo que sientes.',
      enlace: {
        etiqueta: 'Ver qué hacer cuando cuesta dar el paso',
        destino: `${RUTA_BASE}/me-cuesta-dar-el-paso`,
      },
    },
  },
  {
    tipo: 'guia',
    id: 'nunca-he-consultado',
    segmento: 'nunca-he-consultado',
    padre: 'inicio',
    etiqueta: 'Nunca he consultado',
    titulo: 'Cuando nunca has consultado y no sabes cómo es',
    reconocimiento: [
      'Tener la disposición y no saber cómo funciona esto es un lugar incómodo: te deja sin nada que hacer con esa disposición.',
      'Lo bueno es que esto sí se resuelve leyendo. No es un tema de fuerza de voluntad ni del momento en que estés: es información que nadie te dio antes.',
    ],
    secciones: [
      {
        titulo: 'Lo primero: no es un examen',
        parrafos: [
          'Una primera consulta no empieza con un cuestionario ni con un diagnóstico. Empieza con una pregunta abierta, del tipo «¿qué te trajo por acá?», y contigo contando lo que puedas contar.',
          'Tú decides qué cuentas y en qué momento. Si hay cosas que no quieres tocar todavía, se puede decir así, en esas palabras.',
        ],
      },
      {
        titulo: 'Las preguntas prácticas conviene resolverlas antes',
        parrafos: [
          'Cuánto dura, cuánto cuesta y con quién hay que hablar. Ninguna de las tres depende de tu caso particular, así que puedes resolverlas ahora y decidir después.',
          'Y una que casi no se menciona: si la persona que te atiende no te calza, puedes buscar otra. Cambiar de profesional es parte normal de esto y no significa que el proceso haya fallado.',
        ],
      },
    ],
    datos: [COBERTURA_PSICOLOGIA],
    acciones: [
      {
        tipo: 'guion',
        titulo: 'Pedir una primera hora diciendo que es primera vez',
        texto:
          'Hola. Quisiera saber cómo puedo solicitar una hora con psicología. Es la primera vez que busco atención y no sé bien cómo funciona el ingreso.',
        destino: {
          texto: '¿Dónde ocuparlo?',
          etiqueta: 'Ver centros y líneas en Chile',
          href: '/donde',
        },
      },
      SALUD_RESPONDE,
    ],
    salidas: {
      pregunta: '¿Qué quieres resolver primero?',
      opciones: [
        SALIDA_PRIMERA_SESION,
        SALIDA_COSTOS,
        {
          etiqueta: 'Con quién consultar: psicólogo, psiquiatra u otro',
          detalle: 'Las diferencias y qué puedes preguntar antes de decidir.',
          destino: '/primera-vez/como-elegir',
        },
        SALIDA_GUIONES,
      ],
    },
    menorCompromiso: {
      texto:
        'Leer cómo funciona y no pedir nada todavía es un uso perfectamente válido de esta página.',
    },
  },
  {
    tipo: 'guia',
    id: 'no-se-que-decir',
    segmento: 'no-se-que-decir',
    padre: 'me-cuesta-dar-el-paso',
    etiqueta: 'No sé qué decir',
    titulo: 'Qué decir cuando no sabes qué decir',
    reconocimiento: [
      'Lo más difícil no siempre es decidir pedir ayuda. A veces es imaginarse el momento exacto: el teléfono sonando, alguien preguntando «¿por qué motivo?» y uno sin saber qué contestar.',
      'Y no es una tontera: explicar lo que te pasa te obliga a ordenarlo, y muchas veces todavía no está ordenado ni para ti.',
      'La buena noticia es que no tienes que llegar con el discurso listo. Con decir que quieres una hora de salud mental ya estás. El resto lo conversas allá, si quieres.',
    ],
    secciones: [
      {
        titulo: 'Por qué cuesta tanto justo esta parte',
        parrafos: [
          'Pedir una hora tiene algo que otros trámites no tienen: te pide nombrar en voz alta, frente a alguien que no conoces, algo que quizá no le has dicho a nadie. La dificultad no está en el trámite. Está en tener que traducirte.',
          'Por eso ayuda tanto tenerlo escrito antes. No para leerlo tal cual, sino porque te saca de encima la parte de improvisar.',
        ],
      },
      {
        titulo: 'Dos cosas que no tienes que hacer',
        parrafos: [
          'No tienes que resumir tu vida. Un motivo de consulta no es una biografía: es una frase que abre la puerta.',
          'No tienes que tener certeza de nada. «No sé bien qué me pasa» también es un motivo, y no necesitas cambiarlo por otro que suene mejor.',
        ],
      },
    ],
    acciones: [
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
          'Hola. Me atiendo en este consultorio y quisiera saber cómo puedo solicitar una evaluación de salud mental.',
      },
    ],
    salidas: {
      pregunta: '¿Qué te ayudaría más ahora?',
      opciones: [SALIDA_GUIONES, SALIDA_DONDE, SALIDA_PRIMERA_SESION],
    },
    menorCompromiso: {
      texto:
        'Copiar un mensaje y no enviarlo todavía igual sirve. Tenerlo escrito te quita esa parte del trabajo para cuando decidas.',
    },
  },
  {
    tipo: 'guia',
    id: 'me-da-verguenza',
    segmento: 'me-da-verguenza',
    padre: 'me-cuesta-dar-el-paso',
    etiqueta: 'Me da vergüenza',
    titulo: 'Cuando da vergüenza tener que explicar por qué',
    reconocimiento: [
      'La vergüenza acá no es tonta: aparece justo cuando tienes que decirle a alguien, a veces a una persona desconocida detrás de un mesón, algo que sientes que te deja expuesto.',
      'No hace falta que se te pase primero, ni que te convenzas de que no corresponde sentirla. Se puede pedir una hora con la vergüenza puesta, aunque sea incómodo.',
    ],
    secciones: [
      {
        titulo: 'Qué se puede no contar',
        parrafos: [
          'En el primer contacto no tienes que dar el motivo con detalle. Puedes decir que quieres una consulta de salud mental y dejar el resto para la sesión, cuando y si quieres.',
          'Si insisten, se puede sostener sin pelear. «Prefiero conversarlo directamente en la consulta» es una respuesta completa y no hay que agregarle nada.',
        ],
      },
      {
        titulo: 'El mesón y la consulta son dos conversaciones distintas',
        parrafos: [
          'Conviene no mezclarlas. En la primera estás resolviendo una hora, y con eso basta. La segunda es un espacio que existe justamente para hablar de esto, con reglas propias sobre lo que se conversa ahí.',
          'Si te importa saber exactamente hasta dónde llega la confidencialidad, es una pregunta legítima para hacer en la primera sesión.',
        ],
      },
      {
        titulo: 'Si lo que te da vergüenza es el motivo mismo',
        parrafos: [
          'Hay motivos que se sienten más difíciles de decir que otros. Eso no cambia que exista un lugar donde se atienden.',
          'Y no tienes que decidir hoy cuánto vas a contar. Sólo si quieres la hora.',
        ],
      },
    ],
    acciones: [
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
      SALUD_RESPONDE,
    ],
    salidas: {
      pregunta: '¿Qué te ayudaría más ahora?',
      opciones: [
        {
          etiqueta: 'Qué pasa en la consulta y qué dice la ley sobre confidencialidad',
          detalle: 'El encuadre, el secreto profesional y qué decides tú.',
          destino: '/primera-vez/que-pasa-en-sesion',
        },
        {
          etiqueta: 'Con quién consultar: psicólogo, psiquiatra u otro',
          detalle: 'Las diferencias y qué puedes preguntar antes de decidir.',
          destino: '/primera-vez/como-elegir',
        },
        SALIDA_DONDE,
      ],
    },
    menorCompromiso: {
      texto: 'Si lo que más pesa es no saber cómo empezar la frase, hay más ejemplos armados.',
      enlace: {
        etiqueta: 'Ver qué puedes decir',
        destino: `${RUTA_BASE}/me-cuesta-dar-el-paso/no-se-que-decir`,
      },
    },
  },
  {
    tipo: 'guia',
    id: 'no-quiero-preocupar-a-nadie',
    segmento: 'no-quiero-preocupar-a-nadie',
    padre: 'me-cuesta-dar-el-paso',
    etiqueta: 'No quiero preocupar a nadie',
    titulo: 'Cuando no quieres cargarle esto a nadie',
    reconocimiento: [
      'A veces no es miedo ni vergüenza. Es no querer instalarle una preocupación a gente que ya anda con lo suyo, o pensar que lo tuyo no da para molestar a nadie.',
      'Y ahí hay dos cosas que suelen ir juntas y que conviene separar, porque no dependen una de la otra: contarle a alguien, y pedir una hora.',
    ],
    secciones: [
      {
        titulo: 'Contarle a alguien es una decisión tuya',
        parrafos: [
          'Puedes postergarla, hacerla a medias, contarle a una sola persona o no contarle a nadie. Nada de eso te cierra ninguna puerta ni te deja fuera de la atención.',
        ],
      },
      {
        titulo: 'Pedir una hora es otra cosa',
        parrafos: [
          'Es usar un servicio que existe para esto y que ya está financiado y funcionando. No tienes que demostrar que tu caso es lo bastante grave para ocuparlo.',
          'Y no necesitas ir con alguien ni avisar en tu casa para pedir una hora.',
        ],
      },
      {
        titulo: 'Si igual quieres contarle a alguien, sin dejarle un peso encima',
        parrafos: [
          'Se puede avisar sin pedir nada: decir qué estás haciendo y decir explícitamente que no necesitas que hagan nada al respecto.',
          'Es una forma de no llevarlo en silencio sin traspasarle la gestión a otra persona.',
        ],
      },
    ],
    datos: [INSCRIPCION_APS],
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
      SALUD_RESPONDE,
    ],
    salidas: {
      pregunta: '¿Qué te ayudaría más ahora?',
      opciones: [
        {
          etiqueta: 'Qué esperar de una primera consulta',
          detalle: 'Cómo funciona la sesión y qué sigue decidiendo cada persona.',
          destino: '/primera-vez',
        },
        SALIDA_DONDE,
      ],
    },
    menorCompromiso: {
      texto:
        'Si prefieres no involucrar todavía a nadie, ni siquiera para preguntar cómo funciona, Salud Responde orienta por teléfono y no tienes que decidir nada durante la llamada.',
    },
  },
  {
    tipo: 'guia',
    id: 'entenderlo-primero',
    segmento: 'entenderlo-primero',
    padre: 'prefiero-por-mi-cuenta',
    etiqueta: 'Entenderlo primero',
    titulo: 'Cuando quieres entenderlo tú primero',
    reconocimiento: [
      'Hay algo muy razonable en querer entender antes de contárselo a alguien. No es desconfianza ni orgullo: es querer llegar a cualquier conversación sabiendo de qué se está hablando.',
      'Lo que sigue es información, no una recomendación de que consultes.',
    ],
    secciones: [
      {
        titulo: 'Qué puedes averiguar por tu cuenta, y qué no',
        parrafos: [
          'Por tu cuenta puedes llegar bastante lejos: entender cómo se describe lo que estás sintiendo, qué formas de ayuda existen y cómo funciona el acceso en Chile. Todo eso está escrito y es público.',
          'Lo que no se puede hacer por tu cuenta es descartar causas físicas ni saber cuál de las explicaciones posibles es la tuya. No es un tema de esfuerzo ni de inteligencia: hace falta alguien mirándolo desde afuera y con formación para eso.',
        ],
      },
      {
        titulo: 'Informarse no es autodiagnosticarse',
        parrafos: [
          'Leer sobre insomnio no te convierte en alguien con insomnio, y reconocerse en una descripción no equivale a tener un diagnóstico. Un cuadro clínico se confirma con una evaluación, no con una lectura.',
          'Si al leer aparece la sensación de que todo te calza, eso también es información: significa que la conversación tiene sentido, no que tengas todo lo que leíste.',
        ],
      },
      {
        titulo: 'En qué momento conviene no seguir por tu cuenta',
        parrafos: [
          'No hay una señal única y nadie te va a avisar. Lo que sí puede servir de referencia: cuando llevas semanas igual, cuando la intensidad va subiendo, o cuando ya se está metiendo en tu sueño, tu trabajo o tus relaciones.',
          'Y si llegas ahí, seguir informándote sigue siendo válido. Sólo deja de ser suficiente.',
        ],
      },
    ],
    acciones: [
      {
        tipo: 'guion',
        titulo: 'Preguntar qué opciones hay, sin pedir hora todavía',
        texto:
          'Hola. Quisiera saber qué opciones de atención de salud mental hay en este centro y cómo funciona el ingreso. Por ahora sólo estoy averiguando.',
        destino: {
          texto: '¿Dónde ocuparlo?',
          etiqueta: 'Ver centros y líneas en Chile',
          href: '/donde',
        },
      },
      SALUD_RESPONDE,
    ],
    salidas: {
      pregunta: '¿Por dónde quieres empezar a leer?',
      opciones: [
        SALIDA_SIENTO,
        {
          etiqueta: 'Leer sobre cuadros clínicos',
          detalle: 'Qué se sabe de ansiedad, depresión, insomnio, duelo y otros.',
          destino: '/temas',
        },
        SALIDA_AUTOEVALUACION,
        {
          etiqueta: 'Entender cómo se entra al sistema en Chile',
          detalle: 'Para tenerlo claro antes de necesitarlo.',
          destino: 'no-se-donde-buscar',
        },
      ],
    },
    menorCompromiso: {
      texto: 'Puedes leer todo esto y no hacer nada más. Ese también es un resultado.',
    },
  },
  {
    tipo: 'guia',
    id: 'todavia-no',
    segmento: 'todavia-no',
    padre: 'prefiero-por-mi-cuenta',
    etiqueta: 'Todavía no',
    titulo: 'Cuando sabes que vas a pedir ayuda, pero no ahora',
    reconocimiento: [
      '«No todavía» no es lo mismo que «no», y no es el fracaso de nada. Hay momentos en que no hay energía, no hay tiempo o simplemente no da.',
      'Acá nadie te va a apurar. Lo único que vale la pena es que, cuando llegue el momento, no tengas que empezar de cero.',
    ],
    secciones: [
      {
        titulo: 'Lo que se puede dejar listo hoy',
        parrafos: [
          'Casi todo el esfuerzo de pedir una hora está en la parte previa: averiguar dónde, decidir qué decir, juntar el ánimo. Y esa parte se puede hacer por adelantado y por separado, en un día en que dé.',
          'Son tres cosas concretas: saber a qué centro puedes ir, tener el mensaje escrito y saber qué pasa en una primera consulta. Con eso hecho, el día que decidas queda sólo llamar.',
        ],
      },
      {
        titulo: 'Si el «no ahora» lleva mucho tiempo',
        parrafos: [
          'A veces «no todavía» es una decisión tranquila, y a veces es parte de lo mismo que te tiene mal. Si notas que llevas mucho tiempo postergándolo y que cada vez pesa más, eso también se puede llevar a una consulta como motivo, tal cual.',
        ],
      },
      {
        titulo: 'Y si el momento no llega',
        parrafos: ['Tampoco pasa nada. Esta página no le lleva la cuenta a nadie.'],
      },
    ],
    acciones: [
      {
        tipo: 'guion',
        titulo: 'Dejar el mensaje escrito para cuando quieras usarlo',
        texto:
          'Hola. Quisiera saber cómo puedo solicitar una hora de salud mental. Es la primera vez que consulto.',
        destino: {
          texto: 'Cuando lo quieras ocupar:',
          etiqueta: 'Ver centros y líneas en Chile',
          href: '/donde',
        },
      },
      SALUD_RESPONDE,
    ],
    salidas: {
      pregunta: '¿Quieres dejar algo listo antes de cerrar?',
      opciones: [
        {
          etiqueta: 'Averiguar ahora a qué centro puedo ir',
          detalle: 'Para no tener que buscarlo el día que decidas.',
          destino: '/donde',
        },
        SALIDA_GUIONES,
        SALIDA_PRIMERA_SESION,
      ],
    },
    menorCompromiso: {
      texto:
        'Cerrar esto ahora está perfecto. Si quieres, guarda la dirección de esta página en tus favoritos y sigue con tu día.',
    },
  },
  {
    tipo: 'guia',
    id: 'no-se-donde-buscar',
    segmento: 'no-se-donde-buscar',
    padre: 'inicio',
    etiqueta: 'No sé dónde buscar',
    titulo: 'Dónde se pide ayuda de salud mental en Chile',
    reconocimiento: [
      'No saber por dónde se entra no es ignorancia tuya. El sistema chileno no es evidente y no hay ningún lugar donde te lo expliquen completo.',
      'La respuesta corta es que la puerta principal es el consultorio de atención primaria donde tienes tu inscripción. Lo que sigue es cómo se llega ahí y qué otras vías existen.',
    ],
    secciones: [
      {
        titulo: 'La red pública parte en atención primaria',
        parrafos: [
          'En Chile la red pública se organiza a partir de la Atención Primaria de Salud: los CESFAM, los CECOSF y los COSAM. Ahí se atiende salud mental además de medicina general, y desde ahí se deriva cuando hace falta otro nivel de atención.',
        ],
        fuenteIds: ['chileatiende-atencion-fonasa'],
      },
      {
        titulo: 'Si no sabes cuál te corresponde',
        parrafos: [
          'Nosotros no podemos decirte cuál te toca: eso depende de tu dirección y lo resuelve tu comuna. Lo que sí podemos mostrarte son los establecimientos vigentes de tu comuna según el registro oficial del Ministerio de Salud, con su nombre y su dirección.',
          'Y cuál te corresponde es exactamente la pregunta que se puede hacer por teléfono, sin comprometerse a nada.',
        ],
        fuenteIds: ['deis-registro-establecimientos'],
      },
      {
        titulo: 'Qué otras vías existen',
        parrafos: [
          'Además de la red pública hay clínicas psicológicas universitarias, líneas telefónicas nacionales y atención privada.',
          'En este sitio no están ordenadas por precio ni por convenio, y no recibimos nada por derivar a ninguna.',
        ],
      },
    ],
    datos: [INSCRIPCION_APS, COBERTURA_PSICOLOGIA],
    acciones: [
      {
        tipo: 'guion',
        titulo: 'Preguntar por tu inscripción y cómo pedir hora',
        texto:
          'Hola. Quisiera saber si tengo inscripción en este consultorio y cómo puedo solicitar una hora de salud mental.',
      },
      SALUD_RESPONDE,
    ],
    salidas: {
      pregunta: '¿Qué te ayudaría más ahora?',
      opciones: [
        {
          etiqueta: 'Ver los establecimientos vigentes de mi comuna',
          detalle: 'Registro oficial del Ministerio de Salud: nombre y dirección.',
          destino: '/donde',
        },
        {
          etiqueta: 'Ver clínicas psicológicas universitarias',
          detalle: 'Atención a menor costo que la consulta privada.',
          destino: '/donde/clinicas-universitarias',
        },
        SALIDA_COSTOS,
      ],
    },
    menorCompromiso: {
      texto: 'Si lo que más te preocupa es el costo antes que el lugar, empieza por ahí.',
      enlace: {
        etiqueta: 'Ver qué cubre la atención pública',
        destino: `${RUTA_BASE}/me-preocupa-el-costo`,
      },
    },
  },
  {
    tipo: 'guia',
    id: 'me-preocupa-el-costo',
    segmento: 'me-preocupa-el-costo',
    padre: 'inicio',
    etiqueta: 'Me preocupa el costo',
    titulo: 'Cuánto cuesta y qué no se paga',
    reconocimiento: [
      'Preguntarse si se puede pagar antes de preguntarse si se necesita es lo que pasa cuando el presupuesto anda justo. Lo caro de esa pregunta es descartar la idea sin haber averiguado.',
      'La parte concreta: existe una vía que no depende de tu capacidad de pago, y no es una versión reducida de la otra.',
    ],
    secciones: [
      {
        titulo: 'La vía pública no es el plan B',
        parrafos: [
          'En Chile la red pública es la vía principal de acceso, no un descuento para quien no alcanza. Que la consulta con psicólogo en atención primaria no tenga copago no la hace menos: la hace financiada.',
        ],
        fuenteIds: ['chileatiende-atencion-fonasa'],
      },
      {
        titulo: 'Dos preguntas que se resuelven por teléfono',
        parrafos: [
          'Si no sabes si tienes inscripción o en qué tramo de Fonasa estás, esas dos cosas se preguntan por teléfono y no te comprometen a nada.',
          'Son también las dos que más se cruzan en el camino después, así que resolverlas primero ahorra vueltas.',
        ],
      },
      {
        titulo: 'Si vas a ir por la vía privada o universitaria',
        parrafos: [
          'Cada centro universitario fija su propio valor, sus requisitos y sus períodos de admisión, y no todos los publican. Por eso acá no hay montos: lo que corresponde es preguntarlo directamente.',
          'Preguntar por arancel diferenciado o facilidades de pago es normal y no hay que justificarlo.',
        ],
      },
    ],
    datos: [COBERTURA_PSICOLOGIA, INSCRIPCION_APS, GARANTIAS_GES],
    acciones: [
      {
        tipo: 'guion',
        titulo: 'Preguntar por arancel diferenciado',
        texto:
          'Hola. Me interesa consultar con ustedes, pero cuento con un presupuesto ajustado. Quisiera saber si tienen aranceles diferenciados según situación socioeconómica o convenio con Fonasa.',
        destino: {
          texto: '¿Dónde ocuparlo?',
          etiqueta: 'Ver clínicas universitarias',
          href: '/donde/clinicas-universitarias',
        },
      },
      SALUD_RESPONDE,
    ],
    salidas: {
      pregunta: '¿Qué te ayudaría más ahora?',
      opciones: [
        SALIDA_COSTOS,
        SALIDA_DONDE,
        {
          etiqueta: 'Entender cómo se entra al sistema público',
          detalle: 'Por dónde parte y qué preguntar primero.',
          destino: 'no-se-donde-buscar',
        },
      ],
    },
    menorCompromiso: {
      texto:
        'Si todavía no sabes a qué consultorio acudir, ese es el paso anterior y no cuesta nada averiguarlo.',
      enlace: {
        etiqueta: 'Ver cómo se entra al sistema público',
        destino: `${RUTA_BASE}/no-se-donde-buscar`,
      },
    },
  },
  {
    tipo: 'guia',
    id: 'me-preocupa-alguien',
    segmento: 'me-preocupa-alguien',
    padre: 'inicio',
    etiqueta: 'Me preocupa alguien',
    titulo: 'Cuando el que está mal es alguien que quieres',
    reconocimiento: [
      'Ver a alguien que quieres andar mal y no saber qué hacer tiene su propio peso, y casi nunca se nombra.',
      'Lo primero que conviene sacarse de encima: no te toca averiguar qué le pasa ni lograr que pida ayuda hoy.',
    ],
    avisoUrgencia:
      'Si crees que esa persona puede estar en peligro en este momento, no esperes a terminar de leer.',
    secciones: [
      {
        titulo: 'Preguntar y escuchar ya es hacer algo',
        parrafos: [
          'Se puede preguntar cómo está sin exigir respuesta, y escuchar sin apurar una solución. Parece poco y no lo es: es lo que deja la puerta abierta.',
          'No necesitas saber qué decir. «No sé cómo ayudarte, pero quiero estar» alcanza.',
        ],
      },
      {
        titulo: 'La decisión sigue siendo de esa persona',
        parrafos: [
          'Incluso cuando desde afuera se ve clarísimo. Insistir, poner plazos o dramatizar la situación te deja en el lugar de quien empuja, y eso cambia la conversación completa.',
          'Si dice que no, no es una oportunidad perdida. Es un no de hoy.',
        ],
      },
      {
        titulo: 'Lo que suele aterrizar mejor es la compañía concreta',
        parrafos: [
          'Ofrecer algo específico —buscar juntos el consultorio, acompañarla a llamar, ir con ella el día de la hora— es más fácil de aceptar que un consejo.',
          'Y si no lo toma ahora, la oferta queda hecha para después.',
        ],
      },
    ],
    datos: [INSCRIPCION_APS],
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
        titulo: 'Línea *4141',
        numero: '*4141',
        marcar: '*4141',
        descripcion:
          'Atención gratuita y confidencial con profesionales de psicología, disponible las 24 horas todos los días, desde celulares de cualquier compañía. También atiende a quien llama por otra persona.',
        fuenteIds: ['minsal-linea-4141'],
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
      SALUD_RESPONDE,
    ],
    salidas: {
      pregunta: '¿Qué te ayudaría más ahora?',
      opciones: [
        {
          etiqueta: 'Cómo preguntar y escuchar',
          detalle: 'Qué abre la conversación y qué la cierra.',
          destino: '/acompanar/preguntar-y-escuchar',
        },
        {
          etiqueta: 'Ofrecer ayuda sin presionar',
          detalle: 'Cuando quieres ayudar y no sabes hasta dónde llegar.',
          destino: '/acompanar/ofrecer-ayuda-sin-presionar',
        },
        {
          etiqueta: 'Acompañar el primer contacto',
          detalle: 'Ayudar con la llamada, la hora y el día de la consulta.',
          destino: '/acompanar/acompanar-primer-contacto',
        },
      ],
    },
    menorCompromiso: {
      texto:
        'Si esa persona todavía no quiere hablarlo, seguir estando sin insistir también es acompañar.',
    },
  },
];

// ---------------------------------------------------------------------------
// Índice y navegación
// ---------------------------------------------------------------------------

const nodos: readonly Nodo[] = [...pasos, ...guias];
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
      nodo.entrada?.[0] ??
      nodo.ayuda ??
      `${nodo.pregunta} Elige la opción que más se acerque y verás un siguiente paso posible.`
    );
  }

  return nodo.reconocimiento[0];
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

export function todasLasGuias(): readonly Guia[] {
  return guias;
}

/** Opciones que salen de un nodo: las de un paso, o las salidas de una guía. */
export function opcionesDe(nodo: Nodo): readonly Opcion[] {
  return nodo.tipo === 'paso' ? nodo.opciones : (nodo.salidas?.opciones ?? []);
}

/** Rutas internas a las que apunta el orientador, para verificarlas contra el build. */
export function destinosInternos(): string[] {
  const destinos = new Set<string>();

  for (const nodo of nodos) {
    for (const opcion of opcionesDe(nodo)) {
      destinos.add(hrefDeDestino(opcion.destino));
    }
  }

  for (const guia of guias) {
    const enlace = guia.menorCompromiso.enlace;
    if (enlace) destinos.add(hrefDeDestino(enlace.destino));
    if (guia.avisoUrgencia) destinos.add(RUTA_URGENCIA);
    for (const accion of guia.acciones) {
      if (accion.tipo === 'guion' && accion.destino) destinos.add(accion.destino.href);
    }
  }

  return [...destinos];
}
