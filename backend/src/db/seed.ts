import { db } from './index.js';
import {
  categories,
  products,
  productImages,
  inventory,
  users,
  addresses,
  deliveryPersonnel,
  orders,
  orderItems,
  orderStatusHistory,
  deliveries,
  payments,
} from './schema/index.js';
import { sql } from 'drizzle-orm';

// Realistic product images matching Indian Kirana store goods
const SEED_CATEGORIES = [
  {
    id: 'kirana',
    name: 'Kirana & Groceries',
    slug: 'kirana-groceries',
    description: 'Daily grocery essentials for your home: Atta, Rice, Dal, Oil, Spices & Staples',
    imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80',
    displayOrder: 1,
    isActive: true,
  },
  {
    id: 'cold-drinks',
    name: 'Cold Drinks & Beverages',
    slug: 'cold-drinks-beverages',
    description: 'Chilled cold drinks, juices, mineral water & refreshing beverages',
    imageUrl: 'https://images.unsplash.com/photo-1543253687-c931c8e01820?w=400&q=80',
    displayOrder: 2,
    isActive: true,
  },
  {
    id: 'stationery',
    name: 'General Stationery',
    slug: 'general-stationery',
    description: 'Classmate notebooks, pens, markers, school & office supplies',
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80',
    displayOrder: 3,
    isActive: true,
  },
  {
    id: 'personal-care',
    name: 'Personal Care',
    slug: 'personal-care',
    description: 'Soaps, toothpastes, shampoos & everyday grooming products',
    imageUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&q=80',
    displayOrder: 4,
    isActive: true,
  },
  {
    id: 'home-cleaning',
    name: 'Home Cleaning',
    slug: 'home-cleaning',
    description: 'Detergents, floor cleaners, dishwashers & hygiene supplies',
    imageUrl: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&q=80',
    displayOrder: 5,
    isActive: true,
  },
  {
    id: 'snacks',
    name: 'Snacks & Confectionery',
    slug: 'snacks-confectionery',
    description: 'Chips, biscuits, namkeen, chocolates & sweets',
    imageUrl: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=400&q=80',
    displayOrder: 6,
    isActive: true,
  },
  {
    id: 'daily-essentials',
    name: 'Daily Essentials',
    slug: 'daily-essentials',
    description: 'Handpicked daily staples and household essentials',
    imageUrl: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&q=80',
    displayOrder: 7,
    isActive: true,
  },
];

