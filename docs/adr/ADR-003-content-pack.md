# ADR-003: Content Pack v1

- **Status**: proposto, aguardando decisão do Ayrton
- **Data**: 2026-11-22
- **Tarefa**: LD03 (backlog do TellusLab)
- **Libera**: LT07 (schema), LT08 (`content:lint`), LT09 (leitor de lição), LT10–LT14 (exercícios, dicas, evidência, cartões), LT15 e as tarefas de conteúdo LC01–LC08
- **Relacionados**: LD04 (correção simbólica e execução de código), LD05 (licenças), LT16 (registro de fontes)

## 1. Contexto

Os Domain Packs descrevem **o que** se estuda: 299 macrotemas qualificados (`DOM-XXX:n.n`), com subtemas, critérios de aceite (`mandatory` e `capstone`), pré-requisitos e bibliografia (`BIB-XXX-nn`). Falta o lugar para **o que se ensina e se pratica**: lições, exercícios e cartões.

Hoje esse conteúdo existe em um único ponto, e em código: `packages/curriculum-mathematics/authorship.mjs` gera os exercícios resolvidos de 6 macrotemas de Matemática (1.1, 1.2, 1.3, 1.4, 1.6 e 2.1) com `if (topicId === '1.1' && modality === CALC)` e concatenação de strings. Os outros 293 macrotemas usam a prática guiada genérica do Capstone. Esse formato não escala para 8 domínios e três agentes em paralelo: conteúdo e lógica ficam misturados, não há validação de schema, gabarito não é conferido por máquina, a fonte e a licença não aparecem.

O que já existe e este ADR **não muda**:

- A FSM S0–S6 em `packages/learning-core/fsm.mjs` é a única autoridade de proficiência (invariante 3). Ela aceita cinco ações de estudo: `completeSubtopic` (subtema + evidência textual), `completeTheory` (S1 → S2, fichamento), `passPractice` (S2 → S3, `correct/total ≥ 0,8` com inteiros), `validateCriterion` (S3, critério aprovado, `withoutConsultation` obrigatório no critério `mandatory`) e `validateProof` (S3 → S4).
- O FSRS-5 (`fsrs.mjs`) agenda cartões com `{id, topicId, sourceId, kind, frontLatex, backLatex}`. Idiomas já usa pares `recognition`/`production` (`PAIRED_CARD_KINDS`).
- O diagnóstico (`agenda.mjs`, `diagnose`) recebe uma tentativa com etiqueta `DIF-*` e agenda micro-revisões nos ancestrais curriculares, inclusive de outros domínios.

Este ADR define o formato do conteúdo e como ele se liga a essas três peças. O schema executável é o LT07; a validação é o LT08.

## 2. Opções consideradas

| Critério | A. Markdown com front matter + JSON | B. Tudo em JSON | C. Módulos de código (padrão atual) | D. Padrão externo (QTI 3.0, H5P ou Perseus) |
|---|---|---|---|---|
| Escrever e revisar texto longo (lições) | Bom: Markdown é o formato que o Ayrton e os três agentes já usam | Ruim: texto com LaTeX dentro de strings JSON exige escapes (`\\frac`) | Ruim: texto em strings JS | Médio a ruim: XML (QTI) ou JSON de editor (H5P, Perseus) |
| Validação por schema | Sim: front matter e JSON validam contra JSON Schema 2020-12, como o TellusBridge | Sim | Não; só testes ad hoc | Sim, mas com schemas grandes que não falam a língua do nosso motor (DAG, FSM, `DIF-*`) |
| Diff legível no Git | Bom | Médio | Médio | Ruim (XML verboso) |
| Gabarito conferível por máquina | Sim (exercícios em JSON) | Sim | Só executando o módulo | Depende do tipo |
| Conteúdo separado de código | Sim | Sim | Não | Sim |
| Dependências novas | Um parser de front matter no build (ver 9.1) | Nenhuma | Nenhuma | Runtime do padrão no navegador ou conversor |
| Ligação com FSM, FSRS e `DIF-*` | Nativa | Nativa | Nativa | Exige camada de tradução |

**C** é o que queremos sair. **D** traria interoperabilidade que não é objetivo do L1 e acoplaria o conteúdo a um modelo pedagógico que não é o nosso; um exportador para QTI pode virar épico no L2 se houver demanda. **B** funciona, mas penaliza justamente o artefato mais longo (a lição).

## 3. Decisão proposta

**Opção A**: lições em Markdown com front matter; exercícios e cartões em JSON; tudo validado por JSON Schema Draft 2020-12 no build. O build gera um JSON por domínio em `dist/content/<slug>.json`, carregado sob demanda (invariante 12), sem entrar no carregamento inicial.

A decisão final é do Ayrton e fica registrada no Log da LD03.

## 4. Estrutura de pastas

```
content/
├── sources/registry.json            registro de fontes e licenças (LT16), entradas FON-nnnn
└── <slug>/                          mathematics, programming, economics-finance, physics,
    │                                engineering, humanities, languages, literature
    ├── pack.json                    manifesto do pack do domínio
    └── <n.n>/                       um diretório por macrotema, com o número local do nó
        ├── licao-01-<slug>.md       uma ou mais lições
        ├── exercicios.json          todos os exercícios do macrotema
        ├── cartoes.json             todos os cartões do macrotema
        └── figuras/                 imagens próprias ou com licença registrada (texto: SVG)
```

- O `<slug>` é o mesmo do Domain Pack e do TellusBridge (`physics`, `languages`…). Com isso, o grupo de conflito `G-CONT-<DOM>` corresponde a uma única pasta.
- Um arquivo de exercícios e um de cartões por macrotema mantém o número de arquivos baixo e coloca tudo o que se refere a um nó no mesmo lugar. Como cada domínio é um grupo de conflito, dois agentes não editam o mesmo arquivo ao mesmo tempo.
- Figuras: só SVG (texto, auditável por `verify:git`) ou arquivo com licença registrada. Binários seguem as regras do `verify:git`; se a política mudar, é decisão do LD05.

### 4.1 Manifesto `pack.json`

```json
{
  "kind": "TellusContentPackV1",
  "schemaVersion": "1.0.0",
  "domainId": "DOM-MATH",
  "slug": "mathematics",
  "version": "0.1.0",
  "defaultLicense": "CC-BY-SA-4.0",
  "nodes": ["DOM-MATH:1.1", "DOM-MATH:1.2"]
}
```

