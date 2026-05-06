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

  // ✅ ADD THESE 2 NEW LINES:
  WIFE_USER_ID: 1004330498,
  CHANNEL_USERNAME: "@Haosreylin",
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

/*
 * ========================================
 * CHANNEL AUTO-POST SCHEDULER
 * Conversational flow with inline keyboards
 * ========================================
 */

// Session states
type PostState =
  | "IDLE"
  | "WAITING_MEDIA"
  | "WAITING_TITLE_DECISION"
  | "WAITING_TITLE"
  | "WAITING_POST_DECISION"
  | "WAITING_SCHEDULE_DATE"
  | "WAITING_SCHEDULE_TIME";

interface UserSession {
  state: PostState;
  fileId?: string;
  mediaType?: "photo" | "video";
  title?: string;
  scheduleDate?: "today" | "tomorrow";
}

// Store session per user
const userSessions = new Map<number, UserSession>();

// Default caption template
const buildCaption = (title?: string): string => {
  const titleLine = title ? `${title}\n\n` : "";
  return (
    `${titleLine}` +
    `——————————————————————\n` +
    `🛒 កម្មង់តាមរយៈ "<a href="https://t.me/linlin_skincare_bot/shop">លីនលីនទឹកពន្លៃ Mini-App</a>" 🚚\n\n` +
    `🚨 ព័ត៍មានបន្ថែម "<a href="https://t.me/linlin_skincare_bot">លីនលីនទឹកពន្លៃ bot</a>" 🤖\n` +
    `📱 មើលឈុតថ្មីៗ តាមវេបសាយ "<a href="https://linlinterkpley.com">លីនលីនទឹកពន្លៃ Website</a>" 🔭\n` +
    `——————————————————————`
  );
};

// Answer callback query (dismiss button loading)
async function answerCallbackQuery(callbackQueryId: string) {
  await fetch(
    `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackQueryId }),
    }
  );
}

// Send message with inline keyboard buttons
async function sendInlineKeyboard(
  chatId: number,
  text: string,
  buttons: Array<Array<{ text: string; callback_data: string }>>
) {
  return sendTelegramMessage(chatId, text, {
    reply_markup: { inline_keyboard: buttons },
  });
}

// Send photo to channel by file_id
async function sendPhotoToChannel(fileId: string, caption: string) {
  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendPhoto`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CONFIG.CHANNEL_USERNAME,
      photo: fileId,
      caption,
      parse_mode: "HTML",
    }),
  });
  return response.json();
}

