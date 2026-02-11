'use client';

import React, { useState, useEffect } from 'react';
import {
    WalletCards,
    TrendingUp,
    BarChart3,
    DollarSign,
    Filter,
    Download,
    Eye,
    Receipt,
    History,
    Clock,
    ShieldCheck,
    Cpu
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import CashFlowWaterfall from './charts/CashFlowWaterfall';
import BudgetVarianceBars from './charts/BudgetVarianceBars';
import LoadingSkeleton from './LoadingSkeleton';
import { useGlobal } from '@/context/GlobalContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const tabs = [
    { id: 'overview', name: 'Overview', icon: WalletCards },
    { id: 'aging', name: 'Invoice Aging', icon: Clock },
    { id: 'pettycash', name: 'Petty Cash', icon: Receipt },
    { id: 'payments', name: 'Payments Log', icon: History },
    { id: 'cashflow', name: 'Cash Flow', icon: TrendingUp },
    { id: 'budget', name: 'Budget vs Actual', icon: BarChart3 },
];

const agingData = [
    { id: 'INV-5553', vendor: 'KCL Traders', branch: 'Patiobella', dueDate: '2026-02-01', aging: '27d', amount: 243553, paid: 243553, balance: 0, status: 'PAID 🟢', bucket: '0-30' },
    { id: 'INV-5560', vendor: 'RiverSide', branch: 'Eateroo', dueDate: '2026-02-01', aging: '27d', amount: 274553, paid: 129352, balance: 145201, status: 'OUTSTANDING 🔴', bucket: '0-30' },
    { id: 'INV-5567', vendor: 'Prime Cuts', branch: 'Patiobella', dueDate: '2026-02-01', aging: '27d', amount: 305553, paid: 36767, balance: 268786, status: 'OUTSTANDING 🔴', bucket: '0-30' },
];

const pettyCashData = [
    { branch: 'Patiobella', month: '2026-02', opening: 503553, totalIn: 143553, totalOut: 238553, closing: 408553 },
    { branch: 'Eateroo', month: '2026-02', opening: 584553, totalIn: 176553, totalOut: 289553, closing: 471553 },
];

const paymentsLogData = [
    { date: '2026-02-14', vendor: 'KCL Traders', amount: 363553, method: 'BANK', invoice: 'INV-5553', grn: 'GRN-5553', lpo: 'LPO-5553', branch: 'Patiobella' },
    { date: '2026-02-19', vendor: 'Fresh Farms', amount: 392553, method: 'CASH', invoice: 'INV-5564', grn: 'GRN-5570', lpo: 'LPO-5576', branch: 'Eateroo' },
];

const branchConfig = [
    { id: 'all', name: 'Group', color: '#d97706' },
    { id: 'patiobella', name: 'Patiobella', color: '#d97706' },
    { id: 'eateroo', name: 'Eateroo', color: '#10b981' },
] as const;

