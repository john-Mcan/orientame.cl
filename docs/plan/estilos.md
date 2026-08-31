# Guía visual y de estilos — orientame.cl

Esta guía traduce la atmósfera de [`public/moodboard/estilo-colores.png`](../../public/moodboard/estilo-colores.png) a un sistema visual propio para orientame.cl.

El moodboard es una referencia de color, suavidad, composición y tono. No se copian su marca, ilustraciones, navegación corporativa, login ni llamados comerciales. orientame.cl no tiene cuentas y su interfaz debe sentirse como una orientación tranquila, no como un SaaS de bienestar.

El logo canónico del proyecto es [`public/orientame-logo.svg`](../../public/orientame-logo.svg).

## 1. Tesis visual

> **Una ruta clara en un momento confuso.**

La interfaz debe sentirse serena, humana y precisa. No intenta parecer un hospital, una aplicación de meditación ni una marca infantil. Reduce ruido, muestra opciones comprensibles y deja siempre visible una salida de menor compromiso.

La identidad toma del moodboard:

* verde profundo como color de orientación y acción;
* superficies gris-verdosas claras;
* abundante espacio blanco;
* tipografía sans serif directa;
* contenedores amplios con esquinas suaves;
* ilustración orgánica utilizada con moderación.

## 2. Elemento distintivo

El recurso visual propio será la **línea de orientación**: un trazo fino con uno o más nodos que conecta opciones o etapas reales de un recorrido.

Puede utilizarse en:

* breadcrumbs;
* resultados del orientador;
* bloques de siguiente paso;
* explicación de rutas de acceso a un servicio;
* secuencias como “entender → preparar → contactar”.

No se utiliza como decoración de fondo. Cada nodo debe corresponder a una opción, estado o paso real. En móvil puede transformarse en una línea vertical.

```text
Entender  ─────  Prepararme  ─────  Contactar
   ●                 ○                  ○
```

Éste es el único gesto gráfico que debe llamar especialmente la atención. El resto del sistema se mantiene silencioso.

## 3. Paleta

Los colores se inspiran en el moodboard y parten del verde exacto del logo (`#004D37`). Deben implementarse como tokens, no repetirse como valores sueltos en componentes.

| Token | Hex | Uso principal |
|---|---:|---|
| `green-900` | `#004D37` | Logo, acciones primarias, títulos destacados |
| `green-700` | `#176B55` | Hover, enlaces y estados activos |
| `sage-400` | `#86AD9D` | Línea de orientación, bordes destacados, gráficos no críticos |
| `mist-100` | `#E4EEEA` | Encabezado, bandas y superficies suaves |
| `mist-50` | `#F3F7F5` | Fondos secundarios y estados neutros |
| `paper` | `#FCFDFC` | Fondo general y tarjetas sobre superficies suaves |
| `ink-900` | `#16211D` | Texto principal |
| `ink-600` | `#4B5B54` | Texto secundario |
| `line` | `#C8D7D1` | Divisores y bordes |
| `focus` | `#C4511D` | Anillo de foco; acento cálido reservado |
| `urgent-700` | `#9B2C2C` | Urgencia y peligro real |
| `urgent-50` | `#FFF1F1` | Fondo de avisos urgentes |

### Reglas de color

* `green-900` sobre blanco o `paper` es la combinación principal de marca.
* Los botones primarios utilizan fondo `green-900` y texto blanco.
* `sage-400`, `mist-100` y `line` no se utilizan como color único para texto esencial.
* El naranja `focus` se reserva al foco de teclado y detalles funcionales pequeños; no compite con el verde de marca.
* El rojo se reserva para urgencia, errores destructivos o peligro. No se usa para aumentar artificialmente la conversión.
* Ningún significado depende exclusivamente del color.

## 4. Tipografía

La tipografía del moodboard es **Inter**, una familia sans serif. orientame.cl la adopta como familia principal para conservar esa dirección visual directa, contemporánea y legible.

### Familia principal

* **Encabezados:** Inter, pesos 600 y 700.
* **Cuerpo e interfaz:** Inter, pesos 400 y 500; peso 700 cuando sea necesario enfatizar.
* **Datos o código visible:** la pila monoespaciada del sistema, sólo cuando el contenido realmente sea técnico.

Inter debe alojarse localmente en formato WOFF2, idealmente como fuente variable para evitar archivos innecesarios, y conservar su licencia. No se carga desde Google Fonts u otro tercero. Mientras no esté incorporada, se utilizan estos fallbacks:

```css
--font-heading: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--font-body: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
--font-mono: ui-monospace, "Cascadia Code", "SFMono-Regular", monospace;
```

### Escala recomendada

```css
--text-xs: 0.8125rem;
--text-sm: 0.9375rem;
--text-base: 1.0625rem;
--text-lg: 1.25rem;
--text-xl: clamp(1.5rem, 2vw, 1.875rem);
--text-2xl: clamp(2.5rem, 2.5vw + 1rem, 3.25rem);
```