// Send video to channel by file_id
async function sendVideoToChannel(fileId: string, caption: string) {
  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendVideo`;
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: CONFIG.CHANNEL_USERNAME,
      video: fileId,
      caption,
      parse_mode: "HTML",
    }),
  });
  return response.json();
}

// Post to channel immediately
async function postToChannelNow(session: UserSession) {
  const caption = buildCaption(session.title);
  if (session.mediaType === "photo") {
    await sendPhotoToChannel(session.fileId!, caption);
  } else {
    await sendVideoToChannel(session.fileId!, caption);
  }
}

// Schedule post at specific time (Cambodia UTC+7)
function scheduleChannelPost(
  session: UserSession,
  hour: number,
  minute: number
): number {
  const now = new Date();
  const target = new Date(now);

  // Set target time in UTC (Cambodia = UTC+7, so subtract 7)
  target.setUTCHours(hour - 7, minute, 0, 0);

  // If tomorrow selected
  if (session.scheduleDate === "tomorrow") {
    target.setUTCDate(target.getUTCDate() + 1);
  }

  // If today but time already passed → push to next day
  if (target.getTime() <= now.getTime()) {
    target.setUTCDate(target.getUTCDate() + 1);
  }

  const delay = target.getTime() - now.getTime();

  setTimeout(async () => {
    try {
      await postToChannelNow(session);
      console.log(`✅ Scheduled post sent to ${CONFIG.CHANNEL_USERNAME}`);
    } catch (err) {
      console.error("❌ Scheduled post failed:", err);
    }
  }, delay);

  return Math.round(delay / 60000); // return minutes remaining
}

/*
 * Handle message updates from wife (text + media)
 */
async function handleSchedulerMessage(message: any) {
  const userId: number = message.from?.id;
  const chatId: number = message.chat.id;

  if (userId !== CONFIG.WIFE_USER_ID) return;

  const session: UserSession = userSessions.get(userId) || { state: "IDLE" };

  // ── /postmedia command ──
  if (message.text === "/postmedia") {
    userSessions.set(userId, { state: "WAITING_MEDIA" });
    await sendTelegramMessage(chatId, "📸 សូមផ្ញើរូបភាព ឬវីឌីអូ");
    return;
  }

  // ── Receive photo or video ──
  if ((message.photo || message.video) && session.state === "WAITING_MEDIA") {
    const fileId = message.photo
      ? message.photo[message.photo.length - 1].file_id
      : message.video.file_id;
    const mediaType: "photo" | "video" = message.photo ? "photo" : "video";

    userSessions.set(userId, {
      state: "WAITING_TITLE_DECISION",
      fileId,
      mediaType,
    });

    await sendInlineKeyboard(chatId, "✅ បានទទួល!\n\nតើមានចំណងជើងទេ?", [
      [
        { text: "✅ បាទ/ចាស", callback_data: "title_yes" },
        { text: "❌ ទេ", callback_data: "title_no" },
      ],
    ]);
    return;
  }

  // ── Receive short title text ──
  if (message.text && session.state === "WAITING_TITLE") {
    const title = message.text.trim();
    userSessions.set(userId, {
      ...session,
      state: "WAITING_POST_DECISION",
      title,
    });

    await sendInlineKeyboard(
      chatId,
      `📝 ចំណងជើង: <b>${title}</b>\n\nតើអ្នកចង់ផុសក្នុងឆាណែនឥឡូវនេះ ឬ កាលវិភាគ?`,
      [
        [
          { text: "🚀 ផុសឥឡូវ", callback_data: "post_now" },
          { text: "🗓 ផុសកាលវិភាគ", callback_data: "post_schedule" },
        ],
      ]
    );
    return;
  }

  // ── Receive schedule time (HH:MM) ──
  if (message.text && session.state === "WAITING_SCHEDULE_TIME") {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(message.text.trim())) {
      await sendTelegramMessage(
        chatId,
        "⚠️ ម៉ោងមិនត្រឹមត្រូវ!\nសូមវាយ format: <code>HH:MM</code>\nឧទាហរណ៍: <code>18:30</code>"
      );
      return;
    }

    const [hour, minute] = message.text.trim().split(":").map(Number);
    const delayMinutes = scheduleChannelPost(session, hour, minute);
    const dateLabel =
      session.scheduleDate === "tomorrow" ? "ថ្ងៃស្អែក" : "ថ្ងៃនេះ";

    userSessions.delete(userId);

    await sendTelegramMessage(
      chatId,
      `🎉 បានកំណត់ Post ជោគជ័យ!\n\n` +
        `📅 ថ្ងៃ: <b>${dateLabel}</b>\n` +
        `⏰ ម៉ោង: <b>${message.text.trim()}</b> (ម៉ោងខ្មែរ)\n` +
        `⏳ នៅសល់: <b>~${delayMinutes} នាទី</b>\n` +
        `📢 Channel: ${CONFIG.CHANNEL_USERNAME}`
    );
    return;
  }
}

/*
 * Handle button click callbacks from wife
 */
async function handleCallbackQuery(callbackQuery: any) {
  const userId: number = callbackQuery.from.id;
  const chatId: number = callbackQuery.message.chat.id;
  const data: string = callbackQuery.data;

  if (userId !== CONFIG.WIFE_USER_ID) return;

  await answerCallbackQuery(callbackQuery.id);

  const session = userSessions.get(userId);
  if (!session) return;

  // ── Has title? YES ──
  if (data === "title_yes" && session.state === "WAITING_TITLE_DECISION") {
    userSessions.set(userId, { ...session, state: "WAITING_TITLE" });
    await sendTelegramMessage(chatId, "✏️ សូមវាយចំណងជើង (Short Title):");
    return;
  }

  // ── Has title? NO ──
  if (data === "title_no" && session.state === "WAITING_TITLE_DECISION") {
    userSessions.set(userId, {
      ...session,
      state: "WAITING_POST_DECISION",
      title: undefined,
    });
    await sendInlineKeyboard(
      chatId,
      "តើអ្នកចង់ផុសក្នុងឆាណែនឥឡូវនេះ ឬ កាលវិភាគ?",
      [
        [
          { text: "🚀 ផុសឥឡូវ", callback_data: "post_now" },
          { text: "🗓 ផុសកាលវិភាគ", callback_data: "post_schedule" },
        ],
      ]
    );
    return;
  }

  // ── Post NOW ──
  if (data === "post_now" && session.state === "WAITING_POST_DECISION") {
    try {
      await postToChannelNow(session);
      userSessions.delete(userId);
      await sendTelegramMessage(
        chatId,
        `✅ បានផុសទៅ ${CONFIG.CHANNEL_USERNAME} ជោគជ័យ! 🎉`
      );
    } catch {
      await sendTelegramMessage(chatId, "❌ មានបញ្ហា! សូមព្យាយាមម្តងទៀត");
    }
    return;
  }

  // ── Post SCHEDULE → ask date ──
  if (data === "post_schedule" && session.state === "WAITING_POST_DECISION") {
    userSessions.set(userId, { ...session, state: "WAITING_SCHEDULE_DATE" });
    await sendInlineKeyboard(chatId, "📅 សូមជ្រើសរើសថ្ងៃ:", [
      [
        { text: "📅 ថ្ងៃនេះ", callback_data: "date_today" },
        { text: "📅 ថ្ងៃស្អែក", callback_data: "date_tomorrow" },
      ],
    ]);
    return;
  }

  // ── Date selected → ask time ──
  if (
    (data === "date_today" || data === "date_tomorrow") &&
    session.state === "WAITING_SCHEDULE_DATE"
  ) {
    const dateChoice = data === "date_today" ? "today" : "tomorrow";
    const dateLabel = dateChoice === "today" ? "ថ្ងៃនេះ" : "ថ្ងៃស្អែក";
    userSessions.set(userId, {
      ...session,
      state: "WAITING_SCHEDULE_TIME",
      scheduleDate: dateChoice,
    });
    await sendTelegramMessage(
      chatId,
      `📅 ជ្រើស: <b>${dateLabel}</b>\n\n⏰ សូមវាយម៉ោង (ម៉ោងខ្មែរ):\nFormat: <code>HH:MM</code>\nឧទាហរណ៍: <code>18:30</code>`
    );
    return;
  }
}

// Process incoming bot message
async function processBotUpdate(update: any) {
  try {
    // ✅ Handle button clicks from wife
    if (update.callback_query) {
      await handleCallbackQuery(update.callback_query);
      return;
    }

    const message = update.message;
    if (!message) return;

    // ✅ Handle scheduler flow from wife
    await handleSchedulerMessage(message);

    // Handle regular bot commands
    if (!message.text) return;
    const chatId = message.chat.id;
    const text = message.text;
    const firstName = message.from?.first_name || "";

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
