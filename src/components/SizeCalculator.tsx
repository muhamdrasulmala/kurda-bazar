import React, { useState } from 'react';
import { calculateRecommendedSize, getSizeDetailsKurdish } from '../utils/sizing';
import { SizeType } from '../types/order';
import { Scale, Ruler, Sparkles, ArrowDown } from 'lucide-react';

interface SizeCalculatorProps {
  initialWeight?: number;
  initialHeight?: number;
  onApplySize: (size: SizeType, weight: number, height: number) => void;
}

const AVAILABLE_SIZES: SizeType[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const SizeCalculator: React.FC<SizeCalculatorProps> = ({
  initialWeight = 75,
  initialHeight = 175,
  onApplySize
}) => {
  const [weight, setWeight] = useState<number>(initialWeight);
  const [height, setHeight] = useState<number>(initialHeight);

  const recommendedSize = calculateRecommendedSize(weight, height);
  const sizeInfo = getSizeDetailsKurdish(recommendedSize);

  return (
    <section id="sizing" className="py-20 bg-slate-950 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-700/40 text-emerald-400 text-xs font-semibold mb-3">
            <Scale className="w-3.5 h-3.5" />
            <span>ژمێرەری زیرەکی قەبارە</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            کێش و باڵات دیاریبکە بۆ زانینی سایزی گونجاو
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base">
            سیستەمەکەمان بەپێی کێش و درێژی لەشت، گونجاوترین سایزی قایشەکەت بۆ هەڵدەبژێرێت تا زۆرترین ئاسوودەیی پێببەخشێت
          </p>
        </div>

        {/* Main Interactive Box */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            
            {/* Sliders Input Column */}
            <div className="space-y-7">
              {/* Weight Slider */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="weight-range" className="flex items-center gap-2 text-sm font-bold text-white">
                    <Scale className="w-4 h-4 text-emerald-400" />
                    <span>کێش یان وەزن (کیلۆگرام):</span>
                  </label>
                  <span className="text-2xl font-black text-emerald-400 tabular-nums">
                    {weight} <span className="text-xs text-slate-400 font-normal">کگم</span>
                  </span>
                </div>
                <input
                  id="weight-range"
                  type="range"
                  min="40"
                  max="130"
                  step="1"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono tabular-nums">
                  <span>٤٠ کگم</span>
                  <span>٨٥ کگم</span>
                  <span>١٣٠ کگم</span>
                </div>
              </div>

              {/* Height Slider */}
              <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between mb-3">
                  <label htmlFor="height-range" className="flex items-center gap-2 text-sm font-bold text-white">
                    <Ruler className="w-4 h-4 text-teal-400" />
                    <span>باڵا (سانتیمەتر):</span>
                  </label>
                  <span className="text-2xl font-black text-teal-400 tabular-nums">
                    {height} <span className="text-xs text-slate-400 font-normal">سم</span>
                  </span>
                </div>
                <input
                  id="height-range"
                  type="range"
                  min="145"
                  max="205"
                  step="1"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono tabular-nums">
                  <span>١٤٥ سم</span>
                  <span>١٧٥ سم</span>
                  <span>٢٠٥ سم</span>
                </div>
              </div>
            </div>

            {/* Calculated Recommendation Column */}
            <div className="flex flex-col items-center text-center bg-gradient-to-b from-slate-950/90 to-slate-900/90 p-7 rounded-xl border border-emerald-500/30 relative">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-2">
                سایزی پێشنیارکراو بۆتۆ
              </span>

              {/* Big Size Display */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-xl shadow-emerald-500/20 mb-4 transform hover:scale-105 transition-transform">
                <span className="text-4xl font-black text-slate-950 tracking-wider">
                  {recommendedSize}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">
                {sizeInfo.label}
              </h3>

              <div className="mt-3 space-y-1 text-xs text-slate-300">
                <p>
                  <strong className="text-slate-400">مەودای کێش:</strong> {sizeInfo.weightRange}
                </p>
                <p>
                  <strong className="text-slate-400">دەوری کەمەر:</strong> {sizeInfo.waistRange}
                </p>
              </div>

              <p className="mt-3 text-xs text-slate-400 max-w-xs leading-relaxed">
                {sizeInfo.description}
              </p>

              {/* Size Buttons Overview */}
              <div className="flex items-center gap-2 mt-5">
                {AVAILABLE_SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => onApplySize(sz, weight, height)}
                    className={`w-9 h-9 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                      sz === recommendedSize
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-400'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {/* Direct Apply Button */}
              <button
                onClick={() => onApplySize(recommendedSize, weight, height)}
                className="mt-6 w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <span>ئەم سایزەم بۆ دیاری بکە و داواکاری بکە</span>
                <ArrowDown className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
