# Backlog do TellusLab

> Fonte de verdade: `git show origin/main:docs/BACKLOG.md`. A cópia local não vale.
> Criado em 2026-11-22. Agentes: Claude Code, Codex e Antigravity. Só o Ayrton move tarefas para `DONE` ou `CANCELLED`.

---

## 0. Visão e diagnóstico

### 0.1 Aonde queremos chegar

O TellusPedia mostra o mundo. O TellusLab faz a pessoa **aprender e continuar aprendendo**: plano do dia, lições, exercícios corrigidos na hora, revisão espaçada, rotina e maestria visível, em 8 domínios. A referência de qualidade é a Khan Academy (maestria, dicas, prática sem fim), com a prática aplicada do DataCamp, Codecademy e SoloLearn (código rodando no navegador). A diferença: gratuito, local-first, sem anúncios e montado sobre conhecimento aberto (livros e recursos educacionais com licença aberta, domínio público, dados públicos), sempre com fonte e licença.

### 0.2 O que já temos (2026-11-22)

- Motor pedagógico sólido em `packages/learning-core`: DAG com pré-requisitos cruzados, FSM S0–S6, FSRS-5, sessões 50/30/20, desafios com cronômetro, diagnóstico por dificuldade, snapshot.
- 8 Domain Packs com especificação, bibliografia (197 obras) e 299 macrotemas qualificados.
- TellusBridge v1.0.0 publicado e espelhado no TellusPedia.
- Testes `node --test` por domínio.

### 0.3 O que falta para chegar lá

| Lacuna | Situação hoje | Impacto |
|---|---|---|
| **Conteúdo de ensino** | Especificações e bibliografia, mas sem lições. Só 6 macrotemas de Matemática têm exercícios resolvidos; os outros 293 usam a prática guiada genérica do Capstone | É o maior abismo em relação à Khan Academy. Sem lição e exercício, o motor não tem o que agendar |
| **Correção automática** | A tentativa é texto livre, avaliado por autoavaliação ou IA opcional | Sem feedback imediato não há prática em volume nem maestria medida |
| **Rotina e motivação** | Agenda e sessões existem, mas não há tela "Hoje", metas, rotinas nem lembretes | É o que evita o padrão "Wikipédia" de visitas esporádicas |
| **Prática aplicada** | Editor de código sem execução | Programação, dados e ciências precisam rodar código e simulações |
| **Engenharia** | `app.mjs` com 832 linhas, JS sem tipos, sem CI, sem E2E, sem `AGENTS.md`, sem backlog | Paralelizar três agentes sem isso gera regressão e conflito |
| **Conhecimento aberto** | Bibliografia citada, sem registro de licenças nem pipeline de ingestão | Não dá para incorporar material aberto com segurança jurídica |
| **Plataforma** | Local, uma origem por porta, sem PWA instalável, sem i18n, sem sincronização entre aparelhos | Limita alcance e uso diário no celular |

### 0.4 Horizontes

| Horizonte | Objetivo | Estado das tarefas |
|---|---|---|
| **L0 Fundação** | Processo multiagente, CI, tipos, modularização, ADRs | Detalhadas, prontas para pegar |
| **L1 Núcleo de aprendizagem** | Content Pack, lição, exercícios autocorrigidos, dicas, maestria, Hoje, rotinas, mapa | Detalhadas |
| **L1-C Conteúdo piloto** | Um corte vertical com lições e exercícios em cada domínio | Detalhadas |
| **L2 Conhecimento aberto em escala** | Registro de licenças, ingestão de recursos abertos, biblioteca, autoria | Épicos (seção 5) |
| **L3 Prática aplicada** | Python, JS e SQL no navegador, simulações, áudio em Idiomas | Épicos |
| **L4 Rotina e motivação avançadas** | Lembretes, relatório semanal, portfólio de maestria | Épicos |
| **L5 Ponte profunda com o TellusPedia** | TellusBridge v1.1, trilhas temáticas, quiz em cenas | Épicos |
| **L6 Plataforma** | PWA, i18n, sincronização opcional, hospedagem pública, privacidade | Épicos |

Épico só vira tarefa `TODO` quando cumpre a Definição de Pronto para Começar (seção 1.3).

---

## 1. Protocolo

### 1.1 Fluxo de uma tarefa

1. `git fetch origin` e ler `git show origin/main:docs/BACKLOG.md`.
2. Rodar `npm run backlog:next -- --agent <claude|codex|antigravity>` (depois de LT02). Até lá, escolher à mão: só uma tarefa `TODO` com todas as dependências em `REVIEW` ou `DONE` e sem nenhuma tarefa `IN_PROGRESS`/`BLOCKED` em algum grupo de conflito em comum.
3. Criar o worktree próprio: `git worktree add ../telluslab-wt/<agente>-<id> -b task/<id>-<slug> origin/main`. O checkout principal é do Ayrton.
4. **Reivindicar antes de codar**: preencher Responsável, Branch e Worktree, mudar para `IN_PROGRESS`, registrar no Log, commit `chore(backlog): <id> IN_PROGRESS (<agente>)` e push para `origin/main`. Push rejeitado: rebase, reler; se alguém pegou a tarefa ou um grupo em comum, desistir.
5. Implementar só o escopo da tarefa. Achou outro problema: crie tarefa nova com o próximo ID livre.
6. Validar: `npm test && npm run typecheck && npm run lint && npm run verify:git` (e `npm run content:lint` depois de LT11, `npm run test:e2e` depois de LT06), mais o "Como verificar" da tarefa.
7. Marcar os critérios, mover para `REVIEW`, registrar no Log, rebase e push para `origin/main`. **Nunca `--force`.**
8. **Revisão cruzada** (novo): outro agente, indicado em "Revisor", lê o diff contra os critérios e registra `REVIEW-OK` ou `REVIEW-AJUSTE` no Log. Ajustes voltam ao autor na mesma branch.
9. O Ayrton move para `DONE` ou `CANCELLED`.

### 1.2 Status e tamanhos

- **Status**: `TODO`, `IN_PROGRESS`, `BLOCKED`, `REVIEW`, `DONE`, `CANCELLED`.
- **Tamanhos**: P ≤ 2 h · M ½–1 dia · G 2–4 dias · GG > 1 semana (proibido em `TODO`; quebrar antes).
- **WIP**: no máximo uma tarefa `IN_PROGRESS` por agente.

### 1.3 Definição de Pronto para Começar (DoR)

Uma tarefa só entra como `TODO` se tiver: contexto, escopo fechado, critérios verificáveis, "Como verificar" executável, grupos de conflito, dependências e tamanho até G. Se depender de contrato (schema, ADR), o contrato tem de estar em `REVIEW` ou `DONE`.

### 1.4 Definição de Pronto (DoD)

Validação completa verde · critérios marcados · testes novos para comportamento novo · documentação afetada atualizada (README, `docs/`) · mudança visual com descrição de captura antes e depois no Log · nada de dado, fonte ou citação inventados · revisão cruzada registrada.

### 1.5 Prefixos de ID

