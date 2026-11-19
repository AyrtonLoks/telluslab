const CALC = 'Cálculo/Algébrico';
const PROOF = 'Demonstração Formal';
const CODE = 'Implementação Computacional';

function variant(id) {
  return [...id].reduce((sum, c) => (sum * 31 + c.charCodeAt(0)) >>> 0, 17) % 13 + 2;
}
const q = value => '$'+value+'$';
const ex = (input, expected) => ({input,expected});
const test = (kind, scenario, expected) => ({kind,scenario,expected});

function worked(topicId, modality, n) {
  if (topicId==='1.1' && modality===CALC) {
    const u = n+5;
    return {
      title:'Interseções em um clube de estudos',
      statement:'Um grupo tem '+u+' pessoas. O conjunto $A$ fez Álgebra, $B$ fez Geometria e $C$ fez Lógica. Há '+(n+1)+' pessoas em $A$, '+(n+2)+' em $B$ e '+(n+2)+' em $C$. As três interseções de pares têm '+n+' pessoas cada. Exatamente '+(n-1)+' pessoas fizeram as três atividades.',
      requirements:['Determine quantas pessoas fizeram somente uma atividade, pelo menos uma atividade e nenhuma atividade.',
        'Construa as sete regiões disjuntas, verifique que são inteiras e não negativas, e escreva uma expressão geral para a união.',
        'Explique o erro de contar os três conjuntos separadamente.'],
      hypotheses:['As interseções de pares incluem as pessoas que fizeram as três atividades.','O total é o universo.'],
      examples:[ex('Dois conjuntos com tamanhos $4$ e $3$ e interseção $2$.','A união tem $5$ pessoas.')],
      tests:[test('limit','Todos os conjuntos coincidem e têm tamanho $m$.','A união tem $m$ pessoas e nenhuma pertence a exatamente um conjunto.'),
        test('limit','A interseção tripla excede uma interseção de pares.','Os dados são inconsistentes e alguma região seria negativa.')]
    };
  }
  if (topicId==='1.2' && modality===CALC) {
    return {title:'Domínio e inversa de uma composição',
      statement:'Considere $f(t)=1/t$ e $g(x)=x-'+n+'$. Forme $h=f\\circ g$.',
      requirements:['Determine o domínio máximo, a imagem e a fórmula de $h$.',
        'Escolha o contradomínio que torna $h$ bijetora, encontre a inversa e confira as duas composições nos respectivos domínios.',
        'Descreva o que acontece quando $x$ se aproxima do ponto excluído pelos dois lados.'],
      hypotheses:['As funções têm entradas e saídas reais.'],
      examples:[ex(q('x='+String(n+2)), '$h(x)=1/2$.')],
      tests:[test('limit',q('x='+n)+' ou $y=0$ na inversa.','Ambas as entradas devem ser excluídas dos seus respectivos domínios.') ]};
  }
  if (topicId==='1.3' && modality===CALC) {
    return {title:'Raízes, vértice e desigualdade',
      statement:'Estude a função $p(x)=(x-'+n+')^2-9$ e descreva o conjunto em que $|p(x)|\\le 7$.',
      requirements:['Obtenha raízes, mínimo, imagem e intervalos de monotonicidade de $p$.',
        'Expresse a solução da inequação como união de intervalos e classifique todos os extremos.',
        'Analise o que mudaria se o limite $7$ fosse substituído por $0$ ou $9$.'],
      hypotheses:['O domínio é $\\mathbb{R}$.'],
      examples:[ex(q('x='+String(n+4)), '$p(x)=7$, portanto esse ponto é aceito.')],
      tests:[test('limit',q('x='+n),'O valor é $-9$, logo o vértice não é aceito quando o limite vale $7$.')]};
  }
  if (topicId==='1.4' && modality===CALC) {
    return {title:'Taxas, potências e tempo de duplicação',
      statement:'Uma população segue $P(t)='+String(40*n)+'\\cdot 2^{t/3}$, com $t\\ge 0$ em dias.',
      requirements:['Calcule o tempo para triplicar e justifique a unicidade usando monotonicidade.',
        'Expresse o tempo para atingir uma fração $r$ do valor inicial em termos de $r$.',
        'Dê os intervalos de valores de $r$ que admitem uma solução no modelo.'],
      hypotheses:['A taxa de crescimento é constante no modelo e $r>0$.'],
      examples:[ex('$r=2$.','$t=3$ dias.')],
      tests:[test('limit','$r=1$ e $0<r<1$.','No primeiro caso $t=0$. No segundo, não existe solução para $t\\ge 0$.')]};
  }
  if (topicId==='1.6' && [CALC,PROOF].includes(modality)) {
    return {title:'Semelhança e área em um triângulo',
      statement:'No triângulo não degenerado $ABC$, escolha $D$ dentro de $AB$ e $E$ dentro de $AC$ de modo que $DE$ seja paralelo a $BC$. Suponha $AD/AB=2/5$ e área de $ABC$ igual a '+(n*25)+'.',
      requirements:['Justifique a semelhança de $ADE$ e $ABC$, indicando a correspondência dos ângulos.',
        'Calcule a área de $ADE$ e a do quadrilátero $DBCE$. Generalize para fator de escala $0<k<1$.'],
      hypotheses:['Os pontos estão nos segmentos indicados e $DE\\parallel BC$.'],
      examples:[ex('Com fator $k=1/2$ e área total $20$.','A área interna é $5$.')],
      tests:modality===CALC?[test('limit','$k\\to 0^+$ e $k\\to 1^-$.','A razão de áreas tende a $0$ e a $1$, respectivamente.')]:
        [test('brokenHypothesis','Remova o paralelismo. Escolha $AD/AB=2/5$ e $AE/AC=1/2$.','A razão de áreas vira $1/5$ e a semelhança não decorre das hipóteses.')]};
  }
  if (topicId==='2.1' && modality===PROOF) {
    return {title:'Quantificadores e condições necessárias',
      statement:'Em $\\mathbb{Z}$, compare as proposições $\\forall x\\,\\exists y: y=x+'+n+'$ e $\\exists y\\,\\forall x: y=x+'+n+'$.',
      requirements:['Escreva ambas por extenso. Julgue e justifique cada uma, com testemunha ou contraexemplo.',
        'Negue cada proposição com todos os quantificadores explícitos e verifique a consistência com o julgamento anterior.',
        'Explique o papel do domínio de $y$.'],
      hypotheses:['As duas variáveis estão inicialmente em $\\mathbb{Z}$.'],
      examples:[ex('Para $x=0$ na primeira proposição.',q('y='+n)+' é uma testemunha.')],
      tests:[test('brokenHypothesis','Restrinja o domínio de $y$ a inteiros não negativos, mantendo $x$ inteiro.',q('x=-'+(n+1))+' invalida a primeira proposição.') ]};
  }
}