- `schemaVersion`: versão do formato descrito neste ADR.
- `version`: versão do conteúdo deste domínio (seção 7.2).
- `defaultLicense`: licença do conteúdo autoral do Lab, em identificador SPDX. O valor `CC-BY-SA-4.0` é a proposta do LD05 e vale só como provisório até o ADR-005 ser decidido.
- `nodes`: macrotemas com conteúdo. O `content:lint` confere que cada diretório `<n.n>/` está listado e vice-versa.

## 5. Identificadores

### 5.1 Formato

Seguem o padrão dos IDs que já existem (`BIB-PHYS-01`, `TRL-PHYS-00`, `DIF-PHYS-03`): prefixo em português, código do domínio, número do macrotema e sequência.

| Item | Formato | Exemplo |
|---|---|---|
| Lição | `LIC-<COD>-<n.n>-<nn>` | `LIC-MATH-1.1-01` |
| Exercício | `EXE-<COD>-<n.n>-<nnn>` | `EXE-PHYS-1.2-001` |
| Cartão | `CAR-<COD>-<n.n>-<nnn>` | `CAR-LANG-4.1-001` |
| Fonte do registro | `FON-<nnnn>` | `FON-0001` |
| Obra da bibliografia | a do TellusBridge, `BIB-<COD>-<nn>` | `BIB-MATH-01` |

`<COD>` é o sufixo do domínio (`MATH`, `PROG`, `ECON`, `PHYS`, `ENG`, `HUM`, `LANG`, `LIT`). O nó é sempre escrito na forma do TellusBridge, `DOM-MATH:1.1`. Obras sempre na forma do TellusBridge: em Matemática, o catálogo interno ainda usa `BIB-01`, mas o conteúdo cita `BIB-MATH-01` (a conversão já existe em `scripts/bridge-catalog.mjs`), para que o mesmo ID valha nos dois repositórios.

Subtemas e critérios usam os IDs locais do catálogo, que são os que a FSM conhece: `1.1:sub:4`, `1.1:dod:mandatory`, `1.1:dod:capstone`.

### 5.2 Regras de estabilidade

1. **Um ID nunca é reutilizado**, nem depois de removido. Tentativas, cartões FSRS e snapshots guardam o ID.
2. **Não se apaga um item publicado**: ele recebe `"status": "retired"` e permanece no arquivo. O motor não o oferece mais, mas tentativas e cartões antigos continuam resolvendo para ele.
3. **Mudou o que o item pede, é outro item**: trocar o conceito avaliado gera ID novo e aposenta o antigo. Corrigir texto, dica, gabarito ou parâmetro mantém o ID e incrementa `revision` (seção 7.3).
4. A sequência é por macrotema e não precisa ser contígua.
5. Os IDs de subtema e critério são posicionais no catálogo (`sub:4` é o quarto subtema da especificação). Se uma revisão da especificação renumerar subtemas, o `content:lint` falha e o conteúdo é corrigido na mesma mudança. Esse acoplamento é aceito porque a FSM já depende desses IDs.

## 6. Formatos

### 6.1 Lição

Arquivo Markdown com front matter. O corpo usa o Markdown que `apps/web/src/ui.mjs` já renderiza (parágrafos, listas, tabelas, código, LaTeX via KaTeX, Mermaid, furigana `{漢字|かんじ}`) e quatro blocos delimitados por `:::`.

Campos do front matter:

| Campo | Obrigatório | Descrição |
|---|---|---|
| `id` | sim | `LIC-<COD>-<n.n>-<nn>` |
| `node` | sim | Macrotema na forma do TellusBridge |
| `title` | sim | Título em sentence case |
| `minutes` | sim | Estimativa de leitura e verificação, inteiro de 3 a 30 |
| `objectives` | sim | De 1 a 5 objetivos começando por verbo observável |
| `covers` | sim | Subtemas do catálogo que a lição ensina (base da evidência, seção 8) |
| `sources` | sim | Ao menos uma; cada uma com `ref` (`BIB-*` ou `FON-*`) e `locator` |
| `license` | não | SPDX; padrão é o `defaultLicense` do pack |
| `review` | sim | `pending` ou `ok`. Só o Ayrton muda para `ok` |
| `provenance` | sim | `authors` e `aiAssisted` (invariante 8) |
| `revision` | sim | Inteiro, começa em 1 |
| `status` | não | `active` (padrão) ou `retired` |

Blocos do corpo:

| Bloco | Uso |
|---|---|
| `:::explicacao` | Texto expositivo. Pode haver vários |
| `:::exemplo` | Exemplo resolvido com enunciado e passos |
| `:::figura src="figuras/…" alt="…" atribuicao="…"` | Figura com texto alternativo e atribuição obrigatórios |
| `:::verificacao exercicio="EXE-…"` | Verificação rápida: insere um exercício do macrotema com papel `check` |

Exemplo completo, `content/mathematics/1.1/licao-01-operacoes-entre-conjuntos.md`:

```markdown
---
id: LIC-MATH-1.1-01
node: DOM-MATH:1.1
title: Operações entre conjuntos e contagem com três conjuntos
minutes: 15
objectives:
  - Calcular união, interseção, diferença e complementar de conjuntos finitos
  - Contar elementos de três conjuntos com interseções parciais pelas regiões disjuntas
covers:
  - 1.1:sub:3
  - 1.1:sub:4
sources:
  - ref: BIB-MATH-01
    locator: Caps. I–III
review: pending
provenance:
  authors: [claude]
  aiAssisted: true
revision: 1
---

:::explicacao
Dado um universo $U$, as operações básicas entre conjuntos $A$ e $B$ são:

| Operação | Notação | Elementos |
|---|---|---|
| União | $A \cup B$ | estão em $A$ ou em $B$ |
| Interseção | $A \cap B$ | estão em $A$ e em $B$ |
| Diferença | $A \setminus B$ | estão em $A$ e não estão em $B$ |
| Complementar | $A^c$ | estão em $U$ e não estão em $A$ |

As leis de De Morgan ligam as três: $(A \cup B)^c = A^c \cap B^c$ e $(A \cap B)^c = A^c \cup B^c$.
:::

:::exemplo
Um grupo tem $9$ pessoas. $|A| = 5$, $|B| = 6$ e $|C| = 6$. Cada interseção de pares tem $4$ pessoas e exatamente $3$ estão nos três conjuntos.

1. Interseção tripla: $3$ pessoas.
2. Só em cada par: $4 - 3 = 1$ pessoa em cada um dos três pares.
3. Só em $A$: $5 - 1 - 1 - 3 = 0$. Só em $B$: $6 - 1 - 1 - 3 = 1$. Só em $C$: $1$.
4. União: $0 + 1 + 1 + 3 \cdot 1 + 3 = 8$, que confere com $|A| + |B| + |C| - 3 \cdot 4 + 3 = 8$.
5. Nenhuma atividade: $9 - 8 = 1$. Exatamente uma: $0 + 1 + 1 = 2$.
:::

:::figura src="figuras/venn-tres-conjuntos.svg" alt="Diagrama de Venn com três círculos sobrepostos formando sete regiões numeradas" atribuicao="Figura própria do TellusLab"
As sete regiões disjuntas usadas no exemplo.
:::

:::verificacao exercicio="EXE-MATH-1.1-001"
:::
```

