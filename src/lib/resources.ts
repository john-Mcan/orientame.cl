import recursosData from '../data/recursos.json' with { type: 'json' };

export type TipoRecurso =
  'cesfam' | 'cecosf' | 'cosam' | 'hospital' | 'clinica-universitaria' | 'ong' | 'linea' | 'otro';

export type CostoRecurso = 'gratuito' | 'segun-tramo' | 'bajo' | 'variable' | 'desconocido';

export type ModalidadRecurso = 'presencial' | 'remoto' | 'hibrido';

export type CanalRecurso = 'presencial' | 'telefono' | 'web' | 'videollamada' | 'email';

export type EstadoRecurso = 'verificado' | 'requiere-revision' | 'no-disponible';

export interface FuenteRecurso {
  nombre: string;
  url?: string;
  tipo: 'oficial' | 'institucional' | 'contacto-directo' | 'otra';
  consultadoEl: string;
}

export interface Recurso {
  id: string;
  nombre: string;
  tipo: TipoRecurso;
  region?: string;
  regionSlug?: string;
  comuna?: string;
  comunaSlug?: string;
  direccion?: string;
  telefono?: string;
  telefonoMarcar?: string;
  web?: string;
  costo: CostoRecurso;
  rangoPrecio?: string;
  requisitos: string[];
  canales: CanalRecurso[];
  modalidad: ModalidadRecurso;
  pasosAcceso: string[];
  horarios?: string;
  audiencias: string[];
  notas?: string;
  estado: EstadoRecurso;
  nivel: 'A' | 'B';
  fuente: FuenteRecurso;
  verificadoPor?: string;
  verificadoEl?: string;
  proximaRevision?: string;
}

export interface ComunaPiloto {
  nombre: string;
  slug: string;
  region: string;
  regionSlug: string;
  descripcion: string;
}

export const COMUNAS_PILOTO: readonly ComunaPiloto[] = [
  {
    nombre: 'Santiago',
    slug: 'santiago',
    region: 'Metropolitana',
    regionSlug: 'metropolitana',
    descripcion: 'Establecimientos vigentes reproducidos del registro oficial DEIS/MINSAL.',
  },
  {
    nombre: 'Providencia',
    slug: 'providencia',
    region: 'Metropolitana',
    regionSlug: 'metropolitana',
    descripcion: 'Establecimientos vigentes reproducidos del registro oficial DEIS/MINSAL.',
  },
  {
    nombre: 'Puente Alto',
    slug: 'puente-alto',
    region: 'Metropolitana',
    regionSlug: 'metropolitana',
    descripcion: 'Establecimientos vigentes reproducidos del registro oficial DEIS/MINSAL.',
  },
];

export const recursos: readonly Recurso[] = recursosData as Recurso[];

export function getRecursoPorId(id: string): Recurso | undefined {
  return recursos.find((r) => r.id === id);
}

export function getRecursos(): readonly Recurso[] {
  return recursos;
}

export function getRecursosNacionales(): Recurso[] {
  return recursos.filter((r) => r.tipo === 'linea' || !r.comunaSlug);
}

export function getRecursosPorComuna(regionSlug: string, comunaSlug: string): Recurso[] {
  return recursos.filter((r) => r.regionSlug === regionSlug && r.comunaSlug === comunaSlug);
}

export function getRecursosClinicasUniversitarias(): Recurso[] {
  return recursos.filter((r) => r.tipo === 'clinica-universitaria');
}

export interface FiltrosRecursos {
  comuna?: string;
  tipo?: string;
  costo?: string;
  modalidad?: string;
}

/**
 * Atributos de una ficha tal como quedan escritos en el HTML (`data-*`). El island de
 * filtros trabaja sobre estos valores, no sobre objetos `Recurso`, para que exista un único
 * componente de ficha renderizado en el servidor.
 */
export interface AtributosFicha {
  comuna?: string;
  tipo?: string;
  costo?: string;
  modalidad?: string;
}

/** Las fichas sin comuna se agrupan bajo `nacional`, que es el valor que emite `FichaRecurso`. */
export function coincideConFiltros(ficha: AtributosFicha, filtros: FiltrosRecursos): boolean {
  const comparar = (valor: string | undefined, filtro: string | undefined, comodin: string) =>
    !filtro || filtro === comodin || valor === filtro;

  return (
    comparar(ficha.comuna, filtros.comuna, 'todas') &&
    comparar(ficha.tipo, filtros.tipo, 'todos') &&
    comparar(ficha.costo, filtros.costo, 'todos') &&
    comparar(ficha.modalidad, filtros.modalidad, 'todas')
  );
}

export function atributosDe(recurso: Recurso): AtributosFicha {
  return {
    comuna: recurso.comunaSlug ?? 'nacional',
    tipo: recurso.tipo,
    costo: recurso.costo,
    modalidad: recurso.modalidad,
  };
}

export function filtrarRecursos(lista: readonly Recurso[], filtros: FiltrosRecursos): Recurso[] {
  return lista.filter((recurso) => coincideConFiltros(atributosDe(recurso), filtros));
}
