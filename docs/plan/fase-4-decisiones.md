# Decisiones de fase 4

Registro de decisiones tomadas al implementar la fase 4 de `plan-desarrollo-v1.md`. La fuente de
verdad sobre propósito y límites sigue siendo `descripcion-inicial.md`.

## D24 — Cerrar el directorio comunal con el registro DEIS, nivel A

- **Qué se descubrió:** el recurso de Datos.gob.cl “Establecimientos de Salud Vigentes” reproduce el
  registro oficial DEIS, fue actualizado el 10 de febrero de 2026 y declara licencia CC0. Incluye
  nombre, tipo, comuna, dirección y estado de funcionamiento, pero no documenta el procedimiento de
  acceso de cada establecimiento.
- **Qué afecta:** las tres comunas piloto de `/donde`, único pendiente de fase 3.
- **Impacto:** permite publicar establecimientos vigentes sin inventar teléfonos, horarios, costos ni
  pasos de acceso.
- **Alternativa más simple:** mantener sólo las fichas verificadas una por una; deja incompleto el
  nivel A comprometido y bloquea la fase 4.
- **Decisión:** importar CESFAM, CECOSF y COSAM vigentes de Santiago, Providencia y Puente Alto como
  fichas nivel A. Se muestran únicamente nombre y dirección del registro. La interfaz explica que la
  existencia del establecimiento no confirma cupos ni vía de ingreso.
- **Archivos:** `src/data/recursos.json`, `src/lib/resources.ts`, pruebas de recursos.

## D25 — Publicar OMS-5 y GAD-7 como instrumentos iniciales

- **Qué se descubrió:** OMS-5 cuenta con edición OMS 2024, traducción española y licencia
  CC BY-NC-SA 3.0 IGO. GAD-7 tiene publicación original, adaptación española abierta y declaración
  del titular de acceso gratuito sin restricción de copyright.
- **Qué afecta:** selección de los dos instrumentos, scoring, interpretación y límites visibles.
- **Impacto:** ambos pueden puntuarse de manera determinista en el navegador. Ninguno incluye una
  pregunta explícita sobre autolesión.
- **Alternativa más simple:** publicar un solo instrumento; no satisface el alcance acordado de fase 4. Se descartó PHQ-9 en esta etapa porque su ítem 9 exigiría una regla clínica de respuesta activa.
- **Decisión:** publicar OMS-5 y GAD-7 para personas adultas, conservar los límites poblacionales y no
  presentar sus resultados como diagnóstico. Toda respuesta y puntuación queda en memoria local.
- **Archivos:** colección `instrumentos`, `Test.tsx`, `scoring.ts`, rutas `/autoevaluacion`.

## D26 — El protocolo de crisis nace como borrador inactivo

- **Qué se descubrió:** manuales oficiales permiten proponer una respuesta inicial, pero las reglas
  del proyecto exigen revisión clínica para cualquier lógica que reaccione a riesgo.
- **Qué afecta:** instrumentos actuales y futuros, lenguaje de urgencia y pruebas críticas.
- **Impacto:** documentar el protocolo permite revisarlo sin simular una aprobación.
- **Alternativa más simple:** no escribirlo; impediría revisar una propuesta concreta y mantendría el
  bloqueo sin una ruta de resolución.
- **Decisión:** crear la versión `0.1-borrador`, marcarla no aprobada y añadir una guardia en código.
  OMS-5 y GAD-7 no activan respuestas de crisis.
- **Archivos:** `docs/plan/protocolo-crisis.md`, `src/lib/crisis.ts`, pruebas de crisis.

## D27 — Pagefind se ejecuta después del build estático

- **Qué se descubrió:** Pagefind genera un índice sobre `dist` y su API puede buscar desde el
  navegador. WebAssembly exige `wasm-unsafe-eval` en la CSP; se puede evitar el worker configurando la
  API en el hilo principal.
- **Qué afecta:** build, CSP, portada y `/buscar`.
- **Impacto:** existe búsqueda real sin backend, rastreadores ni interpretación generativa.
- **Alternativa más simple:** un enlace con apariencia de búsqueda; está prohibido porque sería una
  affordance falsa.
- **Decisión:** indexar sólo los artículos marcados con `data-pagefind-body`, usar la API con carga
  local y no inferir riesgo desde consultas. El formulario sólo aparece cuando JavaScript está listo.
