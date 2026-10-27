import React from 'react';
import { ShieldCheck, Truck, Sparkles, Star, ChevronDown, CheckCircle2 } from 'lucide-react';

interface HeroSectionProps {
  onScrollToOrder: () => void;
  onScrollToSimulator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToOrder,
  onScrollToSimulator
}) => {
  return (
    <section className="relative pt-8 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Background radial gradients */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Right Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col text-right">
            
            {/* Kurdish Trust Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-6 self-start shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>فرۆشگای فەرمی کوردە بازاڕ · گەیاندنی خێرا بۆ هەموو کوردستان</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.25] text-balance">
              قایشی پزیشکی <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">ڕاستکردنەوەی پشت</span> و کەمەر
            </h1>

            {/* Sub-headline */}
            <p className="mt-5 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
              کۆتایی بە ئازاری بێزارکەری پشت، چەمانەوەی شان و قەمبووری بهێنە. ئەم قایشە پزیشکییە بە دوو ستیلی نەرمی پۆڵا ستوونی بڕبڕە پشتگیری دەکات و باڵات بە شێوەیەکی سروشتی ڕێک دەخاتەوە.
            </p>

            {/* Key Bullet Benefits */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>کەمکردنەوەی ئازار لە هەفتەی یەکەمدا</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>شیاوی لەبەرکردن لە ژێر جلی کار و دەرەوە</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>قوماشی تایبەتی دژە ئارەقە و هەناسەدەر</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>پارەدان دوای گەیشتن و تاقیکردنەوە</span>
              </div>
            </div>

            {/* Price & Primary Action Strip */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 flex flex-wrap items-center gap-5">
              <div>
                <span className="text-xs text-slate-400 block">نرخی تایبەت لەگەڵ داشکاندن:</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tabular-nums">
                    ١٥,٠٠٠
                  </span>
                  <span className="text-xs text-slate-300">دینار</span>
                  <span className="text-sm line-through text-slate-500 font-mono tabular-nums">
                    ٢٥,٠٠٠ دینار
                  </span>
                </div>
                <div className="mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                  <Truck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>گەیاندن تەواو خۆڕاییە (بەلاش) بۆ هەموو کوردستان</span>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={onScrollToOrder}
                  className="py-3.5 px-6 sm:px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm sm:text-base rounded-2xl shadow-xl shadow-emerald-500/25 transition-all duration-200 cursor-pointer flex items-center gap-2.5 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-5 h-5 fill-slate-950" />
                  <span>فۆرمی داواکردن پڕبکەرەوە</span>
                </button>

                <button
                  onClick={onScrollToSimulator}
                  className="py-3.5 px-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs sm:text-sm rounded-2xl transition-colors cursor-pointer flex items-center gap-2"
                >
                  <span>بەراوردکاری بڕبڕەی پشت ببینە</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Social Proof Star Bar */}
            <div className="mt-6 flex items-center gap-3 text-xs text-slate-400">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <span className="text-slate-300 font-semibold">٤.٩ / ٥</span>
              <span>·</span>
              <span>زیاتر لە ٤,٨٥٠ کڕیاری ڕازی لە پارێزگاکانی کوردستان</span>
            </div>

          </div>

          {/* Left Column: Premium Interactive Product Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md bg-gradient-to-b from-slate-900 to-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
              
              {/* Product Badge */}
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs px-3.5 py-1 rounded-full shadow-md">
                ئۆرجیناڵ و تاقیکراوەتەوە
              </div>

              {/* Vector Product Illustration with Medical Orthopedic Detailing */}
              <div className="relative aspect-[4/3] flex items-center justify-center bg-slate-950 rounded-2xl border border-slate-800/80 p-4 overflow-hidden group">
                
                {/* Visual Orthopedic Belt SVG */}
                <svg viewBox="0 0 360 270" className="w-full h-full drop-shadow-2xl transition-transform duration-500 group-hover:scale-105">
                  <defs>
                    <linearGradient id="beltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="100%" stopColor="#0f172a" />
                    </linearGradient>
                    <linearGradient id="lumbarSteel" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="50%" stopColor="#0284c7" />
                      <stop offset="100%" stopColor="#0369a1" />
                    </linearGradient>
                    <linearGradient id="accentGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#14b8a6" />
                    </linearGradient>
                  </defs>

                  {/* Back Support Main Plate */}
                  <path
                    d="M 120 40 L 240 40 C 255 40 265 52 260 67 L 245 190 C 242 205 230 215 215 215 L 145 215 C 130 215 118 205 115 190 L 100 67 C 95 52 105 40 120 40 Z"
                    fill="url(#beltGrad)"
                    stroke="#334155"
                    strokeWidth="2.5"
                  />

                  {/* Dual Medical Support Steel Stays */}
                  <rect x="155" y="55" width="14" height="145" rx="7" fill="url(#lumbarSteel)" />
                  <rect x="191" y="55" width="14" height="145" rx="7" fill="url(#lumbarSteel)" />

                  {/* Ergonomic Shoulder Straps (Left & Right) */}
                  <path
                    d="M 115 50 C 70 30 40 60 45 110 C 50 150 90 170 120 180"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 115 50 C 70 30 40 60 45 110 C 50 150 90 170 120 180"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                    strokeLinecap="round"
                  />

                  <path
                    d="M 245 50 C 290 30 320 60 315 110 C 310 150 270 170 240 180"
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="22"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 245 50 C 290 30 320 60 315 110 C 310 150 270 170 240 180"
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                    strokeLinecap="round"
                  />

                  {/* Wide Lumbar Waist Belt */}
                  <rect x="50" y="195" width="260" height="50" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                  <rect x="110" y="202" width="140" height="36" rx="6" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                  
                  {/* Brand Embellishment on Waist */}
                  <text x="180" y="225" textAnchor="middle" fill="#10b981" fontSize="12" fontWeight="bold" fontFamily="Vazirmatn, sans-serif">
                    KURDA BAZAR MEDICAL
                  </text>

                  {/* Breathable Honeycomb Mesh Texture Simulation */}
                  <circle cx="140" cy="90" r="2.5" fill="#475569" />
                  <circle cx="150" cy="100" r="2.5" fill="#475569" />
                  <circle cx="210" cy="90" r="2.5" fill="#475569" />
                  <circle cx="220" cy="100" r="2.5" fill="#475569" />
                  <circle cx="140" cy="130" r="2.5" fill="#475569" />
                  <circle cx="220" cy="130" r="2.5" fill="#475569" />
                </svg>

                {/* Floating Feature Tags */}
                <div className="absolute bottom-3 right-3 bg-slate-900/95 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 shadow-lg">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  ٢ ستوونی پزیشکی بەهێز
                </div>

                <div className="absolute top-3 left-3 bg-slate-900/95 border border-slate-800 rounded-lg px-2.5 py-1 text-[11px] text-teal-400 font-bold flex items-center gap-1.5 shadow-lg">
                  <Sparkles className="w-3.5 h-3.5" />
                  گونجاو بۆ هەموو کێش و قەبارەیەک
                </div>
              </div>

              {/* Bottom Feature Ticker */}
              <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[11px] text-slate-300">
                <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-emerald-400 font-bold block text-sm">٨٠٪</span>
                  <span>کەمبوونەوەی ئازار</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-teal-400 font-bold block text-sm">٢١ ڕۆژ</span>
                  <span>ڕێکبوونی باڵا</span>
                </div>
                <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                  <span className="text-sky-400 font-bold block text-sm">١٠٠٪</span>
                  <span>قوماشی هەناسەدەر</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
