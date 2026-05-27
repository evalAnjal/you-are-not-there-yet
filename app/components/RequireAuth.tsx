"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const rawToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const token = rawToken && rawToken !== 'null' && rawToken !== 'undefined' ? rawToken : null;
      if (!token) {
        router.replace('/login');
        return;
      }
      setReady(true);
    } catch (e) {
      router.replace('/login');
    }
  }, [router]);

  if (!ready) return null;
  return <>{children}</>;
}
