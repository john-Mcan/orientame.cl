# orientame.cl — Documento base de producto y construcción

## 0. Contexto para quien construye

orientame.cl es una plataforma digital sin fines de lucro orientada inicialmente a Chile.

Su propósito es reducir las barreras que aparecen antes de recibir ayuda en salud mental: no saber si lo que ocurre amerita atención, no saber dónde acudir, sentir vergüenza o incomodidad al pedir ayuda, desconocer cómo funciona una primera consulta, no poder costear atención o simplemente no estar preparado todavía para dar un paso mayor.

orientame.cl **no presta atención psicológica**, no reemplaza a profesionales y no necesita que el usuario llegue sabiendo qué tiene.

Tampoco asumimos que toda persona que entra al sitio necesita terapia.

El objetivo es más simple:

> **Ayudar a una persona a entender mejor sus opciones y facilitar que pueda realizar un siguiente paso apropiado, si decide hacerlo.**

Ese siguiente paso puede ser:

* entender mejor lo que está experimentando;
* realizar una autoevaluación orientativa;
* averiguar qué alternativas existen;
* conocer qué ocurre en una primera sesión;
* identificar un centro donde consultar;
* descubrir una alternativa gratuita o de bajo costo;
* preparar qué decir al contactar un servicio;
* hablar con alguien de confianza;
* llamar a una línea de orientación;
* solicitar una hora;
* o simplemente quedar mejor informado para decidir después.

El éxito de orientame.cl no se mide por cuánto permanece una persona dentro del sitio.

Idealmente, orientame.cl deja de ser necesaria cuando el usuario encuentra una ruta que le sirve.

### orientame.cl no es

* una aplicación clínica;
* un marketplace de psicólogos;
* un sistema de fichas clínicas;
* un SaaS para profesionales;
* un chatbot;
* un terapeuta de IA;
* un servicio de crisis;
* un sistema de diagnóstico.

Es principalmente un **sitio de orientación y acceso**, construido alrededor de contenido confiable, recorridos simples y pequeñas herramientas client-side.

---

# 1. Hipótesis de producto

Muchas personas no comienzan buscando:

> “quiero un psicólogo”.

Buscan cosas como:

> “no puedo dormir aunque esté cansado”

> “por qué no tengo ganas de hacer nada”

> “es normal sentir ansiedad todos los días”

> “no puedo dejar de pensar”

> “me siento mal pero no sé por qué”

> “psicólogo gratis Chile”

> “cómo saber si necesito terapia”

O directamente llegan sabiendo que algo ocurre, pero sin saber qué hacer.

Por eso orientame.cl contempla **dos formas complementarias de entrada**.

## 1.1 Entrada por lo que la persona siente

Especialmente relevante para buscadores.

```text
Google
   ↓
"no puedo dormir aunque esté cansado"
   ↓
/siento/no-puedo-dormir-aunque-este-cansado
   ↓
información y orientación
   ↓
posibles siguientes pasos
```

Estas páginas hablan en el lenguaje cotidiano del usuario y no presuponen conocimiento clínico.

## 1.2 Entrada por la barrera que enfrenta

Especialmente relevante para quien entra directamente a orientame.cl.

```text
"No sé si necesito ayuda"
"Me cuesta pedirla"
"No sé dónde acudir"
"No puedo pagar atención"
"Me preocupa alguien"
"Necesito ayuda ahora"
```

Esta entrada puede vivir en la portada y en `/empezar`.

Ambos caminos convergen.

**La entrada SEO por síntomas es una capa de descubrimiento de orientame.cl, no la definición completa del producto.**

---

# 2. Principios innegociables

Estos principios gobiernan cualquier decisión de contenido, diseño o código.

## 2.1 No reemplazamos atención profesional

Ninguna parte de orientame.cl puede posicionarse o comportarse como sustituto de una evaluación o tratamiento profesional.

Cuando corresponde atención profesional, orientame.cl ayuda a encontrar la ruta.

## 2.2 No diagnosticamos

orientame.cl puede:

* explicar conceptos;
* describir síntomas;
* ofrecer instrumentos validados de orientación;
* mostrar factores que pueden justificar consultar;
* explicar qué profesionales existen.

orientame.cl no puede concluir:

> “tienes depresión”

> “esto es ansiedad generalizada”

> “necesitas terapia”

Se utiliza lenguaje como:

> “esto puede estar relacionado con…”

> “estas experiencias pueden aparecer en diferentes situaciones…”

> “si esto está afectando tu vida, podría ser razonable conversarlo con un profesional”.

## 2.3 El usuario conserva la decisión

orientame.cl informa y facilita.

No presiona, culpa ni dramatiza.

El usuario puede decidir:

* avanzar;
* explorar;
* hacer un test;
* buscar un recurso;
* detenerse;
* volver después.

## 2.4 Siempre existe un paso de menor compromiso

Si la acción principal todavía parece demasiado difícil, orientame.cl intenta ofrecer una más pequeña.

Ejemplo:

```text
Solicitar una hora
        ↓
Preguntar cómo funciona la atención
        ↓
Hablar anónimamente con un servicio de orientación
        ↓
Contárselo a alguien cercano
        ↓
Leer cómo funciona una primera sesión
```

No existe obligación de completar toda la cadena.

## 2.5 Privacidad por arquitectura

No hay cuentas en la v1.

No hay base de datos de usuarios.

No se almacenan respuestas de orientación en servidores de orientame.cl.

Las herramientas interactivas deben procesar sus respuestas localmente en el navegador siempre que sea posible.

No se debe afirmar que “ningún dato sale del dispositivo”, porque la navegación web sigue implicando solicitudes técnicas hacia la infraestructura.

La promesa correcta es:

> **Las respuestas que entregas dentro de nuestras herramientas de orientación se procesan en tu dispositivo y orientame.cl no las almacena en sus servidores.**

## 2.6 La crisis no se delega a IA

La capa de urgencia utiliza reglas y contenido previamente definidos y revisados.

No hay chatbot de crisis.

No hay decisiones generativas.

No se pretende determinar automáticamente si alguien está o no en una crisis basándose sólo en palabras escritas en un buscador.

## 2.7 Los recursos deben ser verificables

Cada recurso muestra, cuando corresponda:

* fuente;
* fecha de verificación;
* forma de acceso;
* requisitos conocidos;
* estado de actualización.

Si la información supera su período previsto de revisión, puede seguir publicada con una advertencia visible de que podría requerir confirmación.

La desactualización genera una alerta de mantenimiento, pero **no detiene los despliegues del sitio**.

## 2.8 Accesibilidad desde el diseño

Objetivo mínimo:

**WCAG 2.2 AA.**

La accesibilidad no se añade al final como mejora visual.

## 2.9 Nada de incentivos ocultos

orientame.cl no ordena recursos porque paguen.

No cobra comisión por derivaciones.

No necesita retener al usuario dentro de su plataforma.

---

# 3. Definición de éxito

No podemos saber de forma confiable si una persona terminó asistiendo a terapia y no debemos introducir seguimiento invasivo sólo para obtener esa métrica.

Por tanto, orientame.cl trabaja con resultados intermedios.

### Nivel 1 — Comprensión

La persona comprende mejor:

* qué podría estar ocurriendo;
* cuándo conviene prestarle atención;
* qué alternativas existen.

### Nivel 2 — Orientación

La persona identifica una ruta que parece adecuada.

### Nivel 3 — Preparación

La persona sabe:

* dónde contactar;
* qué puede decir;
* cuánto podría costar;
* qué esperar.

### Nivel 4 — Acción

La persona realiza una acción externa:

* llama;
* escribe;
* consulta;
* visita;
* agenda;
* habla con alguien.

### Nivel 5 — Atención

