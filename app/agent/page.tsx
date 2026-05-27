"use client";

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Archive, Radio, Zap, Copy, Check, X } from 'lucide-react';

const LocationMapPicker = dynamic(() => import('./origin/LocationMapPicker'), { ssr: false });

type ScreenTab = 'briefing' | 'origin' | 'archive';

interface DeployedDrop {
  code: string;
  timestamp: string;
  lat: string;
  lng: string;
  radius: string;
  message: string;
  currentStreak?: number;
  streakRequired?: number | null;
}

// ============================================================================
// UTILITY: Generate 6-character alphanumeric code
// ============================================================================
function generateCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

  while (true) {
    const code = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    const hasLetter = /[A-Z]/.test(code);
    const hasNumber = /[0-9]/.test(code);

    if (hasLetter && hasNumber) {
      return code;
    }
  }
}

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
// CODE CONFIRMATION SCREEN
// ============================================================================
function CodeConfirmation({
  drop,
  onClose,
}: {
  drop: DeployedDrop;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const huntUrl = typeof window !== 'undefined' && drop.code ? `${window.location.origin}/hunt/${drop.code}` : `/hunt/${drop.code}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(drop.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-between p-6 font-mono"
    >
      <div className="w-full space-y-6 pt-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="text-xs uppercase tracking-widest text-orange-600 font-bold">
            Payload Deployed
          </div>
          <div className="divider-thick"></div>
        </div>

        {/* Code Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.2 }}
          className="card-field text-center space-y-4"
        >
          <div className="text-xs uppercase tracking-widest text-zinc-600 font-bold">
            Unlock Code
          </div>
          <div className="bg-orange-600/5 p-3 sm:p-4 border-2 border-orange-600">
            <div className="font-mono font-bold text-3xl sm:text-5xl tracking-widest sm:tracking-widest leading-none whitespace-nowrap">
              {drop.code && drop.code.length >= 6 ? (
                <>{drop.code.slice(0,3)} - {drop.code.slice(3)}</>
              ) : (
                <>{drop.code}</>
              )}
            </div>
          </div>
          <button
            onClick={handleCopy}
            className="btn-brutalist w-full py-2 bg-white border-2 border-black flex items-center justify-center gap-2 active:translate-x-[2px] active:translate-y-[2px]"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Code
              </>
            )}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(huntUrl);
              setLinkCopied(true);
              setTimeout(() => setLinkCopied(false), 2000);
            }}
            className="btn-brutalist w-full py-2 bg-white border-2 border-black flex items-center justify-center gap-2 active:translate-x-[2px] active:translate-y-[2px]"
          >
            {linkCopied ? (
              <>
                <Check className="w-4 h-4" /> Link Copied
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Link
              </>
            )}
          </button>
        </motion.div>

        {/* Deployment Details */}
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
          className="card-field space-y-4"
        >
          <div className="text-xs uppercase tracking-widest font-bold">Deployment Details</div>
          <div className="divider-thick"></div>
          
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="text-zinc-600 uppercase tracking-widest font-bold">Location</div>
              <div className="font-mono">
                {drop.lat}°N, {drop.lng}°W
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-zinc-600 uppercase tracking-widest font-bold">Unlock Radius</div>
              <div className="font-mono">{drop.radius}</div>
            </div>
            
            <div className="space-y-1">
              <div className="text-zinc-600 uppercase tracking-widest font-bold">Timestamp</div>
              <div className="font-mono">{drop.timestamp}</div>
            </div>

            <div className="space-y-1">
              <div className="text-zinc-600 uppercase tracking-widest font-bold">Message</div>
              <div className="bg-zinc-50 p-2 border-2 border-zinc-300 text-xs">
                {drop.message}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.2 }}
        onClick={onClose}
        className="btn-brutalist bg-black text-white w-full py-3 mt-8 active:translate-x-[2px] active:translate-y-[2px]"
      >
        Close
      </motion.button>
    </motion.div>
  );
}

// ============================================================================
// BRIEFING ROOM
// ============================================================================
function BriefingRoom({ deployedDrops }: { deployedDrops: DeployedDrop[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full max-w-md mx-auto p-6 space-y-4"
    >
      <div className="card-field">
        <h2 className="text-sm uppercase tracking-widest font-bold">Your Deployments</h2>
      </div>

      {deployedDrops.length === 0 ? (
        <div className="card-field text-center py-6">
          <p className="text-xs uppercase tracking-widest text-zinc-600">No drops deployed yet</p>
        </div>
      ) : (
        deployedDrops.map((drop) => {
          const isFound = drop.code && drop.code.length ? drop.code.charCodeAt(0) % 2 === 0 : false;
          return (
            <div key={drop.code} className="card-field space-y-1">
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest font-mono">{drop.code && drop.code.length >= 6 ? `${drop.code.slice(0,3)}-${drop.code.slice(3)}` : drop.code}</span>
                <span className={`text-xs uppercase tracking-widest font-bold px-2 py-1 border-2 ${
                  isFound
                    ? 'border-orange-600 text-orange-600 bg-orange-600/5'
                    : 'border-zinc-300 text-zinc-600 bg-zinc-50'
                }`}>
                  {isFound ? 'FOUND' : 'WAITING'}
                </span>
              </div>
              <div className="text-xs text-zinc-600 font-mono">{drop.timestamp}</div>
            </div>
          );
        })
      )}
    </motion.div>
  );
}

// ============================================================================
// ORIGIN POINT (DROP CREATION)
// ============================================================================
function OriginPoint({
  onCodeGenerated,
}: {
  onCodeGenerated: (drop: DeployedDrop) => void;
}) {
  const [payloadType, setPayloadType] = useState<'text' | 'link'>('text');
  const [radiusIndex, setRadiusIndex] = useState(1);
  const [message, setMessage] = useState('');
  const [lat, setLat] = useState('26.664488');
  const [lng, setLng] = useState('87.274876');
  const [locStatus, setLocStatus] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [streakEnabled, setStreakEnabled] = useState(false);
  const [streakDays, setStreakDays] = useState<number>(3);
  const radiusOptions = ['5m', '10m', '25m', '50m', '100m'];
  const locationLabel = 'Itahari, Nepal';

  const googleMapsUrl = lat && lng ? `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}` : 'https://www.google.com/maps';

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('Geolocation not supported');
      return;
    }

    setLocStatus('Acquiring...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude.toFixed(6));
        setLng(position.coords.longitude.toFixed(6));
        setLocStatus('Location set');
      },
      () => {
        setLocStatus('Permission denied');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleDeploy = () => {
    if (!message.trim()) return;

    const now = new Date();
    const timestamp = now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0];
    const finalLat = lat || '40.712800';
    const finalLng = lng || '-74.006000';

    const payload = {
      code: generateCode(),
      lat: finalLat,
      lng: finalLng,
      radius: radiusOptions[radiusIndex],
      message,
      streak_required: streakEnabled ? streakDays : null,
    };

    // Try to POST to API; if not available, fallback to local behavior
    (async () => {
      try {
        const rawToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
        const res = await fetch('/api/drops', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          const drop: DeployedDrop = {
            code: created.code || payload.code,
            timestamp,
            lat: String(created.lat ?? payload.lat),
            lng: String(created.lng ?? payload.lng),
            radius: String(created.radius ?? payload.radius),
            message: created.message ?? payload.message,
          };
          onCodeGenerated(drop);
        } else {
          // fallback local
          const drop: DeployedDrop = {
            code: payload.code,
            timestamp,
            lat: payload.lat,
            lng: payload.lng,
            radius: payload.radius,
            message: payload.message,
          };
          onCodeGenerated(drop);
        }
      } catch (e) {
        const drop: DeployedDrop = {
          code: payload.code,
          timestamp,
          lat: payload.lat,
          lng: payload.lng,
          radius: payload.radius,
          message: payload.message,
        };
        onCodeGenerated(drop);
      }
    })();

    setMessage('');
  };

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
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Origin Point
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setIsMapOpen(true)} className="btn-brutalist px-3 py-1 text-xs">
              Pick on Map
            </button>
            <button onClick={useCurrentLocation} className="btn-brutalist px-3 py-1 text-xs">
              Use Current Location
            </button>
          </div>
        </div>
        <div className="divider-thick"></div>
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs uppercase tracking-widest">
          <span className="text-zinc-600">Default: {locationLabel}. Type coordinates manually or open the map picker.</span>
          <a href={googleMapsUrl} target="_blank" rel="noreferrer" className="font-bold underline underline-offset-4">
            Open in Google Maps
          </a>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <label className="space-y-1">
            <div className="text-zinc-600 uppercase tracking-widest">LAT</div>
            <input
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              placeholder="40.7128"
              inputMode="decimal"
              className="input-brutalist w-full"
            />
          </label>
          <label className="space-y-1">
            <div className="text-zinc-600 uppercase tracking-widest">LNG</div>
            <input
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              placeholder="-74.0060"
              inputMode="decimal"
              className="input-brutalist w-full"
            />
          </label>
        </div>
        {locStatus && <div className="text-xs text-zinc-600">{locStatus}</div>}
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
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter your payload..."
          className="input-brutalist w-full h-24 resize-none"
        />
      </div>

      <div className="card-field space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest font-bold">Streak Hunt</div>
          <div className="flex items-center gap-2 text-xs">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={streakEnabled} onChange={(e) => setStreakEnabled(e.target.checked)} />
              <span>Enable</span>
            </label>
          </div>
        </div>
        {streakEnabled && (
          <div className="text-xs">
            <div className="text-zinc-600 uppercase tracking-widest">Days required</div>
            <input type="number" min={1} value={streakDays} onChange={(e) => setStreakDays(Number(e.target.value || 1))} className="input-brutalist w-28" />
          </div>
        )}
      </div>

      {/* Deploy Button */}
      <button
        onClick={handleDeploy}
        disabled={!message.trim()}
        className="btn-brutalist bg-orange-600 text-white w-full py-4 sticky bottom-24 active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Deploy Payload
      </button>

      {isMapOpen && (
        <LocationMapPicker
          lat={lat}
          lng={lng}
          onPick={(nextLat, nextLng) => {
            setLat(nextLat);
            setLng(nextLng);
            setLocStatus('Location selected on map');
          }}
          onClose={() => setIsMapOpen(false)}
        />
      )}
    </motion.div>
  );
}

// ============================================================================
// ARCHIVE LOGBOOK
// ============================================================================
function ArchiveLogbook({ deployedDrops }: { deployedDrops: DeployedDrop[] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="w-full max-w-md mx-auto p-6 space-y-3 pb-28"
    >
      <div className="card-field">
        <h2 className="text-sm uppercase tracking-widest font-bold">Field Logbook</h2>
      </div>

      {deployedDrops.length === 0 ? (
        <div className="card-field text-center py-8">
          <p className="text-xs uppercase tracking-widest text-zinc-600">No drops deployed yet</p>
        </div>
      ) : (
        deployedDrops.map((drop) => (
          <div key={drop.code} className="card-field space-y-3">
            {/* Header with Code */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest font-mono">
                  {drop.code && drop.code.length >= 6 ? `${drop.code.slice(0,3)}-${drop.code.slice(3)}` : drop.code}
                </div>
                <div className="text-xs text-zinc-600 font-mono">{drop.timestamp}</div>
              </div>
              <div className="border-2 border-black px-2 py-1 transform -rotate-12">
                <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
                  DEPLOYED
                </span>
              </div>
            </div>

            <div className="divider-thick"></div>

            {/* Coordinates */}
            <div className="grid grid-cols-2 gap-3 font-mono text-xs">
              <div className="space-y-1">
                <div className="text-zinc-600 uppercase tracking-widest">Latitude</div>
                <div className="font-bold">{drop.lat}°N</div>
              </div>
              <div className="space-y-1">
                <div className="text-zinc-600 uppercase tracking-widest">Longitude</div>
                <div className="font-bold">{drop.lng}°W</div>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-1 text-xs">
              <div className="text-zinc-600 uppercase tracking-widest font-bold">Radius</div>
              <div className="font-mono">{drop.radius}</div>
            </div>

            {/* Message */}
            <div className="bg-zinc-50 p-3 border-2 border-zinc-300">
              <p className="text-xs font-mono">{drop.message}</p>
            </div>
            {drop.streakRequired ? (
              <div className="mt-2 text-xs">
                <div className="text-zinc-600 uppercase tracking-widest">Streak</div>
                <div className="font-bold">{(drop.currentStreak ?? 0)}/{drop.streakRequired} achieved</div>
              </div>
            ) : null}
          </div>
        ))
      )}
    </motion.div>
  );
}

// ============================================================================
// MAIN AGENT TERMINAL
// ============================================================================
export default function AgentTerminal() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('briefing');
  const [showBoot, setShowBoot] = useState(true);
  const [deployedDrops, setDeployedDrops] = useState<DeployedDrop[]>([]);
  const [selectedDrop, setSelectedDrop] = useState<DeployedDrop | null>(null);
  const router = useRouter();

  // Check auth on mount
  useEffect(() => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) router.replace('/login');
    } catch (e) {
      router.replace('/login');
    }
  }, [router]);

  // Fetch drops from backend on mount
  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const rawToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
        if (!token) return;

        const res = await fetch('/api/drops', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!res.ok) {
          console.error('Failed to fetch drops:', res.status);
          return;
        }
        
        const drops = await res.json();
        console.info('[AGENT] Fetched drops from backend:', drops.length);
        
        // Convert DB drops to DeployedDrop format
        const converted: DeployedDrop[] = drops.map((drop: any) => {
          const createdAt = drop.created_at ? new Date(drop.created_at) : new Date();
          const timestamp = createdAt.toISOString().split('T')[0] + ' ' + createdAt.toTimeString().split(' ')[0];
          return {
            code: drop.code || 'UNKNOWN',
            timestamp,
            lat: String(drop.lat || '0'),
            lng: String(drop.lng || '0'),
            radius: String(drop.radius || '10m'),
            message: drop.message || '',
            currentStreak: drop.current_streak ?? drop.currentStreak ?? 0,
            streakRequired: drop.streak_required ?? drop.streakRequired ?? null,
          };
        }).reverse(); // Show newest first
        
        setDeployedDrops(converted);
      } catch (e) {
        console.error('Error fetching drops:', e);
      }
    };
    
    fetchDrops();
  }, []);

  const navItems = [
    { id: 'briefing', icon: Radio, label: 'Briefing' },
    { id: 'origin', icon: MapPin, label: 'Origin' },
    { id: 'archive', icon: Archive, label: 'Archive' },
  ] as const;

  const handleCodeGenerated = (drop: DeployedDrop) => {
    setDeployedDrops([drop, ...deployedDrops]);
    setSelectedDrop(drop);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col overflow-hidden">
      <AnimatePresence mode="wait">
        {showBoot && (
          <TerminalBootSequence key="boot" onComplete={() => setShowBoot(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedDrop && (
          <CodeConfirmation
            key="codeConfirmation"
            drop={selectedDrop}
            onClose={() => setSelectedDrop(null)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="h-14 sm:h-16 px-4 sm:px-6 bg-white border-b-2 border-black flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest font-bold">Agent Terminal</span>
        <div className="flex items-center gap-1 text-xs text-orange-600">
          <Zap className="w-3 h-3" />
          <span>ACTIVE</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative overflow-y-auto pb-24 sm:pb-20 bg-white flex items-start justify-center">
        <AnimatePresence mode="wait">
          {activeTab === 'briefing' && <BriefingRoom key="briefing" deployedDrops={deployedDrops} />}
          {activeTab === 'origin' && <OriginPoint key="origin" onCodeGenerated={handleCodeGenerated} />}
          {activeTab === 'archive' && <ArchiveLogbook key="archive" deployedDrops={deployedDrops} />}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation - Icons Only */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black px-2 sm:px-4 py-2 sm:py-3 flex justify-around gap-1 sm:gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as ScreenTab)}
              className={`p-2 sm:p-3 border-2 transition-all ${
                isActive
                  ? 'border-black bg-orange-600 text-white shadow-brutalist'
                  : 'border-black bg-white text-black'
              }`}
              title={item.label}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
