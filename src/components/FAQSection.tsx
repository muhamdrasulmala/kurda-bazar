import React, { useState } from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'چەند کاتژمێر لە ڕۆژێکدا پێویستە قایشەکە لەبەر بکرێت؟',
    a: 'لە چەند ڕۆژی یەکەمدا بە ٣٠ بۆ ٤٥ خولەک دەست پێبکە تا ماسولکەکانت ڕادێن. پاشان ڕۆژانە ٢ بۆ ٣ کاتژمێر لە کاتی کار، دانیشتن لەسەر کۆمپیوتەر یان شۆفێریدا لەبەری بکە. پێویست ناکات لە کاتی خەودا لەبەر بکرێت.'
  },
  {
    q: 'ئایا لە ژێر جلوبەرگ دەردەکەوێت؟',
    a: 'نەخێر بە هیچ شێوەیەک. قایشی کوردە بازاڕ بە دیزاینی Slim Fit دروستکراوە بە قوماشی تەنک و نەرم، دەتوانیت لەژێر فانیلە، کراس یان جلی کوردی لەبەری بکەیت بەبێ ئەوەی کەس هەستی پێبکات.'
  },
  {
    q: 'چۆن دڵنیابم لە سایزە گونجاوەکەم؟',
    a: 'تەنیا کێش (وەزن)ـت لە فۆرمەکەی سەرەوە دیاری بکە، سیستەمەکەمان بە شێوەیەکی زیرەک سایزی دروستت بۆ هەڵدەبژێرێت. هەروەها قایشەکە لە کەمەر و شانەوە کۆنترۆڵی کشانی هەیە و بە ئاسانی تەسک و فراوان دەکرێت.'
  },
  {
    q: 'گەیاندن چەند کاتی پێدەچێت و پارەدان چۆنە؟',
    a: 'گەیاندن بۆ هەولێر و سلێمانی و دهۆک لە ماوەی ٢٤ کاتژمێر و بۆ قەزا و شارۆچکەکانی تر لە ماوەی ٢٤ بۆ ٤٨ کاتژمێر دەگات. پارەدان لە کاتی وەرگرتنی کاڵاکەیە لە دوای پشکنینی پاکێجەکە.'
  },
  {
    q: 'ئایا گۆڕین یان گەڕانەوە هەیە ئەگەر سایزەکە نەگونجا؟',
    a: 'بەڵێ، ئێمە گەرەنتی تەواوی گۆڕینی سایز دەکەین. ئەگەر بە هەر هۆکارێک سایزەکە لە قەبارەت نەبوو، کارمەندی گەیاندنمان سایزێکی ترت بۆ دەگۆڕێتەوە بەبێ کێشە.'
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-slate-950 relative border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-xs font-semibold mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>پرسیارە دووبارەبووەکان</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            پرسیار و وەڵامە باوەکان
          </h2>
          <p className="mt-2 text-slate-400 text-xs sm:text-sm">
            هەموو ئەو زانیارییانەی پێویستە بیزانیت پێش داواکردنی قایشەکەت
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-right font-bold text-sm sm:text-base text-white flex items-center justify-between gap-4 cursor-pointer hover:text-emerald-400 transition-colors"
                  aria-expanded={isOpen}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-emerald-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
