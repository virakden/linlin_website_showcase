/*
 * LinLin Natural Cosmetic - Product Data
 * លីនលីន ទឹកពន្លៃ - ផលិតផលធម្មជាតិខ្មែរ
 *
 * HOW TO ADD IMAGES:
 * 1. Save product images as 001.jpg, 002.jpg, etc.
 * 2. Put them in: client/public/products/
 * 3. Recommended size: 600x600 pixels, square crop
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
  {
    id: "all",
    name: "All Products",
    name_kh: "ផលិតផលទាំងអស់",
    icon: "LayoutGrid",
  },
  { id: "terkpley", name: "Terk-Pley", name_kh: "ទឹកពន្លៃ", icon: "Droplets" },
  { id: "oil", name: "Body Oil", name_kh: "ប្រេងផ្កា", icon: "Flower2" },
  { id: "scrub", name: "Scrub", name_kh: "ស្រ្កាប់ធម្មជាតិ", icon: "Sparkles" },
  {
    id: "lotion",
    name: "Lotion & Serum",
    name_kh: "ឡេ & សារ៉ូម",
    icon: "Milk",
  },
  { id: "mask", name: "Face Mask", name_kh: "ម៉ាសមុខ", icon: "Smile" },
  {
    id: "turmeric",
    name: "Turmeric",
    name_kh: "រមៀតសូន & ម្សៅរមៀត",
    icon: "Leaf",
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "prod-001",
    name: "Turmeric Liquid (1L) + Stretch Mark Oil Set",
    name_kh: "ឈុតទឹកពន្លៃ ធុងធំ១លីត្រ+ ប្រេងសង្វារ",
    description:
      "A 1-liter turmeric liquid set designed for use during menstruation and suitable for those with sensitive or delicate skin. Helps reduce stretch marks and dark spots while nourishing the skin. Promotes a brighter, clearer complexion and healthier-l...",
    description_kh:
      "ទឹកពន្លៃសំរាប់ប្រើប្រាស់ពេលមកខែ នឹងបងអូនអ្នកសសៃខ្ចី ព្យាបាលសង្វារ ស្នាមអុជខ្មៅ ជំនួយសាច់ចាំ ស្បែកសភ្លឺថ្លា",
    price: 20.0,
    currency: "USD",
    category: "terkpley",
    image: "/products/terkpley/001.jpg",
    badge: "popular",
    inStock: true,
  },
  {
    id: "prod-002",
    name: "Sensitive Skin Care Set for Firm, Healthy Skin",
    name_kh: "ឈុតអ្នកសសៃខ្ចី ឆ្អិនសសៃល្អ សាច់ហាប់សាច់ចាំ",
    description:
      "Specially designed for delicate and sensitive skin, especially for those preparing for postpartum care. This complete set supports skin recovery from within, helping to reduce dark spots, rough patches, and pigmentation around the abdomen and neck.",
    description_kh:
      "សសៃខ្ចីត្រូវត្រៀមសម្រាល ឈុតគ្រប់មុខជំនួយស្បែកពីខាងក្នុង ព្យាបាលស្នាម នឹងក្រិនខ្មៅ ក្អែរពោះឬ ករ បាត់សង្វារ",
    price: 34.0,
    currency: "USD",
    category: "terkpley",
    image: "/products/terkpley/002.jpg",
    badge: "popular",
    inStock: true,
  },
  {
    id: "prod-003",
    name: "Skin Treatment Set for Menstrual Care & Sensitive Skin",
    name_kh: "ឈុតព្យាបាលស្បែក សំរាប់អ្នកមកខែ នឹងសសៃខ្ចី",
    description:
      "A turmeric-based skincare set designed for use during menstruation and suitable for delicate, sensitive skin. Helps reduce the appearance of stretch marks and dark spots while supporting skin nourishment and recovery.",
    description_kh:
      "ទឹកពន្លៃសំរាប់ប្រើប្រាស់ពេលមកខែ នឹងបងអូនអ្នកសសៃខ្ចី ព្យាបាលសង្វារ ស្នាមអុជខ្មៅ ជំនួយសាច់ចាំ ស្បែកសភ្លឺថ្លា",
    price: 30.0,
    currency: "USD",
    category: "terkpley",
    image: "/products/terkpley/003.jpg",
    inStock: true,
  },
  {
    id: "prod-004",
    name: "Large Turmeric Liquid (3 Liters) + Free 1kg Turmeric Pulp",
    name_kh: "ធុងធំចំណុះ3លីត្រ ( ថែមកាកពន្លៃ១គីឡូ)",
    description:
      "A 3-liter turmeric liquid designed for use during menstruation and suitable for sensitive or delicate skin. Helps reduce stretch marks and dark spots while nourishing and supporting skin recovery.",
    description_kh:
      "ទឹកពន្លៃសំរាប់ប្រើប្រាស់ពេលមកខែ នឹងបងអូនអ្នកសសៃខ្ចី ព្យាបាលសង្វារ ស្នាមអុជខ្មៅ ជំនួយសាច់ចាំ ស្បែកសភ្លឺថ្លា",
    price: 35.0,
    currency: "USD",
    category: "terkpley",
    image: "/products/terkpley/004.jpg",
    inStock: true,
  },
  {
    id: "prod-005",
    name: "Stretch Mark Treatment Flower Oil (Small Bottle)",
    name_kh: "ប្រេងផ្កាព្យាបាលសង្វារ ដបតូច",
    description:
      "Body Oil by LinLin, infused with 12 types of natural flower extracts in one bottle. Features a light, pleasant floral fragrance.",
    description_kh:
      "ប្រេងផ្កាចំរាញ់ 12មុខ ក្នុង១ដប ក្លិនផ្កាក្រអូបប្រហើរៗ  ✨ ប្រេងលាបស្បែកផ្ដោតទៅលើសង្វារក្រហមសឬអ្នកអត់សង្វាក៏អាចលាបបានយកទៅលាយជាមួយឡេឬលាបសុទ្ធជាប្រចាំថ្ងៃ។",
    price: 6.0,
    currency: "USD",
    category: "oil",
    image: "/products/oil/005.jpg",
    badge: "new",
    inStock: true,
  },
  {
    id: "prod-006",
    name: "Stretch Mark Treatment Flower Oil (Big Bottle)",
    name_kh: "ប្រេងផ្កាព្យាបាលសង្វារ ដបធំ",
    description:
      "Body Oil by LinLin, infused with 12 types of natural flower extracts in one bottle. Features a light, pleasant floral fragrance.",
    description_kh:
      "ប្រេងផ្កាចំរាញ់ 12មុខ ក្នុង១ដប ក្លិនផ្កាក្រអូបប្រហើរៗ  ✨ ប្រេងលាបស្បែកផ្ដោតទៅលើសង្វារក្រហមសឬអ្នកអត់សង្វាក៏អាចលាបបានយកទៅលាយជាមួយឡេឬលាបសុទ្ធជាប្រចាំថ្ងៃ។",
    price: 25.0,
    currency: "USD",
    category: "oil",
    image: "/products/oil/006.jpg",
    inStock: true,
  },
  {
    id: "prod-007",
    name: "Sets TerkPley + Stretch Mark Treatment Flower Oil (Big Bottle)",
    name_kh: "ឈុតទឹកពន្លៃស្រស់+ ប្រេងផ្កាព្យាបាលសង្វារ ដបធំ",
    description:
      "Body Oil by LinLin, infused with 12 types of natural flower extracts in one bottle. Features a light, pleasant floral fragrance.",
    description_kh:
      "ប្រេងផ្កាចំរាញ់ 12មុខ ក្នុង១ដប ក្លិនផ្កាក្រអូបប្រហើរៗ  ✨ ប្រេងលាបស្បែកផ្ដោតទៅលើសង្វារក្រហមសឬអ្នកអត់សង្វាក៏អាចលាបបានយកទៅលាយជាមួយឡេឬលាបសុទ្ធជាប្រចាំថ្ងៃ។",
    price: 32.0,
    currency: "USD",
    category: "oil",
    image: "/products/oil/007.jpg",
    inStock: true,
  },
  {
    id: "prod-008",
    name: "Body Lotion + Oil + TerkPley",
    name_kh: "ឈុតឡេ + ប្រេងផ្កា + ទឹកពន្លៃស្រស់",
    description:
      "A skin care set that whitens and thickens the skin, eliminates dark spots, acne, and thin, damaged skin, red spots, stretch marks, and freckles over the years.",
    description_kh:
      "ឈុតបំប៉ន់អោយស្បែក សរក្រាស់ៗ បំបាត់ស្នាមអុជខ្មៅ មុនខ្នង នឹងស្បែកស្តើងខូច សសៃក្រហម សង្វារ អាចម៍រុយយូរឆ្នាំ",
    price: 32.0,
    currency: "USD",
    category: "oil",
    image: "/products/oil/008.jpg",
    inStock: true,
  },
  {
    id: "prod-009",
    name: "Medium Set for Treating Veins & Damaged, Thinning Skin",
    name_kh: "ទឹកពន្លៃធុង១លីត្រ + ប្រេងផ្កា + ស្ក្រាប់មើមពន្លៃដោះគោ",
    description:
      "A complete skincare set including 1-liter turmeric liquid, flower oil, and turmeric milk scrub. Designed to help improve the appearance of visible veins, reduce stretch marks, and restore damaged or thinning skin.",
    description_kh: "ឈុតខ្នាតកណ្តាល ព្យាបាលសសៃ នឹងសង្វារស្បែកខូចស្តើង",
    price: 29.0,
    currency: "USD",
    category: "oil",
    image: "/products/oil/009.jpg",
    inStock: true,
  },
  {
    id: "prod-010",
    name: "Turmeric Milk Scrub + Coffee Herbal Oil Scrub + Flower Oil (Suitable for All Body Types)",
    name_kh:
      "ឈុតស្ក្រាប់មើមពន្លៃដោះគោ + ស្ក្រាប់កាហ្វេប្រេងចិន+ ប្រេងផ្កា ( អ្នកទម្ងន់ប្រើបាន)",
    description:
      "This exfoliating set is suitable for all users, including during menstruation: During menstrual cycle, For new moms, for thoes with weight concerns.",
    description_kh:
      "អ្នកមករដូវ = ព្យាបាលសង្វារ ឬ ស្នាមអុជខ្មៅ ជំរុះក្អែលឡេ ឬ ដីជាប់គល់រោម ផ្តល់សំណើមម៉ត់ថ្លា បាត់រលាកគល់រោម ជួយអោយសថ្លារលោង ពីខាងក្នុង លាបឡេទទួលបានផលលឿន",
    price: 24.0,
    currency: "USD",
    category: "scrub",
    image: "/products/scrub/010.jpg",
    inStock: true,
  },
  {
    id: "prod-011",
    name: "ឈុតស្ក្រាប់មើមពន្លៃដោះគោ + ស្ក្រាប់កាហ្វេប្រេងចិន( អ្នកទម្ងន់ប្រើបាន)",
    name_kh:
      "ឈុតស្ក្រាប់មើមពន្លៃដោះគោ + ស្ក្រាប់កាហ្វេប្រេងចិន( អ្នកទម្ងន់ប្រើបាន)",
    description:
      "Turmeric Milk Scrub + Coffee Herbal Oil Scrub Description: During menstrual, For new mom, For those with weight concerns.",
    description_kh:
      "អ្នកមករដូវ = ព្យាបាលសង្វារ ឬ ស្នាមអុជខ្មៅ ជំរុះក្អែលឡេ ឬ ដីជាប់គល់រោម ផ្តល់សំណើមម៉ត់ថ្លា បាត់រលាកគល់រោម ជួយអោយសថ្លារលោង ពីខាងក្នុង លាបឡេទទួលបានផលលឿន",
    price: 18.0,
    currency: "USD",
    category: "scrub",
    image: "/products/scrub/011.jpg",
    inStock: true,
  },
  {
    id: "prod-012",
    name: "Turmeric Milk Scrub (600g)",
    name_kh: "ស្ក្រាប់មើមពន្លៃដោះគោ( 600g )",
    description:
      "Enriched with turmeric, milk, goat milk, and mint, this scrub provides a refreshing cooling sensation during use. It helps brighten and smooth the skin, reduce stretch marks, and soothe sensitive, easily irritated skin.",
    description_kh:
      "-ស្រ្កាប់ពន្លៃមានដោះគោ + ទឹកដោះពពែ + ជីអង្កាម ពេលប្រើត្រជាក់ប្រហើរសាយភាយ ជួយអោយ ភ្លឺរលោង បំបាត់សង្វារ ស្បែកដែរ ងាយរោល រមាស់ អាចប្រើបានមានរូបមន្ត ខ្ទឹះដូង:ជួយអោយ សភ្លឺថ្លា មានសំណើម",
    price: 9.0,
    currency: "USD",
    category: "scrub",
    image: "/products/scrub/012.jpg",
    inStock: true,
  },
  {
    id: "prod-013",
    name: "Traditional Herbal Coffee Oil Scrub (600g)",
    name_kh: "ស្ក្រាប់កាហ្វេប្រេងចិនសែបុរាណ 600g )",
    description:
      "Formulated with coffee and a blend of 12 traditional herbal oils, enriched with goat milk and fresh milk. This scrub helps remove dead skin cells, reduce dark spots, rough patches, and back acne. Effectively cleanses product buildup and impurities...",
    description_kh:
      "-ស្រ្កាប់កាហ្វេរួមផ្សំប្រេងចិនសែ 12មុខ  + ទឹកដោះពពែ + ដោះគោស្រស់ជួយជំរុសកោសិកា ចាស់ៗចេញ ព្យាបាលស្នាម អុចខ្មៅ ស្នាមក្រិន មុនខ្នង ក្អែរឡេ ក្អែរដីជាប់គល់រោម កំចាត់បានស្អាតស្បែកសម៉ត់ ផ្ចិតគល់រោមអោយតូចល្អិត មានជាតិសំណើម99%",
    price: 9.0,
    currency: "USD",
    category: "scrub",
    image: "/products/scrub/013.jpg",
    inStock: true,
  },
  {
    id: "prod-014",
    name: "Pink Lotion Set + Flower Oil + Instant Whitening Cream x10",
    name_kh: "ឈុតឡេសឈូក+ ប្រេងផ្កា + គ្រីមបំបុកសលឿនx10",
    description:
      "A glowing skin set designed for fast whitening. Helps brighten dull, yellow, and dark gray skin. Suitable for weak or sensitive skin with visible red veins.",
    description_kh:
      "ឈុតឡេ Glowing skin សលឿន បំបាត់ស្បែកលឿង ខ្មៅប្រផេះខ្លាំង ស្បែកខ្សោយមានសសៃក្រហម",
    price: 36.0,
    currency: "USD",
    category: "lotion",
    image: "/products/lotion/014.jpg",
    badge: "popular",
    inStock: true,
  },
  {
    id: "prod-015",
    name: "LinLin body lotion 1box 600g",
    name_kh: "ឡេ ១ប្រអប់​ ៦០០ក្រាម",
    description:
      "Specially formulated for yellow-toned, dry, and damaged skin. Ideal for skin with strong or visible stretch marks and thinning texture. This nourishing lotion helps improve skin clarity, leaving it brighter with a soft pink glow. It works to reduc...",
    description_kh:
      "ផ្តោតសំខាន់អ្នកស្បែកលឿង ស្បែកស្ងួត ឬ សង្វារ មានស្នាមខ្លាំង ឬ ស្តើងខ្លាំង អាចសាកឡេចិញ្ចឹមបំប៉ន់អោយ សថ្លា សឈូកបំបាត់សង្វារ នឹងសសៃក្រហម សបែបក្រាស់ៗ",
    price: 20.0,
    currency: "USD",
    category: "lotion",
    image: "/products/lotion/015.jpg",
    inStock: true,
  },
  {
    id: "prod-016",
    name: "LinLin Body Lotion Set + Flower Oil + Fresh Turmeric Essence",
    name_kh: "ឈុតឡេសឈូក+ ប្រេងផ្កា + ទឹកពន្លៃ",
    description:
      "This set is suitable for daily use, including during and after your menstrual cycle. It helps strengthen the skin, leaving it glowing and smooth. Works to tighten pores, reduce severely thinning and damaged skin, and support skin regeneration prom...",
    description_kh:
      "ឈុតនេះប្រើបានទាំងពេលមកខែ នឹងថ្ងៃអស់រដូវ លាបជាប្រចាំថ្ងៃ ស្បែកកាន់តែមាំ Glow and smooth ផ្ចិតគល់រោមអោយតូច បំបាត់ស្បែកស្តើងខ្លាំង ស្បែកខូចកោសិកា បណ្តុះកោសិកាអោយសក្រាស់ៗ",
    price: 32.0,
    currency: "USD",
    category: "lotion",
    image: "/products/lotion/016.jpg",
    inStock: true,
  },
  {
    id: "prod-029",
    name: "Pink Lotion Set + Flower Oil",
    name_kh: "ឈុតឡេសឈូក+ ប្រេងផ្កាព្យាបាលសង្វារ",
    description:
      "A glowing skin set designed for fast whitening. Helps brighten dull, yellow, and dark gray skin. Suitable for weak or sensitive skin with visible red veins.",
    description_kh:
      "ឈុតឡេ Glowing skin សលឿន បំបាត់ស្បែកលឿង ខ្មៅប្រផេះខ្លាំង ស្បែកខ្សោយមានសសៃក្រហម",
    price: 26.0,
    currency: "USD",
    category: "lotion",
    image: "/products/lotion/029.jpg",
    inStock: true,
  },
  {
    id: "prod-017",
    name: "LinLin Body Lotion Set + Whitening Cream + Turmeric Milk Stretch Mark Scrub + Herbal Coffee Oil",
    name_kh:
      "ឈុតឡេសឈូក+ គ្រីមបំបុកស + ស្ក្រាប់ព្យាបាលសង្វារមើមពន្លៃដោះគោ + កាហ្វេប្រេងចិនសែ",
    description:
      "This complete skincare set is suitable for daily use, including during and after your menstrual cycle. It helps strengthen and restore the skin, leaving it glowing and smooth. Minimizes the appearance of pores, reduces severely thinning and damage...",
    description_kh:
      "ឈុតនេះប្រើបានទាំងពេលមកខែ នឹងថ្ងៃអស់រដូវ លាបជាប្រចាំថ្ងៃ ស្បែកកាន់តែមាំ Glow and smooth ផ្ចិតគល់រោមអោយតូច បំបាត់ស្បែកស្តើងខ្លាំង ស្បែកខូចកោសិកា បណ្តុះកោសិកាអោយសក្រាស់ៗ",
    price: 48.0,
    currency: "USD",
    category: "lotion",
    image: "/products/lotion/017.jpg",
    inStock: true,
  },
  {
    id: "prod-018",
    name: "Rice Water Mask + Turmeric & Wild Honey Mask (Mini Set)",
    name_kh:
      "ម៉ាសទឹកអង្ករសម្រូបទឹកមាត់ត្រចៀកកាំ+ ម៉ាសក្បាលរមៀតទឹកឃ្មុំព្រៃ ( ឈុតតូច )",
    description:
      "A natural facial treatment set designed to brighten, smooth, and refine the skin. The rice water mask helps enhance skin clarity, minimize the appearance of pores, and deliver an instantly fresh, radiant glow from within. It also soothes irritatio...",
    description_kh:
      "អប់មុខ ធម្មជាតិ ម៉ាសទឹកអង្ករសម្រូបជួយមុខសភ្លឺម៉ត់ ផ្ចិតរន្ធញើសអោយតូច មុខស បិតភ្លាមប្លែកថ្លាចេញពីក្នុង បំបាត់រោលរមាស់ក្រហម",
    price: 18.0,
    currency: "USD",
    category: "mask",
    image: "/products/mask/018.jpg",
    badge: "new",
    inStock: true,
  },
  {
    id: "prod-019",
    name: "Rice Water Mask + Turmeric & Wild Honey Mask (Large Set – 100g)",
    name_kh:
      "ម៉ាសទឹកអង្ករសម្រូបទឹកមាត់ត្រចៀកកាំ+ ម៉ាសក្បាលរមៀតទឹកឃ្មុំព្រៃ ( ឈុតធំ 100ក្រាម )",
    description:
      "A natural facial treatment designed to brighten, smooth, and refine the skin. The rice water mask helps improve skin clarity, minimize the appearance of pores, and deliver an instant radiant glow from within. It also soothes irritation, reduces re...",
    description_kh:
      "អប់មុខ ធម្មជាតិ ម៉ាសទឹកអង្ករសម្រូបជួយមុខសភ្លឺម៉ត់ ផ្ចិតរន្ធញើសអោយតូច មុខស បិតភ្លាមប្លែកថ្លាចេញពីក្នុង បំបាត់រោលរមាស់ក្រហម ជួយផ្ចិតរន្ធញើសអោយតូចល្អិត ហើយជួយបណ្តឹងស្បែកមុខ",
    price: 27.0,
    currency: "USD",
    category: "mask",
    image: "/products/mask/019.jpg",
    inStock: true,
  },
  {
    id: "prod-020",
    name: "Rice Water Brightening Mask (Large – 100g)",
    name_kh: "ម៉ាសទឹកអង្ករសម្រូបទឹកមាត់( ធំ 100ក្រាម )",
    description:
      "A natural facial mask designed to brighten and smooth the skin. The rice water formula helps improve skin clarity, refine pores, and deliver an instant radiant glow from within.",
    description_kh:
      "អប់មុខ ធម្មជាតិ ម៉ាសទឹកអង្ករសម្រូបជួយមុខសភ្លឺម៉ត់ ផ្ចិតរន្ធញើសអោយតូច មុខស បិតភ្លាមប្លែកថ្លាចេញពីក្នុង បំបាត់រោលរមាស់ក្រហម ជួយផ្ចិតរន្ធញើសអោយតូចល្អិត ហើយជួយបណ្តឹងស្បែកមុខ",
    price: 15.0,
    currency: "USD",
    category: "mask",
    image: "/products/mask/020.jpg",
    inStock: true,
  },
  {
    id: "prod-021",
    name: "Rice Water Brightening Mask (Small – 50g)",
    name_kh: "ម៉ាសទឹកអង្ករសម្រូបទឹកមាត់(small 50g )",
    description:
      "A natural facial mask designed to brighten and smooth the skin. The rice water formula helps improve skin clarity, refine the appearance of pores, and deliver an instant radiant glow from within.",
    description_kh:
      "អប់មុខ ធម្មជាតិ ម៉ាសទឹកអង្ករសម្រូបជួយមុខសភ្លឺម៉ត់ ផ្ចិតរន្ធញើសអោយតូច មុខស បិតភ្លាមប្លែកថ្លាចេញពីក្នុង បំបាត់រោលរមាស់ក្រហម ជួយផ្ចិតរន្ធញើសអោយតូចល្អិត ហើយជួយបណ្តឹងស្បែកមុខ",
    price: 10.0,
    currency: "USD",
    category: "mask",
    image: "/products/mask/021.jpg",
    inStock: true,
  },
  {
    id: "prod-022",
    name: "Turmeric & Wild Honey Facial Mask (Large – 100g)",
    name_kh: "ម៉ាសក្បាលរមៀតទឹកឃ្មុំព្រៃ ( ធំ 100ក្រាម )",
    description:
      "✔️ Helps treat skin concerns faster than regular masks ✔️ Enriched with Khmer turmeric, pure wild honey, traditional herbal extracts, natural oils, and Vitamin E ✔️ Supports skin cell regeneration for a brighter, clearer complexion",
    description_kh:
      "ជួយព្យាបាលស្នាមបានលឿន ជាងម៉ាសទូទៅ ដោយសាររួមបញ្ចូលក្បាលរមៀតខ្មែរ+ ទឹកឃ្មុំព្រៃសុទ្ធធម្មជាតិ + ប្រទាលខ្មែរ + ប្រេងធម្មជាតិ + វិតាមីន E ជួយបណ្តុះកោសិកាស្បែកមុខ មុខភ្លឺថ្លា ជួយបឺតយកជាតិពុល សម្អាតធូលីដី គ្រឿង make up",
    price: 12.0,
    currency: "USD",
    category: "mask",
    image: "/products/mask/022.jpg",
    inStock: true,
  },
  {
    id: "prod-023",
    name: "Turmeric & Wild Honey Facial Mask (Small – 50g)",
    name_kh: "ម៉ាសក្បាលរមៀតទឹកឃ្មុំព្រៃ (តូច 50ក្រាម )",
    description:
      "✔️ Helps treat skin concerns faster than regular masks ✔️ Enriched with Khmer turmeric, pure wild honey, traditional herbal extracts, natural oils, and Vitamin E ✔️ Supports skin cell regeneration for a brighter, clearer complexion",
    description_kh:
      "✔️ជួយព្យាបាលស្នាមបានលឿន ជាងម៉ាសទូទៅ ដោយសាររួមបញ្ចូលក្បាលរមៀតខ្មែរ+ ទឹកឃ្មុំព្រៃសុទ្ធធម្មជាតិ + ប្រទាលខ្មែរ + ប្រេងធម្មជាតិ + វិតាមីន E ជួយបណ្តុះកោសិកាស្បែកមុខ មុខភ្លឺថ្លា ជួយបឺតយកជាតិពុល សម្អាតធូលីដី គ្រឿង make up",
    price: 8.0,
    currency: "USD",
    category: "mask",
    image: "/products/mask/023.jpg",
    inStock: true,
  },
  {
    id: "prod-024",
    name: "Turmeric Powder + Fresh Turmeric with Wild Honey (Large Set)",
    name_kh: "ម្សៅរមៀត + ពន្លៃរមៀតសូនទឹកឃ្មុំព្រៃ ( ឈុតធំ)",
    description:
      "Helps relieve body aches, back and waist pain, and supports relaxation, better sleep, and reduced stress. Also beneficial for digestive health.",
    description_kh:
      "រោគស្រ្តី រាំង.រដូវ ឈឺចាប់ពេលមករដូវ ធ្លាក់សរ មានផ្សិត បាក់តេរី ញាំហើយមករដូវទៀងទាត់ មិមចុកពោះ សម្រួលសសៃបំបាត់ចុករោយឆ្អឹង ចង្កេះ ជួយគេងមិនលក់ ស្រ្តេស ខ្សោយក្រពះពោះវៀន ជួយអោយសាច់ចាំ និងស្បែកភ្លឺថ្លា ព្រោះរមៀតសម្បូរ ខូឡាជែន កាលហ្សូមជាតិដែក ដែរជួយបង្កើ...",
    price: 23.0,
    currency: "USD",
    category: "turmeric",
    image: "/products/turmeric/024.jpg",
    badge: "new",
    inStock: true,
  },
  {
    id: "prod-025",
    name: "Turmeric Powder",
    name_kh: "ម្សៅរមៀត ( 200ក្រាម)",
    description:
      "Helps relieve body aches, back and waist pain, and supports relaxation, better sleep, and reduced stress. Also beneficial for digestive health.",
    description_kh:
      "រោគស្រ្តី រាំង.រដូវ ឈឺចាប់ពេលមករដូវ ធ្លាក់សរ មានផ្សិត បាក់តេរី ញាំហើយមករដូវទៀងទាត់ មិមចុកពោះ សម្រួលសសៃបំបាត់ចុករោយឆ្អឹង ចង្កេះ ជួយគេងមិនលក់ ស្រ្តេស ខ្សោយក្រពះពោះវៀន ជួយអោយសាច់ចាំ និងស្បែកភ្លឺថ្លា ព្រោះរមៀតសម្បូរ ខូឡាជែន កាលហ្សូមជាតិដែក ដែរជួយបង្កើ...",
    price: 9.0,
    currency: "USD",
    category: "turmeric",
    image: "/products/turmeric/025.jpg",
    inStock: true,
  },
  {
    id: "prod-026",
    name: "Turmeric Powder + Fresh Turmeric with Wild Honey (small Set)",
    name_kh: "ម្សៅរមៀត + ពន្លៃរមៀតសូនទឹកឃ្មុំព្រៃ ( ឈុតតូច)",
    description:
      "Helps relieve body aches, back and waist pain, and supports relaxation, better sleep, and reduced stress. Also beneficial for digestive health.",
    description_kh:
      "រោគស្រ្តី រាំង.រដូវ ឈឺចាប់ពេលមករដូវ ធ្លាក់សរ មានផ្សិត បាក់តេរី ញាំហើយមករដូវទៀងទាត់ មិមចុកពោះ សម្រួលសសៃបំបាត់ចុករោយឆ្អឹង ចង្កេះ ជួយគេងមិនលក់ ស្រ្តេស ខ្សោយក្រពះពោះវៀន ជួយអោយសាច់ចាំ និងស្បែកភ្លឺថ្លា ព្រោះរមៀតសម្បូរ ខូឡាជែន កាលហ្សូមជាតិដែក ដែរជួយបង្កើ...",
    price: 18.0,
    currency: "USD",
    category: "turmeric",
    image: "/products/turmeric/026.jpg",
    inStock: true,
  },
  {
    id: "prod-027",
    name: "Fresh Turmeric with Wild Honey ( Big 200g)",
    name_kh: "ពន្លៃរមៀតសូនទឹកឃ្មុំព្រៃ ( កែវធំ 200ក្រាម)",
    description:
      "Helps relieve body aches, back and waist pain, and supports relaxation, better sleep, and reduced stress. Also beneficial for digestive health.",
    description_kh:
      "រោគស្រ្តី រាំង.រដូវ ឈឺចាប់ពេលមករដូវ ធ្លាក់សរ មានផ្សិត បាក់តេរី ញាំហើយមករដូវទៀងទាត់ មិមចុកពោះ សម្រួលសសៃបំបាត់ចុករោយឆ្អឹង ចង្កេះ ជួយគេងមិនលក់ ស្រ្តេស ខ្សោយក្រពះពោះវៀន ជួយអោយសាច់ចាំ និងស្បែកភ្លឺថ្លា ព្រោះរមៀតសម្បូរ ខូឡាជែន កាលហ្សូមជាតិដែក ដែរជួយបង្កើ...",
    price: 14.0,
    currency: "USD",
    category: "turmeric",
    image: "/products/turmeric/027.jpg",
    inStock: true,
  },
  {
    id: "prod-028",
    name: "Fresh Turmeric with Wild Honey (small 100g )",
    name_kh: "ពន្លៃរមៀតសូនទឹកឃ្មុំព្រៃ ( តូច 100ក្រាម )",
    description:
      "Helps relieve body aches, back and waist pain, and supports relaxation, better sleep, and reduced stress. Also beneficial for digestive health.",
    description_kh:
      "រោគស្រ្តី រាំង.រដូវ ឈឺចាប់ពេលមករដូវ ធ្លាក់សរ មានផ្សិត បាក់តេរី ញាំហើយមករដូវទៀងទាត់ មិមចុកពោះ សម្រួលសសៃបំបាត់ចុករោយឆ្អឹង ចង្កេះ ជួយគេងមិនលក់ ស្រ្តេស ខ្សោយក្រពះពោះវៀន ជួយអោយសាច់ចាំ និងស្បែកភ្លឺថ្លា ព្រោះរមៀតសម្បូរ ខូឡាជែន កាលហ្សូមជាតិដែក ដែរជួយបង្កើ...",
    price: 9.0,
    currency: "USD",
    category: "turmeric",
    image: "/products/turmeric/028.jpg",
    inStock: true,
  },
];

/*
 * STORE CONFIGURATION
 */
export const STORE_CONFIG = {
  name: "LinLin Natural Cosmetic",
  name_kh: "លីនលីន ទឹកពន្លៃ",
  tagline: "Natural Khmer Skincare Products",
  tagline_kh: "ផលិតផលថែរក្សាស្បែកធម្មជាតិខ្មែរ",
  logoUrl: "/logo.png",
  description:
    "Handmade natural skincare products from Cambodia. Traditional recipes with modern care.",
  description_kh:
    "ផលិតផលថែរក្សាស្បែកធម្មជាតិផលិតដោយដៃពីកម្ពុជា។ រូបមន្តបុរាណជាមួយការថែទាំទំនើប។",
  currency: "USD",
  currencySymbol: "$",
  phone: "096 9447 146",

  // Social Links - Update these with your real links
  telegramUsername: "https://t.me/Eee_linn",
  telegramChannel: "https://t.me/Haosreylin",
  facebookPage: "https://facebook.com/linlin.skincare",
  tiktok: "https://tiktok.com/@linlin.skincare",
  telegramMiniApp: "https://t.me/linlin_skincare_bot/shop",
};