- **Archivos:** `package.json`, `public/_headers`, `Buscador.tsx`, `/buscar`, layouts indexables.

## D28 — Acompañamiento inicial para personas adultas; testimonios pendientes

- **Qué se descubrió:** la guía OMS de primera ayuda psicológica y la guía MINSAL permiten redactar
  orientación práctica de bajo riesgo sobre escucha, ayuda no intrusiva y conexión con servicios.
  No existen testimonios con consentimiento documentado.
- **Qué afecta:** `/acompanar` y el bloque de historias/testimonios de la fase.
- **Impacto:** se puede ofrecer un recorrido útil sin diagnosticar a terceros ni inventar voces.
- **Alternativa más simple:** una sola página general; mezcla necesidades distintas y ofrece menos
  claridad en el siguiente paso.
- **Decisión:** publicar tres guías breves dirigidas a acompañar a personas adultas. Se excluyen
  contenidos para menores y reglas de riesgo. Los testimonios quedan explícitamente pendientes por
  autorización del responsable del proyecto.
- **Archivos:** colección `acompanamiento`, layout y rutas `/acompanar`, navegación.

## D29 — Pruebas concentradas en fallos de consecuencias relevantes

- **Decisión:** cubrir límites y entradas inválidas del scoring, guardia de activación clínica,
  privacidad de los islands, destinos nuevos e integración del índice de búsqueda. No se agrega una
  suite E2E ni una matriz de navegadores, que pertenecen a fase 5.

## D30 — Publicar el borrador del protocolo como documento de revisión

- **Qué se descubrió:** mantener el protocolo únicamente en `docs/plan` impide que profesionales
  externos lo revisen desde el despliegue estático.
- **Qué afecta:** acceso al documento y significado de la guardia clínica en código.
- **Impacto:** el borrador puede compartirse mediante una URL estable sin presentarlo como aprobado.
- **Alternativa más simple:** copiar el texto a una página separada; crearía dos versiones que pueden
  divergir.
- **Decisión:** generar `/metodologia/protocolo-crisis` directamente desde el Markdown original y
  enlazarlo desde `/metodologia`. La ruta siempre se construye en producción. La guardia
  `PROTOCOLO_CRISIS_APROBADO = false` sólo impide respuestas clínicas automáticas y no bloquea la
  publicación del documento.
- **Archivos:** `docs/plan/protocolo-crisis.md`, ruta pública, metodología y pruebas de build.

## D31 — El índice de búsqueda incluye `/primera-vez`

- **Qué se descubrió:** el plan pedía indexar `/siento`, `/temas` y `/autoevaluacion`. Con sólo esas
  colecciones, consultas frecuentes y concretas como “cuánto cuesta” o “qué digo para pedir hora”
  devolvían cero resultados, aunque la respuesta existe publicada en `/primera-vez`.
- **Qué afecta:** cobertura del índice de Pagefind; ninguna afirmación ni recorrido.
- **Impacto:** la búsqueda deja de comportarse como si el contenido no existiera. No se agregan
  páginas nuevas ni se cambia el orden de los resultados.
- **Alternativa más simple:** dejar el índice como estaba; obliga a la persona a navegar la
  jerarquía justo cuando llegó con una palabra concreta.
- **Decisión:** marcar las cuatro guías de `/primera-vez` con `data-pagefind-body` y el filtro
  `seccion:Primera vez`. `/donde`, `/urgencia` y `/empezar` quedan fuera: los dos primeros dependen
  de un island y de reglas de urgencia, y el tercero es un recorrido, no un documento.
- **Archivos:** las cuatro páginas de `src/pages/primera-vez`.

## D32 — `/temas/crisis-de-panico` cierra la vivencia sin cuadro asociado

- **Qué se descubrió:** `siento-angustia-en-el-pecho` y `tengo-miedo-a-perder-el-control` describen
  crisis de pánico con fuentes propias, pero sus `temasRelacionados` sólo llevaban a `ansiedad` y
  `estres-cronico`. El cuadro que la persona está buscando no tenía página.
- **Qué afecta:** colección `temas` y los enlaces recíprocos de esas dos vivencias.
- **Impacto:** las tres fuentes usadas se abrieron y leyeron el 3 de septiembre de 2026 (NIMH, OMS y
  MedlinePlus) y ya respaldaban citas vigentes en el repositorio con el mismo título y la misma URL.
