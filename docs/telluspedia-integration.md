# Integração TellusPedia → TellusLab

TellusLab permanece em seu próprio repositório. O TellusPedia referencia o laboratório por link e pode trocar arquivos JSON com ele. O registro é composto em `apps/web/src/app.mjs` e o contrato fica em `packages/telluspedia-bridge/index.mjs`.

## Abrir um contexto de estudo

```text
http://127.0.0.1:4175/#integracao?area=matematica&topic=1.1
http://127.0.0.1:4175/#integracao?domain=programming&topic=1.1
```

Em outro ambiente, use a origem do TellusLab configurada no TellusPedia e mantenha o fragmento. O cliente pode construir o fragmento com `URLSearchParams`.

| Campo | Regra |
|---|---|
| `area` ou `domain` | ID estável registrado. Use `matematica` ou `programming`. |
| `topic` | Opcional. ID exato no catálogo da área. Exemplo `1.1`. |

Parâmetros repetidos e IDs desconhecidos geram erro legível. O contexto é informativo. Abrir um link não altera progresso, tentativa, estado de proficiência ou acesso à solução.

## Trocar snapshots

Há duas operações explícitas na página **TellusPedia**. **Exportar para TellusPedia** baixa um arquivo JSON. **Importar JSON** seleciona um arquivo local, valida e pede confirmação antes de substituir o estado. O menu **Snapshot** aceita também o JSON direto da Etapa 2. Nenhum rascunho, solução ou histórico é transmitido pelo link. Os arquivos exportados podem conter conteúdo pessoal.

| Campo de envelope | Valor |
|---|---|
| `format` | `telluslab.snapshot` |
| `version` | `1` |
| `areaId` | ID registrado da área |
| `snapshot` | JSON integral exportado pelo TellusLab, incluindo `schemaVersion`, `catalogId`, `scheduler`, `exportedAt`, `state`, `domainId` para Programação e, quando presente, `workspace` |

O consumidor preserva `snapshot` sem editar. O importador valida versão, tamanho (até 10 MiB), área, catálogo e invariantes de domínio. Versões desconhecidas ou catálogos incompatíveis exigem uma conversão explícita. A substituição é feita na transação IndexedDB após confirmação. Snapshots não devem ser enviados como query string nem versionados no Git.

```js
import { createAreaRegistry } from './packages/learning-core/index.mjs';
import { createTellusPediaBridge } from './packages/telluspedia-bridge/index.mjs';

export function integrationFor(mathematics, programming, programmingDag) {
  return createTellusPediaBridge(createAreaRegistry([
    {id: 'matematica', catalog: mathematics},
    {id: 'programming', catalog: programming, dag: programmingDag}
  ]));
}

export function openSnapshot(bridge, json, expectedAreaId) {
  return bridge.unwrapSnapshot(JSON.parse(json), expectedAreaId).snapshot;
}
```

`parseLaunch(query)` retorna `{areaId, topicId}`. `wrapSnapshot(areaId, snapshot)` retorna o envelope v1. `unwrapSnapshot(envelope, expectedAreaId)` retorna `{areaId, snapshot}`. Use o DAG de `createDomainPacks().scope(...)` para validar referências de micro-revisão entre domínios. Essas funções não dependem do navegador.