| Prefixo | Uso | Próximo livre |
|---|---|---|
| `LT##` | Engenharia, infraestrutura, motor | LT17 |
| `LD##` | Design, produto, UX e ADRs | LD13 |
| `LC##` | Conteúdo pedagógico (lições, exercícios, cartões) | LC09 |

O prefixo `L` evita colisão com `T##`/`D##` do TellusPedia quando uma tarefa é citada nos dois repositórios.

### 1.6 Grupos de conflito

| Grupo | Arquivos ou área |
|---|---|
| `G-CORE` | `packages/learning-core/**` |
| `G-SHELL` | `apps/web/src/app.mjs`, `ui.mjs`, `index.html`, roteamento e navegação |
| `G-PRATICA` | `apps/web/src/practice.mjs`, motor e telas de exercício |
| `G-CURRICULO` | `curriculum.mjs`, `overview.mjs`, mapa e biblioteca |
| `G-STORE` | `store.mjs`, IndexedDB, `sw.js`, migrações de armazenamento |
| `G-BRIDGE` | `packages/tellus-bridge/**`, `packages/telluspedia-bridge/**`, `scripts/bridge-*`, snapshot |
| `G-BUILD` | `package.json`, `scripts/build.mjs`, `scripts/lint.mjs`, CI, configuração de testes |
| `G-DS` | `styles.css`, tokens e componentes visuais |
| `G-CONTRATO` | `packages/content-schema/**` (schema do Content Pack) |
| `G-DOCS` | `README.md`, `AGENTS.md`, `docs/**` exceto o backlog |
| `G-CONT-MATH`, `G-CONT-PROG`, `G-CONT-ECON`, `G-CONT-PHYS`, `G-CONT-ENG`, `G-CONT-HUM`, `G-CONT-LANG`, `G-CONT-LIT` | `content/<domínio>/**` de cada domínio |
| `G-PEDIA` | Exige mudança no TellusPedia: abrir tarefa espelho no backlog dele e seguir o protocolo de lá |

Tarefas de conteúdo em domínios diferentes não conflitam entre si nem com código. É onde está a maior parte do paralelismo.

### 1.7 Agentes, portas e afinidade

| Agente | Worktree | Porta (`MATH_LAB_PORT`) | Afinidade sugerida |
|---|---|---|---|
| Claude Code | `../telluslab-wt/claude-<id>` | 4176 | ADRs, contratos, motor pedagógico, conteúdo e redação |
| Codex | `../telluslab-wt/codex-<id>` | 4177 | Implementação com testes, refatoração, scripts, CI |
| Antigravity | `../telluslab-wt/antigravity-<id>` | 4178 | Telas, interação, verificação no navegador, E2E visual |
| Ayrton | checkout principal | 4175 | Decisões, revisão final, revisão de conteúdo |

A afinidade é sugestão: qualquer agente pode pegar qualquer tarefa livre.

### 1.8 Commits

Conventional Commits em português com o ID: `feat(exercicios): correção numérica com tolerância e unidade (LT13)`, `chore(backlog): LT13 REVIEW (codex)`.

### 1.9 Formato de tarefa

```
### <ID> · <título>
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta | Média | Baixa
- **Área**: …
- **Tamanho**: P | M | G
- **Depende de**: —
- **Grupos**: …
- **Afinidade sugerida**: …

**Contexto**
**O que fazer**
**Critérios de aceite** (checkboxes)
**Como verificar**
**Log**
- AAAA-MM-DD · <responsável> · <STATUS> · <nota>
```

---

## 2. Invariantes do TellusLab

Valem para todas as tarefas. LT01 os transforma em `AGENTS.md`.

1. **Local-first**: tudo funciona sem servidor próprio e offline após o primeiro carregamento. Recurso que exige rede é opcional e diz quando está indisponível.
2. **Privacidade**: progresso, rascunho e solução não saem do navegador sem ação explícita. Nada pessoal em URL, query string, Git ou log.
3. **FSM S0–S6 é a única autoridade de proficiência**. Exercícios, dicas e cartões produzem evidências; só a FSM muda estado. Guardas de pré-requisito (Modo Flexível e Estrito) nunca são contornadas pela interface.
4. **Solução só depois de tentativa gravada.** Dica conta como ajuda e pesa na evidência.
5. **Snapshot e armazenamento versionados**: mudança de formato exige nova versão, migração explícita e teste com um snapshot antigo real.
6. **O TellusBridge é gerado pelo Lab.** Mudança no contrato exige `bridge:sync` + `bridge:verify` e tarefa espelho no TellusPedia (`G-PEDIA`).
7. **Conteúdo nunca inventado**: toda afirmação factual, dado ou citação tem fonte verificável. Material de terceiros entra só com licença compatível registrada e atribuição visível. Gabarito de exercício é conferido por teste automático ou por revisão humana registrada.
8. **IA é opcional**: sem provedor, tudo funciona. Conteúdo gerado com ajuda de IA é marcado `review: pending` até revisão humana.
9. **Sem padrões manipuladores**: nada de culpa, perda punitiva de sequência, contagem regressiva falsa ou notificação não pedida.
10. **Acessibilidade WCAG 2.2 AA** em toda tela nova: teclado, foco visível, contraste, rótulos, `prefers-reduced-motion`.
11. **Português do Brasil** em interface, conteúdo, código de domínio, commits e documentação.
12. **Desempenho**: bibliotecas pesadas (Mermaid, Pyodide, motor simbólico) carregadas sob demanda; a tela inicial não espera por elas.

---

## 3. Decisões que dependem do Ayrton

As tarefas LD01–LD05 e LD12 são ADRs: o agente redige as opções com prós, contras e recomendação, o Ayrton decide no Log e a tarefa vai para `DONE`. Tarefas que dependem de um ADR ficam travadas até lá.

| ADR | Pergunta | Recomendação inicial |
|---|---|---|
| LD01 | JS com JSDoc + `checkJs` estrito, ou migração para TypeScript com build? | `checkJs` estrito já, `.ts` gradual no `learning-core` |
| LD02 | Continuar sem framework, adotar Web Components/Lit ou Preact? | Decidir após LT05; critério principal: reaproveitar tokens do D14 sem trazer React inteiro |
| LD03 | Formato do Content Pack (lição, exercício, dica, cartão, fonte) | Markdown com front matter + JSON de exercícios, validado por JSON Schema 2020-12 |
| LD04 | Motor de correção simbólica e sandbox de código | Avaliar bibliotecas de álgebra simbólica no navegador e Pyodide em Web Worker |
| LD05 | Política de licenças e fontes abertas | Aceitar CC0, domínio público, CC BY, CC BY-SA (com compartilhamento pela mesma licença); NC só como link externo |
| LD12 | Sincronização entre aparelhos e contas | Fica no L6; registrar a direção agora para não fechar portas no armazenamento |

---

## 4. Tarefas

### Horizonte L0 · Fundação

### LT01 · AGENTS.md do TellusLab
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Processo
- **Tamanho**: P
- **Depende de**: —
- **Grupos**: G-DOCS
- **Afinidade sugerida**: Claude

**Contexto**
O TellusPedia tem `AGENTS.md` com invariantes técnicos lidos por todos os agentes. O Lab não tem, e os invariantes estão espalhados no README e em `docs/`.

