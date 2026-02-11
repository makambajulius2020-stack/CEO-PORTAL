'use client';

import React, { useState } from 'react';
import { Link2, ClipboardPaste, ChevronDown } from 'lucide-react';

interface LinkImportProps {
  onImport: (url: string) => Promise<void>;
}

export default function LinkImport({ onImport }: LinkImportProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="bg-[#1e293b]/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full p-6 flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <Link2 className="text-[#d97706]" size={18} />
          <span className="text-white font-black text-sm">🔗 Import from Google Drive / SharePoint</span>
        </div>
        <ChevronDown
          size={18}
          className={"text-white/40 transition-transform " + (open ? 'rotate-180' : '')}
        />
      </button>

      {open && (
        <div className="p-6 pt-0 space-y-4">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-3">
            <ClipboardPaste className="text-white/30" size={16} />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Paste shared link here..."
              className="bg-transparent border-none text-sm text-white/90 placeholder:text-white/40 focus:outline-none w-full"
            />
          </div>

          {error ? <p className="text-rose-400 text-xs font-bold">{error}</p> : null}

          <button
            disabled={!url.trim() || loading}
            onClick={async () => {
              setLoading(true);
              setError(null);
              try {
                await onImport(url.trim());
                setUrl('');
              } catch (e: any) {
                setError(e?.message || 'Import failed');
              } finally {
                setLoading(false);
              }
            }}
            className="w-full rounded-2xl px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-black text-[10px] uppercase tracking-[0.35em] disabled:opacity-50"
          >
            {loading ? 'IMPORTING...' : '🚀 IMPORT'}
          </button>
        </div>
      )}
    </div>
  );
}
