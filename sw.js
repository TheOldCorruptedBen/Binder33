const CACHE='binder33-cache-v7';
const ROOT=new URL('./',self.location.href);
const ASSETS=['./','./index.html','./cards.json','./manifest.json','./icon.png','./tcg-list.json'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(ASSETS.map(p=>new Request(new URL(p,ROOT),{cache:'reload'})));await self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{await Promise.all((await caches.keys()).filter(k=>k.startsWith('binder33-')&&k!==CACHE).map(k=>caches.delete(k)));await self.clients.claim();})()));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==ROOT.origin||!u.pathname.startsWith(ROOT.pathname))return;
e.respondWith((async()=>{const c=await caches.open(CACHE);const nav=r.mode==='navigate';const key=nav?new URL('index.html',ROOT).href:u.href;try{const res=await fetch(r,{cache:'no-cache'});if(res.ok){if(nav||ASSETS.some(p=>new URL(p,ROOT).pathname===u.pathname)){try{await c.put(nav?key:new URL(u.pathname,u.origin).href,res.clone());}catch{}}return res;}if(res.status<500)return res;}catch{}return (await c.match(key))||(await c.match(new URL(u.pathname,u.origin).href))||(nav?await c.match(new URL('./',ROOT).href):null)||new Response('Connexion indisponible',{status:503});})());});
