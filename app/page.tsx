'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

      <main className="flex-1 flex flex-col items-center justify-center max-w-md gap-12">
        <motion.div className="text-center" key={distance} initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
          <h1 className="text-7xl font-bold text-orange-600">{distance}<span className="text-2xl">m</span></h1>
          <p className="text-xs uppercase tracking-widest mt-3 text-zinc-600">{isUnlocked ? "Target Reached" : "Distance to Target"}</p>
        </motion.div>

        <div className="relative w-64 h-64 border-2 border-black bg-zinc-100 flex items-center justify-center">
          <motion.div animate={{ rotate: bearing }} transition={{ type: "spring", stiffness: 420, damping: 28 }} className="absolute w-full h-full flex items-start justify-center pt-4">
            <div className="w-6 h-6 bg-orange-600"></div>
          </motion.div>
          <div className="w-3 h-3 bg-black rounded-full z-10"></div>
        </div>
      </main>

      <footer className="w-full mt-8 p-4 bg-white border-2 border-black">
        <input type="range" min="0" max="1000" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full" />
      </footer>
    </div>
  );
}