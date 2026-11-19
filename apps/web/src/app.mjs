import {createLearningState,refreshLearning,advancementGuard,pendingPath,applyStudyEvent,planSession,
  challengeBrief,updateTimer,submitAttempt,createAreaRegistry,createDomainPacks,MATH_DOMAIN,PROG_DOMAIN,ECON_DOMAIN,PHYS_DOMAIN,ENG_DOMAIN,CROSS_MODES,
  recordSolution,recordFeedback,reviewCard,completeMicroReview,exportSnapshot,importSnapshot} from '../../../packages/learning-core/index.mjs';
import {openStore,read,change} from './store.mjs';
import {icon,esc,math,draftMarkup,btn,paintMath,iso,fmt,dayKey,dateFor,moveDay,duration} from './ui.mjs';
import {mapPage,libraryPage,page} from './curriculum.mjs';
import {dashboard,agendaPage,historyPage,consolidatedPage} from './overview.mjs';
import {practiceIndex,sessionPage,reviewPage,challengePage} from './practice.mjs';
import {makeLocalChallenge,localAuthoringMode,callProvider,localFeedback} from '../../../packages/curriculum-mathematics/authorship.mjs';
import {MATHEMATICS_AREA,generationMessages,registerChallenge,solutionMessages,socraticMessages} from '../../../packages/curriculum-mathematics/challenge-profile.mjs';
import * as programmingProfile from '../../../packages/curriculum-programming/profile.mjs';
import * as economicsProfile from '../../../domains/economics-finance/profile.mjs';
import * as physicsProfile from '../../../domains/physics/profile.mjs';
import * as engineeringProfile from '../../../domains/engineering/profile.mjs';
import {BRIDGE_FORMAT,MAX_SNAPSHOT_BYTES,createTellusPediaBridge} from '../../../packages/telluspedia-bridge/index.mjs';

const main=document.querySelector('#main');
const sidebar=document.querySelector('#sidebar');
const bar=document.querySelector('#bar');
const dialog=document.querySelector('#dialog');
const toast=document.querySelector('#toast');
const nav=[
  ['inicio','Visão geral','home'],['trilhas','Trilhas e mapa','graph'],['biblioteca','Biblioteca','book'],
  ['calendario','Calendário','calendar'],['pratica','Prática','practice'],['historico','Histórico','history'],['integracao','TellusPedia','external']
];

const domainOptions = [
  {id:MATH_DOMAIN, area:MATHEMATICS_AREA, label:'Matemática', file:'catalogo.json',
    profile:{makeLocalChallenge,localAuthoringMode,localFeedback,generationMessages,registerChallenge,solutionMessages,socraticMessages}},
  {id:PROG_DOMAIN, area:'programming', label:'Programação', file:'programming.json', profile:programmingProfile},
  {id:ECON_DOMAIN, area:'economics-finance', label:'Economia e Finanças', file:'economics-finance.json', profile:economicsProfile},
  {id:PHYS_DOMAIN, area:'physics', label:'Física e Óptica', file:'physics.json', profile:physicsProfile},
  {id:ENG_DOMAIN, area:'engineering', label:'Engenharia', file:'engineering.json', profile:engineeringProfile}
];
const consolidated = 'consolidado';
const domainForArea = new Map(domainOptions.map(pack=>[pack.area,pack.id]));
let db, initial, catalog, dag, bus, toastTimer, bridge, domainPacks, saved, activeDomain, profile;
let provider=null;
let workspace;
let importCandidate=null;
let busy=false;
const ctx={track:'TRL-00',selected:'1.1',targetRef:null,targetKind:'topic',bookCategory:'',bookSearch:'',
  calendarDay:dayKey(), calendarMode:'week',reviewEarly:false,reviewId:null,reveal:null,attemptPick:null};
const route=()=>{
  const parts=location.hash.slice(1).split('?')[0].split('/').filter(Boolean);
  if(parts[0]===consolidated) return {domainId:consolidated,parts:[]};
  if(domainForArea.has(parts[0])) return {domainId:domainForArea.get(parts[0]),parts:parts.slice(1)};
  const query=integrationQuery();
  const domainId=domainForArea.get(query.get('domain')??query.get('area'))??MATH_DOMAIN;
  if(location.pathname==='/lab'&&!parts.length&&query.has('topic')) {
    try {
      return {domainId,parts:['trilhas',bridge.parseLaunch(query).topicId]};
    } catch {
      return {domainId,parts:['integracao']};
    }
  }
  return {domainId,parts};
};
const integrationQuery=()=>new URLSearchParams(location.hash.slice(1).split('?')[1]??location.search);
const scoped=(data,id,now=iso())=>domainPacks.scope(id,Object.fromEntries(Object.entries(data.domains)
  .map(([domainId,value])=>[domainId,value.state])),data.prerequisiteMode,now);
