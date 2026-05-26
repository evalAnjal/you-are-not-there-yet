"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '../../components/ToastProvider';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const showToast = useToast();

  const doRegister = async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const j = await res.json();
      if (!res.ok) {
        showToast(j.error || 'Register failed', 'error');
        return;
      }

      showToast('Registered — please log in.', 'success');
      router.push('/auth/login');
    } catch (e: any) {
      showToast(String(e), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto mt-[50vw]">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <div className="space-y-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" className="input-brutalist w-full" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" className="input-brutalist w-full" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" type="password" className="input-brutalist w-full" />
        <div className="flex gap-2">
          <button className="btn-brutalist px-4 py-2" onClick={doRegister} disabled={busy}>Register</button>
          <a href="/auth/login" className="btn-brutalist px-4 py-2">Back to Login</a>
        </div>
      </div>
    </div>
  );
}
