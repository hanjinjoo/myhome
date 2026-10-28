import { env } from 'cloudflare:workers';
export async function GET(request:Request,{params}: {params:Promise<{id:string}>}){

 const {id}=await params; const photo=await env.BUCKET!.get(id); if(!photo)return new Response('사진 없음',{status:404});
 return new Response(photo.body,{headers:{'Content-Type':photo.httpMetadata?.contentType||'image/jpeg','Cache-Control':'private, max-age=3600','X-Content-Type-Options':'nosniff'}});
}