const domainPath=(id,path)=>domainPacks.domains.get(id).area+'/'+path;
const topicHref=(domainId,id)=>'#'+domainPath(domainId,'trilhas/'+encodeURIComponent(id));
const fresh=()=>refreshLearning(dag,workspace.state,iso());
const go=value=>{
  value=activeDomain===consolidated?consolidated:domainPath(activeDomain,value);
  if(location.hash.slice(1)===value) render();
  else location.hash=value;
};
const uid=()=>crypto.randomUUID();
const status=(message,error=false)=>{
  const inside=dialog.querySelector('.dialog-feedback');
  if(dialog.open&&error&&inside){inside.textContent=message;inside.hidden=false;return;}
  clearTimeout(toastTimer);
  toast.textContent=message;
  toast.hidden=false;
  toast.classList.toggle('error',error);
  toastTimer=setTimeout(()=>{toast.hidden=true;},error?6500:3000);
};

function navigation(active) {
  const activeTab=nav.find(([key])=>key===active)??nav[0];
  const combined=activeDomain===consolidated;
  const label=combined?'Visão Consolidada TellusLab':domainPacks.domains.get(activeDomain).label;
  sidebar.innerHTML='<a class="brand" href="#'+(combined?consolidated:domainPath(activeDomain,'inicio'))+'"><span class="mark" aria-hidden="true">∑</span><span><strong>TellusLab</strong><small>'+label+'</small></span></a>'+
    '<label class="domain-switch field"><span>Domínio</span><select class="control" id="domain-switch" aria-label="Domínio">'+
    domainOptions.map(pack=>option(pack.id,pack.label,activeDomain)).join('')+option(consolidated,'Visão Consolidada TellusLab',activeDomain)+'</select></label>'+
    '<nav class="nav">'+(combined?[]:nav).map(([key,label,glyph])=>
    '<a href="#'+domainPath(activeDomain,key)+'" title="'+label+'" aria-label="'+label+'" '+(key===activeTab[0]?'aria-current="page"':'')+'>'+icon(glyph)+'<span class="nav-txt">'+label+'</span></a>').join('')+
    '</nav><div class="sidebar-footer"><div class="nav"><button type="button" data-act="settings" title="Dados e configurações" aria-label="Dados e configurações">'+icon('settings')+'<span class="nav-txt">Dados e configurações</span></button></div>'+
    '<div class="profile"><div class="avatar" aria-hidden="true">AL</div><div><strong>Ayrton</strong><small>Progresso neste dispositivo</small></div></div></div>';
  bar.innerHTML='<div class="row">'+btn('menu','Menu','menu','icon-btn menu-btn')+'<span class="crumb">'+(combined?label:activeTab[1])+'</span></div>'+
    '<div class="top-actions"><span class="date-chip">'+icon('calendar','sm')+' '+fmt(new Date(),{weekday:'short',day:'numeric',month:'short'})+'</span>'+
    btn('settings','Snapshot','download')+'</div>';
}

function render() {
  if(!saved) return;
  const {domainId,parts:[section='inicio',id,subid]}=route();
  if(domainId===consolidated) {
    activeDomain=consolidated;
    workspace=null;
    main.innerHTML=consolidatedPage(domainPacks,saved,topicHref,iso());
    navigation(section);
    return;
  }
  const pack=domainPacks.domains.get(domainId);
  if(activeDomain!==domainId) Object.assign(ctx,{track:pack.catalog.tracks[0].id,selected:pack.catalog.topics[0].id,
    targetRef:null,targetKind:'topic',bookCategory:'',bookSearch:'',reviewEarly:false,reviewId:null,reveal:null,attemptPick:null});
  activeDomain=domainId;
  ({catalog,profile}=pack);
  workspace=saved.domains[domainId];
  dag=scoped(saved,domainId);
  const preserved=main.querySelector('.graph-scroll');
  const offset=preserved?[preserved.scrollLeft,preserved.scrollTop]:null;
  ctx.workspace=workspace;
  ctx.state=fresh();
  ctx.now=iso();
  ctx.catalog=catalog;
  ctx.dag=dag;
  ctx.topicHref=topicHref;
  ctx.domainId=domainId;
  ctx.incomingMicro=incomingMicro(saved,domainId);
  ctx.target=ctx.targetRef?pendingPath(catalog,dag,ctx.state.progress,ctx.targetRef):null;
  if(section==='trilhas'&&dag.byId.has(id)&&ctx.selected!==id) {
    ctx.selected=id;
    ctx.track=dag.byId.get(id).trackId;
  }
  switch(section) {
    case 'trilhas': main.innerHTML=mapPage(ctx); break;
    case 'biblioteca':main.innerHTML=libraryPage(ctx,id);break;
    case 'calendario':main.innerHTML=agendaPage(ctx);break;
    case 'historico':main.innerHTML=historyPage(ctx);break;
    case 'integracao':main.innerHTML=integrationPage();break;
    case 'pratica': {
      const session=id==='session'&&workspace.state.sessions[subid];
      const challenge=workspace.state.challenges[id];
      main.innerHTML=id==='revisoes'?reviewPage(ctx,subid):session?sessionPage(ctx,session):
        challenge?challengePage(ctx,challenge):practiceIndex(ctx);
      break;
    }
    default: main.innerHTML=dashboard(ctx);
  }
  for(const link of main.querySelectorAll('a[href^="#"]')) {
    const path=link.getAttribute('href').slice(1);
    if(nav.some(([key])=>path.split('/')[0]===key)) link.setAttribute('href','#'+domainPath(activeDomain,path));
  }
  navigation(section);
  if(offset) {
    const el=main.querySelector('.graph-scroll');
    if(el) [el.scrollLeft,el.scrollTop]=offset;
  }
  paintMath(main);
  clocks();
}