- **Alternativa más simple:** ampliar `temas/ansiedad`; mezcla dos cuadros distintos y deja sin
  respuesta a quien busca exactamente “crisis de pánico”.
- **Decisión:** publicar `crisis-de-panico` como `verificado-con-fuentes`, distinguiendo crisis
  aislada de trastorno, conservando la indicación de urgencia de MedlinePlus ante dolor de pecho y
  sin afirmar qué le ocurre a quien lee.
- **Archivos:** `src/content/temas/crisis-de-panico.md` y las dos vivencias relacionadas.

## D33 — El encabezado pasa a mega-menú fijo con un modelo de navegación único

- **Qué se descubrió:** el encabezado listaba siete enlaces planos y se quedó sin `/autoevaluacion`
  ni `/temas` cuando la fase 4 los publicó, porque mantenía su propia lista. El pie y la portada
  mantenían otras dos. Con la cobertura de la v1 completa, una fila plana ya no ordena el sitio.
- **Qué afecta:** encabezado, pie, portada y cualquier sección nueva que se publique después.
- **Impacto:** `src/data/navegacion.ts` pasa a ser la única lista de secciones. Sólo declara rutas
  que existen como página estática, así que un enlace del menú no puede terminar en 404. El panel se
  abre por `:hover`/`:focus-within` y el nivel superior sigue siendo un enlace real, de modo que la
  navegación completa funciona sin JavaScript; en móvil el mismo modelo se recorre con `<details>`
  anidados.
- **Alternativa más simple:** agregar los dos enlaces que faltaban a la fila plana. Deja nueve
  entradas sin jerarquía, no cabe en el ancho máximo y repite el problema en la siguiente sección.
- **Decisión:** cinco grupos (Empezar, Dónde consultar, Primera vez, Acompañar, El proyecto), más
  acceso directo a búsqueda y a urgencia. El encabezado queda fijo y aplica el efecto de vidrio al
  bajar; el estado lo marca un `IntersectionObserver` sobre un centinela y sin JavaScript el
  encabezado sigue fijo, sólo que sin vidrio.
- **Archivos:** `src/data/navegacion.ts`, `src/lib/iconos.ts`, `Header.astro`, `Footer.astro`,
  `src/pages/index.astro`.

## D34 — `client:visible` no sirve para un island que no pinta nada en el servidor

- **Qué se descubrió:** los filtros de `/donde` nunca se hidrataron. `client:visible` observa los
  hijos que el servidor dejó dentro de `<astro-island>`, no la etiqueta —que es `display: contents`
  y no tiene caja—; `ResourceFinder` devuelve `null` hasta montar, para no mostrar controles que
  todavía no controlan nada, así que no había nada que observar.
- **Qué afecta:** `/donde` y cualquier island futuro que siga la misma regla de progressive
  enhancement.
- **Impacto:** el listado de fichas se renderiza en el servidor, así que la página nunca estuvo
  rota, pero la promesa de filtrar por comuna no se cumplía.
- **Alternativa más simple:** renderizar los controles en el servidor y activarlos al hidratar;
  serían controles que no controlan nada hasta que llegue el JavaScript, que es exactamente la
  affordance falsa que el proyecto prohíbe.
- **Decisión:** usar `client:idle` y dejar un test de build que falla si aparece un
  `<astro-island client="visible">` sin contenido servido.
- **Archivos:** `src/pages/donde/index.astro`, `tests/build-verification.test.ts`, `AGENTS.md`.

## D35 — Una bajada breve para móvil, declarada y no recortada

- **Qué se descubrió:** en una pantalla de 390 px, la bajada de una página índice ocupaba cinco
  líneas y empujaba el primer contenido fuera de la primera vista. Recortarla con CSS parte la
  frase, y usar una sola versión corta empobrece la lectura en escritorio.
- **Qué afecta:** las diez páginas índice, los cuatro layouts de artículo y el schema editorial.
- **Impacto:** `descripcionMovil` es opcional y limitada a 110 caracteres. No es contenido nuevo:
  es la misma afirmación con menos palabras, y no toca `descripcion`, que sigue siendo la meta
  description. La versión oculta lleva `data-pagefind-ignore` para no duplicar el índice.
