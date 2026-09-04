# AGENTS.md — orientame.cl

Instrucciones operativas para agentes que trabajen en este repositorio. Lo que está aquí son las
reglas que, si se rompen, causan daño real: información de salud sin respaldo, promesas falsas a una
persona que está mal, o un recorrido que termina en nada.

## Qué es este proyecto

Plataforma estática, sin fines de lucro, para Chile. Ayuda a alguien a **entender sus opciones de
salud mental y dar un siguiente paso posible, si decide darlo**.

No es una aplicación clínica, ni un marketplace de psicólogos, ni un chatbot, ni un terapeuta de IA,
ni un servicio de crisis, ni un sistema de diagnóstico. No tiene cuentas, base de datos ni backend.

El éxito no se mide por permanencia en el sitio. Idealmente orientame.cl deja de ser necesaria
cuando la persona encuentra una ruta que le sirve.

## Jerarquía documental

Ante cualquier duda de alcance, propósito o gobernanza, manda el documento base.

| Documento                                                              | Qué resuelve                                                                            |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| [`docs/plan/descripcion-inicial.md`](docs/plan/descripcion-inicial.md) | Propósito, principios, alcance, privacidad, gobernanza editorial. **Fuente de verdad.** |
| [`docs/plan/plan-desarrollo-v1.md`](docs/plan/plan-desarrollo-v1.md)   | Qué se construye en cada etapa y cómo se verifica                                       |
| [`docs/plan/estilos.md`](docs/plan/estilos.md)                         | Identidad visual, tokens, componentes, accesibilidad                                    |
| [`docs/plan/plantilla-contenido.md`](docs/plan/plantilla-contenido.md) | Estructura editorial trazable de cada pieza                                             |
| [`docs/plan/fase-2-decisiones.md`](docs/plan/fase-2-decisiones.md)     | Decisiones tomadas y **pendientes con dueño de etapa**                                  |

Un cambio relevante respecto del plan **se consulta con el usaurio a cargo y se documenta antes de aceptarse**, con el procedimiento de
`plan-desarrollo-v1.md` §1.3: qué se descubrió, qué afecta, impacto, alternativa más simple,
decisión, archivos por actualizar. No se cambia el propósito del producto en silencio.

## Estado actual

**Fase 4 implementada, excepto testimonios autorizados.** La fase 3 se cerró reproduciendo 27
establecimientos vigentes del registro DEIS como fichas nivel A, sin inventar formas de acceso.
Lee [`docs/plan/fase-3-decisiones.md`](docs/plan/fase-3-decisiones.md) §Auditoría (D16–D23) y
[`docs/plan/fase-4-decisiones.md`](docs/plan/fase-4-decisiones.md) antes de tocar `/siento`, `/temas`,
`/donde`, `/autoevaluacion`, `/acompanar` o `src/data/recursos.json`.

Rutas que existen hoy (61 páginas estáticas):

```
/  /urgencia  /404
/empezar  +  11 rutas del orientador bajo /empezar/[...ruta]   (3 pasos y 9 resultados)
/siento   +  12 vivencias cotidianas bajo /siento/[slug]
/temas    +  7 cuadros clínicos bajo /temas/[slug]
/primera-vez  +  4 guías (/que-pasa-en-sesion, /que-decir, /cuanto-cuesta, /como-elegir)
/donde    +  3 comunas piloto (/donde/metropolitana/{santiago,providencia,puente-alto}) y /donde/clinicas-universitarias
/autoevaluacion  +  2 instrumentos (/oms-5, /gad-7)
/acompanar  +  3 guías iniciales
/buscar
/sobre  /metodologia  /metodologia/protocolo-crisis  /legal  /legal/{privacidad,alcance,terminos}
```

**Las URLs citadas hoy en el sitio fueron abiertas y leídas antes de citarse.** Si agregas
una, ábrela y compruébala: hay un test que bloquea que una misma URL respalde documentos distintos,
porque así se detectó que 16 citas colgaban de dos PDFs de MINSAL inventados.

**La ruta que NO existe es `/historias/`.** No la enlaces hasta contar con testimonios cuyo
consentimiento y procedencia estén documentados. Enviar a alguien a un 404 al final de un recorrido
es el peor resultado posible.

## Reglas innegociables