La persona efectivamente accede a un servicio.

orientame.cl puede aproximar partes de los primeros niveles mediante proxies agregados.

Ningún click o vista de página demuestra por sí solo comprensión, orientación o preparación. Los proxies sirven para detectar recorridos que probablemente no están funcionando y activar decisiones de producto.

No debe sacrificar privacidad para intentar demostrar los últimos.

---

# 4. Las principales barreras que orientame.cl intenta reducir

## 4.1 “No sé si esto amerita pedir ayuda”

orientame.cl ayuda a distinguir entre:

* una experiencia puntual;
* algo persistente;
* algo que empieza a afectar la vida cotidiana;
* una situación que merece evaluación profesional.

No intenta colocar una etiqueta diagnóstica.

## 4.2 “Quiero resolverlo por mi cuenta”

No se combate la autonomía.

Se reconoce.

El contenido puede ofrecer recursos prácticos de bajo riesgo cuando sea apropiado y explicar que consultar a alguien no elimina la capacidad de actuar por cuenta propia.

## 4.3 “No sé qué decir”

orientame.cl ofrece ejemplos simples y copiables.

No es necesario construir inicialmente un generador complejo de mensajes.

Una biblioteca breve de escenarios cubre buena parte de los casos:

* pedir una primera hora;
* preguntar por valores;
* contactar un CESFAM;
* decir que es primera vez;
* responder cuando preguntan el motivo;
* hablar con alguien cercano;
* acompañar a otra persona.

Si posteriormente se demuestra que las combinaciones estáticas son insuficientes, se puede estudiar una herramienta interactiva.

## 4.4 “No sé dónde ir”

orientame.cl explica el sistema y muestra rutas concretas.

## 4.5 “No puedo pagarlo”

Las alternativas gratuitas y públicas no quedan escondidas detrás de las privadas.

Son rutas principales.

## 4.6 “Nunca he ido y no sé cómo funciona”

orientame.cl explica:

* qué ocurre en una primera sesión;
* cuánto puede durar;
* qué suelen preguntar;
* si hay que contar todo;
* qué ocurre si uno no sabe qué decir;
* si se puede llorar;
* si es válido cambiar de terapeuta;
* qué diferencias generales existen entre profesionales.

## 4.7 “Todavía no estoy preparado”

orientame.cl no considera esto un fracaso.

Ofrece una acción más pequeña.

---

# 5. Home y `/empezar`

La portada debe soportar tanto búsqueda por contenido como orientación directa.

Ejemplo conceptual:

```text
orientame.cl

No tienes que saber qué te pasa para empezar.

Si algo no se siente bien, podemos ayudarte a entender
qué opciones tienes y cuál podría ser tu siguiente paso.

[ Buscar algo que estoy sintiendo... ]

¿Qué necesitas hoy?

[ No sé si necesito ayuda ]
[ Creo que necesito ayuda, pero me cuesta pedirla ]
[ Quiero saber dónde acudir ]
[ No puedo pagar atención ]
[ Me preocupa alguien ]

                      [ Necesito ayuda ahora ]
```

Este boceto quedó con cinco puertas. La implementación tiene **siete más el acceso a urgencia**, una
por cada barrera de §4: faltaban §4.2, §4.6 y §4.7, y quien entraba con una de ellas terminaba en una
rama cuya única salida era pedir hora. Ver
[`fase-4-revision-guias.md`](./fase-4-revision-guias.md), D39.

En la portada esas puertas se muestran sin su detalle, para que las ocho quepan en la primera
pantalla de un móvil; el detalle se muestra en `/empezar`. Ver D45.

No se deben esconder:

* `/siento/`;
* tests;
* temas;
* recursos.

La portada funciona como puerta de entrada a todos ellos.

---

# 6. Orientador de primer paso

Un recorrido guiado ayuda a quien no sabe por dónde comenzar.

Se implementa como rutas estáticas y funciona sin JavaScript:

```text
/empezar
/empezar/[...ruta]
```

Cada opción es un enlace, cada paso y cada resultado tiene su propia URL, y el botón “atrás” del navegador retrocede un paso.

El árbol de decisión vive en `src/lib/orientador.ts`. Las rutas se derivan de él durante el build.

No realiza scoring clínico.

No intenta determinar un diagnóstico.

Trabaja principalmente sobre barreras.

Ejemplo:

```text
¿Qué te trajo hoy?

├── No sé si lo que siento amerita pedir ayuda
├── Sé que algo ocurre, pero me cuesta hablarlo
├── Quiero encontrar atención
├── Me preocupa cuánto podría costar
├── Nunca he ido y no sé qué esperar
└── Me preocupa otra persona
```

Las respuestas siguientes deben ser pocas.

Idealmente:

**1 a 4 decisiones antes de ofrecer algo útil.**

El nodo terminal de un recorrido es una **guía**, no un «resultado»: el orientador no evalúa nada, así
que no hay nada de qué esa página sea el resultado. Una guía reconoce lo que la persona dijo, lo
explica, muestra cómo funciona el sistema con su fuente, ofrece lo que se puede hacer hoy y devuelve
la decisión de hacia dónde seguir. El orden está fijado en
[`fase-4-revision-guias.md`](./fase-4-revision-guias.md), D38, y el componente lo impone.

Las salidas de una guía pueden ser:

* una página `/siento/` o `/temas/`;
* una guía de `/primera-vez/`;
* una autoevaluación opcional;
* un recurso;
* `/donde/`;
* `/acompanar/`;
* otro nodo del orientador;
* un guion;
* una línea de orientación.

Los guiones y las líneas telefónicas se ofrecen en la propia página, porque son cosas que se hacen
ahí mismo; el resto son salidas.

No guarda estado en servidor ni en el navegador.

La decisión de construirlo como rutas estáticas en lugar de un island está registrada en [`fase-2-decisiones.md`](./fase-2-decisiones.md), D1. No es una regla general contra los islands: ver §23.

---

# 7. Entrada por síntomas — `/siento/`

Esta sigue siendo una de las capas más importantes del proyecto.

Objetivos:

1. responder búsquedas expresadas en lenguaje cotidiano;
2. disminuir incertidumbre;
3. evitar autodiagnóstico prematuro;
4. mostrar cuándo vale la pena prestar atención;
5. facilitar un siguiente paso.

Ejemplos:

```text
/siento/no-puedo-dormir-aunque-este-cansado
/siento/no-tengo-ganas-de-hacer-nada
/siento-me-preocupo-por-todo
/siento-no-puedo-dejar-de-pensar
/siento-me-cuesta-salir-de-la-cama
/siento-me-siento-mal-sin-saber-por-que
```

## 7.1 Plantilla recomendada

El orden puede ajustarse editorialmente cuando sea necesario.

```text
1. H1 = frase textual o muy cercana a la búsqueda del usuario

2. Explicación breve
   Qué significa experimentar algo así, sin diagnosticar.

3. Contexto
   Es algo que puede aparecer en distintas situaciones.

4. Datos de frecuencia o prevalencia
   Sólo cuando existe una fuente fiable y realmente aporta.

5. Cuándo conviene prestarle atención
   Duración, intensidad, impacto cotidiano, cambios importantes.

6. Qué puede ayudar y qué se sabe sobre su efectividad
   Explicar si existen formas de apoyo o tratamiento con respaldo,
   qué expectativa razonable de mejoría permiten y a quiénes aplica la evidencia.

7. Qué podría estar relacionado
   Varias posibilidades, nunca una conclusión.

8. Recurso práctico opcional
   Sólo cuando sea apropiado y clínicamente revisado.

9. Autoevaluación opcional
   Si existe un instrumento pertinente.

10. Posibles siguientes pasos

11. Recursos o rutas relacionadas

12. Temas relacionados

13. Fecha y método de verificación
    Verificación por fuentes o revisión clínica, según el riesgo del contenido.
```

