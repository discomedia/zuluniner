import { AsyncLocalStorage } from 'node:async_hooks';
import { neon, types } from '@neondatabase/serverless';

type RuntimeEnv = Env & { DATABASE_URL: string; OWNER_PROFILE_IDS: string; GITHUB_DEPLOY_TOKEN: string; UPLOAD_SIGNING_SECRET: string; MIGRATION_SECRET?: string; OAUTH_REDIRECT_URIS?: string; IMAGE_IMPORT_HOSTS?: string };
const context = new AsyncLocalStorage<RuntimeEnv>();
export function withEnvironment<T>(env: RuntimeEnv, action: () => T): T { return context.run(env, action); }
export function environment() { const env = context.getStore(); if (!env) throw new Error('Request environment unavailable.'); return env; }
// Date loses Postgres microseconds, making an unchanged updated_at fail optimistic checks.
export const parseTimestamp = (value:string) => value.replace(' ','T').replace(/([+-]\d{2})$/,'$1:00');
export async function query<T>(statement: string, values: unknown[] = []): Promise<T[]> {
  const rows = await neon(environment().DATABASE_URL).query(statement, values,{types:{getTypeParser:(oid,format)=>oid===1184 || oid===1114 ? parseTimestamp : types.getTypeParser(oid,format)}});
  return JSON.parse(JSON.stringify(rows)) as T[];
}
export type { RuntimeEnv };
