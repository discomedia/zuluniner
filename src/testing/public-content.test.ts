import { test } from 'node:test';
import assert from 'node:assert/strict';
import { filterAircraft, filtersFromParams } from '../lib/aircraft-search';
import type { Aircraft } from '../types';

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
