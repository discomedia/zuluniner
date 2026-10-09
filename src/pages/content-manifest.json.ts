import {loadPublicContent} from '../api/public-content';
export async function GET() {
 const {aircraft,posts,snapshot_at}=await loadPublicContent();
 const summary=(rows:Array<{slug:string;title:string}>)=>rows.map(({slug,title})=>({slug,title}));
 return Response.json({snapshot_at,aircraft:summary(aircraft),posts:summary(posts)});
}
