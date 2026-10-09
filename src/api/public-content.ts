import { neon } from '@neondatabase/serverless';
import type { Aircraft, AircraftPhoto } from '@/types';
import type { Tables } from './schema';
export type PublicAircraft = Aircraft & {photos:AircraftPhoto[];user:{name:string;company:string|null;phone:string|null;email:string}};
export type PublicPost = Tables<'blog_posts'> & {author:{name:string;company:string|null}};
export type PublicContent = {aircraft:PublicAircraft[];posts:PublicPost[];snapshot_at:string};
// Build-only snapshot. Public pages never query the database at request time.
let snapshot:Promise<PublicContent> | undefined;
export function loadPublicContent():Promise<PublicContent> {
 if(!snapshot)snapshot=(async()=>{
  const url=import.meta.env.DATABASE_URL || process.env.DATABASE_URL;if(!url)throw new Error('DATABASE_URL is required to build published content.');
  const sql=neon(url);
  const [snapshotTime,aircraft,posts]=await sql.transaction([
   sql.query('SELECT to_json(now()) AS snapshot_at'),
   sql.query(`SELECT a.*,json_build_object('name',u.name,'company',u.company,'phone',u.phone,'email',u.email) AS "user",coalesce((SELECT json_agg(p ORDER BY p.display_order) FROM aircraft_photos p WHERE p.aircraft_id=a.id),'[]'::json) AS photos FROM aircraft a JOIN users u ON u.id=a.user_id WHERE a.status='active' ORDER BY a.created_at DESC`),
   sql.query(`SELECT b.*,json_build_object('name',u.name,'company',u.company) AS author FROM blog_posts b JOIN users u ON u.id=b.author_id WHERE b.published=true ORDER BY b.published_at DESC NULLS LAST,b.created_at DESC`),
  ],{isolationLevel:'RepeatableRead',readOnly:true});
  return JSON.parse(JSON.stringify({aircraft,posts,snapshot_at:snapshotTime[0].snapshot_at})) as PublicContent;
 })();
 return snapshot;
}
