'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
    { name: 'In Stock', value: 85, color: '#10b981' },
    { name: 'Capacity', value: 15, color: '#ffffff10' },
];

export default function StockGauge({ title, value, percentage }: { title: string, value: string, percentage: number }) {
    const chartData = [
        { name: 'Used', value: percentage },
        { name: 'Total', value: 100 - percentage },
    ];

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="relative z-10">
                <h4 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">{title}</h4>
                <p className="text-2xl font-mono font-bold text-white">{value}</p>
            </div>

            <div className="absolute -right-4 -bottom-4 w-32 h-32 opacity-50 group-hover:opacity-100 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={40}
                            startAngle={90}
                            endAngle={450}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell fill={percentage > 80 ? '#ef4444' : '#10b981'} />
                            <Cell fill="rgba(255,255,255,0.05)" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