- **Alternativa más simple:** reducir el cuerpo tipográfico en móvil. Ayuda, pero no resuelve una
  bajada de 165 caracteres; se aplicó además de esto.
- **Decisión:** declarar la versión breve donde acortar no pierde precisión. `/donde` y
  `/primera-vez` conservan la bajada completa en todos los anchos por decisión del proyecto.
- **Archivos:** `src/content.config.ts`, `EncabezadoSeccion.astro`, los cuatro layouts, las 24
  piezas de contenido y `src/styles/global.css`.

## D36 — Barra y portada como tarjetas de color sobre fondo blanco

- **Qué se descubrió:** la barra de lado a lado y la portada como banda a sangre no coinciden con
  la dirección visual de [`estilos.md`](./estilos.md) ni con
  [`public/moodboard/estilo-colores.png`](../../public/moodboard/estilo-colores.png), donde la página
  es blanca y las secciones son tarjetas de color del ancho del contenido, separadas del borde.
- **Qué afecta:** `Header.astro` y la portada; el resto del sitio ya estaba sobre fondo blanco.
- **Impacto:** la barra pasa a ser una tarjeta `page-shell` con esquina redondeada, separada del
  borde de la ventana arriba del todo y también mientras se baja. La portada y el bloque
  institucional de la portada se vuelven tarjetas de `mist-100` y `mist-50`. El acceso a urgencia y
  el recorrido del orientador no cambian.
- **Alternativa más simple:** dejar la banda y sólo cambiar los colores. No resuelve lo que el
  moodboard define, que es la separación entre página y sección.
- **Decisiones técnicas que no son cosméticas:**
  1. el `backdrop-filter` queda siempre declarado y al bajar sólo cambia la opacidad del fondo,
     porque una transición de `none` a un filtro no interpola y el vidrio aparecería de golpe;
  2. una franja del color de la página cubre el aire sobre la tarjeta cuando se ha bajado: sin ella
     el contenido que sube queda cortado por el borde de la ventana y se lee como un defecto;
  3. sin soporte de `backdrop-filter` la tarjeta se queda opaca, porque un fondo translúcido sin
     desenfoque dejaría leer el contenido a través de la barra.
- **Archivos:** `src/components/Header.astro`, `src/pages/index.astro`, `src/styles/global.css`.

## D37 — El destino de cada grupo del menú se escribe dentro del panel

- **Qué se descubrió:** en el mega-menú, la etiqueta del grupo («Empezar») es a la vez título del
  panel y enlace a la sección. Quien no lo sabe de antemano no tiene cómo deducirlo: el chevron
  sugiere «esto abre un menú», no «esto además lleva a alguna parte».
- **Qué afecta:** el encabezado en escritorio y el cajón móvil.
- **Impacto:** quedarse sin forma visible de llegar a una sección es el peor resultado de una
  navegación. Ahora cada sección declara `etiquetaDestino` y el panel abre con ese enlace, en un
  bloque con borde y flecha, antes del resto. El nivel superior además se subraya al apuntarlo.
- **Alternativa más simple:** repetir el `href` de la sección como primer elemento de la lista. Ya
  estaba así y no funcionaba: bajo «Empezar» el primer elemento se llamaba «Orientador de primer
  paso» y nada conectaba ese nombre con el grupo.
- **Decisión:** `href` deja de repetirse dentro de `enlaces`; el destino del nivel superior se
  nombra una sola vez, con `etiquetaDestino`, y se muestra destacado en el panel y en el cajón.
- **Archivos:** `src/data/navegacion.ts`, `src/components/Header.astro`, `src/pages/index.astro`.

## D48 — El HTML servido conserva el espacio entre un texto y un enlace

- **Qué se descubrió:** trece frases de cinco páginas se servían con la palabra pegada al texto del
  enlace («Puedes revisarlo que estás sintiendo», «ver directamentedónde consultar en Chile»,
  «Salud Responde600 360 7777»). El fuente estaba bien escrito: el valor por defecto de
  `compressHTML` en Astro 7 es `'jsx'`, que comprime en la plantilla y **descarta** el nodo de
  espacio entre elementos en línea en vez de colapsarlo. Cuando el único separador es el salto de
  línea que deja Prettier al repartir la etiqueta en varias líneas, no queda nada entre las dos
  palabras.
