'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Activity, Smartphone, Compass, Globe, BookMarked } from 'lucide-react';
import { useParams } from 'next/navigation';

interface HuntState {
  distance: number | null;
  bearing: number | null;
  targetBearing: number | null;
  isUnlocked: boolean;
  targetLat: number | null;
  targetLng: number | null;
  userLat: number | null;
  userLng: number | null;
  locationAccuracy: number | null;
  speed: number | null;
  locationPermission: 'granted' | 'denied' | 'pending';
  orientationPermission: 'granted' | 'denied' | 'pending';
  hasDeviceOrientation: boolean;
  hasAccelerometer: boolean;
  isMoving: boolean;
  code: string;
  dropFound: boolean;
  dropMessage: string;
  discoveryRecorded: boolean;
  permissionHint: string;
}

type HuntTab = 'tracking' | 'public' | 'myhunts';
const HUNT_STATE_KEY = 'hunt-active-state-v1';

export default function HuntPage() {
  const params = useParams<{ payload?: string }>();
  const watchIdRef = useRef<number | null>(null);
  const autoSearchRef = useRef<string | null>(null);

  const [hunt, setHunt] = useState<HuntState>({
    distance: null,
    bearing: null,
    targetBearing: null,
    isUnlocked: false,
    targetLat: null,
    targetLng: null,
    userLat: null,
    userLng: null,
    locationAccuracy: null,
    speed: null,
    locationPermission: 'pending',
    orientationPermission: 'pending',
    hasDeviceOrientation: false,
    hasAccelerometer: false,
    isMoving: false,
    code: '',
    dropFound: false,
    dropMessage: '',
    discoveryRecorded: false,
    permissionHint: '',
  });

  const [activeTab, setActiveTab] = useState<HuntTab>('tracking');
  const [discoveries, setDiscoveries] = useState<any[]>([]);

  const unlockThreshold = 20; // 20 meters
  const payloadParam = typeof params?.payload === 'string' ? params.payload.trim() : '';
  const payloadCode = payloadParam ? payloadParam.toUpperCase() : '';

  // Initialize from persisted hunt state, else from query param/default.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HUNT_STATE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved?.dropFound && typeof saved?.code === 'string') {
          const parsedLat = saved.targetLat != null ? parseFloat(saved.targetLat) : undefined;
          const parsedLng = saved.targetLng != null ? parseFloat(saved.targetLng) : undefined;
          setHunt((prev) => ({
            ...prev,
            code: saved.code,
            targetLat: typeof parsedLat === 'number' && !isNaN(parsedLat) ? parsedLat : prev.targetLat,
            targetLng: typeof parsedLng === 'number' && !isNaN(parsedLng) ? parsedLng : prev.targetLng,
            dropFound: true,
            dropMessage: typeof saved.dropMessage === 'string' ? saved.dropMessage : '',
            discoveryRecorded: !!saved.discoveryRecorded,
          }));
          return;
        }
      }
    } catch {
      // Ignore invalid persisted payload
    }

    const params = new URLSearchParams(window.location.search);
    const lat = params.get('lat') ? parseFloat(params.get('lat')!) : 26.664488;
    const lng = params.get('lng') ? parseFloat(params.get('lng')!) : 87.274876;
    setHunt((prev) => ({ ...prev, targetLat: lat, targetLng: lng }));
  }, []);

  useEffect(() => {
    if (!payloadCode) return;

    setHunt((prev) => (prev.code === payloadCode ? prev : { ...prev, code: payloadCode }));

    if (autoSearchRef.current === payloadCode) return;
    autoSearchRef.current = payloadCode;

    void searchDropByCode(payloadCode);
  }, [payloadCode]);

  // Persist active hunt so refresh does not reset tracking progress.
  useEffect(() => {
    if (!hunt.dropFound) {
      localStorage.removeItem(HUNT_STATE_KEY);
      return;
    }

    const payload = {
      code: hunt.code,
      targetLat: hunt.targetLat,
      targetLng: hunt.targetLng,
      dropFound: hunt.dropFound,
      dropMessage: hunt.dropMessage,
      discoveryRecorded: hunt.discoveryRecorded,
    };
    localStorage.setItem(HUNT_STATE_KEY, JSON.stringify(payload));
  }, [hunt.code, hunt.targetLat, hunt.targetLng, hunt.dropFound, hunt.dropMessage, hunt.discoveryRecorded]);

  // Fetch user's discoveries (callable so we can refresh after recording a find)
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
        const normalized = Array.isArray(data)
          ? data.map((d: any) => ({
              ...d,
              lat: d.lat != null ? parseFloat(d.lat) : d.lat,
              lng: d.lng != null ? parseFloat(d.lng) : d.lng,
              distance_at_find: d.distance_at_find != null ? Number(d.distance_at_find) : d.distance_at_find,
            }))
          : [];
        setDiscoveries(normalized);
      }
    } catch (err) {
      console.error('Error fetching discoveries:', err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDiscoveries();
  }, []);

  // Search for drop by code
  const searchDropByCode = async (codeOverride?: string) => {
    const codeToSearch = (codeOverride ?? hunt.code).trim();
    if (!codeToSearch) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/compass/target', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: codeToSearch,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const tlat = data?.target?.lat != null ? parseFloat(data.target.lat) : null;
        const tlng = data?.target?.lng != null ? parseFloat(data.target.lng) : null;
        setHunt((prev) => ({
          ...prev,
          targetLat: typeof tlat === 'number' && !isNaN(tlat) ? tlat : prev.targetLat,
          targetLng: typeof tlng === 'number' && !isNaN(tlng) ? tlng : prev.targetLng,
          dropFound: true,
          dropMessage: '',
          discoveryRecorded: false,
          isUnlocked: false,
        }));
      } else {
        alert(data.error || 'Drop not found');
      }
    } catch (err) {
      console.error('Error searching for drop:', err);
      alert('Error searching for drop');
    }
  };

  // Request Location Permission
  const requestLocationPermission = async () => {
    try {
      if (!window.isSecureContext) {
        setHunt((prev) => ({
          ...prev,
          locationPermission: 'denied',
          permissionHint: 'Permissions require HTTPS on mobile. Open this app via https:// or localhost.',
        }));
        return;
      }

      if (!('geolocation' in navigator)) {
        setHunt((prev) => ({ ...prev, locationPermission: 'denied' }));
        return;
      }

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude, accuracy, speed } = position.coords;
          setHunt((prev) => ({
            ...prev,
            userLat: latitude,
            userLng: longitude,
            locationAccuracy: Number.isFinite(accuracy) ? accuracy : prev.locationAccuracy,
            speed: Number.isFinite(speed) ? speed : prev.speed,
            locationPermission: 'granted',
          }));
        },
        (error) => {
          setHunt((prev) => ({
            ...prev,
            locationPermission: 'denied',
            permissionHint: error?.message || 'Location permission denied',
          }));
          console.error('Geolocation error:', error);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } catch (e) {
      setHunt((prev) => ({
        ...prev,
        locationPermission: 'denied',
        permissionHint: 'Unable to request location permission',
      }));
    }
  };

  // Request Device Orientation Permission (iOS 13+)
  const requestOrientationPermission = async () => {
    try {
      if (!window.isSecureContext) {
        setHunt((prev) => ({
          ...prev,
          orientationPermission: 'denied',
          permissionHint: 'Compass permission requires HTTPS on mobile.',
        }));
        return;
      }

      if (typeof (DeviceOrientationEvent as any)?.requestPermission === 'function') {
        // iOS 13+ requires explicit permission
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setHunt((prev) => ({ ...prev, orientationPermission: 'granted', permissionHint: '' }));
          window.addEventListener('deviceorientation', handleDeviceOrientation);
        } else {
          setHunt((prev) => ({
            ...prev,
            orientationPermission: 'denied',
            permissionHint: 'Compass permission denied',
          }));
        }
      } else {
        // Android and older iOS - auto-listen
        setHunt((prev) => ({ ...prev, orientationPermission: 'granted', hasDeviceOrientation: true, permissionHint: '' }));
        window.addEventListener('deviceorientation', handleDeviceOrientation);
      }
    } catch (e) {
      setHunt((prev) => ({
        ...prev,
        orientationPermission: 'denied',
        permissionHint: 'Unable to request compass permission',
      }));
    }
  };

  // Request Motion Permission (iOS 13+)
  const requestMotionPermission = async () => {
    try {
      if (!window.isSecureContext) {
        setHunt((prev) => ({
          ...prev,
          permissionHint: 'Motion permission requires HTTPS on mobile.',
        }));
        return;
      }

      if (typeof (DeviceMotionEvent as any)?.requestPermission === 'function') {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission === 'granted') {
          setHunt((prev) => ({ ...prev, hasAccelerometer: true, permissionHint: '' }));
          window.addEventListener('devicemotion', handleDeviceMotion);
        }
      } else {
        setHunt((prev) => ({ ...prev, hasAccelerometer: true, permissionHint: '' }));
        window.addEventListener('devicemotion', handleDeviceMotion);
      }
    } catch (e) {
      setHunt((prev) => ({ ...prev, permissionHint: 'Unable to request motion permission' }));
      console.error('Motion permission error:', e);
    }
  };

  const requestAllPermissions = async () => {
    await requestLocationPermission();
    await requestOrientationPermission();
    await requestMotionPermission();
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null && 'geolocation' in navigator) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = null;
    };
  }, []);

  // Handle device orientation (compass/bearing)
  const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
    const compassHeading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number }).webkitCompassHeading;
    const alpha = event.alpha ?? 0;
    const heading = typeof compassHeading === 'number' ? compassHeading : (alpha + 360) % 360;
    setHunt((prev) => ({ ...prev, bearing: Math.round(heading) }));
  };

  // Handle device motion (accelerometer)
  const handleDeviceMotion = (event: DeviceMotionEvent) => {
    const acc = event.accelerationIncludingGravity ?? event.acceleration;
    const accelMagnitude = Math.sqrt(
      (acc?.x || 0) ** 2 + (acc?.y || 0) ** 2 + (acc?.z || 0) ** 2
    );
    setHunt((prev) => ({
      ...prev,
      isMoving: accelMagnitude > 12 || (prev.speed ?? 0) > 0.5,
    }));
  };

  // Calculate distance using Haversine formula
  useEffect(() => {
    if (hunt.userLat != null && hunt.userLng != null && hunt.targetLat != null && hunt.targetLng != null) {
      const R = 6371000; // Earth's radius in meters
      const dLat = ((hunt.targetLat - hunt.userLat) * Math.PI) / 180;
      const dLon = ((hunt.targetLng - hunt.userLng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((hunt.userLat * Math.PI) / 180) *
          Math.cos((hunt.targetLat * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = Math.round(R * c);

      // Calculate bearing
      const y = Math.sin(dLon) * Math.cos(hunt.targetLat * (Math.PI / 180));
      const x =
        Math.cos(hunt.userLat * (Math.PI / 180)) *
          Math.sin(hunt.targetLat * (Math.PI / 180)) -
        Math.sin(hunt.userLat * (Math.PI / 180)) *
          Math.cos(hunt.targetLat * (Math.PI / 180)) *
          Math.cos(dLon);
      const bearing = (Math.atan2(y, x) * 180) / Math.PI;
      const normalizedBearing = (bearing + 360) % 360;

      setHunt((prev) => ({
        ...prev,
        distance,
        targetBearing: Math.round(normalizedBearing),
        isUnlocked: distance <= unlockThreshold,
      }));
    }
  }, [hunt.userLat, hunt.userLng, hunt.targetLat, hunt.targetLng]);

  // Record discovery only when player reaches the unlock threshold.
  useEffect(() => {
    const recordDiscovery = async () => {
      if (!hunt.code.trim() || hunt.userLat == null || hunt.userLng == null) return;
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/compass', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            code: hunt.code.trim(),
            lat: hunt.userLat,
            lng: hunt.userLng,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setHunt((prev) => ({
            ...prev,
            discoveryRecorded: true,
            dropMessage: data?.drop?.message || '',
          }));
          // Append the newly recorded discovery to the list so UI updates immediately
          try {
            const disc = data?.discovery;
            const drop = data?.drop;
            if (disc && drop) {
              const newEntry = {
                ...disc,
                lat: drop.lat != null ? parseFloat(drop.lat) : drop.lat,
                lng: drop.lng != null ? parseFloat(drop.lng) : drop.lng,
                distance_at_find: disc.distance_at_find != null ? Number(disc.distance_at_find) : disc.distance_at_find,
                message: drop.message || drop.message,
              };
              setDiscoveries((prev) => [newEntry, ...(prev || [])]);
            } else {
              // fallback: re-fetch full list
              fetchDiscoveries();
            }
          } catch (e) {
            fetchDiscoveries();
          }
          return;
        }

        if (res.status === 400 && String(data?.error || '').toLowerCase().includes('already found')) {
          setHunt((prev) => ({
            ...prev,
            discoveryRecorded: true,
            dropMessage: data?.drop?.message || prev.dropMessage,
          }));
          // ensure discoveries list is up-to-date
          fetchDiscoveries();
        }
      } catch (err) {
        console.error('Error recording discovery:', err);
      }
    };

    if (hunt.dropFound && hunt.isUnlocked && !hunt.discoveryRecorded) {
      recordDiscovery();
    }
  }, [hunt.dropFound, hunt.isUnlocked, hunt.discoveryRecorded, hunt.code, hunt.userLat, hunt.userLng]);

  const getSignalColor = () => (hunt.distance && hunt.distance <= unlockThreshold ? 'text-orange-600' : 'text-zinc-900');
  const getBgColor = () => (hunt.distance && hunt.distance <= unlockThreshold ? 'bg-orange-600/5' : 'bg-white');
  const getBorderColor = () => (hunt.distance && hunt.distance <= unlockThreshold ? 'border-orange-600' : 'border-black');
  const isMinimalTracking =
    hunt.locationPermission === 'granted' && hunt.orientationPermission === 'granted';
  const compassRotate = hunt.targetBearing != null && hunt.bearing != null ? (hunt.targetBearing - hunt.bearing + 360) % 360 : hunt.targetBearing ?? 0;
  const locationReadout = hunt.locationAccuracy != null ? `±${Math.round(hunt.locationAccuracy)}m` : 'Acquiring position';

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col items-center justify-between p-3 sm:p-4">
      {/* Header */}
      <header className="w-full flex justify-between items-center py-3 sm:py-4 border-b-2 border-black">
        <span className="text-xs tracking-widest uppercase font-bold">
          {activeTab === 'tracking' ? (
            <span className="inline-flex items-center gap-2"><Compass className="w-3 h-3" /> Hunt Mode</span>
          ) : activeTab === 'public' ? (
            <span className="inline-flex items-center gap-2"><Globe className="w-3 h-3" />Public Hunts</span>
          ) : (
            <span className="inline-flex items-center gap-2"><BookMarked className="w-3 h-3" />My Hunts</span>
          )}
        </span>
        <div className={`text-xs border-2 ${hunt.isMoving && activeTab === 'tracking' ? 'border-orange-600 text-orange-600' : 'border-black'} px-2 sm:px-3 py-1 font-mono font-bold`}>
          {activeTab === 'tracking' ? (hunt.isMoving ? '◆ MOVING' : '○ STATIC') : activeTab === 'public' ? 'COMING SOON' : discoveries.length > 0 ? `✓ ${discoveries.length}` : '○ NONE'}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col overflow-y-auto pb-24 sm:pb-20">
        {activeTab === 'tracking' && (
          <div className="flex flex-col items-center justify-start w-full">
            <div className="w-full max-w-md space-y-2 pt-3">
              {/* Code Input */}
              <div className="card-field space-y-2 border-2 border-black bg-white">
                <label className="text-xs uppercase tracking-widest font-bold">Enter Drop Code</label>
                {(hunt.locationPermission !== 'granted' || hunt.orientationPermission !== 'granted') && (
                  <button
                    onClick={requestAllPermissions}
                    className="w-full border-2 border-black py-2 bg-black text-white text-xs uppercase tracking-widest font-bold"
                  >
                    Enable Hunt Sensors
                  </button>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g., ABC123"
                    value={hunt.code}
                    onChange={(e) => setHunt((prev) => ({ ...prev, code: e.target.value.toUpperCase() }))}
                    className="flex-1 border-2 border-black px-3 py-2 text-xs uppercase tracking-widest font-mono"
                    maxLength={6}
                  />
                  <button
                    onClick={() => searchDropByCode()}
                    disabled={!hunt.code.trim() || hunt.locationPermission !== 'granted'}
                    className="border-2 border-black px-3 py-2 bg-orange-600 text-white text-xs uppercase tracking-widest font-bold hover:bg-orange-700 disabled:bg-zinc-400 active:translate-x-[1px] active:translate-y-[1px]"
                  >
                    Search
                  </button>
                </div>
                {hunt.dropFound && (
                  <div className="text-xs bg-zinc-100 border-2 border-zinc-300 text-zinc-700 p-2 font-bold uppercase tracking-widest">
                    Hunt Started. Track the signal.
                  </div>
                )}
                {hunt.permissionHint && (
                  <div className="text-xs bg-amber-50 border-2 border-amber-400 text-amber-800 p-2 font-bold">
                    {hunt.permissionHint}
                  </div>
                )}
              </div>

              {!isMinimalTracking && (
                <>
                  <div className="card-field space-y-2 border-2 border-black bg-white">
                    <div className="flex justify-between items-center">
                      <label className="text-xs uppercase tracking-widest font-bold">Location Sensor</label>
                      <span className={`text-xs uppercase tracking-widest font-bold ${hunt.locationPermission === 'granted' ? 'text-green-600' : hunt.locationPermission === 'denied' ? 'text-red-600' : 'text-zinc-600'}`}>
                        {hunt.locationPermission === 'granted' ? 'ACTIVE' : hunt.locationPermission === 'denied' ? 'DENIED' : 'PENDING'}
                      </span>
                    </div>
                    {hunt.locationPermission !== 'granted' && (
                      <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                        GPS access will be requested by Enable Hunt Sensors
                      </div>
                    )}
                    {hunt.userLat != null && hunt.userLng != null && (
                      <div className="text-xs font-mono text-zinc-600">
                        {hunt.userLat.toFixed(5)}, {hunt.userLng.toFixed(5)}
                      </div>
                    )}
                  </div>

                  <div className="card-field space-y-2 border-2 border-black bg-white">
                    <div className="flex justify-between items-center">
                      <label className="text-xs uppercase tracking-widest font-bold">Compass Sensor</label>
                      <span className={`text-xs uppercase tracking-widest font-bold ${hunt.orientationPermission === 'granted' ? 'text-green-600' : hunt.orientationPermission === 'denied' ? 'text-red-600' : 'text-zinc-600'}`}>
                        {hunt.orientationPermission === 'granted' ? 'ACTIVE' : hunt.orientationPermission === 'denied' ? 'DENIED' : 'PENDING'}
                      </span>
                    </div>
                    {hunt.orientationPermission !== 'granted' && (
                      <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                        Compass access will be requested by Enable Hunt Sensors
                      </div>
                    )}
                  </div>

                  <div className="card-field space-y-2 border-2 border-black bg-white">
                    <div className="flex justify-between items-center">
                      <label className="text-xs uppercase tracking-widest font-bold">Motion Sensor</label>
                      <span className={`text-xs uppercase tracking-widest font-bold ${hunt.hasAccelerometer ? 'text-green-600' : 'text-zinc-600'}`}>
                        {hunt.hasAccelerometer ? 'ACTIVE' : 'AVAILABLE'}
                      </span>
                    </div>
                    {!hunt.hasAccelerometer && (
                      <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">
                        Motion access will be requested by Enable Hunt Sensors
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Distance Display */}
            <div className={`text-center w-full px-2 ${isMinimalTracking ? 'pt-3 gap-4' : 'pt-2 gap-8 sm:gap-16'} flex flex-col items-center`}>
              <div className={`card-field ${getBgColor()} border-2 ${getBorderColor()}`}>
                <h1 className={`text-4xl sm:text-6xl font-bold ${getSignalColor()}`}>
                  {hunt.distance !== null ? hunt.distance : '--'}
                  <span className="text-lg sm:text-2xl ml-2">m</span>
                </h1>
                <div className="divider-thick my-3"></div>
                <p className="text-xs uppercase tracking-widest text-zinc-600">
                  {hunt.isUnlocked ? '✓ TARGET REACHED' : '○ Distance to Target'}
                </p>
              </div>

              {/* Compass Circle with Real Bearing */}
              <div className={`relative w-56 h-56 sm:w-72 sm:h-72 border-4 ${getBorderColor()} ${getBgColor()} flex items-center justify-center`}>
                {/* Cardinal Points */}
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">
                  <span className="absolute top-4">N</span>
                  <span className="absolute bottom-4">S</span>
                  <span className="absolute left-4">W</span>
                  <span className="absolute right-4">E</span>
                </div>

                {/* Rotating Bearing Indicator (from device orientation) */}
                <motion.div
                  animate={{ rotate: compassRotate }}
                  transition={{ duration: 0.1, type: 'tween' }}
                  className="absolute w-full h-full flex items-start justify-center pt-8"
                >
                  <div className={`${getSignalColor()}`}>
                    {hunt.isUnlocked ? (
                      <Unlock className="w-6 h-6" strokeWidth={3} />
                    ) : (
                      <Lock className="w-6 h-6" strokeWidth={3} />
                    )}
                  </div>
                </motion.div>

                {/* Center Crosshair */}
                <div className="w-4 h-4 bg-black border-2 border-white z-10"></div>
              </div>

              {isMinimalTracking && (
                <div className="w-full max-w-md grid grid-cols-3 gap-2 text-[10px] uppercase tracking-widest">
                  <div className="border-2 border-black py-2">GPS OK</div>
                  <div className="border-2 border-black py-2">COMPASS OK</div>
                  <div className={`border-2 py-2 ${hunt.isMoving ? 'border-orange-600 text-orange-600' : 'border-black'}`}>
                    {hunt.isMoving ? 'MOVING' : 'STATIC'}
                  </div>
                </div>
              )}

              {/* Unlock Message */}
              {hunt.isUnlocked && (
                <div className="card-field w-full bg-orange-600/5 border-2 border-orange-600">
                  <div className="flex items-center gap-2 justify-center">
                    <Unlock className="w-5 h-5 text-orange-600" />
                    <span className="text-xs uppercase tracking-widest font-bold text-orange-600">
                      Payload Unlocked
                    </span>
                  </div>
                  {hunt.dropMessage && (
                    <div className="mt-2 text-xs text-center text-zinc-700 font-bold">
                      {hunt.dropMessage}
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isMinimalTracking && (
              <div className="w-full max-w-md space-y-2 pb-2">
                <div className="card-field text-xs space-y-1 bg-zinc-50 border-2 border-zinc-300">
                  <div className="font-bold uppercase">Sensor Status</div>
                  <div className="font-mono text-zinc-600">
                    {hunt.locationPermission === 'granted' && hunt.userLat != null ? `Loc: ${locationReadout}` : 'Waiting for location...'}
                  </div>
                  <div className="font-mono text-zinc-600">
                    {hunt.orientationPermission === 'granted' && hunt.bearing != null ? `Bearing: ${hunt.bearing}°` : 'Waiting for compass...'}
                  </div>
                  <div className="font-mono text-zinc-600">
                    {hunt.hasAccelerometer ? `Motion: ${hunt.isMoving ? 'MOVING' : 'STATIC'}` : 'Accelerometer inactive'}
                  </div>
                </div>
              </div>
            )}
            </div>
        )}

        {activeTab === 'public' && (
          <div className="w-full max-w-md p-4">
            <div className="card-field text-center py-12 border-2 border-zinc-300">
              <div className="text-4xl mb-4">🌍</div>
              <div className="text-xs uppercase tracking-widest font-bold text-zinc-600 mb-2">Public Hunts</div>
              <div className="text-xs text-zinc-500">Coming soon...</div>
            </div>
          </div>
        )}

        {activeTab === 'myhunts' && (
          <div className="w-full max-w-md p-4 space-y-3">
            {discoveries.length > 0 ? (
              discoveries.map((d) => (
                <div key={d.id} className="card-field space-y-2 border-2 border-black">
                  <div className="flex justify-between items-start">
                    <div>
                          <div className="text-xs font-bold uppercase tracking-widest"><Compass className="inline w-4 h-4 mr-2"/>{d.message || 'Unknown Drop'}</div>
                      <div className="text-xs text-zinc-600 font-mono mt-1">
                        {d.lat?.toFixed(4)}, {d.lng?.toFixed(4)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-green-600 font-bold">
                        {d.distance_at_find ? (d.distance_at_find * 1000).toFixed(0) + 'm' : '—'}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {new Date(d.found_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="card-field text-center py-12 border-2 border-zinc-300">
                <div className="text-4xl mb-4"><BookMarked className="inline w-10 h-10"/></div>
                <div className="text-xs uppercase tracking-widest font-bold text-zinc-600">No hunts yet</div>
              </div>
            )}
          </div>
        )}

      {/* Bottom Navigation Bar */}
        </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-black px-2 sm:px-4 py-2 sm:py-3 flex justify-around gap-1 sm:gap-2">
        <button
          onClick={() => setActiveTab('tracking')}
          className={`p-2 sm:p-3 border-2 transition-all ${
            activeTab === 'tracking'
              ? 'border-black bg-orange-600 text-white shadow-brutalist'
              : 'border-black bg-white text-black'
          }`}
          title="Tracking"
        >
          <Compass className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => setActiveTab('public')}
          className={`p-2 sm:p-3 border-2 transition-all ${
            activeTab === 'public'
              ? 'border-black bg-orange-600 text-white shadow-brutalist'
              : 'border-black bg-white text-black'
          }`}
          title="Public Hunts"
        >
          <Globe className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>
        <button
          onClick={() => setActiveTab('myhunts')}
          className={`p-2 sm:p-3 border-2 transition-all ${
            activeTab === 'myhunts'
              ? 'border-black bg-orange-600 text-white shadow-brutalist'
              : 'border-black bg-white text-black'
          }`}
          title="My Hunts"
        >
          <BookMarked className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
        </button>
      </nav>
    </div>
  );
}
