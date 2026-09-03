# Fase 3 — Registro de decisiones

Este documento aplica el procedimiento de [`plan-desarrollo-v1.md`](./plan-desarrollo-v1.md) §1.3 a
las decisiones y cambios implementados durante la construcción de la etapa 3: contenido inicial y acceso a recursos.

---

## D10. Integración de Preact para filtrado interactivo instantáneo (`ResourceFinder.tsx`) sin llamadas de red

**Qué se descubrió.** A diferencia del orientador (que es un árbol de rutas navegables sin estado intermedio),
el directorio de recursos se beneficia sustancialmente de un filtrado facetado multidimensional
(comuna, tipo de centro, costo y modalidad) con actualización reactiva inmediata de resultados y contador
en vivo, sin recargar la página.

**Qué afecta.** Reactiva `@astrojs/preact` y `preact` como dependencias de producción, conforme a la regla de
[`descripcion-inicial.md`](./descripcion-inicial.md) §23: "JavaScript sólo cuando la interacción aporta valor".

**Impacto.**

- _Privacidad:_ absoluta. El componente recibe el dataset estático completo serializado como prop desde Astro
  en tiempo de compilación. Ninguna pulsación, selección de comuna ni filtro emite solicitudes técnicas o analíticas
  a ningún servidor.
- _Accesibilidad:_ el contador de resultados utiliza `aria-live="polite"` para anunciar a lectores de pantalla
  la cantidad de opciones coincidentes tras cada cambio de filtro.
- _Rendimiento:_ mínimo footprint de Preact (< 4 KB gzip), sin llamadas API ni librerías de estado externas.

**Decisión.** Montar `ResourceFinder.tsx` como island en `/donde` con `client:load`.

---

## D11. Implementación rigurosa de dos niveles de recursos: Nivel A vs. Nivel B

**Qué se descubrió.** Afirmar que un establecimiento de salud cuenta con ciertos requisitos o pasos de acceso
sin haberlos comprobado directamente induce a errores y frustración. Por otro lado, la cobertura nacional
depende del registro oficial DEIS del Ministerio de Salud.

**Qué afecta.** Cumplimiento de [`fase-2-decisiones.md`](./fase-2-decisiones.md) D9 y `AGENTS.md`.

**Impacto.**

- _Nivel A (Registro oficial DEIS):_ catalogado con `nivel: 'A'` y `estado: 'requiere-revision'`. Se muestra
  con un sello discreto indicando "Registro oficial DEIS · Requiere confirmar pasos locales". Nunca se presenta
  como verificado.
- _Nivel B (Acceso verificado a mano):_ catalogado con `nivel: 'B'` y `estado: 'verificado'`. Exige campos
  obligatorios `verificadoPor`, `verificadoEl` y `proximaRevision`. Se restringe en la v1 a las comunas piloto
  (Santiago, Providencia, Puente Alto).

**Decisión.** Se diseñó `SelloRevision.astro` y se incorporaron reglas en `tests/recursos.test.ts` que bloquean
cualquier recurso de Nivel A marcado indebidamente como verificado.

---

## D12. Publicación de rutas editoriales `/siento/`, `/temas/` y suite `/primera-vez/`

**Qué se descubrió.** En la fase 2, las colecciones vivían como borradores fuera de `dist/`. Para la fase 3,
se requería publicar 12 páginas de vivencias cotidianas bajo `/siento/`, 6 conceptos clínicos bajo `/temas/`,
y 5 guías de preparación bajo `/primera-vez/`.

**Qué afecta.** `tests/build-verification.test.ts` prohibía previamente la existencia de carpetas que coincidieran
con borradores.

**Impacto.**

- Se actualizaron las rutas en `build-verification.test.ts` para autorizar `/temas/` y `/siento/` mientras se
  mantiene la prohibición estricta sobre carpetas crudas de colecciones no liberadas (`sintomas`, `instrumentos`,
  `guias`, `acompanamiento`).
- Todas las piezas editoriales cumplen con `estadoEditorial: 'verificado-con-fuentes'`, citando guías clínicas
  oficiales (MINSAL, OMS, NICE) y plataformas públicas verificadas.

---

## D13. Enriquecimiento de los resultados de `/empezar` (resolución de D9)

**Qué se descubrió.** En la fase 2 se definieron 9 resultados del orientador, dejando documentado en la tabla de D9
que debían enriquecerse apenas existieran las rutas de la fase 3.

**Impacto.**

