import { readFile, writeFile } from 'node:fs/promises';
import { neon } from '@neondatabase/serverless';
const sql=neon(process.env.DATABASE_URL!);
const schema=await readFile('db/migrations/001_initial.sql','utf8');
// Preserve function bodies while splitting DDL into single prepared statements.
const bodies:string[]=[];
const split=schema.replace(/--[^\n]*/g,'').replace(/\$\$[\s\S]*?\$\$/g,body=>{bodies.push(body);return `__BODY_${bodies.length-1}__`;});
const statements=split.split(';').map(s=>s.trim()).filter(Boolean).map(s=>s.replace(/__BODY_(\d+)__/g,(_,i)=>bodies[Number(i)]));
await sql.transaction(statements.map(statement=>sql.query(statement)));
const backup=JSON.parse(await readFile('data/backups/pre-astro-migration.json','utf8')) as {tables:Record<string,Array<Record<string,unknown>>>};
for(const table of ['users','aircraft','aircraft_photos','blog_posts']) {
 for(const row of backup.tables[table]) {
  const entries=Object.entries(row);await sql.query(`INSERT INTO ${table}(${entries.map(([k])=>k).join(',')}) VALUES(${entries.map((_,i)=>`$${i+1}`).join(',')}) ON CONFLICT(id) DO NOTHING`,entries.map(([,v])=>v));
 }
 const [{count}]=await sql.query(`SELECT count(*)::int AS count FROM ${table}`);
 if(count!==backup.tables[table].length)throw Error(`${table} count mismatch`);
 console.log(`${table}: ${count} verified`);
}
await writeFile('data/backups/neon-migration-completed.json',JSON.stringify({at:new Date().toISOString(),tables:Object.fromEntries(Object.entries(backup.tables).map(([k,v])=>[k,v.length]))},null,2));
