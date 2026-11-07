import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `₹${price.toLocaleString('en-IN')}`;
}

export function calculateDiscount(original: number, current: number): number {
  return Math.round(((original - current) / original) * 100);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export function getStarArray(rating: number): ('full' | 'half' | 'empty')[] {
  const stars: ('full' | 'half' | 'empty')[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push('full');
    else if (rating >= i - 0.5) stars.push('half');
    else stars.push('empty');
  }
  return stars;
}

/**
 * Generates an elegant SVG fallback data URI for grocery products
 * ensuring no broken image icons ever display.
 */
export function getGroceryFallbackImage(title?: string): string {
  const cleanTitle = (title || 'Shree Seva Product').slice(0, 24);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">
    <rect width="400" height="400" fill="#FFF9EF"/>
    <circle cx="200" cy="180" r="80" fill="#FFF0F3" stroke="#8F1028" stroke-width="2" stroke-dasharray="4 4"/>
    <path d="M170 180H230M200 150V210M165 170L175 210H225L235 170H165Z" stroke="#8F1028" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    <rect x="180" y="130" width="40" height="20" rx="4" fill="#FFC83D"/>
    <text x="200" y="295" text-anchor="middle" fill="#8F1028" font-family="system-ui, sans-serif" font-size="16" font-weight="700">SHREE SEVA</text>
    <text x="200" y="320" text-anchor="middle" fill="#777777" font-family="system-ui, sans-serif" font-size="13">${cleanTitle}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
