/**
 * El protocolo v0.1 existe como borrador, pero no tiene aprobación clínica. Mantener esta
 * constante en `false` impide que una búsqueda o una respuesta active una reacción de riesgo.
 */
export const VERSION_PROTOCOLO_CRISIS = '0.1-borrador';
export const PROTOCOLO_CRISIS_APROBADO = false;

export function permiteRespuestaAutomaticaDeRiesgo(): boolean {
  return PROTOCOLO_CRISIS_APROBADO;
}
