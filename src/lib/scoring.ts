export type InstrumentoId = 'oms-5' | 'gad-7';

export interface ResultadoInstrumento {
  puntaje: number;
  porcentaje?: number;
}

function sumarRespuestas(
  respuestas: readonly number[],
  cantidadEsperada: number,
  valorMaximo: number,
): number {
  if (respuestas.length !== cantidadEsperada) {
    throw new RangeError(`Se esperaban ${cantidadEsperada} respuestas.`);
  }

  if (
    respuestas.some(
      (respuesta) => !Number.isInteger(respuesta) || respuesta < 0 || respuesta > valorMaximo,
    )
  ) {
    throw new RangeError(`Cada respuesta debe ser un entero entre 0 y ${valorMaximo}.`);
  }

  return respuestas.reduce((total, respuesta) => total + respuesta, 0);
}

/** Reproduce el cálculo oficial de la OMS: suma de cinco ítems (0–25) por cuatro. */
export function puntuarOms5(respuestas: readonly number[]): ResultadoInstrumento {
  const puntaje = sumarRespuestas(respuestas, 5, 5);
  return { puntaje, porcentaje: puntaje * 4 };
}

/** Reproduce el cálculo publicado del GAD-7: suma simple de siete ítems (0–21). */
export function puntuarGad7(respuestas: readonly number[]): ResultadoInstrumento {
  return { puntaje: sumarRespuestas(respuestas, 7, 3) };
}

export function puntuarInstrumento(
  instrumentoId: InstrumentoId,
  respuestas: readonly number[],
): ResultadoInstrumento {
  if (instrumentoId === 'oms-5') return puntuarOms5(respuestas);
  if (instrumentoId === 'gad-7') return puntuarGad7(respuestas);
  throw new RangeError(`Instrumento no implementado: ${String(instrumentoId)}`);
}
