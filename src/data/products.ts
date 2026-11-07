import type { Product } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// IMPORTANT — DEMO DATA NOTICE
// All prices, ratings, review counts, stock levels, product counts and
// delivery timelines shown below are SAMPLE / PLACEHOLDER data only.
// They do not represent actual inventory or confirmed business information.
// Real data will be populated through the admin dashboard in a future phase.
// ─────────────────────────────────────────────────────────────────────────────

// ─── KIRANA & DAILY GROCERIES ───────────────────────────────────────────────

export const kiranaProducts: Product[] = [
  {
    id: 'k001',
    name: 'Aashirvaad Whole Wheat Atta',
    slug: 'aashirvaad-whole-wheat-atta',
    description: 'Superior quality whole wheat atta for soft rotis and chapatis.',
    price: 279,
    originalPrice: 299,
    discount: 7,
    // Wheat flour grains in burlap sack
    images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80'],
    category: 'kirana',
    subcategory: 'atta-flour',
    brand: 'Aashirvaad',
    unit: '5 kg',
    variants: [
      { id: 'k001-1', label: '1 kg', price: 65, originalPrice: 70, stock: 50 },
      { id: 'k001-2', label: '2 kg', price: 125, originalPrice: 135, stock: 30 },
      { id: 'k001-5', label: '5 kg', price: 279, originalPrice: 299, stock: 20 },
      { id: 'k001-10', label: '10 kg', price: 549, originalPrice: 590, stock: 10 },
    ],
    stock: 50,
    rating: 4.6,
    reviewCount: 1248,
    tags: ['atta', 'wheat flour', 'roti', 'chapati'],
    isBestSeller: true,
  },
  {
    id: 'k002',
    name: 'India Gate Basmati Rice',
    slug: 'india-gate-basmati-rice',
    description: 'Premium long-grain basmati rice with natural aroma.',
    price: 185,
    originalPrice: 210,
    discount: 12,
    // Long-grain white basmati rice bowl
    images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80'],
    category: 'kirana',
    subcategory: 'rice',
    brand: 'India Gate',
    unit: '5 kg',
    variants: [
      { id: 'k002-1', label: '1 kg', price: 42, originalPrice: 48, stock: 60 },
      { id: 'k002-5', label: '5 kg', price: 185, originalPrice: 210, stock: 25 },
      { id: 'k002-10', label: '10 kg', price: 360, originalPrice: 410, stock: 12 },
    ],
    stock: 60,
    rating: 4.4,
    reviewCount: 892,
    tags: ['rice', 'basmati', 'biryani'],
    isBestSeller: true,
  },
  {
    id: 'k003',
    name: 'Fortune Sunflower Oil',
    slug: 'fortune-sunflower-oil',
    description: 'Light and healthy cooking oil for everyday use.',
    price: 149,
    originalPrice: 165,
    discount: 10,
    // Clear bottle of golden cooking oil
    images: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80'],
    category: 'kirana',
    subcategory: 'cooking-oil',
    brand: 'Fortune',
    unit: '1 L',
    variants: [
      { id: 'k003-1', label: '1 L', price: 149, originalPrice: 165, stock: 40 },
      { id: 'k003-2', label: '2 L', price: 290, originalPrice: 320, stock: 20 },
      { id: 'k003-5', label: '5 L', price: 699, originalPrice: 780, stock: 8 },
    ],
    stock: 40,
    rating: 4.3,
    reviewCount: 567,
    tags: ['oil', 'sunflower oil', 'cooking oil'],
  },
  {
    id: 'k004',
    name: 'Tata Salt',
    slug: 'tata-salt',
    description: "India's most trusted iodised salt for healthy cooking.",
    price: 24,
    originalPrice: 26,
    discount: 8,
    // Pure white salt crystals in bowl
    images: ['https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=400&q=80'],
    category: 'kirana',
    subcategory: 'salt',
    brand: 'Tata',
    unit: '1 kg',
    variants: [
      { id: 'k004-1', label: '1 kg', price: 24, originalPrice: 26, stock: 100 },
      { id: 'k004-2', label: '2 kg', price: 46, originalPrice: 50, stock: 60 },
    ],
    stock: 100,
    rating: 4.7,
    reviewCount: 2104,
    tags: ['salt', 'iodised salt', 'tata'],
    isBestSeller: true,
  },
  {
    id: 'k005',
    name: 'Tata Sampann Chana Dal',
    slug: 'tata-sampann-chana-dal',
    description: 'High-protein chana dal with no added colour or preservatives.',
    price: 89,
    originalPrice: 99,
    discount: 10,
    // Yellow chana dal / lentils in bowl
    images: ['https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?w=400&q=80'],
    category: 'kirana',
    subcategory: 'dal-pulses',
    brand: 'Tata Sampann',
    unit: '1 kg',
    variants: [
      { id: 'k005-500g', label: '500 g', price: 48, originalPrice: 54, stock: 45 },
      { id: 'k005-1', label: '1 kg', price: 89, originalPrice: 99, stock: 30 },
    ],
    stock: 45,
    rating: 4.5,
    reviewCount: 438,
    tags: ['dal', 'chana dal', 'pulses', 'protein'],
  },
  {
    id: 'k006',
    name: 'Brooke Bond Taj Mahal Tea',
    slug: 'brooke-bond-taj-mahal-tea',
    description: 'Rich and fragrant tea for a perfect cup every time.',
    price: 219,
    originalPrice: 240,
    discount: 9,
    // Aromatic Indian tea leaves & glass of chai
    images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=80'],
    category: 'kirana',
    subcategory: 'tea-coffee',
    brand: 'Brooke Bond',
    unit: '500 g',
    variants: [
      { id: 'k006-250g', label: '250 g', price: 115, originalPrice: 125, stock: 35 },
      { id: 'k006-500g', label: '500 g', price: 219, originalPrice: 240, stock: 20 },
    ],
    stock: 35,
    rating: 4.8,
    reviewCount: 1876,
    tags: ['tea', 'chai', 'masala tea'],
    isBestSeller: true,
  },
  {
    id: 'k007',
    name: 'Britannia Marie Gold Biscuits',
    slug: 'britannia-marie-gold-biscuits',
    description: 'Light and crispy Marie biscuits, perfect with tea.',
    price: 35,
    originalPrice: 38,
    discount: 8,
    // Crispy golden tea biscuits
    images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80'],
    category: 'kirana',
    subcategory: 'biscuits',
    brand: 'Britannia',
    unit: '250 g',
    variants: [
      { id: 'k007-sm', label: '100 g', price: 15, originalPrice: 17, stock: 80 },
      { id: 'k007-md', label: '250 g', price: 35, originalPrice: 38, stock: 60 },
      { id: 'k007-lg', label: '500 g', price: 68, originalPrice: 74, stock: 40 },
    ],
    stock: 80,
    rating: 4.5,
    reviewCount: 3240,
    tags: ['biscuits', 'marie gold', 'tea time'],
    isBestSeller: true,
  },
  {
    id: 'k008',
    name: 'Uttam Sugar',
    slug: 'uttam-sugar',
    description: 'Pure refined white sugar for daily use.',
    price: 48,
    originalPrice: 52,
    discount: 8,
    // White refined granulated sugar
    images: ['https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400&q=80'],
    category: 'kirana',
    subcategory: 'sugar',
    brand: 'Uttam',
    unit: '1 kg',
    variants: [
      { id: 'k008-1', label: '1 kg', price: 48, originalPrice: 52, stock: 70 },
      { id: 'k008-5', label: '5 kg', price: 230, originalPrice: 250, stock: 25 },
    ],
    stock: 70,
    rating: 4.3,
    reviewCount: 892,
    tags: ['sugar', 'refined sugar', 'shakkar'],
  },
  {
    id: 'k009',
    name: 'Amul Pure Ghee',
    slug: 'amul-pure-ghee',
    description: 'Rich and aromatic pure cow ghee for cooking and spreading.',
    price: 549,
    originalPrice: 590,
    discount: 7,
    // Golden pure cow ghee in glass jar
    images: ['https://images.unsplash.com/photo-1626200419199-391ae4be7a41?w=400&q=80'],
    category: 'kirana',
    subcategory: 'ghee-butter',
    brand: 'Amul',
    unit: '1 L',
    variants: [
      { id: 'k009-500ml', label: '500 ml', price: 285, originalPrice: 305, stock: 25 },
      { id: 'k009-1L', label: '1 L', price: 549, originalPrice: 590, stock: 15 },
    ],
    stock: 25,
    rating: 4.9,
    reviewCount: 4521,
    tags: ['ghee', 'cow ghee', 'amul', 'pure ghee'],
    isBestSeller: true,
  },
  {
    id: 'k010',
    name: 'MDH Garam Masala',
    slug: 'mdh-garam-masala',
    description: 'Authentic Indian spice blend for rich flavours.',
    price: 65,
    originalPrice: 72,
    discount: 10,
    // Authentic Indian spice mix and ground masala
    images: ['https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80'],
    category: 'kirana',
    subcategory: 'spices-masala',
    brand: 'MDH',
    unit: '100 g',
    variants: [
      { id: 'k010-50g', label: '50 g', price: 35, originalPrice: 39, stock: 50 },
      { id: 'k010-100g', label: '100 g', price: 65, originalPrice: 72, stock: 35 },
    ],
    stock: 50,
    rating: 4.6,
    reviewCount: 1240,
    tags: ['masala', 'spices', 'garam masala', 'MDH'],
  },
  {
    id: 'k011',
    name: 'Maggi 2-Minute Noodles',
    slug: 'maggi-2-minute-noodles',
    description: "India's favourite instant noodles.",
    price: 14,
    originalPrice: 15,
    discount: 7,
    // Classic yellow instant noodles
    images: ['https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&q=80'],
    category: 'kirana',
    subcategory: 'packaged-foods',
    brand: 'Maggi',
    unit: '70 g (1 pack)',
    variants: [
      { id: 'k011-1', label: '1 pack', price: 14, originalPrice: 15, stock: 150 },
      { id: 'k011-6', label: '6 packs', price: 80, originalPrice: 90, stock: 60 },
      { id: 'k011-12', label: '12 packs', price: 155, originalPrice: 180, stock: 25 },
    ],
    stock: 150,
    rating: 4.7,
    reviewCount: 8900,
    tags: ['maggi', 'noodles', 'instant noodles', 'snack'],
    isBestSeller: true,
  },
  {
    id: 'k012',
    name: 'Amul Taaza Milk',
    slug: 'amul-taaza-milk',
    description: 'Fresh homogenised toned milk, pasteurised for safety.',
    price: 25,
    originalPrice: 25,
    // Fresh white milk in bottle/glass
    images: ['https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&q=80'],
    category: 'kirana',
    subcategory: 'dairy',
    brand: 'Amul',
    unit: '500 ml',
    variants: [
      { id: 'k012-500', label: '500 ml', price: 25, stock: 80 },
      { id: 'k012-1L', label: '1 L', price: 48, stock: 60 },
    ],
    stock: 80,
    rating: 4.5,
    reviewCount: 3200,
    tags: ['milk', 'dairy', 'amul taaza'],
  },
];

