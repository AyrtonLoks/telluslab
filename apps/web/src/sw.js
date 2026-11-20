const scope = new URL(self.registration.scope).pathname;
const cacheName = VERSION + ':' + scope;
const assets = new Set(files.map(file => new URL(file,location.href).pathname));

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(cacheName);
    await cache.addAll(files);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('telluslab-')&&k.endsWith(':'+scope)&&k!==cacheName).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  const url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==location.origin) return;
  const isLabPage=request.mode==='navigate'&&[scope,scope.replace(/\/$/u,''),scope==='/'?'/lab':scope+'/'].includes(url.pathname);
  if(!isLabPage&&!assets.has(url.pathname)) return;
  event.respondWith((async()=>{
    const cache=await caches.open(cacheName);
    if(isLabPage) {
      try {return await fetch(request);} catch {return await cache.match('./index.html');}
    }
    const cached=await cache.match(request);
    return cached??fetch(request);
  })());
});
