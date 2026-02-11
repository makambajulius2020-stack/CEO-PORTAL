import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || '').trim().toLowerCase();
  const password = String(body?.password || '').trim();

  if (email === 'ceo@hugamara.com' && password === 'CEO@2026!') {
    return NextResponse.json({ access_token: 'mock_token_ceo', token_type: 'bearer' });
  }

  return NextResponse.json({ detail: 'Incorrect email or password' }, { status: 401 });
}
