ESPECIFICAÇÃO DE DOMÍNIO E REQUISITOS — TELLUSLAB (DOM-PHYS: FÍSICA E ÓPTICA)
## 1. ARQUITETURA PEDAGÓGICA E REQUISITOS DO DOMÍNIO (SRS / DOMAIN PACK)
1.0. Metadados do Pacote de Domínio (Domain Pack)
domainId: DOM-PHYS
slug: physics
name: Física e Óptica
version: 1.0.0
dominiosRelacionados: DOM-MATH, DOM-PROG (pré-requisitos cruzados opcionais ou estritos configuráveis no TellusLab)
1.1. Modelagem de Trilhas de Conhecimento (DAG)
O currículo não é linear; após vencer a base de Medição, Cinemática e Dinâmica de Partículas, divide-se em um Grafo Acíclico Dirigido (DAG) com seis trilhas paralelas e arestas cruzadas com Matemática (DOM-MATH) e Programação (DOM-PROG):
TRL-PHYS-00 (Base Mecânica, Vetorial e Experimental): Medição, análise dimensional, vetores, cinemática, leis de Newton, trabalho/energia e sistemas de partículas (Nível 1).
TRL-PHYS-01 (Corpos Rígidos, Elasticidade, Gravitação e Fluidos): Dinâmica rotacional, momento angular, estática, elasticidade, mecânica celeste e hidrodinâmica (Nível 2).
TRL-PHYS-02 (Oscilações, Ondas Mecânicas e Termodinâmica Clássica): MHS, amortecimento/ressonância, ondas, acústica, teoria cinética dos gases, 1ª e 2ª Leis da Termodinâmica e entropia (Nível 3).
TRL-PHYS-03 (Eletromagnetismo Clássico e Circuitos): Eletrostática, Lei de Gauss, potencial, circuitos CC/CA, magnetostática, indução de Faraday e Equações de Maxwell (Nível 4).
TRL-PHYS-04 (Física Moderna Introdutória): Relatividade especial, origens da quântica, equação de Schrödinger 1D, átomos, estado sólido e física nuclear (Nível 5).
TRL-PHYS-05 (Especialização em Óptica Física, Ondulatória e Sistemas Ópticos): Equações de Fresnel, óptica matricial, polarização (Jones/Stokes), coerência/interferometria, difração (Fraunhofer/Fresnel), óptica de Fourier, aberrações de Seidel/Zernike, Strehl/MTF e física de sistemas formadores de imagem (Níveis 6 e 7).
1.2. Máquina de Estados Finita (FSM) de Proficiência por Macrotema
Cada Macrotema (X.Y) segue a máquina de estados padrão do TellusLab:
S0 — BLOQUEADO: Pelo menos um macrotema listado em Pré-requisitos Diretos ainda não atingiu o estado S4 (PROVA_VALIDADA). (Arestas em Pré-requisitos Cruzados com DOM-MATH ou DOM-PROG atuam como Soft Warning por padrão ou Hard Gate quando o Modo Estrito Interdisciplinar estiver ativo.)
S1 — DISPONIVEL: Todos os pré-requisitos diretos atingiram S4 ou superior; pronto para iniciar estudo.
S2 — TEORIA_CONCLUIDA: Leitura ativa e fichamento das leis físicas, hipóteses de validade, deduções e experimentos clássicos nas obras de referência.
S3 — FIXACAO_MECANICA: Resolução de bateria prática (problemas analíticos graduados, modelagem de corpo livre/circuitos/sistemas ópticos e cálculos com unidades SI) com taxa de acerto ≥ 80%.
S4 — PROVA_VALIDADA (Estado de Desbloqueio): Leis/Teoremas obrigatórios deduzidos sem consulta (com análise dimensional e casos-limite) e Problema-Marco (Capstone) concluído e verificado. Libera nós dependentes no DAG e insere o macrotema no motor FSRS-5.
S5 — REVISAO_EM_DIA: Em ciclo ativo de manutenção via FSRS-5.
S6 — REVISAO_VENCIDA: Intervalo de retenção expirado; exige sessão de revisão antes de avançar em nós filhos.
1.3. Taxonomia de Modalidades de Estudo, Papéis Bibliográficos e Dificuldades
Papéis da Bibliografia:
[Intuição/Clássico]: Forte ênfase em intuição física, visualização conceitual e problemas graduados em níveis de dificuldade (ex.: Halliday, Resnick & Walker).
[Ciclo Básico/Analítico]: Cobertura sistemática e integrada de Física I a IV com tratamento analítico direto (ex.: Tipler Vols. 1a–2b).
[Tratado/Avançado]: Profundidade teórica e formalismo matemático completo em área de especialização (ex.: Eugene Hecht — Óptica).
[Óptica Aplicada/Avaliação]: Ponte quantitativa entre óptica física/geométrica e avaliação rigorosa de sistemas ópticos reais (ex.: Rutten & van Venrooij).
Modalidades de Prática Exigidas por Macrotema:
[Modelagem e Dedução]: Construção de diagramas de corpo livre, escolha de superfícies gaussianas/amperianas, aplicação de leis de conservação e deduções a partir de primeiros princípios.
[Resolução Analítica]: Resolução simbólica e numérica de equações diferenciais, integrais de campo/inércia, circuitos fasoriais e traçado de raios/ondas.
[Verificação Física e Casos-Limite]: Análise dimensional rigorosa, checagem de simetria, limites assintóticos (v ≪ c, h → 0, r → ∞, pequenos ângulos) e conservação de energia/momento.
[Simulação Numérica]: Implementação em Python de integradores de movimento (RK4), mapas de campos E/B, difração/FFT 2D, matrizes ABCD/Jones e ray tracing exato.
Tags de Dificuldade para Diagnóstico Regressivo:
DIF-PHYS-01 (Lacuna em Pré-requisito Interno, DOM-MATH ou DOM-PROG)
DIF-PHYS-02 (Erro de Modelagem / Diagrama de Corpo Livre / Referencial / Simetria)
DIF-PHYS-03 (Erro de Sinal / Convenção Vetorial / Análise Dimensional)
DIF-PHYS-04 (Falha na Manipulação de Cálculo / EDO / Integral de Campo)
DIF-PHYS-05 (Hipótese de Aproximação Violada — ex.: pequenos ângulos, paraxial, regime não-relativístico)
DIF-PHYS-06 (Estouro de Tempo > 75 min)
1.4. Requisitos Funcionais (RF) do Módulo DOM-PHYS
RF-01 (Grafo Curricular e Caminho Crítico): Renderizar o DAG interativo dos 37 macrotemas de DOM-PHYS com suporte à exibição de arestas cruzadas para DOM-MATH e DOM-PROG. Permitir selecionar qualquer macrotema ou obra-alvo (ex.: BIB-PHYS-06 Hecht ou BIB-PHYS-07 Telescope Optics) para calcular via ordenação topológica o subgrafo mínimo pendente.
RF-02 (Motor de Repetição Espaçada — FSRS-5): Agendar cartões derivados dos subtemas e critérios DoD de macrotemas em S4+, cobrindo: (a) enunciados e domínios de validade das leis físicas, (b) simetrias e escolhas de coordenadas, (c) casos-limite clássicos e (d) relações entre óptica geométrica, eletromagnética e de Fourier.
RF-03 (Gerador de Sessões Intercaladas de 45–75 min): Montar sessões práticas de 45 a 75 minutos divididas em 50% avanço em tema ativo (S1–S3), 30% revisão vencida (S6) de trilhas distintas e 20% problemas mistos sem indicação prévia da lei de conservação ou método.
RF-04 (Trava de Solução e Revisão Socrática): Bloquear a solução comentada até o registro obrigatório de tentativa (tempo cronometrado, dedução/cálculo/simulação submetida e tags de dificuldade). A IA cobra explicitamente análise dimensional e verificação de casos-limite antes de validar uma dedução.
RF-05 (Diagnóstico Regressivo Cross-Domain): Ao registrar DIF-PHYS-01 ou DIF-PHYS-04, percorrer as arestas reversas dentro de DOM-PHYS e também em DOM-MATH (ex.: Cálculo Vetorial, EDOs, Fourier) para injetar micro-revisões direcionadas.
RF-06 (Sandbox de Simulação Física): Para macrotemas com [Simulação Numérica], gerar especificações em Python com testes de invariantes físicos (conservação da energia mecânica total, conservação do momento angular, unitariedade de matrizes de Jones ou igualdade entre Strehl numérico e Maréchal).
RF-07 (Métricas Ponderadas e Ponte TellusPedia): Calcular progresso global, por trilha (TRL-PHYS-00 a TRL-PHYS-05) e por obra (BIB-PHYS-01 a BIB-PHYS-07), ponderado por Complexidade (1–5), exportável em snapshot JSON compatível com a rota /lab?domain=physics do TellusPedia (integrando-se diretamente ao Observatório Planetário/Cósmico, órbitas, clima e história da ciência).
1.5. Requisitos Não-Funcionais, Integração e Radar de Lacunas
RNF-01 (Renderização Científica): Suporte a KaTeX (equações vetoriais, integrais de superfície/linha e notação quântica), blocos de código Python (NumPy/SciPy/Matplotlib) e diagramas Mermaid/SVG (DCLs, circuitos e caminhos ópticos).
RNF-02 (Persistência Local-First e Compatibilidade): Compatível com o mesmo schema SQLite/IndexedDB e snapshot JSON do TellusLab, usando IDs qualificados pelo namespace DOM-PHYS.
RNF-03 (Radar de Expansão Futura — Lacunas Conhecidas do Acervo Físico Atual): Este acervo cobre 100% da Física Geral Universitária (I–IV) e nível avançado em Óptica, mas não inclui obras dedicadas ao ciclo teórico intermediário/graduação em: (a) Mecânica Clássica Analítica (Lagrangeana/Hamiltoniana — ex.: Taylor, Thornton & Marion, Goldstein), (b) Eletrodinâmica Intermediária (ex.: Griffiths, Nussenzveig Vol. 3), (c) Mecânica Quântica Formal em Espaços de Hilbert/Dirac (ex.: Griffiths, Cohen-Tannoudji, Sakurai), e (d) Termodinâmica Formal e Mecânica Estatística (ex.: Callen, Salinas). Obras aplicadas de Engenharia Mecânica, Transferência de Calor e Construção Optomecânica (Eshbach, Kent's, Bosch, Bergman, Texereau, Kriege & Berry) estão reservadas ao futuro pacote DOM-ENG.
## 2. CATÁLOGO BIBLIOGRÁFICO (ACERVO BASE DOM-PHYS)
2.1. Física Geral Universitária (Ciclo Básico Completo)
BIB-PHYS-01: Fundamentos de Física, Vol. 1: Mecânica (10ª Edição) — David Halliday, Robert Resnick, Jearl Walker
BIB-PHYS-02: Física, Vol. 1a (2ª Edição — Mecânica) — Paul A. Tipler
BIB-PHYS-03: Física, Vol. 1b (2ª Edição — Gravitação, Fluidos, Oscilações, Ondas e Termodinâmica) — Paul A. Tipler
BIB-PHYS-04: Física, Vol. 2a (2ª Edição — Eletricidade e Magnetismo) — Paul A. Tipler
BIB-PHYS-05: Física, Vol. 2b (2ª Edição — Óptica e Física Moderna) — Paul A. Tipler
2.2. Especialização em Óptica Física e Sistemas Ópticos
BIB-PHYS-06: Óptica (Fundação Calouste Gulbenkian) — Eugene Hecht
BIB-PHYS-07: Telescope Optics: Evaluation and Design — Harrie Rutten, Martin van Venrooij
## 3. TAXONOMIA GRANULAR DE MACROTEMAS, METADADOS E CRITÉRIOS DE ACEITE
NÍVEL 1: FUNDAMENTOS DE MEDIÇÃO, CINEMÁTICA E DINÂMICA DE PARTÍCULAS (MECÂNICA I)
Macrotema 1.1: Medição, Análise Dimensional, Vetores e Propagação de Incertezas
Trilha: TRL-PHYS-00 | Complexidade: 1/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: DOM-MATH:1.5, DOM-MATH:3.1, DOM-MATH:3.2
|---|---|- Modalidades de Prática: [Modelagem e Dedução], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-01 [Intuição/Clássico] (Caps. 1, 3); BIB-PHYS-02 [Ciclo Básico/Analítico] (Cap. 1)
Subtemas:
Sistema Internacional de Unidades (SI), grandezas fundamentais vs. derivadas e conversão de unidades
Análise dimensional (homogeneidade de equações físicas e estimativa de relações de escala)
Ordens de grandeza, estimativas de Fermi, algarismos significativos e propagação de incertezas experimentais
Grandezas escalares e vetoriais: decomposição em componentes ortogonais 2D/3D, vetores unitários (i, j, k)
Produto escalar e produto vetorial aplicados a projeções, trabalho e torque
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Princípio da homogeneidade dimensional, regra da mão direita para produto vetorial e fórmula de propagação de erro em produtos/potências.
Problema-Marco: Deduzir por análise dimensional (a menos de constante adimensional) o período de um pêndulo simples e a velocidade de ondas em uma corda tensa, e resolver operações vetoriais 3D com verificação de ortogonalidade.
Macrotema 1.2: Cinemática em Uma, Duas e Três Dimensões
Trilha: TRL-PHYS-00 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-MATH:5.2, DOM-MATH:5.4, DOM-MATH:5.7
Modalidades de Prática: [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-01 [Intuição/Clássico] (Caps. 2, 4); BIB-PHYS-02 [Ciclo Básico/Analítico] (Caps. 2–3)
Subtemas:
Vetor posição r(t), deslocamento, velocidade média/instantânea (v = dr/dt) e aceleração (a = dv/dt)
Cinemática integral para aceleração constante e aceleração dependente do tempo, posição ou velocidade
Queda livre e lançamento oblíquo de projéteis (equação da trajetória, alcance, altura máxima e envoltória)
Movimento circular uniforme (aceleração centrípeta v²/R) e não-uniforme (componentes tangencial e radial da aceleração)
Movimento relativo em 1D, 2D e 3D (Transformações de Galileu para posição e velocidade)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Dedução integral das equações cinemáticas a partir de a(t), independência dos movimentos ortogonais em projéteis e decomposição a = a_t t̂ + a_r r̂.
Problema-Marco: Resolver a cinemática completa de uma partícula com aceleração variável a(v) = −kv e de um projétil lançado sobre um plano inclinado, verificando os casos-limite de inclinação zero e 90°.
Macrotema 1.3: Leis de Newton e Dinâmica de Partículas
Trilha: TRL-PHYS-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.2 | Pré-requisitos Cruzados: DOM-MATH:5.13
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-01 [Intuição/Clássico] (Caps. 5–6); BIB-PHYS-02 [Ciclo Básico/Analítico] (Caps. 4–5)
Subtemas:
Primeira Lei (inércia e definição de referencial inercial), Segunda Lei (F_res = dp/dt = ma) e Terceira Lei (pares ação-reação)
Construção rigorosa de Diagramas de Corpo Livre (DCL) e escolha estratégica de eixos coordenados
Forças de contato e vínculo: normal, tração, força elástica de Hooke e vínculos cinemáticos em sistemas de blocos e polias móveis
Forças de atrito estático (f_e ≤ μ_e N) e cinético (f_c = μ_c N) em planos horizontais, inclinados e acoplados
Forças de arrasto em fluidos (linear −bv e quadrática −cv² — velocidade terminal) e dinâmica do movimento circular (curvas compensadas / pêndulo cônico)
Referenciais acelerados e forças fictícias/inerciais (força centrífuga e noção introdutória de Coriolis)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Distinção entre força de atrito estático (força de vínculo ajustável) e cinético, condição de validade das Leis de Newton em referenciais inerciais e derivação da velocidade terminal sob arrasto.
Problema-Marco: Resolver o problema da cunha móvel sem atrito (com bloco deslizando sobre ela) e de um sistema de polias acopladas com atrito, validando os limites de massa da cunha m_cunha → ∞ e m_cunha → 0.
Macrotema 1.4: Trabalho, Energia e Conservação da Energia Mecânica
Trilha: TRL-PHYS-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.3 | Pré-requisitos Cruzados: DOM-MATH:5.4, DOM-MATH:5.8, DOM-MATH:5.11
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-01 [Intuição/Clássico] (Caps. 7–8); BIB-PHYS-02 [Ciclo Básico/Analítico] (Caps. 6–7)
Subtemas:
Trabalho realizado por força constante e força variável em trajetória curva (W = ∫ F · dr) e potência instantânea (P = F · v)
Teorema Trabalho-Energia Cinética (W_total = ΔK)
Forças conservativas (independência de caminho / trabalho nulo em circuito fechado) vs. forças dissipativas/não-conservativas
Funções Energia Potencial (gravitacional, elástica e potenciais gerais) e relação diferencial F = −∇U (em 1D: F_x = −dU/dx)
Análise qualitativa de curvas de energia potencial U(x): pontos de equilíbrio estável, instável e indiferente, pontos de retorno e oscilações em torno de mínimos
Conservação da Energia Mecânica e balanço geral de energia com trabalho de forças não-conservativas (ΔE_mec = W_nc)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Demonstração do Teorema Trabalho-Energia Cinética via regra da cadeia, caracterização de força conservativa via F = −∇U e estabilidade de equilíbrio via sinal de d²U/dx².
Problema-Marco: Analisar o movimento completo de uma partícula sob um potencial não-linear (ex.: potencial de Lennard-Jones ou loop circular com atrito parcial), determinando pontos de equilíbrio, frequência de pequenas oscilações e energia mínima de escape/contorno.
Macrotema 1.5: Sistemas de Partículas, Centro de Massa, Momento Linear e Colisões
Trilha: TRL-PHYS-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.3, 1.4 | Pré-requisitos Cruzados: DOM-MATH:5.6, DOM-MATH:5.10
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-01 [Intuição/Clássico] (Cap. 9); BIB-PHYS-02 [Ciclo Básico/Analítico] (Cap. 8)
Subtemas:
Centro de massa (CM) de sistemas discretos e corpos contínuos via integração (R_CM = (1/M) ∫ r dm) e uso de simetria
Dinâmica de sistemas de partículas: F_ext = M a_CM e decomposição da energia cinética (Teorema de König)
Momento linear total P = ∑ m_i v_i, Impulso (J = ∫ F dt = ΔP) e Lei da Conservação do Momento Linear
Colisões em 1D e 2D: elásticas, inelásticas e perfeitamente inelásticas; coeficiente de restituição; análise no referencial do laboratório vs. referencial do Centro de Massa
Sistemas com massa variável: dedução da Equação do Foguete de Tsiolkovsky (v_f − v_i = v_ex ln(M_i/M_f)) e cadeias/correias em movimento
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Condição exata de conservação do momento linear (F_ext = 0), preservação da velocidade relativa de aproximação/afastamento em colisões elásticas 1D e dedução da equação de Tsiolkovsky.
Problema-Marco: Deduzir as velocidades finais de uma colisão elástica 2D transformando para o referencial do Centro de Massa (mostrando o ângulo de 90° para massas iguais) e simular numericamente a trajetória de um foguete de dois estágios com gravidade.
NÍVEL 2: CORPOS RÍGIDOS, ELASTICIDADE, GRAVITAÇÃO E MECÂNICA DOS FLUIDOS (MECÂNICA II)
Macrotema 2.1: Cinemática e Dinâmica Rotacional de Corpos Rígidos
Trilha: TRL-PHYS-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.4, 1.5 | Pré-requisitos Cruzados: DOM-MATH:5.6, DOM-MATH:5.10
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica]
Bibliografia e Capítulos: BIB-PHYS-01 [Intuição/Clássico] (Cap. 10); BIB-PHYS-02 [Ciclo Básico/Analítico] (Cap. 9)
Subtemas:
Cinemática rotacional em torno de eixo fixo (θ, ω, α) e relação entre grandezas lineares e angulares
Energia cinética de rotação e cálculo integral do Momento de Inércia (I = ∫ r² dm) para barras, discos, cilindros, esferas sólidas e cascas
Teorema dos Eixos Paralelos (Teorema de Steiner: I = I_CM + Md²) e Teorema dos Eixos Perpendiculares para lâminas planas
Torque (τ = r × F), Segunda Lei de Newton para rotações (∑ τ = I α), trabalho e potência rotacional (P = τ ω)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Dedução do Teorema de Steiner, cálculo integral do momento de inércia de um cilindro sólido e de uma esfera maciça (2/5 MR²) e equação acoplada translação-rotação com polias massivas.
Problema-Marco: Calcular por integração direta o momento de inércia de um cone maciço e de uma placa retangular em torno de eixos deslocados, e resolver uma máquina de Atwood com polia maciça sujeita a torque de atrito no eixo.
Macrotema 2.2: Rolamento, Momento Angular e Giroscópios
Trilha: TRL-PHYS-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 2.1 | Pré-requisitos Cruzados: DOM-MATH:3.2
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-01 [Intuição/Clássico] (Cap. 11); BIB-PHYS-02 [Ciclo Básico/Analítico] (Cap. 10)
Subtemas:
Movimento combinado de translação e rotação, condição cinemática de rolamento sem deslizamento (v_CM = ωR, a_CM = αR) e papel do atrito estático no rolamento
Transição de deslizamento puro para rolamento puro (bola de boliche / ioiô) e energia cinética total K = (1/2) M v_CM² + (1/2) I_CM ω²
Momento angular de uma partícula (L = r × p) e de um sistema/corpo rígido simétrico (L = I ω)
Forma vetorial geral da dinâmica rotacional (τ_ext = dL/dt) e Lei da Conservação do Momento Angular
Colisões rotacionais (ex.: projétil atingindo barra articulada) e física vetorial da precessão giroscópica (Ω_p = Mgr / Iω)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Por que a força de atrito estático não realiza trabalho no rolamento puro, conservação do momento angular em colisões com eixo fixo (onde o momento linear não se conserva) e explicação vetorial de por que um giroscópio precessiona em vez de cair.
Problema-Marco: Analisar uma esfera maciça lançada com velocidade inicial v₀ e rotação retrógrada ω₀ sobre uma superfície com atrito cinético μ_c, determinando o tempo, a distância e a velocidade exatos em que o rolamento puro se estabelece (incluindo a condição para ela retornar à origem).
Macrotema 2.3: Equilíbrio Estático e Elasticidade dos Sólidos
Trilha: TRL-PHYS-01 | Complexidade: 2/5 | Pré-requisitos Diretos: 2.1 | Pré-requisitos Cruzados: DOM-MATH:3.4
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica]
Bibliografia e Capítulos: BIB-PHYS-01 [Intuição/Clássico] (Cap. 12); BIB-PHYS-02 [Ciclo Básico/Analítico] (Cap. 11)
Subtemas:
Condições necessárias e suficientes de equilíbrio estático de um corpo rígido (∑ F = 0 e ∑ τ = 0 em relação a qualquer ponto de referência)
Centro de gravidade vs. centro de massa em campos gravitacionais uniformes e não-uniformes
Análise de vigas, escadas apoiadas com atrito, treliças simples e estruturas estaticamente indeterminadas
Elasticidade de sólidos contínuos: tensão (stress) e deformação relativa (strain), diagrama tensão-deformação (limite elástico, escoamento e ruptura)
Lei de Hooke generalizada: Módulo de Young (tração/compressão), Módulo de Cisalhamento (G) e Módulo Volumétrico / Bulk (B)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Independência da escolha do polo de torque quando ∑ F = 0 e definições dimensionais dos três módulos elásticos (E, G, B).
Problema-Marco: Determinar o ângulo mínimo de equilíbrio e todas as reações de apoio de um guindaste ou escada com carga variável e calcular o alongamento elástico sob peso próprio de um cabo vertical suspenso por integração.
Macrotema 2.4: Gravitação Universal e Mecânica Celeste
Trilha: TRL-PHYS-01 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.4, 2.2 | Pré-requisitos Cruzados: DOM-MATH:1.10, DOM-MATH:5.7, DOM-MATH:6.6
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-01 [Intuição/Clássico] (Cap. 13); BIB-PHYS-03 [Ciclo Básico/Analítico] (Cap. 11)
Subtemas:
Lei da Gravitação Universal de Newton, constante G e experimento de Cavendish
Teorema das Cascas Esféricas (campo gravitacional externo equivalente a massa pontual e campo nulo no interior de casca oca) e gravidade no interior de um planeta
Energia potencial gravitacional U(r) = −GMm/r, velocidade orbital circular e velocidade de escape
As Três Leis de Kepler: dedução da 2ª Lei (áreas iguais) diretamente da conservação do momento angular e da 3ª Lei (T² ∝ a³)
Energia total de órbitas cônicas (elíptica E < 0, parabólica E = 0, hiperbólica E > 0), manobra de transferência orbital de Hohmann e Princípio da Equivalência (massa inercial vs. gravitacional)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Teorema das Cascas Esféricas, dedução da 2ª Lei de Kepler via dA/dt = L/(2m) e fórmula da energia total de órbita elíptica E = −GMm/(2a) (dependente apenas do semieixo maior a).
Problema-Marco: Calcular o Δv completo de uma órbita de transferência de Hohmann entre órbita baixa terrestre e órbita geoestacionária (ou Terra-Marte) e simular numericamente em Python (RK4) a órbita elíptica validando a conservação de E e L.
Macrotema 2.5: Estática e Dinâmica dos Fluidos
Trilha: TRL-PHYS-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.4, 2.3 | Pré-requisitos Cruzados: DOM-MATH:5.6, DOM-MATH:5.11
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-01 [Intuição/Clássico] (Cap. 14); BIB-PHYS-03 [Ciclo Básico/Analítico] (Cap. 12)
Subtemas:
Massa específica, pressão hidrostática (isotropia), variação da pressão com a profundidade (Lei de Stevin) e barômetros/manômetros
Princípio de Pascal (prensa hidráulica), Princípio de Arquimedes (empuxo, flutuação e estabilidade de corpos submersos) e tensão superficial/capilaridade
Cinemática de fluidos: linhas de corrente, escoamento estacionário, incompressível e irrotacional; Equação da Continuidade (A₁v₁ = A₂v₂)
Dedução energética da Equação de Bernoulli (P + (1/2)ρv² + ρgy = const) e aplicações (efeito Venturi, tubo de Pitot, Teorema de Torricelli e força de sustentação)
Fluidos reais: viscosidade dinâmica, perfil parabólico em escoamento laminar (Lei de Poiseuille), Lei de Stokes e Número de Reynolds (transição laminar → turbulento)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Dedução do Princípio de Arquimedes por integração de pressão, hipóteses restritivas de validade da Equação de Bernoulli e definição adimensional do Número de Reynolds.
Problema-Marco: Calcular a força total e o centro de pressão sobre uma comporta inclinada de barragem via integração, e resolver o esvaziamento transiente de um reservatório cônico/cilíndrico combinando Continuidade e Torricelli/Bernoulli.
NÍVEL 3: OSCILAÇÕES, ONDAS MECÂNICAS E TERMODINÂMICA CLÁSSICA
Macrotema 3.1: Oscilações Harmônicas Simples, Amortecidas e Forçadas
Trilha: TRL-PHYS-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.4, 2.1 | Pré-requisitos Cruzados: DOM-MATH:1.9, DOM-MATH:5.13
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-03 [Ciclo Básico/Analítico] (Cap. 13); BIB-PHYS-01 [Intuição/Clássico] (Cap. 15 — se disponível/equivalente)
Subtemas:
Equação diferencial do Movimento Harmônico Simples (d²x/dt² + ω²x = 0), solução geral, amplitude, frequência angular e constante de fase
Balanço energético no MHS (energia cinética, potencial e valor médio temporal) e representação no espaço de fase
Sistemas oscilatórios físicos: sistema massa-mola (série/paralelo), pêndulo simples (linearização sen θ ≈ θ), pêndulo físico (centro de oscilação) e pêndulo de torção
Oscilador harmônico amortecido (força −bv): regimes subamortecido, criticamente amortecido e superamortecido; decremento logarítmico e fator de qualidade Q
Oscilador harmônico forçado (F₀ cos ω_d t): resposta estacionária, curva de amplitude e defasagem em função de ω_d, potência absorvida e fenômeno da ressonância
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Solução completa das EDOs do MHS, do oscilador amortecido (critério b² vs. 4mk) e fórmula da amplitude em regime permanente do oscilador forçado.
Problema-Marco: Derivar a frequência de pequenas oscilações de um pêndulo físico composto e simular numericamente em Python a curva de ressonância e a divergência entre pêndulo linearizado e pêndulo não-linear para ângulos grandes (θ₀ = 90°).
Macrotema 3.2: Ondas Mecânicas, Superposição e Acústica
Trilha: TRL-PHYS-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.1 | Pré-requisitos Cruzados: DOM-MATH:5.8, DOM-MATH:5.12
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-03 [Ciclo Básico/Analítico] (Caps. 14–15)
Subtemas:
Ondas mecânicas transversais e longitudinais, pulsos viajantes f(x ∓ vt) e ondas harmônicas progressivas (k, ω, λ, v = ω/k)
Dedução dinâmica da Equação de Onda 1D em uma corda tensa (∂²y/∂x² = (μ/T) ∂²y/∂t²) e velocidade do som em fluidos e sólidos (v = √(B/ρ))
Transporte de energia, densidade de energia e potência média em ondas progressivas; ondas esféricas e lei do inverso do quadrado
Princípio da Superposição linear, interferência construtiva/destrutiva, reflexão e transmissão em fronteiras de meios diferentes (inversão de fase)
Ondas estacionárias, nós, antinós, condições de contorno e modos normais / séries harmônicas em cordas vibrantes e tubos sonoros (abertos e fechados)
Acústica: ondas de pressão vs. deslocamento, nível sonoro em decibéis (dB), batimentos temporais e Efeito Doppler (fonte e observador móveis + ondas de choque / cone de Mach)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Derivação da equação de onda na corda e da velocidade v = √(T/μ), diferença de fase π na reflexão em extremidade fixa, condição de ressonância em tubos abertos vs. semi-abertos e fórmula geral do Efeito Doppler.
Problema-Marco: Deduzir os coeficientes de reflexão e transmissão de amplitude e energia na junção entre duas cordas de densidades μ₁ e μ₂ (verificando conservação da energia R + T = 1) e analisar a decomposição em harmônicos de uma corda dedilhada via Série de Fourier.
Macrotema 3.3: Temperatura, Calorimetria e Transferência de Calor
Trilha: TRL-PHYS-02 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.4, 2.5 | Pré-requisitos Cruzados: DOM-MATH:5.4
Modalidades de Prática: [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-03 [Ciclo Básico/Analítico] (Caps. 16–17)
Subtemas:
Equilíbrio térmico, Lei Zero da Termodinâmica, termômetro de gás a volume constante e escala termodinâmica absoluta (Kelvin)
Expansão térmica linear, superficial e volumétrica em sólidos e líquidos (anomalia da água) e tensões térmicas em barras engastadas
Calor como energia em trânsito, calorimetria, calor específico (constante e variável com T), calor latente de fusão/vaporização e diagramas de fase (ponto triplo e ponto crítico)
Mecanismos físicos de transferência de calor: Condução (Lei de Fourier e resistência térmica em série/paralelo), Convecção (Lei de Resfriamento de Newton) e Radiação Térmica (Lei de Stefan-Boltzmann P = εσAT⁴ e equilíbrio radiativo planetário)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Definição operacional de temperatura via Lei Zero e gás ideal, Lei de Fourier da condução em regime estacionário e Lei de Stefan-Boltzmann para radiação de corpo negro.
Problema-Marco: Calcular a temperatura de equilíbrio radiativo de um planeta (com albedo e efeito estufa simples) usando Stefan-Boltzmann e resolver o fluxo de calor estacionário através de paredes cilíndricas/esféricas compostas por integração da Lei de Fourier.
Macrotema 3.4: Teoria Cinética dos Gases e Distribuição Molecular
Trilha: TRL-PHYS-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.5, 3.3 | Pré-requisitos Cruzados: DOM-MATH:5.10, DOM-MATH:7.3, DOM-MATH:7.5
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica]
Bibliografia e Capítulos: BIB-PHYS-03 [Ciclo Básico/Analítico] (Cap. 16)
Subtemas:
Modelo microscópico do gás ideal e derivação cinética da pressão (P = (1/3)(N/V)m⟨v²⟩) e da Equação de Estado (PV = nRT = Nk_B T)
Interpretação microscópica da temperatura (K_trans = (3/2) k_B T) e velocidade quadrática média (v_rms)
Teorema da Equipartição da Energia ((1/2) k_B T por grau de liberdade quadrático): gases monoatômicos, diatômicos e poliatômicos (congelamento quântico de modos rotacionais/vibracionais) e previsão das capacidades térmicas molares C_V, C_P e razão adiabática γ
Colisões intermoleculares, seção de choque e Livre Caminho Médio (λ)
Distribuição de Velocidades de Maxwell-Boltzmann: forma funcional f(v), derivação da velocidade mais provável, velocidade média e v_rms, e gases reais (Equação de van der Waals)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Derivação da pressão cinética por transferência de momento nas paredes, Teorema da Equipartição prevendo C_V = (3/2)R e (5/2)R e ordenação v_p < v_med < v_rms na distribuição de Maxwell-Boltzmann.
Problema-Marco: Integrar analiticamente os momentos da distribuição de Maxwell-Boltzmann para obter v_p, v_med e v_rms (usando integrais Gaussianas) e estimar a fração de moléculas de H₂ e N₂ na atmosfera superior com velocidade acima da velocidade de escape planetária.
Macrotema 3.5: Primeira Lei da Termodinâmica e Processos Termodinâmicos
Trilha: TRL-PHYS-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 3.3, 3.4 | Pré-requisitos Cruzados: DOM-MATH:5.4, DOM-MATH:5.8
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica]
Bibliografia e Capítulos: BIB-PHYS-03 [Ciclo Básico/Analítico] (Cap. 17)
Subtemas:
Sistemas termodinâmicos, variáveis de estado vs. funções de caminho (calor Q e trabalho W), equilíbrio termodinâmico e processos quase-estáticos
Trabalho de expansão/compressão em diagramas PV (W = ∫ P dV)
Primeira Lei da Termodinâmica (dU = δQ − δW ou ΔU = Q − W) e energia interna de um gás ideal como função exclusiva de T (Experimento de Joule / expansão livre)
Relação de Mayer (C_P − C_V = R)
Análise quantitativa dos quatro processos canônicos: isocórico, isobárico, isotérmico (W = nRT ln(V_f/V_i)) e adiabático reversível (dedução de PV^γ = const e TV^{γ−1} = const)
Ciclos termodinâmicos fechados em diagramas PV e cálculo de trabalho líquido e eficiência
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Por que ΔU independe do caminho enquanto Q e W dependem, dedução da Relação de Mayer e dedução da equação da adiabática PV^γ = const.
Problema-Marco: Calcular Q, W e ΔU em cada etapa de um ciclo termodinâmico composto (ex.: Ciclo Otto ou Diesel idealizado em diagrama PV), deduzindo sua eficiência exclusivamente em função da razão de compressão e de γ.
Macrotema 3.6: Segunda Lei da Termodinâmica, Máquinas Térmicas e Entropia
Trilha: TRL-PHYS-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.5 | Pré-requisitos Cruzados: DOM-MATH:1.8, DOM-MATH:5.4, DOM-MATH:7.7
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-03 [Ciclo Básico/Analítico] (Cap. 18)
Subtemas:
Processos reversíveis vs. irreversíveis e a flecha do tempo termodinâmica
Máquinas térmicas (eficiência η = W/Q_H), refrigeradores e bombas de calor (COP)
Segunda Lei da Termodinâmica: Enunciado de Kelvin-Planck e Enunciado de Clausius e demonstração de sua equivalência lógica
Ciclo de Carnot (duas isotérmicas + duas adiabáticas), Teorema de Carnot (eficiência máxima η_C = 1 − T_C/T_H) e definição absoluta da escala de temperatura
Desigualdade de Clausius (∮ δQ/T ≤ 0) e definição termodinâmica de Entropia como função de estado (ΔS = ∫ δQ_rev/T)
Princípio do aumento da entropia do universo (ΔS_univ ≥ 0) aplicado à condução térmica, mistura de gases (Paradoxo de Gibbs) e expansão livre
Interpretação estatística de Boltzmann (S = k_B ln Ω, microestados vs. macroestados) e noção da Terceira Lei da Termodinâmica
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Prova da equivalência entre Kelvin-Planck e Clausius, demonstração da eficiência de Carnot η_C = 1 − T_C/T_H e método de cálculo de ΔS para processos irreversíveis construindo um caminho reversível auxiliar entre os mesmos estados inicial e final.
Problema-Marco: Calcular a variação de entropia do sistema, da vizinhança e do universo para (a) expansão livre adiabática de um gás ideal (comparando resultado termodinâmico com a fórmula estatística de Boltzmann k_B ln Ω) e (b) equilíbrio térmico entre dois blocos de capacidades térmicas diferentes isolados.
NÍVEL 4: ELETROSTÁTICA, CIRCUITOS E ELETROMAGNETISMO CLÁSSICO
Macrotema 4.1: Carga Elétrica, Lei de Coulomb e Campo Elétrico
Trilha: TRL-PHYS-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.3, 1.4 | Pré-requisitos Cruzados: DOM-MATH:3.1, DOM-MATH:5.4, DOM-MATH:5.6
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-04 [Ciclo Básico/Analítico] (Caps. 19–20)
Subtemas:
Carga elétrica, quantização (e), conservação da carga, eletrização por atrito/contato/indução, condutores e isolantes
Lei de Coulomb na forma vetorial e Princípio da Superposição para sistemas de cargas discretas
Definição do vetor Campo Elétrico E = F/q₀ e representação geométrica por linhas de campo
Cálculo por integração direta do campo E para distribuições contínuas de carga (densidades linear λ, superficial σ e volumétrica ρ): barra finita/infinita, anel carregado, disco carregado e plano infinito
Dipolo elétrico (momento de dipolo p = qd), campo distante de um dipolo (decaimento 1/r³), torque (τ = p × E), energia potencial (U = −p · E) e movimento de partículas carregadas em campos uniformes
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Forma vetorial da Lei de Coulomb, uso de argumentos de simetria para cancelar componentes antes de integrar e comportamento assintótico (r ≫ R) do campo de um anel/disco reduzindo-se ao campo de carga pontual.
Problema-Marco: Calcular por integração direta o campo elétrico E em pontos fora do eixo de simetria de uma barra finita e ao longo do eixo de um disco carregado, verificando os casos-limite R → 0 (carga pontual) e R → ∞ (plano infinito σ/2ε₀), e plotar as linhas de campo de um dipolo/quadrupolo em Python.
Macrotema 4.2: Fluxo Elétrico e Lei de Gauss
Trilha: TRL-PHYS-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.1 | Pré-requisitos Cruzados: DOM-MATH:5.10, DOM-MATH:5.11
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-04 [Ciclo Básico/Analítico] (Cap. 20)
Subtemas:
Vetor área dA e definição integral de Fluxo Elétrico (Φ_E = ∫ E · dA)
Lei de Gauss na forma integral (∮ E · dA = Q_int / ε₀) e equivalência física com a lei do inverso do quadrado (ângulo sólido)
Aplicação estratégica da Lei de Gauss em sistemas com alta simetria: esférica (esfera isolante uniforme e não-uniforme ρ(r), casca esférica), cilíndrica (cabo coaxial, cilindro sólido infinito) e planar (placas paralelas)
Propriedades de condutores em equilíbrio eletrostático: campo nulo no interior, carga líquida exclusivamente na superfície externa, campo perpendicular na superfície (E = σ/ε₀) e blindagem eletrostática (Gaiola de Faraday)
Conexão diferencial via Teorema da Divergência de Gauss: ∇ · E = ρ / ε₀
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Condições de simetria necessárias para extrair E da integral da Lei de Gauss, descontinuidade de σ/ε₀ do campo ao atravessar uma superfície carregada e distribuição de cargas induzidas em cavidades condutoras.
Problema-Marco: Determinar o campo elétrico E(r) em todas as regiões de uma esfera isolante com densidade radial ρ(r) = αr² envolta por uma casca condutora concêntrica, traçar E(r) verificando continuidade/descontinuidade nas fronteiras e calcular o campo dentro de uma cavidade esférica descentrada em uma esfera uniformemente carregada por superposição.
Macrotema 4.3: Potencial Elétrico e Energia Eletrostática
Trilha: TRL-PHYS-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.4, 4.1, 4.2 | Pré-requisitos Cruzados: DOM-MATH:5.8, DOM-MATH:5.11
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica]
Bibliografia e Capítulos: BIB-PHYS-04 [Ciclo Básico/Analítico] (Cap. 21)
Subtemas:
Caráter conservativo do campo eletrostático (∮ E · dl = 0; ∇ × E = 0) e definição de diferença de potencial elétrico (ΔV = −∫ E · dl)
Superfícies equipotenciais e sua ortogonalidade às linhas de campo elétrico
Cálculo de V(r) para cargas pontuais, dipolos e distribuições contínuas (anel, disco, esfera, linha infinita — escolha de ponto de referência finito)
Recuperação do campo elétrico a partir do potencial via gradiente (E = −∇V)
Energia potencial eletrostática de sistemas de cargas discretas, energia própria de uma esfera carregada e densidade de energia no campo elétrico (u_E = (1/2) ε₀ E²)
Potencial constante em condutores em equilíbrio e efeito das pontas (rigidez dielétrica)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Relação inversa entre integração de linha (ΔV = −∫ E · dl) e gradiente (E = −∇V), por que o potencial de um cilindro infinito não pode ter referência nula no infinito e equivalência entre energia de montagem de cargas e ∫ (1/2)ε₀ E² dV.
Problema-Marco: Calcular o potencial V(r) em todo o espaço para uma esfera isolante carregada e obter a energia eletrostática total por dois métodos independentes (montagem por cascas sucessivas vs. integração da densidade u_E em todo o espaço), verificando a igualdade exata.
Macrotema 4.4: Capacitância, Dielétricos, Corrente Elétrica e Circuitos CC
Trilha: TRL-PHYS-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 4.2, 4.3 | Pré-requisitos Cruzados: DOM-MATH:3.4, DOM-MATH:5.13
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-04 [Ciclo Básico/Analítico] (Caps. 22–23)
Subtemas:
Definição de capacitância (C = Q/V), cálculo geométrico para capacitores de placas paralelas, cilíndrico e esférico, associação série/paralelo e energia armazenada (U = Q²/2C)
Dielétricos: polarização molecular, cargas ligadas, constante dielétrica κ, Lei de Gauss na presença de dielétricos (vetor deslocamento D = ε₀E + P) e força exercida sobre dielétrico parcialmente inserido
Corrente elétrica (I = dQ/dt), vetor densidade de corrente J, equação da continuidade de carga, modelo microscópico de Drude (velocidade de deriva e resistividade), Lei de Ohm (J = σE e V = RI) e dissipação de potência (Efeito Joule)
Força eletromotriz (fem), resistência interna, Regras de Kirchhoff (lei dos nós = conservação de carga; lei das malhas = caráter conservativo de V), circuitos multimalhas e instrumentos de medida (amperímetro/voltímetro)
Circuitos transitórios RC: dedução das equações de carga q(t) = Cε(1 − e^{−t/RC}) e descarga, constante de tempo τ = RC e balanço energético (50% dissipado no resistor na carga)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Conservação de carga/energia nas Leis de Kirchhoff, cálculo da força sobre dielétrico via variação de energia sob Q constante vs. V constante, e solução da EDO do circuito RC com comprovação de que metade da energia fornecida pela bateria é dissipada no resistor independentemente de R.
Problema-Marco: Resolver simbolicamente e numericamente um circuito CC com múltiplas malhas e um capacitor (regimes t = 0⁺, transitório e t → ∞) e calcular a capacitância equivalente de um capacitor preenchido com dois dielétricos em série e em paralelo.
Macrotema 4.5: Campo Magnético, Força de Lorentz e Fontes de Campo Magnético
Trilha: TRL-PHYS-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.3, 4.4 | Pré-requisitos Cruzados: DOM-MATH:3.2, DOM-MATH:5.11
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-04 [Ciclo Básico/Analítico] (Caps. 24–25)
Subtemas:
Definição do campo magnético B pela Força de Lorentz (F = q(E + v × B)); trabalho nulo da força magnética
Movimento de cargas em campos magnéticos e cruzados: trajetória circular/helicoidal, frequência ciclotrônica, seletor de velocidades, espectrômetro de massa, cíclotron e Efeito Hall
Força magnética sobre condutores com corrente (dF = I dl × B), torque sobre espira fechada (τ = μ × B), momento de dipolo magnético (μ = NIA) e princípio de motores CC
Fontes de campo magnético: Lei de Biot-Savart (dB = (μ₀/4π) (I dl × r̂)/r²) aplicada a fio reto finito/infinito, arco/espira circular (eixo de simetria) e bobinas de Helmholtz
Força magnética entre condutores paralelos (definição histórica do ampère)
Lei de Gauss para o Magnetismo (∮ B · dA = 0 — ausência de monopolos magnéticos) e Lei de Ampère (∮ B · dl = μ₀ I_env) aplicada a fio cilíndrico, solenoide ideal e toroide
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Por que campos magnéticos estáticos não alteram a energia cinética de cargas, derivação da tensão Hall identificando o sinal dos portadores de carga, cálculo por Biot-Savart do campo no eixo de uma espira e condições de simetria para a Lei de Ampère.
Problema-Marco: Calcular o campo magnético B(r) no interior e exterior de um cabo coaxial com densidade de corrente não-uniforme J(r) via Lei de Ampère, e simular em Python (RK4) a trajetória 3D de uma partícula carregada em campos E e B cruzados (deriva E × B) e em uma garrafa magnética.
Macrotema 4.6: Indução Eletromagnética, Indutância, Magnetismo na Matéria e Circuitos RL/LC/RLC
Trilha: TRL-PHYS-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.1, 4.5 | Pré-requisitos Cruzados: DOM-MATH:5.11, DOM-MATH:5.13
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-04 [Ciclo Básico/Analítico] (Caps. 26–27)
Subtemas:
Fluxo magnético (Φ_B = ∫ B · dA), Lei de Indução de Faraday (ε = −dΦ_B/dt) e Lei de Lenz como consequência da conservação da energia
Fem de movimento (barra deslizante sobre trilhos em campo B — frenagem eletromagnética), geradores elétricos e correntes parasitas (Foucault)
Campos elétricos induzidos não-conservativos: forma integral ∮ E · dl = −dΦ_B/dt (conexão diferencial ∇ × E = −∂B/∂t) e princípio do bétatron
Autoindutância (L = NΦ_B/I — solenoide e cabo coaxial), indutância mútua (M) e densidade de energia magnética (u_B = B²/2μ₀)
Propriedades magnéticas da matéria: magnetização M, diamagnetismo, paramagnetismo (Lei de Curie), ferromagnetismo, domínios magnéticos e ciclo de histerese
Circuitos transitórios RL (constante de tempo τ = L/R), oscilações livres em circuitos LC (analogia exata com o MHS mecânico: ω = 1/√(LC)) e circuitos RLC amortecidos
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Distinção entre campo elétrico eletrostático (conservativo) e campo elétrico induzido (não-conservativo), demonstração da conservação de energia na barra deslizante sobre trilhos (potência mecânica = potência Joule) e analogia eletromecânica completa (L ↔ m, R ↔ b, 1/C ↔ k, q ↔ x).
Problema-Marco: Resolver a equação de movimento acoplada de uma barra condutora deslizando sem atrito sob gravidade em trilhos verticais fechados por um resistor/capacitor em campo B uniforme (velocidade terminal e balanço de energia) e calcular a autoindutância por unidade de comprimento de um cabo coaxial via energia magnética.
Macrotema 4.7: Circuitos CA, Equações de Maxwell e Ondas Eletromagnéticas
Trilha: TRL-PHYS-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.2, 4.6 | Pré-requisitos Cruzados: DOM-MATH:1.9, DOM-MATH:5.11, DOM-MATH:5.13
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-04 [Ciclo Básico/Analítico] (Caps. 28–29)
Subtemas:
Corrente alternada (CA) senoidal, valores eficazes (rms), representação por Fasores e impedância complexa (Z_R = R, Z_L = jωL, Z_C = 1/(jωC))
Circuitos RLC em série acionados por CA: ressonância elétrica, largura de banda, fator de qualidade Q, filtros passa-baixa/passa-alta/passa-faixa, potência média, fator de potência (cos φ) e transformadores ideais
Contradição da Lei de Ampère no carregamento de um capacitor e introdução da Corrente de Deslocamento de Maxwell (I_d = ε₀ dΦ_E/dt)
Síntese das Quatro Equações de Maxwell no vácuo (formas integral e diferencial: Gauss elétrica, Gauss magnética, Faraday e Ampère-Maxwell)
Derivação da Equação de Onda Eletromagnética a partir das Equações de Maxwell, relação c = 1/√(μ₀ε₀), transversalidade e relação E = cB em ondas planas
Transporte de energia e momento por ondas EM: Vetor de Poynting (S = (1/μ₀) E × B), intensidade média (I = S_med), densidade de momento e pressão de radiação (absorção total vs. reflexão total) e espectro eletromagnético
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Enunciado completo das 4 Equações de Maxwell (integral e diferencial), derivação da velocidade da luz c = 1/√(μ₀ε₀) e demonstração da pressão de radiação (I/c na absorção e 2I/c na reflexão).
Problema-Marco: Deduzir a equação de onda para E e B a partir das Equações de Maxwell no vácuo, calcular a intensidade e a pressão de radiação solar sobre uma vela solar a 1 UA, e projetar um circuito filtro RLC em CA calculando impedância, defasagem e frequência de ressonância.
NÍVEL 5: FÍSICA MODERNA INTRODUTÓRIA (RELATIVIDADE, QUÂNTICA, ÁTOMOS, SÓLIDOS E NÚCLEOS)
Macrotema 5.1: Relatividade Especial
Trilha: TRL-PHYS-04 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.2, 1.5, 4.7 | Pré-requisitos Cruzados: DOM-MATH:1.9, DOM-MATH:3.4
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-05 [Ciclo Básico/Analítico] (Cap. 35)
Subtemas:
Incompatibilidade entre Transformações de Galileu e Equações de Maxwell, Experimento de Michelson-Morley e os Dois Postulados de Einstein
Relatividade da simultaneidade, dilatação do tempo (Δt = γ Δt₀ — tempo próprio), contração do comprimento (L = L₀/γ — comprimento próprio) e Paradoxo dos Gêmeos
Transformações de Lorentz para espaço-tempo, regra relativística de adição de velocidades e Efeito Doppler relativístico
Invariante espaço-temporal (s² = (cΔt)² − Δx²), cones de luz, causalidade e diagramas de espaço-tempo de Minkowski
Dinâmica relativística: momento relativístico (p = γ m v), energia cinética K = (γ − 1)mc², equivalência massa-energia (E = γ mc²) e relação invariante energia-momento (E² = (pc)² + (mc²)²)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Dedução da dilatação do tempo via relógio de luz, forma matricial das Transformações de Lorentz, redução exata de K = (γ − 1)mc² para (1/2)mv² no limite clássico v ≪ c (via expansão binomial) e conservação do quadrivetor energia-momento em decaimentos/colisões.
Problema-Marco: Resolver o decaimento de uma partícula instável relativística (ex.: píon neutro ou múon atmosférico — explicando sua detecção ao nível do mar em ambos os referenciais) e determinar a energia limiar para criação de pares próton-antipróton em colisões de alvo fixo vs. colisor de centro de massa.
Macrotema 5.2: Origens da Física Quântica e Dualidade Onda-Partícula
Trilha: TRL-PHYS-04 | Complexidade: 3/5 | Pré-requisitos Diretos: 3.3, 4.7, 5.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-05 [Ciclo Básico/Analítico] (Cap. 36)
Subtemas:
Radiação de corpo negro: Lei de deslocamento de Wien, catástrofe do ultravioleta (Rayleigh-Jeans) e quantização da energia dos osciladores por Planck (E = nhν)
Efeito Fotoelétrico: hipótese dos fótons de Einstein (E = hf = hc/λ, p = h/λ), função trabalho φ, potencial de corte e falhas do modelo ondulatório clássico
Efeito Compton: conservação relativística de energia e momento no espalhamento elástico fóton-elétron (Δλ = (h/m_e c)(1 − cos θ)), produção e aniquilação de pares e bremsstrahlung (raios X)
Espectros atômicos discretos (série de Balmer / fórmula de Rydberg), espalhamento de Rutherford e Modelo de Bohr (quantização do momento angular L = nℏ, níveis de energia E_n = −13,6 eV / n² e experimento de Franck-Hertz)
Hipótese das ondas de matéria de De Broglie (λ = h/p) e confirmação experimental por difração de elétrons (Davisson-Germer e G. P. Thomson)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Dedução exata do deslocamento de Compton Δλ = λ_C(1 − cos θ) a partir da conservação relativística de energia e momento, dedução dos níveis de Bohr e verificação dos limites clássico (hν ≪ k_B T) e de Wien na Lei de Planck.
Problema-Marco: Derivar a fórmula do espalhamento Compton completa, calcular o comprimento de onda de De Broglie de elétrons relativísticos acelerados por 100 kV e analisar um experimento fotoelétrico com extração linear da constante de Planck h e da função trabalho φ.
Macrotema 5.3: Mecânica Ondulatória Introdutória e Equação de Schrödinger
Trilha: TRL-PHYS-04 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.2, 5.2 | Pré-requisitos Cruzados: DOM-MATH:5.12, DOM-MATH:5.13, DOM-MATH:7.3
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-05 [Ciclo Básico/Analítico] (Cap. 37)
Subtemas:
Pacotes de ondas localizados, velocidade de grupo, interpretação probabilística de Born (|ψ(x,t)|² como densidade de probabilidade) e condição de normalização (∫ |ψ|² dx = 1)
Princípio da Incerteza de Heisenberg (Δx Δp ≥ ℏ/2 e ΔE Δt ≥ ℏ/2): significado físico intrínseco, alargamento de linhas espectrais e estimativa de energia de ponto zero
Equação de Schrödinger dependente e independente do tempo em 1D (−(ℏ²/2m) d²ψ/dx² + U(x)ψ = Eψ), estados estacionários e valores esperados ⟨x⟩, ⟨p⟩
Partícula em caixa 1D (poço de potencial infinito: autofunções, quantização E_n ∝ n² e energia de ponto zero) e poço de potencial finito (penetração exponencial na região classicamente proibida)
Degraus e barreiras de potencial: coeficientes de reflexão e transmissão e Efeito Túnel (Tunelamento Quântico) (aplicações: decaimento alfa e microscópio de tunelamento STM)
Oscilador Harmônico Quântico 1D: níveis igualmente espaçados E_n = (n + 1/2)ℏω e comparação com a distribuição clássica de probabilidade no limite de grandes n (Princípio da Correspondência)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Condições de continuidade de ψ e dψ/dx nas fronteiras de potencial finito, derivação da quantização de energia no poço infinito, decaimento exponencial da probabilidade de tunelamento com a largura/altura da barreira e energia de ponto zero não-nula como exigência de Heisenberg.
Problema-Marco: Resolver analiticamente o poço infinito 1D (calculando ⟨x⟩, ⟨x²⟩, Δx e Δp para verificar Δx Δp ≥ ℏ/2) e resolver numericamente em Python a equação transcendental dos autovalores de energia de um poço de potencial finito, plotando as autofunções e densidades de probabilidade.
Macrotema 5.4: Física Atômica, Moléculas e Física do Estado Sólido
Trilha: TRL-PHYS-04 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.4, 4.5, 5.3 | Pré-requisitos Cruzados: DOM-MATH:5.10, DOM-MATH:7.3
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica]
Bibliografia e Capítulos: BIB-PHYS-05 [Ciclo Básico/Analítico] (Caps. 38–39)
Subtemas:
Equação de Schrödinger 3D para o átomo de hidrogênio em coordenadas esféricas, separação de variáveis e números quânticos (n, l, m_l)
Quantização espacial do momento angular orbital, momento magnético orbital, Spin do elétron (m_s = ±1/2 — Experimento de Stern-Gerlach) e acoplamento spin-órbita / Efeito Zeeman
Princípio da Exclusão de Pauli, átomos multieletrônicos, construção da Tabela Periódica, regras de seleção óptica e raios X característicos (Lei de Moseley)
Ligações químicas (iônica, covalente) e espectros moleculares (níveis rotacionais, vibracionais e eletrônicos)
Estatísticas quânticas (Maxwell-Boltzmann vs. Fermi-Dirac — energia de Fermi E_F — vs. Bose-Einstein — condensação e lasers)
Teoria de bandas em sólidos cristalinos: banda de valência, banda de condução e gap de energia (condutores, isolantes e semicondutores intrínsecos/dopados tipo-n e tipo-p), junção p-n (diodos, LEDs, células fotovoltaicas) e noções de supercondutividade (Efeito Meissner e pares de Cooper)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Significado físico e restrições dos 4 números quânticos (n, l, m_l, m_s), Princípio de Pauli explicando a estrutura da Tabela Periódica, diferença entre estatísticas de férmions e bósons e modelo de bandas distinguindo metal, semicondutor e isolante.
Problema-Marco: Calcular a distribuição radial de probabilidade P(r) = 4πr²|R_{10}(r)|² do estado fundamental do hidrogênio (mostrando que o raio mais provável coincide com o raio de Bohr a₀, enquanto ⟨r⟩ = 1,5 a₀) e estimar a concentração de portadores/energia de Fermi em um metal e em um semicondutor dopado.
Macrotema 5.5: Física Nuclear e Partículas Elementares
Trilha: TRL-PHYS-04 | Complexidade: 3/5 | Pré-requisitos Diretos: 5.1, 5.3 | Pré-requisitos Cruzados: DOM-MATH:5.13
Modalidades de Prática: [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-05 [Ciclo Básico/Analítico] (Caps. 40–41)
Subtemas:
Estrutura do núcleo atômico: prótons, nêutrons, isótopos, raio nuclear (R = R₀ A^{1/3}), força nuclear forte (curto alcance e saturação), defeito de massa e curva da Energia de Ligação por Núcleo (pico no ⁵⁶Fe)
Estabilidade nuclear (cinturão de estabilidade) e modelos nucleares básicos (gota líquida e camadas)
Decaimento radioativo: lei exponencial N(t) = N₀ e^{−λt}, atividade (Bq/Ci), meia-vida (T_{1/2} = ln 2 / λ), datação radiométrica e mecanismos de decaimento α (tunelamento de Gamow), β⁻/β⁺ (hipótese do neutrino de Pauli), captura eletrônica e emissão γ
Reações nucleares (valor Q da reação), fissão nuclear (²³⁵U, reação em cadeia e reatores) e fusão nuclear (ciclo próton-próton estelar e barreira Coulombiana)
Física de Partículas Elementares: as quatro interações fundamentais e seus bósons mediadores (fóton, glúon, W±/Z⁰, gráviton hipotético), léptons, quarks, hádrons (bárions e mésons) e leis de conservação (energia, carga, número bariônico e leptônico)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Cálculo do valor Q de uma reação nuclear via defeito de massa, explicação de por que fissão libera energia para núcleos pesados e fusão para núcleos leves (curva de energia de ligação) e verificação de reações de partículas por leis de conservação.
Problema-Marco: Resolver uma cadeia de decaimento radioativo em dois estágios (A → B → C estável via EDO acoplada determinando o instante de máxima população do isótopo intermediário B) e calcular a energia liberada por kg em fissão do ²³⁵U vs. fusão D-T.
NÍVEL 6: ÓPTICA FÍSICA E ONDULATÓRIA AVANÇADA (TRATADO DE EUGENE HECHT)
Macrotema 6.1: Matemática Ondulatória e Teoria Eletromagnética da Luz
Trilha: TRL-PHYS-05 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.1, 3.2, 4.7 | Pré-requisitos Cruzados: DOM-MATH:1.9, DOM-MATH:5.11, DOM-MATH:5.13
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-06 [Tratado/Avançado] (Caps. 2–3)
Subtemas:
Equação diferencial de onda escalar 3D (∇²ψ = (1/v²) ∂²ψ/∂t²), ondas planas harmônicas (vetor de onda k), ondas esféricas (1/r) e ondas cilíndricas (1/√r)
Representação complexa de ondas harmônicas (fasores espaciais-temporais) e precauções no cálculo de produtos/irradiâncias (Re[E])
Ondas eletromagnéticas em meios dielétricos isotrópicos lineares: índice de refração n = √(ε_r μ_r), impedância intrínseca do meio, irradiância I = ⟨S⟩ = (1/2) c ε₀ n E₀² e pressão de radiação
Descrição microscópica da interação luz-matéria: espalhamento por dipolos oscilantes (espalhamento de Rayleigh ∝ λ⁻⁴ explicando o azul do céu), modelo clássico do oscilador harmônico forçado de Lorentz para o índice de refração complexo ñ(ω) = n + iκ, absorção, dispersão normal e dispersão anômala (equação de dispersão / Sellmeier)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Relação entre amplitude de campo elétrico e irradiância em meio de índice n, dependência λ⁻⁴ do espalhamento de Rayleigh e derivação qualitativa/quantitativa da dispersão normal vs. anômala pelo modelo de Lorentz próximo à frequência de ressonância ω₀.
Problema-Marco: Deduzir a equação de dispersão de Lorentz para um dielétrico diluído, plotar em Python a parte real n(ω) e imaginária κ(ω) (absorção) através de uma ressonância e calcular a irradiância e amplitude de campo E₀/B₀ de um feixe laser focalizado.
Macrotema 6.2: Propagação, Equações de Fresnel e Óptica Geométrica Paraxial/Matricial
Trilha: TRL-PHYS-05 | Complexidade: 4/5 | Pré-requisitos Diretos: 6.1 | Pré-requisitos Cruzados: DOM-MATH:3.4, DOM-MATH:5.3
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-06 [Tratado/Avançado] (Caps. 4–6); BIB-PHYS-05 [Ciclo Básico/Analítico] (Caps. 30–32)
Subtemas:
Princípio de Huygens-Fresnel, Princípio de Fermat (caminho óptico estacionário δ ∫ n ds = 0) e dedução variacional das leis da reflexão e da refração (Lei de Snell-Descartes)
Condições de contorno eletromagnéticas na interface entre dois dielétricos e derivação das Equações de Fresnel para os coeficientes de amplitude (r_⊥, r_∥, t_⊥, t_∥ — modos TE/s e TM/p)
Refletância (R) e Transmitância (T), conservação de energia (R + T = 1), incidência normal R = ((n₁ − n₂)/(n₁ + n₂))², Ângulo de Brewster (tan θ_B = n_t/n_i onde r_∥ = 0), saltos de fase na reflexão interna/externa e Reflexão Interna Total (TIR) com decaimento exponencial da onda evanescente (e tunelamento óptico frustrado)
Óptica geométrica paraxial (sen θ ≈ θ): refração em superfície esférica, Equação dos Fabricantes de Lentes, lentes delgadas e espelhos esféricos/cônicos, convenção cartesiana de sinais
Sistemas ópticos compostos e lentes espessas: pontos cardinais (focos, planos principais H₁/H₂, pontos nodais), Paradas de Abertura e de Campo, Pupila de Entrada/Saída, vinhetagem, número-f (f/#) e abertura numérica (NA)
Óptica Matricial Paraxial (Matrizes ABCD): matrizes de translação, refração, lente delgada e reflexão esférica; composição de sistemas ópticos arbitrários por multiplicação matricial e condição de estabilidade de cavidades ópticas
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Dedução da Lei de Snell pelo Princípio de Fermat, Equações de Fresnel em modos s e p, significado físico do ângulo de Brewster, definição de planos principais em lentes espessas e determinante da matriz ABCD igual a n_i/n_f.
Problema-Marco: Plotar em Python as curvas de refletância R_s(θ), R_p(θ) e saltos de fase das Equações de Fresnel para interface ar-vidro (externa e interna com TIR), e implementar um simulador de Óptica Matricial ABCD que calcula distância focal efetiva (EFL), back focal length (BFL) e planos principais de um dubleto ou ocular composta.
Macrotema 6.3: Superposição de Ondas, Dispersão e Polarização da Luz
Trilha: TRL-PHYS-05 | Complexidade: 4/5 | Pré-requisitos Diretos: 6.1, 6.2 | Pré-requisitos Cruzados: DOM-MATH:1.9, DOM-MATH:3.4, DOM-MATH:3.10
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-06 [Tratado/Avançado] (Caps. 7–8)
Subtemas:
Superposição de ondas harmônicas de mesma frequência (método algébrico, complexo e fasorial) e de frequências diferentes (batimentos, pacotes de ondas)
Velocidade de Fase (v_p = ω/k) vs. Velocidade de Grupo (v_g = dω/dk) e alargamento de pulsos em meios dispersivos (dispersão cromática)
Natureza transversal da luz e estados de polarização: linear (P-state), circular (R/L), elíptica e luz natural/parcialmente polarizada
Mecanismos físicos de polarização: Dicroísmo (Lei de Malus I = I₀ cos²θ), Reflexão no Ângulo de Brewster, Espalhamento e Birrefringência em cristais anisotrópicos uniaxiais (raio ordinário o e extraordinário e; calcita, quartzo, prisma de Nicol/Wollaston)
Retardadores de fase: Lâmina de Quarto de Onda (λ/4 — linear ↔ circular) e Lâmina de Meia Onda (λ/2 — rotação de plano de polarização), compensadores e atividade óptica (meios quirais)
Vetores de Jones e Matrizes de Jones (2×2 complexas para luz totalmente polarizada) e Parâmetros de Stokes e Matrizes de Mueller (4×4 reais para luz natural e parcialmente polarizada)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Relação v_g = v_p − λ (dv_p/dλ), Lei de Malus (incluindo o paradoxo de inserir um 3º polarizador a 45° entre dois polarizadores cruzados), distinção de alcance entre formalismo de Jones e formalismo de Stokes/Mueller e ação matricial de lâminas λ/4 e λ/2.
Problema-Marco: Implementar em Python uma calculadora de cadeias ópticas usando Matrizes de Jones e Matrizes de Mueller (com rotação de eixos por matriz de transformação), simulando um isolador óptico (polarizador linear + lâmina λ/4 + espelho) e verificando que o feixe refletido é totalmente bloqueado.
Macrotema 6.4: Teoria da Coerência e Interferometria
Trilha: TRL-PHYS-05 | Complexidade: 4/5 | Pré-requisitos Diretos: 6.2, 6.3 | Pré-requisitos Cruzados: DOM-MATH:5.12
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Verificação Física e Casos-Limite]
Bibliografia e Capítulos: BIB-PHYS-06 [Tratado/Avançado] (Caps. 9, 12); BIB-PHYS-05 [Ciclo Básico/Analítico] (Cap. 33)
Subtemas:
Termo de interferência geral I = I₁ + I₂ + 2√(I₁I₂) cos δ e condições de coerência para franjas estacionárias
Coerência Temporal (tempo de coerência τ_c ≈ 1/Δν e comprimento de coerência l_c = c τ_c) e Coerência Espacial (largura de coerência e Teorema de Van Cittert-Zernike — interferometria estelar de Michelson)
Grau complexo de coerência mútua γ₁₂(τ) e Visibilidade das Franjas V = (I_max − I_min)/(I_max + I_min)
Interferência por Divisão de Frente de Onda: experimento de fenda dupla de Young, espelho de Lloyd (inversão de fase π) e biprisma de Fresnel
Interferência por Divisão de Amplitude: películas/filmes finos dielétricos (franjas de igual inclinação e de igual espessura), Revestimentos Antirreflexo (AR Coatings) de camada única (espessura λ/4 e índice n_f = √(n₀ n_s)) e multicamadas, e Anéis de Newton
Michelson, Mach-Zehnder, Twyman-Green (teste óptico de espelhos e lentes) e Interferômetro de Fabry-Pérot (interferência de múltiplos feixes, função de Airy, Coeficiente de Finesse e Poder de Resolução Espectral)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Relação entre largura espectral Δλ e comprimento de coerência l_c ≈ λ²/Δλ, dedução das duas condições para um revestimento antirreflexo perfeito de camada única (fase e amplitude) e dedução da função de transmissão de Airy para o Fabry-Pérot.
Problema-Marco: Projetar um revestimento antirreflexo de camada única para vidro óptico (BK7, n = 1,52) em λ = 550 nm calculando sua refletância residual ao longo do espectro visível (400–700 nm), e simular em Python as franjas de transmissão do Fabry-Pérot para diferentes refletâncias R (mostrando o ganho de Finesse).
Macrotema 6.5: Teoria da Difração (Fraunhofer e Fresnel)
Trilha: TRL-PHYS-05 | Complexidade: 5/5 | Pré-requisitos Diretos: 6.4 | Pré-requisitos Cruzados: DOM-MATH:5.10, DOM-MATH:5.12, DOM-MATH:6.5
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-06 [Tratado/Avançado] (Cap. 10); BIB-PHYS-05 [Ciclo Básico/Analítico] (Cap. 33)
Subtemas:
Formulação escalar da difração (Integral de Fresnel-Kirchhoff e fator de obliquidade) e distinção quantitativa entre campo próximo (Fresnel) e campo distante (Fraunhofer — número de Fresnel F = a²/(λL) ≪ 1)
Difração de Fraunhofer: fenda simples (I(θ) = I₀ (sen β / β)²), fenda dupla com largura finita (produto interferência × envelope de difração), N fendas, abertura retangular 2D e Abertura Circular (integração gerando o Disco de Airy: I(θ) = I₀ [2 J₁(ka sen θ)/(ka sen θ)]², com primeiro mínimo em θ = 1,22 λ/D e 83,8% da energia no disco central)
Poder de Resolução de Instrumentos Ópticos: Critério de Rayleigh (θ_min = 1,22 λ/D) e Critério de Sparrow
Redes de Difração (transmissão e reflexão, blazed gratings): equação da rede, dispersão angular, faixa espectral livre e poder resolvente cromático (R = λ/Δλ = mN)
Difração de Fresnel (campo próximo): zonas de meio período de Fresnel, Placa Zonal de Fresnel (lente difrativa), ponto de Arago-Poisson, Integrais de Fresnel, Espiral de Cornu e difração por borda retilínea; Princípio de Babinet para telas complementares
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Dedução de I(θ) para fenda simples e N fendas, origem do fator 1,22 no Disco de Airy (primeiro zero de J₁(x) em x ≈ 3,8317 / π ≈ 1,22), fórmula do poder resolvente de uma rede R = mN e Princípio de Babinet.
Problema-Marco: Integrar numericamente em Python a difração de Fraunhofer para fenda simples, N fendas e abertura circular (verificando a fração exata de energia cercada no Disco de Airy e nos anéis subsequentes) e plotar a Espiral de Cornu para o perfil de intensidade junto a uma borda retilínea no regime de Fresnel.
Macrotema 6.6: Óptica de Fourier, Formação de Imagens e Óptica Moderna
Trilha: TRL-PHYS-05 | Complexidade: 5/5 | Pré-requisitos Diretos: 5.4, 6.5 | Pré-requisitos Cruzados: DOM-MATH:5.12, DOM-PROG:7.5
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-06 [Tratado/Avançado] (Caps. 11, 13)
Subtemas:
Transformada de Fourier 1D e 2D aplicada à Óptica: frequências espaciais (ciclos/mm), Teorema da Convolução, Teorema de Parseval e identificação da Difração de Fraunhofer como a Transformada de Fourier 2D da função de abertura
A lente convergente como computador óptico de Transformada de Fourier no plano focal traseiro e Teoria de Abbe da Formação de Imagens
Filtragem Espacial Óptica (sistema 4f): filtragem passa-baixa, passa-alta (microscopia de campo escuro), filtragem direcional e Microscopia de Contraste de Fase de Zernike
Teoria de Sistemas Lineares Invariantes no Espaço em Óptica: Função de Espalhamento Pontual (PSF) (luz coerente vs. incoerente), Função de Transferência Óptica (OTF) como Transformada de Fourier da PSF (e autocorrelação da função pupila), Função de Transferência de Modulação (MTF = |OTF|) e frequência de corte difrativa f_c = 1/(λ f/#)
Fundamentos físicos de Lasers (absorção, emissão espontânea e estimulada — coeficientes A e B de Einstein, inversão de população em sistemas de 3 e 4 níveis, cavidade ressonante e modos transversais TEM_{mn} / feixes Gaussianos)
Holografia (registro de amplitude e fase por feixe de referência) e introdução à Óptica Não-Linear (susceptibilidades χ⁽²⁾ e χ⁽³⁾, geração de segundo harmônico — SHG, efeito Pockels e efeito Kerr)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Equivalência entre padrão de Fraunhofer e Transformada de Fourier 2D da pupila, definição da MTF como |FT{PSF}| e dedução da frequência espacial de corte f_c = D/(λf), além da necessidade de 3 ou 4 níveis para inversão de população em lasers.
Problema-Marco: Implementar em Python (usando FFT 2D) um simulador de formação de imagens ópticas incoerentes: a partir de uma máscara de pupila arbitrária (circular, anular ou com hastes), calcular a PSF, derivar a curva MTF 2D, filtrar uma imagem de teste por convolução e demonstrar o corte de altas frequências espaciais.
NÍVEL 7: ÓPTICA FÍSICA APLICADA A SISTEMAS FORMADORES DE IMAGEM (TELESCÓPIOS E AVALIAÇÃO ÓPTICA)
Macrotema 7.1: Traçado de Raios e Teoria das Aberrações Ópticas
Trilha: TRL-PHYS-05 | Complexidade: 5/5 | Pré-requisitos Diretos: 6.2 | Pré-requisitos Cruzados: DOM-MATH:1.10, DOM-MATH:5.9, DOM-MATH:6.2, DOM-PROG:2.5
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-07 [Óptica Aplicada/Avaliação] (Caps. 1–4, 17, Apêndices); BIB-PHYS-06 [Tratado/Avançado] (Cap. 6.3)
Subtemas:
Superfícies ópticas esféricas e asféricas (seções cônicas descritas pelo raio de curvatura R e Constante Cônica K: esfera K = 0, elipse −1 < K < 0, parábola K = −1, hipérbole K < −1)
Traçado Trigonométrico Exato de Raios (raios meridionais e oblíquos / skew rays) além da aproximação paraxial e geração de diagramas de pontos (Spot Diagrams)
Teoria das Aberrações Monocromáticas Primárias de Seidel (3ª Ordem) (expansão do erro de frente de onda):
Aberração Esférica (dependência com abertura y⁴, longitudinal vs. transversal, círculo de mínima confusão e eliminação no espelho parabólico no eixo)
Coma (dependência linear com ângulo de campo θ e y³, condição dos senos de Abbe e formato em cometa fora do eixo)
Astigmatismo (foco sagital vs. tangencial, dependência θ²y²)
Curvatura de Campo de Petzval (soma de Petzval) e Distorção (barril vs. almofada, dependência θ³)
Aberrações Cromáticas (axial/longitudinal e lateral): Número de Abbe (V_d), espectro secundário em vidros Crown/Flint, dubletos acromáticos (2 comprimentos de onda) e apocromáticos (3 comprimentos de onda com fluorita/vidros ED)
Representação ortogonal de aberrações de frente de onda sobre pupila circular via Polinômios de Zernike
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Dependência de escala de abertura e ângulo de campo de cada uma das 5 aberrações de Seidel, por que um espelho parabólico tem aberração esférica nula no eixo mas sofre de coma fora do eixo, e condição de acromatismo para um dubleto fino (φ₁/V₁ + φ₂/V₂ = 0).
Problema-Marco: Implementar em Python um motor de Traçado Exato de Raios (2D/3D) para superfícies cônicas (esféricas e parabólicas) e gerar os Spot Diagrams no eixo e fora do eixo (0°, 0,5°, 1°) de um espelho esférico f/6 vs. parabólico f/6, quantificando aberração esférica e coma.
Macrotema 7.2: Física da Frente de Onda, Difração com Obstrução e Métricas de Qualidade de Imagem
Trilha: TRL-PHYS-05 | Complexidade: 5/5 | Pré-requisitos Diretos: 6.5, 6.6, 7.1 | Pré-requisitos Cruzados: DOM-MATH:6.5, DOM-PROG:7.5
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-07 [Óptica Aplicada/Avaliação] (Caps. 18–20)
Subtemas:
Erro de Frente de Onda (OPD — Optical Path Difference): relação entre erro superficial físico da óptica (espelho: 2×; lente: (n − 1)×) e deformação da frente de onda
Métricas de erro de frente de onda: Pico-a-Vale (PV) vs. Erro Quadrático Médio (RMS, σ_W) e por que PV isolado é insuficiente para caracterizar qualidade óptica
Critério de Rayleigh (λ/4 PV) vs. Razão de Strehl (S = I_pico_real / I_pico_ideal, limite difrativo S ≥ 0,80) e Aproximação de Maréchal (S ≈ 1 − (2π σ_W / λ)² ≈ exp(−(2π σ_W / λ)²))
Física da Obstrução Central (razão linear ε = d/D em refletores/catadióptricos) e das hastes da aranha (spider vanes): redistribuição de energia do Disco de Airy para o 1º anel de difração, espinhos de difração e impacto sobre contraste de médio porte
Cálculo e interpretação rigorosa de curvas MTF sob aberrações residuais e obstrução central (perda de contraste em frequências espaciais intermediárias)
Limites de resolução angular (Rayleigh 1,22 λ/D vs. Limite Empírico de Dawes 116"/D_mm) e física da turbulência atmosférica (Seeing, espectro de Kolmogorov e Parâmetro de Fried r₀)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Aproximação de Maréchal ligando erro RMS da frente de onda à Razão de Strehl (mostrando que S = 0,80 exige σ_W ≈ λ/14 RMS), fator 2× do erro de superfície em espelhos vs. refração, e efeito específico da obstrução central ε na curva MTF (queda nas frequências médias mantendo o corte de alta frequência).
Problema-Marco: Estender o simulador de FFT 2D (Tema 6.6) em Python para incluir (a) função pupila complexa com fase aberrada (desfocagem, aberração esférica e coma via OPD) e (b) obstrução central ε = 0%, 20%, 35% + aranha de 4 hastes, comparando a Razão de Strehl numérica com a fórmula de Maréchal e plotando a família de curvas MTF.
Macrotema 7.3: Física dos Sistemas Ópticos Formadores de Imagem (Arquiteturas de Telescópios)
Trilha: TRL-PHYS-05 | Complexidade: 5/5 | Pré-requisitos Diretos: 7.1, 7.2 | Pré-requisitos Cruzados: DOM-PROG:2.5
Modalidades de Prática: [Modelagem e Dedução], [Resolução Analítica], [Simulação Numérica]
Bibliografia e Capítulos: BIB-PHYS-07 [Óptica Aplicada/Avaliação] (Caps. 5–16)
Subtemas:
Parâmetros ópticos fundamentais de um sistema formador de imagem: abertura D, distância focal f, razão focal f/#, escala de placa (arcsec/mm), ampliação, pupila de saída (exit pupil), brilho superficial de objetos pontuais vs. extensos e magnitude limite
Refratores: acromáticos clássicos (Fraunhofer, Steinheil, Clark), apocromáticos tripletos/vidros ED e refratores Petzval (campo plano) — análise de espectro secundário e esferocromatismo
Refletores Puros (2 espelhos): Newtoniano parabólico (campo livre de aberração esférica no eixo, cálculo do campo totalmente iluminado e tamanho ótimo do secundário vs. coma em f/4–f/8), Cassegrain clássico (primário parabólico + secundário hiperbólico), Dall-Kirkham (primário elipsoidal + secundário esférico) e Ritchey-Chrétien (ambos hiperbólicos — sistema aplanático livre de aberração esférica e coma)
Sistemas Catadióptricos: câmera de Schmidt (placa corretora asférica no centro de curvatura do primário esférico), Schmidt-Cassegrain (SCT), Maksutov-Cassegrain (menisco esférico espesso) e Schmidt-Newtoniano — compensação mútua de aberrações
Óptica de Oculares (Huygens, Ramsden, Kellner, Plössl, Erfle, Nagler/grande campo — alívio ocular, campo aparente e aberrações fora do eixo) e sistemas auxiliares (Lentes de Barlow, Redutores Focais, Corretores de Coma de Ross/Wynne e Aplanadores de Campo)
Critérios de Aceite (DoD):
Conceitos/Leis Obrigatórios: Condição de sistema aplanático (aberração esférica = 0 e coma = 0 — como no Ritchey-Chrétien), trade-off óptico da razão focal f/# em um Newtoniano (coma cresce com 1/(f/#)², enquanto obstrução mínima para campo iluminado cresce com f/# curto) e relação entre pupila de saída, abertura e ampliação mínima útil.
Problema-Marco: Realizar a avaliação óptica comparativa quantitativa (combinando equações de aberração, ray tracing e simulação MTF/Strehl) entre três arquiteturas de mesma abertura (ex.: 250 mm f/6 Newtoniano parabólico vs. 250 mm f/8 Ritchey-Chrétien vs. 250 mm f/10 Schmidt-Cassegrain), documentando campo livre de difração, tamanho da obstrução central, curva MTF e necessidade de corretor de campo/coma.
