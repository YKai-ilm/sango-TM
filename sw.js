const CACHE='sango-cache-v1';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  if(req.mode==='navigate'||req.destination==='document'){
    e.respondWith(
      fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(ca=>ca.put(req,c));return r;})
      .catch(()=>caches.match(req).then(m=>m||caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(m=>{
      const f=fetch(req).then(r=>{const c=r.clone();caches.open(CACHE).then(ca=>ca.put(req,c));return r;}).catch(()=>m);
      return m||f;
    })
  );
});
