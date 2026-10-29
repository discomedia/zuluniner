/* global fetch, AbortSignal */
import {createHash} from 'node:crypto';
import {AwsClient} from 'aws4fetch';

// Reuse the existing R2-authorized token. No token creation, permission change,
// credential logging or secret persistence is involved.
export async function createR2Client({accountId,token,accessKeyId,request=fetch}) {
  if (!/^[a-f0-9]{32}$/.test(accountId) || !token) throw Error('Invalid existing R2 operator credentials');
  if (!accessKeyId) {
    const response=await request('https://api.cloudflare.com/client/v4/user/tokens/verify',{headers:{Authorization:'Bearer '+token},signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw Error('Existing R2 token verification failed: HTTP '+response.status);
    const result=(await response.json()).result;
    if(result?.status!=='active'||!/^[a-f0-9]{32}$/.test(result.id))throw Error('Existing R2 token is not active');
    accessKeyId=result.id;
  }
  const client=new AwsClient({accessKeyId,secretAccessKey:createHash('sha256').update(token).digest('hex'),service:'s3',region:'auto',retries:0});
  const endpoint=`https://${accountId}.r2.cloudflarestorage.com/zuluniner-images/`;
  return async(key,options={})=>{
    if(!/^(?:variants\/(?:480|960)\/)?aircraft-photos\/mcp\/[a-z0-9-]+\.webp$/.test(key))throw Error('S3 key outside operator media scope');
    const signed=await client.sign(endpoint+key,options);
    return request(signed);
  };
}
