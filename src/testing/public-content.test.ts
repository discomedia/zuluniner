import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterAircraft, filtersFromParams } from '../lib/aircraft-search';
import type { Aircraft } from '../types';
import { formatAircraftPrice } from '../lib/utils';
import { renderToStaticMarkup } from 'react-dom/server';
import { AircraftStructuredData } from '../components/seo/StructuredData';

const aircraft = (title: string, price: number, year: number, make: string, engine_type: string, created_at: string): Aircraft => ({
  id: title, title, price, year, make, model: 'Test', engine_type, created_at,
  slug: title, description: null, hours: null, avionics: null, airport_code: null, city: null,
  country: null, status: 'active', user_id: 'seller', updated_at: null,
});
const inventory = [
  aircraft('Cessna Skyhawk', 100000, 1982, 'Cessna', 'Single Piston', '2025-01-01'),
  aircraft('Piper Comanche', 200000, 1990, 'Piper', 'Single Piston', '2025-02-01'),
  aircraft('MCP demo', 0, 2000, 'Demo', 'Electric', '2025-03-01'),
];

test('static inventory search applies combined filters and preserves free demo prices', () => {
  assert.deepEqual(filterAircraft(inventory, { query: 'SKYHAWK', priceMax: 100000, yearMin: 1982 }, 'newest').map(a => a.title), ['Cessna Skyhawk']);
  assert.deepEqual(filterAircraft(inventory, { priceMax: 0 }, 'newest').map(a => a.title), ['MCP demo']);
  assert.deepEqual(filterAircraft(inventory, { engineType: 'Electric' }, 'newest').map(a => a.title), ['MCP demo']);
  assert.deepEqual(filterAircraft(inventory, { make: 'Piper', yearMax: 1989 }, 'newest'), []);
});

test('inventory sorting changes order without mutating the cached snapshot', () => {
  assert.deepEqual(filterAircraft(inventory, {}, 'price_high').map(a => a.price), [200000, 100000, 0]);
  assert.deepEqual(filterAircraft(inventory, {}, 'oldest').map(a => a.year), [1982, 1990, 2000]);
  assert.deepEqual(inventory.map(a => a.price), [100000, 200000, 0]);
});

test('bookmarked searches accept zero bounds and ignore malformed numbers', () => {
  assert.deepEqual(filtersFromParams(new URLSearchParams('q=Cessna&price_max=0&year_min=oops&make=Cessna&engine_type=Single+Piston')), {
    query: 'Cessna', make: 'Cessna', engineType: 'Single Piston', priceMax: 0,
  });
});

test('unquoted prices and unknown years stay visible but do not match numeric bounds', () => {
  const unknown = {...inventory[0], id:'unknown', price:null, year:null, make:null};
  const items = [...inventory, unknown];
  for (const sort of ['price_low','price_high'] as const) {
    assert.equal(filterAircraft(items, {}, sort).at(-1)?.id, 'unknown');
  }
  for (const filters of [{priceMin:0}, {priceMax:500000}, {yearMin:1900}, {yearMax:2100}]) {
    assert.equal(filterAircraft(items, filters, 'newest').some(a => a.id === 'unknown'), false);
  }
  assert.equal(filterAircraft(items, {}, 'newest').length, 4);
  assert.equal(formatAircraftPrice(unknown), 'Contact for price');
  assert.equal(formatAircraftPrice({...unknown,price_text:'$75,000 (currency unspecified)'}), '$75,000 (currency unspecified)');
  assert.equal(formatAircraftPrice(inventory[2]), '$0');
});

test('search metadata omits unquoted offers and attributes imported offers to their source', () => {
  const source = {...inventory[0],price:null,year:null,make:null,source_url:'https://example.com/ad',source_name:'Source',source_seller:'Original seller'};
  const metadata = (aircraft: Aircraft) => JSON.parse(renderToStaticMarkup(AircraftStructuredData({aircraft})).replace(/^<script[^>]*>|<\/script>$/g,''));
  const unknown = metadata(source);
  assert.equal('offers' in unknown, false);
  assert.equal('manufacturer' in unknown, false);
  assert.equal(unknown.additionalProperty.some((p: {name:string}) => p.name === 'Year'), false);
  const priced = metadata({...source,price:625000});
  assert.equal(priced.offers.priceCurrency, 'USD');
  assert.equal(priced.offers.seller.name, 'Original seller');
  assert.equal(priced.offers.url, source.source_url);
});