- **Qué afecta:** cualquier página con un enlace en medio de un párrafo, presentes y futuras.
- **Impacto:** el texto se lee como un defecto de edición justo donde el sitio ofrece la salida.
  Nada de esto es visible en `astro dev` ni en el fuente, sólo en el HTML construido.
- **Alternativa más simple:** corregir cada frase juntando el `<a>` con el texto anterior. Se
  descartó: el formateo automático vuelve a partir esas líneas, así que el problema reaparece en
  cada reformateo y en cada página nueva.
- **Decisión:** `compressHTML: true` en `astro.config.mjs`, que usa el compresor de HTML y sí
  conserva la separación. Cuesta 5 KB gzip en las 65 páginas (496 KB contra 491 KB). Una prueba de
  build falla si alguna página vuelve a servir una palabra pegada al texto de un enlace.
- **Verificación:** el diagnóstico sólo es reproducible con `node_modules/.astro` y
  `node_modules/.vite` borradas. Cambiar el valor y reconstruir sin limpiar la caché deja parte de
  las plantillas compiladas con el ajuste anterior y da mediciones falsas.
- **Archivos:** `astro.config.mjs`, `tests/build-verification.test.ts`.

## D49 — Tres frases del orientador que quedaban a medio decir

- **Qué se descubrió:** la salida a `/primera-vez` de `hace-unos-dias` se llamaba «Saber cómo
  funciona una consulta, por si más adelante», con el detalle «Sin pedir nada todavía». La etiqueta
  deja la frase sin terminar —más adelante ¿qué?— y el detalle no la cierra, porque responde otra
  pregunta. Era la única de las tres opciones de ese bloque que no se leía completa.
- **Qué afecta:** tres cadenas de `src/lib/orientador.ts`; ninguna ruta ni afirmación con fuente.
- **Decisión:**
  - «…por si la necesito más adelante», en primera persona como sus dos hermanas del bloque, con
    un detalle que dice a dónde lleva: «Cómo es la sesión, qué decir y cuánto cuesta. Leerlo ahora
    no implica pedir hora». Conserva lo que decía «sin pedir nada todavía», ya enunciado completo.
  - «No es que no quiera. Es que «no todavía»» — las comillas marcan la expresión citada, que es
    como la usa la guía de destino («No todavía» no es lo mismo que «no»). Sin ellas se leía como
    un error de orden.
  - «Si lo que cuesta es la frase y no la decisión», en vez de «Si el problema es esa parte y no la
    decisión»: «esa parte» obligaba a volver a la etiqueta para saber a qué apuntaba.
- **Archivos:** `src/lib/orientador.ts`.

## D50 — La autoevaluación empieza por el cuestionario, no por su ficha técnica

- **Qué se descubrió:** entre el título y la primera pregunta había 251 palabras y cinco
  encabezados: el aviso de alcance, «Qué mide», «Cómo se calcula», «Qué límite tiene» y una ficha
  con versión, población y licencia. La ficha —el dato más útil para quien audita la pieza y el
  menos útil para quien está mal— ocupaba el mejor lugar de la página, justo antes de la acción.
  Las preguntas, además, no estaban en el HTML: `Test.tsx` devolvía el aviso de «necesita
  JavaScript» hasta hidratar.
- **Qué afecta:** `/autoevaluacion` y las tres páginas de instrumento.
- **Impacto:** quedan 44 palabras y ningún encabezado antes de la primera pregunta. El cuestionario
  entero se sirve en el HTML estático, con el valor de cada opción a la vista: sin JavaScript se
  puede responder y sumar a mano, como en la versión en papel, y lo único que agrega el island es
  el total, el rango y el progreso.
- **Alternativa más simple:** plegar el texto en un `Desplegable`. Se descartó porque «Qué límite
  tiene» no puede quedar escondido, y porque el problema no era sólo el volumen sino el orden.
- **Decisión:** encabezado compacto con una línea de contexto —cuántas preguntas, que se calcula en
  el dispositivo, que no es un diagnóstico y un ancla a la explicación—, después el cuestionario, y
  debajo el cuerpo editorial, la procedencia y las fuentes. El aviso de no-diagnóstico se conserva
  arriba en una línea y se despliega junto al resultado, que es donde hace falta.
- **Archivos:** `src/layouts/Instrumento.astro`, `src/components/islands/Test.tsx`,
  `src/pages/autoevaluacion/index.astro`.

