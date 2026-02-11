'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
    Sparkles,
    Send,
    AlertCircle,
    Loader2,
    ChevronDown,
    ChevronUp,
    X,
    MessageSquare,
    Zap,
    ShieldAlert
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Alert {
    id: string;
    type: 'critical' | 'warning' | 'info' | 'positive';
    message: string;
    timestamp: string;
    description?: string;
    rationale?: string;
}

interface AIInsightsPanelProps {
    onClose?: () => void;
}

export default function AIInsightsPanel({ onClose }: AIInsightsPanelProps) {
    const [activeView, setActiveView] = useState<'alerts' | 'chat'>('alerts');
    const [query, setQuery] = useState('');
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
                const url = apiUrl ? `${apiUrl}/api/ai/alerts` : `/api/ai/alerts`;
                const response = await fetch(url);
                const data = await response.json();
                setAlerts(data);
            } catch (err) {
                console.error("Failed to fetch alerts:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
        const interval = setInterval(fetchAlerts, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatHistory]);

    const handleSendQuery = async () => {
        if (!query.trim()) return;
        setSending(true);
        const userMsg = query;
        setQuery('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
            const url = apiUrl ? `${apiUrl}/api/ai/query` : `/api/ai/query`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMsg }),
            });
            const data = await response.json();
            setChatHistory(prev => [...prev, { role: 'ai', content: data.response }]);
        } catch (err) {
            setChatHistory(prev => [...prev, { role: 'ai', content: "Connection to Neural Hub lost. Please retry." }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="h-full bg-[#0f172a]/95 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col ring-1 ring-white/10">
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-[#d97706]/20 to-transparent">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#d97706] rounded-xl flex items-center justify-center shadow-lg shadow-[#d97706]/20">
                        <Sparkles className="text-white w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-white font-serif font-bold text-lg leading-none">Hugamara AI</h2>
                        <p className="text-[9px] text-[#d97706] uppercase tracking-[0.4em] font-black mt-1">Intelligence Hub</p>
                    </div>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-xl transition-colors text-white/40 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* View Scoped Navigation */}
            <div className="flex px-6 pt-6 gap-4">
                <button
                    onClick={() => setActiveView('alerts')}
                    className={cn(
                        "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
                        activeView === 'alerts' ? "bg-[#d97706] border-[#d97706] text-white shadow-lg shadow-[#d97706]/20" : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                    )}
                >
                    <ShieldAlert size={14} />
                    Alerts [{alerts.length}]
                </button>
                <button
                    onClick={() => setActiveView('chat')}
                    className={cn(
                        "flex-1 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all flex items-center justify-center gap-2",
                        activeView === 'chat' ? "bg-[#d97706] border-[#d97706] text-white shadow-lg shadow-[#d97706]/20" : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                    )}
                >
                    <MessageSquare size={14} />
                    Consultant
                </button>
            </div>

            {/* View Content */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {activeView === 'alerts' ? (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex flex-col items-center py-20 opacity-20">
                                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                                <span className="text-[10px] uppercase tracking-[0.3em]">Scanning Operations...</span>
                            </div>
                        ) : alerts.length === 0 ? (
                            <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <Zap className="w-10 h-10 text-white/10 mx-auto mb-4" />
                                <p className="text-xs text-white/40 font-medium">No operational anomalies detected.</p>
                            </div>
                        ) : alerts.map((alert) => (
                            <div key={alert.id} className={cn(
                                "rounded-2xl border transition-all duration-300 group overflow-hidden",
                                alert.type === 'critical' ? "bg-red-500/5 border-red-500/20" :
                                    alert.type === 'warning' ? "bg-amber-500/5 border-amber-500/20" :
                                        "bg-white/5 border-white/10"
                            )}>
                                <div
                                    className="p-5 cursor-pointer"
                                    onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                                >
                                    <div className="flex gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                                            alert.type === 'critical' ? "bg-red-500 text-white" :
                                                alert.type === 'warning' ? "bg-amber-500 text-white" :
                                                    "bg-blue-500 text-white"
                                        )}>
                                            <AlertCircle size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-white font-bold leading-tight mb-2">{alert.message}</p>
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] text-white/40 font-mono">{alert.timestamp}</span>
                                                {expandedAlert === alert.id ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {expandedAlert === alert.id && (
                                    <div className="px-5 pb-5 animate-in slide-in-from-top-2">
                                        <div className="h-px bg-white/5 mb-4" />
                                        <p className="text-xs text-white/60 leading-relaxed italic">{alert.description || alert.rationale}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col h-full space-y-6">
                        {chatHistory.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-40 text-center px-4">
                                <Sparkles className="w-12 h-12 mb-6" />
                                <h4 className="text-sm font-serif font-bold text-white mb-2">Executive Consultant</h4>
                                <p className="text-xs text-white/60 leading-relaxed italic">
                                    "I have indexed all group data. Ask me about margin trends, vendor risks, or inventory optimization."
                                </p>
                            </div>
                        ) : (
                            <div className="flex-1 space-y-6">
                                {chatHistory.map((msg, i) => (
                                    <div key={i} className={cn(
                                        "flex flex-col",
                                        msg.role === 'user' ? "items-end" : "items-start"
                                    )}>
                                        <div className={cn(
                                            "max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed",
                                            msg.role === 'user'
                                                ? "bg-white/10 text-white/80 rounded-tr-none"
                                                : "bg-[#d97706]/10 text-white border border-[#d97706]/20 rounded-tl-none font-medium"
                                        )}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[8px] text-white/20 mt-2 uppercase font-black tracking-widest">{msg.role}</span>
                                    </div>
                                ))}
                                {sending && (
                                    <div className="flex items-center gap-3 text-[#d97706]">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-[10px] font-black uppercase tracking-widest animate-pulse">Analyzing...</span>
                                    </div>
                                )}
                                <div ref={chatEndRef} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Input Area (Chat Only) */}
            {activeView === 'chat' && (
                <div className="p-6 border-t border-white/5 bg-slate-900/50">
                    <div className="relative group">
                        <textarea
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendQuery();
                                }
                            }}
                            placeholder="Consult with AI..."
                            rows={1}
                            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] py-4 pl-6 pr-14 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[#d97706]/50 focus:ring-4 focus:ring-[#d97706]/5 transition-all resize-none shadow-2xl"
                        />
                        <button
                            onClick={handleSendQuery}
                            disabled={sending || !query.trim()}
                            className="absolute right-3 top-3 p-3 bg-[#d97706] text-white rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg shadow-[#d97706]/30"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
