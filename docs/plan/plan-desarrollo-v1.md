# Plan de desarrollo v1 — orientame.cl

Este plan convierte el [documento base de producto y construcción](./descripcion-inicial.md) en una secuencia de implementación de cinco etapas.

El documento base continúa siendo la fuente principal para propósito, alcance, seguridad, privacidad y gobernanza editorial. La [guía de estilos](./estilos.md) define la identidad visual que se aplicará durante la construcción.

## 1. Reglas de ejecución

### 1.1 Principios que se mantienen durante las cinco etapas

* estático primero, con Astro y TypeScript;
* JavaScript únicamente cuando una interacción aporta valor;
* sin cuentas, perfiles, backend de aplicación, base de datos ni IA generativa expuesta al usuario en la v1;
* respuestas sensibles procesadas localmente y no almacenadas por orientame.cl;
* contenido redactado inicialmente por agentes de IA, con fuentes enlazables y trazabilidad interna;
* publicación mediante verificación por fuentes o revisión clínica, según el riesgo de cada pieza;
* acceso persistente y directo a `/urgencia`;
* alternativas públicas, gratuitas y de bajo costo tratadas como rutas principales;
* WCAG 2.2 AA como objetivo mínimo;
* el logo canónico es [`public/orientame-logo.svg`](../../public/orientame-logo.svg);
* la dirección visual se basa en [`public/moodboard/estilo-colores.png`](../../public/moodboard/estilo-colores.png) y en la guía de estilos.

### 1.2 Calidad proporcional a la etapa

Durante las etapas 1 a 4, cada incremento debe terminar al menos con:

```text
lint
typecheck
build exitoso
revisión manual del recorrido modificado
```

Sólo se agregan pruebas automatizadas tempranas cuando un error pueda afectar scoring, urgencia, privacidad o acceso correcto a recursos. La suite E2E, las auditorías automatizadas amplias y el CI completo se incorporan en la etapa 5, cuando la estructura deje de cambiar de manera importante.

No se establece un porcentaje de coverage como objetivo de la v1.

### 1.3 Cambios descubiertos durante el desarrollo

Una restricción técnica o hallazgo de alcance puede modificar este plan. No se cambia silenciosamente el propósito del producto ni se amplía la v1 por conveniencia técnica.

Antes de aceptar un cambio relevante se documenta:

1. qué se descubrió;
2. qué parte del documento base afecta;
3. impacto en privacidad, seguridad, accesibilidad, contenido y mantenimiento;
4. alternativa más simple considerada;
5. decisión tomada;
6. archivos del plan que deben actualizarse.

## 2. Resultado esperado de la v1

Al terminar la quinta etapa debe existir una versión pública que permita:

* entrar por una experiencia cotidiana mediante `/siento/`;
* comenzar por una barrera mediante la portada o `/empezar`;
* comprender qué puede estar ocurriendo sin recibir un diagnóstico;
* conocer qué formas de ayuda tienen respaldo y cuál es el alcance de esa evidencia;
* encontrar recursos verificables en Chile, comenzando por tres comunas piloto y recursos nacionales;
* entender qué ocurre en una primera atención y contar con guiones simples para pedir ayuda;
* usar autoevaluaciones únicamente cuando fuente, licencia, scoring, interpretación y manejo de riesgo estén resueltos para publicación;
* acceder a información de urgencia sin JavaScript;
* navegar y completar los recorridos principales con teclado, lector de pantalla y dispositivos móviles;
* conocer las fuentes, fecha y método de verificación de cada contenido relevante.

Una pieza sensible que todavía no cumpla su nivel de revisión se excluye de producción sin impedir la publicación del resto del sitio.

---

# Etapa 1 — Base técnica, visual y editorial segura

## Resultado

Un sitio estático desplegable en preview, con identidad visual, estructura de contenido y páginas institucionales esenciales. Todavía no se busca cobertura amplia.

## Alcance de construcción

### Proyecto y despliegue

* inicializar Astro con TypeScript y salida estática;
* preparar el adaptador o configuración más simple para Cloudflare Workers Static Assets o Pages;
* definir scripts de `lint`, `typecheck` y `build`;
* configurar sitemap y metadatos base;
* impedir la indexación de previews y borradores;
* documentar variables y proceso de despliegue sin introducir un backend.

