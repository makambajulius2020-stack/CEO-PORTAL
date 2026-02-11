'use client';

import React, { useRef, useState } from 'react';
import { Upload } from 'lucide-react';

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  error?: string | null;
}

const MAX_BYTES = 50 * 1024 * 1024;

export default function UploadZone({ onFilesSelected, error }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFiles = (files: File[]) => {
    const valid: File[] = [];
    for (const f of files) {
      const name = f.name.toLowerCase();
      const okExt = name.endsWith('.xlsx') || name.endsWith('.xls');
      if (!okExt) continue;
      if (f.size > MAX_BYTES) continue;
      valid.push(f);
    }
    return valid;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const arr = validateFiles(Array.from(files));
    if (arr.length) onFilesSelected(arr);
  };

  return (
    <div className="space-y-3">
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={
          "w-full cursor-pointer rounded-[2.5rem] border border-dashed p-12 text-center transition-all backdrop-blur-xl bg-[rgba(30,41,59,0.5)] " +
          (isDragging
            ? 'border-amber-500/60 shadow-[0_0_40px_rgba(217,119,6,0.15)]'
            : 'border-amber-500/30 hover:border-amber-500/50')
        }
      >
        <div className="flex flex-col items-center gap-4">
          <Upload className="w-12 h-12 text-amber-500" />
          <div>
            <p className="text-white font-black text-sm">Drag & drop Excel files here</p>
            <p className="text-white/60 text-xs font-bold uppercase tracking-[0.25em] mt-2">or click to browse</p>
          </div>
          <p className="text-white/60 text-xs">Supports .xlsx, .xls (Max 50MB per file)</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error ? <p className="text-rose-400 text-xs font-bold">{error}</p> : null}
    </div>
  );
}