function incomingMicro(data,domainId) {
  return Object.entries(data.domains).filter(([id])=>id!==domainId).flatMap(([sourceDomain,value])=>
    Object.values(value.state.agenda).flatMap(item=>{
      const ref=domainPacks.references.get(item.topicId);
      return ref?.domainId===domainId?[{...item,topicId:ref.topicId,sourceDomain}]:[];
    }));
}

function displaySaved(data,{display=true,notify=true}={}) {
  saved=data;
  if(notify) bus?.postMessage('changed');
  if(display) render();
  else if(activeDomain!==consolidated) {
    workspace=saved.domains[activeDomain];
    dag=scoped(saved,activeDomain);
  }
}

async function commit(reducer,{display=true,notify=true,domainId=activeDomain}={}) {
  const data=await change(db,initial,old=>({...old,domains:{...old.domains,
    [domainId]:reducer(old.domains[domainId],scoped(old,domainId))}}));
  displaySaved(data,{display,notify});
  return workspace;
}
const stateChange=(mutator,opts)=>commit((old,scope)=>({...old,state:mutator(old.state,scope)}),opts);

function showDialog(title,html) {
  dialog.innerHTML='<div class="dialog-content"><div class="row between"><h2 id="dialog-title">'+esc(title)+'</h2>'+
    btn('close','Fechar','close','icon-btn clear')+'</div><div class="area">'+html+'</div><p class="notice warning dialog-feedback area" role="alert" hidden></p></div>';
  dialog.setAttribute('aria-labelledby','dialog-title');
  if(!dialog.open) dialog.showModal();
  paintMath(dialog);
}

const option=(id,text,selected='')=>'<option value="'+esc(id)+'" '+(id===selected?'selected':'')+'>'+esc(text)+'</option>';

function openPlan(data) {
  const sessionId=data.session??null;
  const block=data.block??'standalone';
  const mode=data.mode??(sessionId?'block':'standalone');
  const state=fresh();
  const slot=sessionId?state.sessions[sessionId]?.blocks.find(b=>b.kind===block):null;
  const topics=slot?slot.topicIds:dag.order.filter(t=>{
    const guard=advancementGuard(dag,state.progress,t);
    return guard.allowed||(mode==='standalone'&&!guard.crossBlocked&&['S4','S5'].includes(state.progress[t].state));
  });
  const preferred=data.topic??ctx.target?.order.find(t=>topics.includes(t))??topics[0];
  const selection=topics.includes(preferred)?preferred:topics[0];
  const modalities=[...new Set((slot?topics:[selection]).filter(Boolean).flatMap(t=>dag.byId.get(t).modalities))];
  if(mode==='block'&&!topics.length) throw new Error('Este bloco ainda não tem macrotemas.');
  if(mode==='standalone'&&!topics.length) throw new Error('Nenhum macrotema está pronto para prática. Confira as revisões pendentes.');
  const button=mode==='session'?'Criar sessão':'Gerar desafio';
  const day=data.day??dayKey();
  const at=fmt(new Date(),{hour:'2-digit',minute:'2-digit',hourCycle:'h23'});
  showDialog(mode==='session'?'Nova sessão de prática':'Criar desafio',
    '<form id="plan-form" class="stack" data-mode="'+mode+'" '+(sessionId?'data-session="'+esc(sessionId)+'" data-block="'+esc(block)+'"':'')+'>'+
    (!slot?'<div class="grid-two"><label class="field"><span>Data da prática</span><input class="control" type="date" name="day" required value="'+day+'"></label>'+
       '<label class="field"><span>Hora de Brasília</span><input class="control" type="time" name="time" required value="'+at+'"></label></div>':'')+
    (!slot?'<label class="field"><span>Duração em minutos</span><input class="control" type="number" name="minutes" min="45" max="75" value="60" required></label>':'<p class="small">Duração do bloco · '+duration(slot.seconds)+'</p>')+
    (slot?'<div class="notice">'+topics.map(t=>t+' · '+esc(dag.byId.get(t).title)).join('<br>')+'</div>':
      '<label class="field"><span>'+(mode==='session'?'Macrotema para o bloco de avanço':'Macrotema do desafio')+'</span><select class="control" id="new-topic" name="topic">'+
      (mode==='session'?option('','Escolher automaticamente',selection??''):'')+
      topics.map(t=>option(t,t+' · '+dag.byId.get(t).title,selection)).join('')+'</select></label>')+
    (mode==='session'?'<p class="notice">50% avanço · 30% revisão vencida · 20% problemas mistos</p>':
      '<label class="field"><span>Modalidade</span><select class="control" id="new-modality" name="modality" required>'+modalities.map(m=>option(m,m)).join('')+'</select></label>'+
      (provider?'<label class="checkbox"><input type="checkbox" name="provider" checked> Gerar com o provedor configurado</label>':
        '<p class="small">Autoria local. Nos temas sem exercício resolvido, o desafio usa o Capstone e um roteiro de correção.</p>'))+
    '<button type="submit" class="btn primary">'+icon(mode==='session'?'plus':'practice','sm')+esc(button)+'</button>'+
    '<p class="small" id="modal-status" role="status"></p></form>');
}

