'use client';

import React, { useState, useEffect } from 'react';
import {
    ShoppingCart,
    FileText,
    Truck,
    Users,
    AlertCircle,
    Plus,
    Download,
    Eye,
    Clock,
    Search,
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
    { id: 'requisitions', name: 'Requisitions', icon: FileText },
    { id: 'lpos', name: 'LPOs', icon: ShoppingCart },
    { id: 'grns', name: 'GRNs', icon: Truck },
    { id: 'vendors', name: 'Vendors', icon: Users },
    { id: 'discrepancies', name: 'Mismatches', icon: AlertCircle },
];

const requisitionsData = [
    { id: 'REQ-5553', dept: 'Kitchen', branch: 'Patiobella', status: 'Pending', amount: 543553, date: '2026-02-14' },
    { id: 'REQ-5554', dept: 'Bar', branch: 'Eateroo', status: 'Rejected', amount: 560553, date: '2026-02-21' },
    { id: 'REQ-5555', dept: 'Maintenance', branch: 'Patiobella', status: 'Approved', amount: 577553, date: '2026-02-28' },
    { id: 'REQ-5601', dept: 'Kitchen', branch: 'Eateroo', status: 'Approved', amount: 320000, date: '2026-02-27' },
];

const lposData = [
    { id: 'LPO-5553', vendor: 'Fresh Farms', branch: 'Patiobella', status: 'Partial', amount: 603553, date: '2026-02-14' },
    { id: 'LPO-5560', vendor: 'BlueWave Supp', branch: 'Eateroo', status: 'Issued', amount: 632553, date: '2026-02-25' },
];

const vendorBalancesData = [
    { name: 'Prime Cuts Ltd', branch: 'Patiobella', received: 1123553, paid: 873553, opening: 223553, outstanding: 473553 },
    { name: 'Sunrise Suppl', branch: 'Eateroo', received: 2123553, paid: 1573553, opening: 723553, outstanding: 1273553 },
    { name: 'Fresh Farms', branch: 'Patiobella', received: 2220553, paid: 1644553, opening: 0, outstanding: 576000 },
];

const grnsData = [
    { id: 'GRN-5553', lpoId: 'LPO-5553', vendor: 'KCL Traders', branch: 'Patiobella', value: 513553, date: '2026-02-14' },
    { id: 'GRN-5602', lpoId: 'LPO-5560', vendor: 'BlueWave Supp', branch: 'Eateroo', value: 312000, date: '2026-02-26' },
];

const mismatchesData = [
    { id: 'INV-5553', grnId: 'GRN-5553', lpoId: 'LPO-5553', vendor: 'KCL Traders', branch: 'Patiobella', issue: 'Qty mismatch', amount: 283553 },
];

const branchConfig = [
    { id: 'all', name: 'Group', color: '#d97706' },
    { id: 'patiobella', name: 'Patiobella', color: '#d97706' },
    { id: 'eateroo', name: 'Eateroo', color: '#10b981' },
] as const;

