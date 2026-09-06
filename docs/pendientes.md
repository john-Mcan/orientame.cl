# Pendientes

Estado al **4 de septiembre de 2026**, al cerrar la revisión editorial del orientador y las guías
([`plan/fase-4-revision-guias.md`](./plan/fase-4-revision-guias.md), D38–D47).

Cada punto dice qué falta, por qué quedó pendiente y qué habría que hacer. Lo que está aquí no está
hecho: si algo se resuelve, se saca de esta lista y se registra donde corresponda.

---

## 0. Bloqueante antes de cargar más establecimientos

### 0.1 `/donde` sirve todas las fichas en el HTML y no llega a escala nacional

**Qué pasa.** `/donde` renderiza en el documento una ficha completa por cada establecimiento y el
filtro sólo las oculta con `hidden`: el navegador las construye todas igual. Hoy son 31 registros,
133 KB y 11.500 px de alto. Medido por ficha son ~4 KB.

**Cuándo revienta.** El objetivo declarado es cubrir las 346 comunas. Con los ~2.500
establecimientos de atención primaria del registro DEIS, esa misma página serían **~10 MB de HTML
y del orden de 1,8 millones de píxeles**. No es un problema de diseño que se arregle con CSS: la
ficha ya se comprimió de 1.100 px a 260 px plegando el detalle en un `<details>` (D57) y eso
mejora el alto, no el peso, porque el marcado sigue estando entero en el documento.

**Qué habría que hacer.** La ruta acordada es que el índice busque **comunas** y las fichas vivan
en la página de cada comuna, que es lo que ya existe (`/donde/<region>/<comuna>`). Con eso el
índice pesa lo mismo con 3 comunas que con 346 y cada página carga sólo sus 5–30 establecimientos.
El paso 1 ya está hecho: las páginas por comuna entran al índice de búsqueda y son encontrables
por nombre (D56). Falta mover las fichas y convertir `/donde` en buscador de comuna más líneas
nacionales.

**Umbral concreto para actuar.** Antes de subir el dataset por sobre **una o dos comunas nuevas**,
o en cuanto `/donde/index.html` pase de ~300 KB. Cargar el DEIS completo sobre la estructura
actual deja la página inservible en un teléfono.

**Descartado por ahora.** Un backend de búsqueda en el borde: `connect-src 'self'` ya lo
permitiría sin tocar la CSP, pero a 2.500 registros sólo agrega tolerancia a errores de tipeo y
geo en servidor, a cambio de introducir un runtime que hoy no existe. Se revisa si el conjunto
supera las decenas de miles.

**Relacionado y sin resolver.** El dataset no tiene coordenadas —los campos son `id, nombre, tipo,
region, comuna, direccion, costo, modalidad…`—, así que «centros cerca de mí» no es posible hoy.
Se puede hacer entero en el cliente, sin que la coordenada salga del dispositivo, pero requiere
traerlas del DEIS o geocodificar, y además `Permissions-Policy: geolocation=()` en
`public/_headers` desactiva hoy la API por completo.

---

## 1. Verificación que no se pudo hacer en esta sesión

### 1.1 Revisión manual del recorrido en escritorio y móvil — **bloqueante antes de desplegar**

`AGENTS.md` la exige en cada incremento y no se hizo: el entorno de esta sesión no tiene navegador.
`npm run check` pasa completo (lint, prettier, `astro check`, build de 65 páginas y 165 pruebas), y
el HTML generado se revisó como texto para confirmar el orden de los bloques, pero **nadie ha visto
las páginas nuevas renderizadas**.

Qué mirar, concretamente:

- Las cuatro páginas de nodo nuevas: `/empezar/nunca-he-consultado`,
  `/empezar/prefiero-por-mi-cuenta` y sus dos guías (`entenderlo-primero`, `todavia-no`).
- El encabezado de un paso intermedio, que ahora tiene `h1` de título, párrafos de reconocimiento y
  la pregunta como `h2` separada por una línea. Verificar el ritmo vertical en móvil.
- La portada con ocho puertas en modo compacto (D45): que la primera pantalla siga funcionando a
  390 px y que el enlace «Ver estas opciones explicadas» no se lea como acción primaria.
