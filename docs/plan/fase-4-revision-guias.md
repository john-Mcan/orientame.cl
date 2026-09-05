# Revisión editorial del orientador y las guías

Registro de decisiones de la revisión de lógica, lenguaje y contenido de los recorridos de ayuda,
hecha sobre la fase 4 ya implementada. Continúa la numeración de
[`fase-4-decisiones.md`](./fase-4-decisiones.md), que cierra en D37.

Aplica el procedimiento de [`plan-desarrollo-v1.md`](./plan-desarrollo-v1.md) §1.3. La fuente de
verdad sobre propósito y límites sigue siendo [`descripcion-inicial.md`](./descripcion-inicial.md).

**Qué motivó la revisión.** Los recorridos reconocían a medias lo que la persona había elegido y
pasaban de inmediato al servicio público. Tres ejemplos concretos que se revisaron:

- `/empezar/no-se-si-necesito-ayuda/varias-semanas-o-mas` abría sus acciones con la inscripción en
  APS y la cobertura de Fonasa. Son datos correctos y verificados, pero responden «¿cómo entro al
  sistema?», que es una pregunta que esa persona no hizo. Dijo que no sabía si necesitaba ayuda y
  que llevaba semanas.
- `/empezar/no-se-si-necesito-ayuda/no-sabria-decir` hacía lo mismo: primera acción, inscripción.
- `/empezar/me-cuesta-dar-el-paso/no-se-que-decir` pasaba por alto el hecho de no saber qué decir en
  un párrafo y media, y el primer párrafo hablaba de cómo se comporta quien atiende, no de lo que la
  persona dijo.

---

## D38 — El nodo terminal deja de ser un «resultado» y pasa a ser una guía con cadencia fija

**Qué se descubrió.** Los nueve nodos terminales tenían exactamente dos párrafos, y no por descuido
de redacción: `Resultado.cuerpo` era `readonly string[]`, párrafos planos sin subtítulos. El modelo
de datos obligaba a la brevedad simétrica. Comparado con `/siento/me-cuesta-salir-de-la-cama`, que
tiene tres secciones y explicaciones reales, el orientador —la ruta central del producto— era la
parte menos escrita del sitio.

Además el orden estaba invertido respecto de la necesidad: la lista «Lo que puedes hacer ahora»
mezclaba hechos administrativos con acciones, y los hechos solían quedar primero.

**Qué afecta.** §6 y §10 del documento base, `src/lib/orientador.ts` y los componentes que lo
pintan.

**Impacto.** El tipo `Resultado` pasa a `Guia`, con bloques nombrados y un orden que el componente
no permite intercambiar:

1. **título y reconocimiento** — nombra lo que la persona dijo, sin corregirlo ni consolar;
2. **atajo** — quien no quiere leer salta a las acciones (D42), y no se pierde el reconocimiento;
3. **secciones** — lectura con subtítulo propio, que es lo que puede ayudar a entenderse;
4. **cómo funciona esto en Chile** — los hechos verificados, con su fuente (D41);
5. **qué puedes hacer hoy** — acciones reales, de menor a mayor compromiso;
6. **salidas** — la persona vuelve a elegir hacia dónde seguir;
7. **si hoy no da** — el paso de menor compromiso, que incluye detenerse.

El nombre cambia porque el nodo dejó de ser el «resultado» de una evaluación —nunca lo fue— y es una
guía que reconoce, explica y ofrece. `todosLosResultados()` pasa a `todasLasGuias()`.

**Alternativa más simple considerada.** Reordenar las acciones y ampliar los dos párrafos dentro del
tipo existente. Se descartó porque el tipo es la causa: sin secciones con subtítulo, cualquier texto
más largo queda como un muro de párrafos y vuelve a acortarse en la siguiente edición.

**Decisión.** Modelo nuevo con `reconocimiento`, `secciones`, `datos`, `acciones`, `salidas` y
`menorCompromiso`. Pruebas que exigen reconocimiento no vacío, al menos dos secciones con subtítulo
y texto, al menos una acción y alguna continuación.

**Archivos.** `src/lib/orientador.ts`, `GuiaOrientador.astro` (reemplaza a
`ResultadoOrientador.astro`), `src/pages/empezar/[...ruta].astro`, `tests/orientador.test.ts`,
`tests/build-verification.test.ts`.

---

## D39 — Las siete barreras de §4 tienen puerta de entrada

**Qué se descubrió.** §4 del documento base declara siete barreras. El árbol cubría cuatro y media:

| Barrera                                   | Antes                        | Ahora                                       |
| ----------------------------------------- | ---------------------------- | ------------------------------------------- |
| §4.1 «No sé si esto amerita pedir ayuda»  | puerta propia                | igual                                       |
| §4.2 «Quiero resolverlo por mi cuenta»    | **no existía**               | `prefiero-por-mi-cuenta/entenderlo-primero` |
| §4.3 «No sé qué decir»                    | sub-opción                   | igual                                       |
| §4.4 «No sé dónde ir»                     | puerta propia                | igual                                       |
| §4.5 «No puedo pagarlo»                   | puerta propia                | igual                                       |
| §4.6 «Nunca he ido y no sé cómo funciona» | **no existía**               | `nunca-he-consultado`                       |
| §4.7 «Todavía no estoy preparado»         | **sólo como consuelo final** | `prefiero-por-mi-cuenta/todavia-no`         |