## 7.2 Perspectiva de mejoría y ayuda con evidencia

El bloque sobre qué puede ayudar no es una técnica de persuasión ni una promesa de resultado.

Su función es evitar que una página describa un problema relevante sin explicar que pueden existir formas eficaces de abordarlo.

Debe cumplir:

* distinguir el síntoma cotidiano de un diagnóstico;
* indicar expresamente cuando la evidencia sólo aplica a una condición o población determinada;
* utilizar lenguaje calibrado sobre beneficios, limitaciones e incertidumbre;
* incluir al menos una fuente específica para cada afirmación sobre efectividad o respuesta;
* quedar sujeto a verificación editorial de fuentes y, cuando el contenido introduzca juicio clínico o riesgo, a revisión profesional.

Si la forma de ayuda depende de la causa, la evidencia es limitada o no existe una recomendación suficientemente generalizable, debe decirse con claridad. No se inventa una expectativa positiva para completar la plantilla.

Ejemplo de encuadre:

> “Las dificultades para dormir pueden tener distintas causas. Cuando corresponden a insomnio crónico en personas adultas, existen tratamientos psicológicos específicos recomendados por guías clínicas. Una evaluación permite determinar si ese enfoque es pertinente en cada caso.”

Evitar cuantificadores como “la mayoría mejora” o afirmaciones sobre duración de los resultados si la fuente utilizada no respalda exactamente esa magnitud, población y período.

## 7.3 Frases que deben evitarse

No:

> “Lo que describes tiene un nombre.”

cuando existen múltiples explicaciones posibles.

No:

> “Si no buscas ayuda esto puede empeorar.”

como técnica de persuasión.

No:

> “Necesitas ir al psicólogo.”

No, si no hay una fuente que lo respalde en esa población y ese alcance:

> “Sentir vergüenza al consultar por salud mental es frecuente.”

> “Es una de las razones más comunes para no consultar.”

Son afirmaciones epidemiológicas y pasan desapercibidas porque suenan a consuelo. Decir que algo es
entendible es un juicio editorial y se puede sostener; decir con qué frecuencia ocurre necesita
fuente. Ver [`fase-4-revision-guias.md`](./fase-4-revision-guias.md), D43.

Preferir:

> “Lo que describes puede aparecer por diferentes razones.”

> “Puede ser especialmente útil prestarle atención si lleva varias semanas, aumenta en intensidad o empieza a afectar tu vida cotidiana.”

> “Si quieres entenderlo mejor, estas son algunas opciones.”

---

# 8. Recursos prácticos

El borrador original proponía incluir siempre “una técnica para esta noche”.

Eso pasa a ser opcional.

Schema conceptual:

```ts
recursoPractico?: {
  titulo: string;
  descripcion: string;
  pasos: string[];
  fuente: Fuente;
  requiereRevisionClinica: boolean;
  revisadoPor?: string;
}
```

Sólo debe publicarse si cumple:

* riesgo bajo;
* evidencia razonable;
* no requiere diagnóstico;
* no depende de información clínica que orientame.cl no posee;
* no pretende reemplazar tratamiento;
* reproduce fielmente una recomendación de bajo riesgo contenida en una fuente admisible o ha sido revisado profesionalmente cuando introduce adaptaciones o decisiones clínicas propias.

Una página puede perfectamente no tener recurso práctico.

La firma de un profesional no es obligatoria para publicar una adaptación clara y fiel de una recomendación de bajo riesgo procedente de una fuente confiable y verificable. Sí se requiere revisión clínica cuando la técnica, su selección, sus contraindicaciones o su forma de presentación exigen juicio clínico que la fuente no resuelve directamente.

---

# 9. Autoevaluaciones

Los tests continúan formando parte de orientame.cl.

Son útiles para quien **quiere voluntariamente utilizarlos**, pero no son la puerta principal del sitio.

Ruta:

```text
/autoevaluacion/
/autoevaluacion/[slug]
```

Ejemplos potenciales:

* PHQ-9;
* GAD-7;
* otros instrumentos validados cuya fuente, licencia y forma de uso sean posteriormente verificadas.

## 9.1 Reglas

Cada instrumento debe tener:

* fuente;
* versión;
* población para la que aplica;
* licencia o condición de uso;
* sistema de puntuación documentado;
* interpretación previamente redactada;
* método de verificación;
* fecha de verificación;
* revisión clínica cuando se añadan interpretaciones propias, se modifiquen umbrales o exista una respuesta asociada a riesgo.

No se implementa un instrumento hasta verificar sus condiciones exactas de uso.

Durante el desarrollo puede implementarse como borrador después de verificar fuente, versión, licencia y scoring. Si la implementación reproduce fielmente el instrumento y su interpretación oficial, puede publicarse mediante verificación por fuentes. Cualquier interpretación nueva, adaptación de umbrales o respuesta clínica no contenida en la fuente requiere revisión profesional.

## 9.2 Resultado

El resultado nunca se presenta como diagnóstico.

Ejemplo:

> Tus respuestas se encuentran dentro de un rango que, en este instrumento, suele asociarse a una presencia relevante de síntomas.

Luego:

> Este resultado por sí solo no permite saber si existe un trastorno ni reemplaza una evaluación profesional.

Después se ofrecen opciones.

## 9.3 Persistencia

Por defecto:

**no se guarda el resultado.**

Si se incorpora una opción explícita para guardar localmente, sólo utiliza almacenamiento del navegador.

Debe existir una manera sencilla de eliminar esos datos desde la misma funcionalidad.

No es necesario interrumpir al usuario con advertencias alarmistas sobre `localStorage`.

## 9.4 Situaciones de riesgo

La reacción frente a respuestas clínicamente sensibles no se define mediante reglas improvisadas por ingeniería.

Debe existir un:

```text
protocolo-crisis.md
```

versionado y aprobado por supervisión clínica.

Los componentes implementan ese protocolo.

Durante el desarrollo los componentes pueden construirse y probarse contra una versión provisional claramente marcada. Ninguna lógica de respuesta a riesgo se habilita en la versión pública hasta que el protocolo y su implementación hayan sido revisados y aprobados.

---

# 10. El siguiente paso posible

orientame.cl no termina necesariamente en:

> “agenda una hora”.

En cada recorrido debe preguntarse:

> **¿Cuál es la acción útil de menor fricción que podemos ofrecer ahora?**

Ejemplos:

```text
Quiero recibir atención
        ↓
ver opciones disponibles

Todavía no quiero pedir una hora
        ↓
ver cómo funciona una primera consulta

Me cuesta llamar
        ↓
ver qué puedo decir

No estoy preparado para hablar con un profesional
        ↓
ver alternativas de orientación

Todavía no
        ↓
volver cuando quieras
```

Este principio debe estar presente transversalmente en el contenido.

---

# 11. Guiones para pedir ayuda

Ruta:

```text
/primera-vez/que-decir
```

La v1 utiliza principalmente guiones estáticos.

Ejemplos:

## Pedir una primera hora

> Hola. Quisiera saber cómo puedo solicitar una hora con psicología. Es primera vez que busco atención.

## Si preguntan el motivo

> Últimamente no me he sentido bien y prefiero explicar el motivo con más detalle durante la consulta.

## Consultar al CESFAM

> Hola. Estoy inscrito aquí y quisiera saber cómo puedo solicitar una evaluación por salud mental.

## Hablar con alguien cercano

> Quería contarte algo que me ha costado un poco decir. Últimamente no me he sentido muy bien y creo que me haría bien hablarlo con alguien.

Los botones pueden simplemente:

