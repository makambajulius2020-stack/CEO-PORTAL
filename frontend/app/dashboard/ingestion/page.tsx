'use client';

import React, { useEffect, useMemo, useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import UploadZone from '@/components/ingestion/UploadZone';
import LinkImport from '@/components/ingestion/LinkImport';
import UploadQueue, { QueueItem } from '@/components/ingestion/UploadQueue';
import UploadHistoryTable, { UploadHistoryRow } from '@/components/ingestion/UploadHistoryTable';
import ExtractionAuditModal from '@/components/ingestion/ExtractionAuditModal';
import { importFromLink, listUploads, uploadExcelFile } from '@/lib/api/ingestion';

type Branch = 'patiobella' | 'eateroo' | '';
type DocType = 'procurement' | 'inventory' | 'sales' | 'finance' | 'petty_cash' | '';

const typeOptions: { id: Exclude<DocType, ''>; label: string }[] = [
  { id: 'procurement', label: '📦 Procurement' },
  { id: 'inventory', label: '📊 Inventory' },
  { id: 'sales', label: '💰 Sales' },
  { id: 'finance', label: '📋 Finance' },
  { id: 'petty_cash', label: '💵 Petty Cash' },
];

export default function IngestionPage() {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [branch, setBranch] = useState<Branch>('');
  const [docType, setDocType] = useState<DocType>('');
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalFilename, setModalFilename] = useState('');
  const [modalFileId, setModalFileId] = useState<string | undefined>(undefined);
  const [modalExcelUploadId, setModalExcelUploadId] = useState<number | undefined>(undefined);

  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const latest = await listUploads({ limit: 50 });
        setHistory(latest);
      } catch {
        // ignore
      }
    })();
  }, []);

  useEffect(() => {
    const t = setInterval(async () => {
      try {
        const latest = await listUploads({ limit: 50 });
        setHistory(latest);
      } catch {
        // ignore
      }
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const historyRows: UploadHistoryRow[] = useMemo(() => {
    return history.map((r: any) => ({
      id: r.id,
      date: String(r.upload_date).slice(0, 10),
      fileName: r.original_filename,
      branch: r.branch === 'patiobella' ? 'Patiobella' : 'Eateroo',
      type: r.file_type,
      status: r.processing_status || 'pending',
      auditScore: r.ai_audit_score ?? undefined,
      fileId: r.mongo_gridfs_id,
    }));
  }, [history]);

  const canUpload = selectedFiles.length > 0 && branch && docType;

  const pushQueueItem = (f: File): QueueItem => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const item: QueueItem = {
      id,
      filename: f.name,
      branch: branch as any,
      fileType: docType,
      progress: 5,
      status: 'processing',
    };
    setQueue((prev) => [item, ...prev]);
    return item;
  };

  const updateQueueItem = (id: string, patch: Partial<QueueItem>) => {
    setQueue((prev) => prev.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const startUpload = async () => {
    setError(null);
    if (!canUpload) {
      setError('Select branch and document type first.');
      return;
    }

    for (const f of selectedFiles) {
      const item = pushQueueItem(f);
      try {
        updateQueueItem(item.id, { progress: 20 });
        const res = await uploadExcelFile(f, branch as any, docType as any);
        updateQueueItem(item.id, {
          progress: 60,
          fileId: res.file_id,
          excelUploadId: res.excel_upload_id,
          status: 'processing',
        });
        updateQueueItem(item.id, { progress: 100 });
        try {
          const latest = await listUploads({ limit: 20 });
          setHistory(latest);
        } catch {
          // ignore
        }
      } catch (e: any) {
        updateQueueItem(item.id, { progress: 100, status: 'failed' });
        setError(e?.message || 'Upload failed');
      }
    }

    setSelectedFiles([]);
    setBranch('');
    setDocType('');
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-5xl font-serif font-black text-white italic leading-none">Data Ingestion</h1>
            <p className="text-white/70 text-[10px] uppercase tracking-[0.35em] font-black mt-3">CEO Upload Pipeline</p>
          </div>
        </div>

        <UploadZone
          error={error}
          onFilesSelected={(files) => {
            setError(null);
            setSelectedFiles(files);
          }}
        />

        {selectedFiles.length > 0 && (
          <div className="bg-[#1e293b]/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-white font-black text-sm">Branch Selection</p>
                <div className="space-y-3">
                  <label className={"flex items-center gap-3 p-4 rounded-2xl border cursor-pointer " + (branch === 'patiobella' ? 'border-amber-500/50 bg-[#d97706]/10' : 'border-white/10 bg-white/5')}>
                    <input
                      type="radio"
                      checked={branch === 'patiobella'}
                      onChange={() => setBranch('patiobella')}
                      className="accent-amber-500"
                    />
                    <span className="text-white font-black">Patiobella</span>
                  </label>
                  <label className={"flex items-center gap-3 p-4 rounded-2xl border cursor-pointer " + (branch === 'eateroo' ? 'border-emerald-500/50 bg-emerald-500/10' : 'border-white/10 bg-white/5')}>
                    <input
                      type="radio"
                      checked={branch === 'eateroo'}
                      onChange={() => setBranch('eateroo')}
                      className="accent-emerald-500"
                    />
                    <span className="text-white font-black">Eateroo</span>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-white font-black text-sm">File Type Selection</p>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as any)}
                  className="w-full bg-gray-900/60 border border-white/10 rounded-2xl px-5 py-4 text-white/90 text-sm focus:outline-none focus:border-[#d97706]"
                >
                  <option value="" disabled>
                    Select document type
                  </option>
                  {typeOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-white/70 text-xs">
                {selectedFiles.length} file(s) selected
              </div>
              <button
                onClick={startUpload}
                className="px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white text-[10px] font-black uppercase tracking-[0.35em]"
              >
                Upload & Process
              </button>
            </div>
          </div>
        )}

        <LinkImport
          onImport={async (url) => {
            if (!branch || !docType) {
              throw new Error('Select branch and document type before importing a link.');
            }
            await importFromLink(url, branch as any, docType as any);
            const latest = await listUploads({ limit: 50 });
            setHistory(latest);
          }}
        />

        <UploadQueue
          items={queue}
          onView={(item) => {
            setModalFilename(item.filename);
            setModalFileId(item.fileId);
            setModalExcelUploadId(item.excelUploadId);
            setModalOpen(true);
          }}
        />

        <UploadHistoryTable
          rows={historyRows}
          onView={(row) => {
            setModalFilename(row.fileName);
            setModalFileId(row.fileId);
            setModalExcelUploadId(row.id);
            setModalOpen(true);
          }}
        />

        <ExtractionAuditModal
          open={modalOpen}
          filename={modalFilename}
          fileId={modalFileId}
          excelUploadId={modalExcelUploadId}
          onClose={() => setModalOpen(false)}
        />
      </div>
    </DashboardLayout>
  );
}
