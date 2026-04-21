'use client';

import { useEffect, useState } from 'react';

function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return value;
}

export default function SavingsCard() {
  const trikePrice = 80;
  const jeepFare = 13;
  const dailySavings = trikePrice - jeepFare;   // ₱67
  const weeklyGoal = dailySavings * 7;           // ₱469 (full 7-day potential)
  const weeklySavings = dailySavings * 5;        // ₱335 (5 rides this week so far)
  const monthlySavings = dailySavings * 22;      // ₱1,474

  const animatedDaily = useCountUp(dailySavings, 800);
  const animatedWeekly = useCountUp(weeklySavings, 1100);

  // Honest progress: ₱335 of ₱469 weekly goal = ~71%
  const weekProgressPct = Math.round((weeklySavings / weeklyGoal) * 100); // 71

  return (
    <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-400 to-amber-500 text-black rounded-2xl p-6 mb-6 overflow-hidden shadow-[0_4px_24px_rgba(255,215,0,0.35)]">
      {/* Background shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-extrabold tracking-widest uppercase">💰 Savings Check</h2>
          <span className="bg-black/15 text-black text-xs font-bold px-3 py-1 rounded-full">vs. Special Trike</span>
        </div>

        {/* Fare comparison */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-black/70">Special Trike Cost</span>
            {/* Strikethrough reinforces "you avoided this" visually */}
            <span className="line-through text-black/40 font-bold">₱{trikePrice}</span>
          </div>
          <div className="flex justify-between text-sm font-medium">
            <span className="text-black/70">Standard Jeep Fare</span>
            <span className="font-bold text-green-800">₱{jeepFare}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t-2 border-black/20 mb-4" />

        {/* Main savings display */}
        <div className="flex items-end justify-between mb-1">
          <div>
            <p className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-0.5">You Save Today</p>
            <p className="text-5xl font-black tracking-tight leading-none">₱{animatedDaily}</p>
            {/* The product claim — causality, not just math */}
            <p className="text-xs text-black/55 mt-1.5 leading-snug max-w-[180px]">
              made possible by knowing<br />your jeepney was coming
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold text-black/60 uppercase tracking-wider mb-0.5">This Week</p>
            <p className="text-2xl font-black">₱{animatedWeekly}</p>
          </div>
        </div>

        {/* Weekly progress bar — honest math: ₱335 of ₱469 goal */}
        <div className="mt-5 mb-3">
          <div className="flex justify-between text-xs font-semibold text-black/60 mb-1.5">
            <span>Weekly Savings</span>
            <span>₱{weeklySavings} / ₱{weeklyGoal} goal</span>
          </div>
          <div className="w-full h-2.5 bg-black/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-black/60 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${weekProgressPct}%` }}
            />
          </div>
          <p className="text-xs text-black/50 mt-1">{weekProgressPct}% of weekly goal reached</p>
        </div>

        {/* Fun fact — grammar fixed: "kilo" not "kilos" for 1 */}
        <div className="mt-3 py-2.5 px-4 bg-black/10 rounded-xl">
          <p className="text-sm font-bold text-center">
            🍚 That&apos;s{' '}
            <span className="text-green-800 font-black">
              {weeklySavings >= 200
                ? `${Math.floor(weeklySavings / 200)} kilo${Math.floor(weeklySavings / 200) === 1 ? '' : 's'} of rice`
                : 'almost a kilo of rice'}
            </span>{' '}
            for your family this week!
          </p>
          <p className="text-xs text-center text-black/60 mt-0.5">
            Monthly potential: <span className="font-black">₱{monthlySavings.toLocaleString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
