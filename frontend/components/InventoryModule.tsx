'use client';

import React, { useState, useEffect } from 'react';
import {
    Package,
    RefreshCcw,
    Trash2,
    Zap,
    Download,
    Cpu,
    ArrowRight,
    AlertTriangle,
    Info,
    History,
    Search,
    Clock,
    Filter
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import LoadingSkeleton from './LoadingSkeleton';
import { useGlobal } from '@/context/GlobalContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const tabs = [
    { id: 'stock', name: 'Current Stock', icon: Package },
    { id: 'snapshots', name: 'Snapshots/Variance', icon: History },
    { id: 'movement', name: 'Movement', icon: RefreshCcw },
    { id: 'wastage', name: 'Wastage', icon: Trash2 },
    { id: 'optimize', name: 'AI Optimize', icon: Zap },
];

const snapshotsData = [
    { branch: 'Patiobella', month: '2026-02', item: 'Beef Fillet', opening: 53, received: 38, issued: 66, system: 25, physical: '--', variance: '--', reason: '--' },
    { branch: 'Patiobella', month: '2026-02', item: 'Tomatoes', opening: 62, received: 53, issued: 87, system: 28, physical: 23, variance: -5, status: 'critical', reason: 'Unrecorded wastage' },
    { branch: 'Eateroo', month: '2026-02', item: 'Chicken', opening: 78, received: 65, issued: 92, system: 51, physical: 50, variance: -1, status: 'warning', reason: 'Portion variance' },
    { branch: 'Eateroo', month: '2026-02', item: 'Cooking Oil', opening: 71, received: 68, issued: 18, system: 121, physical: 121, variance: 0, status: 'stable', reason: 'Count matched system' },
    { branch: 'Eateroo', month: '2026-02', item: 'Burgers', opening: 142, received: 200, issued: 180, system: 162, physical: 158, variance: -4, status: 'critical', reason: 'Excessive wastage' },
];

const branchConfig = [
    { id: 'all', name: 'Group', color: '#d97706' },
    { id: 'patiobella', name: 'Patiobella', color: '#d97706' },
    { id: 'eateroo', name: 'Eateroo', color: '#10b981' },
] as const;

