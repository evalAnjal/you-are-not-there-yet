'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Activity } from 'lucide-react';

interface DeadDropState {
  distance: number;
  bearing: number;
  isUnlocked: boolean;
}

export default function DeadDropHunter() {
  const [distance, setDistance] = useState(450);
  const [bearing, setBearing] = useState(45);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlockThreshold = 10;
  const getSignalColor = () => distance <= unlockThreshold ? "text-orange-600" : "text-zinc-900";
  const getBgColor = () => distance <= unlockThreshold ? "bg-orange-600/10" : "bg-zinc-100";
  
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
          <h1 className={`text-7xl font-bold ${getSignalColor()}`}>{distance}<span className="text-2xl">m</span></h1>
          <p className="text-xs uppercase tracking-widest mt-3 text-zinc-600">{isUnlocked ? "Target Reached" : "Distance to Target"}</p>
        </motion.div>

        <div className={`relative w-64 h-64 border-2 border-black ${getBgColor()} bg-opacity-50 flex items-center justify-center transition-all`}>
          <motion.div animate={{ rotate: bearing }} transition={{ type: "spring", stiffness: 420, damping: 28 }} className="absolute w-full h-full flex items-start justify-center pt-4">
            <motion.div className={`w-6 h-6 ${getSignalColor()}`}>{isUnlocked ? <Unlock /> : <Lock />}</motion.div>
          </motion.div>
          <div className="w-3 h-3 bg-black rounded-full z-10"></div>
        </div>

        <div className={`w-full border-2 border-black ${isUnlocked ? "bg-white" : "bg-zinc-100"} p-6`}>
          {!isUnlocked ? (
            <div className="text-center text-xs uppercase tracking-widest">Content Encrypted</div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <Unlock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-xs">Payload Unlocked</p>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="w-full mt-8 p-4 bg-white border-2 border-black">
        <input type="range" min="0" max="1000" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full" />
      </footer>

      <footer className="w-full mt-4 p-4 bg-white border-2 border-black">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-xs uppercase tracking-widest border-b border-black pb-1">Bearing: {bearing}°</div>
          <div className="text-xs uppercase tracking-widest border-b border-black pb-1">Status: {isUnlocked ? "UNLOCKED" : "LOCKED"}</div>
        </div>
      </footer>
    </div>
  );
}