**O que fazer**
Criar `AGENTS.md` na raiz com: stack e comandos, estrutura de pastas, os 12 invariantes da seção 2, protocolo resumido com link para o backlog, portas por agente e regras de commit. Criar `CLAUDE.md` e `GEMINI.md` curtos que apontam para `AGENTS.md`.

**Critérios de aceite**
- [ ] `AGENTS.md` cobre os 12 invariantes e todos os comandos de `package.json`.
- [ ] `CLAUDE.md` e `GEMINI.md` apontam para `AGENTS.md` sem duplicar conteúdo.
- [ ] README ganha link para `AGENTS.md` e para o backlog.

**Como verificar**
Ler os três arquivos; conferir cada comando citado contra `package.json`.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT02 · Lint do backlog e `backlog:next`
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Processo
- **Tamanho**: M
- **Depende de**: —
- **Grupos**: G-BUILD
- **Afinidade sugerida**: Codex

**Contexto**
No TellusPedia a escolha de tarefa e a checagem de conflitos eram manuais. Com três agentes em paralelo, um erro de leitura gera dois agentes no mesmo grupo.

**O que fazer**
`scripts/backlog.mjs` com dois comandos:
- `npm run backlog:lint`: valida o formato de cada tarefa (campos obrigatórios, status e tamanho válidos, IDs únicos, dependências existentes, grupos conhecidos da seção 1.6, nenhum GG em `TODO`, no máximo um `IN_PROGRESS` por agente, nenhum par `IN_PROGRESS` com grupo em comum, linhas de Log no formato).
- `npm run backlog:next -- --agent <nome>`: lista as tarefas que esse agente pode reivindicar agora, ordenadas por prioridade e afinidade, e explica por que as outras estão bloqueadas.
Ler por padrão `git show origin/main:docs/BACKLOG.md`, com `--file` para arquivo local.

**Critérios de aceite**
- [ ] O lint aponta linha e motivo de cada erro e sai com código ≠ 0.
- [ ] `backlog:next` respeita dependências, grupos e WIP.
- [ ] Testes em `test/backlog.test.mjs` com backlogs de exemplo válidos e inválidos.
- [ ] `backlog:lint` roda dentro de `npm run lint`.

**Como verificar**
`npm run backlog:lint` passa neste arquivo; criar uma cópia com dois `IN_PROGRESS` em `G-CORE` e ver o erro; `npm run backlog:next -- --agent codex` lista LT02/LT03 enquanto estiverem livres.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT03 · CI no GitHub Actions
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Infraestrutura
- **Tamanho**: M
- **Depende de**: —
- **Grupos**: G-BUILD
- **Afinidade sugerida**: Codex

**Contexto**
O Lab não tem CI. Hoje uma quebra só aparece quando alguém roda `npm test` localmente.

**O que fazer**
`.github/workflows/ci.yml` em push e pull request para `main`: Node 20 e 22, `npm ci`, `npm test`, `npm run typecheck`, `npm run lint`. Job separado que faz checkout de `AyrtonLoks/telluspedia` ao lado e roda `npm run bridge:verify`, sem bloquear quando o TellusPedia estiver à frente (resultado como aviso). Badge no README.

**Critérios de aceite**
- [ ] Workflow verde em `main`.
- [ ] Falha de teste quebra o job principal.
- [ ] Job de paridade do contrato roda e mostra o resultado.
- [ ] Cache do npm configurado.

**Como verificar**
Abrir PR com um teste quebrado de propósito em branch descartável e ver o job falhar; reverter.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LD01 · ADR-001: linguagem e tipos
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Arquitetura
- **Tamanho**: P
- **Depende de**: —
- **Grupos**: G-DOCS
- **Afinidade sugerida**: Claude

**Contexto**
O Lab é JS ESM sem tipos; só o contrato da ponte tem `.d.mts`. O padrão preferido nos projetos do Ayrton é TypeScript estrito sem `any`.

**O que fazer**
Escrever `docs/adr/ADR-001-linguagem-e-tipos.md` comparando: (a) JSDoc + `checkJs` estrito sem build novo; (b) TypeScript com esbuild no `scripts/build.mjs`; (c) híbrido, `checkJs` agora e `.ts` gradual no `learning-core`. Para cada uma: impacto no build estático, no service worker, nos testes `node --test` (Node 22.6+ remove tipos nativamente; Node 20 não) e no esforço. Recomendação e plano de migração em passos que caibam em tarefas M.

**Critérios de aceite**
- [ ] ADR no formato Contexto, Opções, Decisão, Consequências.
- [ ] Plano de migração com tarefas propostas e tamanhos.
- [ ] Decisão do Ayrton registrada no Log.

**Como verificar**
Leitura; a decisão aparece no Log.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT04 · Typecheck estrito do `learning-core`
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Engenharia
- **Tamanho**: G
- **Depende de**: LD01
- **Grupos**: G-CORE, G-BUILD
- **Afinidade sugerida**: Codex

**Contexto**
O `learning-core` é o coração do Lab (FSM, FSRS, DAG, sessões, snapshot) e não tem tipos. Erros de forma de estado só aparecem em tempo de execução.

**O que fazer**
Aplicar a decisão do LD01 ao `packages/learning-core`: tipos para `Catalog`, `Topic`, `Dag`, `LearningState`, `Progress`, `ReviewCard`, `Attempt`, `Session`, `Snapshot`; `tsconfig.json` estrito (`strict`, `noUncheckedIndexedAccess`, sem `any` implícito); `npm run typecheck` passa a cobrir o pacote.

**Critérios de aceite**
- [ ] `npm run typecheck` cobre `packages/learning-core` sem erros e sem `any`.
- [ ] Nenhuma mudança de comportamento: todos os testes passam sem edição de asserções.
- [ ] Tipos exportados para uso em `apps/web` e nos Domain Packs.

**Como verificar**
`npm run typecheck && npm test`; `grep -rn "any" packages/learning-core` sem ocorrências em tipos.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT05 · E2E de fumaça com Playwright
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Qualidade
- **Tamanho**: M
- **Depende de**: LT03
- **Grupos**: G-BUILD
- **Afinidade sugerida**: Antigravity

**Contexto**
Antes de quebrar `app.mjs` (LT06) precisamos de uma rede de segurança que exercite a interface real.

**O que fazer**
Playwright sobre o build servido em porta própria (4190). Fluxos: abrir cada um dos 8 domínios por `/lab?domain=…`; validar um macrotema; registrar tentativa e ver a solução liberada só depois dela; revisar um cartão; exportar e reimportar snapshot; abrir com rede desligada após o primeiro carregamento (service worker). Script `npm run test:e2e` e job no CI.

**Critérios de aceite**
- [ ] 6 fluxos acima automatizados e verdes.
- [ ] Cada teste começa com IndexedDB limpo.
- [ ] Job de E2E no CI com relatório anexado em falha.

**Como verificar**
`npm run test:e2e` local e no CI.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT06 · Modularizar `app.mjs` sem mudar comportamento
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Engenharia
- **Tamanho**: G
- **Depende de**: LT05
- **Grupos**: G-SHELL, G-PRATICA, G-CURRICULO
- **Afinidade sugerida**: Codex

