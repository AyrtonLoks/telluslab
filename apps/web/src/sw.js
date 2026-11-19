self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(VERSION);
    await cache.addAll(files);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>(k.startsWith('matematica-')||k.startsWith('telluslab-'))&&k!==VERSION).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==location.origin) return;
  event.respondWith((async()=>{
    const cache=await caches.open(VERSION);
    if(request.mode==='navigate') {
      try {return await fetch(request);} catch {return await cache.match('./index.html');}
    }
    const cached=await cache.match(request);
    return cached??fetch(request);
  })());
});
