/*
 * Translations for English and Khmer
 * Edit the Khmer translations to match your actual content
 */

export type Language = "en" | "kh";

export interface Translations {
  // Navbar
  nav_products: string;
  nav_categories: string;
  nav_contact: string;
  nav_about: string;
  nav_message_us: string;

  // Hero
  hero_badge: string;
  hero_title: string;
  hero_description: string;
  hero_browse: string;
  hero_chat_telegram: string;

  // Products Section
  products_badge: string;
  products_title: string;
  products_subtitle: string;
  products_search: string;
  products_no_results: string;
  products_no_results_desc: string;
  products_clear_filters: string;
  products_inquire: string;
  products_view_details: string;
  products_ask_telegram: string;

  // Categories
  cat_all: string;
  cat_electronics: string;
  cat_fashion: string;
  cat_home: string;
  cat_beauty: string;
  cat_food: string;
  cat_accessories: string;

  // Product Detail Modal
  detail_in_stock: string;
  detail_out_of_stock: string;
  detail_product_details: string;
  detail_ask_product: string;
  detail_opens_telegram: string;
  detail_watch_video: string;
  detail_watch_on: string;

  // About / How It Works
  about_badge: string;
  about_title: string;
  about_subtitle: string;
  about_step1_title: string;
  about_step1_desc: string;
  about_step2_title: string;
  about_step2_desc: string;
  about_step3_title: string;
  about_step3_desc: string;
  about_cta_title: string;
  about_cta_desc: string;
  about_cta_button: string;

  // Contact Section
  contact_badge: string;
  contact_title: string;
  contact_subtitle: string;
  contact_telegram_title: string;
  contact_telegram_desc: string;
  contact_facebook_title: string;
  contact_facebook_desc: string;
  contact_tiktok_title: string;
  contact_tiktok_desc: string;
  contact_instagram_title: string;
  contact_instagram_desc: string;
  contact_direct_title: string;
  contact_direct_desc: string;
  contact_message_telegram: string;
  contact_message_facebook: string;

  // Mini App Section
  miniapp_badge: string;
  miniapp_title: string;
  miniapp_subtitle: string;
  miniapp_open_button: string;
  miniapp_join_channel: string;
  miniapp_feature1: string;
  miniapp_feature2: string;
  miniapp_feature3: string;

  // Footer
  footer_rights: string;
  footer_telegram: string;
  footer_products: string;
  footer_contact: string;

  // Language
  lang_switch: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Navbar
    nav_products: "Products",
    nav_categories: "Categories",
    nav_contact: "Contact",
    nav_about: "About",
    nav_message_us: "Message Us",

    // Hero
    hero_badge: "Shop with Confidence",
    hero_title: "Discover Products You'll Love",
    hero_description:
      "Browse our curated collection and message us on Telegram to order. Fast replies, easy shopping.",
    hero_browse: "Browse Products",
    hero_chat_telegram: "Chat on Telegram",

    // Products Section
    products_badge: "Our Collection",
    products_title: "Featured Products",
    products_subtitle:
      "Tap any product to see details, or inquire directly via Telegram.",
    products_search: "Search products...",
    products_no_results: "No products found",
    products_no_results_desc: "Try adjusting your search or category filter.",
    products_clear_filters: "Clear Filters",
    products_inquire: "Inquire",
    products_view_details: "View details",
    products_ask_telegram: "Ask on Telegram",

    // Categories
    cat_all: "All Products",
    cat_electronics: "Electronics",
    cat_fashion: "Fashion",
    cat_home: "Home & Living",
    cat_beauty: "Beauty",
    cat_food: "Food & Drinks",
    cat_accessories: "Accessories",

    // Product Detail Modal
    detail_in_stock: "In Stock",
    detail_out_of_stock: "Out of Stock",
    detail_product_details: "Product Details",
    detail_ask_product: "Ask About This Product",
    detail_opens_telegram:
      "Opens a chat on Telegram with product details pre-filled",
    detail_watch_video: "Watch Video",
    detail_watch_on: "Watch on",

