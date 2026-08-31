export type RevisionRequired = 'fuentes' | 'clinica';
export type EditorialState =
  'borrador' | 'en-verificacion' | 'verificado-con-fuentes' | 'revisado-clinicamente';

export interface EditorialData {
  revisionRequerida: RevisionRequired;
  estadoEditorial: EditorialState;
  fuentes: ReadonlyArray<{ url: string }>;
  verificadoEl?: Date;
  revisadoPor?: string;
  revisadoEl?: Date;
  proximaRevision?: Date;
}

export function esPublicable(data: EditorialData): boolean {
  if (!data.fuentes || data.fuentes.length === 0 || !data.proximaRevision) {
    return false;
  }

  if (data.estadoEditorial === 'revisado-clinicamente') {
    return Boolean(data.revisadoPor && data.revisadoEl);
  }

  if (data.estadoEditorial === 'verificado-con-fuentes') {
    return data.revisionRequerida === 'fuentes' && Boolean(data.verificadoEl);
  }

  return false;
}

export function visibleEnEntorno(data: EditorialData, production = import.meta.env.PROD): boolean {
  return production ? esPublicable(data) : true;
}
