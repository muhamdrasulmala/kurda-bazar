import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// In-memory + persistent fallback orders store
const DATA_DIR = path.join(__dirname, '.data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const CONFIG_FILE = path.join(DATA_DIR, 'telegram_config.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function loadOrders(): any[] {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const content = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (e) {
    console.error('Failed to read orders file:', e);
  }
  return [];
}

function saveOrders(orders: any[]) {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save orders file:', e);
  }
}

function loadTelegramConfig() {
  let fileConfig = {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    chatId: process.env.TELEGRAM_CHAT_ID || '',
    secondChatId: process.env.TELEGRAM_SECOND_CHAT_ID || '',
    storeUsername: process.env.TELEGRAM_STORE_USERNAME || ''
  };

  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      fileConfig = {
        botToken: parsed.botToken || fileConfig.botToken,
        chatId: parsed.chatId || fileConfig.chatId,
        secondChatId: parsed.secondChatId || fileConfig.secondChatId || '',
        storeUsername: parsed.storeUsername || fileConfig.storeUsername
      };
    }
  } catch (e) {
    console.error('Failed to read telegram config:', e);
  }

  return fileConfig;
}

function saveTelegramConfig(config: { botToken: string; chatId: string; secondChatId?: string; storeUsername?: string }) {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to save telegram config:', e);
  }
}

// Helper to send formatted Telegram message
async function sendTelegramMessage(botToken: string, chatId: string, text: string) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'Markdown'
    })
  });

  const data = await response.json();
  return data;
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'kurda-bazar-api', timestamp: new Date().toISOString() });
});

// Get Telegram configuration status
app.get('/api/telegram/config', (req, res) => {
  const config = loadTelegramConfig();
  res.json({
    isConfigured: Boolean(config.botToken && config.chatId),
    chatId: config.chatId ? `${config.chatId.slice(0, 3)}***` : '',
    rawChatId: config.chatId,
    secondChatId: config.secondChatId ? `${config.secondChatId.slice(0, 3)}***` : '',
    rawSecondChatId: config.secondChatId || '',
    storeUsername: config.storeUsername || '',
    hasToken: Boolean(config.botToken)
  });
});

// Update Telegram config from store settings (with 2 Chat IDs)
app.post('/api/telegram/config', (req, res) => {
  const { botToken, chatId, secondChatId, storeUsername } = req.body;
  const currentConfig = loadTelegramConfig();
  const effectiveBotToken = (botToken || '').trim() || currentConfig.botToken;

  if (!effectiveBotToken || !chatId) {
    return res.status(400).json({ error: 'تکایە لانیکەم تووکنی بۆت و ئایدی چاتی یەکەم بنووسە' });
  }

  saveTelegramConfig({
    botToken: effectiveBotToken,
    chatId: chatId.trim(),
    secondChatId: (secondChatId || '').trim(),
    storeUsername: (storeUsername || '').trim()
  });

  res.json({ success: true, message: 'ڕێکخستنەکانی تیلیگرام بە سەرکەوتوویی پاشەکەوت کران' });
});

