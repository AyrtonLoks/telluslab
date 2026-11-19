import { execFileSync } from 'node:child_process';

const git = (...args) => execFileSync('git', args, {maxBuffer: 20 * 1024 * 1024});
const entries = git('ls-files', '--stage', '-z').toString('utf8').split('\0').filter(Boolean);
const decoder = new TextDecoder('utf8', {fatal:true});
const excludedDir = /(?:^|\/)(?:\.openai|node_modules|dist|build|coverage|snapshots|\.cache|\.idea|\.vscode)(?:\/|$)/i;
const excludedExt = /\.(?:exe|dll|so(?:\.\d+)*|dylib|bin|app|msi|sys|o|obj|a|lib|class|jar|war|wasm|node|pyc|pyo|woff2?|ttf|otf|eot|png|jpe?g|gif|webp|ico|zip|tar|tgz|gz|7z|rar|sqlite3?|db)$/i;
const invalid = [];
for (const entry of entries) {
  const tab = entry.indexOf('\t');
  const [mode, hash, stage] = entry.slice(0,tab).split(' ');
  const path = entry.slice(tab+1);
  if (mode !== '100644' || stage !== '0' || excludedDir.test(path) ||
      excludedExt.test(path) || /(?:^|\/)\.env(?:\..+)?$/i.test(path) && !path.endsWith('.env.example')) {
    invalid.push(path);
    continue;
  }
  try {
    const text = decoder.decode(git('cat-file', 'blob', hash));
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text)) invalid.push(path);
  } catch {
    invalid.push(path);
  }
}
if (!entries.length || invalid.length) {
  console.error('Índice vazio ou arquivos bloqueados:\n' + invalid.join('\n'));
  process.exitCode = 1;
} else console.log(entries.length + ' arquivos de texto verificados no índice Git.');