### 6.2 Exercício

Arquivo `exercicios.json` de cada macrotema:

```json
{
  "kind": "TellusExerciseSetV1",
  "schemaVersion": "1.0.0",
  "node": "DOM-MATH:1.1",
  "exercises": []
}
```

Campos comuns a todos os tipos:

| Campo | Obrigatório | Descrição |
|---|---|---|
| `id`, `revision`, `status` | sim, sim, não | Como na lição. `revision` muda conforme a seção 7.3 |
| `attemptsValidFrom` | não | Menor `revision` cujas tentativas contam como evidência (padrão 1). Serve para descartar tentativas feitas com gabarito errado |
| `type` | sim | Um dos 8 tipos abaixo |
| `role` | sim | `check` (verificação rápida da lição), `practice` (conta para `passPractice`) ou `criterion` (conta para `validateCriterion`) |
| `targets` | sim | `subtopics` (lista) e, quando `role` é `criterion`, `criterion` com o ID local |
| `level` | sim | Dificuldade relativa de 1 a 5 dentro do macrotema |
| `prompt` | sim | Markdown com LaTeX; parâmetros entram como `{{nome}}` |
| `params` | não | Parâmetros para gerar variantes (seção 6.2.1) |
| `hints` | sim | De 1 a 5 dicas progressivas; a última nunca é a resposta |
| `solution` | sim | Solução passo a passo, lista de passos em Markdown. Só aparece depois de tentativa gravada (invariante 4) |
| `commonErrors` | não | Erros previstos com `match`, `feedback` e `difficulty` (`DIF-*` do domínio) |
| `sources`, `license`, `review`, `provenance` | como na lição | |

Campos específicos de cada tipo ficam no objeto `answer`.

#### 6.2.1 Parâmetros e variantes

- `params` é um objeto `nome → gerador`. Geradores: `{"int": [min, max]}` (com `step` opcional), `{"choice": [v1, v2, …]}` (valores escalares) e `{"pick": [{…}, {…}]}` (objetos, acessados como `{{nome.campo}}`).
- `derived` (opcional) calcula valores a partir dos parâmetros com uma gramática aritmética fechada: números, nomes de parâmetro, `+ - * / ^`, parênteses, `sqrt`, `abs`, `min`, `max`, `round`. Nada de `eval`: o LT10 implementa um avaliador próprio.
- `{{x|2}}` formata com duas casas e vírgula decimal (pt-BR).
- A variante é função pura de `(id, revision, seed)`. A mesma semente gera sempre a mesma variante (critério do LT10). A semente é gravada na tentativa.
- Para que repetir a mesma variante não conte duas vezes (critério do LT13), a identidade da variante é `id + revision + valores sorteados`.

#### 6.2.2 `commonErrors`

Cada erro previsto tem `match` no formato do tipo (uma opção, um valor numérico, um texto normalizado, uma expressão), um `feedback` mostrado logo após a resposta e uma `difficulty` `DIF-*` do domínio. Quando a resposta casa com um erro previsto, a tentativa é registrada com essa etiqueta e entra no `diagnose` existente, que agenda as micro-revisões como já faz hoje. Quando a resposta está errada sem casar com nenhum erro previsto, a pessoa escolhe a dificuldade, como no fluxo atual.

#### 6.2.3 Os 8 tipos, com exemplos completos

**`multiple-choice`**: uma ou mais opções corretas. `answer.options` com `id` e `text`; `answer.correct` lista os IDs corretos; `answer.shuffle` embaralha a ordem com a semente.

```json
{
  "id": "EXE-MATH-1.1-001",
  "revision": 1,
  "type": "multiple-choice",
  "role": "check",
  "targets": {"subtopics": ["1.1:sub:4"]},
  "level": 1,
  "prompt": "Em um universo $U$, qual conjunto é igual a $(A \\cup B)^c$?",
  "answer": {
    "options": [
      {"id": "a", "text": "$A^c \\cap B^c$"},
      {"id": "b", "text": "$A^c \\cup B^c$"},
      {"id": "c", "text": "$(A \\cap B)^c$"},
      {"id": "d", "text": "$A \\cap B$"}
    ],
    "correct": ["a"],
    "shuffle": true
  },
  "hints": [
    "Um elemento está fora de $A \\cup B$ quando não está em nenhum dos dois conjuntos.",
    "Escreva \"não está em $A$\" e \"não está em $B$\" com complementares e veja qual operação liga as duas condições."
  ],
  "solution": [
    "$x \\in (A \\cup B)^c$ significa $x \\notin A \\cup B$, ou seja, $x \\notin A$ e $x \\notin B$.",
    "$x \\notin A$ equivale a $x \\in A^c$; $x \\notin B$ equivale a $x \\in B^c$.",
    "O conectivo \"e\" corresponde à interseção: $x \\in A^c \\cap B^c$. Esta é a primeira lei de De Morgan."
  ],
  "commonErrors": [
    {"match": "b", "feedback": "A negação de \"está em $A$ ou em $B$\" troca o \"ou\" por \"e\". $A^c \\cup B^c$ é o complementar da interseção, não da união.", "difficulty": "DIF-MATH-03"},
    {"match": "c", "feedback": "$(A \\cap B)^c$ é a segunda lei de De Morgan; aqui o complementar é da união.", "difficulty": "DIF-MATH-03"}
  ],
  "sources": [{"ref": "BIB-MATH-01", "locator": "Caps. I–III"}],
  "review": "pending",
  "provenance": {"authors": ["claude"], "aiAssisted": true}
}
```