export default function FinanceModule() {
    const { activeBranch, setActiveBranch } = useGlobal();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [scenarioRunning, setScenarioRunning] = useState(false);
    const [actionFeedback, setActionFeedback] = useState<string | null>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    const triggerAction = (label: string) => {
        setActionFeedback(`Initializing ${label}...`);
        setTimeout(() => setActionFeedback(null), 3000);
    };

    const handleRunScenario = () => {
        setScenarioRunning(true);
        triggerAction('Recursive AI Scenario Simulation');
        setTimeout(() => {
            setScenarioRunning(false);
            // In a real app, this would show a detailed modal
        }, 3000);
    };

    if (isLoading) return <LoadingSkeleton />;

    const filterByBranch = (data: any[]) => {
        if (activeBranch === 'all') return data;
        return data.filter(item => item.branch?.toLowerCase() === activeBranch);
    };

    const getVal = (val: number, pbRatio: number, erRatio: number) => {
        if (activeBranch === 'all') return val;
        return activeBranch === 'patiobella' ? Math.floor(val * pbRatio) : Math.ceil(val * erRatio);
    };

    const renderHeader = (title: string, subtitle: string) => (
        <div className="mb-8 pl-4 border-l-4 border-emerald-500/60 flex justify-between items-end">
            <div>
                <h3 className="text-white font-serif text-2xl font-bold italic">{title}</h3>
                <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em] mt-1">{subtitle}</p>
            </div>
            <div className="px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
                <Filter size={14} className="text-[#10b981]" />
                <span className="text-[10px] text-white font-black uppercase tracking-widest leading-none">
                    {activeBranch === 'all' ? 'Group Consolidation' : activeBranch.toUpperCase()}
                </span>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'aging':
                return (
                    <div className="space-y-6">
                        {renderHeader('Invoice Aging Buckets', 'Liability Velocity Distribution')}
                        <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Invoice #</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Vendor</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Branch</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Aging</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Amount</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Balance</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filterByBranch(agingData).map((inv) => (
                                        <tr key={inv.id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6 text-xs font-mono font-bold text-white transition-transform group-hover:translate-x-1">{inv.id}</td>
                                            <td className="px-8 py-6 text-xs text-white/60 font-bold">{inv.vendor}</td>
                                            <td className="px-8 py-6">
                                                <span className={cn("text-[9px] font-black uppercase tracking-widest", inv.branch === 'Patiobella' ? 'text-[#d97706]' : 'text-emerald-500')}>
                                                    {inv.branch}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-mono text-center text-white/60">{inv.aging}</td>
                                            <td className="px-8 py-6 text-xs font-mono text-right text-white">UGX {inv.amount.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-xs font-mono font-black text-right text-[#d97706]">UGX {inv.balance.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className={cn(
                                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                                    inv.status.includes('PAID') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                                                )}>
                                                    {inv.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'pettycash':
                return (
                    <div className="space-y-6">
                        {renderHeader('Petty Cash Summary', 'Ledger-derived Branch Liquidity')}
                        <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Business Unit</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Month</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Opening</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Total In</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Total Out</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Closing</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Audit</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filterByBranch(pettyCashData).map((item, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6 text-xs font-black text-white uppercase tracking-widest text-center">
                                                <span className={item.branch === 'Patiobella' ? 'text-[#d97706]' : 'text-emerald-500'}>
                                                    {item.branch}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-xs font-mono text-white/40 text-center">{item.month}</td>
                                            <td className="px-8 py-6 text-xs font-mono text-white/60 text-right">UGX {item.opening.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-xs font-mono text-emerald-500 text-right">UGX {item.totalIn.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-xs font-mono text-rose-500 text-right">UGX {item.totalOut.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-xs font-mono font-black text-white text-right">UGX {item.closing.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-center">
                                                <button
                                                    onClick={() => triggerAction(`Full Petty Cash Ledger for ${item.branch}`)}
                                                    className="text-[10px] font-black uppercase text-white/20 tracking-widest hover:text-[#d97706] transition-all"
                                                >
                                                    View Ledger
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'payments':
                return (
                    <div className="space-y-6">
                        {renderHeader('Payments Log', 'Disbursement Audit Trail')}
                        <div className="bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-white/5 border-b border-white/5">
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Date</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Vendor</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-right">Amount</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Method</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest">Inv # / LPO</th>
                                        <th className="px-8 py-6 text-[10px] font-black text-white/20 uppercase tracking-widest text-center">Branch</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filterByBranch(paymentsLogData).map((log, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6 text-xs font-mono text-white/40">{log.date}</td>
                                            <td className="px-8 py-6 text-xs text-white font-bold group-hover:text-emerald-500 transition-colors">{log.vendor}</td>
                                            <td className="px-8 py-6 text-xs font-mono font-black text-emerald-500 text-right">UGX {log.amount.toLocaleString()}</td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[9px] font-black uppercase text-white/40 tracking-widest">{log.method}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-mono text-white/60">{log.invoice}</span>
                                                    <span className="text-[9px] font-mono text-white/20">{log.lpo}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <span className="text-[11px] bg-white/5 p-2 rounded-xl border border-white/5">
                                                    {log.branch === 'Patiobella' ? '🍽️' : '🥗'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'cashflow': return <CashFlowWaterfall />;
            case 'budget': return <BudgetVarianceBars />;
            default:
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <div className="bg-[#1e293b]/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-[60px] pointer-events-none" />
                            <h3 className="text-white font-serif font-black text-2xl mb-8 flex items-center gap-3 italic">
                                <TrendingUp className="text-emerald-500" /> Executive Insights
                            </h3>
                            <div className="space-y-6">
                                <div
                                    onClick={() => triggerAction('Analyzing Net Profit Performance')}
                                    className="flex justify-between items-center p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl group hover:bg-emerald-500/10 transition-all cursor-pointer active:scale-95"
                                >
                                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">Net Profit Margin</span>
                                    <span className="text-xl font-mono font-black text-emerald-500 bg-emerald-500/10 px-4 py-1 rounded-xl">22.4%</span>
                                </div>
                                <div
                                    onClick={() => triggerAction('Auditing Accounts Payable Velocity')}
                                    className="flex justify-between items-center p-6 bg-[#d97706]/5 border border-[#d97706]/10 rounded-3xl group hover:bg-[#d97706]/10 transition-all cursor-pointer active:scale-95"
                                >
                                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">AP Turnover Ratio</span>
                                    <span className="text-xl font-mono font-black text-[#d97706] bg-[#d97706]/10 px-4 py-1 rounded-xl">12.5</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#1e293b]/30 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
                            <h3 className="text-white font-serif font-black text-2xl mb-8 flex items-center gap-3 italic">
                                <ShieldCheck className="text-[#d97706]" /> Expenditure Focus
                            </h3>
                            <div className="space-y-6">
                                {['Personnel', 'Direct Supply', 'Marketing', 'Facility'].map((exp, i) => (
                                    <div key={i} className="flex flex-col gap-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.2em]">{exp} Allocation</span>
                                            <span className="text-xs font-mono font-bold text-white">UGX {getVal(82500000 / (i + 1), 0.65, 0.35).toLocaleString()}</span>
                                        </div>
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <div
                                                className="h-full bg-gradient-to-r from-[#d97706] to-[#7c3aed] transition-all duration-1000"
                                                style={{ width: `${85 - i * 12}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="space-y-10 relative">
            {/* Feedback Alert */}
            {actionFeedback && (
                <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl border border-white/20 animate-in slide-in-from-bottom duration-300 ring-1 ring-emerald-500/20">
                    <span className="flex items-center gap-3">
                        <Cpu className="w-4 h-4 text-emerald-500 animate-spin" />
                        {actionFeedback}
                    </span>
                </div>
            )}

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                            <ShieldCheck className="text-emerald-500 w-4 h-4" />
                        </div>
                        <span className="text-[10px] text-emerald-500 uppercase tracking-[0.4em] font-black italic">Capital Secure</span>
                    </div>
                    <h1 className="text-5xl font-serif font-black text-white mb-2 leading-none italic">Financial Intelligence</h1>
                    <p className="text-white/40 text-[10px] uppercase tracking-[0.3em] font-bold mt-3">Group Capital Management Gateway</p>
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
                        onClick={() => triggerAction('Generating Master Fiscal Audit Report')}
                        className="flex items-center gap-3 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-all shadow-xl active:scale-95"
                    >
                        <Download size={14} /> Fiscal Reports
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
                            activeTab === tab.id ? "text-emerald-500" : "text-white/20 hover:text-white/60"
                        )}
                    >
                        <tab.icon size={14} className={cn(activeTab === tab.id ? "text-emerald-500" : "text-white/10 group-hover:text-white/40")} />
                        {tab.name}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[500px]">
                {renderContent()}
            </div>

            {/* AI Financial Forecast Card */}
            <div className="bg-[#1e293b]/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 flex items-center gap-12 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#10b981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="text-[#10b981] w-10 h-10" />
                </div>
                <div className="flex-1 relative z-10">
                    <h4 className="text-white font-serif font-black text-2xl mb-2 italic">Executive Cash Forecast</h4>
                    <p className="text-white/40 text-sm leading-relaxed max-w-3xl italic">
                        "If current sales velocity maintains, cash reserves for <span className="text-white font-black">{activeBranch === 'all' ? 'The Group' : activeBranch.toUpperCase()}</span> will exceed <span className="text-emerald-500 font-bold uppercase tracking-widest px-2 bg-emerald-500/5 rounded">UGX {getVal(1200000000, 0.6, 0.4).toLocaleString()}</span> by Q3.
                        Recommend shifting 15% of surplus capital to high-yield inventory pre-stocking."
                    </p>
                </div>
                <button
                    onClick={handleRunScenario}
                    disabled={scenarioRunning}
                    className="relative z-10 px-8 py-3 bg-emerald-500 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#020617] hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-xl shadow-emerald-500/20"
                >
                    {scenarioRunning ? "Simulating..." : "Run Scenario"}
                </button>
            </div>
        </div>
    );
}
