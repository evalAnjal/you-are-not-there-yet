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

// Find a drop by code and record discovery
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, lat, lng } = body; // lat/lng = current user location for distance calc

    // Require authentication
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
    const found_by: string = payload.sub;

    if (!code) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    console.info('[COMPASS] Looking up drop by code', { code, found_by });

    // Look up drop by code
    const dropRes = await query(
      'SELECT * FROM drops WHERE code = $1',
      [code]
    );

    if (!dropRes?.rows || dropRes.rows.length === 0) {
      console.warn('[COMPASS] Drop not found for code', { code });
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    const drop = dropRes.rows[0];

    // Calculate distance if current location provided
    let distance_at_find = null;
    if (lat != null && lng != null) {
      const latNum = Number(lat);
      const lngNum = Number(lng);
      if (!Number.isNaN(latNum) && !Number.isNaN(lngNum)) {
        // Simple Haversine distance calculation (in km)
        const R = 6371; // Earth's radius in km
        const dLat = ((drop.lat - latNum) * Math.PI) / 180;
        const dLon = ((drop.lng - lngNum) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((latNum * Math.PI) / 180) *
            Math.cos((drop.lat * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        distance_at_find = R * c;
      }
    }

    // Check if user already found this drop
    const existingRes = await query(
      'SELECT id FROM discoveries WHERE drop_id = $1 AND found_by = $2',
      [drop.id, found_by]
    );

    if (existingRes?.rows && existingRes.rows.length > 0) {
      console.info('[COMPASS] Drop already found by user', { drop_id: drop.id, found_by });
      return NextResponse.json(
        { error: 'You already found this drop', drop, distance: distance_at_find },
        { status: 400 }
      );
    }

    // If the drop has been marked found already, prevent other users from finding it
    if (drop.status === 'found') {
      console.info('[COMPASS] Drop already marked found, rejecting', { drop_id: drop.id });
      return NextResponse.json({ error: 'Drop already found' }, { status: 400 });
    }

    // Record discovery
    const discovery_id = randomUUID();
    console.info('[COMPASS] Recording discovery', { discovery_id, drop_id: drop.id, found_by, distance_at_find });

    const insertRes = await query(
      'INSERT INTO discoveries(id, drop_id, found_by, distance_at_find, found_at) VALUES($1,$2,$3,$4,now()) RETURNING *',
      [discovery_id, drop.id, found_by, distance_at_find]
    );

    console.info('[COMPASS] Discovery recorded successfully', { discovery_id });

    // Mark the drop as found so others cannot claim it
    try {
      await query('UPDATE drops SET status = $1 WHERE id = $2', ['found', drop.id]);
    } catch (updErr: any) {
      console.error('[COMPASS] Failed to update drop status after discovery', { err: updErr?.message || String(updErr) });
    }

    return NextResponse.json(
      {
        success: true,
        discovery: insertRes?.rows?.[0],
        drop: {
          id: drop.id,
          code: drop.code,
          lat: drop.lat,
          lng: drop.lng,
          message: drop.message,
          radius: drop.radius,
          created_by: drop.created_by,
          created_at: drop.created_at,
        },
        distance: distance_at_find, // Distance in km
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[COMPASS] Error', { error: err?.message || String(err) });
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

// Get all discoveries for the current user (drops they found)
export async function GET(req: Request) {
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
    const found_by: string = payload.sub;

    console.info('[COMPASS] Getting discoveries for user', { found_by });

    const res = await query(
      `SELECT d.*, 
              dd.code, dd.lat, dd.lng, dd.message, dd.radius, dd.created_by, 
              dd.created_at as drop_created_at
       FROM discoveries d
       JOIN drops dd ON d.drop_id = dd.id
       WHERE d.found_by = $1
       ORDER BY d.found_at DESC`,
      [found_by]
    );

    return NextResponse.json(res.rows || []);
  } catch (err: any) {
    console.error('[COMPASS] GET error', { error: err?.message || String(err) });
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