    // About / How It Works
    about_badge: "How It Works",
    about_title: "Shopping Made Simple",
    about_subtitle:
      "No complicated checkout. Just browse, ask, and we'll handle the rest.",
    about_step1_title: "Browse Products",
    about_step1_desc:
      "Explore our curated collection of quality products across multiple categories.",
    about_step2_title: "Ask on Telegram",
    about_step2_desc:
      "Tap the inquiry button on any product to message us directly with details pre-filled.",
    about_step3_title: "Get Your Order",
    about_step3_desc:
      "We'll confirm availability, arrange payment, and ship your order quickly.",
    about_cta_title: "Ready to Order?",
    about_cta_desc:
      "Send us a message on Telegram and we'll get back to you within minutes.",
    about_cta_button: "Message Us Now",

    // Contact Section
    contact_badge: "Get In Touch",
    contact_title: "Contact Us",
    contact_subtitle:
      "Reach out through any of our channels. We're here to help!",
    contact_telegram_title: "Telegram",
    contact_telegram_desc: "Message us directly for orders and inquiries",
    contact_facebook_title: "Facebook Page",
    contact_facebook_desc: "Follow our page for updates and promotions",
    contact_tiktok_title: "TikTok",
    contact_tiktok_desc: "Watch our product videos and reviews",
    contact_instagram_title: "Instagram",
    contact_instagram_desc: "See our latest products and stories",
    contact_direct_title: "Direct Contact",
    contact_direct_desc:
      "For orders and business inquiries, contact us directly through:",
    contact_message_telegram: "Message on Telegram",
    contact_message_facebook: "Message on Facebook",

    // Mini App Section
    miniapp_badge: "Telegram Mini App",
    miniapp_title: "Order Directly in Telegram",
    miniapp_subtitle:
      "Use our Mini App inside Telegram for the fastest ordering experience. Browse, order, and track — all without leaving Telegram.",
    miniapp_open_button: "Open Mini App",
    miniapp_join_channel: "Join Our Channel",
    miniapp_feature1: "Browse & order products instantly",
    miniapp_feature2: "Get real-time updates on new arrivals",
    miniapp_feature3: "Exclusive deals for channel members",

    // Footer
    footer_rights: "All rights reserved.",
    footer_telegram: "Telegram",
    footer_products: "Products",
    footer_contact: "Contact",

