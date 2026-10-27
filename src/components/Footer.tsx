import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenSettings: () => void;
  onOpenOrders: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSettings,
  onOpenOrders
}) => {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 py-12 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 text-right">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white font-sans">
                کوردە بازاڕ (Kurda Bazar)
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              فرۆشگای تایبەتمەندی کوردە بازاڕ بۆ باشترین جۆری قایشی پزیشکی ڕاستکردنەوەی پشت و کەمەر بە گەرەنتی ڕاستەقینە و گەیاندنی خێرا بۆ هەموو پارێزگاکانی کوردستان.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              بەشە سەرەکییەکان
            </h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#features" className="hover:text-emerald-400 transition-colors">تایبەتمەندییە پزیشکییەکان</a></li>
              <li><a href="#simulator" className="hover:text-emerald-400 transition-colors">بەراوردکاری بڕبڕەی پشت</a></li>
              <li><a href="#order-section" className="hover:text-emerald-400 transition-colors">فۆرمی داواکردن</a></li>
              <li><a href="#faq" className="hover:text-emerald-400 transition-colors">پرسیار و وەڵام</a></li>
            </ul>
          </div>

          {/* Customer Service Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              پەیوەندی و خزمەتگوزاری
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-400">گەیاندنی خێرا بۆ هەموو پارێزگاکان</span>
              </li>
              <li>
                <span className="text-slate-400">گۆڕین و گەڕانەوەی کاڵا</span>
              </li>
              <li>
                <span className="text-slate-500">
                  خزمەتگوزاری بەردەوامە
                </span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p 
            onClick={onOpenOrders}
            className="cursor-pointer hover:text-slate-400 transition-colors select-none"
            title="کوردە بازاڕ"
          >
            © {new Date().getFullYear()} کوردە بازاڕ - هەموو مافەکان پارێزراون.
          </p>
          <p className="flex items-center gap-1">
            <span>دروستکراوە بۆ دڵنیایی و ئاسوودەیی کڕیارانی کوردستان</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
};