**Contexto**
`apps/web/src/app.mjs` tem 832 linhas e concentra composição, roteamento, telas e eventos. Quase toda tarefa de interface do L1 tocaria esse arquivo e travaria o paralelismo.

**O que fazer**
Separar em `apps/web/src/`: `router.mjs` (hash e `/lab?domain=`), `composition.mjs` (registro dos Domain Packs), `screens/<tela>.mjs` (uma por tela) e `events.mjs`. Limite de 300 linhas por arquivo. Atualizar a tabela de grupos de conflito (seção 1.6) com os novos caminhos.

**Critérios de aceite**
- [ ] Nenhum arquivo de `apps/web/src` acima de 300 linhas.
- [ ] Testes unitários e E2E do LT05 passam sem alteração.
- [ ] Seção 1.6 do backlog atualizada com o mapa de arquivos para grupos.

**Como verificar**
`wc -l apps/web/src/**/*.mjs`; `npm test && npm run test:e2e`.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LD02 · ADR-002: arquitetura de interface e design system
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Arquitetura
- **Tamanho**: M
- **Depende de**: LT06
- **Grupos**: G-DOCS
- **Afinidade sugerida**: Claude

**Contexto**
O L1 traz muitas telas novas (Hoje, lição, exercícios, mapa, rotinas). Precisamos decidir como compor interface antes de multiplicar código. O TellusPedia usa React com o design system D14 "Instrumento sereno".

**O que fazer**
`docs/adr/ADR-002-interface.md` comparando: manter DOM puro com componentes em funções; Web Components (Lit); Preact. Critérios: tamanho de bundle, offline, acessibilidade, reaproveitamento dos tokens do D14 (cores semânticas, 5 tamanhos de texto, raios, sombras, durações), curva para os agentes, custo de migrar as telas atuais. Incluir como os tokens viram CSS custom properties compartilháveis com o TellusPedia.

**Critérios de aceite**
- [ ] ADR com medição de bundle de um protótipo mínimo por opção.
- [ ] Proposta de pacote de tokens comum aos dois projetos.
- [ ] Decisão do Ayrton registrada no Log.

**Como verificar**
Leitura; números de bundle reproduzíveis por comando citado no ADR.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LD07 · Tokens do design system no Lab
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Design
- **Tamanho**: M
- **Depende de**: LD02
- **Grupos**: G-DS
- **Afinidade sugerida**: Antigravity

**Contexto**
`styles.css` tem 18 KB de estilos sem tokens. Telas novas precisam de base visual consistente com o TellusPedia.

**O que fazer**
Aplicar os tokens decididos no LD02: cores semânticas (superfície, linha, texto em 3 níveis, acento, sucesso, aviso, perigo e cores de estado S0–S6), escala de 5 tamanhos de texto, raios, sombras e durações. Modo claro e escuro. Substituir valores fixos em `styles.css`. Página `/dev/ui` com a vitrine.

**Critérios de aceite**
- [ ] Nenhuma cor hex fora do arquivo de tokens.
- [ ] Contraste AA medido para texto e estados S0–S6 nos dois modos.
- [ ] Vitrine `/dev/ui` com todos os tokens e componentes básicos.
- [ ] Log com descrição das capturas antes e depois.

**Como verificar**
`grep -nE "#[0-9a-fA-F]{3,6}" apps/web/src/styles.css` só no bloco de tokens; E2E verde.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### Horizonte L1 · Núcleo de aprendizagem

### LD03 · ADR-003: Content Pack v1
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Arquitetura e pedagogia
- **Tamanho**: M
- **Depende de**: —
- **Grupos**: G-DOCS
- **Afinidade sugerida**: Claude

**Contexto**
Os Domain Packs descrevem o currículo (macrotemas, pré-requisitos, obras), mas não há lugar para o que se ensina e pratica. O exemplo atual (`packages/curriculum-mathematics/authorship.mjs`) mistura conteúdo e código. Este ADR é o contrato que libera o trabalho de conteúdo em paralelo nos 8 domínios.

**O que fazer**
`docs/adr/ADR-003-content-pack.md` definindo:
- Unidade: cada macrotema `DOM-XXX:n.n` tem lições, exercícios e cartões em `content/<domínio>/<n.n>/`.
- **Lição**: Markdown com front matter (`id`, `node`, `title`, `minutes`, `objectives`, `sources[]`, `license`, `review`), blocos de explicação, exemplo resolvido, figura com atribuição, verificação rápida.
- **Exercício**: JSON com `type` (`multiple-choice`, `numeric`, `short-text`, `ordering`, `cloze`, `expression`, `code`, `rubric`), enunciado, parâmetros para gerar variantes, gabarito ou testes, dicas progressivas, solução passo a passo, erros comuns ligados a etiquetas `DIF-*`.
- **Cartão FSRS**: frente, verso, direção (reconhecimento, produção).
- **Fonte**: referência a `BIB-XXX-nn` ou a entrada do registro de fontes (LT16), com licença SPDX.
- Versionamento do pack, IDs estáveis e regra de migração.

**Critérios de aceite**
- [ ] ADR com exemplos completos de lição, de cada tipo de exercício e de cartão.
- [ ] Regras de ID estável e de versionamento.
- [ ] Mostra como exercícios geram evidências para a FSM sem alterar suas regras.
- [ ] Decisão do Ayrton registrada no Log.

**Como verificar**
Leitura; os exemplos validam contra o schema do LT07 quando ele existir.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT07 · Schema do Content Pack v1
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Contrato
- **Tamanho**: M
- **Depende de**: LD03
- **Grupos**: G-CONTRATO
- **Afinidade sugerida**: Claude

**Contexto**
Contrato executável do LD03, no mesmo padrão do `packages/tellus-bridge` (JSON Schema Draft 2020-12 + tipos).

**O que fazer**
Criar `packages/content-schema/` com `lesson.schema.json`, `exercise.schema.json`, `card.schema.json`, `source.schema.json`, tipos `.d.mts`, função `validateContentPack(dir)` e carregador que monta o pacote de conteúdo no build (`dist/content/<domínio>.json`, um arquivo por domínio, carregado sob demanda).

**Critérios de aceite**
- [ ] Os exemplos do ADR-003 validam; variações inválidas falham com mensagem legível.
- [ ] Build gera um JSON por domínio e não aumenta o carregamento inicial.
- [ ] Testes em `test/content-schema.test.mjs`.

**Como verificar**
`npm test`; inspecionar `dist/content/`.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT08 · `content:lint`
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Qualidade de conteúdo
- **Tamanho**: M
- **Depende de**: LT07
- **Grupos**: G-BUILD
- **Afinidade sugerida**: Codex

**Contexto**
Com três agentes escrevendo conteúdo, a qualidade não pode depender só de leitura. Erros comuns: LaTeX que não compila, nó inexistente, fonte sem licença, gabarito errado.

**O que fazer**
`npm run content:lint` que verifica: schema; IDs únicos; `node` existe no catálogo; todo LaTeX compila no KaTeX; blocos Mermaid são válidos; toda fonte tem licença do registro (ou `BIB-*` existente); exercícios `numeric`, `expression` e `code` têm o gabarito conferido executando o próprio verificador sobre a solução de referência; `review: pending` gera aviso (não erro). Entra no `npm run lint` e no CI.

