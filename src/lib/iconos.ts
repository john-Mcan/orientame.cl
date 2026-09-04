// Catálogo de iconos propios, en línea y monocromos. Nunca se usan emojis en la interfaz.
//
// Vive en un `.ts` y no dentro de `Icon.astro` porque el modelo de navegación
// (`src/data/navegacion.ts`) necesita el tipo `IconName` para declarar el icono de cada
// sección, y un `.astro` no es un origen de tipos fiable para el resto del código.
//
// Reglas del set: grilla de 24 px, trazo de 1.75, sin relleno y color heredado con
// `currentColor`. Un icono nuevo se dibuja con esas mismas reglas o desentona.

export const ICONOS = {
  'flecha-derecha': '<path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5"/>',
  'flecha-izquierda': '<path d="M20 12H5m0 0 5.5-5.5M5 12l5.5 5.5"/>',
  'chevron-derecha': '<path d="m9.5 5.5 6.5 6.5-6.5 6.5"/>',
  'chevron-abajo': '<path d="m5.5 9.5 6.5 6.5 6.5-6.5"/>',
  telefono:
    '<path d="M6.6 3.5h2.6l1.4 4-2 1.3a11 11 0 0 0 4.6 4.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2Z"/>',
  copiar:
    '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 5.5v-1a2 2 0 0 0-2-2h-7a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h1"/>',
  alerta: '<circle cx="12" cy="12" r="9.25"/><path d="M12 7v6m0 3v.75"/>',
  pregunta:
    '<circle cx="12" cy="12" r="9.25"/><path d="M9.4 9.4a2.7 2.7 0 1 1 3.8 2.5c-.8.4-1.2 1-1.2 1.9v.3"/><path d="M12 17.2v.6"/>',
  lupa: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.4-4.4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  cerrar: '<path d="m6 6 12 12M18 6 6 18"/>',
  brujula: '<circle cx="12" cy="12" r="9.25"/><path d="m15.4 8.6-2 4.8-4.8 2 2-4.8z"/>',
  mapa: '<path d="M12 20.8c3.9-3.9 5.9-7 5.9-9.4a5.9 5.9 0 0 0-11.8 0c0 2.4 2 5.5 5.9 9.4Z"/><circle cx="12" cy="11.1" r="2.3"/>',
  personas:
    '<circle cx="9.2" cy="8.4" r="3.4"/><path d="M3.6 19.6a5.6 5.6 0 0 1 11.2 0"/><path d="M16.2 5.5a3.4 3.4 0 0 1 0 5.8"/><path d="M17.9 14.5a5.6 5.6 0 0 1 2.9 5.1"/>',
  libro:
    '<path d="M4.6 5.4a1.9 1.9 0 0 1 1.9-1.9H19v13.3H6.5a1.9 1.9 0 0 0-1.9 1.9Z"/><path d="M4.6 18.7a1.9 1.9 0 0 0 1.9 1.8H19"/>',
  'lista-check':
    '<path d="m3.8 7.6 1.9 1.9 3.1-3.3"/><path d="m3.8 16.6 1.9 1.9 3.1-3.3"/><path d="M12.6 8h7.6M12.6 17h7.6"/>',
  corazon:
    '<path d="M12 20.2c-4.9-3.1-7.5-6.3-7.5-9.4a4.2 4.2 0 0 1 7.5-2.6 4.2 4.2 0 0 1 7.5 2.6c0 3.1-2.6 6.3-7.5 9.4Z"/>',
  calendario:
    '<rect x="3.75" y="5.4" width="16.5" height="14.85" rx="2"/><path d="M3.75 9.9h16.5M8.6 3.5v3.6M15.4 3.5v3.6"/>',
} as const;

export type IconName = keyof typeof ICONOS;
