# Fase 2 — Registro de decisiones

Este documento aplica el procedimiento de [`plan-desarrollo-v1.md`](./plan-desarrollo-v1.md) §1.3 a
los cambios relevantes tomados al construir la etapa 2 (portada, `/empezar` y orientador).

Cada decisión indica qué se descubrió, qué parte del documento base afecta, su impacto, la
alternativa más simple considerada, la decisión y los archivos del plan que quedan por actualizar.

---

## D1. El orientador se construye como rutas estáticas, no como island de Preact

**Qué se descubrió.** El recorrido es un árbol de decisión sin estado propio: cada opción sólo
determina qué contenido mostrar a continuación. Implementado como island, la ruta central del
producto quedaba dependiendo de que la hidratación se completara, el botón "atrás" del navegador
sacaba a la persona del sitio en vez de retroceder un paso, ningún estado era compartible por URL y
el contenido de los resultados no era indexable.

**Qué afecta.** [`descripcion-inicial.md`](./descripcion-inicial.md) §6, §23 y §25, y
[`plan-desarrollo-v1.md`](./plan-desarrollo-v1.md), etapa 2, que nombraban `Orientador.tsx` como
island client-side. El propósito del producto no cambia; cambia la técnica de implementación.
Ambos documentos quedaron alineados con esta decisión.

**Impacto.**

- _Accesibilidad:_ mejora. El recorrido funciona sin JavaScript, sin hidratación y sin robo de foco.
  Cada paso es una navegación normal, con foco al inicio del documento y `aria-current` en las migas.
- _Privacidad:_ mejora. No hay estado en cliente ni posibilidad de que una respuesta quede en memoria
  del navegador; tampoco hay solicitudes de red al elegir una opción, porque no hay JavaScript que
  las pueda emitir.
- _Rendimiento:_ mejora. Se eliminaron `@astrojs/preact` y `preact`, y la etapa 2 no agrega ninguna
  dependencia de runtime. El orientador entrega 0 KB de JavaScript.
- _SEO:_ mejora. Los nueve resultados son páginas con URL propia, título y descripción.
- _Mantenimiento:_ neutro. El árbol sigue viviendo en un único archivo, `src/lib/orientador.ts`, y
  las rutas se derivan de él con `getStaticPaths()`.
- _Contrapartida aceptada:_ cada decisión implica una carga de página. Con salida estática, sin
  prefetch y páginas de pocos KB, el costo es menor que el de la hidratación que reemplaza.

**Alternativa más simple considerada.** Mantener el island corrigiendo sólo sus errores de
accesibilidad. Se descartó porque conserva la dependencia de JavaScript en el recorrido principal sin
que la interactividad aporte nada que un enlace no resuelva, en contra de §23 del documento base
("usar JavaScript sólo cuando la interacción aporta valor").

**Decisión.** Rutas estáticas `/empezar` y `/empezar/[...ruta]`. Se elimina `Orientador.tsx`.

**Alcance de la decisión.** Aplica al orientador, no a los islands en general. La regla de §23 sigue
siendo evaluar componente por componente, cuando llega su etapa, si la interacción aporta valor. El
criterio que la resuelve: un recorrido que sólo cambia de contenido según lo que la persona elige lo
hace igual de bien un enlace; un island se justifica cuando hay estado real que debe responder sin
recargar la página.

`@astrojs/preact` se reinstalará en la etapa 4 si `Test.tsx`, `ResourceFinder.tsx` o `Buscador.tsx`
lo justifican. Ahí el estado en cliente sí es real: puntuar un instrumento a medida que se responde,
filtrar recursos mientras se escribe y mostrar resultados de búsqueda. Esa evaluación se hace en su
momento, no ahora.

---

## D2. La portada no muestra un buscador mientras no exista búsqueda

**Qué se descubrió.** La portada presentaba un control con forma de campo de texto —lupa, borde de
input y placeholder "Buscar algo que estoy sintiendo…"— que en realidad era un enlace. Escribir en él
no hacía nada, un lector de pantalla lo anunciaba como enlace y las seis etiquetas de ejemplo
("No puedo dormir", "Me siento triste sin razón"…) llevaban todas al mismo destino genérico.

