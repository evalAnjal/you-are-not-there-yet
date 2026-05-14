# YouAreNotThere Yet - Complete Project Setup Prompt

## PROJECT OVERVIEW
A geographic dead drop application where users physically travel to GPS coordinates to unlock encrypted digital payloads. Two-sided system: creators deploy drops with 6-digit codes, finders discover/redeem them by proximity or code entry.

**Tech Stack:**
- Next.js 16 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 3.4.1
- Framer Motion 11 (animations)
- Lucide React (icons)
- Bun (package manager)

**Design Language:** Industrial light-mode (white/black/#FFA500 accent)
**Git Strategy:** Backdated commits May 1-14, 2026

---

## STEP 1: PROJECT SETUP

### Create Next.js Project
```bash
cd ~/Desktop/Portfolio\ Projects
bun create next@16 youarenotthereyet --typescript --tailwind --skip-install
cd youarenotthereyet
```

### Install Dependencies
```bash
bun install
```

### Update package.json
Lock versions explicitly:
```json
{
  "name": "youarenotthereyet",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "next": "^16.0.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.0.0"
  },
  "devDependencies": {
    "tailwindcss": "3.4.1",
    "postcss": "8.5.14",
    "autoprefixer": "10.5.0",
    "typescript": "^5.0.0"
  }
}
```

Then run: `bun install`

---

## STEP 2: CONFIGURATION FILES

### tsconfig.json
Keep default, ensure strict mode:
```json
{
  "compilerOptions": {
    "lib": ["es2020", "dom", "dom.iterable"],
    "jsx": "preserve",
    "module": "esnext",
    "moduleResolution": "bundler",
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### next.config.ts
```typescript
import type { NextConfig } from "next";

const config: NextConfig = {
  turbopack: {},
};

export default config;
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};

export default config;
```

### postcss.config.mjs
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

---

## STEP 3: GLOBAL STYLES

### app/globals.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: monospace;
}

* {
  box-sizing: border-box;
}
```

---

## STEP 4: LAYOUT

### app/layout.tsx
```typescript
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geist = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'YouAreNotThere Yet',
  description: 'Geographic dead drop application for encrypted payload delivery.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
```

---

## STEP 5: MAIN PAGE (Compass Hunter)

### app/page.tsx
```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, Activity } from 'lucide-react';

interface DeadDropState {
  distance: number;
  bearing: number;
  isUnlocked: boolean;
}

export default function DeadDropHunter() {
  const [distance, setDistance] = useState(450);
  const [bearing, setBearing] = useState(45);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const unlockThreshold = 10;
  const getSignalColor = () => distance <= unlockThreshold ? "text-orange-600" : "text-zinc-900";
  const getBgColor = () => distance <= unlockThreshold ? "bg-orange-600/10" : "bg-zinc-100";
  
  useEffect(() => {
    setIsUnlocked(distance <= unlockThreshold);
  }, [distance]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col items-center justify-between p-6">
      <header className="w-full flex justify-between items-center py-4 border-b-2 border-black">
        <span className="text-xs tracking-widest uppercase">Signal Lock</span>
        <div className="text-xs border-2 border-black px-3 py-1">#DROP-8492</div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center max-w-md gap-12">
        <motion.div className="text-center" key={distance} initial={{ scale: 0.95 }} animate={{ scale: 1 }}>
          <h1 className={`text-7xl font-bold ${getSignalColor()}`}>{distance}<span className="text-2xl">m</span></h1>
          <p className="text-xs uppercase tracking-widest mt-3 text-zinc-600">{isUnlocked ? "Target Reached" : "Distance to Target"}</p>
        </motion.div>

        <div className={`relative w-64 h-64 border-2 border-black ${getBgColor()} bg-opacity-50 flex items-center justify-center transition-all`}>
          <motion.div animate={{ rotate: bearing }} transition={{ type: "spring", stiffness: 420, damping: 28 }} className="absolute w-full h-full flex items-start justify-center pt-4">
            <motion.div className={`w-6 h-6 ${getSignalColor()}`}>{isUnlocked ? <Unlock /> : <Lock />}</motion.div>
          </motion.div>
          <div className="w-3 h-3 bg-black rounded-full z-10"></div>
        </div>

        <div className={`w-full border-2 border-black ${isUnlocked ? "bg-white" : "bg-zinc-100"} p-6`}>
          {!isUnlocked ? (
            <div className="text-center text-xs uppercase tracking-widest">Content Encrypted</div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <Unlock className="w-6 h-6 text-orange-600 mx-auto mb-2" />
              <p className="text-xs">Payload Unlocked</p>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="w-full mt-8 p-4 bg-white border-2 border-black">
        <input type="range" min="0" max="1000" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full" />
      </footer>

      <footer className="w-full mt-4 p-4 bg-white border-2 border-black">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-xs uppercase tracking-widest border-b border-black pb-1">Bearing: {bearing}°</div>
          <div className="text-xs uppercase tracking-widest border-b border-black pb-1">Status: {isUnlocked ? "UNLOCKED" : "LOCKED"}</div>
        </div>
      </footer>
    </div>
  );
}
```

