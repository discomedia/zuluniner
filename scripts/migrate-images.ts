import {readFile,mkdir,writeFile,access} from 'node:fs/promises';
import {dirname} from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import sharp from 'sharp';
const run=promisify(execFile);
const backup=JSON.parse(await readFile('data/backups/pre-astro-migration.json','utf8')) as {objects:Record<string,Array<{path:string}>>};
const tasks:Array<{key:string;file:string}>=[];
for(const bucket of ['aircraft-photos','blog-images'])for(const {path} of backup.objects[bucket]) {
 const sourceFile=`data/backups/images/${bucket}/${path}`;await mkdir(dirname(sourceFile),{recursive:true});
 try{await access(sourceFile);}catch{
  const response=await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/${bucket}/${path}`,{headers:{Authorization:`Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,apikey:process.env.SUPABASE_SERVICE_ROLE_KEY!}});
  if(!response.ok)throw Error(`Image backup failed: ${response.status}`);await writeFile(sourceFile,new Uint8Array(await response.arrayBuffer()));
 }
 tasks.push({key:`${bucket}/${path}`,file:sourceFile});
 for(const width of [480,960,1600]){
  const file=`data/backups/variants/${width}/${bucket}/${path}.webp`;await mkdir(dirname(file),{recursive:true});await sharp(sourceFile).rotate().resize({width,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:85}).toFile(file);tasks.push({key:`variants/${width}/${bucket}/${path}`,file});
 }
}
let done=0;let bytes=0;let originalBytes=0;
const completed=new Set<string>();const progressFile='data/backups/r2-upload-progress.json';try{for(const key of JSON.parse(await readFile(progressFile,'utf8')))completed.add(key);}catch{/* First migration. */}
await Promise.all(Array.from({length:4},async()=>{
 while(tasks.length){const task=tasks.shift()!;const data=await readFile(task.file);bytes+=data.length;if(!task.key.startsWith('variants/'))originalBytes+=data.length;
  if(!completed.has(task.key)){const type=task.file.endsWith('.webp')?'image/webp':task.file.endsWith('.png')?'image/png':'image/jpeg';await run('node_modules/.bin/wrangler',['r2','object','put',`zuluniner-images/${task.key}`,'--remote','--file',task.file,'--content-type',type,'--cache-control','public,max-age=31536000,immutable'],{maxBuffer:1000000});completed.add(task.key);await writeFile(progressFile,JSON.stringify([...completed]));}
  done++;if(done%20===0)console.log(`${done}/140 objects migrated`);
 }
}));
console.log(JSON.stringify({objects:done,original_bytes:originalBytes,total_bytes:bytes}));
