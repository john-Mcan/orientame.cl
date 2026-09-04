// Registro de fuentes verificables.
//
// Toda afirmación sobre el sistema de salud chileno que aparezca en la interfaz debe
// referenciar al menos un id de este registro. La regla equivale a `afirmacionesTrazables`
// del schema de contenido, aplicada a los datos que no viven en una content collection.
//
// Antes de agregar una fuente: abrir la URL y comprobar que respalda exactamente la
// afirmación asociada, conservando población, condiciones y alcance.

export interface Fuente {
  readonly id: string;
  readonly titulo: string;
  readonly organizacion: string;
  readonly url: string;
  /** Fecha ISO en que se abrió la URL y se comprobó la afirmación. */
  readonly consultadoEl: string;
}

export const fuentes: readonly Fuente[] = [
  {
    id: 'chileatiende-atencion-fonasa',
    titulo: 'Accede a atención de salud a través de Fonasa',
    organizacion: 'ChileAtiende · Gobierno de Chile',
    url: 'https://www.chileatiende.gob.cl/momentos-de-vida/acceder+a+salud+p%C3%BAblica/accede+a+atenci%C3%B3n+de+salud+a+trav%C3%A9s+de+fonasa',
    consultadoEl: '2026-09-01',
  },
  {
    id: 'chileatiende-salud-responde',
    titulo: 'Salud Responde',
    organizacion: 'ChileAtiende · Gobierno de Chile',
    url: 'https://www.chileatiende.gob.cl/fichas/2467-salud-responde',
    consultadoEl: '2026-09-01',
  },
  {
    id: 'chileatiende-auge-ges',
    titulo: 'Plan AUGE-GES',
    organizacion: 'ChileAtiende · Gobierno de Chile',
    url: 'https://www.chileatiende.gob.cl/fichas/2464',
    consultadoEl: '2026-09-01',
  },
  {
    id: 'minsal-linea-4141',
    titulo: 'Línea de Prevención del Suicidio *4141: No Estás Solo, No Estás Sola',
    organizacion: 'Ministerio de Salud · Gobierno de Chile',
    url: 'https://www.minsal.cl/linea-de-atencion-4141-no-estas-solo-no-estas-sola/',
    consultadoEl: '2026-09-03',
  },
  {
    id: 'senda-fono-1412',
    titulo: 'Fono Drogas y Alcohol 1412',
    organizacion:
      'Servicio Nacional para la Prevención y Rehabilitación del Consumo de Drogas y Alcohol (SENDA)',
    url: 'https://www.senda.gob.cl/informacion-sobre-drogas/fono-drogas-y-alcohol-1412/',
    consultadoEl: '2026-09-01',
  },
  {
    id: 'deis-registro-establecimientos',
    titulo: 'Establecimientos de Salud Vigentes',
    organizacion:
      'Departamento de Estadísticas e Información de Salud (DEIS) · Ministerio de Salud',
    url: 'https://datos.gob.cl/en/dataset/establecimientos-de-salud-vigentes/resource/2c44d782-3365-44e3-aefb-2c8b8363a1bc',
    consultadoEl: '2026-09-03',
  },
  {
    id: 'sis-registro-prestadores',
    titulo: 'Registro Nacional de Prestadores Individuales de Salud',
    organizacion: 'Superintendencia de Salud · Gobierno de Chile',
    url: 'https://rnpi.superdesalud.gob.cl/',
    consultadoEl: '2026-09-03',
  },
];

// Retiradas en la auditoría de fase 3 (2026-09-03) porque su URL no resuelve y por tanto
// ninguna afirmación puede comprobarse contra ellas:
//   fonasa-copago-cero      → fonasa.cl/sites/fonasa/beneficiarios/copago-cero (404)
//   minsal-salud-mental-aps → minsal.cl/portal/url/item/722232c2560882e3e04001011f0169dc.pdf (404)
// `sis-registro-prestadores` se conservó con la URL correcta del registro (rnpi.superdesalud.gob.cl);
// la que se había publicado antes respondía 404.
// No se reemplazan por una URL adivinada: se vuelven a agregar cuando alguien abra la página
// oficial correcta y confirme que respalda la afirmación asociada.

const fuentePorId = new Map(fuentes.map((f) => [f.id, f]));

export function getFuente(id: string): Fuente | undefined {
  return fuentePorId.get(id);
}

/** Resuelve ids a fuentes, sin duplicados y en el orden en que aparecen. */
export function resolverFuentes(ids: readonly string[]): Fuente[] {
  const vistos = new Set<string>();
  const resultado: Fuente[] = [];

  for (const id of ids) {
    if (vistos.has(id)) continue;
    const fuente = fuentePorId.get(id);
    if (fuente) {
      vistos.add(id);
      resultado.push(fuente);
    }
  }

  return resultado;
}

/** Formato corto en español para mostrar junto a una fuente. */
export function formatearFecha(iso: string): string {
  const meses = [
    'ene',
    'feb',
    'mar',
    'abr',
    'may',
    'jun',
    'jul',
    'ago',
    'sep',
    'oct',
    'nov',
    'dic',
  ];
  const [anio, mes, dia] = iso.split('-').map(Number);
  return `${dia} ${meses[mes - 1]} ${anio}`;
}
