import type { Category } from '../types';

// NOTE: All product counts are sample/demo data only. Actual inventory figures will be
// updated when the owner configures the store in the admin dashboard.

export const categories: Category[] = [
  {
    id: 'kirana',
    name: 'Kirana & Groceries',
    slug: 'kirana-groceries',
    description: 'Daily grocery essentials for your home',
    // Wheat grain / flour sack — clearly depicts kirana goods
    image: 'https://picsum.photos/seed/kirana-wheat/200/200',
    productCount: 120,
    color: '#8F1028',
    bgColor: '#FFF0F3',
  },
  {
    id: 'cold-drinks',
    name: 'Cold Drinks & Beverages',
    slug: 'cold-drinks-beverages',
    description: 'Refreshing drinks and beverages',
    // Colourful bottled drinks
    image: 'https://picsum.photos/seed/colddrinks-bottles/200/200',
    productCount: 48,
    color: '#1565C0',
    bgColor: '#E8F4FD',
  },
  {
    id: 'stationery',
    name: 'General Stationery',
    slug: 'general-stationery',
    description: 'Notebooks, pens and school supplies',
    image: 'https://picsum.photos/seed/stationery-notebook/200/200',
    productCount: 65,
    color: '#E65100',
    bgColor: '#FFF3E0',
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Soaps, shampoos & hygiene products',
    image: 'https://picsum.photos/seed/personalcare-soap/200/200',
    productCount: 80,
    color: '#6A1B9A',
    bgColor: '#F3E5F5',
  },
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'Cleaning supplies for every corner',
    image: 'https://picsum.photos/seed/cleaning-supplies/200/200',
    productCount: 42,
    color: '#00695C',
    bgColor: '#E0F2F1',
  },
  {
    id: 'snacks',
    name: 'Snacks & Confectionery',
    slug: 'snacks-confectionery',
    description: 'Chips, biscuits, chocolates & sweets',
    image: 'https://picsum.photos/seed/snacks-chips/200/200',
    productCount: 95,
    color: '#E91E63',
    bgColor: '#FCE4EC',
  },
  {
    id: 'daily-essentials',
    name: 'Daily Essentials',
    slug: 'daily-essentials',
    description: 'Everything you need every day',
    image: 'https://picsum.photos/seed/daily-essentials/200/200',
    productCount: 200,
    color: '#F57F17',
    bgColor: '#FFFDE7',
  },
];
