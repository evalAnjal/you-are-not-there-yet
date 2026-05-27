"use client";

import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import RequireAuth from '../../../components/RequireAuth';

const LocationMapPicker = dynamic(() => import('./LocationMapPicker'), { ssr: false });

function generateCode(): string {
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  while (true) {
    const code = Array.from({ length: 6 }, () => characters[Math.floor(Math.random() * characters.length)]).join('');
    const hasLetter = /[A-Z]/.test(code);
    const hasNumber = /[0-9]/.test(code);
    if (hasLetter && hasNumber) return code;
  }
}

export default function OriginPage() {
  const [message, setMessage] = useState('');
  const [lat, setLat] = useState('26.664488');
  const [lng, setLng] = useState('87.274876');
  const [radiusIndex, setRadiusIndex] = useState(1);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [streakEnabled, setStreakEnabled] = useState(false);
  const [streakDays, setStreakDays] = useState<number>(3);
  const [locStatus, setLocStatus] = useState<string | null>(null);
  const [isMapOpen, setIsMapOpen] = useState(false);

  const radiusOptions = ['5m', '10m', '25m', '50m', '100m'];
  const googleMapsUrl = lat && lng ? `https://www.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}` : 'https://www.google.com/maps';
  const huntLink = typeof window !== 'undefined' && lastCode ? `${window.location.origin}/hunt/${lastCode}` : lastCode ? `/hunt/${lastCode}` : googleMapsUrl;
  const locationLabel = 'Itahari, Nepal';

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocStatus('Geolocation not supported');
      return;
    }
    setLocStatus('Acquiring...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6).toString());
        setLng(pos.coords.longitude.toFixed(6).toString());
        setLocStatus('Location set');
      },
      (err) => {
        setLocStatus('Permission denied');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleDeploy = () => {
    if (!message.trim()) return;
    (async () => {
      const finalLat = lat || '0.000000';
      const finalLng = lng || '0.000000';
      const code = generateCode();
      setLastCode(null);
      try {
        const rawToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
        const res = await fetch('/api/drops', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
          body: JSON.stringify({ code, lat: finalLat, lng: finalLng, radius: radiusOptions[radiusIndex], message, streak_required: streakEnabled ? streakDays : null }),
        });

        if (!res.ok) {
          const err = await res.json();
          console.error('Failed to save drop', err);
          setLocStatus('Failed to save deployment');
          return;
        }

        const data = await res.json();
        setLastCode(data.code || code);
        setMessage('');
        setLocStatus('Deployed');
      } catch (e) {
        console.error(e);
        setLocStatus('Deployment error');
      }
    })();
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="card-field space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">Origin Point</div>
          <div className="flex flex-wrap gap-2 justify-end">
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

      <div className="card-field space-y-2">
        <div className="text-xs uppercase tracking-widest font-bold">Unlock Radius</div>
        <div className="grid grid-cols-5 gap-2">
          {radiusOptions.map((radius, idx) => (
            <button key={radius} onClick={() => setRadiusIndex(idx)} className={`py-2 border-2 text-xs font-bold uppercase ${radiusIndex === idx ? 'border-black bg-orange-600 text-white' : 'border-black bg-white text-black'}`}>
              {radius}
            </button>
          ))}
        </div>
      </div>

      <div className="card-field space-y-2">
        <div className="text-xs uppercase tracking-widest font-bold">Message</div>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your payload..." className="input-brutalist w-full h-24 resize-none" />
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

      <button onClick={handleDeploy} disabled={!message.trim()} className="btn-brutalist bg-orange-600 text-white w-full py-3 disabled:opacity-50">Deploy Payload</button>

      {lastCode && (
        <div className="card-field text-center">
          <div className="text-xs uppercase tracking-widest text-zinc-600">Unlock Code</div>
          <div className="text-3xl sm:text-5xl font-mono font-bold tracking-widest mt-2">{lastCode.slice(0,3)} - {lastCode.slice(3)}</div>
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                navigator.clipboard.writeText(lastCode || '');
              }}
              className="btn-brutalist flex-1 py-2 text-xs"
            >
              Copy Code
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(huntLink);
              }}
              className="btn-brutalist flex-1 py-2 text-xs"
            >
              Copy Link
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
}
