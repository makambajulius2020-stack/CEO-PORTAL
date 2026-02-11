'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MetricCard from './MetricCard';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    AlertTriangle as AlertIcon,
    Zap as ZapIcon,
    Building2 as BuildingIcon,
    Search as SearchIcon,
    Filter as FilterIcon,
    ShoppingCart as CartIcon,
    Clock as ClockIcon,
    FileText as FileIcon,
    CheckCircle2 as CheckIcon,
    LayoutDashboard as DashboardIcon,
    ArrowRight as ArrowIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useGlobal } from '@/context/GlobalContext';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const branchConfig = [
    { id: 'all', name: 'Group Consolidated', color: '#d97706', accent: 'gold', font: 'font-serif' },
    { id: 'patiobella', name: 'Patiobella', color: '#d97706', accent: 'gold', font: 'font-serif' },
    { id: 'eateroo', name: 'Eateroo', color: '#10b981', accent: 'emerald', font: 'font-sans' },
] as const;

const salesVsProcurementData = [
    { name: 'Week 1', sales: 180000, procurement: 120000 },
    { name: 'Week 2', sales: 195000, procurement: 140000 },
    { name: 'Week 3', sales: 175000, procurement: 130000 },
    { name: 'Week 4', sales: 220000, procurement: 110000 },
];

const priceAlerts = [
    { item: 'Beef Fillet', vendor: 'Prime Cuts Ltd', branch: 'Patiobella', change: 32.5, severity: 'HIGH', status: 'critical' },
    { item: 'Cooking Oil', vendor: 'Sunrise Suppl', branch: 'Eateroo', change: 58.1, severity: 'CRITICAL', status: 'fire' },
    { item: 'Tomatoes', vendor: 'Fresh Farms', branch: 'Patiobella', change: 18.9, severity: 'MEDIUM', status: 'warning' },
];

const topVendors = [
    { name: 'Prime Cuts Ltd', spend: 603553, outstanding: 133553, variance: 6.8, fulfillment: 92.0 },
    { name: 'Sunrise Suppl', spend: 433553, outstanding: 118553, variance: 11.3, fulfillment: 88.5 },
    { name: 'Fresh Farms', spend: 373553, outstanding: 85553, variance: 4.1, fulfillment: 95.2 },
];

