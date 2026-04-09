import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PRODUCTS, Product, CATEGORIES, STORE_CONFIG } from "@/lib/products";
import {
  getTelegramUser,
  initTelegramApp,
  isTelegramMiniApp,
  showTelegramAlert,
  closeMiniApp,
} from "@/lib/telegram";
import {
  PROMOTION,
  isPromotionActive,
  calculateDiscount,
  getPromotionBadge,
  getPromotionName,
  getPromotionDescription,
  isProductInStock,
} from "@/lib/promotions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Upload,
  CheckCircle,
  X,
  Loader2,
  Truck,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

// Order steps
type OrderStep = "products" | "cart" | "form" | "payment" | "success";

// Cart item
interface CartItem {
  product: Product;
  quantity: number;
}

// Order form data
interface OrderFormData {
  name: string;
  phone: string;
  province: string;
  address: string;
  note: string;
  logistics: string;
}

// Cambodia provinces (25 provinces + capital)
const CAMBODIA_PROVINCES = [
  { id: "phnom_penh", name: "Phnom Penh", name_kh: "ភ្នំពេញ", isCapital: true },
  {
    id: "banteay_meanchey",
    name: "Banteay Meanchey",
    name_kh: "បន្ទាយមានជ័យ",
    isCapital: false,
  },
  {
    id: "battambang",
    name: "Battambang",
    name_kh: "បាត់ដំបង",
    isCapital: false,
  },
  {
    id: "kampong_cham",
    name: "Kampong Cham",
    name_kh: "កំពង់ចាម",
    isCapital: false,
  },
  {
    id: "kampong_chhnang",
    name: "Kampong Chhnang",
    name_kh: "កំពង់ឆ្នាំង",
    isCapital: false,
  },
  {
    id: "kampong_speu",
    name: "Kampong Speu",
    name_kh: "កំពង់ស្ពឺ",
    isCapital: false,
  },
  {
    id: "kampong_thom",
    name: "Kampong Thom",
    name_kh: "កំពង់ធំ",
    isCapital: false,
  },
  { id: "kampot", name: "Kampot", name_kh: "កំពត", isCapital: false },
  { id: "kandal", name: "Kandal", name_kh: "កណ្ដាល", isCapital: false },
  { id: "kep", name: "Kep", name_kh: "កែប", isCapital: false },
  { id: "koh_kong", name: "Koh Kong", name_kh: "កោះកុង", isCapital: false },
  { id: "kratie", name: "Kratié", name_kh: "ក្រចេះ", isCapital: false },
  {
    id: "mondulkiri",
    name: "Mondulkiri",
    name_kh: "មណ្ឌលគិរី",
    isCapital: false,
  },
  {
    id: "oddar_meanchey",
    name: "Oddar Meanchey",
    name_kh: "ឧត្តរមានជ័យ",
    isCapital: false,
  },
  { id: "pailin", name: "Pailin", name_kh: "ប៉ៃលិន", isCapital: false },
  {
    id: "preah_sihanouk",
    name: "Preah Sihanouk",
    name_kh: "ព្រះសីហនុ",
    isCapital: false,
  },
  {
    id: "preah_vihear",
    name: "Preah Vihear",
    name_kh: "ព្រះវិហារ",
    isCapital: false,
  },
  { id: "prey_veng", name: "Prey Veng", name_kh: "ព្រៃវែង", isCapital: false },
  { id: "pursat", name: "Pursat", name_kh: "ពោធិ៍សាត់", isCapital: false },
  {
    id: "ratanakiri",
    name: "Ratanakiri",
    name_kh: "រតនគិរី",
    isCapital: false,
  },
  { id: "siem_reap", name: "Siem Reap", name_kh: "សៀមរាប", isCapital: false },
  {
    id: "stung_treng",
    name: "Stung Treng",
    name_kh: "ស្ទឹងត្រែង",
    isCapital: false,
  },
  {
    id: "svay_rieng",
    name: "Svay Rieng",
    name_kh: "ស្វាយរៀង",
    isCapital: false,
  },
  { id: "takeo", name: "Takéo", name_kh: "តាកែវ", isCapital: false },
  {
    id: "tboung_khmum",
    name: "Tboung Khmum",
    name_kh: "ត្បូងឃ្មុំ",
    isCapital: false,
  },
];