// ─── COLD DRINKS & BEVERAGES ─────────────────────────────────────────────────

export const beverageProducts: Product[] = [
  {
    id: 'b001',
    name: 'Coca-Cola Classic',
    slug: 'coca-cola-classic',
    description: 'The classic refreshing taste of Coca-Cola.',
    price: 50,
    originalPrice: 50,
    // Coca-Cola bottle with classic red label
    images: ['https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80'],
    category: 'cold-drinks',
    subcategory: 'soft-drinks',
    brand: 'Coca-Cola',
    unit: '1.25 L',
    variants: [
      { id: 'b001-250', label: '250 ml', price: 20, stock: 100 },
      { id: 'b001-600', label: '600 ml', price: 40, stock: 80 },
      { id: 'b001-1250', label: '1.25 L', price: 65, stock: 50 },
      { id: 'b001-2250', label: '2.25 L', price: 90, stock: 30 },
    ],
    stock: 100,
    rating: 4.6,
    reviewCount: 5420,
    tags: ['cola', 'cold drink', 'soda', 'coca cola'],
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'b002',
    name: 'Sprite Lemon Lime',
    slug: 'sprite-lemon-lime',
    description: 'Crisp lemon-lime flavour — clear, refreshing, no caffeine.',
    price: 50,
    originalPrice: 50,
    // Sprite bottle / green soda can
    images: ['https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=400&q=80'],
    category: 'cold-drinks',
    subcategory: 'soft-drinks',
    brand: 'Sprite',
    unit: '1.25 L',
    variants: [
      { id: 'b002-600', label: '600 ml', price: 40, stock: 70 },
      { id: 'b002-1250', label: '1.25 L', price: 65, stock: 40 },
    ],
    stock: 70,
    rating: 4.5,
    reviewCount: 3210,
    tags: ['sprite', 'lemon', 'cold drink'],
    isFeatured: true,
  },
  {
    id: 'b003',
    name: 'Real Fruit Juice — Mixed Fruit',
    slug: 'real-fruit-juice-mixed-fruit',
    description: 'No added preservatives, real fruit goodness.',
    price: 99,
    originalPrice: 110,
    discount: 10,
    // Fruit juice bottle
    images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=80'],
    category: 'cold-drinks',
    subcategory: 'juices',
    brand: 'Real',
    unit: '1 L',
    variants: [
      { id: 'b003-200', label: '200 ml', price: 25, originalPrice: 28, stock: 60 },
      { id: 'b003-1L', label: '1 L', price: 99, originalPrice: 110, stock: 35 },
    ],
    stock: 60,
    rating: 4.3,
    reviewCount: 1890,
    tags: ['juice', 'fruit juice', 'real', 'mixed fruit'],
    isOnOffer: true,
    isNewArrival: true,
  },
  {
    id: 'b004',
    name: 'Bisleri Mineral Water',
    slug: 'bisleri-mineral-water',
    description: 'Pure, clean and safe packaged drinking water.',
    price: 20,
    originalPrice: 20,
    // Packaged mineral water bottle
    images: ['https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&q=80'],
    category: 'cold-drinks',
    subcategory: 'packaged-water',
    brand: 'Bisleri',
    unit: '1 L',
    variants: [
      { id: 'b004-500', label: '500 ml', price: 10, stock: 200 },
      { id: 'b004-1L', label: '1 L', price: 20, stock: 150 },
      { id: 'b004-2L', label: '2 L', price: 35, stock: 100 },
    ],
    stock: 200,
    rating: 4.6,
    reviewCount: 7800,
    tags: ['water', 'mineral water', 'packaged water', 'bisleri'],
    isBestSeller: true,
  },
  {
    id: 'b005',
    name: 'Monster Energy Original',
    slug: 'monster-energy-original',
    description: 'Energy drink to fuel your day.',
    price: 115,
    originalPrice: 125,
    discount: 8,
    // Black energy drink can
    images: ['https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=400&q=80'],
    category: 'cold-drinks',
    subcategory: 'energy-drinks',
    brand: 'Monster',
    unit: '473 ml',
    stock: 40,
    rating: 4.4,
    reviewCount: 2100,
    tags: ['energy drink', 'monster', 'caffeine'],
    isOnOffer: true,
    isNewArrival: true,
  },
  {
    id: 'b006',
    name: 'Frooti Mango Drink',
    slug: 'frooti-mango-drink',
    description: "India's favourite mango drink — fresh and fruity.",
    price: 20,
    originalPrice: 22,
    discount: 9,
    // Mango juice drink bottle
    images: ['https://images.unsplash.com/photo-1546171753-97d7676e4602?w=400&q=80'],
    category: 'cold-drinks',
    subcategory: 'juices',
    brand: 'Frooti',
    unit: '200 ml',
    variants: [
      { id: 'b006-200', label: '200 ml', price: 20, originalPrice: 22, stock: 90 },
      { id: 'b006-600', label: '600 ml', price: 55, originalPrice: 60, stock: 60 },
    ],
    stock: 90,
    rating: 4.5,
    reviewCount: 4320,
    tags: ['frooti', 'mango', 'juice drink'],
    isOnOffer: true,
  },
];

