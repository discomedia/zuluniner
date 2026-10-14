/* global URL */
const sources={controller:'www.controller.com','trade-a-plane':'www.trade-a-plane.com',barnstormers:'www.barnstormers.com'};
function candidate(source,item){
 const id=String(item.id||item.source_id||''),url=item.url||item.source_url;
 if(!/^\d+$/.test(id)||!url||!sources[source])throw Error('Missing stable source identity');
 const parsed=new URL(url);
 if(parsed.protocol!=='https:'||parsed.hostname!==sources[source]||parsed.username||parsed.password)throw Error('Wrong source URL');
 const observed=source==='controller'?parsed.pathname.match(/\/(?:for-sale|for-fractional-ownership)\/(\d+)\//)?.[1]:source==='barnstormers'?parsed.pathname.match(/\/classified-(\d+)(?:-|\.)/)?.[1]:parsed.searchParams.get('listing_id');
 if(observed!==id)throw Error('Source URL identity mismatch');
 return {id,url};
}
export function captureQueue(state,qualifiedDiscovery){
 const rows=[...qualifiedDiscovery,...(state.discovery_checkpoint?.pending||[]),...(state.pending_capture_candidates||[]),...Object.values(state.listings).filter(row=>row.zuluniner_id||row.archive_path)];
 const queue=new Map();for(const row of rows){const item=candidate(state.source,row);if(!queue.has(item.id))queue.set(item.id,item);}
 return [...queue.values()];
}
export function completeDiscovery(state,{at,complete,evidence,pending=[],resolvedIds=[]}){
 if(!complete||!Number.isFinite(Date.parse(at))||!evidence)throw Error('Cannot advance incomplete discovery');
 if(state.last_successful_discovery_at&&Date.parse(at)<Date.parse(state.last_successful_discovery_at))throw Error('Discovery checkpoint cannot move backwards');
 const resolved=new Set(resolvedIds.map(String)),backlog=new Map();
 for(const item of [...(state.discovery_checkpoint?.pending||[]),...(state.pending_capture_candidates||[]),...pending]){const row=candidate(state.source,item);if(!resolved.has(row.id))backlog.set(row.id,row);}
 // Discovery coverage is independent of optional assets or publication. Failed
 // details remain explicit queue members, so one bad ad cannot freeze the date
 // window and make every later run crawl an ever-growing historical interval.
 return {...state,last_successful_discovery_at:at,discovery_checkpoint:{at,evidence,complete:true,pending:[...backlog.values()]}};
}
