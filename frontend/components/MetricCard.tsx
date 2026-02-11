'use client';

import React from 'react';

interface MetricCardProps {
    title: string;
    value: string;
    trend: number;
    data: any[];
    status?: 'positive' | 'negative' | 'neutral';
    subtitle?: string;
    onClick?: () => void;
}

export default function MetricCard({ title, value, trend, data, status = 'neutral', subtitle, onClick }: MetricCardProps) {
    return (
        <div
            onClick={onClick}
            className="group relative bg-[#1e293b]/20 backdrop-blur-xl border border-white/10 rounded-[2rem] p-7 transition-all duration-500 hover:border-[#d97706]/40 hover:bg-[#1e293b]/30 cursor-pointer flex flex-col h-full shadow-2xl ring-1 ring-white/5 active:scale-[0.98]"
        >
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 mb-1">{title}</h4>
                    {subtitle && <p className="text-[9px] font-bold text-[#d97706] uppercase tracking-widest">{subtitle}</p>}
                </div>
                <div className={`px-2 py-1 rounded-lg text-[10px] font-black flex items-center gap-1 ${status === 'positive' ? 'bg-emerald-500/10 text-emerald-500' :
                    status === 'negative' ? 'bg-rose-500/10 text-rose-500' : 'bg-white/10 text-white/70'
                    }`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </div>
            </div>

            <div className="mb-4">
                <h3 className="text-2xl font-serif font-black text-white tracking-tight">{value}</h3>
            </div>

            <div className="mt-auto pt-6 flex items-center justify-between border-t border-white/5">
                <div className="flex gap-1">
                    {data.slice(-5).map((d, i) => (
                        <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-700 ${status === 'positive' ? 'bg-emerald-500' :
                                status === 'negative' ? 'bg-rose-500' : 'bg-[#d97706]'
                                }`}
                            style={{ height: `${d.value}%`, opacity: 0.2 + (i * 0.15) }}
                        />
                    ))}
                </div>
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 border-r border-b border-[#d97706] rotate-[-45deg]" />
                </div>
            </div>
        </div>
    );
}