// Test Telegram message to both Chat IDs
app.post('/api/telegram/test', async (req, res) => {
  const bodyConfig = req.body || {};
  const currentConfig = loadTelegramConfig();
  const botToken = bodyConfig.botToken || currentConfig.botToken;
  const chatId = bodyConfig.chatId || currentConfig.chatId;
  const secondChatId = bodyConfig.secondChatId !== undefined ? bodyConfig.secondChatId : currentConfig.secondChatId;

  if (!botToken || !chatId) {
    return res.status(400).json({ 
      error: 'تکایە سەرەتا تووکنی بۆت و لانیکەم ئایدی چاتی یەکەم بنووسە' 
    });
  }

  const testMessage = `✅ *سڵاو لە کوردە بازاڕەوە!*
ئەمە نامەی تاقیکردنەوەیە بۆ دڵنیابوونەوە لە پەیوەستبوونی بۆتی تیلیگرام.
سیستەمی وەرگرتنی داواکارییەکان بە تەواوی ئامادەیە!
⏰ کات: ${new Date().toLocaleTimeString()}`;

  const targets = [chatId, secondChatId].filter(Boolean) as string[];
  const results: { id: string; success: boolean; error?: string }[] = [];

  for (const targetId of targets) {
    try {
      const result = await sendTelegramMessage(botToken, targetId.trim(), testMessage);
      if (result.ok) {
        results.push({ id: targetId, success: true });
      } else {
        results.push({ id: targetId, success: false, error: result.description });
      }
    } catch (err: any) {
      results.push({ id: targetId, success: false, error: err.message });
    }
  }

  const allSucceeded = results.every(r => r.success);
  if (allSucceeded) {
    res.json({ 
      success: true, 
      message: targets.length > 1 
        ? 'نامەی تاقیکردنەوە بە سەرکەوتوویی بۆ هەردوو ئایدی چاتەکە نێردرا!' 
        : 'نامەی تاقیکردنەوە بە سەرکەوتوویی بۆ تیلیگرامەکەت نێردرا!' 
    });
  } else {
    const failedOnes = results.filter(r => !r.success);
    res.status(400).json({
      error: `هەڵە لە ناردن بۆ هەندێک لە چاتەکان: ${failedOnes.map(f => f.error).join(', ')}. تکایە دڵنیابە لە /start کردن لە هەردوو ئەکاونتەکەدا.`
    });
  }
});

