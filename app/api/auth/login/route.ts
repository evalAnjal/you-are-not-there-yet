import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });

    const res = await query('SELECT id, name, email, password FROM users WHERE email = $1', [email]);
    if (res.rowCount === 0) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const user = res.rows[0];
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

    const token = jwt.sign({ sub: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({ token, id: user.id, email: user.email, name: user.name });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