§4.6 aparece en el árbol de ejemplo de §6 del propio documento base («Nunca he ido y no sé qué
esperar») y se cayó en la implementación, aunque `/primera-vez` existe y no tenía puerta desde
`/empezar`.

**Impacto.** Esto explica parte del problema de tacto: quien entraba por «no sé si necesito ayuda»
cuando su barrera real era «no estoy listo» terminaba empujado al consultorio, porque era la única
salida que esa rama tenía. §4.2 pide expresamente que la autonomía «no se combata, se reconozca», y
§4.7 que no se trate como fracaso.

El árbol pasa de 12 a 16 nodos y el sitio de 61 a 65 páginas. **Ninguna URL existente cambió.**

**Alternativa más simple considerada.** Agrupar «dónde», «cuánto cuesta» y «nunca he ido» bajo una
sola puerta («quiero saber cómo funciona») para no alargar la primera pregunta. Se descartó: obliga
a un clic extra justo a quien llega con la necesidad más concreta, y el reconocimiento inmediato de
la propia situación en la etiqueta es parte de lo que hace que la persona siga.

**Decisión.** Siete puertas más el acceso a urgencia, en este orden: duda, desconocimiento, freno
emocional, autonomía, dónde, cuánto, otra persona. Una prueba falla si desaparece el nodo que cubre
una de las barreras.

---

## D40 — Un paso intermedio reconoce la barrera antes de volver a preguntar

**Qué se descubrió.** `/empezar/no-se-si-necesito-ayuda` sólo repreguntaba («¿hace cuánto te sientes
así?»). Sin una palabra sobre la duda que la persona acababa de declarar, el paso intermedio se lee
como un formulario de dos campos.

**Decisión.** `Paso` acepta `titulo` y `entrada`. Cuando existen, el `h1` nombra la situación
elegida, siguen los párrafos de reconocimiento y la pregunta baja a `h2`. Los tres pasos intermedios
lo declaran; `inicio` no, porque no viene de ninguna elección previa que reconocer. Hay una prueba
que lo exige.

---

## D41 — Los hechos verificados salen de la lista de acciones

**Qué se descubrió.** `Accion` tenía cuatro variantes y dos de ellas no eran acciones: `dato` (un
hecho sobre el sistema de salud) y `enlace` (navegación). Al vivir en la misma lista, el bloque «Lo
que puedes hacer ahora» solía abrir con un trámite, y las mismas rutas aparecían dos veces: como
`enlace` y como alternativa de menor compromiso.

**Decisión.** `Accion` queda en `guion` y `llamada`: cosas que se hacen sin salir de la página. Los
hechos pasan al tipo `Dato` y a un bloque propio, «Cómo funciona esto en Chile», con su fuente y su
fecha de consulta. La navegación pasa a `salidas`. Cada bloque tiene un solo trabajo.

`Seccion` acepta `fuenteIds`, así que una afirmación sobre el sistema dentro de la lectura también
cita su fuente al pie de la sección. Antes, cualquier afirmación en `cuerpo` quedaba sin fuente por
construcción: es lo que pasaba con «en Chile la red pública se organiza a partir de la Atención
Primaria», que ahora cita ChileAtiende.

**Archivos.** `AccionOrientador.astro`, `DatoOrientador.astro` y `FuentesLinea.astro` (nuevos), que
reemplazan la referencia de fuentes duplicada en tres lugares.

---

## D42 — El atajo a las acciones es un ancla real

**Qué se descubrió.** Quien llega sin energía para leer tenía que atravesar el texto para encontrar
el teléfono, y quien sí podía leer no tenía ninguna señal de que valiera la pena.

**Decisión.** Después del reconocimiento —no antes— hay un enlace «Si ahora no quieres leer, salta a
lo que puedes hacer hoy» a `#que-puedes-hacer`. Va después para que nadie se pierda el
reconocimiento, que es corto, y pueda saltarse la explicación, que es larga. Es un ancla nativa:
funciona sin JavaScript y `scroll-padding-top` la deja bajo la barra fija. Un test de build
comprueba que el ancla exista y que su destino exista en la misma página.

---

## D43 — Registro de títulos y voz

**Qué se descubrió.** Cuatro de los nueve títulos usaban la misma plantilla («No necesitas X para
Y», «No hace falta X») y varios eran epigramas: «Se puede pedir una hora con la vergüenza puesta»,
«Después de varias semanas, consultar deja de ser prematuro». Un título ingenioso suena escrito por
alguien que en ese momento no está sintiendo lo que describe. El léxico, además, era administrativo
donde debía ser humano: «amerita», «prematuro», «corresponde», «Lo concreto es que», «Vale la pena».