function openStudy({topic,kind,entity}) {
  const item=dag.byId.get(topic);
  const crit=item.criteria.find(c=>c.id===entity);
  const sub=item.subtopics.find(s=>s.id===entity);
  const titles={completeSubtopic:'Registrar subtema',completeTheory:'Registrar fichamento',
    passPractice:'Registrar exercícios',validateCriterion:'Validar critério',validateProof:'Validar proficiência'};
  const pre=ctx.state.progress[topic];
  const template={
    completeSubtopic:'<p>'+math(sub?.description)+'</p><label class="field"><span>Evidência de conclusão</span><textarea class="control" name="evidence" required></textarea></label>',
    completeTheory:'<label class="field"><span>Fichamento da leitura ativa</span><textarea class="control" name="notes" required></textarea></label>',
    passPractice:'<div class="grid-two"><label class="field"><span>Acertos</span><input class="control" name="correct" type="number" min="0" required></label><label class="field"><span>Total resolvido</span><input class="control" name="total" type="number" min="1" required></label></div><label class="field"><span>Evidência dos exercícios</span><textarea class="control" name="evidence" required></textarea></label>',
    validateCriterion:crit?math(crit.description)+
      (crit.kind==='mandatory'?'<label class="checkbox"><input type="checkbox" name="without" required> Validei os conceitos obrigatórios sem consulta.</label>':'')+
      '<label class="checkbox"><input type="checkbox" name="approved" required> Conferi e aprovei a evidência deste critério.</label>'+
      '<label class="field"><span>Evidência da demonstração ou Capstone</span><textarea class="control" name="evidence" required></textarea></label>':'',
    validateProof:'<p>Subtemas registrados · '+Object.keys(pre.subtopics).length+' de '+item.subtopics.length+
      '<br>Critérios validados · '+Object.keys(pre.criteria).length+' de '+item.criteria.length+'</p><p class="small">A validação gera cartões e libera os nós dependentes elegíveis.</p>'
  };
  showDialog(titles[kind],'<form class="stack" id="study-form" data-topic="'+topic+'" data-kind="'+kind+'" data-entity="'+esc(entity??'')+'">'+
    template[kind]+'<button class="btn primary" type="submit">'+icon('check','sm')+' Salvar evidência</button></form>');
}

function settings() {
  const exports=activeDomain===consolidated?domainOptions:[domainPacks.domains.get(activeDomain)];
  showDialog('Dados e configurações',
    '<div class="stack"><section><h3>Snapshot do progresso</h3><p class="small">O arquivo contém seu histórico, cartões, evidências, cronômetros e rascunhos.</p>'+
    '<div class="row wrap">'+exports.map(pack=>btn('export','Exportar JSON · '+pack.label,'download','primary','data-domain="'+pack.id+'"')).join('')+
    btn('import','Importar JSON','upload')+
    '<input type="file" accept=".json,application/json" id="snapshot-file" hidden></div></section><hr>'+
    '<section><h3>Pré-requisitos interdisciplinares</h3><form class="stack" id="prerequisite-form">'+
    '<label class="field"><span>Regra entre domínios</span><select class="control" name="mode">'+
    option('flexible','Modo Flexível (Soft Warning)',saved.prerequisiteMode)+
    option('strict','Modo Estrito (Hard Gate)',saved.prerequisiteMode)+'</select></label>'+
    '<p class="small">O modo flexível sinaliza lacunas. O modo estrito bloqueia o avanço até validar os pré-requisitos cruzados e colocar suas revisões em dia.</p>'+
    '<button class="btn" type="submit">Salvar modo</button></form></section><hr>'+
    '<section><h3>Autoria e revisão com IA</h3><p class="small">Opcional. Use um endpoint compatível com Chat Completions e habilitado para CORS. Ao usar IA, o endpoint recebe o conteúdo necessário à ação, incluindo seu rascunho na revisão. O token fica somente nesta aba.</p>'+
    '<form class="stack" id="provider-form"><label class="field"><span>Endpoint</span><input class="control" type="url" name="endpoint" required value="'+esc(provider?.endpoint)+'" placeholder="https://seu-provedor/v1/chat/completions"></label>'+
    '<label class="field"><span>Modelo</span><input class="control" name="model" required value="'+esc(provider?.model)+'"></label>'+
    '<label class="field"><span>Token, se necessário</span><input class="control" type="password" name="token" autocomplete="off" placeholder="'+(provider?.token?'Token configurado nesta aba':'Token do provedor')+'"></label>'+
    '<div class="row wrap"><button class="btn" type="submit">Ativar nesta aba</button>'+
    (provider?btn('disable-provider','Desativar','','clear'):'')+'</div></form></section></div>');
}

