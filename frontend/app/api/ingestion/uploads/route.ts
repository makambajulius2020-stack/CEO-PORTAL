import { NextResponse } from 'next/server';
import { listUploads } from '../../_mock/store';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const limit = Number(searchParams.get('limit') || '50');
  const branch = searchParams.get('branch') || undefined;
  const fileType = searchParams.get('file_type') || undefined;

  const rows = listUploads(
    Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : 50,
    branch as any,
    fileType as any
  );
  return NextResponse.json(rows);
}
