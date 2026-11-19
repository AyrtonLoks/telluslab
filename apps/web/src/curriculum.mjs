import {trackView,pendingPath,mastered,advancementGuard,weightedProgress} from '../../../packages/learning-core/index.mjs';
import {esc,math,btn,aBtn,icon,badge,percent,normalize} from './ui.mjs';

export const labels=['Bloqueado','Disponível','Teoria concluída','Fixação mecânica','Prova validada','Revisão em dia','Revisão vencida'];
export const titleFor=(dag,id)=>dag.byId.get(id)?.title ?? dag.cross?.reference(id)?.title ?? id;
export function crossLink(ctx,ref) {
  const target=ctx.dag.cross.reference(ref);
  return '<a href="'+esc(ctx.topicHref(target.domainId,target.topicId))+'">'+esc(target.domainId+' '+target.topicId+' · '+target.title)+'</a>';
}
export const stateTag=p=>badge((p.state)+' · '+labels[+p.state[1]],p.state.toLowerCase());
export const trackShort=['Base','Analítica','Algébrica','Discreta','Estocástica'];
const trackLabels={
  programming:['Base','Algoritmos','Design e DDD','Arquitetura','Engenharia'],
  'economics-finance':['Base','Economia','Finanças corporativas','Sistema e risco','Renda fixa']
};
export const progressBar=(item,text)=>'<div class="progress-line"><div class="row between"><span>'+esc(text)+'</span><strong>'+percent(item.ratio)+'</strong></div><div class="bar-track" role="progressbar" aria-label="'+esc(text)+'" aria-valuenow="'+Math.round(100*(item.ratio??0))+'"><div style="width:'+Math.round(100*(item.ratio??0))+'%"></div></div></div>';
const cut=(s,n)=>s.length>n?s.slice(0,n-1)+'…':s;
export const page=(title,desc,actions='')=>'<div class="page-head"><div><h1>'+esc(title)+'</h1>'+(desc?'<p>'+esc(desc)+'</p>':'')+'</div>'+actions+'</div>';
const progressDot=p=>p.state==='S6'?'due':mastered(p)?'done':p.state==='S0'?'':'active';

function tile(node,p,x,y,marked,selected) {
  return '<button class="node '+p.state.toLowerCase()+(node.external?' external':'')+(marked?' path':'')+(selected?' selected':'')+
    '" title="'+esc(node.id+' '+node.title+' · '+labels[+p.state[1]])+'" style="left:'+x+'px;top:'+y+'px" type="button" data-act="node" data-id="'+node.id+
    '" aria-label="'+esc(node.id+' '+node.title+' · '+labels[+p.state[1]])+'"><i class="dot '+progressDot(p)+'"></i><span><span class="node-id">'+node.id+'</span>'+esc(node.title)+'</span></button>';
}

