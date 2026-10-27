import { CustomerOrder, PACKAGE_OFFERS } from '../types/order';
import { getSizeDetailsKurdish } from './sizing';

/**
 * Formats a clean, readable Telegram message in Kurdish for the store owner
 */
export function formatTelegramOrderMessage(order: CustomerOrder): string {
  const offer = PACKAGE_OFFERS.find(p => p.id === order.packageType);
  const offerTitle = offer ? offer.title : order.packageType;

  const formattedDate = order.createdAt 
    ? new Date(order.createdAt).toLocaleString('ku', { dateStyle: 'medium', timeStyle: 'short' })
    : new Date().toLocaleString();

  const lines = [
    `🔔 *داواکاری نوێ لە کوردە بازاڕ*`,
    `📦 *بەرهەم:* قایشی پزیشکی ڕاستکردنەوەی پشت`,
    `━━━━━━━━━━━━━━━━━━`,
    `👤 *ناوی کڕیار:* ${order.fullName || 'دیاری نەکراوە'}`,
    `🏙 *شار:* ${order.city}${order.customCity ? ` (${order.customCity})` : ''}`,
    order.addressDetails ? `📍 *ناونیشانی ورد:* ${order.addressDetails}` : null,
    `📞 *ژمارەی مۆبایل:* \`${order.primaryPhone}\``,
    order.secondaryPhone ? `📱 *ژمارەی دووەم:* \`${order.secondaryPhone}\`` : `📱 *ژمارەی دووەم:* نییە / نەنووسراوە`,
    `⚖️ *وەزن (کێش):* ${order.weightKg} کگم`,
    `🎁 *پاکێج:* ${offerTitle}`,
    `💰 *کۆی گشتی پارە:* ${order.totalPrice.toLocaleString()} دیناری عێراقی`,
    order.deliveryFee === 0 ? `🚚 *گەیاندن:* بێبەرامبەر (بەلاش)` : `🚚 *گەیاندن:* ${order.deliveryFee.toLocaleString()} دینار`,
    order.notes ? `📝 *تێبینی کڕیار:* ${order.notes}` : null,
    `━━━━━━━━━━━━━━━━━━`,
    `🆔 *کۆدی داواکاری:* #${order.id.slice(0, 8)}`,
    `⏰ *کاتی تۆمارکردن:* ${formattedDate}`
  ];

  return lines.filter(Boolean).join('\n');
}

/**
 * Creates direct Telegram link (either to a specific username or general share)
 */
export function generateDirectTelegramUrl(messageText: string, storeUsername?: string): string {
  const encodedText = encodeURIComponent(messageText);
  if (storeUsername && storeUsername.trim()) {
    const cleanUsername = storeUsername.replace(/^@/, '').trim();
    // Direct chat with store owner bot or user
    return `https://t.me/${cleanUsername}?text=${encodedText}`;
  }
  // Share link that lets user select the chat or send directly
  return `https://t.me/share/url?url=&text=${encodedText}`;
}

/**
 * Sends order directly to Telegram Bot API
 */
export async function sendOrderToTelegramApi(
  order: CustomerOrder,
  config: { botToken: string; chatId: string }
): Promise<{ success: boolean; message?: string }> {
  if (!config.botToken || !config.chatId) {
    return {
      success: false,
      message: 'تووکنی بۆت یان ئایدی چات دیاری نەکراوە'
    };
  }

  const messageText = formatTelegramOrderMessage(order);
  const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: config.chatId,
        text: messageText,
        parse_mode: 'Markdown'
      })
    });

    const data = await response.json();
    if (data.ok) {
      return { success: true };
    } else {
      return {
        success: false,
        message: data.description || 'هەڵەیەک لە ناردنی پەیام بۆ تیلیگرام ڕوویدا'
      };
    }
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'پەیوەندی بە سێرڤەری تیلیگرام نەکرا'
    };
  }
}
