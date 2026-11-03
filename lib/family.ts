export const familyMembers=[
 {id:'dad',role:'아빠',name:'성필',color:'#2865a7',soft:'#eaf2fc',initial:'성'},
 {id:'mom',role:'엄마',name:'은실',color:'#a64e3f',soft:'#fbece7',initial:'은'},
 {id:'first',role:'첫째',name:'한진',color:'#7953a2',soft:'#f1ebf9',initial:'한'},
 {id:'second',role:'둘째',name:'은진',color:'#357448',soft:'#edf5e8',initial:'은'},
 {id:'third',role:'셋째',name:'현진',color:'#796512',soft:'#faf5dd',initial:'현'},
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
export function memberColor(ids:string[]){return ids.length===1?familyMembers.find(m=>m.id===ids[0])?.color||'#456c46':'#456c46'}
export function familyBandColor(ids:string[]){
 return ids.length===1?familyMembers.find(m=>m.id===ids[0])?.color||'#456c46':'#456c46';
}
