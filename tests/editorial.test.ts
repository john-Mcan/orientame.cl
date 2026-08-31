import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { esPublicable, visibleEnEntorno, type EditorialData } from '../src/lib/editorial.ts';

describe('Editorial status and publishability rules', () => {
  const baseSource = { url: 'https://minsal.cl' };

  it('rejects drafts from being published', () => {
    const draft: EditorialData = {
      revisionRequerida: 'fuentes',
      estadoEditorial: 'borrador',
      fuentes: [baseSource],
      proximaRevision: new Date('2027-01-01'),
    };
    assert.strictEqual(esPublicable(draft), false);
  });

  it('rejects content in-verification from being published', () => {
    const inVerification: EditorialData = {
      revisionRequerida: 'fuentes',
      estadoEditorial: 'en-verificacion',
      fuentes: [baseSource],
      proximaRevision: new Date('2027-01-01'),
    };
    assert.strictEqual(esPublicable(inVerification), false);
  });

  it('rejects content without sources even if verified date is set', () => {
    const noSources: EditorialData = {
      revisionRequerida: 'fuentes',
      estadoEditorial: 'verificado-con-fuentes',
      fuentes: [],
      verificadoEl: new Date('2026-08-31'),
      proximaRevision: new Date('2027-01-01'),
    };
    assert.strictEqual(esPublicable(noSources), false);
  });

  it('rejects content without next revision date', () => {
    const noNextRevision: EditorialData = {
      revisionRequerida: 'fuentes',
      estadoEditorial: 'verificado-con-fuentes',
      fuentes: [baseSource],
      verificadoEl: new Date('2026-08-31'),
    };
    assert.strictEqual(esPublicable(noNextRevision), false);
  });

  it('accepts source-verified content when all requirements are met', () => {
    const validSources: EditorialData = {
      revisionRequerida: 'fuentes',
      estadoEditorial: 'verificado-con-fuentes',
      fuentes: [baseSource],
      verificadoEl: new Date('2026-08-31'),
      proximaRevision: new Date('2027-02-28'),
    };
    assert.strictEqual(esPublicable(validSources), true);
  });

  it('rejects clinically required content if only source-verified', () => {
    const clinicalWithSourceStatus: EditorialData = {
      revisionRequerida: 'clinica',
      estadoEditorial: 'verificado-con-fuentes',
      fuentes: [baseSource],
      verificadoEl: new Date('2026-08-31'),
      proximaRevision: new Date('2027-02-28'),
    };
    assert.strictEqual(esPublicable(clinicalWithSourceStatus), false);
  });

  it('accepts clinically reviewed content when authorized reviewer and dates are present', () => {
    const validClinical: EditorialData = {
      revisionRequerida: 'clinica',
      estadoEditorial: 'revisado-clinicamente',
      fuentes: [baseSource],
      revisadoPor: 'Dra. Psicóloga Acreditada',
      revisadoEl: new Date('2026-08-31'),
      proximaRevision: new Date('2027-02-28'),
    };
    assert.strictEqual(esPublicable(validClinical), true);
  });

  it('rejects clinically reviewed content if reviewer name or review date is missing', () => {
    const incompleteClinical: EditorialData = {
      revisionRequerida: 'clinica',
      estadoEditorial: 'revisado-clinicamente',
      fuentes: [baseSource],
      proximaRevision: new Date('2027-02-28'),
    };
    assert.strictEqual(esPublicable(incompleteClinical), false);
  });

  it('visibleEnEntorno respects development vs production environments', () => {
    const draft: EditorialData = {
      revisionRequerida: 'fuentes',
      estadoEditorial: 'borrador',
      fuentes: [],
    };
    // Visible in development
    assert.strictEqual(visibleEnEntorno(draft, false), true);
    // Hidden in production
    assert.strictEqual(visibleEnEntorno(draft, true), false);

    const validSources: EditorialData = {
      revisionRequerida: 'fuentes',
      estadoEditorial: 'verificado-con-fuentes',
      fuentes: [baseSource],
      verificadoEl: new Date('2026-08-31'),
      proximaRevision: new Date('2027-02-28'),
    };
    assert.strictEqual(visibleEnEntorno(validSources, true), true);
    assert.strictEqual(visibleEnEntorno(validSources, false), true);
  });
});