function clocks() {
  const now=Date.now();
  document.querySelectorAll('[data-clock]').forEach(el=>{
    const timer=workspace?.state.timers[el.dataset.clock];
    const ms=timer?timer.elapsedMs+Math.max(0,timer.runningSince?now-Date.parse(timer.runningSince):0):0;
    const seconds=Math.floor(ms/1000);
    el.textContent=[Math.floor(seconds/3600),Math.floor(seconds/60)%60,seconds%60].map(n=>String(n).padStart(2,'0')).join(':');
  });
}

function pickTarget(kind,id) {
  ctx.targetRef={kind,id};
  ctx.targetKind=kind;
  if(kind==='topic') {
    ctx.selected=id;
    ctx.track=dag.byId.get(id).trackId;
  }
  go('trilhas'+(kind==='topic'?'/'+id:''));
}

function measureDraft(form) {
  const fd=new FormData(form);
  return {text:String(fd.get('draft')??''),format:fd.get('format')??'latex',difficulty:fd.get('difficulty')??''};
}


function persistDraft(form) {

  const id=form.dataset.id;
  const draft=measureDraft(form);
  const preview=form.querySelector('#preview-content');
  if(preview) {
    preview.innerHTML=draftMarkup(draft.text,draft.format);
    paintMath(preview);
  }
  commit(old=>({...old,drafts:{...old.drafts,[id]:draft}}),{display:false,notify:false}).catch(e=>status(e.message,true));
}

async function generate(form) {
  const domainId=activeDomain;
  const author=profile;
  const d=form.dataset;
  const f=new FormData(form);
  const recordId=uid();
  const now=iso();
  const selected=f.get('topic')||undefined;
  const sessionId=d.session??null;
  const session=workspace.state.sessions[sessionId];
  const scheduledAt=session?.scheduledAt??dateFor(f.get('day'),f.get('time')).toISOString();
  const minutes=Number(f.get('minutes'));
  if(d.mode==='session') {
    const targetOrder=ctx.target?.order??[];
    await commit((old,scope)=>{
      const result=planSession(scope,old.state,{id:recordId,now,scheduledAt,minutes,preferredTopicId:selected,
        targetOrder});
      return {...old,state:result.state};
    },{domainId});
    dialog.close();
    location.hash=domainPath(domainId,'pratica/session/'+recordId);
    status('Sessão agendada.');
    return;
  }
  const topicIds=session?session.blocks.find(b=>b.kind===d.block).topicIds:[selected];
  const options={id:recordId,sessionId,block:d.block??'standalone',now,scheduledAt,minutes,topicIds,modality:f.get('modality')};
  const brief=challengeBrief(dag,workspace.state,options);
  const useProvider=f.has('provider')&&provider;
  const mode=useProvider?'provider':author.localAuthoringMode(brief);
  const line=form.querySelector('#modal-status');
  line.textContent=useProvider?'Consultando o provedor…':'Preparando o desafio…';
  const content=useProvider?await callProvider(provider,author.generationMessages(dag,workspace.state,options)):author.makeLocalChallenge(brief);
  await commit((old,scope)=>{
    const result=author.registerChallenge(scope,old.state,{...options,now:iso()},content);
    return {...old,state:result.state,authored:{...old.authored,[recordId]:{mode}}};
  },{domainId});
  dialog.close();
  location.hash=domainPath(domainId,'pratica/'+recordId);
  status('Desafio pronto.');
}

function localBrief(challenge) {
  return {id:challenge.id,block:challenge.block,topicIds:challenge.topicIds,modality:challenge.modality,
    curriculum:challenge.topicIds.map(id=>dag.byId.get(id))};
}