// ─── GENERAL STATIONERY ──────────────────────────────────────────────────────

export const stationeryProducts: Product[] = [
  {
    id: 's001',
    name: 'Classmate Single Line Notebook',
    slug: 'classmate-single-line-notebook',
    description: 'Single-line ruled notebook for school and college use.',
    price: 60,
    originalPrice: 65,
    discount: 8,
    // Ruled single-line student notebook
    images: ['https://images.unsplash.com/photo-1531346680769-a1d79b57de5c?w=400&q=80'],
    category: 'stationery',
    subcategory: 'notebooks',
    brand: 'Classmate',
    unit: '200 Pages',
    variants: [
      { id: 's001-100', label: '100 Pages', price: 35, originalPrice: 38, stock: 70 },
      { id: 's001-200', label: '200 Pages', price: 60, originalPrice: 65, stock: 50 },
      { id: 's001-300', label: '300 Pages', price: 85, originalPrice: 92, stock: 30 },
    ],
    stock: 70,
    rating: 4.5,
    reviewCount: 2890,
    tags: ['notebook', 'classmate', 'school', 'ruled'],
    isBestSeller: true,
  },
  {
    id: 's002',
    name: 'Cello Gripper Ballpoint Pen (Blue)',
    slug: 'cello-gripper-ballpoint-blue',
    description: 'Smooth writing ballpoint pen with comfortable grip.',
    price: 10,
    originalPrice: 12,
    discount: 17,
    // Ballpoint writing pens
    images: ['https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=400&q=80'],
    category: 'stationery',
    subcategory: 'pens',
    brand: 'Cello',
    unit: '1 pc',
    variants: [
      { id: 's002-1', label: '1 Pen', price: 10, originalPrice: 12, stock: 200 },
      { id: 's002-10', label: '10 Pens', price: 90, originalPrice: 110, stock: 80 },
    ],
    stock: 200,
    rating: 4.4,
    reviewCount: 1560,
    tags: ['pen', 'ballpoint pen', 'cello', 'blue pen'],
  },
  {
    id: 's003',
    name: 'Faber-Castell Pencil HB (Pack of 10)',
    slug: 'faber-castell-pencil-hb-10',
    description: 'High-quality HB pencils for smooth writing and drawing.',
    price: 55,
    originalPrice: 60,
    discount: 8,
    // HB graphite drawing pencils
    images: ['https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&q=80'],
    category: 'stationery',
    subcategory: 'pencils',
    brand: 'Faber-Castell',
    unit: '10 pcs',
    stock: 80,
    rating: 4.6,
    reviewCount: 980,
    tags: ['pencil', 'faber castell', 'HB', 'drawing'],
  },
  {
    id: 's004',
    name: 'Camlin Geometry Box',
    slug: 'camlin-geometry-box',
    description: 'Complete mathematical instrument set for school students.',
    price: 120,
    originalPrice: 135,
    discount: 11,
    // Geometry math instrument set / compass
    images: ['https://images.unsplash.com/photo-1457301353672-324d6d14f471?w=400&q=80'],
    category: 'stationery',
    subcategory: 'school-supplies',
    brand: 'Camlin',
    unit: '1 set',
    stock: 45,
    rating: 4.3,
    reviewCount: 760,
    tags: ['geometry', 'compass', 'school', 'maths'],
    isOnOffer: true,
  },
  {
    id: 's005',
    name: 'Nataraj 621 Pencils (Pack of 10)',
    slug: 'nataraj-621-pencils-10',
    description: 'Classic dark pencils for clear handwriting and sketching.',
    price: 45,
    originalPrice: 50,
    discount: 10,
    // Wood drawing pencils
    images: ['https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400&q=80'],
    category: 'stationery',
    subcategory: 'pencils',
    brand: 'Nataraj',
    unit: '10 pcs',
    stock: 90,
    rating: 4.7,
    reviewCount: 1420,
    tags: ['nataraj', 'pencils', 'school stationery'],
    isBestSeller: true,
  },
];