**Critérios de aceite**
- [ ] Cada regra tem teste com caso válido e inválido.
- [ ] Saída com arquivo, linha e motivo.
- [ ] Relatório de cobertura: macrotemas com lição, com exercícios e com cartões, por domínio.

**Como verificar**
`npm run content:lint` sobre os exemplos do ADR; `npm run content:coverage`.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT09 · Leitor de lição
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Interface
- **Tamanho**: M
- **Depende de**: LT06, LT07
- **Grupos**: G-CURRICULO
- **Afinidade sugerida**: Antigravity

**Contexto**
Hoje o macrotema mostra especificação e critérios de aceite, mas não ensina. A lição é a porta de entrada do ciclo aprender → praticar → revisar.

**O que fazer**
Tela de lição dentro do macrotema: objetivos, tempo estimado, texto com KaTeX, Mermaid e highlight.js (carregados sob demanda), figuras com atribuição, verificações rápidas embutidas (usam o motor do LT10 quando existir), rodapé de fontes com licença e citação, botão "Praticar" que leva aos exercícios. Marcar lição lida gera evento de estudo pela FSM (sem pular guardas).

**Critérios de aceite**
- [ ] Lição de exemplo do ADR-003 renderiza completa, inclusive offline.
- [ ] Fontes e licenças visíveis no rodapé.
- [ ] Navegação por teclado e leitor de tela verificada.
- [ ] Macrotema bloqueado mostra os pré-requisitos pendentes em vez da lição no Modo Estrito.

**Como verificar**
E2E novo abrindo a lição de exemplo; teste com rede desligada.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LD04 · ADR-004: correção simbólica e execução de código
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Arquitetura
- **Tamanho**: M
- **Depende de**: —
- **Grupos**: G-DOCS
- **Afinidade sugerida**: Claude

**Contexto**
Exercícios de Matemática, Física, Engenharia e Economia pedem resposta como expressão; Programação pede código executado contra testes. As duas coisas precisam rodar no navegador, offline e com segurança.

**O que fazer**
`docs/adr/ADR-004-correcao.md` avaliando: bibliotecas de álgebra simbólica para equivalência de expressões (critérios: licença, tamanho, suporte a LaTeX de entrada, precisão); estratégia numérica de equivalência por amostragem como alternativa; Pyodide e execução JS em Web Worker com tempo-limite, memória e sem acesso a rede ou DOM; SQL no navegador. Prova de conceito de cada escolha com medição de tamanho e tempo de carga.

**Critérios de aceite**
- [ ] Tabela comparativa com licenças verificadas na fonte oficial.
- [ ] Prova de conceito executável e medida para expressão e para código.
- [ ] Modelo de ameaças do sandbox (laço infinito, alocação excessiva, acesso a `fetch`).
- [ ] Decisão do Ayrton registrada no Log.

**Como verificar**
Rodar as provas de conceito pelos comandos citados no ADR.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT10 · Motor de exercícios autocorrigidos (tipos básicos)
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Motor e interface
- **Tamanho**: G
- **Depende de**: LT06, LT07
- **Grupos**: G-PRATICA
- **Afinidade sugerida**: Codex

**Contexto**
Prática em volume com feedback imediato é o que a Khan Academy faz melhor. Hoje a tentativa é texto livre.

**O que fazer**
Em `packages/exercise-engine/` (lógica pura, testável) e tela em `G-PRATICA`: tipos `multiple-choice`, `numeric` (tolerância absoluta e relativa, unidade opcional), `short-text` (normalização de acento, caixa e espaços), `ordering` e `cloze`. Variantes por parâmetros com semente determinística. Fluxo: responder → correto/incorreto com explicação do erro comum → próxima. Cada tentativa vira registro com resultado, tempo e ajudas usadas, entregue ao `learning-core`.

**Critérios de aceite**
- [ ] Os 5 tipos com testes de correção, incluindo bordas (tolerância, unidade errada, acento).
- [ ] Mesma semente gera a mesma variante.
- [ ] Erro comum ligado a `DIF-*` dispara o diagnóstico existente.
- [ ] Teclado completo e anúncio de resultado para leitor de tela.

**Como verificar**
`npm test`; E2E respondendo certo e errado cada tipo no pack de exemplo.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT11 · Correção de expressões
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Motor
- **Tamanho**: M
- **Depende de**: LT10, LD04
- **Grupos**: G-PRATICA
- **Afinidade sugerida**: Codex

**Contexto**
Tipo `expression` do Content Pack, com a biblioteca escolhida no LD04.

**O que fazer**
Entrada em LaTeX com prévia, verificação de equivalência (forma exigida opcional: fatorada, simplificada), mensagens para erro de sintaxe, carregamento sob demanda da biblioteca.

**Critérios de aceite**
- [ ] `2(x+1)` e `2x+2` equivalentes; forma fatorada exigida rejeita a expandida com mensagem.
- [ ] Biblioteca fora do carregamento inicial.
- [ ] Testes com 30+ pares de equivalência e não equivalência.

**Como verificar**
`npm test`; inspecionar a aba de rede ao abrir a tela inicial.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT12 · Dicas progressivas e solução passo a passo
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Pedagogia e interface
- **Tamanho**: M
- **Depende de**: LT10
- **Grupos**: G-PRATICA
- **Afinidade sugerida**: Antigravity

**Contexto**
Dica em camadas transforma erro em aprendizagem. Precisa conviver com a regra "solução só depois de tentativa gravada".

**O que fazer**
Botão "Preciso de uma dica" revela uma dica por vez; a última camada é a solução passo a passo e só aparece depois de pelo menos uma tentativa gravada. O registro da tentativa marca quantas dicas foram usadas.

**Critérios de aceite**
- [ ] Solução nunca aparece antes de tentativa gravada (teste unitário e E2E).
- [ ] Quantidade de dicas registrada na tentativa.
- [ ] Texto dos botões e estados revisado em sentence case.

**Como verificar**
E2E: pedir todas as dicas sem responder e confirmar que a solução fica bloqueada.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT13 · Evidência de maestria a partir de exercícios
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Motor pedagógico
- **Tamanho**: M
- **Depende de**: LT10, LT04
- **Grupos**: G-CORE
- **Afinidade sugerida**: Claude

**Contexto**
A FSM S0–S6 é a autoridade de proficiência (invariante 3). Faltam regras que convertam acertos autocorrigidos em evidência.

**O que fazer**
Função pura `evidenceFromAttempts(attempts, policy)` no `learning-core`: política padrão inspirada em maestria (sequência de acertos sem dica em variantes diferentes, com peso menor para acerto com dica) que propõe eventos de estudo à FSM. Configurável por domínio. Documentar em `docs/maestria.md`.

**Critérios de aceite**
- [ ] A FSM continua sendo a única a mudar estado; guardas de pré-requisito respeitadas.
- [ ] Acerto com dica conta menos que sem dica; repetir a mesma variante não conta duas vezes.
- [ ] Testes de propriedade para monotonicidade e para guardas.
- [ ] Snapshots antigos continuam importando.

