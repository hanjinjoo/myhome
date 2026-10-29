import {visitorId} from '../../../lib/visitor';
export async function GET(request:Request){
 const id=visitorId(request)||crypto.randomUUID();
 const headers=new Headers({
  'Location':'https://hanjinjoo.github.io/myhome/#family-visitor='+encodeURIComponent(id),
  'Cache-Control':'no-store',
  'Referrer-Policy':'no-referrer',
  'Set-Cookie':'family_visitor='+id+'; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=31536000',
 });
 return new Response(null,{status:302,headers});
}