    // Language
    lang_switch: "ភាសាខ្មែរ",
  },
  kh: {
    // Navbar
    nav_products: "ផលិតផល",
    nav_categories: "ប្រភេទ",
    nav_contact: "ទំនាក់ទំនង",
    nav_about: "អំពីយើង",
    nav_message_us: "ផ្ញើសារ",

    // Hero
    hero_badge: "ទិញទំនិញដោយទំនុកចិត្ត",
    hero_title: "រកឃើញផលិតផលដែលអ្នកចូលចិត្ត",
    hero_description:
      "រកមើលផលិតផលរបស់យើង ហើយផ្ញើសារមកយើងតាម Telegram ដើម្បីបញ្ជាទិញ។ ឆ្លើយតបរហ័ស ទិញទំនិញងាយស្រួល។",
    hero_browse: "រកមើលផលិតផល",
    hero_chat_telegram: "ជជែកតាម Telegram",

    // Products Section
    products_badge: "បណ្តុំផលិតផល",
    products_title: "ផលិតផលពិសេស",
    products_subtitle:
      "ចុចលើផលិតផលណាមួយដើម្បីមើលព័ត៌មានលម្អិត ឬសាកសួរតាម Telegram។",
    products_search: "ស្វែងរកផលិតផល...",
    products_no_results: "រកមិនឃើញផលិតផល",
    products_no_results_desc: "សាកល្បងកែប្រែការស្វែងរក ឬតម្រងប្រភេទ។",
    products_clear_filters: "សម្អាតតម្រង",
    products_inquire: "សាកសួរ",
    products_view_details: "មើលព័ត៌មាន",
    products_ask_telegram: "សួរតាម Telegram",

    // Categories
    cat_all: "ផលិតផលទាំងអស់",
    cat_electronics: "អេឡិចត្រូនិច",
    cat_fashion: "ម៉ូដ",
    cat_home: "ផ្ទះ និងការរស់នៅ",
    cat_beauty: "សម្រស់",
    cat_food: "អាហារ និងភេសជ្ជៈ",
    cat_accessories: "គ្រឿងបន្ថែម",

    // Product Detail Modal
    detail_in_stock: "មានក្នុងស្តុក",
    detail_out_of_stock: "អស់ពីស្តុក",
    detail_product_details: "ព័ត៌មានលម្អិតផលិតផល",
    detail_ask_product: "សាកសួរអំពីផលិតផលនេះ",
    detail_opens_telegram: "បើកការជជែកនៅ Telegram ជាមួយព័ត៌មានផលិតផល",
    detail_watch_video: "មើលវីដេអូ",
    detail_watch_on: "មើលនៅ",

    // About / How It Works
    about_badge: "របៀបដំណើរការ",
    about_title: "ទិញទំនិញងាយស្រួល",
    about_subtitle:
      "គ្មានការបង់ប្រាក់ស្មុគស្មាញ។ គ្រាន់តែរកមើល សាកសួរ ហើយយើងនឹងដោះស្រាយនៅសល់។",
    about_step1_title: "រកមើលផលិតផល",
    about_step1_desc: "រកមើលបណ្តុំផលិតផលដែលមានគុណភាពក្នុងប្រភេទផ្សេងៗ។",
    about_step2_title: "សាកសួរតាម Telegram",
    about_step2_desc: "ចុចប៊ូតុងសាកសួរលើផលិតផលណាមួយដើម្បីផ្ញើសារមកយើង។",
    about_step3_title: "ទទួលការបញ្ជាទិញ",
    about_step3_desc:
      "យើងនឹងបញ្ជាក់ភាពអាចរកបាន រៀបចំការបង់ប្រាក់ និងដឹកជញ្ជូនយ៉ាងរហ័ស។",
    about_cta_title: "ត្រៀមខ្លួនបញ្ជាទិញ?",
    about_cta_desc:
      "ផ្ញើសារមកយើងតាម Telegram ហើយយើងនឹងឆ្លើយតបក្នុងរយៈពេលប៉ុន្មាននាទី។",
    about_cta_button: "ផ្ញើសារឥឡូវនេះ",

    // Contact Section
    contact_badge: "ទំនាក់ទំនង",
    contact_title: "ទាក់ទងយើង",
    contact_subtitle: "ទាក់ទងតាមបណ្តាញណាមួយរបស់យើង។ យើងនៅទីនេះដើម្បីជួយ!",
    contact_telegram_title: "Telegram",
    contact_telegram_desc: "ផ្ញើសារមកយើងដោយផ្ទាល់សម្រាប់ការបញ្ជាទិញ",
    contact_facebook_title: "ទំព័រ Facebook",
    contact_facebook_desc: "តាមដានទំព័ររបស់យើងសម្រាប់ព័ត៌មានថ្មីៗ",
    contact_tiktok_title: "TikTok",
    contact_tiktok_desc: "មើលវីដេអូផលិតផល និងការវាយតម្លៃ",
    contact_instagram_title: "Instagram",
    contact_instagram_desc: "មើលផលិតផលថ្មីៗ និងរឿងរ៉ាវ",
    contact_direct_title: "ទំនាក់ទំនងផ្ទាល់",
    contact_direct_desc:
      "សម្រាប់ការបញ្ជាទិញ និងសំណួរអាជីវកម្ម សូមទាក់ទងយើងតាម:",
    contact_message_telegram: "ផ្ញើសារតាម Telegram",
    contact_message_facebook: "ផ្ញើសារតាម Facebook",

    // Mini App Section
    miniapp_badge: "Telegram Mini App",
    miniapp_title: "បញ្ជាទិញផ្ទាល់ក្នុង Telegram",
    miniapp_subtitle:
      "ប្រើ Mini App របស់យើងក្នុង Telegram សម្រាប់បទពិសោធន៍បញ្ជាទិញលឿនបំផុត។ រកមើល បញ្ជាទិញ និងតាមដាន — ទាំងអស់ដោយមិនចាកចេញពី Telegram។",
    miniapp_open_button: "បើក Mini App",
    miniapp_join_channel: "ចូលរួមឆានែលរបស់យើង",
    miniapp_feature1: "រកមើល និងបញ្ជាទិញផលិតផលភ្លាមៗ",
    miniapp_feature2: "ទទួលព័ត៌មានថ្មីៗអំពីផលិតផលចូលថ្មី",
    miniapp_feature3: "ការផ្តល់ជូនពិសេសសម្រាប់សមាជិកឆានែល",

    // Footer
    footer_rights: "រក្សាសិទ្ធិគ្រប់យ៉ាង។",
    footer_telegram: "Telegram",
    footer_products: "ផលិតផល",
    footer_contact: "ទំនាក់ទំនង",

    // Language
    lang_switch: "English",
  },
};
