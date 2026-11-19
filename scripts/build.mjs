import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mathematicsSeed } from '../packages/curriculum-mathematics/seed.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const target = resolve(root, 'dist');
const files = new Set();
async function emit(path, contents) {
  const file = resolve(target, path);
  await mkdir(dirname(file), {recursive: true});
  await writeFile(file, contents);
  files.add(path);
}
const read = path => readFile(resolve(root, path));
const swSource = await read('apps/web/src/sw.js');
const katOverride = process.env.TELLUSLAB_KATEX_DIST;
const katexDist = katOverride ? resolve(katOverride) : resolve(root, 'node_modules/katex/dist');
const katexModule = await readFile(resolve(katexDist, 'katex.mjs')).catch(error => {
  if (error.code !== 'ENOENT') throw error;
  throw new Error('KaTeX ausente. Execute npm ci antes de compilar.');
});
await emit('vendor/katex/katex.mjs', katexModule);
await emit('vendor/katex/katex.min.css', await readFile(resolve(katexDist, 'katex.min.css')));
await emit('vendor/katex/LICENSE.txt', await readFile(katOverride
  ? resolve(katexDist, 'LICENSE.txt') : resolve(katexDist, '..', 'LICENSE')));
const fonts = (await readdir(resolve(katexDist, 'fonts'))).sort().filter(path => path.endsWith('.woff2'));
if (fonts.length !== 20) throw new Error('Conjunto de fontes KaTeX incompatível');
for (const font of fonts) await emit('vendor/katex/fonts/' + font, await readFile(resolve(katexDist, 'fonts', font)));

for (const dir of ['learning-core', 'curriculum-mathematics', 'telluspedia-bridge']) {
  const path = 'packages/' + dir;
  for (const name of (await readdir(resolve(root, path))).sort()) {
    if (!name.endsWith('.mjs') || ['parse.mjs','seed.mjs'].includes(name)) continue;
    await emit(path + '/' + name, await read(path + '/' + name));
  }
}
for (const name of (await readdir(resolve(root, 'apps/web/src'))).sort()) {
  if (name === 'sw.js') continue;
  const input = await read('apps/web/src/' + name);
  const text = name.endsWith('.mjs')
    ? input.toString('utf8').replaceAll('../../../packages/', './packages/').replace("import katex from 'katex';", "import katex from './vendor/katex/katex.mjs';")
    : input;
  await emit(name, text);
}
await emit('data/catalogo.json', JSON.stringify(mathematicsSeed(), null, 2) + '\n');
const hash = createHash('sha256').update(swSource);
const included = [...files].sort();
for (const path of included) {
  hash.update(path).update('\0').update(await readFile(resolve(target, path)));
}
const version = 'telluslab-' + hash.digest('hex').slice(0, 16);
await emit('sw.js', 'const VERSION=' + JSON.stringify(version) + ';\nconst files=' +
  JSON.stringify(['./', ...included.map(path => './' + path)]) + ';\n' + swSource.toString('utf8'));
console.log('TellusLab compilado em dist/ · ' + version);

