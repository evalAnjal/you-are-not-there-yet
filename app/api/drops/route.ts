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
    const { code, lat, lng, radius, message, status, streak_required, is_public, public_name, public_description } = body;

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
    const streakRequired = streak_required != null ? Number(streak_required) : null;
    const isPublic = is_public === true;
    const publicName = isPublic ? (typeof public_name === 'string' ? public_name.trim() : '') : '';
    const publicDescription = isPublic ? (typeof public_description === 'string' ? public_description.trim() : '') : '';
    const params = [
      id,
      code ?? null,
      latNum,
      lngNum,
      radius ?? null,
      message ?? null,
      dropStatus,
      isPublic,
      publicName || null,
      publicDescription || null,
      created_by,
      streakRequired,
    ];
    console.info('[DROP_API] Inserting drop', { id, created_by, lat: latNum, lng: lngNum, radius, message, status: dropStatus });
    try {
      const res = await query(
        'INSERT INTO drops(id, code, lat, lng, radius, message, status, is_public, public_name, public_description, created_by, streak_required, created_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,now()) RETURNING *',
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
    const requestUrl = new URL(req.url);
    const scope = requestUrl.searchParams.get('scope');

    if (scope === 'public') {
      const publicRes = await query(
        `SELECT id, code, radius, public_name, public_description, created_at, streak_required
         FROM drops
         WHERE is_public = true AND status = 'active'
         ORDER BY created_at DESC`,
        []
      );

      return NextResponse.json(publicRes.rows || []);
    }

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

    // Join user_streaks to include the requesting user's streak progress for each drop
    const res = await query(
      `SELECT d.*, us.current_streak
       FROM drops d
       LEFT JOIN user_streaks us ON us.drop_id = d.id AND us.user_id = $1
       WHERE d.created_by = $1
       ORDER BY d.created_at DESC`,
      [created_by]
    );

    return NextResponse.json(res.rows || []);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
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

    const body = await req.json();
    const { id, is_public } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Drop id is required' }, { status: 400 });
    }

    if (typeof is_public !== 'boolean') {
      return NextResponse.json({ error: 'is_public must be a boolean' }, { status: 400 });
    }

    const res = await query(
      `UPDATE drops
       SET is_public = $1
       WHERE id = $2 AND created_by = $3
       RETURNING id, code, is_public, created_at`,
      [is_public, id, created_by]
    );

    if (!res?.rows?.length) {
      return NextResponse.json({ error: 'Drop not found or not owned by user' }, { status: 404 });
    }

    return NextResponse.json({ success: true, drop: res.rows[0] }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
