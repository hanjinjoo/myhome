"use client";
import {useState} from 'react';
import {Share2,Copy,X} from 'lucide-react';
import {eventMembers,memberLabel} from '../lib/family';
type ShareEvent={id:string;title:string;date:string;endDate:string;time:string;endTime:string;allDay:number;location:string;participants:string[];category:string};
export default function TodayShare({events,today}:{events:ShareEvent[];today:string}){
 const [open,O]=useState(false),[status,S]=useState(''),[busy,B]=useState(false);
 if(!events.length)return null;
 const date=new Date(today+'T00:00:00Z').toLocaleDateString('ko-KR',{month:'long',day:'numeric',weekday:'long',timeZone:'UTC'});
 const text=['🌿 우리 가족 오늘 일정',date+' · 한국 시간','',...events.flatMap(e=>{
  const time=e.allDay?'하루 종일':e.time+(e.endTime?'~'+e.endTime:'');
  return ['• '+memberLabel(eventMembers(e))+' | '+time+' | '+e.title,...(e.location?['  📍 '+e.location]:[]),...(e.date!==e.endDate?['  '+e.date+' ~ '+e.endDate+' · 진행 중인 일정']:[])];
 }),'','📅 가족 달력','https://hanjinjoo.github.io/myhome/'].join('\n');
 async function copy(){try{await navigator.clipboard.writeText(text);S('복사했어요. 카카오톡의 나와의 채팅이나 가족방에 붙여넣어 주세요.')}catch{S('아래 요약 내용을 길게 누르거나 전체 선택해서 복사해 주세요.')}}
 async function share(){
  if(!navigator.share){S('이 브라우저는 공유창을 지원하지 않아요. 요약 복사를 이용해 주세요.');return}
  B(true);S('');try{await navigator.share({title:'우리 가족 오늘 일정',text});S('공유창에서 카카오톡과 보낼 채팅방을 선택해 주세요.')}catch(e){if((e as Error).name!=='AbortError')S('공유창을 열지 못했어요. 요약을 복사해서 카카오톡에 붙여넣어 주세요.')}finally{B(false)}
 }
 return <section className="todayShare"><button className="todayShareTrigger" onClick={()=>{O(!open);S('')}} aria-expanded={open}><Share2 size={16}/> 오늘 일정 {events.length}개 공유하기</button>{open&&<div className="todaySharePanel"><div><b>카카오톡으로 오늘 일정 보내기</b><button aria-label="일정 공유 접기" onClick={()=>O(false)}><X size={17}/></button></div><p>휴대폰 공유창에서 카카오톡을 고른 뒤, 나와의 채팅이나 가족 단톡방을 선택해 주세요.</p><textarea aria-label="공유할 오늘 일정 요약" readOnly value={text} rows={Math.min(12,events.length*3+6)} onFocus={e=>e.currentTarget.select()}/><div className="todayShareActions"><button onClick={share} disabled={busy}><Share2 size={16}/>{busy?'공유창 여는 중…':'공유창 열기'}</button><button onClick={copy}><Copy size={16}/> 요약 복사</button></div>{status&&<p role="status">{status}</p>}<small>오늘 일정만 포함해요. 자동 발송은 아니며, 전송할 채팅방은 직접 선택해요.</small></div>}</section>;
}
