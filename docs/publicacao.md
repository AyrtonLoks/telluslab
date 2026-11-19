# Publicar o TellusLab na main

A `main` do GitHub já contém o commit inicial `99d90db`, com `LICENSE` e `README.md`. Trabalhe sobre um clone novo para herdar esse histórico e evitar importar o commit da Etapa 2, que incluía fontes binárias e a configuração de hospedagem. Os comandos assumem que o ZIP `telluslab-migracao.zip` foi salvo em **Downloads** e que a pasta `Downloads/telluslab` ainda não existe. Se ela já existir, escolha outro nome em todas as linhas correspondentes.

Antes de trocar o servidor local, exporte o snapshot no aplicativo atual. A cópia anterior pode servir de ponto de retorno.

## PowerShell

```powershell
Set-Location "$HOME\Downloads"
git clone --branch main https://github.com/AyrtonLoks/telluslab.git telluslab
if ($LASTEXITCODE -ne 0) { throw 'Falha ao clonar' }
Expand-Archive -LiteralPath .\telluslab-migracao.zip -DestinationPath .\telluslab -Force
Set-Location .\telluslab
git remote -v
npm.cmd ci
if ($LASTEXITCODE -ne 0) { throw 'Falha na instalação' }
npm.cmd test
if ($LASTEXITCODE -ne 0) { throw 'Falha nos testes' }
git add --all
npm.cmd run verify:git
if ($LASTEXITCODE -ne 0) { throw 'Índice Git reprovado' }
git diff --cached --stat
git commit -m "Migrate TellusLab mathematics and TellusPedia bridge"
if ($LASTEXITCODE -ne 0) { throw 'Falha ao gravar o commit' }
git push -u origin main
```

## Windows CMD

```bat
cd /d "%USERPROFILE%\Downloads"
git clone --branch main https://github.com/AyrtonLoks/telluslab.git telluslab && tar.exe -xf telluslab-migracao.zip -C telluslab && cd telluslab && git remote -v
npm.cmd ci && npm.cmd test && git add --all && npm.cmd run verify:git && git diff --cached --stat
git commit -m "Migrate TellusLab mathematics and TellusPedia bridge" && git push -u origin main
```

Execute a próxima linha apenas após sucesso da anterior.

## Git Bash

```bash
cd "$HOME/Downloads" &&
git clone --branch main https://github.com/AyrtonLoks/telluslab.git telluslab &&
tar -xf telluslab-migracao.zip -C telluslab &&
cd telluslab &&
git remote -v &&
npm ci &&
npm test &&
git add --all &&
npm run verify:git &&
git diff --cached --stat &&
git commit -m "Migrate TellusLab mathematics and TellusPedia bridge" &&
git push -u origin main
```

Confirme o commit com `git status --short --branch` e `git log -1 --oneline`. Se houver novas alterações remotas, revise-as antes de reconciliar as branches. Se o GitHub exigir pull request para a `main`, publique uma branch de migração a partir do clone e abra o PR. Evite `push --force`: o histórico existente é a base da migração.