### Reglas tipográficas

* cuerpo entre 17 y 18 px en escritorio y móvil;
* altura de línea aproximada de 1.6 para lectura;
* longitud recomendada de 55 a 72 caracteres por línea;
* títulos con interlineado compacto, nunca comprimido;
* mayúsculas sostenidas sólo en etiquetas breves y no como recurso frecuente;
* no utilizar pesos menores a 400;
* enlaces reconocibles sin depender únicamente de un cambio sutil de color.

## 5. Logo

[`orientame-logo.svg`](../../public/orientame-logo.svg) es un símbolo verde de formato cuadrado. En el encabezado se combina con el nombre `orientame.cl` como texto HTML, evitando rasterizar un wordmark nuevo.

### Uso

* conservar el color `#004D37` y la proporción original;
* tamaño recomendado en encabezado: 36–44 px;
* área libre mínima: 25% del ancho visible del símbolo;
* sobre fondos claros o blancos;
* el enlace completo debe llevar a la portada;
* si el texto `orientame.cl` está visible junto al símbolo, el SVG puede usar `alt=""`; si aparece solo, debe tener un nombre accesible equivalente a “orientame.cl”.

### No hacer

* no deformar, rotar ni añadir sombras;
* no colocar dentro de otro círculo;
* no recolorear por sección;
* no animar continuamente;
* no utilizarlo como marca de aprobación clínica.

## 6. Composición y layout

### Contenedores

```css
--page-max: 75rem;      /* 1200 px */
--reading-max: 45rem;   /* 720 px */
--gutter: clamp(1rem, 4vw, 2rem);
```

* las páginas de lectura utilizan `reading-max`;
* buscadores, recursos y portada pueden utilizar `page-max`;
* el fondo general es `paper` o blanco;
* las bandas `mist-100` separan decisiones importantes, no cada sección;
* se evita centrar párrafos largos;
* el contenido esencial aparece antes que ilustraciones o elementos decorativos.

### Espaciado

Escala basada en múltiplos de cuatro:

```css
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;
--space-12: 3rem;
--space-16: 4rem;
--space-24: 6rem;
```

### Esquinas y profundidad

```css
--radius-sm: 0.5rem;
--radius-md: 0.875rem;
--radius-lg: 1.25rem;
```

* botones y campos: `radius-sm`;
* tarjetas: `radius-md`;
* bloques principales de portada: `radius-lg`;
* sombras muy suaves únicamente cuando una tarjeta necesita separarse de otra superficie;
* preferir borde `line` y contraste de fondo antes que sombras grandes.

## 7. Estructuras principales

### Encabezado

```text
┌────────────────────────────────────────────────────────────┐
│ [símbolo] orientame.cl   Siento  Temas  Dónde  Primera vez │
│                                      [Necesito ayuda ahora] │
└────────────────────────────────────────────────────────────┘
```

En móvil, la urgencia permanece como acción visible y la navegación secundaria puede entrar en un menú accesible. No existen “Iniciar sesión” ni “Crear cuenta”.

### Portada

```text
┌────────────────────────────────────────────────────────────┐
│ No tienes que saber qué te pasa para empezar.              │
│ Texto breve y directo.                                     │
│ [ Buscar algo que estoy sintiendo…                    ]     │
│                                                            │
│ ¿Qué necesitas hoy?                                        │
│ [barrera] [barrera] [barrera]                              │
└────────────────────────────────────────────────────────────┘

             línea de orientación / siguientes pasos

       recursos públicos · primera vez · acompañar
```

El hero es una entrada, no una promesa publicitaria. La búsqueda y las barreras dominan la composición.

### Página `/siento/`

```text
breadcrumb
H1 en lenguaje cotidiano
explicación breve

[ cuándo prestarle atención ]
[ qué puede ayudar y alcance de la evidencia ]

contenido principal en columna de lectura

[ tu siguiente paso puede ser… ]
fuentes · fecha · método de verificación
```

La fecha y las fuentes son visibles sin competir con el contenido principal.

## 8. Componentes

### Botones

* primario: fondo `green-900`, texto blanco;
* secundario: fondo transparente, borde `green-900`, texto `green-900`;
* terciario: enlace subrayado con indicador direccional;
* urgencia: tratamiento específico con `urgent-700`, nunca el mismo estilo del CTA comercial;
* altura mínima de 44 px y etiqueta que describa la acción.

No usar más de una acción primaria por bloque.

### Tarjetas de barrera

* texto directo en primera persona;
* superficie blanca o `mist-50` con borde;
* icono opcional y siempre secundario al texto;
* toda la tarjeta puede ser clickeable si conserva foco y semántica de enlace;
* hover discreto: cambio de borde y desplazamiento máximo de 1 px.

### Bloque de siguiente paso

Utiliza la línea de orientación y presenta:

1. una acción útil de menor fricción;
2. una alternativa si la persona todavía no quiere realizarla;
3. una salida clara para seguir leyendo o volver después.

### Fuentes y sello de verificación

