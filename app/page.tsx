'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Activity } from 'lucide-react';
import Link from 'next/link';

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
  const getSignalColor = () => (distance <= unlockThreshold ? 'text-orange-600' : 'text-zinc-900');
  const getBgColor = () => (distance <= unlockThreshold ? 'bg-orange-600/5' : 'bg-white');
  const getBorderColor = () => (distance <= unlockThreshold ? 'border-orange-600' : 'border-black');

  useEffect(() => {
    setIsUnlocked(distance <= unlockThreshold);
  }, [distance]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col items-center justify-between p-4 sm:p-6">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-3 sm:py-4 border-b-2 border-black">
        <span className="text-xs tracking-widest uppercase font-bold">Signal Lock</span>
        <div className="text-xs border-2 border-black px-2 sm:px-3 py-1 font-mono font-bold">#DROP-8492</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-md gap-8 sm:gap-16 w-full">
        {/* Distance Display */}
        <div className="text-center w-full">
          <div className={`card-field ${getBgColor()} border-2 ${getBorderColor()}`}>
            <h1 className={`text-4xl sm:text-6xl font-bold ${getSignalColor()}`}>
              {distance}
              <span className="text-lg sm:text-2xl ml-2">m</span>
            </h1>
            <div className="divider-thick my-3"></div>
            <p className="text-xs uppercase tracking-widest text-zinc-600">
              {isUnlocked ? '✓ Target Reached' : '○ Distance to Target'}
            </p>
          </div>
        </div>

        {/* Compass Circle */}
        <div className={`relative w-56 h-56 sm:w-72 sm:h-72 border-4 ${getBorderColor()} ${getBgColor()} flex items-center justify-center`}>
          {/* Cardinal Points */}
          <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">
            <span className="absolute top-4">N</span>
            <span className="absolute bottom-4">S</span>
            <span className="absolute left-4">W</span>
            <span className="absolute right-4">E</span>
          </div>

          {/* Rotating Indicator */}
          <motion.div
            animate={{ rotate: bearing }}
            transition={{ duration: 0.2 }}
            className="absolute w-full h-full flex items-start justify-center pt-8"
          >
            <div className={`${getSignalColor()}`}>
              {isUnlocked ? (
                <Unlock className="w-6 h-6" strokeWidth={3} />
              ) : (
                <Lock className="w-6 h-6" strokeWidth={3} />
              )}
            </div>
          </motion.div>

          {/* Center Crosshair */}
          <div className="w-4 h-4 bg-black border-2 border-white z-10"></div>
        </div>

        {/* Unlock Message */}
        {isUnlocked && (
          <div className="card-field w-full bg-orange-600/5 border-2 border-orange-600">
            <div className="flex items-center gap-2 justify-center">
              <Unlock className="w-5 h-5 text-orange-600" />
              <span className="text-xs uppercase tracking-widest font-bold text-orange-600">
                Payload Unlocked
              </span>
            </div>
          </div>
        )}
      </main>

      {/* Footer Controls */}
      <div className="w-full space-y-3 sm:space-y-4 pb-2">
        {/* Hunt Mode Button */}
        <Link href="/hunt">
          <button className="w-full card-field border-2 border-orange-600 bg-orange-600/5 hover:bg-orange-600/10 active:translate-x-[1px] active:translate-y-[1px] py-3">
            <div className="text-xs uppercase tracking-widest font-bold text-orange-600 flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" />
              Enter Hunt Mode (Real Sensors)
            </div>
          </button>
        </Link>

        {/* Distance Slider */}
        <div className="card-field space-y-3">
          <label className="text-xs uppercase tracking-widest font-bold">Distance Sensor</label>
          <input
            type="range"
            min="0"
            max="1000"
            value={distance}
            onChange={(e) => setDistance(Number(e.target.value))}
            className="w-full h-2 bg-white border-2 border-black accent-orange-600 cursor-pointer"
          />
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <button
              onClick={() => setDistance(Math.max(0, distance - 50))}
              className="border-2 border-black py-1 bg-white hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px]"
            >
              −50m
            </button>
            <div className="border-2 border-black py-1 bg-white text-center font-bold">{distance}m</div>
            <button
              onClick={() => setDistance(Math.min(1000, distance + 50))}
              className="border-2 border-black py-1 bg-white hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px]"
            >
              +50m
            </button>
          </div>
        </div>

        {/* Bearing Control */}
        <div className="card-field space-y-3">
          <label className="text-xs uppercase tracking-widest font-bold">Bearing Compass</label>
          <input
            type="range"
            min="0"
            max="360"
            value={bearing}
            onChange={(e) => setBearing(Number(e.target.value))}
            className="w-full h-2 bg-white border-2 border-black accent-orange-600 cursor-pointer"
          />
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <button
              onClick={() => setBearing((bearing - 45 + 360) % 360)}
              className="border-2 border-black py-1 bg-white hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px]"
            >
              −45°
            </button>
            <div className="border-2 border-black py-1 bg-white text-center font-bold">{bearing}°</div>
            <button
              onClick={() => setBearing((bearing + 45) % 360)}
              className="border-2 border-black py-1 bg-white hover:bg-zinc-100 active:translate-x-[1px] active:translate-y-[1px]"
            >
              +45°
            </button>
          </div>
        </div>

        {/* Status readout */}
        <div className="card-field">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-zinc-600 font-bold">Bearing</div>
              <div className="text-lg font-bold font-mono">{bearing}°</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-zinc-600 font-bold">Status</div>
              <div className={`text-lg font-bold ${getSignalColor()}`}>
                {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