**`numeric`**: resposta numérica com tolerância e unidade opcional. `answer.value` é um número ou uma expressão de `derived`; `answer.tolerance` tem `absolute` e/ou `relative`; `answer.unit` é a unidade esperada e `answer.acceptUnits` as equivalentes aceitas. A entrada aceita vírgula ou ponto decimal.

```json
{
  "id": "EXE-PHYS-1.2-001",
  "revision": 1,
  "type": "numeric",
  "role": "practice",
  "targets": {"subtopics": ["1.2:sub:3"]},
  "level": 1,
  "prompt": "Um objeto é solto a partir do repouso de uma altura de {{h}} m. Despreze a resistência do ar e use $g = 9{,}8\\ \\text{m/s}^2$. Quanto tempo ele leva para chegar ao solo?",
  "params": {"h": {"choice": [5, 10, 20, 45, 80]}},
  "derived": {"t": "sqrt(2 * h / 9.8)"},
  "answer": {
    "value": "t",
    "tolerance": {"relative": 0.01},
    "unit": "s",
    "acceptUnits": ["s", "segundo", "segundos"]
  },
  "hints": [
    "Com aceleração constante e velocidade inicial nula, a distância percorrida é $h = \\tfrac{1}{2} g t^2$.",
    "Isole $t$ e lembre que o tempo é positivo."
  ],
  "solution": [
    "Adote o eixo vertical para baixo, com $v_0 = 0$ e $a = g$.",
    "$h = \\tfrac{1}{2} g t^2 \\Rightarrow t = \\sqrt{2h/g}$.",
    "Com $h = {{h}}$ m: $t = \\sqrt{2 \\cdot {{h}} / 9{,}8} \\approx {{t|2}}$ s.",
    "Verificação dimensional: $\\sqrt{\\text{m} / (\\text{m/s}^2)} = \\text{s}$."
  ],
  "commonErrors": [
    {"match": {"value": "sqrt(h / 9.8)"}, "feedback": "O fator $\\tfrac{1}{2}$ de $h = \\tfrac{1}{2} g t^2$ ficou de fora.", "difficulty": "DIF-PHYS-04"},
    {"match": {"value": "2 * h / 9.8"}, "feedback": "Faltou a raiz quadrada: $2h/g$ tem unidade de $\\text{s}^2$.", "difficulty": "DIF-PHYS-03"},
    {"match": {"unitMismatch": true}, "feedback": "A grandeza pedida é um tempo. Confira a unidade da resposta.", "difficulty": "DIF-PHYS-03"}
  ],
  "sources": [{"ref": "BIB-PHYS-01", "locator": "Caps. 2, 4"}],
  "review": "pending",
  "provenance": {"authors": ["claude"], "aiAssisted": true}
}
```

**`short-text`**: resposta curta comparada após normalização. `answer.accept` lista respostas aceitas; `answer.normalize` escolhe as normalizações (`trim`, `case`, `accents`, `spaces`, `width` para caracteres de largura total).

```json
{
  "id": "EXE-LANG-4.1-001",
  "revision": 1,
  "type": "short-text",
  "role": "practice",
  "targets": {"subtopics": ["4.1:sub:1"]},
  "level": 1,
  "prompt": "Escreva a romanização Hepburn do hiragana {{kana.k}}.",
  "params": {
    "kana": {"pick": [
      {"k": "か", "r": "ka"},
      {"k": "き", "r": "ki"},
      {"k": "く", "r": "ku"},
      {"k": "け", "r": "ke"},
      {"k": "こ", "r": "ko"}
    ]}
  },
  "answer": {"accept": ["{{kana.r}}"], "normalize": ["trim", "case", "width"]},
  "hints": [
    "Este caractere pertence à linha do K na tabela do hiragana.",
    "Na linha do K, as vogais seguem a ordem a, i, u, e, o."
  ],
  "solution": ["{{kana.k}} pertence à linha do K e se romaniza como \"{{kana.r}}\" no sistema Hepburn."],
  "commonErrors": [
    {"match": "ca", "feedback": "Em Hepburn, o som /k/ é sempre escrito com k, nunca com c.", "difficulty": "DIF-LANG-02"}
  ],
  "sources": [{"ref": "BIB-LANG-05", "locator": "Introdução e Fundamentos do Sistema Kanji"}],
  "review": "pending",
  "provenance": {"authors": ["claude"], "aiAssisted": true}
}
```

**`ordering`**: ordenar itens. `answer.items` com `id` e `text`; `answer.order` é a sequência correta de IDs. A apresentação embaralha com a semente.

```json
{
  "id": "EXE-PROG-1.3-001",
  "revision": 1,
  "type": "ordering",
  "role": "practice",
  "targets": {"subtopics": ["1.3:sub:2"]},
  "level": 2,
  "prompt": "Considere a função em C:\n\n```c\nint fatorial(int n) {\n  if (n == 0) return 1;\n  return n * fatorial(n - 1);\n}\n```\n\nNa chamada `fatorial(3)`, ordene as chamadas pela ordem em que **retornam**.",
  "answer": {
    "items": [
      {"id": "f3", "text": "`fatorial(3)`"},
      {"id": "f2", "text": "`fatorial(2)`"},
      {"id": "f1", "text": "`fatorial(1)`"},
      {"id": "f0", "text": "`fatorial(0)`"}
    ],
    "order": ["f0", "f1", "f2", "f3"]
  },
  "hints": [
    "Uma chamada só pode retornar depois que a chamada recursiva que ela fez retornou.",
    "A pilha de chamadas é LIFO: o último quadro empilhado é o primeiro a sair."
  ],
  "solution": [
    "`fatorial(3)` chama `fatorial(2)`, que chama `fatorial(1)`, que chama `fatorial(0)`.",
    "`fatorial(0)` atinge o caso base e retorna 1 sem nova chamada.",
    "Os quadros são desempilhados na ordem inversa: `fatorial(1)` retorna 1, `fatorial(2)` retorna 2 e `fatorial(3)` retorna 6."
  ],
  "commonErrors": [
    {"match": ["f3", "f2", "f1", "f0"], "feedback": "Essa é a ordem em que as chamadas começam. Elas retornam na ordem inversa, porque cada uma espera a seguinte terminar.", "difficulty": "DIF-PROG-04"}
  ],
  "sources": [{"ref": "BIB-PROG-01", "locator": "Cap. 5"}],
  "review": "pending",
  "provenance": {"authors": ["claude"], "aiAssisted": true}
}
```