export const workedTopics = Object.freeze(['1.1','1.2','1.3','1.4','1.6','2.1']);

function practiceGuide(topic, modality) {
  const obligation = topic.criteria.find(c=>c.kind==='mandatory').description;
  const target = topic.criteria.find(c=>c.kind==='capstone').description;
  const first = topic.subtopics[0].description;
  const subject = 'Use este ponto de partida do currículo para construir uma instância concreta e resolvê-la: '+first;
  const variants = {
    [CALC]: {
      task:'Escreva dados numéricos ou simbólicos completos. Resolva um caso representativo, um caso-limite e verifique por um segundo procedimento.',
      example:'Defina os dados, o domínio, a quantidade procurada e as unidades. Especifique os próprios valores antes de operar.',
      tests:[test('limit','Leve um parâmetro ao extremo do domínio; inclua singularidade, degeneração ou igualdade quando aplicável.',
        'Diga se o caso produz um valor, um limite ou uma entrada excluída. Justifique pelo domínio.') ]
    },
    [PROOF]: {
      task:'Formalize domínio, quantificadores e hipóteses. Demonstre uma implicação central usando apenas definições e os lemas autorizados.',
      example:'Escreva uma instância concreta das hipóteses, a conclusão e o trecho da prova que usa cada hipótese.',
      tests:[test('brokenHypothesis','Retire uma hipótese por vez e procure um contraexemplo ou prove que a condição é redundante.',
        'O exemplo precisa satisfazer todas as hipóteses mantidas e refutar explicitamente a conclusão.') ]
    },
    [CODE]: {
      task:'Escolha Python, Rust ou Go. Defina entradas, saídas, invariantes e custo esperado. Implemente uma versão de referência e compare a saída.',
      example:'Escolha o menor caso não trivial que possa ser conferido manualmente. Registre a entrada e a saída antes da implementação.',
      tests:[test('edge','Verifique menor entrada, dimensão inválida e dados com repetição.','Resultados definidos no contrato ou rejeição explícita.'),
        test('stability','Perturbe uma entrada ou aumente seu tamanho. Compare a uma referência.','Explique o erro relativo ou a preservação de exatidão e o efeito no custo.') ]
    }
  };
  const spec=variants[modality];
  return {title:'Prática guiada pelo Capstone',statement:target,
    requirements:[spec.task,'Use a rubrica curricular para verificar sua resolução: '+obligation],
    hypotheses:['Declare as hipóteses próprias da instância escolhida antes de começar.'],
    examples:[ex(subject,spec.example)],tests:spec.tests};
}