**Qué afecta.** §5 del documento base y §7 de [`estilos.md`](./estilos.md) incluyen un buscador en el
boceto de portada. Pagefind y `Buscador.tsx` corresponden a la etapa 4, y las páginas `/siento/` a la
etapa 3: hoy no existe contenido que buscar.

**Impacto.** Un control que promete algo que no cumple es un costo de confianza desproporcionado en
un sitio cuyo único activo es la confianza, y afecta especialmente a quien llega en un momento de
confusión. Retirarlo no reduce funcionalidad, porque no había ninguna detrás.

**Alternativa más simple considerada.** Conservar el lugar visual con un botón honestamente
etiquetado. Se descartó por ahora: ocuparía la posición más visible de la portada con un enlace
redundante respecto de las puertas de entrada por barrera.

**Decisión.** La portada lidera con el mensaje principal y las seis puertas de entrada reales,
visibles en la primera pantalla. El buscador se incorporará en la etapa 4, como campo de texto real
con resultados. Un test de build impide reintroducir un `type="search"` o un placeholder de búsqueda
mientras no exista buscador.

---

## D3. Ningún resultado enlaza a una ruta que no existe

**Qué se descubrió.** Los nueve resultados del orientador contenían veinte enlaces a `/siento`,
`/donde`, `/primera-vez`, `/primera-vez/cuanto-cuesta` y `/acompanar`, todos marcados "Próximamente"
y todos terminando en 404. La verificación de la etapa 2 exige exactamente lo contrario: "todos los
resultados conducen a una ruta existente o a un borrador explícitamente excluido de producción".

**Impacto.** Una persona que recorría dos decisiones no obtenía nada utilizable. Para alguien que
llega con dificultad para pedir ayuda, encontrar un 404 al final del recorrido es peor que no haber
entrado.

**Decisión.** Cada resultado entrega valor en la propia página: guiones copiables, la vía de acceso
concreta y verificada, y el teléfono oficial de orientación. Sólo se enlaza a rutas que el sitio
genera hoy. Tres pruebas automatizadas verifican que ningún destino —opción, alternativa de menor
compromiso o miga de pan— apunte fuera del conjunto de rutas existentes, y una prueba de build
comprueba que cada enlace aparezca efectivamente en el HTML generado.

Cuando existan `/siento/`, `/donde/` y `/primera-vez/`, se agregan a la lista de rutas válidas del
test y los resultados pueden enlazarlas. Qué debería enlazar cada resultado está en la tabla de
puntos de enriquecimiento de D9.

---

## D4. El orientador no formula preguntas que evalúen riesgo

**Qué se descubrió.** El recorrido preguntaba "¿Esa persona podría estar en peligro ahora?" y
bifurcaba según la respuesta. Eso es una regla que reacciona a una señal de riesgo, y §31 del
documento base la clasifica como contenido que requiere revisión clínica. §2.6 añade que la respuesta
a crisis no se define mediante reglas improvisadas por ingeniería. No existe `protocolo-crisis.md`.

**Decisión.** El sistema no pregunta ni concluye nada sobre riesgo. El acceso a `/urgencia` aparece
siempre como una opción que la persona elige por sí misma —"Necesito ayuda ahora. Hay peligro en este
momento, para mí o para otra persona"— y como aviso destacado en el resultado sobre acompañar a otra
persona. Es navegación declarada por la persona, no una evaluación del sistema.

Una prueba automatizada falla si alguna pregunta del árbol menciona peligro, riesgo, suicidio o daño,
para que la regla no se pierda al agregar pasos más adelante.

**Pendiente.** Cualquier lógica que sí reaccione a respuestas de riesgo —previsiblemente en la etapa
4, con las autoevaluaciones— sigue bloqueada hasta que exista `protocolo-crisis.md` aprobado.

---

## D5. Las afirmaciones sobre el sistema de salud se registran con fuente trazable

