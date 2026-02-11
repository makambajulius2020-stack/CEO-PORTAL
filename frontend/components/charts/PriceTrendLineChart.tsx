'use client';

import React, { useState } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    ReferenceArea,
    ReferenceLine
} from 'recharts';
import { TrendingDown, AlertCircle, Info, Calculator } from 'lucide-react';

const data = [
    { day: 'Feb 01', vendorA: 28500, vendorB: 31000, vendorC: 30000 },
    { day: 'Feb 05', vendorA: 29000, vendorB: 30500, vendorC: 29800 },
    { day: 'Feb 10', vendorA: 28800, vendorB: 30200, vendorC: 29500 },
    { day: 'Feb 12', vendorA: 38500, vendorB: 30800, vendorC: 30200 }, // Spike Zone
    { day: 'Feb 15', vendorA: 37200, vendorB: 31200, vendorC: 30500 }, // Spike Zone
    { day: 'Feb 18', vendorA: 29500, vendorB: 30600, vendorC: 29900 },
    { day: 'Feb 22', vendorA: 28900, vendorB: 31500, vendorC: 30100 },
    { day: 'Feb 25', vendorA: 28700, vendorB: 31200, vendorC: 30400 },
    { day: 'Feb 28', vendorA: 29200, vendorB: 31800, vendorC: 30800 },
];

export default function PriceTrendLineChart() {
    const [selectedVendor, setSelectedVendor] = useState('vendorA');

    const avgPrice = 30500;
    const currentSaving = 2600 * 300; // Mock calculation

    return (
        <div className="h-[550px] w-full bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -ml-32 -mt-32" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 relative z-10">
                <div>
                    <h3 className="text-white font-serif text-2xl font-bold">Price Kinetic Tracker</h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Chicken Breast (Per KG) - Applied Group Pricing</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-2 animate-pulse">
                        <AlertCircle size={14} className="text-rose-500" />
                        <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Spike Detected (Feb 12-15)</span>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff03" vertical={false} />
                        <XAxis
                            dataKey="day"
                            stroke="#ffffff20"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            dy={15}
                        />
                        <YAxis
                            stroke="#ffffff10"
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(v) => `UGX ${(v / 1000).toFixed(0)}k`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: '1px solid #ffffff10',
                                borderRadius: '16px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                backdropFilter: 'blur(20px)'
                            }}
                            itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
                            formatter={(v: any) => [`UGX ${v.toLocaleString()}`, 'Price']}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '40px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'black' }}
                            iconType="circle"
                        />

                        {/* Highlight Spike Zone */}
                        <ReferenceArea x1="Feb 10" x2="Feb 18" fill="#ef4444" fillOpacity={0.03} />

                        {/* Average Price Line */}
                        <ReferenceLine y={avgPrice} stroke="#ffffff10" strokeDasharray="5 5">
                            <LabelList value="AVG GROUP PRICE" position="right" fill="#ffffff20" fontSize={8} fontWeight="bold" />
                        </ReferenceLine>

                        <Line
                            type="monotone"
                            dataKey="vendorA"
                            name="Atlantic Seafood"
                            stroke="#d97706"
                            strokeWidth={4}
                            dot={{ r: 0 }}
                            activeDot={{ r: 6, stroke: '#d97706', strokeWidth: 4, fill: '#0f172a' }}
                            animationDuration={3000}
                        />
                        <Line
                            type="monotone"
                            dataKey="vendorB"
                            name="Gourmet Meats"
                            stroke="#7c3aed"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 0 }}
                            activeDot={{ r: 4 }}
                            animationDuration={2000}
                        />
                        <Line
                            type="monotone"
                            dataKey="vendorC"
                            name="VeggieHub Ops"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={{ r: 0 }}
                            activeDot={{ r: 4 }}
                            animationDuration={2000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 border-t border-white/5 pt-8">
                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center gap-5 group/card hover:border-emerald-500/30 transition-all">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                        <Calculator className="text-emerald-500 w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Switch Optimization</p>
                        <p className="text-sm font-bold text-white">
                            Switching to <span className="text-emerald-500 font-black">VeggieHub</span> for this SKU saves <span className="text-emerald-500 tracking-wider underline underline-offset-4 decoration-emerald-500/20">UGX {currentSaving.toLocaleString()}/mo</span>
                        </p>
                    </div>
                </div>

                <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex items-center justify-between">
                    <div>
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">Current Status</p>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-black text-white uppercase tracking-tight">Inflated Above Average</span>
                            <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        </div>
                    </div>
                    <button className="px-5 py-2 bg-[#d97706] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-[#d97706]/20 hover:scale-105 active:scale-95 transition-all">
                        Hedge Price
                    </button>
                </div>
            </div>
        </div>
    );
}

const LabelList = ({ value, position, fill, fontSize, fontWeight }: any) => (
    <text x="95%" y="50%" fill={fill} fontSize={fontSize} fontWeight={fontWeight} textAnchor="end" className="pointer-events-none uppercase tracking-tighter">
        {value}
    </text>
);
