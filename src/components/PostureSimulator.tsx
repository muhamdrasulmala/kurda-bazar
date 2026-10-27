import React, { useState } from 'react';
import { Check, X, MoveHorizontal, Sparkles } from 'lucide-react';

/**
 * ئەنیمەیشنی کارلێکەری بەراوردکاری پێش و پاش بەکارهێنانی قایشی پشت
 * ڕێگە بە موشتەری دەدات بە ڕوونی جیاوازی بڕبڕەی پشت و شانی چەماوە ببینێت
 */
export const PostureSimulator: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 (before) to 100 (after)

  const isMoreCorrected = sliderPos > 50;

  return (
    <section id="simulator" className="py-20 bg-slate-900/60 border-y border-slate-800/80 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>بەراوردکاری ڕاستەوخۆ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            جیاوازییەکە بە چاوی خۆت ببینە
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            کۆنترۆڵی خوارەوە بجووڵێنە بۆ بینینی گۆڕانکاری لەسەر بڕبڕەی پشت و ڕێکبوونی شانەکان پێش و دوای بەستنی قایشی کوردە بازاڕ
          </p>
        </div>

        {/* Interactive Comparison Card */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual SVG Spine Simulator */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center bg-slate-900/80 rounded-xl p-6 border border-slate-800/60 relative select-none min-h-[380px]">
              
              {/* Dynamic Spine Vector Graphic */}
              <div className="w-full max-w-sm flex items-center justify-center relative">
                <svg viewBox="0 0 300 400" className="w-full h-80 transition-all duration-300 drop-shadow-lg">
                  {/* Grid Lines for posture measurement */}
                  <line x1="20" y1="50" x2="280" y2="50" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="20" y1="120" x2="280" y2="120" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="20" y1="200" x2="280" y2="200" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />
                  <line x1="20" y1="320" x2="280" y2="320" stroke="#334155" strokeDasharray="3 3" strokeWidth="1" />

                  {/* Vertical Reference Axis */}
                  <line x1="150" y1="30" x2="150" y2="380" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4" />

                  {/* Head & Neck: leans forward when slouched, upright when straight */}
                  {(() => {
                    const slouchFactor = (100 - sliderPos) / 100;
                    const headX = 150 + slouchFactor * 35;
                    const neckControlX = 150 + slouchFactor * 45;
                    const midBackX = 150 - slouchFactor * 30;
                    const lumbarX = 150 + slouchFactor * 15;

                    return (
                      <g>
                        {/* Head */}
                        <circle
                          cx={headX}
                          cy="60"
                          r="32"
                          fill="#0f172a"
                          stroke={isMoreCorrected ? '#10b981' : '#f43f5e'}
                          strokeWidth="2.5"
                          className="transition-all duration-200"
                        />
                        {/* Eye vector to indicate forward line of sight */}
                        <circle cx={headX + 16} cy="56" r="3.5" fill={isMoreCorrected ? '#10b981' : '#f43f5e'} />

                        {/* Spine Curvature Path */}
                        <path
                          d={`M ${headX} 92 Q ${neckControlX} 140, ${midBackX} 190 T ${lumbarX} 290 L 150 360`}
                          fill="none"
                          stroke={isMoreCorrected ? '#10b981' : '#f43f5e'}
                          strokeWidth="7"
                          strokeLinecap="round"
                          className="transition-all duration-200"
                        />

                        {/* Vertebrae Joint Highlights */}
                        <circle cx={headX - 2} cy="110" r="4.5" fill="#ffffff" />
                        <circle cx={headX + (slouchFactor * 10)} cy="140" r="4.5" fill="#ffffff" />
                        <circle cx={midBackX + 5} cy="190" r="5" fill={isMoreCorrected ? '#10b981' : '#f43f5e'} />
                        <circle cx={midBackX + 8} cy="235" r="4.5" fill="#ffffff" />
                        <circle cx={lumbarX} cy="285" r="4.5" fill="#ffffff" />
                        <circle cx="150" cy="335" r="4.5" fill="#ffffff" />

                        {/* Posture Corrector Straps overlay (shows when corrected) */}
                        {sliderPos > 25 && (
                          <g opacity={Math.min(1, (sliderPos - 20) / 40)}>
                            <path
                              d={`M ${headX - 15} 125 L ${midBackX - 10} 210 L ${lumbarX - 8} 280`}
                              stroke="#06b6d4"
                              strokeWidth="5"
                              strokeDasharray="6 3"
                              fill="none"
                            />
                            <path
                              d={`M ${headX + 15} 125 L ${midBackX + 12} 210 L ${lumbarX + 10} 280`}
                              stroke="#06b6d4"
                              strokeWidth="5"
                              strokeDasharray="6 3"
                              fill="none"
                            />
                            {/* Lumbar Support Pad */}
                            <rect
                              x={midBackX - 16}
                              y="190"
                              width="32"
                              height="50"
                              rx="6"
                              fill="#0284c7"
                              opacity="0.75"
                            />
                          </g>
                        )}
                      </g>
                    );
                  })()}
                </svg>

                {/* Floating Angle Indicator */}
                <div className="absolute top-2 right-2 bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-1.5 text-right">
                  <span className="text-[11px] text-slate-400 block">گۆشەی چەمانەوەی مل</span>
                  <span className={`text-base font-bold tabular-nums ${isMoreCorrected ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Math.round(35 - (sliderPos / 100) * 35)}° پلە
                  </span>
                </div>

                <div className="absolute bottom-2 left-2 bg-slate-950/90 border border-slate-800 rounded-lg px-3 py-1.5 text-left">
                  <span className="text-[11px] text-slate-400 block">پەستانی سەر بڕبڕە</span>
                  <span className={`text-base font-bold tabular-nums ${isMoreCorrected ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {Math.round(27 - (sliderPos / 100) * 22)} کگم
                  </span>
                </div>
              </div>

              {/* Slider Control */}
              <div className="w-full max-w-md mt-6">
                <div className="flex items-center justify-between text-xs font-semibold mb-2">
                  <button
                    onClick={() => setSliderPos(0)}
                    className={`cursor-pointer px-3 py-1 rounded-md transition-colors ${
                      sliderPos <= 30 ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    پێش بەکارهێنان (چەماوە)
                  </button>
                  <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                    <MoveHorizontal className="w-3.5 h-3.5" />
                    دەست لە هێڵەکە بدە و بیجووڵێنە
                  </span>
                  <button
                    onClick={() => setSliderPos(100)}
                    className={`cursor-pointer px-3 py-1 rounded-md transition-colors ${
                      sliderPos >= 70 ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/60' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    لەگەڵ قایشی کوردە بازاڕ
                  </button>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-emerald-500"
                  aria-label="کۆنترۆڵی بەراوردکاری شێوازی وەستان"
                />
              </div>
            </div>

            {/* Explanation & Clinical Benefits */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border transition-colors ${
                  isMoreCorrected 
                    ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-100' 
                    : 'bg-rose-950/20 border-rose-900/40 text-rose-100'
                }`}>
                  <div className="flex items-center gap-2 font-bold text-sm mb-1.5">
                    {isMoreCorrected ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">دۆخی ڕێک بە قایشی کوردە بازاڕ:</span>
                      </>
                    ) : (
                      <>
                        <X className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-400">دۆخی چەماوە و قەمبوور (پێشتر):</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {isMoreCorrected
                      ? 'بڕبڕەی پشت بە ڕێکی دەمێنێتەوە، سنگ دەکرێتەوە، پەستانی سەر مل و کەمەر بۆ کەمترین ئاست دادەبەزێت و باڵات بە شێوەیەکی سروشتی بەرزتر دەردەکەوێت.'
                      : 'چەمانەوەی بەردەوام دەبێتە هۆی دیسکی پشت، ئازاری بێزارکەری مل و سەرئێشە بەهۆی کەمبوونەوەی ئۆکسجین و پەستانی زیاد لەسەر دەمارەکان.'}
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-emerald-400">١</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">ڕاهێنانی یادی ماسولکە (Muscle Memory)</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        تەنیا ڕۆژانە ٢ بۆ ٣ کاتژمێر بەکاری بهێنە، جەستەت خۆی فێری وەستانی ڕاست دەبێت.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-emerald-400">٢</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">نەهێشتنی ئازاری شۆفێری و مۆبایل</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        گونجاوترین چارەسەرە بۆ ئەو کەسانەی کاتی زۆر لەسەر کورسی دادەنیشن یان شۆفێری دەکەن.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60">
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-emerald-400">٣</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">ئاسان لەبەرکردن لە ژێر جلی ڕۆژانە</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        قوماشەکەی تەنک و نەرمە و لە ژێر کراس یان فانیلە بە هیچ جۆرێک دەرناکەوێت.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
