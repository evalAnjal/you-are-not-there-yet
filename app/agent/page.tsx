'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';

type ScreenTab = 'briefing' | 'hunter' | 'archive';
type PayloadType = 'text' | 'link';

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function BriefingRoom() {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="p-6 space-y-4">
      <div className="border-2 border-black bg-white p-4"><h2 className="text-xl uppercase">NEARBY SIGNALS</h2></div>
      <div className="border-2 border-black bg-white p-4"><p>Sector A1 - 0.8km</p></div>
      <div className="border-2 border-black bg-white p-4"><p>Sector B2 - 2.1km</p></div>
    </motion.div>
  );
}

function OriginPoint() {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="p-6 space-y-4">
      <div className="border-2 border-black bg-white p-4"><h2 className="text-xl uppercase">ORIGIN POINT</h2></div>
      <div className="border-2 border-black bg-white p-4"><textarea className="w-full border border-zinc-400 p-2" placeholder="Enter payload..."></textarea></div>
      <button className="w-full py-3 border-2 border-black bg-orange-600 text-white uppercase">Deploy Payload</button>
    </motion.div>
  );
}

function ArchiveLogbook() {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="p-6 space-y-4">
      <div className="border-2 border-black bg-white p-4"><h2 className="text-xl uppercase">ARCHIVE</h2></div>
      <div className="border-2 border-black bg-white p-4"><p className="text-xs">AR-001 | 2026-05-09 08:00 | Intercepted</p></div>
    </motion.div>
  );
}

export default function AgentTerminal() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('briefing');
  const [showBoot, setShowBoot] = useState(true);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col overflow-hidden">
      <header className="h-16 px-4 bg-white border-b-2 border-black flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest">Agent Terminal</span>
      </header>

      <main className="flex-1 relative overflow-y-auto pb-24 bg-zinc-100 border-t-2 border-black">
        <AnimatePresence mode="wait">
          {activeTab === 'briefing' && <BriefingRoom key="briefing" />}
          {activeTab === 'hunter' && <div key="hunter"><OriginPoint /></div>}
          {activeTab === 'archive' && <ArchiveLogbook key="archive" />}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t-2 border-black px-4 flex justify-around items-center">
        <button onClick={() => setActiveTab('briefing')} className={`flex flex-col items-center gap-1 ${activeTab === 'briefing' ? 'text-orange-600' : 'text-zinc-600'}`}><span className="text-xs uppercase">Briefing</span></button>
        <button onClick={() => setActiveTab('hunter')} className={`flex flex-col items-center gap-1 ${activeTab === 'hunter' ? 'text-orange-600' : 'text-zinc-600'}`}><span className="text-xs uppercase">Origin</span></button>
        <button onClick={() => setActiveTab('archive')} className={`flex flex-col items-center gap-1 ${activeTab === 'archive' ? 'text-orange-600' : 'text-zinc-600'}`}><span className="text-xs uppercase">Archive</span></button>
      </nav>

      <AnimatePresence>
        {showBoot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-white p-6 flex flex-col justify-between">
            <motion.p className="text-xs uppercase tracking-widest">[SYSTEM READY]</motion.p>
            <button onClick={() => setShowBoot(false)} className="w-full px-6 py-4 border-2 border-black bg-orange-600 text-white uppercase tracking-widest text-xs">Enter Field</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
