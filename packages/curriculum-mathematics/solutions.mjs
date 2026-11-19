import {variant, localAuthoringMode} from './authorship.mjs';

function worked(id,n) {
  switch(id) {
    case '1.1': return String.raw`**Separe as regiões.** Cada interseção exclusiva contém $1$ pessoa porque se subtrai a interseção tripla de cada par. Só $A$ contém $0$, só $B$ e só $C$ contêm $1$ cada.

**Some uma vez por região.** Exatamente uma atividade tem $2$ pessoas. A união tem $${n+4}$ pessoas e sobra uma pessoa no complemento.

$$|A\cup B\cup C|=|A|+|B|+|C|-|A\cap B|-|A\cap C|-|B\cap C|+|A\cap B\cap C|.$$

Cada pessoa presente nas três atividades foi contada três vezes, depois retirada três vezes. O último termo a recoloca uma vez.`;
    case '1.2': return String.raw`**Encontre o ponto excluído.** $h(x)=1/(x-${n})$ está definida em $\mathbb R\setminus\{${n}\}$ e nunca é zero.

**Isole a variável.** Para $y\ne 0$, resolva $y(x-${n})=1$ para obter $h^{-1}(y)=${n}+1/y$. Isso também demonstra sobrejetividade para $\mathbb R\setminus\{0\}$. A expressão da inversa é única.

**Confira as composições.** $h(h^{-1}(y))=y$ e $h^{-1}(h(x))=x$ nos domínios indicados. À esquerda do ponto excluído, $h$ tende a $-\infty$. À direita, tende a $+\infty$.`;
    case '1.3': return String.raw`**Comece pelo quadrado.** O mínimo é $-9$, atingido em $${n}$. A imagem é $[-9,\infty)$ e as raízes são $${n-3}$ e $${n+3}$. A função decresce até o vértice e cresce a partir dele.

**Use as duas desigualdades.** $-7\le p(x)\le 7$ equivale a $2\le(x-${n})^2\le16$. Logo $\sqrt2\le|x-${n}|\le4$. A solução é a união de $[${n-4},\ ${n}-\sqrt2]$ e $[${n}+\sqrt2,\ ${n+4}]$. Todos os extremos entram.

Com limite zero, restam as raízes. Com limite nove, o buraco central se fecha e o conjunto vira $[${n}-\sqrt{18},\ ${n}+\sqrt{18}]$.`;
    case '1.4': return String.raw`**Cancele o valor inicial, que é positivo.** A equação restante é $2^{t/3}=r$. Aplicando o logaritmo de base $2$, obtemos $t=3\log_2 r$.

A função é estritamente crescente, de modo que há uma solução única para $r\ge1$. Para $0<r<1$, a expressão dá tempo negativo e sai do domínio. Para a triplicação, $t=3\log_2 3\approx4{,}75$ dias.`;
    case '1.6': return String.raw`**Use o paralelismo.** Os ângulos correspondentes em $D$ e $B$, assim como em $E$ e $C$, são iguais. Os triângulos são semelhantes por AA.

**Compare áreas.** A escala $k$ multiplica a base e a altura. A razão de áreas é $k^2$. Logo $[ADE]=4\cdot${n}=${4*n}$ e $[DBCE]=21\cdot${n}=${21*n}$.

Sem paralelismo, a fórmula com seno do ângulo em $A$ fornece a razão $(AD/AB)(AE/AC)$. Para $2/5$ e $1/2$, vale $1/5$.`;
    case '2.1': return String.raw`**Primeira proposição.** Para cada $x$, a escolha $y=x+${n}$ é inteira e funciona. Sua negação é $\exists x\,\forall y:\ y\ne x+${n}$, falsa pela mesma escolha.

**Segunda proposição.** Um $y$ único teria de satisfazer simultaneamente as equações para $x=0$ e $x=1$, que dão valores diferentes. A negação é $\forall y\,\exists x:\ y\ne x+${n}$. Para todo $y$, tome $x=y-${n}+1$.

**Altere o domínio.** Com $y$ não negativo, $x=-${n+1}$ força $y=-1$ e refuta a primeira proposição original nesse novo domínio.`;
  }
}

export function explainLocally(brief, challenge) {
  if (localAuthoringMode(brief)==='worked') return {commentedSolution:worked(brief.topicIds[0],variant(brief.id))};
  const techniques = {
    'Cálculo/Algébrico':'Identifique as quantidades, isole o termo antes de operar e recupere a entrada por substituição. Descarte raízes ou valores que violem o domínio original.',
    'Demonstração Formal':'Escreva a tese após as hipóteses. Controle o escopo de cada testemunha, cite o resultado que autoriza cada passo e teste se a conclusão falha quando uma hipótese é retirada.',
    'Implementação Computacional':'Defina invariantes, compare com um oráculo pequeno ou de maior precisão e separe erro numérico da complexidade. Rejeite entrada inválida de forma explícita.'
  };
  return {commentedSolution:'**Roteiro de correção para a instância que você escolheu**\n\n'+techniques[brief.modality]+
    '\n\n**Confira os critérios do currículo.**\n'+brief.curriculum.map(t=>t.criteria.find(c=>c.kind==='mandatory').description).join('\n\n')+
    '\n\n**Valide os casos propostos.**\n'+challenge.tests.map(t=>t.scenario+'\n'+t.expected).join('\n\n')};
}