```text
[ Copiar ]
```

No se necesita inicialmente un `MessageBuilder` combinatorio.

---

# 12. Primera vez

Rutas:

```text
/primera-vez/
/primera-vez/que-pasa-en-sesion
/primera-vez/que-decir
/primera-vez/cuanto-cuesta
/primera-vez/como-elegir
```

Objetivo:

**eliminar incertidumbre antes del contacto.**

Estas páginas tienen alto valor y muy poca complejidad técnica.

---

# 13. Dónde encontrar ayuda

Ruta principal:

```text
/donde/
```

orientame.cl no intenta construir un directorio masivo de psicólogos privados.

Prioriza:

* red pública;
* alternativas gratuitas;
* alternativas de bajo costo;
* servicios nacionales;
* clínicas psicológicas universitarias;
* mecanismos oficiales de cobertura;
* orientación sobre atención privada.

## 13.1 Posibles categorías

```text
CESFAM
COSAM
CECOSF
hospitales
clínicas universitarias
ONG
servicios nacionales
líneas de orientación
programas específicos
```

## 13.2 Rutas geográficas

```text
/donde/[region]/[comuna]
```

Las páginas indican cómo ingresar realmente a cada servicio.

No basta con publicar:

```text
COSAM X
Dirección Y
```

El dato importante es:

> **¿Qué debe hacer una persona para conseguir atención allí?**

## 13.3 Dos niveles de recurso

Responder esa pregunta exige verificación humana por establecimiento, lo que limita cuántas comunas
se pueden cubrir. Para no dejar sin nada al resto del país, los recursos se publican en dos niveles
que nunca se presentan como equivalentes.

**Nivel A — qué existe en tu comuna.** Cobertura nacional reproducida del registro oficial de
establecimientos del Ministerio de Salud, con su fecha de consulta. Indica qué hay, no cómo se
accede, y se marca como `requiere-revision`. No sustituye la respuesta a la pregunta de 13.2: es un
punto de partida verificable acompañado de las vías de orientación disponibles.

**Nivel B — cómo consigues hora ahí.** `pasosAcceso`, requisitos, canales y horarios verificados a
mano, con fuente y `proximaRevision`. Es el nivel que efectivamente reduce la barrera.

Una entrada de Nivel A nunca se muestra como si estuviera verificada. La distinción se sostiene en
el campo `estado` del modelo de la sección 14.

En la v1 el Nivel B se limita a las comunas piloto. Su expansión nacional queda diferida a una v2 y
condicionada a que exista financiamiento para sostener la revisión humana y su reverificación
periódica.

---

# 14. Modelo de recursos

Ejemplo conceptual:

```ts
const recurso = z.object({
  id: z.string(),

  tipo: z.enum([
    'cesfam',
    'cecosf',
    'cosam',
    'hospital',
    'clinica-universitaria',
    'ong',
    'linea',
    'otro'
  ]),

  nombre: z.string(),

  region: z.string().optional(),
  comuna: z.string().optional(),

  direccion: z.string().optional(),
  telefono: z.string().optional(),
  web: z.string().url().optional(),

  audiencias: z.array(z.string()).default([]),

  costo: z.enum([
    'gratuito',
    'bajo',
    'segun-tramo',
    'variable',
    'desconocido'
  ]),

  rangoPrecio: z.string().optional(),

  requisitos: z.array(z.string()).default([]),

  canales: z.array(
    z.enum([
      'presencial',
      'telefono',
      'web',
      'videollamada',
      'email',
      'otro'
    ])
  ),

  pasosAcceso: z.array(z.string()),

  horarios: z.string().optional(),

  notas: z.string().optional(),

  estado: z.enum([
    'verificado',
    'requiere-revision',
    'no-disponible'
  ]),

  fuente: z.object({
    nombre: z.string(),
    url: z.string().url().optional(),
    tipo: z.enum([
      'oficial',
      'institucional',
      'contacto-directo',
      'otra'
    ]),
    consultadoEl: z.coerce.date()
  }),

  verificadoPor: z.string(),
  verificadoEl: z.coerce.date(),
  proximaRevision: z.coerce.date()
});
```

## 14.1 Información vencida

No se bloquea el build.

El sistema puede marcar:

```text
Información revisada hace más tiempo del previsto.
Te recomendamos confirmarla directamente con el servicio.
```

Y generar internamente una lista:

```text
RECURSOS QUE REQUIEREN REVISIÓN
```

La generación automatizada de estas alertas se implementa **al final del desarrollo de la v1**, no durante las primeras iteraciones.

---

# 15. Recursos nacionales y urgencia

Las líneas nacionales deben mantenerse en un dataset separado por su importancia.

Ejemplo:

```text
src/data/lineas.json
```

Entre los recursos que deberán verificarse formalmente antes del lanzamiento está:

* Salud Responde;
* Línea de Prevención del Suicidio *4141;
* SENDA 1412;
* otros servicios nacionales o especializados que superen revisión clínica y editorial.

Nunca publicar teléfonos copiando información secundaria sin verificación.

---

# 16. Capa de urgencia

Ruta:

```text
/urgencia
```

Debe ser una de las páginas más simples y rápidas del sitio.

Características:

* HTML estático;
* sin dependencia de JavaScript;
* sin animaciones;
* información jerarquizada;
* números y acciones claramente identificables;
* revisada clínicamente.

## 16.1 Acceso persistente

En todas las páginas existe un enlace discreto pero siempre accesible:

```text
¿Necesitas ayuda ahora?
```

No es necesario utilizar una gran cinta de emergencia permanente.

En páginas especialmente sensibles puede aumentar visualmente su prominencia.

## 16.2 Búsqueda

El buscador puede detectar términos potencialmente relacionados con riesgo.

Pero no debe concluir:

> “estás en crisis”.

Si existe coincidencia, puede mostrar:

> **Si esta búsqueda tiene relación con que tú o alguien cercano corre peligro ahora, aquí puedes encontrar ayuda inmediata.**

```text
[ Ver ayuda inmediata ]
```

Los resultados normales permanecen debajo.

Esto evita falsos positivos como:

```text
"mi hermano se suicidó"
"no tengo pensamientos suicidas"
"prevención del suicidio"
```

## 16.3 Flujos estructurados

Cuando una respuesta explícita dentro de una autoevaluación u otro flujo activa el protocolo clínico de urgencia, se sigue exactamente el protocolo previamente aprobado.

---

# 17. Acompañar a otra persona

Ruta:

```text
/acompanar/
/acompanar/[slug]
```

Esta es una entrada principal del producto.

Posibles contenidos:

* me preocupa mi pareja;
* me preocupa mi hijo;
* me preocupa un amigo;
* alguien cercano no quiere pedir ayuda;
* no sé cómo preguntarle cómo está;
* qué cosas evitar;
* qué hacer si rechaza ayuda;
* cuándo una situación puede requerir una respuesta urgente.

No debe convertirse en una guía para diagnosticar a terceros.

---

# 18. Historias

Ruta:

```text
/historias/
/historias/[slug]
```

Las historias pueden ayudar a reducir distancia, miedo y estigma.

## 18.1 V1

Contenido editorial estático.

Toda experiencia real requiere:

* consentimiento explícito;
* definición del grado de anonimización;
* revisión editorial;
* posibilidad de solicitar retiro;
* exclusión de detalles clínicos innecesarios.

Nunca se presentan testimonios ficticios como historias reales.

## 18.2 Futuro: comentarios comunitarios

Después de la v1 se puede estudiar una sección de comentarios anónimos en páginas `/siento/`.

Objetivo:

> permitir que personas compartan experiencias relacionadas y reduzcan la sensación de aislamiento.

Esto **no forma parte de la v1**.

