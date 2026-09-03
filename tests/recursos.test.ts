import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  recursos,
  COMUNAS_PILOTO,
  atributosDe,
  coincideConFiltros,
  filtrarRecursos,
  getRecursosPorComuna,
  getRecursosClinicasUniversitarias,
  getRecursosNacionales,
} from '../src/lib/resources.ts';

// Estas pruebas no exigen un número mínimo de recursos a propósito. Un piso ("al menos 5
// verificados", "al menos 2 por comuna") presiona a inventar fichas para satisfacerlo, que es
// exactamente lo que pasó en la fase 3: 13 establecimientos con dirección, teléfono y
// verificadoPor inventados. Lo que sí se verifica es que ninguna ficha afirme más de lo que
// respalda su fuente.

describe('Integridad del dataset de recursos', () => {
  it('no hay ids duplicados', () => {
    const vistos = new Set<string>();
    for (const r of recursos) {
      assert.ok(!vistos.has(r.id), `Id duplicado de recurso: ${r.id}`);
      vistos.add(r.id);
    }
  });

  it('los campos enumerados sólo usan valores del modelo', () => {
    for (const r of recursos) {
      assert.ok(r.nombre.length > 3, `El recurso ${r.id} tiene nombre demasiado corto`);
      assert.ok(
        [
          'cesfam',
          'cecosf',
          'cosam',
          'hospital',
          'clinica-universitaria',
          'ong',
          'linea',
          'otro',
        ].includes(r.tipo),
        `El tipo "${r.tipo}" de ${r.id} no es válido`,
      );
      assert.ok(
        ['gratuito', 'segun-tramo', 'bajo', 'variable', 'desconocido'].includes(r.costo),
        `El costo "${r.costo}" de ${r.id} no es válido`,
      );
      assert.ok(
        ['presencial', 'remoto', 'hibrido'].includes(r.modalidad),
        `La modalidad "${r.modalidad}" de ${r.id} no es válida`,
      );
      assert.ok(
        ['verificado', 'requiere-revision', 'no-disponible'].includes(r.estado),
        `El estado "${r.estado}" de ${r.id} no es válido`,
      );
      assert.ok(['A', 'B'].includes(r.nivel), `El nivel "${r.nivel}" de ${r.id} debe ser A o B`);
    }
  });

  it('sólo un recurso de Nivel B puede presentarse como verificado', () => {
    for (const r of recursos) {
      if (r.estado !== 'verificado') continue;
      assert.equal(
        r.nivel,
        'B',
        `El recurso "${r.id}" se presenta como verificado sin ser de Nivel B`,
      );
    }
  });

  it('un recurso verificado declara quién lo verificó, cuándo y cuándo se revisa de nuevo', () => {
    for (const r of recursos.filter((x) => x.estado === 'verificado')) {
      assert.ok(r.verificadoPor, `El recurso verificado ${r.id} debe declarar verificadoPor`);
      assert.match(
        r.verificadoEl ?? '',
        /^\d{4}-\d{2}-\d{2}$/,
        `El recurso ${r.id} debe tener fecha verificadoEl ISO`,
      );
      assert.match(
        r.proximaRevision ?? '',
        /^\d{4}-\d{2}-\d{2}$/,
        `El recurso ${r.id} debe tener fecha proximaRevision ISO`,
      );
    }
  });

  it('un recurso sin verificar no arrastra rastros de verificación', () => {
    // Si la ficha no está verificada, mostrar "verificado por" y una fecha la haría leerse
    // como comprobada. Es la confusión que este dataset ya produjo una vez.
    for (const r of recursos.filter((x) => x.estado !== 'verificado')) {
      assert.equal(
        r.verificadoPor,
        undefined,
        `El recurso "${r.id}" no está verificado pero declara verificadoPor`,
      );
      assert.equal(
        r.verificadoEl,
        undefined,
        `El recurso "${r.id}" no está verificado pero declara verificadoEl`,
      );
    }
  });

  it('toda ficha cita una fuente con URL https y fecha de consulta ISO', () => {
    for (const r of recursos) {
      assert.ok(r.fuente.nombre.length > 3, `El recurso ${r.id} no nombra su fuente`);
      if (r.fuente.url) {
        assert.ok(
          r.fuente.url.startsWith('https://'),
          `La URL de la fuente de ${r.id} debe ser https: ${r.fuente.url}`,
        );
      }
      assert.match(
        r.fuente.consultadoEl,
        /^\d{4}-\d{2}-\d{2}$/,
        `La fuente de ${r.id} necesita consultadoEl ISO: ${r.fuente.consultadoEl}`,
      );
    }
  });

  it('los teléfonos para marcar contienen sólo caracteres válidos de marcado', () => {
    for (const r of recursos) {
      if (r.telefonoMarcar) {
        assert.match(
          r.telefonoMarcar,
          /^[+*0-9]+$/,
          `El telefonoMarcar de ${r.id} contiene caracteres inválidos: ${r.telefonoMarcar}`,
        );
      }
    }
  });

  it('toda ficha con comuna apunta a una comuna piloto declarada', () => {
    const slugs = new Set(COMUNAS_PILOTO.map((c) => `${c.regionSlug}/${c.slug}`));
    for (const r of recursos) {
      if (!r.comunaSlug) continue;
      assert.ok(
        slugs.has(`${r.regionSlug}/${r.comunaSlug}`),
        `El recurso "${r.id}" apunta a ${r.regionSlug}/${r.comunaSlug}, que no tiene página`,
      );
    }
  });
});