**`cloze`**: lacunas num texto. O `prompt` marca lacunas com `[[id]]`; `answer.blanks` traz, por lacuna, `accept` e `normalize`, como no `short-text`.

```json
{
  "id": "EXE-LANG-1.1-001",
  "revision": 1,
  "type": "cloze",
  "role": "practice",
  "targets": {"subtopics": ["1.1:sub:2"]},
  "level": 2,
  "prompt": "Complete com o verbo entre parênteses no Present Simple ou no Present Continuous.\n\n1. Water [[b1]] (boil) at 100 °C at sea level.\n2. Look! It [[b2]] (rain).",
  "answer": {
    "blanks": {
      "b1": {"accept": ["boils"], "normalize": ["trim", "case", "spaces"]},
      "b2": {"accept": ["is raining", "'s raining"], "normalize": ["trim", "case", "spaces"]}
    }
  },
  "hints": [
    "Uma frase descreve um fato geral; a outra, algo acontecendo agora.",
    "Fatos gerais usam Present Simple; ações em progresso usam be + verbo com -ing."
  ],
  "solution": [
    "1. Fato geral: Present Simple na terceira pessoa do singular, \"boils\".",
    "2. \"Look!\" indica ação em progresso no momento da fala: Present Continuous, \"is raining\"."
  ],
  "commonErrors": [
    {"match": {"b1": "is boiling"}, "feedback": "A frase descreve um fato geral, não algo acontecendo agora.", "difficulty": "DIF-LANG-03"},
    {"match": {"b2": "rains"}, "feedback": "\"Look!\" chama a atenção para algo acontecendo neste momento.", "difficulty": "DIF-LANG-03"}
  ],
  "sources": [{"ref": "BIB-LANG-01", "locator": "Seções 1–3: be/have, Present Tenses, Imperatives & Basic Word Order"}],
  "review": "pending",
  "provenance": {"authors": ["claude"], "aiAssisted": true}
}
```

**`expression`**: resposta como expressão matemática, verificada por equivalência com a biblioteca do LD04 (LT11). `answer.expected` em LaTeX; `answer.variables` lista as variáveis livres; `answer.domain` exclui pontos de amostragem; `answer.form` opcional exige uma forma (`factored`, `expanded`, `simplified`).

```json
{
  "id": "EXE-MATH-1.2-001",
  "revision": 1,
  "type": "expression",
  "role": "criterion",
  "targets": {"subtopics": ["1.2:sub:5"], "criterion": "1.2:dod:mandatory"},
  "level": 3,
  "prompt": "Seja $h(x) = \\dfrac{1}{x - {{n}}}$, de $\\mathbb{R} \\setminus \\{ {{n}} \\}$ em $\\mathbb{R} \\setminus \\{0\\}$. Escreva a lei de $h^{-1}(y)$.",
  "params": {"n": {"int": [2, 14]}},
  "answer": {
    "expected": "\\frac{1}{y} + {{n}}",
    "variables": ["y"],
    "domain": {"exclude": [0]}
  },
  "hints": [
    "Escreva $y = \\dfrac{1}{x - {{n}}}$ e isole $x$.",
    "Inverta os dois lados antes de somar {{n}}."
  ],
  "solution": [
    "$y = \\dfrac{1}{x - {{n}}} \\Rightarrow x - {{n}} = \\dfrac{1}{y}$, válido porque $y \\neq 0$.",
    "$x = \\dfrac{1}{y} + {{n}}$, logo $h^{-1}(y) = \\dfrac{1}{y} + {{n}}$.",
    "Verificação: $h(h^{-1}(y)) = \\dfrac{1}{1/y} = y$ e $h^{-1}(h(x)) = (x - {{n}}) + {{n}} = x$."
  ],
  "commonErrors": [
    {"match": "\\frac{1}{y} - {{n}}", "feedback": "Ao isolar $x$, {{n}} passa somando para o outro lado.", "difficulty": "DIF-MATH-03"},
    {"match": "\\frac{1}{y - {{n}}}", "feedback": "Isso troca $x$ por $y$ na fórmula original sem inverter a relação.", "difficulty": "DIF-MATH-03"}
  ],
  "sources": [{"ref": "BIB-MATH-01", "locator": "Caps. IV, V, XI"}],
  "review": "pending",
  "provenance": {"authors": ["claude"], "aiAssisted": true}
}
```

**`code`**: código executado contra testes no navegador, com o runtime e o sandbox decididos no LD04. `answer.language`, `answer.starter`, `answer.entrypoint`, `answer.tests` (cada um com `args`, `expected` e `visible`), `answer.reference` (solução de referência, usada pelo `content:lint` para conferir os próprios testes), `answer.limits` (tempo e memória).

