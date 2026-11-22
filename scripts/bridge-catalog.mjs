import { createDomainPacks } from '../packages/learning-core/domain-packs.mjs';
import { MATH_DIFFICULTIES } from '../packages/learning-core/agenda.mjs';
import { VERSION, validateRegistry, validateManifest } from '../packages/tellus-bridge/index.mjs';
import d26 from './bridge-links-d26.json' with {type:'json'};

const inventory = [
  ['MATH','mathematics','Matemática',40,88],
  ['PROG','programming','Programação e Ciência da Computação',41,49],
  ['ECON','economics-finance','Economia e Finanças',19,32],
  ['PHYS','physics','Física e Óptica',7,37],
  ['ENG','engineering','Engenharia',5,28],
  ['HUM','humanities','Humanidades, História, Filosofia, Ciências Sociais e Metacognição',53,36],
  ['LANG','languages','Idiomas',6,13],
  ['LIT','literature','Literatura',26,16]
];

const nums = (level, first, last) => Array.from({length:last - first + 1}, (_, i) => level + '.' + (first + i));

export function bridgeCatalog(catalogs) {
  const domains = inventory.map(([code,slug,name,bookCount,nodeCount], index) => {
    const catalog = catalogs[index];
    const id = 'DOM-' + code;
    const bookId = legacy => code === 'MATH' ? legacy.replace('BIB-', 'BIB-MATH-') : legacy;
    if (!catalog || (catalog.domainId ?? 'DOM-MATH') !== id || (catalog.slug ?? 'mathematics') !== slug ||
        catalog.books.length !== bookCount || catalog.topics.length !== nodeCount ||
        Array.from({length:bookCount}, (_, i) => 'BIB-' + code + '-' + String(i + 1).padStart(2,'0'))
          .some(expected => !catalog.books.some(book => bookId(book.id) === expected))) {
      throw new Error('Inventário divergente para ' + id);
    }
    return {id,slug,name,catalogId:catalog.catalogId,
      difficulties:catalog.difficulties ?? MATH_DIFFICULTIES,
      tracks:catalog.tracks.map(({id,title,description}) => ({id,title,description})),
      books:catalog.books.map(({id,title,authors}) => ({id:bookId(id),title,authors})),
      nodes:catalog.topics.map(topic => ({
        id:id + ':' + topic.id, title:topic.title, complexity:topic.complexity, trackId:topic.trackId,
        prerequisites:topic.prerequisites.map(parent => id + ':' + parent),
        crossPrerequisites:(topic.crossPrerequisites ?? []).map(parent => parent.replace('::', ':')),
        modalities:topic.modalities, bookIds:[...new Set(topic.bibliography.map(ref => bookId(ref.bookId)))]
      }))};
  });
  createDomainPacks(domains.map(({id}, index) => ({id,catalog:catalogs[index]})));
  const registry = validateRegistry({kind:'TellusDomainRegistryV1',schemaVersion:VERSION,domains});

  const nodeIds = (code, ids) => {
    const domain = domains.find(({id}) => id === 'DOM-' + code);
    return ids === '*' ? domain.nodes.map(node => node.id) : ids.map(id => domain.id + ':' + id);
  };
  const group = (...pairs) => pairs.flatMap(([code, ids]) => nodeIds(code, ids));
  const optics = group(['PHYS',['2.4',...nums(6,2,6),...nums(7,1,3)]],['ENG',[...nums(6,1,4),...nums(7,1,4)]]);
  const energy = group(['ENG',[...nums(2,1,4),...nums(3,1,4),...nums(4,1,4),...nums(5,1,3)]],['PHYS',nums(3,3,6)]);
  const markets = group(['ECON',[...nums(2,2,5),...nums(3,1,4),...nums(7,2,4),...nums(8,1,4)]]);
  const computing = group(['PROG','*'],['MATH',[...nums(2,1,5),...nums(6,1,7),...nums(7,1,11)]],['HUM',['3.2','3.3']]);
  const humanities = domains.find(domain => domain.id === 'DOM-HUM').nodes
    .filter(node => /^DOM-HUM:[2-7]\./.test(node.id)).map(node => node.id);
  const brazil = group(['HUM',['6.4','6.5']],['LIT',['2.2','2.3','2.4','3.2','3.3',...nums(4,1,3),...nums(5,1,3),'6.2']]);
  const portuguese = group(['LIT',['1.1','2.1','3.1']],['LANG',['5.1']]);
  const japan = group(['LANG',nums(4,1,3)]);
  const nodeById = new Map(domains.flatMap(domain => domain.nodes.map(node => [node.id,node])));
  const rows = [];
  // Ampliação da D26 (scripts/bridge-links-d26.json): nós acrescentados, na ordem, a vínculos existentes.
  const extensions = new Map(d26.extend.map(({entityId, nodeIds}) => [entityId, nodeIds]));
  function link(kind, key, title, baseNodes, target = '/') {
    const entityId = kind + ':' + key;
    const nodes = [...baseNodes, ...(extensions.get(entityId) ?? [])];
    extensions.delete(entityId);
    if (new Set(nodes).size !== nodes.length) throw new Error('Macrotema repetido no vínculo ' + entityId);
    if (rows.some(row => row.entityId === entityId)) throw new Error('Vínculo repetido: ' + entityId);
    const bookIds = [...new Set(nodes.flatMap(id => {
      const node = nodeById.get(id);
      if (!node) throw new Error('Macrotema ausente no vínculo ' + id);
      return node.bookIds;
    }))];
    rows.push({entityId,kind,title,target,nodeIds:nodes,bookIds});
  }
  const dossier = (key,title,nodes) => link('dossier',key,title,nodes,'/dossies/' + key);
  dossier('astronomia-optica','Astronomia, óptica e telescópios',optics);
  dossier('industria-energia-transporte','Revolução Industrial, energia e transporte',energy);
  dossier('sistemas-monetarios','Sistemas monetários, crises e renda fixa',markets);
  dossier('computacao','Computação, algoritmos, sistemas distribuídos e IA',computing);
  dossier('historia-e-filosofia','História, filosofia e ciências sociais',humanities);
  dossier('literaturas','Literaturas brasileira, portuguesa, francesa e moçambicana',nodeIds('LIT','*'));
  dossier('idiomas','Inglês, escrita japonesa e português instrumental',nodeIds('LANG','*'));
  for (const [iso,title,nodes] of [
    ['BRA','Brasil',brazil],['PRT','Portugal',portuguese],['FRA','França',group(['LIT',['3.1']],['HUM',['4.5','6.1']])],
    ['MOZ','Moçambique',group(['LIT',['6.1']])],['JPN','Japão',japan]
  ]) link('country',iso,title,nodes,'/pais/' + iso.toLowerCase());

  for (const [id,title,nodes] of [
    ['glo-2021','Telescópio Espacial James Webb',optics],
    ['glo-1969','Apollo 11',group(['PHYS',['2.4']],['ENG',['3.3','5.2','5.3']])],
    ['usa-1969','Apollo 11',group(['PHYS',['2.4']],['ENG',['3.3','5.2','5.3']])],
    ['glo-1973','Choque do petróleo',[...energy,...group(['ECON',['2.2','2.3']])]],
    ['glo-2008','Crise financeira de 2008',markets],
    ['glo-1991','Criação da World Wide Web',group(['PROG',['6.4',...nums(8,1,8)]],['HUM',['3.3']],['LANG',['3.3']])],
    ['jpn-1964','Estreia do Shinkansen',group(['ENG',['2.2','4.1','4.4','5.3']])],
    ['bra-1822','Independência do Brasil',brazil],['bra-1889','Proclamação da República',brazil],
    ['magellan-1519','Circum-navegação de Magalhães e Elcano',portuguese]
  ]) link('event',id,title,nodes);
  link('era','COLD_WAR','Guerra Fria',group(['HUM',['4.1','4.2','4.4']],['PHYS',['2.4']],['ECON',['2.3']]));
  link('figure','dom-pedro-ii','Dom Pedro II',group(['HUM',['6.4']],['LIT',['2.3','3.2']]),'/dossies/dom-pedro-ii');
  link('figure','luis-de-camoes','Luís de Camões',portuguese,'/dossies/luis-de-camoes');
  link('observatory','COSMOS','Sistema Solar e observação astronômica',optics);
  link('observatory','ISS_SATELLITES','Estação Espacial Internacional',group(['PHYS',['2.4']],['ENG',['5.2','5.3']]));
  link('observatory','FLIGHTS_OPENSKY','Tráfego aéreo',group(['ENG',['2.2','3.3','5.3']],['LANG',['3.3']]));
  link('observatory','MARITIME_ROUTES','Rotas marítimas',group(['ECON',['2.3']],['ENG',['2.1','2.3']]));
  link('observatory','NASA_FIRMS','Monitoramento de focos de calor',group(['PHYS',['3.3','4.7']],['ENG',['5.2']]));
  link('observatory','NASA_EONET','Eventos naturais da NASA',group(['MATH',['7.1','7.8']],['ENG',['5.2']]));
  for (const {entityId, title, target, nodeIds:nodes} of d26.links) {
    const [kind, key] = entityId.split(/:(.*)/su);
    link(kind, key, title, nodes, target);
  }
  if (extensions.size) throw new Error('Extensão da D26 sem vínculo correspondente: ' + [...extensions.keys()].join(', '));
  const manifest = validateManifest({kind:'TellusCrossLinkManifestV1',schemaVersion:VERSION,links:rows},registry);
  return {registry,manifest};
}