const SEED_PRODUCTS = [
  // Kirana & Groceries
  {
    id: 'k001',
    categoryId: 'kirana',
    name: 'Aashirvaad Whole Wheat Atta',
    slug: 'aashirvaad-whole-wheat-atta',
    brand: 'Aashirvaad',
    description: 'Superior quality 100% whole wheat atta milled from golden grains for soft, fluffy rotis and chapatis.',
    basePrice: '279.00',
    discountPrice: '299.00',
    unit: 'kg',
    unitValue: '5 kg Pack',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.60',
    reviewCount: 1248,
    badge: '7% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&q=80',
    stock: 80,
  },
  {
    id: 'k002',
    categoryId: 'kirana',
    name: 'India Gate Basmati Rice Feast',
    slug: 'india-gate-basmati-rice',
    brand: 'India Gate',
    description: 'Premium aged long-grain basmati rice with distinctive exotic aroma, ideal for biryani and pulao.',
    basePrice: '185.00',
    discountPrice: '210.00',
    unit: 'kg',
    unitValue: '5 kg Pack',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.40',
    reviewCount: 890,
    badge: '12% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&q=80',
    stock: 65,
  },
  {
    id: 'k003',
    categoryId: 'kirana',
    name: 'Fortune Sunlite Refined Sunflower Oil',
    slug: 'fortune-sunlite-sunflower-oil',
    brand: 'Fortune',
    description: 'Light and healthy refined sunflower oil enriched with Vitamins A & D for daily cooking and frying.',
    basePrice: '135.00',
    discountPrice: '155.00',
    unit: 'L',
    unitValue: '1 L Pouch',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.50',
    reviewCount: 640,
    badge: '13% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80',
    stock: 90,
  },
  {
    id: 'k004',
    categoryId: 'kirana',
    name: 'Tata Salt Vacuum Evaporated Iodized Salt',
    slug: 'tata-salt-iodized',
    brand: 'Tata Salt',
    description: 'Desh Ka Namak — pure vacuum evaporated iodized salt essential for cognitive development and health.',
    basePrice: '24.00',
    discountPrice: '28.00',
    unit: 'kg',
    unitValue: '1 kg Pack',
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.80',
    reviewCount: 3100,
    badge: 'Essential',
    imageUrl: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=500&q=80',
    stock: 200,
  },
  {
    id: 'k005',
    categoryId: 'kirana',
    name: 'Madhur Pure & Hygienic Sugar',
    slug: 'madhur-pure-sugar',
    brand: 'Madhur',
    description: 'Sulphur-free, sparkling white crystal sugar untouched by hands for sweet dishes, tea and coffee.',
    basePrice: '48.00',
    discountPrice: '55.00',
    unit: 'kg',
    unitValue: '1 kg Pack',
    inStock: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.60',
    reviewCount: 420,
    badge: 'Pure',
    imageUrl: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=500&q=80',
    stock: 120,
  },
  {
    id: 'k006',
    categoryId: 'kirana',
    name: 'Tata Sampann Unpolished Toor Dal',
    slug: 'tata-sampann-toor-dal',
    brand: 'Tata Sampann',
    description: 'Nutritious unpolished toor dal rich in natural protein and wholesome taste, free from water or oil polish.',
    basePrice: '155.00',
    discountPrice: '175.00',
    unit: 'kg',
    unitValue: '1 kg Pack',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.70',
    reviewCount: 780,
    badge: 'High Protein',
    imageUrl: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&q=80',
    stock: 75,
  },
  {
    id: 'k007',
    categoryId: 'kirana',
    name: 'Red Label Strong Blend Tea',
    slug: 'brooke-bond-red-label-tea',
    brand: 'Brooke Bond',
    description: 'Crafted with finest tea leaves with rich color and taste that brings the whole family together.',
    basePrice: '130.00',
    discountPrice: '145.00',
    unit: 'g',
    unitValue: '500 g Box',
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.50',
    reviewCount: 950,
    badge: 'Top Pick',
    imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&q=80',
    stock: 85,
  },
  {
    id: 'k008',
    categoryId: 'kirana',
    name: 'Parle-G Original Glucose Biscuits',
    slug: 'parle-g-glucose-biscuits',
    brand: 'Parle-G',
    description: 'The iconic golden baked glucose biscuit loved across generations for breakfast and tea time.',
    basePrice: '10.00',
    discountPrice: '10.00',
    unit: 'g',
    unitValue: '250 g Pack',
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: false,
    rating: '4.70',
    reviewCount: 2200,
    badge: 'Popular',
    imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&q=80',
    stock: 250,
  },
  {
    id: 'k009',
    categoryId: 'kirana',
    name: 'Maggi 2-Minute Masala Instant Noodles',
    slug: 'maggi-2-minute-masala-noodles',
    brand: 'Maggi',
    description: 'Delicious instant noodles with authentic roasted Indian spices for quick and tasty snack craving.',
    basePrice: '56.00',
    discountPrice: '60.00',
    unit: 'pack',
    unitValue: '4-Pack (280 g)',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.80',
    reviewCount: 3500,
    badge: 'Best Seller',
    imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&q=80',
    stock: 140,
  },
  {
    id: 'k010',
    categoryId: 'kirana',
    name: 'Amul Taaza Homogenised Toned Milk',
    slug: 'amul-taaza-toned-milk',
    brand: 'Amul',
    description: 'Fresh homogenized toned milk packed with nutrients, long-life aseptic carton, no preservatives.',
    basePrice: '72.00',
    discountPrice: '74.00',
    unit: 'L',
    unitValue: '1 L Tetra Pak',
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: false,
    rating: '4.80',
    reviewCount: 1600,
    badge: 'Fresh',
    imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=500&q=80',
    stock: 60,
  },
  {
    id: 'k011',
    categoryId: 'kirana',
    name: 'Saffola Gold Pro Healthy Lifestyle Edible Oil',
    slug: 'saffola-gold-edible-oil',
    brand: 'Saffola',
    description: 'Blended edible vegetable oil with dual-seed technology, oryzanol, and antioxidant balance for heart care.',
    basePrice: '185.00',
    discountPrice: '210.00',
    unit: 'L',
    unitValue: '1 L Pouch',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.60',
    reviewCount: 520,
    badge: 'Heart Care',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&q=80',
    stock: 55,
  },

  // Cold Drinks & Beverages
  {
    id: 'cd001',
    categoryId: 'cold-drinks',
    name: 'Coca-Cola Original Taste Soft Drink',
    slug: 'coca-cola-original-taste',
    brand: 'Coca-Cola',
    description: 'Crisp, refreshing, fizzy cola beverage best served chilled on hot afternoons.',
    basePrice: '50.00',
    discountPrice: '55.00',
    unit: 'L',
    unitValue: '1.25 L Bottle',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.50',
    reviewCount: 890,
    badge: 'Chilled',
    imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=500&q=80',
    stock: 70,
  },
  {
    id: 'cd002',
    categoryId: 'cold-drinks',
    name: 'Sprite Lemon-Lime Carbonated Drink',
    slug: 'sprite-lemon-lime-drink',
    brand: 'Sprite',
    description: 'Clear, crisp lemon-lime refreshment with maximum thirst-quenching taste.',
    basePrice: '40.00',
    discountPrice: '45.00',
    unit: 'ml',
    unitValue: '750 ml Bottle',
    inStock: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.50',
    reviewCount: 670,
    badge: 'Refreshing',
    imageUrl: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=500&q=80',
    stock: 65,
  },
  {
    id: 'cd003',
    categoryId: 'cold-drinks',
    name: 'Thums Up Charged Strong Cola',
    slug: 'thums-up-strong-cola',
    brand: 'Thums Up',
    description: 'Strong, spicy, bold fizzy Indian cola taste that delivers an instant energetic kick.',
    basePrice: '40.00',
    discountPrice: '45.00',
    unit: 'ml',
    unitValue: '750 ml Bottle',
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.60',
    reviewCount: 740,
    badge: 'Toofani',
    imageUrl: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=500&q=80',
    stock: 80,
  },
  {
    id: 'cd004',
    categoryId: 'cold-drinks',
    name: 'Frooti Real Mango Drink',
    slug: 'frooti-mango-drink',
    brand: 'Frooti',
    description: 'Made with delicious ripe mango pulp for mango lovers of all ages.',
    basePrice: '20.00',
    discountPrice: '20.00',
    unit: 'ml',
    unitValue: '250 ml Tetra Pak',
    inStock: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    hasOffer: false,
    rating: '4.40',
    reviewCount: 430,
    badge: 'Real Mango',
    imageUrl: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&q=80',
    stock: 110,
  },

  // General Stationery
  {
    id: 'st001',
    categoryId: 'stationery',
    name: 'Classmate Long Notebook Single Line',
    slug: 'classmate-long-notebook-single-line',
    brand: 'Classmate',
    description: 'High quality chlorine-free white paper, smooth writing surface, durable soft binding.',
    basePrice: '60.00',
    discountPrice: '65.00',
    unit: 'piece',
    unitValue: '200 Pages',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.70',
    reviewCount: 560,
    badge: 'Popular',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&q=80',
    stock: 120,
  },
  {
    id: 'st002',
    categoryId: 'stationery',
    name: 'Reynolds 045 Fine Carbure Ball Pen Pack',
    slug: 'reynolds-045-fine-ball-pen',
    brand: 'Reynolds',
    description: 'Smooth smudge-free blue ball pens with precision tip for school and office work.',
    basePrice: '50.00',
    discountPrice: '60.00',
    unit: 'pack',
    unitValue: 'Pack of 5 Pens',
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.50',
    reviewCount: 390,
    badge: 'Essential',
    imageUrl: 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=500&q=80',
    stock: 95,
  },
  {
    id: 'st003',
    categoryId: 'stationery',
    name: 'Apsara Platinum Extra Dark Pencils',
    slug: 'apsara-platinum-pencils-pack',
    brand: 'Apsara',
    description: 'Extra dark bonded lead pencils with free sharpener and non-dust eraser.',
    basePrice: '65.00',
    discountPrice: '75.00',
    unit: 'pack',
    unitValue: 'Pack of 10 Pencils',
    inStock: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.60',
    reviewCount: 310,
    badge: 'Value Pack',
    imageUrl: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=500&q=80',
    stock: 80,
  },

  // Personal Care
  {
    id: 'pc001',
    categoryId: 'personal-care',
    name: 'Dettol Original Bathing Soap Bar',
    slug: 'dettol-original-soap',
    brand: 'Dettol',
    description: 'Trusted antibacterial germ defense bathing bar for family hygiene and freshness.',
    basePrice: '135.00',
    discountPrice: '150.00',
    unit: 'pack',
    unitValue: 'Pack of 4 Bars (75g each)',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.70',
    reviewCount: 890,
    badge: '10% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=500&q=80',
    stock: 65,
  },
  {
    id: 'pc002',
    categoryId: 'personal-care',
    name: 'Colgate Strong Teeth Dental Cream Toothpaste',
    slug: 'colgate-strong-teeth-toothpaste',
    brand: 'Colgate',
    description: 'Amino Shakti formula adds natural calcium to teeth, making them 2x stronger against cavities.',
    basePrice: '110.00',
    discountPrice: '120.00',
    unit: 'g',
    unitValue: '200 g Tube',
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.60',
    reviewCount: 1100,
    badge: 'Daily Need',
    imageUrl: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500&q=80',
    stock: 90,
  },

  // Home & Cleaning
  {
    id: 'hc001',
    categoryId: 'home-cleaning',
    name: 'Surf Excel Easy Wash Detergent Powder',
    slug: 'surf-excel-easy-wash-powder',
    brand: 'Surf Excel',
    description: 'Super-fast power lather removes tough stains without harsh scrubbing on collars and cuffs.',
    basePrice: '140.00',
    discountPrice: '155.00',
    unit: 'kg',
    unitValue: '1 kg Bag',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.70',
    reviewCount: 1450,
    badge: 'Top Seller',
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&q=80',
    stock: 80,
  },
  {
    id: 'hc002',
    categoryId: 'home-cleaning',
    name: 'Vim Lemon Dishwash Liquid Gel',
    slug: 'vim-lemon-dishwash-gel',
    brand: 'Vim',
    description: 'Infused with the power of 100 lemons to cut through stubborn grease on utensils.',
    basePrice: '105.00',
    discountPrice: '115.00',
    unit: 'ml',
    unitValue: '500 ml Bottle',
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: true,
    rating: '4.60',
    reviewCount: 920,
    badge: 'Degreaser',
    imageUrl: 'https://images.unsplash.com/photo-1585670270608-b4be4fb88092?w=500&q=80',
    stock: 70,
  },

  // Snacks & Confectionery
  {
    id: 'sn001',
    categoryId: 'snacks',
    name: "Lay's India's Magic Masala Potato Chips",
    slug: 'lays-magic-masala-chips',
    brand: "Lay's",
    description: 'Crispy sliced Indian potatoes seasoned with tangy chili, tomato, and aromatic spices.',
    basePrice: '20.00',
    discountPrice: '20.00',
    unit: 'g',
    unitValue: '50 g Pack',
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    hasOffer: false,
    rating: '4.60',
    reviewCount: 1800,
    badge: 'Favorite',
    imageUrl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&q=80',
    stock: 150,
  },
];