async function protectedMaterial(kind,id,attemptId) {
  const domainId=activeDomain;
  const author=profile;
  const base=workspace.state;
  const challenge=base.challenges[id];
  const msg=kind==='solution'?author.solutionMessages(base,id,attemptId):author.socraticMessages(base,id,attemptId);
  const mode=workspace.authored[id]?.mode;
  if(kind==='solution') {
    let response;
    if(mode==='provider') {
      if(!provider) throw new Error('Ative o provedor nas configurações para resolver este desafio.');
      response=await callProvider(provider,msg);
    } else {
      const brief=localBrief(challenge);
      const explain=author.explainLocally??(await import('../../../packages/curriculum-mathematics/solutions.mjs')).explainLocally;
      response=explain(brief,challenge);
    }
    await stateChange(s=>recordSolution(s,id,attemptId,response),{domainId});
    status('Material comentado disponível.');
  } else {
    const response=provider?await callProvider(provider,msg):author.localFeedback(base.attempts[attemptId],challenge);
    await stateChange(s=>recordFeedback(s,id,attemptId,response,iso()),{domainId});
    status(provider?'Revisão socrática disponível.':'Perguntas de autoavaliação disponíveis.');
  }
}

function integrationPage() {
  let context;
  let message;
  try {
    const query=integrationQuery();
    if (!location.hash.includes('?') && domainForArea.has(location.hash.slice(1).split('/')[0])) {
      query.delete('domain');
      query.delete('topic');
      query.delete('area');
    }
    if (!query.has('area')&&!query.has('domain')) query.set('area',domainPacks.domains.get(activeDomain).area);
    context=bridge.parseLaunch(query);
  } catch (error) { message=error.message; }
  const pack=context&&domainPacks.domains.get(domainForArea.get(context.areaId));
  return page('TellusPedia','Abra o tópico de referência ou troque um snapshot JSON.')+
    '<section class="card pad stack">'+(pack ? '<h2>'+pack.label+'</h2>'+
      (context.topicId ? '<a class="btn" href="'+esc(topicHref(pack.id,context.topicId))+'">Abrir '+esc(pack.dag.byId.get(context.topicId).title)+'</a>' : '')+
      '<p class="small">O arquivo inclui seu progresso e pode incluir rascunhos e soluções. Compartilhe apenas quando desejar.</p>'+
      '<div class="row wrap">'+btn('export','Exportar para TellusPedia','download','primary','data-envelope="true" data-domain="'+pack.id+'"')+
      btn('import','Importar JSON','upload')+'</div>' : '<p class="notice warning">'+esc(message)+'</p>')+'</section>';
}

async function downloadSnapshot({envelope,domain=activeDomain}={}) {
  const data=await read(db)??saved;
  const pack=domainPacks.domains.get(domain);
  const old=data.domains[domain];
  const now=iso();
  const scope=scoped(data,domain,now);
  const x=JSON.parse(exportSnapshot(refreshLearning(scope,old.state,now),pack.catalog,now,scope));
  x.workspace={drafts:old.drafts,authored:old.authored};
  const payload=envelope?bridge.wrapSnapshot(pack.area,x):x;
  const path=URL.createObjectURL(new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}));
  const a=document.createElement('a');
  a.href=path;
  a.download=(envelope?'telluslab-snapshot-':'')+pack.area+'-'+dayKey()+'.json';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(path),10_000);
  status('Snapshot exportado.');
}

function workspaceFromSnapshot(contents) {
  const payload=JSON.parse(contents);
  const snapshot=payload?.format===BRIDGE_FORMAT?bridge.unwrapSnapshot(payload).snapshot:payload;
  const pack=[...domainPacks.domains.values()].find(({catalog})=>catalog.catalogId===snapshot?.catalogId);
  if(!pack) throw new Error('O catálogo do snapshot não corresponde a um domínio instalado.');
  const state=importSnapshot(JSON.stringify(snapshot),pack.catalog,scoped(saved,pack.id));
  const extra=snapshot.workspace;
  const drafts={}, authored={};
  for(const id of Object.keys(state.challenges)) {
    const d=extra?.drafts?.[id];
    if(d&&typeof d.text==='string'&&['latex','code'].includes(d.format)&&typeof d.difficulty==='string') drafts[id]=d;
    const a=extra?.authored?.[id];
    if(['guided','worked','provider'].includes(a?.mode)) authored[id]={mode:a.mode};
  }
  return {pack,workspace:{state,drafts,authored}};
}

