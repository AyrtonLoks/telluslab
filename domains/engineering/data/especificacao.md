ESPECIFICAÇÃO DE DOMÍNIO E REQUISITOS — TELLUSLAB (DOM-ENG: ENGENHARIA MECÂNICA, AUTOMOTIVA, MECATRÔNICA E OPTOMECÂNICA)
## 1. ARQUITETURA PEDAGÓGICA E REQUISITOS DO DOMÍNIO (SRS / DOMAIN PACK)
1.0. Metadados do Pacote de Domínio (Domain Pack)
domainId: DOM-ENG
slug: engineering
name: Engenharia (Mecânica, Potência, Automotiva, Mecatrônica e Optomecânica)
version: 1.0.0
dominiosRelacionados: DOM-MATH, DOM-PHYS, DOM-PROG (pré-requisitos cruzados opcionais ou estritos configuráveis no TellusLab)
1.1. Modelagem de Trilhas de Conhecimento (DAG)
O currículo não é linear; após vencer a base de Metrologia, Materiais, Resistência dos Materiais e Elementos de Máquinas, divide-se em um Grafo Acíclico Dirigido (DAG) com cinco trilhas paralelas e arestas cruzadas com Matemática (DOM-MATH), Física (DOM-PHYS) e Programação (DOM-PROG):
TRL-ENG-00 (Fundamentos de Engenharia, Materiais e Mecânica dos Sólidos): Padrões/normas, metrologia, tolerâncias ISO/GD&T, metalurgia, compósitos/vidros, resistência dos materiais e elementos de máquinas (Nível 1).
TRL-ENG-01 (Termofluidos Aplicados e Sistemas de Potência): Escoamento em dutos, aerodinâmica, máquinas de fluxo (bombas/compressores/turbinas), transferência de calor/trocadores, combustão, ciclos a vapor/gás e refrigeração (Níveis 2 e 3).
TRL-ENG-02 (Engenharia Automotiva, Dinâmica Veicular e Propulsão): Dinâmica longitudinal/lateral de veículos, motores de combustão interna, transmissões, chassi/freios (ABS/ESP) e powertrains híbridos/elétricos (Nível 4).
TRL-ENG-03 (Eletroeletrônica, Instrumentação, Controle e Mecatrônica): Eletrotécnica/eletrônica de potência, sensores/atuadores, controle em malha fechada (PID), redes embarcadas (CAN/LIN/Ethernet) e ADAS (Nível 5).
TRL-ENG-04 (Engenharia Optomecânica, Fabricação e Metrologia de Precisão): Fabricação de espelhos ópticos, polimento com piche, metrologia quantitativa (Foucault/Couder/Ronchi/interferência), parabolização, engenharia estrutural de grandes aberturas, células de flutuação, treliças e tribologia (Níveis 6 e 7).
1.2. Máquina de Estados Finita (FSM) de Proficiência por Macrotema
Cada Macrotema (X.Y) segue a máquina de estados padrão do TellusLab:
S0 — BLOQUEADO: Pelo menos um macrotema listado em Pré-requisitos Diretos ainda não atingiu o estado S4 (PROVA_VALIDADA). (Arestas em Pré-requisitos Cruzados com DOM-MATH, DOM-PHYS ou DOM-PROG atuam como Soft Warning por padrão ou Hard Gate quando o Modo Estrito Interdisciplinar estiver ativo.)
S1 — DISPONIVEL: Todos os pré-requisitos diretos atingiram S4 ou superior; pronto para iniciar estudo.
S2 — TEORIA_CONCLUIDA: Leitura ativa e fichamento das normas técnicas, equações de projeto, propriedades de materiais e critérios de falha nas obras de referência.
S3 — FIXACAO_MECANICA: Resolução de bateria prática (memorial de cálculo, dimensionamento, leitura de diagramas/tabelas e análise de trade-offs de projeto) com taxa de acerto ≥ 80%.
S4 — PROVA_VALIDADA (Estado de Desbloqueio): Critérios de projeto e equações obrigatórias validados sem consulta e Problema-Marco (Capstone de projeto/dimensionamento/simulação) concluído e verificado. Libera nós dependentes no DAG e insere o macrotema no motor FSRS-5.
S5 — REVISAO_EM_DIA: Em ciclo ativo de manutenção via FSRS-5.
S6 — REVISAO_VENCIDA: Intervalo de retenção expirado; exige sessão de revisão antes de avançar em nós filhos.
1.3. Taxonomia de Modalidades de Estudo, Papéis Bibliográficos e Dificuldades
Papéis da Bibliografia:
[Handbook/Referência]: Compêndio condensado de equações de projeto, tabelas de materiais, normas e correlações empíricas (ex.: Eshbach, Kent's Power).
[Sistemas/Industrial]: Visão integrada de engenharia de sistemas, arquitetura eletromecânica, normas industriais e controle moderno (ex.: Manual Bosch).
[Fabricação/Oficina]: Procedimentos detalhados de manufatura de precisão, metrologia experimental e controle de processo (ex.: Texereau).
[Projeto Optomecânico]: Metodologia aplicada de projeto estrutural, equilíbrio, tribologia e gestão térmica em instrumentos de precisão (ex.: Kriege & Berry).
Modalidades de Prática Exigidas por Macrotema:
[Dimensionamento e Projeto]: Cálculo estrutural, térmico, fluidodinâmico ou mecânico com definição explícita de fator de segurança, materiais e tolerâncias.
[Análise de Sistemas e Trade-offs]: Comparação de arquiteturas de propulsão, ciclos termodinâmicos, sensores, redes embarcadas e decisões de engenharia de produto.
[Simulação e Cálculo Numérico]: Implementação em Python/planilha de curvas de desempenho, redução de dados de Foucault/Couder, balanços térmicos, controladores PID e dinâmica veicular.
[Normas, Metrologia e Falhas]: Verificação de critérios de falha (von Mises, flambagem, cavitação, erro RMS óptico), ajustes ISO/GD&T e diagnósticos de modos de falha (FMEA).
Tags de Dificuldade para Diagnóstico Regressivo:
DIF-ENG-01 (Lacuna em Pré-requisito Interno, DOM-MATH, DOM-PHYS ou DOM-PROG)
DIF-ENG-02 (Erro de Conversão de Unidades / SI vs. Imperial / Fator de Segurança)
DIF-ENG-03 (Escolha Inadequada de Material / Critério de Falha / Correlação Empírica)
DIF-ENG-04 (Falha no Balanço de Massa, Energia, Momento ou Esforços Internos)
DIF-ENG-05 (Subestimação de Efeitos Secundários — ex.: fadiga, cavitação, térmica, stick-slip, borda caída)
DIF-ENG-06 (Estouro de Tempo > 75 min)
1.4. Requisitos Funcionais (RF) do Módulo DOM-ENG
RF-01 (Grafo Curricular e Caminho Crítico): Renderizar o DAG interativo dos 28 macrotemas de DOM-ENG com suporte à exibição de arestas cruzadas para DOM-MATH, DOM-PHYS e DOM-PROG. Permitir selecionar qualquer macrotema ou obra-alvo (ex.: BIB-ENG-03 Manual Bosch ou BIB-ENG-05 The Dobsonian Telescope) para calcular via ordenação topológica o subgrafo mínimo pendente.
RF-02 (Motor de Repetição Espaçada — FSRS-5): Agendar cartões derivados dos subtemas e critérios DoD de macrotemas em S4+, cobrindo: (a) critérios de falha e fórmulas de dimensionamento, (b) interpretação de diagramas clássicos (Moody, Ferro-Carbono, Mollier, círculo de Mohr), (c) trade-offs de arquitetura veicular/mecatrônica e (d) diagnóstico de defeitos ópticos e estruturais.
RF-03 (Gerador de Sessões Intercaladas de 45–75 min): Montar sessões práticas de 45 a 75 minutos divididas em 50% avanço em tema ativo (S1–S3), 30% revisão vencida (S6) de trilhas distintas e 20% problemas mistos de dimensionamento/diagnóstico de falhas.
RF-04 (Trava de Solução e Revisão Socrática): Bloquear a solução comentada até o registro obrigatório de tentativa (tempo cronometrado, memorial de cálculo/diagrama/código submetido e tags de dificuldade). A IA cobra explicitamente coerência de unidades, verificação do fator de segurança e checagem de restrições físicas de fabricação.
RF-05 (Diagnóstico Regressivo Cross-Domain): Ao registrar DIF-ENG-01, percorrer as arestas reversas dentro de DOM-ENG e também em DOM-PHYS, DOM-MATH e DOM-PROG para injetar micro-revisões direcionadas.
RF-06 (Sandbox de Memorial de Cálculo e Simulação): Para macrotemas com [Simulação e Cálculo Numérico], gerar especificações em Python com testes de sanidade de engenharia (balanço de energia/massa fechado, convergência de fator de atrito, limites térmicos/estruturais e validação de fator de segurança).
RF-07 (Métricas Ponderadas e Ponte TellusPedia): Calcular progresso global, por trilha (TRL-ENG-00 a TRL-ENG-04) e por obra (BIB-ENG-01 a BIB-ENG-05), ponderado por Complexidade (1–5), exportável em snapshot JSON compatível com a rota /lab?domain=engineering do TellusPedia (conectando dossiês de revoluções industriais, matrizes energéticas, transporte, aeroespacial e observatórios).
1.5. Requisitos Não-Funcionais, Integração e Radar de Lacunas
RNF-01 (Renderização de Engenharia): Suporte a KaTeX (equações de projeto e balanços), blocos de código Python, tabelas de propriedades/normas e diagramas Mermaid/SVG (fluxogramas de ciclos de potência, diagramas de blocos de controle, treliças e topologias de powertrain).
RNF-02 (Persistência Local-First e Compatibilidade): Compatível com o mesmo schema SQLite/IndexedDB e snapshot JSON do TellusLab, usando IDs qualificados pelo namespace DOM-ENG.
RNF-03 (Radar de Expansão Futura — Lacunas Conhecidas do Acervo Físico Atual): Como Eshbach, Kent's e Bosch atuam como handbooks/manuais condensados de referência (além do mini Formulário de Matemática, Física e Química de Bergman como consulta rápida de bolso), o acervo físico atual não inclui livros-texto didáticos dedicados a: (a) Resistência dos Materiais e Elementos de Máquinas (ex.: Hibbeler/Beer & Johnston e Shigley), (b) Transferência de Calor e Mecânica dos Fluidos de Engenharia (ex.: Incropera/Bergman e Fox & McDonald), (c) Engenharia de Controle Clássico e Moderno (ex.: Ogata ou Nise), e (d) Ciência dos Materiais e Processos de Fabricação (ex.: Callister e Groover). O domínio está preparado para incorporar essas referências sem alterar o DAG.
## 2. CATÁLOGO BIBLIOGRÁFICO (ACERVO BASE DOM-ENG)
2.1. Fundamentos Gerais de Engenharia e Sistemas de Potência
BIB-ENG-01: Handbook of Engineering Fundamentals (2nd Edition — Wiley Handbook Series) — Ovid W. Eshbach
BIB-ENG-02: Kent's Mechanical Engineers' Handbook: Power (12th Edition — Wiley Handbook Series) — J. Kenneth Salisbury (Ed.)
2.2. Engenharia Automotiva, Eletromecânica e Mecatrônica
BIB-ENG-03: Manual de Tecnologia Automotiva (Editora Blucher) — Robert Bosch GmbH
2.3. Engenharia Optomecânica e Fabricação Óptica de Precisão
BIB-ENG-04: How to Make a Telescope (Willmann-Bell) — Jean Texereau
BIB-ENG-05: The Dobsonian Telescope: A Practical Manual for Building Large Aperture Telescopes (Willmann-Bell) — David Kriege, Richard Berry
## 3. TAXONOMIA GRANULAR DE MACROTEMAS, METADADOS E CRITÉRIOS DE ACEITE
NÍVEL 1: FUNDAMENTOS DE ENGENHARIA, METROLOGIA, MATERIAIS E MECÂNICA APLICADA
Macrotema 1.1: Padrões de Engenharia, Metrologia, Tolerâncias e Ajustes
Trilha: TRL-ENG-00 | Complexidade: 2/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: DOM-PHYS:1.1, DOM-MATH:7.1
|---|---|Projeto], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-01 [Handbook/Referência] (Seções 1–3); BIB-ENG-03 [Sistemas/Industrial] (Seções: Grandezas, Unidades e Tolerâncias)
Subtemas:
Sistemas de unidades técnicos (SI vs. sistema gravitacional/imperial em handbooks clássicos: lbf, lbm, slug, BTU, psi, hp) e fatores exatos de conversão
Análise dimensional aplicada à engenharia e grupos adimensionais (Teorema dos Π de Buckingham)
Metrologia dimensional industrial: exatidão, precisão, repetibilidade, resolução e cadeia de incertezas de medição
Sistema ISO de tolerâncias e ajustes (furo-base vs. eixo-base; ajustes com folga, incertos e com interferência)
Fundamentos de Tolerâncias Geométricas e Dimensionais (GD&T: planicidade, circularidade, cilindricidade, perpendicularidade, concentricidade e batimento) e rugosidade superficial (Ra, Rz)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Distinção rigorosa entre lbm e lbf (fator g_c), especificação correta de ajuste ISO (ex.: H7/g6 vs. H7/p6) e interpretação funcional de rugosidade Ra e tolerâncias geométricas.
Problema-Marco: Elaborar a folha de especificações metrológicas de um conjunto eixo-rolamento-mancal definindo tolerâncias ISO (folga e interferência), tolerâncias geométricas de concentricidade/batimento e conversão validada entre unidades SI e imperiais.
Macrotema 1.2: Materiais Metálicos e Metalurgia de Engenharia
Trilha: TRL-ENG-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-PHYS:2.3, DOM-PHYS:3.3
Modalidades de Prática: [Análise de Sistemas e Trade-offs], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-01 [Handbook/Referência] (Seção 11: Metallic Materials); BIB-ENG-03 [Sistemas/Industrial] (Seção: Materiais Metálicos e Proteção contra Corrosão)
Subtemas:
Estrutura cristalina dos metais (CCC, CFC, HC), discordâncias e mecanismos de endurecimento (encruamento, refino de grão, solução sólida e precipitação)
Diagrama de fases Ferro-Carbono (ferrita, austenita, cementita, perlita, martensita) e curvas TTT/CCT
Classificação e seleção de aços-carbono, aços-liga, aços inoxidáveis (austeníticos, ferríticos, martensíticos) e ferros fundidos (cinzento, nodular, branco)
Ligas não-ferrosas de engenharia: ligas de alumínio (séries 6000/7000 e envelhecimento T6), cobre/latão/bronze, magnésio e titânio
Tratamentos térmicos (recozimento, normalização, têmpera, revenimento) e termoquímicos (cementação, nitretação)
Ensaios mecânicos (tração σ_e/σ_r, dureza Brinell/Rockwell/Vickers, impacto Charpy/transição dúctil-frágil, fluência) e mecanismos de corrosão (galvânica, pites, sob tensão) e proteção superficial
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Leitura do diagrama Ferro-Carbono (eutetoide a 0,77% C), trade-off dureza vs. tenacidade na têmpera + revenimento e prevenção de corrosão galvânica no contato entre alumínio e aço inox.
Problema-Marco: Elaborar uma matriz de seleção de materiais e tratamentos térmicos para três componentes mecânicos distintos (engrenagem de alta carga superficial, eixo estrutural de alta rigidez/baixo peso e suporte exposto à maresia), justificando microestrutura, custo e proteção contra corrosão.
Macrotema 1.3: Materiais Não-Metálicos, Compósitos, Vidros e Lubrificantes
Trilha: TRL-ENG-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1, 1.2 | Pré-requisitos Cruzados: DOM-PHYS:2.3, DOM-PHYS:3.3
Modalidades de Prática: [Análise de Sistemas e Trade-offs], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-01 [Handbook/Referência] (Seção 12: Non-Metallic Materials); BIB-ENG-03 [Sistemas/Industrial] (Seções: Materiais Não-Metálicos e Lubrificantes); BIB-ENG-04 [Fabricação/Oficina] (Cap. II); BIB-ENG-05 [Projeto Optomecânico] (Cap. 2)
Subtemas:
Polímeros industriais: termoplásticos (PTFE/Teflon, POM/Delrin, Nylon, Policarbonato), termorrígidos (epóxi, fenólicos) e elastômeros (vedações, amortecimento)
Cerâmicas técnicas e vidros de engenharia/óptica: coeficiente de expansão térmica linear (CTE), choque térmico e comparação entre vidro soda-lime (plate), borossilicato (Pyrex/Suprax), sílica fundida e vitrocerâmicas de expansão quase nula (Zerodur)
Materiais compósitos estruturais: matriz + reforço (fibra de vidro, fibra de carbono CFRP, aramida), anisotropia de rigidez específica (E/ρ) e compensados estruturais (bétula báltica / grau marinho)
Adesivos estruturais (epóxis, silicones RTV neutros para colagem de óptica sem tensão)
Tribologia aplicada: regimes de lubrificação (limítrofe, mista e hidrodinâmica — Curva de Stribeck), viscosidade SAE/ISO, aditivos e lubrificantes sólidos (PTFE, grafite, MoS₂)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Comparação de rigidez específica (E/ρ) e CTE entre alumínio, aço, fibra de carbono e borossilicato, leitura da Curva de Stribeck e impacto do CTE na distorção térmica de estruturas de precisão.
Problema-Marco: Especificar os materiais de uma estrutura leve e termicamente estável (tubo de fibra de carbono vs. alumínio + substrato de vidro óptico + par tribológico seco) calculando a dilatação térmica diferencial ΔL sob ΔT = 25 °C e avaliando compatibilidade de adesivos.
Macrotema 1.4: Mecânica Aplicada e Resistência dos Materiais (Corpos Deformáveis)
Trilha: TRL-ENG-00 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.1, 1.2 | Pré-requisitos Cruzados: DOM-PHYS:2.1, DOM-PHYS:2.3, DOM-MATH:3.10, DOM-MATH:5.6
Modalidades de Prática: [Dimensionamento e Projeto], [Simulação e Cálculo Numérico], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-01 [Handbook/Referência] (Seções 4–5: Mechanics of Rigid and Deformable Bodies); BIB-ENG-03 [Sistemas/Industrial] (Seção: Resistência dos Materiais)
Subtemas:
Esforços internos solicitantes em barras e vigas (força normal N, cortante V, momento fletor M e torque T) e construção de diagramas V(x) e M(x)
Tensão axial, cisalhamento direto, flexão pura em vigas (Fórmula da Flexão σ = −My/I e cisalhamento transversal τ = VQ/(It)) e linha elástica (deflexão v(x) por integração de EI v'' = M(x))
Torção de eixos circulares maciços e vazados (τ = Tr/J e ângulo de torção θ = TL/(GJ)) e cilindros de parede fina sob pressão interna
Flambagem de Colunas: carga crítica de Euler (P_cr = π²EI / (KL)²) e efeito das condições de contorno (engastada, biapoiada, livre)
Transformação de estados planos de tensão, tensões principais e Círculo de Mohr
Critérios de falha estática (Rankine para frágeis; Tresca e von Mises para dúcteis), concentração de tensões (fator K_t), Fadiga (curva S-N / Wöhler, limite de resistência à fadiga e diagrama de Goodman) e definição de Fator de Segurança (FS)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Fórmula da flexão σ = My/I, construção do Círculo de Mohr para obter tensões principais e cisalhamento máximo, Critério de von Mises (σ_vM ≤ σ_e/FS) e fórmula da carga crítica de flambagem de Euler.
Problema-Marco: Dimensionar um eixo vazado submetido simultaneamente à flexão e torção combinadas (construindo diagramas de esforços, calculando σ_vM via Círculo de Mohr e verificando vida em fadiga por Goodman com FS ≥ 2,0) e verificar uma haste tubular esbelta contra flambagem de Euler.
Macrotema 1.5: Elementos de Máquinas e Uniões Mecânicas
Trilha: TRL-ENG-00 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.1, 1.4 | Pré-requisitos Cruzados: DOM-PHYS:2.1, DOM-PHYS:2.2
Modalidades de Prática: [Dimensionamento e Projeto], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-01 [Handbook/Referência] (Seção 5); BIB-ENG-03 [Sistemas/Industrial] (Seção: Elementos de Máquinas e Uniões)
Subtemas:
Uniões desmontáveis e permanentes: parafusos de fixação e de potência (geometria de rosca métrica, torque de aperto, pré-carga, diagrama de rigidez da junta e travamento), pinos, chavetas, estrias e soldagem/rebitagem
Molas mecânicas (helicoidais de compressão/tração/torção e feixes de molas): taxa de mola k, tensão corrigida de Wahl e flambagem de molas
Mancais de deslizamento (hidrodinâmicos e secos) e Rolamentos (esferas, rolos cilíndricos/cônicos, carga dinâmica equivalente P e vida nominal L₁₀ = (C/P)^p em milhões de rotações)
Transmissões mecânicas: Engrenagens (perfil evolvente, módulo m, relação de transmissão, engrenagens cilíndricas retas/helicoidais, cônicas, coroa/sem-fim e trens epicicloidais/planetários — fórmula de Willis), correias (planas, em V e sincronizadoras), correntes, acoplamentos e embreagens/freios de atrito
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Equação de vida nominal de rolamentos L₁₀ (p = 3 para esferas, p = 10/3 para rolos), relação fundamental de engrenamento (m = d/z) e cálculo de torque de aperto vs. pré-carga em parafusos (T ≈ K · F_i · d).
Problema-Marco: Dimensionar um redutor mecânico de dois estágios (especificando módulos e número de dentes para razão 12:1, cargas radiais/axiais nos apoios, seleção de rolamentos para L₁₀ ≥ 20.000 h e parafusos de carcaça com pré-carga).
NÍVEL 2: MECÂNICA DOS FLUIDOS INDUSTRIAL, AERODINÂMICA E TRANSFERÊNCIA DE CALOR APLICADA
Macrotema 2.1: Escoamento Interno, Tubulações e Perdas de Carga
Trilha: TRL-ENG-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-PHYS:2.5, DOM-MATH:6.2
Modalidades de Prática: [Dimensionamento e Projeto], [Simulação e Cálculo Numérico]
Bibliografia e Capítulos: BIB-ENG-01 [Handbook/Referência] (Seção 6: Mechanics of Incompressible Fluids); BIB-ENG-02 [Handbook/Referência] (Seções 1, 5)
Subtemas:
Equação da Energia para escoamento real em dutos (Bernoulli com perda de carga h_L e energia de bomba/turbina) e linhas de energia/piezométrica
Regimes de escoamento interno (laminar Re < 2300, transição e turbulento), diâmetro hidráulico (D_h = 4A/P) para dutos não-circulares e comprimento de entrada
Equação de Darcy-Weisbach (h_f = f (L/D) (v²/2g)), fator de atrito laminar (f = 64/Re), Equação implícita de Colebrook-White e leitura do Diagrama de Moody (rugosidade relativa ε/D)
Perdas de carga localizadas/singulares (coeficientes K e comprimentos equivalentes em válvulas, joelhos, tês, entradas e expansões bruscas)
Análise de redes de tubulações em série e paralelo (método de Hardy Cross) e medição de vazão industrial (placa de orifício, bocal, Venturi e rotâmetro)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Equação de Darcy-Weisbach, solução numérica da equação de Colebrook-White (vs. aproximação de Haaland) e diferença de comportamento de f(Re, ε/D) nos regimes laminar, transição e totalmente rugoso.
Problema-Marco: Implementar em Python um solver de Colebrook-White (via Newton-Raphson) e dimensionar o diâmetro e a curva de perda de carga de uma linha de bombeamento industrial com válvulas, curvas e desnível geométrico.
Macrotema 2.2: Aerodinâmica e Escoamento Compressível
Trilha: TRL-ENG-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.1 | Pré-requisitos Cruzados: DOM-PHYS:2.5, DOM-PHYS:3.2, DOM-PHYS:3.5
Modalidades de Prática: [Dimensionamento e Projeto], [Análise de Sistemas e Trade-offs], [Simulação e Cálculo Numérico]
Bibliografia e Capítulos: BIB-ENG-01 [Handbook/Referência] (Seções 6–7: Aerodynamics); BIB-ENG-02 [Handbook/Referência] (Seções 1–2); BIB-ENG-03 [Sistemas/Industrial] (Seção: Aerodinâmica Veicular)
Subtemas:
Escoamento externo e Camada Limite (laminar de Blasius vs. turbulenta), gradiente adverso de pressão e descolamento de camada limite (esteira turbulenta)
Forças aerodinâmicas: Arrasto (de atrito + de forma/pressão + induzido; F_D = (1/2) ρ v² C_d A) e Sustentação / Downforce (F_L = (1/2) ρ v² C_l A) em perfis aerodinâmicos e veículos (estol, vórtices de ponta e efeito solo)
Escoamento compressível 1D (Ma > 0,3): velocidade do som a = √(γRT), propriedades de estagnação (T₀, P₀) e relações isentrópicas em função do Número de Mach
Escoamento isentrópico em dutos de área variável e Bocais Convergentes-Divergentes (de Laval): condição de escoamento blocado/sônico na garganta (Ma = 1) e regimes de expansão (subexpandido vs. superexpandido)
Ondas de choque normais e oblíquas (equações de Rankine-Hugoniot, salto de pressão/entropia e queda de pressão de estagnação)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Por que a potência para vencer o arrasto aerodinâmico cresce com v³, condição de garganta sônica (A/A*) em um bocal de Laval e irreversibilidade (Δs > 0) através de uma onda de choque normal.
Problema-Marco: Calcular em Python o perfil de Mach, pressão e temperatura ao longo de um bocal de Laval (incluindo detecção de choque normal interno) e estimar o impacto aerodinâmico (potência e estabilidade em alta velocidade) da variação de C_d e C_l em um veículo de passeio.
Macrotema 2.3: Bombas, Compressores, Ventiladores e Turbinas Hidráulicas
Trilha: TRL-ENG-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.5, 2.1 | Pré-requisitos Cruzados: DOM-PHYS:2.2, DOM-PHYS:2.5
Modalidades de Prática: [Dimensionamento e Projeto], [Análise de Sistemas e Trade-offs], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-02 [Handbook/Referência] (Seções 4–6: Pumping, Air Compression, Hydraulic Turbines); BIB-ENG-01 [Handbook/Referência] (Seção 6)
Subtemas:
Equação de Euler para Turbomáquinas (balanço de momento angular em rotores) e triângulos de velocidades
Bombas centrífugas vs. bombas de deslocamento positivo (engrenagens, pistão, palhetas): curvas características (altura manométrica H, potência de eixo e rendimento vs. vazão Q)
Acoplamento bomba-sistema (ponto de operação), associações de bombas em série/paralelo e Leis de Afinidade / Semelhança (efeito de rotação N e diâmetro do rotor D sobre Q, H e P)
Cavitação e NPSH (Net Positive Suction Head): cálculo de NPSH disponível (NPSH_d) vs. requerido (NPSH_r) e medidas de projeto para evitar erosão por cavitação
Ventiladores, sopradores e Compressores de ar/gás (alternativos, parafuso, centrífugos e axiais): trabalho de compressão isotérmico vs. politrópico, razão de pressão ótima em compressão multiestágio com resfriamento intermediário (intercooling) e surge
Turbinas hidráulicas: seleção por velocidade específica (Pelton de ação para altas quedas, Francis mista e Kaplan axial para baixas quedas/altas vazões)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Leis de afinidade (Q ∝ N, H ∝ N², P ∝ N³), condição crítica contra cavitação (NPSH_d > NPSH_r + margem) e razão ótima de pressão entre estágios de compressão com intercooling (r_estágio = √(P_final/P_inicial)).
Problema-Marco: Selecionar e dimensionar uma bomba centrífuga para o sistema de tubulação do Tema 2.1 encontrando o ponto de operação por interseção de curvas em Python, verificando a margem de NPSH para água quente (70 °C) e recalculando a potência ao reduzir a rotação em 20% via inversor de frequência.
Macrotema 2.4: Transferência de Calor Aplicada e Trocadores de Calor
Trilha: TRL-ENG-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.2, 1.3, 2.1 | Pré-requisitos Cruzados: DOM-PHYS:3.3, DOM-MATH:5.13, DOM-MATH:6.6
Modalidades de Prática: [Dimensionamento e Projeto], [Simulação e Cálculo Numérico]
Bibliografia e Capítulos: BIB-ENG-02 [Handbook/Referência] (Seção 3: Heat Exchange); BIB-ENG-01 [Handbook/Referência] (Seção 8: Engineering Thermodynamics / Heat Transfer)
Subtemas:
Condução estacionária em paredes planas, cilíndricas e esféricas (analogia de circuitos de resistências térmicas, raio crítico de isolamento) e condução com geração interna de calor
Superfícies estendidas (Aletas): equação diferencial da aleta, eficiência η_f e efetividade ε_f para dissipação em motores/eletrônica
Condução transiente: Número de Biot (Bi = hL_c/k), validade do Método da Capacitância Global (Bi < 0,1) e soluções aproximadas/numéricas para sólidos semi-infinitos e placas (Número de Fourier)
Convecção forçada e natural (externa e interna): grupos adimensionais (Nusselt, Reynolds, Prandtl, Grashof e Rayleigh) e uso de correlações empíricas (Dittus-Boelter, Churchill-Bernstein) para estimar o coeficiente convectivo h
Troca de calor por radiação entre superfícies cinzentas difusas (fatores de forma F_{ij}, escudo de radiação) e coeficiente global de transferência de calor U (incluindo fator de incrustação / fouling)
Projeto térmico de Trocadores de Calor (tubo duplo, casco e tubos, placas, fluxo cruzado / radiadores): Método LMTD (diferença média logarítmica de temperatura com fator de correção F) e Método Efetividade-NTU (ε-NTU)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Critério do Número de Biot (Bi < 0,1) para lumped capacitance, superioridade térmica do arranjo contracorrente sobre paralelo no LMTD e quando usar o método ε-NTU (quando as temperaturas de saída são desconhecidas).
Problema-Marco: Dimensionar em Python um trocador de calor / radiador automotivo ou industrial comparando os métodos LMTD e ε-NTU (incluindo cálculo de h interno/externo via correlações de Nusselt) e simular o resfriamento transiente de um disco de vidro óptico espesso por diferenças finitas 1D.
NÍVEL 3: TERMODINÂMICA DE ENGENHARIA, COMBUSTÃO E SISTEMAS DE POTÊNCIA
Macrotema 3.1: Substâncias Puras, Psicrometria e Termodinâmica de Combustíveis
Trilha: TRL-ENG-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1, 2.4 | Pré-requisitos Cruzados: DOM-PHYS:3.4, DOM-PHYS:3.5, DOM-PHYS:3.6
Modalidades de Prática: [Dimensionamento e Projeto], [Análise de Sistemas e Trade-offs]
Bibliografia e Capítulos: BIB-ENG-02 [Handbook/Referência] (Seções 1–2: Air, Combustion and Fuels); BIB-ENG-01 [Handbook/Referência] (Seção 8); BIB-ENG-03 [Sistemas/Industrial] (Seção: Combustíveis)
Subtemas:
Propriedades termodinâmicas de substâncias puras (água/vapor e refrigerantes): líquido comprimido, mistura saturada (título x), vapor superaquecido, leitura de tabelas de vapor e diagramas T-s e h-s (Diagrama de Mollier)
Primeira e Segunda Leis para Volumes de Controle abertos em regime permanente (entalpia h = u + Pv, bocais, difusores, turbinas, compressores, válvulas de estrangulamento isentálpicas) e análise de Exergia (disponibilidade)
Psicrometria aplicada: umidade relativa e absoluta, temperatura de bulbo seco, bulbo úmido e ponto de orvalho na carta psicrométrica
Combustíveis sólidos (carvão/biomassa), líquidos (gasolina, diesel, etanol, biodiesel, querosene) e gasosos (gás natural, hidrogênio): propriedades críticas (octanagem RON/MON, número de cetano, volatilidade)
Estequiometria da combustão: razão ar-combustível teórica vs. real (fator de excesso de ar λ), composição dos gases de exaustão, Poder Calorífico Superior (PCS/HHV) vs. Inferior (PCI/LHV), entalpia de formação e temperatura adiabática de chama
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Balanço de energia em regime permanente para volume de controle (q̇ − ẇ = ṁ[Δh + Δv²/2 + gΔz]), diferença física entre PCS e PCI (calor latente de condensação da água nos produtos) e cálculo da razão estequiométrica para hidrocarbonetos/álcoois (ex.: gasolina vs. etanol).
Problema-Marco: Realizar o balanço estequiométrico e energético completo da combustão de etanol hidratado e diesel com 15% de excesso de ar, calculando λ, fração de CO₂/H₂O/O₂ nos gases de exaustão e temperatura adiabática de chama.
Macrotema 3.2: Ciclos de Potência a Vapor e Turbinas a Vapor
Trilha: TRL-ENG-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.3, 2.4, 3.1 | Pré-requisitos Cruzados: DOM-PHYS:3.6
Modalidades de Prática: [Dimensionamento e Projeto], [Simulação e Cálculo Numérico]
Bibliografia e Capítulos: BIB-ENG-02 [Handbook/Referência] (Seções 7–10: Steam Generation, Steam Turbines, Condensers, Power Plants)
Subtemas:
Ciclo de Rankine ideal e real: caldeira, turbina, condensador e bomba; trabalho de retroalimentação (back work ratio) e irreversibilidades (eficiência isentrópica de turbina η_T e bomba η_B)
Otimização termodinâmica de centrais a vapor: impacto da pressão da caldeira e do condensador, Superaquecimento (evitando erosão por gotículas nas últimas palhetas), Reaquecimento e Regeneração (aquecedores abertos e fechados de água de alimentação)
Engenharia de caldeiras e geradores de vapor (aquatubulares vs. flamotubulares, economizadores, superaquecedores, pré-aquecedores de ar e tratamento químico de água)
Turbinas a Vapor: bocais supersônicos, estágios de ação/impulso (De Laval, Curtis, Rateau) vs. estágios de reação (Parsons), grau de reação e perdas internas
Condensadores, torres de resfriamento e sistemas de Cogeração (calor e potência combinados — CHP)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Limite prático de título mínimo na saída da turbina (x ≥ 0,88–0,90) para evitar erosão, por que o ciclo regenerativo eleva a temperatura média de adição de calor aproximando-se de Carnot, e distinção funcional entre estágio de impulso e de reação.
Problema-Marco: Modelar em Python um Ciclo de Rankine com reaquecimento e um extrator regenerativo aberto (usando tabelas de vapor / CoolProp ou interpolação), calculando a fração ótima de extração de vapor, a eficiência térmica global, o título na exaustão e a vazão mássica para gerar 100 MW elétricos.
Macrotema 3.3: Ciclos de Potência a Gás, Turbinas a Gás e Propulsão a Jato
Trilha: TRL-ENG-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.2, 2.3, 3.1 | Pré-requisitos Cruzados: DOM-PHYS:3.5, DOM-PHYS:3.6
Modalidades de Prática: [Dimensionamento e Projeto], [Análise de Sistemas e Trade-offs], [Simulação e Cálculo Numérico]
Bibliografia e Capítulos: BIB-ENG-02 [Handbook/Referência] (Seções 12–14: Gas Turbines, Internal-Combustion Engines, Jet Propulsion)
Subtemas:
Ciclos padrão a ar para motores alternativos: Ciclo Otto (η = 1 − 1/r^{γ−1}), Ciclo Diesel (efeito da razão de corte r_c) e Ciclo Dual (Sabathe) — comparação em mesma taxa de compressão vs. mesma pressão/temperatura máxima
Ciclo Brayton aberto e fechado (ideal e real com eficiências isentrópicas de compressor e turbina): razão ótima de pressões para máximo trabalho líquido vs. máxima eficiência e alta razão de trabalho de retroalimentação (back work ratio)
Aprimoramento de turbinas a gás: regeneração (condição de aplicabilidade), compressão multiestágio com intercooling e expansão multiestágio com reaquecimento
Ciclos Combinados (Brayton + Rankine): aproveitamento dos gases de exaustão em caldeira de recuperação (HRSG) superando 55–60% de eficiência térmica
Termodinâmica da Propulsão a Jato: turbojato, turbofan (razão de bypass e eficiência propulsiva), turboélice e ramjet; equação do empuxo e consumo específico de combustível (TSFC)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Dedução das eficiências de Otto, Diesel e Brayton ideais, por que o Ciclo Brayton real é muito mais sensível à eficiência do compressor/turbina do que o Rankine (alto back work ratio), e por que turbofans de alto bypass são mais eficientes em voo subsônico.
Problema-Marco: Simular em Python um Ciclo Brayton real (variando razão de pressão de 4 a 30 com η_c = 0,85 e η_t = 0,88) encontrando a razão ótima de trabalho específico e acoplando-o a um ciclo Rankine inferior para calcular a eficiência do ciclo combinado.
Macrotema 3.4: Sistemas de Refrigeração, Criogenia e Climatização
Trilha: TRL-ENG-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.3, 2.4, 3.1 | Pré-requisitos Cruzados: DOM-PHYS:3.6
Modalidades de Prática: [Dimensionamento e Projeto], [Análise de Sistemas e Trade-offs]
Bibliografia e Capítulos: BIB-ENG-02 [Handbook/Referência] (Seção 11: Refrigeration and Air Conditioning); BIB-ENG-03 [Sistemas/Industrial] (Seção: Climatização Automotiva)
Subtemas:
Ciclo de refrigeração por compressão de vapor (evaporador, compressor, condensador e válvula de expansão isentálpica) em diagramas T-s e P-h
Coeficiente de Desempenho (COP_R e COP_BC), capacidade frigorífica (tonelada de refrigeração), superaquecimento na sucção e sub-resfriamento na saída do condensador
Fluidos refrigerantes (propriedades termodinâmicas, segurança, ODP e GWP) e bombas de calor
Sistemas avançados: refrigeração em cascata, compressão multiestágio com câmara de flash, refrigeração por absorção (água-amônia / brometo de lítio) e ciclo de liquefação de gases (Linde-Hampson / efeito Joule-Thomson)
Engenharia de climatização (HVAC) e climatização automotiva: processos psicrométricos (resfriamento com desumidificação, mistura adiabática) e balanço de carga térmica
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Por que se utiliza válvula de expansão isentálpica em vez de turbina em ciclos frigoríficos práticos, relação COP_BC = COP_R + 1 e leitura do diagrama P-h para calcular trabalho de compressão e efeito refrigerante.
Problema-Marco: Dimensionar um ciclo real de refrigeração por compressão de vapor (determinando vazão mássica de refrigerante, potência de compressão, taxa de rejeição no condensador e COP real vs. COP de Carnot) e traçar um processo de resfriamento com desumidificação na carta psicrométrica.
NÍVEL 4: ENGENHARIA AUTOMOTIVA — DINÂMICA VEICULAR, PROPULSÃO E CHASSI
Macrotema 4.1: Física do Veículo e Dinâmica Longitudinal e Lateral
Trilha: TRL-ENG-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.4, 1.5, 2.2 | Pré-requisitos Cruzados: DOM-PHYS:1.3, DOM-PHYS:2.2, DOM-MATH:5.13
Modalidades de Prática: [Dimensionamento e Projeto], [Simulação e Cálculo Numérico]
Bibliografia e Capítulos: BIB-ENG-03 [Sistemas/Industrial] (Seções: Física do Movimento Veicular e Dinâmica Veicular)
Subtemas:
Equação de movimento longitudinal: resistência ao rolamento (F_R = f_R m g cos α), arrasto aerodinâmico (F_L = (1/2) ρ C_d A v²), resistência de aclive e massa inercial equivalente (fator de inércia rotacional das rodas/transmissão)
Diagrama de tração (força trativa nas rodas vs. velocidade em cada marcha), velocidade máxima, capacidade de rampa (gradeability) e tempo de aceleração
Mecânica do pneu: curva de aderência longitudinal vs. escorregamento (μ × s), forças laterais vs. ângulo de deriva (slip angle) e Círculo de Aderência de Kamm (combinação de força longitudinal e lateral)
Transferência dinâmica de carga entre eixos na aceleração/frenagem e entre rodas esquerda/direita em curvas (altura do CG e distância entre-eixos)
Dinâmica lateral (Modelo de Bicicleta linear): gradiente de subesterço (K), comportamento Subesterçante vs. Neutro vs. Sobresterçante, velocidade característica/crítica e estabilidade de guinada (yaw)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Interpretação do Círculo de Kamm (por que frear forte no limite reduz drasticamente a capacidade de curva), papel da altura do CG na transferência de carga e definição rigorosa de subesterço vs. sobresterço pela diferença dos ângulos de deriva dianteiro e traseiro (α_f vs. α_r).
Problema-Marco: Implementar em Python um simulador de dinâmica longitudinal de um sedã segmento C (diagrama de tração por marcha, curva de aceleração 0–100 km/h, velocidade máxima e distância de frenagem com transferência de carga) e calcular o gradiente de subesterço pelo modelo de bicicleta.
Macrotema 4.2: Engenharia de Motores de Combustão Interna (MCI)
Trilha: TRL-ENG-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.5, 2.4, 3.1, 3.3 | Pré-requisitos Cruzados: DOM-PHYS:3.5
Modalidades de Prática: [Análise de Sistemas e Trade-offs], [Dimensionamento e Projeto]
Bibliografia e Capítulos: BIB-ENG-03 [Sistemas/Industrial] (Seções: Motores de Combustão Interna, Gerenciamento de Motor e Emissões); BIB-ENG-02 [Handbook/Referência] (Seção 13)
Subtemas:
Arquitetura mecânica e cinemática biela-manivela (cilindrada, taxa de compressão, velocidade média do pistão, balanceamento de forças de 1ª e 2ª ordem em configurações L4, V6, L6 e Boxer)
Motores de ignição por centelha (Ciclo Otto / Atkinson-Miller) vs. ignição por compressão (Diesel): combustão normal, detonação (knocking) e retardo de ignição
Parâmetros de desempenho: Pressão Média Efetiva (BMEP/PME), rendimento volumétrico, mecânico e térmico, curvas de torque/potência e Mapa de Consumo Específico (BSFC — mapa de conchas)
Troca gasosa, comando variável de válvulas (VVT/VVL) e sobrealimentação (Turbocompressores com wastegate/geometria variável VGT, intercooler e superchargers)
Sistemas de injeção de combustível (indireta PFI, direta GDI e Common-Rail Diesel de alta pressão) e gerenciamento eletrônico (ECU — mapas de ignição e injeção em malha fechada via sonda lambda λ = 1)
Formação de emissões (CO, HC, NOₓ, material particulado — trade-off NOₓ vs. fuligem) e sistemas de pós-tratamento (catalisador de 3 vias, EGR, filtro DPF e redução catalítica seletiva SCR/ARLA 32)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Relação exata entre potência, torque e rotação (P = T · ω) e entre BMEP, torque e cilindrada, papel do controle estequiométrico λ = 1 na janela de eficiência do catalisador de 3 vias e trade-off entre perdas por bombeamento em carga parcial (Ciclo Otto vs. Diesel/Atkinson).
Problema-Marco: Analisar um mapa de BSFC e curvas de torque/potência de um motor turbo flex/gasolina, calculando BMEP máxima, rendimento térmico no ponto de menor BSFC, velocidade média do pistão no corte de giro e ganho teórico de eficiência operando em Ciclo Atkinson para uma aplicação híbrida.
Macrotema 4.3: Trem de Força, Transmissões e Sistemas de Chassi
Trilha: TRL-ENG-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.5, 4.1 | Pré-requisitos Cruzados: DOM-PHYS:2.1, DOM-PHYS:2.5
Modalidades de Prática: [Dimensionamento e Projeto], [Análise de Sistemas e Trade-offs]
Bibliografia e Capítulos: BIB-ENG-03 [Sistemas/Industrial] (Seções: Transmissão, Chassi, Suspensão, Direção e Sistemas de Freios)
Subtemas:
Arquitetura do trem de força (tração dianteira, traseira, AWD/4WD): embreagens de fricção, volantes bimassa e conversores de torque hidráulicos (multiplicação de torque e embreagem de lock-up)
Caixas de câmbio: manual sincronizada, automática epicicloidal (trens planetários + freios/embreagens multidisco), dupla embreagem (DCT), transmissão continuamente variável (CVT) e redutores de velocidade única para veículos elétricos
Diferenciais abertos, autoblocantes (LSD mecânico/Torsen/viscoso) e vetorização de torque ativa
Arquitetura e geometria de suspensões: eixos rígidos, eixo de torção, McPherson, duplo braço triangular (Double Wishbone) e Multilink; molas, barras estabilizadoras, amortecedores hidráulicos/adaptativos e geometria de alinhamento (câmber, cáster, pino-mestre, convergência/divergência e centro de rolagem)
Sistemas de direção (pinhão e cremalheira, direção assistida elétrica EPS e relação variável)
Sistemas de freios (disco vs. tambor, capacidade térmica e fading, distribuição ideal de frenagem entre eixos) e sistemas ativos de segurança: ABS (modulação de escorregamento ótimo), TCS/ASR (controle de tração) e ESP/ESC (controle de estabilidade por frenagem seletiva de rodas)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Escalonamento geométrico vs. progressivo de relações de marchas, por que o travamento das rodas traseiras antes das dianteiras causa instabilidade direcional severa (giro/rodada) e princípio físico da atuação do ESP gerando momento corretivo de guinada.
Problema-Marco: Calcular a curva parabólica de distribuição ideal de força de frenagem (dianteira vs. traseira) para um veículo em condição vazio vs. carregado (com transferência de carga), e dimensionar o escalonamento de relações de uma caixa de 6 marchas + diferencial para conciliar arrancada em rampa de 30% e cruzeiro econômico.
Macrotema 4.4: Propulsão Híbrida, Elétrica (BEV/HEV/EREV) e Armazenamento de Energia
Trilha: TRL-ENG-02 | Complexidade: 5/5 | Pré-requisitos Diretos: 2.4, 4.1, 5.1 | Pré-requisitos Cruzados: DOM-PHYS:4.5, DOM-PHYS:4.6, DOM-PHYS:4.7
Modalidades de Prática: [Dimensionamento e Projeto], [Análise de Sistemas e Trade-offs], [Simulação e Cálculo Numérico]
Bibliografia e Capítulos: BIB-ENG-03 [Sistemas/Industrial] (Seções: Veículos Híbridos, Tração Elétrica, Baterias e Células a Combustível)
Subtemas:
Topologias de eletrificação: Micro-híbrido (Start-Stop), Mild-Hybrid (48V), Full Hybrid paralelo, série, Power-Split (e-CVT planetário), Plug-in Hybrid (PHEV), Extensor de Autonomia (EREV) e Elétrico Puro (BEV)
Máquinas elétricas de tração: síncronas de ímã permanente (PMSM/IPMSM), indução assíncrona (ASM) e síncronas excitadas externamente (EESM) — região de torque constante vs. região de enfraquecimento de campo (potência constante)
Eletrônica de potência veicular: inversores trifásicos (IGBT/SiC MOSFET), conversores DC/DC bidirecionais, carregadores embarcado (OBC) vs. carga rápida DC e coordenação de frenagem regenerativa com freio de atrito
Engenharia de Baterias de Alta Tensão: químicas íon-lítio (NMC, NCA, LFP — densidade energética vs. estabilidade térmica vs. ciclos), arquitetura célula-módulo-pack (400V vs. 800V), modelo elétrico equivalente (OCV + resistência interna), estimação de SoC (Estado de Carga) e SoH (Estado de Saúde), balanceamento de células e arquitetura do BMS (Battery Management System)
Gestão térmica integrada (resfriamento líquido da bateria, inversor e bomba de calor de cabine) e introdução a Células a Combustível (PEMFC / FCEV)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Trade-offs estruturais entre arquiteturas BEV, PHEV e EREV (massa da bateria, complexidade mecânica, eficiência no ponto ótimo de BSFC do gerador), curva torque-rotação de motores elétricos (torque constante até velocidade base, potência constante acima) e trade-off energético/térmico entre células LFP e NMC.
Problema-Marco: Simular em Python o consumo de energia (Wh/km) e a autonomia de uma plataforma multi-energia (BEV 65 kWh vs. EREV 25 kWh + gerador térmico operando em ponto ótimo de BSFC) sobre um ciclo de condução padronizado (WLTC/urbano + rodoviário), contabilizando recuperação por frenagem regenerativa e perdas no inversor/bateria.
NÍVEL 5: ELETROELETRÔNICA APLICADA, INSTRUMENTAÇÃO, CONTROLE E MECATRÔNICA
Macrotema 5.1: Eletrotécnica, Eletrônica de Potência e Sistemas Elétricos
Trilha: TRL-ENG-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-PHYS:4.4, DOM-PHYS:4.6, DOM-PHYS:4.7
Modalidades de Prática: [Dimensionamento e Projeto], [Análise de Sistemas e Trade-offs]
Bibliografia e Capítulos: BIB-ENG-01 [Handbook/Referência] (Seções 9–10: Electricity, Magnetism and Electronics); BIB-ENG-03 [Sistemas/Industrial] (Seções: Eletrotécnica, Eletrônica, Redes de Bordo e Iluminação)
Subtemas:
Circuitos industriais e sistemas de bordo (12V, 48V e alta tensão HV): redes de distribuição, quedas de tensão, dimensionamento de chicotes/cabos, proteção (fusíveis, relés, contatores pirotécnicos) e balanço energético de bordo
Baterias de partida (chumbo-ácido AGM/EFB), alternadores trifásicos com ponte retificadora e regulador de tensão, e motores de partida
Eletrônica analógica e semicondutores de potência: diodos, transistores BJT, MOSFETs, IGBTs, tiristores, modulação por largura de pulso (PWM), pontes H, conversores DC/DC (Buck, Boost, Buck-Boost) e inversores DC/AC
Compatibilidade Eletromagnética (EMC / EMI): mecanismos de acoplamento (conduzido, capacitivo, indutivo, irradiado), blindagem, aterramento e filtragem
Iluminação e optoeletrônica automotiva (halógena, xenônio, LED matricial adaptativo e laser)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Funcionamento da modulação PWM para controle eficiente de potência (baixa dissipação em chaveamento vs. reguladores lineares), função do diodo de roda-livre (flyback) em cargas indutivas e dimensionamento de seção de cabo por corrente e queda de tensão máxima.
Problema-Marco: Dimensionar o estágio de potência de um acionamento PWM em ponte H para um motor CC/BLDC (selecionando MOSFETs, diodos, dissipador térmico e proteção), incluindo cálculo de perdas por condução/chaveamento e mitigação de EMI.
Macrotema 5.2: Sensores, Atuadores e Instrumentação de Engenharia
Trilha: TRL-ENG-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1, 5.1 | Pré-requisitos Cruzados: DOM-PHYS:4.5, DOM-PHYS:4.6, DOM-MATH:6.1
Modalidades de Prática: [Análise de Sistemas e Trade-offs], [Simulação e Cálculo Numérico], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-03 [Sistemas/Industrial] (Seções: Sensores e Atuadores); BIB-ENG-01 [Handbook/Referência] (Seção 10)
Subtemas:
Características estáticas e dinâmicas de sensores: sensibilidade, linearidade, histerese, deriva térmica, faixa dinâmica, banda passante e relação sinal-ruído (SNR)
Sensores de posição, velocidade angular e deslocamento: potenciômetros, sensores indutivos/relutância variável, Efeito Hall, magnetorresistivos (AMR/GMR), Encoders ópticos/magnéticos e Resolvers
Sensores inerciais e ambientais: acelerômetros e giroscópios MEMS (IMU), pressão (piezorresistivos/capacitivos), fluxo de massa de ar (MAF fio quente), temperatura (NTC, PTC, PT100, termopares) e composição de gases (Sonda Lambda binária e banda larga)
Condicionamento de sinal e aquisição de dados: pontes de Wheatstone, amplificadores operacionais/instrumentação, filtros anti-aliasing, Teorema da Amostragem de Nyquist-Shannon e conversores ADC/DAC (resolução em bits e erro de quantização)
Atuadores eletromecânicos: solenoides proporcionais, motores de passo (microstepping), servomotores CC/BLDC/PMSM e atuadores piezoelétricos
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Teorema de Nyquist-Shannon (f_s > 2 f_max) e risco de aliasing, distinção entre encoder incremental vs. absoluto e princípio físico de medição de uma sonda lambda ou acelerômetro MEMS.
Problema-Marco: Projetar a cadeia completa de instrumentação de um eixo rotativo de alta precisão (seleção de encoder/resolver + condicionamento + taxa de amostragem ADC + estimativa de resolução angular e erro de quantização) e simular em Python a filtragem de um sinal ruidoso de IMU.
Macrotema 5.3: Teoria de Controle Aplicada, Redes Embarcadas e ADAS
Trilha: TRL-ENG-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 5.1, 5.2 | Pré-requisitos Cruzados: DOM-MATH:5.13, DOM-MATH:6.6, DOM-PROG:1.2, DOM-PROG:6.4
Modalidades de Prática: [Dimensionamento e Projeto], [Análise de Sistemas e Trade-offs], [Simulação e Cálculo Numérico]
Bibliografia e Capítulos: BIB-ENG-03 [Sistemas/Industrial] (Seções: Teoria de Controle, Arquitetura Eletrônica, Redes de Comunicação, Diagnóstico e Sistemas de Assistência ao Condutor)
Subtemas:
Sistemas de controle em malha aberta vs. malha fechada (realimentação negativa), modelagem por função de transferência (domínio de Laplace), polos/zeros, estabilidade e resposta ao degrau (tempo de subida, sobressinal / overshoot, tempo de acomodação e erro em regime permanente)
Controladores PID (ações Proporcional, Integral e Derivativa), sintonia (Ziegler-Nichols), saturação de atuador (Integral Windup e estratégias anti-windup), derivada filtrada e discretização para microcontroladores (controle digital)
Arquitetura de software embarcado, tempo real, diagnóstico embarcado (OBD-II / UDS) e Segurança Funcional (ISO 26262 — níveis ASIL A a D, redundância e modo seguro / fail-safe)
Redes de comunicação embarcada: CAN / CAN-FD (arbitragem não-destrutiva por prioridade de ID, frame, CRC e determinismo), LIN (baixo custo mestre-escravo), FlexRay (time-triggered determinístico) e Automotive Ethernet (alta banda para câmeras/lidar)
Sistemas de Assistência ao Condutor (ADAS): física e trade-offs de Radar (ondas milimétricas 77 GHz / efeito Doppler), Lidar (tempo de voo), Câmeras e Ultrassom; fusão sensorial (introdução ao Filtro de Kalman), ACC (controle de cruzeiro adaptativo), AEB (frenagem autônoma) e LKA
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Papel individual de cada termo P, I e D no erro estacionário, tempo de resposta e amortecimento; mecanismo de arbitragem bit a bit do barramento CAN sem colisão destrutiva; e por que ADAS críticos combinam radar + câmera (complementaridade sob chuva/neblina vs. classificação semântica).
Problema-Marco: Implementar em Python um controlador PID discreto com anti-windup e filtro derivativo para controlar a velocidade de um veículo ou o posicionamento angular de um eixo com atrito e inércia, avaliando sobressinal, rejeição a perturbações (rampa/vento) e margens de estabilidade.
NÍVEL 6: FABRICAÇÃO ÓPTICA DE PRECISÃO E METROLOGIA DE SUPERFÍCIES (TEXEREAU)
Macrotema 6.1: Seleção de Substratos Ópticos, Desbaste e Esmerilhamento Fino
Trilha: TRL-ENG-04 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1, 1.3 | Pré-requisitos Cruzados: DOM-MATH:1.10, DOM-PHYS:7.1
Modalidades de Prática: [Dimensionamento e Projeto], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-04 [Fabricação/Oficina] (Caps. I–II: §§ 1–16)
Subtemas:
Especificação do disco de vidro (blank): borossilicato (Pyrex/Suprax) vs. vidro comum, inspeção de tensões internas (birrefringência em luz polarizada / recozimento) e razão de aspecto espessura/diâmetro (1:6 clássico vs. espelhos finos 1:10–1:16)
Geometria da cavidade esférica: cálculo exato da flecha/sagita (s = R − √(R² − r²) ≈ D² / (16 f)), esferometria (esferômetro de 3 pernas / anel) e relação entre raio de curvatura R = 2f e distância focal f
Cinemática do desbaste bruto e do esmerilhamento fino (espelho sobre ferramenta — MOT vs. ferramenta sobre espelho — TOT, amplitude e frequência de cursos em W)
Progressão controlada de abrasivos (Carbeto de Silício #60 → #400 e Óxido de Alumínio microgrão 25 μm → 3 μm): remoção sistemática de fraturas subsuperficiais (pits) da etapa anterior, chanframento de borda e obtenção de esfera matematicamente contínua antes do polimento
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Fórmula exata da sagita s(r, R), por que a esfera é a única superfície naturally gerada pelo atrito aleatório de dois corpos rígidos em contato pleno e controle de profundidade de dano subsuperficial (regra 3× o diâmetro do grão anterior).
Problema-Marco: Elaborar o plano de processo completo para um espelho primário 250 mm f/6 (calculando raio de curvatura R, sagita central exata, volume de vidro removido, tabela de progressão de abrasivos e critérios de passagem de etapa via esferômetro e inspeção com lupa).
Macrotema 6.2: Polimento Óptico e Mecânica de Ferramentas de Piche
Trilha: TRL-ENG-04 | Complexidade: 4/5 | Pré-requisitos Diretos: 6.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Normas, Metrologia e Falhas], [Análise de Sistemas e Trade-offs]
Bibliografia e Capítulos: BIB-ENG-04 [Fabricação/Oficina] (Cap. II: §§ 17–24)
Subtemas:
Física do polimento óptico: interação químico-mecânica (camada hidratada de sílica) e Equação de Preston (taxa de remoção dh/dt = k · P · v)
Engenharia do Lap de Piche (Pitch Lap): viscosidade viscoelástica do piche óptico (teste de dureza / indentação em função da temperatura da oficina), fundição, abertura de canais assimétricos (evitando periodicidade zonal) e microcanalização para escoamento de suspensão abrasiva
Prensagem a quente e a frio para contato íntimo (conformidade nanométrica espelho-lap) e agentes polidores (Óxido de Cério vs. Rouge / Óxido de Ferro)
Controle de microrrugosidade superficial (Ripple / microripple e espalhamento de luz reduzindo contraste planetário) e avaliação do grau de polimento completo (escala de Texereau usando laser/feixe colimado na borda e centro)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Natureza viscoelástica do piche (rígido em escalas de segundos, fluido sob prensagem lenta), Equação de Preston e por que canais simétricos/centrados induzem zonas concêntricas no espelho.
Problema-Marco: Definir o protocolo operacional de preparação de lap de piche, prensagem e controle de polimento para um espelho de 250 mm, incluindo matriz de diagnóstico de defeitos de processo (piche duro demais → borda caída/riscos; piche mole demais → borda caída rápida; cursos longos → hipérbole/zona).
Macrotema 6.3: Metrologia Óptica Quantitativa (Foucault, Couder, Ronchi e Interferência)
Trilha: TRL-ENG-04 | Complexidade: 5/5 | Pré-requisitos Diretos: 6.2 | Pré-requisitos Cruzados: DOM-PHYS:6.4, DOM-PHYS:7.1, DOM-PHYS:7.2, DOM-MATH:6.5, DOM-PROG:2.5
Modalidades de Prática: [Simulação e Cálculo Numérico], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-04 [Fabricação/Oficina] (Cap. II: §§ 25–34; Cap. III: §§ 44–54; Cap. XV)
Subtemas:
Geometria e física do Teste da Faca de Foucault no centro de curvatura (fonte fixa vs. fonte solidária à faca — fator 2× na leitura ΔR): interpretação topográfica das sombras (esfera nula, oblato, paraboloide, borda caída/levantada e zonas)
Medição zonal quantitativa com Máscara de Couder (escolha ótima dos raios zonais h_m com zonas de igual área e medição dos raios de curvatura zonais R_m)
Redução Matemática de Texereau/Millies-Lacroix: comparação entre aberrações longitudinais medidas e ideais do paraboloide (Λ_c = h_m² / R para fonte móvel ou h_m² / (2R) para fonte fixa), cálculo do erro de inclinação transversal (u_m), razão u_m / ρ (em relação ao raio do Disco de Airy — Critério de Danjon-Couder: |u_m/ρ| ≤ 1) e integração numérica para reconstrução do Perfil de Frente de Onda (PV e RMS em frações de λ = 550 nm e Razão de Strehl)
Teste de Ronchi (grade de linhas paralelas — visualização intuitiva de esfericidade, borda caída e astigmatismo)
Metrologia de superfícies planas (espelhos secundários elípticos): Franjas de Interferência de Fizeau contra plano-padrão (interpretação de curvatura das franjas em unidades de λ/2) e Teste de Ritchey-Common
Teste de Estrela (Star Test) em campo (comparação de padrões de difração intra e extrafocais)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Fórmula da aberração longitudinal ideal do paraboloide no centro de curvatura (h²/R para fonte móvel vs. h²/(2R) para fonte fixa), Critério de Danjon-Couder (erro transversal menor que o raio de Airy) e conversão de erro de superfície física para erro de frente de onda (fator 2× em espelhos).
Problema-Marco: Implementar em Python um software completo de Redução de Dados de Foucault/Couder (estilo FigureXP / Texereau) que recebe medições zonais ΔR_m, otimiza o foco de melhor ajuste (best-fit conic), calcula u_m/ρ, integra o perfil de frente de onda em nm e λ, e reporta erro PV, erro RMS e Razão de Strehl (via Maréchal).
Macrotema 6.4: Parabolização, Figuração Asférica e Revestimentos Reflexivos
Trilha: TRL-ENG-04 | Complexidade: 5/5 | Pré-requisitos Diretos: 6.2, 6.3 | Pré-requisitos Cruzados: DOM-PHYS:7.1, DOM-PHYS:7.2
Modalidades de Prática: [Dimensionamento e Projeto], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-04 [Fabricação/Oficina] (Cap. II: §§ 35–43; Cap. III; Cap. XIV)
Subtemas:
Geometria da Parabolização: profundidade asférica máxima entre a esfera de referência e o paraboloide (δ ≈ D⁴ / (2048 R³) — mostrando por que espelhos rápidos f/4 exigem remoção muito maior e tolerância mais crítica que f/8)
Métodos de figuração controlada: cursos em W longos (MOT) com ferramenta plena, ferramentas subdiâmetro (sub-diameter laps), ferramentas estrela/pétala e retoque localizado suave
Diagnóstico e correção iterativa dos defeitos clássicos de figuração: Borda Caída (TDE — Turned-Down Edge), Morro Central, hiperbolização excessiva (sobrecorreção), zonas anulares e Astigmatismo de polimento (causado por apoio irregular ou ausência de rotação contínua)
Teste e fabricação do espelho secundário plano (ou espelho convexo hiperbólico em Cassegrain)
Revestimentos reflexivos metálicos e dielétricos: processo químico de prateamento de Brashear vs. deposição física a vácuo (Aluminização + camada protetora de Monóxido/Dióxido de Silício — SiO/SiO₂ — e revestimentos enhanced) e degradação/limpeza segura de superfícies ópticas
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Lei de escala da profundidade asférica δ ∝ D / (f/#)³, por que um espelho esférico pequeno/lento (ex.: 150 mm f/10) pode satisfazer λ/4 sem parabolização enquanto um 250 mm f/6 exige parabolização rigorosa, e procedimento de prevenção de astigmatismo na bancada.
Problema-Marco: Calcular a profundidade asférica exata para espelhos de 250 mm em f/4, f/6 e f/8, simular na ferramenta de redução do Tema 6.3 a evolução de um espelho da esfera até λ/10 RMS de frente de onda e montar um fluxograma decisório de correção para TDE, zona elevada a 70% e sobrecorreção central.
NÍVEL 7: ENGENHARIA OPTOMECÂNICA E ESTRUTURAL DE TELESCÓPIOS DE GRANDE ABERTURA (KRIEGE & BERRY)
Macrotema 7.1: Arquitetura Optomecânica e Orçamento de Massa e Equilíbrio
Trilha: TRL-ENG-04 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.1, 1.3, 1.4 | Pré-requisitos Cruzados: DOM-PHYS:7.2, DOM-PHYS:7.3, DOM-MATH:1.10
Modalidades de Prática: [Dimensionamento e Projeto], [Simulação e Cálculo Numérico]
Bibliografia e Capítulos: BIB-ENG-05 [Projeto Optomecânico] (Caps. 1–4); BIB-ENG-04 [Fabricação/Oficina] (Caps. IV–V)
Subtemas:
Integração de requisitos ópticos e mecânicos: abertura D, razão focal f/#, interceptação do plano focal, cálculo do eixo menor ótimo do espelho secundário para garantir o Campo Totalmente Iluminado desejado sem elevar excessivamente a obstrução central
Orçamento detalhado de massas (Mass Budget) de cada subsistema (UTA, focalizador, oculares/câmera, secundário, treliça, mirror box, célula e espelho primário)
Cálculo paramétrico do Centro de Gravidade (CG) em 2D/3D (eixo óptico + deslocamento lateral de acessórios) garantindo equilíbrio estável entre 0° e 90° de altitude sob variação de carga no focalizador
Controle de luz espúria (Baffling): traçado geométrico de raios marginais para dimensionar escudos de luz opostos ao focalizador, defletores internos, tintas foscas e tecido protetor (light shroud)
Ergonomia, portabilidade, envoltória de transporte e rigidez mínima de vibração (frequência natural > 15–20 Hz)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Equação do diâmetro mínimo do espelho secundário em função do campo iluminado e distância do plano focal ao eixo óptico, balanço de momentos para localização do eixo de altitude no CG e traçado de baffling contra luz direta do céu no focalizador.
Problema-Marco: Criar em Python uma planilha/ferramenta paramétrica de arquitetura optomecânica para um refletor Newtoniano (ex.: 250 mm f/6) calculando tamanho ótimo do secundário, perfil de iluminação fora do eixo, tabela completa de massas, posição exata do CG (com ocular leve vs. pesada) e geometria dos baffles.
Macrotema 7.2: Engenharia de Células de Espelho Primário e Suporte de Borda
Trilha: TRL-ENG-04 | Complexidade: 5/5 | Pré-requisitos Diretos: 1.3, 1.4, 2.4, 6.3, 7.1 | Pré-requisitos Cruzados: DOM-PHYS:7.2, DOM-MATH:6.6
Modalidades de Prática: [Dimensionamento e Projeto], [Simulação e Cálculo Numérico], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-05 [Projeto Optomecânico] (Caps. 5–6); BIB-ENG-04 [Fabricação/Oficina] (Cap. IV)
Subtemas:
Mecânica de placas circulares finas sob peso próprio: deformação elástica gravitacional de discos de vidro em função do diâmetro D, espessura t, módulo E e densidade ρ (critério de projeto: erro RMS de superfície induzido por gravidade ≤ λ/32 a λ/64 — metodologia PLOP)
Projeto de Células de Flutuação Cinemática Isostática: arquitetura de 3, 6, 9, 18 e 27 pontos apoiados em barras/triângulos balanceados (whiffletree), posicionamento radial ótimo dos pontos de apoio e eliminação de vínculos hiperestáticos que distorcem o vidro
Suporte Lateral / de Borda (atuação em baixas altitudes próximo ao horizonte): por que apoios fora do plano do CG do espelho induzem astigmatismo severo; comparação entre Cinta de 180° (Sling), apoios de borda a ±45° (90° entre si) e Whiffletree Lateral com roletes de baixo atrito
Retenção frontal sem compressão (clips com folga térmica), mecanismos de colimação em 3 pontos com molas de pré-carga sem folga (backlash) e isolamento de dilatação térmica aço/alumínio vs. vidro
Gestão Térmica do Espelho Primário: constante de tempo térmica do vidro, degradação de imagem por pluma de convecção na camada limite (boundary layer) e dimensionamento de ventilação forçada (ventoinhas traseiras + fluxo laminar transversal sobre a face óptica)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Por que uma célula de 9 pontos sem rigidez/geometria cinemática adequada pode ser pior que uma de 6 pontos bem otimizada, importância de aplicar a reação lateral exatamente no plano do CG do disco para zerar momento fletor na borda e efeito óptico da camada limite térmica.
Problema-Marco: Projetar a célula de suporte traseiro (número de pontos, geometria dos triângulos/barras e raio dos apoios) e o suporte lateral no plano do CG para um espelho primário 250 mm × 25 mm, acompanhada de uma estimativa térmica (usando Bi e convecção do Tema 2.4) do tempo de aclimatação com e sem ventilação forçada.
Macrotema 7.3: Engenharia Estrutural de Tubos em Treliça (Truss), UTA e Montagem Altazimutal
Trilha: TRL-ENG-04 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.3, 1.4, 1.5, 7.1 | Pré-requisitos Cruzados: DOM-PHYS:7.3
Modalidades de Prática: [Dimensionamento e Projeto], [Simulação e Cálculo Numérico]
Bibliografia e Capítulos: BIB-ENG-05 [Projeto Optomecânico] (Caps. 7–9); BIB-ENG-04 [Fabricação/Oficina] (Cap. V)
Subtemas:
Mecânica estrutural da Treliça Serrurier / Treliça de 8 Tubos Triangulados: conversão de momentos fletores da gaiola superior em esforços puramente axiais (tração/compressão) nos tubos, cálculo de deflexão da ponta (mantendo erro de colimação < tolerância óptica do f/#), verificação à flambagem de Euler e escolha de tubos (alumínio 6061-T6 vs. fibra de carbono)
Projeto da Gaiola Superior (UTA — Upper Tube Assembly): anéis estruturais rígidos e leves, Aranha Tensionada de 4 Hastes (espessura mínima para menor difração vs. rigidez torcional contra vibração do secundário), suporte e mecanismo de colimação do secundário, cálculo geométrico do Offset do Espelho Secundário (em razão focal rápida) e rigidez do plano do focalizador
Projeto da Caixa do Espelho (Mirror Box) e do Rocker Box: painéis sanduíche/compensado estrutural ou alumínio, rigidez torcional de caixas abertas, abas de reforço (gussets) e prevenção de flexão sob inclinação
Conexões desmontáveis repetíveis de alta precisão (blocos de fixação das hastes mantendo colimação entre montagens)
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Princípio estrutural de triangulação da treliça de 8 tubos (por que tubos paralelos sem triangulação flexionam como vigas), fórmula do offset do secundário (offset ≈ a / (4 f/#)) e relação entre razão focal f/# e tolerância mecânica de deflexão/colimação (zona de tolerância de coma proporcional a (f/#)³).
Problema-Marco: Calcular analiticamente ou em Python (método matricial de treliça 3D) os esforços axiais, o deslocamento linear e a inclinação angular da UTA em um telescópio de treliça de 8 tubos na posição horizontal (altitude 0°), verificando se a deflexão permanece dentro da tolerância de colimação de um sistema f/6 e calculando o offset exato do secundário.
Macrotema 7.4: Tribologia de Mancais Altazimutais, Colimação e Validação em Campo
Trilha: TRL-ENG-04 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.3, 1.5, 7.1, 7.2, 7.3 | Pré-requisitos Cruzados: DOM-PHYS:7.2, DOM-PHYS:7.3
Modalidades de Prática: [Dimensionamento e Projeto], [Normas, Metrologia e Falhas]
Bibliografia e Capítulos: BIB-ENG-05 [Projeto Optomecânico] (Caps. 10–13); BIB-ENG-04 [Fabricação/Oficina] (Caps. V, XV)
Subtemas:
Tribologia de montagens altazimutais / Dobsoniano: fenômeno do Stick-Slip (quando μ_estático > μ_cinético) e solução clássica via par PTFE (Teflon virgem) sobre Laminado Texturizado (FRP / Ebony Star) atingindo μ_s ≈ μ_k ≈ 0,06–0,08 sob pressão de contato ótima (~15 psi / ~0,1 MPa)
Dimensionamento geométrico e mecânico dos Munhões de Altitude (Altitude Bearings): raio ótimo (regra empírica ≥ 1,1× a 1,8× o diâmetro do primário para vencer torques de desequilíbrio por troca de oculares) e efeito do ângulo de separação dos blocos de apoio (60°–90° gerando efeito cunha controlável via 1 / cos(α/2))
Projeto do mancal de Azimute (3 blocos de PTFE alinhados diretamente sobre os 3 pés do ground board para transferir carga sem flexão) e adaptação para motorização/GoTo (acoplamento de encoders, redução sem folga e equilíbrio dinâmico)
Procedimento rigoroso de Colimação Óptica em 3 Passos: centralização do secundário sob o focalizador (sight tube), alinhamento do eixo do focalizador ao centro do primário (laser/Cheshire) e alinhamento do eixo óptico do primário ao focalizador (Barlowed Laser / autocolimador)
Validação integrada em campo: diagnóstico de vibração (tempo de amortecimento < 2 s), equilíbrio em todas as altitudes, rastreio suave sem stick-slip e verificação de desempenho difrativo por Star Test
Critérios de Aceite (DoD):
Conceitos/Critérios Obrigatórios: Condição tribológica para eliminar stick-slip (μ_s ≈ μ_k) e pressão ótima de contato no PTFE, multiplicador de força normal dos blocos de altitude em ângulo α (F_N = W / (2 cos(α/2))), e por que o método Barlowed Laser é insensível a pequenos erros de inclinação do laser no focalizador.
Problema-Marco: Dimensionar o par de munhões de altitude e os 3 blocos de PTFE de azimute (calculando área de cada bloco para atingir pressão de contato ótima de ~0,1 MPa e o torque resistivo de atrito frente à troca de uma ocular de 800 g), e redigir o checklist completo de comissionamento e validação optomecânica em campo.