**Como verificar**
`npm test`; importar um snapshot real exportado antes da mudança.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT14 · Cartões FSRS declarados no conteúdo
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Motor pedagógico
- **Tamanho**: M
- **Depende de**: LT07, LT04
- **Grupos**: G-CORE
- **Afinidade sugerida**: Codex

**Contexto**
Hoje os cartões nascem de pontos específicos (Kanji, macrotema 3.3 de Idiomas). Com o Content Pack, cada lição pode declarar seus cartões.

**O que fazer**
Ao validar uma lição ou atingir S4 num macrotema, cadastrar na fila FSRS os cartões declarados ainda ausentes, sem duplicar por ID. Pares reconhecimento/produção onde o cartão pedir.

**Critérios de aceite**
- [ ] Sem duplicação ao repetir a ação.
- [ ] Pares de Idiomas continuam funcionando como hoje.
- [ ] Testes cobrindo cadastro, deduplicação e snapshot.

**Como verificar**
`npm test`.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LD08 · Tela "Hoje"
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Produto e interface
- **Tamanho**: M
- **Depende de**: LT06
- **Grupos**: G-SHELL
- **Afinidade sugerida**: Antigravity

**Contexto**
Quem volta ao Lab precisa saber em segundos o que fazer. É a principal defesa contra o uso esporádico.

**O que fazer**
Nova tela inicial "Hoje" usando `planSession` e a agenda existentes: revisões vencidas (com estimativa de minutos), próximo avanço sugerido por domínio ativo, micro-revisões de diagnóstico e botão "Começar sessão". Mostrar a meta do dia quando houver (LD09). Estado vazio para primeiro acesso leva à escolha de domínios.

**Critérios de aceite**
- [ ] Números vêm do estado real; sem dado, a tela diz que não há dado.
- [ ] Primeiro acesso com estado vazio orienta a escolher domínios.
- [ ] Começar sessão abre a sessão planejada.
- [ ] Log com descrição das capturas.

**Como verificar**
E2E com estado vazio e com snapshot de exemplo contendo revisões vencidas.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LD09 · Rotinas e metas
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Produto
- **Tamanho**: G
- **Depende de**: LD08
- **Grupos**: G-SHELL, G-STORE
- **Afinidade sugerida**: Claude

**Contexto**
Aprender exige rotina. O pedido central é que a pessoa crie rotinas e acompanhe seus estudos.

**O que fazer**
- Rotina semanal: dias, horário preferido, minutos por dia e domínios.
- Meta diária derivada da rotina; dia cumprido quando os minutos de estudo efetivo atingem a meta.
- Sequência de dias cumpridos com regra saudável (invariante 9): dias fora da rotina não quebram a sequência; até 2 "pausas" por mês preservam a sequência; texto sem culpa.
- Exportar a rotina como `.ics` para o calendário do aparelho.
- Persistência no IndexedDB com migração e inclusão no snapshot (versão nova, campo opcional).

**Critérios de aceite**
- [ ] Rotina criada, editada e refletida na tela Hoje.
- [ ] Sequência respeita dias fora da rotina e pausas (testes de calendário com fuso UTC-3 e virada de mês).
- [ ] `.ics` abre no Google Agenda e no calendário do Windows.
- [ ] Snapshot antigo importa; snapshot novo mantém a rotina.

**Como verificar**
`npm test`; E2E criando rotina; importar o `.ics` gerado.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LD10 · Mapa de maestria navegável
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Interface
- **Tamanho**: G
- **Depende de**: LT06, LD07
- **Grupos**: G-CURRICULO
- **Afinidade sugerida**: Antigravity

**Contexto**
O DAG é a estrutura mais rica do Lab e hoje aparece como lista e caminhos pendentes. Ver o próprio progresso no grafo motiva e orienta.

**O que fazer**
Visualização SVG do DAG por domínio e por trilha, com layout hierárquico calculado no build ou sob demanda; cor por estado S0–S6 (tokens); pré-requisitos cruzados como nós fantasmas de outros domínios; clique abre o macrotema; zoom e foco por teclado; alternativa em lista acessível.

**Critérios de aceite**
- [ ] Os 8 domínios renderizam; Matemática (88 nós) com interação fluida.
- [ ] Estados batem com o estado real.
- [ ] Alternativa em lista com a mesma informação para leitor de tela.

**Como verificar**
E2E clicando num nó; medir tempo de renderização de Matemática no Log.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LD05 · ADR-005: política de licenças e fontes abertas
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Conteúdo e jurídico
- **Tamanho**: M
- **Depende de**: —
- **Grupos**: G-DOCS
- **Afinidade sugerida**: Claude

**Contexto**
A proposta é usar conhecimento aberto. Aberto não é igual a livre de regras: há licenças com atribuição, com compartilhamento pela mesma licença e com proibição de uso comercial. O Lab é MIT; o conteúdo pode precisar de licença própria.

**O que fazer**
`docs/adr/ADR-005-licencas.md` com: licença do conteúdo autoral do Lab (proposta: CC BY-SA 4.0, separada do código MIT); quais licenças de terceiros podem ser incorporadas, quais só como link; modelo de atribuição; tratamento de domínio público por país (Brasil: 70 anos após a morte do autor); lista inicial de fontes candidatas por domínio (livros didáticos abertos, Wikibooks e Wikipédia, Project Gutenberg e Domínio Público do governo brasileiro, cursos abertos universitários, repositórios de artigos de acesso aberto, Tatoeba e dicionários abertos para Idiomas, dados do Banco Mundial e IBGE), com a licença de cada uma **verificada na página oficial** e a data da verificação.

**Critérios de aceite**
- [ ] Cada fonte candidata com licença, link oficial e data de verificação.
- [ ] Regra clara para conteúdo com cláusula não comercial.
- [ ] Decisão do Ayrton registrada no Log.

**Como verificar**
Leitura; conferir 3 licenças sorteadas nas páginas oficiais.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LT15 · Separar autoria de Matemática em conteúdo
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Engenharia de conteúdo
- **Tamanho**: M
- **Depende de**: LT07, LT10
- **Grupos**: G-CONT-MATH
- **Afinidade sugerida**: Codex

**Contexto**
`packages/curriculum-mathematics/authorship.mjs` (12 KB) gera os 6 exercícios resolvidos em código. Deve virar Content Pack para servir de modelo aos outros domínios.

**O que fazer**
Converter os exercícios de 1.1, 1.2, 1.3, 1.4 e 1.6 (e o sexto existente) para `content/mathematics/`, preservando parâmetros e variantes. Manter o fallback do Capstone para macrotemas sem conteúdo. Remover o código de autoria substituído.

**Critérios de aceite**
- [ ] Mesmas variantes geradas antes e depois para as mesmas sementes (teste de regressão).
- [ ] `authorship.mjs` removido ou reduzido ao que não é conteúdo.
- [ ] `content:lint` verde.

**Como verificar**
`npm test && npm run content:lint`.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### Horizonte L1-C · Conteúdo piloto