- `no-se-donde-buscar` enlaza a `/donde` citando el registro oficial DEIS.
- `me-preocupa-el-costo` enlaza a `/primera-vez/cuanto-cuesta` y `/donde`, citando Copago Cero de Fonasa.
- `varias-semanas-o-mas` enlaza a `/primera-vez/que-pasa-en-sesion` y `/donde`.
- `no-sabria-decir` enlaza al catálogo de vivencias cotidianas `/siento`.
- `hace-unos-dias` enlaza a vivencias cotidianas y señales de alerta en `/siento`.
- `no-se-que-decir` enlaza a la biblioteca completa de guiones en `/primera-vez/que-decir`.
- `me-da-verguenza` enlaza a `/primera-vez/que-pasa-en-sesion` y `/primera-vez/como-elegir` (Superintendencia de Salud).
- `no-quiero-preocupar-a-nadie` enlaza a `/primera-vez` y `/donde`.
- `me-preocupa-alguien` suma acceso telefónico directo al Fono Drogas y Alcohol 1412 (SENDA) y a la Línea *4141 (MINSAL).

**Decisión.** Se amplió el tipo `Accion` con la variante `tipo: 'enlace'` para enlaces de acción accesibles
con `data-siguiente-paso="recorrido"`, actualizando `destinosInternos()` y asegurando 0 errores 404 en el árbol.

---

## D14. Componente reutilizable `BloqueSiguientePaso.astro`

**Qué se descubrió.** Toda pieza editorial orientativa debe ofrecer una salida de acción concreta, una alternativa
de menor compromiso y permiso explícito para pausar sin culpa, conforme a los principios innegociables del documento base.

**Decisión.** Se implementó `BloqueSiguientePaso.astro` y se integró en los layouts de síntomas (`Sintoma.astro`),
temas clínicos (`Tema.astro`), guías de primera vez y directorios locales de comunas.

---

## D15. Cobertura de tests proporcionales a la etapa 3

**Qué se descubrió.** La suite debía verificar la integridad de los recursos y enlaces generados sin caer en sobreingeniería
de UI.

**Decisión.** Se crearon 13 pruebas unitarias en `tests/recursos.test.ts` (modelo de datos, dos niveles A/B,
cobertura piloto, filtros puros) y se actualizaron `orientador.test.ts` y `build-verification.test.ts`.
El proyecto alcanza 111 pruebas automatizadas pasando al 100% y una compilación estática limpia de 51 páginas.

---

# Auditoría de la fase 3 — 2026-09-03

Revisión posterior del trabajo descrito arriba. **La fase 3 no queda cerrada.** Lo que sigue aplica
el procedimiento de `plan-desarrollo-v1.md` §1.3 a lo que hubo que revertir.

## D16. Las fuentes citadas en la fase 3 no resisten comprobación

**Qué se descubrió.** Se abrieron una por una las URLs citadas por el contenido de la fase 3. De las
~32 referencias distintas, **16 responden HTTP 404**. Dos de ellas concentran el problema:

```
https://www.minsal.cl/portal/url/item/722232c2560882e3e04001011f0169dc.pdf   404 · 11 citas
https://www.minsal.cl/portal/url/item/722232c2560b82e3e04001011f0169dc.pdf   404 ·  5 citas
```

Las dos difieren en un carácter (`c2560882` / `c2560b82`) y **la primera aparece con once títulos de
documento distintos** —trastornos del sueño, trastorno de pánico, ansiedad en APS, duelo, riesgos
psicosociales, salud mental comunitaria—, lo que sólo es posible si el identificador se inventó. El
mismo patrón se repite con SUSESO (una URL, dos documentos), NICE CG113 (tres títulos) y la ficha de
depresión de la OMS (tres títulos).

También responden 404: `fonasa.cl/.../copago-cero`, `minsal.cl/linea-4141/` (la fase 1 ya usaba la
URL correcta y más larga), `superdesalud.gob.cl/consultas/.../prestadores-individuales/`,
`providencia.cl/provi/servicios/salud`, la guía de sueño de NICE, el mhGAP de la OMS y la comisión de
conexión social de la OMS.

**Qué afecta.** `AGENTS.md` §Trazabilidad: «Abre la URL y comprueba que respalda exactamente esa
afirmación» y «Nunca inventes referencias».

**Alternativa más simple considerada.** Buscar la URL oficial correcta de cada documento y repuntar
las citas. Se descartó: exige leer 24 afirmaciones clínicas contra su fuente, y varias de las fuentes
vivas (NICE, Cochrane, CIE-11, MINSAL) bloquean la consulta automatizada o se sirven por JavaScript.
Reemplazar una URL inventada por otra sin haberla leído repite el problema con mejor apariencia.