// ─── PERSONAL CARE ───────────────────────────────────────────────────────────

export const personalCareProducts: Product[] = [
  {
    id: 'p001',
    name: 'Lifebuoy Total Soap',
    slug: 'lifebuoy-total-soap',
    description: 'Germ protection soap keeping you safe and fresh.',
    price: 42,
    originalPrice: 48,
    discount: 13,
    // Soap bars
    images: ['https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80'],
    category: 'personal-care',
    subcategory: 'soaps',
    brand: 'Lifebuoy',
    unit: '4 × 100 g',
    stock: 60,
    rating: 4.5,
    reviewCount: 3400,
    tags: ['soap', 'germ protection', 'lifebuoy'],
    isFeatured: true,
    isOnOffer: true,
  },
  {
    id: 'p002',
    name: 'Pantene Silky Smooth Shampoo',
    slug: 'pantene-silky-smooth-shampoo',
    description: 'Pro-V formula for silky, smooth and strong hair.',
    price: 199,
    originalPrice: 220,
    discount: 10,
    // Hair shampoo bottle
    images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80'],
    category: 'personal-care',
    subcategory: 'hair-care',
    brand: 'Pantene',
    unit: '340 ml',
    stock: 35,
    rating: 4.4,
    reviewCount: 1230,
    tags: ['shampoo', 'pantene', 'hair care'],
    isNewArrival: true,
  },
  {
    id: 'p003',
    name: 'Dettol Original Antiseptic Liquid',
    slug: 'dettol-original-antiseptic-liquid',
    description: 'Proven effective first aid and household disinfectant liquid.',
    price: 110,
    originalPrice: 125,
    discount: 12,
    // Antiseptic liquid / personal care bottle
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'],
    category: 'personal-care',
    subcategory: 'health-hygiene',
    brand: 'Dettol',
    unit: '250 ml',
    stock: 45,
    rating: 4.8,
    reviewCount: 2900,
    tags: ['dettol', 'antiseptic', 'hygiene'],
    isBestSeller: true,
  },
  {
    id: 'p004',
    name: 'Colgate Strong Teeth Toothpaste',
    slug: 'colgate-strong-teeth',
    description: 'Strengthens enamel for strong teeth and fresh breath.',
    price: 85,
    originalPrice: 95,
    discount: 11,
    // Toothpaste tube
    images: ['https://images.unsplash.com/photo-1559190394-df5a28aab5c5?w=400&q=80'],
    category: 'personal-care',
    subcategory: 'oral-care',
    brand: 'Colgate',
    unit: '300 g',
    stock: 55,
    rating: 4.5,
    reviewCount: 4800,
    tags: ['toothpaste', 'colgate', 'dental', 'oral care'],
    isBestSeller: true,
  },
];

