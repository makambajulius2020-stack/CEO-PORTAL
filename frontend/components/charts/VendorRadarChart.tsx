'use client';

import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    Legend
} from 'recharts';

const data = [
    { subject: 'Price Competitiveness', A: 9.2, B: 7.5, C: 6.8, fullMark: 10 },
    { subject: 'Delivery Reliability', A: 7.8, B: 9.4, C: 8.5, fullMark: 10 },
    { subject: 'Product Quality', A: 8.5, B: 8.2, C: 9.6, fullMark: 10 },
    { subject: 'Payment Terms', A: 6.5, B: 8.8, C: 7.2, fullMark: 10 },
    { subject: 'Service Response', A: 7.4, B: 7.1, C: 8.9, fullMark: 10 },
];

export default function VendorRadarChart() {
    return (
        <div className="h-[500px] w-full bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#d97706]/5 rounded-full blur-3xl -mr-32 -mt-32" />

            <div className="mb-8 relative z-10 text-center md:text-left">
                <h3 className="text-white font-serif text-2xl font-bold">Strategic Vendor Analysis</h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mt-1">Multi-axis operational performance comparison</p>
            </div>

            <div className="h-[340px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#ffffff05" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#ffffff40', fontSize: 9, fontWeight: 'bold' }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 10]}
                            tick={false}
                            axisLine={false}
                        />
                        <Radar
                            name="Atlantic Seafood"
                            dataKey="A"
                            stroke="#d97706"
                            fill="#d97706"
                            fillOpacity={0.2}
                            strokeWidth={3}
                        />
                        <Radar
                            name="Gourmet Meats"
                            dataKey="B"
                            stroke="#8b5cf6"
                            fill="#8b5cf6"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                        <Radar
                            name="VeggieHub Ops"
                            dataKey="C"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.2}
                            strokeWidth={2}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#0f172a',
                                border: '1px solid #ffffff10',
                                borderRadius: '16px',
                                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                                backdropFilter: 'blur(20px)'
                            }}
                            itemStyle={{ fontSize: '11px', fontWeight: 'bold', padding: '2px 0' }}
                        />
                        <Legend
                            wrapperStyle={{ paddingTop: '30px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 'bold' }}
                            iconType="circle"
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 relative z-10">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center transition-all hover:border-[#d97706]/30">
                    <p className="text-[9px] font-black text-[#d97706] uppercase tracking-widest mb-1">Atlantic</p>
                    <p className="text-xl font-mono font-bold text-white">8.2<span className="text-[10px] text-white/20">/10</span></p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center transition-all hover:border-[#8b5cf6]/30">
                    <p className="text-[9px] font-black text-[#8b5cf6] uppercase tracking-widest mb-1">Gourmet</p>
                    <p className="text-xl font-mono font-bold text-white">7.9<span className="text-[10px] text-white/20">/10</span></p>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/5 text-center transition-all hover:border-[#10b981]/30">
                    <p className="text-[9px] font-black text-[#10b981] uppercase tracking-widest mb-1">VeggieHub</p>
                    <p className="text-xl font-mono font-bold text-white">8.6<span className="text-[10px] text-white/20">/10</span></p>
                </div>
            </div>
        </div>
    );
}
