import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { query } from '../../../../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

function getTokenFromHeader(req: Request) {
  const auth = req.headers.get('authorization') || '';
  const m = auth.match(/^Bearer (.+)$/);
  return m ? m[1] : null;
}

// Lookup only: validate code and return target coordinates without recording discovery.
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;

    // Allow anonymous lookups for shared hunt links; no authentication required for read-only lookup

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }

    const res = await query(
      'SELECT id, code, lat, lng, radius, is_public FROM drops WHERE code = $1 AND status = $2 LIMIT 1',
      [code.trim().toUpperCase(), 'active']
    );

    if (!res?.rows?.length) {
      return NextResponse.json({ error: 'Drop not found' }, { status: 404 });
    }

    const drop = res.rows[0];
    return NextResponse.json(
      {
        success: true,
        target: {
          id: drop.id,
          code: drop.code,
          lat: drop.lat,
          lng: drop.lng,
          radius: drop.radius,
          is_public: drop.is_public,
        },
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
