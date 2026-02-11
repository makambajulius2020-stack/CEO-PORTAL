import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([
    {
      id: 'a1',
      type: 'warning',
      message: 'Vendor price variance detected (mock)',
      timestamp: new Date().toISOString(),
      description: 'Tomatoes price delta +18.9% at Patiobella (demo data).',
    },
    {
      id: 'a2',
      type: 'critical',
      message: 'Outstanding invoice aging risk (mock)',
      timestamp: new Date().toISOString(),
      description: 'Eateroo has 1 invoice in 0-30 bucket flagged for review (demo data).',
    },
  ]);
}
