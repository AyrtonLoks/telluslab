# TellusBridge v1.0.0

O TellusLab produz o catálogo, o manifesto e o snapshot. O TellusPedia usa esses dados para relacionar o estudo à enciclopédia. Os três documentos têm `kind` e `schemaVersion: "1.0.0"`. Os schemas JSON Draft 2020-12 e os tipos TypeScript ficam em [packages/tellus-bridge](../packages/tellus-bridge).

| Documento | Conteúdo |
| --- | --- |
| `TellusDomainRegistryV1` | Domínios, trilhas, bibliografia e macrotemas. Inclui complexidade 1–5, modalidades e pré-requisitos diretos e cruzados. |
| `TellusLabSnapshotV1` | Data de exportação UTC, resumo ponderado, proficiência S0–S6, estabilidade e dificuldade do próximo cartão FSRS-5, próxima revisão, sessões, último diagnóstico, fila S6 e sugestões. |
| `TellusCrossLinkManifestV1` | Entidades, rotas canônicas no TellusPedia e referências a macrotemas e obras. O mesmo vínculo é usado nos dois sentidos. |

O progresso ponderado soma a complexidade dos nós em S4, S5 e S6 e divide pela complexidade total do conjunto. A medida é calculada separadamente para o acervo, cada domínio, trilha e obra. Uma obra sem macrotema vinculado tem razão `null`. A fila retrata a data do snapshot. A contagem de sessões considera uma sessão uma vez por macrotema, mesmo quando ele aparece em mais de um bloco.

## Identidade e armazenamento

Os IDs da ponte seguem `DOM-XXX:1.1`. As obras seguem `BIB-XXX-01`, inclusive as obras matemáticas. A geração normaliza os IDs do acervo interno sem alterar a identidade dos catálogos de estudos existentes. Os workspaces antigos continuam sendo resolvidos no IndexedDB pela chave composta de domínio e macrotema. Os envelopes legados por área continuam importáveis.

O arquivo global exportado manualmente inclui `backup`, com o modo de pré-requisitos e o workspace dos oito domínios. A restauração no TellusLab valida todos os workspaces e aplica os oito na mesma transação IndexedDB, após confirmação. O TellusPedia extrai os campos de progresso do snapshot e persiste esses campos no navegador.

Em uma origem compartilhada, o TellusLab publica a projeção de progresso em `localStorage["tellusbridge.snapshot.v1"]`. `BroadcastChannel("tellusbridge.snapshot.v1")` e o evento `storage` notificam abas abertas. Entre origens, faça a transferência pelo arquivo JSON. No Hub, prevalece o progresso com a data de exportação mais recente entre o upload e a projeção da origem.

## Executar localmente

1. Neste repositório, execute `npm ci` e `npm start`. O endereço padrão é `http://127.0.0.1:4175`. Use `VITE_TELLUSPEDIA_URL=http://127.0.0.1:3000 npm start` para configurar a origem de retorno no build.
2. No TellusPedia, execute `pnpm install`, `pnpm db:generate` e `pnpm dev`. `NEXT_PUBLIC_TELLUSLAB_URL` aponta para a origem do laboratório e tem como padrão `http://127.0.0.1:4175`.
3. Abra `/telluslab` no TellusPedia, escolha o dossiê de Astronomia e use **Aprofundar no TellusLab**. No painel do macrotema, use **Explorar no TellusPedia** e confirme o link **Retornar ao nó**.
4. No TellusLab, abra **Snapshot → Exportar os oito domínios**. No Hub, selecione o arquivo em **Importar snapshot JSON**.
5. Para testar a mesma origem, mantenha o Lab na porta 4175 e inicie o TellusPedia com `TELLUSLAB_PROXY_URL=http://127.0.0.1:4175 NEXT_PUBLIC_TELLUSLAB_URL=http://127.0.0.1:3000 pnpm dev`. Abra o Lab por `http://127.0.0.1:3000/lab` e o Hub em outra aba da mesma origem. O proxy encaminha a página e `/lab-assets/*`.

A ida usa `/lab?domain=physics&node=DOM-PHYS%3A6.5&ref=telluspedia&entity=observatory%3ACOSMOS`. O retorno abre o destino do manifesto com `?entity=observatory%3ACOSMOS&fromDomain=physics&fromNode=DOM-PHYS%3A6.5`. Um atalho de trilha usa `/lab?domain=languages&track=TRL-LANG-JP`.

## Adicionar ou revisar um Domain Pack

1. Mantenha a especificação Markdown e o manifesto de origem no pacote. A Matemática e a Programação usam `packages/curriculum-*`; os demais usam `domains/<slug>/data/`. Preserve a revisão da fonte, os IDs estáveis e as correções auditáveis do parser.
2. Registre a seed e suas dependências de parsing em `scripts/build.mjs`, o inventário esperado em `scripts/bridge-catalog.mjs` e o perfil pedagógico no switcher. Gere as seeds com `npm run domains:validate`. As saídas canônicas ficam em `dist/domains/<slug>/catalog.json`. O build verifica as contagens, a bibliografia, os pré-requisitos e os ciclos locais e globais.
3. Declare entidades e referências em `scripts/bridge-catalog.mjs` (regras por grupo de macrotemas) ou em `scripts/bridge-links-d26.json` (listas explícitas: `extend` acrescenta nós a um vínculo existente, `links` cria vínculos novos). Os `bookIds` são sempre derivados dos nós. Ao adicionar um destino, implemente a rota ou ação correspondente no TellusPedia. Nunca amplie o manifesto editando o espelho do TellusPedia: o `bridge:verify` falha e a mudança se perde no próximo `bridge:sync`. O teste `test/bridge-manifest-publicado.test.mjs` impede que o gerador perca vínculos já publicados e exige que todo macrotema do registro tenha ao menos um vínculo; ao publicar vínculos novos, acrescente-os também em `test/fixtures/bridge/manifest-publicado.json`.
4. Execute `npm run bridge:sync` para atualizar o espelho e `npm run bridge:verify` para comparar os bytes. O padrão é um checkout irmão `../telluspedia`. Use `TELLUSPEDIA_REPO` para indicar outro checkout.
5. Execute `npm run typecheck`, `npm run lint`, `npm test` e `npm run build`. O typecheck cobre os tipos públicos da ponte. O lint verifica a sintaxe dos módulos JavaScript. Rode também `pnpm typecheck`, `pnpm lint`, `pnpm test` e `pnpm build` no TellusPedia.
