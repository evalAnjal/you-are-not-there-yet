import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '../../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function getTokenFromHeader(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/^Bearer (.+)$/);
  return m ? m[1] : null;
}

export async function GET(req: Request) {
  try {
    const token = getTokenFromHeader(req);
    if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 401 });

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const res = await query('SELECT id, name, email FROM users WHERE id = $1', [payload.sub]);
    if (res.rowCount === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const user = res.rows[0];
    return NextResponse.json({ id: user.id, email: user.email, name: user.name });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
