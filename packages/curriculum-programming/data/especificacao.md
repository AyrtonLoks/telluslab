ESPECIFICAÇÃO DE DOMÍNIO E REQUISITOS — TELLUSLAB (DOM-PROG: PROGRAMAÇÃO E CIÊNCIA DA COMPUTAÇÃO)
# 1. ARQUITETURA PEDAGÓGICA E REQUISITOS DO DOMÍNIO (SRS / DOMAIN PACK)
1.0. Metadados do Pacote de Domínio (Domain Pack)
domainId: DOM-PROG
slug: programming
name: Programação e Ciência da Computação
version: 1.0.0
dominiosRelacionados: DOM-MATH (pré-requisitos cruzados opcionais ou estritos configuráveis no TellusLab)
1.1. Modelagem de Trilhas de Conhecimento (DAG)
O currículo não é linear; após vencer a base de lógica, memória em C e estruturas fundamentais, divide-se em um Grafo Acíclico Dirigido (DAG) com cinco trilhas paralelas e arestas cruzadas com o domínio de Matemática (DOM-MATH):
TRL-PROG-00 (Base de Programação, Memória e Paradigmas): Lógica em C, ponteiros, estruturas lineares, Python profundo, Orientação a Objetos idiomática e Programação Funcional (Níveis 1 e 2).
TRL-PROG-01 (Algoritmos, Estruturas de Dados e Análise Matemática): De estruturas clássicas e prática de entrevistas até análise amortizada, fluxos em redes, NP-completude, Sedgewick & Flajolet e TAOCP (Níveis 3, 7 e 9).
TRL-PROG-02 (Artesanato de Código, Design Tático e DDD): Clean Code, TDD, Refatoração, Padrões de Projeto (GoF), Arquitetura Limpa, DDD Estratégico e DDD Tático (Níveis 4 e 6).
TRL-PROG-03 (Arquitetura de Software, Sistemas Distribuídos e Dados em Escala): Padrões de Design de API, Fundamentos e Partes Difíceis da Arquitetura, Microsserviços, Sistemas Distribuídos, DDIA e System Design (Níveis 6 e 8).
TRL-PROG-04 (Engenharia de Software, Gestão Técnica e DevOps): Processos, Engenharia de Requisitos, Modelagem e Qualidade, Lei de Brooks, Cultura e Práticas de DevOps (Nível 5).
1.2. Máquina de Estados Finita (FSM) de Proficiência por Macrotema
Cada Macrotema (X.Y) segue a máquina de estados padrão do TellusLab:
S0 — BLOQUEADO: Pelo menos um macrotema listado em Pré-requisitos Diretos ainda não atingiu o estado S4 (PROVA_VALIDADA). (Arestas em Pré-requisitos Cruzados com DOM-MATH atuam como Soft Warning por padrão ou Hard Gate quando o Modo Estrito Interdisciplinar estiver ativo.)
S1 — DISPONIVEL: Todos os pré-requisitos diretos atingiram S4 ou superior; pronto para iniciar estudo.
S2 — TEORIA_CONCLUIDA: Leitura ativa e fichamento das definições, trade-offs, invariantes e exemplos nas obras de referência.
S3 — FIXACAO_MECANICA: Resolução de bateria prática (exercícios algorítmicos, refatorações, modelagens ou análises de trade-offs) com taxa de acerto/aprovação ≥ 80%.
S4 — PROVA_VALIDADA (Estado de Desbloqueio): Conceitos/Teoremas/Princípios obrigatórios validados sem consulta e Problema-Marco (Capstone) concluído e testado. Libera nós dependentes no DAG e insere o macrotema no motor FSRS-5.
S5 — REVISAO_EM_DIA: Em ciclo ativo de manutenção via FSRS-5.
S6 — REVISAO_VENCIDA: Intervalo de retenção expirado; exige sessão de revisão antes de avançar em nós filhos.
1.3. Taxonomia de Modalidades de Estudo, Papéis Bibliográficos e Dificuldades
Papéis da Bibliografia:
[Intuição/Prática]: Foco em construção intuitiva, exemplos concretos, código idiomático e resolução prática.
[Rigor/Teoria]: Foco em provas de corretude, análise matemática, teoremas de impossibilidade e fundamentos formais.
[Algorítmica]: Foco em análise exata, estruturas de baixo nível, manipulação bit a bit e implementação ótima.
[Arquitetura/Trade-offs]: Foco em decisões estruturais, modelagem de domínio, sistemas distribuídos e engenharia em produção.
Modalidades de Prática Exigidas por Macrotema:
[Projeto e Arquitetura]: Modelagem UML/DDD, ADRs, desenho de APIs, análise de trade-offs e diagramas de sistemas distribuídos.
[Implementação Algorítmica]: Codificação limpa de estruturas de dados, algoritmos, padrões e protocolos (em C, Python, Go ou Rust).
[Análise e Demonstração]: Provas de invariantes de laço, complexidade assintótica/amortizada, reduções NP e verificação formal de propriedades distribuídas.
[Depuração e Benchmark]: Testes unitários e de propriedade, casos de borda, refatoração guiada por testes, profiling e benchmarks empíricos.
Tags de Dificuldade para Diagnóstico Regressivo:
DIF-PROG-01 (Lacuna em Pré-requisito Interno ou DOM-MATH)
DIF-PROG-02 (Escolha de Estrutura de Dados / Algoritmo / Padrão)
DIF-PROG-03 (Bug de Implementação / Ponteiros / Edge Cases)
DIF-PROG-04 (Falha na Análise de Complexidade / Invariantes)
DIF-PROG-05 (Trade-off Arquitetural / Consistência / Falha Parcial)
DIF-PROG-06 (Estouro de Tempo > 75 min)
1.4. Requisitos Funcionais (RF) do Módulo DOM-PROG
RF-01 (Grafo Curricular e Caminho Crítico): Renderizar o DAG interativo dos 49 macrotemas de DOM-PROG com suporte à exibição de arestas cruzadas para DOM-MATH. Permitir selecionar qualquer macrotema ou obra-alvo (ex.: BIB-PROG-34 DDIA ou BIB-PROG-13 CLRS) para calcular via ordenação topológica o subgrafo mínimo pendente.
RF-02 (Motor de Repetição Espaçada — FSRS-5): Agendar cartões derivados dos subtemas e critérios DoD de macrotemas em S4+, cobrindo: (a) complexidades e invariantes de estruturas/algoritmos, (b) trade-offs e modos de falha de padrões arquiteturais e distribuídos, e (c) distinções sutis entre conceitos (ex.: Snapshot Isolation vs. Serializable, LSM-Tree vs. B-Tree).
RF-03 (Gerador de Sessões Intercaladas de 45–75 min): Montar sessões práticas de 45 a 75 minutos divididas em 50% avanço em tema ativo (S1–S3), 30% revisão vencida (S6) de trilhas distintas e 20% problemas mistos sem indicação prévia do algoritmo ou padrão.
RF-04 (Trava de Solução e Revisão Socrática): Bloquear a solução comentada/gabarito até o registro obrigatório de tentativa (tempo cronometrado, código/diagrama/ADR submetido e tags de dificuldade). A IA revisa invariantes, casos de borda, acoplamento e modos de falha de forma socrática.
RF-05 (Diagnóstico Regressivo Cross-Domain): Ao registrar DIF-PROG-01, percorrer as arestas reversas dentro de DOM-PROG e também as arestas cruzadas em DOM-MATH para injetar micro-revisões direcionadas.
RF-06 (Sandbox de Testes e Benchmarks): Para macrotemas com [Implementação Algorítmica] ou [Depuração e Benchmark], gerar especificação de contrato, casos de borda (vazio, unitário, duplicatas, limites de memória/overflow) e invariantes verificáveis.
RF-07 (Métricas Ponderadas e Ponte TellusPedia): Calcular progresso global, por trilha (TRL-PROG-00 a TRL-PROG-04) e por obra (BIB-PROG-01 a BIB-PROG-41), ponderado por Complexidade (1–5), exportável em snapshot JSON compatível com a rota /lab?domain=programming do TellusPedia.
1.5. Requisitos Não-Funcionais, Integração e Radar de Lacunas
RNF-01 (Renderização Técnica): Suporte a KaTeX (para complexidades, recorrências e análise matemática), blocos de código com destaque de sintaxe e diagramas Mermaid (para UML, fluxos, estados e arquitetura distribuída).
RNF-02 (Persistência Local-First e Compatibilidade): Compatível com o mesmo schema SQLite/IndexedDB e snapshot JSON do TellusLab, usando IDs qualificados pelo namespace DOM-PROG.
RNF-03 (Radar de Expansão Futura — Lacunas Conhecidas do Acervo Físico Atual): Este acervo físico não inclui obras dedicadas a (a) Arquitetura de Computadores e Sistemas Operacionais, (b) Redes de Computadores e Protocolos TCP/IP, e (c) Compiladores e Teoria Formal de Linguagens. O domínio está preparado para incorporar um Nível de Sistemas Base quando essas obras forem adicionadas.
# 2. CATÁLOGO BIBLIOGRÁFICO (ACERVO BASE DOM-PROG)
2.1. Fundamentos de Programação, Linguagens e Paradigmas
BIB-PROG-01: Algoritmos e Lógica de Programação em C — Silvio do Lago Pereira
BIB-PROG-02: Estruturas de Dados em C — Silvio do Lago Pereira
BIB-PROG-03: Python Fluente (1ª Edição — Referência Secundária) — Luciano Ramalho
BIB-PROG-04: Python Fluente (2ª Edição, Vol. 1/3: dados + funções) — Luciano Ramalho
BIB-PROG-05: Python Fluente (2ª Edição, Vol. 2/3: classes + protocolos) — Luciano Ramalho
BIB-PROG-06: Python Fluente (2ª Edição, Vol. 3/3: fluxo + metaprogramação) — Luciano Ramalho
BIB-PROG-07: Python Poderoso — Aaron Maxwell
BIB-PROG-08: Aprenda Programação Funcional — Jack Widman
2.2. Algoritmos, Estruturas de Dados, Análise e Resolução de Problemas
BIB-PROG-09: Entendendo Algoritmos — Aditya Y. Bhargava
BIB-PROG-10: Data Structures & Algorithms in Python — Michael T. Goodrich, Roberto Tamassia, Michael H. Goldwasser
BIB-PROG-11: Algorithms (4th Edition) — Robert Sedgewick, Kevin Wayne
BIB-PROG-12: Algoritmos — Sanjoy Dasgupta, Christos Papadimitriou, Umesh Vazirani
BIB-PROG-13: Algoritmos: Teoria e Prática (Tradução da 3ª Edição Americana — CLRS) — Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein
BIB-PROG-14: Cracking the Coding Interview (6th Edition) — Gayle Laakmann McDowell
BIB-PROG-15: Elements of Programming Interviews in Python — Adnan Aziz, Tsung-Hsien Lee, Amit Prakash
BIB-PROG-16: An Introduction to the Analysis of Algorithms (2nd Edition) — Robert Sedgewick, Philippe Flajolet
BIB-PROG-17: The Art of Computer Programming, Vol. 1: Fundamental Algorithms (3rd Edition) — Donald E. Knuth
BIB-PROG-18: The Art of Computer Programming, Vol. 2: Seminumerical Algorithms (3rd Edition) — Donald E. Knuth
BIB-PROG-19: The Art of Computer Programming, Vol. 3: Sorting and Searching (2nd Edition) — Donald E. Knuth
BIB-PROG-20: The Art of Computer Programming, Vol. 4A: Combinatorial Algorithms, Part 1 — Donald E. Knuth
BIB-PROG-21: The Art of Computer Programming, Vol. 4B: Combinatorial Algorithms, Part 2 — Donald E. Knuth
2.3. Artesanato de Software, Design de Código e Modelagem de Domínio
BIB-PROG-22: Código Limpo: Habilidades Práticas do Agile Software — Robert C. Martin
BIB-PROG-23: O Programador Pragmático — Andrew Hunt, David Thomas
BIB-PROG-24: Refatoração (2ª Edição) — Martin Fowler
BIB-PROG-25: Padrões de Projeto (GoF) — Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides
BIB-PROG-26: Arquitetura Limpa: O Guia do Artesão para Estrutura e Design de Software — Robert C. Martin
BIB-PROG-27: Domain-Driven Design (3ª Edição Revisada) — Eric Evans
BIB-PROG-28: Implementando Domain-Driven Design — Vaughn Vernon
2.4. Arquitetura de Software, APIs, Sistemas Distribuídos e Dados em Escala
BIB-PROG-29: Padrões para Design de API — Olaf Zimmermann, Mirko Stocker, Daniel Lübke, Uwe Zdun, Cesare Pautasso
BIB-PROG-30: Fundamentos da Arquitetura de Software — Mark Richards, Neal Ford
BIB-PROG-31: Arquitetura de Software: As Partes Difíceis — Neal Ford, Mark Richards, Pramod Sadalage, Zhamak Dehghani
BIB-PROG-32: Building Microservices (2nd Edition) — Sam Newman
BIB-PROG-33: Projetando Sistemas Distribuídos — Brendan Burns
BIB-PROG-34: Designing Data-Intensive Applications (DDIA) — Martin Kleppmann
BIB-PROG-35: System Design Interview (Volume 1) — Alex Xu
BIB-PROG-36: System Design Interview (Volume 2) — Alex Xu, Sahn Lam
2.5. Engenharia de Software, Processos, Gestão Técnica e DevOps
BIB-PROG-37: Engenharia de Software (10ª Edição) — Ian Sommerville
BIB-PROG-38: Engenharia de Software (9ª Edição) — Roger S. Pressman, Bruce R. Maxim
BIB-PROG-39: O Mítico Homem-Mês (Edição de 20º Aniversário) — Frederick P. Brooks Jr.
BIB-PROG-40: Manual de DevOps — Gene Kim, Jez Humble, Patrick Debois, John Willis
BIB-PROG-41: O Projeto Unicórnio — Gene Kim
# 3. TAXONOMIA GRANULAR DE MACROTEMAS, METADADOS E CRITÉRIOS DE ACEITE
NÍVEL 1: LÓGICA DE PROGRAMAÇÃO, MEMÓRIA EM C E ESTRUTURAS LINEARES BÁSICAS
Macrotema 1.1: Lógica de Programação, Controle de Fluxo e Funções em C
Trilha: TRL-PROG-00 | Complexidade: 1/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:1.1, DOM-MATH:2.2
|---|---|* Modalidades de Prática: [Implementação Algorítmica], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-01 [Intuição/Prática] (Caps. 1–6)
Subtemas:
Tipos primitivos, variáveis, constantes e representação binária elementar
Operadores aritméticos, relacionais, lógicos e precedência com avaliação em curto-circuito
Estruturas condicionais (if/else, switch) e laços de repetição (while, do-while, for)
Modularização com funções, protótipos, escopo léxico, tempo de vida e passagem de parâmetros por valor
Pré-processador, macros e compilação separada básica
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Invariante de laço elementar, escopo local vs. global e efeitos de truncamento/overflow em inteiros.
Problema-Marco: Implementar em C um conjunto de utilitários numéricos e de validação modularizados (sem variáveis globais) com testes automatizados de casos-limite (zero, negativos e limites de tipo).
Macrotema 1.2: Modelo de Memória, Ponteiros e Alocação Dinâmica em C
Trilha: TRL-PROG-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Implementação Algorítmica], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-01 [Intuição/Prática] (Caps. 7–11); BIB-PROG-02 [Algorítmica] (Caps. 1–2)
Subtemas:
Endereçamento de memória, ponteiros, ponteiros para ponteiros e aritmética de ponteiros
Vetores, matrizes contíguas em memória e passagem por referência via ponteiros
Cadeias de caracteres (strings terminadas em '\0') e segurança contra buffer overflow
Estruturas compostas (struct, typedef, union, enum) e alinhamento/padding básico
Memória Stack vs. Heap, alocação dinâmica (malloc, calloc, realloc, free), ponteiros pendentes (dangling pointers) e vazamento de memória
Ponteiros para funções e leitura/escrita de arquivos binários e texto
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Ciclo de vida de alocação na Heap, diferença entre ponteiro nulo, pendente e vazamento de memória, e relação entre vetores e aritmética de ponteiros.
Problema-Marco: Implementar um vetor dinâmico genérico (estilo std::vector) em C com redimensionamento automático e verificação rigorosa de ausência de vazamentos de memória.
Macrotema 1.3: Recursão e Decomposição de Problemas
Trilha: TRL-PROG-00 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:2.7
Modalidades de Prática: [Implementação Algorítmica], [Análise e Demonstração]
Bibliografia e Capítulos: BIB-PROG-01 [Intuição/Prática] (Cap. 5); BIB-PROG-02 [Algorítmica] (Cap. 5); BIB-PROG-09 [Intuição/Prática] (Cap. 3)
Subtemas:
Estrutura formal da recursão: caso base, passo indutivo e convergência para o caso base
Anatomia da pilha de chamadas (call stack / stack frames) e risco de stack overflow
Recursão direta, recursão mútua/indireta e recursão em árvore
Recursão de cauda (tail recursion) e conversão sistemática de algoritmos recursivos para iterativos usando pilha explícita
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Isomorfismo entre prova por indução matemática e corretude de função recursiva, e custo espacial da pilha de execução.
Problema-Marco: Implementar a Torre de Hanói e a busca em labirinto de forma recursiva e, em seguida, reescrever a solução de forma puramente iterativa usando uma pilha explícita.
Macrotema 1.4: Estruturas de Dados Lineares e Representações Contíguas vs. Encadeadas
Trilha: TRL-PROG-00 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.2 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Implementação Algorítmica], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-02 [Algorítmica] (Caps. 2–4, 6); BIB-PROG-09 [Intuição/Prática] (Cap. 2); BIB-PROG-10 [Intuição/Prática] (Caps. 5–7)
Subtemas:
Tipos Abstratos de Dados (TADs): separação entre interface e implementação
Pilhas (LIFO): implementação sequencial e encadeada, avaliação de expressões infixas/pós-fixas (notação polonesa reversa) e balanceamento de delimitadores
Filas (FIFO): fila circular em vetor, fila encadeada e Deques (filas de dupla extremidade)
Listas encadeadas: simples, duplamente encadeadas, circulares e nós sentinelas
Trade-offs de localidade de cache, acesso aleatório O(1) vs. inserção/remoção em meio de sequência
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Diferença de complexidade e localidade de memória entre arrays contíguos e listas encadeadas, e algoritmo Shunting-Yard básico para expressões aritméticas.
Problema-Marco: Implementar em C (com TAD opaco) uma pilha, uma fila circular e uma lista duplamente encadeada com sentinela, utilizando a pilha para construir um avaliador de expressões matemáticas com parênteses.
Macrotema 1.5: Algoritmos Clássicos Elementares e Noção Prática de Complexidade
Trilha: TRL-PROG-01 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.3, 1.4 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:1.4, DOM-MATH:4.1
Modalidades de Prática: [Implementação Algorítmica], [Análise e Demonstração], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-02 [Algorítmica] (Caps. 7–8); BIB-PROG-09 [Intuição/Prática] (Caps. 1, 4)
Subtemas:
Busca linear e Busca Binária (iterativa e recursiva) e cuidados com overflow de ponto médio e limites de intervalo
Ordenação elementar O(n²): Selection Sort, Insertion Sort e Bubble Sort (estabilidade e comportamento em entradas quase ordenadas)
Introdução a Divisão e Conquista: ideia estrutural de Mergesort e Quicksort
Leitura intuitiva de ordens de crescimento: O(1), O(log n), O(n), O(n log n), O(n²) e O(2ⁿ)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Invariante da Busca Binária, conceito de estabilidade em ordenação e vantagem do Insertion Sort para vetores pequenos ou quase ordenados.
Problema-Marco: Implementar busca binária (primeira e última ocorrência) e os algoritmos Insertion Sort e Mergesort, comparando empiricamente o tempo de execução para entradas aleatórias, ordenadas e invertidas.
NÍVEL 2: DOMÍNIO DE LINGUAGEM MODERNA, PARADIGMA FUNCIONAL E PYTHON PROFUNDO
Macrotema 2.1: Modelo de Dados, Sequências e Estruturas Nativas em Python
Trilha: TRL-PROG-00 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.4 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Implementação Algorítmica], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-04 [Intuição/Prática] (Caps. 1–2); BIB-PROG-03 [Intuição/Prática] (Caps. 1–2, secundário); BIB-PROG-07 [Intuição/Prática] (Caps. 1–2)
Subtemas:
Modelo de dados do Python: métodos especiais (dunder methods como len, getitem, repr, bool)
Sequências contêiner vs. sequências planas, mutáveis vs. imutáveis (list, tuple, array.array, memoryview, collections.deque)
Desempacotamento avançado, fatiamento (slicing) e objetos slice
List comprehensions, expressões geradoras e Pattern Matching estrutural (match/case)
Algoritmo Timsort em list.sort vs. sorted e busca em sequências ordenadas com bisect
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Diferença interna entre sequências contêiner (referências) e planas (bytes contíguos) e uso idiomático do protocolo de sequência.
Problema-Marco: Construir uma coleção ordenada customizada em Python implementando o protocolo completo de sequência, slicing nativo e busca binária com bisect.
Macrotema 2.2: Dicionários, Conjuntos, Texto e Encoding
Trilha: TRL-PROG-00 | Complexidade: 2/5 | Pré-requisitos Diretos: 2.1 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Implementação Algorítmica], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-04 [Intuição/Prática] (Caps. 3–4); BIB-PROG-03 [Intuição/Prática] (Caps. 3–4, secundário)
Subtemas:
Dicionários modernos (dict, defaultdict, Counter, ChainMap, MappingProxyType), dict comprehensions e união de mapeamentos
Teoria prática de tabelas hash em Python: requisito de hashabilidade (hash e eq), sobrecarga de memória e preservação de ordem de inserção
Conjuntos (set e frozenset) e operações algébricas eficientes em tempo médio O(1)
Modelo de texto vs. bytes: Unicode (code points), UTF-8, codificação/decodificação, tratamento de erros de encoding e normalização Unicode (NFC, NFD, NFKC)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Invariante de hashabilidade (a == b implica hash(a) == hash(b)) e o modelo "Unicode Sandwich" (decodificar na entrada, processar em str, codificar na saída).
Problema-Marco: Implementar um indexador invertido de documentos multilíngues com normalização Unicode rigorosa, comparação insensível a acentos/caixa e consultas booleanas sobre conjuntos.
Macrotema 2.3: Programação Funcional e Funções de Primeira Classe
Trilha: TRL-PROG-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.3, 2.1 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:2.6
Modalidades de Prática: [Projeto e Arquitetura], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-08 [Rigor/Teoria] (Caps. 1–10); BIB-PROG-04 [Intuição/Prática] (Caps. 7–9); BIB-PROG-07 [Intuição/Prática] (Caps. 4–5)
Subtemas:
Princípios da programação funcional: funções puras, transparência referencial, imutabilidade e isolamento de efeitos colaterais
Funções como objetos de primeira classe, funções de ordem superior (map, filter, reduce), functools.partial e módulo operator
Closures, variáveis livres, nonlocal e criação de decoradores parametrizados e empilhados (functools.wraps)
Tipos Algébricos de Dados (tipos soma e produto), composição funcional e pipelines declarativos
Abstrações funcionais para tratamento seguro de ausência e erro: Option/Maybe, Either/Result, Functors (map) e noção prática de Monads (flatMap/bind)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Leis de Functor (identidade e composição), transparência referencial e mecânica léxica de closures e decoradores.
Problema-Marco: Construir um pipeline funcional de validação e transformação de dados financeiros utilizando tipos imutáveis Result/Option (sem exceções para controle de fluxo) e decoradores de memoização/instrumentação.
Macrotema 2.4: Orientação a Objetos Idiomática, Protocolos e Tipagem Estática Gradual
Trilha: TRL-PROG-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.1, 2.2 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-04 [Intuição/Prática] (Caps. 5–6, 8); BIB-PROG-05 [Intuição/Prática] (Caps. 11–16); BIB-PROG-07 [Intuição/Prática] (Caps. 6–7)
Subtemas:
Referências de objetos, identidade vs. igualdade (is vs. ==), cópia rasa vs. profunda, parâmetros mutáveis como armadilha e coleta de lixo (reference counting + cyclic GC)
Construtores de classes de dados (@dataclass, NamedTuple, typing.TypedDict) e imutabilidade (frozen=True, slots)
Subtipagem nominal (ABCs — Goose Typing) vs. subtipagem estrutural (Duck Typing e typing.Protocol)
Tipagem estática gradual: TypeVar, Generic, ParamSpec, covariância, contravariância e invariância em coleções e callables
Sobrecarga de operadores aritméticos e de comparação (protocolos add/radd, NotImplemented)
Herança, composição, Mixins e Ordem de Resolução de Métodos (MRO / algoritmo C3)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Variância de tipos (por que list[Cat] não é subtipo de list[Animal], mas Sequence[Cat] é), funcionamento do despacho de operadores com NotImplemented e linearização C3.
Problema-Marco: Projetar uma biblioteca de álgebra vetorial e matrizes tipada estaticamente (validada por mypy/pyright strict) usando Protocol, operadores sobrecarregados comutativos e slots.
Macrotema 2.5: Fluxo de Controle, Iteradores, Geradores e Concorrência em Python
Trilha: TRL-PROG-00 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.3, 2.4 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Implementação Algorítmica], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-06 [Intuição/Prática] (Caps. 17–21); BIB-PROG-07 [Intuição/Prática] (Caps. 3, 8)
Subtemas:
Protocolo Iterável vs. Iterador, avaliação preguiçosa (lazy evaluation), funções geradoras (yield, yield from) e módulo itertools
Gerenciadores de contexto (with, enter, exit, contextlib.contextmanager) e gerenciamento seguro de recursos
Modelos de concorrência em Python: Threads, o GIL (Global Interpreter Lock), Multiprocessing (CPU-bound vs. I/O-bound) e concurrent.futures
Programação assíncrona cooperativa com asyncio: Event Loop, corrotinas (async/await), Tasks, Semaphores, filas assíncronas, cancelamento gracioso e controle de backpressure
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Distinção entre concorrência e paralelismo, impacto do GIL em cargas CPU-bound vs. I/O-bound e riscos de bloqueio do event loop no asyncio.
Problema-Marco: Implementar um coletor de dados concorrente com asyncio, limite configurável de concorrência (Semaphore), timeouts, cancelamento limpo e processamento em streaming via geradores assíncronos.
Macrotema 2.6: Metaprogramação e Engenharia de Biblioteca em Python
Trilha: TRL-PROG-00 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.4, 2.5 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-06 [Intuição/Prática] (Caps. 22–24); BIB-PROG-07 [Intuição/Prática] (Cap. 9)
Subtemas:
Atributos dinâmicos, propriedades (@property), getattr vs. getattribute e new
Protocolo de Descritores (get, set, set_name): Data Descriptors vs. Non-Data Descriptors e ordem de precedência na busca de atributos
Metaprogramação de classes: decoradores de classe, init_subclass e prepare
Metaclasses: ciclo de vida em tempo de importação vs. tempo de execução e critérios de parcimônia (quando usar init_subclass em vez de metaclasses)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Precedência exata de resolução de atributos em instâncias Python (Data Descriptor > dict da instância > Non-Data Descriptor) e mecanismo de binding de métodos via descritores.
Problema-Marco: Construir um micro-framework declarativo de validação de esquemas/modelos de domínio usando Descritores e init_subclass (com registro automático de campos e validação em tempo de atribuição).
NÍVEL 3: ESTRUTURAS DE DADOS CLÁSSICAS, ALGORITMOS FUNDAMENTAIS E PRÁTICA DE ENTREVISTAS
Macrotema 3.1: Análise Empírica e Assintótica Aplicada
Trilha: TRL-PROG-01 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.5 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:4.1, DOM-MATH:4.3
Modalidades de Prática: [Análise e Demonstração], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-10 [Intuição/Prática] (Cap. 3); BIB-PROG-11 [Intuição/Prática] (Cap. 1.4); BIB-PROG-14 [Intuição/Prática] (Cap. VI)
Subtemas:
Modelo de custo, contagem de operações primitivas e notações assintóticas Big-O, Big-Ω e Big-Θ na prática de engenharia
Análise de espaço auxiliar vs. espaço total e trade-offs tempo-espaço
Análise amortizada intuitiva (expansão geométrica de arrays dinâmicos vs. expansão aritmética)
Metodologia de benchmarking empírico (razão de duplicação / doubling ratio test e regressão log-log)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Por que dobrar a capacidade de um array dinâmico resulta em O(1) amortizado enquanto somar uma constante resulta em O(n), e interpretação do doubling ratio test.
Problema-Marco: Construir uma suíte de benchmark empírico que estima automaticamente a ordem de crescimento de funções fornecidas via razão de duplicação e valida o custo amortizado de redimensionamento dinâmico.
Macrotema 3.2: Ordenação Avançada e Filas de Prioridade
Trilha: TRL-PROG-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.5, 3.1 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:4.5
Modalidades de Prática: [Implementação Algorítmica], [Análise e Demonstração], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-11 [Algorítmica] (Cap. 2); BIB-PROG-10 [Intuição/Prática] (Caps. 9, 12); BIB-PROG-13 [Rigor/Teoria] (Caps. 6–8)
Subtemas:
Mergesort (top-down, bottom-up e otimizações híbridas com Insertion Sort)
Quicksort: particionamento de Lomuto e Hoare, escolha de pivô (aleatorizado, mediana de três), 3-way partitioning (Dijkstra Dutch National Flag) para chaves duplicadas e Quickselect em O(n) esperado
Binary Heaps (min-heap e max-heap), construção em tempo linear O(n) (Floyd's heapify), Heapsort e Filas de Prioridade Indexadas
Limite inferior Ω(n log n) de ordenação por comparação e ordenação em tempo linear sem comparações (Counting Sort, Radix Sort e Bucket Sort)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Prova da construção de heap em O(n), estabilidade do Counting/Radix Sort e prevenção do pior caso O(n²) no Quicksort (incluindo entradas com muitas duplicatas).
Problema-Marco: Implementar uma Fila de Prioridade Indexada (suportando decrease-key em O(log n)), Quickselect e 3-way Quicksort, validando invariantes de heap e estabilidade em casos extremos.
Macrotema 3.3: Tabelas de Símbolos, Árvores Balanceadas, Hashing e Union-Find
Trilha: TRL-PROG-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.4, 3.1, 3.2 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:4.5
Modalidades de Prática: [Implementação Algorítmica], [Análise e Demonstração], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-11 [Algorítmica] (Caps. 1.5, 3); BIB-PROG-10 [Intuição/Prática] (Caps. 8, 10, 11); BIB-PROG-13 [Rigor/Teoria] (Caps. 11–13, 18)
Subtemas:
Árvores Binárias de Busca (BST): operações ordenadas (floor, ceiling, rank, select, remoção de Hibbard) e degeneração para O(n)
Árvores Balanceadas: rotações simples e duplas, Árvores AVL, Árvores 2-3 e Árvores Rubro-Negras (Left-Leaning Red-Black Trees e propriedades de altura negra)
Árvores B e B+: fator de ramificação, minimização de I/O em páginas de disco e uso em índices de bancos de dados
Tabelas Hash: funções de hash, fator de carga, encadeamento separado, endereçamento aberto (sondagem linear, quadrática e double hashing) e rehashing dinâmico
Estruturas de Conjuntos Disjuntos (Union-Find / DSU): Quick-Find, Quick-Union, união por peso/posto e compressão de caminho
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Invariantes de balanceamento da árvore AVL e Rubro-Negra (altura ≤ 2 log₂(n+1)), impacto do fator de carga no hashing e ganho assintótico da compressão de caminho no Union-Find.
Problema-Marco: Implementar do zero uma Árvore Rubro-Negra (ou AVL) com consultas de ordem (rank/select) e um verificador automático de invariantes pós-inserção/remoção, além de um DSU com compressão de caminho.
Macrotema 3.4: Algoritmos Clássicos em Grafos
Trilha: TRL-PROG-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.4, 3.2, 3.3 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:4.4, DOM-MATH:4.5
Modalidades de Prática: [Implementação Algorítmica], [Análise e Demonstração]
Bibliografia e Capítulos: BIB-PROG-11 [Algorítmica] (Cap. 4); BIB-PROG-10 [Intuição/Prática] (Cap. 14); BIB-PROG-09 [Intuição/Prática] (Caps. 6–7); BIB-PROG-12 [Rigor/Teoria] (Caps. 3–4)
Subtemas:
Representações de grafos (lista de adjacência vs. matriz de adjacência) e grafos direcionados/ponderados
Busca em Largura (BFS — menor caminho em grafos não-ponderados, bipartição) e Busca em Profundidade (DFS — classificação de arestas, pontes, vértices de corte e detecção de ciclos)
Grafos Acíclicos Direcionados (DAGs): Ordenação Topológica (Kahn e DFS pós-ordem reversa) e detecção de dependências cíclicas
Componentes Fortemente Conexas (SCC): Algoritmo de Kosaraju-Sharir e Algoritmo de Tarjan
Árvores Geradoras Mínimas (MST): Propriedade do Corte, Algoritmo de Prim (lazy e eager) e Algoritmo de Kruskal (com DSU)
Caminhos Mínimos de Origem Única: Relaxamento de arestas, Dijkstra (pesos não-negativos), caminhos mínimos/críticos em DAGs (tempo linear) e Bellman-Ford (pesos negativos e detecção de ciclos negativos)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Propriedade do Corte para MSTs, por que Dijkstra falha com arestas negativas (contraexemplo) e corretude da ordenação topológica em DAGs.
Problema-Marco: Implementar uma biblioteca completa de grafos com Tarjan (SCC), Kruskal/Prim (MST), Dijkstra com fila indexada e Bellman-Ford com reconstrução de ciclo negativo (aplicado a detecção de arbitragem ou análise de dependências).
Macrotema 3.5: Algoritmos em Strings e Processamento de Texto
Trilha: TRL-PROG-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.2, 3.2, 3.3 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:4.6
Modalidades de Prática: [Implementação Algorítmica], [Análise e Demonstração]
Bibliografia e Capítulos: BIB-PROG-11 [Algorítmica] (Cap. 5); BIB-PROG-10 [Intuição/Prática] (Cap. 13); BIB-PROG-13 [Rigor/Teoria] (Cap. 32)
Subtemas:
Ordenação de strings: Key-Indexed Counting, LSD Radix Sort, MSD Radix Sort e 3-way String Quicksort
Estruturas digitais: R-way Tries e Ternary Search Tries (TST) para prefixos, autocomplete e busca com curingas
Busca de substrings em tempo linear/sublinear: Knuth-Morris-Pratt (KMP — função de prefixo/autômato DFA), Boyer-Moore (heurística de caractere ruim) e Rabin-Karp (rolling hash)
Expressões regulares via construção de Autômato Finito Não-Determinístico (NFA + simulação por alcançabilidade em dígrafo)
Compressão de dados sem perdas: Run-Length Encoding (RLE), Codificação de Huffman e Lempel-Ziv-Welch (LZW)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Complexidade O(n + m) do KMP sem retrocesso no ponteiro de texto, trade-off memória-tempo entre R-way Trie e TST, e otimalidade de prefixo do código de Huffman.
Problema-Marco: Implementar busca de padrões via KMP e Rabin-Karp, um motor de autocomplete com Ternary Search Trie e um compressor/descompressor funcional baseado em Huffman ou LZW.
Macrotema 3.6: Padrões de Resolução de Problemas Algorítmicos (Prática Intensiva)
Trilha: TRL-PROG-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 3.2, 3.3, 3.4, 3.5 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:1.8, DOM-MATH:4.3
Modalidades de Prática: [Implementação Algorítmica], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-14 [Intuição/Prática] (Caps. VII, 1–10); BIB-PROG-15 [Intuição/Prática] (Caps. 4–17); BIB-PROG-09 [Intuição/Prática] (Caps. 8–9)
Subtemas:
Manipulação bit a bit (bitmasks, paridade, isolamento do bit menos significativo, subconjuntos)
Padrões em arrays e strings: Two Pointers, Sliding Window (janela fixa e variável), somas de prefixo e intervalos
Busca binária generalizada sobre espaço de respostas monótono (parametric search)
Backtracking sistemático com poda e invariantes de estado
Programação Dinâmica aplicada: identificação de estado, transição, casos base, memoização top-down vs. tabulação bottom-up e otimização de espaço
Metodologia de resolução sob tempo limitado (45–75 min): exemplos manuais, força bruta, identificação de gargalos (BUD), prova de invariante e teste de mesa com casos extremos
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Reconhecimento de propriedades de monotonicidade para busca binária na resposta e transição de recorrência DP para tabela iterativa com espaço reduzido.
Problema-Marco: Resolver uma bateria cronometrada (60 min) de 3 problemas mistos não-rotulados (envolvendo Sliding Window/Prefix Sum, Busca Binária Paramétrica e Programação Dinâmica 2D) com 100% dos edge cases cobertos.
NÍVEL 4: ARTESANATO DE CÓDIGO, REFATORAÇÃO, PADRÕES DE PROJETO E ARQUITETURA LIMPA
Macrotema 4.1: Código Limpo e Pragmatismo de Engenharia
Trilha: TRL-PROG-02 | Complexidade: 2/5 | Pré-requisitos Diretos: 2.4 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-22 [Intuição/Prática] (Caps. 1–7, 10); BIB-PROG-23 [Intuição/Prática] (Caps. 1–6)
Subtemas:
Nomenclatura reveladora de intenção, funções pequenas de responsabilidade única e níveis consistentes de abstração
Comentários úteis (porquê / decisões de negócio) vs. comentários que mascaram código ruim
Tratamento de erros limpo (exceções com contexto, proibição de retornar/passar null sem contrato, tipos Result/Option)
Ortogonalidade, princípio DRY (conhecimento único, não apenas texto duplicado), reversibilidade e Tracer Bullets
Programação por Contrato (Design by Contract: pré-condições, pós-condições e invariantes), assertivas e princípio "Crash Early"
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Distinção entre DRY de conhecimento vs. duplicação estrutural acidental, Lei de Demeter (Tell, Don't Ask) e pré/pós-condições de contrato.
Problema-Marco: Auditar um módulo legado acoplado (~300 linhas), documentar as violações de ortogonalidade/legibilidade e reescrevê-lo com contratos explícitos e funções coesas.
Macrotema 4.2: Testes Automatizados, TDD e Refatoração Sistemática
Trilha: TRL-PROG-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 4.1 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Depuração e Benchmark], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-24 [Intuição/Prática] (Caps. 1–12); BIB-PROG-22 [Intuição/Prática] (Cap. 9); BIB-PROG-23 [Intuição/Prática] (Cap. 8)
Subtemas:
Ciclo TDD (Red-Green-Refactor), propriedades F.I.R.S.T. de testes unitários e estratégia de test doubles (Dummy, Stub, Spy, Mock, Fake)
Catálogo de Code Smells: funções longas, listas longas de parâmetros, dados globais/mutáveis, obsessão por primitivos, Feature Envy, Divergent Change, Shotgun Surgery e hierarquias paralelas
Mecânica segura de refatoração em pequenos passos verificados por testes (Extract Function/Class, Inline, Encapsulate Collection, Introduce Parameter Object, Replace Conditional with Polymorphism, Split Phase)
Testes baseados em propriedades (Property-Based Testing) e testes de caracterização para código legado
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Diferença entre Divergent Change e Shotgun Surgery, regra de nunca misturar refatoração com mudança de comportamento observável e uso seguro de testes de caracterização.
Problema-Marco: Escrever uma rede de segurança de testes para um módulo com lógica condicional complexa (ex.: motor de precificação/regras de crédito) e aplicar 6 refatorações catalogadas de Fowler preservando 100% dos testes verdes em cada passo.
Macrotema 4.3: Princípios de Design OO (SOLID) e Coesão de Componentes
Trilha: TRL-PROG-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.4, 4.1, 4.2 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:4.4
Modalidades de Prática: [Projeto e Arquitetura], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-26 [Arquitetura/Trade-offs] (Caps. 7–14); BIB-PROG-22 [Intuição/Prática] (Cap. 10)
Subtemas:
Princípio da Responsabilidade Única (SRP — atores e razões para mudar) e Princípio Aberto-Fechado (OCP)
Princípio da Substituição de Liskov (LSP — contratos comportamentais e problema Quadrado/Retângulo)
Princípio da Segregação de Interfaces (ISP) e Princípio da Inversão de Dependência (DIP)
Princípios de Coesão de Componentes: REP (Reuse/Release Equivalence), CCP (Common Closure) e CRP (Common Reuse) — o triângulo de tensão da coesão
Princípios de Acoplamento de Componentes: ADP (Acyclic Dependencies Principle), SDP (Stable Dependencies) e SAP (Stable Abstractions — métricas I, A e distância da sequência principal D)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Definição formal dos 5 princípios SOLID com contraexemplos clássicos de violação e cálculo das métricas de instabilidade (I) e abstração (A) de componentes.
Problema-Marco: Analisar o grafo de dependências de um sistema modular com ciclos, quebrar o ciclo aplicando DIP/novo componente (ADP) e recalcular as métricas I, A e D para remover módulos da Zona de Dor.
Macrotema 4.4: Catálogo Clássico de Padrões de Projeto (GoF)
Trilha: TRL-PROG-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 4.3 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-25 [Arquitetura/Trade-offs] (Caps. 1–5); BIB-PROG-24 [Intuição/Prática] (Caps. 10–12)
Subtemas:
Princípios fundacionais do GoF: programar para interfaces (não implementações) e favorecer composição de objetos sobre herança de classe
Padrões Criacionais: Factory Method, Abstract Factory, Builder, Prototype e Singleton (e trade-offs de estado global/testabilidade)
Padrões Estruturais: Adapter, Bridge, Composite, Decorator, Facade, Flyweight e Proxy
Padrões Comportamentais: Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento, Observer, State, Strategy, Template Method e Visitor
Simplificação de padrões clássicos em linguagens com funções de primeira classe (ex.: Strategy/Command via funções em Python)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Distinção clara entre pares frequentemente confundidos (Strategy vs. State, Adapter vs. Decorator vs. Proxy vs. Facade, Factory Method vs. Abstract Factory).
Problema-Marco: Modelar (UML) e implementar um motor de regras de processamento de documentos/pedidos combinando pelo menos 4 padrões GoF (ex.: State, Strategy, Decorator e Command com Undo/Memento) sem over-engineering.
Macrotema 4.5: Arquitetura Limpa, Fronteiras e Regra da Dependência
Trilha: TRL-PROG-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.3, 4.4 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-26 [Arquitetura/Trade-offs] (Caps. 15–34)
Subtemas:
Regra da Dependência: dependências de código-fonte apontam estritamente das camadas externas (detalhes) para as internas (políticas)
Camadas concêntricas: Entidades (regras corporativas), Casos de Uso (regras de aplicação), Adaptadores de Interface (Controllers, Presenters, Gateways) e Frameworks/Drivers
Fronteiras arquiteturais completas vs. parciais, Ports & Adapters (Arquitetura Hexagonal) e Humble Object Pattern
Banco de dados, Web e Frameworks tratados como detalhes substituíveis; Screaming Architecture
O Componente Main (Composition Root), injeção de dependências manual vs. contêineres e fronteiras de testes (API de testes desacoplada da UI)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Regra da Dependência com inversão de fluxo de controle na fronteira (Input/Output Boundary) e diferença entre modelo de entidade de domínio e DTO de transporte/persistência.
Problema-Marco: Arquitetar e implementar um serviço completo em Arquitetura Limpa/Hexagonal onde o mesmo núcleo de Casos de Uso rode sem alteração tanto com repositório em memória (testes rápidos) quanto com SQLite e CLI/HTTP.
NÍVEL 5: ENGENHARIA DE SOFTWARE, GESTÃO DE SISTEMAS COMPLEXOS E CULTURA DEVOPS
Macrotema 5.1: Processos de Software e Engenharia de Requisitos
Trilha: TRL-PROG-04 | Complexidade: 2/5 | Pré-requisitos Diretos: 4.1 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura]
Bibliografia e Capítulos: BIB-PROG-37 [Arquitetura/Trade-offs] (Caps. 1–4); BIB-PROG-38 [Arquitetura/Trade-offs] (Caps. 1–8)
Subtemas:
Modelos de processo de software: Cascata, Desenvolvimento Incremental, Espiral, Integração e Configuração, e métodos Ágeis (Scrum, XP, Kanban)
Engenharia de Requisitos: elicitação, análise de conflitos, priorização e negociação com stakeholders
Requisitos Funcionais (RF), Requisitos Não-Funcionais mensuráveis (RNF: latência, disponibilidade, segurança, conformidade) e Requisitos de Domínio
Especificação de Requisitos de Software (SRS), critérios de aceite testáveis, validação e matriz de rastreabilidade de requisitos
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Critérios de qualidade de um RNF (mensurabilidade/verificabilidade) e separação entre requisitos de usuário e requisitos de sistema.
Problema-Marco: Redigir um documento SRS completo para um sistema crítico (com RFs, RNFs quantificados, restrições, casos de borda e matriz de rastreabilidade requisito → teste).
Macrotema 5.2: Modelagem de Sistemas, Qualidade, Verificação e Evolução
Trilha: TRL-PROG-04 | Complexidade: 3/5 | Pré-requisitos Diretos: 4.2, 5.1 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-37 [Arquitetura/Trade-offs] (Caps. 5, 8–9, 24–26); BIB-PROG-38 [Arquitetura/Trade-offs] (Caps. 9–10, 15–20)
Subtemas:
Modelagem de sistemas com UML: diagramas de contexto, casos de uso, classes conceituais/lógicas, sequência, atividades e máquinas de estado
Verificação ("construir o produto certo") vs. Validação ("construir o produto corretamente")
Estratégia de testes em pirâmide: unitário, integração, contrato, sistema, aceitação, carga/estresse, particionamento de equivalência e análise de valor limite
Métricas de qualidade de código (complexidade ciclomática de McCabe, acoplamento aferente/eferente) e inspeções formais
Leis de Lehman da Evolução de Software, reengenharia de sistemas legados e gestão estruturada de dívida técnica
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Diferença entre Verificação e Validação, cálculo da complexidade ciclomática V(G) = E - N + 2P e técnica de particionamento de equivalência + valores-limite.
Problema-Marco: Produzir a suíte completa de modelagem (contexto, classes, sequência e máquina de estados) e o plano de V&V (incluindo tabela de partições de equivalência) para um fluxo transacional de negócio.
Macrotema 5.3: Economia da Complexidade e Gestão de Projetos de Software (Brooks)
Trilha: TRL-PROG-04 | Complexidade: 3/5 | Pré-requisitos Diretos: 5.1, 5.2 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:1.8
Modalidades de Prática: [Projeto e Arquitetura]
Bibliografia e Capítulos: BIB-PROG-39 [Arquitetura/Trade-offs] (Caps. 1–19); BIB-PROG-37 [Arquitetura/Trade-offs] (Caps. 22–23)
Subtemas:
A Lei de Brooks e a não-intercambiabilidade entre pessoas e meses em tarefas sequenciais
Crescimento quadrático O(n²) dos canais de comunicação e impacto na coordenação de equipes
Integridade Conceitual como qualidade central no projeto de sistemas e separação entre arquitetura e implementação
O Efeito do Segundo Sistema (Second-System Effect) e o risco de super-arquitetura
"No Silver Bullet": distinção fundamental entre Complexidade Essencial (inerente ao domínio) e Complexidade Acidental (ferramentas/linguagens)
Lei de Conway e alinhamento entre topologia de equipes e arquitetura de sistemas
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Lei de Brooks, complexidade essencial vs. acidental, integridade conceitual e Lei de Conway.
Problema-Marco: Analisar um estudo de caso de projeto atrasado e inchado, diagnosticar fontes de complexidade essencial vs. acidental e propor um plano de corte de escopo e reorganização arquitetural (Inverse Conway Maneuver).
Macrotema 5.4: Os Três Caminhos do DevOps, Fluxo Contínuo e Confiabilidade
Trilha: TRL-PROG-04 | Complexidade: 3/5 | Pré-requisitos Diretos: 4.2, 5.2, 5.3 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-40 [Arquitetura/Trade-offs] (Partes I–VI); BIB-PROG-41 [Intuição/Prática] (Caps. 1–16)
Subtemas:
1º Caminho (Princípios de Fluxo): lotes pequenos, redução de WIP, Value Stream Mapping, Lead Time vs. Processing Time e Teoria das Restrições (gargalos)
Engenharia de entrega contínua: Infraestrutura como Código (IaC), pipelines CI/CD, trunk-based development, feature flags, dark launches, blue-green e canary deployments
2º Caminho (Princípios de Feedback): telemetria em produção (logs estruturados, métricas de negócio/sistema, distributed tracing), alertas acionáveis, revisão por pares e integração de segurança (DevSecOps / shift-left)
3º Caminho (Aprendizado Contínuo): blameless postmortems, injeção controlada de falhas (Chaos Engineering / Game Days) e disseminação institucional de aprendizado
Os Cinco Ideais de Gene Kim (Localidade e Simplicidade; Foco, Fluxo e Alegria; Melhoria do Trabalho Diário; Segurança Psicológica; Foco no Cliente) e métricas DORA
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Os Três Caminhos do DevOps, as 4 métricas DORA (Deployment Frequency, Lead Time for Changes, Change Failure Rate, MTTR) e separação entre deploy (técnico) e release (negócio).
Problema-Marco: Projetar o pipeline CI/CD completo, a estratégia de deployment canary com rollback automático, os SLIs/SLOs de observabilidade e o template de postmortem sem culpa para um serviço de produção.
NÍVEL 6: MODELAGEM ESTRATÉGICA E TÁTICA COM DOMAIN-DRIVEN DESIGN E DESIGN DE APIS
Macrotema 6.1: DDD Estratégico — Domínios, Linguagem Ubíqua e Contextos Delimitados
Trilha: TRL-PROG-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.5, 5.1 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura]
Bibliografia e Capítulos: BIB-PROG-27 [Arquitetura/Trade-offs] (Partes I, IV); BIB-PROG-28 [Arquitetura/Trade-offs] (Caps. 1–4)
Subtemas:
Classificação estratégica de subdomínios: Core Domain (vantagem competitiva), Supporting Subdomain e Generic Subdomain
Linguagem Ubíqua: construção colaborativa entre especialistas de domínio e engenheiros refletida diretamente no código
Contextos Delimitados (Bounded Contexts): fronteiras semânticas onde um modelo tem significado preciso e unívoco
Mapeamento de Contextos (Context Mapping) e padrões de relacionamento: Partnership, Shared Kernel, Customer-Supplier, Conformist, Anti-Corruption Layer (ACL), Open Host Service (OHS), Published Language e Separate Ways
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Diferença entre Subdomínio (espaço do problema) e Bounded Context (espaço da solução), e quando aplicar Anti-Corruption Layer vs. Conformist.
Problema-Marco: Mapear um domínio corporativo complexo (ex.: plataforma de crédito/securitização ou plataforma educacional multi-área) classificando Core/Supporting/Generic Subdomains e desenhando o Context Map completo com relações upstream/downstream.
Macrotema 6.2: DDD Tático — Blocos de Construção, Agregados e Invariantes
Trilha: TRL-PROG-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.5, 6.1 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-27 [Arquitetura/Trade-offs] (Partes II–III); BIB-PROG-28 [Arquitetura/Trade-offs] (Caps. 5–12)
Subtemas:
Entidades (identidade contínua e ciclo de vida) vs. Objetos de Valor (Value Objects imutáveis, auto-validáveis e comparados por atributos)
Serviços de Domínio (operações sem estado que não pertencem naturally a uma única entidade) e Módulos
Projeto rigoroso de Agregados (as 4 regras de Vaughn Vernon): proteger invariantes reais de negócio dentro de fronteiras transacionais, projetar agregados pequenos, referenciar outros agregados apenas por ID e usar consistência eventual entre agregados
Fábricas (Factories), Repositórios (abstração de coleção orientada a agregados) e Especificações (Specification Pattern)
Eventos de Domínio (Domain Events): fatos passados imutáveis capturando mudanças relevantes do domínio
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: As 4 regras de design de Agregados de Vernon, proteção de invariantes atômicas vs. consistência eventual e combate ao Modelo de Domínio Anêmico.
Problema-Marco: Modelar e implementar um Core Domain rico com Value Objects imutáveis, um Agregado que garanta invariantes financeiras/transacionais estritas, Domain Events e Repositório desacoplado sem vazar ORM para o domínio.
Macrotema 6.3: Integração de Contextos, CQRS e Event Sourcing no DDD
Trilha: TRL-PROG-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 6.1, 6.2 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-28 [Arquitetura/Trade-offs] (Caps. 4, 8, 13–14, Apêndice A)
Subtemas:
Integração entre Bounded Contexts: REST/RPC síncrono vs. mensageria assíncrona baseada em Domain Events e padrão Outbox
CQRS (Command Query Responsibility Segregation): separação entre modelo transacional de escrita e modelos otimizados de leitura (projeções)
Event Sourcing: estado reconstruído por replay de stream de eventos imutáveis, snapshots de agregado, versionamento de eventos e controle de concorrência otimista
Process Managers e Sagas orientadas a eventos para processos de negócio de longa duração entre múltiplos agregados
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Problema do dual-write (resolvido pelo Transactional Outbox), controle de concorrência otimista por versão de stream no Event Sourcing e quando NÃO usar CQRS/Event Sourcing.
Problema-Marco: Implementar um agregado Event-Sourced (ex.: conta/ledger ou fluxo de aprovação) com controle de concorrência otimista, projeção de leitura CQRS separada e teste de replay de eventos.
Macrotema 6.4: Padrões para Design de APIs
Trilha: TRL-PROG-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 4.5, 6.1 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-29 [Arquitetura/Trade-offs] (Caps. 1–10)
Subtemas:
Fundamentos de APIs remotas: estilos (REST/HTTP, gRPC, GraphQL, mensageria) e papéis de endpoint (Processing Resource, Information Holder, Collection Resource, Operational Data Holder)
Estruturação e representação de mensagens: Atomic Parameter, Parameter Tree, Pagination (offset vs. cursor/keyset), Wish List, Wish Template, Request Bundle e Context Representation
Qualidade, confiabilidade e governança: Idempotency Key, Rate Limit, Conditional Request (ETag), API Key, Service Level Agreement (SLA) e Pricing Plans
Evolução de APIs sem quebra de clientes: Version Identifier, Semantic Versioning, Two in Production, Aggressive Obsolescence, Limited Lifetime Guarantee e Experimental Preview
Erros padronizados (Problem Details / RFC 9457), documentação como contrato (OpenAPI / Protobuf) e governança de contratos
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Trade-offs entre paginação por offset vs. cursor sob mutações concorrentes, garantia de idempotência em endpoints de escrita e política de ciclo de vida de versões.
Problema-Marco: Especificar (em OpenAPI ou Protobuf) e implementar uma API de produção contendo paginação por cursor, Idempotency-Key para retentativas seguras, controle de concorrência via ETag, Rate Limiting e respostas de erro padronizadas.
NÍVEL 7: PROJETO E ANÁLISE AVANÇADA DE ALGORITMOS E TEORIA DA COMPLEXIDADE
Macrotema 7.1: Fundamentos Matemáticos da Análise de Algoritmos e Algoritmos Randomizados
Trilha: TRL-PROG-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.1, 3.2 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:2.7, DOM-MATH:4.1, DOM-MATH:4.3, DOM-MATH:7.5
Modalidades de Prática: [Análise e Demonstração], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-13 [Rigor/Teoria] (Caps. 2–5, 7); BIB-PROG-12 [Rigor/Teoria] (Caps. 0, 2)
Subtemas:
Provas rigorosas de corretude por Invariantes de Laço (inicialização, manutenção e terminação)
Resolução de recorrências de divisão e conquista: método da substituição (indução), árvore de recursão e os 3 casos do Teorema Mestre (e generalização de Akra-Bazzi)
Multiplicação rápida de matrizes (Algoritmo de Strassen em O(n^{log₂ 7})) e multiplicação de inteiros de Karatsuba
Análise probabilística e variáveis aleatórias indicadoras (Problema da Contratação)
Algoritmos randomizados Las Vegas vs. Monte Carlo: Randomized Quicksort, Seleção em tempo linear garantido no pior caso (Mediana das Medianas — BFPRT) e Corte Mínimo de Karger
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Distinção entre algoritmos Las Vegas (sempre corretos, tempo esperado) e Monte Carlo (tempo fixo, erro limitado), prova do tempo esperado O(n log n) do Randomized Quicksort via variáveis indicadoras e os 3 casos do Teorema Mestre.
Problema-Marco: Provar rigorosamente a corretude por invariante e a complexidade de tempo do Randomized Select e implementar o algoritmo determinístico de Mediana das Medianas (BFPRT) com benchmark comparativo.
Macrotema 7.2: Análise Amortizada e Estruturas de Dados Avançadas
Trilha: TRL-PROG-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.3, 7.1 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:8.1
Modalidades de Prática: [Análise e Demonstração], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-13 [Rigor/Teoria] (Caps. 14, 17, 19–21); BIB-PROG-10 [Intuição/Prática] (Cap. 10.4)
Subtemas:
Os três métodos formais de Análise Amortizada: Método Agregado, Método Contábil (créditos) e Método do Potencial (Φ(D_i) ≥ Φ(D_0))
Aumento de Estruturas de Dados (Augmenting Data Structures): Order-Statistic Trees e Interval Trees (manutenção de atributos em rotações O(log n))
Heaps avançados: Binomial Heaps e Fibonacci Heaps (operações insert/merge/decrease-key em O(1) amortizado)
Estruturas especializadas: Skip Lists (análise probabilística), Van Emde Boas Trees (operações em O(log log u) para universo inteiro) e Fenwick Trees / Segment Trees
Análise amortizada rigorosa de Conjuntos Disjuntos (Union-Find) resultando em O(m α(n)) via inversa da função de Ackermann
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Definição da função potencial Φ(D) na análise amortizada (ĉ_i = c_i + Φ(D_i) - Φ(D_{i-1})), teorema de aumento de Árvores Rubro-Negras e por que Fibonacci Heaps reduzem Dijkstra para O(E + V log V).
Problema-Marco: Provar pelo Método do Potencial o custo amortizado O(1) de inserção e deleção em tabela dinâmica (com expansão em 100% e contração em 25%) e implementar uma Interval Tree ou Segment Tree com lazy propagation.
Macrotema 7.3: Programação Dinâmica Avançada e Teoria de Algoritmos Gulosos
Trilha: TRL-PROG-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.6, 7.1 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:4.3
Modalidades de Prática: [Análise e Demonstração], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-13 [Rigor/Teoria] (Caps. 15–16); BIB-PROG-12 [Rigor/Teoria] (Caps. 5–6)
Subtemas:
Caracterização formal de Programação Dinâmica: subestrutura ótima (prova por cut-and-paste), superposição de subproblemas e DAG de subproblemas
Problemas clássicos e reconstrução de solução ótima: Corte de Hastes, Multiplicação em Cadeia de Matrizes, Maior Subsequência Comum (LCS), Distância de Edição (Levenshtein), Árvores Binárias de Busca Ótimas, Mochila 0/1 (complexidade pseudo-polinomial O(nW)) e DP em árvores/bitmasks (TSP de Held-Karp)
Propriedade da Escolha Gulosa e provas formais de otimalidade via Argumento de Troca (Exchange Argument) e "Guloso Fica à Frente" (Greedy Stays Ahead)
Seleção de Atividades, Mochila Fracionária, Codificação de Huffman e fundamentação algébrica em Matroides (caracterização de quando o algoritmo guloso é ótimo)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Prova por cut-and-paste da subestrutura ótima, prova por argumento de troca da escolha gulosa, por que a Mochila 0/1 é pseudo-polinomial e axiomas de um Matroide.
Problema-Marco: Formular, provar a subestrutura ótima e implementar a Multiplicação em Cadeia de Matrizes e a Árvore Binária de Busca Ótima com reconstrução explícita da árvore ótima.
Macrotema 7.4: Algoritmos Avançados em Grafos e Fluxo em Redes
Trilha: TRL-PROG-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 3.4, 7.2, 7.3 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:4.4
Modalidades de Prática: [Análise e Demonstração], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-13 [Rigor/Teoria] (Caps. 22–26); BIB-PROG-12 [Rigor/Teoria] (Cap. 7.2–7.3)
Subtemas:
Caminhos mínimos entre todos os pares (APSP): Floyd-Warshall, fechamento transitivo, multiplicação de matrizes em semi-anel tropical (min, +) e Algoritmo de Johnson (reponderação via Bellman-Ford + Dijkstra para grafos esparsos)
Redes de Fluxo: capacidades, conservação de fluxo, rede residual, caminhos aumentantes e cortes (s, t)
Teorema do Fluxo Máximo e Corte Mínimo (Max-Flow Min-Cut Theorem)
Algoritmos de Fluxo Máximo: Método de Ford-Fulkerson (e patologia com capacidades irracionais/grandes), Edmonds-Karp em O(VE²), Dinic em O(V²E) e algoritmos Push-Relabel (pré-fluxo)
Reduções a Fluxo Máximo: Emparelhamento Máximo em Grafos Bipartidos (Teorema de König/Hall), caminhos aresta/vértice-disjuntos (Teorema de Menger), escalonamento com restrições e circulação com demandas
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Demonstração do Teorema Max-Flow Min-Cut, prova da complexidade O(VE²) de Edmonds-Karp (monotonicidade da distância na rede residual) e redução de emparelhamento bipartido a fluxo máximo.
Problema-Marco: Implementar os algoritmos de Edmonds-Karp (ou Dinic) e Johnson (APSP), e modelar um problema real de alocação/empacotamento com restrições via redução para Fluxo Máximo e extração do Corte Mínimo.
Macrotema 7.5: Programação Linear, FFT e Algoritmos Numéricos/Geométricos
Trilha: TRL-PROG-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 7.1, 7.3, 7.4 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:1.9, DOM-MATH:3.4, DOM-MATH:4.2
Modalidades de Prática: [Análise e Demonstração], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-13 [Rigor/Teoria] (Caps. 29–31, 33); BIB-PROG-12 [Rigor/Teoria] (Caps. 1, 2.6, 7)
Subtemas:
Programação Linear (LP): forma padrão e forma de folga, interpretação geométrica em politopos convexos, Algoritmo Simplex (pivoteamento, degenerescência, regra de Bland e fase inicial de viabilidade)
Dualidade em Programação Linear (Teorema da Dualidade Fraca e Forte) e formulação de Fluxo Máximo e Jogos de Soma Zero como LPs
Polinômios e Transformada Rápida de Fourier (FFT): representação por coeficientes vs. pontos-valor, raízes complexas n-ésimas da unidade, algoritmo Cooley-Tukey em O(n log n) e FFT inversa para convolução rápida
Teoria dos Números Algorítmica: aritmética modular, Euclides Estendido, Teorema Chinês dos Restos, exponenciação modular, RSA e teste de primalidade de Miller-Rabin
Geometria Computacional: orientação de segmentos via produto vetorial, interseção de múltiplos segmentos por Linha de Varredura (Sweep Line), Fecho Convexo (Graham Scan em O(n log n) e Jarvis March) e Par de Pontos Mais Próximos em O(n log n)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Dualidade em LP (como dual do Fluxo Máximo gera o Corte Mínimo), redução de O(n²) para O(n log n) na multiplicação polinomial via FFT e invariante geométrico do Graham Scan.
Problema-Marco: Implementar a FFT recursiva/iterativa (Cooley-Tukey) para convolução exata de grandes polinômios e o algoritmo Graham Scan para cálculo de Fecho Convexo com tratamento de pontos colineares.
Macrotema 7.6: NP-Completude, Algoritmos de Aproximação e Algoritmos Paralelos
Trilha: TRL-PROG-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 7.3, 7.4, 7.5 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:2.2, DOM-MATH:4.1, DOM-MATH:4.6
Modalidades de Prática: [Análise e Demonstração], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-13 [Rigor/Teoria] (Caps. 27, 34–35); BIB-PROG-12 [Rigor/Teoria] (Caps. 8–9)
Subtemas:
Problemas de decisão vs. otimização, codificações polinomiais, classes P, NP, co-NP, NP-Difícil e NP-Completo
Reduções em tempo polinomial (A ≤_p B): estrutura de prova de NP-Completude (pertencimento a NP + redução de problema NP-Completo conhecido)
Cadeia clássica de reduções a partir do Teorema de Cook-Levin: CIRCUIT-SAT → SAT → 3-SAT → CLIQUE → VERTEX-COVER → HAM-CYCLE → TSP e SUBSET-SUM
Algoritmos de Aproximação com razão garantida ρ(n): 2-aproximação para Vertex Cover, 2-aproximação para TSP Métrico (via MST + desigualdade triangular), aproximação O(ln n) gulosa para Set Cover, aproximação randomizada para MAX-3-SAT e Esquema de Aproximação Totalmente Polinomial (FPTAS) para Subset Sum
Busca local (2-opt), Branch-and-Bound e fundamentos de algoritmos multithreaded paralelos (DAG de tarefas, Work T₁, Span T_∞, Lei de Brent e paralelismo médio)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Direção correta da redução polinomial (reduzir problema CONHECIDO NP-C para o NOVO problema), por que o TSP geral não admite aproximação com razão constante (a menos que P = NP) vs. TSP Métrico, e cotas de escalonamento paralelo (T_P ≥ max(T₁/P, T_∞)).
Problema-Marco: Redigir provas completas de redução polinomial (ex.: 3-SAT → Independent Set / Vertex Cover) e implementar uma 2-aproximação para TSP Métrico comparada a um solver exato por Branch-and-Bound em instâncias pequenas.
NÍVEL 8: ARQUITETURA DE SOFTWARE MODERNA, SISTEMAS DISTRIBUÍDOS E DADOS EM ESCALA
Macrotema 8.1: Pensamento Arquitetural, Características de Arquitetura e Fitness Functions
Trilha: TRL-PROG-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.5, 5.2, 6.1 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-30 [Arquitetura/Trade-offs] (Caps. 1–8, 19–22)
Subtemas:
As duas leis da arquitetura de software (tudo em arquitetura é trade-off; o "porquê" é mais importante que o "como")
Dimensões da arquitetura: estrutura, características arquiteturais ("ilities"), decisões arquiteturais e princípios de design
Modularidade e métricas estruturais: coesão (LCOM), acoplamento aferente/eferente, instabilidade, abstração, distância da sequência principal e Connascence (estática vs. dinâmica)
Extração de Características Arquiteturais a partir de requisitos de domínio (escalabilidade, elasticidade, disponibilidade, tolerância a falhas, auditabilidade, segurança, testabilidade)
Architectural Fitness Functions (atômicas/holísticas, acionadas/contínuas) para governança automatizada da arquitetura
Architecture Decision Records (ADRs), diagramas arquiteturais (C4 Model) e análise de riscos arquiteturais
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Escala de severidade da Connascence (Nome → Tipo → Significado → Posição → Algoritmo → Execução → Tempo → Valor → Identidade), definição de Fitness Function e estrutura de um ADR.
Problema-Marco: Selecionar as 5 principais Características Arquiteturais de uma plataforma crítica, redigir 3 ADRs formais com trade-offs explícitos e implementar 2 Fitness Functions automatizadas em CI (ex.: bloqueio de ciclos entre pacotes e validação de camadas).
Macrotema 8.2: Estilos Arquiteturais (Monolíticos e Distribuídos)
Trilha: TRL-PROG-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 6.4, 8.1 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura]
Bibliografia e Capítulos: BIB-PROG-30 [Arquitetura/Trade-offs] (Caps. 9–18)
Subtemas:
As 8 Falácias da Computação Distribuída (rede confiável, latência zero, largura de banda infinita, rede segura, topologia imutável, etc.)
Quanta Arquiteturais (Architectural Quantum): unidade de deploy independente, alta coesão funcional e connascence síncrona
Estilos Monolíticos: Arquitetura em Camadas (Layered — camadas abertas vs. fechadas e anti-padrão Architecture Sinkhole), Pipeline (Pipes & Filters) e Microkernel (Plug-in Architecture)
Estilos Distribuídos: Arquitetura Baseada em Serviços (Service-Based), Arquitetura Orientada a Eventos (Topologia Broker vs. Topologia Mediador, eventos vs. comandos), Arquitetura Baseada em Espaço (Space-Based — processing units e data grids), Arquitetura Orquestrada Orientada a Serviços (SOA) e Microsserviços
Matriz comparativa de trade-offs entre estilos segundo características arquiteturais (custo, simplicidade, elasticidade, tolerância a falhas e evolução)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Definição rigorosa de Architectural Quantum, as 8 Falácias da Computação Distribuída e comparação estrutural entre Monólito Modular, Service-Based, Event-Driven e Microsserviços.
Problema-Marco: Dado um cenário com restrições reais de orçamento, equipe e SLA, comparar 3 estilos arquiteturais candidatos usando uma matriz ponderada de trade-offs e justificar formalmente o estilo escolhido (evitando microsserviços prematuros quando injustificados).
Macrotema 8.3: Decomposição, Granularidade, Sagas e As Partes Difíceis da Arquitetura
Trilha: TRL-PROG-03 | Complexidade: 5/5 | Pré-requisitos Diretos: 6.2, 6.3, 8.2 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura]
Bibliografia e Capítulos: BIB-PROG-31 [Arquitetura/Trade-offs] (Caps. 1–15)
Subtemas:
Decomposição tática de monólitos: Component-Based Decomposition vs. Tactical Forking, Strangler Fig Pattern e Branch by Abstraction
Desintegradores de Granularidade (escopo/função, volatilidade de código, escalabilidade, tolerância a falhas, segurança, extensibilidade) vs. Integradores de Granularidade (transações de banco, coreografia de workflow, código compartilhado, relacionamentos de dados)
Decomposição de bancos de dados: propriedade de tabelas, chaves estrangeiras cross-service, acesso a dados compartilhados (serviço inter-serviço, replicação em cache, banco replicado, Data Domain)
Reutilização de código distribuído: duplicação, bibliotecas compartilhadas, serviços compartilhados e Sidecars
Padrões de comunicação e Transações Distribuídas: análise das 8 combinações de Sagas (Síncrona/Assíncrona × Atômica/Eventual × Orquestrada/Coreografada) e ações compensatórias
Contratos distribuídos (strict vs. loose, Consumer-Driven Contracts) e propriedade de dados analíticos (Data Warehouse, Data Lake vs. Data Mesh)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Equilíbrio entre Integradores e Desintegradores de granularidade, trade-offs dos 8 tipos de Saga (especialmente compensação de falhas parciais e falta de isolamento — ACD sem I) e os 4 princípios do Data Mesh.
Problema-Marco: Projetar o plano completo de extração de um módulo crítico de um monólito com banco compartilhado, incluindo decomposição do schema de dados, definição de contratos e desenho de uma Saga com transações compensatórias e estados de erro.
Macrotema 8.4: Microsserviços em Produção e Padrões de Sistemas Distribuídos
Trilha: TRL-PROG-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 5.4, 6.4, 8.3 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:7.5
Modalidades de Prática: [Projeto e Arquitetura], [Implementação Algorítmica], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-32 [Arquitetura/Trade-offs] (Caps. 1–16); BIB-PROG-33 [Arquitetura/Trade-offs] (Partes I–IV)
Subtemas:
Padrões de nó único em sistemas distribuídos (Burns): Sidecar, Ambassador e Adapter
Padrões de serviço distribuído: Replicated Load-Balanced Services (stateless, caches de borda, health checks), Sharded Services (consistência de roteamento), Scatter/Gather, Funções/Event-Driven e Eleição de Líder / Locks Distribuídos
Padrões de processamento em lote distribuído: Work Queue Systems e Coordinated Batch Processing (Join/Reduce)
Resiliência em rede instável: Timeouts calibrados, Retries com Exponential Backoff + Full Jitter, Circuit Breakers, Bulkheads, Load Shedding e Graceful Degradation
Interfaces de borda (API Gateway, Backend for Frontend — BFF), Service Discovery, Service Mesh, segurança Zero-Trust (mTLS, OAuth2/OIDC/JWT) e Observabilidade Distribuída (Correlation IDs, OpenTelemetry, métricas RED/USE)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Prevenção de Retry Storms via Exponential Backoff com Jitter, funcionamento da máquina de estados de um Circuit Breaker (Closed/Open/Half-Open) e distinção entre Sidecar, Ambassador e Adapter.
Problema-Marco: Implementar um cliente RPC/HTTP resiliente (com timeout, retry com jitter, circuit breaker e bulkhead) e validar seu comportamento sob injeção artificial de latência e falhas parciais.
Macrotema 8.5: Fundamentos de Sistemas de Dados — Storage Engines e Encoding (DDIA Parte I)
Trilha: TRL-PROG-03 | Complexidade: 5/5 | Pré-requisitos Diretos: 3.3, 8.2 | Pré-requisitos Cruzados (DOM-MATH): Nenhum
Modalidades de Prática: [Projeto e Arquitetura], [Implementação Algorítmica], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-34 [Rigor/Teoria] (Parte I: Caps. 1–4)
Subtemas:
Pilares de sistemas intensivos em dados: Confiabilidade (falhas de hardware, software e humanas), Escalabilidade (parâmetros de carga, percentis de latência p50/p95/p99 e tail latency amplification) e Manutenibilidade
Modelos de dados e linguagens de consulta: Relacional vs. Documentos (localidade de dados, joins e schema-on-read vs. schema-on-write) vs. Grafos (Property Graphs, Triple-Stores, Cypher/SPARQL/Datalog)
Motores de armazenamento internos (OLTP): Append-only Logs com índices hash, SSTables e LSM-Trees (Memtable, WAL, Bloom Filters, Size-Tiered vs. Leveled Compaction) vs. B-Trees (páginas fixas, divisão de páginas, Write-Ahead Log e latches)
Armazenamento Analítico (OLAP): Star/Snowflake Schemas, armazenamento orientado a colunas (Column-Oriented Storage), compressão por bitmap/RLE, ordenação em disco e projeções/cubos materializados
Encoding e Evolução de Schemas: compatibilidade forward e backward, JSON/XML/MessagePack vs. formatos binários guiados por schema (Protocol Buffers, Thrift e Apache Avro) e fluxo de dados via banco, serviços e mensageria
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Trade-offs de Write Amplification, Read Amplification e Space Amplification entre LSM-Trees e B-Trees, impacto da amplificação de latência de cauda (p99) e regras de compatibilidade backward/forward em Protobuf/Avro.
Problema-Marco: Implementar um mini motor de armazenamento Key-Value persistente baseado em LSM-Tree (com WAL, Memtable ordenada, flush para SSTable imutável em disco, Bloom Filter e compactação de segmentos).
Macrotema 8.6: Dados Distribuídos — Replicação, Particionamento e Transações (DDIA Parte II)
Trilha: TRL-PROG-03 | Complexidade: 5/5 | Pré-requisitos Diretos: 8.4, 8.5 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:4.4, DOM-MATH:7.5
Modalidades de Prática: [Projeto e Arquitetura], [Análise e Demonstração]
Bibliografia e Capítulos: BIB-PROG-34 [Rigor/Teoria] (Parte II: Caps. 5–7)
Subtemas:
Replicação Single-Leader: replicação síncrona vs. assíncrona, failover e split-brain, replication lag e garantias de consistência de leitura (Read-Your-Writes, Monotonic Reads, Consistent Prefix Reads)
Replicação Multi-Leader (conflitos de escrita, Last Write Wins vs. CRDTs/merge) e Replicação Leaderless estilo Dynamo (Quóruns w + r > n, sloppy quorums, hinted handoff, read repair, anti-entropy via Merkle Trees e Version Vectors)
Particionamento (Sharding): particionamento por faixa de chaves vs. hash de chaves (Consistent Hashing), mitigação de hot spots, índices secundários particionados por documento (local) vs. por termo (global), rebalanceamento (partições fixas vs. dinâmicas) e roteamento de requisições
Transações ACID e Níveis Fracos de Isolamento: Read Committed (dirty reads/dirty writes), Snapshot Isolation / MVCC (evitando read skew), prevenção de Lost Updates (operações atômicas, SELECT FOR UPDATE, CAS) e anomalia de Write Skew e Phantoms
Isolamento Serializável (Serializability): Execução Serial Real (single-threaded / stored procedures), Two-Phase Locking (2PL + Predicate/Index-Range Locks) e Serializable Snapshot Isolation (SSI — detecção otimista de ciclos de dependência)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Por que quóruns w + r > n ainda podem retornar leituras obsoletas sem linearizabilidade, construção de um cenário concreto de Write Skew que ocorre sob Snapshot Isolation e comparação entre 2PL e SSI.
Problema-Marco: Projetar e simular (ou reproduzir em PostgreSQL/SQLite) anomalias de concorrência (Lost Update e Write Skew), demonstrando a diferença prática entre Read Committed, Snapshot Isolation (REPEATABLE READ) e SERIALIZABLE (SSI), e implementar um anel de Consistent Hashing com nós virtuais.
Macrotema 8.7: Consenso, Relógios, Falhas Parciais e Processamento em Lote e Fluxo (DDIA Partes II e III)
Trilha: TRL-PROG-03 | Complexidade: 5/5 | Pré-requisitos Diretos: 8.6 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:2.5, DOM-MATH:4.4
Modalidades de Prática: [Projeto e Arquitetura], [Análise e Demonstração], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-34 [Rigor/Teoria] (Partes II e III: Caps. 8–12)
Subtemas:
Os perigos de sistemas distribuídos: falhas parciais não-determinísticas, redes assíncronas, pauses de processo (GC pauses), relógios físicos (time-of-day vs. monotonic, drift NTP) e Fencing Tokens para segurança de locks distribuídos
Modelos de sistema (síncrono, parcialmente síncrono, assíncrono), falhas crash-stop/crash-recovery vs. falhas Bizantinas, propriedades de Safety vs. Liveness
Consistência e Consenso: Linearizabilidade (semântica e custo — Teorema CAP e PACELC), ordenação causal vs. ordenação total, Relógios de Lamport, Total Order Broadcast, Two-Phase Commit (2PC — problema de bloqueio do coordenador) e Algoritmos de Consenso tolerantes a falhas (Paxos, Raft, Zab)
Processamento em Lote (Batch Processing): filosofia Unix, MapReduce, joins distribuídos (Sort-Merge, Broadcast Hash, Partitioned Hash), tratamento de skew e motores de Dataflow (Spark, Flink)
Processamento de Fluxos (Stream Processing): Logs particionados append-only (Kafka), Change Data Capture (CDC), Event Sourcing, raciocínio sobre tempo (Event Time vs. Processing Time, janelas tumbling/hopping/sliding/session, watermarks), joins de streams, tolerância a falhas (checkpointing / idempotência / exactly-once semantics) e arquitetura de dados derivados (Unbundling Databases)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Por que um lock distribuído sem Fencing Token falha sob pausas de GC, distinção formal entre Linearizabilidade (recência em único registro) e Serializabilidade (isolamento multi-objeto), equivalência entre Total Order Broadcast e Consenso, e diferença entre Event Time e Processing Time.
Problema-Marco: Implementar um protótipo simplificado de eleição de líder e replicação de log do protocolo Raft (ou simulador de Relógios de Lamport + Fencing Tokens) e desenhar uma arquitetura de dados derivados combinando CDC, Kafka e projeções idempotentes.
Macrotema 8.8: Engenharia de Sistemas em Grande Escala (System Design Prático)
Trilha: TRL-PROG-03 | Complexidade: 5/5 | Pré-requisitos Diretos: 6.4, 8.4, 8.6, 8.7 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:1.4, DOM-MATH:7.5, DOM-MATH:7.7
Modalidades de Prática: [Projeto e Arquitetura], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-35 [Arquitetura/Trade-offs] (Caps. 1–16); BIB-PROG-36 [Arquitetura/Trade-offs] (Caps. 1–13)
Subtemas:
Metodologia estruturada de System Design: clarificação de escopo e RNFs, estimativas back-of-the-envelope (QPS, banda, armazenamento, memória de cache), design de alto nível, aprofundamento em gargalos e encerramento
Blocos de construção em escala: Rate Limiter distribuído (Token Bucket, Sliding Window), Consistent Hashing, Key-Value Store distribuído, Gerador de IDs Únicos (Snowflake), Encurtador de URL e Web Crawler
Sistemas de comunicação, conteúdo e busca: Sistema de Notificações, News Feed (fan-out on write vs. read), Chat em Tempo Real (WebSockets + presença), Search Autocomplete (Trie distribuída), Armazenamento em Nuvem (Google Drive / sync de blocos) e YouTube/Streaming
Sistemas espaciais, analíticos e financeiros (Vol. 2): Serviços de Proximidade e Geolocalização (Geohash, Quadtree, Google S2), Google Maps, Distributed Message Queue, Metrics Monitoring & Alerting, Ad Click Event Aggregation, Sistema de Reservas de Hotel (controle de overbooking), Distributed Email, S3-like Object Storage, Real-Time Gaming Leaderboard, Sistema de Pagamentos, Carteira Digital (Digital Wallet / Ledger de partidas dobradas) e Bolsa de Valores (Stock Exchange / Matching Engine)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Cálculos rápidos de capacidade (potências de 2 e latências típicas de memória/SSD/rede), fan-out híbrido para celebridades, indexação espacial (Geohash vs. Quadtree) e garantias de reconciliação/idempotência em sistemas de pagamento.
Problema-Marco: Conduzir dois estudos completos de System Design cronometrados (60–75 min cada) — um focado em consistência financeira (Sistema de Pagamentos + Ledger) e outro em alta vazão espacial/tempo real (Serviço de Proximidade ou Fila Distribuída) — entregando estimativas, API, schema de dados, diagrama de componentes e análise de falhas.
NÍVEL 9: ANÁLISE MATEMÁTICA DE ALGORITMOS E COMPUTAÇÃO COMBINATÓRIA AVANÇADA
Macrotema 9.1: Análise Matemática Exata de Algoritmos (Sedgewick & Flajolet)
Trilha: TRL-PROG-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 7.1, 7.2 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:8.1, DOM-MATH:8.4, DOM-MATH:8.5, DOM-MATH:8.6, DOM-MATH:8.7
Modalidades de Prática: [Análise e Demonstração], [Implementação Algorítmica]
Bibliografia e Capítulos: BIB-PROG-16 [Rigor/Teoria] (Caps. 1–9)
Subtemas:
Ponte direta entre código executável, equações de recorrência exatas e Funções Geradoras Ordinárias (OGFs) e Exponenciais (EGFs)
Análise exata de caso médio (esperança e variância) de algoritmos clássicos: Quicksort (2(n+1)H_n - 4n), Quickselect, Mergesort e Árvores Binárias de Busca aleatórias
Expansões assintóticas aplicadas à análise de algoritmos (Fórmula de Euler-Maclaurin, aproximação de Laplace e análise de singularidades)
Análise combinatória de estruturas computacionais: permutações (ciclos, inversões, registros), árvores (planas, binárias, Cayley — comprimento de caminho), strings/palavras (autômatos, busca em Tries e Patricia Tries) e mapeamentos funcionais (algoritmo rho de Pollard e análise exata de Hashing)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Derivação do número médio exato de comparações do Quicksort via recorrência e função geradora, comprimento médio de caminho interno em BST aleatória (~2n ln n) e análise de colisão/sondagem em Hashing via mapeamentos.
Problema-Marco: Analisar matematicamente a recorrência exata do custo médio de busca bem-sucedida e mal-sucedida em uma BST aleatória ou Quicksort com mediana de três, e validar a fórmula assintótica obtida contra simulações empíricas de 10⁵ execuções.
Macrotema 9.2: Engenharia de Estruturas de Dados de Baixo Nível e Memória (TAOCP Vol. 1)
Trilha: TRL-PROG-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 1.2, 3.3, 7.2 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:8.8
Modalidades de Prática: [Implementação Algorítmica], [Análise e Demonstração], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-17 [Algorítmica] (Caps. 1.3–1.4, 2)
Subtemas:
Arquitetura de máquina abstrata (MIX/MMIX), sub-rotinas, corrotinas e simulação discreta orientada a eventos
Estruturas lineares em baixo nível: pilhas múltiplas compartilhando espaço contíguo (algoritmo de realocação de Garwick), listas circulares e matrizes esparsas com listas ortogonais
Representações avançadas de árvores: árvores binárias com fios (Threaded Binary Trees para travessia sem pilha), correspondência árvore geral ↔ árvore binária e árvores de expressões simbólicas (diferenciação simbólica)
Gerenciamento dinâmico de memória (Dynamic Storage Allocation): listas livres, Boundary Tags (coalescência em O(1)), First-Fit, Best-Fit, Buddy System (potências de 2 e Fibonacci) e análise de fragmentação (Regra dos 50% de Knuth)
Coleta de Lixo (Garbage Collection): Contagem de Referências, Mark-and-Sweep (algoritmo de Schorr-Waite sem pilha auxiliar) e coletores por cópia/compactação
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Regra dos 50% para fragmentação em alocadores dinâmicos, funcionamento de Boundary Tags para coalescência O(1) na liberação e travessia in-order O(1) de espaço em Threaded Trees.
Problema-Marco: Implementar em C (sobre um bloco contíguo de bytes simulando a heap) um alocador dinâmico completo com Boundary Tags ou Buddy System e um coletor de lixo Mark-and-Sweep para um grafo de objetos com ciclos.
Macrotema 9.3: Algoritmos Seminuméricos e Aritmética Computacional (TAOCP Vol. 2)
Trilha: TRL-PROG-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 7.5, 9.1 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:6.1, DOM-MATH:6.7, DOM-MATH:7.3
Modalidades de Prática: [Implementação Algorítmica], [Análise e Demonstração], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-18 [Algorítmica] (Caps. 3–4)
Subtemas:
Engenharia de geradores pseudoaleatórios (PRNGs): congruenciais lineares (Teorema de Hull-Dobell), Fibonacci defasados, Xorshift/LFSR e amostragem de distribuições não-uniformes (inversão, rejeição, método polar, algoritmo de amostragem em reservatório — Reservoir Sampling)
Bateria rigorosa de testes de qualidade de PRNGs (Qui-Quadrado, Kolmogorov-Smirnov, testes empíricos e Teste Espectral em reticulados)
Aritmética de ponto flutuante rigorosa (precisão, arredondamento exato, soma compensada de Kahan) e aritmética de precisão arbitrária (Algoritmo D de Knuth para divisão multiprecisão)
Multiplicação assintoticamente rápida (Karatsuba, Toom-Cook, FFT/Schönhage-Strassen), avaliação ótima de polinômios (Horner e pré-condicionamento), cadeias de adição e fatoração/primalidade em inteiros grandes
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Algoritmo D de Knuth para divisão de inteiros multiprecisão, Reservoir Sampling em streaming O(n) e Teorema de Hull-Dobell.
Problema-Marco: Implementar uma biblioteca de BigInt (com adição, multiplicação de Karatsuba e divisão multiprecisão de Knuth) e Reservoir Sampling validado estatisticamente por Teste Qui-Quadrado.
Macrotema 9.4: Teoria Profunda de Ordenação e Busca (TAOCP Vol. 3)
Trilha: TRL-PROG-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 3.2, 3.3, 3.5, 9.1 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:8.8
Modalidades de Prática: [Implementação Algorítmica], [Análise e Demonstração], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-19 [Algorítmica] (Caps. 5–6)
Subtemas:
Combinatória de permutações aplicada à ordenação: tabelas de inversão, runs, permutações de multiconjuntos e Correspondência de Robinson-Schensted-Knuth (RSK / Young Tableaux)
Otimizações finas e análise exata de ordenação interna: Shellsort (sequências de incrementos), Quicksort otimizado, Radix Sort e Redes de Ordenação (Princípio 0-1 e Batcher's Odd-Even Mergesort)
Ordenação Externa (arquivos maiores que a RAM): geração de runs por Substituição com Seleção (Replacement Selection — tamanho médio 2M), fusão balanceada k-way e Fusão Polifásica (Polyphase Merge)
Busca avançada: árvores binárias de busca ótimas (redução de O(n³) para O(n²) via monotonicidade das raízes de Knuth), árvores balanceadas (AVL, B-trees, B*-trees), busca digital (Tries, Patricia) e teoria exata de Hashing (sondagem linear, double hashing, Brent's variation e função de hash universal)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Princípio 0-1 para verificação de redes de ordenação, prova do comprimento médio 2M na Substituição por Seleção em ordenação externa e otimização quadrática de Knuth para BST ótima.
Problema-Marco: Implementar um motor de Ordenação Externa capaz de ordenar arquivos muito maiores que o limite de RAM estipulado usando Replacement Selection + fusão k-way por heap, e implementar a otimização O(n²) de Knuth para Árvores Binárias de Busca Ótimas.
Macrotema 9.5: Algoritmos Combinatórios, Bitwise, Backtracking e SAT Solvers (TAOCP Vols. 4A e 4B)
Trilha: TRL-PROG-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 3.6, 7.6, 9.1, 9.4 | Pré-requisitos Cruzados (DOM-MATH): DOM-MATH:4.6, DOM-MATH:8.8
Modalidades de Prática: [Implementação Algorítmica], [Análise e Demonstração], [Depuração e Benchmark]
Bibliografia e Capítulos: BIB-PROG-20 [Algorítmica] (Cap. 7.1–7.2.1); BIB-PROG-21 [Algorítmica] (Cap. 7.2.2)
Subtemas:
Truques bit a bit e Broadword Computing (SWAR — operações paralelas em palavras de 64 bits, popcount, bit reversal, tabelas de Bruijn)
Funções booleanas avançadas (Horn, Krom / 2-SAT em tempo linear, funções simétricas e monótonas) e representação compacta via OBDDs (Ordered Binary Decision Diagrams) e ZDDs (Zero-Suppressed Decision Diagrams)
Geração combinatória exaustiva ótima: códigos de Gray (mudança mínima) para tuplas e combinações, geração de permutações (Steinhaus-Johnson-Trotter / Plain Changes e algoritmo de Heap), partições de inteiros, partições de conjuntos e árvores
Backtracking de alta performance: estrutura de caminhamento, poda por propagação de restrições e estimativa estocástica de custo de árvores de busca (Algoritmo de Monte Carlo de Knuth)
Cobertura Exata (Exact Cover) e Dancing Links (Algoritmo X / DLX e DLXC com itens coloridos): listas duplamente encadeadas ortogonais com remoção/restauração O(1) para problemas combinatórios (Sudoku, poliminós, n-rainhas, empacotamento)
Engenharia de SAT Solvers modernos: Forma Normal Conjuntiva (CNF), transformação de Tseitin, Resolução, algoritmo DPLL e CDCL (Conflict-Driven Clause Learning) com Two Watched Literals, propagação unitária, grafo de implicações, cláusula aprendida 1-UIP, retrocesso não-cronológico (backjumping), heurística VSIDS e reinícios (Luby sequence)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Mecânica O(1) de ocultar/desocultar nós em Dancing Links (DLX), canonicidade de OBDDs para uma ordenação fixa de variáveis e ciclo completo do CDCL (BCP com Watched Literals → Conflito → Análise 1-UIP → Clause Learning → Backjump).
Problema-Marco: Implementar dois motores combinatórios completos: (1) um solver genérico de Exact Cover usando Dancing Links (DLX) e (2) um SAT Solver CDCL funcional em CNF com Two Watched Literals e aprendizagem de cláusulas 1-UIP testado em instâncias DIMACS.
