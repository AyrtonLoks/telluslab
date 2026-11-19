ESPECIFICAÇÃO DE DOMÍNIO E REQUISITOS — TELLUSLAB (DOM-ECON: ECONOMIA E FINANÇAS)
## 1. ARQUITETURA PEDAGÓGICA E REQUISITOS DO DOMÍNIO (SRS / DOMAIN PACK)
1.0. Metadados do Pacote de Domínio (Domain Pack)
domainId: DOM-ECON
slug: economics-finance
name: Economia e Finanças
version: 1.0.0
dominiosRelacionados: DOM-MATH, DOM-PROG (pré-requisitos cruzados opcionais ou estritos configuráveis no TellusLab)
1.1. Modelagem de Trilhas de Conhecimento (DAG)
O currículo não é linear; após vencer a base de Matemática Financeira e Métodos Quantitativos, divide-se em um Grafo Acíclico Dirigido (DAG) com cinco trilhas paralelas e arestas cruzadas com Matemática (DOM-MATH) e Programação (DOM-PROG):
TRL-ECON-00 (Fundamentos Quantitativos, Matemática Financeira e Ética): Valor do dinheiro no tempo, sistemas de amortização, estatística aplicada a investimentos e padrões éticos/profissionais (Nível 1).
TRL-ECON-01 (Economia Aplicada e Economia Política Clássica): Microeconomia, macroeconomia, comércio/câmbio internacional e o debate estrutural entre Adam Smith e Karl Marx (Nível 2).
TRL-ECON-02 (Contabilidade Financeira, Finanças Corporativas, Equity e Alternativos): Demonstrações financeiras (IFRS/US GAAP), análise DuPont, WACC, estrutura de capital, valuation de ações e investimentos alternativos (Níveis 4 e 5).
TRL-ECON-03 (Sistema Financeiro, Bancos Centrais, Derivativos e Gestão de Risco): Arquitetura bancária (SFN e global), política monetária, derivativos por não-arbitragem, Teoria Moderna de Portfólios, finanças comportamentais e risco de cauda/antifragilidade (Níveis 3, 5 e 6).
TRL-ECON-04 (Especialização em Renda Fixa, Crédito Estruturado e Securitização): Renda fixa global e brasileira (ANBIMA/252 DU), ETTJ/bootstrapping, duration/convexidade, modelagem estocástica de curvas, opções embutidas (OAS), securitização (MBS/ABS/FIDC/CRI/CRA), risco de crédito e gestão institucional (Níveis 7 e 8).
1.2. Máquina de Estados Finita (FSM) de Proficiência por Macrotema
Cada Macrotema (X.Y) segue a máquina de estados padrão do TellusLab:
S0 — BLOQUEADO: Pelo menos um macrotema listado em Pré-requisitos Diretos ainda não atingiu o estado S4 (PROVA_VALIDADA). (Arestas em Pré-requisitos Cruzados com DOM-MATH ou DOM-PROG atuam como Soft Warning por padrão ou Hard Gate quando o Modo Estrito Interdisciplinar estiver ativo.)
S1 — DISPONIVEL: Todos os pré-requisitos diretos atingiram S4 ou superior; pronto para iniciar estudo.
S2 — TEORIA_CONCLUIDA: Leitura ativa e fichamento das definições, mecanismos econômicos, normas contábeis/ANBIMA e demonstrações nas obras de referência.
S3 — FIXACAO_MECANICA: Resolução de bateria prática (cálculos financeiros, problemas estilo CFA, planilhas/modelos e análises de casos) com taxa de acerto ≥ 80%.
S4 — PROVA_VALIDADA (Estado de Desbloqueio): Conceitos/Fórmulas/Princípios obrigatórios validados sem consulta e Problema-Marco (Capstone) concluído e verificado. Libera nós dependentes no DAG e insere o macrotema no motor FSRS-5.
S5 — REVISAO_EM_DIA: Em ciclo ativo de manutenção via FSRS-5.
S6 — REVISAO_VENCIDA: Intervalo de retenção expirado; exige sessão de revisão antes de avançar em nós filhos.
1.3. Taxonomia de Modalidades de Estudo, Papéis Bibliográficos e Dificuldades
Papéis da Bibliografia:
[Currículo/Prática]: Síntese estruturada orientada a exame, casos práticos e exercícios padronizados (ex.: CFA Level I, Assaf Neto Exercícios).
[Mercado/Institucional]: Regras operacionais, regulação, convenções de mercado brasileiro/global e prática de tesouraria (ex.: Assaf Neto, Varanda Neto/Santos/Mello, Mishkin & Eakins, Fabozzi Handbook).
[Quantitativo/Modelagem]: Formulação matemática exata, precificação, calibração numérica e gestão quantitativa (ex.: Fabozzi & Fabozzi Fixed Income Mathematics, Fabozzi Intro).
[Teoria/Epistemologia]: Fundamentos históricos, econômicos e filosóficos do capital, valor, juros e risco sistêmico (ex.: Adam Smith, Karl Marx, Nassim Taleb).
Modalidades de Prática Exigidas por Macrotema:
[Cálculo Financeiro e Precificação]: Fluxos de caixa descontados, PU, YTM, bootstrapping, duration, convexidade, valuation e análise de demonstrações.
[Análise Econômica e Crítica]: Modelagem de mecanismos de transmissão, análise de trade-offs institucionais, interpretação de balanços e ensaios comparativos fundamentados.
[Modelagem e Simulação]: Implementação em Python/planilha de curvas de juros, árvores binomiais, Monte Carlo, motores de precificação ANBIMA e otimização de carteiras.
[Estudo de Caso e Decisão]: Diagnóstico de crises, dilemas éticos, estruturação de operações de crédito/securitização e decisões de gestão de portfólio (IPS/ALM).
Tags de Dificuldade para Diagnóstico Regressivo:
DIF-ECON-01 (Lacuna em Pré-requisito Interno, DOM-MATH ou DOM-PROG)
DIF-ECON-02 (Erro de Convenção de Taxa / Prazo / 252 DU vs. 360/365)
DIF-ECON-03 (Confusão Conceitual Contábil / Econômica / Regulatória)
DIF-ECON-04 (Falha de Modelagem Quantitativa / Não-Arbitragem)
DIF-ECON-05 (Subestimação de Risco de Cauda / Opção Embutida / Liquidez)
DIF-ECON-06 (Estouro de Tempo > 75 min)
1.4. Requisitos Funcionais (RF) do Módulo DOM-ECON
RF-01 (Grafo Curricular e Caminho Crítico): Renderizar o DAG interativo dos 32 macrotemas de DOM-ECON com suporte à exibição de arestas cruzadas para DOM-MATH e DOM-PROG. Permitir selecionar qualquer macrotema ou obra-alvo (ex.: BIB-ECON-14 Fabozzi Handbook ou BIB-ECON-11 Renda Fixa no Brasil) para calcular via ordenação topológica o subgrafo mínimo pendente.
RF-02 (Motor de Repetição Espaçada — FSRS-5): Agendar cartões derivados dos subtemas e critérios DoD de macrotemas em S4+, cobrindo: (a) fórmulas de precificação e sensibilidade, (b) convenções de mercado (ANBIMA 252 DU vs. US 30/360), (c) regras contábeis (IFRS vs. US GAAP) e (d) mecanismos econômicos e distinções teóricas.
RF-03 (Gerador de Sessões Intercaladas de 45–75 min): Montar sessões práticas de 45 a 75 minutos divididas em 50% avanço em tema ativo (S1–S3), 30% revisão vencida (S6) de trilhas distintas e 20% problemas mistos (ex.: questões estilo CFA + casos de precificação ou diagnóstico contábil).
RF-04 (Trava de Solução e Revisão Socrática): Bloquear a solução comentada até o registro obrigatório de tentativa (tempo cronometrado, memorial de cálculo/código/análise submetido e tags de dificuldade). A IA verifica coerência dimensional/financeira (ex.: taxa real vs. nominal, clean vs. dirty price, sinal de convexidade) sem entregar a resposta pronta.
RF-05 (Diagnóstico Regressivo Cross-Domain): Ao registrar DIF-ECON-01, percorrer as arestas reversas dentro de DOM-ECON e também em DOM-MATH/DOM-PROG para injetar micro-revisões direcionadas.
RF-06 (Sandbox de Precificação e Simulação): Para macrotemas com [Modelagem e Simulação], gerar especificações de problemas quantitativos (em Python/Excel) com testes de sanidade financeira (não-arbitragem, paridade put-call, reconciliação de fluxos de caixa e casos-limite de taxa zero/negativa).
RF-07 (Métricas Ponderadas e Ponte TellusPedia): Calcular progresso global, por trilha (TRL-ECON-00 a TRL-ECON-04) e por obra (BIB-ECON-01 a BIB-ECON-19), ponderado por Complexidade (1–5), exportável em snapshot JSON compatível com a rota /lab?domain=economics-finance do TellusPedia (conectando dossiês de Economia, História Econômica e Geopolítica).
1.5. Requisitos Não-Funcionais, Integração e Radar de Lacunas
RNF-01 (Renderização Financeira e Quantitativa): Suporte a KaTeX (fórmulas financeiras e estocásticas), tabelas de fluxos de caixa/amortização, blocos de código Python e diagramas Mermaid (estruturas de securitização, fluxos de pagamento e mecanismos monetários).
RNF-02 (Persistência Local-First e Compatibilidade): Compatível com o mesmo schema SQLite/IndexedDB e snapshot JSON do TellusLab, usando IDs qualificados pelo namespace DOM-ECON.
RNF-03 (Radar de Expansão Futura — Lacunas Conhecidas do Acervo Físico Atual): Este acervo físico não includes obras dedicadas a (a) Cálculo Estocástico e Precificação Contínua de Derivativos (Lema de Itô / Black-Scholes-Merton rigoroso — ex.: Hull, Shreve), (b) Econometria Aplicada e Séries Temporais Financeiras (ARIMA, GARCH, VAR — ex.: Wooldridge, Tsay), e (c) Microeconomia e Macroeconomia Formal Intermediária (ex.: Varian, Blanchard). O domínio está preparado para incorporar essas frentes quando as obras forem adicionadas.
## 2. CATÁLOGO BIBLIOGRÁFICO (ACERVO BASE DOM-ECON)
2.1. Currículo Generalista, Contabilidade, Corporativo e Investimentos (CFA Level I)
BIB-ECON-01: CFA Program Curriculum 2022, Level I — Volume 1: Quantitative Methods — CFA Institute
BIB-ECON-02: CFA Program Curriculum 2022, Level I — Volume 2: Economics and Financial Statement Analysis — CFA Institute
BIB-ECON-03: CFA Program Curriculum 2022, Level I — Volume 3: Financial Statement Analysis and Corporate Issuers — CFA Institute
BIB-ECON-04: CFA Program Curriculum 2022, Level I — Volume 4: Corporate Issuers, Equity, and Fixed Income — CFA Institute
BIB-ECON-05: CFA Program Curriculum 2022, Level I — Volume 5: Fixed Income, Derivatives, Alternative Investments, and Portfolio Management — CFA Institute
BIB-ECON-06: CFA Program Curriculum 2022, Level I — Volume 6: Portfolio Management and Ethical and Professional Standards — CFA Institute
2.2. Matemática Financeira, Mercados e Instituições Financeiras
BIB-ECON-07: Matemática Financeira e suas Aplicações — Alexandre Assaf Neto
BIB-ECON-08: Mercado Financeiro — Alexandre Assaf Neto
BIB-ECON-09: Mercado Financeiro: Exercícios e Prática — Alexandre Assaf Neto
BIB-ECON-10: Financial Markets and Institutions (10th Edition — Global Edition) — Frederic S. Mishkin, Stanley G. Eakins
2.3. Especialização em Renda Fixa, Precificação e Crédito Estruturado
BIB-ECON-11: O Mercado de Renda Fixa no Brasil: Conceitos, Precificação e Risco — José Monteiro Varanda Neto, José Carlos de Souza Santos, Eduardo Morato Mello
BIB-ECON-12: Introduction to Fixed-Income Analysis and Portfolio Management — Frank J. Fabozzi
BIB-ECON-13: Fixed Income Mathematics — Frank J. Fabozzi, Francesco A. Fabozzi
BIB-ECON-14: The Handbook of Fixed Income Securities (9th Edition) — Frank J. Fabozzi
2.4. Economia Política Clássica e Epistemologia do Risco
BIB-ECON-15: A Riqueza das Nações — Adam Smith
BIB-ECON-16: O Capital — Livro 1: O Processo de Produção do Capital — Karl Marx
BIB-ECON-17: O Capital — Livro 2: O Processo de Circulação do Capital — Karl Marx
BIB-ECON-18: O Capital — Livro 3: O Processo Global da Produção Capitalista — Karl Marx
BIB-ECON-19: Antifrágil: Coisas que se Beneficiam com o Caos — Nassim Nicholas Taleb
## 3. TAXONOMIA GRANULAR DE MACROTEMAS, METADADOS E CRITÉRIOS DE ACEITE
NÍVEL 1: MATEMÁTICA FINANCEIRA, MÉTODOS QUANTITATIVOS E ÉTICA PROFISSIONAL
Macrotema 1.1: Valor do Dinheiro no Tempo, Regimes de Capitalização e Fluxos de Caixa
Trilha: TRL-ECON-00 | Complexidade: 1/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: DOM-MATH:1.4, DOM-MATH:1.7, DOM-MATH:1.12
|---|---|* Modalidades de Prática: [Cálculo Financeiro e Precificação]
Bibliografia e Capítulos: BIB-ECON-07 [Mercado/Institucional] (Caps. 1–7); BIB-ECON-01 [Currículo/Prática] (Reading 1)
Subtemas:
Juros simples vs. juros compostos e convenções de capitalização discreta e contínua (e^{rt})
Taxas nominais (APR), efetivas (EAR), equivalentes e proporcionais em múltiplos prazos
Operações de desconto bancário (por fora) vs. desconto racional (por dentro) e taxa efetiva de desconto
Valor Presente (PV) e Valor Futuro (FV) de fluxos únicos e fluxos irregulares
Séries uniformes de pagamentos (anuidades ordinárias, antecipadas e diferidas), séries gradientes e perpetuidades (constantes e crescentes)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Relação entre taxa nominal e efetiva EAR = (1 + i/m)^m − 1, capitalização contínua e fórmula fechada do valor presente de anuidades e perpetuidades crescentes.
Problema-Marco: Resolver equivalência de capitais com fluxos irregulares, desconto bancário de duplicatas e planejamento de renda perpétua com diferimento, validando as taxas efetivas anuais.
Macrotema 1.2: Inflação, Taxas Reais, Sistemas de Amortização e Avaliação de Projetos
Trilha: TRL-ECON-00 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-MATH:6.2
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação]
Bibliografia e Capítulos: BIB-ECON-07 [Mercado/Institucional] (Caps. 8–13); BIB-ECON-01 [Currículo/Prática] (Reading 1)
Subtemas:
Equação de Fisher exata ((1 + i_nom) = (1 + r_real)(1 + π)) e decomposição de retornos reais vs. nominais sob índices de preços (IPCA, IGP-M)
Sistemas de amortização de financiamentos: Tabela Price (Sistema Francês), SAC (Sistema de Amortização Constante), SAM e Sistema Americano (bullet)
Prazos de carência (com e sem capitalização de juros), parcelas intermediárias e cálculo do Custo Efetivo Total (CET)
Análise de projetos de investimento: Valor Presente Líquido (VPL/NPV), Taxa Interna de Retorno (TIR/IRR), conflitos de ranqueamento em projetos mutuamente excludentes, múltiplas TIRs e TIRM (MIRR)
Retorno ponderado pelo dinheiro (MWRR) vs. retorno ponderado pelo tempo (TWRR) em carteiras com aportes e resgates
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Equação de Fisher exata vs. aproximada, superioridade teórica do VPL sobre a TIR em projetos mutuamente excludentes e diferença entre MWRR e TWRR na avaliação de gestores.
Problema-Marco: Implementar em Python/planilha um gerador completo de cronogramas SAC e Price com carência e correção monetária (IPCA) e calcular o CET/TIR via Newton-Raphson.
Macrotema 1.3: Métodos Quantitativos Aplicados a Finanças
Trilha: TRL-ECON-00 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-MATH:7.1, DOM-MATH:7.2, DOM-MATH:7.3, DOM-MATH:7.6, DOM-MATH:7.9, DOM-MATH:7.10
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação]
Bibliografia e Capítulos: BIB-ECON-01 [Currículo/Prática] (Readings 2–7)
Subtemas:
Organização e visualização de séries financeiras, média aritmética, geométrica, harmônica e aparada aplicadas a retornos e múltiplos
Medidas de dispersão e risco de queda: variância, desvio-padrão, semivariância, target downside deviation, coeficiente de variação, assimetria (skewness) e curtose em excesso (leptocurtose de retornos)
Regras de probabilidade em finanças, valor esperado, covariância, correlação e atualização de cenários via Teorema de Bayes
Distribuições em finanças: Binomial, Uniforme, Normal, Log-Normal (modelagem de preços de ativos e retorno contínuo), t de Student, Qui-Quadrado e F; Safety-First Ratio de Roy
Amostragem, vieses de dados financeiros (viés de sobrevivência, look-ahead bias, data mining), estimação intervalar, testes de hipóteses paramétricos/não-paramétricos e regressão linear simples (estimação de alfa e beta)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Por que o retorno geométrico composto é sempre ≤ ao retorno aritmético, razão pela qual preços são modelados como Log-Normais quando retornos contínuos são Normais e identificação de vieses de sobrevivência/look-ahead em backtests.
Problema-Marco: Analisar uma série histórica real de retornos financeiros em Python calculando retorno geométrico, semidesvio, assimetria, curtose, teste de normalidade e regressão linear contra um benchmark de mercado.
Macrotema 1.4: Ética, Integridade de Mercados e Padrões Profissionais
Trilha: TRL-ECON-00 | Complexidade: 2/5 | Pré-requisitos Diretos: Nenhum | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Estudo de Caso e Decisão]
Bibliografia e Capítulos: BIB-ECON-06 [Currículo/Prática] (Readings 56–60)
Subtemas:
Confiança, dever fiduciário e Código de Ética e Padrões de Conduta Profissional (CFA Institute)
Profissionalismo: conhecimento da lei (lei mais restritiva prevalece), independência e objetividade, proibição de deturpação (misrepresentation) e má conduta
Integridade dos mercados de capitais: teoria do mosaico vs. informação material não-pública (insider trading) e manipulação de mercado
Deveres para com clientes e empregadores: lealdade, prudência, tratamento equitativo (fair dealing), adequação de perfil (suitability), preservação de confidencialidade e gestão/divulgação de conflitos de interesse
Análise de investimentos, diligência, base razoável, retenção de registros e padrões GIPS (Global Investment Performance Standards) para apresentação de performance composta
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Limite jurídico-ético entre Teoria do Mosaico e Insider Trading, regra da lei mais restritiva e princípios de formação de composites no GIPS.
Problema-Marco: Resolver 10 vinhetas/estudos de caso éticos complexos (estilo exame CFA) identificando exatamente quais padrões foram violados e qual a conduta corretiva obrigatória.
NÍVEL 2: TEORIA ECONÔMICA APLICADA E ECONOMIA POLÍTICA CLÁSSICA
Macrotema 2.1: Microeconomia Aplicada e Estruturas de Mercado
Trilha: TRL-ECON-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: DOM-MATH:5.2, DOM-MATH:5.3
Modalidades de Prática: [Análise Econômica e Crítica], [Cálculo Financeiro e Precificação]
Bibliografia e Capítulos: BIB-ECON-02 [Currículo/Prática] (Readings 8–10)
Subtemas:
Elasticidade-preço da demanda, elasticidade-renda (bens normais, inferiores, Giffen e Veblen) e elasticidade-preço cruzada (substitutos e complementares)
Teoria da escolha do consumidor: restrição orçamentária, curvas de indiferença, decomposição em efeito substituição e efeito renda
Produção e custos da firma: rendimentos marginais decrescentes, custos fixos/variáveis/marginais de curto e longo prazo, economias e deseconomias de escala, ponto de equilíbrio (breakeven) e ponto de fechamento (shutdown)
Estruturas de mercado: Concorrência Perfeita (P = CMg), Concorrência Monopolística, Oligopólio (curva de demanda quebrada, modelo de Cournot, equilíbrio de Nash / Dilema do Prisioneiro, liderança de preço) e Monopólio (discriminação de preços e regulação)
Medidas de poder de mercado e concentração industrial: razão de concentração (CR_n) e Índice Herfindahl-Hirschman (HHI)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Condição de maximização de lucro RMg = CMg, condição de fechamento no curto prazo (P < CVM médio) vs. longo prazo (P < CT médio) e cálculo/interpretação do HHI.
Problema-Marco: Analisar uma indústria concentrada calculando elasticidades, ponto de fechamento, HHI pré e pós-fusão e modelando o equilíbrio estratégico de preços entre dois concorrentes em oligopólio.
Macrotema 2.2: Macroeconomia, Ciclos Econômicos e Política Fiscal/Monetária
Trilha: TRL-ECON-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Análise Econômica e Crítica], [Estudo de Caso e Decisão]
Bibliografia e Capítulos: BIB-ECON-02 [Currículo/Prática] (Readings 11–13)
Subtemas:
Contabilidade nacional: PIB pelas óticas do dispêndio, renda e produto, PIB nominal vs. real, deflator do PIB e relação poupança-investimento-saldo externo ((S − I) = (G − T) + (X − M))
Modelo de Demanda Agregada (AD) e Oferta Agregada (SRAS e LRAS): deslocadores, hiatos recessivos e inflacionários, estagflação e equilíbrio de longo prazo
Crescimento econômico sustentável: função de produção Cobb-Douglas, capital físico, capital humano, tecnologia e Produtividade Total dos Fatores (PTF)
Ciclos econômicos: fases do ciclo, teorias clássica, keynesiana, monetarista e austríaca, indicadores antecedente/coincidente/defasado, taxas de desemprego (friccional, estrutural, cíclico) e inflação (demanda vs. custos)
Política fiscal (estabilizadores automáticos, multiplicador fiscal, crowding out, equivalência ricardiana e sustentabilidade da dívida pública) e Política monetária (teoria quantitativa da moeda MV = PY, efeito Fisher, neutralidade monetária e interação fiscal-monetária)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Identidade macroeconômica fundamental (S − I) = (G − T) + (X − M), diferença entre deslocamento de AD vs. choque de oferta (estagflação) e mecanismos de crowding out.
Problema-Marco: Construir um diagnóstico macroeconômico completo de uma economia sob estagflação, analisando os impactos combinados de política monetária contracionista e política fiscal expansionista sobre juros reais, câmbio e produto.
Macrotema 2.3: Economia Internacional, Balanço de Pagamentos e Câmbio
Trilha: TRL-ECON-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.2 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Análise Econômica e Crítica], [Cálculo Financeiro e Precificação]
Bibliografia e Capítulos: BIB-ECON-02 [Currículo/Prática] (Readings 14–15); BIB-ECON-10 [Mercado/Institucional] (Cap. 15)
Subtemas:
Comércio internacional: vantagem absoluta (Smith) vs. vantagem comparativa (Ricardo), modelo de Heckscher-Ohlin, termos de troca, tarifas, cotas, subsídios e blocos regionais
Balanço de Pagamentos: Conta Corrente, Conta Capital e Conta Financeira, e relação com fluxos de capitais e reservas internacionais
Mercado de câmbio: cotações diretas/indiretas, taxas cruzadas (cross rates), mercado à vista (spot) e a termo (forward — pontos forward e prêmio/desconto)
Relações de paridade internacional: Paridade Coberta da Taxa de Juros (CIP — não-arbitragem), Paridade Descoberta (UIP) e Paridade do Poder de Compra (PPP absoluta e relativa)
Regimes cambiais (flutuante, flutuante sujo, banda cambial, câmbio fixo, currency board e dolarização) e o Trilema da Economia Aberta (Trindade Impossível)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Fórmula exata da taxa forward pela Paridade Coberta da Taxa de Juros (F/S = (1 + i_d)/(1 + i_f)), Condição de Marshall-Lerner e Trindade Impossível (câmbio fixo, livre mobilidade de capitais e política monetária autônoma).
Problema-Marco: Calcular taxas cruzadas e taxas forward implícitas entre BRL, USD e EUR, identificar oportunidades de arbitragem coberta de juros e analisar o efeito de uma desvalorização cambial sobre o Balanço de Pagamentos (Curva J).
Macrotema 2.4: Economia Política Clássica (Adam Smith)
Trilha: TRL-ECON-01 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Análise Econômica e Crítica]
Bibliografia e Capítulos: BIB-ECON-15 [Teoria/Epistemologia] (Livros I–V)
Subtemas:
Divisão do trabalho, ganhos de produtividade e limitação pela extensão do mercado (Livro I)
Origem e uso da moeda, valor de uso vs. valor de troca (paradoxo da água e do diamante), preço real vs. nominal e componentes do preço (salário, lucro e renda da terra)
Preço natural vs. preço de mercado, mecanismo gravitacional de oferta/demanda e concorrência
Natureza e acumulação de capital, capital fixo vs. circulante, trabalho produtivo vs. improdutivo e taxa de juros no Livro II
Crítica sistemática ao sistema mercantilista e ao sistema fisiocrático (Livro IV) e a metáfora da "mão invisível" no contexto de comércio e alocação doméstica
Finanças públicas, papel do soberano (defesa, administração da justiça, obras e instituições públicas), cânones da tributação e dívida pública (Livro V)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Distinção smithiana entre preço natural e preço de mercado, os quatro cânones da tributação de Smith e os limites institucionais que o próprio Smith impõe ao livre mercado.
Problema-Marco: Redigir uma análise crítica comparando a teoria do preço natural, da divisão do trabalho e do papel do Estado em Adam Smith com os pressupostos da microeconomia neoclássica moderna (Tema 2.1).
Macrotema 2.5: Crítica da Economia Política (Karl Marx — O Capital, Livros 1, 2 e 3)
Trilha: TRL-ECON-01 | Complexidade: 5/5 | Pré-requisitos Diretos: 2.2, 2.4 | Pré-requisitos Cruzados: DOM-MATH:1.7
Modalidades de Prática: [Análise Econômica e Crítica]
Bibliografia e Capítulos: BIB-ECON-16 [Teoria/Epistemologia] (Livro 1); BIB-ECON-17 [Teoria/Epistemologia] (Livro 2); BIB-ECON-18 [Teoria/Epistemologia] (Livro 3)
Subtemas:
Livro 1 (Processo de Produção): mercadoria (valor de uso e valor), duplo caráter do trabalho (concreto e abstrato), tempo de trabalho socialmente necessário, forma-valor e fetichismo da mercadoria
Circulação simples (M − D − M) vs. circulação do capital (D − M − D'), força de trabalho como mercadoria, mais-valor absoluto e relativo, capital constante (c), capital variável (v), taxa de mais-valor (m/v), composição orgânica do capital (c/v) e acumulação capitalista
Livro 2 (Processo de Circulação): os três ciclos do capital (dinheiro, produtivo e mercadoria), tempo de produção vs. tempo de circulação, rotação do capital, capital fixo vs. circulante e Esquemas de Reprodução Simples e Ampliada (Departamentos I e II)
Livro 3 (Processo Global): taxa de lucro r = m / (c + v), transformação de valores em preços de produção, equalização da taxa geral de lucro, Lei da Queda Tendencial da Taxa de Lucro e suas causas contrariantes
Capital comercial, capital portador de juros, sistema de crédito, capital fictício (títulos de dívida pública, ações e capitalização de fluxos futuros), crises financeiras e teoria da renda da terra (diferencial e absoluta)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Relação matemática entre taxa de lucro r = (m/v) / (c/v + 1), condições de equilíbrio dos esquemas de reprodução do Livro 2, e conceito marxiano de capital fictício vs. capital real no Livro 3.
Problema-Marco: Elaborar um ensaio técnico-analítico contrastando as teorias do valor, do lucro, do juro e das crises em Smith (2.4), Marx (2.5) e na teoria monetária/financeira contemporânea (3.2 e 3.4).
NÍVEL 3: SISTEMA FINANCEIRO, BANCOS CENTRAIS, BANCOS E REGULAÇÃO
Macrotema 3.1: Arquitetura do Sistema Financeiro Nacional (SFN) e Global
Trilha: TRL-ECON-03 | Complexidade: 2/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Análise Econômica e Crítica], [Estudo de Caso e Decisão]
Bibliografia e Capítulos: BIB-ECON-08 [Mercado/Institucional] (Caps. 1–4); BIB-ECON-09 [Currículo/Prática] (Caps. 1–4); BIB-ECON-10 [Mercado/Institucional] (Caps. 1–2, 7–8)
Subtemas:
Função econômica dos mercados e intermediários financeiros: transferência intertemporal de recursos, liquidez, redução de custos de transação e mitigação de assimetria de informação (seleção adversa e risco moral / moral hazard)
Estrutura do Sistema Financeiro Nacional (SFN): órgãos normativos (CMN, CNSP, CNPC), entidades supervisoras (BACEN, CVM, SUSEP, PREVIC) e operadores (bancos múltiplos, bancos comerciais/investimento, cooperativas, distribuidoras/corretoras, B3, SELIC, SCD/SEP e instituições de pagamento)
Segmentação operacional dos mercados financeiros: Mercado Monetário, Mercado de Crédito, Mercado de Capitais e Mercado Cambial
Infraestrutura de liquidação, custódia e câmaras de compensação (clearinghouses / contraparte central — CCP) no Brasil (SPB, STR, Pix, B3) e no mundo
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Distinção entre seleção adversa (ex-ante) e risco moral (ex-post), separação de atribuições entre CMN/BACEN/CVM e papel mitigador de risco de contraparte de uma CCP.
Problema-Marco: Mapear o fluxo ponta a ponta de uma operação de crédito e de uma emissão de dívida no Brasil identificando os agentes, câmaras de registro/liquidação e órgãos reguladores envolvidos em cada etapa.
Macrotema 3.2: Teoria das Taxas de Juros e Estrutura a Termo Macroeconômica
Trilha: TRL-ECON-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.2, 2.2, 3.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Análise Econômica e Crítica], [Cálculo Financeiro e Precificação]
Bibliografia e Capítulos: BIB-ECON-10 [Mercado/Institucional] (Caps. 3–5); BIB-ECON-08 [Mercado/Institucional] (Caps. 5–6); BIB-ECON-09 [Currículo/Prática] (Caps. 5–6)
Subtemas:
Determinação do nível de taxas de juros: teoria dos fundos emprestáveis (oferta e demanda por títulos) e teoria da preferência pela liquidez (equilíbrio monetário)
Dinâmica de juros após choques monetários: efeito liquidez, efeito renda, efeito nível de preços e efeito inflação esperada (Efeito Fisher)
Estrutura de risco das taxas de juros: spreads de risco de crédito/default, prêmio de liquidez e tratamento tributário (ex.: títulos isentos vs. tributados)
Teorias econômicas da Estrutura a Termo da Taxa de Juros (curva normal, invertida e plana): Teoria das Expectativas Puras, Teoria da Segmentação de Mercado e Teoria do Prêmio de Liquidez / Habitat Preferido
A inclinação da curva de juros como indicador antecedente de recessões econômicas
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Os três fatos empíricos que uma teoria da curva de juros precisa explicar (taxas movem juntas; curvas inclinadas para cima quando taxas curtas são baixas; curvas normalmente positivamente inclinadas) e por que apenas o Prêmio de Liquidez explica todos os três.
Problema-Marco: Interpretar três formatos reais de curvas de juros (normal, achatada e invertida) derivando as taxas forward implícitas e diagnosticando o que cada curva sinaliza sobre expectativas de inflação, prêmio de prazo e ciclo econômico.
Macrotema 3.3: Bancos Centrais e Condução da Política Monetária
Trilha: TRL-ECON-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 2.2, 3.2 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Análise Econômica e Crítica], [Estudo de Caso e Decisão]
Bibliografia e Capítulos: BIB-ECON-10 [Mercado/Institucional] (Caps. 9–10); BIB-ECON-08 [Mercado/Institucional] (Caps. 2, 5)
Subtemas:
Origem, governança e independência de Bancos Centrais (Federal Reserve, BCE e Banco Central do Brasil / COPOM) e viés inflacionário de inconsistência temporal
Balanço do Banco Central, base monetária, reservas bancárias e mercado de reservas (Fed Funds nos EUA; Selic Over / operações compromissadas no Brasil)
Instrumentos convencionais de política monetária: Operações de Mercado Aberto (Open Market), taxa de redesconto (corredor de taxas) e recolhimento compulsório
Instrumentos não-convencionais no limite inferior zero (ZLB): Quantitative Easing (QE), compras de ativos, Forward Guidance e taxas nominais negativas
Regimes de política monetária: regime de Metas de Inflação (Inflation Targeting), mandato dual do Fed e Regra de Taylor
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Mecânica do corredor de taxas (piso de depósitos voluntários e teto de redesconto), Regra de Taylor e canais de transmissão monetária (juros, câmbio, preço de ativos e canal de crédito).
Problema-Marco: Simular uma decisão de comitê de política monetária (COPOM/FOMC) aplicando a Regra de Taylor a um cenário com choque de oferta e hiato positivo, justificando o impacto esperado sobre o balanço bancário e a curva de juros.
Macrotema 3.4: Economia Bancária, Gestão de Riscos, Regulação e Crises Financeiras
Trilha: TRL-ECON-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.1, 3.3 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Estudo de Caso e Decisão]
Bibliografia e Capítulos: BIB-ECON-10 [Mercado/Institucional] (Caps. 17–24); BIB-ECON-08 [Mercado/Institucional] (Caps. 3, 7–9); BIB-ECON-09 [Currículo/Prática] (Caps. 7–9)
Subtemas:
Balanço patrimonial de um banco comercial, transformação de maturidades, liquidez, gestão de ativos/passivos (ALM), adequação de capital (ROA, ROE e multiplicador de alavancagem) e operações fora de balanço (off-balance-sheet)
Gestão de risco de crédito bancário (triagem, monitoramento, garantias/colateral, racionamento de crédito) e gestão de risco de taxa de juros (Análise de Gap de Sensibilidade e Duration Gap de patrimônio líquido)
Regulação prudencial e supervisão bancária: redes de segurança (FGC/FDIC e risco moral), Acordos de Basileia I, II e III (ativos ponderados pelo risco — RWA, Índice de Basileia, buffers de capital, LCR e NSFR)
Anatomia das crises financeiras em economias avançadas e emergentes (Crise de 2007–2009, shadow banking, alavancagem pró-cíclica, corridas bancárias e papel do emprestador de última instância)
Instituições não-bancárias: seguradoras, fundos de pensão, fundos mútuos/ETFs, bancos de investimento e hedge funds
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Cálculo do impacto de um choque de juros Δi no patrimônio líquido bancário via Duration Gap (ΔNW ≈ −[D_A − (L/A)D_L] · A · Δi/(1+i)), exigências de Basileia III (CET1, LCR, NSFR) e dinâmica de amplificação de crises via desalavancagem.
Problema-Marco: Analisar o balanço de um banco comercial com descasamento de prazos (funding curto e crédito longo), calcular o Gap de Liquidez, o Duration Gap e o Índice de Basileia sob um choque de +200 bps nos juros e propor uma estratégia de hedge.
NÍVEL 4: CONTABILIDADE FINANCEIRA, EMISSORES CORPORATIVOS E ANÁLISE DE BALANÇOS
Macrotema 4.1: Estrutura e Mecânica das Demonstrações Financeiras (IFRS vs. US GAAP)
Trilha: TRL-ECON-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Análise Econômica e Crítica]
Bibliografia e Capítulos: BIB-ECON-02 [Currículo/Prática] (Readings 16–21)
Subtemas:
Estrutura conceitual dos relatórios financeiros (IFRS vs. US GAAP), equação contábil fundamental e regime de competência (accrual accounting) vs. regime de caixa
Demonstração do Resultado (DRE / Income Statement): critérios de reconhecimento de receita (modelo de 5 etapas IFRS 15 / ASC 606), despesas por função/natureza, itens não-recorrentes, lucro abrangente (OCI) e cálculo de Lucro por Ação (EPS básico e diluído — método das ações em tesouraria e if-converted)
Balanço Patrimonial (Balance Sheet): classificação circulante/não-circulante, ativos financeiros (custo amortizado, FVOCI, FVPL), ativos intangíveis/goodwill e patrimônio líquido
Demonstração dos Fluxos de Caixa (DFC / Cash Flow Statement): classificação de juros e dividendos (diferenças IFRS vs. US GAAP), elaboração pelo método direto e indireto, e derivação de FCFF (Free Cash Flow to the Firm) e FCFE (Free Cash Flow to Equity)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Reconciliação exata entre Lucro Líquido (DRE) e Fluxo de Caixa Operacional (DFC indireta), cálculo de EPS diluído com títulos conversíveis/opções e fórmulas de FCFF e FCFE a partir do CFO.
Problema-Marco: Reconstruir a DFC pelo método indireto e calcular EPS diluído, FCFF e FCFE a partir da DRE e de dois Balanços Patrimoniais consecutivos de uma companhia aberta (reconciliando variações de capital de giro).
Macrotema 4.2: Análise Contábil Profunda de Estoques, Ativos de Longo Prazo, Impostos e Dívida
Trilha: TRL-ECON-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.2, 4.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Análise Econômica e Crítica]
Bibliografia e Capítulos: BIB-ECON-03 [Currículo/Prática] (Readings 22–26)
Subtemas:
Estoques: custeio PEPS (FIFO), UEPS (LIFO — permitido apenas em US GAAP), Custo Médio Ponderado, reserva LIFO, liquidação LIFO e ajustes de conversão LIFO → FIFO para comparabilidade entre empresas
Ativos de longo prazo: capitalização vs. lançamento como despesa (impacto em EBITDA, CFO, CFI, ROE e alavancagem), métodos de depreciação (linear, acelerada, unidades produzidas), reavaliação (IFRS) e testes de recuperabilidade (impairment)
Impostos sobre a renda: lucro contábil vs. lucro tributável, diferenças temporárias vs. permanentes, criação e reversão de Ativos Fiscais Diferidos (DTA) e Passivos Fiscais Diferidos (DTL) e valuation allowance
Passivos não-circulantes: contabilização de títulos emitidos com ágio, deságio ou ao par pelo método da taxa efetiva de juros (amortização do desconto/prêmio), covenants de dívida, arrendamentos (Leases — IFRS 16 / ASC 842, direito de uso e passivo de arrendamento) e planos de pensão (benefício definido vs. contribuição definida)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Impacto direcional de FIFO vs. LIFO em ambiente inflacionário sobre CMV, lucro, caixa e liquidez corrente; contabilização do deságio/ágio de dívida pelo método dos juros efetivos; e distinção entre DTA/DTL temporários e diferenças permanentes.
Problema-Marco: Ajustar as demonstrações de duas empresas concorrentes (uma reportando em US GAAP com LIFO e outra em IFRS com FIFO e leasing capitalizado) para colocá-las na mesma base analítica e montar a tabela de amortização contábil de uma debênture emitida com deságio.
Macrotema 4.3: Índices Financeiros, Análise DuPont e Qualidade dos Lucros
Trilha: TRL-ECON-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 4.1, 4.2 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Estudo de Caso e Decisão]
Bibliografia e Capítulos: BIB-ECON-02 [Currículo/Prática] (Reading 21); BIB-ECON-03 [Currículo/Prática] (Readings 27–28)
Subtemas:
Análise vertical, análise horizontal e famílias de indicadores: Atividade (giros e Ciclo de Conversão de Caixa — CCC), Liquidez (corrente, seca, imediata), Solvência (Dívida/PL, Dívida/Ativo, Cobertura de Juros), Rentabilidade (margens, ROA, ROE, ROIC) e indicadores de mercado
Decomposição DuPont do ROE em 3 fatores (Margem Líquida × Giro do Ativo × Alavancagem Financeira) e em 5 fatores (Carga Tributária × Carga de Juros × Margem EBIT × Giro do Ativo × Alavancagem)
Qualidade dos relatórios financeiros vs. qualidade dos resultados (sustentabilidade e persistência dos lucros)
Sinais de alerta (red flags) de manipulação contábil: divergência persistente entre Lucro Líquido e CFO (accruals elevados), reconhecimento agressivo de receitas (channel stuffing), capitalização indevida de despesas operacionais e classificação distorcida de fluxos de caixa
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Decomposição DuPont de 5 fatores, fórmula do Ciclo de Conversão de Caixa (CCC = DIO + DSO − DPO) e diagnóstico de baixa qualidade de lucros por razão de accruals (CFO/Lucro Líquido).
Problema-Marco: Conduzir uma auditoria analítica completa de uma empresa em deterioração silenciosa usando DuPont de 5 fatores, evolução do CCC e análise de accruals, apontando exatamente onde o balanço mascara queda operacional.
Macrotema 4.4: Finanças Corporativas, Custo de Capital e Governança
Trilha: TRL-ECON-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.2, 4.3 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Estudo de Caso e Decisão]
Bibliografia e Capítulos: BIB-ECON-03 [Currículo/Prática] (Readings 29–32); BIB-ECON-04 [Currículo/Prática] (Readings 33–35)
Subtemas:
Formas de organização empresarial, problemas de agência (acionistas vs. gestores e acionistas vs. credores), governança corporativa e integração de fatores ESG
Gestão de capital de giro e liquidez de curto prazo (fontes primárias e secundárias de liquidez e custos implícitos de descontos comerciais)
Orçamento de capital corporativo (fluxos de caixa incrementais após impostos, exclusão de custos afundados, inclusão de custos de oportunidade e canibalização)
Medidas de alavancagem: Grau de Alavancagem Operacional (DOL), Grau de Alavancagem Financeira (DFL), Grau de Alavancagem Total (DTL) e ponto de equilíbrio operacional/financeiro
Custo de Capital (WACC): custo da dívida após benefício fiscal (k_d(1 − t)), custo de ações preferenciais, custo de capital próprio (CAPM, DDM, Bond Yield + Risk Premium), desalavancagem e realavancagem do Beta (Equação de Hamada) e prêmio de risco-país
Teoria da Estrutura de Capital: Proposições I e II de Modigliani-Miller (sem impostos e com benefício fiscal da dívida), custos de dificuldade financeira (Static Trade-Off Theory) e Teoria da Ordem Hierárquica (Pecking Order)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Fórmula do WACC, Equação de Hamada para desalavancar/realavancar beta de projetos comparáveis, Proposições I e II de Modigliani-Miller (com e sem impostos) e cálculo de DOL/DFL.
Problema-Marco: Estimar o WACC de um projeto de expansão em um setor diferente do core da empresa (desalavancando o beta de empresas comparáveis e realavancando para a estrutura-alvo de capital) e avaliar a viabilidade do projeto via VPL e análise de sensibilidade.
NÍVEL 5: RENDA VARIÁVEL (EQUITY), INVESTIMENTOS ALTERNATIVOS E DERIVATIVOS
Macrotema 5.1: Organização de Mercados de Capitais, Eficiência e Análise Setorial
Trilha: TRL-ECON-02 | Complexidade: 2/5 | Pré-requisitos Diretos: 3.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Análise Econômica e Crítica], [Cálculo Financeiro e Precificação]
Bibliografia e Capítulos: BIB-ECON-04 [Currículo/Prática] (Readings 36–40); BIB-ECON-08 [Mercado/Institucional] (Caps. 10–11); BIB-ECON-09 [Currículo/Prática] (Caps. 10–11); BIB-ECON-10 [Mercado/Institucional] (Cap. 13)
Subtemas:
Organização de mercados primários (IPO, bookbuilding, oferta secundária) e secundários (mercados orientados a cotações vs. ordens vs. corretagem)
Posições compradas (long), vendas a descoberto (short selling), compras na margem, alavancagem e cálculo do preço de chamada de margem (margin call)
Instruções de execução de ordens: ordem a mercado, ordem limitada (livro de ofertas / bid-ask spread), stop-loss, iceberg e validade (GTC, FOK, IOC)
Construção e rebalanceamento de índices de mercado (ponderado por preço, igualmente ponderado, ponderado por capitalização/free float e índices de retorno de preço vs. retorno total)
Hipótese dos Mercados Eficientes (EMH — formas fraca, semiforte e forte), anomalias empíricas (efeito valor, tamanho, momentum) e análise competitiva setorial (Cinco Forças de Porter e ciclo de vida da indústria)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Fórmula do preço de chamada de margem P_call = P₀ · (1 − margem_inicial) / (1 − margem_manutenção), diferenças entre índices ponderados por preço vs. valor de mercado e implicações das três formas da EMH para análise técnica e fundamentalista.
Problema-Marco: Construir um índice de 5 ações sob os 3 métodos de ponderação (calculando retornos após um desdobramento/split) e simular operações alavancadas na margem com chamada de margem e venda a descoberto com pagamento de dividendos.
Macrotema 5.2: Valuation de Renda Variável (Equity Valuation)
Trilha: TRL-ECON-02 | Complexidade: 4/5 | Pré-requisitos Diretos: 4.3, 4.4, 5.1 | Pré-requisitos Cruzados: DOM-MATH:1.7
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação]
Bibliografia e Capítulos: BIB-ECON-04 [Currículo/Prática] (Reading 41); BIB-ECON-08 [Mercado/Institucional] (Cap. 12)
Subtemas:
Ações ordinárias vs. preferenciais, valor intrínseco vs. preço de mercado e categorias de modelos de valuation
Modelos de Valor Presente (DCF): Modelo de Desconto de Dividendos (DDM — crescimento zero, Modelo de Gordon com crescimento constante g = b × ROE e DDM multiestágio) e Modelo de Fluxo de Caixa Livre para o Acionista (FCFE)
Precificação de ações preferenciais perpétuas e resgatáveis
Modelos de Multiplicadores / Múltiplos: P/L (trailing e leading), P/VP, P/Vendas, P/Fluxo de Caixa e Enterprise Value / EBITDA (EV/EBITDA), conectando múltiplos justificados aos fundamentos (taxa de crescimento, payout e custo de capital)
Modelos Baseados em Ativos (valor contábil ajustado e valor de liquidação) e quando cada classe de modelo é adequada ou falha
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Taxa de crescimento sustentável g = (1 − payout) × ROE, fórmula do P/L justificado a partir do Modelo de Gordon (P₀/E₁ = payout / (r − g)) e definição de Enterprise Value (EV = Valor de Mercado + Dívida Total − Caixa).
Problema-Marco: Modelar o valuation completo de uma empresa aberta em Python/planilha usando DDM de dois estágios, DCF via FCFF/FCFE e comparação por múltiplos EV/EBITDA e P/L justificado, apresentando matriz de sensibilidade a WACC e taxa g perpétua.
Macrotema 5.3: Investimentos Alternativos
Trilha: TRL-ECON-02 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.3, 4.4, 5.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Estudo de Caso e Decisão]
Bibliografia e Capítulos: BIB-ECON-05 [Currículo/Prática] (Reading 50)
Subtemas:
Características gerais de investimentos alternativos (baixa liquidez, baixa correlação, assimetria informacional e estruturas de parceria limitada GP/LP)
Cálculo de taxas de administração e performance (2-and-20, hurdle rate hard vs. soft, high-water mark, waterfall e clawback)
Hedge Funds: estratégias Equity Hedge (long/short, market neutral), Event-Driven (merger arbitrage, distressed), Relative Value (fixed income arbitrage) e Macro
Capital Privado (Private Equity e Private Debt): Leveraged Buyouts (LBO), Venture Capital (estágios e diluição), estratégias de saída e curva J de retornos
Imóveis (Real Estate direto, REITs e FIIs — métricas NOI e Cap Rate), Infraestrutura e Commodities (convenience yield, custo de estocagem, contango e backwardation)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Cálculo exato de retorno líquido ao investidor sob taxa 2-and-20 com high-water mark e hurdle rate, e relação entre preço futuro de commodities, taxa livre de risco, estocagem e convenience yield (contango vs. backwardation).
Problema-Marco: Calcular o retorno líquido multiperíodo de um Hedge Fund sob cenários de drawdown e recuperação (aplicando high-water mark e hurdle rate) e avaliar um portfólio imobiliário/FII via NOI e Cap Rate.
Macrotema 5.4: Fundamentos de Derivativos e Precificação por Não-Arbitragem
Trilha: TRL-ECON-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.1, 3.1, 5.1 | Pré-requisitos Cruzados: DOM-MATH:7.2, DOM-MATH:7.5
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação]
Bibliografia e Capítulos: BIB-ECON-05 [Currículo/Prática] (Readings 48–49); BIB-ECON-08 [Mercado/Institucional] (Caps. 13–14); BIB-ECON-09 [Currículo/Prática] (Caps. 13–14); BIB-ECON-10 [Mercado/Institucional] (Cap. 24)
Subtemas:
Arquitetura dos mercados de derivativos: bolsa (padronização, marcação a mercado / ajuste diário, garantias) vs. balcão (OTC — risco de contraparte e compensação central)
Compromissos a termo: Contratos a Termo (Forwards), Futuros (diferença de marcação a mercado e correlação com juros) e Swaps (taxa de juros — fixo vs. flutuante — e moedas)
Direitos contingentes: Opções de Compra (Calls) e de Venda (Puts), europeias vs. americanas, dinheiro (ITM/ATM/OTM), diagramas de payoff e lucro líquido, valor intrínseco e valor no tempo (time value)
Princípio da Não-Arbitragem e Replicação: precificação de Forwards/Futuros com custos e benefícios de carregamento (F₀(T) = (S₀ − PV_benefícios + PV_custos)(1 + r)^T) e valor do contrato durante sua vigência
Paridade Put-Call (c₀ + X/(1+r)^T = p₀ + S₀) e Paridade Put-Call-Forward para posições sintéticas
Precificação de opções pelo Modelo Binomial de Um Período (carteira replicadora livre de risco e probabilidades neutras ao risco π) e limites de exercício antecipado em opções americanas
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Princípio da Lei do Preço Único / não-arbitragem, demonstração da Paridade Put-Call por portfólios fiduciário e protetor, e derivação da probabilidade neutra ao risco no modelo binomial de 1 período (independente da probabilidade real de alta).
Problema-Marco: Construir estratégias sintéticas e identificar/explorar violações de arbitragem na Paridade Put-Call; implementar em Python o precificador binomial de opções (1 e N períodos) validando a convergência dos payoffs e do hedge delta.
NÍVEL 6: GESTÃO DE PORTFÓLIOS, FINANÇAS COMPORTAMENTAIS E RISCO DE CAUDA
Macrotema 6.1: Teoria Moderna de Portfólios e Modelos de Precificação de Ativos
Trilha: TRL-ECON-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.3, 4.4, 5.1 | Pré-requisitos Cruzados: DOM-MATH:3.8, DOM-MATH:5.9, DOM-MATH:7.4, DOM-MATH:7.5
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação]
Bibliografia e Capítulos: BIB-ECON-05 [Currículo/Prática] (Readings 51–52); BIB-ECON-08 [Mercado/Institucional] (Cap. 12)
Subtemas:
Preferências do investidor: função utilidade quadrática U = E(R) − (1/2) A σ², aversão ao risco e curvas de indiferença
Retorno esperado e variância de portfólios com 2 e N ativos (forma matricial wᵀΣw) e efeito da correlação ρ na redução do risco diversificável
Fronteira de Variância Mínima, Fronteira Eficiente de Markowitz e introdução do ativo livre de risco: Linha de Alocação de Capital (CAL) e Linha de Mercado de Capitais (CML — Portfólio de Mercado)
Risco sistemático vs. não-sistemático, modelos multifatoriais (Fama-French) e CAPM (E(R_i) = R_f + β_i [E(R_m) − R_f]) com a Linha de Mercado de Títulos (SML)
Métricas de avaliação de performance ajustada ao risco: Índice de Sharpe, Índice de Treynor, Medida M² (Modigliani-Modigliani) e Alfa de Jensen
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Distinção entre CML (risco total σ para portfólios eficientes) e SML (risco sistemático β para ativos individuais), decomposição de variância β_i = Cov(R_i, R_m)/Var(R_m) e interpretação do Alfa de Jensen.
Problema-Marco: Implementar em Python a otimização da Fronteira Eficiente de Markowitz para uma carteira de 5 ativos reais (calculando o Portfólio de Mínima Variância Global e o Portfólio Tangente de máximo Sharpe) e testar desvios em relação à SML.
Macrotema 6.2: Planejamento de Carteiras, Gestão de Riscos e Finanças Comportamentais
Trilha: TRL-ECON-03 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.4, 6.1 | Pré-requisitos Cruzados: DOM-MATH:7.10
Modalidades de Prática: [Estudo de Caso e Decisão], [Análise Econômica e Crítica]
Bibliografia e Capítulos: BIB-ECON-06 [Currículo/Prática] (Readings 53–55)
Subtemas:
Declaração de Política de Investimentos (IPS): definição de capacidade vs. disposição para assumir risco, objetivos de retorno/risco e as 5 restrições clássicas (Liquidez, Horizonte de Tempo, Impostos, Requisitos Legais/Regulatórios e Circunstâncias Únicas)
Alocação Estratégica de Ativos (SAA), Alocação Tática (TAA), orçamento de risco e rebalanceamento
Framework de Gestão de Riscos Corporativos e de Carteira: governança, identificação de riscos financeiros (mercado, crédito, liquidez) e não-financeiros (operacional, legal, modelo), métricas de cauda (VaR e CVaR / Expected Shortfall), análise de sensibilidade, análise de cenários e stress testing
Finanças Comportamentais: vieses cognitivos (conservadorismo, confirmação, representatividade, ilusão de controle, retrospectiva, ancoragem, contabilidade mental, enquadramento, disponibilidade) e vieses emocionais (aversão à perda, excesso de confiança, autocontrole, status quo, efeito dotação, aversão ao arrependimento) e anomalias de mercado
Fundamentos de Fintech em gestão de investimentos: Big Data, Machine Learning supervisionado/não-supervisionado, processamento de linguagem natural, robo-advisors e Distributed Ledger Technology (DLT/Blockchain)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Distinção entre capacidade e disposição ao risco no IPS, limitações do VaR (não subaditividade e cegueira além do quantil) resolvidas pelo CVaR, e diferença entre vieses cognitivos (corrigíveis por educação) vs. emocionais (que exigem adaptação).
Problema-Marco: Redigir um IPS completo para um investidor institucional ou familiar com restrições conflitantes, definir sua alocação estratégica, calcular o VaR/CVaR histórico e paramétrico da carteira e propor salvaguardas comportamentais contra vieses identificados.
Macrotema 6.3: Fragilidade, Convexidade Não-Linear e Antifrágil em Sistemas Econômicos (Taleb)
Trilha: TRL-ECON-03 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.3, 6.1, 6.2 | Pré-requisitos Cruzados: DOM-MATH:5.3, DOM-MATH:7.5
Modalidades de Prática: [Análise Econômica e Crítica], [Modelagem e Simulação]
Bibliografia e Capítulos: BIB-ECON-19 [Teoria/Epistemologia] (Livros I–VII)
Subtemas:
A Tríade de Taleb: Frágil (prejudicado pela volatilidade/choques — função de payoff côncava), Robusto (insensível) e Antifrágil (beneficiado pela volatilidade/desordem — função de payoff convexa)
Formalização matemática da fragilidade via Desigualdade de Jensen (E[f(X)] ≥ f(E[X]) para f convexa; E[f(X)] ≤ f(E[X]) para f côncava) e efeito da segunda derivada (convexidade/gama) sob variância crescente
Mediocristão (domínio Gaussiano de caudas finas) vs. Extremistão (domínio de leis de potência / caudas gordas onde um único evento domina a amostra — Cisnes Negros)
Crítica epistemológica aos modelos tradicionais de risco: fragilista, intervencionismo ingênuo, iatrogenia, falácia lúdica e Problema da Indução (o Peru de Russell)
Estratégias práticas de antifragilidade: Estratégia Barbell (bimodal: 85–90% em extrema segurança + 10–15% em apostas altamente convexas de perda limitada e ganho assimétrico), opcionalidade (assimetria favorável que dispensa previsão), Via Negativa (remoção de fragilidades), Efeito Lindy e Skin in the Game (simetria ética de incentivos)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Caracterização rigorosa de fragilidade/antifragilidade via concavidade/convexidade e Desigualdade de Jensen, falha do desvio-padrão/Markowitz no Extremistão e estrutura matemática da Estratégia Barbell.
Problema-Marco: Simular em Python o comportamento de três portfólios (alavancado/côncavo, Markowitz padrão e Barbell com opções OTM) sob uma distribuição de retornos com saltos de cauda gorda (t-Student de baixos graus de liberdade / Pareto), demonstrando a divergência prática via Desigualdade de Jensen.
NÍVEL 7: RENDA FIXA NO BRASIL E FUNDAMENTOS DE ANÁLISE DE RENDA FIXA
Macrotema 7.1: Fundamentos Globais de Renda Fixa e Características Contratuais
Trilha: TRL-ECON-04 | Complexidade: 3/5 | Pré-requisitos Diretos: 1.2, 3.1, 3.2 | Pré-requisitos Cruzados: DOM-MATH:5.3, DOM-MATH:6.2
Modalidades de Prática: [Cálculo Financeiro e Precificação]
Bibliografia e Capítulos: BIB-ECON-04 [Currículo/Prática] (Readings 42–44); BIB-ECON-12 [Quantitativo/Modelagem] (Caps. 1–3); BIB-ECON-14 [Mercado/Institucional] (Parte I)
Subtemas:
Anatomia de um título de dívida: emissor, maturidade, valor de face (par value), taxa e frequência de cupom, moeda, escritura (indenture) e cláusulas restritivas (covenants afirmativos e negativos)
Estruturas de fluxo de caixa: bullet, amortizável (fully/partially amortizing), sinking fund, zero-coupon, step-up, PIK (payment-in-kind), taxa flutuante (FRN — referência + quoted margin) e indexados à inflação
Emissores e mercados (soberanos, supranacionais, municipais, corporativos, high-yield, Eurobonds) e mecanismos de emissão/negociação
Convenções internacionais de contagem de dias (Actual/Actual, 30/360, Actual/360), precificação entre datas de cupom, juros corridos (accrued interest), Preço Limpo (flat/clean price) vs. Preço Sujo (full/dirty price)
Medidas convencionais de retorno: Current Yield, Yield to Maturity (YTM e hipótese crítica de reinvestimento), Yield to Call, Yield to Put, Yield to Worst, Discount Margin (FRNs) e taxas de mercado monetário (add-on vs. discount yield)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Relação inversa e convexa entre preço e YTM, cálculo de preço limpo e sujo em datas intermediárias, efeito pull-to-par e por que o retorno realizado diverge da YTM quando taxas de reinvestimento mudam.
Problema-Marco: Precificar manualmente e em código títulos com cupom fixo e FRNs em datas intermediárias sob convenções Actual/Actual e 30/360, calculando preço sujo, juros corridos, preço limpo, YTM, Yield to Worst e Discount Margin.
Macrotema 7.2: O Mercado de Renda Fixa no Brasil (Regras ANBIMA, Títulos Públicos e Privados)
Trilha: TRL-ECON-04 | Complexidade: 4/5 | Pré-requisitos Diretos: 1.2, 3.1, 7.1 | Pré-requisitos Cruzados: Nenhum
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação]
Bibliografia e Capítulos: BIB-ECON-11 [Mercado/Institucional] (Caps. 1–7); BIB-ECON-08 [Mercado/Institucional] (Caps. 6–8); BIB-ECON-09 [Currículo/Prática] (Caps. 6–8)
Subtemas:
Convenções do mercado brasileiro (ANBIMA / Tesouro Nacional / B3): calendário de feriados nacionais, base exponencial de 252 dias úteis ((1 + y)^{du/252}), regras estritas de truncamento e arredondamento de PU e fatores
Referências de juros no Brasil: Taxa Selic Meta vs. Selic Over, Taxa DI (CDI — cálculo diário acumulado por fator produtivo), TR e IPCA/IGP-M (pro-rata die em dias úteis)
Precificação normativa exata dos Títulos Públicos Federais (SELIC / Tesouro Direto): LTN (pré-fixado zero-coupon, VF = 1.000), NTN-F (pré-fixado com cupom semestral de 10% a.a. em base exponencial), LFT (pós-fixado Selic, VNA atualizado diariamente + deságio/ágio), NTN-B e NTN-B Principal (IPCA + cupom semestral de 6% a.a., VNA projetado com IPCA pro-rata e cotação em % do VNA)
Títulos Privados Brasileiros: CDB, RDB, LCI, LCA, Letras Financeiras (LF), Debêntures (simples, conversíveis, permutáveis e incentivadas Lei 12.431), Notas Comerciais, CRI, CRA e cotas de FIDC
Tributação brasileira na renda fixa: tabela regressiva de IOF (até 29 dias), tabela regressiva de IR (22,5% a 15%), come-cotas e cálculo de equivalência de taxas entre títulos tributados e isentos (LCI/LCA/CRI/CRA/Debêntures incentivadas)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Fórmula exata do PU da LTN (1000 / (1+y)^{du/252}), cupom semestral da NTN-F (1000 · ((1,10)^{0,5} − 1)) e da NTN-B (6% a.a. exponencial sobre VNA), truncamentos normativos do Tesouro/ANBIMA e gross-up tributário para comparar CDB vs. LCI/LCA.
Problema-Marco: Implementar em Python um motor completo de precificação ANBIMA (com calendário de dias úteis) capaz de reproduzir até a 6ª casa decimal o PU oficial de LTN, NTN-F, LFT e NTN-B e calcular o retorno líquido pós-IR/IOF.
Macrotema 7.3: Estrutura a Termo da Taxa de Juros (ETTJ), Curvas no Brasil e Bootstrapping
Trilha: TRL-ECON-04 | Complexidade: 4/5 | Pré-requisitos Diretos: 3.2, 7.1, 7.2 | Pré-requisitos Cruzados: DOM-MATH:6.2, DOM-MATH:6.4
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação]
Bibliografia e Capítulos: BIB-ECON-11 [Mercado/Institucional] (Caps. 8–10); BIB-ECON-12 [Quantitativo/Modelagem] (Cap. 5); BIB-ECON-13 [Quantitativo/Modelagem] (Caps. 5–6); BIB-ECON-04 [Currículo/Prática] (Reading 44)
Subtemas:
Curva de rendimentos (Par Yield Curve) vs. Curva de Taxas à Vista (Spot / Zero-Coupon Curve) vs. Curva de Taxas a Termo Implícitas (Forward Curve) e Fatores de Desconto
Construção algorítmica da curva spot via Bootstrapping a partir de títulos com cupom e precificação livre de arbitragem por taxas spot
Contratos Futuros de Taxa de Juros na B3: DI1 Futuro (PU = 100.000 / (1+i)^{du/252}, ajuste diário, conversão de vértices em curva pré-fixada), DAP (Cupom de IPCA — curva de juros reais) e DDI/FRC (Cupom Cambial — base linear 360 dias corridos)
Métodos de interpolação da ETTJ no Brasil e no exterior: Flat Forward exponencial (padrão de mercado brasileiro entre vértices de DI1), interpolação linear, Splines cúbicas e modelos paramétricos de Nelson-Siegel e Svensson (usado pela ANBIMA para ETTJ oficial)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Relação exata entre taxas spot e forward em base 252 DU ((1+s₂)^{du₂/252} = (1+s₁)^{du₁/252} · (1+f_{1,2})^{(du₂−du₁)/252}), funcionamento do algoritmo de bootstrapping e significado geométrico dos parâmetros β₀ (nível), β₁ (inclinação) e β₂/β₃ (curvatura) em Nelson-Siegel-Svensson.
Problema-Marco: Construir em Python a ETTJ completa a partir de preços de LTNs/NTN-Fs ou vértices de DI1 Futuro via Bootstrapping, implementar interpolação Flat Forward exponencial e ajustar os parâmetros da curva de Svensson por mínimos quadrados não-lineares.
Macrotema 7.4: Risco de Taxa de Juros, Sensibilidade e Medidas de Duration/Convexidade
Trilha: TRL-ECON-04 | Complexidade: 4/5 | Pré-requisitos Diretos: 7.1, 7.3 | Pré-requisitos Cruzados: DOM-MATH:5.3, DOM-MATH:6.5
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação]
Bibliografia e Capítulos: BIB-ECON-05 [Currículo/Prática] (Reading 46); BIB-ECON-11 [Mercado/Institucional] (Cap. 11); BIB-ECON-12 [Quantitativo/Modelagem] (Cap. 4); BIB-ECON-13 [Quantitativo/Modelagem] (Caps. 7–9)
Subtemas:
Expansão de Taylor de 1ª e 2ª ordem do preço de um título P(y) em relação à taxa de juros
Medidas de Duration: Duration de Macaulay (prazo médio ponderado dos fluxos), Duration Modificada (sensibilidade percentual de 1ª ordem), Dollar Duration / Money Duration, PVBP / DV01 (valor monetário de 1 ponto-base) e Duration de Portfólio (média ponderada por valor de mercado)
Medidas empíricas/efetivas: Effective Duration e Effective Convexity via diferenças finitas centradas (indispensáveis quando fluxos de caixa dependem das taxas, como títulos com opções embutidas)
Convexidade: definição analítica, interpretação geométrica (ganho maior na queda de juros do que perda na alta), cálculo da variação aproximada ΔP/P ≈ −D_mod · Δy + (1/2) · C · (Δy)² e impacto na comparação de títulos de mesma duration
Risco de movimentos não-paralelos da curva de juros (nível, inclinação e curvatura — análise por PCA): Key Rate Duration (KRD) e Partial DV01 por vértice
Equilíbrio entre risco de preço de mercado e risco de reinvestimento de cupons: Duration Gap (Macaulay Duration − Horizonte de Investimento)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Dedução da Duration Modificada e da Convexidade via derivadas de P(y), propriedades da Duration (efeito de cupom, prazo e nível de yield), soma das Key Rate Durations igual à Effective Duration e condição de imunização pontual (Duration Gap = 0).
Problema-Marco: Implementar em Python o cálculo analítico e numérico (diferenças finitas) de Macaulay Duration, Modified Duration, DV01, Convexidade e vetor de Key Rate Durations sobre a ETTJ construída no Tema 7.3, validando o erro de aproximação contra a reprecificação exata para choques de ±50 bps e ±300 bps.
NÍVEL 8: MATEMÁTICA AVANÇADA DE RENDA FIXA, CRÉDITO ESTRUTURADO, SECURITIZAÇÃO E GESTÃO INSTITUCIONAL
Macrotema 8.1: Matemática Quantitativa de Renda Fixa (Spreads, Indexados e Conversíveis)
Trilha: TRL-ECON-04 | Complexidade: 5/5 | Pré-requisitos Diretos: 7.1, 7.2, 7.3, 7.4 | Pré-requisitos Cruzados: DOM-MATH:6.2, DOM-MATH:7.11
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação]
Bibliografia e Capítulos: BIB-ECON-13 [Quantitativo/Modelagem] (Caps. 1–4, 10–15); BIB-ECON-14 [Mercado/Institucional] (Partes II–III)
Subtemas:
Medidas rigorosas de spread de crédito sobre curvas: Nominal Spread, G-Spread, I-Spread (sobre curva swap) e Z-Spread (Zero-Volatility Spread) — spread constante sobre toda a curva spot resolvido numericamente
Matemática de títulos indexados à inflação (TIPS nos EUA e NTN-B no Brasil): indexação do principal, deflação/piso ao par, inflação implícita (Breakeven Inflation) e duration real vs. nominal
Títulos de taxa flutuante avançados: Floaters com caps/floors, Inverse Floaters (decomposição sintética e duration alavancada), Range Notes e cálculo da Spread Duration
Títulos conversíveis (Convertible Bonds): razão de conversão, valor de conversão, valor mínimo (bond floor), prêmio de conversão, perfil assimétrico de payoff e decomposição como título reto + opção de compra
Medidas de retorno total em horizonte (Total Return Analysis) e retorno de carteira com cenários explícitos de deslocamento não-paralelo da curva e taxas de reinvestimento
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Definição exata e cálculo numérico do Z-Spread (por que difere do nominal spread quando a curva não é plana), relação de Fisher aplicada à Breakeven Inflation e decomposição de um título conversível.
Problema-Marco: Implementar um solver numérico de Z-Spread sobre curva spot (via Newton-Raphson/Brent), decompor a duration de um Inverse Floater e projetar a matriz de retorno total (Total Return) em horizonte de 12 meses sob 5 cenários de deslocamento de curva.
Macrotema 8.2: Modelagem Estocástica de Taxas de Juros, Árvores Binomiais e Opções Embutidas
Trilha: TRL-ECON-04 | Complexidade: 5/5 | Pré-requisitos Diretos: 5.4, 7.3, 7.4, 8.1 | Pré-requisitos Cruzados: DOM-MATH:5.13, DOM-MATH:6.2, DOM-MATH:7.5, DOM-MATH:7.7, DOM-MATH:7.11
Modalidades de Prática: [Modelagem e Simulação], [Cálculo Financeiro e Precificação]
Bibliografia e Capítulos: BIB-ECON-13 [Quantitativo/Modelagem] (Caps. 16–20); BIB-ECON-14 [Mercado/Institucional] (Parte VI); BIB-ECON-12 [Quantitativo/Modelagem] (Caps. 6–8)
Subtemas:
Dinâmica estocástica da taxa curta de juros: modelos de equilíbrio (Vasicek com reversão à média, Cox-Ingersoll-Ross — CIR garantindo taxas não-negativas) vs. modelos de não-arbitragem calibrados à curva observada (Ho-Lee, Black-Derman-Toy — BDT, Hull-White e Black-Karasinski)
Construção e calibração iterativa de Árvores Binomiais Recombinantes de Taxas de Juros (ajuste das taxas forward em cada nó para reproduzir exatamente os preços dos títulos benchmark dado o parâmetro de volatilidade σ)
Avaliação por indução retroativa (Backward Induction) de títulos com opções embutidas: Callable Bonds (teto de preço e Convexidade Negativa em queda de juros), Putable Bonds (piso de preço e maior convexidade positiva) e Sinking Funds
Decomposição do valor: Preço(Callable) = Preço(Option-Free) − Valor(Call Embutida) e cálculo numérico do Option-Adjusted Spread (OAS) (diferença Z-Spread − OAS = Custo da Opção em bps)
Avaliação de instrumentos dependentes de trajetória (path-dependent, como MBS e títulos com memória) via Simulação de Monte Carlo de caminhos de taxas de juros com ajuste de drift de não-arbitragem
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Por que títulos callable exibem convexidade negativa quando as taxas caem abaixo do cupom, relação Z-Spread = OAS + Custo da Opção (para callable) e calibração livre de arbitragem de árvore binomial recombinante.
Problema-Marco: Implementar em Python a calibração completa de uma árvore binomial recombinante de taxas de juros (modelo log-normal tipo BDT) a partir de uma curva par/spot, precificar um título Callable e um Putable por retroindução e resolver numericamente o OAS, Effective Duration e Effective Convexity.
Macrotema 8.3: Securitização, Produtos Estruturados e Análise de Risco de Crédito
Trilha: TRL-ECON-04 | Complexidade: 5/5 | Pré-requisitos Diretos: 3.4, 7.2, 8.1, 8.2 | Pré-requisitos Cruzados: DOM-MATH:7.7, DOM-MATH:7.11, DOM-PROG:8.8
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação], [Estudo de Caso e Decisão]
Bibliografia e Capítulos: BIB-ECON-14 [Mercado/Institucional] (Partes IV–V); BIB-ECON-13 [Quantitativo/Modelagem] (Caps. 21–24); BIB-ECON-05 [Currículo/Prática] (Readings 45, 47); BIB-ECON-12 [Quantitativo/Modelagem] (Caps. 9–11)
Subtemas:
Engenharia da Securitização: cessão definitiva de créditos (true sale), isolamento patrimonial via SPE / FIDC (bankruptcy remoteness), cascata de pagamentos (waterfall) e mecanismos de reforço de crédito internos (subordinação de cotas sênior/mezanino/subordinada, sobrecolateralização, excesso de spread, conta reserva) e externos
Matemática de hipotecas amortizáveis e MBS (Mortgage-Backed Securities): risco de pré-pagamento (contraction risk na queda de juros e extension risk na alta de juros), métricas de velocidade de pré-pagamento (SMM, CPR e convenção PSA) e Weighted Average Life (WAL)
Estruturação de CMOs (Collateralized Mortgage Obligations): redistribuição do risco de pré-pagamento em tranches (Sequenciais, PAC — Planned Amortization Class, TAC, Support, IO/PO — Interest-Only/Principal-Only e Z-Bonds)
ABS (Asset-Backed Securities) lastreados em recebíveis não-hipotecários (cartão de crédito, financiamento de veículos, crédito consignado, recebíveis comerciais — equivalente aos FIDCs, CRIs e CRAs no Brasil) e CDOs/CLOs (estruturas cash flow vs. market value)
Análise Quantitativa de Risco de Crédito: os 4 Cs do crédito, decomposição de perda esperada EL = PD × LGD × EAD (Probabilidade de Default, Loss Given Default / Taxa de Recuperação e Exposição no Default), matrizes de transição de rating (Cadeias de Markov), risco de migração, modelos estruturais (Merton — equity como call sobre os ativos) vs. modelos de forma reduzida e Credit VaR
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: Conversão entre CPR e SMM (SMM = 1 − (1 − CPR)^{1/12}), cálculo do WAL (Weighted Average Life), funcionamento da subordinação na cascata de perdas de um FIDC/ABS e fórmula de Perda Esperada (EL = PD × LGD × EAD) + intuição do Modelo de Merton.
Problema-Marco: Modelar em Python o motor de fluxo de caixa e cascata (waterfall) de uma securitização com 3 tranches (Sênior, Mezanino e Subordinada — estilo FIDC/CMO) simulando choques simultâneos de pré-pagamento (CPR) e inadimplência (CDR/LGD) para medir o WAL, perdas por tranche e ponto de ruptura da subordinação.
Macrotema 8.4: Derivativos de Renda Fixa, Repo e Gestão Institucional de Carteiras
Trilha: TRL-ECON-04 | Complexidade: 5/5 | Pré-requisitos Diretos: 5.4, 6.1, 7.4, 8.1, 8.2 | Pré-requisitos Cruzados: DOM-MATH:3.8, DOM-MATH:5.9, DOM-MATH:7.11, DOM-PROG:7.5
Modalidades de Prática: [Cálculo Financeiro e Precificação], [Modelagem e Simulação], [Estudo de Caso e Decisão]
Bibliografia e Capítulos: BIB-ECON-14 [Mercado/Institucional] (Partes VII–IX); BIB-ECON-12 [Quantitativo/Modelagem] (Caps. 12–16); BIB-ECON-13 [Quantitativo/Modelagem] (Caps. 25–28); BIB-ECON-11 [Mercado/Institucional] (Cap. 12)
Subtemas:
Mercado de financiamento colateralizado (Repo / Operações Compromissadas e Reverse Repo): taxa repo, haircuts, margem de variação, colateral geral vs. especial (specialness) e alavancagem de carteiras de renda fixa
Futuros de Taxas de Juros e de Títulos Soberanos: Eurodollar/SOFR Futures, DI1 Futuro (B3), Treasury Bond Futures (fator de conversão, Cheapest-to-Deliver — CTD, wild card/timing options) e hedge de carteira via razão de hedge por BPV/DV01
Swaps de Taxa de Juros (IRS) (taxa fixa vs. flutuante): precificação inicial (par swap rate via curva de desconto), marcação a mercado, swap spread, duration de um swap (D_fixo − D_flutuante) e uso em gestão de ALM; Opções sobre taxas (Caps, Floors, Collars e Swaptions)
Derivativos de Crédito: Credit Default Swaps (CDS) single-name e índices (CDX/iTraxx), eventos de crédito, liquidação física/financeira, relação entre spread do CDS e spread de títulos corporativos (CDS-Bond Basis)
Estratégias Institucionais de Gestão de Carteiras de Renda Fixa: gestão passiva/indexação (enhanced indexing e amostragem estratificada por células de risco), estratégias ativas de posicionamento na curva (Bullet, Barbell e Ladder sob mudanças de inclinação/curvatura), Riding the Yield Curve
Gestão guiada por passivos (LDI — Liability-Driven Investing): Imunização Clássica de Redington para passivo único e múltiplos passivos (PV_ativos ≥ PV_passivos, D_ativos = D_passivos e Convexidade_ativos > Convexidade_passivos), risco de dispersão estrutural e Cash Flow Matching (dedication via programação linear)
Critérios de Aceite (DoD):
Conceitos/Princípios Obrigatórios: As três condições suficientes da Imunização de Redington (valor presente, duration e convexidade), cálculo do número ótimo de contratos futuros para hedge de DV01 (N* = −DV01_carteira / DV01_futuro), precificação da taxa fixa justa de um Swap de Juros e comportamento comparativo de Bullet vs. Barbell sob achatamento (flattening) e empinamento (steepening) da curva.
Problema-Marco: Construir em Python um otimizador de carteira LDI que compara (1) Imunização de Redington (combinando títulos com restrição de DV01 e maximização de convexidade), (2) Cash Flow Matching via Programação Linear (scipy.optimize.linprog) e (3) ajuste tático de duration via overlay de contratos futuros DI1/Treasury.