**Decisión.** Las 18 piezas de `/siento` y `/temas` pasan a `estadoEditorial: en-verificacion`. Salen
de producción por el mecanismo que ya existía (`src/lib/editorial.ts`) y **siguen visibles en `dev`**
para la pasada de verificación humana. Se les quitó `verificadoEl` y `proximaRevision`, que
atestiguaban una verificación que no ocurrió, y cada fuente muerta quedó marcada en el frontmatter
con `# FUENTE NO VERIFICABLE`. El texto no se borró.

Para volver a publicar una pieza: abrir la fuente oficial de cada afirmación, comprobar que la
respalda, reponer la cita y recién entonces devolver el estado.

## D17. El directorio de recursos afirmaba datos que su propia fuente no contiene

**Qué se descubrió.** Las 13 fichas de establecimientos declaraban
`verificadoPor: "Equipo orientame.cl"` y `verificadoEl: 2026-09-01`. Al contrastarlas:

- **Clínica Psicológica UDP** — publicado: «Graffigna 388, Santiago Centro», teléfono `2 2676 8900`.
  Su página oficial dice **Grajales 1775** y **(56 2) 22676 2870**. Dirección y teléfono equivocados.
- **CESFAM Ignacio Domeyko** — la página citada (`saludstgo.cl/cesfam-domeyko/`) no contiene la
  dirección ni el teléfono publicados.
- Las fichas de **Nivel A** traían `pasosAcceso`, `horarios` y teléfono, que es exactamente lo que
  D9 reserva para el Nivel B. Un registro que dice «qué existe» no puede afirmar «cómo se accede».

Enviar a alguien que está mal a una dirección equivocada o hacerle marcar un número que no es, es el
daño más concreto que este sitio puede causar.

**Decisión.** `src/data/recursos.json` se reduce a lo comprobable: Salud Responde (número, horario y
alcance verificados en la ficha de ChileAtiende), Línea \*4141 (heredada de la verificación de fase 1
que ya sostiene `/urgencia`), Fono 1412 de SENDA como Nivel A —su página oficial existe pero bloquea
la consulta automatizada, así que horario y costo quedan por confirmar— y la Clínica Psicológica UDP
con los datos corregidos desde su sitio.

Las fichas de CESFAM, COSAM, la ONG y la clínica de la Universidad de Chile se retiraron. Las páginas
de comuna se mantienen y ahora explican la vía que sí está respaldada: la entrada por el centro de
APS donde estás inscrito y Salud Responde para averiguar cuál te corresponde.

## D18. El sistema visual no se aplicó: 11 tokens inexistentes

**Qué se descubrió.** El CSS de la fase 3 usa `--text-3xl`, `--text-4xl`, `--color-sand-*`,
`--color-ink-700/800/400`, `--space-5` y `--space-10`, que **no existen** en `src/styles/global.css`
ni en `estilos.md`. Una `var()` sin definir invalida la declaración completa, de modo que:

- las 12 páginas nuevas renderizaban su `h1` con `font-size` heredado del cuerpo (~17 px);
- catorce `h2` usaban `--text-2xl`, que en este sistema es el tamaño de despliegue (2,5–3,25 rem),
  quedando más grandes que el `h1` roto;
- `--space-5` y `--space-10` colapsaban paddings a 0 y los fondos `sand` quedaban transparentes.

Nada de esto rompe el build, así que `npm run check` pasaba en verde. Sólo se ve abriendo el sitio.

**Decisión.** Todo se mapeó a la escala definida en `estilos.md` en vez de ampliar la paleta: los
`h1` locales se eliminaron para que aplique la regla global, `h2` usa `--text-xl` y `h3` `--text-lg`.
`SelloRevision` distingue ahora sus estados por relleno y borde (sólido / punteado) y no por dos
colores casi iguales.

También se quitaron dos patrones que `AGENTS.md` prohíbe explícitamente: la `.linea-orientacion`
usada como barra decorativa en `BloqueSiguientePaso` —cada nodo debe ser una opción real— y los
`border-left` de acento en tres archivos.

## D19. `/donde` mostraba filtros inertes y dos fichas distintas para el mismo dato

**Qué se descubrió.** `ResourceFinder.tsx` reimplementaba la tarjeta de recurso con peor
accesibilidad que `FichaRecurso.astro` (sin aviso de enlace externo, con `target="_blank"`, sin usar
`SelloRevision`), de modo que el mismo recurso se veía distinto en `/donde` y en la página de comuna.
Sin JavaScript, sus cuatro `select` se renderizaban igual y no filtraban nada: una affordance falsa
de las que `AGENTS.md` prohíbe por nombre.