export function graph(ctx, compact=false) {
  const {catalog,dag,state,track,selected,target}=ctx;
  const view=trackView(dag,track);
  const path=new Set(target?.order ?? []);
  let nodes=view.nodes, edges=view.edges;
  if (compact) {
    const primary=nodes.filter(n=>!n.external);
    const window=primary.slice(0,6);
    nodes=window.length?window:nodes.slice(0,6);
    const set=new Set(nodes.map(n=>n.id));
    edges=edges.filter(e=>set.has(e.from)&&set.has(e.to));
  } else if (target?.order.length) {
    const ids=new Set([...target.order,...target.targets]);
    nodes=dag.order.filter(id=>ids.has(id)).map(id=>({...dag.byId.get(id),external:dag.byId.get(id).trackId!==track}));
    edges=nodes.flatMap(t=>t.prerequisites.filter(id=>ids.has(id)).map(id=>({from:id,to:t.id})));
  }
  if(!compact&&dag.cross) {
    const external=new Map();
    for(const node of nodes) {
      for(const ref of node.crossPrerequisites??[]) {
        external.set(ref,{id:ref,title:titleFor(dag,ref),external:true});
        edges.push({from:ref,to:node.id,cross:true});
      }
    }
    nodes=[...external.values(),...nodes];
  }
  const positions=new Map();
  const levels=new Map();
  const counts=new Map();
  const incoming=new Map(nodes.map(n=>[n.id,[]]));
  edges.forEach(e=>incoming.get(e.to)?.push(e.from));
  const xStep=compact?159:179;
  const yStep=compact?72:72;
  const xPad=compact?17:28;
  for(const node of nodes) {
    const depth=Math.max(-1,...incoming.get(node.id).map(id=>levels.get(id)??0))+1;
    levels.set(node.id,depth);
    const col=compact?Math.min(depth,2):depth;
    const row=counts.get(col)??0;
    counts.set(col,row+1);
    positions.set(node.id,{x:xPad+col*xStep,y:20+row*yStep});
  }
  const height=Math.max(compact?225:300,...[...positions.values()].map(p=>p.y+70));
  const width=Math.max(compact?476:550,...[...positions.values()].map(p=>p.x+163));
  const lines=edges.map(e=>{
    const a=positions.get(e.from),b=positions.get(e.to);
    const x=a.x+141,y=a.y+26,z=b.x,h=b.y+26;
    const d=z>x?'M'+x+' '+y+' C'+((x+z)/2)+' '+y+' '+((x+z)/2)+' '+h+' '+z+' '+h:
      'M'+x+' '+y+' C'+(x+25)+' '+y+' '+(z-20)+' '+h+' '+z+' '+h;
    return '<path class="'+(e.cross?'cross-edge':path.has(e.from)&&path.has(e.to)?'path':'')+'" d="'+d+'"/>';
  }).join('');
  const tabs='<div class="seg" aria-label="Trilhas">'+catalog.tracks.map((t,i)=>'<button type="button" data-act="track" data-id="'+t.id+'" aria-pressed="'+(track===t.id)+'" title="'+esc(t.title)+'">'+
    (trackLabels[catalog.slug]??trackShort)[i]+'</button>').join('')+'</div>';
  return '<section class="card"><div class="card-head"><div><h2>'+ (compact?'Mapa de aprendizagem':'Grafo curricular')+'</h2><p>'+
    (target&&!compact?'Ordem topológica do objetivo selecionado.':compact?'Pré-requisitos e próximos passos por trilha.':'Selecione um nó para abrir as evidências e os critérios de aceite.')+'</p></div>'+
    (compact?aBtn('trilhas','Abrir mapa','graph'):btn('clear-target','Limpar alvo','','clear',target?'':'hidden'))+'</div>'+
    '<div class="graph-options">'+tabs+'</div><div class="graph-scroll" tabindex="0" aria-label="Grafo rolável"><div class="graph-canvas" style="width:'+width+'px;height:'+height+'px"><svg class="graph-lines" aria-hidden="true" viewBox="0 0 '+width+' '+height+'">'+lines+'</svg>'+
    nodes.map(n=>{
      const {x,y}=positions.get(n.id);
      const progress=state.progress[n.id]??dag.cross?.progress(n.id)??{state:'S0'};
      const blocked=dag.byId.has(n.id)&&!mastered(progress)&&advancementGuard(dag,state.progress,n.id).crossBlocked;
      return tile(n,blocked?{state:'S0'}:progress,x,y,path.has(n.id),selected===n.id);
    }).join('')+
    '</div></div><div class="card-foot legend"><span><i class="dot"></i> Bloqueado</span><span><i class="dot active"></i> Em estudo</span><span><i class="dot done"></i> Validado</span><span><i class="dot due"></i> Revisão vencida</span>'+
    (!compact?'<span>Contorno tracejado · referência externa</span>':'')+
    (edges.some(e=>e.cross)?'<span>Aresta tracejada · pré-requisito interdisciplinar</span>':'')+'</div></section>';
}

