"use client";
import {useEffect,useState} from 'react';
import {ArrowUpRight,Copy,X} from 'lucide-react';
const familyUrl='https://hanjinjoo.github.io/myhome/';
export default function ExternalBrowser(){
 const [kakao,K]=useState(false),[message,M]=useState('');
 function openBrowser(){window.location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(familyUrl)}
 useEffect(()=>{
  if(!/KAKAOTALK/i.test(navigator.userAgent))return;
  K(true);
  // One attempt per tab prevents loops when Kakao keeps the page inside its webview.
  try{if(sessionStorage.getItem('family-external-attempted'))return;sessionStorage.setItem('family-external-attempted','1')}catch{return}
  openBrowser();
 },[]);
 async function copy(){try{await navigator.clipboard.writeText(familyUrl);M('주소를 복사했어요. 기본 브라우저 주소창에 붙여넣어 주세요.')}catch{M('아래 주소를 길게 눌러 복사해 주세요.')}}
 if(!kakao)return null;
 return <section className="externalBrowserNotice" aria-label="외부 브라우저에서 열기"><button className="externalDismiss" aria-label="브라우저 안내 닫기" onClick={()=>K(false)}><X size={17}/></button><b>평소 쓰는 브라우저에서 열어보세요 🌿</b><p>전환되지 않았다면 아래 버튼을 눌러주세요.</p><div><button className="primary" onClick={openBrowser}>외부 브라우저로 열기 <ArrowUpRight size={15}/></button><button onClick={copy}><Copy size={14}/> 주소 복사</button></div><small>버튼이 작동하지 않으면 카카오톡의 메뉴 또는 공유 버튼에서 ‘다른 브라우저로 열기’를 선택해 주세요. 기기와 카카오톡 버전에 따라 메뉴 이름이 달라요.</small>{message&&<p role="status">{message}</p>}<a href={familyUrl}>{familyUrl}</a></section>;
}
