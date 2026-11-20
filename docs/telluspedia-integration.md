# Integração TellusPedia → TellusLab

TellusLab permanece em seu próprio repositório. O TellusPedia referencia o laboratório por link e pode trocar arquivos JSON com ele. O registro é composto em `apps/web/src/app.mjs` e o contrato fica em `packages/telluspedia-bridge/index.mjs`.

## Abrir um contexto de estudo

```text
http://127.0.0.1:4175/#integracao?area=matematica&topic=1.1
http://127.0.0.1:4175/#integracao?domain=programming&topic=1.1
http://127.0.0.1:4175/lab?domain=economics-finance&topic=8.3
http://127.0.0.1:4175/lab?domain=physics&topic=7.3
http://127.0.0.1:4175/lab?domain=engineering&topic=7.4
http://127.0.0.1:4175/lab?domain=humanities&topic=7.2
http://127.0.0.1:4175/lab?domain=languages&topic=4.1
http://127.0.0.1:4175/lab?domain=literature&topic=1.1
```

Em outro ambiente, use a origem do TellusLab configurada no TellusPedia e preserve a rota e os parâmetros. O cliente pode montar a consulta com `URLSearchParams`.

| Campo | Regra |
|---|---|
| `area` ou `domain` | ID estável registrado. Use `matematica`, `programming`, `economics-finance`, `physics`, `engineering`, `humanities`, `languages` ou `literature`. |
| `topic` | Opcional. ID exato no catálogo da área. Exemplo `1.1`. |

Parâmetros repetidos e IDs desconhecidos geram erro legível. O contexto é informativo. Abrir um link não altera progresso, tentativa, estado de proficiência ou acesso à solução.

A rota `/lab?domain=physics` abre Física e Óptica. Inclua `topic=7.3` para abrir o macrotema de sistemas ópticos e telescópios. A rota `/lab?domain=engineering` abre Engenharia e aceita `topic=7.4` para acessar tribologia, colimação e validação em campo. A rota `/lab?domain=humanities` abre Humanidades e Filosofia e aceita `topic=7.2` para acessar idealismo transcendental e os limites da razão. As rotas `/lab?domain=languages` e `/lab?domain=literature` abrem Idiomas e Literatura. Em hospedagem estática, sirva `index.html` também em `/lab`.

## Trocar snapshots

Há duas operações explícitas na página **TellusPedia**. **Exportar para TellusPedia** baixa um arquivo JSON. **Importar JSON** seleciona um arquivo local, valida e pede confirmação antes de substituir o estado. O menu **Snapshot** aceita também o JSON direto da Etapa 2. Nenhum rascunho, solução ou histórico é transmitido pelo link. Os arquivos exportados podem conter conteúdo pessoal.

| Campo de envelope | Valor |
|---|---|
| `format` | `telluslab.snapshot` |
| `version` | `1` |
| `areaId` | ID registrado da área |
| `snapshot` | JSON integral exportado pelo TellusLab, incluindo `schemaVersion`, `catalogId`, `scheduler`, `exportedAt`, `state`, `domainId` nos Domain Packs que o declaram e, quando presente, `workspace` |

O caderno de Literatura é exportado em `snapshot.workspace.closeReading`. Os pares FSRS de Idiomas ficam em `snapshot.state.cards`. O consumidor preserva `snapshot` sem editar. O importador valida versão, tamanho (até 10 MiB), área, catálogo e invariantes de domínio. Versões desconhecidas ou catálogos incompatíveis exigem uma conversão explícita. A substituição é feita na transação IndexedDB após confirmação. Snapshots não devem ser enviados como query string nem versionados no Git.

```js
import { createAreaRegistry } from './packages/learning-core/index.mjs';
import { createTellusPediaBridge } from './packages/telluspedia-bridge/index.mjs';

export function integrationFor(mathematics, programming, programmingDag, economics, economicsDag,
    physics, physicsDag, engineering, engineeringDag, humanities, humanitiesDag,
    languages, languagesDag, literature, literatureDag) {
  return createTellusPediaBridge(createAreaRegistry([
    {id: 'matematica', catalog: mathematics},
    {id: 'programming', catalog: programming, dag: programmingDag},
    {id: 'economics-finance', catalog: economics, dag: economicsDag},
    {id: 'physics', catalog: physics, dag: physicsDag},
    {id: 'engineering', catalog: engineering, dag: engineeringDag},
    {id: 'humanities', catalog: humanities, dag: humanitiesDag},
    {id: 'languages', catalog: languages, dag: languagesDag},
    {id: 'literature', catalog: literature, dag: literatureDag}
  ]));
}

export function openSnapshot(bridge, json, expectedAreaId) {
  return bridge.unwrapSnapshot(JSON.parse(json), expectedAreaId).snapshot;
}
```

`parseLaunch(query)` retorna `{areaId, topicId}`. `wrapSnapshot(areaId, snapshot)` retorna o envelope v1. `unwrapSnapshot(envelope, expectedAreaId)` retorna `{areaId, snapshot}`. Use o DAG de `createDomainPacks().scope(...)` para validar referências de micro-revisão entre domínios. Essas funções não dependem do navegador.

