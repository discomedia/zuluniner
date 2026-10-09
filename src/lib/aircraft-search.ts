import type { Aircraft, SearchFilters } from '@/types';

export type AircraftSort = 'newest' | 'oldest' | 'price_low' | 'price_high';

export function filterAircraft<T extends Aircraft>(inventory: T[], filters: SearchFilters, sort: AircraftSort): T[] {
  const query = filters.query?.trim().toLowerCase();
  const filtered = inventory.filter(aircraft =>
    (!query || [aircraft.title, aircraft.description, aircraft.make, aircraft.model].some(value => value?.toLowerCase().includes(query))) &&
    (filters.priceMin === undefined || aircraft.price >= filters.priceMin) &&
    (filters.priceMax === undefined || aircraft.price <= filters.priceMax) &&
    (filters.yearMin === undefined || aircraft.year >= filters.yearMin) &&
    (filters.yearMax === undefined || aircraft.year <= filters.yearMax) &&
    (!filters.make || aircraft.make === filters.make) &&
    (!filters.model || aircraft.model === filters.model) &&
    (!filters.engineType || aircraft.engine_type === filters.engineType)
  );
  return filtered.sort((a, b) => {
    if (sort === 'price_low') return a.price - b.price;
    if (sort === 'price_high') return b.price - a.price;
    const difference = Date.parse(b.created_at || '') - Date.parse(a.created_at || '');
    return sort === 'oldest' ? -difference : difference;
  });
}

export function filtersFromParams(params: URLSearchParams): SearchFilters {
  const filters: SearchFilters = {};
  const textFields = { q: 'query', make: 'make', model: 'model', engine_type: 'engineType' } as const;
  for (const [param, field] of Object.entries(textFields)) {
    const value = params.get(param);
    if (value) filters[field] = value;
  }
  const numberFields = { price_min: 'priceMin', price_max: 'priceMax', year_min: 'yearMin', year_max: 'yearMax' } as const;
  for (const [param, field] of Object.entries(numberFields)) {
    const value = params.get(param);
    if (value !== null && value !== '' && Number.isFinite(Number(value))) filters[field] = Number(value);
  }
  return filters;
}
