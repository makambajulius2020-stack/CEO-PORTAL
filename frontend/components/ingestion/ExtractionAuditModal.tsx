'use client';

import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { downloadFileUrl, getExtractionAudit, getFilePreview } from '@/lib/api/ingestion';

interface ExtractionAuditModalProps {
  open: boolean;
  filename: string;
  fileId?: string;
  excelUploadId?: number;
  onClose: () => void;
}

export default function ExtractionAuditModal({ open, filename, fileId, excelUploadId, onClose }: ExtractionAuditModalProps) {
  const [preview, setPreview] = useState<{ columns: string[]; rows: string[][] } | null>(null);
  const [audit, setAudit] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setPreview(null);
    setError(null);
    if (!fileId) return;
    setLoading(true);
    setError(null);
    getFilePreview(fileId, 10)
      .then(setPreview)
      .catch((e) => setError(e?.message || 'Failed to load preview'))
      .finally(() => setLoading(false));
  }, [open, fileId]);

  useEffect(() => {
    if (!open || !excelUploadId) return;
    setAudit(null);
    getExtractionAudit(excelUploadId)
      .then((data) => setAudit(data))
      .catch(() => {
        // ignore (may be "Audit not ready")
      });
  }, [open, excelUploadId]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-6xl bg-[#0f172a] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div>
            <h3 className="text-white font-serif text-2xl font-black italic">📄 AI Extraction Audit: {filename}</h3>
          </div>
          <div className="flex items-center gap-3">
            {fileId ? (
              <a
                href={downloadFileUrl(fileId)}
                className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
              >
                <span className="flex items-center gap-2"><Download size={14} /> Download Original</span>
              </a>
            ) : null}
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 overflow-hidden">
            <h4 className="text-white font-black text-sm mb-4">Original Excel Preview</h4>
            {loading ? <p className="text-white/40 text-sm">Loading preview...</p> : null}
            {error ? <p className="text-rose-400 text-sm">{error}</p> : null}
            {preview ? (
              <div className="overflow-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/10">
                      {preview.columns.map((c) => (
                        <th key={c} className="py-2 pr-4 text-[10px] font-black uppercase tracking-widest text-white/60">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.map((row, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0">
                        {row.map((cell, j) => (
                          <td key={j} className="py-2 pr-4 text-xs text-white/70">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 overflow-hidden">
            <h4 className="text-white font-black text-sm mb-4">AI Extracted Data</h4>
            <pre className="text-xs text-white/70 bg-black/30 border border-white/10 rounded-2xl p-4 overflow-auto min-h-[280px]">
{JSON.stringify(
  audit?.audit?.extracted_data
    ? {
        extracted_data: audit.audit.extracted_data,
        column_mappings: audit.audit.column_mappings,
        field_confidence: audit.audit.field_confidence,
        anomalies: audit.audit.anomalies,
        warnings: audit.audit.warnings,
      }
    : {
        extracted_data: { message: 'Awaiting processing...' },
        column_mappings: [],
        field_confidence: {},
        anomalies: [],
        warnings: [],
      },
  null,
  2
)}
            </pre>
          </div>
        </div>

        <div className="p-6 border-t border-white/10 bg-white/5 flex flex-col md:flex-row gap-3 md:items-center md:justify-end">
          <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest">
            📊 Push to Dashboard
          </button>
          <button className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white/80 text-[10px] font-black uppercase tracking-widest">
            ✏️ Manual Adjust
          </button>
          <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-black uppercase tracking-widest">
            🔄 Reprocess
          </button>
        </div>
      </div>
    </div>
  );
}
