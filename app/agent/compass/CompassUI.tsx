'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Drop {
  id: string;
  code: string;
  lat: number;
  lng: number;
  message: string;
  radius: string;
  created_by: string;
  created_at: string;
}

interface Discovery {
  id: string;
  drop_id: string;
  found_by: string;
  distance_at_find: number;
  found_at: string;
  code: string;
  lat: number;
  lng: number;
  message: string;
  radius: string;
}

export default function CompassUI() {
  const [code, setCode] = useState('');
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [foundDrop, setFoundDrop] = useState<Drop | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [foundDrops, setFoundDrops] = useState<Discovery[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [useGPS, setUseGPS] = useState(false);

  // Get user's current location
  const getLocation = () => {
    setUseGPS(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLat(position.coords.latitude);
          setUserLng(position.coords.longitude);
          setUseGPS(false);
        },
        (err) => {
          setError('Could not get location: ' + err.message);
          setUseGPS(false);
        }
      );
    } else {
      setError('Geolocation not supported');
      setUseGPS(false);
    }
  };

  // Fetch user's discoveries on mount
  useEffect(() => {
    const fetchDiscoveries = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('/api/compass', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setFoundDrops(data);
        }
      } catch (err) {
        console.error('Error fetching discoveries:', err);
      }
    };
    fetchDiscoveries();
  }, []);

  // Hunt for drop
  const handleHunt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Enter a drop code');
      return;
    }

    if (!userLat || !userLng) {
      setError('Location required. Get GPS first.');
      return;
    }

    setLoading(true);
    setError(null);
    setFoundDrop(null);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/compass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: code.trim(),
          lat: userLat,
          lng: userLng,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Hunt failed');
        if (data.drop) {
          setFoundDrop(data.drop);
          setDistance(data.distance);
        }
      } else {
        setFoundDrop(data.drop);
        setDistance(data.distance);
        setCode('');
        // Add to found drops list
        setFoundDrops([data.discovery, ...foundDrops]);
      }
    } catch (err: any) {
      setError(err.message || 'Hunt failed');
    } finally {
      setLoading(false);
    }
  };

  const heading = userLat && foundDrop
    ? Math.atan2(
        foundDrop.lng - userLng,
        foundDrop.lat - userLat
      ) * (180 / Math.PI)
    : 0;

  return (
    <div className="flex flex-col gap-6 w-full max-w-2xl">
      {/* Location Section */}
      <div className="bg-slate-100 p-4 rounded-lg border border-slate-300">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-slate-800">Your Location</h3>
          <button
            onClick={getLocation}
            disabled={useGPS}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-slate-400"
          >
            {useGPS ? 'Getting GPS...' : 'Get GPS'}
          </button>
        </div>
        {userLat && userLng ? (
          <div className="text-xs text-slate-700 mono font-mono">
            {userLat.toFixed(6)}, {userLng.toFixed(6)}
          </div>
        ) : (
          <div className="text-xs text-slate-500">No location — tap Get GPS</div>
        )}
      </div>

      {/* Hunt Form */}
      <form onSubmit={handleHunt} className="flex flex-col gap-3 bg-slate-50 p-4 rounded-lg border border-slate-300">
        <input
          type="text"
          placeholder="Enter drop code..."
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={loading || !userLat || !userLng}
          className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:bg-slate-400 font-semibold"
        >
          {loading ? 'Hunting...' : 'Start Hunt'}
        </button>
        {error && <div className="text-sm text-red-600">{error}</div>}
      </form>

      {/* Compass & Distance */}
      {foundDrop && distance !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-blue-50 p-6 rounded-lg border border-blue-300 flex flex-col items-center gap-4"
        >
          {/* Compass Circle */}
          <div className="relative w-32 h-32 border-4 border-blue-400 rounded-full flex items-center justify-center bg-white">
            <div className="absolute text-xs font-bold text-slate-600">N</div>
            <motion.div
              animate={{ rotate: heading }}
              transition={{ type: 'spring', damping: 20 }}
              className="absolute w-1 h-12 bg-red-600 origin-bottom rounded-full"
            />
          </div>

          {/* Distance */}
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-700">
              {(distance * 1000).toFixed(0)}m
            </div>
            <div className="text-xs text-slate-600 mt-1">away</div>
          </div>

          {/* Drop Details */}
          <div className="w-full bg-white p-3 rounded border border-blue-200 text-xs">
            <div className="font-semibold text-slate-800 mb-2">📌 {foundDrop.message || 'Unnamed'}</div>
            <div className="text-slate-700 mono font-mono text-xs">
              {foundDrop.lat.toFixed(4)}, {foundDrop.lng.toFixed(4)}
            </div>
            {foundDrop.radius && (
              <div className="text-slate-600 text-xs mt-1">Radius: {foundDrop.radius}</div>
            )}
          </div>
        </motion.div>
      )}

      {/* Found Drops List */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-300">
        <h3 className="font-semibold text-sm text-slate-800 mb-3">
          Your Finds ({foundDrops.length})
        </h3>
        {foundDrops.length > 0 ? (
          <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
            {foundDrops.map((discovery) => (
              <div
                key={discovery.id}
                className="bg-white p-3 rounded border border-slate-200 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-slate-800">🎯 {discovery.message || 'Unnamed'}</div>
                    <div className="text-slate-600 mono font-mono text-xs mt-1">
                      {discovery.lat.toFixed(4)}, {discovery.lng.toFixed(4)}
                    </div>
                  </div>
                  <div className="text-right">
                    {discovery.distance_at_find && (
                      <div className="text-green-600 font-semibold">
                        {(discovery.distance_at_find * 1000).toFixed(0)}m
                      </div>
                    )}
                    <div className="text-slate-500 text-xs">
                      {new Date(discovery.found_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500">No drops found yet</div>
        )}
      </div>
    </div>
  );
}
