import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

for (const [path, brand] of [
  ['index.html', 'Bruma Barbería'],
  ['ejemplos/olivo/index.html', 'Olivo Estudio'],
]) {
  test(`HTML estático de ${brand}: SEO, contenido y recursos locales`, () => {
    const html = readFileSync(resolve('dist', path), 'utf8');
    assert.match(html, /<html[^>]*lang="es-MX"/);
    assert.match(html, /<h1[^>]*>/);
    assert.match(html, /name="robots" content="noindex, nofollow"/);
    assert.ok(html.includes(brand));
    const data = JSON.parse(
      html.match(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/,
      )[1],
    );
    assert.equal(data['@type'], 'HairSalon');
    assert.equal(data.name, brand);
    assert.equal(data.openingHoursSpecification.length, 11);
    assert.ok(data.specialOpeningHoursSpecification.length > 0);
    assert.ok(data.address.addressLocality);
    const image = html.match(/property="og:image" content="([^"]+)"/)[1];
    assert.match(image, /^https:\/\/.+\/images\/.+-social\.png$/);
    for (const [, resource] of html.matchAll(
      /(?:src|href)="(\/[^"#?]+)(?:\?[^"#]*)?"/g,
    )) {
      if (/\.(css|js|png|jpg|svg|webp|avif|woff2)$/.test(resource))
        assert.ok(
          existsSync(resolve('dist', resource.slice(1))),
          `Falta ${resource}`,
        );
    }
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
    assert.equal(ids.length, new Set(ids).size, 'IDs HTML duplicados');
  });
}

test('la configuración alternativa aplica orden, variante y ocultación de secciones', () => {
  const html = readFileSync('dist/ejemplos/olivo/index.html', 'utf8');
  assert.ok(html.indexOf('id="contacto"') < html.indexOf('id="servicios"'));
  assert.match(html, /service-items--cards/);
  assert.ok(!html.includes('id="promociones"'));
  assert.ok(!html.includes('href="#promociones"'));
});

test('la salida estática incluye página de error y fotografías locales', () => {
  assert.match(readFileSync('dist/404.html', 'utf8'), /Página no encontrada/);
  assert.ok(existsSync('dist/images/barberia.jpg'));
  assert.ok(existsSync('dist/images/ritual.jpg'));
});
