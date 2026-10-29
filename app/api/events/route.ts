import {env} from 'cloudflare:workers';
import {allowedOrigin,visitorId} from '../../../lib/visitor';

const cookieId=visitorId;
const noStore={'Cache-Control':'no-store'};
const fields='id,title,date,end_date AS endDate,time,end_time AS endTime,all_day AS allDay,category,location,note,author,repeat,created,updated';
function validDate(value:string){const parsed=new Date(value+'T00:00:00Z');return /^\d{4}-\d{2}-\d{2}$/.test(value)&&value>='1900-01-01'&&value<='2199-12-31'&&Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===value}
function clean(data:any){
 const title=String(data.title||'').trim(), date=String(data.date||''), endDate=String(data.endDate||date);
 const allDay=data.allDay===true||data.allDay===1;
 const time=allDay?'':String(data.time||''),endTime=allDay?'':String(data.endTime||'');
 if(!title||title.length>80)throw Error('일정 제목은 1~80자로 적어주세요.');
 if(!validDate(date)||!validDate(endDate)||endDate<date)throw Error('시작일과 종료일을 확인해주세요.');
 if(!allDay&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(time))throw Error('시작 시간을 선택해주세요.');
 if(endTime&&!/^([01]\d|2[0-3]):[0-5]\d$/.test(endTime))throw Error('종료 시간을 확인해주세요.');
 if(!allDay&&endTime&&endDate===date&&endTime<=time)throw Error('종료 시간은 시작 시간보다 늦어야 해요.');
 const category=String(data.category||'family');
 if(!['family','birthday','anniversary','trip','other'].includes(category))throw Error('일정 종류를 선택해주세요.');
 const location=String(data.location||'').trim(),note=String(data.note||'').trim(),author=String(data.author||'가족').trim()||'가족';
 if(location.length>160||note.length>2000||author.length>20)throw Error('장소는 160자, 메모는 2,000자, 이름은 20자까지 입력할 수 있어요.');
 const repeat=data.repeat==='yearly'?'yearly':'none';
 if(repeat==='yearly'&&date!==endDate)throw Error('매년 반복 일정은 시작일과 종료일을 같은 날로 정해주세요.');
 return {title,date,endDate,time,endTime,allDay:allDay?1:0,category,location,note,author,repeat};
}
export async function GET(r:Request){
 try{
 const owner='visitor:'+(cookieId(r)||'');
 const result=await env.DB!.prepare('SELECT '+fields+', owner = ? AS canEdit FROM events WHERE deleted=0 ORDER BY date,time,created').bind(owner).all();
 return Response.json({events:result.results},{headers:noStore});
 }catch{return Response.json({error:'일정을 불러오지 못했어요. 잠시 후 다시 시도해주세요.'},{status:503,headers:noStore})}
}
async function mutate(r:Request){
 if(!allowedOrigin(r))return Response.json({error:'허용되지 않은 요청이에요.'},{status:403});
 try{
 const data:any=await r.json(); const visitor=cookieId(r)||crypto.randomUUID(),owner='visitor:'+visitor;
 const reply=(body:any,status=200)=>Response.json(body,{status,headers:{...noStore,'Set-Cookie':'family_visitor='+visitor+'; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000'+(new URL(r.url).protocol==='https:'?'; Secure':'')}});
 if(r.method==='POST'){
 const v=clean(data),id=crypto.randomUUID(),now=Date.now();
 await env.DB!.prepare('INSERT INTO events(id,owner,title,date,end_date,time,end_time,all_day,category,location,note,author,repeat,created,updated,deleted) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,0)').bind(id,owner,v.title,v.date,v.endDate,v.time,v.endTime,v.allDay,v.category,v.location,v.note,v.author,v.repeat,now,now).run();
 return reply({ok:true,id});
 }
 const id=String(data.id||'');
 const existing:any=await env.DB!.prepare('SELECT owner FROM events WHERE id=? AND deleted=0').bind(id).first();
 if(!existing)return reply({error:'이미 삭제됐거나 찾을 수 없는 일정이에요.'},404);
 if(existing.owner!==owner)return reply({error:'일정을 만든 브라우저에서만 수정·삭제할 수 있어요.'},403);
 if(r.method==='DELETE'){
 await env.DB!.prepare('UPDATE events SET deleted=1,updated=? WHERE id=? AND owner=?').bind(Date.now(),id,owner).run();
 }else{
 const v=clean(data);
 await env.DB!.prepare('UPDATE events SET title=?,date=?,end_date=?,time=?,end_time=?,all_day=?,category=?,location=?,note=?,author=?,repeat=?,updated=? WHERE id=? AND owner=?').bind(v.title,v.date,v.endDate,v.time,v.endTime,v.allDay,v.category,v.location,v.note,v.author,v.repeat,Date.now(),id,owner).run();
 }
 return reply({ok:true});
 }catch(e){return Response.json({error:e instanceof Error?e.message:'일정을 저장하지 못했어요.'},{status:400,headers:noStore})}
}
export const POST=mutate;
export const PATCH=mutate;
export const DELETE=mutate;


