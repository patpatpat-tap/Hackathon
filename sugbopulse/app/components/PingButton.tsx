'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase';

const DESTINATIONS = [
  { label: 'IT Park',       icon: '🏢' },
  { label: 'Ayala Center',  icon: '🏬' },
  { label: 'SM City Cebu',  icon: '🛒' },
  { label: 'Colon Street',  icon: '🛣️' },
  { label: 'Fuente Osmeña', icon: '⛲' },
];

export default function PingButton({
  onPingSuccess,
  demoStartPings = 3,
}: {
  onPingSuccess?: () => void;
  demoStartPings?: number;
}) {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Demand Aggregation Flow States
  const [demandState, setDemandState] = useState<'idle' | 'logging_out' | 'ready'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destination, setDestination] = useState('Ayala Center');

  // Badge progress (only used to increment on success, display handled by page.tsx)
  const [sessionPings, setSessionPings] = useState(demoStartPings);

  // Nearby drivers indicator (mocked)
  const [nearbyCount, setNearbyCount] = useState(0);
  useEffect(() => { setNearbyCount(12); }, []);

  // Geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleRegisterDemand = async () => {
    setLoading(true);

    // Fire-and-forget Supabase insert (fails gracefully for demo)
    try {
      const supabase = createClient();
      const tempUsername = `user_${Date.now()}`;
      const { data: profile } = await supabase
        .from('profiles')
        .insert([{ username: tempUsername, role: 'commuter', points: 0, badges: [] }])
        .select('id').single();
      await supabase.from('pings').insert([{
        user_id: profile?.id ?? '00000000-0000-0000-0000-000000000000',
        lat: location?.lat ?? 10.3157,
        lng: location?.lng ?? 123.8854,
        route_destination: destination,
      }]);
    } catch { /* demo: always continue */ }

    setLoading(false);
    setIsModalOpen(false);
    setDemandState('logging_out');
    
    // Increment stats
    setSessionPings((p) => p + 1);
    onPingSuccess?.();
  };

  const handleImReady = () => {
    setDemandState('ready');
  };

  const handleCancel = () => {
    setDemandState('idle');
  };

  const isSM = destination === 'SM City Cebu';
  const tradFare = isSM ? 15 : 13;
  const modFare = isSM ? 17 : 15;

  return (
    <div className="flex flex-col items-center gap-4">

      {/* Nearby indicator */}
      {nearbyCount > 0 && demandState === 'idle' && (
        <div className="w-full flex items-center justify-center gap-2 py-1.5 bg-green-400/5 border border-green-400/20 rounded-xl">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-green-400 text-sm font-semibold">
            {nearbyCount} jeepneys active near your area
          </span>
        </div>
      )}

      {/* ── State 1: Idle (Logging Out Soon) ── */}
      {demandState === 'idle' && (
        <button
          onClick={handleOpenModal}
          className="relative w-full bg-[#ffd700] hover:bg-yellow-500 text-black font-black text-2xl rounded-2xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(255,215,0,0.45)] overflow-hidden group py-5"
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
          <span className="relative z-10 flex items-center justify-center gap-3">
            <span className="text-2xl">⏱️</span>
            Logging Out Soon
          </span>
          <p className="relative z-10 text-black/60 text-xs font-bold mt-1">Select destination · Inform jeepneys</p>
        </button>
      )}

      {/* ── State 2: Logging Out (Demand Registered) ── */}
      {demandState === 'logging_out' && (
        <div className="w-full space-y-4">
          <div className="bg-gray-900 border-2 border-yellow-400 rounded-2xl p-5 shadow-[0_0_20px_rgba(255,215,0,0.15)]">
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-800">
              <div className="w-12 h-12 rounded-full bg-yellow-400/20 flex items-center justify-center text-2xl">
                📍
              </div>
              <div>
                <p className="text-yellow-400 font-black text-base">Destination Confirmed</p>
                <p className="text-gray-400 text-sm">Your Location → {destination}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-black/40 rounded-xl p-3 border border-gray-800">
                <p className="text-gray-400 text-xs mb-1">Co-Passengers</p>
                <p className="text-white font-bold text-lg">14 Waiting</p>
              </div>
              <div className="bg-black/40 rounded-xl p-3 border border-gray-800">
                <p className="text-gray-400 text-xs mb-1">Jeepneys Notified</p>
                <p className="text-green-400 font-bold text-lg">3 Responding</p>
              </div>
            </div>

            <button
              onClick={handleImReady}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xl rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.4)] overflow-hidden group py-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                📍 I&apos;m at the Terminal
              </span>
            </button>
          </div>
          
          <button onClick={handleCancel} className="text-gray-500 text-xs font-bold uppercase tracking-wider w-full text-center hover:text-white transition-colors">
            Cancel Route
          </button>
        </div>
      )}

      {/* ── State 3: Ready at Terminal (Confirmation) ── */}
      {demandState === 'ready' && (
        <div className="w-full space-y-4">
          <div className="bg-green-900/20 border-2 border-green-500 rounded-2xl p-6 shadow-[0_0_30px_rgba(34,197,94,0.2)] text-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 border-2 border-green-400 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl animate-bounce">🚐</span>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">You're at the terminal</h2>
            <p className="text-gray-300 text-sm mb-5">
              A jeepney for <span className="font-bold text-yellow-400">{destination}</span> is arriving shortly.
            </p>
            
            <div className="bg-black/50 border border-green-500/30 rounded-xl px-4 py-4 mb-2">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Estimated Arrival</p>
              <p className="text-3xl font-black text-green-400">10 mins</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Destination Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0b0f19] border-2 border-yellow-400 rounded-2xl p-6 w-full max-w-md shadow-[0_0_40px_rgba(255,215,0,0.2)]">
            
            <h2 className="text-2xl font-black text-yellow-400 mb-1">Select Destination</h2>
            <p className="text-gray-400 text-xs mb-5">Where are you heading after your shift?</p>

            <div className="bg-gray-800/80 border border-gray-700 rounded-xl p-4 mb-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold text-sm">Traditional Jeepney</span>
                <span className="text-white font-black text-base">
                  ₱{tradFare} {isSM && <span className="text-yellow-400 text-xs ml-1 font-bold">+₱2 route</span>}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold text-sm">Modern Jeepney</span>
                <span className="text-white font-black text-base">
                  ₱{modFare} {isSM && <span className="text-yellow-400 text-xs ml-1 font-bold">+₱2 route</span>}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">Destination</label>
                <div className="grid grid-cols-1 gap-2">
                  {DESTINATIONS.map((d) => (
                    <button
                      key={d.label}
                      onClick={() => setDestination(d.label)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-sm font-semibold transition-all ${
                        destination === d.label
                          ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                          : 'border-gray-700 bg-gray-800 text-white hover:border-gray-500'
                      }`}
                    >
                      <span className="text-lg">{d.icon}</span>
                      {d.label}
                      {destination === d.label && <span className="ml-auto text-yellow-400">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-colors border border-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleRegisterDemand}
                disabled={loading}
                className="flex-[2] bg-yellow-400 hover:bg-yellow-500 text-black font-black py-3 rounded-xl transition-all shadow-lg hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                {loading ? 'Confirming…' : 'Confirm Route →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
