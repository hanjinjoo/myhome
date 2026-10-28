import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'우리집 마당 · 가족의 작은 이야기',description:'사진과 일상, 마음을 나누는 우리 가족만의 공간'};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="ko"><body>{children}</body></html>}
