import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { pathname, searchParams } = new URL(req.url);
  const parts = pathname.split('/');
  const fileId = parts[parts.indexOf('file') + 1];
  const rows = Number(searchParams.get('rows') || '10');

  // In demo mode we don't parse real Excel on the server.
  // Provide a stable preview so the UI works.
  const r = Number.isFinite(rows) ? Math.min(Math.max(rows, 1), 25) : 10;

  return NextResponse.json({
    file_id: fileId,
    columns: ['Column A', 'Column B', 'Column C'],
    rows: Array.from({ length: r }).map((_, i) => [`Row ${i + 1}A`, `Row ${i + 1}B`, `Row ${i + 1}C`]),
  });
}
