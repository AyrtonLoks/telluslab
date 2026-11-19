import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {extname} from 'node:path';

const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
  '.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
const root=new URL('./dist/',import.meta.url);
const defaultPort=4175;
const fallbackPort=4183;
const configuredPort=process.env.MATH_LAB_PORT;
let port=Number(configuredPort??defaultPort);
const server=createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const path=decodeURIComponent(url.pathname);
    if(path.split('/').some(p=>p==='..'||p.includes('\\'))) throw new Error('path');
    const file=new URL('.'+(['/', '/lab'].includes(path)?'/index.html':path),root);
    if(!file.href.startsWith(root.href)||!(await stat(file)).isFile()) throw new Error('missing');
    res.writeHead(200,{'Content-Type':mime[extname(file.pathname)]??'application/octet-stream','Cache-Control':'no-cache'});
    createReadStream(file).pipe(res);
  } catch {res.writeHead(404).end('Não encontrado');}
});
server.on('error',error=>{
  if(error.code!=='EADDRINUSE') throw error;
  if(configuredPort===undefined&&port===defaultPort) {
    port=fallbackPort;
    console.log('A porta '+defaultPort+' está em uso. Tentando a porta '+port+'.');
    server.listen(port,'127.0.0.1');
    return;
  }
  console.error('A porta '+port+' já está em uso. Encerre o outro servidor ou inicie o TellusLab com outra porta usando MATH_LAB_PORT.');
  process.exitCode=1;
});
server.once('listening',()=>{
  const address='http://127.0.0.1:'+server.address().port+'/';
  console.log(address);
  if(process.env.MATH_LAB_OPEN==='1'&&process.platform==='win32') {
    const browser=spawn('rundll32.exe',['url.dll,FileProtocolHandler',address],{stdio:'ignore',windowsHide:true});
    browser.on('error',()=>{});
    browser.unref();
  }
});
server.listen(port,'127.0.0.1');
