'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ScreenTab = 'briefing' | 'hunter' | 'archive';

export default function AgentTerminal() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('briefing');
  const [showBoot, setShowBoot] = useState(true);

  const handleEnterField = () => {
    setShowBoot(false);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col overflow-hidden">
      <header className="h-16 px-4 bg-white border-b-2 border-black flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest">Agent Terminal</span>
      </header>

      <main className="flex-1 relative overflow-y-auto pb-24 bg-zinc-100 border-t-2 border-black">
        <AnimatePresence mode="wait">
          {activeTab === 'briefing' && <div key="briefing" className="p-6"><h2>Briefing Room</h2></div>}
          {activeTab === 'hunter' && <div key="hunter" className="p-6"><h2>Hunter</h2></div>}
          {activeTab === 'archive' && <div key="archive" className="p-6"><h2>Archive</h2></div>}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t-2 border-black px-4 flex justify-around items-center">
        <button onClick={() => setActiveTab('briefing')} className={`flex flex-col items-center gap-1 ${activeTab === 'briefing' ? 'text-orange-600' : 'text-zinc-600'}`}>
          <span className="text-xs uppercase">Briefing</span>
        </button>
        <button onClick={() => setActiveTab('hunter')} className={`flex flex-col items-center gap-1 ${activeTab === 'hunter' ? 'text-orange-600' : 'text-zinc-600'}`}>
          <span className="text-xs uppercase">Hunter</span>
        </button>
        <button onClick={() => setActiveTab('archive')} className={`flex flex-col items-center gap-1 ${activeTab === 'archive' ? 'text-orange-600' : 'text-zinc-600'}`}>
          <span className="text-xs uppercase">Archive</span>
        </button>
      </nav>

      <AnimatePresence>
        {showBoot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-white p-6 flex flex-col justify-between">
            <motion.div initial="hidden" animate="show" variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}>
              <motion.p variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="text-xs uppercase tracking-widest">[SYSTEM INIT]</motion.p>
              <motion.p variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="text-xs uppercase tracking-widest mt-2">[ACQUIRING SATELLITE LOCK]</motion.p>
              <motion.p variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }} className="text-xs uppercase tracking-widest mt-2">[CALIBRATING SECTOR]</motion.p>
            </motion.div>
            <button onClick={handleEnterField} className="w-full px-6 py-4 border-2 border-black bg-orange-600 text-white uppercase tracking-widest text-xs">Enter Field</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}