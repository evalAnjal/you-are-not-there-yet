'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Shield,
  Compass,
  Lock,
  MapPinned,
  Radar,
  Route,
  ScanSearch,
} from 'lucide-react';

const featureCards = [
  {
    title: 'Dead-drop tracking',
    description: 'Find payloads by code, track the signal, and record a discovery when you arrive.',
    icon: MapPinned,
  },
  {
    title: 'Sensor compass',
    description: 'Use live device location, orientation, and motion data in the hunt interface.',
    icon: Compass,
  },
  {
    title: 'Secure payload flow',
    description: 'Registration, login, and discovery logs are backed by the app routes and database.',
    icon: Shield,
  },
];

const metrics = [
  { label: 'Mode', value: 'Hunt / Developer' },
  { label: 'Signal', value: 'Live + Sensor Driven' },
  { label: 'Theme', value: 'Brutalist Tactical UI' },
];

const ctaButtons = [
  { href: '/hunt', label: 'Enter Hunt Mode', icon: Radar, primary: true },
  { href: '/developer', label: 'Open Developer Panel', icon: Lock, primary: false },
  { href: '/auth/login', label: 'Log In', icon: ScanSearch, primary: false },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#fff8f2_0%,#ffffff_30%,#fff_100%)] text-zinc-900">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between border-b-2 border-black py-4">
          <div className="space-y-1">
            <p className="text-[10px] uppercase tracking-[0.35em] text-orange-600 font-bold">You Are Not There Yet</p>
            <h1 className="text-sm uppercase tracking-[0.3em] font-bold">Payload Navigation System</h1>
          </div>
          <div className="hidden sm:flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-[10px] uppercase tracking-[0.35em] font-bold shadow-brutalist">
            <Route className="h-4 w-4 text-orange-600" />
            Showcase Ready
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-10 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-[10px] uppercase tracking-[0.35em] font-bold shadow-brutalist">
                <Compass className="h-4 w-4 text-orange-600" />
                Live dead-drop experience
              </div>

              <div className="max-w-3xl space-y-4">
                <h2 className="text-5xl font-black uppercase tracking-[-0.05em] text-zinc-950 sm:text-6xl lg:text-7xl">
                  Find the signal.
                  <span className="block text-orange-600">Unlock the payload.</span>
                </h2>
                <p className="max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg">
                  A tactical dead-drop showcase built for the browser: hunt by code, use real sensors,
                  and expose the logic behind each find with a stripped-down brutalist interface.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {ctaButtons.map((button, index) => {
                  const Icon = button.icon;
                  return (
                    <Link
                      key={button.href}
                      href={button.href}
                      className={`group inline-flex items-center gap-2 border-2 border-black px-4 py-3 text-xs uppercase tracking-[0.28em] font-bold transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
                        button.primary
                          ? 'bg-orange-600 text-white shadow-brutalist hover:bg-orange-700'
                          : 'bg-white text-zinc-900 shadow-brutalist hover:bg-zinc-50'
                      }`}
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <Icon className={`h-4 w-4 ${button.primary ? 'text-white' : 'text-orange-600'}`} />
                      {button.label}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  );
                })}
              </div>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div key={metric.label} className="card-field bg-white/90">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">{metric.label}</p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-zinc-900">{metric.value}</p>
                </div>
              ))}
            </div>
          </div>

          <motion.aside
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <div className="card-field border-2 border-black bg-white shadow-brutalist-lg">
              <div className="flex items-center justify-between border-b-2 border-black pb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">System Status</p>
                  <h3 className="mt-1 text-lg uppercase tracking-[0.2em] font-black">Signal Online</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center border-2 border-black bg-orange-600/10 shadow-brutalist">
                  <Radar className="h-6 w-6 text-orange-600" />
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm leading-6 text-zinc-700">
                <p>
                  The project mixes a code-based hunt flow, real sensor input, and authenticated routes,
                  all wrapped in a minimal showcase shell.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="border-2 border-black bg-zinc-50 p-3">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Core flow</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] font-bold">Login, hunt, record</p>
                  </div>
                  <div className="border-2 border-black bg-zinc-50 p-3">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Visual style</p>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] font-bold">Clean brutalism</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {featureCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="card-field border-2 border-black bg-white shadow-brutalist">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-black bg-orange-600/10">
                        <Icon className="h-5 w-5 text-orange-600" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm uppercase tracking-[0.22em] font-bold">{card.title}</h4>
                        <p className="text-sm leading-6 text-zinc-600">{card.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.aside>
        </section>

        <section className="grid gap-4 border-t-2 border-black py-6 sm:grid-cols-3">
          <div className="card-field bg-white shadow-brutalist">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">1. Authenticate</p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              Use the login and register routes to access the system and keep payloads tied to users.
            </p>
          </div>
          <div className="card-field bg-white shadow-brutalist">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">2. Hunt</p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              Enter a drop code, allow sensors, and navigate by compass and distance.
            </p>
          </div>
          <div className="card-field bg-white shadow-brutalist">
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">3. Prove it</p>
            <p className="mt-2 text-sm leading-6 text-zinc-700">
              Reach the unlock radius and the discovery gets recorded through the API.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}