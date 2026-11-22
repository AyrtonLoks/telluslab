import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCatalogs } from './catalogs.mjs';
import { bridgeCatalog } from './bridge-catalog.mjs';
import { contentFiles } from '../packages/content-schema/index.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const target = resolve(root, 'dist');
const files = new Set();
async function emit(path, contents, cache = true) {
  const file = resolve(target, path);
  await mkdir(dirname(file), {recursive: true});
  await writeFile(file, contents);
  if (cache) files.add(path);
}
const read = path => readFile(resolve(root, path));
const pediaUrl = new URL(process.env.VITE_TELLUSPEDIA_URL ?? 'http://127.0.0.1:3000').origin;
if (!/^https?:/u.test(pediaUrl)) throw new Error('VITE_TELLUSPEDIA_URL deve ser HTTP ou HTTPS.');
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

const japaneseFont = 'node_modules/@fontsource/noto-sans-jp/';
const japaneseCss = (await read(japaneseFont + '400.css')).toString('utf8')
  .replace(/, url\(\.\/files\/[^)]+\.woff\) format\('woff'\)/g, '');
await emit('vendor/noto-sans-jp/400.css', japaneseCss);
await emit('vendor/noto-sans-jp/LICENSE', await read(japaneseFont + 'LICENSE'));
for (const [, path] of japaneseCss.matchAll(/url\(\.\/(files\/[^)]+\.woff2)\)/g)) {
  await emit('vendor/noto-sans-jp/' + path, await read(japaneseFont + path));
}

for (const path of ['packages/learning-core', 'packages/curriculum-mathematics',
  'packages/curriculum-programming', 'packages/telluspedia-bridge',
  'domains/economics-finance', 'domains/physics', 'domains/engineering', 'domains/humanities',
  'domains/languages', 'domains/literature']) {
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
      .replace("'__TELLUSPEDIA_URL__'", JSON.stringify(pediaUrl))
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

const catalogs = loadCatalogs();
const {registry, manifest} = bridgeCatalog(catalogs);
for (const [index,domain] of registry.domains.entries()) {
  const contents = JSON.stringify(catalogs[index], null, 2) + '\n';
  await emit('domains/' + domain.slug + '/catalog.json', contents);
  const legacy = domain.slug === 'mathematics' ? 'catalogo' : domain.slug;
  await emit('data/' + legacy + '.json', contents, false);
}
await emit('bridge/registry.json', JSON.stringify(registry, null, 2) + '\n');
await emit('bridge/manifest.json', JSON.stringify(manifest, null, 2) + '\n');
for (const name of ['index.mjs', 'registry.schema.json', 'snapshot.schema.json', 'manifest.schema.json']) {
  await emit('packages/tellus-bridge/' + name, await read('packages/tellus-bridge/' + name));
}
for (const {path, contents} of contentFiles(resolve(root, 'content'))) await emit(path, contents);
const hash = createHash('sha256').update(swSource);
const included = [...files].sort();
for (const path of included) {
  hash.update(path).update('\0').update(await readFile(resolve(target, path)));
}
const version = 'telluslab-' + hash.digest('hex').slice(0, 16);
await emit('sw.js', 'const VERSION=' + JSON.stringify(version) + ';\nconst files=' +
  JSON.stringify(['./', ...included.map(path => './' + path)]) + ';\n' + swSource.toString('utf8'));
console.log('TellusLab compilado em dist/ · ' + version);