```json
{
  "id": "EXE-PROG-2.1-001",
  "revision": 1,
  "type": "code",
  "role": "practice",
  "targets": {"subtopics": ["2.1:sub:5"]},
  "level": 3,
  "prompt": "Implemente `busca_ordenada(seq, x)`, que recebe uma lista `seq` em ordem crescente e devolve o índice da **primeira** ocorrência de `x`, ou `-1` se `x` não estiver na lista. Use o módulo `bisect` para obter custo $O(\\log n)$.",
  "answer": {
    "language": "python",
    "starter": "from bisect import bisect_left\n\ndef busca_ordenada(seq, x):\n    pass\n",
    "entrypoint": "busca_ordenada",
    "tests": [
      {"args": [[1, 3, 5, 7], 5], "expected": 2, "visible": true},
      {"args": [[1, 3, 5, 7], 4], "expected": -1, "visible": true},
      {"args": [[], 1], "expected": -1, "visible": false},
      {"args": [[2, 2, 2], 2], "expected": 0, "visible": false},
      {"args": [[1, 3, 5, 7], 9], "expected": -1, "visible": false}
    ],
    "reference": "from bisect import bisect_left\n\ndef busca_ordenada(seq, x):\n    i = bisect_left(seq, x)\n    return i if i < len(seq) and seq[i] == x else -1\n",
    "limits": {"timeMs": 2000, "memoryMb": 64}
  },
  "hints": [
    "`bisect_left(seq, x)` devolve a posição onde `x` seria inserido mantendo a ordem, à esquerda de iguais.",
    "Essa posição pode ser `len(seq)` ou conter outro valor; confira antes de devolver."
  ],
  "solution": [
    "`i = bisect_left(seq, x)` encontra a menor posição com `seq[i] >= x` em $O(\\log n)$.",
    "Se `i < len(seq)` e `seq[i] == x`, `i` é a primeira ocorrência; caso contrário `x` não está na lista.",
    "O teste com `[2, 2, 2]` confirma que `bisect_left` devolve a primeira ocorrência, e não qualquer uma."
  ],
  "commonErrors": [
    {"match": {"failsTest": 2}, "feedback": "Com a lista vazia, `seq[i]` gera `IndexError`. Confira `i < len(seq)` antes de acessar.", "difficulty": "DIF-PROG-03"},
    {"match": {"failsTest": 3}, "feedback": "Pede-se a primeira ocorrência; `bisect_right` aponta para depois do último igual.", "difficulty": "DIF-PROG-02"}
  ],
  "sources": [{"ref": "BIB-PROG-04", "locator": "Caps. 1–2"}],
  "review": "pending",
  "provenance": {"authors": ["claude"], "aiAssisted": true}
}
```

**`rubric`**: resposta aberta avaliada por critérios explícitos. Não é autocorrigida: a avaliação é autoavaliação guiada, revisor local ou provedor de IA opcional, como os desafios de hoje. `answer.criteria` lista os critérios com `id`, `description` e `evidence` (o que precisa aparecer na resposta); `answer.minWords` e `answer.maxWords` são opcionais; `answer.exemplar` é uma resposta modelo mostrada só depois da tentativa.

```json
{
  "id": "EXE-HUM-1.4-001",
  "revision": 1,
  "type": "rubric",
  "role": "criterion",
  "targets": {"subtopics": ["1.4:sub:2", "1.4:sub:3"], "criterion": "1.4:dod:mandatory"},
  "level": 3,
  "prompt": "Leia o diálogo:\n\n> **Ana**: A proposta aumenta o gasto sem indicar a fonte de receita.\n> **Bruno**: Na semana passada você mesma defendeu cortar impostos. Agora quer mais gasto?\n> **Caio**: Ninguém deveria ouvir alguém que nem terminou a faculdade.\n\nClassifique as falas de Bruno e de Caio entre argumento *ad hominem* (*ex concessis*) e argumento *ad personam*, justifique cada classificação e redija uma resposta *ad rem* para a fala de Caio.",
  "answer": {
    "criteria": [
      {"id": "c1", "description": "Classifica a fala de Bruno como ad hominem no sentido de Schopenhauer (ex concessis)", "evidence": "Menciona que Bruno usa uma concessão anterior da própria Ana"},
      {"id": "c2", "description": "Classifica a fala de Caio como ad personam", "evidence": "Menciona que Caio ataca a pessoa e abandona o objeto da discussão"},
      {"id": "c3", "description": "Redige uma resposta ad rem", "evidence": "A resposta volta à questão da fonte de receita sem atacar Caio"}
    ],
    "minWords": 60,
    "maxWords": 250,
    "exemplar": "Bruno usa um argumento ad hominem no sentido de Schopenhauer: parte de uma posição que a própria Ana concedeu antes (cortar impostos) para apontar uma inconsistência, sem examinar a proposta em si. Caio usa um argumento ad personam: desqualifica Ana por sua formação e abandona o objeto da discussão. Resposta ad rem: \"A formação de quem fala não altera a pergunta: qual receita cobre o novo gasto?\""
  },
  "hints": [
    "Para Schopenhauer, ad hominem trabalha com as concessões do adversário; ad personam ataca a pessoa.",
    "Uma resposta ad rem trata do objeto em discussão, não de quem falou."
  ],
  "solution": [
    "Bruno: ad hominem (ex concessis). Ele confronta Ana com uma posição que ela mesma sustentou.",
    "Caio: ad personam. A formação de Ana não tem relação com a questão da receita.",
    "Resposta ad rem: reconduzir à pergunta sobre a fonte de receita, sem responder ao ataque pessoal."
  ],
  "commonErrors": [],
  "sources": [{"ref": "BIB-HUM-06", "locator": "Introdução e Estratagemas 1–38"}],
  "review": "pending",
  "provenance": {"authors": ["claude"], "aiAssisted": true}
}
```

Tabela-resumo dos campos de `answer`:

| Tipo | Campos de `answer` | Correção |
|---|---|---|
| `multiple-choice` | `options`, `correct`, `shuffle` | Automática |
| `numeric` | `value`, `tolerance`, `unit`, `acceptUnits` | Automática |
| `short-text` | `accept`, `normalize` | Automática |
| `ordering` | `items`, `order` | Automática |
| `cloze` | `blanks` | Automática |
| `expression` | `expected`, `variables`, `domain`, `form` | Automática, motor do LD04 |
| `code` | `language`, `starter`, `entrypoint`, `tests`, `reference`, `limits` | Automática, sandbox do LD04 |
| `rubric` | `criteria`, `minWords`, `maxWords`, `exemplar` | Autoavaliação, revisor local ou IA opcional |

### 6.3 Cartão FSRS

Arquivo `cartoes.json` de cada macrotema. Cada cartão tem frente e verso e declara as direções que geram cartões no FSRS: `recognition` (mostra a frente, pede o verso) e `production` (mostra o verso, pede a frente). Um cartão com as duas direções vira um par, no mesmo modelo que Idiomas já usa (`PAIRED_CARD_KINDS`).