// ─── HOME CLEANING ───────────────────────────────────────────────────────────

export const cleaningProducts: Product[] = [
  {
    id: 'c001',
    name: 'Surf Excel Matic Front Load',
    slug: 'surf-excel-matic-front-load',
    description: 'Superior cleaning for front-load washing machines.',
    price: 299,
    originalPrice: 335,
    discount: 11,
    // Laundry washing powder / detergent
    images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80'],
    category: 'home-cleaning',
    subcategory: 'detergents',
    brand: 'Surf Excel',
    unit: '1 kg',
    stock: 30,
    rating: 4.6,
    reviewCount: 2100,
    tags: ['detergent', 'surf excel', 'washing powder'],
    isFeatured: true,
    isOnOffer: true,
  },
  {
    id: 'c002',
    name: 'Vim Dishwash Gel Lemon',
    slug: 'vim-dishwash-gel-lemon',
    description: 'Concentrated gel with power of 100 lemons for grease-free utensils.',
    price: 52,
    originalPrice: 58,
    discount: 10,
    // Dishwashing bottle
    images: ['https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&q=80'],
    category: 'home-cleaning',
    subcategory: 'dishwash',
    brand: 'Vim',
    unit: '500 ml',
    stock: 65,
    rating: 4.7,
    reviewCount: 3100,
    tags: ['vim', 'dishwash', 'cleaner', 'utensils'],
    isBestSeller: true,
  },
  {
    id: 'c003',
    name: 'Lizol Disinfectant Floor Cleaner',
    slug: 'lizol-disinfectant-floor-cleaner',
    description: 'Kills 99.9% germs and gives 10x better cleaning than standard phenyl.',
    price: 95,
    originalPrice: 105,
    discount: 10,
    // Cleaning fluid bottle
    images: ['https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80'],
    category: 'home-cleaning',
    subcategory: 'surface-cleaners',
    brand: 'Lizol',
    unit: '500 ml',
    stock: 40,
    rating: 4.6,
    reviewCount: 1850,
    tags: ['lizol', 'floor cleaner', 'germ protection'],
    isNewArrival: true,
  },
];

