declare const __FAMILY_API_ORIGIN__: string | undefined;
const server = typeof __FAMILY_API_ORIGIN__ === 'string' ? __FAMILY_API_ORIGIN__ : '';
const key = 'family-visitor-id';
export function apiUrl(path: string) { return server + path; }
export function importVisitor() {
 if(typeof window==='undefined')return;
 const fragment = new URLSearchParams(window.location.hash.slice(1));
 const id=fragment.get('family-visitor');
 if(id && /^[a-f0-9-]{36}$/.test(id)){
  localStorage.setItem(key,id);
  history.replaceState(null,'',window.location.pathname+window.location.search);
 }
}
function visitor() {
 importVisitor();
 let id=localStorage.getItem(key);
 if(!id || !/^[a-f0-9-]{36}$/.test(id)){id=crypto.randomUUID();localStorage.setItem(key,id);}
 return id;
}
export function apiFetch(path:string,init:RequestInit={}) {
 const headers=new Headers(init.headers);
 if(server)headers.set('X-Family-Visitor',visitor());
 return fetch(apiUrl(path),{...init,headers,credentials:server?'omit':'same-origin'});
}
