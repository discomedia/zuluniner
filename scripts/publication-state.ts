import {neon} from '@neondatabase/serverless';
import {randomUUID} from 'node:crypto';
import {appendFileSync,readFileSync} from 'node:fs';
const sql=neon(process.env.DATABASE_URL!);
const status=process.argv[2];
if(!['building','deployed','failed'].includes(status))throw Error('Invalid publication status');
const id=process.env.PUBLICATION_ID || randomUUID();
if(status==='building') {
 await sql.query("INSERT INTO site_publications(id,status,deployment_url) VALUES($1,'building',$2) ON CONFLICT(id) DO UPDATE SET status='building',finished_at=NULL",[id,process.env.DEPLOYMENT_URL || null]);
 if(process.env.GITHUB_ENV)appendFileSync(process.env.GITHUB_ENV,`PUBLICATION_ID=${id}\n`);
}else if(status==='deployed') {
 // A snapshot also completes earlier requests coalesced by GitHub's queue.
 // Newer changes remain queued because they were not part of this snapshot.
 const {snapshot_at}=JSON.parse(readFileSync('dist/content-manifest.json','utf8'));
 await sql.query("UPDATE site_publications SET status='deployed',finished_at=now(),deployment_url=$1 WHERE created_at<=$2::timestamptz AND status<>'deployed'",[process.env.DEPLOYMENT_URL || null,snapshot_at]);
}else if(process.env.PUBLICATION_ID) {
 await sql.query("UPDATE site_publications SET status='failed',finished_at=now() WHERE id=$1",[id]);
}
