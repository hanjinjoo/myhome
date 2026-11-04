"use client";
import {useState} from 'react';
import {MapPin,ArrowUpRight,LocateFixed,Copy} from 'lucide-react';
import {placeInfo} from '../lib/place';
export function PlacePicker({value,onChange}:{value:string;onChange:(v:string)=>void}){
 const [status,S]=useState(''),[locating,L]=useState(false);
 function current(){if(!navigator.geolocation){S('이 브라우저에서는 위치를 확인할 수 없어요. 주소를 직접 적어주세요.');return}L(true);S('');navigator.geolocation.getCurrentPosition(p=>{const name=placeInfo(value).name;onChange((value?name+'\n':'현재 위치\n')+'https://www.openstreetmap.org/?mlat='+p.coords.latitude.toFixed(6)+'&mlon='+p.coords.longitude.toFixed(6));L(false)},()=>{L(false);S('위치를 가져오지 못했어요. 위치 권한을 확인하거나 직접 입력해 주세요.')},{timeout:10000,maximumAge:60000})}
 return <details className="placePicker" open={value?true:undefined}><summary><MapPin size={16}/>{value?'장소 확인·변경':'장소 추가'} <small>선택 사항</small></summary><div className="placePickerBody"><label>장소명·주소 또는 지도 공유 링크<textarea rows={2} maxLength={600} placeholder="예: 식당 이름과 주소, 네이버·카카오 지도 공유 링크" value={value} onChange={e=>onChange(e.target.value)}/></label><div className="placeButtons"><a href={'https://map.naver.com/p/search/'+encodeURIComponent(placeInfo(value).name==='선택한 위치'?'':placeInfo(value).name)} target="_blank" rel="noopener noreferrer">네이버 지도 검색 <ArrowUpRight size={13}/></a><a href={'https://map.kakao.com/?q='+encodeURIComponent(value?placeInfo(value).name:'')} target="_blank" rel="noopener noreferrer">카카오맵 검색 <ArrowUpRight size={13}/></a><button type="button" disabled={locating} onClick={current}><LocateFixed size={13}/>{locating?'확인 중…':'현재 위치 선택'}</button>{value&&<button type="button" onClick={()=>onChange('')}>장소 지우기</button>}</div><p>지도에서 장소를 검색하고 주소나 공유 링크를 붙여넣어 주세요. ‘우리 집’처럼 직접 적어도 돼요.</p>{status&&<p role="status">{status}</p>}{value&&<PlaceDetails value={value}/>}</div></details>
}
export function PlaceDetails({value}:{value:string}){
 const p=placeInfo(value);const [status,S]=useState('');
 async function copy(){try{await navigator.clipboard.writeText(value);S('장소를 복사했어요.')}catch{S('장소 내용을 길게 눌러 복사해 주세요.')}}
 return <section className="placeDetails"><b><MapPin size={16}/>{p.name}</b><div className="placeButtons"><a href={p.url} target="_blank" rel="noopener noreferrer">지도·길찾기 <ArrowUpRight size={13}/></a><button type="button" onClick={copy}><Copy size={13}/> 장소 복사</button></div>{p.lat!==undefined&&p.lon!==undefined&&<details><summary>지도 미리보기</summary><iframe title="일정 장소 지도" loading="lazy" referrerPolicy="no-referrer" src={'https://www.openstreetmap.org/export/embed.html?bbox='+[p.lon-.006,p.lat-.004,p.lon+.006,p.lat+.004].join(',')+'&layer=mapnik&marker='+p.lat+','+p.lon}/><small>© OpenStreetMap contributors</small></details>}{status&&<small role="status">{status}</small>}</section>
}
