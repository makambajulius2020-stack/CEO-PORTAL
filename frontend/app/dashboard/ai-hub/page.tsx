'use client';

import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AIInsightsPanel from '@/components/AIInsightsPanel';
import { Cpu, Zap, ShieldCheck, Activity } from 'lucide-react';

export default function AIHubPage() {
    return (
        <DashboardLayout>
            <div className="max-w-6xl mx-auto space-y-10">
                {/* Executive Intelligence Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-[#d97706]/10 border border-[#d97706]/20 rounded-lg">
                                <Cpu className="text-[#d97706] w-4 h-4 animate-pulse" />
                            </div>
                            <span className="text-[10px] text-[#d97706] uppercase tracking-[0.4em] font-black italic">Advanced Strategic Intelligence</span>
                        </div>
                        <h1 className="text-4xl font-serif font-black text-white mb-2 italic">Neural Hub</h1>
                        <p className="text-white/60 text-sm font-medium uppercase tracking-[0.3em]">Strategic Decision Support System</p>
                    </div>

                    <div className="flex gap-4">
                        <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1">
                            <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">Global Accuracy</span>
                            <span className="text-xl font-mono font-black text-emerald-500">99.98%</span>
                        </div>
                        <div className="px-6 py-4 bg-white/5 border border-white/5 rounded-2xl flex flex-col gap-1">
                            <span className="text-[9px] text-white/40 uppercase font-black tracking-widest">Sync Latency</span>
                            <span className="text-xl font-mono font-black text-[#d97706]">12ms</span>
                        </div>
                    </div>
                </div>

                {/* Tactical Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 bg-[#1e293b]/20 border border-white/10 rounded-[2rem] flex items-center gap-6 group hover:border-emerald-500/40 transition-all">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-1">Risk Perimeter</p>
                            <p className="text-sm font-bold text-white uppercase italic">Audit Protected</p>
                        </div>
                    </div>
                    <div className="p-6 bg-[#1e293b]/20 border border-white/10 rounded-[2rem] flex items-center gap-6 group hover:border-[#d97706]/40 transition-all">
                        <div className="w-12 h-12 bg-[#d97706]/10 rounded-2xl flex items-center justify-center text-[#d97706] group-hover:scale-110 transition-transform">
                            <Activity size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-1">Ops Integrity</p>
                            <p className="text-sm font-bold text-white uppercase italic">Optimal Flow</p>
                        </div>
                    </div>
                    <div className="p-6 bg-[#1e293b]/20 border border-white/10 rounded-[2rem] flex items-center gap-6 group hover:border-blue-500/40 transition-all">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                            <Zap size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] text-white/20 uppercase font-black tracking-widest mb-1">Processing</p>
                            <p className="text-sm font-bold text-white uppercase italic">Active Streams</p>
                        </div>
                    </div>
                </div>

                {/* Main AI Workspace */}
                <div className="h-[750px] shadow-2xl relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#d97706]/20 via-transparent to-blue-500/20 blur opacity-20" />
                    <div className="relative h-full bg-[#020617]/40 rounded-[2.5rem] overflow-hidden border border-white/5">
                        <AIInsightsPanel />
                    </div>
                </div>

                <div className="pt-10 flex flex-col items-center">
                    <p className="text-[9px] text-white/10 uppercase font-black tracking-[0.5em] text-center max-w-lg leading-loose">
                        Hugamara Executive Intelligence is authorized to conduct deep-audit scans across all group business units.
                        Privacy encryption standard: AES-256 Quantum.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
}
