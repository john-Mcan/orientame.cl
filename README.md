# orientame.cl

<p align="center">
  <img src="public/orientame-logo.svg" alt="orientame.cl" width="240">
</p>

**orientame.cl** es una plataforma digital, estática y sin fines de lucro orientada inicialmente a
Chile. Busca ayudar a una persona a entender sus opciones de salud mental y facilitar un siguiente
paso posible, si decide darlo.

Ese paso puede ser informarse, conocer cómo funciona una primera atención, preparar qué decir,
encontrar una alternativa pública o de bajo costo, usar una autoevaluación orientativa o detenerse y
volver después.

> [!IMPORTANT]
> orientame.cl no presta atención psicológica, no diagnostica, no reemplaza una evaluación o un
> tratamiento profesional y no es un servicio de crisis. La información de urgencia se ofrece como
> un acceso directo que la persona elige, no como una conclusión automática del sistema.

## Estado del proyecto

El proyecto se encuentra en desarrollo. La fase 4 está implementada, salvo los testimonios —que no
se publicarán sin consentimiento y procedencia documentados—, y aún quedan tareas de verificación y
endurecimiento previas al lanzamiento.

Actualmente incluye:

- un orientador de primer paso basado en rutas estáticas;
- contenido para entrar por una vivencia cotidiana o por un tema de salud mental;
- guías sobre una primera atención y sobre cómo acompañar a otra persona;
- búsqueda estática;
- autoevaluaciones que se procesan en el navegador;
- un piloto de recursos de atención en tres comunas de la Región Metropolitana;
- acceso persistente a información de urgencia, utilizable sin JavaScript;
- páginas públicas de metodología, alcance, privacidad y términos.

El estado detallado, incluidos los bloqueos y las verificaciones pendientes, está en
[`docs/pendientes.md`](docs/pendientes.md). El borrador del protocolo de crisis no está aprobado y no
activa ninguna lógica de respuesta.

## Principios del producto

- **No diagnosticamos.** El contenido explica opciones sin concluir qué tiene o qué necesita una
  persona.
- **La persona conserva la decisión.** No se presiona, culpa ni persuade mediante miedo.
- **Siempre existe un paso de menor compromiso.** Detenerse y volver después también es una opción
  válida.
- **Privacidad por arquitectura.** No hay cuentas, base de datos de usuarios ni almacenamiento en
  servidores de las respuestas entregadas en las herramientas.
- **La crisis no se delega a IA.** No hay chatbot de crisis, evaluación automática de riesgo ni
  decisiones generativas.
- **Las afirmaciones sensibles son trazables.** El conocimiento general de un modelo de IA no es una
  fuente publicable.
- **Sin incentivos ocultos.** Los recursos no se ordenan por pago y no existen comisiones por
  derivación.
- **Accesibilidad desde el diseño.** El objetivo mínimo es WCAG 2.2 AA.

La fuente de verdad sobre propósito, alcance, seguridad, privacidad y gobernanza editorial es el
[`documento base de producto y construcción`](docs/plan/descripcion-inicial.md).

## Tecnología y arquitectura

