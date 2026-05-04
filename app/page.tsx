'use client';

import React, { useState, useEffect } from 'react';

export default function DeadDropHunter() {
  const [distance, setDistance] = useState(450);
  const [bearing, setBearing] = useState(45);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlockThreshold = 10;
  
  useEffect(() => {
    setIsUnlocked(distance <= unlockThreshold);
  }, [distance]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col items-center justify-between p-6">
      <header className="w-full flex justify-between items-center py-4 border-b-2 border-black">
        <span className="text-xs tracking-widest uppercase">Signal Lock</span>
        <div className="text-xs border-2 border-black px-3 py-1">#DROP-8492</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-bold text-orange-600">{distance}<span className="text-2xl">m</span></h1>
          <p className="text-xs uppercase tracking-widest mt-3 text-zinc-600">{isUnlocked ? "Target Reached" : "Distance to Target"}</p>
        </div>

        <div className="relative w-64 h-64 border-2 border-black">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
        </div>
      </main>

      <footer className="w-full mt-8 p-4 bg-white border-2 border-black">
        <input type="range" min="0" max="1000" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full" />
      </footer>
    </div>
  );
}