**Qué se descubrió.** Los resultados afirmaban, sin ninguna fuente, que "los CESFAM y COSAM ofrecen
atención de salud mental sin costo para beneficiarios de Fonasa (tramos A y B)" y que los
profesionales "no van a juzgarte". Al vivir en un archivo `.ts`, ese contenido esquivaba por completo
el sistema editorial construido en la etapa 1 (`content.config.ts` y `src/lib/editorial.ts`).

Al verificar la afirmación contra la fuente oficial resultó ser **incorrecta en perjuicio del
usuario**: según ChileAtiende, la consulta o control con psicólogo clínico en el nivel primario tiene
100% de cobertura para **todos** los tramos de Fonasa, no sólo A y B. La versión anterior habría
disuadido innecesariamente a personas de los tramos C y D.

**Decisión.** Se crea `src/data/fuentes.ts` como registro de fuentes verificables, con organización,
URL y fecha de consulta. Cada afirmación sobre el sistema de salud declara `fuenteIds` y muestra la
referencia junto al dato, enlazada y con su fecha. Es el equivalente de `afirmacionesTrazables` del
schema de contenido, aplicado a los datos que no viven en una content collection.

Tres pruebas lo sostienen: toda afirmación cita al menos una fuente existente, toda fuente tiene URL
`https` y fecha ISO, y no quedan fuentes declaradas sin uso. Otras pruebas bloquean lenguaje
diagnóstico, persuasión por miedo y promesas sobre el comportamiento de terceros.

Fuentes incorporadas en esta etapa, todas consultadas el 1 de septiembre de 2026:

| Fuente                                                         | Qué respalda                                                                                                      |
| -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| ChileAtiende — _Accede a atención de salud a través de Fonasa_ | Inscripción en APS como puerta de entrada; cobertura 100% de psicólogo clínico en nivel primario                  |
| ChileAtiende — _Salud Responde_                                | 600 360 7777, Ministerio de Salud, 24 h todo el año, costo de llamada local, orientación sobre lugares y horarios |
| ChileAtiende — _Plan AUGE-GES_                                 | Cobertura de 90 problemas de salud incluida salud mental; garantías y activación por confirmación diagnóstica     |

Salud Responde se presenta como orientación sobre acceso y consultas de salud, que es lo que su
ficha oficial describe. No se le atribuye apoyo psicológico, porque la fuente no lo respalda.

---

## D6. Componentes previstos que no se construyeron

**`BloqueSiguientePaso.astro`.** Su función la cumple `ResultadoOrientador.astro` junto con la
utilidad compartida `.linea-orientacion` de `global.css`. Construir además una versión genérica sin
conocer a su consumidor real —las páginas `/siento/` de la etapa 3— habría fijado una API a ciegas.
Se introducirá en la etapa 3, cuando exista el segundo caso de uso.

**`EmptyState.astro`.** No quedó ningún estado vacío que cubrir: con rutas estáticas el orientador no
tiene estados de error, y `404.astro` ya explica la situación en lenguaje claro. El requisito de
"errores explicados en texto" se cumple en `GuionCopiable.astro`, que anuncia por `role="status"`
cuando el portapapeles falla y deja el texto seleccionado.

---

## D7. Preparación de medición sin activar seguimiento

La etapa 2 pide marcar semánticamente los siguientes pasos significativos sin habilitar todavía
seguimiento. No se instaló ningún script de analítica ni se emite ningún evento.

**Marcado.** Los siguientes pasos significativos llevan el atributo `data-siguiente-paso`, cuyo
valor describe únicamente el _tipo_ de acción. Nunca contiene el texto de un guion, el resultado
alcanzado, el slug del recorrido ni ningún identificador:

| Valor       | Acción                                                         |
| ----------- | -------------------------------------------------------------- |
| `llamada`   | abrir un enlace `tel:` de un servicio oficial verificado       |
| `guion`     | copiar un guion para pedir ayuda                               |
| `recorrido` | seguir la alternativa de menor compromiso hacia otro recorrido |