Requeriría:

* Cloudflare D1 u otra persistencia equivalente;
* moderación;
* sistema de reportes;
* prevención de spam;
* filtros de información sensible;
* protocolo de contenido de riesgo;
* nueva revisión de privacidad;
* reglas editoriales;
* auditoría.

Debe tratarse como una fase de producto independiente, no como un pequeño agregado.

---

# 19. Rutas

```text
/

/empezar

/siento/
/siento/[slug]

/temas/
/temas/[slug]

/autoevaluacion/
/autoevaluacion/[slug]

/donde/
/donde/[region]/[comuna]
/donde/clinicas-universitarias

/primera-vez/
/primera-vez/que-pasa-en-sesion
/primera-vez/que-decir
/primera-vez/cuanto-cuesta
/primera-vez/como-elegir

/acompanar/
/acompanar/[slug]

/historias/
/historias/[slug]

/urgencia

/sobre
/metodologia

/legal/
/legal/privacidad
/legal/alcance
/legal/terminos
```

## 19.1 `/siento/` y `/temas/`

Son colecciones diferentes.

```text
/siento/no-puedo-dormir-aunque-este-cansado
```

responde a lenguaje cotidiano.

```text
/temas/insomnio
```

explica un concepto ya identificado.

La primera puede conducir hacia la segunda.

No se asume que toda búsqueda cotidiana corresponde exactamente a un cuadro clínico.

---

# 20. Páginas legales y de alcance

En `/legal/alcance` debe existir una sección clara:

# Lo que orientame.cl no hace

orientame.cl no:

* diagnostica enfermedades o trastornos;
* reemplaza evaluación profesional;
* ofrece psicoterapia;
* prescribe tratamientos o medicamentos;
* realiza evaluación clínica de riesgo;
* presta atención de emergencia;
* almacena fichas clínicas;
* realiza seguimiento de pacientes;
* garantiza disponibilidad de servicios externos;
* recomienda profesionales porque hayan pagado;
* recibe comisión por derivaciones;
* determina automáticamente qué tratamiento requiere una persona.

Esta información también debe resumirse en puntos relevantes del sitio, pero la versión completa vive en las páginas legales.

---

# 21. Audiencia inicial

## MVP

Público general residente en Chile.

El contenido principal se diseña prioritariamente para adultos.

También pueden existir rutas para:

* personas preocupadas por terceros;
* padres o cuidadores;
* familiares;
* parejas;
* amigos.

Los instrumentos, recomendaciones o recorridos específicamente dirigidos a menores sólo se publican cuando exista revisión clínica adecuada para ese grupo.

No se extrapolan automáticamente instrumentos de adultos hacia adolescentes o niños.

---

# 22. Stack técnico

Mantener el principio:

> **estático primero.**

Stack base:

```text
Astro — versión estable vigente
TypeScript

Output estático

Cloudflare
- Workers Static Assets
  o
- Pages mientras continúe siendo la alternativa más simple

Astro Content Collections
Zod schemas

Pagefind
búsqueda estática generada durante build

CSS
Tailwind si continúa aportando simplicidad al proyecto

Interactividad:
JavaScript nativo por defecto
Preact islands cuando el estado o complejidad realmente lo justifique
```

## 22.1 No existe en v1

```text
Base de datos
Auth
Usuarios
Sesiones
Backend de aplicación
API propia
IA generativa
Vector database
Sistema de pagos
Calendario
Notificaciones
CRM
CMS
```

---

# 23. Islands e interactividad

No existe una regla artificial de “exactamente tres islands”.

La regla es:

> **usar JavaScript sólo cuando la interacción aporta valor.**

Esa evaluación se hace componente por componente, cuando llega su etapa, y puede resolverse en cualquiera de los dos sentidos.

Un recorrido que sólo cambia de contenido según lo que la persona elige se resuelve mejor con rutas estáticas: un enlace hace exactamente lo mismo, funciona sin JavaScript y deja cada estado con URL propia.

Un island se justifica cuando existe estado real que debe responder sin recargar la página: filtrar una lista mientras se escribe, puntuar un instrumento a medida que se responde, mostrar resultados de búsqueda.

Componentes que probablemente sí lo requieran:

```text
Test.tsx
ResourceFinder.tsx
Buscador.tsx
```

Puede existir algún componente adicional si realmente simplifica el producto.

## 23.1 Orientador

Ruta de primer paso.

Resuelto como rutas estáticas bajo `/empezar`, sin JavaScript. El recorrido no mantiene estado propio: cada decisión sólo determina qué contenido mostrar a continuación.

No scoring clínico.

Ver §6 y la decisión D1 en [`fase-2-decisiones.md`](./fase-2-decisiones.md).

## 23.2 `Test.tsx`

Renderiza instrumentos.

Scoring mediante funciones puras y testeables.

Sin solicitudes de red.

## 23.3 `ResourceFinder.tsx`

Permite filtrar recursos por:

* comuna;
* tipo;
* costo;
* audiencia;
* modalidad.

Sin geolocalización obligatoria.

La comuna se selecciona manualmente por defecto.

## 23.4 `Buscador.tsx`

Pagefind.

Puede añadir contexto de urgencia cuando ciertas búsquedas coincidan con reglas revisadas, pero nunca sustituye los resultados normales ni pretende detectar clínicamente una crisis.

---

# 24. Se descarta el calendario `.ics` en v1

El borrador anterior proponía construir un plan con fecha y generar un archivo de calendario.

No se considera necesario para el propósito actual de orientame.cl.

Introduce comportamiento parecido a una aplicación de productividad y aumenta complejidad sin resolver una barrera suficientemente importante.

Se elimina de la v1.

Si posteriormente existe evidencia de que recordatorios o compromisos concretos mejoran el uso del sitio, puede reconsiderarse.

Por ahora orientame.cl puede terminar simplemente en:

```text
Tu siguiente paso puede ser:

Llamar a ______
Preguntar ______
Leer ______
Hablar con ______
```

Con funciones simples como:

```text
[ Copiar ]
[ Imprimir ]
```

cuando tengan sentido.

---

# 25. Estructura de archivos

Ejemplo:

```text
src/
  content.config.ts

  content/
    sintomas/
    temas/
    instrumentos/
    acompanar/
    historias/
    guias/

  data/
    fuentes.ts
    recursos.json
    lineas.json
    comunas.json

  components/
    islands/
      Test.tsx
      ResourceFinder.tsx
      Buscador.tsx

    AccesoUrgencia.astro
    BloqueSiguientePaso.astro
    FichaRecurso.astro
    SelloRevision.astro
    GuionCopiable.astro

  layouts/
    Base.astro
    Sintoma.astro
    Tema.astro

  lib/
    crisis.ts
    orientador.ts
    scoring.ts
    resources.ts

  pages/
    index.astro
    empezar/
      index.astro
      [...ruta].astro
    urgencia.astro
    sobre.astro
    metodologia.astro

    legal/
      index.astro
      privacidad.astro
      alcance.astro
      terminos.astro

scripts/
  # Añadidos al final de la v1:
  audit-resources.ts
  validate-content.ts
```

---

# 26. Schema de síntomas

Ejemplo conceptual:

