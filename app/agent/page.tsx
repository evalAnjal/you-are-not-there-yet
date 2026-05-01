'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity,
  Archive,
  ChevronRight,
  Crosshair,
  Link,
  MapPin,
  Radar,
  ShieldCheck,
  Type,
} from 'lucide-react';

type ScreenTab = 'hunter' | 'origin' | 'archive';
type PayloadType = 'text' | 'link';
type RadiusValue = '5m' | '10m' | '50m';

export default function AgentTerminal() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('hunter');
  const [showBoot, setShowBoot] = useState<boolean | null>(null);

  useEffect(() => {
    const hasBooted = window.localStorage.getItem('yannty_boot_complete');
    setShowBoot(!hasBooted);
  }, []);

  const handleEnterField = () => {
    window.localStorage.setItem('yannty_boot_complete', '1');
    setShowBoot(false);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col overflow-hidden">
      <TopStatusBar />

      <main className="flex-1 relative overflow-y-auto pb-24 bg-zinc-100 border-t-2 border-black">
        <AnimatePresence mode="wait">
          {activeTab === 'hunter' && <HunterCompass key="hunter" />}
          {activeTab === 'origin' && <OriginPoint key="origin" />}
          {activeTab === 'archive' && <ArchiveLogbook key="archive" />}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t-2 border-black px-4 flex justify-around items-center z-40">
        <NavButton
          active={activeTab === 'hunter'}
          onClick={() => setActiveTab('hunter')}
          icon={<Activity size={18} />}
          label="Hunter"
        />
        <NavButton
          active={activeTab === 'origin'}
          onClick={() => setActiveTab('origin')}
          icon={<MapPin size={18} />}
          label="Origin"
        />
        <NavButton
          active={activeTab === 'archive'}
          onClick={() => setActiveTab('archive')}
          icon={<Archive size={18} />}
          label="Archive"
        />
      </nav>

      <AnimatePresence>
        {showBoot && <BootSequence onEnter={handleEnterField} />}
      </AnimatePresence>
    </div>
  );
}

function TopStatusBar() {
  return (
    <header className="h-16 px-4 bg-white border-b-2 border-black flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-orange-600" />
        <span className="text-[10px] uppercase tracking-widest">System Link Active</span>
      </div>
      <ShieldCheck className="w-4 h-4" />
    </header>
  );
}

type BootSequenceProps = {
  onEnter: () => void;
};

function BootSequence({ onEnter }: BootSequenceProps) {
  const lines = [
    '[SYSTEM INIT]',
    '[ACQUIRING SATELLITE LOCK]',
    '[CALIBRATING SECTOR]',
    '[FIELD UNIT READY]',
  ];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-50 bg-white p-6 md:p-10"
    >
      <div className="h-full border-2 border-black bg-zinc-100 p-6 md:p-10 flex flex-col justify-between">
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.14,
              },
            },
          }}
          className="space-y-4"
        >
          <div className="flex items-center gap-3 text-orange-600">
            <Radar size={22} />
            <h1 className="text-lg md:text-2xl tracking-wider uppercase">Surveyor Terminal</h1>
          </div>

          {lines.map((line) => (
            <motion.p
              key={line}
              variants={{
                hidden: { opacity: 0, y: 8 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    type: 'spring',
                    stiffness: 480,
                    damping: 28,
                  },
                },
              }}
              className="text-xs md:text-sm tracking-widest uppercase"
            >
              {line}
            </motion.p>
          ))}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 420, damping: 26 }}
          onClick={onEnter}
          className="w-full md:w-auto px-6 py-4 border-2 border-black bg-orange-600 text-white uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
        >
          Enter Field
        </motion.button>
      </div>
    </motion.section>
  );
}

function HunterCompass() {
  const sectors = [
    { id: 'A1', distance: '0.8km', signal: '80%' },
    { id: 'B4', distance: '2.1km', signal: '56%' },
    { id: 'C9', distance: '4.7km', signal: '22%' },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="p-4 md:p-6 space-y-4"
    >
      <div className="border-2 border-black bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest">Active Sweep</p>
          <Crosshair size={16} className="text-orange-600" />
        </div>
        <h2 className="mt-2 text-xl uppercase tracking-tight">Hunter Compass</h2>
      </div>

      <div className="space-y-3">
        {sectors.map((sector) => (
          <article key={sector.id} className="border-2 border-black bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-zinc-600">Sector {sector.id}</p>
                <p className="mt-1 text-lg uppercase">Potential Drop</p>
              </div>
              <ChevronRight className="w-4 h-4 text-zinc-700" />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs uppercase tracking-wide">
              <p>Distance: {sector.distance}</p>
              <p>Signal: <span className="text-orange-600">{sector.signal}</span></p>
            </div>
          </article>
        ))}
      </div>
    </motion.section>
  );
}

