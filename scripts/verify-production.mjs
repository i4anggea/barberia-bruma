import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

// Ensayo aislado: no modifica la identidad ni el build de las demostraciones del proyecto.
const directory = mkdtempSync(join(tmpdir(), 'barberia-production-'));
for (const path of [
  'src',
  'scripts',
  'public',
  'astro.config.mjs',
  'tsconfig.json',
  'package.json',
])
  cpSync(resolve(path), join(directory, path), { recursive: true });
symlinkSync(resolve('node_modules'), join(directory, 'node_modules'), 'dir');
const identityPath = join(directory, 'src/config/identity.ts');
const identity = readFileSync(identityPath, 'utf8')
  .replace('demo: true', 'demo: false')
  .replace('https://bruma.example', 'https://cliente.invalid')
  .replaceAll('520000000000', '525512345678');
writeFileSync(identityPath, identity);
try {
  execFileSync('npm', ['run', 'build'], { cwd: directory, stdio: 'pipe' });
} catch (error) {
  console.error(error.stdout?.toString(), error.stderr?.toString());
  throw error;
}
const html = readFileSync(join(directory, 'dist/index.html'), 'utf8');
assert.ok(!html.includes('class="demo-bar"'));
assert.ok(!html.includes('name="robots" content="noindex, nofollow"'));
assert.ok(html.includes('https://wa.me/525512345678'));
assert.ok(!existsSync(join(directory, 'dist/ejemplos/olivo/index.html')));
console.log(
  `PASS: build real aislado, contacto sustituido, sin barra demo ni ruta secundaria. Evidencia: ${directory}/dist`,
);
