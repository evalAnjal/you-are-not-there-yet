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
    const { code, lat, lng, radius, message, status } = body;

    // require authentication for creating drops
    const token = getTokenFromHeader(req);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const created_by: string = payload.sub;

    // basic validation
    const latNum = lat != null ? Number(lat) : null;
    const lngNum = lng != null ? Number(lng) : null;
    if ((lat != null && Number.isNaN(latNum)) || (lng != null && Number.isNaN(lngNum))) {
      return NextResponse.json({ error: 'Invalid latitude or longitude' }, { status: 400 });
    }

    const id = randomUUID();
    const dropStatus = status ?? 'active'; // Default to active
    const params = [id, code ?? null, latNum, lngNum, radius ?? null, message ?? null, dropStatus, created_by];
    console.info('[DROP_API] Inserting drop', { id, created_by, lat: latNum, lng: lngNum, radius, message, status: dropStatus });
    try {
      const res = await query(
        'INSERT INTO drops(id, code, lat, lng, radius, message, status, created_by, created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,now()) RETURNING *',
        params
      );

      console.info('[DROP_API] DB insert result', { rowCount: res?.rowCount, rows: res?.rows?.length });
      if (!res || res.rowCount === 0) {
        console.error('[DROP_API] DB insert returned no rows for drops insert', { id, created_by });
        return NextResponse.json({ error: 'Database did not return the created drop' }, { status: 500 });
      }

      console.info('[DROP_API] Drop created successfully', { id });
      return NextResponse.json(res.rows[0], { status: 201 });
    } catch (dbErr: any) {
      console.error('[DROP_API] DB error inserting drop', { err: dbErr?.message || String(dbErr), code: dbErr?.code, stack: dbErr?.stack, params });
      return NextResponse.json({ error: dbErr?.message || String(dbErr) }, { status: 500 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    // require authentication and return only drops created by the caller
    const token = getTokenFromHeader(req);
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let payload: any;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const created_by: string = payload.sub;

    const res = await query('SELECT * FROM drops WHERE created_by = $1 ORDER BY created_at DESC', [created_by]);
    return NextResponse.json(res.rows || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
