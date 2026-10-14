import test from 'node:test';
import assert from 'node:assert/strict';
import {captureQueue,completeDiscovery} from './progress.mjs';
const item=id=>({id:String(id),url:`https://www.controller.com/listing/for-sale/${id}/aircraft`});
test('a pending ad does not freeze healthy discovery or disappear from the next daily queue',()=>{
 const state={source:'controller',last_successful_run_at:'2026-10-13T00:00:00Z',listings:{old:{source_id:'1',source_url:item(1).url,zuluniner_id:'kept-id'}},pending_capture_candidates:[item(2)]};
 const next=completeDiscovery(state,{at:'2026-10-15T00:00:00Z',complete:true,evidence:'current-run/discovery.json',pending:[item(3)]});
 assert.equal(next.last_successful_discovery_at,'2026-10-15T00:00:00Z');assert.equal(next.last_successful_run_at,state.last_successful_run_at);assert.equal(next.listings.old.zuluniner_id,'kept-id');
 assert.deepEqual(captureQueue(next,[item(4),item(1)]).map(row=>row.id),['4','1','2','3']);
});
test('incomplete discovery never advances its boundary and source identities cannot be mixed',()=>{
 const state={source:'controller',listings:{}};
 assert.throws(()=>completeDiscovery(state,{at:'2026-10-15T00:00:00Z',complete:false,evidence:'partial.json'}),/incomplete/);
 assert.throws(()=>captureQueue(state,[{id:'3',url:item(2).url}]),/identity mismatch/);
 assert.throws(()=>captureQueue(state,[{id:'3',url:'https://example.org/listing/for-sale/3/aircraft'}]),/Wrong source/);
});
