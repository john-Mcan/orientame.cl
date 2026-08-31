import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';

const distDir = path.resolve(process.cwd(), 'dist');

describe('Phase 1 build output verification', () => {
  it('dist directory exists', () => {
    assert.strictEqual(fs.existsSync(distDir), true);
  });

  const requiredRoutes = [
    'index.html',
    'sobre/index.html',
    'metodologia/index.html',
    'urgencia/index.html',
    'legal/index.html',
    'legal/privacidad/index.html',
    'legal/alcance/index.html',
    'legal/terminos/index.html',
    '404.html',
    'robots.txt',
    'sitemap-index.xml',
  ];

  for (const route of requiredRoutes) {
    it(`generates required static route: ${route}`, () => {
      const filePath = path.join(distDir, route);
      assert.strictEqual(fs.existsSync(filePath), true, `Missing route: ${route}`);
    });
  }

  it('urgencia page contains official crisis emergency phone links', () => {
    const urgenciaHtml = fs.readFileSync(path.join(distDir, 'urgencia/index.html'), 'utf8');
    assert.ok(urgenciaHtml.includes('tel:131'), 'Missing SAMU 131 link');
    assert.ok(urgenciaHtml.includes('tel:*4141'), 'Missing Línea *4141 link');
    assert.ok(urgenciaHtml.includes('tel:+566003607777'), 'Missing Salud Responde link');
  });

  it('no drafts from content collections are rendered into production dist', () => {
    // Draft collections should not have static routes in dist for Phase 1
    const forbiddenDraftPaths = ['sintomas', 'temas', 'instrumentos', 'guias', 'acompanamiento'];

    for (const draftPath of forbiddenDraftPaths) {
      const fullPath = path.join(distDir, draftPath);
      assert.strictEqual(
        fs.existsSync(fullPath),
        false,
        `Draft path ${draftPath} was unexpectedly rendered to dist`,
      );
    }
  });

  it('robots.txt disallows crawling by default in preview environment', () => {
    const robotsTxt = fs.readFileSync(path.join(distDir, 'robots.txt'), 'utf8');
    assert.ok(robotsTxt.includes('Disallow: /'), 'Preview robots.txt must disallow crawling');
  });
});
