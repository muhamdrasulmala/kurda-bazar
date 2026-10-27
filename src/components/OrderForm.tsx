import React, { useState } from 'react';
import { CustomerOrder, KURDISH_CITIES } from '../types/order';
import { calculateOrderPricing, validateKurdishPhone } from '../utils/sizing';
import { generateDirectTelegramUrl } from '../utils/telegram';
import { 
  Send, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Scale, 
  Truck, 
  ShieldCheck, 
  AlertCircle,
  Copy,
  ExternalLink,
  Sparkles,
  Info,
  Gift
} from 'lucide-react';

interface OrderFormProps {
  initialWeight?: number;
  onOrderSuccess?: (order: CustomerOrder) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  initialWeight = 75,
  onOrderSuccess
}) => {
  // Form State
  const [fullName, setFullName] = useState<string>('');
  const [city, setCity] = useState<string>('هەولێر');
  const [customCity, setCustomCity] = useState<string>('');
  const [addressDetails, setAddressDetails] = useState<string>('');
  const [primaryPhone, setPrimaryPhone] = useState<string>('');
  const [secondaryPhone, setSecondaryPhone] = useState<string>('');
  const [weightKg, setWeightKg] = useState<number | ''>(initialWeight || 75);
  const [notes, setNotes] = useState<string>('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<CustomerOrder | null>(null);
  const [telegramInfo, setTelegramInfo] = useState<{
    sent: boolean;
    isConfigured: boolean;
    error: string | null;
    formattedMessage: string;
    storeUsername?: string;
  } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const pricing = calculateOrderPricing('single', city);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validate primary phone
    const phoneCheck = validateKurdishPhone(primaryPhone);
    if (!phoneCheck.isValid) {
      setErrorMessage(phoneCheck.error || 'تکایە ژمارەی مۆبایل بە دروستی بنووسە');
      return;
    }

    // Validate optional secondary phone
    if (secondaryPhone) {
      const secCheck = validateKurdishPhone(secondaryPhone);
      if (!secCheck.isValid) {
        setErrorMessage('ژمارەی دووەمی مۆبایل ناتەواوە، تکایە ڕاستی بکەرەوە یان بە بەتاڵی جێی بهێڵە');
        return;
      }
    }

    // Validate weight
    if (!weightKg || Number(weightKg) < 35 || Number(weightKg) > 180) {
      setErrorMessage('تکایە وەزن یان کێش بە دروستی دیاری بکە (لە نێوان ٣٥ تا ١٨٠ کگم)');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      fullName: fullName.trim() || 'کڕیاری بەڕێز',
      city: city === 'شارەکانی تر' && customCity ? customCity.trim() : city,
      customCity: customCity.trim(),
      addressDetails: addressDetails.trim(),
      primaryPhone: phoneCheck.normalized,
      secondaryPhone: secondaryPhone ? secondaryPhone.trim() : '',
      weightKg: Number(weightKg),
      packageType: 'single',
      totalPrice: 15000,
      deliveryFee: 0,
      notes: notes.trim()
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setCompletedOrder(data.order);
        setTelegramInfo(data.telegram);
        if (onOrderSuccess) {
          onOrderSuccess(data.order);
        }
        setIsSubmitting(false);
        return;
      }
    } catch {
      // Fallback for static GitHub Pages / Netlify mode
    }

    // Static fallback: save locally and send to Telegram directly via client
    const fallbackOrder: CustomerOrder = {
      id: 'KB-' + Date.now().toString(36).toUpperCase(),
      createdAt: new Date().toISOString(),
      fullName: payload.fullName,
      primaryPhone: payload.primaryPhone,
      secondaryPhone: payload.secondaryPhone || undefined,
      city: payload.city,
      addressDetails: payload.addressDetails,
      weightKg: payload.weightKg,
      totalPrice: 15000,
      deliveryFee: 0,
      notes: payload.notes || undefined,
      status: 'new'
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('kurda_bazar_orders') || '[]');
      existing.unshift(fallbackOrder);
      localStorage.setItem('kurda_bazar_orders', JSON.stringify(existing));
    } catch {}

    // Send direct to Telegram if configured
    let tgSent = false;
    let tgError: string | undefined;
    try {
      const tgConfig = JSON.parse(localStorage.getItem('kurda_bazar_tg_config') || '{}');
      if (tgConfig.botToken && tgConfig.chatId) {
        const text = `🛍 *داواکاری نوێ لە کوردە بازاڕ*
━━━━━━━━━━━━━━━
👤 *ناو:* ${fallbackOrder.fullName}
📞 *مۆبایل:* \`${fallbackOrder.primaryPhone}\`
${fallbackOrder.secondaryPhone ? `📱 *مۆبایلی دووەم:* \`${fallbackOrder.secondaryPhone}\`\n` : ''}📍 *شار/ناونیشان:* ${fallbackOrder.city} - ${fallbackOrder.addressDetails || 'دیاری نەکراوە'}
⚖️ *کێش:* ${fallbackOrder.weightKg} کگم
📦 *بەرهەم:* قایشی پزیشکی ڕاستکردنەوەی پشت
💰 *کۆی نرخ:* 15,000 دینار (گەیاندن خۆڕایی)
${fallbackOrder.notes ? `📝 *تێبینی:* ${fallbackOrder.notes}\n` : ''}🆔 *کۆد:* \`${fallbackOrder.id}\`
⏰ *کات:* ${new Date().toLocaleDateString('ckb-IQ')} | ${new Date().toLocaleTimeString('en-US')}`;

        const chats = [tgConfig.chatId, tgConfig.secondChatId].filter(Boolean);
        for (const cid of chats) {
          await fetch(`https://api.telegram.org/bot${tgConfig.botToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: cid,
              text,
              parse_mode: 'Markdown'
            })
          });
        }
        tgSent = true;
      }
    } catch (e: any) {
      tgError = e?.message;
    }

    setCompletedOrder(fallbackOrder);
    setTelegramInfo({
      sent: tgSent,
      error: tgError,
      recipientUsername: undefined,
      formattedMessage: `داواکاری نوێ: ${fallbackOrder.fullName} - ${fallbackOrder.primaryPhone}`
    });
    if (onOrderSuccess) {
      onOrderSuccess(fallbackOrder);
    }
    setIsSubmitting(false);
  };

  const handleCopyOrder = () => {
    if (telegramInfo?.formattedMessage) {
      navigator.clipboard.writeText(telegramInfo.formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <section id="order-section" className="py-8 sm:py-12 bg-slate-950 relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success View */}
        {completedOrder ? (
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-center">
            <div className="w-20 h-20 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              دەستت خۆش بێت! داواکارییەکەت تۆمارکرا
            </h3>
            
            <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-lg mx-auto">
              کۆدی داواکاری: <span className="font-mono font-bold text-emerald-400">#{completedOrder.id.slice(0, 8)}</span>
              <br />
              بەم زووانە کارمەندمان لە ڕێگەی ژمارەی <span className="text-white font-mono font-bold">{completedOrder.primaryPhone}</span> پەیوەندیت پێوە دەکات بۆ گەیاندن.
            </p>

            {/* Telegram Notification Status Box */}
            <div className="mt-8 p-5 bg-slate-950/80 rounded-2xl border border-slate-800 text-right">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  دۆخی ناردن بۆ تیلیگرام:
                </span>
                {telegramInfo?.sent ? (
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-semibold rounded-full border border-emerald-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    بە سەرکەوتوویی بۆ تیلیگرام نێردرا!
                  </span>
                ) : telegramInfo?.isConfigured ? (
                  <span className="text-amber-400 text-xs font-medium">
                    نامەکە ئامادەیە (بۆتی تیلیگرام دەستی پێ نەکراوە)
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">
                    تۆمارکرا لە سیستەم
                  </span>
                )}
              </div>

              {/* Order details summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-300 mt-2">
                <div>
                  <span className="text-slate-500 block">شار:</span>
                  <span className="font-semibold text-white">{completedOrder.city}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">وەزن (کێش):</span>
                  <span className="font-semibold text-white">{completedOrder.weightKg} کگم</span>
                </div>
                <div>
                  <span className="text-slate-500 block">ژمارەی سەرەکی:</span>
                  <span className="font-mono text-white">{completedOrder.primaryPhone}</span>
                </div>
                {completedOrder.secondaryPhone && (
                  <div>
                    <span className="text-slate-500 block">ژمارەی دووەم:</span>
                    <span className="font-mono text-white">{completedOrder.secondaryPhone}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-500 block">کۆی پارە:</span>
                  <span className="font-bold text-emerald-400 tabular-nums">
                    ١٥,٠٠٠ دینار (گەیاندنی بەلاش)
                  </span>
                </div>
              </div>

              {/* Direct Telegram Action Buttons */}
              <div className="mt-5 flex flex-wrap gap-3 justify-center pt-3 border-t border-slate-800/80">
                {telegramInfo?.formattedMessage && (
                  <a
                    href={generateDirectTelegramUrl(
                      telegramInfo.formattedMessage, 
                      telegramInfo.storeUsername
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 min-w-[200px] py-3 px-4 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>کردنەوە لە تیلیگرام (ناردنی نامە)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={handleCopyOrder}
                  className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  <span>{copied ? 'کۆپی کرا!' : 'کۆپیکردنی نامەکە'}</span>
                </button>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  setTelegramInfo(null);
                  setFullName('');
                  setPrimaryPhone('');
                  setSecondaryPhone('');
                  setAddressDetails('');
                  setNotes('');
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                تۆمارکردنی داواکارییەکی نوێ
              </button>
            </div>
          </div>
        ) : (
          /* Main Prominent Top Order Form */
          <div className="bg-slate-900/95 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
            
            {/* Top Glowing Header Badge */}
            <div className="text-center max-w-xl mx-auto mb-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm font-bold mb-3 shadow-lg shadow-emerald-500/10">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>کوردە بازاڕ · فۆرمی داواکردنی ڕاستەوخۆ</span>
              </div>
              
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                داواکردنی قایشی پشت ڕاستکردنەوە
              </h2>
            </div>

            {/* BOLD PROMINENT 15,000 IQD + FREE DELIVERY BANNER */}
            <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-2 border-emerald-400 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-right">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">
                    ئۆفەری فەرمی کوردە بازاڕ:
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-black text-white flex items-baseline gap-2">
                  <span>نرخ:</span>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tabular-nums">
                    ١٥,٠٠٠
                  </span>
                  <span className="text-sm text-slate-200">دیناری عێراقی</span>
                  <span className="text-xs sm:text-sm line-through text-slate-500 font-mono">
                    ٢٥,٠٠٠ دینار
                  </span>
                </div>
              </div>

              {/* BOLD FREE DELIVERY BADGE */}
              <div className="px-5 py-3 rounded-xl bg-emerald-500 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2.5 shadow-lg shadow-emerald-500/30 animate-pulse shrink-0">
                <Truck className="w-6 h-6 stroke-[2.5]" />
                <div className="flex flex-col text-right">
                  <span className="text-base sm:text-lg leading-tight font-black">گەیاندن خۆڕاییە (بەلاش)</span>
                  <span className="text-[11px] font-bold opacity-90">بۆ هەموو شار و شارۆچکەکان</span>
                </div>
              </div>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label htmlFor="full-name" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ناوی کڕیار:
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="نموونە: هێمن سالار"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
                  />
                </div>

                {/* City Selection */}
                <div>
                  <label htmlFor="city-select" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ناوی شارەکەت: <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="city-select"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-emerald-500 transition-colors text-sm appearance-none cursor-pointer"
                    >
                      {KURDISH_CITIES.map((c) => (
                        <option key={c} value={c} className="bg-slate-900 text-white">
                          {c}
                        </option>
                      ))}
                    </select>
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Custom City if other */}
                {city.includes('شارەکانی تر') && (
                  <div className="sm:col-span-2">
                    <label htmlFor="custom-city" className="block text-xs font-semibold text-slate-300 mb-1.5">
                      ناوی شار یان قەزاکەت بنووسە:
                    </label>
                    <input
                      id="custom-city"
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="شار یان شارۆچکەکەت بنووسە"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                )}

                {/* Primary Mobile Phone */}
                <div>
                  <label htmlFor="primary-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ژمارەیەکی مووبایل (سەرەکی): <span className="text-emerald-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="primary-phone"
                      type="tel"
                      dir="ltr"
                      required
                      value={primaryPhone}
                      onChange={(e) => setPrimaryPhone(e.target.value)}
                      placeholder="0750XXXXXXX"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm text-left font-mono"
                    />
                    <Phone className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Secondary Mobile Phone */}
                <div>
                  <label htmlFor="secondary-phone" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    ژمارەی دووەمی مووبایلەکەت (ئارەزوومەندانە):
                  </label>
                  <div className="relative">
                    <input
                      id="secondary-phone"
                      type="tel"
                      dir="ltr"
                      value={secondaryPhone}
                      onChange={(e) => setSecondaryPhone(e.target.value)}
                      placeholder="0770XXXXXXX (ئەگەر هەیە)"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm text-left font-mono"
                    />
                    <Phone className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Weight Input */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="weight-input" className="block text-xs font-semibold text-slate-300">
                      وەزن یان کێشی بنووسێت (بە کیلۆگرام): <span className="text-emerald-400">*</span>
                    </label>
                    <span className="text-xs text-emerald-400 font-bold tabular-nums">
                      {weightKg ? `${weightKg} کگم` : ''}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="weight-input"
                      type="number"
                      min="35"
                      max="180"
                      required
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="نموونە: 75"
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm font-mono"
                    />
                    <Scale className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400/90 bg-emerald-950/40 p-2.5 rounded-lg border border-emerald-800/40">
                    <Info className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                    <span>تەنیا کێشت بنووسە، قیاسی گونجاوت بۆ دەپێچرێتەوە بەبێ ئەوەی لێت تێکبچێت.</span>
                  </div>
                </div>

                {/* Specific Address Details */}
                <div className="sm:col-span-2">
                  <label htmlFor="address-details" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    گەڕەک یان ناونیشانی ورد بۆ گەیاندن (ئارەزوومەندانە):
                  </label>
                  <input
                    id="address-details"
                    type="text"
                    value={addressDetails}
                    onChange={(e) => setAddressDetails(e.target.value)}
                    placeholder="نموونە: شەقامی بازنەیی مەلیک مەحموود، نزیک کۆلێژ"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>

              </div>

              {/* Order Pricing Breakdown (15,000 IQD + Free Delivery) */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>نرخی قایش:</span>
                  <span className="font-mono text-slate-200 tabular-nums">١٥,٠٠٠ دینار</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>تێچووی گەیاندن بۆ {city}:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    خۆڕاییە (٠ دینار)
                  </span>
                </div>
                <div className="border-t border-slate-800 pt-2 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">کۆی گشتی (پارەدان دوای گەیشتن):</span>
                  <span className="text-2xl font-black text-emerald-400 font-mono tabular-nums">
                    ١٥,٠٠٠ <span className="text-xs font-normal text-slate-400">دینار</span>
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-base sm:text-lg rounded-2xl shadow-xl shadow-emerald-500/25 transition-all duration-200 cursor-pointer flex items-center justify-center gap-3 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99]"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>تۆمارکردن و ناردن بۆ تیلیگرام...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 fill-slate-950" />
                    <span>لەکۆتایی داواکردن بکات (ناردنی داواکاری)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  گەڕانەوە و گۆڕین تا ٧ ڕۆژ
                </span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-teal-400" />
                  گەیاندنی خۆڕایی و خێرا
                </span>
              </div>

            </form>
          </div>
        )}

      </div>
    </section>
  );
};