No se marcan la navegación global, el pie de página, las migas de pan ni el acceso a `/urgencia`. El
acceso a urgencia queda deliberadamente fuera: es una salida de seguridad, no un indicador de
desempeño, y no debe convertirse en una métrica que alguien intente optimizar.

**Consecuencia favorable de D1.** Como cada paso y cada resultado tienen URL propia, medir el avance
del orientador —qué proporción de las cargas de `/empezar` llega a un resultado— no requiere ningún
evento personalizado: se deduce de las vistas de página agregadas que ya contempla §27.4 del
documento base. La única medición que necesitaría eventos es la de acciones que no cambian de
página, es decir copiar un guion.

**Regla pendiente para cuando se habilite.** Se cuenta como máximo una acción elegible por carga de
página, sin identificación persistente y sin vincular acciones entre sesiones, conforme a §37.1.

---

## D8. Correcciones de accesibilidad e interfaz heredadas

Cambios menores, sin impacto en el alcance del producto:

- `EditorialStatus.astro` renderizaba un `<p>`, lo que producía párrafos anidados —HTML inválido que
  rompía el layout— en `/metodologia` y en los resultados. Ahora es un `<span>`, que es lo correcto
  para un sello en línea. Una prueba de build recorre todas las páginas y falla si algún `<p>` queda
  anidado dentro de otro.
- `GuionCopiable.astro` tenía un `aria-label` fijo que impedía que un lector de pantalla supiera que
  el mensaje se había copiado. Ahora el nombre accesible cambia y existe una región `role="status"`.
  El botón parte oculto y sólo aparece si el script se ejecuta, para no ofrecer un control inoperante
  sin JavaScript; el texto siempre queda visible y seleccionable.
- El anillo de foco pasa a tener separación visible, como pide §12 de `estilos.md`.
- El logo del encabezado alcanza el área táctil mínima de 44 px y los enlaces de migas de pan superan
  con holgura el mínimo de WCAG 2.2 AA.
- `Notice.astro` pierde la barra de acento a la izquierda, por decisión de dirección visual.
- Los separadores de migas de pan y los indicadores de las opciones usan iconos SVG propios
  (`Icon.astro`), no glifos de texto ni emojis.
- La portada afirmaba que "nada se guarda ni se envía a terceros". §2.5 prohíbe expresamente ese
  lenguaje absoluto: la promesa correcta es que las respuestas no se almacenan en los servidores de
  orientame.cl. Una prueba de build impide que la formulación incorrecta vuelva a aparecer.

---

## D9. Enriquecimiento posterior de los resultados: dos niveles de recursos

**Qué se descubrió.** Los resultados de la etapa 2 son correctos y verificables, pero superficiales
como herramienta. Decirle a alguien "inscríbete en el centro de Atención Primaria más cercano a tu
domicilio" sin poder decirle **cuál es** lo deja aproximadamente donde estaba. Ese salto —de
comprender a poder actuar— es la diferencia entre el nivel 1 y los niveles 3 y 4 de la definición de
éxito del documento base (§3).

La etapa 2 no dejó registro de qué debería ganar cada resultado más adelante. D3 sólo anotaba el
mecanismo genérico ("cuando existan las rutas, los resultados pueden enlazarlas"), que es
precisamente el tipo de nota que se pierde entre fases.

**Qué afecta.** §13 y §14 del documento base y la etapa 3 de
[`plan-desarrollo-v1.md`](./plan-desarrollo-v1.md).

### Los datos base existen; lo que falta es verificación humana

DEIS (Ministerio de Salud) mantiene el listado oficial de establecimientos de salud, con tipo,
comuna, dependencia y dirección, obtenible a granel. No hay que transcribir ni scrapear nada. Antes
de redistribuirlo hay que confirmar su licencia y forma de atribución; no se asume.

Lo que ese registro **no** contiene es justamente lo que reduce la barrera:

- a qué consultorio le corresponde ir a una persona según su dirección (la asignación de APS es por
  sector dentro de cada comuna y la define cada municipio; no existe como dataset nacional);
