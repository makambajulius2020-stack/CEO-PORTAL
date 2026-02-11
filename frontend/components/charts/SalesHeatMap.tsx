'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const data = [
    { hour: '08:00', revenue: 120000 },
    { hour: '10:00', revenue: 250000 },
    { hour: '12:00', revenue: 850000 },
    { hour: '14:00', revenue: 620000 },
    { hour: '16:00', revenue: 450000 },
    { hour: '18:00', revenue: 950000 },
    { hour: '20:00', revenue: 1250000 },
    { hour: '22:00', revenue: 750000 },
];

export default function HourlyRevenueChart() {
    return (
        <div className="h-[400px] w-full bg-[#1e293b]/20 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
            <div className="mb-6">
                <h3 className="text-white font-serif text-xl font-bold">Revenue by Hour</h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">Peak Customer Activity Mapping</p>
            </div>
            <ResponsiveContainer width="100%" height="75%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                    <XAxis
                        dataKey="hour"
                        stroke="#ffffff20"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        stroke="#ffffff20"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `UGX ${(value / 1000).toFixed(0)}k`}
                    />
                    <Tooltip
                        cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '12px' }}
                        formatter={(value) => [`UGX ${Number(value).toLocaleString()}`, 'Revenue']}
                    />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.revenue > 800000 ? '#d97706' : '#1e293b'}
                                className="transition-all duration-500 hover:fill-[#d97706]"
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
