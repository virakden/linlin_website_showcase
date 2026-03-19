/*
 * Design: "Bazaar Fresh" — Warm Marketplace
 * About section: How it works + store info
 * Warm teal accents, step-by-step process
 */

import { STORE_CONFIG } from "@/lib/products";
import { openTelegramChat } from "@/lib/telegram";
import { Search, MessageCircle, Package, Send } from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "Browse Products",
    description: "Explore our curated collection of quality products across multiple categories.",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "Ask on Telegram",
    description: "Tap the inquiry button on any product to message us directly with details pre-filled.",
  },
  {
    icon: <Package className="w-6 h-6" />,
    title: "Get Your Order",
    description: "We'll confirm availability, arrange payment, and ship your order quickly.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24 bg-white">
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
            How It Works
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display font-bold text-3xl md:text-4xl text-walnut mb-4"
          >
            Shopping Made Simple
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-walnut-light text-lg max-w-md mx-auto"
          >
            No complicated checkout. Just browse, ask, and we'll handle the rest.
          </motion.p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-5 bg-teal/10 rounded-2xl flex items-center justify-center text-teal group-hover:bg-teal group-hover:text-white transition-colors duration-300">
                {step.icon}
              </div>
              <div className="font-display font-bold text-xs text-terracotta mb-2 uppercase tracking-widest">
                Step {i + 1}
              </div>
              <h3 className="font-display font-semibold text-lg text-walnut mb-2">
                {step.title}
              </h3>
              <p className="text-walnut-light text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-teal to-teal-dark rounded-2xl p-8 md:p-12 text-center"
        >
          <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-3">
            Ready to Order?
          </h3>
          <p className="text-white/80 text-base mb-6 max-w-md mx-auto">
            Send us a message on Telegram and we'll get back to you within minutes.
          </p>
          <button
            onClick={() =>
              openTelegramChat(
                STORE_CONFIG.telegramUsername,
                "Hi! I'd like to place an order."
              )
            }
            className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-white text-teal rounded-xl font-semibold text-base hover:bg-cream transition-colors shadow-lg hover:shadow-xl"
          >
            <Send className="w-5 h-5" />
            Message Us Now
          </button>
        </motion.div>
      </div>
    </section>
  );
}
