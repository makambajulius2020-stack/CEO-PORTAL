'use client';

import React, { useState, useMemo } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList
} from 'recharts';
import { Settings2, TrendingUp, TrendingDown } from 'lucide-react';

export default function CashFlowWaterfall() {
    const [salesAssumption, setSalesAssumption] = useState(0); // -20 to +20 %
    const [expenseAssumption, setExpenseAssumption] = useState(0); // -20 to +20 %

    const rawData = [
        { name: 'Starting Cash', value: 450000, type: 'base' },
        { name: 'Sales Inflow', value: 850000, type: 'inflow' },
        { name: 'Procurement', value: -320000, type: 'outflow' },
        { name: 'Retail Rent', value: -120000, type: 'outflow' },
        { name: 'Payroll Ops', value: -280000, type: 'outflow' },
    ];

    const data = useMemo(() => {
        let currentTotal = 0;
        const processed = rawData.map(item => {
            const adjustedValue = item.type === 'inflow'
                ? item.value * (1 + salesAssumption / 100)
                : item.type === 'outflow'
                    ? item.value * (1 + expenseAssumption / 100)
                    : item.value;

            const start = currentTotal;
            currentTotal += adjustedValue;
            const end = currentTotal;

            return {
                ...item,
                adjustedValue,
                start,
                end,
                displayRange: [start, end].sort((a, b) => a - b),
                color: item.type === 'base' ? '#3b82f6' : adjustedValue > 0 ? '#10b981' : '#ef4444'
            };
        });

        processed.push({
            name: 'Net Position',
            value: currentTotal,
            adjustedValue: currentTotal,
            start: 0,
            end: currentTotal,
            displayRange: [0, currentTotal],
            color: '#7c3aed',
            type: 'base'
        });

        return processed;
    }, [salesAssumption, expenseAssumption]);

    return (
        <div className="h-[500px] w-full bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d97706]/5 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
                <div>
                    <h3 className="text-white font-serif text-2xl font-bold">Liquidity Waterfall</h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Horizontal Cash Flow Bridge</p>
                </div>

                <div className="flex items-center gap-8 bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Sales Focus</span>
                            <span className={salesAssumption >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                                {salesAssumption > 0 ? '+' : ''}{salesAssumption}%
                            </span>
                        </div>
                        <input
                            type="range" min="-20" max="20" value={salesAssumption}
                            onChange={(e) => setSalesAssumption(Number(e.target.value))}
                            className="w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d97706]"
                        />
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="space-y-2">
                        <div className="flex justify-between items-center gap-4">
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Cost Control</span>
                            <span className={expenseAssumption <= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                                {expenseAssumption > 0 ? '+' : ''}{expenseAssumption}%
                            </span>
                        </div>
                        <input
                            type="range" min="-20" max="20" value={expenseAssumption}
                            onChange={(e) => setExpenseAssumption(Number(e.target.value))}
                            className="w-32 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#7c3aed]"
                        />
                    </div>
                </div>
            </div>

            <div className="h-[320px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ left: 20, right: 60 }}
                        barSize={32}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" horizontal={false} />
                        <XAxis
                            type="number"
                            hide
                            domain={[0, 'dataMax + 100000']}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            stroke="#ffffff20"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            width={100}
                            tick={{ fill: '#ffffff60', fontWeight: 'bold', fontSize: 9 }}
                        />
                        <Tooltip
                            cursor={{ fill: '#ffffff05' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const entry = payload[0].payload;
                                    return (
                                        <div className="bg-[#0f172a] border border-white/10 p-4 rounded-xl shadow-2xl backdrop-blur-xl">
                                            <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-2">{entry.name}</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl font-mono font-bold text-white">
                                                    UGX {Math.abs(entry.adjustedValue).toLocaleString()}
                                                </span>
                                                {entry.type !== 'base' && (
                                                    <div className={entry.adjustedValue > 0 ? 'text-emerald-500' : 'text-rose-500'}>
                                                        {entry.adjustedValue > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-[9px] text-white/20 mt-2">Cumulative: UGX {entry.end.toLocaleString()}</p>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />
                        <Bar
                            dataKey="displayRange"
                            radius={[4, 4, 4, 4]}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                            <LabelList
                                dataKey="adjustedValue"
                                position="right"
                                fontSize={9}
                                offset={10}
                                formatter={(v: number) => `UGX ${(Math.abs(v) / 1000).toFixed(0)}k`}
                                fill="#ffffff40"
                                fontWeight="bold"
                            />
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/20 relative z-10 border-t border-white/5 pt-6">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#3b82f6]" /> Starting</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#10b981]" /> Inflow</div>
                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#ef4444]" /> Outflow</div>
                </div>
                <div className="text-white/40">Net Change: <span className={data[data.length - 1].end > data[0].start ? 'text-emerald-500' : 'text-rose-500'}>
                    UGX {(data[data.length - 1].end - data[0].start).toLocaleString()}
                </span></div>
            </div>
        </div>
    );
}
