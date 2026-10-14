/* global btoa, Response */
import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fingerprints, assetIdentity, validateDetail, parseCapture, mapPool, HttpSource, discoverBarnstormers} from './capture.mjs';
import {extractFeed} from './extractors.mjs';
import {missingObjects} from './media.mjs';

test('unchanged audit timestamps do not trigger imports; substantive changes do', () => {
  const detail={source_id:'1',title:'Cessna 172',description:'Full source wording',metadata:{price:120000},images:[{source_url:'https://example.org/photo.jpg'}],captured_at:'2026-10-13',html:'dynamic ads'};
  const again={...detail,captured_at:'2026-10-14',html:'different dynamic ads'};
  assert.deepEqual(fingerprints(detail),fingerprints(again));
  assert.notEqual(fingerprints(detail).content_hash,fingerprints({...again,metadata:{price:110000}}).content_hash);
  assert.notEqual(fingerprints(detail).assets_hash,fingerprints({...again,images:[]}).assets_hash);
});
test('CloudFront JSON key ordering does not redownload unchanged photos', () => {
  const a='https://assets.cloudfront.net/'+btoa(JSON.stringify({bucket:'photos',key:'1.jpg',edits:{resize:{width:700,fit:'contain'}}}));
  const b='https://assets.cloudfront.net/'+btoa(JSON.stringify({edits:{resize:{fit:'contain',width:700}},key:'1.jpg',bucket:'photos'}));
  assert.equal(assetIdentity(a),assetIdentity(b));
});
test('Barnstormers random image cache-busters are ignored without losing version changes', () => {
  const a='https://barnstormers.s3.amazonaws.com/media/listing_images/large/large_image_123_1_1714533984.jpeg';
  assert.equal(assetIdentity(a+'?1349'),assetIdentity(a+'?4327'));
  assert.notEqual(assetIdentity(a+'?1349'),assetIdentity(a.replace('1714533984','1714533985')+'?1349'));
  assert.notEqual(assetIdentity('https://another.example/image.jpg?v=1'),assetIdentity('https://another.example/image.jpg?v=2'));
});
test('a source challenge or mismatched identity cannot become a source listing', () => {
  assert.throws(()=>validateDetail('controller',{id:'123'},{url:'https://www.controller.com/listing/for-sale/124/a',title:'Other ad',category:'Aircraft',metadata:{Description:'Test'}}),/mismatched/);
  assert.throws(()=>validateDetail('trade-a-plane',{id:'123'},{source_id:'123',title:'Access denied',metadata:{}}),/mismatched/);
  assert.throws(()=>validateDetail('trade-a-plane',{id:'123'},{source_id:'123',title:'Aircraft',metadata:{sale_status:'For Sale'},canonical_url:'https://www.trade-a-plane.com/search?listing_id=124'}),/canonical/);
});
test('HTTP parsing preserves source description, identity, price and absolute gallery links without running page scripts', async () => {
  const html='<html><body><h2>Most Recent Listings</h2><div class="classified_single" data-adid="123"><a class="listing_header" href="/classified-123-Aircraft.html">Aircraft</a><span class="price">$90,000</span><div class="body">Original description\nSecond paragraph</div><div class="contact">Seller • Posted October 13, 2026</div><a href="/listing_images.php?id=123">View Larger Images</a></div><script>throw Error("Must not execute")</script></body></html>';
  const parsed=await parseCapture(html,'https://www.barnstormers.com/listing.php',extractFeed);
  assert.equal(parsed.items[0].source_id,'123');
  assert.equal(parsed.items[0].price_text,'$90,000');
  assert.match(parsed.items[0].description,/Original description/);
  assert.equal(parsed.items[0].links.at(-1).url,'https://www.barnstormers.com/listing_images.php?id=123');
});
test('upload receipts skip only exact bytes already verified publicly', () => {
  const objects=[{key:'a',sha256:'123'},{key:'b',sha256:'456'},{key:'c',sha256:'789'}];
  const receipts={a:{sha256:'123',verified_at:'2026-10-14'},b:{sha256:'456'},c:{sha256:'changed',verified_at:'2026-10-14'}};
  assert.deepEqual(missingObjects(objects,receipts).map(x=>x.key),['b','c']);
});
test('bounded pool preserves source gallery order', async () => {
  assert.deepEqual(await mapPool([3,1,2],2,async n=>n*2),[6,2,4]);
});
test('blocked HTTP and redirects remain unknown rather than withdrawal signals', async () => {
  for (const status of [302,403,404,429,503]) {
    const client = new HttpSource({request: async () => new Response('Not a verified source listing',{status})});
    await assert.rejects(client.read('https://www.barnstormers.com/classified-123-Aircraft.html',extractFeed),/preserve public status/);
  }
});
test('Controller document-only changes are visible in delta detection', () => {
  const detail={title:'Aircraft',description:'Unchanged',images:[],links:[{url:'https://www.controller.com/doc.axd?id=1',text:'Logs'}]};
  assert.notEqual(fingerprints(detail).assets_hash,fingerprints({...detail,links:[{url:'https://www.controller.com/doc.axd?id=2',text:'Logs'}]}).assets_hash);
});
test('discovery uses source posting dates from the complete ad text and stops after covering overlap', async () => {
  const directory=await mkdtemp(join(tmpdir(),'zuluniner-discovery-test-'));
  let reads=0;
  const client={requests:0,read:async url=>{reads++;return {url,data:{heading:'Most Recent Listings (All Categories)',items:[{source_id:'123',contact:'Seller address',text:'Aircraft • Posted October 1, 2026'}],next:'https://www.barnstormers.com/listing.php?page=2'}};}};
  try {
    const report=await discoverBarnstormers({since:'2026-10-14T00:00:00Z',directory,client});
    assert.equal(report.complete,true);
    assert.equal(reads,1);
    assert.match(report.reason,/older/);
  } finally {await rm(directory,{recursive:true,force:true});}
});
