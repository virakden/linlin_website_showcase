/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * Telegram Mini App section: Link to Mini App + Join Channel CTA
 */

import { STORE_CONFIG } from "@/lib/store-config";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Smartphone,
  Users,
  ShoppingCart,
  Bell,
  Gift,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

// Telegram SVG icon
function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  );
}

const FEATURES = [
  { icon: ShoppingCart, getLabel: (t: any) => t.miniapp_feature1 },
  { icon: Bell, getLabel: (t: any) => t.miniapp_feature2 },
  { icon: Gift, getLabel: (t: any) => t.miniapp_feature3 },
];

export default function TelegramMiniAppSection() {
  const { t } = useLanguage();

  return (
    <section id="miniapp" className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="relative bg-gradient-to-br from-[#2AABEE] to-[#1E96D1] rounded-3xl overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
          <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-white/3 rounded-full" />

          <div className="relative grid md:grid-cols-2 gap-8 p-8 md:p-12 lg:p-16 items-center">
            {/* Left: Content */}
            <div>
              <motion.span
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/20 text-white text-xs font-semibold rounded-full mb-5 backdrop-blur-sm"
              >
                <Smartphone className="w-3.5 h-3.5" />
                {t.miniapp_badge}
              </motion.span>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display font-bold text-3xl md:text-4xl text-white mb-4 leading-tight"
              >
                {t.miniapp_title}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="text-white/85 text-base md:text-lg leading-relaxed mb-8 max-w-md"
              >
                {t.miniapp_subtitle}
              </motion.p>

              {/* Feature list */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-3 mb-8"
              >
                {FEATURES.map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-white/90 text-sm font-medium">
                        {feat.getLabel(t)}
                      </span>
                    </div>
                  );
                })}
              </motion.div>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="flex flex-col sm:flex-row gap-3"
              >
                <a
                  href={STORE_CONFIG.telegramMiniApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white text-[#2AABEE] rounded-xl font-bold text-sm hover:bg-white/90 transition-colors shadow-lg hover:shadow-xl"
                >
                  <TelegramIcon className="w-5 h-5" />
                  {t.miniapp_open_button}
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={STORE_CONFIG.telegramChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white/15 text-white rounded-xl font-semibold text-sm hover:bg-white/25 transition-colors backdrop-blur-sm border border-white/20"
                >
                  <Users className="w-5 h-5" />
                  {t.miniapp_join_channel}
                  <ExternalLink className="w-4 h-4" />
                </a>
              </motion.div>
            </div>

            {/* Right: Visual mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:flex justify-center"
            >
              <div className="relative">
                {/* Phone mockup */}
                <div className="w-64 bg-white/10 backdrop-blur-md rounded-[2.5rem] p-3 border border-white/20 shadow-2xl">
                  <div className="bg-white rounded-[2rem] overflow-hidden">
                    {/* Status bar */}
                    <div className="bg-[#2AABEE] px-5 py-3 flex items-center gap-2">
                      <TelegramIcon className="w-5 h-5 text-white" />
                      <span className="text-white text-sm font-semibold">
                        Mini App
                      </span>
                    </div>
                    {/* Content mockup */}
                    <div className="p-4 space-y-3">
                      <div className="h-28 bg-gradient-to-br from-cream to-cream-dark rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-10 h-10 text-teal/40" />
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-cream-dark rounded-full w-3/4" />
                        <div className="h-3 bg-cream-dark rounded-full w-1/2" />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="h-16 bg-cream rounded-lg" />
                        <div className="h-16 bg-cream rounded-lg" />
                        <div className="h-16 bg-cream rounded-lg" />
                        <div className="h-16 bg-cream rounded-lg" />
                      </div>
                      <div className="h-10 bg-[#2AABEE] rounded-xl flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          Order Now
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute -top-4 -right-8 bg-white rounded-xl p-3 shadow-lg border border-border/40 flex items-center gap-2 animate-bounce">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Bell className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-walnut">
                      New Arrival!
                    </p>
                    <p className="text-[10px] text-walnut-light">
                      Check it out
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
