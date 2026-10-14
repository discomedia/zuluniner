import {readFile,appendFile,writeFile,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {atomicJson} from './capture.mjs';

export async function receiptStore(path) {
  let receipts={};
  try{receipts=JSON.parse(await readFile(path,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
  const journal=path+'.journal';let lines=[],raw='';
  try{raw=await readFile(journal,'utf8');lines=raw.split('\n');}catch(error){if(error.code!=='ENOENT')throw error;}
  let truncated=!!raw&&!raw.endsWith('\n');
  for(let index=0;index<lines.length;index++){
    if(!lines[index])continue;
    try{const {key,value}=JSON.parse(lines[index]);if(typeof key!=='string'||!value?.sha256)throw Error('Invalid receipt');receipts[key]=value;}
    catch(error){if(index!==lines.length-1)throw Error('Corrupt receipt journal: '+error.message);truncated=true;}
  }
  // Remove an interrupted trailing fragment before another append.
  if(truncated){await atomicJson(path,receipts);await writeFile(journal,'',{mode:0o600});}
  await mkdir(dirname(path),{recursive:true});
  let queue=Promise.resolve(),appends=0,snapshots=0;
  return {
    receipts,
    async set(key,value){receipts[key]=value;queue=queue.then(()=>appendFile(journal,JSON.stringify({key,value})+'\n',{mode:0o600}));await queue;appends++;},
    async checkpoint(){await queue;await atomicJson(path,receipts);snapshots++;await writeFile(journal,'',{mode:0o600});},
    stats:()=>({journal_appends:appends,full_snapshots:snapshots})
  };
}
