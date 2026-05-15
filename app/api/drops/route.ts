import { NextResponse } from 'next/server';
import supabaseAdmin from '../../../../lib/supabaseServer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, lat, lng, radius, message } = body;

    const { data, error } = await supabaseAdmin
      .from('drops')
      .insert([{ code, lat, lng, radius, message }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('drops')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
