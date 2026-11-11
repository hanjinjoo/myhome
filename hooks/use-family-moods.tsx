"use client";
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {familyMembers} from '../lib/family';
import {apiFetch} from '../lib/client-api';
import {moodDay,moodOptions} from '../lib/moods';
export function useFamilyMoods(active:boolean){
 const [data,D]=useState<{day:string;moods:Record<string,string>}>({day:moodDay(),moods:{}}),[chosen,C]=useState(''),[error,E]=useState(''),[busy,B]=useState(false),[day,T]=useState(moodDay);
 const dialog=useRef<HTMLDialogElement>(null),trigger=useRef<HTMLButtonElement|null>(null),saving=useRef(false),revision=useRef(0);
 useEffect(()=>{if(!active){C('');return}let alive=true;async function refresh(){const today=moodDay();T(today);const version=revision.current;try{const r=await apiFetch('/api/moods');if(!r.ok)throw Error();const value=await r.json() as typeof data;if(alive&&!saving.current&&version===revision.current)D(value)}catch{/* Opening the picker still allows a retryable save. */}}void refresh();const timer=setInterval(()=>{if(document.visibilityState==='visible')void refresh()},30000);window.addEventListener('focus',refresh);return()=>{alive=false;clearInterval(timer);window.removeEventListener('focus',refresh)}},[active]);
 useEffect(()=>{C('')},[day]);
 useEffect(()=>{if(chosen){dialog.current?.showModal();return()=>{dialog.current?.close();trigger.current?.focus()}}},[chosen]);
 const selected=familyMembers.find(m=>m.id===chosen);
 async function save(mood:string){if(saving.current)return;saving.current=true;revision.current++;B(true);E('');try{const today=moodDay();const r=await apiFetch('/api/moods',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({member:chosen,mood,day:today})});const result=await r.json() as {error?:string};if(!r.ok)throw Error(result.error);D(old=>({day:today,moods:{...(old.day===today?old.moods:{}),[chosen]:mood}}));T(today);C('')}catch(e){E(e instanceof Error?e.message:'저장하지 못했어요.')}finally{saving.current=false;revision.current++;B(false)}}
 function button(id:string){const person=familyMembers.find(m=>m.id===id)!;const current=data.day===day?moodOptions.find(m=>m.id===data.moods[id]):undefined;return <button type="button" className={'familyMoodButton '+(!current?'unset':'')} aria-label={person.name+' 오늘 이모지 선택'+(current?' · '+current.label:'')} title={person.name+' 오늘 이모지 선택'} onPointerDown={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} onClick={e=>{e.stopPropagation();trigger.current=e.currentTarget;E('');C(id)}}>{current?.emoji||'🙂'}</button>}
 const sheet=chosen&&typeof document!=='undefined'?createPortal(<dialog className="familyMoodDialog" ref={dialog} aria-labelledby="moodTitle" onCancel={e=>{e.preventDefault();if(!busy)C('')}} onClick={e=>{if(e.target===e.currentTarget&&!busy)C('')}}><div><div className="moodHeading"><h2 id="moodTitle">{selected?.name}의 오늘 이모지</h2><button onClick={()=>C('')} disabled={busy} aria-label="이모지 선택 닫기">×</button></div><div className="moodChoices">{moodOptions.map(m=><button key={m.id} disabled={busy} aria-pressed={data.day===day&&data.moods[chosen]===m.id} onClick={()=>save(m.id)}><span>{m.emoji}</span><small>{m.label}</small></button>)}</div><button className="moodClear" disabled={busy} onClick={()=>save('')}>선택 지우기</button><p role="status">{busy?'저장 중…':error}</p></div></dialog>,document.body):null;
 return {button,sheet};
}

