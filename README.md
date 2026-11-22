# TellusLab

[![CI](https://github.com/AyrtonLoks/telluslab/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/AyrtonLoks/telluslab/actions/workflows/ci.yml)

Laboratório local-first de estudo e prática, complementar ao TellusPedia. **Matemática** tem 40 obras e 88 macrotemas. **Programação e Ciência da Computação** tem 41 obras e 49 macrotemas, com 50 conexões para pré-requisitos de Matemática. **Economia e Finanças** tem 19 obras e 32 macrotemas, com 41 conexões para Matemática e duas para Programação. **Física e Óptica** tem 7 obras e 37 macrotemas, com 75 conexões para Matemática e quatro para Programação. **Engenharia** tem 5 obras e 28 macrotemas, com 65 conexões para Matemática, Física e Programação. **Humanidades e Filosofia** tem 53 obras e 36 macrotemas, com 18 conexões para Matemática, Economia, Programação e Física. **Idiomas** tem 6 obras e 13 macrotemas em 3 trilhas. **Literatura** tem 26 obras e 16 macrotemas em 4 trilhas.

## Rodar no Linux ou WSL

No terminal Linux ou WSL, entre na raiz do repositório. Use Node.js 20 ou superior e npm instalados no próprio ambiente Linux.

```bash
npm ci
npm start
```

`npm ci` instala as dependências do projeto. Nas próximas execuções, use `npm start` para compilar o site em `dist/` e iniciar o servidor. No WSL, abra a URL exibida no terminal no navegador do Windows. Mantenha o terminal aberto e pressione Ctrl+C para encerrar. O aplicativo pode operar offline após o primeiro carregamento completo.

O servidor tenta a porta 4175 e, se ela estiver ocupada, tenta a 4183. Para escolher outra porta no Linux ou WSL, use, por exemplo, `MATH_LAB_PORT=4190 npm start`. O progresso salvo no navegador pertence à URL de cada porta.

### Iniciar pelo Windows

No PowerShell, use `npm.cmd ci` e `npm.cmd start`. O atalho `Abrir-Laboratorio.cmd` também fica disponível após instalar as dependências.

Use o seletor na barra lateral para alternar entre os oito domínios e a Visão Consolidada TellusLab. Em **Dados e configurações**, o Modo Flexível (padrão) mostra avisos sobre pré-requisitos cruzados. O Modo Estrito bloqueia o avanço e a prática quando um pré-requisito cruzado está por validar ou tem revisão vencida. As dificuldades `DIF-PROG-01`, `DIF-ECON-01`, `DIF-PHYS-01`, `DIF-PHYS-04`, `DIF-ENG-01`, `DIF-HUM-01`, `DIF-LANG-01` e `DIF-LIT-01` geram micro-revisões para os ancestrais curriculares locais e de outros domínios. Para abrir Física e Óptica diretamente, use `/lab?domain=physics` na porta exibida no terminal. Para Engenharia, use `/lab?domain=engineering`. Para Humanidades e Filosofia, use `/lab?domain=humanities`. Para Idiomas e Literatura, use `/lab?domain=languages` e `/lab?domain=literature`.

Para migrar progresso, use **Snapshot → Exportar JSON** no aplicativo antigo e **Snapshot → Importar JSON** no novo. A importação restaura o domínio identificado no arquivo. Se mantiver exatamente a origem `http://127.0.0.1:4175`, o mesmo navegador e o mesmo perfil, a base IndexedDB existente é migrada automaticamente. Encerre o servidor antigo antes de iniciar o novo na mesma porta. A porta pode ser configurada em `MATH_LAB_PORT`. Origens diferentes têm armazenamento separado.

## Prática

- Mapa de pré-requisitos por trilha, com caminhos pendentes por macrotema ou livro.
- Proficiência S0–S6, evidências e critérios de aceite. Cartões FSRS-5, diagnóstico e micro-revisões.
- Sessões de 45–75 minutos com 50% avanço, 30% revisão e 20% problemas mistos. Desafios com cronômetro e editor LaTeX ou código.
- Solução comentada e revisor após tentativa gravada, histórico e snapshots JSON. A autoria local inclui seis macrotemas com exercícios resolvidos. Os demais usam a prática guiada pelo Capstone. A integração com um provedor de IA é opcional.
- Em Humanidades, use Markdown para preservar referências ABNT ou APA, `>` para citações em bloco e blocos `mermaid` para linhas do tempo e mapas conceituais. A rubrica pede evidência textual, contexto histórico e a formulação da objeção mais forte com réplica.

- Em Idiomas, escreva furigana como `{漢字|かんじ}` e transcreva IPA diretamente. Valide um macrotema de Kanji ou o 3.3 para revisar pares em duas direções ou cadastrar novos na fila FSRS. No mapa de um domínio técnico, use **Vincular termo em Idiomas** para guardar também a origem do termo no macrotema 3.3. A tag `DIF-LANG-03` gera micro-revisões locais.
- Em Literatura, abra uma obra na Biblioteca para registrar excertos, escansão, anotações e diagramas no **Caderno de close reading**. Informe os dados da edição para gerar a citação autor-data e a referência. Nas tentativas e evidências do Problema-Marco, use as seções `Excerto:`, `Citação:`, `Forma:` e `Voz:`. O revisor pede que a análise vincule forma e interpretação e distinga autor, narrador, eu lírico ou personagem.

## Estrutura

| Pasta | Responsabilidade |
|---|---|
| `apps/web/src/` | Interface, IndexedDB, service worker e ponto de composição |
| `packages/learning-core/` | DAG, FSM, FSRS-5, agenda, sessões, tentativas e validação de snapshots |
| `packages/curriculum-mathematics/` | Especificação, parser, seed, modalidades, prompts e autoria local de Matemática |
| `packages/curriculum-programming/` | Especificação versionada, seed, modalidades e autoria local de Programação |
| `domains/economics-finance/` | Especificação, seed, modalidades e autoria local de Economia e Finanças |
| `domains/physics/` | Especificação, seed, modalidades e autoria local de Física e Óptica |
| `domains/engineering/` | Especificação, seed, modalidades e autoria local de Engenharia |
| `domains/humanities/` | Especificação, seed, modalidades e rubrica de Humanidades e Filosofia |
| `domains/languages/` | Especificação, seed, modalidades e cartões de Idiomas |
| `domains/literature/` | Especificação, seed, caderno e rubrica de Literatura |
| `packages/telluspedia-bridge/` | Contexto de navegação e envelopes JSON versionados |
| `scripts/` | Build e auditoria dos arquivos efetivamente staged no Git |
| `test/` | Regressões de domínio, integração, renderização KaTeX e compatibilidade |
| `docs/` | Integração e publicação |

Cada Domain Pack fornece um identificador estável, um catálogo versionado e um perfil de autoria. O grafo compartilhado usa referências como `DOM-MATH::1.1` e `DOM-PROG::1.1`. No armazenamento e nos snapshots, cada domínio tem seu próprio conjunto de IDs locais. O schema SQLite de referência fica em `packages/learning-core/reference/sqlite.sql`.

## Verificação

```bash
npm test
npm run verify:git
```

Execute a auditoria Git após `git add`. Ela verifica os blobs do índice, inclusive itens que foram adicionados à força. O lançador `.cmd` é texto. Saídas de build, dependências, fontes binárias KaTeX, dados locais e configuração de hospedagem são ignorados. A licença MIT existente é preservada.

## Contribuir

- [Instruções para agentes (AGENTS.md)](AGENTS.md): comandos, invariantes, protocolo e regras de commit
- [Backlog](docs/BACKLOG.md): tarefas, grupos de conflito e fluxo de trabalho

## Documentação

- [Contrato com TellusPedia](docs/telluspedia-integration.md)
- [Publicação na main e migração do ambiente local](docs/publicacao.md)
