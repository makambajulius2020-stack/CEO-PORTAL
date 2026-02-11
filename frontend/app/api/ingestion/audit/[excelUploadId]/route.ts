import { NextResponse } from 'next/server';
import { getAuditById, getUploadById } from '../../../_mock/store';

export async function GET(_req: Request, ctx: { params: Promise<{ excelUploadId: string }> }) {
  const { excelUploadId } = await ctx.params;
  const id = Number(excelUploadId);
  if (!Number.isFinite(id)) return NextResponse.json({ detail: 'Invalid id' }, { status: 400 });

  const upload = getUploadById(id);
  if (!upload) return NextResponse.json({ detail: 'Upload not found' }, { status: 404 });
  if (!upload.ai_audit_id) return NextResponse.json({ detail: 'Audit not ready' }, { status: 409 });

  const audit = getAuditById(upload.ai_audit_id);
  if (!audit) return NextResponse.json({ detail: 'Audit not found' }, { status: 404 });

  return NextResponse.json({
    upload: {
      excel_upload_id: id,
      ai_audit_id: upload.ai_audit_id,
      mongo_gridfs_id: upload.mongo_gridfs_id,
      ai_audit_score: upload.ai_audit_score,
      processing_status: upload.processing_status,
    },
    audit,
  });
}
