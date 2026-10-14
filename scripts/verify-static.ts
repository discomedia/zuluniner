import {readFile} from 'node:fs/promises';
import {manifestSchema,verifyStaticSite} from './static-verifier';
const origin=new URL(process.argv[2]||'https://zuluniner.com').origin;
const expected=manifestSchema.parse(JSON.parse(await readFile('dist/content-manifest.json','utf8')));
const report=await verifyStaticSite({origin,expected,onProgress:console.log});
console.log(`${report.routes} public routes and protected MCP verified (${report.requests} requests, ${report.retries} transient retries).`);