export default function ExecutiveOverview() {
    const { activeBranch, setActiveBranch } = useGlobal();

    const config = branchConfig.find(b => b.id === activeBranch) || branchConfig[0];
    const isEateroo = activeBranch === 'eateroo';

    const getVal = (val: string) => {
        if (activeBranch === 'all') return val;
        const num = parseInt(val.replace(/[^0-9]/g, ''));
        return `UGX ${Math.floor(activeBranch === 'patiobella' ? num * 0.65 : num * 0.35).toLocaleString()}`;
    };

    return (
        <div className={cn("space-y-12 pb-20 animate-in fade-in duration-1000", config.font)}>
            {/* Branch Navigator */}
            <div className="flex flex-wrap items-center gap-6 bg-white/5 p-6 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-3xl">
                {branchConfig.map((branch) => (
                    <button
                        key={branch.id}
                        onClick={() => setActiveBranch(branch.id as any)}
                        className={cn(
                            "flex items-center gap-3 px-6 py-3 rounded-2xl border transition-all duration-500",
                            activeBranch === branch.id
                                ? `text-[#020617] shadow-xl font-black`
                                : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                        )}
                        style={activeBranch === branch.id ? { backgroundColor: branch.color, borderColor: branch.color } : {}}
                    >
                        <BuildingIcon size={16} />
                        <span className="text-[10px] uppercase font-black tracking-[0.2em]">{branch.name}</span>
                    </button>
                ))}
            </div>

            {/* 6-Key Metric Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="TOTAL SALES"
                    value={getVal("UGX 2,823,553")}
                    trend={12.3}
                    status="positive"
                    data={[{ value: 30 }, { value: 45 }, { value: 60 }, { value: 55 }]}
                />
                <MetricCard
                    title="PROCUREMENT"
                    value={getVal("UGX 1,673,553")}
                    trend={-3.2}
                    status="negative"
                    data={[{ value: 50 }, { value: 40 }, { value: 45 }, { value: 30 }]}
                />
                <MetricCard
                    title="PENDING"
                    value={getVal("UGX 503,553")}
                    trend={15}
                    status="neutral"
                    subtitle="15 vendors"
                    data={[{ value: 20 }, { value: 30 }, { value: 25 }, { value: 40 }]}
                />
                <MetricCard
                    title="INVENTORY"
                    value={getVal("UGX 6,923,553")}
                    trend={8.4}
                    status="positive"
                    data={[{ value: 40 }, { value: 50 }, { value: 60 }, { value: 70 }]}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full lg:w-1/2">
                <MetricCard
                    title="GROSS MARGIN"
                    value="34.5%"
                    trend={2.1}
                    status="positive"
                    subtitle="▲ +2.1% pts"
                    data={[{ value: 30 }, { value: 32 }, { value: 33 }, { value: 34.5 }]}
                />
                <MetricCard
                    title="ACTIVE ALERTS"
                    value={activeBranch === 'all' ? "3" : activeBranch === 'patiobella' ? "2" : "1"}
                    trend={0}
                    status="negative"
                    subtitle="⚠️ Real-time anomalies"
                    data={[{ value: 10 }, { value: 20 }, { value: 15 }, { value: 5 }]}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Sales vs Procurement Chart */}
                <div className={cn(
                    "lg:col-span-2 bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden group relative",
                    isEateroo ? "hover:border-[#10b981]/40" : "hover:border-[#d97706]/40"
                )}>
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-white font-serif text-2xl font-bold">Sales vs Procurement Spend</h3>
                            <p className="text-white/60 text-[10px] uppercase font-black tracking-[0.3em] mt-1 italic">Margin Pressure Detection Hub</p>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-[#d97706] rounded-full" />
                                <span className="text-[9px] text-white/60 font-black uppercase tracking-widest">Sales</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-1 border-t-2 border-dashed border-[#10b981]" />
                                <span className="text-[9px] text-white/60 font-black uppercase tracking-widest">Spend</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={salesVsProcurementData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} dy={15} />
                                <YAxis stroke="#ffffff10" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(v) => `UGX ${v / 1000}k`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #ffffff10', borderRadius: '24px', backdropFilter: 'blur(20px)' }}
                                    itemStyle={{ fontSize: '12px', fontWeight: '900' }}
                                />
                                <Line type="monotone" dataKey="sales" stroke="#d97706" strokeWidth={5} dot={{ r: 0 }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                <Line type="monotone" dataKey="procurement" stroke="#10b981" strokeDasharray="8 8" strokeWidth={3} dot={{ r: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Procurement Flow Cards */}
                <div className="grid grid-cols-1 gap-6">
                    <div className={cn(
                        "bg-[#1e293b]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500",
                        isEateroo ? "hover:border-[#10b981]/40" : "hover:border-[#d97706]/40"
                    )}>
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-[11px] font-black text-white/60 uppercase tracking-widest">Requisitions</h4>
                            <ClockIcon size={18} className={isEateroo ? "text-[#10b981]" : "text-[#d97706]"} />
                        </div>
                        <div className="space-y-4">
                            {[
                                { label: 'Pending Audit', value: activeBranch === 'all' ? '10' : '5', mark: '🟡', color: 'text-amber-500' },
                                { label: 'Approved Staged', value: activeBranch === 'all' ? '25' : '12', mark: '🟢', color: 'text-emerald-500' },
                                { label: 'Blocked / Risk', value: activeBranch === 'all' ? '2' : '1', mark: '🔴', color: 'text-rose-500' },
                            ].map((row, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                    <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">{row.label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className={cn("text-lg font-mono font-black", row.color)}>{row.value}</span>
                                        <span className="text-xs">{row.mark}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className={cn(
                        "bg-[#1e293b]/40 backdrop-blur-2xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500",
                        isEateroo ? "hover:border-[#10b981]/40" : "hover:border-[#d97706]/40"
                    )}>
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-[11px] font-black text-white/60 uppercase tracking-widest">LPO Lifecycle</h4>
                            <CartIcon size={18} className={isEateroo ? "text-[#10b981]" : "text-[#d97706]"} />
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            {[
                                { label: 'Issued', value: activeBranch === 'all' ? '13' : '6' },
                                { label: 'Partial', value: activeBranch === 'all' ? '4' : '2' },
                                { label: 'Complete', value: activeBranch === 'all' ? '19' : '10' },
                            ].map((box, i) => (
                                <div key={i} className="bg-white/5 rounded-2xl p-4 border border-white/5">
                                    <p className="text-[9px] text-white/20 font-black uppercase mb-2">{box.label}</p>
                                    <p className="text-lg font-mono font-black text-white">{box.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-rose-500/5 backdrop-blur-2xl border border-rose-500/10 rounded-[2.5rem] p-8 shadow-2xl">
                        <div className="flex items-center justify-between mb-8">
                            <h4 className="text-[11px] font-black text-rose-500/60 uppercase tracking-widest">Audit Redlines</h4>
                            <AlertIcon size={18} className="text-rose-500" />
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">GRNs Awaiting Finance</span>
                                <span className="text-lg font-mono font-black text-rose-500">{activeBranch === 'all' ? '6' : '3'} ⚠️</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                                <span className="text-[10px] text-white/40 font-black uppercase tracking-widest">3-Way Match Failures</span>
                                <span className="text-lg font-mono font-black text-rose-500">{activeBranch === 'all' ? '5' : '2'} 🔴</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Price & Vendor Alerts Table */}
            <div className={cn(
                "bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl",
                isEateroo ? "hover:border-[#10b981]/20" : "hover:border-[#d97706]/20"
            )}>
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <h3 className="text-white font-serif text-3xl font-bold italic">Price & Vendor Alerts</h3>
                        <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.4em] mt-2">Real-time Neural Supply Chain Monitoring</p>
                    </div>
                    <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-white/20 hover:text-white transition-all">
                        <FilterIcon size={20} />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-10 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Inventory Item</th>
                                <th className="px-10 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Primary Vendor</th>
                                <th className="px-10 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Business Unit</th>
                                <th className="px-10 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Price Delta %</th>
                                <th className="px-10 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em] text-center">Threat Level</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {priceAlerts.filter(a => activeBranch === 'all' || a.branch.toLowerCase() === activeBranch).map((alert, i) => (
                                <tr key={i} className="hover:bg-white/10 transition-all group">
                                    <td className="px-10 py-10">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-sm font-black text-white tracking-wide">{alert.item}</span>
                                            <span className="text-[9px] text-white/20 uppercase font-bold">SKU-293-{i}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10 text-sm font-bold text-white/60">{alert.vendor}</td>
                                    <td className="px-10 py-10">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-2 h-2 rounded-full", alert.branch === 'Patiobella' ? 'bg-[#d97706]' : 'bg-[#10b981]')} />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">{alert.branch}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10 font-mono text-lg font-black text-rose-500 tracking-tighter">+{alert.change}%</td>
                                    <td className="px-10 py-10 text-center">
                                        <span className={cn(
                                            "inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.1em] border-2",
                                            alert.status === 'fire' ? "bg-rose-500/10 text-rose-500 border-rose-500/40 animate-pulse" :
                                                alert.status === 'critical' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                    "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                        )}>
                                            {alert.status === 'fire' ? '🔥 ' : ''}{alert.severity}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Vendors Summary Table */}
            <div className={cn(
                "bg-[#1e293b]/20 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-2xl",
                isEateroo ? "hover:border-[#10b981]/20" : "hover:border-[#d97706]/20"
            )}>
                <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/5">
                    <div>
                        <h3 className="text-white font-serif text-3xl font-bold italic">Vendor Liquidity Audit</h3>
                        <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.4em] mt-2">Disbursement & Fulfillment Benchmarks</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/5">
                                <th className="px-10 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Legal Entity</th>
                                <th className="px-10 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Cycle Spending</th>
                                <th className="px-10 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Outstanding Bal</th>
                                <th className="px-10 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">Avg Price Var</th>
                                <th className="px-10 py-8 text-[10px] font-black text-white/20 uppercase tracking-[0.5em] text-center">Fulfillment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {topVendors.map((vendor, i) => (
                                <tr key={i} className="hover:bg-white/10 transition-all group">
                                    <td className="px-10 py-10">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-white/20">
                                                {vendor.name[0]}
                                            </div>
                                            <span className="text-sm font-black text-white">{vendor.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10 font-mono text-sm font-bold text-white">{getVal(`UGX ${vendor.spend.toLocaleString()}`)}</td>
                                    <td className="px-10 py-10 font-mono text-sm font-black text-rose-500">{getVal(`UGX ${vendor.outstanding.toLocaleString()}`)}</td>
                                    <td className="px-10 py-10 font-mono text-sm text-white/40">{vendor.variance}%</td>
                                    <td className="px-10 py-10">
                                        <div className="flex items-center justify-center gap-4">
                                            <div className="flex-1 max-w-[100px] h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                                <div
                                                    className={cn("h-full transition-all duration-1000", vendor.fulfillment > 90 ? 'bg-emerald-500' : 'bg-amber-500')}
                                                    style={{ width: `${vendor.fulfillment}%` }}
                                                />
                                            </div>
                                            <span className={cn("text-xs font-mono font-black", vendor.fulfillment > 90 ? 'text-emerald-500' : 'text-amber-500')}>{vendor.fulfillment}%</span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-10 border-t border-white/5 bg-black/20 flex justify-center">
                    <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/20 hover:text-[#d97706] transition-all">
                        View Complete Vendor Ledger <ArrowIcon size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}
