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
  TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || "7921762858:AAHViLHA1loKZ-HPFQHSkSxND-rNanw2wjs",
  STAFF_GROUP_ID: process.env.STAFF_GROUP_ID || "-1003667649677",
  
  // Business Info
  BUSINESS_NAME: "LinLin Natural Cosmetic",
  BUSINESS_NAME_KH: "លីនលីន ទឹកពន្លៃ",
};

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/*
 * ========================================
 * TELEGRAM BOT FUNCTIONS
 * ========================================
 */

// Send message to Telegram
async function sendTelegramMessage(chatId: string, text: string, parseMode: string = "HTML") {
  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: parseMode
    })
  });
  
  return response.json();
}

// Send photo to Telegram
async function sendTelegramPhoto(chatId: string, photo: Buffer, caption: string) {
  const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_BOT_TOKEN}/sendPhoto`;
  
  const formData = new FormData();
  formData.append("chat_id", chatId);
  formData.append("photo", new Blob([photo]), "receipt.jpg");
  formData.append("caption", caption);
  formData.append("parse_mode", "HTML");
  
  const response = await fetch(url, {
    method: "POST",
    body: formData
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
  const { customer, items, total, language } = orderData;
  const isKhmer = language === "kh";
  
  // Build items list
  const itemsList = items.map((item: any) => 
    `  • ${isKhmer ? item.name_kh : item.name} x${item.quantity} = $${(item.price * item.quantity).toFixed(2)}`
  ).join("\n");
  
  // Format message
  const message = `
🛒 <b>NEW ORDER: ${orderId}</b>

👤 <b>${isKhmer ? "អតិថិជន" : "Customer"}:</b>
  ${isKhmer ? "ឈ្មោះ" : "Name"}: ${customer.name}
  ${isKhmer ? "ទូរស័ព្ទ" : "Phone"}: ${customer.phone}
  ${isKhmer ? "អាសយដ្ឋាន" : "Address"}: ${customer.address}
  ${customer.note ? `${isKhmer ? "កំណត់ចំណាំ" : "Note"}: ${customer.note}` : ""}

💬 <b>Telegram:</b>
  ${customer.telegramUsername ? `@${customer.telegramUsername}` : "N/A"}
  ${customer.telegramName ? `(${customer.telegramName})` : ""}
  ${customer.telegramId ? `ID: ${customer.telegramId}` : ""}

📦 <b>${isKhmer ? "ផលិតផល" : "Products"}:</b>
${itemsList}

💰 <b>${isKhmer ? "សរុប" : "Total"}: $${total.toFixed(2)}</b>

⏰ ${new Date().toLocaleString("en-US", { timeZone: "Asia/Phnom_Penh" })}

📸 <b>${isKhmer ? "រូបភាពបង្កាន់ដៃ" : "Receipt image"} ↓</b>
`.trim();
  
  return message;
}

// Format confirmation message for customer
function formatConfirmationMessage(orderId: string, language: string): string {
  if (language === "kh") {
    return `
✅ <b>បញ្ជាទិញបានជោគជ័យ!</b>

🆔 លេខបញ្ជាទិញ: <b>${orderId}</b>

សូមអរគុណ! សម្រាប់ការគាំទ្រផលិតផលធម្មជាតិខ្មែរ។ យើងបានទទួលការបញ្ជាទិញរបស់អ្នកហើយ។ យើងនឹងរៀបចំកញ្ចប់សម្រាប់ដឹកជញ្ជូនទៅអ្នក។

📞 ប្រសិនបើមានសំណួរ សូមទំនាក់ទំនងមកយើង។

🏪 ${CONFIG.BUSINESS_NAME_KH}
    `.trim();
  }
  
  return `
✅ <b>Order Successful!</b>

🆔 Order ID: <b>${orderId}</b>

Thank you for supporting natural Khmer products! We have received your order. We will prepare package for delivery to you.

📞 If you have any questions, please contact us.

🏪 ${CONFIG.BUSINESS_NAME}
  `.trim();
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
  
  // Submit order
  app.post("/api/orders", upload.single("transactionImage"), async (req, res) => {
    try {
      // Parse order data
      const orderData = JSON.parse(req.body.orderData);
      const transactionImage = req.file;
      
      if (!transactionImage) {
        return res.status(400).json({ 
          success: false, 
          error: "Transaction image is required" 
        });
      }
      
      // Generate order ID
      const orderId = generateOrderId();
      
      // Format message for staff group
      const staffMessage = formatOrderMessage(orderId, orderData);
      
      // Send order details to staff group
      await sendTelegramMessage(CONFIG.STAFF_GROUP_ID, staffMessage);
      
      // Send transaction image to staff group
      await sendTelegramPhoto(
        CONFIG.STAFF_GROUP_ID, 
        transactionImage.buffer,
        `📸 Receipt for order ${orderId}`
      );
      
      // Send confirmation to customer (if Telegram ID available)
      if (orderData.customer.telegramId) {
        const confirmMessage = formatConfirmationMessage(orderId, orderData.language);
        try {
          await sendTelegramToUser(orderData.customer.telegramId, confirmMessage);
        } catch (e) {
          console.log("Could not send confirmation to user:", e);
          // Don't fail the order if user confirmation fails
        }
      }
      
      // Log order (in production, save to database)
      console.log(`✅ Order ${orderId} created:`, {
        customer: orderData.customer.name,
        phone: orderData.customer.phone,
        total: orderData.total,
        items: orderData.items.length
      });
      
      // Return success
      res.json({ 
        success: true, 
        orderId,
        message: "Order submitted successfully"
      });
      
    } catch (error) {
      console.error("Order error:", error);
      res.status(500).json({ 
        success: false, 
        error: "Failed to process order" 
      });
    }
  });
  
  /*
   * ========================================
   * STATIC FILES
   * ========================================
   */
  
  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");
  
  app.use(express.static(staticPath));
  
  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
  
  /*
   * ========================================
   * START SERVER
   * ========================================
   */
  
  const port = process.env.PORT || 3000;
  
  server.listen(port, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   ${CONFIG.BUSINESS_NAME}                  
║   Server running on http://localhost:${port}/
║   Staff Group: ${CONFIG.STAFF_GROUP_ID}
╚════════════════════════════════════════════╝
    `);
  });
}

startServer().catch(console.error);
