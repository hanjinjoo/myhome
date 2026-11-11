import {env} from 'cloudflare:workers';
import {allowedOrigin} from '../../../lib/visitor';
import {familyMembers} from '../../../lib/family';
import {moodDay,moodOptions} from '../../../lib/moods';
const headers={'Cache-Control':'no-store'};
export async function GET(){try{const day=moodDay();const rows=await env.DB!.prepare('SELECT member,mood FROM family_moods WHERE day=?').bind(day).all();return Response.json({day,moods:Object.fromEntries(rows.results.map(r=>[r.member,r.mood]))},{headers})}catch{return Response.json({error:'이모지를 불러오지 못했어요.'},{status:503,headers})}}
export async function POST(r:Request){
 if(!allowedOrigin(r))return Response.json({error:'허용되지 않은 요청이에요.'},{status:403,headers});
 try{const {member,mood,day}=await r.json() as {member:string;mood:string;day:string};
 if(!familyMembers.some(m=>m.id===member)||!(mood===''||moodOptions.some(m=>m.id===mood)))return Response.json({error:'이모지를 다시 선택해 주세요.'},{status:400,headers});
 if(day!==moodDay())return Response.json({error:'날짜가 바뀌었어요. 다시 선택해 주세요.'},{status:409,headers});
 await env.DB!.prepare('INSERT INTO family_moods(member,day,mood,updated) VALUES(?,?,?,?) ON CONFLICT(member) DO UPDATE SET day=excluded.day,mood=excluded.mood,updated=excluded.updated').bind(member,day,mood,Date.now()).run();
 return Response.json({ok:true,day,mood},{headers});
 }catch{return Response.json({error:'저장하지 못했어요. 다시 눌러주세요.'},{status:503,headers})}
}
