import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

// Arte determinista para placeholders y tarjetas sociales; las fotos se generaron con Imagegen.
const paths = {
  corte:
    'M135 105 260 230M135 220 260 95M148 100a28 28 0 1 1-56 0 28 28 0 0 1 56 0ZM148 225a28 28 0 1 1-56 0 28 28 0 0 1 56 0Z',
  fade: 'M150 110h100v115a15 15 0 0 1-15 15h-70a15 15 0 0 1-15-15ZM150 110V75h100v35M170 75v35M190 75v35M210 75v35M230 75v35M178 158h44v35h-44Z',
  barba:
    'm120 220 160-120-13-18-160 120ZM120 220l-10 15 15 20 120-90M125 255l8-5M240 150l25-18',
  ritual:
    'M140 170h120l-12 65h-96ZM155 125c-10-28 10-49 27-35 6-27 40-26 45 0 22-12 40 12 25 35ZM165 125h75v45h-75Z',
  cuidado:
    'M165 110h70v125a12 12 0 0 1-12 12h-46a12 12 0 0 1-12-12ZM180 85h40v25h-40ZM175 165h50v40h-50ZM200 65v-8M235 85l8-8M165 85l-8-8',
};
for (const [name, path] of Object.entries(paths)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="#e9e1d3"/><circle cx="200" cy="150" r="112" fill="none" stroke="#d5caba" stroke-width="1"/><path d="${path}" stroke="#8d634a" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  await writeFile(`public/images/${name}.svg`, svg);
}
await writeFile(
  'public/favicon.svg',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="#97573c"/><path d="m20 20 27 28M20 44 47 16M23 18a6 6 0 1 1-12 0 6 6 0 0 1 12 0ZM23 46a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z" fill="none" stroke="#f5f1e9" stroke-width="2"/></svg>',
);
for (const brand of [
  {
    id: 'bruma',
    name: 'BRUMA',
    subtitle: 'Tu estilo. Nuestro oficio.',
    bg: '#f5f1e9',
    ink: '#282923',
    accent: '#97573c',
  },
  {
    id: 'olivo',
    name: 'OLIVO',
    subtitle: 'El detalle hace el estilo.',
    bg: '#f1f2e9',
    ink: '#29362b',
    accent: '#476144',
  },
]) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="${brand.bg}"/><rect x="28" y="28" width="1144" height="574" fill="none" stroke="${brand.accent}"/><text x="90" y="110" fill="${brand.accent}" font-size="18" font-family="sans-serif" letter-spacing="5">BARBERÍA · CUIDADO · ESTILO</text><text x="80" y="340" fill="${brand.ink}" font-size="155" font-family="Georgia,serif" letter-spacing="14">${brand.name}</text><text x="90" y="445" fill="${brand.accent}" font-size="46" font-family="Georgia,serif" font-style="italic">${brand.subtitle}</text><text x="90" y="555" fill="${brand.ink}" font-size="16" font-family="sans-serif">DEMOSTRACIÓN DE PLANTILLA · NEGOCIO FICTICIO</text></svg>`;
  await sharp(Buffer.from(svg))
    .png()
    .toFile(`public/images/${brand.id}-social.png`);
}
console.log('PASS: placeholders, favicon e imágenes sociales creados.');
