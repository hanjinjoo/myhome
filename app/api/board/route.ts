import { env } from 'cloudflare:workers';
export async function GET(request:Request){

 const db=env.DB!;
 const p=await db.prepare('SELECT id,author,body,category,photo,created FROM posts ORDER BY created DESC LIMIT 200').all();
 const c=await db.prepare('SELECT id,post,author,body,created FROM comments ORDER BY created').all();
 const h=await db.prepare('SELECT post,COUNT(*) as count FROM hearts GROUP BY post').all();
 return Response.json({posts:p.results,comments:c.results,hearts:h.results},{headers:{'Cache-Control':'no-store'}});
}
export async function POST(request:Request){
 const visitor=request.headers.get('cookie')?.match(/(?:^|; )family_visitor=([a-f0-9-]{36})(?:;|$)/)?.[1] || crypto.randomUUID();
 const owner='visitor:'+visitor;

 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'허용되지 않은 요청'},{status:403});
 try{
 const data:any=await request.json(); const db=env.DB!; const id=crypto.randomUUID();
 const author=data.anonymous?'익명의 가족':String(data.author||'가족').trim().slice(0,20)||'가족';
 if(data.action==='heart'){
 const key=owner+':'+String(data.post);
 const exists=await db.prepare('SELECT id FROM hearts WHERE id=?').bind(key).first();
 if(exists)await db.prepare('DELETE FROM hearts WHERE id=?').bind(key).run();
 else if(await db.prepare('SELECT id FROM posts WHERE id=?').bind(data.post).first())await db.prepare('INSERT INTO hearts(id,post,owner) VALUES(?,?,?)').bind(key,data.post,owner).run();
 }else{
 const body=String(data.body||'').trim(); if(!body||body.length>3000)throw Error('내용을 1~3,000자로 적어주세요.');
 if(data.action==='comment'){
 if(!await db.prepare('SELECT id FROM posts WHERE id=?').bind(data.post).first())throw Error('게시글을 찾지 못했어요.');
 await db.prepare('INSERT INTO comments(id,post,author,body,created) VALUES(?,?,?,?,?)').bind(id,data.post,author,body,Date.now()).run();
 }else{
 if(!['daily','photo','anonymous'].includes(data.category))throw Error('게시판을 골라주세요.');
 let photo=null;
 if(data.photo){
 const match=String(data.photo).match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
 if(!match||match[2].length>7000000)throw Error('사진은 5MB 이하 JPG, PNG, WebP로 올려주세요.');
 photo=crypto.randomUUID(); const bytes=Uint8Array.from(atob(match[2]),c=>c.charCodeAt(0));
 await env.BUCKET!.put(photo,bytes,{httpMetadata:{contentType:match[1]}});
 }
 await db.prepare('INSERT INTO posts(id,author,owner,body,category,photo,created) VALUES(?,?,?,?,?,?,?)').bind(id,data.category==='anonymous'?'익명의 가족':author,owner,body,data.category,photo,Date.now()).run();
 }
 }
 return Response.json({ok:true},{headers:{'Set-Cookie':'family_visitor='+visitor+'; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000'+(new URL(request.url).protocol==='https:'?'; Secure':'')}});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'저장하지 못했어요. 다시 시도해주세요.'},{status:400})}
}

