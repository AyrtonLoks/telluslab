import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { mathematicsSeed } from '../packages/curriculum-mathematics/seed.mjs';
import { programmingSeed } from '../packages/curriculum-programming/seed.mjs';
import { economicsSeed } from '../domains/economics-finance/seed.mjs';
import { physicsSeed } from '../domains/physics/seed.mjs';

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

for (const path of ['packages/learning-core', 'packages/curriculum-mathematics',
  'packages/curriculum-programming', 'packages/telluspedia-bridge', 'domains/economics-finance', 'domains/physics']) {
  for (const name of (await readdir(resolve(root, path))).sort()) {
    if (!name.endsWith('.mjs') || ['parse.mjs','seed.mjs'].includes(name)) continue;
    await emit(path + '/' + name, await read(path + '/' + name));
  }
}
for (const name of (await readdir(resolve(root, 'apps/web/src'))).sort()) {
  if (name === 'sw.js') continue;
  const input = await read('apps/web/src/' + name);
  const text = name.endsWith('.mjs')
    ? input.toString('utf8').replaceAll('../../../packages/', './packages/').replaceAll('../../../domains/', './domains/')
      .replace("import katex from 'katex';", "import katex from './vendor/katex/katex.mjs';")
    : input;
  await emit(name, text);
}
for (const [path, source] of [
  ['vendor/mermaid/mermaid.min.js','mermaid/dist/mermaid.min.js'],
  ['vendor/mermaid/LICENSE.txt','mermaid/LICENSE'],
  ['vendor/highlight/highlight.min.js','@highlightjs/cdn-assets/highlight.min.js'],
  ['vendor/highlight/github.min.css','@highlightjs/cdn-assets/styles/github.min.css'],
  ['vendor/highlight/LICENSE.txt','@highlightjs/cdn-assets/LICENSE']
]) await emit(path, await read('node_modules/' + source));

const math = mathematicsSeed();
const programming = programmingSeed(math);
await emit('data/catalogo.json', JSON.stringify(math, null, 2) + '\n');
await emit('data/programming.json', JSON.stringify(programming, null, 2) + '\n');
await emit('data/economics-finance.json', JSON.stringify(economicsSeed(math, programming), null, 2) + '\n');
await emit('data/physics.json', JSON.stringify(physicsSeed(math, programming), null, 2) + '\n');
const hash = createHash('sha256').update(swSource);
const included = [...files].sort();
for (const path of included) {
  hash.update(path).update('\0').update(await readFile(resolve(target, path)));
}
const version = 'telluslab-' + hash.digest('hex').slice(0, 16);
await emit('sw.js', 'const VERSION=' + JSON.stringify(version) + ';\nconst files=' +
  JSON.stringify(['./', ...included.map(path => './' + path)]) + ';\n' + swSource.toString('utf8'));
console.log('TellusLab compilado em dist/ · ' + version);

