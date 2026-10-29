"use client";
import {useEffect,useRef,useState} from 'react';
export type DragCard={members:string[];label:string;color:string;eventId?:string};
type DragState={card:DragCard;x:number;y:number;date:string};
export function useFamilyDrag(onDrop:(card:DragCard,date:string)=>void){
 const [drag,setDrag]=useState<DragState|null>(null);
 const pending=useRef<{card:DragCard;x:number;y:number;active:boolean;touch:boolean;timer?:ReturnType<typeof setTimeout>}|null>(null);
 const drop=useRef(onDrop);drop.current=onDrop;
 const suppressed=useRef(0);
 function target(x:number,y:number){return document.elementFromPoint(x,y)?.closest<HTMLElement>('[data-calendar-date]')?.dataset.calendarDate||''}
 function cancel(){if(pending.current?.timer)clearTimeout(pending.current.timer);pending.current=null;setDrag(null)}
 function start(card:DragCard,x:number,y:number,touch:boolean){
  cancel();pending.current={card,x,y,active:false,touch};
  if(touch)pending.current.timer=setTimeout(()=>{if(pending.current){pending.current.active=true;setDrag({card,x,y,date:target(x,y)})}},400);
 }
 useEffect(()=>{
  const move=(x:number,y:number,touch:boolean,event:Event)=>{
   const p=pending.current;if(!p||p.touch!==touch)return;
   const distance=Math.hypot(x-p.x,y-p.y);
   if(!p.active){if(touch&&distance>8){cancel();return}if(!touch&&distance>5)p.active=true}
   if(p.active){if(event.cancelable)event.preventDefault();setDrag({card:p.card,x,y,date:target(x,y)});
    if(y<65)window.scrollBy(0,-16);else if(y>innerHeight-65)window.scrollBy(0,16);
   }
  };
  const finish=(x:number,y:number)=>{const p=pending.current;if(!p)return;const date=target(x,y);if(p.active){suppressed.current=Date.now()+400;if(date)drop.current(p.card,date)}cancel()};
  const mouse=(e:PointerEvent)=>{if(e.pointerType!=='touch')move(e.clientX,e.clientY,false,e)};
  const up=(e:PointerEvent)=>{if(e.pointerType!=='touch')finish(e.clientX,e.clientY)};
  const touch=(e:TouchEvent)=>{const t=e.touches[0];if(t)move(t.clientX,t.clientY,true,e)};
  const touchEnd=(e:TouchEvent)=>{const t=e.changedTouches[0];if(t)finish(t.clientX,t.clientY)};
  const key=(e:KeyboardEvent)=>{if(e.key==='Escape')cancel()};
  window.addEventListener('pointermove',mouse,{passive:false});window.addEventListener('pointerup',up);
  window.addEventListener('touchmove',touch,{passive:false});window.addEventListener('touchend',touchEnd);
  window.addEventListener('touchcancel',cancel);window.addEventListener('pointercancel',cancel);window.addEventListener('keydown',key);
  return()=>{cancel();window.removeEventListener('pointermove',mouse);window.removeEventListener('pointerup',up);window.removeEventListener('touchmove',touch);window.removeEventListener('touchend',touchEnd);window.removeEventListener('touchcancel',cancel);window.removeEventListener('pointercancel',cancel);window.removeEventListener('keydown',key)};
 },[]);
 return {drag,suppressClick:()=>Date.now()<suppressed.current,
  startMouse:(e:React.PointerEvent,card:DragCard)=>{if(e.pointerType!=='touch'&&e.button===0){e.stopPropagation();start(card,e.clientX,e.clientY,false)}},
  startTouch:(e:React.TouchEvent,card:DragCard)=>{const t=e.touches[0];if(t){e.stopPropagation();start(card,t.clientX,t.clientY,true)}},
 };
}