El sello comunica proceso, no autoridad decorativa.

Ejemplos:

```text
Verificado con fuentes · 18 ago 2026
Revisado clínicamente · 18 ago 2026
Próxima revisión · feb 2027
```

No utilizar escudos, medallas ni símbolos que sugieran certificación institucional inexistente.

### Formularios y filtros

* label siempre visible;
* instrucciones antes del control;
* error junto al campo y resumen cuando corresponda;
* no depender de placeholder;
* selección de comuna manual por defecto;
* botones de reinicio y eliminación con nombres explícitos.

## 9. Imágenes e ilustración

El moodboard utiliza acuarela verde y figuras humanas. Si la v1 incorpora ilustraciones, deben seguir estas reglas:

* paleta verde, azul verdoso y papel;
* textura ligera de acuarela o tinta, sin ocupar el fondo completo de lectura;
* diversidad de edades, cuerpos y contextos chilenos sin estereotipos;
* evitar representar siempre a una persona con bata como autoridad salvadora;
* evitar caras con angustia exagerada, cerebros luminosos, manos sosteniendo corazones y otros clichés de salud mental;
* no utilizar una imagen cuando el contenido y la orientación funcionan mejor solos;
* `alt` describe información útil; las imágenes decorativas usan `alt=""`.

La v1 no depende de producir nuevas ilustraciones para estar completa.

## 10. Movimiento

* transiciones entre 120 y 180 ms para hover, foco y expansión;
* no usar scroll-jacking, parallax ni animación ambiental continua;
* los resultados del orientador pueden aparecer mediante una transición corta de opacidad y desplazamiento;
* respetar `prefers-reduced-motion` y eliminar desplazamientos cuando esté activo;
* nunca animar el acceso a urgencia de forma intermitente.

## 11. Voz dentro de la interfaz

* español claro y directo, pensado inicialmente para Chile;
* voz activa y frases breves;
* controles nombrados por lo que hacen: “Ver opciones”, “Copiar mensaje”, “Elegir comuna”;
* no utilizar lenguaje promocional, culpa o urgencia artificial;
* no asumir diagnóstico, género, capacidad de pago ni disposición a terapia;
* errores que expliquen qué ocurrió y qué puede hacer la persona;
* mantener la misma palabra para una acción durante todo el recorrido.

## 12. Accesibilidad y responsive

Objetivo mínimo: WCAG 2.2 AA.

* navegación completa por teclado;
* orden de foco coherente;
* anillo de foco de al menos 2 px con separación visible;
* targets mínimos de 44 × 44 px;
* zoom de 200% sin pérdida de información ni acciones;
* reflow a 320 px sin desplazamiento horizontal para contenido normal;
* headings jerárquicos y landmarks semánticos;
* mensajes dinámicos anunciados cuando corresponda;
* tablas transformadas o desplazables sin ocultar información;
* contraste revisado en estados normal, hover, foco, disabled y error;
* `/urgencia` completamente utilizable sin JavaScript.

Breakpoints orientativos, no dependencias rígidas:

```css
--bp-sm: 30rem;
--bp-md: 48rem;
--bp-lg: 64rem;
--bp-xl: 75rem;
```

Los componentes deben responder al espacio disponible; no se diseña una versión móvil separada.

## 13. Tokens iniciales

```css
:root {
  color-scheme: light;

  --color-green-900: #004d37;
  --color-green-700: #176b55;
  --color-sage-400: #86ad9d;
  --color-mist-100: #e4eeea;
  --color-mist-50: #f3f7f5;
  --color-paper: #fcfdfc;
  --color-ink-900: #16211d;
  --color-ink-600: #4b5b54;
  --color-line: #c8d7d1;
  --color-focus: #c4511d;
  --color-urgent-700: #9b2c2c;
  --color-urgent-50: #fff1f1;

  --font-heading: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  --font-body: "Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  --page-max: 75rem;
  --reading-max: 45rem;
  --gutter: clamp(1rem, 4vw, 2rem);

  --radius-sm: 0.5rem;
  --radius-md: 0.875rem;
  --radius-lg: 1.25rem;

  --focus-ring: 0 0 0 3px var(--color-focus);
}
```

Los nombres pueden adaptarse a la arquitectura CSS final, pero la intención semántica y la jerarquía de uso deben conservarse.

## 14. Lista de aceptación visual

Antes de considerar estable una pantalla:

* utiliza el logo correcto y no crea una variante improvisada;
* deriva colores, tipografía, radios y espacios de tokens;
* tiene un único foco visual principal;
* permite identificar el siguiente paso sin leer toda la página;
* no parece una interfaz de cuentas, telemedicina o SaaS corporativo;
* no utiliza decoraciones que sugieran autoridad clínica inexistente;
* funciona a 320 px, con teclado, zoom y movimiento reducido;
* conserva visible el acceso a urgencia;
* muestra fuente y método de verificación cuando el contenido lo requiere;
* cumple contraste AA en texto y controles.
