'use client';

import { useState } from 'react';
import PingButton from '@/app/components/PingButton';
import SavingsCard from '@/app/components/SavingsCard';
import FloodAlertButton from '@/app/components/FloodAlertButton';

// ── Demo seed state ────────────────────────────────────────────────────────────
// Pre-populated so judges see a real active user, not a blank cold start.
const DEMO_STATE = {
  sessionPings:        3,   // shows badge at 3/5 — mid-journey feel
  pointsEarned:        30,  // 3 rides × 10 pts
  nightOwlProgress:    3,   // Night Owl badge: 3/5
  swiftRiderProgress:  3,   // Swift Rider: 3/10
};
// ─────────────────────────────────────────────────────────────────────────────



export default function Home() {

  // Session counters — start seeded from DEMO_STATE, increment on each ping
  const [sessionPings,  setSessionPings]  = useState(DEMO_STATE.sessionPings);
  const [sessionPoints, setSessionPoints] = useState(DEMO_STATE.pointsEarned);

  const handlePingSuccess = () => {
    setSessionPings((p) => p + 1);
    setSessionPoints((p) => p + 10);
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">

      {/* ── Header ── */}
      <header className="bg-gradient-to-r from-black via-gray-950 to-black border-b-2 border-yellow-400 py-5 px-4 sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-yellow-400 leading-none tracking-tight">SugboPulse</h1>
            <p className="text-gray-400 text-xs mt-0.5">Smart Commuting · Cebu BPO Workers</p>
          </div>
          <a
            href="/driver"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-5 py-2.5 rounded-xl transition-all hover:scale-105 text-sm shadow-[0_0_15px_rgba(255,215,0,0.3)]"
          >
            🗺 Driver View
          </a>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="flex-1 max-w-lg mx-auto w-full px-4 py-6 space-y-5">


        {/* Savings Card */}
        <SavingsCard />



        {/* Main CTA — seeded with demo pings so badge progress is visible */}
        <PingButton
          onPingSuccess={handlePingSuccess}
          demoStartPings={DEMO_STATE.nightOwlProgress}
        />

        {/* Flood Alert */}
        <FloodAlertButton />

        {/* Session Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-900 border border-yellow-400/40 rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Session Pings</p>
            <p className="text-4xl font-black text-yellow-400">{sessionPings}</p>
            <p className="text-gray-500 text-xs mt-1">ride requests</p>
          </div>
          <div className="bg-gray-900 border border-yellow-400/40 rounded-2xl p-4 text-center">
            <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Points Earned</p>
            <p className="text-4xl font-black text-yellow-400">{sessionPoints}</p>
            <p className="text-gray-500 text-xs mt-1">+10 per ride</p>
          </div>
        </div>

        {/* Badge Progress Panel */}
        <div className="bg-gray-900 border border-gray-700 rounded-2xl p-4">
          <h3 className="text-gray-300 text-xs font-bold uppercase tracking-wider mb-3">🏅 Badge Progress</h3>
          <div className="space-y-3">
            {[
              { icon: '🦉', label: 'Night Owl',   current: sessionPings, total: 5  },
              { icon: '⚡', label: 'Swift Rider', current: sessionPings, total: 10 },
            ].map((b) => (
              <div key={b.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{b.icon} {b.label}</span>
                  <span className={b.current >= b.total ? 'text-yellow-400 font-bold' : 'text-gray-500'}>
                    {b.current >= b.total ? '✅ Unlocked!' : `${b.current}/${b.total}`}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((b.current / b.total) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-gray-950 border-t border-gray-800 py-4 px-4">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-gray-500 text-xs">Smart Commuting for Cebu&apos;s Night Shift Workers</p>
          <p className="text-gray-700 text-xs mt-0.5">SugboPulse · Hackathon MVP v0.1</p>
        </div>
      </footer>
    </div>
  );
}
