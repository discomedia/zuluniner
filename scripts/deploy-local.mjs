import process from 'node:process';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
// Local deployment reuses the existing configured Cloudflare credential without logging it.
const cloudflare=JSON.parse(readFileSync('data/cloudflare-env.json','utf8'));
execFileSync('node_modules/.bin/wrangler',process.argv.slice(2),{env:{...process.env,...cloudflare},stdio:'inherit'});
