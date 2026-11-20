import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const mirror = resolve(root, process.env.TELLUSPEDIA_REPO ?? '../telluspedia', 'apps/web/src/lib/tellus-bridge/contract');
const sync = process.argv.includes('--sync');
if (sync) await mkdir(mirror, {recursive:true});
const contract = ['index.mjs','index.d.mts','types.d.mts','registry.schema.json','snapshot.schema.json','manifest.schema.json'];
const data = ['registry.json','manifest.json'];
for (const [directory, files] of [['packages/tellus-bridge',contract],['dist/bridge',data]]) {
  for (const file of files) {
    const contents = await readFile(resolve(root,directory,file));
    const destination = resolve(mirror,file);
    if (sync) await writeFile(destination,contents);
    if (!contents.equals(await readFile(destination))) throw new Error('TellusBridge divergente: ' + file);
  }
}
console.log('TellusBridge em paridade' + (sync ? ' · espelho atualizado' : ''));
