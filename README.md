# TellusLab

Laboratório local-first de estudo e prática, complementar ao TellusPedia. A área disponível é **Matemática**. O currículo preserva 40 obras (BIB-01 a BIB-40), 88 macrotemas, 538 subtemas e 176 critérios de aceite. A revisão da especificação e a correção de 9.11 continuam documentadas no seed reproduzível.

## Rodar localmente

Use Node.js 20+ com npm.

```powershell
npm.cmd ci
npm.cmd start
```

Abra [http://127.0.0.1:4175/](http://127.0.0.1:4175/). Depois da instalação, também é possível abrir `Abrir-Laboratorio.cmd` no Windows. O servidor usa apenas o loopback. O build monta o site, o catálogo e os recursos do KaTeX em `dist/`. A instalação inicial baixa o KaTeX. O aplicativo pode operar offline após o primeiro carregamento completo.

Para migrar progresso, use **Snapshot → Exportar JSON** no aplicativo antigo e **Snapshot → Importar JSON** no novo. Se mantiver exatamente a origem `http://127.0.0.1:4175`, o mesmo navegador e o mesmo perfil, a base IndexedDB existente continua acessível. Encerre o servidor antigo antes de iniciar o novo na mesma porta. A porta pode ser configurada em `MATH_LAB_PORT`. Origens diferentes têm armazenamento separado.

## Prática

- Mapa de pré-requisitos por trilha, com caminhos pendentes por macrotema ou livro.
- Proficiência S0–S6, evidências e critérios de aceite. Cartões FSRS-5, diagnóstico e micro-revisões.
- Sessões de 45–75 minutos com 50% avanço, 30% revisão e 20% problemas mistos. Desafios com cronômetro e editor LaTeX ou código.
- Solução comentada e revisor após tentativa gravada, histórico e snapshots JSON. A autoria local inclui seis macrotemas com exercícios resolvidos. Os demais usam a prática guiada pelo Capstone. A integração com um provedor de IA é opcional.

## Estrutura

| Pasta | Responsabilidade |
|---|---|
| `apps/web/src/` | Interface, IndexedDB, service worker e ponto de composição |
| `packages/learning-core/` | DAG, FSM, FSRS-5, agenda, sessões, tentativas e validação de snapshots |
| `packages/curriculum-mathematics/` | Especificação, parser, seed, modalidades, prompts e autoria local de Matemática |
| `packages/telluspedia-bridge/` | Contexto de navegação e envelopes JSON versionados |
| `scripts/` | Build e auditoria dos arquivos efetivamente staged no Git |
| `test/` | Regressões de domínio, integração, renderização KaTeX e compatibilidade |
| `docs/` | Integração e publicação |

O núcleo recebe um catálogo explícito e regras de autoria por modalidade. O adaptador de uma nova área deve fornecer o identificador estável, catálogo versionado e perfil próprio de autoria. Preserve a unicidade de IDs dentro de cada catálogo e isole o estado por área ao integrar o novo catálogo à interface. O registro de áreas já admite identificadores não numéricos de tópicos. Física, Química, Biologia, Ciências Sociais, Engenharias e Programação podem entrar como pacotes pares do currículo de Matemática. A interface atual ativa Matemática.

## Verificação

```powershell
npm.cmd test
npm.cmd run verify:git
```

Execute a auditoria Git após `git add`. Ela verifica os blobs do índice, inclusive itens que foram adicionados à força. O lançador `.cmd` é texto. Saídas de build, dependências, fontes binárias KaTeX, dados locais e configuração de hospedagem são ignorados. A licença MIT existente é preservada.

- [Contrato com TellusPedia](docs/telluspedia-integration.md)
- [Publicação na main e migração do ambiente local](docs/publicacao.md)