function OriginPoint() {
  const [payloadType, setPayloadType] = useState<PayloadType>('text');
  const [radius, setRadius] = useState<RadiusValue>('10m');

  const radiusOptions: RadiusValue[] = ['5m', '10m', '50m'];

  return (
    <motion.section
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="p-4 md:p-6 space-y-4"
    >
      <header className="border-2 border-black bg-white p-4">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600">Dead Drop Deployment</p>
        <h2 className="mt-2 text-xl uppercase tracking-tight">Origin Point</h2>
      </header>

      <section className="border-2 border-black bg-white p-4 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-widest">Current Location</p>
          <MapPin size={14} className="text-orange-600" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <p className="border border-zinc-400 p-2">LAT: 26.664700 N</p>
          <p className="border border-zinc-400 p-2">LON: 87.271800 E</p>
        </div>
      </section>

      <section className="border-2 border-black bg-white p-4 space-y-4">
        <div>
          <p className="text-[10px] uppercase tracking-widest mb-2">Payload Type</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPayloadType('text')}
              className={`h-11 border-2 border-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 ${
                payloadType === 'text' ? 'bg-orange-600 text-white' : 'bg-white text-black'
              }`}
            >
              <Type size={14} />
              Text
            </button>
            <button
              type="button"
              onClick={() => setPayloadType('link')}
              className={`h-11 border-2 border-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 ${
                payloadType === 'link' ? 'bg-orange-600 text-white' : 'bg-white text-black'
              }`}
            >
              <Link size={14} />
              Link
            </button>
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-widest mb-2">Unlock Radius</p>
          <div className="grid grid-cols-3 border-2 border-black">
            {radiusOptions.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRadius(value)}
                className={`h-11 text-xs uppercase tracking-widest border-r-2 border-black last:border-r-0 ${
                  radius === value ? 'bg-orange-600 text-white' : 'bg-zinc-100 text-black'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="text-[10px] uppercase tracking-widest">Payload</span>
          <textarea
            className="mt-2 w-full min-h-28 border-2 border-black bg-zinc-100 p-3 text-sm focus:outline-none"
            placeholder={payloadType === 'text' ? 'Enter encrypted text payload...' : 'Paste destination URL...'}
          />
        </label>
      </section>

      <button
        type="button"
        className="w-full h-14 border-2 border-black bg-orange-600 text-white uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
      >
        Deploy Payload
      </button>
    </motion.section>
  );
}

type LogEntry = {
  id: string;
  timestamp: string;
  coordinates: string;
  message: string;
};

function ArchiveLogbook() {
  const logs: LogEntry[] = [
    {
      id: 'AR-118',
      timestamp: '2026-05-11 08:14:23',
      coordinates: '26.665120 N / 87.271010 E',
      message: 'Meet at old watchtower. Access key rotates every 24h.',
    },
    {
      id: 'AR-107',
      timestamp: '2026-05-08 19:02:40',
      coordinates: '26.662700 N / 87.268330 E',
      message: 'Payload contained map fragments for sector C9.',
    },
    {
      id: 'AR-093',
      timestamp: '2026-05-03 06:47:05',
      coordinates: '26.669920 N / 87.273540 E',
      message: 'Archive confirmed. Device handshake token decrypted.',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      className="p-4 md:p-6 space-y-4"
    >
      <header className="border-2 border-black bg-white p-4">
        <p className="text-[10px] uppercase tracking-widest text-zinc-600">Recovered Payloads</p>
        <h2 className="mt-2 text-xl uppercase tracking-tight">Archive Logbook</h2>
      </header>

      <div className="space-y-3">
        {logs.map((log, index) => (
          <motion.article
            key={log.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, type: 'spring', stiffness: 420, damping: 28 }}
            className="relative border-2 border-black bg-white p-4"
          >
            <div className="absolute right-3 top-3 border border-black px-2 py-1 text-[9px] tracking-widest uppercase text-green-700 bg-white rotate-[-8deg]">
              Intercepted
            </div>

            <div className="pr-24">
              <p className="text-[10px] uppercase tracking-widest text-zinc-500">{log.id}</p>
              <p className="mt-1 text-xs uppercase tracking-wide">{log.timestamp}</p>
              <p className="mt-2 text-xs uppercase tracking-wide">{log.coordinates}</p>
              <p className="mt-3 text-sm leading-relaxed">{log.message}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

type NavButtonProps = {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
};

function NavButton({ active, onClick, icon, label }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 transition-all ${
        active ? 'text-orange-600' : 'text-zinc-600 hover:text-black'
      }`}
      aria-pressed={active}
      type="button"
    >
      <div className={`p-2 border-2 border-black ${active ? 'bg-zinc-100' : 'bg-white'}`}>{icon}</div>
      <span className="text-[10px] uppercase tracking-widest">{label}</span>
    </button>
  );
}