// Delivery fee configuration
const DELIVERY_CONFIG = {
  freeDeliveryMinimum: 20, // Free delivery if subtotal >= $20
  phnomPenhFee: 1.5, // $1.50 for Phnom Penh
  provinceFee: 2.0, // $2.00 for other provinces
};

// Logistics companies for provinces outside Phnom Penh
const LOGISTICS_COMPANIES = [
  { id: "vet", name: "VET / វិរះ ប៊ុនថាំ", icon: "📦" },
  { id: "jt", name: "J&T Express", icon: "📦" },
];

// Thank you messages (editable)
const THANK_YOU_MESSAGES = {
  en: "Thank you! For supporting natural Khmer products. We already got your order. We will prepare package for delivery to you.",
  kh: "សូមអរគុណ! សម្រាប់ការគាំទ្រផលិតផលធម្មជាតិខ្មែរ។ យើងបានទទួលការបញ្ជាទិញរបស់អ្នកហើយ។ យើងនឹងរៀបចំកញ្ចប់សម្រាប់ដឹកជញ្ជូនទៅអ្នក។",
};

// Dynamic icon component
function DynamicIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = (LucideIcons as any)[name] || LucideIcons.Package;
  return <Icon className={className} />;
}

export default function Order() {
  const { language } = useLanguage();
  const isKhmer = language === "kh";

  // State
  const [step, setStep] = useState<OrderStep>("products");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formData, setFormData] = useState<OrderFormData>({
    name: "",
    phone: "",
    province: "",
    address: "",
    note: "",
    logistics: "",
  });
  const [transactionImage, setTransactionImage] = useState<File | null>(null);
  const [transactionPreview, setTransactionPreview] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string>("");

  // Initialize Telegram
  useEffect(() => {
    initTelegramApp();

    // Pre-fill name from Telegram user
    const user = getTelegramUser();
    if (user) {
      const fullName = [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ");
      setFormData(prev => ({ ...prev, name: fullName }));
    }
  }, []);

  // Filter products by category
  const filteredProducts =
    selectedCategory === "all"
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === selectedCategory);

  // Calculate subtotal (products only)
  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate delivery fee
  const calculateDeliveryFee = (afterDiscount: number): number => {
    // Free delivery if price AFTER discount >= $20
    if (afterDiscount >= DELIVERY_CONFIG.freeDeliveryMinimum) {
      return 0;
    }

    // No province selected yet
    if (!formData.province) {
      return 0;
    }

    // Check if Phnom Penh
    const selectedProvince = CAMBODIA_PROVINCES.find(
      p => p.id === formData.province
    );
    if (selectedProvince?.isCapital) {
      return DELIVERY_CONFIG.phnomPenhFee;
    }

    // Other provinces
    return DELIVERY_CONFIG.provinceFee;
  };

  const discount = isPromotionActive() ? calculateDiscount(subtotal) : 0;
  const discountedSubtotal = subtotal - discount;
  const isFreeDelivery =
    discountedSubtotal >= DELIVERY_CONFIG.freeDeliveryMinimum;
  const deliveryFee = calculateDeliveryFee(discountedSubtotal);
  const totalAmount = discountedSubtotal + deliveryFee;

  // Get selected province name
  const getProvinceName = (): string => {
    const province = CAMBODIA_PROVINCES.find(p => p.id === formData.province);
    if (!province) return "";
    return isKhmer ? province.name_kh : province.name;
  };

  // Add to cart
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Remove from cart
  const removeFromCart = (productId: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter(item => item.product.id !== productId);
    });
  };

  // Get quantity in cart
  const getQuantity = (productId: string): number => {
    return cart.find(item => item.product.id === productId)?.quantity || 0;
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setTransactionImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setTransactionPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit order
  const submitOrder = async () => {
    if (!transactionImage) {
      showTelegramAlert(
        isKhmer ? "សូមបញ្ចូលរូបភាពបង្កាន់ដៃ" : "Please upload transaction image"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const user = getTelegramUser();

      // Create form data for file upload
      const submitData = new FormData();
      submitData.append("transactionImage", transactionImage);
      submitData.append(
        "orderData",
        JSON.stringify({
          customer: {
            telegramId: user?.id || null,
            telegramUsername: user?.username || null,
            telegramName: user
              ? `${user.first_name} ${user.last_name || ""}`.trim()
              : null,
            name: formData.name,
            phone: formData.phone,
            province: formData.province,
            provinceName: getProvinceName(),
            address: formData.address,
            note: formData.note,
            logistics: formData.logistics,
            logisticsName:
              LOGISTICS_COMPANIES.find(l => l.id === formData.logistics)
                ?.name || "",
          },
          items: cart.map(item => ({
            id: item.product.id,
            name: item.product.name,
            name_kh: item.product.name_kh,
            price: item.product.price,
            quantity: item.quantity,
          })),
          subtotal: subtotal,
          deliveryFee: deliveryFee,
          discount: discount,
          discountPercent: isPromotionActive() ? PROMOTION.discountPercent : 0,
          isFreeDelivery: isFreeDelivery,
          total: totalAmount,
          currency: "USD",
          language: language,
          createdAt: new Date().toISOString(),
        })
      );

      const response = await fetch("/api/orders", {
        method: "POST",
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        setOrderId(result.orderId);

        // 🎯 Meta Pixel Purchase Event
        try {
          if (typeof window !== "undefined" && (window as any).fbq) {
            (window as any).fbq("track", "Purchase", {
              value: totalAmount,
              currency: "USD",
              content_type: "product",
              contents: cart.map(item => ({
                id: item.product.id,
                quantity: item.quantity,
                item_price: item.product.price,
              })),
              num_items: totalItems,
            });
          }
        } catch (e) {
          console.log("Pixel tracking error:", e);
        }

        setStep("success");
      } else {
        throw new Error(result.error || "Order failed");
      }
    } catch (error) {
      console.error("Order error:", error);
      showTelegramAlert(
        isKhmer
          ? "មានបញ្ហាក្នុងការបញ្ជាទិញ។ សូមព្យាយាមម្តងទៀត។"
          : "Order failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Badge component for product
  const ProductBadge = ({
    badge,
  }: {
    badge?: "new" | "popular" | "limited" | "coming-soon";
  }) => {
    if (!badge) return null;

    const styles: Record<string, string> = {
      new: "bg-emerald-500 text-white",
      popular: "bg-orange-500 text-white",
      limited: "bg-gray-800 text-white",
      "coming-soon": "bg-purple-500 text-white",
    };

    const labels: Record<string, string> = {
      new: isKhmer ? "ថ្មី" : "NEW",
      popular: isKhmer ? "ពេញនិយម" : "POPULAR",
      limited: isKhmer ? "មានកំណត់" : "LIMITED",
      "coming-soon": isKhmer ? "មកដល់ឆាប់ៗ" : "COMING SOON",
    };

    return (
      <span
        className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded ${styles[badge]}`}
      >
        {labels[badge]}
      </span>
    );
  };

  // Delivery fee info component
  const DeliveryFeeInfo = ({
    showDetails = false,
  }: {
    showDetails?: boolean;
  }) => {
    if (isFreeDelivery) {
      return (
        <div className="flex items-center gap-2 text-emerald-600">
          <Truck className="w-4 h-4" />
          <span className="text-sm font-medium">
            {isKhmer ? "ដឹកជញ្ជូនឥតគិតថ្លៃ!" : "Free Delivery!"}
          </span>
        </div>
      );
    }

    if (showDetails) {
      const remaining =
        DELIVERY_CONFIG.freeDeliveryMinimum - discountedSubtotal;
      return (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
          <p className="text-amber-800">
            {isKhmer
              ? `បន្ថែម $${remaining.toFixed(2)} ទៀតដើម្បីទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃ!`
              : `Add $${remaining.toFixed(2)} more for free delivery!`}
          </p>
        </div>
      );
    }

    return null;
  };

  // Render products step (showcase style)
  const renderProducts = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {isKhmer ? "ត្រឡប់ក្រោយ" : "Back"}
          </Button>
        </Link>
        <h1 className="text-xl font-bold">
          {isKhmer ? "បញ្ជាទិញផលិតផល" : "Order Products"}
        </h1>
        <div className="w-20" />
      </div>

      {/* Category filters - horizontal scroll */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4">
        <div className="flex gap-2 min-w-max">
          {CATEGORIES.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              className={`rounded-full whitespace-nowrap ${
                selectedCategory === category.id
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300"
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <DynamicIcon name={category.icon} className="w-4 h-4 mr-2" />
              {isKhmer ? category.name_kh : category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Products grid - showcase style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const qty = getQuantity(product.id);
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-stone-50">
                {/* Product Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={product.image}
                    alt={isKhmer ? product.name_kh : product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <ProductBadge
                    badge={product.comingSoon ? "coming-soon" : product.badge}
                  />

                  {/* Coming Soon overlay */}
                  {product.comingSoon && (
                    <div className="absolute inset-0 bg-purple-900/50 flex items-center justify-center">
                      <span className="px-3 py-1.5 bg-purple-600 text-white text-sm font-bold rounded-lg">
                        {isKhmer ? "មកដល់ឆាប់ៗ" : "Coming Soon"}
                      </span>
                    </div>
                  )}

                  {/* Out of stock overlay - ONLY ONE, with !product.comingSoon */}
                  {!product.comingSoon &&
                    !isProductInStock(product.id, product.category) && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="px-3 py-1.5 bg-gray-800 text-white text-sm font-bold rounded-lg">
                          {isKhmer ? "ដាច់ស្ដុក" : "Out of Stock"}
                        </span>
                      </div>
                    )}

                  {/* Add button hover - ADD !product.comingSoon here! */}
                  {qty === 0 &&
                    !product.comingSoon &&
                    isProductInStock(product.id, product.category) && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => addToCart(product)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          {isKhmer ? "បន្ថែម" : "Add"}
                        </Button>
                      </div>
                    )}
                </div>

                {/* Product Info */}
                <CardContent className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {isKhmer ? product.name_kh : product.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                      {isKhmer ? product.description_kh : product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* PRICE - Updated for Coming Soon */}
                    {product.comingSoon ? (
                      <span className="text-lg font-bold text-purple-600">
                        ${Math.floor(product.price / 10)}x
                      </span>
                    ) : isPromotionActive() ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="inline-block w-fit px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded">
                          {getPromotionBadge(language)}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-lg font-bold text-red-500">
                            $
                            {(
                              product.price *
                              (1 - PROMOTION.discountPercent / 100)
                            ).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-lg font-bold text-emerald-700">
                        ${product.price.toFixed(2)}
                      </span>
                    )}

                    {/* BUTTON - Updated for Coming Soon */}
                    {product.comingSoon ? (
                      <Button
                        size="sm"
                        className="bg-purple-100 text-purple-600 cursor-not-allowed hover:bg-purple-100"
                        disabled
                      >
                        {isKhmer ? "មកដល់ឆាប់ៗ" : "Coming Soon"}
                      </Button>
                    ) : qty === 0 ? (
                      <Button
                        size="sm"
                        className={`text-white ${
                          !isProductInStock(product.id, product.category)
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                        onClick={() =>
                          isProductInStock(product.id, product.category) &&
                          addToCart(product)
                        }
                        disabled={
                          !isProductInStock(product.id, product.category)
                        }
                      >
                        {!isProductInStock(product.id, product.category) ? (
                          <>{isKhmer ? "ដាច់ស្ដុក" : "Out of Stock"}</>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-1" />
                            {isKhmer ? "បន្ថែម" : "Add"}
                          </>
                        )}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-2 bg-emerald-50 rounded-full px-2 py-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full hover:bg-emerald-200"
                          onClick={() => removeFromCart(product.id)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className="font-semibold text-emerald-700 w-6 text-center">
                          {qty}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 rounded-full hover:bg-emerald-200"
                          onClick={() => addToCart(product)}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Empty state */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">
            {isKhmer ? "រកមិនឃើញផលិតផល" : "No products found"}
          </p>
        </div>
      )}

      {/* Cart summary - fixed at bottom */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl p-4 z-50"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart className="w-6 h-6 text-emerald-600" />
                  <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">
                    {isKhmer ? "សរុបរង" : "Subtotal"}
                  </p>
                  <div>
                    <p className="text-lg font-bold text-emerald-700">
                      ${discountedSubtotal.toFixed(2)}
                    </p>
                    {isPromotionActive() && (
                      <p className="text-xs text-gray-400 line-through">
                        ${subtotal.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isFreeDelivery && (
                  <Badge className="bg-emerald-100 text-emerald-700 border-0">
                    <Truck className="w-3 h-3 mr-1" />
                    {isKhmer ? "ដឹកជញ្ជូនឥតគិតថ្លៃ" : "Free Delivery"}
                  </Badge>
                )}
                <Button
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700 px-8"
                  onClick={() => setStep("cart")}
                >
                  {isKhmer ? "មើលកន្រ្តក" : "View Cart"}
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer for fixed button */}
      {cart.length > 0 && <div className="h-24" />}
    </div>
  );

  // Render cart review step
  const renderCart = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => setStep("products")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isKhmer ? "ត្រឡប់ក្រោយ" : "Back"}
        </Button>
        <h1 className="text-xl font-bold">
          {isKhmer ? "កន្រ្តករបស់អ្នក" : "Your Cart"}
        </h1>
        <div className="w-20" />
      </div>

      {/* Cart items */}
      <div className="space-y-4">
        {cart.map(item => (
          <Card key={item.product.id} className="overflow-hidden">
            <div className="flex gap-4 p-4">
              <img
                src={item.product.image}
                alt={isKhmer ? item.product.name_kh : item.product.name}
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-800 line-clamp-1">
                  {isKhmer ? item.product.name_kh : item.product.name}
                </h3>
                {isPromotionActive() ? (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-emerald-700 font-semibold">
                      $
                      {(
                        item.product.price *
                        (1 - PROMOTION.discountPercent / 100)
                      ).toFixed(2)}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ${item.product.price.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <p className="text-emerald-700 font-semibold">
                    ${item.product.price.toFixed(2)}
                  </p>
                )}

                <div className="flex items-center gap-3 mt-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-semibold w-8 text-center">
                    {item.quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="h-8 w-8"
                    onClick={() => addToCart(item.product)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>

                  <div className="ml-auto text-right">
                    {isPromotionActive() ? (
                      <>
                        <span className="font-bold text-gray-800">
                          $
                          {(
                            item.product.price *
                            (1 - PROMOTION.discountPercent / 100) *
                            item.quantity
                          ).toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-400 line-through">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                      </>
                    ) : (
                      <div className="ml-auto text-right">
                        {isPromotionActive() ? (
                          <>
                            <span className="font-bold text-gray-800">
                              $
                              {(
                                item.product.price *
                                (1 - PROMOTION.discountPercent / 100) *
                                item.quantity
                              ).toFixed(2)}
                            </span>
                            <p className="text-xs text-gray-400 line-through">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </p>
                          </>
                        ) : (
                          <span className="font-bold text-gray-800">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Free delivery hint */}
      <DeliveryFeeInfo showDetails={true} />

      {/* Order summary */}
      <Card className="bg-stone-50">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>{isKhmer ? "ចំនួនផលិតផល" : "Items"}</span>
            <span>{totalItems}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>{isKhmer ? "តម្លៃផលិតផល" : "Subtotal"}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {isPromotionActive() && (
            <div className="flex justify-between text-red-500 text-sm font-medium">
              <span>🎁 {getPromotionBadge(language)}</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              {isKhmer ? "ដឹកជញ្ជូន" : "Delivery"}
            </span>
            {isFreeDelivery ? (
              <span className="text-emerald-600 font-medium">
                {isKhmer ? "ឥតគិតថ្លៃ" : "FREE"}
              </span>
            ) : (
              <span className="text-gray-400 text-sm">
                {isKhmer ? "ជ្រើសរើសខេត្ត/ក្រុង" : "Select province"}
              </span>
            )}
          </div>
          <div className="flex justify-between text-lg font-bold border-t pt-3">
            <span>{isKhmer ? "សរុបរង" : "Total"}</span>
            <span className="text-emerald-700">
              {isFreeDelivery
                ? `$${discountedSubtotal.toFixed(2)}`
                : `$${discountedSubtotal.toFixed(2)}+`}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Continue button */}
      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        size="lg"
        onClick={() => setStep("form")}
      >
        {isKhmer ? "បន្តទៅព័ត៌មានដឹកជញ្ជូន" : "Continue to Delivery Info"}
      </Button>
    </div>
  );

  // Render form step
  const renderForm = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => setStep("cart")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isKhmer ? "ត្រឡប់ក្រោយ" : "Back"}
        </Button>
        <h1 className="text-xl font-bold">
          {isKhmer ? "ព័ត៌មានដឹកជញ្ជូន" : "Delivery Info"}
        </h1>
        <div className="w-20" />
      </div>

      {/* Form */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">
              {isKhmer ? "ឈ្មោះ" : "Name"} *
            </label>
            <Input
              value={formData.name}
              onChange={e =>
                setFormData(prev => ({ ...prev, name: e.target.value }))
              }
              placeholder={isKhmer ? "បញ្ចូលឈ្មោះ" : "Enter your name"}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {isKhmer ? "លេខទូរស័ព្ទ" : "Phone"} *
            </label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={e =>
                setFormData(prev => ({ ...prev, phone: e.target.value }))
              }
              placeholder={isKhmer ? "បញ្ចូលលេខទូរស័ព្ទ" : "Enter phone number"}
              className="mt-1"
            />
          </div>

          {/* Province/City dropdown */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              {isKhmer ? "ខេត្ត/ក្រុង" : "Province/City"} *
            </label>
            <select
              value={formData.province}
              onChange={e =>
                setFormData(prev => ({ ...prev, province: e.target.value }))
              }
              className="mt-1 w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">
                {isKhmer
                  ? "-- ជ្រើសរើសខេត្ត/ក្រុង --"
                  : "-- Select Province/City --"}
              </option>
              {CAMBODIA_PROVINCES.map(province => (
                <option key={province.id} value={province.id}>
                  {isKhmer ? province.name_kh : province.name}
                  {province.isCapital
                    ? isKhmer
                      ? " (រាជធានី)"
                      : " (Capital)"
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Logistics Company - Only show if NOT Phnom Penh */}
          {formData.province && formData.province !== "phnom_penh" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                {isKhmer ? "ក្រុមហ៊ុនដឹកជញ្ជូន *" : "Delivery Company *"}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {LOGISTICS_COMPANIES.map(company => (
                  <button
                    key={company.id}
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({ ...prev, logistics: company.id }))
                    }
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      formData.logistics === company.id
                        ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                        : "border-gray-200 bg-white hover:border-emerald-300"
                    }`}
                  >
                    <span className="text-2xl block mb-1">{company.icon}</span>
                    <span className="text-sm font-medium">{company.name}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                {isKhmer
                  ? "យើងនឹងផ្ញើកញ្ចប់តាមក្រុមហ៊ុនដឹកជញ្ជូនដែលអ្នកជ្រើសរើស"
                  : "We will send your package via your selected delivery company"}
              </p>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">
              {isKhmer ? "អាសយដ្ឋានលម្អិត" : "Detailed Address"} *
            </label>
            <Textarea
              value={formData.address}
              onChange={e =>
                setFormData(prev => ({ ...prev, address: e.target.value }))
              }
              placeholder={
                isKhmer
                  ? "ផ្ទះលេខ, ផ្លូវ, សង្កាត់/ឃុំ, ខណ្ឌ/ស្រុក..."
                  : "House #, Street, Commune/Sangkat, District/Khan..."
              }
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {isKhmer ? "កំណត់ចំណាំ" : "Note"} (
              {isKhmer ? "ជម្រើស" : "optional"})
            </label>
            <Input
              value={formData.note}
              onChange={e =>
                setFormData(prev => ({ ...prev, note: e.target.value }))
              }
              placeholder={
                isKhmer ? "កំណត់ចំណាំបន្ថែម..." : "Additional notes..."
              }
              className="mt-1"
            />
          </div>
        </CardContent>
      </Card>

      {/* Delivery fee summary */}
      <Card className="bg-stone-50">
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>{isKhmer ? "តម្លៃផលិតផល" : "Subtotal"}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          {isPromotionActive() && (
            <div className="flex justify-between text-red-500 text-sm font-medium">
              <span>🎁 {getPromotionBadge(language)}</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-1">
              <Truck className="w-4 h-4" />
              {isKhmer ? "ដឹកជញ្ជូន" : "Delivery"}
              {formData.province && !isFreeDelivery && (
                <span className="text-xs text-gray-400">
                  ({getProvinceName()})
                </span>
              )}
            </span>
            {isFreeDelivery ? (
              <span className="text-emerald-600 font-medium">
                {isKhmer ? "ឥតគិតថ្លៃ" : "FREE"}
              </span>
            ) : formData.province ? (
              <span>${deliveryFee.toFixed(2)}</span>
            ) : (
              <span className="text-amber-600 text-sm">
                {isKhmer ? "ជ្រើសរើសខេត្ត/ក្រុង" : "Select province"}
              </span>
            )}
          </div>

          <div className="flex justify-between text-lg font-bold border-t pt-3">
            <span>{isKhmer ? "សរុបត្រូវបង់" : "Total to Pay"}</span>
            <span className="text-emerald-700">${totalAmount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Continue button */}
      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        size="lg"
        disabled={
          !formData.name ||
          !formData.phone ||
          !formData.province ||
          !formData.address ||
          (formData.province !== "phnom_penh" && !formData.logistics)
        }
        onClick={() => setStep("payment")}
      >
        {isKhmer ? "បន្តទៅការបង់ប្រាក់" : "Continue to Payment"}
      </Button>
    </div>
  );

  // Render payment step
  const renderPayment = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-10 py-4 border-b">
        <Button variant="ghost" size="sm" onClick={() => setStep("form")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {isKhmer ? "ត្រឡប់ក្រោយ" : "Back"}
        </Button>
        <h1 className="text-xl font-bold">
          {isKhmer ? "ការបង់ប្រាក់" : "Payment"}
        </h1>
        <div className="w-20" />
      </div>

      {/* Promotion Banner */}
      {isPromotionActive() && (
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 text-white p-4 rounded-xl text-center">
          <p className="font-bold text-lg">{getPromotionName(language)}</p>
          <p className="text-sm opacity-90">
            {getPromotionDescription(language)}
          </p>
        </div>
      )}

      {/* Amount breakdown */}
      <Card className="bg-emerald-600 text-white border-0">
        <CardContent className="py-6 space-y-2">
          <div className="flex justify-between text-emerald-100 text-sm">
            <span>{isKhmer ? "តម្លៃផលិតផល" : "Subtotal"}</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>

          {/* Discount - Only show if promotion active */}
          {isPromotionActive() && discount > 0 && (
            <div className="flex justify-between text-yellow-300 text-sm font-medium">
              <span className="flex items-center gap-1">
                🎁 {getPromotionBadge(language)}
              </span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-emerald-100 text-sm">
            <span className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              {isKhmer ? "ដឹកជញ្ជូន" : "Delivery"} ({getProvinceName()})
            </span>
            {isFreeDelivery ? (
              <span>{isKhmer ? "ឥតគិតថ្លៃ" : "FREE"}</span>
            ) : (
              <span>${deliveryFee.toFixed(2)}</span>
            )}
          </div>
          <div className="border-t border-emerald-500 pt-3 mt-2">
            <p className="text-emerald-100 text-center text-sm">
              {isKhmer ? "ចំនួនត្រូវបង់" : "Amount to pay"}
            </p>
            <p className="text-4xl font-bold text-center mt-1">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* QR Code */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-gray-700">
            {isKhmer ? "ស្កេន QR ដើម្បីបង់ប្រាក់" : "Scan QR to Pay"}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          {/* Bank QR Image */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <img
              src="/qr-payment.jpeg"
              alt="Payment QR Code"
              className="w-72 h-72 object-contain"
            />
          </div>

          <div className="text-center">
            <p className="font-semibold text-gray-800">LINLINCEO by E.HAO</p>
            <p className="text-sm text-gray-500">ABA / Wing / ACLEDA</p>
          </div>

          <div className="flex gap-2">
            <Badge variant="outline" className="border-blue-500 text-blue-600">
              ABA
            </Badge>
            <Badge
              variant="outline"
              className="border-yellow-500 text-yellow-600"
            >
              Wing
            </Badge>
            <Badge
              variant="outline"
              className="border-green-500 text-green-600"
            >
              ACLEDA
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Upload transaction image */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-gray-700">
            {isKhmer ? "បញ្ចូលរូបភាពបង្កាន់ដៃ" : "Upload Transaction Receipt"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            {isKhmer
              ? "បន្ទាប់ពីផ្ទេរប្រាក់ សូមថតរូបបង្កាន់ដៃ ហើយបញ្ចូលនៅទីនេះ"
              : "After transfer, please capture the receipt and upload here"}
          </p>

          {transactionPreview ? (
            <div className="relative">
              <img
                src={transactionPreview}
                alt="Transaction receipt"
                className="w-full rounded-lg border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => {
                  setTransactionImage(null);
                  setTransactionPreview("");
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-300 rounded-xl p-8 cursor-pointer hover:bg-emerald-50 transition-colors">
              <Upload className="w-12 h-12 text-emerald-400 mb-3" />
              <p className="text-sm font-medium text-gray-700">
                {isKhmer ? "ចុចដើម្បីបញ្ចូលរូបភាព" : "Tap to upload image"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {isKhmer ? "រូបភាព PNG, JPG" : "PNG, JPG images"}
              </p>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </CardContent>
      </Card>

      {/* Submit button */}
      <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        size="lg"
        disabled={!transactionImage || isSubmitting}
        onClick={submitOrder}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {isKhmer ? "កំពុងផ្ញើ..." : "Submitting..."}
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 mr-2" />
            {isKhmer ? "ខ្ញុំបានបង់ប្រាក់រួចហើយ" : "I Already Paid"}
          </>
        )}
      </Button>
    </div>
  );

  // Render success step
  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-6 p-4">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center"
      >
        <CheckCircle className="w-14 h-14 text-emerald-600" />
      </motion.div>

      <div className="space-y-3">
        <h1 className="text-2xl font-bold text-gray-800">
          {isKhmer ? "បញ្ជាទិញបានជោគជ័យ!" : "Order Successful!"}
        </h1>
        <p className="text-gray-500 max-w-md">
          {isKhmer ? THANK_YOU_MESSAGES.kh : THANK_YOU_MESSAGES.en}
        </p>
      </div>

      {orderId && (
        <Badge
          variant="secondary"
          className="text-lg px-6 py-2 bg-emerald-100 text-emerald-700"
        >
          Order: {orderId}
        </Badge>
      )}

      <div className="space-y-3 w-full max-w-xs pt-4">
        {isTelegramMiniApp() ? (
          <Button
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            size="lg"
            onClick={closeMiniApp}
          >
            {isKhmer ? "បិទ" : "Close"}
          </Button>
        ) : (
          <Link href="/">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              size="lg"
            >
              {isKhmer ? "ត្រឡប់ទៅទំព័រដើម" : "Back to Home"}
            </Button>
          </Link>
        )}
      </div>
    </div>
  );

  // Render based on step
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar />
      <div className="p-4">
        {step === "products" && renderProducts()}
        {step === "cart" && renderCart()}
        {step === "form" && renderForm()}
        {step === "payment" && renderPayment()}
        {step === "success" && renderSuccess()}
      </div>
    </div>
  );
}
