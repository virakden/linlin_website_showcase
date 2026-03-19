/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * About / How It Works section with bilingual support
 */

import { STORE_CONFIG } from "@/lib/products";
import { useLanguage } from "@/contexts/LanguageContext";
import { openTelegramChat } from "@/lib/telegram";
import { Search, MessageSquare, Package, Send } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutSection() {
  const { t } = useLanguage();

  const steps = [
    { icon: Search, title: t.about_step1_title, desc: t.about_step1_desc, step: "01" },
    { icon: MessageSquare, title: t.about_step2_title, desc: t.about_step2_desc, step: "02" },
    { icon: Package, title: t.about_step3_title, desc: t.about_step3_desc, step: "03" },
  ];

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 bg-teal/10 text-teal text-xs font-semibold rounded-full mb-4 uppercase tracking-wide"
          >
            {t.about_badge}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-3xl md:text-4xl text-walnut mb-4"
          >
            {t.about_title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-walnut-light text-lg max-w-md mx-auto"
          >
            {t.about_subtitle}
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="relative w-16 h-16 mx-auto mb-5">
                  <div className="w-16 h-16 bg-teal/10 rounded-2xl flex items-center justify-center">
                    <Icon className="w-7 h-7 text-teal" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-terracotta text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-display font-bold text-lg text-walnut mb-2">
                  {step.title}
                </h3>
                <p className="text-walnut-light text-sm leading-relaxed max-w-xs mx-auto">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-teal to-teal-dark rounded-2xl p-8 md:p-10 text-center"
        >
          <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">
            {t.about_cta_title}
          </h3>
          <p className="text-white/80 text-base mb-6 max-w-md mx-auto">
            {t.about_cta_desc}
          </p>
          <button
            onClick={() =>
              openTelegramChat(
                STORE_CONFIG.telegramUsername,
                "Hi! I'd like to place an order."
              )
            }
            className="inline-flex items-center gap-2.5 px-6 py-3 bg-white text-teal rounded-xl font-semibold text-sm hover:bg-cream transition-colors shadow-lg"
          >
            <Send className="w-4 h-4" />
            {t.about_cta_button}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
