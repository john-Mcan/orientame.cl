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
  if (data.fuentes.length === 0 || !data.proximaRevision) return false;

  if (data.revisionRequerida === 'fuentes') {
    return data.estadoEditorial === 'verificado-con-fuentes' && Boolean(data.verificadoEl);
  }

  return (
    data.estadoEditorial === 'revisado-clinicamente' && Boolean(data.revisadoPor && data.revisadoEl)
  );
}

export function visibleEnEntorno(data: EditorialData, production = import.meta.env.PROD): boolean {
  return production ? esPublicable(data) : true;
}
