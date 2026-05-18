'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Compass,
  Footprints,
  Globe,
  Lock,
  MapPin,
  Radar,
  Route,
  ScanSearch,
  Shield,
  Sparkles,
  Target,
} from 'lucide-react';

const storySteps = [
  {
    eyebrow: 'Chapter 01',
    title: "Let's play a game.",
    body:
      'A dead-drop challenge with a clean, tactical interface. The whole experience is built to feel like a story unfolding one screen at a time.',
    accent: 'from-orange-600/20 to-transparent',
  },
  {
    eyebrow: 'Chapter 02',
    title: 'I give you a location.',
    body:
      'An origin point gets deployed on the map, a code gets generated, and the signal begins. The location is the clue, not the answer.',
    accent: 'from-zinc-950/10 to-transparent',
  },
  {
    eyebrow: 'Chapter 03',
    title: 'You hunt for it.',
    body:
      'The hunt page uses live geolocation, compass heading, and motion data so the user actually moves toward the payload.',
    accent: 'from-orange-600/20 to-transparent',
  },
  {
    eyebrow: 'Chapter 04',
    title: 'The signal tightens.',
    body:
      'Distance, heading, and motion respond in real time. The interface stays minimal so the tension comes from the feedback, not clutter.',
    accent: 'from-zinc-950/10 to-transparent',
  },
  {
    eyebrow: 'Chapter 05',
    title: 'Unlock the payload.',
    body:
      'Cross the radius, reveal the drop, and share the hunt with a link that opens straight into the payload route.',
    accent: 'from-orange-600/20 to-transparent',
  },
];

const quickFacts = [
  { label: 'Mode', value: 'Story-driven hunt' },
 
];

const actionLinks = [
  { href: '/hunt', label: 'Enter Hunt Mode', icon: Radar, primary: true },
  { href: '/agent', label: 'Open Agent Terminal', icon: Route, primary: false },
  { href: '/auth/login', label: 'Log In', icon: ScanSearch, primary: false },
];

