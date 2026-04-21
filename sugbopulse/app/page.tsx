'use client';

import PingButton from '@/app/components/PingButton';
import SavingsCard from '@/app/components/SavingsCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-black to-gray-900 border-b-2 border-yellow-400 py-6 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">SugboPulse</h1>
            <p className="text-gray-300">Your Smart Ride Home</p>
          </div>
          <a
            href="/driver"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-6 py-3 rounded-lg transition-colors"
          >
            🚗 Driver View
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        {/* Savings Card */}
        <SavingsCard />

        {/* Status Section */}
        <div className="bg-gray-900 border-2 border-yellow-400 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">📍 Your Shift Status</h2>
          <p className="text-gray-300 mb-4">
            Tap the button below to log your shift and notify nearby drivers that you need a ride.
          </p>
          <div className="bg-black/50 rounded p-3 border border-yellow-400">
            <p className="text-sm text-yellow-300">
              💡 <strong>Tip:</strong> Make sure your location is enabled on your device for best results!
            </p>
          </div>
        </div>

        {/* Ping Button - The Main Action */}
        <PingButton />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-gray-900 border border-yellow-400 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-2">Your Pings</p>
            <p className="text-3xl font-bold text-yellow-400">0</p>
          </div>
          <div className="bg-gray-900 border border-yellow-400 rounded-lg p-4 text-center">
            <p className="text-gray-400 text-sm mb-2">Points</p>
            <p className="text-3xl font-bold text-yellow-400">0</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-yellow-400 py-4 px-4 mt-8">
        <div className="max-w-2xl mx-auto text-center text-gray-400 text-sm">
          <p>🌍 Smart Commuting for Cebu's Night Shift Workers</p>
        </div>
      </footer>
    </div>
  );
}