**No diagnosticamos.** Nunca "tienes depresión", "esto es ansiedad", "necesitas terapia". Se usa
lenguaje calibrado: "esto puede estar relacionado con…", "si está afectando tu vida cotidiana,
podría ser razonable conversarlo con un profesional". Ver §7.3 del documento base para las frases
prohibidas.

**No reemplazamos atención profesional.** Ninguna parte del sitio puede comportarse como sustituto
de una evaluación o tratamiento.

**La persona conserva la decisión.** Sin presión, culpa ni dramatización. Prohibido persuadir por
miedo ("si no buscas ayuda esto puede empeorar"). Prohibido prometer resultados o el comportamiento
de terceros ("no van a juzgarte").

**Siempre existe un paso de menor compromiso.** Si la acción principal parece demasiado, se ofrece
una más pequeña. Detenerse y volver después es una opción válida y se dice explícitamente. Urgencia
nunca es "el paso de menor compromiso".

**Primero se reconoce la barrera, después se ofrece la acción.** Si la persona eligió "no quiero
preocupar a nadie" o "me da vergüenza", el resultado tiene que hablar de eso —nombrarlo, decir que
es frecuente— antes de proponer que pida una hora. Saltar directo al trámite convierte lo que dijo
en un obstáculo administrativo y el recorrido deja de acompañar. Ya pasó: `no-quiero-preocupar-a-nadie`
respondía sobre confidencialidad ("no tienes que contárselo a nadie") cuando lo que la persona
suele estar diciendo es que se siente una carga o que su caso no amerita molestar.

