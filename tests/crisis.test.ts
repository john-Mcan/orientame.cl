import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  permiteRespuestaAutomaticaDeRiesgo,
  PROTOCOLO_CRISIS_APROBADO,
  VERSION_PROTOCOLO_CRISIS,
} from '../src/lib/crisis.ts';

describe('Guardia clínica del protocolo de crisis', () => {
  it('mantiene inactiva cualquier respuesta automática mientras el borrador no esté aprobado', () => {
    assert.equal(VERSION_PROTOCOLO_CRISIS, '0.1-borrador');
    assert.equal(PROTOCOLO_CRISIS_APROBADO, false);
    assert.equal(permiteRespuestaAutomaticaDeRiesgo(), false);
  });
});
