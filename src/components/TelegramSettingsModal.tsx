import React, { useState, useEffect } from 'react';
import { X, Send, Key, MessageSquare, CheckCircle2, AlertCircle, Info, ExternalLink } from 'lucide-react';

interface TelegramSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const TelegramSettingsModal: React.FC<TelegramSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved
}) => {
  const [botToken, setBotToken] = useState<string>('');
  const [chatId, setChatId] = useState<string>('');
  const [storeUsername, setStoreUsername] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/telegram/config')
        .then(r => r.json())
        .then(data => {
          if (data.rawChatId) setChatId(data.rawChatId);
          if (data.storeUsername) setStoreUsername(data.storeUsername);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/telegram/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: botToken.trim(),
          chatId: chatId.trim(),
          storeUsername: storeUsername.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'هەڵەیەک ڕوویدا لە پاشەکەوتکردن');
      }

      setStatusMessage({
        type: 'success',
        text: 'ڕێکخستنەکان بە سەرکەوتوویی پاشەکەوت کران!'
      });
      onConfigSaved();
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'پەیوەندی بە سێرڤەر سەرکەوتوو نەبوو'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestMessage = async () => {
    setIsTesting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/telegram/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          botToken: botToken.trim(),
          chatId: chatId.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'نەتوانرا نامەکە بنێردرێت');
      }

      setStatusMessage({
        type: 'success',
        text: 'نامەی تاقیکردنەوە بە سەرکەوتوویی گەیشتە تیلیگرامەکەت!'
      });
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err.message || 'هەڵە لە ناردنی نامەی تاقیکردنەوە'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="داخستن"
          className="absolute top-5 left-5 p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-right mb-6">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
            <Send className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            ڕێکخستنی تیلیگرام بۆ خاوەن دووکان
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            لێرە بۆتی تیلیگرامەکەت پەیوەست بکە تاوەکو کڕیار داواکاری کرد، ڕاستەوخۆ نامەت بۆ بێت.
          </p>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`mb-5 p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-200'
                : 'bg-rose-950/50 border border-rose-800 text-rose-200'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4 text-right">
          
          {/* Bot Token */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>تووکنی بۆت (Bot Token):</span>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-normal"
              >
                <span>وەرگرتن لە @BotFather</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                required
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                placeholder="123456789:ABCdefGhIJKlmNoPQRs..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs font-mono"
              />
              <Key className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Chat ID */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center justify-between">
              <span>ئایدی چاتی تیلیگرام (Chat ID):</span>
              <a
                href="https://t.me/userinfobot"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-sky-400 hover:underline flex items-center gap-1 font-normal"
              >
                <span>زانینی ئایدی لە @userinfobot</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <div className="relative">
              <input
                type="text"
                dir="ltr"
                required
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                placeholder="نموونە: 987654321"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs font-mono"
              />
              <MessageSquare className="w-4 h-4 text-slate-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Store Owner Username for Direct Link */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              یوزەرنەیمی تیلیگرامت (بۆ پەیوەندی ڕاستەوخۆ):
            </label>
            <input
              type="text"
              dir="ltr"
              value={storeUsername}
              onChange={(e) => setStoreUsername(e.target.value)}
              placeholder="e.g. kurda_bazar"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-sky-500 text-xs font-mono"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex flex-wrap gap-2.5">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              {isLoading ? 'پاشەکەوت دەکرێت...' : 'پاشەکەوتکردنی ڕێکخستن'}
            </button>

            <button
              type="button"
              disabled={isTesting || !botToken || !chatId}
              onClick={handleTestMessage}
              className="py-3 px-4 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer disabled:opacity-40"
            >
              {isTesting ? 'دەپشکنرێت...' : 'تاقیکردنەوەی ناردنی نامە'}
            </button>
          </div>
        </form>

        {/* Quick Help Guide in Kurdish */}
        <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-right">
          <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-2">
            <Info className="w-3.5 h-3.5 text-sky-400" />
            ڕێنمایی دروستکردنی بۆتی تیلیگرام بە ١ خولەک:
          </h5>
          <ol className="text-[11px] text-slate-400 space-y-1.5 list-decimal list-inside pr-1">
            <li>لە ناو تیلیگرام سێرچی <span className="text-sky-300 font-mono">@BotFather</span> بکە.</li>
            <li>بنوسە <span className="text-sky-300 font-mono">/newbot</span> و ناوێک بۆ بۆتەکەت دابنێ.</li>
            <li>کۆدی <span className="text-sky-300 font-mono">Token</span> کە پێتدەدات کۆپی بکە و لێرە دایبنێ.</li>
            <li>بچۆ بۆ لای بۆتە نوێیەکەت و کلیک لە <span className="text-sky-300 font-mono">/start</span> بکە.</li>
            <li>بۆ زانینی Chat ID بچۆ بۆ <span className="text-sky-300 font-mono">@userinfobot</span>.</li>
          </ol>
        </div>

      </div>
    </div>
  );
};
