'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ScreenTab = 'briefing' | 'hunter' | 'archive';

export default function AgentTerminal() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('briefing');

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
    </div>
  );
}