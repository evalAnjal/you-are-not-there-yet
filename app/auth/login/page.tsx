"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/ToastProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const showToast = useToast();

  const doLogin = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const j = await res.json();
      if (!res.ok) {
        showToast(j.error || 'Login failed', 'error');
        return;
      }

      localStorage.setItem('token', j.token);
      showToast('Login successful', 'success');
      router.push('/agent');
    } catch (e: any) {
      showToast(String(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-[50vw]">
        
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <div className="space-y-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" className="input-brutalist w-full" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" className="input-brutalist w-full" />
        <div className="flex gap-2">
          <button className="btn-brutalist px-4 py-2" onClick={doLogin} disabled={busy}>Login</button>
          <a href="/auth/register" className="btn-brutalist px-4 py-2">Register</a>
        </div>
      </div>
    </div>
  );
}
