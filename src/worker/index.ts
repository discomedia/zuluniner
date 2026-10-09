import { environment, withEnvironment, type RuntimeEnv } from './context';
import { authenticatedHandler } from '@/mcp/server';
import { readBounded, acceptSignedUpload } from '@/mcp/images';
import { siteOrigin } from '@/mcp/auth';
import * as authorize from '@/routes/oauth/authorize/route';
import * as token from '@/routes/oauth/token/route';
import * as register from '@/routes/oauth/register/route';
import * as revoke from '@/routes/oauth/revoke/route';
import * as consent from '@/routes/api/oauth/request/route';
import * as serverMetadata from '@/routes/.well-known/oauth-authorization-server/route';
import * as resourceMetadata from '@/routes/.well-known/oauth-protected-resource/route';
const routes: Record<string, Partial<Record<string,(request:Request)=>Response|Promise<Response>>>> = {
 '/oauth/authorize':authorize,'/oauth/token':token,'/oauth/register':register,'/oauth/revoke':revoke,'/api/oauth/request':consent,
 '/.well-known/oauth-authorization-server':serverMetadata,'/.well-known/oauth-protected-resource':resourceMetadata,'/.well-known/oauth-protected-resource/api/mcp':resourceMetadata,
};
async function serveImage(request:Request) {
  const url = new URL(request.url); const key=decodeURIComponent(url.pathname.slice('/images/'.length));
  if (!/^(aircraft-photos|blog-images)\//.test(key) || key.split('/').includes('..')) return new Response('Not found.',{status:404});
  const width=url.searchParams.get('w'); if(width && !['480','960','1600'].includes(width)) return new Response('Invalid image size.',{status:400});
  const cache=await caches.open('zuluniner-images');const cached=await cache.match(request);if(cached)return cached;
  const bucket=environment().MEDIA;
  const object=await bucket.get(width?`variants/${width}/${key}`:key) || (width?await bucket.get(key):null);
  if(!object)return new Response('Not found.',{status:404});
  const headers=new Headers({'Cache-Control':'public,max-age=31536000,immutable','X-Content-Type-Options':'nosniff'});object.writeHttpMetadata(headers);headers.set('ETag',object.httpEtag);
  return new Response(request.method==='HEAD'?null:object.body,{headers});
}
async function handle(request:Request) {
 const path=new URL(request.url).pathname; const origin=request.headers.get('origin');
 if(path.startsWith('/images/'))return serveImage(request);
 if(path==='/api/health') return Response.json({ok:true,architecture:'astro-static-workers-neon-r2'});
 if(path==='/api/images/upload' && request.method==='PUT')return acceptSignedUpload(request);
 if(path==='/api/mcp') {
  const allowed=[siteOrigin(),'https://chatgpt.com','https://chat.openai.com'];
  if(origin && !allowed.includes(origin))return new Response('Origin not allowed.',{status:403});
  if(request.method==='OPTIONS')return new Response(null,{status:204,headers:{'Access-Control-Allow-Origin':origin || siteOrigin(),'Access-Control-Allow-Methods':'GET,POST,DELETE,OPTIONS','Access-Control-Allow-Headers':'Authorization,Content-Type,MCP-Protocol-Version'}});
  if(request.method==='POST')request=new Request(request,{body:new Uint8Array(await readBounded(request.body,3*1024*1024))});
  const response=await authenticatedHandler(request);response.headers.set('Cache-Control','no-store');if(origin)response.headers.set('Access-Control-Allow-Origin',origin);return response;
 }
 const route=routes[path];if(route){if(!route[request.method])return new Response('Method not allowed.',{status:405}); if(request.method==='POST')request=new Request(request,{body:new Uint8Array(await readBounded(request.body,16384))});return route[request.method]!(request);}
 if(path.startsWith('/api/') || path.startsWith('/oauth/'))return new Response('Not found.',{status:404});
 return environment().ASSETS.fetch(request);
}
export default {
 async fetch(request:Request,env:RuntimeEnv,ctx:ExecutionContext) {
  return withEnvironment(env,async()=>{
   try {const response=await handle(request);if(new URL(request.url).pathname.startsWith('/images/') && response.ok && request.method==='GET')ctx.waitUntil(caches.open('zuluniner-images').then(cache=>cache.put(request,response.clone())));return response;}
   catch(error){console.error(JSON.stringify({event:'request_failed',path:new URL(request.url).pathname,message:error instanceof Error?error.message:'Unknown error'}));return Response.json({error:'Request could not be completed.'},{status:500,headers:{'Cache-Control':'no-store'}});}
  });
 }
};