Regras para todas as tarefas `LC`:
- Dependem de LT07 e LT08; tipos `expression` dependem de LT11.
- Cada macrotema do piloto entrega: 1 lição, no mínimo 8 exercícios autocorrigidos (pelo menos 3 tipos), dicas em todos, solução passo a passo, 5 a 10 cartões.
- Fontes reais com `BIB-*` ou entrada do registro; excertos de terceiros só com licença compatível (LD05).
- Tudo entra com `review: pending`. O Ayrton revisa e muda para `review: ok`; `REVIEW` exige `content:lint` verde.
- O "Como verificar" comum é `npm run content:lint && npm test` e percorrer o piloto no navegador.

### LC01 · Piloto de Matemática: trilha inicial
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Alta
- **Área**: Conteúdo
- **Tamanho**: G
- **Depende de**: LT08, LT15
- **Grupos**: G-CONT-MATH
- **Afinidade sugerida**: Claude

**Contexto**
Matemática é a base dos pré-requisitos cruzados: 50 conexões vêm de Programação, 41 de Economia, 75 de Física. É o primeiro corte vertical.

**O que fazer**
Completar lições, exercícios e cartões dos macrotemas 1.1 a 1.6 segundo a especificação e os critérios de aceite de cada um em `especificacao.md`.

**Critérios de aceite**
- [ ] 6 macrotemas com o pacote mínimo das regras acima.
- [ ] Cada critério de aceite da especificação coberto por pelo menos um exercício (tabela no Log).
- [ ] `content:lint` verde.

**Como verificar**
Regras comuns; `npm run content:coverage` mostra 6/88 com conteúdo completo.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LC02 · Piloto de Programação: fundamentos sem execução
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Conteúdo
- **Tamanho**: G
- **Depende de**: LT08
- **Grupos**: G-CONT-PROG
- **Afinidade sugerida**: Codex

**Contexto**
A execução de código chega no L3. Antes disso dá para ensinar com leitura de código, previsão de saída, ordenação de linhas e lacunas.

**O que fazer**
Três primeiros macrotemas da trilha inicial de Programação com exercícios de previsão de saída (`short-text`), ordenação de linhas (`ordering`), lacunas (`cloze`) e múltipla escolha sobre trechos. Todo trecho de código executado de verdade para conferir a saída esperada (script no próprio teste).

**Critérios de aceite**
- [ ] 3 macrotemas com o pacote mínimo.
- [ ] Saídas esperadas conferidas por execução real em teste.

**Como verificar**
Regras comuns.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LC03 · Piloto de Física
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Conteúdo
- **Tamanho**: G
- **Depende de**: LT08, LT11
- **Grupos**: G-CONT-PHYS
- **Afinidade sugerida**: Claude

**Contexto**
Física tem 75 conexões com Matemática e liga direto ao Observatório do TellusPedia.

**O que fazer**
Macrotemas 1.1 a 1.4 com exercícios numéricos com unidade e tolerância, expressões e múltipla escolha conceitual. Constantes físicas com fonte (CODATA).

**Critérios de aceite**
- [ ] 4 macrotemas com o pacote mínimo.
- [ ] Toda constante citada com fonte e valor de referência.

**Como verificar**
Regras comuns.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LC04 · Piloto de Idiomas: japonês, kana
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Conteúdo
- **Tamanho**: M
- **Depende de**: LT08, LT14
- **Grupos**: G-CONT-LANG
- **Afinidade sugerida**: Claude

**Contexto**
Idiomas depende muito de cartões e prática curta e frequente; é o domínio que mais se beneficia de rotina diária.

**O que fazer**
Hiragana e katakana completos como cartões em pares (reconhecimento e produção, com romanização), lições curtas por grupo de linhas da tabela e exercícios `cloze` com palavras de uso comum. Frases de exemplo só de fontes com licença compatível, com atribuição.

**Critérios de aceite**
- [ ] 46 + 46 kana básicos como pares de cartões.
- [ ] Furigana no formato `{漢字|かんじ}` onde houver kanji.
- [ ] Frases de terceiros com atribuição e licença.

**Como verificar**
Regras comuns; revisar 20 cartões no navegador.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LC05 · Piloto de Humanidades com fontes primárias
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Conteúdo
- **Tamanho**: G
- **Depende de**: LT08
- **Grupos**: G-CONT-HUM
- **Afinidade sugerida**: Claude

**Contexto**
Humanidades tem rubrica própria (evidência textual, contexto, objeção mais forte e réplica). O piloto mostra como lições e exercícios fechados convivem com a escrita argumentativa.

**O que fazer**
Dois macrotemas com lições baseadas em excertos de domínio público (tradução também em domínio público ou licença aberta, com a edição citada), exercícios fechados de compreensão e um exercício `rubric` que usa a rubrica existente.

**Critérios de aceite**
- [ ] Excertos com edição, tradutor e licença identificados.
- [ ] Exercício `rubric` integrado à rubrica atual.

**Como verificar**
Regras comuns.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LC06 · Piloto de Economia com dados reais
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Conteúdo
- **Tamanho**: G
- **Depende de**: LT08
- **Grupos**: G-CONT-ECON
- **Afinidade sugerida**: Codex

**Contexto**
O TellusPedia já tem indicadores reais do Banco Mundial para 177 países. Exercícios de Economia com esses números conectam os dois projetos e evitam dados de mentira.

**O que fazer**
Dois macrotemas com exercícios numéricos sobre séries reais (taxa de crescimento, PIB per capita, inflação), usando um recorte congelado em `content/economics-finance/data/` com código do indicador, data de referência e link da fonte (mesmo padrão de procedência do TellusPedia). Gabarito calculado por script a partir do recorte.

**Critérios de aceite**
- [ ] Todo número com indicador, país, ano, data de extração e link.
- [ ] Gabaritos calculados por script em teste, não digitados.

**Como verificar**
Regras comuns; o teste recalcula todos os gabaritos.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LC07 · Piloto de Literatura em domínio público
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Baixa
- **Área**: Conteúdo
- **Tamanho**: M
- **Depende de**: LT08
- **Grupos**: G-CONT-LIT
- **Afinidade sugerida**: Claude

**Contexto**
Literatura tem o caderno de close reading. O piloto liga lição, exercícios de forma e voz e o caderno.

**O que fazer**
Um macrotema com texto de autor brasileiro em domínio público (edição identificada), lição de leitura atenta, exercícios fechados de forma, voz e narrador e um exercício `rubric` que abre o caderno.

**Critérios de aceite**
- [ ] Edição e situação de domínio público documentadas.
- [ ] Exercícios distinguem autor, narrador, eu lírico e personagem.

**Como verificar**
Regras comuns.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LC08 · Piloto de Engenharia
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Baixa
- **Área**: Conteúdo
- **Tamanho**: M
- **Depende de**: LT08, LT11
- **Grupos**: G-CONT-ENG
- **Afinidade sugerida**: Codex

**Contexto**
Engenharia tem 65 conexões com Matemática, Física e Programação e é o domínio mais aplicado.

**O que fazer**
Dois macrotemas iniciais com exercícios numéricos com unidade, verificação de ordem de grandeza e um problema aberto com rubrica.