const actions={
  menu:()=>sidebar.classList.toggle('open'),
  settings,close:()=>dialog.close(),
  track:({id})=>{ctx.track=id;ctx.targetRef=null;render();},
  node:({id})=>{
    const ref=dag.cross?.reference(id);
    if(ref) {location.hash=topicHref(ref.domainId,ref.topicId);return;}
    ctx.selected=id;ctx.track=dag.byId.get(id).trackId;
    go('trilhas/'+id);requestAnimationFrame(()=>document.querySelector('#topic-detail')?.scrollIntoView({block:'start'}));},
  'set-target':({kind,id})=>pickTarget(kind,id),
  'clear-target':()=>{ctx.targetRef=null;render();},
  'calendar-day':({day,nav})=>{ctx.calendarDay=day;if(nav) go('calendario');else render();},
  'calendar-mode':({id})=>{ctx.calendarMode=id;render();},
  'calendar-today':()=>{ctx.calendarDay=dayKey();render();},
  'calendar-shift':({delta})=>{
    const d=dateFor(ctx.calendarDay);
    ctx.calendarDay=ctx.calendarMode==='week'?moveDay(ctx.calendarDay,7*Number(delta)):
      dayKey(new Date(Date.UTC(d.getUTCFullYear(),d.getUTCMonth()+Number(delta),1,15)));
    render();
  },
  new:openPlan,study:openStudy,
  timer:async ({id,kind})=>{
    await stateChange((state,scope)=>{
      if(kind!=='pause'&&state.challenges[id]?.topicIds.some(t=>advancementGuard(scope,state.progress,t).crossBlocked)) {
        throw new Error('Revise os pré-requisitos cruzados antes de praticar.');
      }
      return updateTimer(state,id,kind,iso());
    });
    clocks();
  },
  reveal:({id})=>{ctx.reveal=id;ctx.reviewId=id;render();},
  'skip-card':({id})=>{ctx.reveal=null;ctx.reviewId=id;render();},
  'review-early':()=>{ctx.reviewEarly=!ctx.reviewEarly;ctx.reveal=null;render();},
  rate:async ({id,grade})=>{
    if(ctx.reveal!==id) throw new Error('Mostre o verso antes de avaliar.');
    ctx.reveal=null;ctx.reviewId=null;
    await stateChange((s,scope)=>reviewCard(scope,s,id,Number(grade),iso()));
    status('Revisão registrada.');
  },
  'complete-micro':async ({id,sourceDomain=activeDomain})=>{
    await stateChange(s=>completeMicroReview(s,id,iso()),{domainId:sourceDomain});
    status('Micro-revisão concluída.');
  },
  solution:({id,attempt})=>protectedMaterial('solution',id,attempt),
  feedback:({id,attempt})=>protectedMaterial('feedback',id,attempt),
  export:downloadSnapshot,
  import:()=>{
    if(!dialog.open) settings();
    dialog.querySelector('#snapshot-file').click();
  },
  'apply-import':async ()=>{
    if(!importCandidate) throw new Error('Selecione um snapshot.');
  
    const {pack,workspace:restored}=importCandidate;
    await commit(()=>restored,{domainId:pack.id});
    importCandidate=null;
    dialog.close();location.hash=domainPath(pack.id,'inicio');status('Snapshot restaurado.');
  },
  'disable-provider':()=>{provider=null;settings();status('Provedor desativado.');}
};

document.addEventListener('click',async e=>{
  if(e.target.closest('.skip')){e.preventDefault();main.focus();return;}
  const clicked=e.target.closest('[data-act]');
  if(!clicked||!saved||busy) return;
  const fn=actions[clicked.dataset.act];
  if(!fn) return;
  try {
    busy=true;
    clicked.disabled=true;
    await fn(clicked.dataset);
  } catch(error){status(error?.message??String(error),true);}
  finally {busy=false;clicked.disabled=false;}
});

document.addEventListener('submit',async e=>{
  const form=e.target;
  const type=form.id;
  if(!type) return;
  e.preventDefault();
  if(busy) return;
  const button=e.submitter;
  try {
    busy=true;
    if(button) button.disabled=true;
    const f=new FormData(form);
    if(type==='plan-form') await generate(form);
    if(type==='target-form') pickTarget(f.get('kind'),f.get('id'));
    if(type==='book-filters') {ctx.bookSearch=String(f.get('query')).trim();ctx.bookCategory=f.get('category');render();}
    if(type==='study-form') {
      const d=form.dataset;
      const action={kind:d.kind,notes:f.get('notes'),evidence:f.get('evidence'),correct:Number(f.get('correct')),
        total:Number(f.get('total')),approved:f.has('approved'),withoutConsultation:f.has('without'),
        criterionId:d.entity,subtopicId:d.entity};
      if(d.kind==='completeSubtopic') delete action.criterionId;
      else delete action.subtopicId;
      await stateChange((s,scope)=>applyStudyEvent(scope,s,d.topic,action,iso()));
      dialog.close();
      status('Progresso registrado.');
    }
    if(type==='attempt-form') {
    
      const d=form.dataset;
      const info=measureDraft(form);
      const id=uid();
      ctx.attemptPick=id;
      try {
        await commit((old,scope)=>{
          const {state}=submitAttempt(scope,old.state,{id,challengeId:d.id,draft:info.text,draftFormat:info.format,
            difficulty:info.difficulty,now:iso()});
          const drafts={...old.drafts};
          delete drafts[d.id];
          return {...old,state,drafts};
        });
      } catch(error){persistDraft(form);throw error;}
      status('Tentativa registrada. A solução e o revisor estão disponíveis.');
    }
    if(type==='prerequisite-form') {
      const prerequisiteMode=f.get('mode');
      if(!CROSS_MODES.includes(prerequisiteMode)) throw new Error('Modo inválido.');
      displaySaved(await change(db,initial,old=>({...old,prerequisiteMode})));
      settings();
      status('Modo interdisciplinar salvo.');
    }
    if(type==='provider-form') {
      const url=new URL(f.get('endpoint'));
      if(!['https:','http:'].includes(url.protocol)||url.username||url.password||
        (url.protocol==='http:'&&!['localhost','127.0.0.1','[::1]'].includes(url.hostname))) throw new Error('Use HTTPS ou um endpoint HTTP em loopback.');
      const model=String(f.get('model')).trim();
      if(!model) throw new Error('Informe o modelo do provedor.');
      provider={endpoint:url.href,model,token:String(f.get('token'))||(provider?.endpoint===url.href?provider.token:'')};
      settings();
      status('Provedor ativo nesta aba.');
    }
  } catch(error){
    const note=form.querySelector('#modal-status');
    if(note) note.textContent=error.message;
    status(error?.message??String(error),true);
  } finally{busy=false;if(button) button.disabled=false;}
});

