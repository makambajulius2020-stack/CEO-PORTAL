import { NextResponse } from 'next/server';
import { arrayBufferFromBase64, getFile } from '../../_mock/store';

export async function GET(req: Request, ctx: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await ctx.params;
  const f = getFile(fileId);
  if (!f) return NextResponse.json({ detail: 'File not found' }, { status: 404 });

  const buf = arrayBufferFromBase64(f.bytesBase64);
  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${f.name}"`,
    },
  });
}