### Sistema visual

* implementar los tokens de [`estilos.md`](./estilos.md);
* integrar [`orientame-logo.svg`](../../public/orientame-logo.svg) sin modificar su geometría;
* incorporar tipografías locales o utilizar temporalmente los fallbacks definidos;
* construir `Base.astro`, encabezado, navegación, pie de página, botones, enlaces, avisos, tarjetas y contenedores de lectura;
* validar contraste, foco visible, zoom, reducción de movimiento y comportamiento responsive desde el inicio.

### Estructura editorial

* implementar Astro Content Collections y schemas iniciales para síntomas, temas, instrumentos, guías y acompañamiento;
* incluir `creadoConIA`, `revisionRequerida`, `estadoEditorial`, fuentes con URL, fechas y próxima revisión;
* permitir borradores en desarrollo y excluirlos de producción;
* implementar la validación básica de enlaces y campos obligatorios sin construir todavía la auditoría completa;
* crear una plantilla de contenido que haga trazable cada afirmación clínica o epidemiológica.

### Páginas base

* `/sobre`;
* `/metodologia`;
* `/legal/privacidad`;
* `/legal/alcance`;
* `/legal/terminos`;
* `/urgencia` completamente funcional sin JavaScript;
* acceso persistente a urgencia en todas las páginas.

El contenido de urgencia puede construirse desde fuentes oficiales. Cualquier protocolo que reaccione a respuestas o señales de riesgo conserva la clasificación de revisión clínica definida en el documento base.

## Verificación de la etapa

* `lint`, `typecheck` y `build` pasan;
* ninguna página borrador aparece en la salida de producción;
* `/urgencia` funciona con JavaScript deshabilitado;
* navegación por teclado y foco visible revisados manualmente;
* logo y paleta coinciden con la guía de estilos;
* no existen trackers publicitarios, fuentes remotas ni embeds innecesarios.

## Criterio de salida

Se puede desplegar un preview navegable, accesible y visualmente coherente que diferencia correctamente contenido borrador, verificado por fuentes y revisado clínicamente.

---

# Etapa 2 — Entrada y orientación de primer paso

## Resultado

Una persona puede llegar sin saber qué le ocurre, elegir la barrera que enfrenta y recibir en pocas decisiones un siguiente paso útil.

## Alcance de construcción

### Portada

* presentar la propuesta central sin diagnosticar ni asumir que toda persona necesita terapia;
* incorporar búsqueda visible por lo que la persona siente;
* mostrar rutas por barrera: no saber si pedir ayuda, dificultad para pedirla, dónde acudir, costo, preocupación por otra persona y urgencia;
* priorizar un único mensaje principal y evitar bloques promocionales propios de un producto comercial.

### `/empezar` y `Orientador`

* construir `Orientador.tsx` como island client-side;
* limitar cada recorrido a una a cuatro decisiones antes de ofrecer algo útil;
* trabajar con barreras, no con scoring clínico;
* mantener el estado local y no emitir solicitudes de red al responder;
* permitir volver, reiniciar y abandonar sin perder acceso al resto del sitio;
* ofrecer siempre una alternativa de menor compromiso.

### Componentes compartidos

* `AccesoUrgencia.astro`;
* `BloqueSiguientePaso.astro`;
* `GuionCopiable.astro` básico;
* breadcrumbs y navegación contextual;
* estados vacíos y mensajes de error en lenguaje claro.

### Preparación de medición

* marcar semánticamente los siguientes pasos significativos sin activar todavía seguimiento sensible;
* definir el evento agregado para contar únicamente la primera acción elegible por carga;
* excluir texto escrito, respuestas, resultados, slugs sensibles e identificadores persistentes.

## Verificación de la etapa

* recorridos manuales completos en móvil y escritorio;
* teclado y lector de pantalla revisados en portada y `/empezar`;
* prueba automatizada de que responder el orientador no genera solicitudes adicionales de red, si ya es técnicamente estable;
* comprobación de que todos los resultados conducen a una ruta existente o a un borrador explícitamente excluido de producción;
* `lint`, `typecheck` y `build` pasan.

## Criterio de salida

Los recorridos principales de portada y `/empezar` son utilizables de extremo a extremo, conservan la decisión del usuario y no procesan clínicamente sus respuestas.

---

