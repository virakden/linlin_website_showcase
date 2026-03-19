/*
 * Product data for the showcase website.
 * Design: "Bazaar Fresh" — Warm Marketplace Aesthetic
 *
 * HOW TO EDIT:
 * 1. Replace product names, descriptions, prices, images, and video links
 * 2. Update STORE_CONFIG with your real Telegram username, Facebook page, etc.
 * 3. Each product has `name_kh` and `description_kh` for Khmer translations
 */

export interface Product {
  id: string;
  name: string;
  name_kh: string;
  description: string;
  description_kh: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  badge?: "new" | "popular" | "limited";
  inStock: boolean;
  details?: string[];
  details_kh?: string[];
  videoLink?: string; // TikTok, YouTube, or any video URL
  videoSource?: string; // "TikTok" | "YouTube" | etc.
}

export interface Category {
  id: string;
  name: string;
  name_kh: string;
  icon: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", name: "All Products", name_kh: "ផលិតផលទាំងអស់", icon: "LayoutGrid" },
  { id: "electronics", name: "Electronics", name_kh: "អេឡិចត្រូនិច", icon: "Headphones" },
  { id: "fashion", name: "Fashion", name_kh: "ម៉ូដ", icon: "Shirt" },
  { id: "home", name: "Home & Living", name_kh: "ផ្ទះ និងការរស់នៅ", icon: "Home" },
  { id: "beauty", name: "Beauty", name_kh: "សម្រស់", icon: "Sparkles" },
  { id: "food", name: "Food & Drinks", name_kh: "អាហារ និងភេសជ្ជៈ", icon: "Coffee" },
  { id: "accessories", name: "Accessories", name_kh: "គ្រឿងបន្ថែម", icon: "Watch" },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-001",
    name: "Wireless Bluetooth Speaker",
    name_kh: "ឧបករណ៍បំពងសម្លេង Bluetooth",
    description: "Premium portable speaker with deep bass and 12-hour battery life. Perfect for indoor and outdoor use.",
    description_kh: "ឧបករណ៍បំពងសម្លេងចល័តដែលមានគុណភាពខ្ពស់ ជាមួយសម្លេងបាសជ្រៅ និងថ្មអាចប្រើបាន ១២ ម៉ោង។",
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
    details_kh: [
      "ការតភ្ជាប់ Bluetooth 5.3",
      "ថ្មអាចប្រើបាន ១២ ម៉ោង",
      "ការពារទឹក IPX5",
      "មីក្រូហ្វូនភ្ជាប់មកជាមួយ",
      "សាកថ្ម USB-C",
    ],
    videoLink: "https://www.tiktok.com/@yourusername/video/1234567890", // Replace with your TikTok link
    videoSource: "TikTok",
  },
  {
    id: "prod-002",
    name: "Leather Crossbody Bag",
    name_kh: "កាបូបស្បែកឆ្លងដើមទ្រូង",
    description: "Handcrafted genuine leather bag with gold-tone hardware. Timeless design for everyday elegance.",
    description_kh: "កាបូបស្បែកពិតប្រាកដ ផលិតដោយដៃ ជាមួយគ្រឿងបន្ថែមពណ៌មាស។ ការរចនាដ៏ស្រស់ស្អាតសម្រាប់រាល់ថ្ងៃ។",
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
    details_kh: [
      "ស្បែកពិតប្រាកដ",
      "គ្រឿងបន្ថែមពណ៌មាស",
      "ខ្សែអាចកែតម្រូវបាន",
      "ហោប៉ៅខាងក្នុងមានរ៉ូឡែត",
      "ការបិទដោយម៉ាញេទិក",
    ],
    videoLink: "https://www.tiktok.com/@yourusername/video/1234567891", // Replace
    videoSource: "TikTok",
  },
  {
    id: "prod-003",
    name: "Artisan Ceramic Mug Set",
    name_kh: "ឈុតពែងសេរ៉ាមិចសិប្បកម្ម",
    description: "Set of 4 handcrafted ceramic mugs in earthy tones. Each piece is unique and microwave safe.",
    description_kh: "ឈុតពែងសេរ៉ាមិច ៤ ផលិតដោយដៃ ពណ៌ធម្មជាតិ។ គ្រប់ផលិតផលមានលក្ខណៈពិសេស និងអាចប្រើក្នុងមីក្រូវ៉េវ។",
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
    details_kh: [
      "ឈុតពែង ៤",
      "សេរ៉ាមិចផលិតដោយដៃ",
      "អាចប្រើក្នុងមីក្រូវ៉េវ និងម៉ាស៊ីនលាងចាន",
      "សមត្ថភាព ១២ អោន ក្នុងមួយ",
      "ពណ៌ធម្មជាតិ",
    ],
    videoLink: "https://www.tiktok.com/@yourusername/video/1234567892", // Replace
    videoSource: "TikTok",
  },
  {
    id: "prod-004",
    name: "Natural Skincare Collection",
    name_kh: "បណ្តុំផលិតផលថែរក្សាស្បែកធម្មជាតិ",
    description: "Complete skincare set with botanical serum, facial oil, and moisturizer. All-natural ingredients.",
    description_kh: "ឈុតថែរក្សាស្បែកពេញលេញ ជាមួយសេរ៉ូមរុក្ខជាតិ ប្រេងមុខ និងក្រែមសើម។ គ្រឿងផ្សំធម្មជាតិ ១០០%។",
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
    details_kh: [
      "គ្រឿងផ្សំធម្មជាតិ ១០០%",
      "រួមបញ្ចូលសេរ៉ូម ប្រេង និងក្រែម",
      "សមរម្យសម្រាប់គ្រប់ប្រភេទស្បែក",
      "មិនសាកល្បងលើសត្វ និងវេហ្គែន",
      "វេចខ្ចប់កញ្ចក់",
    ],
    videoLink: "https://www.tiktok.com/@yourusername/video/1234567893", // Replace
    videoSource: "TikTok",
  },
  {
    id: "prod-005",
    name: "Minimalist Watch",
    name_kh: "នាឡិកាដៃបែបមីនីម៉ាលីស",
    description: "Sleek analog watch with genuine leather strap. Japanese quartz movement for precise timekeeping.",
    description_kh: "នាឡិកាដៃអាណាឡូកស្អាត ជាមួយខ្សែស្បែកពិតប្រាកដ។ ចលនាកវ៉ាតជប៉ុនសម្រាប់ការកំណត់ពេលវេលាត្រឹមត្រូវ។",
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
    details_kh: [
      "ចលនាកវ៉ាតជប៉ុន",
      "ខ្សែស្បែកពិតប្រាកដ",
      "កញ្ចក់គ្រីស្តាល់សាហ្វៀ",
      "ការពារទឹក ៣០ ម៉ែត្រ",
      "ធានា ២ ឆ្នាំ",
    ],
    videoLink: "https://www.tiktok.com/@yourusername/video/1234567894", // Replace
    videoSource: "TikTok",
  },
  {
    id: "prod-006",
    name: "Wireless Earbuds Pro",
    name_kh: "កាស់ឥតខ្សែ Pro",
    description: "Active noise cancellation with crystal-clear audio. 30-hour total battery with charging case.",
    description_kh: "ការលុបបំបាត់សម្លេងរំខាន ជាមួយសម្លេងច្បាស់។ ថ្មសរុប ៣០ ម៉ោង ជាមួយប្រអប់សាកថ្ម។",
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
    details_kh: [
      "ការលុបបំបាត់សម្លេងរំខាន",
      "ថ្មសរុប ៣០ ម៉ោង",
      "Bluetooth 5.3",
      "ការគ្រប់គ្រងដោយប៉ះ",
      "ការពារញើស IPX4",
    ],
    videoLink: "https://www.tiktok.com/@yourusername/video/1234567895", // Replace
    videoSource: "TikTok",
  },
  {
    id: "prod-007",
    name: "Scented Soy Candle Set",
    name_kh: "ឈុតទៀនសណ្តែកសៀងមានក្លិនក្រអូប",
    description: "Hand-poured soy candles in 3 calming scents: lavender, vanilla, and sandalwood.",
    description_kh: "ទៀនសណ្តែកសៀងចាក់ដោយដៃ ក្នុងក្លិនក្រអូប ៣ យ៉ាង: ឡាវេនឌឺ វ៉ានីឡា និងសាន់ដាលវូដ។",
    price: 28.00,
    currency: "USD",
    category: "home",
    badge: "popular",
    image: "https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=600&h=600&fit=crop",
    inStock: true,
    details: [
      "100% soy wax",
      "Set of 3 candles",
      "40-hour burn time each",
      "Cotton wick",
      "Reusable glass jars",
    ],
    details_kh: [
      "ក្រមួនសណ្តែកសៀង ១០០%",
      "ឈុតទៀន ៣",
      "ពេលវេលាឆេះ ៤០ ម៉ោងក្នុងមួយ",
      "ខ្សែទៀនកប្បាស",
      "ពែងកញ្ចក់អាចប្រើឡើងវិញ",
    ],
    videoLink: "https://www.tiktok.com/@yourusername/video/1234567896", // Replace
    videoSource: "TikTok",
  },
];