export default function InventoryModule() {
    const { activeBranch, setActiveBranch } = useGlobal();
    const [activeTab, setActiveTab] = useState('snapshots');
    const [isLoading, setIsLoading] = useState(true);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const triggerAction = (label: string) => {
        setActionFeedback(`Initializing ${label}...`);
        setTimeout(() => setActionFeedback(null), 3000);
    };

    if (isLoading) return <LoadingSkeleton />;

    const filterByBranch = (data: any[]) => {
        if (activeBranch === 'all') return data;
        return data.filter(item => item.branch?.toLowerCase() === activeBranch);
    };

    const getVal = (primary: number, pbRatio: number, erRatio: number) => {
        if (activeBranch === 'all') return primary;
        return activeBranch === 'patiobella' ? Math.floor(primary * pbRatio) : Math.ceil(primary * erRatio);
    };

    const renderContent = () => {
        if (activeTab === 'snapshots') {
            return (
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { label: 'Total Inventory Value', value: `UGX ${getVal(6523553, 0.6, 0.4).toLocaleString()}`, icon: Package, color: 'text-white' },
                            { label: 'Low Stock Items', value: getVal(11, 0.6, 0.4).toString(), icon: AlertTriangle, color: 'text-amber-500' },
                            { label: 'Overstocked Items', value: getVal(9, 0.5, 0.5).toString(), icon: Info, color: 'text-blue-400' },
                            { label: 'Recent Adjustments', value: getVal(6, 0.7, 0.3).toString(), icon: RefreshCcw, color: 'text-emerald-500' },
                        ].map((card, i) => (
                            <div key={i} className="bg-white/5 border border-white/5 rounded-[2rem] p-8 shadow-inner group hover:bg-white/10 transition-all">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">{card.label}</span>
                                    <card.icon size={16} className={card.color} />
                                </div>
                                <p className={cn("text-xl font-mono font-black", card.color)}>{card.value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <div>
                                <h3 className="text-white font-serif text-2xl font-bold italic">Month-End Audit Ledger</h3>
                                <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em] mt-1">Variance Monitoring & Reconciliation</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                                    <Filter size={14} className="text-[#d97706]" />
                                    <span className="text-[10px] text-white font-black uppercase tracking-widest leading-none">
                                        {activeBranch === 'all' ? 'Group Consolidation' : activeBranch.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-widest">Branch</th>
                                        <th className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-widest">Item</th>
                                        <th className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-widest text-center">Opening</th>
                                        <th className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-widest text-center">Recv</th>
                                        <th className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-widest text-center">Issue</th>
                                        <th className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-widest text-center">System</th>
                                        <th className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-widest text-center">Physical</th>
                                        <th className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-widest text-center">Var</th>
                                        <th className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-widest">Reason</th>
                                        <th className="px-6 py-5 text-[9px] font-black text-white/20 uppercase tracking-widest text-center">Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filterByBranch(snapshotsData).map((s, i) => (
                                        <tr key={i} className="hover:bg-white/10 transition-colors group">
                                            <td className="px-6 py-6 transition-transform group-hover:translate-x-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", s.branch === 'Patiobella' ? 'bg-[#d97706]' : 'bg-[#10b981]')} />
                                                    <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">{s.branch}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6 text-xs text-white font-bold group-hover:text-[#d97706] transition-colors">{s.item}</td>
                                            <td className="px-6 py-6 text-xs font-mono text-white/40 text-center">{s.opening}</td>
                                            <td className="px-6 py-6 text-xs font-mono text-white/40 text-center">{s.received}</td>
                                            <td className="px-6 py-6 text-xs font-mono text-white/40 text-center">{s.issued}</td>
                                            <td className="px-6 py-6 text-xs font-mono text-white text-center">{s.system}</td>
                                            <td className="px-6 py-6 text-xs font-mono text-white text-center font-black">{s.physical}</td>
                                            <td className="px-6 py-6 text-center">
                                                {s.variance !== '--' && (
                                                    <span className={cn(
                                                        "text-xs font-mono font-black",
                                                        (s.status as string) === 'critical' ? 'text-rose-500' :
                                                            (s.status as string) === 'warning' ? 'text-amber-500' :
                                                                'text-emerald-500'
                                                    )}>
                                                        {Number(s.variance) > 0 ? `+${s.variance}` : s.variance}
                                                    </span>
                                                )}
                                                {s.variance === '--' && <span className="text-white/20">--</span>}
                                            </td>
                                            <td className="px-6 py-6 text-[10px] text-white/40 italic leading-relaxed">{s.reason}</td>
                                            <td className="px-6 py-6 text-center">
                                                <button
                                                    onClick={() => triggerAction(`Deep Audit: ${s.item} (${s.branch})`)}
                                                    className="p-2 border border-white/5 rounded-lg text-white/20 hover:text-[#d97706] hover:bg-white/5 transition-all"
                                                >
                                                    <ArrowRight size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center justify-center h-[500px] text-center bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] animate-in fade-in zoom-in-95 duration-700">
                <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-6 animate-pulse border border-white/5 shadow-inner">
                    <Package className="text-[#d97706] w-10 h-10" />
                </div>
                <h3 className="text-white font-serif text-2xl font-black mb-2 uppercase tracking-tighter italic">Live Warehouse Sync</h3>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.3em] max-w-sm">
                    Accessing holographic stock benchmarks with primary supply servers for {tabs.find(t => t.id === activeTab)?.name}.
                </p>
                <div className="mt-8 flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 rounded-full bg-[#d97706] animate-bounce" />
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10 animate-in fade-in duration-1000 relative">
            {/* Feedback Alert */}
            {actionFeedback && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl border border-white/20 animate-in slide-in-from-bottom duration-300 ring-1 ring-[#d97706]/20">
                    <span className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-[#d97706] animate-spin" />
                        {actionFeedback}
                    </span>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-[#d97706]/10 border border-[#d97706]/20 rounded-lg">
                            <Zap className="text-[#d97706] w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-[#d97706] uppercase tracking-[0.4em] font-black italic">Stock Shield Enabled</span>
                    </div>
                    <h1 className="text-5xl font-serif font-black text-white italic leading-none">Inventory Intelligence</h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-3">Strategic Group Asset Monitoring Engine</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center w-full sm:w-auto">
                    <div className="flex flex-wrap items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2">
                        {branchConfig.map((branch) => (
                            <button
                                key={branch.id}
                                onClick={() => setActiveBranch(branch.id as any)}
                                className={cn(
                                    "px-4 py-2 rounded-xl border transition-all duration-300",
                                    activeBranch === branch.id
                                        ? "text-[#020617] font-black"
                                        : "bg-transparent border-transparent text-white/60 hover:text-white hover:bg-white/5"
                                )}
                                style={activeBranch === branch.id ? { backgroundColor: branch.color, borderColor: branch.color } : {}}
                            >
                                <span className="text-[9px] uppercase font-black tracking-[0.25em]">{branch.name}</span>
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-3 px-6 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-emerald-500 hover:bg-emerald-500/10 transition-all">
                        <Cpu size={14} className="animate-pulse" /> System Balanced
                    </button>
                    <button
                        onClick={() => triggerAction('Exporting Master Inventory Audit File')}
                        className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                        <Download size={14} /> Full Export
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/5 space-x-12 px-4 shadow-2xl overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-3 py-6 text-[10px] font-black uppercase tracking-[0.25em] transition-all relative group whitespace-nowrap",
                            activeTab === tab.id ? "text-[#d97706]" : "text-white/20 hover:text-white/60"
                        )}
                    >
                        <tab.icon size={14} className={cn(activeTab === tab.id ? "text-[#d97706]" : "text-white/10 group-hover:text-white/30")} />
                        {tab.name}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d97706] shadow-[0_0_20px_rgba(217,119,6,0.6)] rounded-t-full transition-all duration-500" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="min-h-[550px]">
                {renderContent()}
            </div>
        </div>
    );
}