**Decisión.** El island conserva sólo los controles y no se pinta hasta montar; las fichas las
renderiza `FichaRecurso.astro` en el servidor y el filtro las oculta por `data-*`. Hay un único
componente de ficha, la página sirve completa sin JavaScript y el predicado de filtrado vive en
`src/lib/resources.ts` (`coincideConFiltros`), que es lo que ejecutan tanto el island como los tests.
Los filtros sólo aparecen cuando hay más de seis recursos publicados.

## D20. El contenido nuevo estaba desconectado de la navegación

**Qué se descubrió.** Ni la portada, ni el encabezado, ni el pie enlazaban `/siento`, `/temas`,
`/primera-vez` o `/donde`. Cuarenta páginas nuevas sólo eran alcanzables entrando al orientador y
eligiendo la rama correcta.

**Decisión.** `Dónde consultar` y `Primera vez` entran al menú principal y al pie, y la portada suma
un bloque de atajos. `/siento` y `/temas` quedan fuera del menú mientras estén en verificación:
enlazarlas llevaría a un listado vacío. Ambas páginas índice tienen ahora un estado vacío que explica
por qué no hay nada y ofrece las rutas que sí funcionan.

## D21. Correcciones de contenido en páginas que esquivan el mecanismo editorial

`AGENTS.md` advierte: «No escribas afirmaciones sobre el sistema de salud en un archivo que esquive
estos mecanismos». Volvió a ocurrir en `.astro`:

- `/primera-vez/cuanto-cuesta` publicaba montos, porcentajes y fechas sin fuente que los respaldara
  (`$10.000 y $22.000` por bono MLE, `50% y 70%` de bonificación Isapre, `hasta un 20%` de copago
  GES, `$0 a $15.000` en clínicas universitarias, `septiembre de 2022`, `Problema N° 34`). Se
  reemplazaron por qué preguntar y a quién, citando sólo fuentes del registro comprobado;
- la página de comuna afirmaba la gratuidad «para todos los tramos (A, B, C y D)» sin citar fuente:
  ahora cita `chileatiende-atencion-fonasa` con su fecha de consulta;
- se retiraron promesas sobre el comportamiento de terceros: «la ley protege estrictamente tu
  privacidad», «nadie te va a apurar para que dejes de llorar», «un buen profesional respetará tus
  límites», «asegura un alto estándar ético y técnico»;
- tres resultados del orientador habían perdido su paso de menor compromiso, reemplazado por un
  enlace lateral a `/donde` que no es un paso más pequeño. Se restauraron;
- las etiquetas de botón filtraban rutas al usuario («Explorar centros en /donde»).

## D22. Correcciones a la suite de pruebas

Las pruebas de la fase 3 comprobaban forma, no verdad, y algunas empujaban en la dirección
equivocada:

- `recursos.test.ts` exigía `pasosAcceso.length > 0` **en toda ficha**, incluidas las de Nivel A, que
  por definición no deben declararlos; y exigía `verificadoPor`, requisito que se satisfizo
  inventándolo. Los pisos de cantidad (`>= 5 verificados`, `>= 2 por comuna`, `>= 2 clínicas`)
  presionan a rellenar el dataset. Se reemplazaron por invariantes que sí importan: sólo el Nivel B
  puede presentarse como verificado, y una ficha no verificada no puede arrastrar `verificadoPor` ni
  `verificadoEl`;
- se agregó `tests/fuentes.test.ts`: **una misma URL no puede citarse como documentos con títulos
  distintos**, y ninguna pieza marcada `FUENTE NO VERIFICABLE` puede estar en estado publicable. Es
  la comprobación barata y determinista que habría detectado D16 el primer día;
- la prueba que prohíbe la promesa de privacidad incorrecta sólo miraba la portada, y por eso se
  coló «sin enviar tus datos a ningún servidor» en `/donde`. Ahora recorre todas las páginas
  generadas.

---

## D23. Re-fuenteo de `/siento` y `/temas`: las 18 piezas vuelven a producción

Resuelve el pendiente que dejó D16. **No se perdió contenido**: se conservaron los 18 textos y se
cambió aquello que no tenía respaldo.

**Criterio de admisión de fuentes**, acordado con el responsable del proyecto: organismos oficiales
chilenos (MINSAL y sus divisiones), universidades, colegios profesionales y organismos
internacionales de referencia para las definiciones clínicas. Si la fuente está en inglés, se
publica traducida al español y la ficha lo declara.

**Qué se hizo.** Cada URL candidata se abrió y se leyó antes de citarla. El registro quedó así:

| Fuente                                                                   | Qué respalda                                                                                                                                                                                                                                                                      |
| ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MINSAL · Guía Clínica AUGE Depresión en personas de 15 años y más (2013) | definición operacional de depresión y el criterio de dos semanas; irritabilidad, pérdida de interés, culpa excesiva y cambio psicomotor entre los síntomas; recomendación de TCC, interpersonal, sistémica familiar y activación conductual; consulta en APS por síntomas físicos |
| OMS · Trastorno depresivo (depresión)                                    | cuadro depresivo y tratamientos psicológicos                                                                                                                                                                                                                                      |
| OMS · Trastornos de ansiedad                                             | miedo y preocupación intensos y excesivos; la TCC como intervención más avalada                                                                                                                                                                                                   |
| OMS · Salud mental                                                       | la salud mental como proceso continuo moldeado por determinantes que interactúan                                                                                                                                                                                                  |
| OMS · Estrés                                                             | definición de estrés y efectos del estrés prolongado                                                                                                                                                                                                                              |
| OMS · Burn-out an "occupational phenomenon" (CIE-11, 2019)               | definición de burn-out, sus tres dimensiones y que **no** está clasificado como condición médica                                                                                                                                                                                  |
| OMS · Comisión sobre Conexión Social (2025)                              | 1 de cada 6 personas afectadas por la soledad; el doble de probabilidad de depresión; la conexión social como factor protector                                                                                                                                                    |
| NIMH · El trastorno de pánico                                            | sensación de perder el control; síntomas físicos; duración del ataque                                                                                                                                                                                                             |
| NIMH · El trastorno de ansiedad generalizada                             | preocupación difícil de controlar por al menos seis meses; TCC como método de referencia; terapia de aceptación y compromiso                                                                                                                                                      |
| NHLBI (NIH) · Insomnia / Insomnia Treatment                              | criterio de insomnio crónico (3+ noches por semana, más de 3 meses); TCC-I como primera opción                                                                                                                                                                                    |
| MedlinePlus en español (NIH) · Pérdida de un ser querido                 | el duelo como reacción normal y su duración variable                                                                                                                                                                                                                              |
| MedlinePlus en español (NIH) · Dolor de pecho                            | el pánico como causa posible y cuándo pedir atención urgente                                                                                                                                                                                                                      |
| ChileAtiende · Plan AUGE-GES                                             | las cuatro garantías del régimen y cómo se activan                                                                                                                                                                                                                                |

**Afirmaciones que hubo que reescribir, no sólo re-citar.** Varias no eran sostenibles tal como
estaban y se ajustaron a lo que la fuente sí dice:

- el burnout se presentaba como un síndrome sin más; la OMS aclara que **no** está clasificado como
  condición médica y que el término se refiere sólo al ámbito laboral;
- «las crisis alcanzan su intensidad máxima en minutos y remiten por sí solas» pasó a «un ataque de
  pánico puede durar desde unos minutos hasta una hora, y a veces más» (NIMH);
- la afirmación de que la CIE-11 fija seis meses para el duelo prolongado se retiró: no fue posible
  leer la entrada de la CIE-11, que se sirve por JavaScript;
- la sección GES de `/temas/depresion` afirmaba copagos («0% para Fonasa mediante Copago Cero»); se
  reemplazó por las cuatro garantías tal como las publica ChileAtiende, sin cifras;
- en `/siento/tengo-miedo-a-perder-el-control` se retiraron las explicaciones de mecanismo sin
  fuente («descarga simpática», «la curva de adrenalina desciende inevitablemente») y la promesa
  médica «no provoca pérdida de la razón ni daño cerebral»;
- se quitó «alteran directamente la química cerebral» de `/siento/me-siento-mal-sin-saber-por-que`.

**Verificación.** Las 23 URLs citadas hoy en el sitio —contenido, `src/data/fuentes.ts`, recursos y
páginas— responden HTTP 200. Ninguna URL se cita como dos documentos distintos.

Las 18 piezas vuelven a `estadoEditorial: verificado-con-fuentes` con `verificadoEl: 2026-09-03` y
`proximaRevision: 2027-09-03`, y `/siento` y `/temas` vuelven al menú principal y al pie.

**Lo que sigue pendiente de la fase 3** es sólo el directorio comunal: los establecimientos de las
tres comunas piloto necesitan verificación humana ficha por ficha (Nivel B según D9), o bien
incorporar el registro DEIS como Nivel A real, sin inventarle pasos de acceso.

## Estado tras el re-fuenteo

```
lint · typecheck · 118 pruebas · build      en verde
51 páginas estáticas · 23/23 URLs citadas responden 200
```