document.addEventListener('input',e=>{
  const form=e.target.closest('#attempt-form');
  if(form) persistDraft(form);
});

document.addEventListener('change',async e=>{
  const el=e.target;
  if(el.id==='domain-switch') {
    location.hash=el.value===consolidated?consolidated:domainPath(el.value,'inicio');
  }
  if(el.id==='target-kind') {
    ctx.targetKind=el.value;
    const select=main.querySelector('#target-id');
    const items=el.value==='topic'?catalog.topics:catalog.books;
    select.innerHTML=items.map(x=>option(x.id,x.id+' · '+x.title)).join('');
  }
  if(el.id==='new-topic') {
    const modes=dag.byId.get(el.value)?.modalities??[];
    const select=dialog.querySelector('#new-modality');
    if(select) select.innerHTML=modes.map(m=>option(m,m)).join('');
  }
  if(el.id==='attempt-pick'){ctx.attemptPick=el.value;render();}
  if(el.id==='snapshot-file'&&el.files?.[0]) {
    try {
      if(el.files[0].size>MAX_SNAPSHOT_BYTES) throw new Error('O snapshot excede 10 MiB.');
      importCandidate=workspaceFromSnapshot(await el.files[0].text());
      const {pack,workspace:restored}=importCandidate;
      showDialog('Restaurar snapshot','<div class="stack"><p>O snapshot contém '+Object.keys(restored.state.attempts).length+
        ' tentativa(s). A restauração substitui o progresso de '+pack.label+' neste navegador.</p><div class="row wrap">'+
        btn('apply-import','Restaurar snapshot','upload','primary')+btn('close','Cancelar')+'</div></div>');
    }catch(error){status(error.message,true);}
  }
});

window.addEventListener('hashchange',()=>{
  ctx.attemptPick=null;
  ctx.reveal=null;
  sidebar.classList.remove('open');
  window.scrollTo(0,0);
  render();
});
window.addEventListener('load',()=>paintMath());
dialog.addEventListener('close',()=>{importCandidate=null;});

try {
  const loaded=await Promise.all(domainOptions.map(async pack=>{
    const response=await fetch('./data/'+pack.file);
    if(!response.ok) throw new Error('Não foi possível carregar o catálogo de '+pack.label+'.');
    return {...pack,catalog:await response.json()};
  }));
  domainPacks=createDomainPacks(loaded);
  initial={prerequisiteMode:'flexible',domains:Object.fromEntries([...domainPacks.domains].map(([id,pack])=>
    [id,{state:createLearningState(pack.dag),drafts:{},authored:{}}]))};
  bridge=createTellusPediaBridge(createAreaRegistry(loaded.map(pack=>({id:pack.area,catalog:pack.catalog,
    dag:scoped(initial,pack.id)}))));
  db=await openStore();
  saved=await change(db,initial,old=>{
    const domains=old.domains??{[MATH_DOMAIN]:old};
    return {...initial,prerequisiteMode:old.prerequisiteMode??initial.prerequisiteMode,
      domains:{...initial.domains,...domains}};
  });
  if(typeof BroadcastChannel!=='undefined') {
    bus=new BroadcastChannel('laboratorio-matematica-changes');
    bus.onmessage=async ()=>{
      displaySaved(await read(db)??saved,
        {notify:false,display:!dialog.open&&!document.activeElement?.closest('#attempt-form')});
    };
  }
  render();
  setInterval(clocks,250);
  setInterval(()=>{
    if(!workspace) return;
    const next=fresh();
    if(next.events!==workspace.state.events) {
      const display=!dialog.open&&!document.activeElement?.closest('form');
      stateChange((s,scope)=>refreshLearning(scope,s,iso()),{display}).catch(error=>status(error.message,true));
    }
  },30_000);
  if('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(()=>{});
} catch(error) {
  main.innerHTML='<section class="card pad"><h1>Não foi possível abrir o laboratório</h1><p class="area">'+esc(error.message)+'</p><p>Recarregue a página em uma janela com IndexedDB disponível.</p></section>';
}
