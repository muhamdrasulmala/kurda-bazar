import React from 'react';
import { Shield, Feather, Wind, Activity, HeartPulse } from 'lucide-react';

export const ProductFeatures: React.FC = () => {
  const features = [
    {
      icon: Shield,
      title: '٢ ستوونی پزیشکی بەهێز لە پشتەوە',
      description: 'دوو ستوونی پۆڵایینی نەرم لە درێژایی بڕبڕەی پشتتدا هەڵکەوتووە، کە ڕێگری لە قەمبووربوون دەکات و بە نەرمی سنگت دەکاتەوە بەبێ دروستکردنی هیچ زەبرێک.',
      color: 'from-emerald-500/20 to-teal-500/5',
      borderColor: 'border-emerald-500/30',
      iconColor: 'text-emerald-400'
    },
    {
      icon: Wind,
      title: 'قوماشی شانەیی هەناسەدەر (Breathable Mesh)',
      description: 'دروستکراوە لە ڕیشاڵی تایبەتی پزیشکی کە هەوا بە ئاسانی پێیدا تێدەپەڕێت، ڕێگری لە ئارەقەکردن، خوران و گەرمبوونی لەش دەکات لە کاتی بەکارهێنانی درێژخایەندا.',
      color: 'from-teal-500/20 to-cyan-500/5',
      borderColor: 'border-teal-500/30',
      iconColor: 'text-teal-400'
    },
    {
      icon: Feather,
      title: 'تەنک و سووک لە ژێر جلی دەرەوە',
      description: 'دیزاین کراوە بە جۆرێک کە لە ژێر کراس، دەشداشە، جلوبەرگی فەرمی یان جلی کوردی بە تەواوی شاراوەیە و کەس هەستی پێناکات کاتێک لە شوێنی کار یان دەرەوەیت.',
      color: 'from-sky-500/20 to-blue-500/5',
      borderColor: 'border-sky-500/30',
      iconColor: 'text-sky-400'
    },
    {
      icon: Activity,
      title: 'ڕاهێنانی یادی ماسولکەکان (Muscle Memory)',
      description: 'تەنیا بە بەکارهێنانی ڕۆژانە بۆ ماوەی ٢ کاتژمێر، ماسولکەکانی شانت خۆیان ڕادەهێنن کە تەنانەت دوای لێکردنەوەی قایشەکەش بە شێوەیەکی سروشتی بە ڕێکی بمێننەوە.',
      color: 'from-cyan-500/20 to-emerald-500/5',
      borderColor: 'border-cyan-500/30',
      iconColor: 'text-cyan-400'
    }
  ];

  return (
    <section id="features" className="py-20 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-xs font-semibold mb-3">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>تایبەتمەندییە پزیشکییەکان</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            بۆچی قایشی کوردە بازاڕ لە هەمووان جیاوازە؟
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            دیزاینێکی ئەندازیاری پزیشکی کە هاوکات لەگەڵ ئاسوودەیی، کاریگەرییەکی خێرا و بەرچاو دروست دەکات
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-gradient-to-b ${feat.color} bg-slate-900/60 border ${feat.borderColor} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-5 shadow-md">
                  <Icon className={`w-6 h-6 ${feat.iconColor}`} />
                </div>
                <h3 className="text-base font-bold text-white mb-2.5 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Daily Usage Guide Strip */}
        <div className="mt-12 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-8">
          <h4 className="text-base font-bold text-white mb-4 text-center sm:text-right">
            خشتەی بەکارهێنانی پێشنیارکراوی پزیشکان:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-bold text-emerald-400 block mb-1">هەفتەی یەکەم (ڕاهێنان):</span>
              <p className="text-slate-300">
                ڕۆژانە تەنیا ٣٠ بۆ ٤٥ خولەک لەبەری بکە تا جەستەت بە ئاسانی ڕابێت.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-bold text-teal-400 block mb-1">هەفتەی دووەم (ڕێکخستنەوە):</span>
              <p className="text-slate-300">
                ڕۆژانە ١ بۆ ٢ کاتژمێر لە کاتی کار، خوێندن، یان شۆفێریدا لەبەری بکە.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <span className="font-bold text-sky-400 block mb-1">هەفتەی سێیەم و چوارەم (جێگیربوون):</span>
              <p className="text-slate-300">
                ڕۆژانە ٢ بۆ ٣ کاتژمێر. دەبینیت تەنانەت بەبێ قایشەکەش پشتت بە ڕێکی دەمێنێتەوە.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
