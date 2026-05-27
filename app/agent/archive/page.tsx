"use client";

import React, { useEffect, useState } from 'react';
import { useToast } from '../../components/ToastProvider';
import RequireAuth from '../../../components/RequireAuth';

export default function ArchivePage() {
  const [drops, setDrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const showToast = useToast();

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const rawToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
        const res = await fetch('/api/drops', { headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          showToast(j.error || 'Failed to load archive', 'error');
          return;
        }
        const data = await res.json();
        setDrops(Array.isArray(data) ? data : []);
      } catch (e) {
        showToast('Failed to load archive', 'error');
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [showToast]);

  return (
    <RequireAuth>
      <div className="p-4 max-w-3xl mx-auto">
        <h2 className="text-lg font-bold mb-3">Archive — All Drops</h2>
      {loading && <div className="text-xs text-zinc-500">Loading…</div>}
      {drops.length === 0 && !loading && (
        <div className="card-field border-2 border-zinc-300 p-6 text-center text-zinc-600">No archived drops</div>
      )}
      <div className="space-y-3 mt-3">
        {drops.map((d) => (
          <div key={d.code || d.id} className="card-field border-2 border-black p-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest">{d.code || '—'}</div>
                <div className="text-xs text-zinc-600 font-mono">{d.message || 'No message'}</div>
                {d.streak_required ? (
                  <div className="mt-1 text-xs font-bold">{(d.current_streak ?? 0)}/{d.streak_required} achieved</div>
                ) : null}
              </div>
              <div className="text-xs text-zinc-500 text-right">
                {d.lat != null && d.lng != null ? `${Number(d.lat).toFixed(4)}, ${Number(d.lng).toFixed(4)}` : 'No location'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </RequireAuth>
  );
}
