import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { puntuarGad7, puntuarInstrumento, puntuarOms5, puntuarPhq8 } from '../src/lib/scoring.ts';

describe('Scoring OMS-5', () => {
  it('conserva los límites y la transformación porcentual oficiales', () => {
    assert.deepEqual(puntuarOms5([0, 0, 0, 0, 0]), { puntaje: 0, porcentaje: 0 });
    assert.deepEqual(puntuarOms5([5, 5, 5, 5, 5]), { puntaje: 25, porcentaje: 100 });
    assert.deepEqual(puntuarOms5([5, 4, 3, 2, 1]), { puntaje: 15, porcentaje: 60 });
  });

  it('rechaza respuestas incompletas o fuera de rango', () => {
    assert.throws(() => puntuarOms5([5, 4, 3, 2]));
    assert.throws(() => puntuarOms5([5, 4, 3, 2, 6]));
  });
});

describe('Scoring GAD-7', () => {
  it('suma siete respuestas entre cero y tres', () => {
    assert.deepEqual(puntuarGad7([0, 0, 0, 0, 0, 0, 0]), { puntaje: 0 });
    assert.deepEqual(puntuarGad7([3, 3, 3, 3, 3, 3, 3]), { puntaje: 21 });
    assert.deepEqual(puntuarGad7([0, 1, 2, 3, 0, 1, 2]), { puntaje: 9 });
  });

  it('rechaza respuestas incompletas, decimales o fuera de rango', () => {
    assert.throws(() => puntuarGad7([0, 1, 2]));
    assert.throws(() => puntuarGad7([0, 1, 2, 3, 0, 1, 4]));
    assert.throws(() => puntuarGad7([0, 1, 2, 3, 0, 1, 1.5]));
  });

  it('el dispatcher no acepta un instrumento desconocido', () => {
    assert.throws(() => puntuarInstrumento('otro' as 'gad-7', []));
  });
});

describe('Scoring PHQ-8', () => {
  it('suma ocho respuestas entre cero y tres', () => {
    assert.deepEqual(puntuarPhq8([0, 0, 0, 0, 0, 0, 0, 0]), { puntaje: 0 });
    assert.deepEqual(puntuarPhq8([3, 3, 3, 3, 3, 3, 3, 3]), { puntaje: 24 });
    assert.deepEqual(puntuarPhq8([0, 1, 2, 3, 0, 1, 2, 3]), { puntaje: 12 });
  });

  it('exige ocho respuestas: nueve serían el PHQ-9, que este sitio no publica', () => {
    assert.throws(() => puntuarPhq8([0, 1, 2, 3, 0, 1, 2]));
    assert.throws(() => puntuarPhq8([0, 1, 2, 3, 0, 1, 2, 3, 0]));
  });

  it('rechaza valores decimales o fuera de rango', () => {
    assert.throws(() => puntuarPhq8([0, 1, 2, 3, 0, 1, 2, 4]));
    assert.throws(() => puntuarPhq8([0, 1, 2, 3, 0, 1, 2, 1.5]));
  });

  it('el dispatcher lo resuelve por su id', () => {
    assert.deepEqual(puntuarInstrumento('phq-8', [1, 1, 1, 1, 1, 1, 1, 1]), { puntaje: 8 });
  });
});
