export const githubOrigin='https://hanjinjoo.github.io';
export function allowedOrigin(request:Request) {
 const origin=request.headers.get('origin');
 return origin===new URL(request.url).origin||origin===githubOrigin;
}
export function visitorId(request:Request) {
 const header=request.headers.get('X-Family-Visitor');
 if(header && allowedOrigin(request) && /^[a-f0-9-]{36}$/.test(header))return header;
 return request.headers.get('cookie')?.match(/(?:^|; )family_visitor=([a-f0-9-]{36})(?:;|$)/)?.[1];
}
export function corsHeaders(request:Request) {
 const headers=new Headers();
 if(request.headers.get('origin')===githubOrigin){
  headers.set('Access-Control-Allow-Origin',githubOrigin);
  headers.set('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS');
  headers.set('Access-Control-Allow-Headers','Content-Type, X-Family-Visitor');
  headers.set('Access-Control-Max-Age','600');
  headers.set('Vary','Origin');
 }
 return headers;
}