describe('Recursos de urgencia que otras páginas dan por existentes', () => {
  it('siguen publicadas las líneas nacionales que enlaza /urgencia', () => {
    const nacionales = getRecursosNacionales();
    for (const id of ['salud-responde', 'linea-4141']) {
      assert.ok(
        nacionales.some((r) => r.id === id),
        `Falta el recurso nacional "${id}", que /urgencia da por existente`,
      );
    }
  });

  it('las clínicas universitarias no se presentan como gratuitas', () => {
    for (const c of getRecursosClinicasUniversitarias()) {
      assert.notEqual(
        c.costo,
        'gratuito',
        `La clínica "${c.id}" se presenta como gratuita sin serlo`,
      );
    }
  });

  it('las páginas de comuna sólo listan recursos de esa comuna', () => {
    for (const comuna of COMUNAS_PILOTO) {
      for (const r of getRecursosPorComuna(comuna.regionSlug, comuna.slug)) {
        assert.equal(r.comunaSlug, comuna.slug);
        assert.equal(r.regionSlug, comuna.regionSlug);
      }
    }
  });
});

describe('Filtrado de recursos (la función que ejecuta el island)', () => {
  const ficha = { comuna: 'santiago', tipo: 'cesfam', costo: 'gratuito', modalidad: 'presencial' };

  it('sin filtros activos toda ficha coincide', () => {
    assert.equal(
      coincideConFiltros(ficha, {
        comuna: 'todas',
        tipo: 'todos',
        costo: 'todos',
        modalidad: 'todas',
      }),
      true,
    );
    assert.equal(coincideConFiltros(ficha, {}), true);
  });

  it('un filtro que no calza descarta la ficha', () => {
    assert.equal(coincideConFiltros(ficha, { comuna: 'providencia' }), false);
    assert.equal(coincideConFiltros(ficha, { tipo: 'cosam' }), false);
    assert.equal(coincideConFiltros(ficha, { costo: 'bajo' }), false);
    assert.equal(coincideConFiltros(ficha, { modalidad: 'remoto' }), false);
  });

  it('los filtros se combinan de forma conjuntiva', () => {
    assert.equal(coincideConFiltros(ficha, { comuna: 'santiago', tipo: 'cesfam' }), true);
    assert.equal(coincideConFiltros(ficha, { comuna: 'santiago', tipo: 'cosam' }), false);
  });

  it('las fichas sin comuna quedan bajo la cobertura nacional', () => {
    const nacional = recursos.find((r) => !r.comunaSlug);
    if (!nacional) return;
    assert.equal(atributosDe(nacional).comuna, 'nacional');
    assert.equal(coincideConFiltros(atributosDe(nacional), { comuna: 'nacional' }), true);
    assert.equal(coincideConFiltros(atributosDe(nacional), { comuna: 'santiago' }), false);
  });

  it('filtrarRecursos usa el mismo criterio que el island', () => {
    for (const r of filtrarRecursos(recursos, { tipo: 'linea' })) {
      assert.equal(r.tipo, 'linea');
    }
  });
});
