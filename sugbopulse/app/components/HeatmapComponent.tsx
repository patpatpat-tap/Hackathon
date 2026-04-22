'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { createClient } from '@/app/utils/supabase';

// ─── UTILITY: DISTANCE CALCULATION ──────────────────────────────────────────
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

// ─── MOCK DATASET ─────────────────────────────────────────────────────────────
// Realistic ride-request hotspots around Cebu's BPO corridors.
// Format: [lat, lng, intensity]  (intensity 0–1)
const MOCK_PINGS: [number, number, number][] = [
  // IT Park cluster (highest demand — main BPO hub)
  [10.3310, 123.9050, 1.0],
  [10.3318, 123.9045, 0.95],
  [10.3305, 123.9060, 0.9],
  [10.3325, 123.9035, 0.85],
  [10.3300, 123.9070, 0.8],
  [10.3315, 123.9080, 0.75],
  [10.3295, 123.9055, 0.85],
  [10.3330, 123.9065, 0.7],
  [10.3308, 123.9040, 0.9],
  [10.3322, 123.9075, 0.65],

  // Ayala Center Cebu cluster
  [10.3179, 123.9054, 0.85],
  [10.3185, 123.9060, 0.8],
  [10.3172, 123.9048, 0.75],
  [10.3190, 123.9042, 0.7],
  [10.3176, 123.9068, 0.65],
  [10.3168, 123.9055, 0.6],

  // SM City Cebu cluster
  [10.3113, 123.9183, 0.75],
  [10.3120, 123.9190, 0.7],
  [10.3106, 123.9178, 0.65],
  [10.3125, 123.9175, 0.6],
  [10.3108, 123.9195, 0.55],

  // Fuente Osmeña cluster
  [10.3100, 123.8930, 0.65],
  [10.3108, 123.8938, 0.6],
  [10.3093, 123.8925, 0.55],
  [10.3115, 123.8920, 0.5],

  // Colon Street / downtown cluster
  [10.2954, 123.8972, 0.55],
  [10.2960, 123.8980, 0.5],
  [10.2948, 123.8965, 0.45],
  [10.2966, 123.8975, 0.4],

  // Mandaue / MEPZ overflow
  [10.3390, 123.9340, 0.45],
  [10.3398, 123.9348, 0.4],
  [10.3382, 123.9332, 0.35],

  // Scattered mid-city requests
  [10.3240, 123.9100, 0.5],
  [10.3260, 123.9080, 0.45],
  [10.3220, 123.9120, 0.4],
  [10.3155, 123.9010, 0.5],
  [10.3210, 123.9000, 0.4],
  [10.3270, 123.8990, 0.35],
];

// Mock road hazards for demo
const MOCK_HAZARDS = [
  {
    id: 'hazard-1',
    label: '🚗 Accident — Lane Blocked',
    markerLat: 10.3262,
    markerLng: 123.9072,
    reported: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
  },
  {
    id: 'hazard-2',
    label: '🌊 Flooding — Road Impassable',
    markerLat: 10.3390,
    markerLng: 123.9330,
    reported: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
  },
];
// ─────────────────────────────────────────────────────────────────────────────

