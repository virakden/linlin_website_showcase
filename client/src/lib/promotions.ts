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
    en: "10% OFF all products - Website & Mini App Launch!",
    kh: "បញ្ចុះតម្លៃ 10% គ្រប់ផលិតផល - បើកដំណើរការវែបសាយ និង Mini App!",
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
