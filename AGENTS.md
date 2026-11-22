# AGENTS.md

Instruções para os agentes que trabalham no TellusLab (Claude Code, Codex e Antigravity). Valem para qualquer tarefa neste repositório. O processo completo, o estado das tarefas e os grupos de conflito estão no [backlog](docs/BACKLOG.md); a versão que vale é sempre `git show origin/main:docs/BACKLOG.md`.

## O projeto

O TellusLab é um laboratório local-first de estudo e prática com repetição espaçada, em 8 domínios do conhecimento. É o complemento do [TellusPedia](https://github.com/AyrtonLoks/telluspedia): o TellusPedia mostra o mundo, o Lab faz a pessoa aprender e continuar aprendendo. A ligação entre os dois é o contrato TellusBridge v1.0.0, gerado aqui.

- Stack: JavaScript ESM puro, sem framework, build estático em `dist/`, IndexedDB e service worker. Node.js ≥ 20.
- Dependências de runtime: KaTeX, Mermaid, highlight.js e Noto Sans JP.
- Branch principal: `main`. O dono do projeto é o Ayrton (`AyrtonLoks`).

## Comandos

Todos os scripts de `package.json`:

| Comando | O que faz |
|---|---|
| `npm ci` | Instala as dependências exatas do `package-lock.json` |
| `npm run build` | Gera o site em `dist/` (`scripts/build.mjs`) |
| `npm start` | Build e servidor em `http://127.0.0.1:4175`, com 4183 como alternativa (`serve.mjs`) |
| `npm test` | Build e `node --test` sobre `test/` |
| `npm run typecheck` | `tsc` estrito sobre os tipos do TellusBridge e do Content Pack (`packages/tellus-bridge/index.d.mts`, `packages/content-schema/index.d.mts`) |
| `npm run lint` | Verifica a sintaxe dos arquivos JavaScript e valida a cópia local do backlog |
| `npm run backlog:lint` | Valida `origin/main:docs/BACKLOG.md`; use `-- --file <caminho>` para uma cópia local |
| `npm run backlog:next -- --agent <agente>` | Lista as tarefas disponíveis e explica impedimentos; aceita `--file <caminho>` junto com `--agent` |
| `npm run verify:git` | Audita os blobs staged: só texto, sem binários, `dist/`, `.env`, dados locais ou fontes KaTeX |
| `npm run bridge:sync` | Build e escrita do espelho do contrato no checkout do TellusPedia |
| `npm run bridge:verify` | Build e conferência byte a byte do espelho |
| `npm run domains:validate` | Alias de `npm run build`: monta os catálogos dos 8 domínios a partir das especificações e dos seeds e falha se algum não montar |

Variáveis de ambiente:

- `MATH_LAB_PORT`: porta do servidor local (padrão 4175).
- `VITE_TELLUSPEDIA_URL`: origem do TellusPedia no build (padrão `http://127.0.0.1:3000`).
- `TELLUSPEDIA_REPO`: caminho do checkout do TellusPedia para `bridge:sync` e `bridge:verify` (padrão `../telluspedia`, relativo à raiz deste checkout). Dentro de um worktree em `../telluslab-wt/`, o padrão aponta para o lugar errado: passe o caminho explícito, por exemplo `TELLUSPEDIA_REPO=~/projetos/telluspedia npm run bridge:verify`.

Validação obrigatória antes de mover uma tarefa para `REVIEW`:

```bash
npm test && npm run typecheck && npm run lint && npm run verify:git
```

Rode `verify:git` depois do `git add`. Os comandos previstos `content:lint` (LT08) e `test:e2e` (LT05) passam a fazer parte da validação quando forem implementados.

Abrir um domínio direto: `/lab?domain=physics&topic=7.3`.

## Estrutura

| Pasta | Responsabilidade |
|---|---|
| `apps/web/src/` | Interface (`app.mjs`, `ui.mjs`, `practice.mjs`, `curriculum.mjs`, `overview.mjs`, `notebook.mjs`), IndexedDB (`store.mjs`), service worker (`sw.js`), estilos e snapshot da ponte |
| `packages/learning-core/` | DAG de pré-requisitos, FSM S0–S6, FSRS-5, agenda, sessões, desafios, prática textual e snapshot. Schema SQLite de referência em `reference/sqlite.sql` |
| `packages/curriculum-mathematics/` | Especificação, parser, seed, desafios, autoria local e soluções de Matemática |
| `packages/curriculum-programming/` | Especificação, seed e perfil de Programação e Ciência da Computação |
| `domains/<slug>/` | Domain Packs de `economics-finance`, `physics`, `engineering`, `humanities`, `languages` e `literature`: especificação em `data/`, seed e perfil de autoria |
| `packages/tellus-bridge/` | Schemas JSON Draft 2020-12, tipos TypeScript e gerador do contrato TellusBridge v1 |
| `packages/telluspedia-bridge/` | Contrato legado de lançamento e envelopes por área |
| `packages/content-schema/` | Schemas JSON Draft 2020-12, tipos e validador do Content Pack v1 ([ADR-003](docs/adr/ADR-003-content-pack.md)); o build valida `content/` e grava `dist/content/<slug>.json` |
| `content/<slug>/` | Lições, exercícios e cartões de cada domínio, no formato do ADR-003; `content/sources/registry.json` é o registro de fontes |
| `scripts/` | Build, catálogo e paridade da ponte, lint e auditoria do índice Git |
| `test/` | Testes `node --test` por domínio, integração e ponte |
| `docs/` | Backlog, integração com o TellusPedia, contrato da ponte e publicação |

## Invariantes

Valem para todas as tarefas. Quebrar um deles é motivo de `REVIEW-AJUSTE`, mesmo com a validação verde.

1. **Local-first**: tudo funciona sem servidor próprio e offline após o primeiro carregamento. Recurso que exige rede é opcional e diz quando está indisponível.
2. **Privacidade**: progresso, rascunho e solução não saem do navegador sem ação explícita. Nada pessoal em URL, query string, Git ou log.
3. **A FSM S0–S6 é a única autoridade de proficiência.** Exercícios, dicas e cartões produzem evidências; só a FSM muda estado. As guardas de pré-requisito (Modo Flexível e Modo Estrito) nunca são contornadas pela interface.
4. **Solução só depois de tentativa gravada.** Dica conta como ajuda e pesa na evidência.
5. **Snapshot e armazenamento versionados**: mudança de formato exige nova versão, migração explícita e teste com um snapshot antigo real.
6. **O TellusBridge é gerado pelo Lab.** Mudança no contrato exige `bridge:sync` + `bridge:verify` e tarefa espelho no backlog do TellusPedia (`G-PEDIA`). Nunca edite o espelho do TellusPedia à mão.
7. **Conteúdo nunca inventado**: toda afirmação factual, dado ou citação tem fonte verificável. Material de terceiros entra só com licença compatível registrada e atribuição visível. Gabarito de exercício é conferido por teste automático ou por revisão humana registrada.
8. **IA é opcional**: sem provedor, tudo funciona. Conteúdo gerado com ajuda de IA é marcado `review: pending` até revisão humana. O token do provedor não é persistido.
9. **Sem padrões manipuladores**: nada de culpa, perda punitiva de sequência, contagem regressiva falsa ou notificação não pedida.
10. **Acessibilidade WCAG 2.2 AA** em toda tela nova: teclado, foco visível, contraste, rótulos e `prefers-reduced-motion`.
11. **Português do Brasil** em interface, conteúdo, código de domínio, commits e documentação.
12. **Desempenho**: bibliotecas pesadas (Mermaid, Pyodide, motor simbólico) carregadas sob demanda; a tela inicial não espera por elas.

## Protocolo resumido

O fluxo completo, a Definição de Pronto e os grupos de conflito estão na seção 1 do [backlog](docs/BACKLOG.md).

1. `git fetch origin` e ler `git show origin/main:docs/BACKLOG.md`.
2. Rodar `npm run backlog:next -- --agent <claude|codex|antigravity>` e escolher uma tarefa disponível.
3. Trabalhar num worktree próprio: `git worktree add ../telluslab-wt/<agente>-<id> -b task/<id>-<slug> origin/main`. O checkout principal é do Ayrton.
4. Reivindicar antes de codar: Responsável, Branch, Worktree, `IN_PROGRESS` e linha no Log; commit `chore(backlog): <id> IN_PROGRESS (<agente>)` e push para `origin/main`. Push rejeitado: rebase e releia; se alguém pegou a tarefa ou um grupo em comum, desista.
5. Escopo fechado. Achou outro problema: crie uma tarefa nova com o próximo ID livre (seção 1.5 do backlog).
6. Validar (comandos acima e o "Como verificar" da tarefa), marcar os critérios, mover para `REVIEW`, registrar no Log, rebase e push. **Nunca `--force`.**
7. O revisor indicado lê o diff contra os critérios e registra `REVIEW-OK` ou `REVIEW-AJUSTE` no Log.
8. Só o Ayrton move tarefas para `DONE` ou `CANCELLED`.

No máximo uma tarefa `IN_PROGRESS` por agente. Mudança visual exige descrição de captura antes e depois no Log.

## Agentes e portas

| Agente | Worktree | Porta (`MATH_LAB_PORT`) |
|---|---|---|
| Claude Code | `../telluslab-wt/claude-<id>` | 4176 |
| Codex | `../telluslab-wt/codex-<id>` | 4177 |
| Antigravity | `../telluslab-wt/antigravity-<id>` | 4178 |
| Ayrton | checkout principal | 4175 |

O progresso salvo no navegador pertence à origem de cada porta: estado de teste numa porta de agente não afeta o do Ayrton.

## Commits

Conventional Commits em português, com o ID da tarefa:

- `feat(exercicios): correção numérica com tolerância e unidade (LT13)`
- `chore(backlog): LT13 REVIEW (codex)`

Nunca commitar `.env`, chaves, snapshots de progresso, `dist/` ou binários. O `.gitignore` e o `verify:git` cobrem os casos conhecidos; na dúvida, não adicione.
