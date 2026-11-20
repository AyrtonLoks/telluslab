import { spawnSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';

async function files(directory) {
  const entries = await readdir(directory, {withFileTypes:true});
  return (await Promise.all(entries.map(entry => {
    const path = directory + '/' + entry.name;
    return entry.isDirectory() ? files(path) : /\.[cm]?js$/.test(entry.name) ? [path] : [];
  }))).flat();
}
const sources = (await Promise.all(['apps/web/src','packages','domains','scripts','test'].map(files))).flat();
for (const file of ['serve.mjs', ...sources.sort()]) {
  const check = spawnSync(process.execPath, ['--check', file], {stdio:'inherit'});
  if (check.status !== 0) process.exit(check.status ?? 1);
}
console.log('Sintaxe verificada em ' + (sources.length + 1) + ' arquivos JavaScript.');
