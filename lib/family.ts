export const familyMembers=[
 {id:'dad',name:'아빠',color:'#538cc6',soft:'#eaf2fc',initial:'아'},
 {id:'mom',name:'엄마',color:'#d08575',soft:'#fbece7',initial:'엄'},
 {id:'first',name:'첫째',color:'#9b80bf',soft:'#f1ebf9',initial:'1'},
 {id:'second',name:'둘째',color:'#76a77d',soft:'#edf5e8',initial:'2'},
 {id:'third',name:'셋째',color:'#b8a14b',soft:'#faf5dd',initial:'3'},
];
export function eventMembers(e:{participants?:string[];category?:string;title?:string}):string[]{
 if(e.participants?.length)return e.participants;
 if(e.category==='birthday'){const m=familyMembers.find(m=>e.title?.startsWith(m.name+' 생일'));if(m)return [m.id]}
 return [];
}
export function memberLabel(ids:string[]){
 if(ids.length===5)return '온 가족';
 const names=familyMembers.filter(m=>ids.includes(m.id)).map(m=>m.name);
 return names.length>2?names[0]+' 외 '+(names.length-1)+'명':names.join('·')||'가족';
}
export function memberColor(ids:string[]){return ids.length===1?familyMembers.find(m=>m.id===ids[0])?.color||'#7c9c71':'#7c9c71'}
