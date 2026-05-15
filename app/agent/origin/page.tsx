"use client";

import React, { useState } from 'react';

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
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [radiusIndex, setRadiusIndex] = useState(1);
  const [lastCode, setLastCode] = useState<string | null>(null);
  const [locStatus, setLocStatus] = useState<string | null>(null);

  const radiusOptions = ['5m', '10m', '25m', '50m', '100m'];

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
    // fallback to zeros if no coords
    const finalLat = lat || '0.000000';
    const finalLng = lng || '0.000000';
    const code = generateCode();
    setLastCode(code);

    // For now we just show the code; backend integration will persist it later
    console.log('Deployed', { code, finalLat, finalLng, radius: radiusOptions[radiusIndex], message });
    setMessage('');
  };

  return (
    <div className="p-4 sm:p-6 space-y-4">
      <div className="card-field space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-widest font-bold flex items-center gap-2">Origin Point</div>
          <button onClick={useCurrentLocation} className="btn-brutalist px-3 py-1 text-xs">Use Current Location</button>
        </div>
        <div className="divider-thick"></div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <label className="space-y-1">
            <div className="text-zinc-600 uppercase tracking-widest">LAT</div>
            <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="40.7128" className="input-brutalist w-full" />
          </label>
          <label className="space-y-1">
            <div className="text-zinc-600 uppercase tracking-widest">LNG</div>
            <input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-74.0060" className="input-brutalist w-full" />
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

      <button onClick={handleDeploy} disabled={!message.trim()} className="btn-brutalist bg-orange-600 text-white w-full py-3 disabled:opacity-50">Deploy Payload</button>

      {lastCode && (
        <div className="card-field text-center">
          <div className="text-xs uppercase tracking-widest text-zinc-600">Unlock Code</div>
          <div className="text-3xl sm:text-5xl font-mono font-bold tracking-widest mt-2">{lastCode.slice(0,3)} - {lastCode.slice(3)}</div>
        </div>
      )}
    </div>
  );
}