# Etapa 3 — Contenido inicial y acceso a recursos

## Resultado

El producto deja de ser una estructura vacía: responde búsquedas reales, explica opciones y entrega rutas concretas de acceso en Chile.

## Alcance de construcción

### Contenido `/siento/` y `/temas/`

* crear entre 10 y 15 páginas `/siento/*` priorizadas por utilidad e intención de búsqueda;
* crear los primeros temas clínicos relacionados sin hacer equivaler síntoma y diagnóstico;
* aplicar la plantilla completa, incluido `quePuedeAyudar` y su alcance de evidencia;
* asociar cada afirmación relevante a una fuente con enlace verificable;
* clasificar cada pieza como `fuentes` o `clinica` y publicar sólo cuando alcance el estado correspondiente;
* mostrar fecha, método de verificación y próxima revisión.

### Primera vez

* `/primera-vez/`;
* `/primera-vez/que-pasa-en-sesion`;
* `/primera-vez/que-decir`;
* `/primera-vez/cuanto-cuesta`;
* `/primera-vez/como-elegir`;
* guiones copiables para contacto con servicios y conversación con alguien cercano.

### Piloto de `/donde/`

* modelar recursos nacionales y tres comunas piloto;
* incluir CESFAM, COSAM, clínicas universitarias, ONG y líneas pertinentes cuando existan fuentes verificables;
* registrar costo, requisitos, canales, pasos reales de acceso, fuente y fecha de verificación;
* construir `FichaRecurso.astro` y `SelloRevision.astro`;
* construir `ResourceFinder.tsx` con filtros locales por comuna, tipo, costo, audiencia y modalidad;
* evitar geolocalización obligatoria, mapas embebidos y ordenamiento comercial.

### SEO y estructura

* títulos, descripciones, canonical y datos estructurados sólo cuando correspondan;
* enlaces contextuales entre `/siento/`, `/temas/`, `/primera-vez/` y `/donde/`;
* URLs estables y contenido útil, sin generación masiva de páginas superficiales.

## Verificación de la etapa

* validación del schema y de URLs de fuentes;
* revisión manual de una muestra de afirmación → fuente;
* recursos con ruta de acceso real, no sólo nombre y dirección;
* filtros de recursos comprobados con casos representativos;
* páginas sin fuente o sin estado publicable excluidas de producción;
* `lint`, `typecheck` y `build` pasan.

## Criterio de salida

Una persona puede entrar por una consulta cotidiana, comprender opciones con respaldo y llegar a una ruta concreta de preparación o acceso en el piloto chileno.

---

# Etapa 4 — Herramientas, descubrimiento y cobertura de la v1

## Resultado

La versión candidata reúne las funcionalidades y colecciones previstas para la v1, sin convertir el sitio en una aplicación clínica.

## Alcance de construcción

### Autoevaluaciones

* implementar `Test.tsx` con funciones puras de scoring;
* incorporar el primer y segundo instrumento sólo después de verificar fuente, versión, licencia, población, scoring e interpretación;
* mantener respuestas y resultados en el navegador;
* no guardar resultados por defecto;
* ofrecer eliminación sencilla si se habilita almacenamiento local voluntario;
* mostrar resultado como orientación, nunca como diagnóstico;
* activar respuestas de riesgo únicamente si el protocolo aplicable cumple su revisión requerida.

Una autoevaluación que no esté lista puede permanecer fuera de producción sin impedir que continúe el resto de la v1.

### Búsqueda y descubrimiento

* integrar Pagefind después del build;
* construir `Buscador.tsx`;
* crear índices de `/siento/`, `/temas/` y `/autoevaluacion/`;
* mantener resultados normales cuando una regla revisada muestre acceso contextual a urgencia;
* no inferir crisis ni diagnóstico desde términos de búsqueda.

### Cobertura editorial

* completar rutas iniciales de `/acompanar/`;
* incorporar `/historias/` sólo con consentimiento, procedencia y reglas editoriales verificables;
* ampliar recursos, comunas, síntomas y temas según utilidad y capacidad real de mantenimiento;
* evitar comentarios, cuentas, chat, IA generativa y otras funciones post-v1.

### Pruebas críticas

* unit tests para scoring de instrumentos;
* unit tests para reglas de urgencia;
* unit tests para filtros críticos de recursos;
* pruebas de privacidad de las interacciones sensibles cuando sea técnicamente razonable.

