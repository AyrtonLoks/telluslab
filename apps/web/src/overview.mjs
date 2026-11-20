import {calendarEvents,weightedProgress,performanceHistory,mastered,advancementGuard,refreshLearning} from '../../../packages/learning-core/index.mjs';
import {esc,icon,btn,aBtn,dayKey,dateFor,moveDay,firstWeekDay,fmt,percent,duration,badge} from './ui.mjs';
import {page,graph,progressBar,titleFor} from './curriculum.mjs';

const days=['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const today=()=>dayKey();
const midnight=d=>dateFor(d,'00:00').toISOString();
const within=(ctx,start,end)=>{
  const incoming=Object.fromEntries((ctx.incomingMicro??[]).map(item=>[item.sourceDomain+'::'+item.id,item]));
  return calendarEvents({...ctx.state,agenda:{...ctx.state.agenda,...incoming}},{start:midnight(start),end:midnight(end)});
};
const topicTitle=(ctx,id)=>titleFor(ctx.dag,id);
const countDue=ctx=>Object.values(ctx.state.cards).filter(c=>c.dueAt<=ctx.now).length;
const countMicro=ctx=>[...Object.values(ctx.state.agenda),...(ctx.incomingMicro??[])]
  .filter(a=>a.completedAt===null&&a.dueAt<=ctx.now).length;
const dateLabel=day=>fmt(dateFor(day),{day:'numeric',month:'short',year:'numeric'});
const weekKeys=base=>Array.from({length:7},(_,i)=>moveDay(firstWeekDay(base),i));

const artwork='<svg class="hero-art" aria-hidden="true" viewBox="0 0 480 180" preserveAspectRatio="xMaxYMid slice"><defs><pattern id="heroGrid" width="27" height="27" patternUnits="userSpaceOnUse"><path d="M27 0H0v27" opacity=".14"/></pattern><linearGradient id="fade"><stop stop-color="#163f30" stop-opacity="0"/><stop offset="1" stop-color="#163f30"/></linearGradient></defs><rect width="480" height="180" fill="url(#heroGrid)"/><path class="axis" d="M70 99h380m-192-80v141"/><path d="M85 139C138 139 160 39 214 39S296 143 341 143 404 53 447 47"/><path opacity=".55" d="M85 149C148 155 159 55 217 55S291 157 343 157 403 65 447 59"/><path opacity=".35" d="M85 128C145 128 160 23 214 23S297 128 341 128 399 39 447 32"/><path opacity=".2" d="M85 118C146 116 159 8 215 8S291 112 341 112 401 21 446 18"/><circle cx="214" cy="39" r="4"/><circle cx="341" cy="143" r="3"/><circle cx="258" cy="90" r="3"/><path opacity=".6" d="M214 40v59m128 0v44"/></svg>';

function weekStrip(ctx,base,navToCalendar=false) {
  const keys=weekKeys(base);
  const events=within(ctx,keys[0],moveDay(keys.at(-1),1));
  return '<div class="week">'+keys.map((key,i)=>{
    const has=events.some(e=>dayKey(new Date(e.at))===key);
    const classes=(key===today()?' today':'')+(key===ctx.calendarDay?' selected':'');
    const label=days[i]+' '+key.slice(-2);
    const content='<span>'+days[i]+'</span><strong>'+Number(key.slice(-2))+'</strong><i '+(has?'class="event-pin"':'')+'></i>';
    return '<button type="button" class="day'+classes+'" data-act="calendar-day" data-day="'+key+'" '+(navToCalendar?'data-nav="1" ':'')+'aria-label="'+label+(has?', com atividade':'')+'">'+content+'</button>';
  }).join('')+'</div>';
}

function eventRows(ctx,events,max=Infinity) {
  const names={session:'Sessão de prática',challenge:'Desafio',card:'Cartão de revisão',micro:'Micro-revisão',attempt:'Tentativa enviada',review:'Revisão concluída'};
  const icons={session:'practice',challenge:'practice',card:'repeat',micro:'repeat',attempt:'check',review:'check'};
  if(!events.length) return '<div class="agenda-row"><span class="metric-icon">'+icon('calendar','sm')+'</span><div><strong class="small">Nenhuma atividade agendada</strong><p class="muted">Crie uma sessão para reservar um horário.</p></div></div>';
  const combined=new Map();
  for(const e of events) {
    const key=e.kind==='card'?'cards:'+e.topicId:e.kind+':'+e.id;
    const old=combined.get(key);
    combined.set(key,{...e,quantity:(old?.quantity??0)+1});
  }
  return [...combined.values()].slice(0,max).map(e=>{
    const challenge=ctx.state.challenges[e.challengeId];
    const label=e.topicId?topicTitle(ctx,e.topicId):challenge?.title??names[e.kind];
    const action=e.kind==='session'?'pratica/session/'+e.sessionId:
      e.challengeId?'pratica/'+e.challengeId:e.kind==='card'||e.kind==='micro'?'pratica/revisoes':null;
    const summary=names[e.kind]+(e.quantity>1?' ×'+e.quantity:'')+' · '+fmt(e.at,{hour:'2-digit',minute:'2-digit'});
    return '<div class="agenda-row"><span class="metric-icon">'+icon(icons[e.kind],'sm')+'</span><div><strong class="small">'+
      (action?'<a href="#'+esc(action)+'">'+esc(label)+'</a>':esc(label))+'</strong><p class="muted">'+esc(summary)+(e.completedAt?' · concluída':'')+'</p></div></div>';
  }).join('');
}

function metrics(ctx) {
  const progress=weightedProgress(ctx.catalog,ctx.state.progress);
  const masteredCount=Object.values(ctx.state.progress).filter(mastered).length;
  const week=weekKeys(today());
  const attempts=Object.values(ctx.state.attempts).filter(a=>dayKey(new Date(a.submittedAt))>=week[0]&&dayKey(new Date(a.submittedAt))<=week[6]);
  return [
    ['target','',percent(progress.global.ratio),'Progresso global','Por complexidade'],
    ['layers','lime',masteredCount+' / '+ctx.catalog.topics.length,'Macrotemas validados','Proficiência S4 ou superior'],
    ['repeat','amber',String(countDue(ctx)),'Revisões vencidas',countMicro(ctx)+' micro-revisões'],
    ['timer','sky',duration(Math.floor(attempts.reduce((n,a)=>n+a.elapsedMs,0)/1000)),'Prática nesta semana',attempts.length+' tentativa(s)']
  ].map(([glyph,theme,num,label,caption])=>'<div class="card metric"><span class="metric-icon '+theme+'">'+icon(glyph)+'</span><div><span class="small">'+label+'</span><div class="metric-val">'+num+'</div><span class="small">'+caption+'</span></div></div>').join('');
}

export function dashboard(ctx) {
  const due=countDue(ctx), micro=countMicro(ctx);
  const inProgress=ctx.dag.order.filter(id=>advancementGuard(ctx.dag,ctx.state.progress,id).allowed)
    .sort((a,b)=>Number(ctx.state.progress[b].state[1])-Number(ctx.state.progress[a].state[1]));
  const next=inProgress[0];
  const summary=weightedProgress(ctx.catalog,ctx.state.progress);
  const week=weekKeys(today());
  const remaining=within(ctx,today(),moveDay(week.at(-1),1)).filter(e=>!['attempt','review'].includes(e.kind)&&!e.completedAt);
  const recent=performanceHistory(ctx.state).attempts.slice(-3).reverse();
  return page('Visão geral','Estude com método, pratique com intenção e acompanhe o que você consegue demonstrar.',btn('new','Nova sessão','plus','primary','data-mode="session"'))+
    '<section class="hero">'+artwork+'<div><div class="eyebrow">'+(next?'Próximo macrotema':'Próxima prática')+'</div><h2>'+
       (next?esc(topicTitle(ctx,next)):'Consolide seu repertório')+'</h2><p>'+
       (next?'Organize 45 a 75 minutos entre avanço, revisão e prática mista.':'Abra sua agenda para conferir as próximas revisões.')+'</p>'+
       (next?btn('new','Começar a estudar','play','','data-mode="session" data-topic="'+next+'"'):aBtn('pratica/revisoes','Abrir revisões','repeat'))+'</div></section>'+
    '<div class="summary-grid">'+metrics(ctx)+'</div>'+
    '<div class="dash-grid"><div class="rail">'+graph(ctx,true)+'<section class="card pad"><div class="row between wrap"><h2>Atividade recente</h2>'+aBtn('historico','Ver histórico','history','clear')+'</div>'+
    (recent.length?'<ul class="compact-list">'+recent.map(a=>'<li><a href="#pratica/'+esc(a.challengeId)+'">'+esc(ctx.state.challenges[a.challengeId].title)+'</a><p class="small">'+esc(a.difficulty)+' · '+duration(Math.floor(a.elapsedMs/1000))+'</p></li>').join('')+'</ul>':'<p class="small area">Suas tentativas e revisões aparecerão aqui.</p>')+'</section></div>'+
    '<div class="rail"><section class="card"><div class="card-head"><div><h2>Agenda da semana</h2><p>'+fmt(dateFor(week[0]),{day:'numeric',month:'short'})+' – '+fmt(dateFor(week[6]),{day:'numeric',month:'short'})+'</p></div>'+aBtn('calendario','Agenda','calendar','clear')+'</div>'+
    weekStrip(ctx,today(),true)+eventRows(ctx,remaining,2)+'</section>'+
    '<section class="card pad"><div class="row between wrap"><div><h2>Fila de revisão</h2><p class="small">'+due+' cartões · '+micro+' micro-revisões</p></div>'+aBtn('pratica/revisoes','Abrir','repeat','tinted')+'</div></section>'+
    '<section class="card pad"><div class="row between"><h2>Progresso por trilha</h2></div><div class="stack area">'+ctx.catalog.tracks.map(t=>progressBar(summary.tracks[t.id],t.title)).join('')+'</div></section></div></div>';
}

function gapRadar(summary) {
  const point=(index,scale)=>{
    const angle=index*2*Math.PI/summary.length-Math.PI/2;
    return [150+Math.cos(angle)*92*scale,130+Math.sin(angle)*92*scale].map(value=>value.toFixed(1));
  };
  const ring=scale=>summary.map((_,index)=>point(index,scale).join(',')).join(' ');
  const gap=summary.map(({weighted},index)=>point(index,1-(weighted.ratio??0)).join(',')).join(' ');
  return '<svg viewBox="0 0 300 260" role="img" aria-label="Radar de lacunas por domínio. Quanto maior a distância do centro, maior o peso pendente." class="gap-radar">'+
    [0.25,0.5,0.75,1].map(scale=>'<polygon points="'+ring(scale)+'" fill="none" stroke="currentColor" opacity=".22"/>').join('')+
    summary.map(({pack},index)=>{
      const [x,y]=point(index,1);
      const [tx,ty]=point(index,1.22);
      return '<line x1="150" y1="130" x2="'+x+'" y2="'+y+'" stroke="currentColor" opacity=".22"/>'+
        '<text x="'+tx+'" y="'+ty+'" dy=".35em" text-anchor="middle" fill="currentColor" font-size="10">'+esc(pack.id.slice(4))+'</text>';
    }).join('')+'<polygon points="'+gap+'" fill="#0e7490" fill-opacity=".30" stroke="#0e7490" stroke-width="2"/></svg>';
}

export function consolidatedPage(packs,data,topicHref,now) {
  const summary=[...packs.domains.values()].map(pack=>{
    const state=refreshLearning(pack.dag,data.domains[pack.id].state,now);
    return {pack,state,weighted:weightedProgress(pack.catalog,state.progress).global,
      validated:Object.values(state.progress).filter(mastered).length};
  });
  const sum=pick=>summary.reduce((total,item)=>total+pick(item),0);
  const due=summary.flatMap(({pack,state})=>Object.values(state.cards)
    .filter(card=>state.progress[card.topicId].state==='S6'&&card.dueAt<=now)
    .map(card=>({pack,card}))).sort((a,b)=>a.card.dueAt.localeCompare(b.card.dueAt));
  const graphEdges=packs.dag.order.flatMap(ref=>{
    const target=packs.references.get(ref);
    const cross=packs.dag.byId.get(ref).crossPrerequisites??[];
    return cross.length?[{target,sources:cross.map(parent=>packs.references.get(parent))}]:[];
  });
  const href=ref=>'<a href="'+esc(topicHref(ref.domainId,ref.topicId))+'">'+
    esc(packs.domains.get(ref.domainId).label+' · '+ref.topicId+' · '+ref.title)+'</a>';
  return page('Visão Consolidada TellusLab','Acompanhe a proficiência e explore as conexões entre os domínios.')+
    '<section class="card pad"><h2>Progresso geral</h2><p class="small">'+sum(item=>item.validated)+' de '+
      packs.dag.order.length+' macrotemas validados</p><div class="area">'+progressBar({
        ratio:sum(item=>item.weighted.completed)/sum(item=>item.weighted.total)
      },'Progresso por complexidade')+'</div></section>'+
    '<div class="grid-two area"><section class="card pad"><h2>Radar de lacunas</h2><p class="small">Peso curricular pendente por domínio</p>'+
      gapRadar(summary)+'<ul class="compact-list">'+summary.map(({pack,weighted})=>'<li>'+esc(pack.label)+' · '+percent(1-(weighted.ratio??0))+'</li>').join('')+'</ul></section>'+
    '<section class="card pad"><h2>Fila global FSRS-5</h2><p class="small">'+due.length+' cartões vencidos</p>'+
      (due.length?'<ul class="compact-list area">'+due.map(({pack,card})=>'<li><a href="'+esc(topicHref(pack.id,card.topicId))+'">'+
        esc(pack.label+' · '+pack.dag.byId.get(card.topicId).title)+'</a><p class="small">'+esc(fmt(card.dueAt,{dateStyle:'short',timeStyle:'short'}))+
        ' · <a href="#'+esc(pack.area)+'/pratica/revisoes">Revisar no domínio</a></p></li>').join('')+'</ul>':'<p class="small">Nenhuma revisão vencida.</p>')+
      '</section></div>'+
    '<div class="grid-two area">'+summary.map(({pack,state,weighted,validated})=>
      '<section class="card pad"><div class="row between wrap"><h2>'+esc(pack.label)+'</h2>'+(pack.launchPath?
          '<a class="btn" data-domain-launch href="'+esc(pack.launchPath)+'">'+icon('right','sm')+' Abrir domínio</a>':
          aBtn(pack.area+'/inicio','Abrir domínio','right'))+
      '</div><p class="small">'+validated+' de '+pack.catalog.topics.length+' macrotemas validados · '+pack.catalog.books.length+
      ' obras · '+Object.values(state.cards).filter(card=>card.dueAt<=now).length+' cartões vencidos</p>'+
      '<div class="area">'+progressBar(weighted,'Progresso por complexidade')+'</div></section>').join('')+'</div>'+
    '<section class="card pad area"><h2>Pré-requisitos interdisciplinares</h2><p class="small">'+
      graphEdges.reduce((count,edge)=>count+edge.sources.length,0)+' conexões · '+(data.prerequisiteMode==='strict'?'Modo Estrito':'Modo Flexível')+'</p>'+
      '<ul class="compact-list area">'+graphEdges.map(({target,sources})=>'<li><strong>'+href(target)+'</strong>'+
      '<p class="small">'+sources.map(href).join(', ')+'</p></li>').join('')+'</ul></section>';
}

export function agendaPage(ctx) {
  const chosen=ctx.calendarDay;
  const thisMonth=chosen.slice(0,7);
  const begin=thisMonth+'-01';
  const [year,month]=begin.split('-').map(Number);
  const first=firstWeekDay(begin);
  const nextMonth=dayKey(new Date(Date.UTC(year,month,1,15)));
  const end=moveDay(firstWeekDay(moveDay(nextMonth,-1)),7);
  const contents=within(ctx,chosen,moveDay(chosen,1));
  let monthView='';
  if(ctx.calendarMode==='month') {
    const dates=[];
    for(let d=first;d<end;d=moveDay(d,1)) dates.push(d);
    const events=within(ctx,first,end);
    monthView='<div class="month-grid">'+days.map(d=>'<div class="dd">'+d+'</div>').join('')+dates.map(d=>{
      const n=events.filter(e=>dayKey(new Date(e.at))===d).length;
      return '<button class="month-cell '+(d===today()?'today ':'')+(d===chosen?'selected ':'')+(d.slice(0,7)!==thisMonth?'outside':'')+
        '" data-act="calendar-day" data-day="'+d+'" type="button" aria-label="'+dateLabel(d)+(n?', '+n+' atividades':'')+'"><strong>'+Number(d.slice(-2))+'</strong>'+
        (n?'<small>'+n+' atividade'+(n>1?'s':'')+'</small>':'')+'</button>';
    }).join('')+'</div>';
  }
  return page('Calendário','Planeje a prática e acompanhe vencimentos e micro-revisões.',btn('new','Agendar sessão','plus','primary','data-mode="session" data-day="'+chosen+'"'))+
    '<section class="card"><div class="card-head"><div><h2>'+cap(fmt(dateFor(chosen),{month:'long',year:'numeric'}))+
    '</h2><p>Horário de Brasília</p></div><div class="row wrap"><div class="seg">'+['week','month'].map(v=>'<button type="button" data-act="calendar-mode" data-id="'+v+'" aria-pressed="'+(v===ctx.calendarMode)+'">'+(v==='week'?'Semana':'Mês')+'</button>').join('')+'</div>'+
    btn('calendar-shift','Anterior','left','icon-btn','data-delta="-1"')+btn('calendar-today','Hoje')+btn('calendar-shift','Próximo','right','icon-btn','data-delta="1"')+
    '</div></div>'+(monthView||weekStrip(ctx,chosen))+'</section>'+
    '<section class="card area"><div class="card-head"><div><h2>Atividades em '+dateLabel(chosen)+'</h2></div>'+aBtn('pratica/revisoes','Fila de revisão','repeat')+'</div>'+
    eventRows(ctx,contents)+'</section>';
}

export function historyPage(ctx) {
  const history=performanceHistory(ctx.state);
  const attempts=history.attempts;
  const longest=Math.max(3600,...attempts.slice(-12).map(a=>a.elapsedMs/1000));
  const recent=attempts.slice(-12);
  const points=recent.map((a,i)=>[43+(recent.length===1?228:i*490/(recent.length-1)),130-100*(a.elapsedMs/1000)/longest]);
  const visual=recent.length?'<svg class="chart" role="img" aria-label="Tempo cronometrado nas últimas tentativas" viewBox="0 0 570 155" preserveAspectRatio="xMidYMid meet">'+
    [30,80,130].map(y=>'<line x1="43" y1="'+y+'" x2="533" y2="'+y+'"/>').join('')+
    '<text x="4" y="34">'+Math.round(longest/60)+' m</text><text x="11" y="134">0 m</text><polyline points="'+points.map(x=>x.join(',')).join(' ')+'"/>'+
    points.map(([x,y],i)=>'<circle cx="'+x+'" cy="'+y+'" r="4"><title>'+esc(duration(Math.floor(recent[i].elapsedMs/1000)))+'</title></circle>').join('')+'</svg>':
    '<p class="empty">Envie uma tentativa para começar a comparar seu tempo de prática.</p>';
  const latestFirst=[...attempts].reverse();
  return page('Histórico','Compare seu tempo de prática, dificuldades registradas e evolução da proficiência.')+
    '<div class="summary-grid">'+metrics(ctx)+'</div><section class="card pad"><h2>Tempo por tentativa</h2>'+visual+'</section>'+
    '<section class="card pad area"><h2>Tentativas</h2>'+(latestFirst.length?'<div class="table-wrap"><table class="history-table"><thead><tr><th>Data</th><th>Desafio</th><th>Tempo</th><th>Dificuldade</th><th>Revisão</th></tr></thead><tbody>'+
    latestFirst.map(a=>'<tr><td>'+fmt(a.at,{day:'2-digit',month:'2-digit',year:'numeric'})+'</td><td><a href="#pratica/'+esc(a.challengeId)+'">'+esc(ctx.state.challenges[a.challengeId].title)+'</a></td><td>'+duration(Math.floor(a.elapsedMs/1000))+'</td><td>'+esc(a.difficulty)+
    '</td><td>'+esc(({coherent:'Coerente',needsRevision:'Revisar',insufficientEvidence:'Autoavaliação'})[a.assessment]??'Pendente')+'</td></tr>').join('')+'</tbody></table></div>':
    '<p class="small area">Você ainda não enviou uma tentativa.</p>')+'</section>'+
    '<div class="grid-two area"><section class="card pad"><h2>Proficiência</h2><ul class="compact-list">'+history.proficiency.slice(-12).reverse().map(e=>'<li><div class="row between"><a href="#trilhas/'+e.topicId+'">'+e.topicId+' · '+esc(topicTitle(ctx,e.topicId))+'</a>'+badge(e.from+' → '+e.to)+'</div><small>'+fmt(e.at,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+'</small></li>').join('')+
    (history.proficiency.length?'':'<li class="small">Nenhuma mudança de estado registrada.</li>')+'</ul></section>'+
    '<section class="card pad"><h2>Histórico de revisão</h2><ul class="compact-list">'+history.reviews.slice(-12).reverse().map(e=>'<li><div class="row between"><a href="#trilhas/'+e.topicId+'">'+e.topicId+' · '+esc(topicTitle(ctx,e.topicId))+'</a>'+badge(['','Repetir','Difícil','Bom','Fácil'][e.grade])+'</div><small>'+fmt(e.at,{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})+'</small></li>').join('')+
    (history.reviews.length?'':'<li class="small">Nenhum cartão avaliado.</li>')+'</ul></section></div>';
}