export async function seedDatabase() {
  console.log('🌱 Starting idempotent database seed for Shree Seva Enterprises & Readymade...');

  try {
    // 1. Seed Categories
    console.log('  -> Seeding Categories...');
    for (const cat of SEED_CATEGORIES) {
      await db
        .insert(categories)
        .values(cat)
        .onConflictDoUpdate({
          target: categories.id,
          set: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description,
            imageUrl: cat.imageUrl,
            displayOrder: cat.displayOrder,
            isActive: cat.isActive,
          },
        });
    }
    console.log(`  ✓ Inserted/Updated ${SEED_CATEGORIES.length} categories`);

    // 2. Seed Products, Images & Inventory
    console.log('  -> Seeding Products, Images & Inventory...');
    for (const prod of SEED_PRODUCTS) {
      await db
        .insert(products)
        .values({
          id: prod.id,
          categoryId: prod.categoryId,
          name: prod.name,
          slug: prod.slug,
          brand: prod.brand,
          description: prod.description,
          basePrice: prod.basePrice,
          discountPrice: prod.discountPrice,
          unit: prod.unit,
          unitValue: prod.unitValue,
          inStock: prod.inStock,
          isFeatured: prod.isFeatured,
          isBestSeller: prod.isBestSeller,
          isNewArrival: prod.isNewArrival,
          hasOffer: prod.hasOffer,
          rating: prod.rating,
          reviewCount: prod.reviewCount,
          badge: prod.badge,
        })
        .onConflictDoUpdate({
          target: products.id,
          set: {
            name: prod.name,
            slug: prod.slug,
            brand: prod.brand,
            description: prod.description,
            basePrice: prod.basePrice,
            discountPrice: prod.discountPrice,
            unit: prod.unit,
            unitValue: prod.unitValue,
            inStock: prod.inStock,
            isFeatured: prod.isFeatured,
            isBestSeller: prod.isBestSeller,
            isNewArrival: prod.isNewArrival,
            hasOffer: prod.hasOffer,
            rating: prod.rating,
            reviewCount: prod.reviewCount,
            badge: prod.badge,
          },
        });

      // Product Image
      const imageId = `img-${prod.id}`;
      await db
        .insert(productImages)
        .values({
          id: imageId,
          productId: prod.id,
          imageUrl: prod.imageUrl,
          altText: prod.name,
          isPrimary: true,
          displayOrder: 1,
        })
        .onConflictDoUpdate({
          target: productImages.id,
          set: {
            imageUrl: prod.imageUrl,
            altText: prod.name,
          },
        });

      // Inventory
      await db
        .insert(inventory)
        .values({
          id: `inv-${prod.id}`,
          productId: prod.id,
          stockQuantity: prod.stock,
          lowStockThreshold: 10,
          isAvailable: true,
        })
        .onConflictDoUpdate({
          target: inventory.productId,
          set: {
            stockQuantity: prod.stock,
            isAvailable: true,
          },
        });
    }
    console.log(`  ✓ Inserted/Updated ${SEED_PRODUCTS.length} products with images and inventory`);

    // 3. Seed Users
    console.log('  -> Seeding Users & Customer Profile...');
    const customerId = 'usr-ronit';
    await db
      .insert(users)
      .values({
        id: customerId,
        phone: '+919876543210',
        fullName: 'Ronit Madage',
        email: 'ronit@example.com',
        role: 'customer',
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          fullName: 'Ronit Madage',
          phone: '+919876543210',
        },
      });

    const ownerId = 'usr-owner';
    await db
      .insert(users)
      .values({
        id: ownerId,
        phone: '+919800011122',
        fullName: 'Shree Seva Store Owner',
        email: 'owner@shreeseva.local',
        role: 'owner',
      })
      .onConflictDoNothing();

    // 4. Seed Address
    const addressId = 'addr-ronit-pachora';
    await db
      .insert(addresses)
      .values({
        id: addressId,
        userId: customerId,
        label: 'Home',
        recipientName: 'Ronit Madage',
        phone: '+919876543210',
        addressLine1: 'Station Road, Deshmukh Colony',
        addressLine2: 'Near Old Bus Stand',
        landmark: 'Opposite State Bank',
        city: 'Pachora',
        state: 'Maharashtra',
        pincode: '424201',
        isDefault: true,
      })
      .onConflictDoNothing();

    // 5. Seed Delivery Partner
    const deliveryPartnerId = 'del-ganesh';
    await db
      .insert(deliveryPersonnel)
      .values({
        id: deliveryPartnerId,
        fullName: 'Ganesh Patil',
        phone: '+919822012345',
        vehicleType: 'Hero Splendor (Bike)',
        vehicleNumber: 'MH 19 BY 4412',
        isActive: true,
      })
      .onConflictDoNothing();

    // 6. Seed Reference UI Order #SS842910 matching customer mockup
    console.log('  -> Seeding Reference UI Order (#SS842910)...');
    const refOrderId = 'ord-ss842910';
    await db
      .insert(orders)
      .values({
        id: refOrderId,
        orderNumber: 'SS-842910',
        userId: customerId,
        customerName: 'Ronit Madage',
        customerPhone: '+919876543210',
        deliveryType: 'home_delivery',
        deliveryAddress: 'Station Road, Deshmukh Colony, Pachora, Maharashtra 424201',
        paymentMethod: 'cod',
        paymentStatus: 'pending',
        orderStatus: 'out_for_delivery',
        subtotal: '439.00',
        deliveryFee: '0.00',
        discount: '0.00',
        totalAmount: '439.00',
        notes: 'Please deliver after 4 PM at front gate',
      })
      .onConflictDoUpdate({
        target: orders.id,
        set: {
          orderStatus: 'out_for_delivery',
          totalAmount: '439.00',
        },
      });

    // Reference Order Items: Aashirvaad Atta (₹279), Coca-Cola 1.25L (₹50), Classmate Notebook 200P (₹60)
    await db
      .insert(orderItems)
      .values([
        {
          id: 'item-1',
          orderId: refOrderId,
          productId: 'k001',
          productName: 'Aashirvaad Whole Wheat Atta',
          unitPrice: '279.00',
          quantity: 1,
          totalPrice: '279.00',
          productImage: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80',
          unitValue: '5 kg',
        },
        {
          id: 'item-2',
          orderId: refOrderId,
          productId: 'cd001',
          productName: 'Coca-Cola Original Taste',
          unitPrice: '50.00',
          quantity: 2,
          totalPrice: '100.00',
          productImage: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&q=80',
          unitValue: '1.25 L',
        },
        {
          id: 'item-3',
          orderId: refOrderId,
          productId: 'st001',
          productName: 'Classmate Notebook 200 Pages',
          unitPrice: '60.00',
          quantity: 1,
          totalPrice: '60.00',
          productImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
          unitValue: '200 Pages',
        },
      ])
      .onConflictDoNothing();

    // Order Status History matching reference timeline
    await db
      .insert(orderStatusHistory)
      .values([
        {
          id: 'hist-1',
          orderId: refOrderId,
          status: 'Order Placed',
          comment: 'Order placed by customer via Shree Seva Web App',
          changedBy: 'Ronit Madage',
        },
        {
          id: 'hist-2',
          orderId: refOrderId,
          status: 'Packed',
          comment: 'Items packed at Shree Seva retail counter, Pachora',
          changedBy: 'Shree Seva Counter Staff',
        },
        {
          id: 'hist-3',
          orderId: refOrderId,
          status: 'Out for Delivery',
          comment: 'Assigned to Ganesh Patil (Hero Splendor MH 19 BY 4412)',
          changedBy: 'Dispatch Counter',
        },
      ])
      .onConflictDoNothing();

    // Delivery assignment
    await db
      .insert(deliveries)
      .values({
        id: 'del-ss842910',
        orderId: refOrderId,
        personnelId: deliveryPartnerId,
        status: 'in_transit',
        estimatedTime: 'Expected by 07:00 PM',
      })
      .onConflictDoNothing();

    // Payment record
    await db
      .insert(payments)
      .values({
        id: 'pay-ss842910',
        orderId: refOrderId,
        paymentMethod: 'cod',
        amount: '439.00',
        currency: 'INR',
        status: 'pending',
      })
      .onConflictDoNothing();

    console.log('✅ Successfully seeded Neon PostgreSQL database for Shree Seva Enterprises & Readymade!');
  } catch (error) {
    console.error('❌ Database seed error:', error);
    process.exit(1);
  }
}

// Execute when run directly via tsx
seedDatabase().then(() => {
  process.exit(0);
});

