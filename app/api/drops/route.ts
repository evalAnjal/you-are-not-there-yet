import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

const DATA_FILE = path.join(process.cwd(), 'data', 'drops.json');

async function readDrops() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

async function writeDrops(drops: any[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(drops, null, 2), 'utf-8');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, lat, lng, radius, message } = body;

    const drops = await readDrops();
    const newDrop = {
      id: randomUUID(),
      code: code ?? null,
      lat: typeof lat === 'number' ? lat : Number(lat ?? null),
      lng: typeof lng === 'number' ? lng : Number(lng ?? null),
      radius: typeof radius === 'number' ? radius : Number(radius ?? null),
      message: message ?? null,
      created_at: new Date().toISOString(),
    };

    drops.push(newDrop);
    await writeDrops(drops);

    return NextResponse.json(newDrop, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const drops = await readDrops();
    drops.sort((a: any, b: any) => (b.created_at || '').localeCompare(a.created_at || ''));
    return NextResponse.json(drops);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