Reconocer no es consolar: no se afirma cómo se van a sentir terceros ("no le quita nada a quienes te
importan"), no se corrige el sentimiento y no se promete alivio.

**La crisis no se delega a IA.** No hay chatbot de crisis ni decisiones generativas. **No se
formulan preguntas que evalúen riesgo ni se bifurca según la respuesta.** El acceso a `/urgencia` es
una opción que la persona elige, no una conclusión del sistema. Cualquier lógica que reaccione a
señales de riesgo está bloqueada hasta que exista un `protocolo-crisis.md` aprobado clínicamente —
hoy no existe.

**Privacidad por arquitectura.** Sin cuentas, sin base de datos, sin almacenar respuestas. El
procesamiento sensible ocurre en el navegador.

> Redacción correcta: "las respuestas que entregas en nuestras herramientas se procesan en tu
> dispositivo y orientame.cl no las almacena en sus servidores."

**Nunca** "nada se guarda ni se envía", "ningún dato sale de tu dispositivo" ni equivalentes: la
navegación web implica solicitudes técnicas y esa afirmación es falsa. Hay un test que lo bloquea.

**Sin incentivos ocultos.** No se ordenan recursos por pago, no hay comisiones por derivación. Las
alternativas públicas, gratuitas y de bajo costo son rutas principales, no el plan B.

**Nada de affordances falsas.** No construyas un control que parezca hacer algo que no hace. Hubo un
`<a>` disfrazado de campo de búsqueda: se veía como input, tenía lupa y placeholder, y no buscaba
nada. Si la funcionalidad no existe todavía, no simules su envoltorio.

## Trazabilidad de afirmaciones

Los agentes pueden investigar, estructurar y redactar. **El conocimiento general del modelo no es una
fuente publicable.**

Antes de afirmar algo clínico, epidemiológico o sobre efectividad:

1. **Abre la URL y comprueba que respalda exactamente esa afirmación.** No cites lo que no leíste. Si
   el servidor bloquea peticiones automatizadas, verifícalo en un navegador real o no lo publiques.
2. Conserva población, condiciones, alcance y grado de certeza de la fuente. No la fortalezcas.
3. Prefiere organismos oficiales (MINSAL, OMS), guías clínicas, revisiones sistemáticas y fuentes
   primarias.
4. Nunca inventes referencias, credenciales, cifras ni consensos.
5. No resuelvas evidencia contradictoria con criterio propio.
6. Marca visiblemente lo incierto o pendiente.

Dónde vive cada cosa:

- **Datos de interfaz** → `src/data/fuentes.ts`. Cada afirmación declara `fuenteIds` y muestra la
  referencia junto al dato. Hay tests que exigen fuente existente, URL `https` y fecha ISO.
- **Contenido editorial** → content collections, con el schema de `src/content.config.ts`
  (`fuentes`, `afirmacionesTrazables`, `revisionRequerida`, `estadoEditorial`).
- **Regla de publicación** → `src/lib/editorial.ts` es la única autoridad sobre si una pieza puede
  generarse en producción.

**No escribas afirmaciones sobre el sistema de salud en un archivo que esquive estos mecanismos.**
Ya pasó: un `.ts` afirmaba sin fuente que la atención era gratuita "para tramos A y B", y al
verificarla resultó incorrecta en perjuicio del usuario — la cobertura de psicólogo clínico en
atención primaria es 100% para todos los tramos de Fonasa.

**Dos vías de verificación.** `revisionRequerida: 'fuentes'` basta para adaptar a lenguaje claro
información oficial verificable. Se exige `'clinica'` para protocolos de urgencia, reglas que
reaccionen a riesgo, interpretación de instrumentos, cambios de scoring o umbrales, recomendaciones
personalizadas, contenido dirigido a menores y síntesis clínicas originales. Ver §31 del documento
base. Nunca uses nombres de profesionales ni estados de revisión inventados para satisfacer un
schema.

## Reglas técnicas

**Estático primero.** Astro + TypeScript, `output: 'static'`, despliegue en Cloudflare
(`wrangler.jsonc` sirve `./dist`). No hay runtime de aplicación.

**JavaScript sólo cuando la interacción aporta valor**, evaluado componente por componente cuando
llega su etapa. Un recorrido que sólo cambia de contenido según lo elegido se resuelve con rutas
estáticas y enlaces. Un island se justifica cuando hay estado real que debe responder sin recargar
(filtrar mientras se escribe, puntuar mientras se responde, resultados de búsqueda). El orientador
se resolvió como rutas estáticas; ver decisión D1.

**Sin dependencias remotas.** No fuentes de Google, no CDN, no scripts externos, no mapas o videos
embebidos, no trackers publicitarios. La CSP de `public/_headers` es estricta y debe seguir
siéndolo. No usar `prefetchAll`.

**`/urgencia` debe funcionar completamente sin JavaScript**, sin animaciones y sin depender de nada
remoto.

**Progressive enhancement.** Si un control requiere JavaScript, que no aparezca cuando no lo hay
(ver el botón de `GuionCopiable.astro`, que parte `hidden`), y que el contenido siga accesible.

**Accesibilidad: WCAG 2.2 AA como mínimo, desde el diseño.** Navegación completa por teclado, foco
visible con separación, targets de 44 px, reflow a 320 px sin scroll horizontal, landmarks y
jerarquía de headings, errores explicados en texto, `prefers-reduced-motion`.

Trampas concretas ya encontradas: `role="listitem"` sobre un `<button>` destruye su semántica; un
componente `inline-flex` (`EditorialStatus`, `AccessUrgency`, `ButtonLink`) dentro de un `<p>`
produce párrafos anidados y rompe el layout; un `aria-label` fijo impide anunciar un cambio de
estado; mover el foco al montar roba el foco y hace scroll.

**Previews no se indexan.** `robots.txt` sólo permite crawling cuando `PUBLIC_SITE_ENV=production`.

## Tests: proporcionales a la etapa

Durante el desarrollo **se evita deliberadamente la sobreingeniería de pruebas** (documento base
§35, plan §1.2). No existe objetivo de coverage y no se debe definir uno.

Obligatorio en cada incremento:

```bash
npm run check   # lint (eslint + prettier) -> typecheck (astro check) -> test -> build
npm run format  # antes de check, si tocaste formato
```

Más **revisión manual del recorrido modificado**, en escritorio y móvil.

**Escribe un test sólo cuando un fallo tenga consecuencias relevantes.** Hoy eso es:

- scoring de instrumentos y reglas de urgencia (etapas 4 y siguientes);
- filtrado crítico de recursos;
- trazabilidad: que toda afirmación cite una fuente que existe;
- integridad de destinos: que ningún enlace termine en 404;
- límites clínicos: que no entre lenguaje diagnóstico, persuasión por miedo ni preguntas de riesgo;
- validez de HTML donde un error rompe el layout.

**No construyas todavía** (corresponden a la etapa 5): suite E2E amplia, matrices de navegadores,
automatización total de accesibilidad, CI completo, auditoría automatizada de enlaces y recursos.

Criterio: **un test debe poder fallar por una razón que importe.** No agregues pruebas que sólo
confirmen que el HTML contiene lo que el template escribió. Si un test estorba porque el producto
cambió legítimamente, actualízalo y explica por qué en el registro de decisiones; no lo borres en
silencio.

## Interfaz y estilo visual

Deriva todo de los tokens de `src/styles/global.css`; no repitas valores sueltos.

**La escala de espaciado tiene huecos: 1, 2, 3, 4, 6, 8, 12, 16, 24.** No existen `--space-5`,
`--space-10` ni `--space-20`, y tampoco `--text-md`. Un token inexistente no cae en un valor por
defecto razonable: invalida la declaración completa, así que `gap: var(--space-10)` queda en `0` y
`margin-block: var(--space-8) var(--space-20)` pierde también el margen superior. Ya pasó en cuatro
archivos de la fase 4 y el resultado eran bloques pegados sin separación. Si necesitas un paso
intermedio, usa el de la escala; no inventes el token.

Los estilos del buscador viven en `global.css` porque el island lo consumen la portada y `/buscar`:
un estilo con scope de página no alcanza su DOM sin `:global`, y duplicarlo hacía que los dos
buscadores pudieran divergir.

**Un solo ancho en todo el sitio: `.reading-shell` (45rem).** Migas, encabezados, `lede`, avisos,
artículos, fichas **y grillas de tarjetas** van ahí. `.page-shell` (75rem) queda para el encabezado
y el pie del sitio, y para la portada, cuya primera pantalla es a dos columnas. Nada más.

Mezclar los dos anchos entre páginas es lo que hace que el sitio se sienta inconsistente: el
contenido salta de posición al navegar. Dos formas concretas en que ya pasó: el encabezado de las
páginas nuevas quedó en `page-shell` mientras el resto del sitio leía a 45rem, y las migas quedaron
en `page-shell` sobre un artículo en `reading-shell`, flotando a la izquierda. Una grilla de
tarjetas a 45rem da dos columnas, que es suficiente. Hay un test que lo bloquea.

- **Iconos SVG propios (`Icon.astro`), nunca emojis** en la interfaz.
- **No** bordes de acento a la izquierda, gradientes extraños, ni otros patrones genéricos de
  interfaz generada por IA.
- La **línea de orientación** (`.linea-orientacion`) es el único gesto gráfico distintivo, y **cada
  nodo debe corresponder a una opción o etapa real**. Nunca como decoración.
- Una sola acción primaria por bloque. El rojo se reserva a urgencia y peligro real, nunca para
  aumentar conversión.
- El acceso a urgencia permanece visible en todas las páginas, discreto y sin animación intermitente.
- Voz: español claro y directo para Chile, activa, frases breves, controles nombrados por lo que
  hacen. Sin lenguaje promocional. No asumas diagnóstico, género, capacidad de pago ni disposición a
  terapia.

## Convenciones del repo

- **Vocabulario de dominio en español** en código nuevo (`PasoOrientador`, `GuionCopiable`,
  `fuentes`, `acciones`). Los componentes de la fase 1 quedaron con nombres en inglés
  (`AccessUrgency`, `EditorialStatus`, `SourceList`); no los renombres de paso — unificarlos es una
  decisión pendiente, no una tarea incidental.
- Alias de import: `@/*`, `@components/*`, `@layouts/*`.
- Comentarios sólo donde expliquen un **por qué** no evidente, en español, al nivel del código
  vecino.
- Mensajes de commit en español, estilo `feat(fase N): …`.
- **No hagas commit ni push salvo que se pida explícitamente.**

## Pendientes con dueño de etapa

- **Etapa 4 — testimonios.** `/historias/` queda pendiente hasta contar con consentimiento,
  procedencia y reglas editoriales verificables.
- **Etapa 4 — protocolo de crisis.** Existe `protocolo-crisis.md` en versión `0.1-borrador`, no
  aprobado y técnicamente inactivo. El borrador se publica en `/metodologia/protocolo-crisis` para
  revisión profesional a distancia. OMS-5 y GAD-7 no contienen una pregunta explícita de riesgo y
  no activan respuestas de crisis. Cualquier instrumento futuro que sí la contenga permanece
  bloqueado hasta una revisión clínica documentada.
- **v2 — Nivel B nacional**, condicionado a financiamiento que sostenga revisión humana y
  reverificación periódica.
- **Previo al lanzamiento** — revisión legal (Ley 21.719 de datos personales, Ley 21.331 de derechos
  en salud mental, licencias de instrumentos).