export function makeLocalChallenge(brief) {
  const n=variant(brief.id);
  const first=brief.curriculum[0];
  const workedExample=brief.block!=='mixed' && worked(first.id,brief.modality,n);
  if (workedExample) return {...workedExample,assumedTopicIds:[]};
  if (brief.block==='mixed') {
    return {
      title:'Problema misto de consolidação',
      statement:brief.curriculum.map(t=>t.criteria.find(c=>c.kind==='capstone').description).join('\n\n'),
      requirements:['Construa uma instância para cada parte. Resolva ambas e indique onde a mesma habilidade de raciocínio é útil.',
        'Justifique os passos essenciais e formule um caso no qual sua primeira estratégia deixa de funcionar.'],
      hypotheses:['Declare o domínio e todas as hipóteses de cada instância.'],
      examples:[ex('Use um caso de baixa dimensão para a primeira parte e uma instância menor da segunda.','Registre as saídas ou conclusões esperadas antes de resolver.')],
      tests:practiceGuide(first,brief.modality).tests,assumedTopicIds:[]
    };
  }
  return {...practiceGuide(first,brief.modality),assumedTopicIds:[]};
}

export function localAuthoringMode(brief) {
  return brief.block!=='mixed' && worked(brief.topicIds[0],brief.modality,variant(brief.id)) ? 'worked' : 'guided';
}

export { variant };

export function localFeedback(attempt, challenge) {
  const questions = {
    'Lacuna em Pré-requisito':'Qual definição ou resultado prévio você consegue enunciar e justificar antes do primeiro passo em que teve dificuldade?',
    'Heurística Inicial':'Qual instância menor você consegue resolver à mão e que padrão ela sugere?',
    'Erro Algébrico':'O que acontece se você recompuser a expressão anterior à última transformação ou substituir um valor admissível?',
    'Falha de Rigor/Quantificadores':'De que variáveis sua testemunha depende? Em qual passo você usou cada hipótese?',
    'Instabilidade/Bug':'Qual é a menor entrada que reproduz o erro? Qual deveria ser o resultado de referência?'
  };
  return {assessment:'insufficientEvidence',checks:[{category:'Autoavaliação',excerpt:attempt.draft.slice(0,170),
    observation:'O revisor local sugere verificações a partir da dificuldade selecionada.'}],
    questions:[questions[attempt.difficulty],'Como você verificaria o primeiro teste sugerido? '+challenge.tests[0].scenario]};
}

export async function callProvider(provider, messages) {
  const url = new URL(provider.endpoint);
  if (url.protocol !== 'https:' && !(url.protocol==='http:' && ['localhost','127.0.0.1','[::1]'].includes(url.hostname))) {
    throw new Error('Escolha HTTPS ou um provedor HTTP em loopback.');
  }
  if (url.username || url.password) throw new Error('Use o campo de token para credenciais.');
  const headers = {'Content-Type':'application/json'};
  if (provider.token) headers.Authorization = 'Bearer '+provider.token;
  const response=await fetch(url,{method:'POST',redirect:'error',headers,body:JSON.stringify({model:provider.model,messages}),signal:AbortSignal.timeout(60_000)});
  if (!response.ok) throw new Error('O provedor respondeu com HTTP '+response.status+'.');
  const body=await response.json();
  const content=body?.choices?.[0]?.message?.content;
  if (typeof content!=='string') throw new Error('Formato de resposta do provedor inválido.');
  return JSON.parse(content.trim().replace(/^\x60{3}(?:json)?\s*/i,'').replace(/\s*\x60{3}$/,''));
}
