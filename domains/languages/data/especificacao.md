ESPECIFICAÇÃO DE DOMÍNIO E REQUISITOS — TELLUSLAB (DOM-LANG: IDIOMAS — INGLÊS, JAPONÊS E PORTUGUÊS INSTRUMENTAL)
## 1. ARQUITETURA PEDAGÓGICA E REQUISITOS DO DOMÍNIO (SRS / DOMAIN PACK)
1.0. Metadados do Pacote de Domínio (Domain Pack)
domainId: DOM-LANG
slug: languages
name: Idiomas (Inglês, Japonês e Português Instrumental)
version: 1.0.0
dominiosRelacionados: DOM-MATH, DOM-PROG, DOM-ECON, DOM-PHYS, DOM-ENG, DOM-HUM, DOM-LIT (domínio instrumental transversal para leitura técnica, escrita acadêmica e comunicação internacional)
1.1. Modelagem de Trilhas de Conhecimento (DAG)
O currículo divide-se em três trilhas linguísticas paralelas e independentes entre si, permitindo progressão simultânea em Inglês, Japonês (Kanji) e Português Instrumental:
TRL-LANG-EN (Língua Inglesa Estruturada — Básico ao Avançado e Inglês Técnico): Progressão gramatical completa de nível básico ao avançado, estilística formal/acadêmica, registro técnico e precisão lexical (Níveis 1, 2 e 3).
TRL-LANG-JP (Língua Japonesa — Escrita e Sistema Kanji): Arquitetura da escrita japonesa, ordem de traços, radicais, leituras on'yomi/kun'yomi e domínio progressivo dos ~430 kanjis fundamentais (Nível 4).
TRL-LANG-PT (Língua Portuguesa Instrumental e Precisão Lexical): Consulta lexical, polissemia, regência, ortografia e vocabulário de precisão em apoio direto à redação acadêmica e leitura literária (Nível 5).
1.2. Máquina de Estados Finita (FSM) de Proficiência por Macrotema
Cada Macrotema (X.Y) segue a máquina de estados padrão do TellusLab:
S0 — BLOQUEADO: Pelo menos um macrotema listado em Pré-requisitos Diretos ainda não atingiu o estado S4 (PROVA_VALIDADA).
S1 — DISPONIVEL: Todos os pré-requisitos diretos atingiram S4 ou superior; pronto para iniciar estudo.
S2 — TEORIA_CONCLUIDA: Estudo ativo das regras gramaticais, nuances semânticas/de registro ou estrutura de radicais/traços nas obras de referência.
S3 — FIXACAO_MECANICA: Resolução de bateria de exercícios estruturais (drills gramaticais, transformações de sentenças, traçado e reconhecimento de kanjis) com taxa de acerto ≥ 80%.
S4 — PROVA_VALIDADA (Estado de Desbloqueio): Regras, contrastes de uso e produção ativa (escrita de parágrafos/tradução/ditado de kanjis sem consulta) validados e Problema-Marco aprovado. Libera nós dependentes no DAG e insere o macrotema no motor FSRS-5.
S5 — REVISAO_EM_DIA: Em ciclo ativo de manutenção via FSRS-5 (com foco intensivo em retenção lexical, falsos cognatos e leitura/escrita de kanjis).
S6 — REVISAO_VENCIDA: Intervalo de retenção expirado; exige sessão de revisão antes de avançar em nós filhos.
1.3. Taxonomia de Modalidades de Estudo, Papéis Bibliográficos e Dificuldades
Papéis da Bibliografia:
[Gramática Progressiva]: Exposição estruturada por tópicos graduados com bateria de exercícios e gabarito (ex.: Oxford English Grammar Course Basic, Intermediate e Advanced).
[Lexicografia/Consulta]: Referência semântica, colocações, registros, pronúncia e falsos cognatos (ex.: Cambridge Dictionary of American English, Dicionário Didático SM).
[Escrita e Ideogramas]: Método sistemático de ordem de traços, radicais, mnemônicos e compostos vocabulários (ex.: Japanese Kanji for Beginners).
Modalidades de Prática Exigidas por Macrotema:
[Drill Gramatical e Transformação]: Exercícios de contraste de tempos/modos, reescrita sintática, preenchimento contextual e correção de erros típicos de falantes de português.
[Produção Escrita e Estilo]: Redação de parágrafos técnicos/acadêmicos aplicando estruturas-alvo, inversões, conectivos discursivos e controle de registro.
[Escrita e Reconhecimento de Kanji]: Traçado manual respeitando kakijun (ordem de traços), decomposição em radicais, associação on'yomi/kun'yomi e leitura em compostos jukugo.
[Leitura Técnica e Precisão Lexical]: Análise semântica de excertos autênticos, contraste de colocações e eliminação de falsos cognatos.
Tags de Dificuldade para Diagnóstico Regressivo:
DIF-LANG-01: Lacuna em Pré-requisito Gramatical ou Radical Base
DIF-LANG-02: Interferência do Português / Falso Cognato / Tradução Literal
DIF-LANG-03: Confusão de Tempo/Aspecto Verbal ou Regência Preposicional
DIF-LANG-04: Inadequação de Registro Formal vs. Informal / Coesão
DIF-LANG-05: Confusão Visual de Kanji / Ordem de Traços / Leitura On vs. Kun
DIF-LANG-06: Estouro de Tempo > 75 min
1.4. Requisitos Funcionais (RF) do Módulo DOM-LANG
RF-01 (Grafo Curricular e Caminho Crítico): Renderizar o DAG interativo dos 13 macrotemas de DOM-LANG organizados nas 3 trilhas independentes (TRL-LANG-EN, TRL-LANG-JP e TRL-LANG-PT). Permitir selecionar qualquer macrotema ou obra-alvo (ex.: BIB-LANG-03 Oxford Advanced ou BIB-LANG-05 Japanese Kanji) para calcular via ordenação topológica o subgrafo mínimo pendente.
RF-02 (Motor de Repetição Espaçada — FSRS-5): Agendar cartões derivados dos subtemas e critérios DoD de macrotemas em S4+, cobrindo: (a) cartões cloze de contraste gramatical, (b) colocações e falsos cognatos (PT ↔ EN), e (c) cartões bidirecionais de Kanji (significado + radical + leituras on/kun + compostos jukugo).
RF-03 (Gerador de Sessões Intercaladas de 45–75 min): Montar sessões práticas de 45 a 75 minutos divididas em 50% avanço em tema ativo (S1–S3), 30% revisão vencida FSRS (S6) e 20% produção livre/mista (ex.: reescrita de texto técnico em inglês ou ditado de kanjis em frases).
RF-04 (Trava de Solução e Revisão Socrática): Bloquear a chave de correção até o registro obrigatório de tentativa (tempo cronometrado, respostas/texto/kanjis produzidos e tags de dificuldade). A IA aponta erros de interferência do português, registro e aspecto verbal de forma socrática.
RF-05 (Diagnóstico Regressivo): Ao registrar DIF-LANG-01 ou DIF-LANG-03, percorrer as arestas reversas do DAG (ex.: retornar a Present Perfect em 2.1 ao falhar em Condicionais Mistas em 2.2) para injetar micro-revisões.
RF-06 (Apoio à Leitura Técnica Multidomínio): Permitir vincular termos técnicos e estruturas sintáticas de inglês encontrados nos pacotes DOM-MATH, DOM-PROG, DOM-ECON, DOM-PHYS e DOM-ENG diretamente à fila de revisão FSRS de DOM-LANG.
RF-07 (Métricas Ponderadas e Ponte TellusPedia): Calcular progresso global, por trilha e por obra (BIB-LANG-01 a BIB-LANG-06), ponderado por Complexidade (1–5), exportável em snapshot JSON compatível com a rota /lab?domain=languages do TellusPedia.
1.5. Requisitos Não-Funcionais, Integração e Radar de Lacunas
RNF-01 (Renderização Linguística): Suporte nativo a caracteres CJK/Unicode (Hiragana, Katakana, Kanji e furigana), transcrição fonética IPA e blocos comparativos de reescrita (antes vs. depois).
RNF-02 (Persistência Local-First e Compatibilidade): Compatível com o mesmo schema SQLite/IndexedDB e snapshot JSON do TellusLab, usando IDs qualificados pelo namespace DOM-LANG.
RNF-03 (Radar de Expansão Futura — Lacunas Conhecidas do Acervo Físico Atual): Este acervo cobre integralmente a gramática do inglês (Básico ao Avançado) e os kanjis iniciais do japonês, mas não inclui obras dedicadas a: (a) Gramática, leitura e conversação estruturada em Japonês (ex.: Genki I & II ou Minna no Nihongo) e treino auditivo/oral; (b) Guias de estilo e escrita técnica/acadêmica avançada em Inglês (ex.: Williams — Style: Lessons in Clarity and Grace); e (c) Gramática normativa superior e dicionário abrangente de Língua Portuguesa (ex.: Bechara, Cunha & Cintra e Houaiss).
## 2. CATÁLOGO BIBLIOGRÁFICO (ACERVO BASE DOM-LANG)
2.1. Língua Inglesa (Gramática Progressiva e Lexicografia)
BIB-LANG-01: Oxford English Grammar Course — Basic (with Answers) — Michael Swan, Catherine Walter
BIB-LANG-02: Oxford English Grammar Course — Intermediate (with Answers) — Michael Swan, Catherine Walter
BIB-LANG-03: Oxford English Grammar Course — Advanced (with Answers) — Michael Swan, Catherine Walter
BIB-LANG-04: Cambridge Dictionary of American English (for Speakers of Portuguese) — Cambridge University Press
2.2. Língua Japonesa (Sistema de Escrita Kanji)
BIB-LANG-05: Japanese Kanji for Beginners — Timothy G. Stout, Kaori Hakone (Tuttle)
2.3. Língua Portuguesa (Consulta Lexical)
BIB-LANG-06: Dicionário Didático (Ensino Fundamental) — Edições SM
## 3. TAXONOMIA GRANULAR DE MACROTEMAS, METADADOS E CRITÉRIOS DE ACEITE
NÍVEL 1: LÍNGUA INGLESA — FUNDAMENTOS GRAMATICAIS (BASIC)
Macrotema 1.1: Estrutura Básica da Frase e Tempos Presentes em Inglês
Trilha: TRL-LANG-EN | Complexidade: 1/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: Nenhum
|---|---|Transformação], [Produção Escrita e Estilo]
Bibliografia e Capítulos: BIB-LANG-01 [Gramática Progressiva] (Seções 1–3: be/have, Present Tenses, Imperatives & Basic Word Order)
Subtemas:
Verbos be e have (formas afirmativa, negativa, interrogativa e contrações) e uso de there is / there are
Present Simple (rotinas, fatos gerais, verbos estativos e auxiliar do/does) vs. Present Continuous (ações em progresso e situações temporárias)
Ordem canônica dos constituintes (Sujeito-Verbo-Objeto-Modo-Lugar-Tempo) e obrigatoriedade de sujeito explícito (dummy it / there)
Perguntas de sim/não, Wh-questions (diferença entre perguntas de sujeito e de objeto) e imperativos
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Distinção rigorosa entre verbos de ação e verbos estativos (non-action verbs), omissão proibida de sujeito em inglês e contraste Present Simple vs. Continuous.
Problema-Marco: Completar uma bateria de 40 transformações (afirmativa ↔ negativa ↔ pergunta de sujeito/objeto) com ≥ 90% de acerto e redigir uma descrição técnica curta (150 palavras) sobre uma rotina de estudos sem erros de concordância ou omissão de sujeito.
Macrotema 1.2: Tempos Passados, Futuros e Verbos Modais Essenciais
Trilha: TRL-LANG-EN | Complexidade: 2/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Drill Gramatical e Transformação], [Produção Escrita e Estilo]
Bibliografia e Capítulos: BIB-LANG-01 [Gramática Progressiva] (Seções 4–7: Past Tenses, Perfect Intro, Future, Modal Verbs)
Subtemas:
Past Simple (verbos regulares -ed, irregulares essenciais e auxiliar did) vs. Past Continuous (ações simultâneas e interrupções no passado) e used to
Introdução ao Present Perfect (experiências de vida, passado com impacto no presente, for/since/already/yet/just)
Expressões de futuro: going to (intenções e previsões baseadas em evidência), will (decisões instantâneas, promessas e previsões) e Present Continuous (arranjos agendados)
Verbos modais fundamentais: can/could (habilidade e pedido), must/have to (obrigação interna vs. externa e negação mustn't vs. don't have to), should/ought to (conselho) e may/might (possibilidade)
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Contraste de negação entre mustn't (proibição) e don't have to (ausência de obrigação), seleção adequada entre will / going to / Present Continuous e uso correto de did + infinitivo sem to.
Problema-Marco: Redigir um relato estruturado de 250 palavras combinando retrospectiva de um projeto passado (Past Simple/Continuous), aprendizados acumulados (Present Perfect) e próximos passos planejados (Future + Modals).
Macrotema 1.3: Substantivos, Artigos, Pronomes, Adjetivos e Preposições
Trilha: TRL-LANG-EN | Complexidade: 2/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Drill Gramatical e Transformação], [Leitura Técnica e Precisão Lexical]
Bibliografia e Capítulos: BIB-LANG-01 [Gramática Progressiva] (Seções 8–16); BIB-LANG-04 [Lexicografia/Consulta] (Verbetes de referência)
Subtemas:
Substantivos contáveis vs. incontáveis (armadilhas clássicas para falantes de português: information, advice, equipment, research, data) e plurais irregulares
Sistema de artigos (a/an, the e artigo zero para generalizações) e determinantes (some/any, much/many, a little/a few, both/either/neither)
Pronomes pessoais, possessivos, reflexivos e indefinidos; caso genitivo ('s vs. of)
Adjetivos (ordem canônica, -ed vs. -ing), advérbios de modo/frequência, comparativos e superlativos (as...as, -er/more, irregulares)
Preposições essenciais de tempo (in/on/at), lugar e movimento, e conjunções coordenativas e subordinativas básicas
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Uso do artigo zero em generalizações plurais/incontáveis, tratamento singular de incontáveis técnicos (information/equipment/evidence) e contraste entre in/on/at.
Problema-Marco: Corrigir um texto técnico em inglês com 25 erros plantados de artigos, incontáveis, preposições e comparativos, justificando cada correção com base nas regras de Swan & Walter.
NÍVEL 2: LÍNGUA INGLESA — DOMÍNIO INTERMEDIÁRIO E PRECISÃO COMUNICATIVA (INTERMEDIATE)
Macrotema 2.1: Sistema Verbal Completo, Aspecto e Voz Passiva
Trilha: TRL-LANG-EN | Complexidade: 3/5 | Pré-requisitos Diretos: 1.2 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Drill Gramatical e Transformação], [Produção Escrita e Estilo]
Bibliografia e Capítulos: BIB-LANG-02 [Gramática Progressiva] (Seções 1–7: Tenses, Perfect Aspect, Passives)
Subtemas:
Contraste rigoroso entre Past Simple (tempo fechado/acabado) e Present Perfect (tempo aberto/conexão com o presente)
Present Perfect Simple (resultado/quantidade) vs. Present Perfect Continuous (duração/processo em curso)
Past Perfect Simple e Continuous (anterioridade no passado e narrativa em dois planos temporais) e Future Perfect / Future Continuous
Voz Passiva em todos os tempos verbais e com modais, escolha estratégica da voz passiva na escrita científica/técnica, passivas com verbos de dois objetos e construções causativas (have/get something done)
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Critério temporal exato entre Past Simple e Present Perfect (incompatibilidade de Present Perfect com marcadores de passado fechado como yesterday/in 2024), foco em resultado vs. duração no aspecto contínuo e formação da passiva com verbos de relato (It is believed that... / X is known to...).
Problema-Marco: Reescrever um relatório técnico de arquitetura ou experimento científico alternando deliberadamente entre voz ativa e passiva conforme o foco informacional, e resolver 30 casos de contraste fino entre os tempos perfeitos e simples.
Macrotema 2.2: Estruturas Hipotéticas, Modais de Dedução e Discurso Indireto
Trilha: TRL-LANG-EN | Complexidade: 3/5 | Pré-requisitos Diretos: 1.2, 2.1 | Pré-requisitos Cruzados: DOM-MATH:2.2
Modalidades de Prática: [Drill Gramatical e Transformação], [Produção Escrita e Estilo]
Bibliografia e Capítulos: BIB-LANG-02 [Gramática Progressiva] (Seções 8, 16–17: Modals, Conditionals, Indirect Speech)
Subtemas:
Condicionais completas: Zero (verdades gerais/científicas), 1ª (real futuro), 2ª (hipotético presente/futuro), 3ª (contrafactual passado) e Condicionais Mistas (passado afetando o presente e vice-versa)
Conectivos condicionais alternativos (unless, provided that, as long as, in case, even if) e estruturas de arrependimento/hipótese (wish / if only / would rather / it's high time)
Modais epistêmicos de dedução no presente e no passado (must have done, can't have done, might/could have done, should have done)
Discurso Indireto (Reported Speech): recuo de tempos verbais (backshifting), adaptação de pronomes/advérbios, perguntas indiretas (sem inversão auxiliar) e verbos de relato variados (claim, warn, suggest, advise, insist)
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Estrutura exata das condicionais mistas, distinção semântica entre in case e if, negação de dedução lógica (can't have, não mustn't have) e ordem afirmativa em perguntas indiretas (Do you know where it is?).
Problema-Marco: Produzir uma análise de incidente técnico (postmortem em inglês, 350 palavras) utilizando corretamente 3ª condicional, condicionais mistas, modais perfeitos de dedução (análise de causa raiz) e discurso indireto para relatar depoimentos da equipe.
Macrotema 2.3: Subordinação, Infinitivo vs. Gerúndio, Relativas e Phrasal Verbs
Trilha: TRL-LANG-EN | Complexidade: 3/5 | Pré-requisitos Diretos: 1.3, 2.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Drill Gramatical e Transformação], [Leitura Técnica e Precisão Lexical]
Bibliografia e Capítulos: BIB-LANG-02 [Gramática Progressiva] (Seções 9–15, 18–20); BIB-LANG-04 [Lexicografia/Consulta] (Phrasal verbs e colocações)
Subtemas:
Padrões verbais: verbos seguidos exclusivamente de -ing vs. to-infinitive vs. ambos com mudança de significado (remember, forget, stop, try, regret, mean)
Orações Relativas (Relative Clauses): restritivas (defining) vs. explicativas (non-defining — uso obrigatório de vírgulas e proibição de that), omissão do pronome relativo objeto, whose, whom e preposições em relativas
Preposições seguidas de -ing (look forward to + -ing, be used to + -ing vs. used to + infinitive)
Phrasal Verbs (transitivos separáveis vs. inseparáveis e intransitivos) e colocações nominais/verbais frequentes no inglês americano (make vs. do, take/give/set/carry)
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Diferença semântica exata de stop/remember/try/regret com gerúndio vs. infinitivo, regras de vírgula e proibição de that em non-defining relative clauses e posicionamento obrigatório de pronomes objetos em phrasal verbs separáveis (turn it off).
Problema-Marco: Traduzir e adaptar um conjunto de 20 sentenças complexas de português para inglês idiomático exigindo relativas não-restritivas, gerúndios preposicionados e contraste de padrões verbais, validando colocações no dicionário Cambridge.
NÍVEL 3: LÍNGUA INGLESA — DOMÍNIO AVANÇADO, ESTILO E INGLÊS TÉCNICO (ADVANCED)
Macrotema 3.1: Sintaxe Avançada, Ênfase e Estrutura de Informação
Trilha: TRL-LANG-EN | Complexidade: 4/5 | Pré-requisitos Diretos: 2.2, 2.3 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Drill Gramatical e Transformação], [Produção Escrita e Estilo]
Bibliografia e Capítulos: BIB-LANG-03 [Gramática Progressiva] (Seções 15–19: Information Structure, Inversion, Clefts, Ellipsis)
Subtemas:
Estrutura de informação na frase inglesa: princípio do dado-antes-do-novo (end-focus) e peso final (end-weight)
Inversão Enfática e Negativa (Seldom have we observed..., Not only does..., Only after..., Little did they know...) e inversão condicional formal sem if (Had we known..., Should the system fail..., Were it not for...)
Cleft Sentences (It-clefts e Wh-clefts / pseudo-clefts para foco contrastivo) e Fronting
Elipse e Substituição (so/neither, do/does/did como pro-formas, one/ones, elipse em coordenação e respostas concisas)
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Mecânica sintática da inversão negativa (advérbio negativo inicial + auxiliar + sujeito + verbo principal), formação das três inversões condicionais formais (Had / Were / Should) e uso de end-weight para evitar sujeitos excessivamente longos.
Problema-Marco: Refatorar um texto técnico de 400 palavras em inglês (originalmente repetitivo e plano) aplicando end-weight, cleft sentences, elipse e inversão condicional/enfática para elevar a clareza e a concisão em nível executivo/acadêmico.
Macrotema 3.2: Coesão Discursiva, Registro Formal e Modalidade Avançada
Trilha: TRL-LANG-EN | Complexidade: 4/5 | Pré-requisitos Diretos: 2.2, 2.3, 3.1 | Pré-requisitos Cruzados: DOM-HUM:1.5
Modalidades de Prática: [Produção Escrita e Estilo], [Leitura Técnica e Precisão Lexical]
Bibliografia e Capítulos: BIB-LANG-03 [Gramática Progressiva] (Seções 1–14, 20–21: Spoken vs. Written Grammar, Discourse Markers, Participle Clauses, Subjunctive)
Subtemas:
Participle Clauses (orações reduzidas de particípio presente, passado e perfeito) e prevenção rigorosa de Dangling Participles (particípios soltos com sujeito incompatível)
Marcadores discursivos de alto nível para escrita acadêmica e arquitetural (concessão: albeit, notwithstanding, whereas; causa/consequência: hence, thereby, consequently; contraste e hedgings epistêmicos: arguably, seemingly, tends to)
Subjuntivo mandativo formal no inglês americano (It is essential that the service be idempotent; We recommend that he submit...) e nuances avançadas de modalidade (shall, dare, need not have vs. didn't need to)
Nominalização (transformação de cláusulas em sintagmas nominais na escrita formal vs. risco de jargão opaco) e distinção sistemática entre gramática falada e escrita formal
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Regra de identidade de sujeito em participle clauses (identificar e corrigir dangling modifiers), diferença semântica entre didn't need to do e needn't have done, e uso preciso do subjuntivo mandativo formal.
Problema-Marco: Redigir um Architecture Decision Record (ADR) ou resumo acadêmico de 500 palavras inteiramente em inglês formal avançado contendo particípios reduzidos corretos, marcadores discursivos de concessão/consequência, hedging acadêmico apropriado e subjuntivo mandativo.
Macrotema 3.3: Precisão Lexical, Falsos Cognatos e Leitura Técnica em Inglês
Trilha: TRL-LANG-EN | Complexidade: 4/5 | Pré-requisitos Diretos: 2.3, 3.2 | Pré-requisitos Cruzados: DOM-MATH:2.1, DOM-PROG:8.1
Modalidades de Prática: [Leitura Técnica e Precisão Lexical], [Produção Escrita e Estilo]
Bibliografia e Capítulos: BIB-LANG-04 [Lexicografia/Consulta] (Seções de falsos cognatos, colocações e notas de uso para falantes de português); BIB-LANG-03 [Gramática Progressiva] (Seções de léxico e estilo)
Subtemas:
Falsos cognatos críticos (Português ↔ Inglês) no universo técnico, financeiro e acadêmico (actually, pretend, intend, push, resume, eventually, sensible vs. sensitive, comprehensive vs. comprehensible, fabric, parents, policy vs. politics)
Precisão de colocações acadêmicas e corporativas (ex.: conduct research, draw a conclusion, pose a risk, mitigate a failure, yield a result — evitando calques do português)
Uso produtivo do dicionário Cambridge (etiquetas de registro formal/informal/slang, padrões sintáticos de verbos, exemplos autênticos e pronúncia IPA americana)
Estratégias de leitura técnica profunda sem tradução mental em obras originais da estante (ex.: Rosen, Knuth, Kleppmann, Wasserman, Fabozzi, Rutten & van Venrooij)
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Domínio de ao menos 40 falsos cognatos e 30 colocações acadêmicas/técnicas de alta frequência, além da leitura de transcrições IPA básicas para evitar fossilização de pronúncia.
Problema-Marco: Selecionar um capítulo técnico original em inglês (de DDIA, Concrete Mathematics ou Fabozzi), extrair 15 colocações/estruturas sintáticas avançadas, redigir uma síntese crítica de 400 palavras em inglês natural (livre de "portuglês") e registrar os pares de falsos cognatos no FSRS.
NÍVEL 4: LÍNGUA JAPONESA — ESCRITA E SISTEMA KANJI
Macrotema 4.1: Arquitetura da Escrita Japonesa, Radicais e Ordem de Traços
Trilha: TRL-LANG-JP | Complexidade: 3/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: DOM-HUM:1.1
Modalidades de Prática: [Escrita e Reconhecimento de Kanji]
Bibliografia e Capítulos: BIB-LANG-05 [Escrita e Ideogramas] (Introdução e Fundamentos do Sistema Kanji)
Subtemas:
Os três sistemas integrados da escrita japonesa: Hiragana (morfologia gramatical / okurigana), Katakana (empréstimos estrangeiros / ênfase) e Kanji (núcleos semânticos)
As 4 categorias estruturais clássicas de formação dos kanjis (Rikusho): pictogramas (shōkei), ideogramas simples (shiji), compostos semânticos (kaii) e compostos fono-semânticos (keisei — a vasta maioria dos kanjis)
Regras universais de Ordem de Traços (Kakijun) (de cima para baixo, da esquerda para a direita, traços horizontais antes de verticais cruzados, fechamento de caixas por último) e tipos de finalização de traço (tome, hane, harai)
Sistema de Radicais (Bushu) como chave de organização visual e semântica
Leituras múltiplas: leitura sino-japonesa (On'yomi, predominante em compostos jukugo) vs. leitura nativa japonesa (Kun'yomi, predominante em palavras isoladas e com okurigana)
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: As regras fundamentais de ordem de traços (kakijun), diferença funcional entre on'yomi e kun'yomi (incluindo o papel do okurigana) e reconhecimento dos 25 radicais de maior frequência.
Problema-Marco: Classificar 20 kanjis desconhecidos por categoria estrutural, identificar seus radicais principais e prever corretamente a ordem de traços de cada um antes de conferir no gabarito.
Macrotema 4.2: Kanjis Fundamentais — Bloco I (Números, Tempo, Natureza e Espaço — JLPT N5)
Trilha: TRL-LANG-JP | Complexidade: 3/5 | Pré-requisitos Diretos: 4.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Escrita e Reconhecimento de Kanji]
Bibliografia e Capítulos: BIB-LANG-05 [Escrita e Ideogramas] (Primeira metade: capítulos temáticos de números, calendário/tempo, elementos naturais, direções e medidas)
Subtemas:
Números, contadores essenciais, dias da semana, meses, horas e expressões de tempo (一 a 万, 日, 月, 年, 時, 分, 半, 今, 前, 後)
Elementos naturais, astronomia básica e clima (火, 水, 木, 金, 土, 山, 川, 田, 空, 天, 雨, 電)
Orientação espacial, dimensões e posições (上, 下, 中, 左, 右, 北, 南, 東, 西, 大, 小, 長, 高)
Aquisição contextual por palavras compostas (Jukugo) de alta frequência e integração completa de cartões bidirecionais (Kanji → Leitura/Significado e Significado → Escrita manual) no FSRS-5
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Reconhecimento e escrita manual com ordem de traços correta dos ~150–200 primeiros kanjis do Bloco I, incluindo suas leituras principais e ao menos 2 compostos jukugo por kanji.
Problema-Marco: Realizar uma avaliação cronometrada (sem consulta) cobrindo 50 kanjis sorteados do Bloco I — escrevendo à mão com ordem de traços correta e lendo 30 compostos jukugo em frases curtas — atingindo ≥ 85% de precisão.
Macrotema 4.3: Kanjis Fundamentais — Bloco II (Pessoas, Ações, Adjetivos e Cotidiano — Transição N5 → N4)
Trilha: TRL-LANG-JP | Complexidade: 4/5 | Pré-requisitos Diretos: 4.2 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Escrita e Reconhecimento de Kanji]
Bibliografia e Capítulos: BIB-LANG-05 [Escrita e Ideogramas] (Segunda metade: pessoas, família, verbos fundamentais, adjetivos, escola, trabalho e sociedade até ~430 kanjis)
Subtemas:
Pessoas, família, corpo humano e relações sociais (人, 子, 女, 男, 父, 母, 友, 口, 目, 耳, 手, 足, 心)
Raízes verbais essenciais de ação, percepção e movimento (行, 来, 見, 聞, 食, 飲, 読, 書, 話, 買, 出, 入, 立, 休)
Adjetivos qualitativos e antônimos estruturais (新, 古, 多, 少, 安, 白, 黒, 赤, 青, 明, 暗, 強, 弱)
Vida urbana, estudos, trabalho e cultura (学, 校, 先, 生, 会, 社, 駅, 車, 道, 国, 語, 本, 文)
Desambiguação de kanjis visualmente semelhantes (ex.: 待 vs. 持; 末 vs. 未; 右 vs. 石) via decomposição sistemática de radicais e manutenção de longo prazo no FSRS-5
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Diferenciação visual por radicais de pares facilmente confundíveis, uso correto de okurigana em verbos/adjetivos e retenção estável no FSRS-5 do conjunto completo de ~430 kanjis de BIB-LANG-05.
Problema-Marco: Concluir um teste integrador de leitura e escrita abrangendo 80 kanjis aleatórios de todo o livro (Blocos I + II) e decodificar sem furigana 10 pares de kanjis visualmente similares inseridos em compostos reais.
NÍVEL 5: LÍNGUA PORTUGUESA INSTRUMENTAL E PRECISÃO LEXICAL
Macrotema 5.1: Precisão Lexical, Semântica e Consulta em Língua Portuguesa
Trilha: TRL-LANG-PT | Complexidade: 1/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: DOM-HUM:1.5
Modalidades de Prática: [Leitura Técnica e Precisão Lexical], [Produção Escrita e Estilo]
Bibliografia e Capítulos: BIB-LANG-06 [Lexicografia/Consulta] (Consulta sistemática)
Subtemas:
Uso produtivo do dicionário de língua portuguesa: etimologia básica, acepções múltiplas (polissemia), classes gramaticais, regência verbal/nominal e separação silábica/ortografia
Precisão vocabular: parônimos e homônimos críticos na escrita técnica e acadêmica (retificar vs. ratificar, eminente vs. iminente, discriminar vs. descriminar, cessão vs. sessão vs. seção, acerca de vs. há cerca de)
Sinonímia contextual (evitar repetições sem distorcer o sentido técnico) e enriquecimento lexical ativo a partir da leitura de literatura clássica (DOM-LIT) e filosofia (DOM-HUM)
Critérios de Aceite (DoD):
Conceitos/Regras Obrigatórios: Distinção exata dos principais pares de parônimos/homônimos da escrita formal e consulta ativa de regência/polissemia na revisão textual.
Problema-Marco: Revisar um texto autoral próprio (ensaio de DOM-HUM ou documentação técnica) eliminando imprecisões lexicais, parônimos trocados e repetições pobres, mantendo um glossário pessoal de 30 vocábulos de precisão extraídos das leituras de DOM-LIT/DOM-HUM.
