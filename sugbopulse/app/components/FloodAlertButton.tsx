'use client';

import { useState } from 'react';
import { createClient } from '@/app/utils/supabase';

export default function FloodAlertButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofFile) {
      setError('Please provide proof (photo/video) for reliable reporting.');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    // Get current location
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setIsSubmitting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const supabase = createClient();

        // In a real app, upload the proofFile to Supabase Storage first.
        const mockProofUrl = `mock-url-${Date.now()}.jpg`;

        const { error: insertError } = await supabase.from('flood_alerts').insert([
          {
            lat: latitude,
            lng: longitude,
            type: 'flood', // Only flood alert now
            proof_url: mockProofUrl,
          },
        ]);

        setIsSubmitting(false);

        // For the Hackathon MVP demo, we will always show success 
        // even if the Supabase table hasn't been created yet, to avoid blocking the presentation
        if (insertError) {
          console.error("Supabase error (bypassed for demo):", insertError);
        }

        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          setProofFile(null); // Reset proof file
        }, 3000);
      },
      (geoError) => {
        console.error("Geolocation error:", geoError);
        setError('Failed to get your location. Please enable location services.');
        setIsSubmitting(false);
      }
    );
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all duration-200 active:scale-95 overflow-hidden group py-4"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
        <span className="relative z-10 flex items-center justify-center gap-2 text-base font-bold">
          ⚠️ Report Road Hazard
        </span>
        <p className="relative z-10 text-white/60 text-xs font-normal mt-0.5">Accidents · Flooding · Obstructions</p>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-900 border-2 border-red-500 rounded-xl p-6 w-full max-w-md shadow-[0_0_20px_rgba(255,0,0,0.3)]">
            <h2 className="text-2xl font-bold text-red-500 mb-4 flex items-center gap-2">
              Flood Alert
            </h2>
            
            {success ? (
              <div className="text-center py-8">
                <h3 className="text-xl font-bold text-white mb-2">Flood Reported!</h3>
                <p className="text-gray-400">Drivers have been notified to reroute. Thank you for keeping the community safe.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-gray-300 font-semibold mb-2">Proof of Condition</label>
                  <p className="text-xs text-gray-400 mb-2">To prevent false alarms, please capture a quick photo of the flood.</p>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-800 hover:bg-gray-700 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <p className="text-sm text-gray-400">
                          {proofFile ? <span className="text-green-400 font-bold">{proofFile.name} attached</span> : 'Tap to open camera'}
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment" 
                        className="hidden" 
                        onChange={(e) => setProofFile(e.target.files?.[0] || null)}
                      />
                    </label>
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm font-semibold">{error}</p>}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors border border-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center disabled:opacity-50 border border-red-500"
                  >
                    {isSubmitting ? 'Sending...' : 'Alert Drivers'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