function AnimatedPin() {
  return (
    <div className="relative h-[320px] w-full max-w-[520px] overflow-hidden border-2 border-black bg-[radial-gradient(circle_at_top,_rgba(234,88,12,0.12),_transparent_45%),linear-gradient(180deg,rgba(255,255,255,0.95),rgba(255,247,237,0.95))] shadow-brutalist-lg">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:36px_36px]" />

      <div className="absolute left-0 top-0 h-full w-full overflow-hidden">
        <motion.div
          className="absolute left-[18%] top-[18%] h-3 w-3 rounded-full bg-orange-600 shadow-[0_0_0_10px_rgba(234,88,12,0.08)]"
          animate={{ y: [0, 8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute left-[18%] top-[18%] h-12 w-12 rounded-full border-2 border-orange-600/60"
          animate={{ scale: [1, 1.5, 2.1], opacity: [0.65, 0.35, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute bottom-[18%] right-[16%] h-16 w-16 rounded-full border-2 border-black/30"
          animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[18%] flex items-center gap-2"
          animate={{ x: [0, -16, 0], y: [0, -8, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="h-3 w-3 rounded-full bg-black" />
          <div className="h-[2px] w-28 bg-black/70" />
          <Target className="h-5 w-5 text-orange-600" />
        </motion.div>
      </div>

      <div className="absolute inset-x-0 bottom-0 border-t-2 border-black bg-white/90 p-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] font-bold text-zinc-600">
          <span>Targeting</span>
          <span>Location locked</span>
        </div>
      </div>
    </div>
  );
}

function StoryChapter({
  eyebrow,
  title,
  body,
  accent,
  children,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  accent: string;
  children: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <section className="snap-start min-h-screen flex items-center px-4 py-8 sm:px-6 lg:px-8">
      <div className={`mx-auto grid w-full max-w-7xl gap-10 lg:grid-cols-2 ${reverse ? 'lg:[&>*:first-child]:order-2' : ''}`}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className={`relative overflow-hidden border-2 border-black bg-white p-6 shadow-brutalist-lg sm:p-8`}
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${accent}`} />
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-3 py-2 text-[10px] uppercase tracking-[0.35em] font-bold shadow-brutalist">
              <Sparkles className="h-4 w-4 text-orange-600" />
              {eyebrow}
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-black uppercase tracking-[-0.05em] text-zinc-950 sm:text-5xl lg:text-6xl">
                {title}
              </h2>
              <p className="max-w-xl text-base leading-7 text-zinc-700 sm:text-lg">
                {body}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {actionLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center gap-2 border-2 border-black px-4 py-3 text-xs uppercase tracking-[0.28em] font-bold transition-transform active:translate-x-[1px] active:translate-y-[1px] ${
                      link.primary ? 'bg-orange-600 text-white shadow-brutalist' : 'bg-white text-zinc-900 shadow-brutalist'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${link.primary ? 'text-white' : 'text-orange-600'}`} />
                    {link.label}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                );
              })}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="flex items-center justify-center"
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <main className="h-screen overflow-y-auto snap-y snap-mandatory bg-[linear-gradient(180deg,#fff8f2_0%,#ffffff_34%,#fff_100%)] text-zinc-900">
      <section className="snap-start min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-between border-2 border-black bg-white shadow-brutalist-lg">
          <header className="flex items-center justify-between border-b-2 border-black px-4 py-4 sm:px-6">
            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-[0.35em] text-orange-600 font-bold">You Are Not There Yet</p>
              <h1 className="text-sm uppercase tracking-[0.3em] font-bold">Payload Navigation System</h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 border-2 border-black bg-orange-600/5 px-3 py-2 text-[10px] uppercase tracking-[0.35em] font-bold shadow-brutalist">
              <Compass className="h-4 w-4 text-orange-600" />
              Scroll story
            </div>
          </header>

          <div className="grid flex-1 items-center gap-10 px-4 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-14">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 border-2 border-black bg-orange-600/5 px-3 py-2 text-[10px] uppercase tracking-[0.35em] font-bold shadow-brutalist">
                <Radar className="h-4 w-4 text-orange-600" />
                A game told one screen at a time
              </div>

              <div className="max-w-3xl space-y-4">
                <h2 className="text-5xl font-black uppercase tracking-[-0.06em] text-zinc-950 sm:text-6xl lg:text-7xl">
                  Let me show you a hunt.
                  <span className="block text-orange-600">Then you follow the signal.</span>
                </h2>
                <p className="max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg">
                  Scroll through a short story: I give a location, the map pin drops, the compass wakes up,
                  and the payload opens when you reach it. It is built to feel like a sequence, not a website.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {quickFacts.map((item) => (
                  <div key={item.label} className="card-field bg-white/95">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">{item.label}</p>
                    <p className="mt-2 text-sm font-bold uppercase tracking-[0.18em] text-zinc-900">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="flex items-center justify-center"
            >
              <AnimatedPin />
            </motion.div>
          </div>

          <div className="border-t-2 border-black px-4 py-4 sm:px-6">
            <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.35em] text-zinc-600 font-bold">
              <span>Swipe down or scroll</span>
              <span>Each chapter fills the screen</span>
            </div>
          </div>
        </div>
      </section>

      <StoryChapter
        eyebrow={storySteps[0].eyebrow}
        title={storySteps[0].title}
        body={storySteps[0].body}
        accent={storySteps[0].accent}
      >
        <div className="relative w-full max-w-[520px] overflow-hidden border-2 border-black bg-white shadow-brutalist-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(234,88,12,0.18),_transparent_46%)]" />
          <div className="relative p-6 sm:p-8">
            <div className="mb-4 flex items-center justify-between text-[10px] uppercase tracking-[0.35em] font-bold text-zinc-600">
              <span>Boot</span>
              <span>Field ready</span>
            </div>
            <div className="space-y-3 border-2 border-black bg-white p-4 shadow-brutalist">
              {['[SYSTEM INIT]', '[SATELLITE LOCK]', '[MAP GRID ONLINE]', '[PAYLOAD READY]'].map((line, index) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.25, delay: index * 0.12 }}
                  className="text-xs uppercase tracking-widest"
                >
                  {line}
                </motion.div>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="border-2 border-black bg-zinc-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Rule 1</p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] font-bold">Read the clue</p>
              </div>
              <div className="border-2 border-black bg-zinc-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Rule 2</p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] font-bold">Follow the signal</p>
              </div>
            </div>
          </div>
        </div>
      </StoryChapter>

      <StoryChapter
        eyebrow={storySteps[1].eyebrow}
        title={storySteps[1].title}
        body={storySteps[1].body}
        accent={storySteps[1].accent}
        reverse
      >
        <div className="relative w-full max-w-[520px] overflow-hidden border-2 border-black bg-white shadow-brutalist-lg">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:40px_40px]" />
          <div className="absolute left-[14%] top-[18%] h-4 w-4 rounded-full bg-orange-600 shadow-[0_0_0_12px_rgba(234,88,12,0.12)]" />
          <motion.div
            className="absolute left-[14%] top-[18%] h-16 w-16 rounded-full border-2 border-orange-600/60"
            animate={{ scale: [1, 1.4, 1.8], opacity: [0.65, 0.35, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute bottom-[22%] right-[18%] h-20 w-20 rounded-full border-2 border-black/30"
            animate={{ y: [0, -8, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="relative p-6 sm:p-8">
            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] font-bold text-zinc-600">
              <span>Origin point</span>
              <span>Map pin deployed</span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="card-field bg-white">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Latitude</p>
                <p className="mt-2 font-mono text-sm font-bold">26.664488</p>
              </div>
              <div className="card-field bg-white">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Longitude</p>
                <p className="mt-2 font-mono text-sm font-bold">87.274876</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3 border-2 border-black bg-orange-600/5 p-3">
              <MapPin className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">The clue starts here</p>
                <p className="text-sm uppercase tracking-[0.18em] font-bold">You do not get the payload yet.</p>
              </div>
            </div>
          </div>
        </div>
      </StoryChapter>

      <StoryChapter
        eyebrow={storySteps[2].eyebrow}
        title={storySteps[2].title}
        body={storySteps[2].body}
        accent={storySteps[2].accent}
      >
        <div className="relative w-full max-w-[520px] overflow-hidden border-2 border-black bg-white shadow-brutalist-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(234,88,12,0.1),_transparent_42%)]" />
          <div className="relative p-6 sm:p-8">
            <div className="mx-auto flex h-72 w-72 items-center justify-center rounded-full border-2 border-black bg-white shadow-brutalist">
              <div className="absolute h-56 w-56 rounded-full border-2 border-black/25" />
              <div className="absolute h-40 w-40 rounded-full border-2 border-orange-600/60" />
              <motion.div
                className="absolute flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-white shadow-brutalist"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              >
                <Compass className="h-8 w-8" />
              </motion.div>
              <motion.div
                className="absolute left-7 top-7 text-[10px] uppercase tracking-[0.35em] font-bold text-zinc-600"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                N
              </motion.div>
              <motion.div
                className="absolute right-7 top-7 text-[10px] uppercase tracking-[0.35em] font-bold text-zinc-600"
                animate={{ opacity: [1, 0.35, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                E
              </motion.div>
              <motion.div
                className="absolute bottom-7 left-7 text-[10px] uppercase tracking-[0.35em] font-bold text-zinc-600"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                W
              </motion.div>
              <motion.div
                className="absolute bottom-7 right-7 text-[10px] uppercase tracking-[0.35em] font-bold text-zinc-600"
                animate={{ opacity: [0.35, 1, 0.35] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                S
              </motion.div>
              <motion.div
                className="absolute h-1 w-24 bg-black"
                animate={{ rotate: [12, -12, 12], scaleX: [1, 1.08, 1] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="absolute left-[58%] top-[38%] h-3 w-3 rounded-full bg-orange-600 shadow-[0_0_0_12px_rgba(234,88,12,0.1)]"
                animate={{ x: [0, 18, 0], y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
            <div className="mt-6 flex items-center justify-between gap-3 text-[10px] uppercase tracking-[0.35em] font-bold text-zinc-600">
              <span>Compass active</span>
              <span>Move toward the point</span>
            </div>
          </div>
        </div>
      </StoryChapter>

      <StoryChapter
        eyebrow={storySteps[3].eyebrow}
        title={storySteps[3].title}
        body={storySteps[3].body}
        accent={storySteps[3].accent}
        reverse
      >
        <div className="relative w-full max-w-[520px] overflow-hidden border-2 border-black bg-white shadow-brutalist-lg">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(0,0,0,0.06)_0%,transparent_40%,rgba(234,88,12,0.12)_100%)]" />
          <div className="relative p-6 sm:p-8">
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="border-2 border-black bg-zinc-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">GPS</p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] font-bold text-orange-600">Locked</p>
              </div>
              <div className="border-2 border-black bg-zinc-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Compass</p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] font-bold text-orange-600">Tracking</p>
              </div>
              <div className="border-2 border-black bg-zinc-50 p-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Motion</p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] font-bold text-orange-600">Moving</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 border-2 border-black bg-white p-4 shadow-brutalist">
              {[78, 54, 28, 11].map((distance, index) => (
                <motion.div
                  key={distance}
                  initial={{ opacity: 0, width: `${distance}%` }}
                  whileInView={{ opacity: 1, width: `${distance}%` }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.45, delay: index * 0.12 }}
                  className="h-3 border border-black bg-orange-600/70"
                />
              ))}
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] font-bold text-zinc-600">
                <span>Distance shrinking</span>
                <span>Signal tightening</span>
              </div>
            </div>
          </div>
        </div>
      </StoryChapter>

      <StoryChapter
        eyebrow={storySteps[4].eyebrow}
        title={storySteps[4].title}
        body={storySteps[4].body}
        accent={storySteps[4].accent}
      >
        <div className="relative w-full max-w-[520px] overflow-hidden border-2 border-black bg-white shadow-brutalist-lg">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(234,88,12,0.14),_transparent_44%)]" />
          <div className="relative p-6 sm:p-8">
            <div className="card-field bg-white">
              <div className="text-xs uppercase tracking-widest text-zinc-600 font-bold">Unlock code</div>
              <div className="mt-3 border-2 border-orange-600 bg-orange-600/5 p-4 text-center">
                <p className="text-3xl font-black tracking-[0.35em] text-zinc-950 sm:text-5xl">YC5 - XRV</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="border-2 border-black bg-zinc-50 p-3">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Share</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] font-bold">Link opens the hunt</p>
                </div>
                <div className="border-2 border-black bg-zinc-50 p-3">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Result</p>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] font-bold">Payload revealed</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/hunt"
                className="inline-flex items-center gap-2 border-2 border-black bg-orange-600 px-4 py-3 text-xs uppercase tracking-[0.28em] font-bold text-white shadow-brutalist"
              >
                <Footprints className="h-4 w-4" />
                Start the hunt
              </Link>
              <Link
                href="/agent"
                className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-3 text-xs uppercase tracking-[0.28em] font-bold text-zinc-900 shadow-brutalist"
              >
                <Shield className="h-4 w-4 text-orange-600" />
                Deploy a payload
              </Link>
            </div>
          </div>
        </div>
      </StoryChapter>

      <section className="snap-start min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center border-2 border-black bg-white px-4 py-10 shadow-brutalist-lg">
          <div className="max-w-3xl space-y-6 text-center">
            <div className="inline-flex items-center gap-2 border-2 border-black bg-orange-600/5 px-3 py-2 text-[10px] uppercase tracking-[0.35em] font-bold shadow-brutalist">
              <Globe className="h-4 w-4 text-orange-600" />
              Ready for showcase
            </div>
            <h2 className="text-4xl font-black uppercase tracking-[-0.05em] text-zinc-950 sm:text-5xl lg:text-6xl">
              The story starts here, but the payload is somewhere else.
            </h2>
            <p className="mx-auto max-w-2xl text-base leading-7 text-zinc-700 sm:text-lg">
              Open the hunt, deploy a drop, and share the link. The homepage is now a chaptered intro that feels like a cinematic briefing instead of a plain landing page.
            </p>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link
                href="/agent"
                className="inline-flex items-center gap-2 border-2 border-black bg-orange-600 px-5 py-3 text-xs uppercase tracking-[0.28em] font-bold text-white shadow-brutalist"
              >
                Open the terminal
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/hunt"
                className="inline-flex items-center gap-2 border-2 border-black bg-white px-5 py-3 text-xs uppercase tracking-[0.28em] font-bold text-zinc-900 shadow-brutalist"
              >
                Enter hunt mode
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}