'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Lock, MapPin, Unlock } from 'lucide-react';

export default function DeadDropHunter() {
  const [distance, setDistance] = useState(450);
  const [bearing, setBearing] = useState(45);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlockThreshold = 10;
  const isClose = distance < 50;

  const getSignalColor = () => {
    if (distance <= unlockThreshold) return 'text-orange-600';
    if (isClose) return 'text-orange-600';
    return 'text-zinc-900';
  };

  const getBgColor = () => {
    if (distance <= unlockThreshold) return 'bg-orange-600/10';
    if (isClose) return 'bg-orange-600/20';
    return 'bg-zinc-100';
  };

  useEffect(() => {
    if (distance <= unlockThreshold) setIsUnlocked(true);
    else setIsUnlocked(false);
  }, [distance]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col items-center justify-between p-6">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-4 border-b-2 border-black">
        <div className="flex items-center gap-2">
          <Activity
            className={`w-4 h-4 ${getSignalColor()} ${getSignalColor() === 'text-orange-600' ? 'animate-pulse' : ''}`}
          />
          <span className="text-xs tracking-widest uppercase">Signal Lock</span>
        </div>
        <div className="text-xs uppercase tracking-widest px-3 py-1 border-2 border-black bg-white">
          #DROP-8492
        </div>
      </header>

      {/* Main Radar / Compass UI */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md gap-12">
        {/* Distance Display */}
        <div className="text-center">
          <motion.h1
            key={distance}
            initial={{ scale: 0.95, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className={`text-7xl font-bold tracking-tighter ${getSignalColor()}`}
          >
            {distance}
            <span className="text-2xl text-zinc-600 ml-2">m</span>
          </motion.h1>
          <p className="text-zinc-600 mt-3 text-xs uppercase tracking-widest">
            {isUnlocked ? 'Target Reached' : 'Distance to Target'}
          </p>
        </div>

        {/* Industrial Compass */}
        <div
          className={`relative w-64 h-64 border-2 border-black flex items-center justify-center transition-all ${getBgColor()}`}
        >
          {/* Outer Ring */}
          <div className="absolute inset-0 border border-black/40" />
          <div className="absolute inset-4 border border-black/40" />

          {/* Cardinal Markers */}
          <div className="absolute top-2 text-xs font-bold tracking-widest">N</div>
          <div className="absolute bottom-2 text-xs font-bold tracking-widest">S</div>
          <div className="absolute left-2 text-xs font-bold tracking-widest">W</div>
          <div className="absolute right-2 text-xs font-bold tracking-widest">E</div>

          {/* Target Pointer */}
          <motion.div
            className="w-full h-full absolute"
            animate={{ rotate: bearing }}
            transition={{ type: 'spring', stiffness: 420, damping: 28 }}
          >
            <div className="w-full h-1/2 flex justify-center items-start pt-4">
              <MapPin className={`w-6 h-6 ${getSignalColor()}`} />
            </div>
          </motion.div>

          {/* User Center Dot */}
          <div className="w-3 h-3 bg-black rounded-full z-10" />
        </div>

        {/* Payload Vault */}
        <div
          className={`w-full border-2 border-black ${
            isUnlocked ? 'bg-white' : 'bg-zinc-100'
          } p-6 min-h-40 flex flex-col items-center justify-center relative`}
        >
          {!isUnlocked ? (
            <div className="flex flex-col items-center gap-2">
              <Lock className="w-6 h-6 text-zinc-900" />
              <p className="text-xs uppercase tracking-widest">Content Encrypted</p>
              <p className="text-[10px] text-zinc-600 uppercase tracking-widest">
                Approach within {unlockThreshold}m to decode
              </p>
            </div>
          ) : null}

          {/* Unlocked Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: isUnlocked ? 1 : 0, y: isUnlocked ? 0 : 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="text-center"
          >
            <Unlock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <h3 className="text-lg uppercase tracking-tight font-bold mb-3">Payload Unlocked</h3>
            <p className="text-xs leading-relaxed p-3 border border-black bg-white">
              "The next clue is hidden beneath the stairs at the library."
            </p>
          </motion.div>
        </div>
      </main>

      {/* Developer Simulation Controls */}
      <footer className="w-full mt-8 p-4 bg-white border-2 border-black space-y-4">
        <div className="flex justify-between items-center text-xs uppercase tracking-widest">
          <span>Dev Simulation</span>
          <span className={isUnlocked ? 'text-orange-600' : 'text-zinc-600'}>
            {isUnlocked ? 'Unlocked' : 'Locked'}
          </span>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest">Simulate Distance</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full accent-orange-600"
          />
          <p className="text-[10px] text-zinc-600">{distance}m</p>
        </div>

        <div className="space-y-1">
          <label className="text-xs uppercase tracking-widest">Simulate Bearing</label>
          <input
            type="range"
            min="0"
            max="360"
            value={bearing}
            onChange={(e) => setBearing(Number(e.target.value))}
            className="w-full accent-orange-600"
          />
          <p className="text-[10px] text-zinc-600">{bearing}°</p>
        </div>
      </footer>
    </div>
  );
}