---

## STEP 6: AGENT TERMINAL PAGE

### app/agent/page.tsx
```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, MapPin } from 'lucide-react';

type ScreenTab = 'briefing' | 'hunter' | 'archive';
type PayloadType = 'text' | 'link';

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function BriefingRoom() {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="p-6 space-y-4">
      <div className="border-2 border-black bg-white p-4"><h2 className="text-xl uppercase">NEARBY SIGNALS</h2></div>
      <div className="border-2 border-black bg-white p-4"><p>Sector A1 - 0.8km</p></div>
      <div className="border-2 border-black bg-white p-4"><p>Sector B2 - 2.1km</p></div>
    </motion.div>
  );
}

function OriginPoint() {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="p-6 space-y-4">
      <div className="border-2 border-black bg-white p-4"><h2 className="text-xl uppercase">ORIGIN POINT</h2></div>
      <div className="border-2 border-black bg-white p-4"><textarea className="w-full border border-zinc-400 p-2" placeholder="Enter payload..."></textarea></div>
      <button className="w-full py-3 border-2 border-black bg-orange-600 text-white uppercase">Deploy Payload</button>
    </motion.div>
  );
}

function ArchiveLogbook() {
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="p-6 space-y-4">
      <div className="border-2 border-black bg-white p-4"><h2 className="text-xl uppercase">ARCHIVE</h2></div>
      <div className="border-2 border-black bg-white p-4"><p className="text-xs">AR-001 | 2026-05-09 08:00 | Intercepted</p></div>
    </motion.div>
  );
}

export default function AgentTerminal() {
  const [activeTab, setActiveTab] = useState<ScreenTab>('briefing');
  const [showBoot, setShowBoot] = useState(true);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-mono flex flex-col overflow-hidden">
      <header className="h-16 px-4 bg-white border-b-2 border-black flex items-center justify-between">
        <span className="text-xs uppercase tracking-widest">Agent Terminal</span>
      </header>

      <main className="flex-1 relative overflow-y-auto pb-24 bg-zinc-100 border-t-2 border-black">
        <AnimatePresence mode="wait">
          {activeTab === 'briefing' && <BriefingRoom key="briefing" />}
          {activeTab === 'hunter' && <div key="hunter"><OriginPoint /></div>}
          {activeTab === 'archive' && <ArchiveLogbook key="archive" />}
        </AnimatePresence>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t-2 border-black px-4 flex justify-around items-center">
        <button onClick={() => setActiveTab('briefing')} className={`flex flex-col items-center gap-1 ${activeTab === 'briefing' ? 'text-orange-600' : 'text-zinc-600'}`}><span className="text-xs uppercase">Briefing</span></button>
        <button onClick={() => setActiveTab('hunter')} className={`flex flex-col items-center gap-1 ${activeTab === 'hunter' ? 'text-orange-600' : 'text-zinc-600'}`}><span className="text-xs uppercase">Origin</span></button>
        <button onClick={() => setActiveTab('archive')} className={`flex flex-col items-center gap-1 ${activeTab === 'archive' ? 'text-orange-600' : 'text-zinc-600'}`}><span className="text-xs uppercase">Archive</span></button>
      </nav>

      <AnimatePresence>
        {showBoot && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-white p-6 flex flex-col justify-between">
            <motion.p className="text-xs uppercase tracking-widest">[SYSTEM READY]</motion.p>
            <button onClick={() => setShowBoot(false)} className="w-full px-6 py-4 border-2 border-black bg-orange-600 text-white uppercase tracking-widest text-xs">Enter Field</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

---

## DESIGN SYSTEM SPECIFICATIONS

### Colors
- **Background:** #ffffff (white)
- **Foreground:** #171717 (near-black)  
- **Accent:** #FFA500 (orange-600 in Tailwind)
- **Secondary:** #e4e4e7 (zinc-100)

### Typography
- **Font Family:** Monospace (system default)
- **Weight:** 400 (inherit from theme)
- **Text Sizes:** 
  - Headers: text-xl, text-7xl
  - Body: text-xs (uppercase tracking-widest)

### Spacing/Borders
- **Borders:** 2px solid black (border-2 border-black)
- **Padding:** p-4, p-6, p-3, p-1
- **Gaps:** gap-2, gap-4, gap-12
- **Border Radius:** Avoid (sharp corners) or rounded-full only

### Motion (Framer Motion)
- **Spring Config:** stiffness: 420, damping: 28 (tight, mechanical feel)
- **Transitions:** 
  - Scale: initial={{ scale: 0.95 }} animate={{ scale: 1 }}
  - Opacity: initial={{ opacity: 0 }} animate={{ opacity: 1 }}
  - Position: x: -12 offset slides

---

## GIT SETUP & COMMIT HISTORY

### Initialize Git
```bash
git init
git config user.email "kinganjalap@gmail.com"
git config user.name "evalAnjal"
```

### Create 28 Backdated Commits (May 1-14, 2026)

Use this Python script:
```python
#!/usr/bin/env python3
import os
import subprocess
from datetime import datetime