```ts
const sintomas = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/sintomas'
  }),

  schema: z.object({
    frase: z.string(),

    variantes: z.array(z.string()),

    temasRelacionados: z.array(
      z.reference('temas')
    ).default([]),

    instrumento: z
      .reference('instrumentos')
      .optional(),

    prevalenciaCL: z.object({
      cifra: z.string(),
      fuente: z.string(),
      url: z.string().url()
    }).optional(),

    quePuedeAyudar: z.object({
      estadoEvidencia: z.enum([
        'especifica',
        'depende-de-la-causa',
        'limitada'
      ]),
      resumen: z.string(),
      alcance: z.string(),
      fuentes: z.array(
        z.object({
          titulo: z.string(),
          referencia: z.string(),
          url: z.string().url()
        })
      ).min(1)
    }),

    recursoPractico: z.object({
      titulo: z.string(),
      descripcion: z.string().optional(),
      pasos: z.array(z.string()),
      fuente: z.object({
        titulo: z.string(),
        referencia: z.string(),
        url: z.string().url()
      }),
      requiereRevisionClinica: z.boolean().default(false),
      revisadoPor: z.string().optional()
    }).optional(),

    urgencia: z.enum([
      'normal',
      'contextual',
      'prominente'
    ]).default('normal'),

    autor: z.string(),

    creadoConIA: z.boolean().default(false),

    revisionRequerida: z.enum([
      'fuentes',
      'clinica'
    ]).default('fuentes'),

    estadoEditorial: z.enum([
      'borrador',
      'en-verificacion',
      'verificado-con-fuentes',
      'en-revision-clinica',
      'revisado-clinicamente'
    ]).default('borrador'),

    verificadoEl: z.coerce.date().optional(),

    revisadoPor: z.string().optional(),

    revisadoEl: z.coerce.date().optional(),

    proximaRevision: z.coerce.date().optional(),

    fuentes: z.array(
      z.object({
        titulo: z.string(),
        referencia: z.string(),
        url: z.string().url()
      })
    ).min(1)
  })
});
```

La presencia de una prevalencia chilena no es obligatoria si no existe una cifra suficientemente sólida o pertinente.

`quePuedeAyudar` sí es obligatorio como decisión editorial, pero no obliga a afirmar que existe un tratamiento único ni que toda persona responderá de la misma manera. Los estados `depende-de-la-causa` y `limitada` permiten representar honestamente esos casos.

Durante el desarrollo, el schema permite contenidos en borrador sin datos de revisión clínica. Un contenido con `revisionRequerida: 'fuentes'` es publicable cuando alcanza `estadoEditorial: 'verificado-con-fuentes'`, tiene fuentes suficientes y registra `verificadoEl` y `proximaRevision`. Un contenido con `revisionRequerida: 'clinica'` sólo es publicable con `estadoEditorial: 'revisado-clinicamente'` y valores válidos para `revisadoPor`, `revisadoEl` y `proximaRevision`.

---

# 27. Privacidad

## 27.1 Principio general

Las respuestas sensibles de las herramientas no deben enviarse a orientame.cl ni almacenarse en servidores en la v1.

## 27.2 Infraestructura

La documentación de privacidad debe reconocer que cualquier sitio web implica datos técnicos asociados a solicitudes HTTP.

No utilizar lenguaje absoluto técnicamente incorrecto.

## 27.3 Terceros

Evitar:

* Meta Pixel;
* Google Ads conversion tracking;
* trackers publicitarios;
* mapas embebidos innecesarios;
* videos embebidos con tracking;
* fuentes externas;
* scripts remotos.

## 27.4 Analytics

Cloudflare Web Analytics puede utilizarse inicialmente para métricas agregadas.

No crear eventos personalizados asociados a:

* respuestas de tests;
* respuestas del orientador;
* resultados clínicos;
* selecciones sensibles individuales.

Esta decisión puede revisarse posteriormente.

## 27.5 `localStorage`

Puede utilizarse cuando exista una razón concreta.

Ejemplos:

* recordar una preferencia local;
* guardar voluntariamente un resultado.

No se necesita pedir consentimiento mediante un modal simplemente por utilizar almacenamiento estrictamente funcional que nunca sale del navegador, salvo que una futura revisión jurídica determine otra cosa.

No utilizarlo como sustituto silencioso de una cuenta de usuario.

---

# 28. Seguridad web

Baseline:

```text
Content-Security-Policy estricta
Referrer-Policy: no-referrer
X-Content-Type-Options: nosniff
frame-ancestors 'none'
Permissions-Policy restrictiva
HTTPS
assets propios
fonts locales
```

Evitar dependencias remotas cuando no sean necesarias.

Los enlaces externos sensibles deben evitar transmitir información innecesaria sobre la página desde la que llegó el usuario.

No utilizar:

```text
prefetchAll: true
```

globalmente.

Si posteriormente se implementa prefetch, debe ser deliberado y no generar solicitudes hacia páginas que el usuario todavía no abrió sin una razón clara.

---

# 29. Accesibilidad

Objetivo:

**WCAG 2.2 AA.**

Requisitos:

* navegación completa por teclado;
* landmarks semánticos;
* labels correctos;
* foco visible;
* contraste suficiente;
* no depender sólo de color;
* textos legibles;
* botones con áreas cómodas;
* compatibilidad con lectores de pantalla;
* `prefers-reduced-motion`;
* lenguaje claro;
* formularios con instrucciones comprensibles;
* errores explicados en texto;
* `/urgencia` completamente utilizable sin JavaScript.

---

# 30. Gobernanza editorial

orientame.cl no necesita un CMS en la v1.

El repositorio es la fuente de verdad.

## 30.1 Producción inicial asistida por IA

El contenido inicial de la v1 puede ser investigado, estructurado y redactado por agentes de IA para no convertir la disponibilidad de revisores profesionales en un bloqueo del desarrollo.

Los agentes pueden utilizar fuentes disponibles y conocimiento general para explorar, organizar y redactar. Sin embargo, el conocimiento general no cuenta por sí solo como fuente de publicación. Antes de marcar una pieza como verificada:

* cada afirmación clínica, epidemiológica o sobre efectividad debe poder rastrearse a una fuente identificada;
* el enlace debe ser accesible y permitir comprobar que la fuente respalda realmente la afirmación;
* deben preferirse organismos oficiales como la OMS y el Ministerio de Salud de Chile, guías clínicas, organizaciones profesionales o científicas reconocidas, fuentes primarias y revisiones sistemáticas pertinentes;
* pueden utilizarse papers, tesis y otros trabajos académicos de autoría e institución identificables cuando su metodología, alcance y vigencia sean adecuados para la afirmación;
* las incertidumbres, contradicciones o fuentes pendientes deben quedar marcadas de forma visible;
* no deben inventarse referencias, credenciales, cifras ni consensos;
* el contenido debe identificarse como borrador asistido o generado por IA en sus metadatos internos.

Una tesis o un paper aislado no se considera automáticamente equivalente a una guía clínica o a un consenso. La fuerza del texto debe ser proporcional a la fuerza y alcance de la evidencia disponible.

## 30.2 Dos vías de verificación

### Verificación por fuentes

Un agente puede generar y dejar publicable contenido informativo sin firma profesional cuando:

* adapta a lenguaje claro información contenida en fuentes confiables y enlazables;
* conserva el alcance, población, condiciones y grado de certeza de las fuentes;
* no inventa una conclusión clínica ni resuelve contradicciones mediante criterio propio;
* no diagnostica, prescribe ni entrega una recomendación personalizada;
* identifica las fuentes de manera que otra persona pueda verificar el texto.

Esta vía puede utilizarse, por ejemplo, para explicar un tema, resumir prevalencia, describir formas de ayuda respaldadas, traducir una guía a lenguaje cotidiano o explicar cómo acceder a un servicio oficial.

La autoría mediante IA debe registrarse internamente por transparencia y trazabilidad, pero no invalida el contenido ni exige por sí sola la firma de un profesional.

### Revisión clínica

Se reserva para contenido que cumple alguno de los criterios de riesgo definidos en la sección 31.

Los borradores pueden integrarse al repositorio, compilarse y desplegarse en entornos de desarrollo o preview antes de completar la verificación que les corresponda. Esos entornos no deben presentarse al público como la versión verificada del servicio.

