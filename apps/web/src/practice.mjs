import {DIFFICULTIES,readSolution,readFeedback,advancementGuard} from '../../../packages/learning-core/index.mjs';
import {badge,btn,aBtn,esc,icon,math,draftMarkup,fmt,duration} from './ui.mjs';
import {page,titleFor,crossLink} from './curriculum.mjs';

const blocks={advance:'Avanço',review:'Revisão vencida',mixed:'Problemas mistos'};
const reasons={noEligibleTopic:'Nenhum macrotema ativo está apto ao avanço.',noDueCards:'Sem cartões vencidos neste momento.',
  onlyOneDueTrack:'Há cartões vencidos em apenas uma trilha.',fewerThanTwoEligibleTopics:'Desbloqueie mais um macrotema para gerar prática mista.'};
const grade=['Repetir','Difícil','Bom','Fácil'];
const sDate=at=>fmt(at,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'});
const modeLabel={provider:'Gerado por IA',worked:'Resolução comentada',guided:'Prática guiada'};
const draftHints={
  physics:'Use $…$ para equações e blocos cercados python, svg ou mermaid.',
  'economics-finance':'Use $…$ para fórmulas, tabelas Markdown para fluxos de caixa e blocos python ou mermaid.',
  engineering:'Use $…$ para equações, tabelas Markdown e blocos cercados python, svg ou mermaid.'
};
function group(title,items,make=x=>'<li>'+math(x)+'</li>') {
  return '<div class="area"><h3>'+title+'</h3><ol>'+items.map(make).join('')+'</ol></div>';
}

export function practiceIndex(ctx) {
  const challengeList=Object.values(ctx.state.challenges).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  const sessions=Object.values(ctx.state.sessions).sort((a,b)=>b.scheduledAt.localeCompare(a.scheduledAt));
  const sessionRows=sessions.map(s=>'<li><div class="row between wrap"><a href="#pratica/session/'+esc(s.id)+'"><strong>Sessão de '+duration(s.durationSeconds)+'</strong></a>'+badge(sDate(s.scheduledAt))+'</div><p class="small">50% avanço · 30% revisão · 20% prática mista</p></li>').join('');
  const challengeRows=challengeList.map(c=>{
    const attempted=Object.values(ctx.state.attempts).some(a=>a.challengeId===c.id);
    return '<li><div class="row between wrap"><a href="#pratica/'+esc(c.id)+'"><strong>'+esc(c.title)+'</strong></a>'+badge(attempted?'Tentativa enviada':ctx.state.timers[c.id]?'Em andamento':'A iniciar',attempted?'s4':'')+'</div><p class="small">'+duration(c.durationSeconds)+' · '+esc(c.modality)+' · '+c.topicIds.map(esc).join(', ')+'</p></li>';
  }).join('');
  return page('Prática','Planeje sessões intercaladas, resolva desafios e revise o que você demonstrou.',
    '<div class="row wrap">'+btn('new','Novo desafio','practice','','data-mode="standalone"')+btn('new','Nova sessão','plus','primary','data-mode="session"')+'</div>')+
    '<section class="card pad"><div class="row between wrap"><div><h2>Repetição espaçada</h2><p class="small">Enunciados, contraexemplos e ideias-chave de demonstração.</p></div>'+aBtn('pratica/revisoes','Abrir fila','repeat','tinted')+'</div></section>'+
    '<div class="grid-two area"><section class="card pad"><h2>Sessões</h2><ul class="compact-list">'+(sessionRows||'<li class="small">Nenhuma sessão criada.</li>')+'</ul></section>'+
    '<section class="card pad"><h2>Desafios</h2><ul class="compact-list">'+(challengeRows||'<li class="small">Nenhum desafio criado.</li>')+'</ul></section></div>';
}

export function sessionPage(ctx,session) {
  return page('Sessão de prática',duration(session.durationSeconds)+' · '+sDate(session.scheduledAt),aBtn('pratica','Todas as sessões','practice'))+
    '<section class="card pad stack">'+session.blocks.map(b=>{
      const challenges=Object.values(ctx.state.challenges);
      const existing=challenges.find(c=>c.sessionId===session.id&&c.block===b.kind);
      const reviewNames=b.kind==='review'?b.slots.map(s=>'<li>'+esc(ctx.catalog.tracks.find(t=>t.id===s.trackId).title)+' · '+duration(s.seconds)+' · '+s.cardIds.length+' cartões</li>').join(''):'';
      const open=session.open.find(o=>o.kind===b.kind);
      const title=b.kind==='review'?'':b.topicIds.map(id=>id+' · '+titleFor(ctx.dag,id)).join(' / ');
      const controls=b.kind==='review'&&b.slots.length?aBtn('pratica/revisoes/'+esc(session.id),'Revisar cartões','repeat'):
        existing?aBtn('pratica/'+esc(existing.id),'Abrir desafio','practice'):
        b.topicIds?.length?btn('new','Gerar desafio','practice','tinted','data-session="'+esc(session.id)+'" data-block="'+b.kind+'"'):'';
      return '<article class="session-block"><div class="row between wrap"><h2>'+blocks[b.kind]+'</h2>'+badge(duration(b.seconds))+'</div>'+
        (title?'<p>'+esc(title)+'</p>':'')+(reviewNames?'<ul>'+reviewNames+'</ul>':'')+
        (open?'<p class="small">'+reasons[open.reason]+'</p>':'')+controls+'</article>';
    }).join('')+'</section>';
}

export function reviewPage(ctx,sessionId) {
  const slots=ctx.state.sessions[sessionId]?.blocks.find(b=>b.kind==='review').slots;
  const scope=slots?new Set(slots.flatMap(s=>s.cardIds)):null;
  const all=Object.values(ctx.state.cards).filter(c=>!scope||scope.has(c.id));
  const cards=all.filter(c=>ctx.reviewEarly||c.dueAt<=ctx.now);
  cards.sort((a,b)=>a.dueAt.localeCompare(b.dueAt)||a.id.localeCompare(b.id));
  const current=cards.find(c=>c.id===ctx.reviewId)??cards[0];
  const micro=[...Object.values(ctx.state.agenda),...(ctx.incomingMicro??[])].filter(a=>!a.completedAt&&a.dueAt<=ctx.now)
    .sort((a,b)=>a.dueAt.localeCompare(b.dueAt)||a.id.localeCompare(b.id));
  const reveal=current&&ctx.reveal===current.id;
  const kinds={statement:'Enunciado e hipóteses',counterexample:'Contraexemplo',proofIdea:'Ideia da demonstração'};
  return page('Fila de revisão','Recupere a resposta de memória antes de olhar o verso e avaliar sua retenção.',
    aBtn(sessionId?'pratica/session/'+esc(sessionId):'pratica','Voltar à prática','practice'))+
    '<div class="grid-two"><section class="card pad"><div class="row between wrap"><h2>Cartões '+(scope?'da sessão':'de retenção')+'</h2>'+badge(cards.length+' na fila','s1')+'</div>'+
    (!scope&&all.length?'<p class="area">'+btn('review-early',ctx.reviewEarly?'Ver apenas vencidos':'Incluir cartões futuros','','clear')+'</p>':'')+
    (current?'<div class="review-q area"><div class="row wrap">'+badge(kinds[current.kind])+'<a class="small" href="#trilhas/'+current.topicId+'">'+current.topicId+' · '+esc(titleFor(ctx.dag,current.topicId))+'</a></div><div class="area">'+math(current.frontLatex)+'</div></div>'+
    (reveal?'<div class="area"><h3>Verso</h3>'+math(current.backLatex)+'<div class="row wrap area">'+grade.map((name,i)=>btn('rate',name,'',i===2?'primary':'','data-grade="'+(i+1)+'" data-id="'+esc(current.id)+'"')).join('')+'</div></div>':
      '<div class="row wrap area">'+btn('reveal','Mostrar resposta','repeat','primary','data-id="'+esc(current.id)+'"')+(cards.length>1?btn('skip-card','Pular','','','data-id="'+esc(cards[(cards.indexOf(current)+1)%cards.length].id)+'"'):'')+'</div>'):
      '<p class="empty">Nenhum cartão disponível nesta fila.</p>')+'</section>'+
    '<section class="card pad"><h2>Micro-revisões de pré-requisitos</h2>'+
    (micro.length?'<ul class="compact-list">'+micro.map(item=>{
      const cross=ctx.dag.cross?.reference(item.topicId);
      const topic=cross?crossLink(ctx,item.topicId):
        '<a href="#trilhas/'+item.topicId+'"><strong>'+item.topicId+' · '+esc(titleFor(ctx.dag,item.topicId))+'</strong></a>';
      const source=item.sourceDomain
        ? '<a href="'+esc(ctx.topicHref(item.sourceDomain,item.triggerTopicId))+'">'+esc(item.sourceDomain+' '+item.triggerTopicId)+'</a>'
        : esc(item.triggerTopicId);
      return '<li><div class="row between wrap">'+topic+btn('complete-micro','Concluir','check','clear','data-id="'+esc(item.id)+'"'+
        (item.sourceDomain?' data-source-domain="'+esc(item.sourceDomain)+'"':''))+'</div><p class="small">Dificuldade registrada em '+source+'</p></li>';
    }).join('')+'</ul>':
      '<p class="small area">Lacunas e dificuldades recorrentes geram revisões aqui.</p>')+'</section></div>';
}

export function challengePage(ctx,challenge) {
  const id=challenge.id;
  const records=Object.values(ctx.state.attempts).filter(a=>a.challengeId===id).sort((a,b)=>b.submittedAt.localeCompare(a.submittedAt));
  const current=records.find(a=>a.id===ctx.attemptPick)??records[0];
  const draft=ctx.workspace.drafts[id]??{};
  const timer=ctx.state.timers[id];
  const metadata=ctx.workspace.authored[id]??{};
  const sol=current?readSolution(ctx.state,id,current.id):null;
  const feed=current?readFeedback(ctx.state,id,current.id):null;
  const clockButton=timer?.runningSince?['pause','Pausar','pause']:timer?['resume','Retomar','play']:['start','Iniciar','play'];
  const row=cls=>'<span class="clock '+cls+'" data-clock="'+esc(id)+'">00:00:00</span>';
  const focus=challenge.block==='mixed'?'Problema misto':challenge.modality;
  const technical=Boolean(ctx.catalog?.difficulties);
  const difficulties=Object.entries(ctx.catalog?.difficulties??Object.fromEntries(DIFFICULTIES.map(label=>[label,label])));
  const guards=challenge.topicIds.map(topicId=>advancementGuard(ctx.dag,ctx.state.progress,topicId));
  const blocked=guards.some(guard=>guard.crossBlocked);
  const pending=[...new Set(guards.flatMap(guard=>guard.crossPending??[]))];
  return page(challenge.title,focus+' · '+duration(challenge.durationSeconds),
    aBtn(challenge.sessionId?'pratica/session/'+esc(challenge.sessionId):'pratica','Voltar à prática','practice'))+
    '<div class="workspace"><div class="stack"><section class="card pad"><div class="row wrap">'+challenge.topicIds.map(x=>'<a class="tag" href="#trilhas/'+x+'">'+x+'</a>').join('')+
    (metadata.mode?badge(modeLabel[metadata.mode]):'')+'</div><div class="area"><h2>Enunciado</h2><div class="area">'+math(challenge.statement)+'</div></div>'+
    group('Requisitos',challenge.requirements)+group('Hipóteses permitidas',challenge.hypotheses.length?challenge.hypotheses:['Use as hipóteses declaradas no enunciado.'])+
    (challenge.assumedTopicIds.length?'<div class="area"><h3>Resultados prévios autorizados</h3><div class="row wrap">'+challenge.assumedTopicIds.map(id=>'<a class="tag" href="#trilhas/'+id+'">'+id+' · '+esc(titleFor(ctx.dag,id))+'</a>').join('')+'</div></div>':'')+
    group('Exemplos de ancoragem',challenge.examples,ex=>'<li>'+math(ex.input)+math(ex.expected)+'</li>')+
    group('Testes de sanidade e rigor',challenge.tests,t=>'<li>'+math(t.scenario)+math(t.expected)+'</li>')+'</section></div>'+
    '<div class="stack"><section class="card pad"><div class="row between wrap"><h2>Workspace</h2>'+row('')+'</div>'+
    (pending.length?'<p class="notice warning area">'+
      (blocked?'Modo Estrito. Resolva os pré-requisitos cruzados para praticar.':'Modo Flexível. Revise estes pré-requisitos enquanto pratica.')+
      ' '+pending.map(ref=>crossLink(ctx,ref)).join(', ')+'</p>':'')+
    '<div class="row wrap area">'+btn('timer',clockButton[1],clockButton[2],'tinted','data-kind="'+clockButton[0]+'" data-id="'+esc(id)+'"'+
      (blocked&&clockButton[0]!=='pause'?' disabled':''))+
      '<span class="small">O tempo exclui as pausas.</span></div>'+
    '<form id="attempt-form" class="stack area" data-id="'+esc(id)+'"><label class="field"><span>Formato do rascunho</span><select class="control" name="format">'+
    ['latex','code'].map(fmt=>'<option value="'+fmt+'" '+((draft.format??'latex')===fmt?'selected':'')+'>'+(fmt==='latex'?(technical?'Texto técnico (Markdown e LaTeX)':'LaTeX'):'Código')+'</option>').join('')+
    '</select></label><label class="field"><span>Rascunho</span><textarea class="control editor" name="draft" required spellcheck="false" placeholder="'+
    (draftHints[ctx.catalog?.slug]??(technical?'Use blocos cercados com o nome da linguagem ou mermaid.':
      'Escreva sua solução. Use $…$ para fórmulas no texto.'))+'">'+esc(draft.text)+'</textarea></label>'+
    '<details class="folder" id="draft-preview"><summary>Pré-visualização</summary><div id="preview-content">'+draftMarkup(draft.text??'',draft.format)+'</div></details>'+
    '<label class="field"><span>Dificuldade encontrada</span><select class="control" name="difficulty" required><option value="">Selecione uma dificuldade</option>'+
    difficulties.map(([id,label])=>'<option value="'+esc(id)+'" '+(draft.difficulty===id?'selected':'')+'>'+esc(technical?id+' · '+label:label)+'</option>').join('')+'</select></label>'+
    '<button class="btn primary" type="submit" '+(blocked?'disabled':'')+'>'+icon('check','sm')+' Enviar tentativa</button></form></section>'+
    '<section class="card pad"><div class="row between wrap"><h2>Solução e revisor</h2>'+badge(current?'Acesso liberado':'Bloqueados',current?'s4':'')+'</div>'+
    (current?'<label class="field area"><span>Tentativa consultada</span><select class="control" id="attempt-pick">'+records.map(a=>'<option value="'+esc(a.id)+'" '+(a.id===current.id?'selected':'')+'>'+sDate(a.submittedAt)+' · '+duration(Math.floor(a.elapsedMs/1000))+'</option>').join('')+'</select></label>'+
      '<details class="folder area"><summary>Rascunho enviado</summary>'+draftMarkup(current.draft,current.draftFormat)+'</details>'+
      '<div class="row wrap area">'+btn('solution',sol?'Gerar novamente':metadata.mode==='guided'?'Abrir roteiro comentado':'Abrir solução comentada','book','tinted','data-id="'+esc(id)+'" data-attempt="'+esc(current.id)+'"')+
      btn('feedback',feed?'Revisar novamente':'Revisar tentativa','bulb','','data-id="'+esc(id)+'" data-attempt="'+esc(current.id)+'"')+'</div>'+
      (sol?'<details class="folder area" open><summary>'+ (metadata.mode==='guided'?'Roteiro comentado':'Solução comentada')+'</summary>'+math(sol)+'</details>':'')+
      (feed?'<details class="folder area" open><summary>Perguntas do revisor</summary>'+group('Questões para a próxima versão',feed.questions)+
        (feed.checks.length?group('Observações',feed.checks,c=>'<li><strong>'+esc(c.category)+'</strong>'+math(c.excerpt)+math(c.observation)+'</li>'):'')+'</details>':''):
      '<div class="notice area">'+icon('lock','sm')+' Envie uma tentativa com tempo cronometrado, rascunho e dificuldade para abrir esta seção.</div>')+
    '</section></div></div>';
}

