import { Router } from 'express';

export const storeRouter = Router();

storeRouter.get('/', (_req, res) => {
  res.json({
    businessName: 'Shree Seva Enterprises & Readymade',
    businessType: 'Single-Owner Local Retail Store',
    tagline: 'Your Trusted Neighborhood Store for Groceries, Cold Drinks & Stationery',
    location: {
      address: 'Station Road, Opp. Primary School',
      city: 'Pachora',
      district: 'Jalgaon',
      state: 'Maharashtra',
      pincode: '424201',
      country: 'India',
    },
    serviceAreas: [
      'Pachora Town',
      'Station Road',
      'Deshmukh Colony',
      'Shivaji Nagar',
      'Market Yard',
      'Bhadgaon Road',
    ],
    deliveryOptions: [
      {
        type: 'home_delivery',
        label: 'Home Delivery',
        description: 'Get fresh groceries delivered at your doorstep in Pachora',
        fee: 0,
        estimatedTime: 'Within 2-4 hours',
      },
      {
        type: 'store_pickup',
        label: 'Store Pickup',
        description: 'Order online & pick up ready parcels at the store counter',
        fee: 0,
        estimatedTime: 'Ready in 30 mins',
      },
    ],
    operatingHours: '8:00 AM - 9:30 PM (Daily)',
    contact: {
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      supportEmail: 'contact@shreeseva.local',
    },
    demoNotice: 'Notice: Product prices, stocks, and order timelines are sample demonstration data for the digital store launch.',
  });
});

