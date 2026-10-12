import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string | null): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatLocation(city: string | null, country: string | null): string {
  return [city, country].filter(Boolean).join(', ') || 'Not specified';
}

export function formatAircraftPrice(aircraft: {price: number | null; price_text?: string | null}): string {
  if (aircraft.price_text) return aircraft.price_text;
  if (aircraft.price === null) return 'Contact for price';
  return new Intl.NumberFormat('en-US', {style:'currency',currency:'USD',maximumFractionDigits:0}).format(aircraft.price);
}