La revisión clínica del contenido que efectivamente la requiera puede realizarse por lotes cuando la estructura y el contenido de la v1 estén suficientemente estables. Una pieza pendiente de revisión puede permanecer fuera de la publicación sin bloquear otras piezas verificadas por fuentes.

Flujo de construcción y publicación:

```text
Borrador producido por agentes de IA
   ↓
Fuentes y metadatos estructurados
   ↓
Integración y pruebas en desarrollo/preview
   ↓
Clasificación: verificación por fuentes o revisión clínica
   ↓
Verificación correspondiente
   ↓
Publicación de cada pieza que cumpla su estado requerido
```

## 30.3 Estados y metadatos mínimos

Durante la construcción, cada contenido clínicamente relevante debe tener como mínimo:

```text
autor
creadoConIA
revisionRequerida
estadoEditorial
fuentes
```

Antes de publicar por verificación de fuentes debe tener además:

```text
estadoEditorial = verificado-con-fuentes
verificadoEl
proximaRevision
```

Cuando el contenido requiera revisión clínica debe tener:

```text
estadoEditorial = revisado-clinicamente
revisadoPor
revisadoEl
proximaRevision
```

La validación de publicación debe excluir una pieza que no haya alcanzado el estado correspondiente a `revisionRequerida`. Esto no bloquea el despliegue de las demás piezas que sí lo cumplen. No se utilizan nombres de profesionales ni estados de revisión provisionales para satisfacer el schema durante el desarrollo.

## 30.4 `/sobre`

Debe existir una página pública que explique quién mantiene orientame.cl.

Cuando los profesionales involucrados den su autorización, puede incluir:

* nombre;
* profesión;
* credenciales relevantes;
* rol dentro de orientame.cl;
* áreas que revisan.

Ejemplo:

```text
Revisión clínica

Dra./Ps. Nombre Apellido
Psicóloga clínica
Responsable de revisión de contenidos de ansiedad,
depresión y protocolo de urgencia.
```

Esto añade trazabilidad y confianza sin necesitar un CMS.

## 30.5 `/metodologia`

Debe explicar:

* cómo se seleccionan fuentes;
* cómo se verifica contenido generado o adaptado por IA;
* quién revisa contenidos;
* qué contenidos requieren revisión clínica y cuáles pueden validarse por fuentes;
* cada cuánto se revisan;
* cómo se validan recursos;
* diferencia entre orientación y diagnóstico;
* política de actualización.

---

# 31. Supervisión clínica

La supervisión clínica no es un requisito universal para publicar todo el sitio ni una firma obligatoria para cada página.

El contenido informativo que adapta fielmente fuentes confiables puede publicarse mediante la vía de verificación por fuentes definida en 30.2.

Se requiere revisión clínica para:

* política de urgencia;
* reglas que reaccionen a respuestas o señales de riesgo;
* interpretaciones de instrumentos que no sean una reproducción fiel de su documentación validada;
* cambios de scoring, umbrales o población de aplicación;
* recomendaciones personalizadas o prescriptivas;
* recursos prácticos cuya selección, adaptación o seguridad no queden resueltas directamente por una fuente admisible;
* contenido dirigido a menores que implique recomendaciones o recorridos clínicos;
* síntesis que resuelvan evidencia contradictoria o introduzcan una conclusión clínica original.

No requieren por defecto firma ni revisión profesional:

* adaptaciones a lenguaje claro de información oficial o académica verificable;
* cifras de prevalencia reproducidas con su población, fecha y fuente;
* explicaciones generales sobre qué formas de ayuda cuentan con respaldo, si conservan exactamente el alcance de la fuente;
* descripciones de servicios, requisitos y rutas de acceso obtenidas de fuentes oficiales;
* páginas `/siento/`, `/temas/` o `/primera-vez/` que no excedan lo respaldado por sus fuentes ni introduzcan decisiones clínicas propias.

Cuando exista contenido en la primera categoría, idealmente pueden existir varias personas profesionales distribuidas por temática para revisarlo. La falta de revisión de una pieza sensible impide publicar esa pieza o funcionalidad, no el resto del sitio.

Un convenio futuro con una escuela de psicología puede ser útil, pero no es requisito técnico de la v1.

---

# 32. Marco legal

Antes de lanzamiento deben revisarse formalmente, entre otras:

* Ley 21.719 sobre protección y tratamiento de datos personales;
* Ley 21.331 sobre derechos en la atención de salud mental;
* normativa aplicable a publicación de información sanitaria;
* derechos de autor/licencias de instrumentos psicológicos;
* reglas relacionadas con atención a menores cuando corresponda.

La arquitectura estática y sin cuentas reduce considerablemente la superficie de tratamiento de datos, pero no sustituye una revisión legal.

---

# 33. Build y despliegue

Conceptualmente:

```js
export default defineConfig({
  output: 'static',
  site: 'https://...',
  integrations: [
    sitemap(),
    mdx()
  ]
});
```

Pagefind se ejecuta después del build.

Las páginas geográficas se generan estáticamente mediante `getStaticPaths()`.

No existe runtime de aplicación.

---

# 34. Actualización de recursos

## Durante construcción de la v1

Manual.

Los recursos se editan directamente en:

```text
src/data/recursos.json
```

o en la estructura equivalente que termine utilizándose.

Esto evita ralentizar iteraciones tempranas.

## Al finalizar funcionalmente la v1

Se implementa:

```text
script de auditoría
        ↓
detecta recursos próximos a revisión
        ↓
genera reporte
        ↓
avisa al administrador
```

Posteriormente puede evolucionar a:

```text
GitHub Action programada
        ↓
consulta fuentes oficiales disponibles
        ↓
compara cambios
        ↓
genera diff o PR
        ↓
revisión humana
        ↓
merge
```

Nunca actualizar automáticamente información sanitaria en producción sin revisión humana.

---

# 35. Testing durante desarrollo

Durante la construcción inicial se evita sobreingeniería.

Obligatorio:

```text
lint
typecheck
build exitoso
```

Tests únicamente donde un fallo pueda tener consecuencias relevantes.

Ejemplos:

```text
scoring de instrumentos
reglas críticas de urgencia
filtrado crítico de recursos
```

No es necesario construir inicialmente:

* gran suite E2E;
* coverage exhaustivo;
* pipelines complejos;
* matrices de navegadores;
* automatización total de accesibilidad.

---

# 36. Testing al cerrar la v1

Una vez que las funciones de la v1 estén terminadas y el producto deje de cambiar estructuralmente, se endurece el proyecto.

Agregar:

### Unit tests

* scoring;
* filtros;
* funciones críticas;
* reglas de contenido estructurado.

### Integration / E2E

* `/empezar`;
* tests;
* recursos;
* urgencia;
* buscador;
* navegación principal.

### Calidad

* enlaces rotos;
* auditoría de accesibilidad;
* schemas;
* páginas sin revisión;
* recursos vencidos;
* contenido sin fuentes.

### Privacidad

Cuando sea técnicamente razonable:

> comprobar que responder formularios sensibles no genera solicitudes de red adicionales.

### CI

El pipeline completo se construye **después de estabilizar la v1**, no como condición para comenzar a iterar.

---

# 37. Analytics y medición

La medición existe para tomar decisiones, no para acumular datos. Cada proxy debe especificar:

* la pregunta que intenta responder;
* numerador y denominador;
* segmento o recorrido al que aplica;
* ventana de observación;
* muestra mínima;
* umbral de revisión;
* acción que se tomará al cruzarlo.

Se aceptan métricas agregadas como:

* páginas más visitadas;
* búsquedas frecuentes;
* rutas de entrada;
* clicks hacia recursos externos;
* errores;
* rendimiento.

