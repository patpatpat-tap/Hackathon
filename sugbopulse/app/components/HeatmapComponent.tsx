'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { createClient } from '@/app/utils/supabase';

export default function HeatmapComponent() {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const [pings, setPings] = useState<any[]>([]);
  const [activeDrivers, setActiveDrivers] = useState(0);

  useEffect(() => {
    // Initialize map (centered on IT Park Cebu)
    if (!mapRef.current) {
      mapRef.current = L.map('map-container').setView([10.3157, 123.8854], 14);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(mapRef.current);
    }

    // Fetch initial pings
    const fetchPings = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('pings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (!error && data) {
        setPings(data);
      }
    };

    fetchPings();

    // Subscribe to real-time updates
    const supabase = createClient();
    const subscription = supabase
      .channel('pings_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'pings' },
        (payload) => {
          setPings((prev) => [payload.new, ...prev.slice(0, 99)]);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Update heatmap whenever pings change
  useEffect(() => {
    if (mapRef.current && pings.length > 0) {
      // Convert pings to heatmap format [lat, lng, intensity]
      const heatmapData = pings.map((ping) => [
        parseFloat(ping.lat),
        parseFloat(ping.lng),
        0.8, // Intensity (0-1)
      ]);

      // Remove old heatmap layer
      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
      }

      // Add new heatmap layer
      heatLayerRef.current = L.heatLayer(heatmapData, {
        radius: 40,
        blur: 25,
        maxZoom: 17,
        gradient: {
          0: '#00ff00', // Green (low)
          0.5: '#ffff00', // Yellow (medium)
          1: '#ff0000', // Red (high)
        },
      }).addTo(mapRef.current);

      setActiveDrivers(pings.length);
    }
  }, [pings]);

  return (
    <div className="w-full h-screen flex flex-col bg-black relative">
      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-900 border-b-2 border-yellow-400 py-4 px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-yellow-400">SugboPulse Driver Map</h1>
            <p className="text-gray-300 text-sm mt-1">🔴 Red zones = high demand. 🟡 Yellow = medium. 🟢 Green = low</p>
          </div>
          <div className="bg-yellow-400 text-black px-4 py-3 rounded-lg font-bold text-lg">
            🚗 {activeDrivers} Active Requests
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div id="map-container" className="flex-1" />

      {/* Legend - Fixed Positioning */}
      <div className="fixed bottom-6 left-6 w-64 bg-black border-2 border-yellow-400 rounded-lg p-4 text-white z-50 shadow-lg">
        <h3 className="font-bold text-yellow-400 mb-3 text-base">Heatmap Legend</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-200">Low demand (1-10)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full flex-shrink-0"></div>
            <span className="text-gray-200">Medium demand (10-30)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
            <span className="text-gray-200">High demand (30+)</span>
          </div>
        </div>
      </div>

      {/* Stats Panel - Fixed Positioning */}
      <div className="fixed top-24 right-6 w-64 bg-black border-2 border-yellow-400 rounded-lg p-4 text-white z-50 shadow-lg">
        <h3 className="font-bold text-yellow-400 mb-3 text-base">Quick Stats</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-200">Live Requests:</span>
            <span className="text-yellow-400 font-bold">{activeDrivers}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-400">
            <span>Last Updated:</span>
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