// Create Customer Order
app.post('/api/orders', async (req, res) => {
  const {
    fullName,
    city,
    customCity,
    addressDetails,
    primaryPhone,
    secondaryPhone,
    weightKg,
    heightCm,
    selectedSize,
    packageType,
    totalPrice,
    deliveryFee,
    notes
  } = req.body;

  if (!city || !primaryPhone || !weightKg) {
    return res.status(400).json({
      error: 'تکایە زانیارییە سەرەکییەکان (شار، ژمارەی مۆبایل، کێش) بنووسە'
    });
  }

  const newOrder = {
    id: 'kb-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    fullName: fullName || 'کڕیاری کوردە بازاڕ',
    city,
    customCity: customCity || '',
    addressDetails: addressDetails || '',
    primaryPhone,
    secondaryPhone: secondaryPhone || '',
    weightKg: Number(weightKg),
    heightCm: heightCm ? Number(heightCm) : undefined,
    selectedSize: selectedSize || 'L',
    packageType: packageType || 'single',
    totalPrice: Number(totalPrice) || 15000,
    deliveryFee: Number(deliveryFee) || 0,
    notes: notes || '',
    createdAt: new Date().toISOString(),
    status: 'new'
  };

  // Save order to store
  const orders = loadOrders();
  orders.unshift(newOrder);
  saveOrders(orders);

  // Send to Telegram
  const telegramConfig = loadTelegramConfig();
  let telegramSent = false;
  let telegramError: string | null = null;

  // Format message as requested: City, Primary phone, Secondary phone, Weight
  const telegramMessage = `🛒 *داواکاری نوێ لە کوردە بازاڕ*
━━━━━━━━━━━━━━━━━━
👤 *ناوی کڕیار:* ${newOrder.fullName}
🏙 *شار:* ${newOrder.city}${newOrder.customCity ? ` (${newOrder.customCity})` : ''}
${newOrder.addressDetails ? `📍 *ناونیشان:* ${newOrder.addressDetails}\n` : ''}📞 *ژمارەی سەرەکی:* \`${newOrder.primaryPhone}\`
${newOrder.secondaryPhone ? `📱 *ژمارەی دووەم:* \`${newOrder.secondaryPhone}\`\n` : ''}⚖️ *وەزن (کێش):* ${newOrder.weightKg} کگم
💰 *کۆی گشتی:* ${newOrder.totalPrice.toLocaleString()} دینار (${newOrder.deliveryFee === 0 ? 'گەیاندنی بەلاش' : 'گەیاندن: 3,000'})
${newOrder.notes ? `📝 *تێبینی:* ${newOrder.notes}\n` : ''}━━━━━━━━━━━━━━━━━━
🆔 *کۆدی داواکاری:* #${newOrder.id}
⏰ *کات:* ${new Date().toLocaleString('ku')}`;

  if (telegramConfig.botToken && telegramConfig.chatId) {
    const targets = [telegramConfig.chatId, telegramConfig.secondChatId].filter(Boolean) as string[];
    const errors: string[] = [];
    let anySent = false;

    for (const targetId of targets) {
      try {
        const tgRes = await sendTelegramMessage(
          telegramConfig.botToken,
          targetId.trim(),
          telegramMessage
        );
        if (tgRes.ok) {
          anySent = true;
        } else {
          errors.push(`Chat ${targetId}: ${tgRes.description}`);
        }
      } catch (err: any) {
        errors.push(`Chat ${targetId}: ${err.message}`);
      }
    }

    telegramSent = anySent;
    if (errors.length > 0) {
      telegramError = errors.join('; ');
    }
  }

  res.status(201).json({
    success: true,
    order: newOrder,
    telegram: {
      sent: telegramSent,
      isConfigured: Boolean(telegramConfig.botToken && telegramConfig.chatId),
      error: telegramError,
      formattedMessage: telegramMessage,
      storeUsername: telegramConfig.storeUsername
    }
  });
});

// Get orders list
app.get('/api/orders', (req, res) => {
  const orders = loadOrders();
  res.json({ orders });
});

// Update order status
app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const orders = loadOrders();
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'داواکاری نەدۆزرایەوە' });
  }

  orders[index].status = status;
  saveOrders(orders);
  res.json({ success: true, order: orders[index] });
});

// Delete specific order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const orders = loadOrders();
  const filtered = orders.filter(o => o.id !== id);
  if (filtered.length === orders.length) {
    return res.status(404).json({ error: 'داواکاری نەدۆزرایەوە' });
  }

  saveOrders(filtered);
  res.json({ success: true, message: 'داواکارییەکە بە سەرکەوتوویی ڕەشکرایەوە' });
});

// Clear all orders
app.delete('/api/orders', (req, res) => {
  saveOrders([]);
  res.json({ success: true, message: 'هەموو داواکارییەکان ڕەشکرانەوە' });
});

// Download pure HTML file directly
app.get('/download-html', (req, res) => {
  const htmlFile = path.join(__dirname, 'public', 'kurda-bazar-clean.html');
  if (fs.existsSync(htmlFile)) {
    res.download(htmlFile, 'kurda-bazar.html');
  } else {
    res.status(404).send('فایلی HTML نەدۆزرایەوە');
  }
});

// Download pure clean code ZIP for ChatGPT
app.get('/api/download-clean-zip', (req, res) => {
  const cleanZip = path.join(__dirname, 'public', 'kurda_bazar_clean.zip');
  if (fs.existsSync(cleanZip)) {
    res.download(cleanZip, 'kurda_bazar_clean.zip');
  } else {
    res.status(404).send('فایلی زیپ ئامادە نییە');
  }
});

// Download full project source zip for GitHub
app.get('/api/download-zip', async (req, res) => {
  const zipPath = path.join(__dirname, 'kurda-bazar-project.zip');
  try {
    const { execSync } = await import('child_process');
    execSync(`python3 -c "
import os, zipfile
zip_filename = 'kurda-bazar-project.zip'
include_files = ['index.html', 'package.json', 'tsconfig.json', 'vite.config.ts', 'server.ts', '.gitignore', '.env.example', 'README.md', 'metadata.json']
include_dirs = ['src', 'dist']
with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for f in include_files:
        if os.path.exists(f):
            zipf.write(f, arcname=f)
    for d in include_dirs:
        for root, dirs, files in os.walk(d):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, arcname=file_path)
"`);
  } catch (e) {
    console.error('Error updating zip:', e);
  }

  if (fs.existsSync(zipPath)) {
    res.download(zipPath, 'kurda-bazar-project.zip');
  } else {
    res.status(500).json({ error: 'فایلی زیپ نەدۆزرایەوە' });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';
  const distPath = path.join(__dirname, 'dist');
  const distExists = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'));

  if (isProd && distExists) {
    console.log('Serving production static build from', distPath);
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    console.log('Using Vite development middleware mode');
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Kurda Bazar server running on http://localhost:${PORT}`);
  });
}

startServer();
