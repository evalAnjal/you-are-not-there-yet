import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

async function writeUsers(users: any[]) {
  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || !name) return NextResponse.json({ error: 'Missing name, email or password' }, { status: 400 });

    const users = await readUsers();
    if (users.find((u: any) => u.email === email)) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = { id: randomUUID(), name, email, password: hashed, created_at: new Date().toISOString() };
    users.push(user);
    await writeUsers(users);

    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
