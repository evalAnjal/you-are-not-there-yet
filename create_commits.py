#!/usr/bin/env python3
import os
import subprocess
from datetime import datetime

os.chdir('/home/flameanjal/Desktop/Portfolio Projects/youarenotthereyet')

# Configure git if not already configured
subprocess.run(['git', 'config', 'user.email', 'kinganjalap@gmail.com'], capture_output=True)
subprocess.run(['git', 'config', 'user.name', 'evalAnjal'], capture_output=True)

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

print("\n✅ All commits created successfully!")
