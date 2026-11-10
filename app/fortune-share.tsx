"use client";
import {useRef,useState} from 'react';
import {Copy,Share2} from 'lucide-react';
import type {dailyFortune} from '../lib/fortune';

export default function FortuneShare({fortune}:{fortune:ReturnType<typeof dailyFortune>}){
 const [status,S]=useState(''),[busy,B]=useState(false),[preview,P]=useState(false);
 const pending=useRef(false);
 const date=new Date(fortune.dateKey+'T12:00:00+09:00').toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric',weekday:'long',timeZone:'Asia/Seoul'});
 const text=[`✨ ${fortune.member.name}의 오늘 운세`,`${date} · 한국 시간`,'',`🌙 ${fortune.reading.title}`,fortune.reading.message,'','💫 오늘의 흐름',fortune.reading.body,'','💬 관계의 한마디',fortune.relationship,'',`💕 오늘의 가족 케미 · ${fortune.partner.name}`,fortune.conversation,'','🌱 오늘의 작은 미션',fortune.mission,'',`🍀 행운의 색: ${fortune.colorName} · 숫자: ${fortune.number}`,`행운의 발견: ${fortune.item}`,'','재미로 보는 우리 가족의 하루 이야기'].join('\n');
 async function copy(){
  if(pending.current)return;
  pending.current=true;B(true);S('');
  try{await navigator.clipboard.writeText(text);S('복사했어요. 카카오톡 채팅방에 붙여넣어 주세요.')}
  catch{P(true);S('자동 복사가 어려워요. 아래 내용을 길게 누르거나 전체 선택해서 복사해 주세요.')}
  finally{pending.current=false;B(false)}
 }
 async function share(){
  if(pending.current)return;
  if(!navigator.share){P(true);S('이 브라우저에서는 내용 복사를 이용해 주세요.');return}
  pending.current=true;B(true);S('');
  try{await navigator.share({text})}
  catch(error){if((error as Error).name!=='AbortError'){P(true);S('공유창을 열지 못했어요. 내용 복사로 보내주세요.')}}
  finally{pending.current=false;B(false)}
 }
 return <section className="fortuneShare" aria-label="오늘 운세 공유">
  <div className="fortuneShareActions"><button onClick={share} disabled={busy}><Share2 size={17}/>{busy?'잠시만요…':'오늘 운세 공유하기'}</button><button onClick={copy} disabled={busy}><Copy size={16}/> 내용 복사</button></div>
  <p>공유창에서 카카오톡과 보낼 채팅방을 선택해 주세요.</p>
  <button className="fortuneSharePreview" aria-expanded={preview} onClick={()=>P(!preview)}>{preview?'공유 내용 접기':'공유 내용 미리보기'}</button>
  {preview&&<textarea aria-label="공유할 운세 내용" readOnly value={text} rows={10} onFocus={e=>e.currentTarget.select()}/>}
  <p className="fortuneShareStatus" role="status">{status}</p>
 </section>;
}
