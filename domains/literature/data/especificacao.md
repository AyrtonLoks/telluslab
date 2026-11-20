ESPECIFICAÇÃO DE DOMÍNIO E REQUISITOS — TELLUSLAB (DOM-LIT: LITERATURA LUSÓFONA E EUROPEIA)
## 1. ARQUITETURA PEDAGÓGICA E REQUISITOS DO DOMÍNIO (SRS / DOMAIN PACK)
1.0. Metadados do Pacote de Domínio (Domain Pack)
domainId: DOM-LIT
slug: literature
name: Literatura (Brasileira, Portuguesa, Africana Lusófona e Europeia)
version: 1.0.0
dominiosRelacionados: DOM-HUM, DOM-LANG (forte integração com História, Filosofia, Ciências Sociais, Precisão Lexical e os dossiês de Arte/Cultura/História do TellusPedia)
1.1. Modelagem de Trilhas de Conhecimento (DAG)
O currículo organiza-se em um Grafo Acíclico Dirigido (DAG) cronológico-estético com quatro trilhas paralelas cobrindo a formação da Literatura em Língua Portuguesa (Portugal, Brasil e Moçambique) em diálogo com o século XIX europeu:
TRL-LIT-00 (Épica, Poesia Lírica e Poética Urbana Contemporânea): Camões (Os Lusíadas), Álvares de Azevedo (Lira dos Vinte Anos), Carlos Drummond de Andrade (Sentimento do Mundo), Racionais MC's (Sobrevivendo no Inferno) e César Magalhães Borges (Ciclo da Lua) (Níveis 1, 2, 4 e 6).
TRL-LIT-01 (Prosa Portuguesa e Europeia — Século XIX): Almeida Garrett, Camilo Castelo Branco, Gustave Flaubert, Eça de Queirós e Contos Fantásticos do Século XIX (org. Italo Calvino) (Níveis 2 e 3).
TRL-LIT-02 (Formação do Romance e Conto Brasileiro): José de Alencar, Manuel Antônio de Almeida, Machado de Assis, Aluísio Azevedo, Monteiro Lobato, Graciliano Ramos, Jorge Amado, Guimarães Rosa e Clarice Lispector (Níveis 2, 3, 4 e 5).
TRL-LIT-03 (Dramaturgia Brasileira e Lusofonia Africana): Gianfrancesco Guarnieri, Osman Lins e Mia Couto (Níveis 5 e 6).
1.2. Máquina de Estados Finita (FSM) de Proficiência por Macrotema
Cada Macrotema (X.Y) segue a máquina de estados padrão do TellusLab:
S0 — BLOQUEADO: Pelo menos um macrotema listado em Pré-requisitos Diretos ainda não atingiu o estado S4 (PROVA_VALIDADA). (Arestas em Pré-requisitos Cruzados com DOM-HUM ou DOM-LANG atuam como Soft Warning por padrão ou Hard Gate quando o Modo Estrito Interdisciplinar estiver ativo.)
S1 — DISPONIVEL: Todos os pré-requisitos diretos atingiram S4 ou superior; pronto para iniciar estudo.
S2 — TEORIA_CONCLUIDA: Leitura integral e anotada da(s) obra(s) primária(s) acompanhada de contextualização histórico-estética do movimento literário.
S3 — FIXACAO_MECANICA: Exercícios de close reading (análise de foco narrativo, métrica/figuras, discurso indireto livre, ironia e construção de personagens em excertos selecionados) com aprovação ≥ 80%.
S4 — PROVA_VALIDADA (Estado de Desbloqueio): Conceitos estéticos/narratológicos obrigatórios articulados sem consulta e Problema-Marco (ensaio crítico ou análise comparativa com evidência textual) aprovado. Libera nós dependentes no DAG e insere o macrotema no motor FSRS-5.
S5 — REVISAO_EM_DIA: Em ciclo ativo de manutenção via FSRS-5.
S6 — REVISAO_VENCIDA: Intervalo de retenção expirado; exige sessão de revisão antes de avançar em nós filhos.
1.3. Taxonomia de Modalidades de Estudo, Papéis Bibliográficos e Dificuldades
Papéis da Bibliografia:
[Obra Épica/Poética]: Poesia épica, lírica moderna, ultrarromântica ou poética urbana/oral (ex.: Camões, Álvares de Azevedo, Drummond, Racionais MC's, César Magalhães Borges).
[Romance/Novela]: Narrativa longa de ficção analisada quanto a foco narrativo, tempo, espaço, enredo e forma social (ex.: Garrett, Alencar, Camilo, Flaubert, Machado, Eça, Aluísio, Graciliano, Jorge Amado, Clarice, Mia Couto).
[Conto/Narrativa Curta]: Prosa breve focada em condensação dramática, epifania, insólito ou invenção linguística (ex.: Calvino org., Monteiro Lobato, Guimarães Rosa, Clarice Lispector).
[Dramaturgia]: Texto teatral focado em conflito cênico, diálogos, rubricas e construção do espetáculo (ex.: Guarnieri, Osman Lins).
Modalidades de Prática Exigidas por Macrotema:
[Close Reading e Análise Formal]: Exame cerrado de um excerto ou poema: foco narrativo, discurso direto/indireto/indireto livre, métrica/ritmo, léxico, ironia e imagens recorrentes.
[Contextualização Histórico-Estética]: Articulação entre a forma literária da obra e as tensões históricas, sociais e econômicas de sua época (ponte direta com DOM-HUM e TellusPedia).
[Análise Comparativa e Intertextual]: Diálogo estrutural entre obras de épocas ou países distintos (ex.: Flaubert ↔ Machado ↔ Eça; Guimarães Rosa ↔ Mia Couto; Camões ↔ Racionais).
[Ensaio Crítico Literário]: Redação estruturada de crítica literária sustentada por citações diretas do texto (evitando mero resumo de enredo).
Tags de Dificuldade para Diagnóstico Regressivo:
DIF-LIT-01 (Lacuna em Pré-requisito Estético, Histórico ou DOM-HUM)
DIF-LIT-02 (Resumo de Enredo no Lugar de Análise Formal/Crítica)
DIF-LIT-03 (Confusão entre Autor Real e Narrador / Eu Lírico — ex.: narrador não-confiável)
DIF-LIT-04 (Anacronismo ou Leitura Descolada da Forma — métrica, gênero, estilo)
DIF-LIT-05 (Falta de Evidência Textual / Análise Impresionista)
DIF-LIT-06 (Estouro de Tempo > 75 min)
1.4. Requisitos Funcionais (RF) do Módulo DOM-LIT
RF-01 (Grafo Curricular e Caminho Crítico): Renderizar o DAG interativo dos 16 macrotemas de DOM-LIT integrados às 4 trilhas literárias e com suporte a arestas cruzadas para DOM-HUM e DOM-LANG. Permitir selecionar qualquer obra-alvo (ex.: BIB-LIT-10 Brás Cubas ou BIB-LIT-24 Terra Sonâmbula) para calcular via ordenação topológica o subgrafo estético-histórico de formação.
RF-02 (Motor de Repetição Espaçada — FSRS-5): Agendar cartões derivados dos subtemas e critérios DoD de macrotemas em S4+, cobrindo: (a) categorias narratológicas e poéticas (discurso indireto livre, narrador não-confiável, oitava rima, epifania), (b) periodização e rupturas estéticas, e (c) relações intertextuais entre obras do acervo.
RF-03 (Gerador de Sessões Intercaladas de 45–75 min): Montar sessões práticas de 45 a 75 minutos divididas em 50% avanço em obra/macrotema ativo (S1–S3), 30% revisão vencida (S6) e 20% exercícios rápidos de close reading em excertos não-identificados (identificar escola, foco narrativo e recursos estilísticos).
RF-04 (Trava de Solução e Revisão Socrática): Bloquear a análise de referência até o registro obrigatório de tentativa (tempo cronometrado, close reading ou ensaio crítico submetido e tags de dificuldade). A IA penaliza resumos de enredo sem análise formal e cobra distinção rigorosa entre autor e narrador/eu lírico.
RF-05 (Diagnóstico Regressivo Cross-Domain): Ao registrar DIF-LIT-01, percorrer as arestas reversas dentro de DOM-LIT e também em DOM-HUM (contexto filosófico/histórico/sociológico) para sugerir micro-revisões.
RF-06 (Caderno de Close Reading e Citações): Permitir registrar excertos marcantes, escansões poéticas, mapas de personagens e citações formatadas (ABNT) por obra.
RF-07 (Métricas Ponderadas e Ponte TellusPedia): Calcular progresso global, por trilha (TRL-LIT-00 a TRL-LIT-03) e por obra (BIB-LIT-01 a BIB-LIT-26), ponderado por Complexidade (1–5), exportável em snapshot JSON compatível com a rota /lab?domain=literature do TellusPedia (conectando obras literárias diretamente aos períodos históricos e países no Globo 3D: Portugal, Brasil, França e Moçambique).
1.5. Requisitos Não-Funcionais, Integração e Radar de Lacunas
RNF-01 (Renderização Literária): Suporte a blocos de versos com preservação de quebra de linha/escansão métrica, anotações marginais de close reading, citações ABNT e diagramas Mermaid (linhas do tempo estéticas e redes de intertextualidade).
RNF-02 (Persistência Local-First e Compatibilidade): Compatível com o mesmo schema SQLite/IndexedDB e snapshot JSON do TellusLab, usando IDs qualificados pelo namespace DOM-LIT.
RNF-03 (Radar de Expansão Futura — Lacunas Conhecidas do Acervo Físico Atual): Este acervo forma um arco muito completo da literatura em língua portuguesa (de Camões a Machado, Drummond, Rosa, Clarice, Mia Couto e Racionais), mas não inclui obras dedicadas a: (a) Teoria e Crítica Literária sistemática (ex.: Antonio Candido — Formação da Literatura Brasileira / O Direito à Literatura; Terry Eagleton — Teoria da Literatura); (b) Primeira Fase do Modernismo Brasileiro de 1922 (Mário de Andrade — Macunaíma; Oswald de Andrade — Memórias Sentimentais de João Miramar); e (c) Clássicos fundadores da literatura ocidental antiga/moderna fora do eixo luso-francês (Homero, Dante, Shakespeare, Cervantes, Dostoiévski).
## 2. CATÁLOGO BIBLIOGRÁFICO (ACERVO BASE DOM-LIT)
2.1. Classicismo Português (Épica Renascentista)
BIB-LIT-01: Os Lusíadas — Luís de Camões
2.2. Romantismo Português e Brasileiro (Prosa, Poesia e Transição)
BIB-LIT-02: Viagens na minha terra — Almeida Garrett
BIB-LIT-03: Lira dos Vinte Anos — Álvares de Azevedo
BIB-LIT-04: O Guarani — José de Alencar
BIB-LIT-05: Lucíola — José de Alencar
BIB-LIT-06: Til — José de Alencar
BIB-LIT-07: Amor de Perdição — Camilo Castelo Branco
BIB-LIT-08: Memórias de um Sargento de Milícias — Manuel Antônio de Almeida
2.3. Realismo, Naturalismo e Fantástico (Século XIX — França, Portugal e Brasil)
BIB-LIT-09: Madame Bovary — Gustave Flaubert
BIB-LIT-10: Memórias Póstumas de Brás Cubas — Machado de Assis
BIB-LIT-11: Dom Casmurro — Machado de Assis
BIB-LIT-12: A cidade e as serras — Eça de Queirós
BIB-LIT-13: O Cortiço — Aluísio Azevedo
BIB-LIT-14: Contos Fantásticos do Século XIX — org. Italo Calvino
2.4. Pré-Modernismo e Modernismo Brasileiro (1920–1940)
BIB-LIT-15: Negrinha — Monteiro Lobato
BIB-LIT-16: Vidas Secas — Graciliano Ramos
BIB-LIT-17: Capitães da Areia — Jorge Amado
BIB-LIT-18: Sentimento do Mundo — Carlos Drummond de Andrade
2.5. Invenção da Linguagem, Intimismo e Dramaturgia Brasileira (1940–1977)
BIB-LIT-19: Sagarana — João Guimarães Rosa
BIB-LIT-20: Laços de Família — Clarice Lispector
BIB-LIT-21: A Hora da Estrela — Clarice Lispector
BIB-LIT-22: Eles Não Usam Black-Tie — Gianfrancesco Guarnieri
BIB-LIT-23: Lisbela e o Prisioneiro — Osman Lins
2.6. Literatura Africana de Língua Portuguesa e Poética Contemporânea
BIB-LIT-24: Terra Sonâmbula — Mia Couto
BIB-LIT-25: Sobrevivendo no Inferno — Racionais MC's
BIB-LIT-26: Ciclo da Lua (poemas) — César Magalhães Borges
## 3. TAXONOMIA GRANULAR DE MACROTEMAS, METADADOS E CRITÉRIOS DE ACEITE
NÍVEL 1: CLASSICISMO E FUNDAÇÃO ÉPICA DA LÍNGUA PORTUGUESA
Macrotema 1.1: A Epopeia Renascentista e a Língua Portuguesa (Camões — Os Lusíadas)
Trilha: TRL-LIT-00 | Complexidade: 4/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: DOM-HUM:2.1, DOM-LANG:5.1
|---|---|Histórico-Estética]
Bibliografia e Capítulos: BIB-LIT-01 [Obra Épica/Poética] (Cantos I–X)
Subtemas:
Estrutura formal da epopeia clássica (herança de Homero e Virgílio): Proposição, Invocação, Dedicatória, Narração (in medias res) e Epílogo
Arquitetura métrica rigorosa: oitava rima (esquema ABABABCC) em versos decassílabos heroicos (acentuação tônica na 6ª e 10ª sílabas) e figuras de estilo renascentistas (hipérbato, anáfora, antítese)
O herói coletivo (o "peito ilustre lusitano" / Vasco da Gama como emblema da nação) e os planos narrativos entrelaçados (viagem, história de Portugal, mitologia e reflexões do poeta)
Convivência paradoxal entre o Maravihloso Pagão (Concílio dos Deuses, Vênus vs. Baco, Ilha dos Amores) e o ideário cristão renascentista
Episódios estruturais e contraponto crítico: Inês de Castro (lirismo trágico), Gigante Adamastor (limites da natureza/desejo) e o Velho do Restelo (crítica feroz à cobiça imperial e à desmedida das navegações)
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: As 5 partes da estrutura épica, escansão de um verso decassílabo heroico em oitava rima ABABABCC e tensão ideológica entre exaltação expansionista e advertência moral do Velho do Restelo.
Problema-Marco: Realizar o close reading e escansão métrica de duas estrofes (uma da Proposição e uma do discurso do Velho do Restelo), analisando como Camões equilibra triunfo épico e desencanto histórico no final do Renascimento português.
NÍVEL 2: ROMANTISMO LUSO-BRASILEIRO (PROSA, POESIA ULTRARROMÂNTICA E COSTUMBRISMO)
Macrotema 2.1: Romantismo Português — Prosa Híbrida e Novela Passional (Garrett & Camilo)
Trilha: TRL-LIT-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-HUM:4.5
Modalidades de Prática: [Close Reading e Análise Formal], [Análise Comparativa e Crítica]
Bibliografia e Capítulos: BIB-LIT-02 [Romance/Novela] (Caps. I–XLIX); BIB-LIT-07 [Romance/Novela] (Introdução, Caps. I–XX e Conclusão)
Subtemas:
Almeida Garrett (Viagens na minha terra): gênero híbrido mesclando crônica de viagem, ensaio político, digressão metalinguística (influência de Laurence Sterne) e a novela sentimental interpolada ("A Menina dos Rouxinóis" — Carlos, Joaninha e Frei Dinis)
Simbolismo político-ideológico em Garrett: o conflito entre liberalismo e absolutismo em Portugal (Guerras Liberais), o contraste entre os "barões" materialistas e os valores espirituais, e a modernização da prosa portuguesa
Camilo Castelo Branco (Amor de Perdição): estética ultrarromântica da novela passional, ritmo acelerado e dramático, amor absoluto vs. código de honra patriarcal/aristocrático (Simão Botelho, Teresa de Albuquerque e Mariana)
Fatalismo trágico, redenção pelo sacrifício e diálogo com o leitor em Camilo
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Estrutura digressiva e hibridismo de gênero em Viagens na minha terra (antecipando procedimentos metalinguísticos machadianos) e características da novela passional ultrarromântica em Amor de Perdição.
Problema-Marco: Redigir uma análise comparativa contrastando o papel da ironia e da digressão política em Garrett com a intensidade trágica e linearidade dramática em Camilo Castelo Branco.
Macrotema 2.2: Ultrarromantismo Brasileiro e a Dualidade Ariel/Caliban (Álvares de Azevedo)
Trilha: TRL-LIT-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Close Reading e Análise Formal], [Contextualização Histórico-Estética]
Bibliografia e Capítulos: BIB-LIT-03 [Obra Épica/Poética] (Primeira, Segunda e Terceira Partes e Prefácios)
Subtemas:
Segunda Geração Romântica no Brasil (Byronismo e "Mal do Século"): egocentrismo, escapismo onírico, tédio existencial (spleen), erotismo velado e obsessão pela morte prematura
A Arquitetura Binomial de Lira dos Vinte Anos (explicada pelo próprio autor no prefácio da 2ª Parte): a oposição estrutural entre o lado Ariel (lirismo puro, virginal, idealista e melancólico) e o lado Caliban (ironia corrosiva, sarcasmo, grotesco, boemia e desmascaramento do próprio clichê romântico)
Metalinguagem poética e autocrítica romântica: como a ironia da 2ª Parte desmonta os excessos sentimentais da 1ª Parte
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: O significado do binômio Ariel vs. Caliban no prefácio de Álvares de Azevedo, o conceito de "Mal do Século" e a função desmistificadora da ironia romântica.
Problema-Marco: Fazer o close reading comparado de dois poemas de Lira dos Vinte Anos (um da Primeira Parte / polo Ariel e outro da Segunda Parte / polo Caliban), analisando métrica, campo lexical e a autorreflexividade irônica do eu lírico.
Macrotema 2.3: Projeto Nacional e Faces do Romantismo Brasileiro (José de Alencar)
Trilha: TRL-LIT-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-HUM:6.4
Modalidades de Prática: [Close Reading e Análise Formal], [Contextualização Histórico-Estética], [Análise Comparativa e Crítica]
Bibliografia e Capítulos: BIB-LIT-04 [Romance/Novela] (Partes 1–4); BIB-LIT-05 [Romance/Novela] (Caps. I–XXI); BIB-LIT-06 [Romance/Novela] (Partes 1–4)
Subtemas:
O programa literário de José de Alencar: mapear geograficamente e historicamente o Brasil recém-independente através de romances indianistas, urbanos e regionalistas
O Guarani (Indianismo): mitificação das origens brasileiras, Peri modelado segundo o cavaleiro medieval leal, natureza exuberante como cenário épico e aliança simbólica entre indígena e colonizadora (Ceci)
Lucíola (Romance Urbano / Perfil de Mulher): a corte carioca do Segundo Reinado, o poder corruptor do dinheiro e da hipocrisia social, a cortesã (Lúcia / Maria da Glória) e a tensão entre degradação física e pureza espiritual
Til (Romance Regionalista): o interior paulista (fazenda de café), personagens marginalizados (Berta, Brás, Jão Fera), presença tensa da escravidão e sinais de esgotamento das fórmulas idealistas do Romantismo
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: A tríade romântica em Alencar (indianista, urbano e regionalista), a construção idealizada do herói indígena em O Guarani e a crítica social ainda moralizada pelo viés romântico em Lucíola.
Problema-Marco: Comparar a representação do espaço e dos conflitos sociais nas três obras de Alencar (O Guarani, Lucíola e Til), avaliando o projeto de construção de identidade nacional no Império e suas omissões históricas (especialmente quanto à escravidão).
Macrotema 2.4: Anti-Romantismo e Dialética da Malandragem (Manuel Antônio de Almeida)
Trilha: TRL-LIT-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.3 | Pré-requisitos Cruzados: DOM-HUM:6.1
Modalidades de Prática: [Close Reading e Análise Formal], [Ensaio Crítico Literário]
Bibliografia e Capítulos: BIB-LIT-08 [Romance/Novela] (Partes I–II)
Subtemas:
Posição anômala na cronologia romântica (1852–1853): romance de costumes com verve satírica, prosa jornalística/coloquial e rejeição radical à grandiloquência sentimental
Retrato vivo das camadas livres médias e baixas no Rio de Janeiro de D. João VI ("Era no tempo do rei...") — ausência proposital das elites palacianas e da grande lavoura
O anti-herói picaresco (Leonardo filho), figuras populares (Comadre, Compadre, Major Vidigal) e a tese clássica de Antonio Candido sobre a "Dialética da Malandragem": a oscilação estrutural e permissiva entre o polo da Ordem e o polo da Desordem na sociedade brasileira
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Por que Memórias de um Sargento de Milícias subverte as convenções do Romantismo contemporâneo (Alencar), definição de romance picaresco e o conceito de Dialética da Malandragem (ordem ↔ desordem).
Problema-Marco: Redigir um ensaio curto analisando o episódio final de integração de Leonardo à ordem (via Major Vidigal) em contraste com a idealização moralista de Lucíola (2.3), discutindo como a forma cômica espelha a informalidade institucional brasileira.
NÍVEL 3: REALISMO, NATURALISMO E FANTÁSTICO DO SÉCULO XIX
Macrotema 3.1: Realismo Europeu, Estilo Indireto Livre e Crítica da Civilização (Flaubert & Eça de Queirós)
Trilha: TRL-LIT-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.1 | Pré-requisitos Cruzados: DOM-HUM:6.1
Modalidades de Prática: [Close Reading e Análise Formal], [Análise Comparativa e Crítica]
Bibliografia e Capítulos: BIB-LIT-09 [Romance/Novela] (Partes I–III); BIB-LIT-12 [Romance/Novela] (Caps. I–XVI)
Subtemas:
Gustave Flaubert (Madame Bovary): a revolução narrativa moderna — narrador impessoal/objetivo, busca obsessiva da palavra exata (le mot juste) e consolidação magistral do Discurso Indireto Livre (fusão irônica da voz do narrador com a consciência da personagem)
O fenômeno do Bovarismo: crítica corrosiva à educação sentimental romântica de Emma Bovary, ao tédio provinciano (Charles Bovary, Homais), ao consumo e à vacuidade burguesa
Eça de Queirós (A cidade e as serras): a fase final pós-realista/neorromântica de Eça; caricatura hilariante da hiper-civilização tecnológica e do tédio urbano parisiense (Jacinto no número 202 dos Campos Elísios — "Suma Ciência × Suma Potência") vs. o reencontro vitalizante e pragmático com o campo português em Tormes
Sátira ao cientificismo dogmático e ao excesso técnico sem sentido humano (ponte com a crítica da modernidade em DOM-HUM)
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Funcionamento técnico do Discurso Indireto Livre em Flaubert (distinto do discurso direto e indireto clássico), definição literária de bovarismo e contraste entre o tédio provinciano de Emma Bovary e o tédio hiper-urbano de Jacinto.
Problema-Marco: Selecionar um parágrafo de Madame Bovary com discurso indireto livre para fazer close reading minucioso e, em seguida, contrapor a visão crítica da província em Flaubert com a reconciliação irônica com o campo em A cidade e as serras.
Macrotema 3.2: O Realismo Machadiano — Narrador Não-Confiável e Ironia Estrutural (Machado de Assis)
Trilha: TRL-LIT-02 | Complexidade: 5/5 | Pré-requisitos Diretos: 2.3, 2.4, 3.1 | Pré-requisitos Cruzados: DOM-HUM:5.1, DOM-HUM:6.4
Modalidades de Prática: [Close Reading e Análise Formal], [Análise Comparativa e Crítica], [Ensaio Crítico Literário]
Bibliografia e Capítulos: BIB-LIT-10 [Romance/Novela] (Caps. I–CLX); BIB-LIT-11 [Romance/Novela] (Caps. I–CXLVIII)
Subtemas:
Memórias Póstumas de Brás Cubas (1881 — marco divisor da literatura brasileira): o defunto-autor liberto das convenções sociais, fragmentação narrativa em capítulos curtos e digressivos (diálogo com Sterne e Garrett), metalinguagem explícita com o leitor, filosofia satírica do Humanitismo (Quincas Borba — "Ao vencedor, as batatas!") e o "emplasto" como alegoria da vaidade senhorial
A forma literária como crítica social (análise de Roberto Schwarz): a volubilidade do narrador de classe proprietária em uma sociedade patriarcal, escravocrata e regida pela lógica do favor (Brás Cubas, Prudêncio, Marcela, Virgília)
Dom Casmurro (1899): o ápice técnico do Narrador Não-Confiável (Bento Santiago — advogado retórico construindo um libelo de acusação em causa própria contra Capitu), o silêncio estrutural de Capitu, a impossibilidade proposital de prova definitiva do adultério ("olhos de cigana oblíqua e dissimulada") e a tragédia do ciúme e da posse patriarcal
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Distinção absoluta entre Machado de Assis (autor) e Brás Cubas / Bento Santiago (narradores parciais e não-confiáveis), papel crítico do Humanitismo contra o darwinismo social/positivismo e por que reduzir Dom Casmurro à pergunta "Capitu traiu ou não traiu?" empobrece o dispositivo retórico central do romance.
Problema-Marco: Redigir um ensaio crítico (com citações textuais) desmontando a retórica persuasiva de Bento Santiago em Dom Casmurro ou a volubilidade senhorial de Brás Cubas no episódio de Prudêncio, comparando o realismo psicológico de Machado com o de Flaubert (3.1).
Macrotema 3.3: Naturalismo Determinista (O Cortiço) e Poética do Fantástico (Contos Fantásticos)
Trilha: TRL-LIT-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.1 | Pré-requisitos Cruzados: DOM-HUM:6.1
Modalidades de Prática: [Close Reading e Análise Formal], [Análise Comparativa e Crítica]
Bibliografia e Capítulos: BIB-LIT-13 [Romance/Novela] (Caps. I–XXIII); BIB-LIT-14 [Conto/Narrativa Curta] (Introdução de Italo Calvino e contos selecionados)
Subtemas:
Aluísio Azevedo (O Cortiço): o Naturalismo como radicalização cientificista do Realismo — determinismo do meio, da raça e do momento histórico (Hippolyte Taine), zoomorfização dos personagens e o cortiço São Romão como organismo vivo e protagonista coletivo
Anatomia do capitalismo periférico e do racismo em O Cortiço: acumulação primitiva e exploração brutal de Bertoleza por João Romão, ascensão burguesa (Miranda), o "abrasileiramento" de Jerônimo (Rita Baiana vs. Piedade) e o contraste entre o cortiço e o sobrado
Contos Fantásticos do Século XIX (seleção e ensaio de Italo Calvino): a contracorrente do século da ciência e do positivismo — distinção entre fantástico visionário e fantástico cotidiano; o critério da hesitação entre explicação natural e sobrenatural (Todorov); motivos recorrentes (o duplo, autômatos, espectros, pactos e fronteira entre razão e loucura)
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Diferença estética entre Realismo machadiano (psicológico/irônico) e Naturalismo de Aluísio Azevedo (determinista/biologizante/coletivo), função estrutural da personagem Bertoleza em O Cortiço e definição do fantástico como hesitação epistemológica.
Problema-Marco: Confrontar um excerto descritivo de O Cortiço (foco no determinismo material e sensorial) com um conto da antologia de Italo Calvino (foco na ruptura da lógica racional), demonstrando como o século XIX oscilou entre a fé absoluta na ciência e a angústia diante do inexplicável.
NÍVEL 4: PRÉ-MODERNISMO E MODERNISMO BRASILEIRO (1920–1940)
Macrotema 4.1: Pré-Modernismo, Conto Social e Tensões Pós-Abolição (Monteiro Lobato)
Trilha: TRL-LIT-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 3.2, 3.3 | Pré-requisitos Cruzados: DOM-HUM:6.4
Modalidades de Prática: [Close Reading e Análise Formal], [Contextualização Histórico-Estética]
Bibliografia e Capítulos: BIB-LIT-15 [Conto/Narrativa Curta] (Conto titular Negrinha e demais contos do volume)
Subtemas:
O Pré-Modernismo como período sincrético de transição (1902–1922): abandono do cosmopolitismo beletrista para expor as feridas do Brasil profundo, rural e republicano
Análise cerrada do conto Negrinha: a persistência da violência escravocrata após a Abolição de 1888 no ambiente doméstico oligárquico (Dona Inácia — hipocrisia religiosa e sadismo cotidiano), a boneca como breve epifania de humanidade e o desfecho trágico
Ironia amarga do narrador lobatiano, estilo enxuto de crônica/conto e debate crítico contemporâneo sobre as contradições ideológicas e raciais presentes na trajetória de Monteiro Lobato (ponte com DOM-HUM:6.4 e 6.5)
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Caracterização do Pré-Modernismo brasileiro, o uso da ironia narratorial para denunciar a falsa piedade religiosa de Dona Inácia e contextualização histórica crítica das contradições de Lobato sem anacronismo nem apagamento.
Problema-Marco: Realizar o close reading do conto Negrinha, destacando os recursos lexicais e irônicos que constroem o contraste entre a "virtuosa" Dona Inácia e a desumanização da criança, conectando o conto à sobrevivência de estruturas escravocratas na Primeira República.
Macrotema 4.2: Romance de 30 — Regionalismo Crítico, Seca e Marginalidade (Graciliano Ramos & Jorge Amado)
Trilha: TRL-LIT-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.3, 4.1 | Pré-requisitos Cruzados: DOM-HUM:5.4, DOM-HUM:6.4
Modalidades de Prática: [Close Reading e Análise Formal], [Análise Comparativa e Crítica], [Ensaio Crítico Literário]
Bibliografia e Capítulos: BIB-LIT-16 [Romance/Novela] (Caps. 1–13); BIB-LIT-17 [Romance/Novela] (Partes 1–3)
Subtemas:
Segunda Fase Modernista (Romance de 30): engajamento social, denúncia das desigualdades regionais e urbanas, e superação do exotismo pitoresco
Graciliano Ramos (Vidas Secas): estrutura de "romance desmontável" (13 capítulos quase autônomos formando ciclo fechado da seca), estilo rigorosamente econômico/seco, uso magistral do discurso indireto livre para dar voz interior a personagens de fala bloqueada (Fabiano, Sinhá Vitória, os meninos) e a inversão zoomorfização humana vs. humanização animal (a cachorra Baleia)
Jorge Amado (Capitães da Areia): romance urbano de Salvador (anos 1930), protagonismo coletivo dos meninos abandonados no trapiche (Pedro Bala, Professor, Sem-Pernas, Dora), contraste entre a retórica higienista da imprensa/reformatório e a solidariedade do grupo, presença viva do candomblé/capoeira (ponte com Edison Carneiro em DOM-HUM:6.4) e passagem da revolta individual à consciência política/grevista
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Relação direta entre a economia estilística ("estilo seco") e a temática da aridez em Vidas Secas, função narrativa de Baleia, e contraste estilístico entre o rigor conciso/introspectivo de Graciliano e o lirismo épico-popular/engajado de Jorge Amado.
Problema-Marco: Redigir um ensaio comparativo analisando como Vidas Secas (sertão) e Capitães da Areia (urbano) representam a exclusão social e a relação com as instituições de poder (soldado amarelo / patrão vs. polícia / reformatório / imprensa) através de duas poéticas narrativas completamente distintas.
Macrotema 4.3: Poesia Modernista Engajada e Consciência Histórica (Carlos Drummond de Andrade)
Trilha: TRL-LIT-00 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.2, 4.1 | Pré-requisitos Cruzados: DOM-HUM:2.1
Modalidades de Prática: [Close Reading e Análise Formal], [Contextualização Histórico-Estética]
Bibliografia e Capítulos: BIB-LIT-18 [Obra Épica/Poética] (Poemas completos de Sentimento do Mundo, 1940)
Subtemas:
A virada poética de Drummond em Sentimento do Mundo (1940): transição do eu lírico isolado/irônico (gauche de 1930) para o engajamento histórico-existencial frente à Segunda Guerra Mundial, ao fascismo e ao Estado Novo no Brasil
Análise cerrada de poemas estruturais: Sentimento do mundo ("Tenho apenas duas mãos e o sentimento do mundo"), Mãos dadas (recusa do escapismo romântico e da poesia de torre de marfim: "O tempo é a minha matéria, o tempo presente, os homens presentes"), Congresso Internacional do Medo, José (ou poemas de impotência/angústia do livro como Mundo grande e Os mortos de sobrecasaca)
Recursos formais drummondianos: verso livre de ritmo preciso, ironia contida, linguagem coloquial elevada a densidade filosófica, desconfiança da palavra fácil e tensão permanente entre o indivíduo solitário e o compromisso solidário
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: O significado histórico-estético de Mãos dadas como manifesto antipassadista e antiescapista, a evolução do conceito de gauche drummondiano e a técnica do verso livre com economia adjetiva.
Problema-Marco: Realizar o close reading completo de Mãos dadas e Sentimento do mundo, contrastando a postura do eu lírico diante do mundo e do tempo com o escapismo subjetivista de Álvares de Azevedo em Lira dos Vinte Anos (2.2).
NÍVEL 5: INVENÇÃO DA LINGUAGEM, EPIFANIA E DRAMATURGIA BRASILEIRA (1940–1977)
Macrotema 5.1: Recriação Linguística e Metafísica do Sertão (João Guimarães Rosa — Sagarana)
Trilha: TRL-LIT-02 | Complexidade: 5/5 | Pré-requisitos Diretos: 4.2 | Pré-requisitos Cruzados: DOM-LANG:5.1
Modalidades de Prática: [Close Reading e Análise Formal], [Ensaio Crítico Literário]
Bibliografia e Capítulos: BIB-LIT-19 [Conto/Narrativa Curta] (Os 9 contos de Sagarana, com destaque para O Burrinho Pedrês, Sarapalha e A Hora e Vez de Augusto Matraga)
Subtemas:
A revolução da Terceira Geração Modernista (1946): superação do regionalismo documental/sociológico de 30 pelo regionalismo universalizante e metafísico — o sertão de Minas Gerais como síntese do mundo ("o sertão é do tamanho do mundo")
Laboratório linguístico de Guimarães Rosa: neologismos por aglutinação e derivação, arcaísmos vivos, sintaxe inventiva, ritmo poético/aliteração na prosa, musicalidade e incorporação erudita da fala oral sertaneja (a própria palavra híbrida Sagarana: saga germânica + -rana tupi)
Análise de narrativas-chave: a sabedoria paciente de Sete-de-Ouros em O Burrinho Pedrês e a trajetória épico-espiritual de queda, penitência, violência e redenção em A Hora e Vez de Augusto Matraga (diálogo com a epopeia, o sagrado popular e o sertão jagunço)
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Etimologia e sentido estético do título Sagarana, diferença estrutural entre o regionalismo crítico de Graciliano Ramos e a transfiguração poético-linguística de Guimarães Rosa, e análise da jornada de redenção de Augusto Matraga.
Problema-Marco: Fazer o close reading de um trecho de A Hora e Vez de Augusto Matraga ou O Burrinho Pedrês (mapeando neologismos, ritmo sonoro, sintaxe oral e simbolismo ético-religioso) e contrapor a linguagem rosiana à secura estilística de Vidas Secas (4.2).
Macrotema 5.2: Epifania, Alteridade e Metalinguagem em Clarice Lispector
Trilha: TRL-LIT-02 | Complexidade: 5/5 | Pré-requisitos Diretos: 3.2, 4.2 | Pré-requisitos Cruzados: DOM-HUM:8.3
Modalidades de Prática: [Close Reading e Análise Formal], [Análise Comparativa e Crítica], [Ensaio Crítico Literário]
Bibliografia e Capítulos: BIB-LIT-20 [Conto/Narrativa Curta] (Contos completos de Laços de Família, destaque para Amor, A Imitação da Rosa e Feliz Aniversário); BIB-LIT-21 [Romance/Novela] (A Hora da Estrela)
Subtemas:
Laços de Família (1960): a revolução do conto intimista e existencial — dissolução do enredo factual externo em favor da experiência interior, fluxo de consciência, tempo psicológico e o instante de Epifania (choque súbito no cotidiano doméstico burguês — ex.: Ana vendo o cego mascando chicletes no bonde em Amor — revelando a náusea/vertigem da existência antes do retorno precário à ordem)
Crítica sutil às prisões afetivas da família burguesa e aos papéis femininos tradicionais (dona de casa, maternidade, decoro em Feliz Aniversário e A Imitação da Rosa)
A Hora da Estrela (1977): a guinada metalinguística e social da última Clarice — estrutura de dupla narrativa envolvendo a criação literária (o escritor-narrador masculino Rodrigo S.M. em crise ética diante da própria palavra) e a invisibilidade radical da datilógrafa alagoana Macabéa no Rio de Janeiro
Alteridade, pobreza material/simbólica, os treze títulos da novela, a morte como único momento de "estrela" e os limites éticos da representação literária do outro
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Definição precisa de epifania clariceana (desestabilização ontológica no banal), função estrutural da mediação pelo narrador masculino Rodrigo S.M. em A Hora da Estrela (por que Clarice não narra diretamente em 1ª pessoa como Macabéa) e diálogo temático entre Laços de Família e A Hora da Estrela.
Problema-Marco: Redigir um ensaio comparativo analisando a função da metalinguagem e da posição de classe do narrador em A Hora da Estrela (Rodrigo S.M. narrando Macabéa) e em Memórias Póstumas de Brás Cubas (3.2), complementado por close reading do momento epifânico do conto Amor.
Macrotema 5.3: Dramaturgia Brasileira — Consciência de Classe e Cultura Popular (Guarnieri & Osman Lins)
Trilha: TRL-LIT-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.4, 4.2 | Pré-requisitos Cruzados: DOM-HUM:5.4
Modalidades de Prática: [Close Reading e Análise Formal], [Análise Comparativa e Crítica]
Bibliografia e Capítulos: BIB-LIT-22 [Dramaturgia] (Atos 1–3); BIB-LIT-23 [Dramaturgia] (Atos 1–3)
Subtemas:
Fundamentos da análise do texto dramático: ação dramática, diálogo como motor de conflito (ausência de narrador), didascálias/rubricas, espaço cênico, tempo e ritmo
Gianfrancesco Guarnieri (Eles Não Usam Black-Tie, 1958 — marco do Teatro de Arena): o operário e a favela carioca levados pela primeira vez ao centro dramático do teatro brasileiro moderno; tensão entre projeto individualista de ascensão/casamento (Tião) e solidariedade coletiva de classe na greve (Otávio e Romana)
Osman Lins (Lisbela e o Prisioneiro, 1961): comédia romântica de costumes ambientada na delegacia do interior nordestino, intertextualidade e metalinguagem cinematográfica (Lisbela filtrando o mundo pelos filmes de Hollywood), o malandro sedutor (Leléu — herdeiro da linhagem de Leonardo em 2.4) e o choque entre código de honra sertanejo (Frederico Evandro) e esperteza popular
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Diferença estrutural entre texto narrativo e texto dramático (papel das rubricas e da ação dialogada), o dilema ético-político de Tião vs. Otávio em Eles Não Usam Black-Tie e o papel da metalinguagem cinematográfica em Lisbela e o Prisioneiro.
Problema-Marco: Comparar a construção cênica do conflito e do diálogo nas duas peças (realismo político-operário urbano em Guarnieri vs. farsa lírica nordestina metalinguística em Osman Lins), analisando uma cena-chave de cada obra a partir de suas rubricas e subtexto.
NÍVEL 6: LUSOFONIA AFRICANA E POÉTICA CONTEMPORÂNEA
Macrotema 6.1: Literatura Moçambicana, Oralidade e Memória Pós-Colonial (Mia Couto — Terra Sonâmbula)
Trilha: TRL-LIT-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 5.1 | Pré-requisitos Cruzados: DOM-HUM:6.3, DOM-HUM:6.4
Modalidades de Prática: [Close Reading e Análise Formal], [Análise Comparativa e Crítica], [Ensaio Crítico Literário]
Bibliografia e Capítulos: BIB-LIT-24 [Romance/Novela] (Caps. 1–11 + Cadernos de Kindzu)
Subtemas:
Contexto histórico-político de Moçambique pós-independência e guerra civil (anos 1980–1990 — ponte direta com o TellusPedia): a estrada parada, o machimbombo (ônibus) queimado e o país "sonâmbulo" em busca de identidade
Estrutura em narrativa encaixada/alternada: o caminho presente do menino amnésico Muidinga e do velho Tuahir entrelaçado à leitura dos Cadernos de Kindzu (a palavra escrita transformando fisicamente a paisagem ao redor)
Reinvenção poética da Língua Portuguesa na África lusófona: fusão entre a escrita literária e a tradição oral africana (provérbios, mitos, ancestralidade, realismo mágico/animista) e criação de neologismos poéticos (diálogo estético profundo com João Guimarães Rosa em 5.1)
A literatura e a imaginação como instrumentos de sobrevivência, cura da memória e reconstrução comunitária diante do trauma da guerra
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Funcionamento da narrativa espelhada/entrelaçada (Muidinga/Tuahir ↔ Cadernos de Kindzu), função do machimbombo queimado como alegoria de Moçambique e comparação estilística entre a invenção vocabular de Mia Couto e a de Guimarães Rosa.
Problema-Marco: Redigir um ensaio comparativo aproximando Terra Sonâmbula (Mia Couto) e Sagarana (Guimarães Rosa — 5.1), analisando como ambos subvertem o português normativo através da oralidade para universalizar experiências periféricas/pós-coloniais.
Macrotema 6.2: Poesia Contemporânea e Poética Urbana Periférica (Racionais MC's & César Magalhães Borges)
Trilha: TRL-LIT-00 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.3, 5.3 | Pré-requisitos Cruzados: DOM-HUM:6.4, DOM-HUM:7.4
Modalidades de Prática: [Close Reading e Análise Formal], [Análise Comparativa e Crítica], [Contextualização Histórico-Estética]
Bibliografia e Capítulos: BIB-LIT-25 [Obra Épica/Poética] (Faixas/poemas completos de Sobrevivendo no Inferno, com destaque para Capítulo 4, Versículo 3, Diário de um Detento e Tô Ouvindo Alguém Me Chamar); BIB-LIT-26 [Obra Épica/Poética] (Poemas selecionados de Ciclo da Lua)
Subtemas:
Sobrevivendo no Inferno (Racionais MC's — 1997): o rap legitimado como poesia épica contemporânea e crônica periférica — voz poética testemunhal, oralidade rítmica (flow), rimas internas, aliterações, assonâncias e estrutura cinematográfica de narrativa em versos
Intertextualidade religiosa e profética (Salmo 23, Apocalipse, tensão sagrado/profano), memória do Massacre do Carandiru (Diário de um Detento), denúncia do racismo estrutural, encarceramento em massa e violência urbana em São Paulo (ponte direta com Foucault em DOM-HUM:7.4 e Luiz Gama/Edison Carneiro em DOM-HUM:6.4)
Ciclo da Lua (César Magalhães Borges): exploração contemporânea da poesia lírica brasileira, ritmo, imagem poética, simbolismo lunar/temporal e diálogo entre a tradição lírica intimista e a poesia contemporânea de expressão urbana
Critérios de Aceite (DoD):
Conceitos/Estruturas Obrigatórios: Análise formal de Diário de um Detento ou Capítulo 4, Versículo 3 (eu lírico testemunhal, ritmo/rima, intertextualidade bíblica e estrutura épico-narrativa) e distinção entre a dicção épico-social dos Racionais e a dicção lírica de Ciclo da Lua / Drummond.
Problema-Marco: Realizar o close reading comparativo entre uma faixa narrativa de Sobrevivendo no Inferno (analisada estritamente como poema épico-contemporâneo) e um poema de Sentimento do Mundo (Drummond — 4.3) ou Os Lusíadas (Camões — 1.1), discutindo quem tem direito à voz épica na história da língua portuguesa.