## 37.1 Proxy inicial para `/siento/`

Para la v1 se define como proxy principal la **tasa agregada de inicio de un siguiente paso significativo** desde una página `/siento/*`.

```text
primer click en un siguiente paso significativo por carga de página elegible
÷
cargas elegibles de páginas /siento/*
```

Para evitar inflar el indicador, sólo se cuenta el primer click elegible de cada carga de página. No requiere identificación persistente ni vincular acciones entre sesiones.

Se consideran siguientes pasos significativos los enlaces o acciones definidos editorialmente para:

* abrir una ruta de `/donde/`;
* iniciar una autoevaluación pertinente;
* abrir una guía de primera vez;
* copiar un guion para pedir ayuda;
* abrir un recurso externo verificado;
* iniciar otro recorrido que la página identifique expresamente como su siguiente paso principal.

No cuentan la navegación global, el pie de página ni los enlaces editoriales que sólo amplían contenido relacionado.

### Umbral inicial de revisión

El umbral provisional de la v1 es **10%**, observado durante al menos **28 días** y con un mínimo de **500 cargas elegibles** agregadas.

Si la tasa queda bajo ese umbral:

1. se pausa la expansión de nuevas páginas `/siento/`;
2. se revisan funcionamiento de enlaces, procedencia del tráfico, correspondencia con la intención de búsqueda, claridad y visibilidad de los siguientes pasos;
3. se reescriben o reestructuran las páginas afectadas;
4. se mide nuevamente durante una ventana comparable.

Si el indicador continúa bajo el umbral después de dos ciclos de revisión, la hipótesis de `/siento/` como ruta efectiva hacia un siguiente paso se considera **no validada**. Antes de seguir aumentando cobertura se requiere investigación cualitativa o un rediseño del recorrido.

El umbral puede revisarse cuando exista evidencia real de uso, pero el cambio debe documentarse con su justificación y aplicarse hacia adelante. No se modifica retroactivamente para hacer que los resultados parezcan exitosos.

La proporción del tráfico total que entra por `/siento/` determina la prioridad del problema, no si esas páginas cumplen su función.

## 37.2 Límites del proxy

Un click no demuestra comprensión, mejoría ni acceso efectivo a atención. Una persona también puede obtener valor sin hacer click.

Por eso el indicador anterior funciona como umbral de investigación y decisión de producto, no como prueba clínica ni como medida completa de impacto. Cuando sea posible, se complementa con pruebas cualitativas de comprensión y usabilidad que no requieran seguimiento invasivo.

Evitar:

* perfiles de usuario;
* identificación persistente;
* seguimiento cross-site;
* almacenamiento de respuestas;
* funnels basados en datos clínicos.

Debemos aceptar que probablemente nunca podremos afirmar:

> “X% de los usuarios terminaron asistiendo a terapia”.

Ese nivel de seguimiento contradice parte de la filosofía del proyecto.

---

# 38. SEO

SEO forma parte del producto porque muchas personas expresan su malestar inicialmente a través de buscadores.

Priorizar:

* lenguaje real;
* intención de búsqueda;
* contenido útil;
* títulos descriptivos;
* schema.org cuando corresponda;
* navegación contextual;
* performance;
* accesibilidad;
* fuentes claras.

No crear cientos de páginas automáticamente con contenido superficial.

Las páginas `/siento/` deben existir sólo cuando exista contenido útil y revisado.

---

# 39. Adquisición

orientame.cl no depende de publicidad.

Canales potenciales:

* SEO;
* difusión orgánica;
* universidades;
* municipalidades;
* organizaciones sociales;
* profesionales que quieran compartir el recurso;
* redes sociales;
* alianzas institucionales.

Google Ad Grants puede investigarse posteriormente si la entidad jurídica resulta elegible.

Se considera:

**nice to have.**

No forma parte de la viabilidad estructural del proyecto.

---

# 40. Orden de construcción

## Fase 1 — Base segura

```text
Base layout
/sobre
/metodologia
/legal/*
/urgencia
Acceso persistente a urgencia
estructura de contenido
```

## Fase 2 — Núcleo de orientación

```text
Home
/empezar
Orientador
primeros recorridos por barrera
```

## Fase 3 — Recursos piloto

```text
/donde/*
3 comunas piloto
recursos nacionales
clínicas universitarias iniciales
FichaRecurso
SelloRevision
```

## Fase 4 — Contenido de entrada

```text
10-15 páginas /siento/*
primeros /temas/*
```

## Fase 5 — Primera vez

```text
que-decir
que-pasa-en-sesion
cuanto-cuesta
como-elegir
```

## Fase 6 — Autoevaluaciones

```text
Test.tsx
primer instrumento implementado como borrador
segundo instrumento implementado como borrador
interpretación
integración con rutas
```

## Fase 7 — Descubrimiento

```text
Pagefind
buscador
/siento/ index
/temas/ index
SEO técnico
```

## Fase 8 — Cobertura

```text
más comunas
más síntomas
más temas
más recursos
/acompanar
/historias
```

## Fase 9 — Endurecimiento de v1

Sólo después de que producto y estructura estén estables:

```text
consolidación de fuentes y metadatos
clasificación del nivel de revisión requerido
verificación editorial por fuentes
revisión clínica por lotes sólo donde corresponda
correcciones editoriales o clínicas
revisión legal previa al lanzamiento
tests E2E
CI completo
auditoría automatizada
accesibilidad automatizada
auditoría de recursos
detección de contenido vencido
scripts de mantenimiento
validación de que cada pieza publicada cumple su nivel de revisión
```

## Fase 10 — Post-v1

Potenciales:

```text
comentarios comunitarios con D1
moderación
automatización avanzada de recursos
CMS si realmente se vuelve necesario
nuevas herramientas interactivas
nuevos instrumentos
```

---

# 41. Qué deliberadamente NO construimos en la v1

```text
IA generativa
Chat
Cuentas
Login
Perfiles
Backend
D1
Comentarios
Mensajería
Calendario
.ics
Recordatorios
Notificaciones
Marketplace
Directorio masivo de profesionales privados
Cobros
Ficha clínica
Diario
Seguimiento terapéutico
Herramientas para psicólogos
CMS
Sistema de recomendaciones comerciales
```

Cada una de estas funciones puede reconsiderarse posteriormente.

Ninguna se añade simplemente porque sea técnicamente posible.

---

# 42. Riesgos que debemos aceptar

## 42.1 No sabremos exactamente qué ocurre después

La privacidad limita la medición.

Es deliberado.

## 42.2 Mantener recursos exige trabajo humano

Aunque el sitio sea estático, los servicios cambian.

El mantenimiento de información es el principal costo operacional permanente.

## 42.3 El contenido necesita supervisión

orientame.cl puede ser técnicamente simple y editorialmente exigente.

Eso es correcto.

## 42.4 Crecer demasiado puede destruir la idea

La tentación futura será añadir:

* cuentas;
* IA;
* seguimiento;
* terapeutas;
* engagement;
* gamificación.

Cada nueva función debe responder:

> **¿Reduce realmente una barrera para comenzar a pedir ayuda?**

Si no, probablemente no pertenece a orientame.cl.

---

# 43. Principio final

Antes de agregar cualquier función, contenido o integración, preguntar:

> **¿Esto hace más fácil que alguien entienda sus opciones o dé un siguiente paso?**

Si la respuesta es no, se elimina.

orientame.cl no necesita resolver la salud mental.

Necesita resolver algo mucho más pequeño y concreto:

> **Que pedir ayuda, entender dónde encontrarla o simplemente comenzar a considerar esa posibilidad sea menos difícil de lo que es hoy.**