export default function HeatmapComponent() {
  const mapRef = useRef<L.Map | null>(null);
  const heatLayerRef = useRef<any>(null);
  const hazardsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const [activeRequests, setActiveRequests] = useState(MOCK_PINGS.length);
  const [hazardsCount, setHazardsCount] = useState(MOCK_HAZARDS.length);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const allPingsRef = useRef<[number, number, number][]>(MOCK_PINGS);

  useEffect(() => {
    // ── Initialize map ──────────────────────────────────────────────────────
    if (!mapRef.current) {
      mapRef.current = L.map('map-container').setView([10.3200, 123.9050], 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap © CartoDB',
        subdomains: 'abcd',
        maxZoom: 20,
      }).addTo(mapRef.current);

      hazardsLayerGroupRef.current = L.layerGroup().addTo(mapRef.current);

      // ── Map Click Event for Hotspot Details ─────────────────────────
      mapRef.current.on('click', (e) => {
        const { lat, lng } = e.latlng;
        const RADIUS_KM = 0.5; // 500 meters

        let count = 0;
        allPingsRef.current.forEach((ping) => {
          const dist = getDistanceFromLatLonInKm(lat, lng, ping[0], ping[1]);
          if (dist <= RADIUS_KM) {
            count++;
          }
        });

        L.popup()
          .setLatLng(e.latlng)
          .setContent(`
            <div style="text-align: center; font-family: sans-serif; padding: 5px;">
              <h3 style="margin: 0 0 5px 0; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Area Demand</h3>
              <div style="font-size: 28px; font-weight: bold; color: ${count > 5 ? '#ef4444' : count > 0 ? '#eab308' : '#22c55e'}; margin-bottom: 2px;">${count}</div>
              <div style="font-size: 13px; color: #444; font-weight: 500;">Passenger${count !== 1 ? 's' : ''} Nearby</div>
            </div>
          `)
          .openOn(mapRef.current!);
      });
    }

    // ── Render mock heatmap ─────────────────────────────────────────────────
    if (mapRef.current) {
      if (heatLayerRef.current) {
        mapRef.current.removeLayer(heatLayerRef.current);
      }

      heatLayerRef.current = (L as any).heatLayer(MOCK_PINGS, {
        radius: 38,
        blur: 28,
        maxZoom: 17,
        max: 1.0,
        gradient: {
          0.0: '#00ff00',  // Green — low demand
          0.4: '#aaff00',
          0.6: '#ffff00',  // Yellow — medium
          0.8: '#ff8800',
          1.0: '#ff0000',  // Red — high demand
        },
      }).addTo(mapRef.current);
    }

    // ── Render road hazards: pins only ────────────────────────────────────────
    const renderHazards = () => {
      if (!hazardsLayerGroupRef.current) return;
      hazardsLayerGroupRef.current.clearLayers();

      const localHazardsStr = localStorage.getItem('hackathon_hazards');
      const localHazards = localHazardsStr ? JSON.parse(localHazardsStr) : [];
      const allHazards = [...MOCK_HAZARDS, ...localHazards];
      
      setHazardsCount(allHazards.length);

      allHazards.forEach((hazard) => {
        // Hazard pin icon
        const iconHtml = `<div style="background:#ef4444;width:28px;height:28px;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 0 14px rgba(239,68,68,0.8);font-size:14px;">⚠️</div>`;
        const customIcon = L.divIcon({
          html: iconHtml,
          className: 'custom-hazard-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        let popupContent = `<b>${hazard.label}</b><br/>Reported ${new Date(hazard.reported).toLocaleTimeString()}`;
        if (hazard.photo) {
          popupContent += `<br/><img src="${hazard.photo}" style="width: 150px; height: auto; border-radius: 8px; margin-top: 8px; object-fit: cover; border: 1px solid #444;" />`;
        }

        L.marker([hazard.markerLat, hazard.markerLng], { icon: customIcon })
          .bindPopup(popupContent)
          .addTo(hazardsLayerGroupRef.current!);
      });
    };

    renderHazards();
    window.addEventListener('storage', renderHazards);

    // ── Try to merge real Supabase data on top if available ─────────────────
    const supabase = createClient();

    const fetchLiveData = async () => {
      try {
        const { data: pingsData } = await supabase
          .from('pings')
          .select('lat,lng')
          .order('created_at', { ascending: false })
          .limit(100);

        if (pingsData && pingsData.length > 0 && mapRef.current) {
          const livePings: [number, number, number][] = pingsData.map((p) => [
            parseFloat(p.lat),
            parseFloat(p.lng),
            1.0,
          ]);

          const combined = [...MOCK_PINGS, ...livePings];
          allPingsRef.current = combined;

          if (heatLayerRef.current) mapRef.current.removeLayer(heatLayerRef.current);

          heatLayerRef.current = (L as any).heatLayer(combined, {
            radius: 38,
            blur: 28,
            maxZoom: 17,
            max: 1.0,
            gradient: {
              0.0: '#00ff00',
              0.4: '#aaff00',
              0.6: '#ffff00',
              0.8: '#ff8800',
              1.0: '#ff0000',
            },
          }).addTo(mapRef.current);

          setActiveRequests(combined.length);
          setLastUpdated(new Date());
        }

        // Real-time: subscribe to new pings
        supabase
          .channel('pings_realtime')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'pings' }, (payload) => {
            if (mapRef.current && heatLayerRef.current) {
              const newPoint: [number, number, number] = [
                parseFloat(payload.new.lat),
                parseFloat(payload.new.lng),
                1.0,
              ];
              // @ts-ignore
              heatLayerRef.current.addLatLng(newPoint);
              allPingsRef.current.push(newPoint);
              setActiveRequests((prev) => prev + 1);
              setLastUpdated(new Date());
            }
          })
          .subscribe();
      } catch {
        // Supabase not configured — mock data still renders
      }
    };

    fetchLiveData();

    return () => {
      window.removeEventListener('storage', renderHazards);
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col bg-black relative font-sans">
      {/* Header */}
      <div className="bg-[#0b0f19] border-b border-yellow-400 py-4 px-6 flex items-center justify-between z-10">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400 tracking-wide">SugboPulse Driver Map</h1>
          <p className="text-gray-400 text-sm mt-1">
            {activeRequests} Active Requests
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

      {/* Legend */}
      <div className="absolute bottom-8 left-6 w-48 bg-black/90 border border-yellow-400 rounded-lg p-4 text-white z-[1000] shadow-lg backdrop-blur-sm">
        <h3 className="font-bold text-yellow-400 mb-4 text-sm tracking-widest uppercase">Demand Levels</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#00ff00] rounded flex-shrink-0 shadow-[0_0_8px_rgba(0,255,0,0.6)]" />
            <span className="text-gray-300 font-medium">Low</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#ffff00] rounded flex-shrink-0 shadow-[0_0_8px_rgba(255,255,0,0.6)]" />
            <span className="text-gray-300 font-medium">Medium</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#ff3333] rounded flex-shrink-0 shadow-[0_0_8px_rgba(255,51,51,0.6)]" />
            <span className="text-gray-300 font-medium">High</span>
          </div>
          <div className="flex items-center gap-3 pt-2 border-t border-gray-700">
            <div className="w-4 h-4 bg-[#ef4444] rounded flex-shrink-0 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
            <span className="text-gray-300 font-medium">Road Hazard</span>
          </div>
        </div>
      </div>

      {/* Stats Panel */}
      <div className="absolute top-24 right-6 w-56 bg-black/90 border border-yellow-400 rounded-lg p-5 text-white z-[1000] shadow-lg backdrop-blur-sm">
        <h3 className="font-bold text-yellow-400 mb-4 text-sm tracking-widest uppercase">Live Stats</h3>
        <div className="space-y-4">
          <div>
            <div className="text-gray-400 text-xs mb-1">Active Requests</div>
            <div className="text-white font-bold text-xl">{activeRequests}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">Road Hazards</div>
            <div className="text-white font-bold text-xl">{hazardsCount}</div>
          </div>
          <div>
            <div className="text-gray-400 text-xs mb-1">Last Updated</div>
            <div className="text-white text-sm">{lastUpdated.toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