```json
{
  "kind": "TellusCardSetV1",
  "schemaVersion": "1.0.0",
  "node": "DOM-MATH:1.1",
  "cards": [
    {
      "id": "CAR-MATH-1.1-001",
      "revision": 1,
      "lesson": "LIC-MATH-1.1-01",
      "front": "Primeira lei de De Morgan: $(A \\cup B)^c = \\;?$",
      "back": "$A^c \\cap B^c$",
      "directions": ["recognition"],
      "schedule": "mastery",
      "sources": [{"ref": "BIB-MATH-01", "locator": "Caps. I–III"}],
      "review": "pending",
      "provenance": {"authors": ["claude"], "aiAssisted": true}
    }
  ]
}
```

Par de Idiomas, em `content/languages/4.1/cartoes.json`:

```json
{
  "id": "CAR-LANG-4.1-001",
  "revision": 1,
  "lesson": "LIC-LANG-4.1-01",
  "front": "か",
  "back": "ka",
  "directions": ["recognition", "production"],
  "schedule": "lesson",
  "sources": [{"ref": "BIB-LANG-05", "locator": "Introdução e Fundamentos do Sistema Kanji"}],
  "review": "pending",
  "provenance": {"authors": ["claude"], "aiAssisted": true}
}
```

- `lesson` liga o cartão à lição que o ensina (opcional; sem ele, o cartão pertence ao macrotema).
- `schedule` diz quando o cartão entra na fila FSRS: `mastery` (ao atingir S4, padrão e comportamento atual) ou `lesson` (ao concluir a lição indicada). Ver 9.2.
- Mapeamento para o FSRS existente: cada direção gera um cartão com `id = "content:" + idDoCartao + ":" + direção`, `sourceId = "content:" + idDoCartao`, `kind = direção`, `topicId` = número local do nó, `frontLatex`/`backLatex` conforme a direção. O prefixo `content:` impede colisão com os cartões gerados hoje (`1.1:sub:1:statement`, `pair:…:recognition`).
- Cadastro sem duplicação por ID (critério do LT14). Uma nova `revision` atualiza frente e verso dos cartões já cadastrados sem zerar o histórico FSRS.

### 6.4 Fonte

Toda lição, exercício e cartão tem `sources[]` com pelo menos uma entrada:

```json
{"ref": "BIB-PHYS-01", "locator": "Cap. 2"}
```

```json
{"ref": "FON-0001", "locator": "Seção 3.2", "excerpt": true}
```

- `ref` aponta para uma obra da bibliografia (`BIB-*`, que já existe no TellusBridge) ou para uma entrada do registro de fontes (`FON-*`, criado no LT16).
- `locator` indica capítulo, seção ou página. Em `BIB-*`, use o mesmo localizador da bibliografia do macrotema na especificação, salvo quando a pessoa que escreve conferiu outro trecho na obra.
- **`BIB-*` é fonte de consulta, não autorização de cópia.** A maioria das obras da bibliografia tem direitos reservados. Citar `BIB-*` significa "o conteúdo foi escrito com base nesta obra"; não permite reproduzir texto, figura ou exercício dela.
- Reproduzir material de terceiros (frase de exemplo, figura, trecho de texto, dado) exige `excerpt: true` e uma entrada `FON-*` com licença compatível. A entrada do registro tem, no mínimo: `id`, `title`, `url` oficial, `license` em SPDX (ou `LicenseRef-dominio-publico-BR` com a justificativa), modelo de `attribution` e `verifiedAt`. A lista de licenças compatíveis e o formato da atribuição são do LD05; o schema do registro é do LT16.
- O leitor de lição mostra a atribuição de toda fonte com `excerpt: true` junto do trecho (LT09, LT16).

## 7. Versionamento

### 7.1 Formato (`schemaVersion`)

SemVer. Começa em `1.0.0`.

- **Patch**: só esclarecimento do schema, sem mudar o que valida.
- **Minor**: campo opcional novo ou tipo de exercício novo. Packs antigos continuam válidos.
- **Major**: mudança que invalida packs existentes. Exige novo ADR, migração automatizada de `content/` e teste da migração.

### 7.2 Conteúdo de um domínio (`pack.json` → `version`)

SemVer por domínio, atualizado por quem altera o conteúdo:

- **Patch**: correção de texto, dica ou solução sem mudar gabarito.
- **Minor**: lição, exercício ou cartão novo.
- **Major**: aposentadoria de item ou mudança de gabarito em item existente.

O build grava a versão em `dist/content/<slug>.json`. Ela aparece nos créditos do domínio e serve para conferência na revisão; nenhuma regra do motor depende dela.

### 7.3 Item (`revision`)

Inteiro por item, começando em 1. Incrementa quando muda o que a pessoa vê ou como a resposta é julgada: enunciado, parâmetros, gabarito, testes, tolerância, frente ou verso do cartão. Erro de digitação que não muda sentido não incrementa.

- A tentativa grava `exerciseId`, `revision` e `seed`. Tentativas antigas continuam no histórico.
- Se o gabarito anterior estava errado, a correção define `attemptsValidFrom` igual à nova `revision`: tentativas anteriores deixam de contar como evidência, mas não são apagadas. **Estados já concedidos pela FSM não são revogados**: a FSM é a autoridade (invariante 3), e o efeito se limita a evidências futuras.

### 7.4 Armazenamento e snapshot

Este ADR não altera o formato do armazenamento. Guardar tentativas de exercícios autocorrigidos (LT10, LT13) exige versão nova do snapshot, migração explícita e teste com snapshot antigo real (invariante 5). Isso fica nas tarefas que implementam o motor.

## 8. Como o conteúdo gera evidência para a FSM

Princípio: **o conteúdo produz evidências e propõe ações; só a FSM muda estado**. Nenhuma regra de `fsm.mjs` muda. As guardas de pré-requisito (Modo Flexível e Modo Estrito) continuam sendo verificadas por `advancementGuard` antes de qualquer ação, como hoje.

