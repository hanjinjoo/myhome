export const familyMembers=[
 {id:'dad',role:'아빠',name:'성필',color:'#566c5c',soft:'#dce7dd',initial:'성'},
 {id:'mom',role:'엄마',name:'은실',color:'#866862',soft:'#eedfdb',initial:'은'},
 {id:'first',role:'첫째',name:'한진',color:'#726780',soft:'#e5dfec',initial:'한'},
 {id:'second',role:'둘째',name:'은진',color:'#5d7187',soft:'#dde6ef',initial:'은'},
 {id:'third',role:'셋째',name:'현진',color:'#7b7257',soft:'#eee8d4',initial:'현'},
];
export function eventMembers(e:{participants?:string[];category?:string;title?:string}):string[]{
 if(e.participants?.length)return e.participants;
 if(e.category==='birthday'){const m=familyMembers.find(m=>e.title?.startsWith(m.name+' 생일')||e.title?.startsWith(m.role+' 생일'));if(m)return [m.id]}
 return [];
}
export function birthdayTitle(e:{category?:string;title:string}){
 if(e.category!=='birthday')return e.title;
 const m=familyMembers.find(m=>e.title===m.role+' 생일');
 return m?m.name+' 생일':e.title;
}
export function memberLabel(ids:string[]){
 if(ids.length===5)return '온 가족';
 const names=familyMembers.filter(m=>ids.includes(m.id)).map(m=>m.name);
 return names.length>2?names[0]+' 외 '+(names.length-1)+'명':names.join('·')||'가족';
}
export function memberColor(ids:string[]){return ids.length===1?familyMembers.find(m=>m.id===ids[0])?.color||'#54766b':'#54766b'}
export function familyBandColor(ids:string[]){
 return ids.length===1?familyMembers.find(m=>m.id===ids[0])?.soft||'#dcece5':'#dcece5';
}