export default function ProcurementModule() {
    const { activeBranch, setActiveBranch } = useGlobal();
    const [activeTab, setActiveTab] = useState('requisitions');
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

    const renderHeader = (title: string, subtitle: string) => (
        <div className="mb-8 pl-4 border-l-4 border-[#d97706]/60 flex justify-between items-end">
            <div>
                <h3 className="text-white font-serif text-2xl font-bold italic">{title}</h3>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em] mt-1">{subtitle}</p>
            </div>
            <div className="flex gap-2">
                <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2">
                    <Filter size={12} className="text-[#d97706]" />
                    <span className="text-[9px] text-white/40 font-black uppercase tracking-widest">
                        {activeBranch === 'all' ? 'Group View' : activeBranch.toUpperCase()}
                    </span>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'requisitions':
                return (
                    <div className="space-y-6">
                        {renderHeader('Requisition Flow', 'Chain of Command Tracking')}
                        <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Req ID</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Department</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Branch</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filterByBranch(requisitionsData).map((req) => (
                                        <tr key={req.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                            <td className="px-8 py-6 text-xs font-mono font-bold text-[#d97706]">{req.id}</td>
                                            <td className="px-8 py-6 text-xs text-white/60 font-bold">{req.dept}</td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={cn("w-1.5 h-1.5 rounded-full", req.branch === 'Patiobella' ? 'bg-[#d97706]' : 'bg-emerald-500')} />
                                                    <span className="text-[10px] font-black uppercase text-white/60 tracking-widest">{req.branch}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                                    req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                        req.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border-rose-500/20' :
                                                            'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                )}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-mono font-bold text-white">UGX {req.amount.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-xs text-white/20 font-mono">{req.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'lpos':
                return (
                    <div className="space-y-10">
                        {renderHeader('LPO Status Overview', 'Issued Procurement Liabilities')}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { label: 'Issued', value: activeBranch === 'all' ? 13 : activeBranch === 'patiobella' ? 7 : 6, color: 'text-blue-500' },
                                { label: 'Partial', value: activeBranch === 'all' ? 5 : activeBranch === 'patiobella' ? 3 : 2, color: 'text-amber-500' },
                                { label: 'Completed', value: activeBranch === 'all' ? 11 : activeBranch === 'patiobella' ? 6 : 5, color: 'text-emerald-500' },
                                { label: 'Cancelled', value: 1, color: 'text-rose-500' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-6 text-center">
                                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                                    <p className={cn("text-2xl font-mono font-black", stat.color)}>{stat.value}</p>
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">LPO ID</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Vendor</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Branch</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Amount</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filterByBranch(lposData).map((lpo) => (
                                        <tr key={lpo.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-6 text-xs font-mono font-bold text-[#d97706]">{lpo.id}</td>
                                            <td className="px-8 py-6 text-xs text-white/60 font-bold">{lpo.vendor}</td>
                                            <td className="px-8 py-6 text-xs text-white/60">{lpo.branch}</td>
                                            <td className="px-8 py-6">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                                    lpo.status === 'Issued' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                        'bg-amber-500/10 text-amber-500 border-amber-500/20'
                                                )}>
                                                    {lpo.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-mono font-bold text-white">UGX {lpo.amount.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-xs text-white/20 font-mono">{lpo.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'vendors':
                return (
                    <div className="space-y-6">
                        {renderHeader('Vendor Balances', 'Aggregated Credit Reporting')}
                        <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Vendor</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Unit</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Received</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Paid</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Opening</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Outstanding</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filterByBranch(vendorBalancesData).map((v) => (
                                        <tr key={`${v.name}-${v.branch}`} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6 text-xs font-bold text-white">{v.name}</td>
                                            <td className="px-8 py-6">
                                                <span className={cn("text-[9px] font-black uppercase tracking-widest", v.branch === 'Patiobella' ? 'text-[#d97706]' : 'text-emerald-500')}>
                                                    {v.branch}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-mono text-white/60 text-right">UGX {v.received.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-xs font-mono text-white/60 text-right">UGX {v.paid.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-xs font-mono text-white/20 text-right">UGX {v.opening.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-xs font-mono font-bold text-[#d97706] text-right">UGX {v.outstanding.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-center">
                                                <button
                                                    onClick={() => triggerAction(`Vendor Audit: ${v.name}`)}
                                                    className="text-white/20 hover:text-white transition-all"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'grns':
                return (
                    <div className="space-y-6">
                        {renderHeader('GRNs Awaiting Finance', 'Receipt Audit Loop')}
                        <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">GRN ID</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">LPO ID</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Vendor</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Branch</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Value</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filterByBranch(grnsData).map((grn) => (
                                        <tr key={grn.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-6 text-xs font-mono font-bold text-[#d97706]">{grn.id}</td>
                                            <td className="px-8 py-6 text-xs font-mono text-white/40">{grn.lpoId}</td>
                                            <td className="px-8 py-6 text-xs text-white/60 font-bold">{grn.vendor}</td>
                                            <td className="px-8 py-6 text-xs text-white/60">{grn.branch}</td>
                                            <td className="px-8 py-6 text-xs font-mono font-bold text-white">UGX {grn.value.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-xs text-white/20 font-mono">{grn.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'discrepancies':
                return (
                    <div className="space-y-6">
                        {renderHeader('Invoices with Mismatches', '3-Way Match Verification Failures')}
                        <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Invoice #</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">GRN ID</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Vendor</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Issue</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filterByBranch(mismatchesData).map((m) => (
                                        <tr key={m.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-8 py-6 text-xs font-mono font-bold text-rose-500">{m.id}</td>
                                            <td className="px-8 py-6 text-xs font-mono text-white/40">{m.grnId}</td>
                                            <td className="px-8 py-6 text-xs text-white/60 font-bold">{m.vendor}</td>
                                            <td className="px-8 py-6">
                                                <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">{m.issue}</span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-mono font-bold text-white text-right">UGX {m.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-10 relative">
            {/* Feedback Alert */}
            {actionFeedback && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-[#d97706] text-[#020617] px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl border border-white/20 animate-in slide-in-from-bottom duration-300">
                    <span className="flex items-center gap-3">
                        <Clock className="w-4 h-4 animate-spin" />
                        {actionFeedback}
                    </span>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h1 className="text-4xl font-serif font-black text-white mb-2 italic">Procurement Control</h1>
                    <p className="text-[#d97706] text-[10px] uppercase tracking-[0.4em] font-black">Strategic Supply Chain Hub</p>
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
                    <button
                        onClick={() => triggerAction('Exporting Global Procurement Ledger')}
                        className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all active:scale-95"
                    >
                        <Download className="w-4 h-4" /> Export Ledger
                    </button>
                    <button
                        onClick={() => triggerAction('Generating New Requisition Interface')}
                        className="flex items-center gap-3 px-6 py-3 bg-[#d97706] rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-[#d97706]/20 hover:scale-105 transition-all active:scale-95"
                    >
                        <Plus className="w-4 h-4" /> New Requisition
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/5 space-x-12 px-2 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex items-center gap-2.5 py-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group whitespace-nowrap",
                            activeTab === tab.id ? "text-[#d97706]" : "text-white/20 hover:text-white/60"
                        )}
                    >
                        <tab.icon size={14} className={cn(activeTab === tab.id ? "text-[#d97706]" : "text-white/10 group-hover:text-white/40")} />
                        {tab.name}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d97706] shadow-[0_0_15px_rgba(217,119,6,0.6)] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                {renderContent()}
            </div>
        </div>
    );
}
