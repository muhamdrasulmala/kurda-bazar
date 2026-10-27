import React from 'react';
import { ShieldCheck, Sparkles, Lock } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
  onOpenOrders: () => void;
  onScrollToOrder: () => void;
  ordersCount?: number;
  isTelegramConnected?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSettings,
  onOpenOrders,
  onScrollToOrder,
  ordersCount = 0,
  isTelegramConnected = false
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Clicking the shield is also a secret admin trigger) */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenOrders}
              title="کوردە بازاڕ"
              aria-label="لۆگۆی کوردە بازاڕ"
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
            >
              <ShieldCheck className="w-6 h-6 text-white stroke-[2.2]" />
            </button>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
                کوردە بازاڕ
              </span>
              <span className="text-[11px] text-emerald-400 font-medium tracking-wide">
                قایشی پزیشکی ڕەسەن
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
          <a href="#features" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
            تایبەتمەندییەکان
          </a>
          <a href="#simulator" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
            پێش و پاش بەکارهێنان
          </a>
          <a href="#reviews" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
            ڕای کڕیاران
          </a>
          <a href="#faq" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
            پرسیارە باوەکان
          </a>
        </nav>

        {/* Zone 3: Quick Action & Secret Admin Emblem */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Secret discreet emblem: looks like a small luxury brand star to customers, but clicking it opens Admin */}
          <button
            onClick={onOpenOrders}
            title="کوردە بازاڕ"
            aria-label="هێمای نهێنی بەڕێوەبەر"
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-500 hover:text-emerald-400 flex items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100"
          >
            <span className="text-xs">✦</span>
          </button>

          {/* Primary Customer CTA: Scrolls directly to top order form */}
          <button
            onClick={onScrollToOrder}
            className="px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-200 cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4 fill-slate-950" />
            <span>داواکردن بە ١٥ هەزار</span>
          </button>
        </div>
      </div>
    </header>
  );
};
