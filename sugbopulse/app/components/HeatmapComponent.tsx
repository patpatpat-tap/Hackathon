'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { createClient } from '@/app/utils/supabase';

export default function HeatmapComponent() {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const alertsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const [pings, setPings] = useState<any[]>([]);
  const [floodAlerts, setFloodAlerts] = useState<any[]>([]);
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
      
      alertsLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);
    }

    const supabase = createClient();

    // Fetch initial pings and alerts
    const fetchData = async () => {
      const { data: pingsData } = await supabase
        .from('pings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (pingsData) setPings(pingsData);

      const { data: alertsData } = await supabase
        .from('flood_alerts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
        
      if (alertsData) setFloodAlerts(alertsData);
    };

    fetchData();

    // Subscribe to real-time updates for pings
    const pingsSubscription = supabase
      .channel('pings_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pings' }, (payload) => {
        setPings((prev) => [payload.new, ...prev.slice(0, 99)]);
      })
      .subscribe();
      
    // Subscribe to real-time updates for flood alerts
    const alertsSubscription = supabase
      .channel('alerts_realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'flood_alerts' }, (payload) => {
        setFloodAlerts((prev) => [payload.new, ...prev.slice(0, 49)]);
      })
      .subscribe();

    return () => {
      pingsSubscription.unsubscribe();
      alertsSubscription.unsubscribe();
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

  // Update flood alerts layer
  useEffect(() => {
    if (mapRef.current && alertsLayerGroupRef.current) {
      alertsLayerGroupRef.current.clearLayers();

      floodAlerts.forEach((alert) => {
        const isFlood = alert.type === 'flood';
        const color = isFlood ? '#3b82f6' : '#8b5cf6'; // Blue for flood, Purple for rainfall
        
        // Add a circle for the zone
        L.circle([parseFloat(alert.lat), parseFloat(alert.lng)], {
          color: color,
          fillColor: color,
          fillOpacity: 0.4,
          radius: 150, // 150 meters radius
          weight: 2,
        }).addTo(alertsLayerGroupRef.current!);

        // Add a marker in the center
        const iconHtml = `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px ${color}; font-size: 12px; font-weight: bold; color: white;">!</div>`;
        
        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-alert-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        L.marker([parseFloat(alert.lat), parseFloat(alert.lng)], { icon: customIcon })
          .bindPopup(`<b>${isFlood ? 'Flooded Route' : 'Heavy Rainfall'}</b><br/>Reported at ${new Date(alert.created_at).toLocaleTimeString()}`)
          .addTo(alertsLayerGroupRef.current!);
      });
    }
  }, [floodAlerts]);

  return (
    <div className="w-full h-screen flex flex-col bg-black relative font-sans">
      {/* Header */}
      <div className="bg-[#0b0f19] border-b border-yellow-400 py-4 px-6 flex items-center justify-between z-10">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">SugboPulse Driver Map</h1>
          <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
            {activeDrivers} Active Requests
          </p>
        </div>
        <a
          href="/"
          className="bg-[#ffd700] hover:bg-yellow-500 text-black px-6 py-2 rounded-md font-bold text-sm transition-colors shadow-[0_0_10px_rgba(255,215,0,0.3)]"
        >
          Commuter View
        </a>
      </div>

      {/* Map Container */}
      <div id="map-container" className="flex-1 z-0" />

      {/* Legend - Fixed Positioning (Bottom Left) */}
      <div className="absolute bottom-8 left-6 w-48 bg-black/90 border border-yellow-400 rounded-lg p-4 text-white z-[1000] shadow-lg backdrop-blur-sm">
        <h3 className="font-bold text-yellow-400 mb-4 text-sm tracking-widest uppercase">Demand Levels</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#00ff00] rounded flex-shrink-0 shadow-[0_0_8px_rgba(0,255,0,0.6)]"></div>
            <span className="text-gray-300 font-medium">Low</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#ffff00] rounded flex-shrink-0 shadow-[0_0_8px_rgba(255,255,0,0.6)]"></div>
            <span className="text-gray-300 font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#ff3333] rounded flex-shrink-0 shadow-[0_0_8px_rgba(255,51,51,0.6)]"></div>
            <span className="text-gray-300 font-medium">High</span>
          </div>
        </div>
      </div>

      {/* Stats Panel - Fixed Positioning (Top Right) */}
      <div className="absolute top-24 right-6 w-56 bg-black/90 border border-yellow-400 rounded-lg p-5 text-white z-[1000] shadow-lg backdrop-blur-sm">
        <h3 className="font-bold text-yellow-400 mb-4 text-sm tracking-widest uppercase">Live Stats</h3>
        <div className="space-y-4">
          <div>
            <div className="text-gray-400 text-xs mb-1">Active Requests</div>
            <div className="text-white font-bold text-xl">{activeDrivers}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">Last Updated</div>
            <div className="text-white text-sm">{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
