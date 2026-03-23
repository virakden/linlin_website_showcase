import express from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/*
 * ========================================
 * CONFIGURATION - LinLin Natural Cosmetic
 * ========================================
 */
const CONFIG = {
  // Telegram Bot Configuration
  TELEGRAM_BOT_TOKEN:
    process.env.TELEGRAM_BOT_TOKEN ||
    "7921762858:AAHViLHA1loKZ-HPFQHSkSxND-rNanw2wjs",
  STAFF_GROUP_ID: process.env.STAFF_GROUP_ID || "-1003667649677",

  // Business Info
  BUSINESS_NAME: "LinLin Natural Cosmetic",
  BUSINESS_NAME_KH: "លីនលីន ទឹកពន្លៃ",

  // URLs
  WEBSITE_URL: "https://linlin-terkpley.up.railway.app",
  SHOP_URL: "https://linlin-terkpley.up.railway.app/order",
  CHANNEL_URL: "https://t.me/Haosreylin",
  FACEBOOK_URL: "https://www.facebook.com/profile.php?id=61556083836668",
  TIKTOK_URL: "https://www.tiktok.com/@eee_linn168",
  INSTAGRAM_URL: "https://www.instagram.com/eee_linn?igsh=MTlvZGY1Y2k4dDU2cQ==",
  CONTACT_URL: "https://t.me/+855969447146",
  ALL_LINKS_URL: "https://linkbio.co/HaoSreyLin",
};

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

/*
 * ========================================
 * TELEGRAM BOT FUNCTIONS
 * ========================================
 */

// Send message to Telegram
async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  options: any = {}
) {
  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: "HTML",
      ...options,
    }),
  });

  return response.json();
}

// Send photo to Telegram
async function sendTelegramPhoto(
  chatId: string,
  photo: Buffer,
  caption: string
) {
  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendPhoto`;

  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("photo", new Blob([photo]), "receipt.jpg");
  formData.append("caption", caption);
  formData.append("parse_mode", "HTML");

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  return response.json();
}

// Send message directly to user (confirmation)
async function sendTelegramToUser(userId: number, text: string) {
  return sendTelegramMessage(userId.toString(), text);
}

// Generate order ID
function generateOrderId(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, "");
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LL-${dateStr}-${random}`;
}