## Verificación de la etapa

* instrumentos contrastados con ejemplos oficiales conocidos;
* búsqueda utilizable con teclado y sin resultados engañosos;
* reglas de urgencia deterministas y versionadas;
* ninguna interacción sensible realiza solicitudes de red inesperadas;
* contenido no verificable o fuera de alcance queda excluido;
* `lint`, `typecheck`, tests críticos y `build` pasan.

## Criterio de salida

Existe una candidata a v1 funcionalmente completa. La estructura deja de cambiar de manera significativa y puede comenzar el endurecimiento final.

---

# Etapa 5 — Endurecimiento, verificación y publicación

## Resultado

Una v1 pública, verificable, accesible, mantenible y con medición agregada suficiente para decidir si los recorridos cumplen su función.

## Alcance de construcción

### Contenido y gobernanza

* consolidar fuentes, enlaces y metadatos;
* verificar editorialmente el contenido clasificado como `fuentes`;
* obtener revisión clínica únicamente para las piezas clasificadas como `clinica` que se decida publicar;
* excluir automáticamente cualquier pieza que no cumpla su estado requerido;
* revisar marco legal, privacidad y licencias aplicables;
* publicar `/metodologia` con una explicación clara del uso de IA y las dos vías de verificación.

### Calidad técnica final

* completar tests de integración o E2E para `/empezar`, búsqueda, recursos, urgencia, navegación principal y autoevaluaciones publicadas;
* auditar enlaces rotos;
* auditar WCAG 2.2 AA con herramientas automáticas y revisión manual;
* verificar schemas, contenido sin fuentes, recursos vencidos y estados editoriales;
* comprobar que formularios sensibles no generan solicitudes de red adicionales;
* crear CI completo para lint, typecheck, tests y build;
* implementar `audit-resources.ts` y `validate-content.ts` o equivalentes;
* revisar CSP, Referrer-Policy, encabezados de seguridad y dependencias remotas.

### Rendimiento y SEO

* revisar Core Web Vitals y presupuesto de JavaScript;
* comprobar sitemap, canonical, robots y metadatos sociales;
* ejecutar Pagefind únicamente sobre contenido publicable;
* optimizar imágenes y fuentes locales;
* probar móvil, escritorio, zoom y preferencias de movimiento reducido.

### Analytics y criterio de decisión

* habilitar únicamente medición agregada compatible con la política de privacidad;
* comprobar páginas visitadas, rutas de entrada, búsquedas, errores, rendimiento y clicks de salida permitidos;
* implementar el proxy de inicio de siguiente paso desde `/siento/` sin identificadores persistentes;
* documentar el umbral inicial: 10%, 28 días y al menos 500 cargas elegibles;
* preparar el procedimiento para pausar expansión, revisar y reescribir cuando se cruce el umbral.

### Publicación

* desplegar en Cloudflare con HTTPS y dominio definitivo;
* realizar smoke test posterior al despliegue;
* confirmar que previews y borradores continúan fuera de índices y producción;
* registrar fecha de publicación y responsables operacionales;
* establecer la primera revisión programada de recursos y contenidos.

## Verificación de la etapa

```text
lint
typecheck
unit tests críticos
integration/E2E de recorridos principales
build de producción
auditoría de accesibilidad
auditoría de enlaces y contenido
smoke test en producción
```

No se exige una matriz exhaustiva de navegadores ni coverage total. La profundidad de las pruebas se concentra en recorridos y fallos con consecuencias relevantes.

## Criterio de salida

La v1 está publicada, sus piezas cumplen el nivel de verificación que les corresponde y existe una regla previamente acordada para decidir cuándo revisar la hipótesis principal de `/siento/`.

---

# 3. Fuera de estas cinco etapas

Permanecen fuera de la v1:

```text
cuentas y perfiles
login
backend de aplicación
base de datos de usuarios
chat o terapeuta de IA
comentarios comunitarios
mensajería
calendario y recordatorios
notificaciones
marketplace
pagos
ficha clínica
seguimiento terapéutico
CMS
directorio masivo de profesionales privados
```

Su incorporación futura requiere una nueva evaluación de necesidad, privacidad, seguridad, mantenimiento y coherencia con el propósito de orientame.cl.
