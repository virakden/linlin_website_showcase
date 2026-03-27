/*
 * ========================================
 * PROMOTION SETTINGS - Easy to control!
 * ========================================
 *
 * To ENABLE promotion:  Set enabled: true
 * To DISABLE promotion: Set enabled: false
 *
 * Change discountPercent for different discounts (10 = 10%)
 */

export const PROMOTION = {
  // ✅ Turn ON/OFF here
  enabled: true,

  // 💰 Discount percentage (10 = 10% off)
  discountPercent: 10,

  // 📅 Promotion period (optional - for display only)
  startDate: "2026-03-23",
  endDate: "2026-04-23",

  // 🏷️ Promotion name
  name: {
    en: "Grand Opening Sale! 🎉",
    kh: "បើកលក់ពិសេស! 🎉",
  },

  // 📝 Promotion description
  description: {
    en: "% OFF all products - Website & Mini App Launch!",
    kh: "បញ្ចុះតម្លៃ % គ្រប់ផលិតផល - បើកដំណើរការវែបសាយ និង Mini App!",
  },

  // 🎨 Badge text (shown on products)
  badge: {
    en: "10% OFF",
    kh: "បញ្ចុះ 10%",
  },
};

// Helper functions
export function isPromotionActive(): boolean {
  if (!PROMOTION.enabled) return false;

  // Optional: Auto check dates
  const now = new Date();
  const start = new Date(PROMOTION.startDate);
  const end = new Date(PROMOTION.endDate);
  end.setHours(23, 59, 59); // End of day

  return now >= start && now <= end;
}

// Dynamic badge — auto updates when discountPercent changes
export function getPromotionBadge(language: string): string {
  return language === "kh"
    ? `បញ្ចុះ ${PROMOTION.discountPercent}%`
    : `${PROMOTION.discountPercent}% OFF`;
}

// Dynamic name — auto updates percent
export function getPromotionName(language: string): string {
  return language === "kh"
    ? `បើកលក់ពិសេស! ${PROMOTION.discountPercent}% OFF 🎉`
    : `Grand Opening Sale! ${PROMOTION.discountPercent}% OFF 🎉`;
}

// Dynamic description — auto updates percent
export function getPromotionDescription(language: string): string {
  return language === "kh"
    ? `បញ្ចុះតម្លៃ ${PROMOTION.discountPercent}% គ្រប់ផលិតផល - បើកដំណើរការវែបសាយ និង Mini App!`
    : `${PROMOTION.discountPercent}% OFF all products - Website & Mini App Launch!`;
}

export function calculateDiscount(subtotal: number): number {
  if (!isPromotionActive()) return 0;
  return subtotal * (PROMOTION.discountPercent / 100);
}

export function getDiscountedTotal(
  subtotal: number,
  deliveryFee: number
): number {
  const discount = calculateDiscount(subtotal);
  return subtotal - discount + deliveryFee;
}
