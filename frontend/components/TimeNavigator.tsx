'use client';

import React, { useState } from 'react';
import { Calendar, ChevronDown, Check, Clock } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const presets = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
    { id: '2q', label: '2Q' },
    { id: '3q', label: '3Q' },
    { id: '4q', label: '4Q' },
    { id: 'year', label: 'Year' },
    { id: 'custom', label: 'Custom' },
];

export default function TimeNavigator() {
    const [selectedPreset, setSelectedPreset] = useState('month');
    const [startDate, setStartDate] = useState('2026-02-01');
    const [endDate, setEndDate] = useState('2026-02-28');
    const [showComparison, setShowComparison] = useState(false);
    const [comparisonPeriod, setComparisonPeriod] = useState('February 2025');

    return (
        <div className="w-full bg-[#1e293b]/20 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 mb-10 shadow-2xl relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#d97706]/5 rounded-full blur-[60px] pointer-events-none" />

            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8 relative z-10">
                {/* Presets */}
                <div className="flex flex-col gap-3">
                    <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <Clock size={12} /> Time Period Command
                    </span>
                    <div className="flex flex-wrap gap-2">
                        {presets.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => setSelectedPreset(preset.id)}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                    selectedPreset === preset.id
                                        ? "bg-[#d97706] border-[#d97706] text-white shadow-lg shadow-[#d97706]/20"
                                        : "bg-white/5 border-white/5 text-white/40 hover:text-white hover:bg-white/10"
                                )}
                            >
                                {preset.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Custom Range & Comparison */}
                <div className="flex flex-wrap items-end gap-6 w-full xl:w-auto">
                    {/* Custom Range */}
                    <div className="flex flex-col gap-3">
                        <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Temporal Range</span>
                        <div className="flex items-center gap-3">
                            <div className="flex bg-white/5 border border-white/5 rounded-xl overflow-hidden focus-within:border-[#d97706]/40 transition-all">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="bg-transparent px-4 py-2 text-xs text-white outline-none"
                                />
                                <div className="w-px h-8 bg-white/5 self-center" />
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="bg-transparent px-4 py-2 text-xs text-white outline-none"
                                />
                            </div>
                            <button className="bg-[#d97706]/10 border border-[#d97706]/20 text-[#d97706] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d97706] hover:text-white transition-all">
                                Apply
                            </button>
                        </div>
                    </div>

                    <div className="h-10 w-px bg-white/5 self-end hidden sm:block" />

                    {/* Comparison */}
                    <div className="flex flex-col gap-3 flex-1 xl:flex-none">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em]">Comparative Analysis</span>
                            <button
                                onClick={() => setShowComparison(!showComparison)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
                                    showComparison ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-white/5 text-white/20 border border-white/5"
                                )}
                            >
                                {showComparison && <Check size={10} />} Show Comparison
                            </button>
                        </div>
                        <div className="relative">
                            <select
                                value={comparisonPeriod}
                                onChange={(e) => setComparisonPeriod(e.target.value)}
                                className="w-full xl:w-64 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white outline-none appearance-none cursor-pointer focus:border-[#d97706]/40 transition-all"
                            >
                                <option>February 2025</option>
                                <option>January 2026</option>
                                <option>Q4 2025</option>
                                <option>Full Year 2025</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-4 top-3 text-white/20 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Historical Snapshot Pulse */}
            <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] text-white/30 font-black uppercase tracking-[0.2em]">Historical Snapshots Indexed & Retrievable</span>
            </div>
        </div>
    );
}
