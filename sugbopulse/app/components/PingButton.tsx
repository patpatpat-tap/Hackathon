'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/utils/supabase';

export default function PingButton() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Booking flow state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [destination, setDestination] = useState('IT Park');
  const [step, setStep] = useState<'details' | 'finding' | 'found' | 'status'>('details');
  const [activeRide, setActiveRide] = useState<boolean>(false);
  
  // Simulated ride status state
  const [rideStatus, setRideStatus] = useState('Preparing');
  const [passengersNeeded, setPassengersNeeded] = useState(4);
  const [eta, setEta] = useState('5 mins');

  const destinations = ['IT Park', 'Ayala Center', 'SM City Cebu', 'Colon Street', 'Fuente Osmeña'];

  // Simulate status updates
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeRide) {
      interval = setInterval(() => {
        setPassengersNeeded((prev) => {
          if (prev > 0) return prev - 1;
          setRideStatus('Ongoing');
          setEta('Arriving shortly');
          return 0;
        });
      }, 8000); // Update every 8 seconds for the demo
    }
    return () => clearInterval(interval);
  }, [activeRide]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setStep('details');
    setError(null);
    setSuccess(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        },
        (err) => console.log('Location error:', err)
      );
    }
  };

  const handleFindRides = () => {
    setStep('finding');
    setTimeout(() => {
      setStep('found');
    }, 1500);
  };

  const handleConfirmBooking = async () => {
    setLoading(true);
    setError(null);

    try {
      let currentLat = location?.lat || 10.3157;
      let currentLng = location?.lng || 123.8854;

      const supabase = createClient();
      const tempUsername = `user_${Date.now()}`;

      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', tempUsername)
        .single();

      let userId = existingProfile?.id;

      if (!userId || profileError) {
        const { data: newProfile, error: insertProfileError } = await supabase
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

        if (!insertProfileError && newProfile) {
          userId = newProfile.id;
        }
      }

      if (!userId) {
        userId = '00000000-0000-0000-0000-000000000000';
      }

      const { error: insertError } = await supabase.from('pings').insert([
        {
          user_id: userId,
          lat: currentLat,
          lng: currentLng,
          route_destination: destination,
        },
      ]);

      if (insertError && insertError.code !== '42P01') {
        console.error("Supabase insert error (bypassed for demo):", insertError);
      }

      setLoading(false);
      setSuccess(true);
      setActiveRide(true);
      setStep('status');
      setRideStatus('Preparing');
      setPassengersNeeded(4);
      setEta('5 mins');
      setIsModalOpen(false);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An error occurred while booking');
      setLoading(false);
    }
  };

  const handleCancelRide = () => {
    setActiveRide(false);
    setStep('details');
  };

  if (activeRide) {
    return (
      <div className="bg-gray-900 border-2 border-yellow-400 rounded-xl p-6 w-full shadow-lg">
        <h2 className="text-xl font-bold text-yellow-400 mb-4 border-b border-gray-700 pb-2">Active Ride Status</h2>
        
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Destination</span>
            <span className="text-white font-bold">{destination}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Current Status</span>
            <span className="text-yellow-400 font-bold">{rideStatus}</span>
          </div>
          {passengersNeeded > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Waiting for passengers</span>
              <span className="text-white font-bold">{passengersNeeded} more needed</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Estimated Arrival</span>
            <span className="text-white font-bold">{eta}</span>
          </div>
        </div>

        <button
          onClick={handleCancelRide}
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors border border-gray-600"
        >
          Cancel Ride
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleOpenModal}
        className="w-full h-24 bg-[#ffd700] hover:bg-yellow-500 text-black font-bold text-xl rounded-lg transition-colors duration-200 transform hover:scale-[1.02] active:scale-95 shadow-[0_0_15px_rgba(255,215,0,0.4)]"
      >
        I Need a Ride
      </button>

      {/* Booking Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-[#0b0f19] border-2 border-yellow-400 rounded-xl p-6 w-full max-w-md shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            <h2 className="text-2xl font-bold text-yellow-400 mb-6 flex items-center gap-2">
              Book Your Ride
            </h2>

            <div className="space-y-6">
              {/* Step 1: Details */}
              {step === 'details' && (
                <>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Pickup Location</label>
                      <div className="bg-gray-800 border border-gray-600 text-white rounded p-3 text-sm flex items-center gap-2">
                        {location ? 'Current GPS Location' : 'Locating...'}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Destination</label>
                      <select 
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-600 text-white rounded p-3 text-sm focus:border-yellow-400 focus:outline-none"
                      >
                        {destinations.map(dest => (
                          <option key={dest} value={dest}>{dest}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors border border-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleFindRides}
                      className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors shadow-lg"
                    >
                      Find Rides
                    </button>
                  </div>
                </>
              )}

              {/* Step 2: Finding */}
              {step === 'finding' && (
                <div className="text-center py-12">
                  <div className="animate-pulse w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <h3 className="text-lg font-bold text-yellow-400">Scanning Route...</h3>
                  <p className="text-gray-400 text-sm mt-2">Checking real-time jeepney availability for {destination}</p>
                </div>
              )}

              {/* Step 3: Found & Confirm */}
              {step === 'found' && (
                <>
                  <div className="bg-green-900/30 border border-green-500 rounded-lg p-4 mb-4">
                    <h4 className="text-green-400 font-bold mb-2 flex items-center gap-2">
                      Rides Available
                    </h4>
                    <ul className="text-sm text-gray-300 space-y-2">
                      <li className="flex justify-between">
                        <span>Jeepneys on route</span>
                        <span className="font-bold text-white">3 Active</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Estimated Arrival</span>
                        <span className="font-bold text-white">4-7 mins</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Estimated Seats</span>
                        <span className="font-bold text-white">12 available</span>
                      </li>
                    </ul>
                  </div>

                  {error && <p className="text-red-400 text-sm text-center mb-4">Error: {error}</p>}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setStep('details')}
                      className="flex-1 bg-gray-800 text-white font-bold py-3 rounded-lg border border-gray-600"
                      disabled={loading}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      disabled={loading}
                      className="flex-[2] bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                      {loading ? 'Confirming...' : 'Ping Driver Now'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