**Decisión, por instrucción del proyecto.**

- **Títulos: nombrar la situación** con las palabras de la persona, sin buscar el ingenio. «Cuando da
  vergüenza tener que explicar por qué», «Qué decir cuando no sabes qué decir», «Cuando ya lleva
  varias semanas». Es el registro que ya usan `/siento` y `/primera-vez`, así que el sitio suena a
  una sola voz. La frase «se puede pedir una hora con la vergüenza puesta» se conservó, pero dentro
  de un párrafo: funciona como línea y no como título.
- **Voz: cercana en todo el texto**, en español de Chile («pedir una hora», «no da para», «andar con
  la mecha corta», «de a poco», «harto»). Precisión y calidez no se reparten por bloque: los datos
  verificados conservan su redacción exacta y su fuente.

**Nada de cuantificadores de frecuencia sin fuente.** «Sentir vergüenza al consultar es frecuente» y
«no querer ser una carga es una de las razones más comunes» eran afirmaciones epidemiológicas sin
respaldo, que pasaban desapercibidas porque suenan a consuelo. Cuando queremos decir que algo es
entendible, se dice como juicio editorial; cuando queremos citar una frecuencia, se cita la fuente
en la sección que la contiene. Hay una prueba que lo bloquea.

---

## D44 — No se asume el género de quien lee, tampoco en los guiones copiables

**Qué se descubrió.** §2.3 y la sección de voz piden no asumir género, y no había ninguna guarda. El
recorrido decía «estar dispuesto», «no estar seguro de nada», «no seguir solo», y los guiones —que
se copian y se envían en primera persona— decían «Estoy inscrito aquí».

La barra («inscrito/a», que estaba en `/primera-vez/que-decir`) tampoco sirve: queda dentro del
mensaje que la persona manda.

**Decisión.** Se reescribe evitando la concordancia: «me atiendo en este consultorio», «tener la
disposición», «tener certeza», «no seguir por tu cuenta», «quisiera saber si tengo inscripción». Una
prueba busca una lista acotada de participios y adjetivos concordados en el texto del orientador,
sus datos y sus guiones. `listo`/`lista` queda fuera de la regla automática porque casi siempre
concuerda con un objeto («el mensaje listo») y daba más falsos positivos que hallazgos.

---

## D45 — La portada muestra las puertas sin detalle

**Qué se descubrió.** Con siete puertas más urgencia, la tarjeta del orientador en la portada
—columna derecha de la primera pantalla— dejaba de caber en un móvil si cada opción mostraba su
detalle.

**Decisión.** `PasoOrientador` acepta `compacto`, que omite el detalle. La portada lo usa y agrega un
enlace a `/empezar`, «Ver estas opciones explicadas», donde la pregunta es toda la página y el
detalle sí se muestra. No se recorta información: se muestra en el lugar donde cabe.

---

## D46 — Las tarjetas de opción viven en `global.css`

**Qué se descubrió.** Las salidas de una guía y las opciones de un paso son el mismo control: una
tarjeta enlazada con etiqueta, detalle y flecha. Con estilos de scope por componente iban a
divergir, que es el mismo problema que ya había obligado a mover los estilos del buscador.

**Decisión.** `.opciones-lista` y `.opcion` pasan a `global.css`. El modificador
`.opciones-lista--salidas` marca que esas opciones salen del recorrido hacia el sitio, con un fondo
distinto para que no se confundan con seguir respondiendo preguntas.

---

## D47 — Los títulos de página dejan de repetir el nombre del sitio

**Qué se descubrió.** `Base.astro` agrega « · orientame.cl» al título. Doce páginas y cuatro layouts
lo traían además en su propio `title`, así que la pestaña, el resultado de búsqueda y la tarjeta
social decían «… | orientame.cl · orientame.cl».

**Decisión.** El `title` que se pasa a `Base` no incluye el nombre del sitio. Un test de build falla
si un `<title>` generado lo repite.

**Archivos.** Las doce páginas, los cuatro layouts de artículo y `tests/build-verification.test.ts`.

---

## Lo que esta revisión no cambió

- **Ninguna URL existente.** Los nueve recorridos que ya existían conservan su ruta.
- **Ninguna afirmación verificada.** Los siete registros de `src/data/fuentes.ts` siguen respaldando
  exactamente lo mismo; sólo se reescribió su redacción para no asumir género, sin tocar población,
  cobertura ni alcance. No se agregó ninguna fuente nueva, porque no se agregó ninguna afirmación
  nueva sobre el sistema de salud que necesitara una.
- **Los límites clínicos.** Sigue sin haber preguntas que evalúen riesgo, sin bifurcación por
  respuesta y sin lógica que reaccione a señales de riesgo. `/urgencia` sigue siendo una opción que
  la persona elige; una prueba nueva impide además que aparezca entre las salidas de una guía, para
  que no se cuele como «un destino más» al agregar nodos.
