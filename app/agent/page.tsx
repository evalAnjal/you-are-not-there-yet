'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Archive, Radio, Zap } from 'lucide-react';

type ScreenTab = 'briefing' | 'origin' | 'archive';

// ============================================================================
// TERMINAL BOOT SEQUENCE
// ============================================================================
function TerminalBootSequence({ onComplete }: { onComplete: () => void }) {
  const lines = [
    '[SYSTEM INIT]',
    '[ACQUIRING SATELLITE LOCK]',
    '[CALIBRATING SECTOR GRID]',
    '[LOADING PAYLOAD MANIFEST]',
    '[SYSTEM READY]',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white flex flex-col justify-between p-8 font-mono"
    >
      <div className="space-y-3">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: i * 0.3,
              duration: 0.2,
            }}
            className="text-xs uppercase tracking-widest"
          >
            {line}
          </motion.div>
        ))}
      </div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.2 }}
        onClick={onComplete}
        className="btn-brutalist bg-orange-600 text-white w-full py-4 px-6 active:translate-x-[2px] active:translate-y-[2px]"
      >
        Enter Field
      </motion.button>
    </motion.div>
  );
}

// ============================================================================
// BRIEFING ROOM
// ============================================================================
function BriefingRoom() {
  const signals = [
    { id: 1, sector: 'Sector A1', distance: '0.8km', time: '2026-05-14 09:30' },
    { id: 2, sector: 'Sector B2', distance: '2.1km', time: '2026-05-14 10:15' },
    { id: 3, sector: 'Sector C3', distance: '5.4km', time: '2026-05-14 11:00' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="p-6 space-y-4"
    >
      <div className="card-field">
        <h2 className="text-sm uppercase tracking-widest font-bold">Nearby Signals</h2>
      </div>

      {signals.map((signal) => (
        <div key={signal.id} className="card-field space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-widest">{signal.sector}</span>
            <span className="text-xs text-orange-600 font-mono">{signal.distance}</span>
          </div>
          <div className="text-xs text-zinc-600 font-mono">{signal.time}</div>
        </div>
      ))}
    </motion.div>
  );
}

// ============================================================================
// ORIGIN POINT (DROP CREATION)
// ============================================================================
function OriginPoint() {
  const [payloadType, setPayloadType] = useState<'text' | 'link'>('text');
  const [radiusIndex, setRadiusIndex] = useState(1);
  const radiusOptions = ['5m', '10m', '25m', '50m', '100m'];

  const mockLat = '40.7128';
  const mockLng = '-74.0060';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="p-6 space-y-6 pb-32"
    >
      {/* Location Display */}
      <div className="card-field space-y-2">
        <div className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Current Location
        </div>
        <div className="divider-thick"></div>
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between">
            <span className="text-zinc-600">LAT</span>
            <span className="font-bold">{mockLat}°N</span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600">LNG</span>
            <span className="font-bold">{mockLng}°W</span>
          </div>
        </div>
      </div>

      {/* Payload Type Toggle */}
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-widest font-bold">Payload Type</div>
        <div className="flex gap-2">
          {(['text', 'link'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setPayloadType(type)}
              className={`flex-1 py-3 border-2 uppercase tracking-widest text-xs font-bold transition-all ${
                payloadType === type
                  ? 'border-black bg-black text-white shadow-brutalist'
                  : 'border-black bg-white text-black'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Unlock Radius Control */}
      <div className="space-y-3">
        <div className="text-xs uppercase tracking-widest font-bold">Unlock Radius</div>
        <div className="grid grid-cols-5 gap-2">
          {radiusOptions.map((radius, idx) => (
            <button
              key={radius}
              onClick={() => setRadiusIndex(idx)}
              className={`py-3 border-2 text-xs font-bold uppercase transition-all ${
                radiusIndex === idx
                  ? 'border-black bg-orange-600 text-white shadow-brutalist'
                  : 'border-black bg-white text-black'
              }`}
            >
              {radius}
            </button>
          ))}
        </div>
      </div>

      {/* Payload Input */}
      <div className="space-y-2">
        <div className="text-xs uppercase tracking-widest font-bold">Message</div>
        <textarea
          placeholder="Enter your payload..."
          className="input-brutalist w-full h-24 resize-none"
        />
      </div>

      {/* Deploy Button */}
      <button className="btn-brutalist bg-orange-600 text-white w-full py-4 sticky bottom-24 active:translate-x-[2px] active:translate-y-[2px]">
        Deploy Payload
      </button>
    </motion.div>
  );
}

// ============================================================================
// ARCHIVE LOGBOOK
// ============================================================================
function ArchiveLogbook() {
  const archives = [
    {
      id: 'AR-001',
      timestamp: '2026-05-14 08:30',
      lat: '40.7128',
      lng: '-74.0060',
      message: 'First signal detected. Coordinates locked.',
      status: 'INTERCEPTED',
    },
    {
      id: 'AR-002',
      timestamp: '2026-05-13 15:45',
      lat: '40.7580',
      lng: '-73.9855',
      message: 'Secondary payload recovered.',
      status: 'RECOVERED',
    },
    {
      id: 'AR-003',
      timestamp: '2026-05-12 12:00',
      lat: '40.7489',
      lng: '-73.9680',
      message: 'Archive entry - mission critical data.',
      status: 'INTERCEPTED',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="p-6 space-y-3 pb-28"
    >
      <div className="card-field">
        <h2 className="text-sm uppercase tracking-widest font-bold">Field Logbook</h2>
      </div>

      {archives.map((archive) => (
        <div key={archive.id} className="card-field space-y-3">
          {/* Header with Stamp */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-widest">{archive.id}</div>
              <div className="text-xs text-zinc-600 font-mono">{archive.timestamp}</div>
            </div>
            <div className="border-2 border-black px-2 py-1 transform -rotate-12">
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
                {archive.status}
              </span>
            </div>
          </div>

          <div className="divider-thick"></div>

          {/* Coordinates */}
          <div className="grid grid-cols-2 gap-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-zinc-600 uppercase tracking-widest">Latitude</div>
              <div className="font-bold">{archive.lat}°N</div>
            </div>
            <div className="space-y-1">
              <div className="text-zinc-600 uppercase tracking-widest">Longitude</div>
              <div className="font-bold">{archive.lng}°W</div>
            </div>
          </div>

          {/* Message */}
          <div className="bg-zinc-50 p-3 border-2 border-zinc-300">
            <p className="text-xs font-mono">{archive.message}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ============================================================================
// MAIN AGENT TERMINAL
// ============================================================================
export default function AgentTerminal() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('briefing');
  const [showBoot, setShowBoot] = useState(true);

  const navItems = [
    { id: 'briefing', icon: Radio, label: 'Briefing' },
    { id: 'origin', icon: MapPin, label: 'Origin' },
    { id: 'archive', icon: Archive, label: 'Archive' },
  ] as const;

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {showBoot && (
          <TerminalBootSequence key="boot" onComplete={() => setShowBoot(false)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-16 px-6 bg-white border-b-2 border-black flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest font-bold">Agent Terminal</span>
        <div className="flex items-center gap-1 text-xs text-orange-600">
          <Zap className="w-3 h-3" />
          <span>ACTIVE</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto pb-20 bg-white">
        <AnimatePresence mode="wait">
          {activeTab === 'briefing' && <BriefingRoom key="briefing" />}
          {activeTab === 'origin' && <OriginPoint key="origin" />}
          {activeTab === 'archive' && <ArchiveLogbook key="archive" />}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Icons Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black px-4 py-3 flex justify-around gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-3 border-2 transition-all ${
                isActive
                  ? 'border-black bg-orange-600 text-white shadow-brutalist'
                  : 'border-black bg-white text-black'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" strokeWidth={2.5} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
