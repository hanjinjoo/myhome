export const moodOptions=[{id:'good',emoji:'😊',label:'좋아요'},{id:'happy',emoji:'🥰',label:'행복해요'},{id:'tired',emoji:'😴',label:'피곤해요'},{id:'busy',emoji:'🫠',label:'바빠요'},{id:'quiet',emoji:'☁️',label:'그냥 그래요'}];
export function moodDay(){return new Date(Date.now()+9*3600000).toISOString().slice(0,10)}