// ─── SNACKS ──────────────────────────────────────────────────────────────────

export const snackProducts: Product[] = [
  {
    id: 'sn001',
    name: "Lay's Classic Salted Chips",
    slug: 'lays-classic-salted',
    description: 'Perfectly salted crispy potato chips.',
    price: 20,
    originalPrice: 20,
    // Potato chips packet
    images: ['https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80'],
    category: 'snacks',
    subcategory: 'chips-crisps',
    brand: "Lay's",
    unit: '52 g',
    variants: [
      { id: 'sn001-sm', label: '26 g', price: 10, stock: 120 },
      { id: 'sn001-md', label: '52 g', price: 20, stock: 90 },
      { id: 'sn001-lg', label: '100 g', price: 38, stock: 50 },
    ],
    stock: 120,
    rating: 4.7,
    reviewCount: 6700,
    tags: ['chips', 'lays', 'potato chips', 'snacks'],
    isBestSeller: true,
    isFeatured: true,
  },
  {
    id: 'sn002',
    name: 'Parle-G Original Biscuits',
    slug: 'parle-g-original',
    description: "India's beloved glucose biscuit for generations.",
    price: 10,
    originalPrice: 10,
    // Glucose tea biscuits
    images: ['https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80'],
    category: 'snacks',
    subcategory: 'biscuits',
    brand: 'Parle-G',
    unit: '100 g',
    variants: [
      { id: 'sn002-sm', label: '100 g', price: 10, stock: 200 },
      { id: 'sn002-md', label: '250 g', price: 25, stock: 100 },
    ],
    stock: 200,
    rating: 4.8,
    reviewCount: 15000,
    tags: ['parle-g', 'glucose biscuit', 'biscuit', 'snack'],
    isBestSeller: true,
  },
  {
    id: 'sn003',
    name: "Haldiram's Nagpur Bhujia Sev",
    slug: 'haldirams-nagpur-bhujia-sev',
    description: 'Crispy, spiced gram flour noodles cooked to golden perfection.',
    price: 45,
    originalPrice: 50,
    discount: 10,
    // Namkeen snack packet
    images: ['https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80'],
    category: 'snacks',
    subcategory: 'namkeen',
    brand: "Haldiram's",
    unit: '200 g',
    stock: 80,
    rating: 4.6,
    reviewCount: 3950,
    tags: ['bhujia', 'sev', 'haldirams', 'namkeen'],
    isNewArrival: true,
  },
];

