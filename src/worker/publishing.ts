import { environment, query } from './context';
import { randomUUID } from 'node:crypto';
export async function requestPublish() {
  const env = environment(); const id = randomUUID();
  await query('INSERT INTO site_publications(id,status) VALUES($1,$2)',[id,'queued']);
  try {
    const response=await fetch(`https://api.github.com/repos/${env.GITHUB_REPOSITORY}/actions/workflows/deploy.yml/dispatches`,{method:'POST',headers:{Authorization:`Bearer ${env.GITHUB_DEPLOY_TOKEN}`,'User-Agent':'ZuluNiner','Content-Type':'application/json','X-GitHub-Api-Version':'2022-11-28'},body:JSON.stringify({ref:env.DEPLOY_REF,inputs:{publication_id:id}})});
    if (!response.ok) throw new Error(`Build trigger returned HTTP ${response.status}.`);
    return {publication_id:id,status:'queued',public_changes_live:false};
  } catch {
    await query('UPDATE site_publications SET status=$2,finished_at=now() WHERE id=$1',[id,'failed']);
    return {publication_id:id,status:'failed',public_changes_live:false,message:'Content saved; build could not be queued. Retry publish_site.'};
  }
}
export async function publishStatus() {
  const [publication]=await query<{id:string;status:string;created_at:string;finished_at:string|null;deployment_url:string|null}>('SELECT * FROM site_publications ORDER BY created_at DESC LIMIT 1');
  return {publication:publication || null,public_changes_live:publication?.status==='deployed'};
}
