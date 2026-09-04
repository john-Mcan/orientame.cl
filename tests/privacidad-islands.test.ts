import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

const raiz = process.cwd();

describe('Privacidad de las herramientas sensibles', () => {
  it('la autoevaluación no usa almacenamiento ni APIs de red', () => {
    const codigo = fs.readFileSync(
      path.join(raiz, 'src', 'components', 'islands', 'Test.tsx'),
      'utf8',
    );

    for (const api of [
      'fetch(',
      'XMLHttpRequest',
      'sendBeacon',
      'localStorage',
      'sessionStorage',
    ]) {
      assert.ok(!codigo.includes(api), `Test.tsx no debe usar ${api}`);
    }
  });

  it('el buscador no contiene reglas ni palabras clave para inferir riesgo', () => {
    const codigo = fs.readFileSync(
      path.join(raiz, 'src', 'components', 'islands', 'Buscador.tsx'),
      'utf8',
    );
    assert.ok(!/suicid|autoles|riesgo|peligro/i.test(codigo));
  });
});
