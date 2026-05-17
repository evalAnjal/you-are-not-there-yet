import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import jwt from 'jsonwebtoken';
import { query } from '../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function getTokenFromHeader(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/^Bearer (.+)$/);
  return m ? m[1] : null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, lat, lng, radius, message } = body;

    // authenticate user (optional)
    const token = getTokenFromHeader(req);
    let created_by: string | null = null;
    if (token) {
      try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        created_by = payload.sub;
      } catch (e) {
        // invalid token: continue but do not assign created_by
      }
    }

    const id = randomUUID();
    const res = await query(
      'INSERT INTO drops(id, code, lat, lng, radius, message, created_by, created_at) VALUES($1,$2,$3,$4,$5,$6,$7,now()) RETURNING *',
      [id, code ?? null, lat ? Number(lat) : null, lng ? Number(lng) : null, radius ?? null, message ?? null, created_by]
    );

    return NextResponse.json(res.rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const res = await query('SELECT * FROM drops ORDER BY created_at DESC');
    return NextResponse.json(res.rows || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