**Critérios de aceite**
- [ ] 2 macrotemas com o pacote mínimo.
- [ ] Unidades SI conferidas pelo verificador.

**Como verificar**
Regras comuns.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### Fechamento do L1

### LT16 · Registro de fontes e licenças
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Conteúdo e engenharia
- **Tamanho**: M
- **Depende de**: LD05, LT07
- **Grupos**: G-CONTRATO
- **Afinidade sugerida**: Codex

**Contexto**
Implementação do LD05: um registro único consultado pelo `content:lint` e pela interface.

**O que fazer**
`content/sources/registry.json` com fonte, URL oficial, licença SPDX, modelo de atribuição e data de verificação; checagem de compatibilidade no `content:lint`; componente de atribuição usado pelo leitor de lição.

**Critérios de aceite**
- [ ] Fonte sem licença ou com licença incompatível falha no lint.
- [ ] Atribuição renderizada no padrão definido no ADR.

**Como verificar**
`npm run content:lint` com casos de teste.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LD11 · Auditoria de acessibilidade do L1
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Média
- **Área**: Qualidade
- **Tamanho**: M
- **Depende de**: LT09, LT10, LD08
- **Grupos**: G-BUILD
- **Afinidade sugerida**: Antigravity

**Contexto**
Telas novas do L1 precisam cumprir WCAG 2.2 AA (invariante 10) antes de escalar conteúdo.

**O que fazer**
Teste automático de acessibilidade no E2E (axe) para Hoje, lição, exercícios e mapa; roteiro manual de teclado e leitor de tela; tarefas novas para cada problema encontrado fora do escopo.

**Critérios de aceite**
- [ ] Zero violações sérias ou críticas no axe nas 4 telas.
- [ ] Roteiro manual registrado em `docs/acessibilidade.md`.

**Como verificar**
`npm run test:e2e`.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

### LD12 · ADR-006: sincronização e contas (direção)
- **Status**: TODO
- **Responsável**: —
- **Revisor**: —
- **Branch**: —
- **Worktree**: —
- **Prioridade**: Baixa
- **Área**: Arquitetura
- **Tamanho**: M
- **Depende de**: —
- **Grupos**: G-DOCS
- **Afinidade sugerida**: Claude

**Contexto**
Usar no celular e no computador exige sincronizar. Não vamos implementar agora, mas o modelo de armazenamento do L1 não pode fechar essa porta.

**O que fazer**
`docs/adr/ADR-006-sincronizacao.md` comparando: arquivo de snapshot manual (atual); pasta sincronizada do usuário (Drive, Dropbox) via File System Access; servidor próprio opcional com criptografia ponta a ponta; estruturas de dados que mesclam sem conflito. Requisitos para o armazenamento desde já (IDs estáveis, eventos com data, sem apagar histórico).

**Critérios de aceite**
- [ ] Requisitos de armazenamento listados e aplicados como checklist nas tarefas L1 que tocam `G-STORE`.
- [ ] Decisão do Ayrton registrada no Log.

**Como verificar**
Leitura.

**Log**
- 2026-11-22 · claude · TODO · criada no planejamento inicial

---

## 5. Roadmap: épicos ainda não abertos

Cada épico vira tarefas `TODO` quando o L1 estiver em `REVIEW` ou quando o Ayrton antecipar, seguindo a DoR.

### L2 · Conhecimento aberto em escala
- Ingestão de recursos abertos por scripts offline (nunca em runtime): sumários, excertos e leituras recomendadas com atribuição, a partir das fontes aprovadas no LD05.
- Biblioteca aberta por macrotema: leituras, vídeos e cursos externos com licença e link.
- Ferramenta de autoria local com prévia ao vivo do Content Pack.
- Ondas de conteúdo por domínio até 100% dos 299 macrotemas com pacote mínimo (uma tarefa `LC` por bloco de 4–6 macrotemas; maior fonte de paralelismo).
- Fluxo de revisão de conteúdo gerado com IA: checklist de fatos, conferência de fontes, `review: ok`.

### L3 · Prática aplicada
- Python no navegador (decisão do LD04) em Web Worker com testes por exercício, tempo-limite e sem rede.
- JavaScript e SQL no navegador, com bases de dados de exemplo reais e licenciadas.
- Notebooks de dados com séries do TellusPedia (Banco Mundial, NASA) para Economia e Física.
- Simulações interativas de Física e Engenharia (óptica, mecânica, circuitos).
- Áudio e pronúncia em Idiomas, só com gravações de licença aberta ou síntese do próprio navegador.

### L4 · Rotina e motivação avançadas
- Lembretes locais opcionais via service worker, nos horários da rotina.
- Relatório semanal: minutos, macrotemas dominados, retenção FSRS, próximos marcos.
- Portfólio de maestria: projetos-marco concluídos e evidências exportáveis.
- Projetos-marco interdisciplinares (por exemplo: modelar órbitas com Física, Matemática e Programação).

### L5 · Ponte profunda com o TellusPedia (`G-PEDIA`)
- TellusBridge v1.1: lições e exercícios no registro, vínculos com granularidade de lição no manifesto.
- Trilhas temáticas abertas a partir de uma era, evento ou país (por exemplo, "Guerra Fria" atravessando Humanidades, Economia e Física).
- Quiz contextual ao fim das cenas do TellusPedia (Apollo 11, Magalhães–Elcano) apontando para o Lab.
- Progresso do Lab exibido em contexto no TellusPedia (selo de maestria no painel do país ou da cena).

### L6 · Plataforma
- PWA instalável com layout de celular dedicado.
- Internacionalização pt-BR e en alinhada ao D28 do TellusPedia.
- Sincronização opcional conforme o ADR-006.
- Hospedagem pública estática do Lab e roteiro de publicação.
- Privacidade (LGPD): política, exportar e apagar todos os dados locais; métricas apenas locais, com coleta agregada opcional e opt-in.
- Planos de estudo compartilháveis, imutáveis e com fork, no mesmo modelo dos Estudos do TellusPedia.

---

## 6. Ondas sugeridas para três agentes

Ordem pensada para manter os três ocupados sem grupos em comum. `backlog:next` passa a decidir depois de LT02.

| Onda | Claude | Codex | Antigravity |
|---|---|---|---|
| 1 | LT01 → LD03 | LT02 → LT03 | LD01 (redação) → LD05 (pesquisa de licenças) |
| 2 | LD04 | LT04 | LT05 |
| 3 | LT07 | LT06 | LD02 (protótipos de bundle) |
| 4 | LT13 | LT08 → LT10 | LD07 → LT09 |
| 5 | LT14 → LD09 | LT11 → LT15 | LD08 → LT12 |
| 6 | LC01, LC03, LC04 | LC02, LC06 | LD10 → LD11 |
| 7 | LC05, LC07, LD12 | LC08, LT16 | revisões cruzadas e E2E dos pilotos |

Em paralelo a tudo: o Ayrton decide os ADRs (LD01–LD05) assim que entrarem em `REVIEW`, porque eles destravam as ondas 2 a 4.

---

## 7. Log geral

- 2026-11-22 · claude · — · backlog criado: horizontes L0, L1 e L1-C detalhados (35 tarefas), L2–L6 como épicos.