| Ação da FSM | Requisito atual | O que o conteúdo fornece | Quem dispara |
|---|---|---|---|
| `completeSubtopic` | Subtema existente e evidência textual não vazia | Lição concluída (todas as verificações rápidas `check` respondidas) para cada subtema em `covers`. A evidência é gerada automaticamente: `"Lição LIC-MATH-1.1-01 r1 concluída; verificação rápida 2/2"` | A pessoa confirma; a interface propõe |
| `completeTheory` (S1 → S2) | Estado S1 e fichamento não vazio | Nada substitui o fichamento. A lição pode oferecer um campo de anotações que preenche o fichamento | A pessoa |
| `passPractice` (S2 → S3) | Estado S2, `correct` e `total` inteiros, `correct/total ≥ 0,8`, evidência | `evidenceFromAttempts(attempts, policy)` (LT13) calcula `correct` e `total` a partir das tentativas em exercícios `practice` do macrotema e monta a evidência textual com os IDs e revisões | A interface propõe quando a política é atendida; a pessoa confirma |
| `validateCriterion` | Estado S3, critério existente, `approved: true`; no `mandatory`, `withoutConsultation: true` | Tentativas em exercícios `criterion` com `targets.criterion` igual ao critério. Autocorrigidos: `approved` = todos corretos na revisão válida; `withoutConsultation` = nenhuma dica usada e nenhuma solução vista antes da resposta. `rubric`: aprovação e declaração "sem consulta" pela pessoa, como hoje | A interface propõe; a pessoa confirma |
| `validateProof` (S3 → S4) | Todos os subtemas, critérios obrigatórios sem consulta e Capstone aprovados | Nada novo: consolida o que as ações anteriores registraram | A pessoa, como hoje |

Registro de tentativa que o motor de exercícios entrega ao `learning-core` (o formato exato fica com LT10 e LT13):

```json
{
  "id": "tentativa-uuid",
  "exerciseId": "EXE-PHYS-1.2-001",
  "revision": 1,
  "seed": 2918374,
  "topicIds": ["1.2"],
  "correct": false,
  "matchedError": 0,
  "difficulty": "DIF-PHYS-04",
  "hintsUsed": 1,
  "solutionViewedBeforeAnswer": false,
  "elapsedMs": 48000,
  "submittedAt": "2026-11-22T14:03:10.000Z"
}
```

Regras que valem para qualquer política de evidência do LT13:

1. Só exercícios com `review: ok` e `status` ativo contam como evidência para `passPractice` e `validateCriterion`. Com `review: pending`, o exercício pode ser praticado e é rotulado como "em revisão", mas não produz evidência. Isso aplica o invariante 7 (gabarito conferido por teste ou revisão humana) ao motor.
2. Tentativas com `revision < attemptsValidFrom` não contam.
3. A mesma variante (seção 6.2.1) conta uma vez.
4. Dica usada reduz o peso da tentativa; solução vista antes da resposta anula a tentativa como evidência. Os pesos são da política do LT13.
5. `check` nunca conta para `passPractice` nem para `validateCriterion`: serve à lição e a `completeSubtopic`.
6. Etiqueta `DIF-*` vinda de `commonErrors` alimenta `diagnose` com o mesmo formato de tentativa usado hoje (`id`, `topicIds`, `difficulty`, `submittedAt`).

## 9. Questões em aberto para o Ayrton

### 9.1 Parser do front matter

YAML é o formato habitual de front matter, mas parsear YAML completo à mão é arriscado. Opções:

- **(a)** Dependência de build madura para YAML (por exemplo, o pacote `yaml` do npm), usada só em `scripts/` e nunca no navegador. A licença e a manutenção são conferidas na fonte oficial no LT07.
- **(b)** Subconjunto de YAML documentado (escalares, listas de escalares, listas de mapas planos), com parser próprio pequeno e testado no LT07.
- **(c)** Front matter em JSON.

Recomendação: **(b)**, porque o front matter definido aqui só precisa desse subconjunto e o projeto não tem dependências de build além do TypeScript. Se o subconjunto se mostrar limitante, migrar para (a) é uma mudança de patch no schema.

### 9.2 Cartões antes do S4

Hoje `reviewCard` exige o macrotema dominado. Para Idiomas, revisar kana desde a primeira lição é o comportamento esperado (`schedule: "lesson"`). Permitir isso não muda as regras de estado (`refreshLearning` só olha cartões de macrotemas dominados para decidir S4, S5 e S6), mas relaxa uma guarda do `learning-core`. Recomendação: aceitar `schedule: "lesson"` e implementar no LT14, com teste de que cartões revisados antes do S4 não alteram o estado do macrotema.

### 9.3 Exercícios em `review: pending` sem evidência

A regra 1 da seção 8 é conservadora: o conteúdo piloto inteiro entra como `pending` e só gera evidência depois da sua revisão. Alternativa: deixar `pending` contar e revisar depois. Recomendação: manter a regra, porque o custo de um gabarito errado virar maestria é maior que o de esperar a revisão.

### 9.4 Licença padrão do conteúdo autoral

Os exemplos usam `CC-BY-SA-4.0`, a proposta do LD05. O valor definitivo sai do ADR-005; trocá-lo depois é uma mudança de `defaultLicense` em 8 arquivos.

## 10. Consequências

**Positivas**

- Conteúdo e código separados: os três agentes podem escrever conteúdo em domínios diferentes sem conflito, que é onde está a maior parte do paralelismo do L1.
- O mesmo exercício declara enunciado, variantes, gabarito, dicas, solução, erros comuns e fonte, e tudo é validado por máquina (LT07, LT08).
- A FSM, o FSRS e o diagnóstico continuam sendo a única lógica pedagógica; o conteúdo só alimenta.
- Fonte e licença em cada item tornam auditável a regra "conteúdo nunca inventado".

**Negativas e riscos**

- IDs de subtema posicionais acoplam o conteúdo à especificação; uma renumeração quebra o lint (detectável, não silencioso).
- `expression` e `code` só ficam utilizáveis depois do LD04 e do LT11. Até lá, os pilotos usam os outros 6 tipos.
- Um avaliador aritmético próprio para `derived` é código novo a manter (escopo do LT10).
- A regra 1 da seção 8 atrasa o efeito pedagógico do conteúdo piloto até a revisão humana.

**Próximos passos após a decisão**

1. LT07: `packages/content-schema/` com schemas de lição (front matter), conjunto de exercícios, conjunto de cartões, manifesto e registro de fontes; os exemplos deste ADR viram fixtures válidas.
2. LT08: `content:lint` com as conferências citadas aqui (nó e subtemas existentes, `DIF-*` do domínio, `BIB-*` existente, `reference` do `code` passando nos próprios testes, `value` e `expected` consistentes com `commonErrors`).
3. LT15: converter `authorship.mjs` para `content/mathematics/`, preservando variantes.