- [Astro](https://astro.build/) y TypeScript;
- salida completamente estática;
- Content Collections para contenido editorial;
- Preact sólo en interacciones que necesitan estado en el navegador;
- Pagefind para búsqueda estática generada durante el build;
- despliegue como activos estáticos en Cloudflare;
- fuentes y recursos locales, sin CDN, scripts remotos ni trackers publicitarios.

La v1 no tiene backend de aplicación, autenticación, cuentas, perfiles, base de datos, pagos, chat ni
IA generativa expuesta a quien usa el sitio.

## Desarrollo local

Necesitas Node.js, npm y una versión compatible con las dependencias registradas en
`package-lock.json`.

```bash
npm ci
npm run dev
```

Astro mostrará en la terminal la dirección local del sitio. Las variables disponibles están
documentadas en [`.env.example`](.env.example); para desarrollo local pueden conservar sus valores
de preview.

Comandos principales:

```bash
npm run dev        # servidor de desarrollo
npm run format     # aplica el formato del repositorio
npm run check      # lint, formato, tipos, build y pruebas
npm run build      # genera el sitio y el índice de Pagefind en dist/
npm run preview    # sirve localmente el build generado
```

`PUBLIC_SITE_ENV=production` se reserva para el dominio público definitivo. Cualquier otro valor
mantiene los previews fuera de los índices de búsqueda.

## Estructura del repositorio

```text
src/
├── components/       componentes Astro y Preact
├── content/          contenido editorial
├── data/             navegación, fuentes y recursos
├── layouts/          layouts compartidos
├── lib/              reglas editoriales y lógica de dominio
├── pages/            rutas estáticas
└── styles/           estilos y tokens globales
docs/
├── plan/             definición, planes y decisiones del producto
└── pendientes.md     trabajo pendiente y bloqueos conocidos
public/                activos y encabezados de seguridad
scripts/               tareas de build y mantenimiento
tests/                 pruebas de límites clínicos y técnicos críticos
```

## Cómo contribuir

Este repositorio trata información de salud. Un cambio que parece pequeño puede alterar el alcance
de una afirmación, presionar a alguien que está pasando por un momento difícil o dejar un recorrido
sin salida. Antes de trabajar:

1. Lee [`AGENTS.md`](AGENTS.md) y [`docs/pendientes.md`](docs/pendientes.md).
2. Para decisiones de alcance, consulta el
   [`documento base`](docs/plan/descripcion-inicial.md) y el
   [`plan de desarrollo`](docs/plan/plan-desarrollo-v1.md).
3. Si modificas contenido, sigue la
   [`plantilla de contenido`](docs/plan/plantilla-contenido.md) y su trazabilidad editorial.
4. Abre y comprueba cada fuente antes de citarla. No inventes referencias, credenciales, cifras ni
   consensos.
5. Documenta antes de aceptar cualquier cambio relevante de propósito, alcance o gobernanza,
   siguiendo el procedimiento del plan de desarrollo.
6. Ejecuta `npm run format` y luego `npm run check`.
7. Revisa manualmente el recorrido modificado en escritorio y móvil, incluida la navegación por
   teclado cuando corresponda.

No se deben incorporar diagnósticos, recomendaciones personalizadas, promesas de resultados,
preguntas que evalúen riesgo, lenguaje que asuma género ni afirmaciones clínicas o epidemiológicas
sin respaldo verificable.

## Documentación clave

- [Descripción inicial](docs/plan/descripcion-inicial.md): propósito, alcance y principios
  innegociables.
- [Plan de desarrollo v1](docs/plan/plan-desarrollo-v1.md): etapas, criterios de salida y proceso de
  cambios.
- [Guía visual y de estilos](docs/plan/estilos.md): identidad, componentes y accesibilidad.
- [Plantilla de contenido](docs/plan/plantilla-contenido.md): estructura y trazabilidad editorial.
- [Decisiones de fase 2](docs/plan/fase-2-decisiones.md),
  [fase 3](docs/plan/fase-3-decisiones.md) y [fase 4](docs/plan/fase-4-decisiones.md).
- [Revisión de guías de fase 4](docs/plan/fase-4-revision-guias.md): decisiones editoriales más
  recientes.

## Privacidad y seguridad

Las respuestas entregadas en las herramientas de orientación se procesan en el dispositivo de la
persona y orientame.cl no las almacena en sus servidores. Como en cualquier sitio web, la navegación
sí implica solicitudes técnicas a la infraestructura que lo sirve.

El sitio aplica una política de seguridad de contenido estricta, no carga dependencias remotas y
restringe capacidades del navegador que no necesita. Los detalles públicos se encuentran en
[`public/_headers`](public/_headers) y en las páginas de privacidad y metodología del sitio.

## Licencia

Este repositorio todavía no declara una licencia. Que su contenido sea visible públicamente no
concede por sí solo permiso para usarlo, modificarlo o redistribuirlo. La licencia del código, el
contenido editorial y los recursos de terceros debe definirse antes de promover su reutilización.
