import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {createReadStream} from 'node:fs';
import {stat} from 'node:fs/promises';
import {extname} from 'node:path';

const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
  '.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf'};
const root=new URL('./dist/',import.meta.url);
const port=Number(process.env.MATH_LAB_PORT??4175);
createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    const path=decodeURIComponent(url.pathname);
    if(path.split('/').some(p=>p==='..'||p.includes('\\'))) throw new Error('path');
    const file=new URL('.'+(path==='/'?'/index.html':path),root);
    if(!file.href.startsWith(root.href)||!(await stat(file)).isFile()) throw new Error('missing');
    res.writeHead(200,{'Content-Type':mime[extname(file.pathname)]??'application/octet-stream','Cache-Control':'no-cache'});
    createReadStream(file).pipe(res);
  } catch {res.writeHead(404).end('Não encontrado');}
}).listen(port,'127.0.0.1',()=>{
  const address='http://127.0.0.1:'+port+'/';
  console.log(address);
  if(process.env.MATH_LAB_OPEN==='1'&&process.platform==='win32') {
    const browser=spawn('rundll32.exe',['url.dll,FileProtocolHandler',address],{stdio:'ignore',windowsHide:true});
    browser.on('error',()=>{});
    browser.unref();
  }
});