/*
 * STORE CONFIGURATION
 * ==================
 * Update these values with your real information:
 */
export const STORE_CONFIG = {
  name: "Your Store",
  name_kh: "ហាងរបស់អ្នក",
  tagline: "Discover Products You'll Love",
  tagline_kh: "រកឃើញផលិតផលដែលអ្នកចូលចិត្ត",
  description: "Browse our curated collection and message us on Telegram to order. Fast replies, easy shopping.",
  description_kh: "រកមើលផលិតផលរបស់យើង ហើយផ្ញើសារមកយើងតាម Telegram ដើម្បីបញ្ជាទិញ។ ឆ្លើយតបរហ័ស ទិញទំនិញងាយស្រួល។",
  currency: "USD",
  currencySymbol: "$",

  // === SOCIAL LINKS — Replace with your real links ===
  telegramUsername: "yourusername",           // Your Telegram username (without @)
  telegramChannel: "https://t.me/yourchannel", // Your Telegram channel link
  telegramMiniApp: "https://t.me/yourbot/app", // Your Telegram Mini App link
  facebookPage: "https://facebook.com/yourpage", // Your Facebook business page
  tiktok: "https://tiktok.com/@yourusername",    // Your TikTok profile
  instagram: "https://instagram.com/yourusername", // Your Instagram profile
};
