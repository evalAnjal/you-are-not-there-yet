"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type ToastType = "success" | "error" | "info";
type Toast = { id: number; message: string; type?: ToastType };

const ToastContext = createContext<{ showToast: (msg: string, type?: ToastType) => void } | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const showToast = (message: string, type: ToastType = "info") => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const t: Toast = { id, message, type };
    setToasts((s) => [t, ...s]);
    window.setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
    }, 4000);
  };

  const value = useMemo(() => ({ showToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-2 items-end">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-xs w-full px-3 py-2 rounded border-2 shadow-md font-mono text-sm ${
              t.type === "success" ? "bg-green-50 border-green-400 text-green-800" : t.type === "error" ? "bg-red-50 border-red-400 text-red-800" : "bg-zinc-50 border-zinc-300 text-zinc-800"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.showToast;
}

export default ToastProvider;
