/*
 * Product data for the showcase website.
 * Design: "Bazaar Fresh" — Warm Marketplace Aesthetic
 * Edit this file to add/remove/update your products.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  badge?: "new" | "popular" | "limited";
  inStock: boolean;
  details?: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string; // lucide icon name
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "All Products", icon: "LayoutGrid" },
  { id: "electronics", name: "Electronics", icon: "Headphones" },
  { id: "fashion", name: "Fashion", icon: "Shirt" },
  { id: "home", name: "Home & Living", icon: "Home" },
  { id: "beauty", name: "Beauty", icon: "Sparkles" },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-001",
    name: "Wireless Bluetooth Speaker",
    description: "Premium portable speaker with deep bass and 12-hour battery life. Perfect for indoor and outdoor use.",
    price: 49.99,
    currency: "USD",
    category: "electronics",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/94881429/4KB6uyCU5k4C5PL8SYBrx7/product-electronics-HMhMiFcUA73CtCGSFRgVnM.webp",
    badge: "popular",
    inStock: true,
    details: [
      "Bluetooth 5.3 connectivity",
      "12-hour battery life",
      "IPX5 water resistant",
      "Built-in microphone",
      "USB-C charging",
    ],
  },
  {
    id: "prod-002",
    name: "Leather Crossbody Bag",
    description: "Handcrafted genuine leather bag with gold-tone hardware. Timeless design for everyday elegance.",
    price: 89.99,
    currency: "USD",
    category: "fashion",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/94881429/4KB6uyCU5k4C5PL8SYBrx7/product-fashion-dLCPxVveujjuQKYQeWpmSL.webp",
    badge: "new",
    inStock: true,
    details: [
      "Genuine leather",
      "Gold-tone hardware",
      "Adjustable strap",
      "Interior zip pocket",
      "Magnetic closure",
    ],
  },
  {
    id: "prod-003",
    name: "Artisan Ceramic Mug Set",
    description: "Set of 4 handcrafted ceramic mugs in earthy tones. Each piece is unique and microwave safe.",
    price: 34.99,
    currency: "USD",
    category: "home",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/94881429/4KB6uyCU5k4C5PL8SYBrx7/product-home-Tj9gA9owAjjHuPcqmxk5Q7.webp",
    badge: "popular",
    inStock: true,
    details: [
      "Set of 4 mugs",
      "Handcrafted ceramic",
      "Microwave & dishwasher safe",
      "12 oz capacity each",
      "Earthy color palette",
    ],
  },
  {
    id: "prod-004",
    name: "Natural Skincare Collection",
    description: "Complete skincare set with botanical serum, facial oil, and moisturizer. All-natural ingredients.",
    price: 65.00,
    currency: "USD",
    category: "beauty",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/94881429/4KB6uyCU5k4C5PL8SYBrx7/product-beauty-nzrqq3aa9J3dN5J3rGot6q.webp",
    badge: "new",
    inStock: true,
    details: [
      "100% natural ingredients",
      "Includes serum, oil & cream",
      "Suitable for all skin types",
      "Cruelty-free & vegan",
      "Glass packaging",
    ],
  },
  {
    id: "prod-005",
    name: "Minimalist Watch",
    description: "Sleek analog watch with genuine leather strap. Japanese quartz movement for precise timekeeping.",
    price: 120.00,
    currency: "USD",
    category: "fashion",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop",
    badge: "limited",
    inStock: true,
    details: [
      "Japanese quartz movement",
      "Genuine leather strap",
      "Sapphire crystal glass",
      "Water resistant 30m",
      "2-year warranty",
    ],
  },
  {
    id: "prod-006",
    name: "Wireless Earbuds Pro",
    description: "Active noise cancellation with crystal-clear audio. 30-hour total battery with charging case.",
    price: 79.99,
    currency: "USD",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&h=600&fit=crop",
    inStock: true,
    details: [
      "Active noise cancellation",
      "30-hour total battery",
      "Bluetooth 5.3",
      "Touch controls",
      "IPX4 sweat resistant",
    ],
  },
  {
    id: "prod-007",
    name: "Scented Soy Candle Set",
    description: "Hand-poured soy candles in 3 calming scents: lavender, vanilla, and sandalwood.",
    price: 28.00,
    currency: "USD",
    category: "home",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop",
    badge: "popular",
    inStock: true,
    details: [
      "100% soy wax",
      "Set of 3 candles",
      "40-hour burn time each",
      "Cotton wick",
      "Reusable glass jars",
    ],
  },
  {
    id: "prod-008",
    name: "Rose Gold Lip Gloss",
    description: "Hydrating lip gloss with a beautiful rose gold shimmer. Enriched with vitamin E.",
    price: 18.00,
    currency: "USD",
    category: "beauty",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&h=600&fit=crop",
    inStock: true,
    details: [
      "Hydrating formula",
      "Rose gold shimmer",
      "Vitamin E enriched",
      "Long-lasting wear",
      "Cruelty-free",
    ],
  },
];

// Store configuration — edit these values
export const STORE_CONFIG = {
  name: "Your Store",
  tagline: "Discover Products You'll Love",
  description: "Browse our curated collection and message us on Telegram to order. Fast replies, easy shopping.",
  telegramUsername: "yourusername", // Replace with your Telegram username
  telegramBotUsername: "", // Optional: your Telegram bot username for Mini App
  currency: "USD",
  currencySymbol: "$",
};
