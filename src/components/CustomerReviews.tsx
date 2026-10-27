import React from 'react';
import { Star, CheckCircle, MessageSquareQuote } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  city: string;
  rating: number;
  date: string;
  comment: string;
  verified: boolean;
  sizeBought: string;
}

const REVIEWS: Review[] = [
  {
    id: '1',
    name: 'ئاکۆ فەرەیدوون',
    city: 'سلێمانی - ڕاپەڕین',
    rating: 5,
    date: 'پێش ٣ ڕۆژ',
    comment: 'بە ڕاستی سوپاسی کوردە بازاڕ دەکەم. بەهۆی کاری ئۆفیس و کۆمپیوتەر زۆر پشتم دەئێشا. لە ڕۆژی چوارەمەوە ئازارەکەم زۆر زۆر کەم بۆتەوە و شۆفێری پێوە دەکەم زۆر ئاسوودەیە.',
    verified: true,
    sizeBought: 'سایز XL (کێش ٨٦ کگم)'
  },
  {
    id: '2',
    name: 'سۆران کەریم',
    city: 'هەولێر - بەختیاری',
    rating: 5,
    date: 'پێش هەفتەیەک',
    comment: 'دوو دانەم داواکرد بە ئۆفەرەکە و گەیاندنەکەی بەلاش بوو بۆ هەولێر. دوای یەک ڕۆژ گەیشت. زۆر جیاوازە لەوانەی بازاڕ، ستیلە پزیشکییەکەی پشتی زۆر بەهێزە و ڕێگری لە قەمبووربوون دەکات.',
    verified: true,
    sizeBought: 'سایز L (کێش ٧٤ کگم)'
  },
  {
    id: '3',
    name: 'دەشنێ مەحموود',
    city: 'دهۆک - ماسیکێ',
    rating: 5,
    date: 'پێش ٥ ڕۆژ',
    comment: 'قوماشەکەی نەرمە و لە ژێر عەزیە و جلی کار بە هیچ جۆرێک دەرناکەوێت. پێشتر کێشەم هەبوو لە وەستان لە نەخۆشخانە، بەڵام ئێستا زۆر باڵام ڕێک ڕادەگرێت.',
    verified: true,
    sizeBought: 'سایز M (کێش ٦١ کگم)'
  },
  {
    id: '4',
    name: 'ڕەوەند ساڵح',
    city: 'کەرکووک - ڕەحیماوا',
    rating: 5,
    date: 'پێش ٢ هەفتە',
    comment: 'پێشتر قایشی ترم کڕیبوو قۆڵ و ژێر باڵمی دەبڕی، بەڵام ئەمەی کوردە بازاڕ پشتیوانی سەرشانی ئەستوورە و هیچ بێزارت ناکات. بە دڵنیاییەوە پێشنیاری دەکەم.',
    verified: true,
    sizeBought: 'سایز XXL (کێش ١٠٢ کگم)'
  }
];

export const CustomerReviews: React.FC = () => {
  return (
    <section id="reviews" className="py-20 bg-slate-900/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-xs font-semibold mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>ڕای کڕیارانی بەڕێز</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            کڕیارانی کوردە بازاڕ چی دەڵێن؟
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            سەدان کڕیار لە هەموو شار و شارۆچکەکانی کوردستان ئەزموونی سەرکەوتووی خۆیان لەگەڵ ئێمە هاوبەش کردووە
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between shadow-lg hover:border-slate-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-slate-950 font-black text-sm flex items-center justify-center">
                      {rev.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                        {rev.name}
                        {rev.verified && (
                          <span className="text-[10px] text-emerald-400 font-normal flex items-center gap-0.5">
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            کڕیاری پشتڕاستکراوە
                          </span>
                        )}
                      </h4>
                      <span className="text-xs text-slate-400">{rev.city}</span>
                    </div>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2">
                  "{rev.comment}"
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] text-slate-500">
                <span className="text-emerald-400 font-medium">{rev.sizeBought}</span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
