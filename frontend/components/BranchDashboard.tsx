'use client';

import React from 'react';
import MetricCard from './MetricCard';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { Gauge } from 'lucide-react';

const COLORS = ['#d97706', '#8b5cf6', '#3b82f6', '#10b981'];

interface BranchDashboardProps {
    branchName: string;
    type: 'Fine Dining' | 'QSR';
    stats: any;
}

export default function BranchDashboard({ branchName, type, stats }: BranchDashboardProps) {
    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-white mb-2">{branchName} Performance</h1>
                    <p className="text-white/40 text-sm uppercase tracking-[0.3em] font-medium">{type} Module</p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono text-white/30 italic">
                    Last Inventory Audit: 2 hours ago
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <MetricCard
                    title="Revenue (Today)"
                    value={stats.revenue}
                    trend={stats.revenueTrend}
                    status="positive"
                    data={stats.revenueData}
                />
                <MetricCard
                    title="Table Turnover"
                    value={stats.turnover}
                    trend={stats.turnoverTrend}
                    status="neutral"
                    subtitle={stats.turnoverLabel}
                    data={stats.turnoverData}
                />
                <MetricCard
                    title="Avg Check"
                    value={stats.avgCheck}
                    trend={stats.avgCheckTrend}
                    status="positive"
                    data={stats.avgCheckData}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-white font-serif text-xl font-bold mb-6">Department Efficiency</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.deptData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis stroke="#ffffff20" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                                <Bar dataKey="performance" fill="#d97706" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#1e293b]/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-white font-serif text-xl font-bold mb-6">Inventory Distribution</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats.inventoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {stats.inventoryData.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #ffffff10', borderRadius: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {stats.inventoryData.map((item: any, index: number) => (
                            <div key={item.name} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                                <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
