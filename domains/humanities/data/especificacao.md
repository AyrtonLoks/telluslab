ESPECIFICAÇÃO DE DOMÍNIO E REQUISITOS — TELLUSLAB (DOM-HUM: HUMANIDADES, HISTÓRIA, FILOSOFIA, CIÊNCIAS SOCIAIS E METACOGNIÇÃO)
## 1. ARQUITETURA PEDAGÓGICA E REQUISITOS DO DOMÍNIO (SRS / DOMAIN PACK)
1.0. Metadados do Pacote de Domínio (Domain Pack)
- domainId: DOM-HUM
- slug: humanities
- name: Humanidades, História, Filosofia, Ciências Sociais e Metacognição
- version: 1.0.0
- dominiosRelacionados: DOM-MATH, DOM-ECON, DOM-PROG, DOM-PHYS, DOM-ENG (meta-domínio transversal em Metacognição e núcleo conceitual direto do TellusPedia)
1.1. Modelagem de Trilhas de Conhecimento (DAG)
O currículo organiza-se em um Grafo Acíclico Dirigido (DAG) com seis trilhas paralelas, combinando uma trilha transversal de método/aprendizagem, quatro trilhas de formação humanística/científico-social e uma trilha paralela de comunicação e psicologia relacional:
- TRL-HUM-00 (Metacognição, Aprendizagem, Heurística e Método Científico): Ciência da aprendizagem, prática deliberada, heurística de resolução de problemas (Pólya), raciocínio probabilístico, dialética erística e metodologia de pesquisa/escrita acadêmica (Nível 1).
- TRL-HUM-01 (História da Filosofia, Epistemologia, Metafísica e Ética): Panorama filosófico, Platão, Aristóteles, Santo Agostinho, Descartes, Kant, Feuerbach, Marx (Manuscritos) e Leo Strauss (Níveis 2 e 7).
- TRL-HUM-02 (Filosofia Política, Estratégia, Poder e Liberdade): Sun Tzu, Maquiavel, La Boétie, Hobbes, Rousseau, Voltaire, Adam Smith (Sentimentos Morais), Mary Wollstonecraft, Bastiat, John Stuart Mill, Marx & Engels (Manifesto Comunista), Mises, Hayek e Michel Foucault (Níveis 4, 5 e 7).
- TRL-HUM-03 (Ciências Sociais: Sociologia, Antropologia, Raça e Pedagogia Crítica): Comte, Durkheim, Max Weber, Ruth Benedict, Claude Lévi-Strauss, Luiz Gama, Carter G. Woodson, Edison Carneiro e bell hooks (Nível 6).
- TRL-HUM-04 (Macro-História, Redes de Informação e Crítica da Modernidade): Dicionário de História do Mundo, trilogia de Yuval Noah Harari (Sapiens, Homo Deus, Nexus) e Ailton Krenak (Níveis 2 e 3).
- TRL-HUM-05 (Comunicação Não-Violenta, Empatia e Psicologia Relacional): Marshall Rosenberg (4 volumes), Coleção Inteligência Emocional HBR (Empatia), Stefanie Stahl, Philippa Perry, Ana Suy e Dolly Alderton (Nível 8 — trilha paralela autônoma).
1.2. Máquina de Estados Finita (FSM) de Proficiência por Macrotema
Cada Macrotema (X.Y) segue a máquina de estados padrão do TellusLab:
- S0 — BLOQUEADO: Pelo menos um macrotema listado em Pré-requisitos Diretos ainda não atingiu o estado S4 (PROVA_VALIDADA). (Arestas em Pré-requisitos Cruzados atuam como Soft Warning por padrão ou Hard Gate quando o Modo Estrito Interdisciplinar estiver ativo.)
- S1 — DISPONIVEL: Todos os pré-requisitos diretos atingiram S4 ou superior; pronto para iniciar estudo.
- S2 — TEORIA_CONCLUIDA: Leitura ativa e fichamento analítico das teses centrais, conceitos-chave, contexto histórico e estrutura argumentativa nas obras de referência.
- S3 — FIXACAO_MECANICA: Resolução de bateria prática (questões conceituais, mapeamento de argumentos, identificação de falácias/vieses ou exercícios de síntese comparativa) com aprovação ≥ 80%.
- S4 — PROVA_VALIDADA (Estado de Desbloqueio): Conceitos/Teses obrigatórios articulados sem consulta (incluindo contra-argumento forte / steelmanning) e Problema-Marco (ensaio estruturado, análise comparativa ou estudo de caso prático) aprovado. Libera nós dependentes no DAG e insere o macrotema no motor FSRS-5.
- S5 — REVISAO_EM_DIA: Em ciclo ativo de manutenção via FSRS-5.
- S6 — REVISAO_VENCIDA: Intervalo de retenção expirado; exige sessão de revisão antes de avançar em nós filhos.
1.3. Taxonomia de Modalidades de Estudo, Papéis Bibliográficos e Dificuldades
- Papéis da Bibliografia:
- [Fonte Primária]: Obra clássica ou tratado fundacional lido diretamente no texto original/traduzido (ex.: Platão, Aristóteles, Hobbes, Kant, Marx, Durkheim, Weber, Hayek, Foucault).
- [Síntese/Referência]: Panorama estruturado, macro-história ou obra de consulta cronológica/temática (ex.: Gaarder, Dicionário de História do Mundo, Harari).
- [Método/Heurística]: Ferramentas práticas de aprendizagem, resolução de problemas, pesquisa e pensamento crítico (ex.: Scott Young, Pólya, Debora Diniz, Mlodinow, Schopenhauer).
- [Prática Relacional]: Protocolos de comunicação, empatia, mediação de conflitos e psicologia aplicada (ex.: Rosenberg, HBR Empatia, Stahl, Perry, Suy, Alderton).
- Modalidades de Prática Exigidas por Macrotema:
- [Leitura Analítica e Fichamento Estrutural]: Reconstrução fiel de teses, premissas implícitas, definições conceituais e encadeamento lógico do autor.
- [Análise Comparativa e Crítica]: Contraponto sistemático entre autores/escolas, identificação de tensões históricas e teste de objeções fortes (steelmanning).
- [Ensaio e Argumentação Rigorosa]: Redação estruturada com problema delimitado, tese clara, evidência textual/histórica e refutação de contra-argumentos.
- [Aplicação Prática e Estudo de Caso]: Uso direto de heurísticas de Pólya, planos de ultralearning, auditoria de falácias em discursos reais ou mediação de conflitos por CNV.
- Tags de Dificuldade para Diagnóstico Regressivo:
- DIF-HUM-01 (Lacuna em Pré-requisito Conceitual, Histórico ou Cross-Domain)
- DIF-HUM-02 (Leitura Superficial / Caricatura ou Espantalho do Autor)
- DIF-HUM-03 (Anacronismo Histórico / Descontextualização de Conceitos)
- DIF-HUM-04 (Falha na Estrutura Argumentativa / Falácia / Salto Lógico)
- DIF-HUM-05 (Dificuldade em Formular Contra-Argumento Forte — Steelmanning)
- DIF-HUM-06 (Estouro de Tempo > 75 min)
1.4. Requisitos Funcionais (RF) do Módulo DOM-HUM
- RF-01 (Grafo Curricular e Caminho Crítico): Renderizar o DAG interativo dos 36 macrotemas de DOM-HUM com suporte à exibição de arestas cruzadas para DOM-MATH e DOM-ECON. Permitir selecionar qualquer macrotema ou obra-alvo (ex.: BIB-HUM-18 Crítica da Razão Pura ou BIB-HUM-35 A Sociedade Punitiva) para calcular via ordenação topológica o subgrafo mínimo pendente.
- RF-02 (Motor de Repetição Espaçada — FSRS-5): Agendar cartões derivados dos subtemas e critérios DoD de macrotemas em S4+, cobrindo: (a) definições rigorosas de conceitos filosóficos/sociológicos, (b) pares de contraste entre autores (ex.: Hobbes vs. Rousseau; Durkheim vs. Weber; Hayek vs. Marx), (c) cronologia de ideias e contextos históricos, e (d) heurísticas de Pólya, falácias e passos da CNV.
- RF-03 (Gerador de Sessões Intercaladas de 45–75 min): Montar sessões práticas de 45 a 75 minutos divididas em 50% avanço em tema ativo (S1–S3), 30% revisão vencida (S6) de trilhas distintas e 20% problemas mistos (ex.: análise de excerto não-identificado, detecção de falácias ou contraponto comparativo rápido).
- RF-04 (Trava de Solução e Revisão Socrática): Bloquear o comentário de referência até o registro obrigatório de tentativa (tempo cronometrado, fichamento/ensaio/estudo de caso submetido e tags de dificuldade). A IA atua como examinador rigoroso exigindo fidelidade ao texto primário, ausência de espantalho, contexto histórico e teste de steelmanning.
- RF-05 (Diagnóstico Regressivo Cross-Domain): Ao registrar DIF-HUM-01, percorrer as arestas reversas dentro de DOM-HUM (ex.: revisar Platão/Descartes ao travar em Kant) e também em DOM-ECON/DOM-MATH quando aplicável.
- RF-06 (Laboratório de Argumentação e Escrita Acadêmica): Para macrotemas com [Ensaio e Argumentação Rigorosa] ou [Análise Comparativa e Crítica], estruturar rubricas verificáveis (delimitação do objeto, tese, premissas, citações ABNT, objeção mais forte e réplica).
- RF-07 (Métricas Ponderadas e Ponte TellusPedia): Calcular progresso global, por trilha (TRL-HUM-00 a TRL-HUM-05) e por obra (BIB-HUM-01 a BIB-HUM-53), ponderado por Complexidade (1–5), exportável em snapshot JSON compatível com a rota /lab?domain=humanities do TellusPedia (alimentando diretamente os dossiês de História, Política, Filosofia, Sociologia, Antropologia e Figuras Importantes).
1.5. Requisitos Não-Funcionais, Integração e Radar de Lacunas
- RNF-01 (Renderização Editorial e Argumentativa): Suporte a citações formatadas (ABNT/APA), blocos de citação primária, linhas do tempo e diagramas Mermaid (mapas conceituais, árvores de argumentos e comparações entre escolas).
- RNF-02 (Persistência Local-First e Compatibilidade): Compatível com o mesmo schema SQLite/IndexedDB e snapshot JSON do TellusLab, usando IDs qualificados pelo namespace DOM-HUM.
- RNF-03 (Radar de Expansão Futura — Lacunas Conhecidas do Acervo Físico Atual): Este acervo físico não inclui obras dedicadas a: (a) Elos filosóficos clássicos/modernos estratégicos — Aristóteles (Ética a Nicômaco e Política), John Locke (Segundo Tratado sobre o Governo), David Hume (Investigação sobre o Entendimento Humano) e Hegel (Fenomenologia do Espírito); (b) Filosofia da Ciência do século XX (Karl Popper e Thomas Kuhn); e (c) Historiografia narrativa geral e Formação do Brasil (ex.: Eric Hobsbawm, Sérgio Buarque de Holanda, Caio Prado Jr. ou Boris Fausto). O domínio está preparado para incorporar essas obras no DAG sem quebra de IDs.
## 2. CATÁLOGO BIBLIOGRÁFICO (ACERVO BASE DOM-HUM)
2.1. Metacognição, Aprendizagem, Heurística e Método Científico
- BIB-HUM-01: Ultra-aprendizado — Scott H. Young
- BIB-HUM-02: O Código do Aprendizado — Scott H. Young
- BIB-HUM-03: How to Solve It — George Pólya
- BIB-HUM-04: Carta de uma orientadora — Debora Diniz
- BIB-HUM-05: O Andar do Bêbado — Leonard Mlodinow
- BIB-HUM-06: A arte de ter razão — Arthur Schopenhauer
2.2. História Geral, Macro-História, Tecnologia e Ecologia Política
- BIB-HUM-07: Dicionário de História do Mundo — Editora Autêntica
- BIB-HUM-08: Sapiens: Uma Breve História da Humanidade — Yuval Noah Harari
- BIB-HUM-09: Homo Deus: Uma Breve História do Amanhã — Yuval Noah Harari
- BIB-HUM-10: Nexus: Uma Breve História das Redes de Informação — Yuval Noah Harari
- BIB-HUM-11: Ideias para adiar o fim do mundo — Ailton Krenak
2.3. História da Filosofia, Metafísica, Epistemologia e Ética
- BIB-HUM-12: O Mundo de Sofia — Jostein Gaarder
- BIB-HUM-13: A República — Platão
- BIB-HUM-14: Sobre a alma — Aristóteles
- BIB-HUM-15: Sobre a mentira — Santo Agostinho
- BIB-HUM-16: Regras para a orientação do espírito — René Descartes
- BIB-HUM-17: Teoria dos sentimentos morais — Adam Smith
- BIB-HUM-18: Crítica da razão pura — Immanuel Kant
- BIB-HUM-19: A essência do cristianismo — Ludwig Feuerbach
- BIB-HUM-20: Manuscritos econômico-filosóficos — Karl Marx
- BIB-HUM-21: Direito natural e história — Leo Strauss
2.4. Filosofia Política, Estratégia, Poder e Liberdade
- BIB-HUM-22: A Arte da Guerra — Sun Tzu
- BIB-HUM-23: O Príncipe — Nicolau Maquiavel
- BIB-HUM-24: A arte da guerra — Nicolau Maquiavel
- BIB-HUM-25: Discurso sobre a servidão voluntária — Étienne de La Boétie
- BIB-HUM-26: Leviatã — Thomas Hobbes
- BIB-HUM-27: Discurso sobre a origem e os fundamentos da desigualdade entre os homens — Jean-Jacques Rousseau
- BIB-HUM-28: O preço da justiça — Voltaire
- BIB-HUM-29: Reivindicação dos direitos das mulheres — Mary Wollstonecraft
- BIB-HUM-30: A lei — Frédéric Bastiat
- BIB-HUM-31: Manifesto Comunista — Karl Marx, Friedrich Engels
- BIB-HUM-32: Sobre a liberdade — John Stuart Mill
- BIB-HUM-33: As seis lições — Ludwig von Mises
- BIB-HUM-34: O caminho da servidão — Friedrich Hayek
- BIB-HUM-35: A sociedade punitiva — Michel Foucault
2.5. Ciências Sociais: Sociologia, Antropologia, Relações Raciais e Educação
- BIB-HUM-36: Discurso sobre o espírito positivo — Auguste Comte
- BIB-HUM-37: As regras do método sociológico — Émile Durkheim
- BIB-HUM-38: Ciência e política: duas vocações — Max Weber
- BIB-HUM-39: Padrões de cultura — Ruth Benedict
- BIB-HUM-40: Antropologia estrutural — Claude Lévi-Strauss
- BIB-HUM-41: Humor e política: armas de pioneiro abolicionista — Luiz Gama
- BIB-HUM-42: A deseducação do negro — Carter G. Woodson
- BIB-HUM-43: Ladinos e crioulos — Edison Carneiro
- BIB-HUM-44: Ensinando a transgredir — bell hooks
2.6. Comunicação Não-Violenta, Empatia e Psicologia Relacional
- BIB-HUM-45: Vivendo a Comunicação Não Violenta — Marshall Rosenberg
- BIB-HUM-46: A linguagem da paz em um mundo de conflitos — Marshall Rosenberg
- BIB-HUM-47: O surpreendente propósito da raiva — Marshall Rosenberg
- BIB-HUM-48: Criar filhos compassivamente — Marshall Rosenberg
- BIB-HUM-49: Coleção Inteligência Emocional: Empatia — Harvard Business Review Press
- BIB-HUM-50: Acolhendo sua criança interior — Stefanie Stahl
- BIB-HUM-51: O livro que você gostaria que seus pais tivessem lido — Philippa Perry
- BIB-HUM-52: A gente mira no amor e acerta na solidão — Ana Suy
- BIB-HUM-53: Tudo o que eu sei sobre o amor — Dolly Alderton
## 3. TAXONOMIA GRANULAR DE MACROTEMAS, METADADOS E CRITÉRIOS DE ACEITE
NÍVEL 1: METACOGNIÇÃO, APRENDIZAGEM DELIBERADA, HEURÍSTICA E MÉTODO CIENTÍFICO
Macrotema 1.1: Ciência da Aprendizagem, Prática Deliberada e Ultralearning
- Trilha: TRL-HUM-00 | Complexidade: 2/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: Nenhum
|---|---|Modalidades de Prática: [Aplicação Prática e Estudo de Caso], [Leitura Analítica e Fichamento Estrutural]
- Bibliografia e Capítulos: BIB-HUM-01 [Método/Heurística] (Caps. 1–14); BIB-HUM-02 [Método/Heurística] (Caps. 1–12)
- Subtemas:
- Os 9 princípios do Ultralearning: Meta-aprendizado (mapa de conceitos, fatos e procedimentos), Foco, Prática Direta (Directness), Repetição Direcionada (Drilling), Recuperação Ativa (Retrieval), Feedback (de resultado, informativo e corretivo), Retenção, Intuição e Experimentação
- Ciência cognitiva da aprendizagem (O Código do Aprendizado): carga cognitiva (intrínseca, estranha e pertinente), memória de trabalho vs. memória de longo prazo, chunking e transferência de aprendizado
- Efeito de teste (testing effect), prática espaçada vs. em bloco, intercalação (interleaving) e técnica Feynman para diagnóstico de ilusão de competência
- Superação da procrastinação, gestão da frustração cognitiva e arquitetura de rotinas sustentáveis de estudo autônomo
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Distinção entre carga cognitiva intrínseca, estranha e pertinente; diferença entre reconhecimento passivo (reler/sublinhar) e recuperação ativa; e princípio de Drilling para eliminar o gargalo limitante.
- Problema-Marco: Desenhar um plano de projeto de Ultralearning de 8 semanas para um módulo real do TellusLab (ex.: um nível de DOM-MATH ou DOM-PROG), decompondo conceitos, fatos e procedimentos, definindo sessões de drilling, feedback e critérios objetivos de validação.
Macrotema 1.2: Heurística e Arte de Resolver Problemas (George Pólya)
- Trilha: TRL-HUM-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-MATH:2.3
- Modalidades de Prática: [Aplicação Prática e Estudo de Caso], [Leitura Analítica e Fichamento Estrutural]
- Bibliografia e Capítulos: BIB-HUM-03 [Método/Heurística] (Partes I–IV)
- Subtemas:
- O Método de Pólya em 4 fases: (1) Compreender o problema (incógnita, dados, condicionantes), (2) Traçar um plano, (3) Executar o plano (verificando cada passo) e (4) Retrospecto / Examinar a solução obtida
- Dicionário de Heurísticas: analogia, problema correlato mais simples, problema auxiliar, decomposição e recombinação, generalização, especialização (casos extremos/degenerados), trabalhar de trás para frente (análise regressiva) e variação das condições
- Raciocínio plausível vs. raciocínio demonstrativo (indução empírica e conjectura antes da prova formal)
- A importância da fase de Retrospecto: verificar simetria/dimensão, buscar um segundo caminho mais elegante e extrair o método transferível para problemas futuros
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: As 4 fases de Pólya com perguntas-guia operacionais, diferença entre generalização e especialização como heurísticas de desbloqueio e valor cognitivo da fase de retrospecto.
- Problema-Marco: Documentar a resolução passo a passo de 3 problemas não-triviais (de Matemática, Algoritmos ou Física) registrando explicitamente em um diário heurístico cada tentativa, especialização, analogia utilizada e o retrospecto final.
Macrotema 1.3: Epistemologia do Acaso, Vieses e Pensamento Probabilístico
- Trilha: TRL-HUM-00 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-MATH:7.2, DOM-ECON:6.3
- Modalidades de Prática: [Análise Comparativa e Crítica], [Aplicação Prática e Estudo de Caso]
- Bibliografia e Capítulos: BIB-HUM-05 [Método/Heurística] (Caps. 1–10)
- Subtemas:
- Papel estrutural da aleatoriedade na história, ciência, negócios e vida cotidiana; confusão humana entre ruído aleatório e habilidade/causalidade determinística
- Vieses estatísticos e cognitivos: falácia do apostador, mão quente (hot hand), Lei dos Pequenos Números, regressão à média e viés de confirmação (apofenia / ilusão de padrão)
- Probabilidade condicional e revisão de crenças pelo Teorema de Bayes (falsos positivos em diagnósticos médicos, judiciários e financeiros; problema de Monty Hall)
- Conexão entre a visão probabilística do acaso em Mlodinow e a crítica às caudas gordas / ilusão de controle em Taleb (DOM-ECON:6.3)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Explicação intuitiva e formal da regressão à média (por que punir mau desempenho e premiar desempenho extremo cria ilusão causal), viés de taxa-base (base rate fallacy) e distinção entre processo estocástico e narrativa retrospectiva.
- Problema-Marco: Auditar 3 notícias ou relatórios corporativos/econômicos reais identificando falácias de taxa-base, regressão à média ou atribuição indevida de causalidade ao ruído aleatório, propondo a análise probabilística correta.
Macrotema 1.4: Dialética Erística, Retórica e Detecção de Falácias (Schopenhauer)
- Trilha: TRL-HUM-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-MATH:2.2
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Aplicação Prática e Estudo de Caso]
- Bibliografia e Capítulos: BIB-HUM-06 [Método/Heurística] (Introdução e Estratagemas 1–38)
- Subtemas:
- Distinção entre Lógica (busca objetiva da verdade), Dialética e Dialética Erística (arte de parecer ter razão per fas et nefas — por bem ou por mal)
- Estrutura da refutação: refutação direta vs. indireta (apagoge / redução ao absurdo e contraexemplo / instância) e distinção entre argumento ad rem (sobre o objeto) vs. ad hominem / ex concessis (a partir das concessões do oponente)
- Taxonomia crítica dos 38 estratagemas de Schopenhauer: ampliação indevida (espantalho), homonímia/equivocação, petição de princípio, falsa dicotomia, desvio de assunto (mutatio controversiae), apelo à autoridade (ad verecundiam), apelo à plateia (ad auditores) e ataque pessoal final (ad personam)
- Protocolos defensivos para neutralizar estratagemas erísticos sem degradar o debate em hostilidade
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Distinção rigorosa entre argumento ad hominem (usar premissas do próprio adversário — ex concessis) e argumento ad personam (ofensa pessoal), e mecanismos de ampliação, equivocação e falsa dicotomia.
- Problema-Marco: Dissertar sobre a transcrição de um debate público ou artigo opinativo identificando e classificando ao menos 8 estratagemas erísticos/falácias formais presentes e redigindo respostas objetivas ad rem para cada um.
Macrotema 1.5: Metodologia de Pesquisa, Escrita Acadêmica e Ofício Intelectual
- Trilha: TRL-HUM-00 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.1, 1.4 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Ensaio e Argumentação Rigorosa], [Aplicação Prática e Estudo de Caso]
- Bibliografia e Capítulos: BIB-HUM-04 [Método/Heurística] (Capítulos completos)
- Subtemas:
- Delimitação rigorosa do objeto de pesquisa, formulação de pergunta investigativa e hipótese falseável
- Relação intelectual de orientação, autonomia crítica, ética na autoria e combate ao plágio
- Arquitetura do texto acadêmico: voz ativa, impessoalidade, coerência argumentativa, revisão em camadas (estrutura → parágrafo → frase) e aderência normativa (ABNT)
- Gestão emocional e disciplinar da escrita longa (superação do perfeccionismo paralisante e ritmo de produção contínua)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Diferença entre tema amplo e problema de pesquisa delimitado, papel das fontes primárias vs. secundárias e critérios de rigor e honestidade intelectual na escrita científica.
- Problema-Marco: Redigir um pré-projeto de ensaio ou artigo acadêmico (2 a 3 páginas, norma ABNT) contendo problematização, delimitação do objeto, revisão crítica preliminar de 3 fontes primárias da biblioteca e outline argumentativo completo.
NÍVEL 2: PANORAMA HISTÓRICO, FILOSOFIA ANTIGA E ANTIGUIDADE TARDIA
Macrotema 2.1: Panorama da História da Filosofia e Cronologia Histórica Mundial
- Trilha: TRL-HUM-01 | Complexidade: 2/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-12 [Síntese/Referência] (Capítulos completos); BIB-HUM-07 [Síntese/Referência] (Consulta cronológica e temática)
- Subtemas:
- Transição do pensamento mítico ao logos na Grécia Antiga: filósofos da natureza (pré-socráticos: Tales, Heráclito, Parmênides, Demócrito) e os Sofistas vs. Sócrates
- Grandes eras da história das ideias: Filosofia Clássica (Platão, Aristóteles), Helenismo (estoicismo, epicurismo, ceticismo), Idade Média (Agostinho, Tomás de Aquino), Renascimento e Revolução Científica
- Modernidade e contemporaneidade: Racionalismo (Descartes, Spinoza), Empirismo (Locke, Hume), Iluminismo, Idealismo Alemão (Kant, Hegel), Marx, Darwin, Freud e Existencialismo
- Ancoragem cronológica de impérios, revoluções, tratados e rupturas tecnológicas no Dicionário de História do Mundo (ponte direta com a Linha do Tempo do TellusPedia)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Eixo de tensão entre Heráclito (devir) e Parmênides (ser imutável), distinção epistemológica entre Racionalismo e Empirismo e localização cronológica correta dos grandes períodos filosóficos no contexto histórico mundial.
- Problema-Marco: Construir uma linha do tempo sincronizada (formato compatível com TellusPedia) conectando os 10 principais marcos filosóficos da Antiguidade ao século XX aos eventos geopolíticos e científicos contemporâneos a cada autor.
Macrotema 2.2: Platão — Justiça, Teoria das Formas e Arquitetura da Pólis
- Trilha: TRL-HUM-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.1 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-13 [Fonte Primária] (Livros I–X)
- Subtemas:
- Livro I–II: Crítica às definições convencionais de justiça (Céfalo, Polemarco), o desafio realista de Trasímaco ("a justiça é a conveniência do mais forte") e o experimento mental do Anel de Giges (Glauco)
- Analogia cidade-alma (Livros II–IV): tripartição da pólis (produtores, guardiões/auxiliares e filósofos-reis) e da alma (concupiscível, irascível e racional) e as quatro virtudes cardeais (sabedoria, coragem, temperança e justiça como harmonia)
- Epistemologia e Metafísica (Livros V–VII): Teoria das Formas (Ideias), Metáfora do Sol (Ideia do Bem), Linha Dividida (doxa/opinião vs. episteme/conhecimento científico) e Alegoria da Caverna
- Educação dialética dos governantes (incluindo o papel propedêutico da Matemática e Geometria na ascensão ao inteligível)
- Degeneração dos regimes políticos (Livros VIII–IX: aristocracia → timocracia → oligarquia → democracia → tirania) e crítica à arte mimética (Livro X)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Resposta de Sócrates ao Anel de Giges (justiça como saúde intrínseca da alma), os quatro segmentos da Linha Dividida e a crítica platônica à democracia desregulada que degenera em tirania.
- Problema-Marco: Redigir um ensaio crítico analisando o embate entre Trasímaco e Sócrates sobre a natureza da justiça e avaliando (com steelmanning para ambos os lados) o argumento platônico do governo dos filósofos frente às críticas modernas ao autoritarismo epistemológico.
Macrotema 2.3: Aristóteles — Psicologia Filosófica, Percepção e Intelecto
- Trilha: TRL-HUM-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.2 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-14 [Fonte Primária] (Livros I–III)
- Subtemas:
- Crítica aristotélica às teorias anteriores da alma (pré-socráticos e dualismo platônico) e fundamentação no Hilemorfismo (matéria/potência vs. forma/ato)
- Definição formal de alma (psyche) como "o ato primeiro de um corpo natural orgânico que possui a vida em potência" — unidade substancial corpo-alma
- Hierarquia das faculdades anímicas: alma vegetativa (nutrição/reprodução), alma sensitiva (percepção, desejo e locomoção) e alma intelectiva/racional
- Teoria da percepção sensorial (receber a forma sensível sem a matéria — metáfora da cera e do anel de sinete), sensíveis próprios, comuns e acidentais, sentido comum e imaginação (phantasia)
- Teoria do Intelecto (Nous — Livro III): intelecto passivo/potencial vs. intelecto agente/ativo, abstração de universais e o estatuto do pensamento discursivo
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Distinção fundamental entre o dualismo alma-corpo de Platão e o hilemorfismo de Aristóteles, as três faculdades da alma e o significado da recepção da forma sem matéria na percepção.
- Problema-Marco: Construir uma análise comparativa rigorosa entre a concepção de conhecimento e mente em Platão (Teoria das Formas / reminiscência) e Aristóteles (Sobre a alma / abstração sensorial), conectando o debate ao problema mente-corpo moderno.
Macrotema 2.4: Ética da Verdade, Intenção e Linguagem (Santo Agostinho)
- Trilha: TRL-HUM-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.2 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-15 [Fonte Primária] (Texto integral: De Mendacio)
- Subtemas:
- Definição rigorosa de mentira em Santo Agostinho: "falsa significação com vontade de enganar" (distinção crucial entre erro involuntário, ironia/ficção e mentira deliberada)
- O critério intencional interno: quem diz algo objetivamente verdadeiro acreditando ser falso para enganar mente; quem diz algo falso acreditando ser verdadeiro erra, mas não mente
- Taxonomia agostiniana dos oito graus de gravidade da mentira (da mentira em matéria de doutrina até a mentira dita para salvar alguém sem prejudicar ninguém)
- Tensão ética estrutural: deontologia absoluta (proibição universal da mentira por corromper a finalidade da linguagem e a confiança social) vs. consequencialismo/utilitarismo em dilemas extremos (ex.: esconder um inocente de um perseguidor)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Definição intencional de mentira em Agostinho (separando valor de verdade objetivo da intenção de engano) e os fundamentos do argumento deontológico contra a "mentira piedosa/útil".
- Problema-Marco: Redigir um ensaio ético analisando o dilema clássico de mentir para salvar um inocente sob a lente de Santo Agostinho (deontologia absoluta) contraposta ao utilitarismo (Mill) e à ética da responsabilidade (Weber).
NÍVEL 3: MACRO-HISTÓRIA, REDES DE INFORMAÇÃO, TECNOLOGIA E CRÍTICA DA MODERNIDADE
Macrotema 3.1: Revolução Cognitiva, Agrícola e Unificação da Humanidade (Sapiens)
- Trilha: TRL-HUM-04 | Complexidade: 2/5 | Pré-requisitos Diretos: 2.1 | Pré-requisitos Cruzados: DOM-ECON:2.4
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-08 [Síntese/Referência] (Partes 1–4); BIB-HUM-07 [Síntese/Referência] (Verbetes históricos de apoio)
- Subtemas:
- Revolução Cognitiva (~70 mil anos): linguagem flexível, cooperação flexível em larga escala e a distinção entre realidade objetiva, subjetiva e intersubjetiva (ordens imaginadas: nações, leis, dinheiro, corporações e direitos humanos)
- Revolução Agrícola: domesticação mútua, explosão demográfica vs. qualidade de vida individual, surgimento da escrita e da burocracia de registro
- Os três grandes vetores de unificação global da humanidade: ordem monetária (dinheiro como sistema universal de confiança mútua), ordem imperial e ordens religiosas universais
- Revolução Científica (~1500): admissão institucional da ignorância (ignoramus), método empírico-matemático e o ciclo de retroalimentação entre Ciência, Império e Capitalismo (crédito baseado na confiança no futuro)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Definição precisa de realidade intersubjetiva (e como ela se sustenta por redes coletivas de crença), argumento de Harari sobre a Revolução Agrícola como "armadilha" e o papel do crédito na expansão moderna.
- Problema-Marco: Analisar criticamente a tese das "ordens imaginadas" de Harari testando suas limitações historiográficas (o que a macro-história ilumina vs. onde simplifica processos locais e conflitos materiais) e conectá-la à noção de moeda/crédito em DOM-ECON.
Macrotema 3.2: Humanismo, Algoritmos e o Horizonte Pós-Humano (Homo Deus)
- Trilha: TRL-HUM-04 | Complexidade: 3/5 | Pré-requisitos Diretos: 3.1 | Pré-requisitos Cruzados: DOM-PROG:8.8
- Modalidades de Prática: [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-09 [Síntese/Referência] (Partes I–III)
- Subtemas:
- Superação histórica relativa das três grandes pragas (fome, peste e guerra) e a nova agenda tecnológica do século XXI (longevidade radical, engenharia da felicidade e aprimoramento humano)
- Humanismo moderno (liberal, socialista e evolutivo) e a transferência de autoridade da esfera cósmica/divina para a experiência subjetiva individual
- Desacoplamento entre Inteligência e Consciência: organismos interpretados como algoritmos bioquímicos e o impacto da IA e biotecnologia sobre trabalho, livre-arbítrio e desigualdade biológica
- A ascensão do Dataísmo como religião/paradigma de dados (fluxo livre de informação como valor supremo) e erosão da autoridade da decisão humana individual
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Distinção entre inteligência (capacidade de resolver problemas) e consciência (capacidade de sentir experiências subjetivas) e definição crítica do paradigma do Dataísmo.
- Problema-Marco: Escrever uma crítica técnica e filosófica à tese "organismos são algoritmos" e ao Dataísmo de Harari, confrontando-a com os limites computacionais formais (DOM-PROG/DOM-MATH) e a questão filosófica da consciência e liberdade humana.
Macrotema 3.3: História das Redes de Informação, Instituições e IA (Nexus)
- Trilha: TRL-HUM-04 | Complexidade: 3/5 | Pré-requisitos Diretos: 3.1, 3.2 | Pré-requisitos Cruzados: DOM-PROG:8.7
- Modalidades de Prática: [Análise Comparativa e Crítica], [Aplicação Prática e Estudo de Caso]
- Bibliografia e Capítulos: BIB-HUM-10 [Síntese/Referência] (Partes I–III)
- Subtemas:
- Crítica à visão ingênua da informação (mais informação não produz automaticamente mais verdade nem mais sabedoria): informação como ferramenta de conexão e ordem social
- Dinâmica histórica das redes humanas de informação: tradição oral, documentos sagrados (inflexibilidade canônica), burocracia e imprensa (papel na ciência moderna e na caça às bruxas)
- Democracias (redes distribuídas com mecanismos institucionais de autocorreção: ciência, imprensa livre, judiciário independente) vs. Totalitarismos (redes centralizadas sem autocorreção)
- Inteligência Artificial como Agente Alienígena de Informação: diferença estrutural entre ferramentas passivas (imprensa, rádio) e agentes autônomos capazes de decidir, criar novas ideias e otimizar engajamento em escala planetária
- Desafios contemporâneos de governança algorítmica, vigilância em massa, polarização e "cortina de silício" geopolítica
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Distinção entre verdade e ordem nas redes de informação, papel estrutural dos mecanismos de autocorreção em democracias e ciência, e por que a IA representa uma mudança de categoria frente às mídias anteriores (agência autônoma).
- Problema-Marco: Analisar um caso real de falha de rede de informação algorítmica (ex.: recomendação de conteúdo ou sistema de crédito automatizado), mapeando a ausência de mecanismos de autocorreção e propondo salvaguardas institucionais e técnicas.
Macrotema 3.4: Crítica da Modernidade, Antropoceno e Cosmovisões Indígenas (Krenak)
- Trilha: TRL-HUM-04 | Complexidade: 3/5 | Pré-requisitos Diretos: 3.1 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-11 [Fonte Primária] (Ensaios completos)
- Subtemas:
- Crítica ao conceito abstrato e homogeneizador de "humanidade" desconectada do organismo vivo da Terra ("clube da humanidade" excludente vs. povos da floresta)
- Crise climática e Antropoceno: alienação da relação sujeito-território (rios, montanhas e biomas como sujeitos de relação, não meras commodities extrativas)
- Crítica à ideologia do progresso linear infinito, do utilitarismo produtivista e da captura da subjetividade pelo consumo
- Epistemologias indígenas como alternativas concretas de imaginação política e ecológica ("paraquedas coloridos" e pluralidade de mundos)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Crítica de Krenak à separação natureza/cultura na modernidade ocidental e o sentido político-filosófico da expressão "adiar o fim do mundo".
- Problema-Marco: Elaborar um ensaio comparativo confrontando a visão tecno-histórica do Antropoceno em Harari (3.1–3.2) com a crítica cosmológica e ecológica de Ailton Krenak (3.4), identificando convergências e rupturas epistemológicas.
NÍVEL 4: REALISMO POLÍTICO, ESTRATÉGIA, CONTRATUALISMO E ESTADO MODERNO
Macrotema 4.1: Pensamento Estratégico Clássico e Teoria da Guerra (Sun Tzu & Maquiavel)
- Trilha: TRL-HUM-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.1 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-22 [Fonte Primária] (Caps. I–XIII); BIB-HUM-24 [Fonte Primária] (Livros I–VII)
- Subtemas:
- Sun Tzu (A Arte da Guerra): os cinco fatores fundamentais, vitória sem combate (subjugar a estratégia do inimigo), assimetria de informação, engano, economia de força, terreno, ímpeto (shi) e adaptação fluida
- Maquiavel (A arte da guerra): vínculo inseparável entre política republicana e organização militar, crítica feroz às tropas mercenárias, defesa da milícia cívica, disciplina, ordem de batalha e logística
- Diálogo estratégico entre Oriente Antigo (flexibilidade indireta e desbalanceamento) e Renascimento Europeu (organização institucional, disciplina cívica e batalha decisiva)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Hierarquia estratégica de Sun Tzu (atacar planos > alianças > exército > cidades fortificadas), crítica maquiaveliana aos mercenários e conexão entre instituições políticas e capacidade estratégica.
- Problema-Marco: Comparar a doutrina estratégica de Sun Tzu com a de Maquiavel em um estudo de caso histórico (ou corporativo/competitivo), demonstrando onde o enfoque indireto supera o confronto direto e onde a disciplina institucional é decisiva.
Macrotema 4.2: Realismo Político, Poder e Razão de Estado (Maquiavel — O Príncipe)
- Trilha: TRL-HUM-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.2, 4.1 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-23 [Fonte Primária] (Caps. I–XXVI)
- Subtemas:
- Ruptura fundadora da Ciência Política moderna: abandonar "repúblicas imaginárias" (crítica direta a Platão e aos espelhos de príncipes) para estudar a "verdade efetiva das coisas" (verità effettuale)
- Tipologia dos principados (hereditários, mistos, novos por virtude própria, por fortuna/armas alheias, por crime ou por consenso civil)
- A dialética central entre Virtù (capacidade estratégica, adaptação e energia política) e Fortuna (contingência histórica — a metáfora do rio torrencial e dos diques)
- Autonomia da moral política: ser amado vs. ser temido (sem ser odiado), a metáfora da raposa e do leão, economia da crueldade (bem aplicada de uma só vez vs. mal aplicada de forma contínua) e gestão das aparências
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Definição rigorosa de virtù e fortuna (evitando o senso comum caricatural de "maquiavélico"), por que Maquiavel separa ética privada de eficácia estatal e por que o príncipe deve acima de tudo evitar o ódio e o desprezo dos súditos.
- Problema-Marco: Redigir um ensaio analítico comparando a fundação ética da política em Platão (A República) com a autonomia realista da política em Maquiavel (O Príncipe), avaliando os limites morais da Razão de Estado.
Macrotema 4.3: Obediência, Tirania e Consentimento Político (Étienne de La Boétie)
- Trilha: TRL-HUM-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 4.2 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-25 [Fonte Primária] (Texto integral)
- Subtemas:
- O enigma político fundamental de La Boétie: como um único indivíduo frágil subjuga milhões sem possuir força física própria senão aquela que os próprios súditos lhe cedem?
- Os três mecanismos sustentadores da servidão voluntária: (1) o hábito/costume (primeira razão pela qual os homens servem de bom grado), (2) a mística, superstição e pão e circo (enfraquecimento cívico), e (3) a pirâmide de cumplicidade (a rede de pequenos tiranos e beneficiários que sustentam o tirano maior)
- Natureza da liberdade e da amizade (que só existe entre iguais, jamais em torno do tirano)
- A solução radical da desobediência civil: "decidi não mais servir e sereis livres" (retirada do consentimento como desmoronamento da base do poder)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Os três pilares da servidão voluntária (hábito, espetáculo/religião do poder e pirâmide de cúmplices) e o conceito de poder como relação relacional dependente de consentimento (não propriedade intrínseca do governante).
- Problema-Marco: Aplicar a matriz dos três mecanismos de La Boétie para analisar a estabilidade de um regime autoritário histórico (conectado ao TellusPedia), discutindo tanto o poder explicativo quanto os limites práticos da tese da retirada de consentimento (problema da ação coletiva).
Macrotema 4.4: Contratualismo Absoluto e Soberania Estatal (Thomas Hobbes — Leviatã)
- Trilha: TRL-HUM-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.2, 4.3 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-26 [Fonte Primária] (Partes I–IV)
- Subtemas:
- Antropologia mecanicista e nominalista (Parte I): sensação, linguagem, paixões, igualdade natural de capacidade de matar e as três causas de conflito (competição, desconfiança e glória)
- O Estado de Natureza como estado de guerra perpétua ("guerra de todos contra todos" — vida solitária, pobre, sórdida, embrutecida e curta)
- Direito de Natureza (jus naturale) vs. Leis de Natureza (lex naturalis — buscar a paz e cumprir pactos) e o problema da falta de espada que assegure os contratos
- Fundação do Estado (Leviatã — Parte II): pacto social de autorização, representação política, atributos indivisíveis e absolutos da soberania, liberdade dos súditos "no silêncio da lei" e o único limite inalienável (direito à autopreservação)
- Religião civil, crítica ao poder eclesiástico supranacional ("Reino das Trevas" — Partes III–IV) e subordinação da Igreja ao Estado soberano para evitar guerra civil
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Estrutura lógica do dilema de segurança no estado de natureza hobbesiano (análogo ao Dilema do Prisioneiro), distinção entre Direito Natural e Lei Natural, e por que em Hobbes o soberano não é parte contratante do pacto (sendo beneficiário absoluto dele).
- Problema-Marco: Confrontar diretamente Hobbes (Leviatã) e La Boétie (Servidão Voluntária) em um ensaio rigoroso: quando a centralização soberana protege contra a guerra civil e quando se converte na tirania denunciada por La Boétie?
Macrotema 4.5: Contratualismo Crítico, Desigualdade e Justiça Iluminista (Rousseau & Voltaire)
- Trilha: TRL-HUM-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.4 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-27 [Fonte Primária] (Partes I–II); BIB-HUM-28 [Fonte Primária] (Artigos completos)
- Subtemas:
- Rousseau (Discurso sobre a desigualdade): crítica metodológica a Hobbes (que projetou o homem social corrompido no estado de natureza); o homem natural guiado pelo amor de si (amour de soi) e pela piedade (pitié), e a faculdade ambígua da perfectibilidade
- Distinção entre desigualdade natural/física e desigualdade moral/política; gênese da propriedade privada ("o primeiro que cercou um terreno..."), transformação do amor de si em amor-próprio (amour-propre comparativo) e o "pacto iníquo" dos ricos institucionalizando a desigualdade via leis
- Voltaire (O preço da justiça): crítica iluminista radical à arbitrariedade penal do Antigo Regime, à tortura judicial, às penas desproporcionais (pena de morte para furtos menores) e à confusão entre pecado religioso e crime civil
- Princípios do direito penal racional iluminista: proporcionalidade entre delito e pena, presunção de inocência, publicidade dos julgamentos e tolerância civil
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Diferença entre amour de soi e amour-propre em Rousseau, tese rousseauniana de que a desigualdade política nasce da convenção/propriedade (e não da natureza) e princípios iluministas de proporcionalidade penal em Voltaire.
- Problema-Marco: Comparar sistematicamente o Estado de Natureza e a origem do Estado em Hobbes (4.4) e Rousseau (4.5), integrando a crítica iluminista de Voltaire sobre como as leis podem servir tanto à opressão quanto à garantia racional de justiça.
NÍVEL 5: FILOSOFIA MORAL, DIREITOS, LIBERALISMO CLÁSSICO, MARXISMO POLÍTICO E ESCOLA AUSTRÍACA
Macrotema 5.1: Filosofia Moral, Simpatia e o Espectador Imparcial (Adam Smith)
- Trilha: TRL-HUM-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.2, 4.5 | Pré-requisitos Cruzados: DOM-ECON:2.4
|---|---|Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-17 [Fonte Primária] (Partes I–VII)
- Subtemas:
- A Simpatia (Sympathy) em Adam Smith como faculdade imaginativa de colocar-se no lugar do outro e julgar a conveniência (propriety) das paixões e ações (não reduzida a mera piedade)
- O conceito do Espectador Imparcial ("o homem dentro do peito"): internalização do julgamento moral objetivo, consciência moral e desejo de ser digno de louvor (vs. mero desejo de louvor)
- Arquitetura das virtudes smithianas: Prudência (cuidado de si), Justiça (regra negativa rigorosa comparada à gramática — condição indispensável para a existência da sociedade) e Beneficência (ornamento voluntário)
- Resolução do chamado "Problema de Adam Smith": coerência orgânica entre a filosofia moral da Teoria dos Sentimentos Morais e a teoria econômica de A Riqueza das Nações (DOM-ECON:2.4)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Papel do Espectador Imparcial na formação do juízo moral, distinção smithiana entre Justiça (obrigatória e exata) e Beneficência (livre e meritória) e refutação da caricatura de que Smith defendia egoísmo amoral.
- Problema-Marco: Redigir um ensaio integrando Teoria dos Sentimentos Morais (DOM-HUM:5.1) e A Riqueza das Nações (DOM-ECON:2.4), demonstrando como o conceito de justiça e simpatia delimita o funcionamento legítimo dos mercados em Smith.
Macrotema 5.2: Emancipação, Igualdade de Gênero e Direitos Civis no Iluminismo (Wollstonecraft)
- Trilha: TRL-HUM-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 4.5 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-29 [Fonte Primária] (Caps. I–XIII)
- Subtemas:
- Expansão coerente do universalismo iluminista: crítica direta às contradições de Rousseau (que defende liberdade racional para os homens enquanto propõe educação submissa para Sofia no Emílio)
- A virtude exige razão e liberdade: refutação da ideia de "virtudes sexuais" distintas e crítica à educação voltada exclusivamente para a aparência e a dependência econômica
- Independência econômica, educação pública mista, participação civil/política e transformação do casamento de relação de tutela em parceria racional entre iguais
- Posição fundadora de Mary Wollstonecraft na história dos direitos humanos e do pensamento feminista moderno
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Argumento central de Wollstonecraft (se a virtude repousa na razão e as mulheres são seres racionais, negar-lhes educação e autonomia corrompe a própria moralidade social) e crítica direta ao modelo educacional de Rousseau.
- Problema-Marco: Construir um debate textual contrapondo os argumentos de Wollstonecraft às teses iluministas restritivas do século XVIII, avaliando como sua defesa da educação racional antecipa debates posteriores de cidadania (Mill e bell hooks).
Macrotema 5.3: Liberdade Individual, Utilitarismo e Limites da Lei (Mill & Bastiat)
- Trilha: TRL-HUM-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.5, 5.1 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-32 [Fonte Primária] (Caps. I–V); BIB-HUM-30 [Fonte Primária] (Texto integral)
- Subtemas:
- John Stuart Mill (Sobre a liberdade): ameaça da Tirania da Maioria (política e social/conformismo) em sociedades democráticas
- O Princípio do Dano (Harm Principle): o único fim pelo qual o poder pode ser legitimamente exercido sobre um indivíduo contra sua vontade é impedir dano a terceiros
- Defesa radical da liberdade de pensamento e expressão (Cap. II): falibilismo epistemológico, verdade parcial contida em opiniões adversárias e risco de a verdade não contestada degenerar em "dogma morto"
- Individualidade como elemento do bem-estar (Cap. III — "experimentos de vida") e limites práticos da intervenção estatal
- Frédéric Bastiat (A lei): direitos naturais (vida, liberdade e propriedade) anteriores à lei, perversão da lei em espoliação legal (legal plunder) e crítica ao paternalismo legislativo
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Enunciado preciso do Princípio do Dano de Mill, os quatro argumentos de Mill em defesa da liberdade de expressão (Cap. II) e o conceito de espoliação legal em Bastiat.
- Problema-Marco: Aplicar o Princípio do Dano de Mill e a crítica de Bastiat a dois dilemas regulatórios contemporâneos (ex.: regulação de plataformas digitais/discurso e paternalismo estatal em saúde/finanças), formulando objeções fortes (steelmanning) ao liberalismo clássico em cada caso.
Macrotema 5.4: Luta de Classes, Materialismo Histórico e Crítica Política (Marx & Engels — Manifesto Comunista)
- Trilha: TRL-HUM-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.5, 5.3 | Pré-requisitos Cruzados: DOM-ECON:2.5
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-31 [Fonte Primária] (Partes I–IV e Prefácios históricos)
- Subtemas:
- Formulação sintética do Materialismo Histórico: a história das sociedades como história da luta de classes impulsionada pelas contradições entre forças produtivas e relações de produção
- Parte I (Burgueses e Proletários): papel historicamente revolucionário da burguesia na dissolução do feudalismo, expansão global do mercado mundial, destruição de laços tradicionais ("tudo o que é sólido se desmancha no ar"), crises periódicas de superprodução e formação política da classe operária (proletariado)
- Parte II (Proletários e Comunistas): crítica à concepção liberal de propriedade privada dos meios de produção, família, nação e ideologia ("as ideias dominantes de uma época são as ideias da classe dominante"), e programa de transição histórica
- Parte III (Literatura Socialista e Comunista): diferenciação crítica frente ao socialismo reacionário, conservador/burguês e crítico-utópico (Saint-Simon, Fourier, Owen)
- Diálogo direto entre a crítica política revolucionária do Manifesto (1848) e a crítica econômica aprofundada em O Capital (DOM-ECON:2.5)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Tese do papel simultaneamente revolucionário e contraditório da burguesia na Parte I, distinção entre propriedade pessoal e propriedade privada burguesa (capital/meios de produção) e crítica de Marx/Engels aos socialistas utópicos.
- Problema-Marco: Elaborar uma análise comparativa rigorosa contrapondo as concepções de lei, propriedade, Estado e liberdade em Bastiat/Mill (5.3) e no Manifesto Comunista (5.4), contextualizando historicamente os debates de 1848–1859.
Macrotema 5.5: Liberalismo Econômico, Problema do Conhecimento e Planejamento Central (Mises & Hayek)
- Trilha: TRL-HUM-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 5.3, 5.4 | Pré-requisitos Cruzados: DOM-ECON:2.2, DOM-ECON:2.4, DOM-ECON:2.5
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-33 [Fonte Primária] (Lições 1–6); BIB-HUM-34 [Fonte Primária] (Caps. I–XVI)
- Subtemas:
- Ludwig von Mises (As seis lições): síntese do capitalismo (soberania do consumidor e produção em massa), crítica ao cálculo econômico sob socialismo (impossibilidade de alocação racional sem preços de mercado para meios de produção), dinâmica do intervencionismo, inflação monetária, investimento externo e políticas de desenvolvimento
- Friedrich Hayek (O caminho da servidão): distinção entre planejamento competitivo (Estado de Direito / Rule of Law com regras gerais e impessoais) vs. planejamento econômico centralizado (coerção discricionária)
- O Problema do Conhecimento Disperso: por que a informação econômica é local, tácita e fragmentada, tornando o sistema de preços um mecanismo insubstituível de coordenação espontânea
- Tese central de Hayek: o controle econômico total tende estruturalmente a concentrar poder político, suprimir dissidência e erodir liberdades civis ("por que os piores chegam ao topo" em regimes totalitários)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Argumento do cálculo econômico de Mises, argumento do conhecimento disperso de Hayek, distinção hayekiana entre Rule of Law (regras formais gerais) e planejamento substantivo, e diferenciação explícita entre o argumento de Hayek (1944) e caricaturas contra qualquer forma de rede de proteção social (que o próprio Hayek admitia no Cap. IX).
- Problema-Marco: Construir um ensaio dialético de alto nível estruturando o grande debate do século XX entre planejamento/crítica do capital (Marx — 5.4 e DOM-ECON:2.5) e coordenação de mercado/liberdade política (Mises & Hayek — 5.5), testando as melhores objeções (steelmanning) de ambos os campos.
NÍVEL 6: CIÊNCIAS SOCIAIS — SOCIOLOGIA CLÁSSICA, ANTROPOLOGIA, RAÇA E PEDAGOGIA CRÍTICA
Macrotema 6.1: Positivismo e Fundação Metodológica da Sociologia (Comte & Durkheim)
- Trilha: TRL-HUM-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.1, 4.5 | Pré-requisitos Cruzados: DOM-MATH:7.1
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-36 [Fonte Primária] (Partes I–III); BIB-HUM-37 [Fonte Primária] (Prefácios e Caps. I–VI)
- Subtemas:
- Auguste Comte (Discurso sobre o espírito positivo): Lei dos Três Estados (teológico, metafísico e positivo/científico), classificação enciclopédica das ciências (da Matemática à Sociologia / "Física Social") e lema ordem e progresso
- Émile Durkheim (As regras do método sociológico): fundação do objeto próprio e autônomo da sociologia — o Fato Social definido por suas três características (exterioridade, coercitividade e generalidade)
- Regra metodológica fundamental de Durkheim: "tratar os fatos sociais como coisas", afastar sistematicamente as prenoções (senso comum) e construir definições objetivas por caracteres exteriores
- Distinção entre o normal e o patológico (o crime como fato social normal dentro de taxas estruturais), constituição de tipos sociais e a regra da explicação sociológica ("a causa determinante de um fato social deve ser buscada entre os fatos sociais antecedentes", não na psicologia individual)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Lei dos Três Estados de Comte, as três propriedades definidoras do Fato Social em Durkheim e o significado metodológico de "tratar fatos sociais como coisas" (objetivação analítica, não materialismo grosseiro).
- Problema-Marco: Selecionar um fenômeno contemporâneo (ex.: uso de redes sociais, endividamento ou padrões educacionais) e formular um desenho de investigação seguindo estritamente as regras metodológicas de Durkheim (afastamento de prenoções, indicadores externos mensuráveis e causas sociais antecedentes).
Macrotema 6.2: Sociologia Compreensiva, Ciência e Política como Vocações (Max Weber)
- Trilha: TRL-HUM-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 6.1 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-38 [Fonte Primária] (Conferências I e II: A ciência como vocação e A política como vocação)
- Subtemas:
- Contraste metodológico com Durkheim: individualismo metodológico, ação social dotada de sentido subjetivo e sociologia compreensiva (Verstehen)
- A ciência como vocação: racionalização, intelectualização e desencantamento do mundo; o papel da ciência moderna (clareza sobre meios, consequências e pressupostos, jamais ditar valores últimos — neutralidade axiológica / separação entre juízo de fato e juízo de valor) e o "politeísmo dos valores"
- A política como vocação: definição sociológica clássica do Estado ("comunidade humana que reivindica o monopólio do uso legítimo da força física dentro de um território")
- Os três tipos puros de dominação legítima (tradicional, carismática e racional-legal/burocrática) e o político profissional (viver para a política vs. viver da política)
- O dilema ético supremo da ação política: Ética da Convicção (agir pela pureza absoluta dos princípios) vs. Ética da Responsabilidade (responder pelas consequências previsíveis das ações) e sua síntese madura
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Definição weberiana de Estado, os três tipos de dominação legítima, tese do desencantamento do mundo e a tensão entre Ética da Convicção e Ética da Responsabilidade.
- Problema-Marco: Comparar o método sociológico de Durkheim (holismo / fato social) com o de Weber (ação social / Verstehen) e analisar uma decisão histórica de estadista (via TellusPedia) sob a lente da Ética da Convicção vs. Ética da Responsabilidade.
Macrotema 6.3: Antropologia Cultural e Estruturalismo (Ruth Benedict & Claude Lévi-Strauss)
- Trilha: TRL-HUM-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 6.1 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-39 [Fonte Primária] (Caps. I–VIII); BIB-HUM-40 [Fonte Primária] (Partes I–V)
- Subtemas:
- Ruth Benedict (Padrões de cultura): escola culturalista norte-americana (herança de Franz Boas), crítica radical ao determinismo biológico/racial e ao evolucionismo unilinear, relativismo cultural e conceito de "configurações culturais" integradas (estudos comparados dos Zuni/apolíneos, Dobu e Kwakiutl/dionisíacos) e relatividade cultural da noção de "normalidade" psicológica
- Claude Lévi-Strauss (Antropologia estrutural): importação do método da linguística estrutural (Saussure e Jakobson — fonologia e sistemas de relações inconscientes) para a antropologia
- Análise estrutural do parentesco (átomo do parentesco, tabu do incesto como passagem da natureza à cultura e sistemas de aliança/troca), organização social (estruturas dualistas) e análise estrutural dos mitos (mitemas, feixes de relações e mediação de oposições binárias universais)
- Eficácia simbólica (xamanismo e paralelo crítico com a psicanálise) e diferença entre estrutura (modelo lógico inconsciente) e relações sociais empíricas
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Distinção metodológica entre o culturalismo particularista de Benedict (padrões singulares de cada cultura) e o estruturalismo universalista de Lévi-Strauss (estruturas inconscientes da mente humana), conceito de eficácia simbólica e papel do tabu do incesto na teoria da aliança.
- Problema-Marco: Analisar um mito ou ritual contemporâneo (ex.: rituais cívicos, esportivos ou narrativas tecnológicas) aplicando primeiro a lente de "padrão cultural" de Ruth Benedict e depois a decomposição em oposições binárias/mitemas de Lévi-Strauss.
Macrotema 6.4: Pensamento Abolicionista, Relações Raciais e Formação Afro-Brasileira (Luiz Gama & Edison Carneiro)
- Trilha: TRL-HUM-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.1, 6.1 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-41 [Fonte Primária] (Seleção de textos políticos, jurídicos e satíricos); BIB-HUM-43 [Fonte Primária] (Ensaios completos)
- Subtemas:
- Luiz Gama (Humor e política: armas de pioneiro abolicionista): trajetória intelectual e jurídica no Brasil Império, uso estratégico da sátira, da poesia (Bodarrada) e da imprensa abolicionista para desmascarar a hipocrisia escravocrata e o racismo das elites
- Ação jurídico-política de Luiz Gama: uso rigoroso da própria legalidade imperial (ex.: Lei Feijó de 1831) para libertar centenas de escravizados nos tribunais e formulação radical do direito à liberdade e à resistência
- Edison Carneiro (Ladinos e crioulos): historiografia e etnografia rigorosa da experiência negra no Brasil, distinção histórica entre escravizados ladinos (africanos aculturados) e crioulos (nascidos no Brasil), agência política e resistência quilombola (Palmares e insurreições urbanas)
- Formação cultural e religiosa afro-brasileira (candomblés da Bahia, sincretismo vs. preservação de matrizes africanas) e desconstrução do mito da passividade e da democracia racial harmônica
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Estratégia retórico-jurídica de Luiz Gama (ironia política + uso da Lei de 1831 contra a escravidão ilegal), significado historiográfico de "ladinos" e "crioulos" em Edison Carneiro e centralidade da agência/resistência negra na formação do Brasil.
- Problema-Marco: Redigir um dossiê histórico-crítico (no padrão acadêmico do TellusPedia) integrando Luiz Gama e Edison Carneiro para analisar como o aparato jurídico, a resistência quilombola e a cultura afro-brasileira moldaram a transição do Brasil Império à República.
Macrotema 6.5: Educação, Poder, Raça e Pedagogia Emancipatória (Woodson & bell hooks)
- Trilha: TRL-HUM-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 6.2, 6.4 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Aplicação Prática e Estudo de Caso]
- Bibliografia e Capítulos: BIB-HUM-42 [Fonte Primária] (Caps. I–XVIII); BIB-HUM-44 [Fonte Primária] (Caps. 1–14)
- Subtemas:
- Carter G. Woodson (A deseducação do negro): análise crítica de como currículos eurocêntricos e instituições educacionais produzem dependência psicológica, desvalorização histórica e desconexão entre intelectuais escolarizados e suas comunidades de origem
- Tese central de Woodson: controle do pensamento como forma mais profunda de controle social e defesa de uma educação historicamente enraizada voltada à autonomia comunitária e econômica
- bell hooks (Ensinando a transgredir): Pedagogia Engajada, diálogo criativo com Paulo Freire (crítica à "educação bancária" vs. conscientização/práxis) e Thich Nhat Hanh (integração mente-corpo-espírito)
- Sala de aula como espaço político e democrático: interseccionalidade de raça, gênero e classe no currículo, papel da linguagem, vulnerabilidade pedagógica do docente e educação como prática de liberdade
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Diagnóstico de "deseducação" em Woodson (diferença entre instrução técnica subalternizante e educação emancipatória), conceito de Pedagogia Engajada em bell hooks e crítica compartilhada ao modelo bancário de ensino.
- Problema-Marco: Avaliar criticamente um currículo tradicional de ensino (ou a própria arquitetura curatorial de uma plataforma educacional como o TellusPedia/TellusLab) à luz de Woodson e bell hooks, propondo critérios concretos de pluralidade epistemológica e protagonismo do estudante.
NÍVEL 7: EPISTEMOLOGIA MODERNA, CRÍTICA DA ALIENAÇÃO, PODER PUNITIVO E DIREITO NATURAL
Macrotema 7.1: Racionalismo e Fundamentos do Método Científico Moderno (Descartes)
- Trilha: TRL-HUM-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.2, 2.3 | Pré-requisitos Cruzados: DOM-MATH:2.1, DOM-MATH:2.3
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica]
- Bibliografia e Capítulos: BIB-HUM-16 [Fonte Primária] (Regras I–XXI)
- Subtemas:
- Unidade fundamental do conhecimento humano (humana sapientia) vs. fragmentação escolástica das disciplinas (Regra I)
- Os dois atos seguros do intelecto (Regra III): Intuição (apreensão imediata, clara e distinta pela luz natural da razão) e Dedução (encadeamento necessário de intuições)
- O ideal da Mathesis Universalis (Regra IV): a Matemática (ordem e medida) como paradigma universal de rigor científico
- Método analítico-sintético (Regras V–VII): redução de proposições complexas/obscuras a naturezas simples, enumeração completa e revisão contínua para evitar saltos de memória (ponte histórica direta com as heurísticas de Pólya no Tema 1.2)
- Representação espacial/geométrica de grandezas e preparação do programa cartesiano para a geometria analítica e a física matemática moderna
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Distinção cartesiana entre intuição e dedução, definição de Mathesis Universalis e comparação estrutural entre o método de redução a naturezas simples de Descartes e o método heurístico de Pólya.
- Problema-Marco: Reconstruir a estrutura lógica das Regras I–XII de Descartes e redigir uma análise crítica avaliando até que ponto o ideal cartesiano da Mathesis Universalis funda a ciência matemática moderna e onde encontra seus limites nas ciências humanas e empíricas.
Macrotema 7.2: Idealismo Transcendental e os Limites da Razão (Kant — Crítica da Razão Pura)
- Trilha: TRL-HUM-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 2.3, 7.1 | Pré-requisitos Cruzados: DOM-MATH:2.1, DOM-PHYS:1.1
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-18 [Fonte Primária] (Prefácios A/B, Introdução, Estética Transcendental, Analítica Transcendental e Dialética Transcendental)
- Subtemas:
- A "Revolução Copernicana" na epistemologia: não é nosso conhecimento que se regula passivamente pelos objetos, mas os objetos de experiência que se conformam às condições a priori da nossa sensibilidade e entendimento
- Taxonomia fundamental dos juízos: analíticos vs. sintéticos; a priori vs. a posteriori — e a pergunta central da obra: "Como são possíveis os juízos sintéticos a priori?" (na Matemática Pura, na Física Pura e a impossibilidade na Metafísica dogmática)
- Estética Transcendental: Espaço e Tempo não são coisas-em-si nem meros conceitos empíricos, mas formas puras a priori da intuição sensível
- Analítica Transcendental: sensibilidade (intuições) + entendimento (conceitos) — "pensamentos sem conteúdo são vazios, intuições sem conceitos são cegas"; as 12 Categorias puras do entendimento (quantidade, qualidade, relação — substância/causalidade — e modalidade), Dedução Transcendental, Eu Penso (unidade sintética da apercepção) e Esquematismo
- Distinção axial entre Fenômeno (objeto tal como nos aparece sob espaço, tempo e categorias — campo legítimo da ciência) e Númeno / Coisa-em-si (conceito-limite incognoscível pela razão teórica)
- Dialética Transcendental: a ilusão transcendental inevitável da razão ao buscar o incondicionado — Paralogismos da Alma, as Quatro Antinomias Cosmológicas (finitude vs. infinitude, determinismo vs. liberdade) e a refutação das provas teóricas da existência de Deus (ontológica, cosmológica e físico-teológica)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Explicação precisa da Revolução Copernicana de Kant, distinção rigorosa entre os 4 tipos de juízo (com exemplos de juízo sintético a priori), diferença entre Fenômeno e Númeno, e por que a causalidade é condição de possibilidade da experiência (resposta a Hume) válida apenas para fenômenos.
- Problema-Marco: Redigir um ensaio filosófico rigoroso expondo como Kant supera simultaneamente o racionalismo dogmático (Descartes) e o empirismo cético, analisando criticamente como a Física moderna (geometrias não-euclidianas e relatividade — DOM-PHYS:5.1) tensiona a Estética Transcendental kantiana.
Macrotema 7.3: Materialismo, Crítica da Religião e Teoria da Alienação (Feuerbach & Marx)
- Trilha: TRL-HUM-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 5.4, 7.2 | Pré-requisitos Cruzados: DOM-ECON:2.5
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-19 [Fonte Primária] (Introdução e Partes I–II); BIB-HUM-20 [Fonte Primária] (Primeiro, Segundo e Terceiro Manuscritos)
- Subtemas:
- Ludwig Feuerbach (A essência do cristianismo): inversão antropológica da teologia — "o segredo da teologia é a antropologia"; a religião como projeção alienada dos predicados mais elevados do gênero humano (razão, vontade, amor) num ser transcendente, empobrecendo o ser humano concreto para enriquecer Deus
- Karl Marx (Manuscritos econômico-filosóficos de 1844): apropriação crítica da inversão sujeito-predicado de Feuerbach e acerto de contas com a dialética idealista de Hegel, transferindo a análise da alienação da esfera religiosa para a esfera material do trabalho e da economia política
- As Quatro Dimensões do Trabalho Estranhado/Alienado (Entfremdung): (1) alienação do trabalhador em relação ao produto de seu trabalho, (2) alienação no próprio ato da produção, (3) alienação do ser genérico (Gattungswesen — atividade criativa livre reduzida a mero meio de subsistência), e (4) alienação do ser humano em relação aos outros seres humanos
- Propriedade privada como consequência (e depois causa recíproca) do trabalho alienado, o poder inversor do dinheiro (ter vs. ser) e a ponte entre o humanismo filosófico do jovem Marx (1844) e a crítica econômica madura de O Capital (DOM-ECON:2.5)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Mecânica da inversão sujeito-predicado na crítica religiosa de Feuerbach, formulação exata das 4 dimensões da alienação nos Manuscritos de Marx e explicação de como Marx ultrapassa Feuerbach ao historicizar a essência humana na práxis social.
- Problema-Marco: Traçar em um ensaio estruturado a linha de continuidade e ruptura entre Feuerbach (Essência do cristianismo), o jovem Marx (Manuscritos de 1844) e o Marx maduro (O Capital — fetichismo da mercadoria em DOM-ECON:2.5), testando a atualidade analítica do conceito de alienação no trabalho tecnológico contemporâneo.
Macrotema 7.4: Genealogia do Poder, Vigilância e Sociedade Punitiva (Michel Foucault)
- Trilha: TRL-HUM-02 | Complexidade: 5/5 | Pré-requisitos Diretos: 4.4, 6.2 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-35 [Fonte Primária] (Aulas de 3 de janeiro a 28 de março de 1973 — Collège de France)
- Subtemas:
- Os quatro grandes esquemas históricos de tática punitiva da sociedade: excluir (banimento), resgatar/compensar, marcar (suplício corporal) e encerrar (prisão) — e o enigma histórico da generalização súbita da forma-prisão no final do século XVIII/início do XIX
- Crítica à visão convencional de que a prisão nasceu apenas do humanismo iluminista: a noção de guerra civil como matriz analítica das lutas de poder (invertendo Hobbes) e transformação do criminoso em "inimigo social"
- A ligação estrutural entre a forma-prisão (punição medida em tempo subtraído) e a forma-salário na acumulação capitalista industrial: disciplina dos corpos, fixação da força de trabalho e gestão diferencial dos ilegalismos (ilegalismos populares de bens vs. ilegalismos de direitos)
- Emergência da Sociedade Disciplinar (vigilância contínua, exame, normalização, panoptismo) e a tese foucaultiana do Poder-Saber (poder não apenas como repressão negativa, mas como rede produtiva de normas, saberes e subjetividades)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Os quatro esquemas punitivos analisados por Foucault, conceito de "gestão diferencial dos ilegalismos", nexo histórico entre forma-prisão (tempo de detenção) e forma-salário (tempo de trabalho) e caráter produtivo/relacional do poder em contraste com o modelo jurídico-soberano de Hobbes.
- Problema-Marco: Confrontar em um ensaio analítico a visão iluminista da reforma penal em Voltaire (O preço da justiça — 4.5) e a concepção de monopólio da força em Hobbes/Weber (4.4 e 6.2) com a genealogia da prisão e dos ilegalismos em Foucault (A sociedade punitiva — 7.4).
Macrotema 7.5: Direito Natural, Historicismo e Crise da Filosofia Política Moderna (Leo Strauss)
- Trilha: TRL-HUM-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 2.2, 4.4, 6.2 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Leitura Analítica e Fichamento Estrutural], [Análise Comparativa e Crítica], [Ensaio e Argumentação Rigorosa]
- Bibliografia e Capítulos: BIB-HUM-21 [Fonte Primária] (Introdução e Caps. I–VI)
- Subtemas:
- A tese da crise contemporânea do Ocidente: a rejeição do Direito Natural conduz ao relativismo niilista (incapacidade da razão de distinguir entre justiça e tirania)
- Crítica filosófica ao Historicismo (Cap. I — redução de toda verdade à sua época histórica, gerando autocontradição performativa) e crítica direta ao Positivismo Valorativo de Max Weber (Cap. II — rejeição da separação estrita fato/valor na ciência social, pois descrever crueldade ou tirania já envolve juízos de valor)
- Origem filosófica da ideia de Direito Natural na descoberta grega da Natureza (physis) em contraste com a Convenção (nomos) (Cap. III)
- Direito Natural Clássico (Platão, Aristóteles e Tomás de Aquino — teleológico, orientado à excelência/virtude humana e aos deveres na pólis) vs. Direito Natural Moderno (Cap. V — ruptura iniciada por Maquiavel e consolidada por Hobbes e Locke: substituição de deveres/virtude por direitos subjetivos e pelo mínimo denominador comum da autopreservação)
- A crise do direito natural moderno em Rousseau e Edmund Burke (Cap. VI), preparando a guinada historicista do século XIX
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Crítica straussiana à separação fato/valor de Max Weber, autocontradição do historicismo radical e contraste estrutural entre Direito Natural Clássico (fim mais alto / virtude) e Direito Natural Moderno (começo mais baixo / autopreservação e direitos subjetivos).
- Problema-Marco: Organizar um debate analítico de síntese do curso inteiro opondo Leo Strauss (defesa do Direito Natural clássico contra o positivismo e o historicismo) a Max Weber (neutralidade axiológica — 6.2), Hobbes (direito natural moderno — 4.4) e Foucault (genealogia histórica — 7.4).
NÍVEL 8: COMUNICAÇÃO NÃO-VIOLENTA, EMPATIA E PSICOLOGIA DAS RELAÇÕES HUMANAS (TRILHA PARALELA)
Macrotema 8.1: Comunicação Não-Violenta (CNV), Mediação de Conflitos e Gestão da Raiva (Rosenberg)
- Trilha: TRL-HUM-05 | Complexidade: 2/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Aplicação Prática e Estudo de Caso], [Leitura Analítica e Fichamento Estrutural]
- Bibliografia e Capítulos: BIB-HUM-45 [Prática Relacional] (Capítulos completos); BIB-HUM-46 [Prática Relacional] (Capítulos completos); BIB-HUM-47 [Prática Relacional] (Texto integral); BIB-HUM-48 [Prática Relacional] (Texto integral)
- Subtemas:
- Comunicação alienante da vida (julgamentos moralizadores, rótulos, comparações, exigências disfarçadas e negação de responsabilidade) vs. Comunicação Não-Violenta (CNV)
- Os Quatro Componentes da CNV: (1) Observação concreta sem avaliação/julgamento, (2) Sentimentos autênticos (distintos de "falsos sentimentos" que escondem acusações como "sinto-me ignorado"), (3) Necessidades humanas universais subjacentes (distintas de estratégias específicas) e (4) Pedidos claros, positivos, concretos e negociáveis (distintos de exigências)
- Escuta empática profunda ("escutar o 'por favor' ou 'obrigado' por trás de qualquer fala agressiva") e autoempatia
- O propósito funcional da raiva: a raiva como sinal de alarme valioso indicando pensamentos acusatórios desconectados de necessidades vivas — protocolo em 4 passos para transformar raiva em diálogo construtivo
- Mediação de conflitos de alta tensão (pessoais, organizacionais e comunitários) e parentalidade compassiva (substituição de punição/recompensa por conexão e limites claros)
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Distinção rigorosa entre observação e avaliação, sentimento vs. pensamento acusatório, necessidade universal vs. estratégia particular, e pedido vs. exigência (testado pela reação ao "não").
- Problema-Marco: Pegar 5 diálogos reais ou simulados de conflito (ambiente de trabalho técnico, família ou relacionamento), diagnosticar os padrões de comunicação alienante e reescrever cada interação integralmente nos 4 passos da CNV, incluindo uma mediação de raiva intensa.
Macrotema 8.2: Empatia, Inteligência Emocional, Vínculos Familiares e Esquemas Internos
- Trilha: TRL-HUM-05 | Complexidade: 2/5 | Pré-requisitos Diretos: 8.1 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Aplicação Prática e Estudo de Caso], [Leitura Analítica e Fichamento Estrutural]
- Bibliografia e Capítulos: BIB-HUM-49 [Prática Relacional] (Artigos selecionados HBR); BIB-HUM-50 [Prática Relacional] (Partes I–III); BIB-HUM-51 [Prática Relacional] (Partes 1–6)
- Subtemas:
- Empatia na Inteligência Emocional e liderança (HBR Press): a tríade de Daniel Goleman (empatia cognitiva, empatia emocional e preocupação empática), limites saudáveis para evitar fadiga por compaixão e impacto da segurança psicológica em equipes de alta performance (ponte com o 5º Ideal de DevOps em DOM-PROG:5.4)
- Padrões de apego e herança relacional intergeracional (Philippa Perry): como experiências precoces moldam reações automáticas na vida adulta, reparação de rupturas relacionais (mais importante que a perfeição) e escuta sem invalidação emocional
- Esquemas internos e autoconhecimento (Stefanie Stahl): metáfora da "criança sombra" (crenças nucleares limitantes e estratégias de defesa/compensação) vs. "criança sol" (recursos internos, autonomia e valores) e o papel do "adulto consciente" na autorregulação emocional
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Distinção entre empatia cognitiva, empatia emocional e preocupação empática (e riscos do excesso de cada uma), princípio da ruptura-e-reparação nos vínculos e mapeamento gatilho → crença nuclear → mecanismo de defesa → resposta consciente.
- Problema-Marco: Construir um protocolo pessoal/profissional de inteligência emocional aplicando a tríade da empatia (HBR) a um cenário de liderança/feedback difícil e realizar um mapeamento estruturado de gatilho-crença-estratégia de proteção segundo Stahl e Perry.
Macrotema 8.3: Psicanálise do Amor, Solidão e Subjetividade Contemporânea
- Trilha: TRL-HUM-05 | Complexidade: 2/5 | Pré-requisitos Diretos: 8.2 | Pré-requisitos Cruzados: Nenhum
- Modalidades de Prática: [Aplicação Prática e Estudo de Caso], [Leitura Analítica e Fichamento Estrutural]
- Bibliografia e Capítulos: BIB-HUM-52 [Prática Relacional] (Capítulos completos); BIB-HUM-53 [Prática Relacional] (Capítulos completos)
- Subtemas:
- Perspectiva psicanalítica dos vínculos (Ana Suy): o amor como encontro entre duas faltas e não como fusão completadora; diferença entre solidão (estrutura constitutiva da subjetividade que permite o encontro real com a alteridade) e desamparo/isolamento
- Idealização, transferência, expectativa narcísica e a tensão entre o desejo de segurança e a abertura ao imprevisto do outro
- Crônica cultural e amadurecimento afetivo contemporâneo (Dolly Alderton): amizade como pilar estrutural da vida adulta, pressões sociais sobre relacionamentos românticos na era digital e transição da validação externa para autonomia afetiva
- Critérios de Aceite (DoD):
- Conceitos/Teses Obrigatórios: Distinção psicanalítica entre solidão constitutiva e isolamento, crítica à fantasia de "completude romântica" (fusão) como apagamento da alteridade e função da amizade na arquitetura relacional adulta.
- Problema-Marco: Redigir uma reflexão crítica articulando a noção de alteridade/falta em Ana Suy (8.3) com os princípios de responsabilidade emocional e necessidades em Rosenberg/Perry (8.1–8.2), analisando como limites saudáveis preservam simultaneamente a individualidade e o vínculo.
