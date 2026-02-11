import { NextResponse } from 'next/server';
import { base64FromArrayBuffer, createUpload } from '../../_mock/store';

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get('file');
  const branch = String(form.get('branch') || '');
  const fileType = String(form.get('file_type') || '');

  if (!(file instanceof File)) {
    return NextResponse.json({ detail: 'file is required' }, { status: 400 });
  }
  if (branch !== 'patiobella' && branch !== 'eateroo') {
    return NextResponse.json({ detail: 'branch is required' }, { status: 400 });
  }

  const allowed = ['procurement', 'inventory', 'sales', 'finance', 'petty_cash'];
  if (!allowed.includes(fileType)) {
    return NextResponse.json({ detail: 'file_type is required' }, { status: 400 });
  }

  const buf = await file.arrayBuffer();
  const b64 = base64FromArrayBuffer(buf);

  const { upload, fileId } = createUpload({
    filename: file.name,
    branch: branch as any,
    file_type: fileType as any,
    size: file.size,
    bytesBase64: b64,
  });

  return NextResponse.json({
    file_id: fileId,
    excel_upload_id: upload.id,
    status: 'queued',
    sha256: 'mock',
  });
}