export function topicPanel(ctx,topic) {
  const {dag,state}=ctx;
  const p=state.progress[topic.id];
  const guard=advancementGuard(dag,state.progress,topic.id);
  const rows=topic.subtopics.map(sub=>'<li class="row between"><div>'+math(sub.description)+'</div>'+
    (p.subtopics[sub.id]?badge('Concluído','s4'):guard.allowed?btn('study','Registrar','','clear','data-topic="'+topic.id+'" data-kind="completeSubtopic" data-entity="'+sub.id+'"'):'')+'</li>').join('');
  const dod=topic.criteria.map(c=>'<article class="area"><h4>'+ (c.kind==='mandatory'?(ctx.catalog.difficulties?'Conceitos e princípios obrigatórios':'Conceitos e teoremas obrigatórios'):'Problema-Marco')+'</h4>'+math(c.description)+
    '<div class="meta">'+(p.criteria[c.id]?badge('Validado','s4'):p.state==='S3'&&guard.allowed?btn('study','Validar critério','check','','data-topic="'+topic.id+'" data-kind="validateCriterion" data-entity="'+c.id+'"'):'')+'</div></article>').join('');
  const actionByState={S1:['completeTheory','Registrar fichamento'],S2:['passPractice','Registrar exercícios'],S3:['validateProof','Validar proficiência']};
  const stage=actionByState[p.state];
  const status=guard.crossBlocked&&!mastered(p)?badge('Bloqueado por pré-requisito cruzado','s0'):stateTag(p);
  return '<section class="card pad" id="topic-detail"><div class="row between wrap"><div><div class="eyebrow">Macrotema '+topic.id+'</div><h2>'+math(topic.title)+'</h2></div>'+status+'</div>'+
    '<div class="meta">'+badge('Complexidade '+topic.complexity+'/5')+topic.modalities.map(m=>badge(m)).join('')+'</div>'+
    '<div class="steps" aria-label="Progressão">'+labels.map((label,i)=>'<span title="'+label+'" class="'+(p.state==='S'+i?'current':'')+'">S'+i+'</span>').join('')+'</div>'+
    (guard.locked.length?'<p class="notice">Pré-requisitos pendentes · '+guard.locked.map(id=>'<a href="#trilhas/'+id+'"><strong>'+id+'</strong></a>').join(', ')+'</p>':'')+
    (guard.overdue.length?'<p class="notice warning">Revise primeiro os pré-requisitos vencidos · '+guard.overdue.join(', ')+'</p>':'')+
    (guard.crossPending?.length?'<p class="notice warning">'+(guard.crossBlocked?'Avanço bloqueado pelo Modo Estrito.':'Modo Flexível. Revise estes pré-requisitos enquanto avança.')+
      ' '+guard.crossPending.map(ref=>crossLink(ctx,ref)).join(', ')+'</p>':'')+
    '<div class="row wrap">'+btn('set-target','Definir como alvo','target','','data-kind="topic" data-id="'+topic.id+'"')+
    (guard.allowed&&stage?btn('study',stage[1],'check','primary','data-topic="'+topic.id+'" data-kind="'+stage[0]+'"'):'')+
    (!guard.crossBlocked&&(guard.allowed||['S4','S5'].includes(p.state))?btn('new','Praticar macrotema','practice','tinted','data-topic="'+topic.id+'"'):'')+'</div>'+
    '<details class="folder area" open><summary>Subtemas · '+Object.keys(p.subtopics).length+'/'+topic.subtopics.length+'</summary><ul class="compact-list">'+rows+'</ul></details>'+
    '<details class="folder area" open><summary>Critérios de aceite</summary>'+dod+'</details>'+
    '<details class="folder area"><summary>Bibliografia e capítulos</summary><ul class="compact-list">'+topic.bibliography.map(b=>{
      const book=ctx.catalog.books.find(x=>x.id===b.bookId);
      return '<li><a href="#biblioteca/'+b.bookId+'"><strong>'+b.bookId+' · '+esc(book.title)+'</strong></a><p class="small">'+esc(b.role)+' · '+esc(b.chapters)+'</p></li>';
    }).join('')+'</ul></details></section>';
}

