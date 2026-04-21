'use client';

import dynamic from 'next/dynamic';

const HeatmapComponent = dynamic(() => import('@/app/components/HeatmapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <p className="text-yellow-400 text-2xl font-bold">Loading Map...</p>
    </div>
  ),
});

export default function DriverPage() {
  return <HeatmapComponent />;
}
