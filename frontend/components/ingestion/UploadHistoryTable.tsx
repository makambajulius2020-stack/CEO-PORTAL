'use client';

import React from 'react';
import { Eye } from 'lucide-react';

export interface UploadHistoryRow {
  id: number;
  date: string;
  fileName: string;
  branch: string;
  type: string;
  status: string;
  auditScore?: number;
  fileId?: string;
}

interface UploadHistoryTableProps {
  rows: UploadHistoryRow[];
  onView: (row: UploadHistoryRow) => void;
}

export default function UploadHistoryTable({ rows, onView }: UploadHistoryTableProps) {
  return (
    <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between">
        <h3 className="text-white font-serif text-2xl font-bold italic">📋 Recent Uploads</h3>
        <div className="text-[9px] text-white/40 font-black uppercase tracking-[0.35em]">Page 1 of 1</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest">Date</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest">File Name</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest">Branch</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest">Type</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest text-center">Status</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest text-center">Audit Score</th>
              <th className="px-8 py-6 text-[10px] font-black text-white/60 uppercase tracking-widest text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r) => (
              <tr key={r.id} className="hover:bg-white/10 transition-colors group">
                <td className="px-8 py-6 text-xs font-mono text-white/60">{r.date}</td>
                <td className="px-8 py-6 text-xs font-bold text-white group-hover:text-[#d97706] transition-colors">{r.fileName}</td>
                <td className="px-8 py-6 text-xs text-white/70 font-bold">{r.branch}</td>
                <td className="px-8 py-6 text-xs text-white/70">{r.type}</td>
                <td className="px-8 py-6 text-center text-[10px] font-black text-white/70 uppercase tracking-widest">{r.status}</td>
                <td className="px-8 py-6 text-center text-xs font-mono font-black text-white/70">
                  {r.auditScore !== undefined ? r.auditScore.toFixed(1) : '--'}
                </td>
                <td className="px-8 py-6 text-center">
                  <button
                    onClick={() => onView(r)}
                    className="p-2 border border-white/10 rounded-xl text-white/60 hover:text-white hover:bg-white/5"
                    title="View Extraction"
                  >
                    <Eye size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
