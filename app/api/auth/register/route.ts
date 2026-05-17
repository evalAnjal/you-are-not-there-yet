import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { query } from '../../../../lib/db';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    if (!email || !password || !name) return NextResponse.json({ error: 'Missing name, email or password' }, { status: 400 });

    // check existing
    const exists = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (exists.rowCount > 0) return NextResponse.json({ error: 'User already exists' }, { status: 409 });

    const hashed = await bcrypt.hash(password, 10);
    const id = randomUUID();
    const res = await query(
      'INSERT INTO users(id, name, email, password, created_at) VALUES($1,$2,$3,$4,now()) RETURNING id, name, email',
      [id, name, email, hashed]
    );

    const user = res.rows[0];
    return NextResponse.json({ id: user.id, email: user.email, name: user.name }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