## D51 — Una presentación por ancho: lista completa en escritorio, paso a paso en móvil

- **Qué se descubrió:** el peor caso no era el GAD-7 sino el OMS-5. Bajo 40rem las opciones se
  apilan en una columna, y con seis opciones por ítem cada pregunta ocupaba casi una pantalla.
- **Qué afecta:** los tres instrumentos.
- **Impacto:** en escritorio se conserva la lista completa, que permite revisar y corregir antes de
  calcular y muestra el instrumento entero, que es parte de cómo se administra. En móvil se responde
  de a una pregunta, con puntos de avance y una pantalla final de revisión donde se puede cambiar
  cualquier respuesta antes de calcular.
- **Alternativa más simple:** un solo modo para ambos anchos. Escogerlo obligaba a perder algo en
  uno de los dos; la decisión de usar los dos es del proyecto.
- **Decisión:** el modo se resuelve con `matchMedia` después de montar. En el servidor no hay ancho
  que consultar, así que el HTML servido trae siempre la lista completa, que además es el mejor
  fallback sin JavaScript. En móvil se avanza al elegir una opción: es un cambio de contexto, así
  que se avisa antes de usar el control —la excepción que contempla WCAG 3.2.2— y el botón de volver
  atrás está siempre disponible. El foco sólo se mueve cuando la persona provocó el cambio de paso.
- **Archivos:** `src/components/islands/Test.tsx`, `src/layouts/Instrumento.astro`.

## D52 — PHQ-8 como tercer instrumento, y el ítem de riesgo bloqueado por prueba

- **Qué se descubrió:** había una medida de bienestar y una de ansiedad, y ninguna de depresión. El
  PHQ-9 sigue descartado por D25: su noveno ítem pregunta por ideación suicida. El manual oficial de
  la familia PHQ define el PHQ-8 como «all items of PHQ-9 except the 9th item on self-harm», indica
  que se puntúa igual que el PHQ-9 con total de 0 a 24 y puntos de corte idénticos, y declara que
  estas escalas están en dominio público, sin permiso necesario para reproducir, traducir, mostrar
  ni distribuir.
- **Qué afecta:** la colección `instrumentos`, `scoring.ts` y `/autoevaluacion`.
- **Impacto:** el hueco más grande queda cubierto sin introducir una pregunta de riesgo. La
  autorización expresa a traducir es además lo que permite declarar la redacción propia de D53.
- **Alternativa más simple:** no agregar ninguno, o agregar también AUDIT. Lo segundo se descartó
  por ahora: su interpretación es más prescriptiva y el sitio no debería convertirse en una batería
  de tests cuando su puerta principal son las barreras, no la medición.
- **Decisión:** publicar el PHQ-8 para personas adultas, con los cinco rangos del manual. La regla
  de que ningún instrumento formule preguntas de riesgo pasa de ser documentación a ser prueba:
  `tests/instrumentos.test.ts` la verifica sobre el contenido publicado, junto con que los rangos
  cubran sin huecos todo el puntaje alcanzable —si no calzan, quien responde ve «No pudimos
  interpretar el puntaje» después de contestar el cuestionario completo.
- **Archivos:** `src/content/instrumentos/phq-8.md`, `src/lib/scoring.ts`, `src/content.config.ts`,
  `tests/instrumentos.test.ts`, `tests/scoring.test.ts`, `tests/build-verification.test.ts`.

## D53 — Cada instrumento declara de dónde viene la redacción de sus ítems

- **Qué se descubrió:** al verificar los ítems contra las fuentes, el OMS-5 calzó literalmente con
  la traducción española publicada por la OMS. El GAD-7 no: el artículo de adaptación cultural que
  se citaba como respaldo de la versión en español **no reproduce el texto de los ítems**. La
  redacción publicada era propia —segunda persona, sin marcas de género, por D44— pero se presentaba
  como si viniera de esa adaptación.
- **Qué afecta:** los tres instrumentos.
- **Impacto:** se cierra una cita que no respaldaba lo que decía respaldar, sin agregar texto sobre
  el cuestionario.
- **Alternativa más simple:** adoptar una traducción oficial. Queda como opción abierta; hoy la
  licencia autoriza expresamente traducir, así que declarar la redacción propia es correcto y no
  requiere esperar.
