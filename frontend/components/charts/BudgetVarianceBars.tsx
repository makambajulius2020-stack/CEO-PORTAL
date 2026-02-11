'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const data = [
    { name: 'Personnel', budget: 145000000, actual: 142200000, dept: 'HR' },
    { name: 'Procurement', budget: 215000000, actual: 238500000, dept: 'SCM' },
    { name: 'Marketing', budget: 45000000, actual: 42500000, dept: 'Growth' },
    { name: 'Admin/Rent', budget: 85000000, actual: 88500000, dept: 'Ops' },
    { name: 'Logistics', budget: 52000000, actual: 48500000, dept: 'Deliv' },
];

export default function BudgetVarianceBars() {
    return (
        <div className="h-[500px] w-full bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#7c3aed]/5 rounded-full blur-3xl -ml-32 -mt-32" />

            <div className="flex justify-between items-start mb-10 relative z-10">
                <div>
                    <h3 className="text-white font-serif text-2xl font-bold">Budget Variance Ledger</h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Fiscal Allocation vs Applied Spend</p>
                </div>
                <div className="flex gap-2">
                    <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-white/40 hover:text-white transition-colors">
                        <MoreHorizontal size={16} />
                    </button>
                </div>
            </div>

            <div className="h-[340px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis
                            dataKey="name"
                            stroke="#ffffff20"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={10}
                            tick={{ fill: '#ffffff60', fontWeight: 'bold' }}
                        />
                        <YAxis
                            stroke="#ffffff20"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `UGX ${(v / 1000000).toFixed(0)}m`}
                            tick={{ fill: '#ffffff40' }}
                        />
                        <Tooltip
                            cursor={{ fill: '#ffffff05' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const entry = payload[1]?.payload || payload[0]?.payload;
                                    const variance = ((entry.actual - entry.budget) / entry.budget) * 100;
                                    const isOver = entry.actual > entry.budget;
                                    return (
                                        <div className="bg-[#0f172a] border border-white/10 p-5 rounded-2xl shadow-2xl backdrop-blur-xl min-w-[200px]">
                                            <div className="flex justify-between items-center mb-4">
                                                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{entry.name}</p>
                                                <span className="text-[9px] bg-white/5 px-2 py-1 rounded text-white/60 font-mono">{entry.dept}</span>
                                            </div>
                                            <div className="space-y-3">
                                                <div className="flex justify-between">
                                                    <span className="text-[10px] text-white/40">Budget</span>
                                                    <span className="text-xs font-mono font-bold text-white">UGX {entry.budget.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-[10px] text-white/40">Actual</span>
                                                    <span className="text-xs font-mono font-bold text-white">UGX {entry.actual.toLocaleString()}</span>
                                                </div>
                                                <div className="pt-2 mt-2 border-t border-white/5 flex justify-between items-center">
                                                    <span className="text-[10px] text-white/40">Variance</span>
                                                    <div className={cn(
                                                        "text-xs font-black flex items-center gap-1",
                                                        isOver ? 'text-rose-500' : 'text-emerald-500'
                                                    )}>
                                                        {isOver ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                                        {Math.abs(variance).toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Legend
                            verticalAlign="top"
                            align="right"
                            wrapperStyle={{ paddingBottom: '30px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}
                        />
                        <Bar
                            dataKey="budget"
                            name="Allocated Budget"
                            fill="#ffffff10"
                            radius={[6, 6, 0, 0]}
                            barSize={30}
                        />
                        <Bar
                            dataKey="actual"
                            name="Applied Spend"
                            radius={[6, 6, 0, 0]}
                            barSize={30}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.actual > entry.budget ? '#ef4444' : '#10b981'}
                                    fillOpacity={0.8}
                                />
                            ))}
                            <LabelList
                                dataKey="actual"
                                position="top"
                                fontSize={9}
                                offset={10}
                                content={(props: any) => {
                                    const { x, y, width, value, index } = props;
                                    const entry = data[index];
                                    const variance = ((entry.actual - entry.budget) / entry.budget) * 100;
                                    const isOver = entry.actual > entry.budget;
                                    return (
                                        <text
                                            x={x + width / 2}
                                            y={y - 10}
                                            fill={isOver ? '#ef4444' : '#10b981'}
                                            fontSize={9}
                                            fontWeight="black"
                                            textAnchor="middle"
                                        >
                                            {isOver ? '+' : ''}{variance.toFixed(1)}%
                                        </text>
                                    );
                                }}
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-[#d97706]/20 flex items-center justify-center">
                        <TrendingDown className="text-[#d97706] w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest">Efficiency Insight</p>
                        <p className="text-xs text-white underline decoration-[#d97706]/50 underline-offset-4 font-bold">
                            Marketing is <span className="text-emerald-500">5.5% under budget</span>. Reallocate to Logistics?
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Mock icon component
const TrendingDown = ({ size = 20, className = "" }) => (
    <svg
        width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        className={className}
    >
        <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" /><polyline points="17 18 23 18 23 12" />
    </svg>
);