export function mapPage(ctx) {
  const selected=ctx.dag.byId.get(ctx.selected);
  const t=ctx.target;
  return page('Mapa curricular','Explore a dependência entre macrotemas e encontre o caminho pendente para seu objetivo.')+
    '<form id="target-form" class="card pad filters"><label class="field"><span>Tipo de alvo</span><select class="control" name="kind" id="target-kind"><option value="topic">Macrotema</option><option value="book" '+(ctx.targetKind==='book'?'selected':'')+'>Obra</option></select></label>'+
    '<label class="field" style="flex:1"><span>Alvo</span><select class="control" name="id" id="target-id">'+
    (ctx.targetKind==='book'?ctx.catalog.books:ctx.catalog.topics).map(x=>'<option value="'+x.id+'">'+x.id+' · '+esc(x.title)+'</option>').join('')+'</select></label>'+
    '<button class="btn primary" type="submit">'+icon('target','sm')+' Calcular caminho</button></form>'+
    (t?'<div class="card pad area"><div class="row between wrap"><div><h2>Caminho de '+esc(ctx.targetRef?.id)+'</h2><p class="small">'+t.prerequisites.length+' pré-requisitos pendentes · '+t.pendingTargets.length+' macrotemas-alvo pendentes</p></div>'+
    badge(t.order.length?'Ordem de estudo':'Objetivo já coberto','s4')+'</div><div class="row wrap meta">'+t.order.map(id=>'<a class="tag" href="#trilhas/'+id+'" title="'+esc(titleFor(ctx.dag,id))+'">'+id+'</a>').join('')+'</div></div>':'')+
    (t?.crossOrder?.length?'<section class="card pad area"><h2>Pré-requisitos interdisciplinares pendentes</h2><ol class="compact-list">'+
      t.crossOrder.map(ref=>'<li>'+crossLink(ctx,ref)+'</li>').join('')+'</ol></section>':'')+
    '<div class="area" style="margin-bottom:16px">'+graph(ctx)+'</div>'+
    (selected?topicPanel(ctx,selected):'');
}

export function libraryPage(ctx,bookId) {
  const metrics=weightedProgress(ctx.catalog,ctx.state.progress);
  const books=ctx.catalog.books;
  const book=books.find(b=>b.id===bookId);
  const categories=[...new Map(books.map(b=>[b.category.id,b.category])).values()];
  const query=normalize(ctx.bookSearch);
  const matching=books.filter(b=>(!ctx.bookCategory||b.category.id===ctx.bookCategory)&&
    normalize([b.id,b.title,b.authorsText,b.category.title].join(' ')).includes(query));
  if(book) {
    const topics=ctx.catalog.topics.filter(t=>t.bibliography.some(r=>r.bookId===book.id));
    return page(book.title,book.authorsText,aBtn('biblioteca','Todas as obras','book'))+
      '<section class="card pad"><div class="row between wrap">'+badge(book.id)+' '+badge(book.category.title)+
      btn('set-target','Ver caminho pendente','target','primary','data-kind="book" data-id="'+book.id+'"')+'</div><div class="area">'+
      progressBar(metrics.books[book.id],'Progresso da obra')+'</div></section><section class="card pad area"><h2>Macrotemas vinculados</h2><ul class="compact-list">'+topics.map(t=>'<li><div class="row between wrap"><a href="#trilhas/'+t.id+'"><strong>'+t.id+' · '+esc(t.title)+'</strong></a>'+stateTag(ctx.state.progress[t.id])+'</div>'+
      t.bibliography.filter(r=>r.bookId===book.id).map(r=>'<small>'+esc(r.role)+' · '+esc(r.chapters)+'</small>').join(' ')+'</li>').join('')+'</ul></section>';
  }
  return page('Biblioteca','As '+books.length+' obras do currículo, com capítulos vinculados e progresso ponderado pela complexidade.')+
    '<form id="book-filters" class="filters"><label class="field" style="flex:1"><span>Buscar obra</span><input id="book-query" class="control" name="query" value="'+esc(ctx.bookSearch)+'" placeholder="Título, autor ou código"></label>'+
    '<label class="field"><span>Categoria</span><select class="control" name="category"><option value="">Todas as categorias</option>'+categories.map(c=>'<option value="'+c.id+'" '+(ctx.bookCategory===c.id?'selected':'')+'>'+esc(cut(c.title,48))+'</option>').join('')+'</select></label>'+
    '<button class="btn" type="submit">'+icon('search','sm')+' Buscar</button></form><p class="small">'+matching.length+' obras</p>'+
    '<div class="book-grid">'+matching.map(b=>'<a class="card pad book" href="#biblioteca/'+b.id+'"><div class="row between"><span class="book-icon">'+icon('book','sm')+'</span>'+badge(b.id)+'</div><h3>'+esc(b.title)+'</h3><p class="small">'+esc(b.authorsText)+'</p>'+progressBar(metrics.books[b.id],'Progresso')+'</a>').join('')+'</div>'+
    (!matching.length?'<p class="empty card">Nenhuma obra corresponde à busca.</p>':'');
}

