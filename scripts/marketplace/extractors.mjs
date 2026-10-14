/* global document, location, URL */
// Fixed DOM readers shared by supported browser capture and direct HTML parsing.
export const extractController = () => {const text=s=>document.querySelector(s)?.innerText?.trim()||null;const metadata=Object.fromEntries(Array.from(document.querySelectorAll('.detail__specs-label')).map(e=>[e.innerText.trim(),e.nextElementSibling?.innerText||null]));return {url:location.href,title:text('h1'),html:document.documentElement.outerHTML,source_text:document.body.innerText,metadata,price_text:text('.listing-prices__retail-price'),location:text('.detail__machine-location'),category:text('.detail__category'),seller:text('.dealer-contact__branch-name'),seller_contact_name:text('.dealer-contact__name'),seller_location:text('.dealer-contact__location'),currency:Array.from(document.querySelectorAll('select')).map(e=>({value:e.value,label:e.getAttribute('aria-label'),id:e.id})),images:Array.from(document.querySelectorAll('img[data-fullscreen]')).map(e=>({source_url:e.getAttribute('data-fullscreen'),caption:e.alt})),links:Array.from(document.querySelectorAll('a[href]')).map(e=>({url:e.href,text:e.innerText})),dates:Array.from(document.querySelectorAll('time,[datetime]')).map(e=>e.outerHTML)};};
export const extractTap = () => {
  const tidy = value => value?.replace(/\s+/g, ' ').trim() || null;
  const metadata = {};
  const keys = {'Sale Status:':'sale_status','Year:':'year','Make/Model:':'make_model','Registration #:':'registration','Serial #:':'serial','Location:':'location','Total Time:':'total_time','Engine 1 Time:':'engine_1_time','Engine 2 Time:':'engine_2_time','Prop 1 Time:':'prop_1_time','Prop 2 Time:':'prop_2_time','Useful Load:':'useful_load','Condition:':'condition','Year Painted:':'year_painted','Interior Year:':'interior_year','Flight Rules:':'flight_rules','# of Seats:':'seats'};
  for (const label of document.querySelectorAll('li > label, #general_specs p > label')) {
    const key = keys[tidy(label.textContent)];
    if (key) metadata[key] = tidy(label.parentElement.textContent.replace(label.textContent, ''));
  }
  metadata.make = tidy(document.querySelector('.makeModel [itemprop="manufacturer"]')?.textContent);
  metadata.model = metadata.make_model?.startsWith(metadata.make + ' ') ? metadata.make_model.slice(metadata.make.length + 1) : metadata.make_model;
  const body = document.body.innerText;
  metadata.price_display = body.match(/(?:\$[\d,.]+\s*(?:USD|CAD|AUD|EUR|GBP)|Call for Price|Price Reduced|Contact for Price)/i)?.[0] || null;
  const rawPrice = tidy(document.querySelector('[itemprop="price"]')?.textContent);
  metadata.price = rawPrice && /^\d+(\.\d+)?$/.test(rawPrice) ? Number(rawPrice) : null;
  metadata.currency = metadata.price_display?.match(/USD|CAD|AUD|EUR|GBP/)?.[0] || null;
  if(metadata.price_display){const start=body.indexOf(metadata.price_display),end=body.indexOf('\n\n',start);if(start>=0&&end>start&&end-start<=300)metadata.price_display=body.slice(start,end).trim();}
  const seller = document.querySelector('#seller-info-area');
  metadata.seller = tidy(seller?.querySelector('.sellerName')?.textContent);
  metadata.contact_name = tidy(seller?.querySelector('p[itemprop="name"]')?.textContent);
  metadata.seller_address = Array.from(seller?.querySelectorAll('[itemprop="address"]') || []).map(a=>tidy(a.textContent)).filter(Boolean).join('\n') || null;
  metadata.phone_links = Array.from(seller?.querySelectorAll('a[href^="tel:"]') || []).map(a=>a.href);
  const sections = Array.from(document.querySelectorAll('.btm-detail-box')).filter(x=>x.id!=='general_specs' && x.id!=='additional_classifications').map(x=>({id:x.id,heading:tidy(x.querySelector('h3')?.textContent),text:x.querySelector('pre')?.textContent?.trim() || ''})).filter(x=>x.text);
  metadata.additional_classifications = tidy(document.querySelector('#additional_classifications')?.textContent?.replace('Additional Classifications',''));
  const unique = list => list.filter((x,i,a)=>a.findIndex(y=>y.source_url===x.source_url)===i);
  const images = unique(Array.from(document.querySelectorAll('#photos a[href]')).filter(a=>a.href.startsWith('https:') && !a.href.includes('trade-a-plane.com/search') && !/display-asset\?id$/.test(a.href) && a.querySelector('img')).map(a=>({source_url:a.href,caption:tidy(a.querySelector('img')?.getAttribute('alt'))})));
  const emptyGallery = Array.from(document.querySelectorAll('#photos a[href]')).filter(a=>/display-asset\?id$/.test(a.href)).map(a=>({source_url:a.href,reason:'Empty source asset ID; browser gallery exposes /display-asset?id for both image and link. No identifiable photo URL.'}));
  if(emptyGallery.length&&!images.length)metadata.gallery_note='No identifiable source photos exposed; empty asset-ID placeholder.';
  const attachments = unique(Array.from(document.querySelectorAll('#docs a[href]')).filter(a=>a.href.startsWith('https:')).map(a=>({source_url:a.href,caption:tidy(a.getAttribute('title'))||tidy(a.textContent)||tidy(a.querySelector('img')?.getAttribute('alt'))})));
  return {schema_version:1,url:location.href,title:tidy(document.querySelector('h1')?.textContent),metadata,description:sections.map(s=>s.heading+'\n'+s.text).join('\n\n'),sections,images,attachments,unavailable_assets:emptyGallery,source_text:body,canonical_url:document.querySelector('link[rel="canonical"]')?.href || null,source_id:new URL(location.href).searchParams.get('listing_id')};
};
export const extractFeed = () => ({heading:document.querySelector('h2')?.innerText,text:document.body.innerText,items:[...document.querySelectorAll('.classified_single[data-adid]')].map((el,i)=>({source_id:el.getAttribute('data-adid'),position:i+1,title:el.querySelector('.listing_header')?.innerText,url:el.querySelector('.listing_header')?.href,price_text:el.querySelector('.price')?.innerText??null,action:el.querySelector('.action_phrase')?.innerText,description:el.querySelector('.body')?.innerText,contact:el.querySelector('.contact')?.innerText,text:el.innerText,links:[...el.querySelectorAll('a')].map(a=>({text:a.innerText,url:a.href})),html:el.outerHTML})),next:[...document.querySelectorAll('a')].find(a=>a.innerText.includes('Next Page'))?.href});

export const extractGallery = ()=>({heading:document.querySelector('h2')?.innerText,text:document.body.innerText,images:[...document.querySelectorAll('img')].filter(i=>i.src.includes('/listing_images/')).map(i=>({url:i.src,caption:i.closest('div')?.innerText??null,html:i.parentElement.outerHTML})),zoom:[...document.querySelectorAll('a[href*="listing_images_zoom"]')].map(a=>({url:a.href,html:a.parentElement.outerHTML})),html:document.documentElement.outerHTML});

export const extractZoom = ()=>({text:document.body.innerText,images:[...document.querySelectorAll('img.zoomimg')].map(i=>({url:i.src,image_id:i.id})),html:document.documentElement.outerHTML});
