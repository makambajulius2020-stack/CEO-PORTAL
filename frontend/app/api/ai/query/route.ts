import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const query = String(body?.query || '');

  return NextResponse.json({
    response: `Mock AI Response: I received your query: "${query}". In hosted demo mode, insights are simulated.`,
  });
}