// ─── COMBINED EXPORTS & QUERY HELPERS ────────────────────────────────────────

export const allProducts: Product[] = [
  ...kiranaProducts,
  ...beverageProducts,
  ...stationeryProducts,
  ...personalCareProducts,
  ...cleaningProducts,
  ...snackProducts,
];

export const bestSellers = allProducts.filter((p) => p.isBestSeller);

export const newArrivals = allProducts.filter((p) => p.isNewArrival);

export const featuredProducts = allProducts.filter(
  (p) => p.isFeatured || p.isBestSeller
);

export const specialOffers = allProducts.filter(
  (p) => p.isOnOffer || (p.discount !== undefined && p.discount >= 5)
);

export const getProductsByCategory = (categoryId: string): Product[] => {
  if (categoryId === 'daily-essentials') {
    return allProducts.filter((p) => p.category === 'kirana' || p.isBestSeller);
  }
  return allProducts.filter((p) => p.category === categoryId);
};

export const getProductBySlugOrId = (identifier: string): Product | undefined => {
  return allProducts.find((p) => p.slug === identifier || p.id === identifier);
};

export const getRelatedProducts = (currentProduct: Product, limit = 4): Product[] => {
  return allProducts
    .filter(
      (p) =>
        p.id !== currentProduct.id &&
        (p.category === currentProduct.category ||
          (p.subcategory && p.subcategory === currentProduct.subcategory))
    )
    .slice(0, limit);
};

export const getFrequentlyBoughtTogether = (currentProduct: Product): Product[] => {
  if (currentProduct.category === 'kirana') {
    return allProducts
      .filter((p) => ['k003', 'k004', 'k006', 'k011'].includes(p.id) && p.id !== currentProduct.id)
      .slice(0, 2);
  }
  if (currentProduct.category === 'cold-drinks') {
    return allProducts.filter((p) => ['sn001', 'sn002'].includes(p.id)).slice(0, 2);
  }
  if (currentProduct.category === 'stationery') {
    return allProducts
      .filter((p) => ['s001', 's002', 's003', 's004'].includes(p.id) && p.id !== currentProduct.id)
      .slice(0, 2);
  }
  return allProducts
    .filter((p) => p.id !== currentProduct.id && p.category === currentProduct.category)
    .slice(0, 2);
};