- El atajo `#que-puedes-hacer` (D42): que el salto no deje el encabezado tapado por la barra fija.
- El bloque de salidas con `.opciones-lista--salidas`: que su fondo se distinga de las opciones de
  una pregunta y no invite a creer que el cuestionario sigue.

### 1.2 Sin captura de accesibilidad real

No se ejecutó lector de pantalla ni recorrido completo por teclado sobre los nodos nuevos. Los
`aria-labelledby` de los bloques y los `id` del atajo están puestos y el test de build comprueba que
el ancla tenga destino, pero eso no reemplaza la prueba.

---

## 2. Contenido que quedó fuera del alcance elegido

La sesión cubrió el orientador completo, `/primera-vez` y `/acompanar`. Quedó fuera:

### 2.1 `/siento` (12 vivencias) y `/temas` (7 cuadros)

Son las piezas mejor escritas del sitio y tienen fuentes y `afirmacionesTrazables` asociadas, así
que reescribirlas obliga a reverificar cada cita. Hoy el sitio tiene **dos registros conviviendo**:
el orientador y `/primera-vez` hablan en la voz cercana de D43, y `/siento` y `/temas` conservan una
voz más expositiva. No es incoherente, pero se nota al navegar de uno a otro.

### 2.2 Cuantificadores de frecuencia sin fuente en `/siento`

La prueba de D43 sólo cubre el orientador. Al auditar el resto aparecieron tres casos que **no se
corrigieron**:

| Archivo                                           | Texto                                                            |
| ------------------------------------------------- | ---------------------------------------------------------------- |
| `sintomas/me-irrito-por-cualquier-cosa.md`        | «La irritabilidad constante es frecuente en el agotamiento…»     |
| `sintomas/siento-angustia-en-el-pecho.md`         | «una de las manifestaciones físicas más comunes y atemorizantes» |
| `sintomas/no-puedo-dormir-aunque-este-cansado.md` | «Muchas personas describen sentir el cuerpo pesado…»             |

Los casos con fuente (`me-siento-mal-sin-saber-por-que`, `me-preocupo-por-todo`,
`siento-que-no-encajo-en-ningun-lugar`) están correctos y no hay que tocarlos.

### 2.3 Una promesa de resultado en `/siento`

`sintomas/me-irrito-por-cualquier-cosa.md`: «Consultar en tu CESFAM o con un psicólogo **te ayudará
a entender** qué te está sobrecargando». Promete un resultado, que §2.3 prohíbe. La prueba de
promesas indebidas tampoco cubre las content collections.

### 2.4 Género asumido en los títulos de `/siento`

`estoy-agotado-y-no-doy-mas` («Estoy agotado y siento que no doy más») y
`no-puedo-dormir-aunque-este-cansado` («No puedo dormir aunque esté cansado») son `fraseCotidiana`:
la frase en primera persona con que la persona se reconoce. Ahí la concordancia es difícil de evitar
sin perder naturalidad, y **cambiar el título implica cambiar el slug y por tanto la URL**. Es una
decisión editorial con costo, no un descuido: hay que tomarla explícitamente.

### 2.5 Las pruebas de voz sólo cubren el orientador

D43 (frecuencias sin fuente) y D44 (género asumido) son pruebas sobre `src/lib/orientador.ts`.
Extenderlas a las content collections y a las páginas `.astro` es posible, pero con la lista de
excepciones que muestran 2.2 y 2.4 conviene hacerlo junto con la corrección, no antes.

---

## 3. Trazabilidad: huecos conocidos

### 3.1 `afirmacionesTrazables` que no aparecen en el cuerpo

Las tres piezas de `/acompanar` declaran afirmaciones que **no están escritas en el artículo**. Por
ejemplo `preguntar-y-escuchar.md` declara «La primera ayuda psicológica busca ofrecer apoyo humano y
práctico respetando la dignidad, la cultura y las capacidades de la persona», y ese texto no está en
el cuerpo. En `/siento` sí aparecen verbatim.

`src/content.config.ts` no valida la correspondencia, así que las dos formas conviven. Hay que
decidir cuál es la regla —el campo registra qué respalda cada fuente, o registra las afirmaciones que
la pieza efectivamente hace— y hacerla explícita en `plantilla-contenido.md`. Si es la segunda,
agregar la validación al schema.