- **Decisión, por instrucción del proyecto:** campo `adaptacion` en el schema, mostrado **al final**,
  en la ficha de procedencia, y no antes del cuestionario. El OMS-5 declara que reproduce la
  traducción de la OMS y corrige una errata del original («descandado» por «descansado»). El GAD-7 y
  el PHQ-8 declaran redacción propia autorizada por la licencia. Una prueba exige que todo
  instrumento publicado declare este campo.
- **Archivos:** `src/content.config.ts`, `src/layouts/Instrumento.astro`, los tres instrumentos,
  `tests/instrumentos.test.ts`.

## D54 — El resultado deja de ser una etiqueta y pasa a ser el punto útil del instrumento

- **Qué se descubrió, por instrucción del proyecto:** responder un cuestionario no entregaba
  nada. Quien terminaba las ocho preguntas recibía «Rango moderado de síntomas», un puntaje y dos
  enlaces genéricos iguales para todos los rangos. Ese resultado no explica nada ni empuja a
  ninguna parte, y era la razón real por la que la herramienta no servía.
- **Qué afecta:** los tres instrumentos y el bloque de resultado.
- **Impacto:** cada rango declara ahora tres cosas propias: `queSignifica` en lenguaje corriente,
  `comoContarlo` —la frase lista para ocupar al pedir hora o al contárselo a alguien— y `pasos`,
  entre dos y tres destinos del sitio elegidos según el rango. Un puntaje bajo en el PHQ-8 propone
  el GAD-7 y `/siento`, porque el cuestionario no midió lo que la persona podría estar sintiendo;
  uno alto propone `/donde` y `/primera-vez/que-decir`. La aclaración de que no es un diagnóstico
  se mantiene, pero va **después** de la explicación: puesta antes desactivaba el resultado antes
  de que alcanzara a leerse.
- **Sobre las reglas del proyecto:** el responsable aclaró que las prohibiciones del documento base
  son guardas propias, redactadas de forma hiperbólica para agentes descuidados, no restricciones
  legales, y autorizó desviarse cuando el resultado deja de ser útil. Lo que se agregó, con todo,
  está respaldado: los cortes y su lectura salen del manual oficial de la familia PHQ y del umbral
  de la OMS, ya citados. No se agregó ninguna afirmación clínica sin fuente.
- **Lo que no se hizo:** derivar a `/urgencia` según el puntaje. Ni el PHQ-8 ni el GAD-7 preguntan
  por riesgo, así que un puntaje alto no es información sobre peligro inmediato; mandar a urgencia
  desde ahí sería una inferencia falsa y alarmante. El acceso a urgencia sigue visible en todas las
  páginas, como opción que la persona elige.
- **Archivos:** `src/content.config.ts`, los tres instrumentos, `src/components/islands/Test.tsx`,
  `src/layouts/Instrumento.astro`, `tests/instrumentos.test.ts`.

## D55 — Se revierte el modo paso a paso; la corrección era de densidad, no de estructura

- **Qué se descubrió:** el stepper de D51, visto a 390 px, partía el cuestionario en un trámite de
  ocho pantallas, escondía cuánto faltaba y hacía difícil volver a lo ya respondido. Los problemas
  reales del ancho angosto eran otros y se veían en la misma pantalla: la línea de contexto se
  partía en cuatro renglones con el separador colgando al principio de cada uno; el borde de la
  tarjeta cruzaba el enunciado por la mitad, porque un `legend` se dibuja sobre el borde superior
  del `fieldset`; y los botones medían 82 px de alto porque `font: inherit` les traía el
  interlineado del cuerpo, 1,75, y el texto envolvía.
- **Qué afecta:** los tres instrumentos en todos los anchos.
- **Decisión, por instrucción del proyecto:** una sola presentación. La línea de contexto pasa a
  texto corrido; el marco de cada pregunta se mueve del `fieldset` al `li` que lo contiene,
  conservando el `fieldset` porque es lo que agrupa los radios para el lector de pantalla; los
  botones llevan interlineado propio y quedan en 44 px, el mismo alto que las filas de opción y el
  mínimo de área táctil. También se descartó una barra de acciones fija al borde inferior: a 390 px
  los dos botones no caben lado a lado dentro de ella, se apilaban y el bloque tapaba la primera
  pregunta.
