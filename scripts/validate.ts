import { site } from '../src/config/site.ts';
import { olivo } from '../src/config/examples/olivo.ts';
import { validateConfig } from '../src/lib/validate.ts';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

for (const config of [site, olivo]) {
  validateConfig(config);
  const assets = [
    ...(config.business.logo ? [config.business.logo] : []),
    config.hero.image,
    config.seo.shareImage,
    ...config.services.map((s) => s.image),
    ...config.promotions.map((p) => p.image),
  ];
  for (const path of new Set(assets)) {
    if (!existsSync(resolve('public', path.slice(1))))
      throw new Error(`${config.id}: no existe public${path}`);
  }
  console.log(
    `PASS: ${config.id}; configuración y recursos válidos (${config.ownerTimeZone}).`,
  );
}
