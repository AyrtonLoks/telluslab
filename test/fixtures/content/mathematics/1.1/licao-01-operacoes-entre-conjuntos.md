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
