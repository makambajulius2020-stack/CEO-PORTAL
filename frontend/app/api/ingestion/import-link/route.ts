import { NextResponse } from 'next/server';
import { createUpload } from '../../_mock/store';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const url = String(body?.url || '');
  const branch = String(body?.branch || '');
  const fileType = String(body?.file_type || '');

  if (!url) return NextResponse.json({ detail: 'url is required' }, { status: 400 });
  if (branch !== 'patiobella' && branch !== 'eateroo') return NextResponse.json({ detail: 'branch is required' }, { status: 400 });

  const allowed = ['procurement', 'inventory', 'sales', 'finance', 'petty_cash'];
  if (!allowed.includes(fileType)) return NextResponse.json({ detail: 'file_type is required' }, { status: 400 });

  const filename = url.split('/').pop() || 'import.xlsx';
  const { upload, fileId } = createUpload({
    filename,
    branch: branch as any,
    file_type: fileType as any,
    size: 0,
    bytesBase64: '',
  });

  return NextResponse.json({
    file_id: fileId,
    excel_upload_id: upload.id,
    status: 'queued',
    sha256: 'mock',
  });
}
