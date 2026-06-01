import type { Product, UserProfile } from '../types';

export const DUMMY_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'iPhone 15 Pro Max 256GB',
    description: 'Minimalist titanium design, A17 Pro high-performance chip, advanced triple camera system with 5x optical zoom, and dynamic action button.',
    price: 17200000, // UZS
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=800&auto=format&fit=crop',
    category: 'Smartphones',
    rating: { rate: 4.8, count: 184 },
    specs: {
      'Display': '6.7 inch Super Retina XDR (120Hz)',
      'Processor': 'Apple A17 Pro (3nm)',
      'Memory': '8GB RAM / 256GB Storage',
      'Battery': 'Up to 29 hours video playback'
    },
    sizes: ['128GB', '256GB', '512GB'],
    colors: ['Natural Titanium', 'Blue Titanium', 'Black Titanium'],
    isFeatured: true,
    isNew: true,
    discountPercent: 5,
    inventory: 12
  },
  {
    id: 'prod-2',
    name: 'MacBook Air 13" M3',
    description: 'Ultra-thin, featherlight aluminum chassis powered by the high-load Apple M3 chip. Offers outstanding performance and up to 18 hours of battery life.',
    price: 15400000, // UZS
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop',
    category: 'Laptops',
    rating: { rate: 4.9, count: 96 },
    specs: {
      'Processor': 'Apple M3 (8-core CPU / 10-core GPU)',
      'Memory': '8GB Unified Memory / 256GB SSD',
      'Display': '13.6-inch Liquid Retina Display',
      'Battery Life': 'Up to 18 Hours'
    },
    sizes: ['256GB SSD', '512GB SSD'],
    colors: ['Space Gray', 'Silver', 'Midnight'],
    isFeatured: true,
    inventory: 6
  },
  {
    id: 'prod-3',
    name: 'Sony WH-1000XM5 Headphones',
    description: 'Industry-leading noise canceling wireless headphones with dual processors, 8 microphones, and exceptional high-res audio call quality.',
    price: 4900000, // UZS
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
    category: 'Audio',
    rating: { rate: 4.7, count: 240 },
    specs: {
      'Type': 'Over-ear Wireless ANC',
      'Battery Life': 'Up to 30 Hours (ANC ON)',
      'Connectivity': 'Bluetooth 5.2 / Multi-point',
      'Weight': '250 grams'
    },
    sizes: ['Standard'],
    colors: ['Silver Sand', 'Midnight Black'],
    isFeatured: true,
    isNew: true,
    inventory: 24
  },
  {
    id: 'prod-4',
    name: 'Apple Watch Series 9 GPS',
    description: 'Powerful S9 chip with double tap gesture controls, advanced temperature sensing, sleep stages tracking, and robust workout metrics.',
    price: 5200000, // UZS
    image: 'https://images.unsplash.com/photo-1517502884422-41eaaced0168?q=80&w=800&auto=format&fit=crop',
    category: 'Wearables',
    rating: { rate: 4.6, count: 112 },
    specs: {
      'Size': '45mm Aluminum Case',
      'Display': 'Always-On Retina (Up to 2000 nits)',
      'Sensors': 'ECG, SpO2, Temperature Sensor',
      'Waterproof': 'WR50 (Swimproof)'
    },
    sizes: ['41mm', '45mm'],
    colors: ['Midnight Aluminum', 'Starlight', 'Silver'],
    isFeatured: false,
    discountPercent: 8,
    inventory: 15
  },
  {
    id: 'prod-5',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    description: 'Premium titanium build featuring dynamic Galaxy AI tools, integrated S Pen stylus, and a supreme 200MP quad-lens camera matrix.',
    price: 16900000, // UZS
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800&auto=format&fit=crop',
    category: 'Smartphones',
    rating: { rate: 4.8, count: 145 },
    specs: {
      'Display': '6.8 inch Dynamic AMOLED 2X (120Hz)',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Memory': '12GB RAM / 512GB Storage',
      'Battery': '5000 mAh with 45W fast charge'
    },
    sizes: ['256GB', '512GB'],
    colors: ['Titanium Gray', 'Titanium Black', 'Titanium Yellow'],
    isFeatured: false,
    inventory: 18
  },
  {
    id: 'prod-6',
    name: 'iPad Pro 11" M2 WiFi',
    description: 'Astonishing speed, brilliant Liquid Retina display, ultra-fast wireless connectivity, and compatibility with the Apple Pencil 2.',
    price: 11500000, // UZS
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800&auto=format&fit=crop',
    category: 'Wearables',
    rating: { rate: 4.7, count: 88 },
    specs: {
      'Processor': 'Apple M2 (8-core CPU / 10-core GPU)',
      'Display': '11-inch Liquid Retina with ProMotion',
      'Storage': '128GB SSD WiFi',
      'Camera': '12MP Wide / 10MP Ultra Wide'
    },
    sizes: ['128GB', '256GB'],
    colors: ['Space Gray', 'Silver'],
    isFeatured: true,
    inventory: 10
  }
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Alexander Makhmudov',
  email: 'alex.m@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
  wishlist: ['prod-3', 'prod-1'],
  orders: [
    {
      id: 'ORD-758392',
      date: '2026-05-20T14:32:00Z',
      items: [
        {
          product: DUMMY_PRODUCTS[0],
          quantity: 1,
          selectedColor: 'Natural Titanium',
          selectedSize: '256GB'
        },
        {
          product: DUMMY_PRODUCTS[2],
          quantity: 1,
          selectedColor: 'Midnight Black',
          selectedSize: 'Standard'
        }
      ],
      total: 22100000, // UZS
      status: 'Shipped',
      trackingNumber: 'UZ-758392-EX'
    },
    {
      id: 'ORD-294029',
      date: '2026-04-12T10:15:00Z',
      items: [
        {
          product: DUMMY_PRODUCTS[2],
          quantity: 1,
          selectedColor: 'Silver Sand',
          selectedSize: 'Standard'
        }
      ],
      total: 4900000, // UZS
      status: 'Delivered',
      trackingNumber: 'UZ-294029-EX'
    }
  ]
};