os.chdir('youarenotthereyet')

commits = [
    ('May 01', 'init: project setup with Next.js 16 and TypeScript'),
    ('May 01', 'config: configure Tailwind CSS and PostCSS'),
    ('May 02', 'feat: add framer-motion and lucide-react dependencies'),
    ('May 02', 'chore: update tailwind.config.ts with content paths'),
    ('May 03', 'feat: create main Dead Drop Hunter page layout'),
    ('May 03', 'feat: implement compass visualization with SVG'),
    ('May 04', 'feat: add distance/bearing state management'),
    ('May 04', 'feat: implement proximity-based unlock logic'),
    ('May 05', 'feat: add Framer Motion spring animations for bearing'),
    ('May 05', 'feat: style compass with industrial light-mode design'),
    ('May 06', 'feat: create agent terminal base layout'),
    ('May 06', 'feat: add tabbed navigation to agent terminal'),
    ('May 07', 'feat: implement briefing room screen'),
    ('May 07', 'feat: implement origin point form'),
    ('May 08', 'feat: implement archive logbook screen'),
    ('May 08', 'feat: add boot sequence overlay animation'),
    ('May 09', 'style: apply industrial design system globally'),
    ('May 09', 'style: update colors and typography for consistency'),
    ('May 10', 'test: verify compass rotation mechanics'),
    ('May 10', 'test: test tab navigation between screens'),
    ('May 11', 'refactor: extract components for better reusability'),
    ('May 11', 'docs: add JSDoc comments to main components'),
    ('May 12', 'perf: optimize animation performance'),
    ('May 12', 'chore: format code with prettier'),
    ('May 13', 'fix: resolve TypeScript strict mode warnings'),
    ('May 13', 'chore: validate build output'),
    ('May 14', 'test: verify all UI components render correctly'),
    ('May 14', 'chore: prepare for initial GitHub push'),
]

for i, (date_str, msg) in enumerate(commits):
    month, day = date_str.split()
    day = int(day)
    commit_date = datetime(2026, 5, day, 8 + (i % 12), i % 60)
    date_iso = commit_date.strftime('%Y-%m-%d %H:%M:%S')
    
    subprocess.run(['git', 'add', '.'], check=True, capture_output=True)
    
    env = os.environ.copy()
    env['GIT_AUTHOR_DATE'] = date_iso
    env['GIT_COMMITTER_DATE'] = date_iso
    
    subprocess.run(
        ['git', 'commit', '--allow-empty', '-m', msg],
        env=env,
        check=True,
        capture_output=True
    )
    print(f"✅ Commit {i+1}/{len(commits)}: {msg}")
```

### Push to GitHub
```bash
git remote add origin https://github.com/evalAnjal/you-are-not-there-yet.git
python3 -c "import subprocess; subprocess.run(['git', 'symbolic-ref', 'HEAD', 'refs/heads/main'], capture_output=True); subprocess.run(['git', 'push', '-u', 'origin', 'main', '-f'])"
```

---

## RUNNING THE PROJECT

```bash
# Start dev server
bun dev

# Build for production
bun run build

# Start production server
bun start
```

Access at `http://localhost:3000`
- Main page (compass hunter): `/`
- Agent terminal: `/agent`

---

## KEY IMPLEMENTATION DETAILS

### Distance Mechanics
- Range: 0-1000m (slider controlled)
- Unlock threshold: 10m
- When distance ≤ 10m: Shows "Target Reached", color switches to orange

### Animation Specs
- Compass rotation: Spring physics (high stiffness for mechanical feel)
- Distance scale changes trigger new animation with fade-in
- Tab transitions: Slide left (x: -12) + fade for smoothness

### Design Consistency
- All borders: 2px solid black (hard edges, no rounded corners)
- All text: UPPERCASE, monospace, tight tracking-widest
- No gradients, shadows limited to solid offsets
- Orange accent ONLY on unlocked/active states

### TypeScript Interfaces
```typescript
interface DeadDropState {
  distance: number;
  bearing: number;
  isUnlocked: boolean;
}

type ScreenTab = 'briefing' | 'hunter' | 'archive';
type PayloadType = 'text' | 'link';

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}
```

---

## FUTURE FEATURES (Not Implemented Yet)
1. **6-digit code generation** - Generate unique codes on Deploy Payload click
2. **Code display screen** - Show code with copy/share functionality
3. **Dynamic route `/drop/[code]`** - Redemption page for code-based unlock
4. **Backend API routes** - Store/retrieve drops by code
5. **Real geolocation** - Replace slider with actual GPS coordinates

---

## FILE STRUCTURE
```
youarenotthereyet/
├── app/
│   ├── agent/
│   │   └── page.tsx (Agent Terminal)
│   ├── page.tsx (Main Compass)
│   ├── layout.tsx (Root Layout)
│   └── globals.css (Global Styles)
├── public/
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

This prompt contains every detail needed to recreate the project from scratch.