- si ese centro tiene horas de psicología o un programa de salud mental activo;
- qué tiene que hacer concretamente para conseguir una hora ahí;
- si el teléfono publicado funciona.

El último punto es el criterio que §13.2 fija como el dato que importa. Obtenerlo es investigación
humana por comuna, no una importación de datos.

### Decisión: dos niveles con requisitos distintos

|                                       | Cobertura                              | Verificación                                                       | Costo de mantención                              | Estado                                                                                                          |
| ------------------------------------- | -------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Nivel A** — qué existe en tu comuna | Nacional, desde el registro DEIS       | Reproduce el registro oficial con su fecha de consulta             | Bajo: reimportar el dataset                      | **Integrable en las páginas de `/empezar`**, pendiente de que exista la información en la etapa que corresponda |
| **Nivel B** — cómo consigues hora ahí | Comunas donde se haya hecho el trabajo | Verificada a mano, con `pasosAcceso`, requisitos, canales y fuente | Alto: por establecimiento, con `proximaRevision` | **Diferido a una v2**, condicionado a que exista financiamiento para revisión humana real                       |

El schema de recursos de §14 ya permite que ambos convivan sin confundirse: `estado: 'verificado' |
'requiere-revision' | 'no-disponible'` distingue una ficha reproducida del registro oficial de una
ficha efectivamente verificada. Una entrada de Nivel A nunca debe presentarse como Nivel B.

El Nivel A hace útil el buscador en todo Chile desde el primer día. Sin esa distinción, la
alternativa sería publicar un directorio nacional de sólo nombres y direcciones —lo que §13.2
rechaza— o dejar sin nada a la mayor parte del país.

El filtrado por comuna, tipo, costo y modalidad es un caso legítimo de island: hay estado real que
debe responder sin recargar la página. Esa evaluación se confirma en su etapa, según §23.

### Puntos de enriquecimiento por resultado

Qué debería ganar cada resultado de `/empezar` cuando exista el contenido. No se implementa nada
todavía; esta tabla existe para que la etapa correspondiente no tenga que redescubrirla.

| Resultado                     | Enriquecimiento previsto                                                                                                                                               | Depende de                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| `no-se-donde-buscar`          | Selector de comuna y listado de establecimientos de atención primaria (Nivel A). Es el caso más directo: hoy explica el mecanismo de acceso sin poder mostrar el lugar | `/donde/[region]/[comuna]`                   |
| `me-preocupa-el-costo`        | Listado filtrado por alternativas sin copago (Nivel A) y guía de costos                                                                                                | `/donde/`, `/primera-vez/cuanto-cuesta`      |
| `varias-semanas-o-mas`        | Establecimientos de la comuna (Nivel A) y qué esperar en una primera sesión                                                                                            | `/donde/`, `/primera-vez/que-pasa-en-sesion` |
| `no-sabria-decir`             | Páginas de experiencias cotidianas para poner en palabras lo que siente                                                                                                | `/siento/`                                   |
| `hace-unos-dias`              | Páginas de experiencias cotidianas y señales a las que prestar atención                                                                                                | `/siento/`                                   |
| `no-se-que-decir`             | Enlazar la biblioteca completa de guiones en vez de repetir tres aquí                                                                                                  | `/primera-vez/que-decir`                     |
| `me-da-verguenza`             | Qué ocurre en una primera consulta, cuánto dura, qué preguntan                                                                                                         | `/primera-vez/que-pasa-en-sesion`            |
| `no-quiero-preocupar-a-nadie` | Establecimientos de la comuna (Nivel A) y guía de primera vez                                                                                                          | `/donde/`, `/primera-vez/`                   |
| `me-preocupa-alguien`         | Guías de acompañamiento y qué hacer si la persona rechaza ayuda                                                                                                        | `/acompanar/`                                |

Al integrar cada uno hay que agregar la ruta a `RUTAS_ESTATICAS` en `tests/orientador.test.ts`, que
es lo que impide que un resultado enlace a un 404.
