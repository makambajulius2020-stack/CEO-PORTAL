'use client';

import React, { useState, useEffect } from 'react';
import { Upload, FileSpreadsheet, CheckCircle2, AlertTriangle, Loader2, Download, Info } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export default function ExcelUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [branch, setBranch] = useState('patiobella');
    const [dept, setDept] = useState('kitchen');
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (uploading) {
            interval = setInterval(() => {
                setProgress((prev) => (prev < 90 ? prev + 10 : prev));
            }, 400);
        } else {
            setProgress(0);
        }
        return () => clearInterval(interval);
    }, [uploading]);

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('branch', branch);
        formData.append('department', dept);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/excel/upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setProgress(100);
            setTimeout(() => {
                setResult(data);
                setUploading(false);
            }, 500);
        } catch (err) {
            console.error(err);
            setUploading(false);
        }
    };

    return (
        <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-500 hover:border-[#d97706]/30">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#d97706]/10">
                        <FileSpreadsheet className="text-[#d97706] w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-white font-bold text-lg">Excel Intelligence</h3>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest font-mono">AI Data Bridge Active</p>
                    </div>
                </div>
                <button className="p-2 rounded-full hover:bg-white/5 transition-colors group">
                    <Info className="w-4 h-4 text-white/20 group-hover:text-white" />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Target Branch</label>
                    <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d97706] transition-all"
                    >
                        <option value="patiobella">Patiobella</option>
                        <option value="eateroo">Eateroo</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] text-white/40 uppercase font-bold tracking-tighter">Department</label>
                    <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-[#d97706] transition-all"
                    >
                        <option value="kitchen">Kitchen</option>
                        <option value="bar">Bar</option>
                        <option value="procurement">Procurement</option>
                    </select>
                </div>
            </div>

            <div
                className={cn(
                    "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all mb-6 relative overflow-hidden group",
                    file ? "border-[#d97706]/40 bg-[#d97706]/5" : "border-white/5 hover:border-white/20"
                )}
                onClick={() => document.getElementById('fileInput')?.click()}
            >
                <input
                    id="fileInput"
                    type="file"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    accept=".xlsx,.xls"
                />
                <div className="relative z-10 flex flex-col items-center">
                    <Upload className={cn("w-10 h-10 mb-4 transition-all", file ? "text-[#d97706]" : "text-white/20 group-hover:scale-110")} />
                    <p className="text-sm text-white/80 font-medium text-center max-w-[200px]">
                        {file ? file.name : 'Drop business intelligence logs here'}
                    </p>
                    <p className="text-[10px] text-white/20 mt-2 uppercase tracking-[0.2em]">Azure AI Ready (.XLSX)</p>
                </div>
                {uploading && (
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-white/5">
                        <div
                            className="h-full bg-[#d97706] shadow-[0_0_15px_rgba(217,119,6,0.5)] transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <button
                    disabled={!file || uploading}
                    onClick={handleUpload}
                    className="flex-1 py-3 bg-[#d97706] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(217,119,6,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:scale-100"
                >
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin font-bold" /> : <Sparkles className="w-4 h-4" />}
                    {uploading ? 'Parsing Records...' : 'AI Ingestion'}
                </button>
                <button className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all group">
                    <Download className="w-4 h-4 text-white/40 group-hover:text-white" />
                </button>
            </div>

            {result && (
                <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className={cn(
                        "p-5 rounded-2xl border flex items-start gap-4 backdrop-blur-md",
                        result.status === 'success' ? 'bg-emerald-500/5 border-emerald-500/10' : 'bg-amber-500/5 border-amber-500/10'
                    )}>
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            result.status === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-amber-500/20 text-amber-500'
                        )}>
                            {result.status === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <h4 className="text-sm font-bold text-white uppercase tracking-tighter">AI Audit Score: {result.quality_score}/10</h4>
                                <span className="text-[10px] font-mono text-white/20">{result.branch}</span>
                            </div>
                            <p className="text-[11px] text-white/50 leading-relaxed italic mb-3">
                                Identified {result.data?.length} records. Fuzzy logic auto-mapped {Object.keys(result.data?.[0] || {}).length} columns.
                            </p>
                            {result.errors?.length > 0 && (
                                <div className="p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                                    <p className="text-[10px] text-red-400 font-mono">Anomaly: {result.errors[0]}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const Sparkles = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
        <path d="M5 3v4" /><path d="M3 5h4" /><path d="M21 17v4" /><path d="M19 19h4" />
    </svg>
)
