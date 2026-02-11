'use client';

import React from 'react';
import { Eye } from 'lucide-react';

export type UploadStatus = 'processing' | 'complete' | 'review' | 'failed';

export interface QueueItem {
  id: string;
  filename: string;
  branch: 'patiobella' | 'eateroo';
  fileType: string;
  progress: number;
  status: UploadStatus;
  auditScore?: number;
  fileId?: string;
  excelUploadId?: number;
}

interface UploadQueueProps {
  items: QueueItem[];
  onView: (item: QueueItem) => void;
}

function branchBadge(branch: 'patiobella' | 'eateroo') {
  return branch === 'patiobella'
    ? 'bg-[#d97706]/10 text-[#d97706] border-[#d97706]/20'
    : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
}

function statusLabel(status: UploadStatus) {
  if (status === 'processing') return { t: '⏳ Processing', c: 'text-amber-500' };
  if (status === 'complete') return { t: '✅ Complete', c: 'text-emerald-500' };
  if (status === 'review') return { t: '⚠️ Needs Review', c: 'text-amber-500' };
  return { t: '❌ Failed', c: 'text-rose-500' };
}

function scoreColor(score?: number) {
  if (score === undefined) return 'text-white/40';
  if (score >= 9) return 'text-emerald-500';
  if (score >= 6.5) return 'text-amber-500';
  return 'text-rose-500';
}

export default function UploadQueue({ items, onView }: UploadQueueProps) {
  if (!items.length) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-white font-serif text-2xl font-bold italic">Upload Queue</h3>
      <div className="space-y-3">
        {items.map((item) => {
          const st = statusLabel(item.status);
          return (
            <div
              key={item.id}
              className="bg-[#1e293b]/30 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-2xl"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white font-bold truncate">{item.filename}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className={"px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border " + branchBadge(item.branch)}>
                      {item.branch}
                    </span>
                    <span className="px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border bg-white/5 border-white/10 text-white/70">
                      {item.fileType}
                    </span>
                    <span className={"text-[10px] font-black uppercase tracking-widest " + st.c}>{st.t}</span>
                    {item.auditScore !== undefined ? (
                      <span className={"text-[10px] font-mono font-black " + scoreColor(item.auditScore)}>
                        {item.auditScore.toFixed(1)}/10
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onView(item)}
                    disabled={item.status !== 'complete'}
                    className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white disabled:opacity-40"
                    title="View Extraction"
                  >
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-5 h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-amber-600 to-orange-600 transition-all duration-500"
                  style={{ width: `${Math.max(0, Math.min(100, item.progress))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