### 3.2 La Ley 20.584 no está en el registro de fuentes

`/primera-vez/que-pasa-en-sesion` cita el texto oficial de la ley de derechos y deberes en salud,
pero la cita vive inline en el `.astro` y no en `src/data/fuentes.ts`. Consecuencia concreta:
`/empezar/me-cuesta-dar-el-paso/me-da-verguenza` habría querido apoyarse en la confidencialidad y no
pudo citarla, así que menciona el tema y enlaza a la guía. Hay que abrir la URL, verificarla y
moverla al registro.

### 3.3 Afirmaciones de `/primera-vez` que se suavizaron pero siguen sin fuente

En esta sesión se les quitó el exceso de certeza, no se les agregó respaldo:

- duración de una sesión individual («suele estar cerca de la hora, pero varía»);
- costo comparado de las clínicas universitarias («habitualmente cuesta menos que una privada»);
- la descripción de los cuatro enfoques terapéuticos;
- cómo suele funcionar la cobertura de psicoterapia en isapres.

Ninguna es falsa según lo que sabemos, y ninguna cita fuente. La opción honesta es abrir fuentes
oficiales para las que se puedan verificar y marcar visiblemente las que no.

### 3.4 `/empezar/no-se-donde-buscar` nombra CESFAM, CECOSF y COSAM

La existencia de esos tipos de establecimiento viene del registro DEIS que ya usa `/donde`, y la
inscripción en APS está respaldada por ChileAtiende. Que los tres sean la puerta de entrada de la
red pública es una síntesis nuestra, apoyada en las dos cosas anteriores. Conviene verificarlo contra
una fuente que lo diga así, o desagregar la frase.

### 3.5 Código de ética del Colegio de Psicólogos

Sigue retirado desde la auditoría de fase 3: el dominio no responde. Hasta que exista una URL que se
pueda abrir, no se cita.

---

## 4. Pendientes de etapa que esta revisión no toca

Ya estaban registrados y siguen abiertos.

- **Testimonios y `/historias/`** (etapa 4). Sin consentimiento ni procedencia documentados. La ruta
  no existe y no se enlaza desde ninguna parte.
- **Protocolo de crisis.** `0.1-borrador`, no aprobado, `PROTOCOLO_CRISIS_APROBADO = false`.
  Publicado en `/metodologia/protocolo-crisis` para revisión profesional. Ninguna lógica reacciona a
  señales de riesgo.
- **Modo oscuro y cierre de WCAG 2.2 AA** (etapa 5).
- **Nivel B de recursos** (v2), condicionado a financiamiento para revisión humana y reverificación.
- **Revisión legal previa al lanzamiento**: Ley 21.719 de datos personales, Ley 21.331 de derechos en
  salud mental y licencias de instrumentos.
- **Suite E2E, matriz de navegadores, CI completo y auditoría automatizada de enlaces** (etapa 5). No
  se construyen antes.
- **Nombres de componentes en inglés.** `AccessUrgency`, `EditorialStatus` y `SourceList` siguen en
  inglés y ahora conviven con `GuiaOrientador`, `DatoOrientador` y `FuentesLinea`. Unificarlos sigue
  siendo una decisión pendiente, no una tarea incidental.

---

## 5. Ideas que aparecieron y no se implementaron

No son deuda: son opciones que quedaron anotadas para no redescubrirlas.

- **Puntos de enriquecimiento de D9 (fase 2).** La tabla quedó cumplida para los nodos que ya
  existían. Los cuatro nodos nuevos de D39 no están en ella; si se retoma la tabla, agregarlos.
- **`/empezar` sigue fuera del índice de búsqueda** (D31), porque es un recorrido y no un documento.
  Con las guías ahora escritas de verdad, vale la pena reevaluarlo: hoy alguien que busca «no sé qué
  decir» no encuentra la guía del orientador, sólo la de `/primera-vez`.
- **Una salida hacia `/autoevaluacion` desde más guías.** Sólo `hace-unos-dias`, `no-sabria-decir` y
  `entenderlo-primero` la ofrecen. No se agregó en el resto para no empujar un instrumento a quien no
  lo pidió; queda como decisión abierta.
