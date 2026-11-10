import {familyMembers} from './family';
import {readings,relationships,conversations,missions,colors,items} from './fortune-content';

const DAY=86400000;
export function koreaDateKey(now=new Date()){return new Date(now.getTime()+9*3600000).toISOString().slice(0,10)}
function hash(value:string){let h=2166136261;for(const c of value){h=Math.imul(h^c.charCodeAt(0),16777619)}return h>>>0}
function mod(n:number,size:number){return ((n%size)+size)%size}
// Fixed, shuffled decks give deterministic results without recent repeats or storage.
function deck<T>(values:T[],seed:string){const result=[...values];for(let i=result.length-1;i>0;i--){const j=hash(seed+':'+i)%(i+1);[result[i],result[j]]=[result[j],result[i]]}return result}
const storyDeck=deck(readings,'family-story-v1');
const relationDeck=deck(relationships,'family-relation-v1');
const missionDeck=deck(missions,'family-mission-v1');
const conversationDeck=deck(conversations,'family-talk-v1');
export function dailyFortune(memberId:string,dateKey=koreaDateKey()){
 const index=familyMembers.findIndex(m=>m.id===memberId);
 const day=Math.floor(Date.parse(dateKey+'T00:00:00Z')/DAY);
 if(index<0||!/^\d{4}-\d{2}-\d{2}$/.test(dateKey)||!Number.isFinite(day)||new Date(day*DAY).toISOString().slice(0,10)!==dateKey)throw new Error('Invalid fortune member or date');
 const seed=dateKey+':'+memberId+':v1';
 const partner=familyMembers[mod(index+1+mod(day,4),familyMembers.length)];
 const [colorName,colorHex]=colors[hash(seed+':color')%colors.length];
 return {dateKey,member:familyMembers[index],reading:storyDeck[mod(day+index*11,storyDeck.length)],relationship:relationDeck[mod(day+index*7,relationDeck.length)],partner,conversation:conversationDeck[mod(day+index*9,conversationDeck.length)],mission:missionDeck[mod(day+index*7,missionDeck.length)],colorName,colorHex,item:items[hash(seed+':item')%items.length],number:hash(seed+':number')%99+1};
}