// Format order message for staff group
function formatOrderMessage(orderId: string, orderData: any): string {
  const {
    customer,
    items,
    total,
    deliveryFee,
    subtotal,
    discount,
    discountPercent,
  } = orderData;

  const itemsList = items
    .map(
      (item: any) =>
        `  • ${item.name_kh || item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
    )
    .join("\n");

  // Logistics info (show on delivery line if exists)
  const logisticsInfo = customer.logisticsName
    ? `(${customer.logisticsName})`
    : "";

  // Discount line (only show if there's a discount)
  const discountLine =
    discount && discount > 0
      ? `🎁 <b>បញ្ចុះតម្លៃ(${discountPercent || 10}%):</b> -$${discount.toFixed(2)}\n`
      : "";

  const message = `
🛒 <b>ការបញ្ជាទិញថ្មី: ${orderId}</b>

👤 <b>អតិថិជន:</b>
  ឈ្មោះ: ${customer.name}
  ទូរស័ព្ទ: ${customer.phone}
  អាសយដ្ឋាន: ${customer.address}, ${customer.provinceName || customer.province || ""}

💬 <b>Telegram:</b>
  ${customer.telegramUsername ? `@${customer.telegramUsername}` : "មិនមាន"}
  ${customer.telegramName ? `(${customer.telegramName})` : ""}
  ${customer.telegramId ? `ID: ${customer.telegramId}` : ""}

📦 <b>ផលិតផល:</b>
${itemsList}

🚚 <b>ថ្លៃដឹកជញ្ជូន${logisticsInfo}:</b> $${deliveryFee?.toFixed(2) || "0.00"}
${discountLine}💰 <b>សរុប:</b> $${total.toFixed(2)}

⏰ ${new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" })}

📸 <b>Check Transaction: ↓</b>
`.trim();

  return message;
}

// Format confirmation message for customer
function formatConfirmationMessage(orderId: string, language: string): string {
  return `
✅ <b>ការបញ្ជាទិញបានជោគជ័យ!</b>

🆔 លេខសម្គាល់ការបញ្ជាទិញ៖ <b>${orderId}</b>

🙏🏻សូមអរគុណសម្រាប់ការគាំទ្រផលិតផលធម្មជាតិខ្មែរ! យើងបានទទួលការបញ្ជាទិញរបស់អ្នកហើយ។ យើងនឹងរៀបចំកញ្ចប់សម្រាប់ដឹកជញ្ជូនទៅអ្នក។ 📦

🙏🏻Thank you for supporting natural Khmer products! We have received your order. We will prepare package for delivery to you.📦

☎️ ប្រសិនបើអ្នកមានសំណួរណាមួយ សូមទាក់ទងមកយើងខ្ញុំ។
📱 Telegram/Phone : 0969447146
📘 Facebook: លីនលីន ទឹកពន្លៃស្រស់ / លីនលីន ទឹកពន្លៃសាច់ចាំ
  `.trim();
}

/*
 * ========================================
 * BOT COMMAND HANDLERS
 * ========================================
 */

// Handle /start command
async function handleStartCommand(chatId: number, firstName: string) {
  const welcomeMessage = `
🌿 <b>សូមស្វាគមន៍មកកាន់ លីនលីនទឹកពន្លៃ!</b>
🙏🏻 <b>Welcome to LinLin Natural Cosmetic!</b>

សួស្តី ${firstName}! 👋

យើងខ្ញុំមានផលិតផលថែរក្សាស្បែកខ្លួន និងស្បែកមុខដែរផលិតពីធម្មជាតិខ្មែរ។
We offer natural Khmer skincare products.

សូមជ្រើសរើសមុខងារខាងក្រោម៖
  `.trim();

  const keyboard = {
    inline_keyboard: [
      [{ text: "🛒 Shop Now | ទិញផលិតផល", web_app: { url: CONFIG.SHOP_URL } }],
      [
        { text: "🌐 Website", url: CONFIG.WEBSITE_URL },
        { text: "📢 Channel", url: CONFIG.CHANNEL_URL },
      ],
      [
        { text: "📘 Facebook", url: CONFIG.FACEBOOK_URL },
        { text: "🎵 TikTok", url: CONFIG.TIKTOK_URL },
      ],
      [
        { text: "📸 Instagram", url: CONFIG.INSTAGRAM_URL },
        { text: "📞 Contact", url: CONFIG.CONTACT_URL },
      ],
      [{ text: "🔗 All Links | តំណទាំងអស់", url: CONFIG.ALL_LINKS_URL }],
    ],
  };

  await sendTelegramMessage(chatId, welcomeMessage, { reply_markup: keyboard });
}

// Handle /shop command
async function handleShopCommand(chatId: number) {
  const message = "🛒 ចុចប៊ូតុងខាងក្រោមដើម្បីទិញផលិតផល\nTap below to shop:";

  const keyboard = {
    inline_keyboard: [
      [{ text: "🛒 Open Shop | បើកហាង", web_app: { url: CONFIG.SHOP_URL } }],
    ],
  };

  await sendTelegramMessage(chatId, message, { reply_markup: keyboard });
}

// Handle /contact command
async function handleContactCommand(chatId: number) {
  const message = `
📞 <b>ទំនាក់ទំនង | Contact Us</b>

📱 Telegram/Phone : 0969447146
📘 Facebook: លីនលីន ទឹកពន្លៃស្រស់ / លីនលីន ទឹកពន្លៃសាច់ចាំ
  `.trim();

  const keyboard = {
    inline_keyboard: [
      [
        { text: "📱 Telegram", url: CONFIG.CONTACT_URL },
        { text: "📘 Facebook", url: CONFIG.FACEBOOK_URL },
      ],
    ],
  };

  await sendTelegramMessage(chatId, message, { reply_markup: keyboard });
}

// Handle /links command
async function handleLinksCommand(chatId: number) {
  const message = "🔗 តំណភ្ជាប់ទាំងអស់ | All Our Links:";

  const keyboard = {
    inline_keyboard: [
      [{ text: "🔗 Open All Links", url: CONFIG.ALL_LINKS_URL }],
    ],
  };

  await sendTelegramMessage(chatId, message, { reply_markup: keyboard });
}

// Process incoming bot message
async function processBotUpdate(update: any) {
  try {
    const message = update.message;
    if (!message || !message.text) return;

    const chatId = message.chat.id;
    const text = message.text;
    const firstName = message.from?.first_name || "";

    // Handle commands
    if (text === "/start" || text.startsWith("/start ")) {
      await handleStartCommand(chatId, firstName);
    } else if (text === "/shop") {
      await handleShopCommand(chatId);
    } else if (text === "/contact") {
      await handleContactCommand(chatId);
    } else if (text === "/links") {
      await handleLinksCommand(chatId);
    }
  } catch (error) {
    console.error("Error processing bot update:", error);
  }
}

/*
 * ========================================
 * EXPRESS SERVER
 * ========================================
 */

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(express.json());

  /*
   * ========================================
   * API ENDPOINTS
   * ========================================
   */

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Telegram webhook endpoint
  app.post("/api/telegram/webhook", async (req, res) => {
    try {
      await processBotUpdate(req.body);
      res.json({ ok: true });
    } catch (error) {
      console.error("Webhook error:", error);
      res.json({ ok: true }); // Always return 200 to Telegram
    }
  });

  // Submit order
  app.post(
    "/api/orders",
    upload.single("transactionImage"),
    async (req, res) => {
      try {
        const orderData = JSON.parse(req.body.orderData);
        const transactionImage = req.file;

        if (!transactionImage) {
          return res.status(400).json({
            success: false,
            error: "Transaction image is required",
          });
        }

        const orderId = generateOrderId();
        const staffMessage = formatOrderMessage(orderId, orderData);

        // Send order details to staff group (don't fail if network issue)
        try {
          await sendTelegramMessage(CONFIG.STAFF_GROUP_ID, staffMessage);
          await sendTelegramPhoto(
            CONFIG.STAFF_GROUP_ID,
            transactionImage.buffer,
            `📸 Receipt for order ${orderId}`
          );
          console.log("✅ Order sent to Telegram");
        } catch (telegramError) {
          console.log(
            "⚠️ Telegram failed (will work on Railway):",
            telegramError
          );
          // Continue - don't fail the order
        }
        if (orderData.customer.telegramId) {
          const confirmMessage = formatConfirmationMessage(
            orderId,
            orderData.language
          );
          try {
            await sendTelegramToUser(
              orderData.customer.telegramId,
              confirmMessage
            );
          } catch (e) {
            console.log("Could not send confirmation to user:", e);
          }
        }

        console.log(`✅ Order ${orderId} created:`, {
          customer: orderData.customer.name,
          phone: orderData.customer.phone,
          total: orderData.total,
          items: orderData.items.length,
        });

        res.json({
          success: true,
          orderId,
          message: "Order submitted successfully",
        });
      } catch (error) {
        console.error("Order error:", error);
        res.status(500).json({
          success: false,
          error: "Failed to process order",
        });
      }
    }
  );

  /*
   * ========================================
   * STATIC FILES
   * ========================================
   */

  const staticPath = path.resolve(__dirname, "..", "dist", "public");

  app.use(express.static(staticPath));

  app.get("*", (_req, res) => {
    res.sendFile(path.resolve(__dirname, "..", "dist", "public", "index.html"));
  });

  /*
   * ========================================
   * START SERVER & SET WEBHOOK
   * ========================================
   */

  const port = process.env.PORT || 3000;

  server.listen(port, async () => {
    console.log(`
╔════════════════════════════════════════════╗
║   ${CONFIG.BUSINESS_NAME}                  
║   Server running on http://localhost:${port}/
║   Staff Group: ${CONFIG.STAFF_GROUP_ID}
╚════════════════════════════════════════════╝
    `);

    // Set Telegram webhook (only in production)
    if (process.env.NODE_ENV === "production") {
      const webhookUrl = `${CONFIG.WEBSITE_URL}/api/telegram/webhook`;
      try {
        const response = await fetch(
          `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/setWebhook?url=${webhookUrl}`
        );
        const result = await response.json();
        console.log("Webhook set:", result);
      } catch (error) {
        console.error("Failed to set webhook:", error);
      }
    }
  });
}

startServer().catch(console.error);