- **Verificación:** medido y capturado con Chrome a 390 × 844. Sin scroll horizontal, primera
  pregunta visible en la primera pantalla, botones de 44 px.
- **Archivos:** `src/components/islands/Test.tsx`, `src/layouts/Instrumento.astro`,
  `src/pages/autoevaluacion/index.astro`.

## D56 — El buscador funcionaba y el índice cubría la mitad del sitio

- **Qué se descubrió:** al revisar `/donde` se comprobó el buscador de la portada. El island
  hidrata, Pagefind responde y no hay errores: lo que fallaba era el índice. Sólo 30 de 66 páginas
  declaraban `data-pagefind-body`, y fuera quedaban `/urgencia`, las quince rutas del orientador,
  `/donde` con sus cuatro comunas y todas las portadas de sección. Como Pagefind igual devolvía
  resultados plausibles del contenido editorial, el fallo era invisible: «urgencia» entregaba un
  artículo de `/siento`; «puente alto» entregaba el PHQ-8, porque «alto» aparece en «rango alto»;
  «cesfam» entregaba doce resultados y ninguno era un CESFAM.
- **Qué afecta:** el buscador de la portada y `/buscar`, es decir, el sitio entero.
- **Impacto:** ahora son 52 de 66. «cesfam» devuelve las tres comunas primero, «puente alto»
  devuelve exactamente la página de Puente Alto, «me da vergüenza» devuelve su guía del orientador
  y «dónde consultar» devuelve `/donde`.
- **Decisión:** se indexa todo destino al que el sitio manda a alguien. Quedan fuera a propósito
  `/404`, `/buscar` —el buscador encontrándose a sí mismo— y la portada, que pinta el mismo paso
  inicial que `/empezar` y duplicaría cada resultado; por eso el indexado de `PasoOrientador` es
  opt-in. `/urgencia` lleva además `data-pagefind-weight`: es una página corta y quedaba bajo un
  artículo largo que menciona «urgencia» de pasada. El peso es relevancia de documento, no una
  regla de riesgo: no hay palabras clave ni inferencia, que siguen prohibidas en el buscador.
- **Archivos:** `PasoOrientador.astro`, `GuiaOrientador.astro`, `urgencia.astro`, `/donde` y sus
  comunas, las portadas de sección, `tests/build-verification.test.ts`.

## D57 — `/donde`: el buscador arriba y la ficha como ítem de lista

- **Qué se descubrió:** el campo de búsqueda estaba a 1.541 px en un viewport de 844 —1,8 pantallas
  bajo el pliegue—, después del desplegable de sellos y de 665 px de tarjetas de comuna. Los cuatro
  filtros, dentro de un `fieldset` con borde y leyenda, medían 408 px más. Y cada ficha medía
  ~1.100 px porque no era un ítem de lista sino una vista de detalle completa: 31 registros hacían
  una página de 23.000 px.
- **Qué afecta:** `/donde`, las páginas por comuna y `/donde/clinicas-universitarias`, que comparten
  `FichaRecurso`.
- **Impacto medido a 390 px:** el campo pasa de y=1.541 a y=594 —visible en la primera pantalla—,
  los filtros de 408 px a 159 px en dos columnas, la ficha de ~1.100 px a 260 px y la página de
  23.000 px a 11.500 px.
- **Decisión:** encabezado, buscador, resultados y al final la guía comuna por comuna, que es
  lectura sobre cómo funciona el acceso y no la vía rápida a un centro. La explicación de los
  sellos baja junto a las fichas, que es donde los sellos aparecen. La ficha muestra sin abrir nada
  lo que sirve para decidir y para llegar —tipo, comuna, costo, nombre, dirección y teléfono— y
  pliega en un `<details>` los requisitos, los horarios, los pasos y la fuente.
- **Lo que esto no resuelve:** plegar con `<details>` arregla el alto, no el peso. El HTML sigue
  trayendo las 31 fichas completas, y a escala nacional —2.500 establecimientos— serían ~10 MB. La
  solución de fondo es que el índice busque comunas y las fichas vivan en la página de cada comuna;
  el paso 1 de esa ruta es que las comunas ya están indexadas (D56). Queda pendiente para cuando
  la prueba de concepto se acepte.
- **Archivos:** `src/pages/donde/index.astro`, `src/components/FichaRecurso.astro`,
  `src/components/islands/ResourceFinder.tsx`.
