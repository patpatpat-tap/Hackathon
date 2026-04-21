'use client';

import { useState } from 'react';
import { createClient } from '@/app/utils/supabase';

export default function PingButton() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePing = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Get user's geolocation
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not supported by your browser');
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lng: longitude });

          try {
            const supabase = createClient();

            // For hackathon MVP, we'll create a temp user if not logged in
            const tempUsername = `user_${Date.now()}`;

            // Check if profile exists, if not create one
            const { data: existingProfile } = await supabase
              .from('profiles')
              .select('id')
              .eq('username', tempUsername)
              .single()
              .catch(() => ({ data: null }));

            let userId = existingProfile?.id;

            if (!userId) {
              const { data: newProfile } = await supabase
                .from('profiles')
                .insert([
                  {
                    username: tempUsername,
                    role: 'commuter',
                    points: 0,
                    badges: [],
                  },
                ])
                .select('id')
                .single();

              userId = newProfile?.id;
            }

            // Insert ping (ride request)
            const { error: insertError } = await supabase.from('pings').insert([
              {
                user_id: userId,
                lat: latitude,
                lng: longitude,
                route_destination: 'IT Park', // Default destination for MVP
              },
            ]);

            if (insertError) throw insertError;

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
          } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to send ping');
          }
        },
        (err) => {
          setError(`Geolocation error: ${err.message}`);
          setLoading(false);
        }
      );

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handlePing}
        disabled={loading}
        className="w-full h-24 bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-400 text-black font-bold text-xl rounded-lg transition-colors duration-200 transform hover:scale-105 active:scale-95"
      >
        {loading ? 'Sending...' : success ? '✓ Ping Sent!' : 'I Need a Ride'}
      </button>

      {location && (
        <p className="text-sm text-gray-400">
          📍 Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-400">
          ⚠️ {error}
        </p>
      )}

      {success && (
        <p className="text-sm text-green-400">
          ✓ Your ping has been sent to nearby drivers!
        </p>
      )}
    </div>
  );
}
