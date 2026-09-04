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
