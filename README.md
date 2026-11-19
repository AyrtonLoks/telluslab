# TellusLab

Laboratório local-first de estudo e prática, complementar ao TellusPedia. **Matemática** tem 40 obras e 88 macrotemas. **Programação e Ciência da Computação** tem 41 obras e 49 macrotemas, com 50 conexões para pré-requisitos de Matemática.

## Rodar localmente

Use Node.js 20+ com npm.

```powershell
npm.cmd ci
npm.cmd start
```

Abra [http://127.0.0.1:4175/](http://127.0.0.1:4175/). Depois da instalação, também é possível abrir `Abrir-Laboratorio.cmd` no Windows. O servidor usa apenas o loopback. O build monta o site, os dois catálogos, KaTeX, destaque de código e Mermaid em `dist/`. O aplicativo pode operar offline após o primeiro carregamento completo.

Use o seletor na barra lateral para alternar entre Matemática, Programação e a Visão Consolidada TellusLab. Em **Dados e configurações**, o Modo Flexível (padrão) mostra avisos sobre pré-requisitos cruzados. O Modo Estrito bloqueia o avanço e a prática quando um pré-requisito cruzado está por validar ou tem revisão vencida. A dificuldade `DIF-PROG-01` gera micro-revisões para os ancestrais curriculares, inclusive em Matemática.

Para migrar progresso, use **Snapshot → Exportar JSON** no aplicativo antigo e **Snapshot → Importar JSON** no novo. A importação restaura o domínio identificado no arquivo. Se mantiver exatamente a origem `http://127.0.0.1:4175`, o mesmo navegador e o mesmo perfil, a base IndexedDB existente é migrada automaticamente. Encerre o servidor antigo antes de iniciar o novo na mesma porta. A porta pode ser configurada em `MATH_LAB_PORT`. Origens diferentes têm armazenamento separado.

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
| `packages/curriculum-programming/` | Especificação versionada, seed, modalidades e autoria local de Programação |
| `packages/telluspedia-bridge/` | Contexto de navegação e envelopes JSON versionados |
| `scripts/` | Build e auditoria dos arquivos efetivamente staged no Git |
| `test/` | Regressões de domínio, integração, renderização KaTeX e compatibilidade |
| `docs/` | Integração e publicação |

Cada Domain Pack fornece um identificador estável, um catálogo versionado e um perfil de autoria. O grafo compartilhado usa referências como `DOM-MATH::1.1` e `DOM-PROG::1.1`. No armazenamento e nos snapshots, cada domínio tem seu próprio conjunto de IDs locais. O schema SQLite de referência fica em `packages/learning-core/reference/sqlite.sql`.

## Verificação

```powershell
npm.cmd test
npm.cmd run verify:git
```

Execute a auditoria Git após `git add`. Ela verifica os blobs do índice, inclusive itens que foram adicionados à força. O lançador `.cmd` é texto. Saídas de build, dependências, fontes binárias KaTeX, dados locais e configuração de hospedagem são ignorados. A licença MIT existente é preservada.

- [Contrato com TellusPedia](docs/telluspedia-integration.md)
- [Publicação na main e migração do ambiente local](docs/publicacao.md)
