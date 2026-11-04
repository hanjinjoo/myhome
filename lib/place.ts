export function placeInfo(value:string){
 const raw=value||'',match=raw.match(/https:\/\/[^\s]+/);let url='',lat:number|undefined,lon:number|undefined;
 if(match)try{const u=new URL(match[0]);if(['naver.com','naver.me','kakao.com','kko.to','google.com','goo.gl','maps.app.goo.gl','openstreetmap.org'].some(h=>u.hostname===h||u.hostname.endsWith('.'+h))){url=u.href;if(u.hostname.endsWith('openstreetmap.org')){const a=Number(u.searchParams.get('mlat')),b=Number(u.searchParams.get('mlon'));if(u.searchParams.has('mlat')&&u.searchParams.has('mlon')&&Math.abs(a)<=90&&Math.abs(b)<=180){lat=a;lon=b}}}}catch{}
 const name=(url?raw.replace(match![0],''):raw).trim()||'선택한 위치';
 return {name,url:url||'https://map.naver.com/p/search/'+encodeURIComponent(raw),lat,lon};
}
